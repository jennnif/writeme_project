'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VoiceRecorder({ onTranscriptChange, onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [volume, setVolume] = useState(0)

  const mediaRecorderRef = useRef(null)
  const recognitionRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)

  useEffect(() => {
    // Speech Recognition 설정
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'ko-KR'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        // 임시 텍스트 업데이트
        setInterimTranscript(interimTranscript)
        
        // 확정된 텍스트 업데이트
        if (finalTranscript) {
          setTranscript(prevTranscript => prevTranscript + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError('음성 인식 중 오류가 발생했습니다. 마이크 권한을 확인해주세요.')
      }

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started')
        setError(null)
      }

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended')
        if (isRecording) {
          // 녹음 중이라면 다시 시작
          try {
            recognitionRef.current.start()
          } catch (error) {
            console.log('Failed to restart recognition:', error)
          }
        }
      }
    } else {
      setError('이 브라우저는 음성 인식을 지원하지 않습니다.')
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      // AudioContext 정리는 stopRecording에서 처리
    }
  }, [onTranscriptChange])

  // transcript 상태가 변경될 때마다 상위 컴포넌트에 전달
  useEffect(() => {
    const fullText = (transcript + interimTranscript).trim()
    if (fullText) {
      onTranscriptChange?.(fullText)
    }
  }, [transcript, interimTranscript, onTranscriptChange])

  // 볼륨 측정
  const setupVolumeMonitoring = (stream) => {
    try {
      // 기존 AudioContext가 있다면 정리
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      
      const updateVolume = () => {
        if (analyserRef.current && isRecording && audioContextRef.current && audioContextRef.current.state === 'running') {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setVolume(average)
          requestAnimationFrame(updateVolume)
        }
      }
      
      updateVolume()
    } catch (error) {
      console.error('볼륨 모니터링 설정 오류:', error)
    }
  }

  const startRecording = async () => {
    try {
      setError(null)
      setIsProcessing(true)

      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })

      // MediaRecorder 설정
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })

      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        onRecordingComplete?.(audioBlob)
        
        // 스트림 정리
        stream.getTracks().forEach(track => track.stop())
      }

      // 볼륨 모니터링 설정
      setupVolumeMonitoring(stream)

      // 녹음 시작
      mediaRecorderRef.current.start(1000) // 1초마다 data 이벤트 발생
      
      // Speech Recognition 시작
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.error('Speech recognition start error:', error)
          setError('음성 인식을 시작할 수 없습니다.')
        }
      }

      setIsRecording(true)
      setIsProcessing(false)
      setRecordingTime(0)
      
      // 녹음 시작시 기존 텍스트 유지하되 interim만 초기화
      setInterimTranscript('')

      // 타이머 시작
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('녹음 시작 오류:', error)
      setError('마이크 접근 권한이 필요합니다.')
      setIsProcessing(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.log('Speech recognition already stopped')
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // AudioContext 안전하게 닫기
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close()
      } catch (error) {
        console.log('AudioContext already closed')
      }
      audioContextRef.current = null
    }

    setIsRecording(false)
    setVolume(0)
    setInterimTranscript('')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const clearTranscript = () => {
    setTranscript('')
    setInterimTranscript('')
    onTranscriptChange?.('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">음성 답변 녹음</h3>
        <p className="text-gray-600 text-sm">
          마이크 버튼을 눌러 답변을 녹음하고, 실시간으로 텍스트로 변환됩니다
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 녹음 컨트롤 */}
      <div className="flex flex-col items-center mb-6">
        {/* 메인 녹음 버튼 */}
        <motion.button
          whileHover={{ scale: isRecording ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-indigo-500 hover:bg-indigo-600'
          } disabled:opacity-50 relative overflow-hidden`}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {/* 볼륨 시각화 */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 bg-white rounded-full"
                  animate={{ 
                    scale: 1 + (volume / 255) * 0.3,
                    opacity: 0.1 + (volume / 255) * 0.2 
                  }}
                  transition={{ duration: 0.1 }}
                />
              )}
              
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                {isRecording ? (
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                ) : (
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17.3 11c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
                )}
              </svg>
            </>
          )}
        </motion.button>

        {/* 녹음 시간 */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center space-x-2"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-mono text-gray-700">
              {formatTime(recordingTime)}
            </span>
          </motion.div>
        )}

        {/* 상태 텍스트 */}
        <p className="mt-3 text-sm text-gray-600">
          {isProcessing ? '준비 중...' : 
           isRecording ? '녹음 중... (다시 클릭하여 중지)' : 
           '클릭하여 녹음 시작'}
        </p>
      </div>

      {/* 테스트용 버튼 - 개발 환경에서만 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 mb-2">개발 테스트용</p>
          <button
            onClick={() => {
              const testText = "안녕하십니까. 저는 테스트 답변을 하고 있습니다."
              setTranscript(testText)
              onTranscriptChange?.(testText)
            }}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            테스트 텍스트 추가
          </button>
        </div>
      )}

      {/* 실시간 텍스트 변환 결과 */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-4"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">실시간 변환 텍스트</h4>
            <button
              onClick={clearTranscript}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              지우기
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              <span>{transcript}</span>
              <span className="text-gray-500 italic">{interimTranscript}</span>
              {!transcript && !interimTranscript && (
                <span className="text-gray-400">음성을 인식하는 중...</span>
              )}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 더 정확한 인식을 위해 명확하게 발음해주세요
          </p>
        </motion.div>
      )}
    </div>
  )
} 