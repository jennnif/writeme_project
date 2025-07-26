'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import VoiceRecorder from '../../components/VoiceRecorder'
import { getRandomQuestion, getAllCategories, interviewQuestions } from '../../lib/interviewData'

export default function InterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [audioBlob, setAudioBlob] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [aiFeedback, setAiFeedback] = useState(null)
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Gemini AI 관련 상태
  const [geminiAnalysis, setGeminiAnalysis] = useState(null)
  const [useGeminiAI, setUseGeminiAI] = useState(true) // Gemini AI 사용 여부

  useEffect(() => {
    // 페이지 로드시 랜덤 질문 표시
    loadRandomQuestion()
  }, [])

  const loadRandomQuestion = () => {
    const question = selectedCategory === 'all' 
      ? getRandomQuestion() 
      : interviewQuestions.filter(q => q.category === selectedCategory)[
          Math.floor(Math.random() * interviewQuestions.filter(q => q.category === selectedCategory).length)
        ]
    
    setCurrentQuestion(question)
    setUserAnswer('')
    setAudioBlob(null)
    setShowAnswer(false)
    setShowFeedback(false)
    setAiFeedback(null)
    setGeminiAnalysis(null) // Gemini 분석 결과도 초기화
  }

  const handleTranscriptChange = (transcript) => {
    console.log('Transcript 변경됨:', transcript)
    setUserAnswer(transcript)
  }

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob)
  }

  // Gemini AI 분석 결과 처리
  const handleGeminiAnalysis = (analysis) => {
    console.log('Gemini 분석 결과 받음:', analysis)
    setGeminiAnalysis(analysis)
    
    // Gemini 결과를 기존 AI 피드백 형태로 변환
    if (analysis && !analysis.error) {
      const convertedFeedback = {
        overall_score: analysis.score || 80,
        strengths: analysis.key_points || [],
        improvements: analysis.suggestions || [],
        specific_feedback: analysis.analysis || '',
        recommended_structure: currentQuestion?.tips || [],
        tone_analysis: analysis.tone || '',
        ai_confidence: analysis.confidence || 0.8
      }
      setAiFeedback(convertedFeedback)
      setShowFeedback(true)
    }
  }

  const generateAIFeedback = async () => {
    if (!userAnswer.trim()) {
      alert('먼저 답변을 녹음해주세요.')
      return
    }

    setIsGeneratingFeedback(true)

    try {
      // 시뮬레이션된 AI 피드백 생성
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 대기

      const feedback = analyzeAnswer(userAnswer, currentQuestion)
      setAiFeedback(feedback)
      setShowFeedback(true)
    } catch (error) {
      console.error('피드백 생성 오류:', error)
      alert('피드백 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  const analyzeAnswer = (answer, question) => {
    const answerLength = answer.trim().length
    const words = answer.trim().split(/\s+/).length
    
    // 간단한 키워드 분석
    const positiveKeywords = ['경험', '성공', '성과', '해결', '협력', '팀워크', '성장', '배움', '개선', '혁신']
    const structureKeywords = ['첫째', '둘째', '셋째', '먼저', '그 다음', '마지막으로', '결과적으로']
    
    const positiveCount = positiveKeywords.filter(keyword => answer.includes(keyword)).length
    const structureCount = structureKeywords.filter(keyword => answer.includes(keyword)).length

    // 피드백 생성
    const feedback = {
      overall_score: Math.min(90, 60 + (positiveCount * 5) + (structureCount * 3) + Math.min(answerLength / 10, 20)),
      strengths: [],
      improvements: [],
      specific_feedback: '',
      recommended_structure: question.tips || []
    }

    // 강점 분석
    if (words >= 50) {
      feedback.strengths.push('충분한 분량으로 답변하셨습니다')
    }
    if (positiveCount >= 3) {
      feedback.strengths.push('구체적인 경험과 성과를 잘 언급하셨습니다')
    }
    if (structureCount >= 2) {
      feedback.strengths.push('논리적인 구조로 답변을 구성하셨습니다')
    }
    if (answer.includes('예를 들어') || answer.includes('구체적으로')) {
      feedback.strengths.push('구체적인 사례로 설명하여 이해하기 쉽습니다')
    }

    // 개선점 분석
    if (words < 30) {
      feedback.improvements.push('답변이 다소 짧습니다. 더 구체적인 설명을 추가해보세요')
    }
    if (positiveCount < 2) {
      feedback.improvements.push('구체적인 경험이나 성과 사례를 더 포함해보세요')
    }
    if (structureCount === 0) {
      feedback.improvements.push('첫째, 둘째와 같은 구조화된 표현을 사용해보세요')
    }
    if (!answer.includes('결과') && !answer.includes('성과')) {
      feedback.improvements.push('결과나 성과에 대한 언급을 추가하면 더 좋습니다')
    }

    // 기본 피드백
    if (feedback.strengths.length === 0) {
      feedback.strengths.push('답변해주셔서 감사합니다')
    }
    if (feedback.improvements.length === 0) {
      feedback.improvements.push('전반적으로 좋은 답변입니다')
    }

    // 구체적인 피드백
    feedback.specific_feedback = `
총 ${words}단어로 구성된 답변입니다. 

${question.category === 'self_introduction' ? 
  '자기소개는 간결하면서도 핵심 역량을 잘 드러내는 것이 중요합니다.' :
  question.category === 'experience' ?
  'STAR 기법(상황-과제-행동-결과)을 활용하면 더욱 체계적인 답변이 됩니다.' :
  '면접관이 원하는 핵심 정보를 논리적으로 전달하는 것이 중요합니다.'
}

${positiveCount >= 2 ? '긍정적인 키워드를 잘 활용하셨습니다.' : ''}
${structureCount >= 1 ? '구조화된 답변으로 이해하기 쉽습니다.' : ''}
    `.trim()

    return feedback
  }

  if (!currentQuestion) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">면접 질문을 준비하고 있습니다...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 면접 시뮬레이션</h1>
            <p className="text-lg text-gray-600">
              실제 면접처럼 연습하고 AI 피드백을 받아보세요
            </p>
          </motion.div>

          {/* 카테고리 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">질문 카테고리</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                {getAllCategories().map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 현재 질문 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.difficulty === 'basic' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty === 'basic' ? '기초' :
                   currentQuestion.difficulty === 'intermediate' ? '중급' : '고급'}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {currentQuestion.categoryLabel}
                </span>
              </div>
              <button
                onClick={loadRandomQuestion}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                다른 질문
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {/* 답변 팁 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-900 mb-2">💡 답변 팁</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {currentQuestion.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>

            {/* AI 설정 */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-purple-900 mb-1">🤖 AI 분석 설정</h3>
                  <p className="text-sm text-purple-700">
                    {useGeminiAI ? 'Gemini 2.5 Flash-Lite AI가 실시간으로 분석합니다' : '기본 AI 분석을 사용합니다'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useGeminiAI}
                    onChange={(e) => setUseGeminiAI(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* 테스트용 수동 입력 - 개발 환경에서만 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-700 mb-2">테스트용 수동 입력</p>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="여기에 답변을 직접 입력하세요..."
                  className="w-full p-2 border rounded text-sm h-20 text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  현재 답변 길이: {userAnswer.length} | 버튼 활성화: {userAnswer.trim().length > 0 ? '예' : '아니오'}
                </p>
              </div>
            )}

            {/* 음성 녹음 */}
            <VoiceRecorder
              onTranscriptChange={handleTranscriptChange}
              onRecordingComplete={handleRecordingComplete}
              onAIAnalysis={useGeminiAI ? handleGeminiAnalysis : undefined}
            />

            {/* 버튼들 */}
            <div className="flex flex-wrap gap-3 mt-6">
              {!useGeminiAI && (
                <button
                  onClick={generateAIFeedback}
                  disabled={!userAnswer || userAnswer.length < 3 || isGeneratingFeedback}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                  title={!userAnswer || userAnswer.length < 3 ? '최소 3글자 이상 입력해주세요' : 'AI 피드백 받기'}
                >
                  {isGeneratingFeedback ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI 분석 중...
                    </>
                  ) : (
                    <>
                      🤖 기본 AI 피드백 받기
                    </>
                  )}
                </button>
              )}

              {useGeminiAI && userAnswer.length > 0 && (
                <div className="flex items-center space-x-3 px-4 py-3 bg-purple-100 rounded-xl">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-purple-700 text-sm font-medium">
                    Gemini AI가 실시간으로 분석 중입니다
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
              >
                {showAnswer ? '모범답안 숨기기' : '📝 모범답안 보기'}
              </button>
            </div>
          </motion.div>

          {/* 모범 답안 */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8 mb-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 모범 답안</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentQuestion.modelAnswer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI 피드백 */}
          <AnimatePresence>
            {showFeedback && aiFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8 mb-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">🤖 AI 피드백</h3>
                
                {/* 점수 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">종합 점수</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {Math.round(aiFeedback.overall_score)}점
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-indigo-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${aiFeedback.overall_score}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* 구체적 피드백 */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">📊 분석 결과</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {aiFeedback.specific_feedback}
                  </p>
                </div>

                {/* Gemini AI 추가 정보 */}
                {geminiAnalysis && !geminiAnalysis.error && (
                  <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3">🤖 Gemini AI 상세 분석</h4>
                    
                    {aiFeedback.tone_analysis && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-purple-700">말투 분석: </span>
                        <span className="text-purple-600 text-sm">{aiFeedback.tone_analysis}</span>
                      </div>
                    )}
                    
                    {aiFeedback.ai_confidence && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-purple-600 mb-1">
                          <span>AI 신뢰도</span>
                          <span>{Math.round(aiFeedback.ai_confidence * 100)}%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-1.5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${aiFeedback.ai_confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 강점 */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">✅ 잘한 점</h4>
                  <div className="space-y-2">
                    {aiFeedback.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <span className="text-green-500 mt-0.5">•</span>
                        <p className="text-green-800 text-sm">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 개선점 */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">💡 개선 제안</h4>
                  <div className="space-y-2">
                    {aiFeedback.improvements.map((improvement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
                      >
                        <span className="text-orange-500 mt-0.5">•</span>
                        <p className="text-orange-800 text-sm">{improvement}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 추천 구조 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">📋 추천 답변 구조</h4>
                  <div className="space-y-2">
                    {aiFeedback.recommended_structure.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-500 font-medium">{index + 1}.</span>
                        <p className="text-blue-800 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 하단 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16"
          >
            <button
              onClick={loadRandomQuestion}
              className="px-8 py-4 bg-indigo-500 text-white text-lg font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg"
            >
              새로운 질문으로 연습하기
            </button>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 