'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import ProtectedRoute from '../../components/ProtectedRoute'

const questions = [
  {
    id: 1,
    question: "새로운 프로젝트를 시작할 때 어떤 방식을 선호하시나요?",
    options: [
      { value: "logical", text: "체계적인 계획과 분석을 통해 단계별로 접근" },
      { value: "creative", text: "아이디어와 직감을 바탕으로 자유롭게 시작" },
      { value: "collaborative", text: "팀원들과 충분한 논의 후 결정" },
      { value: "practical", text: "빠른 실행을 통해 결과를 확인하며 조정" }
    ]
  },
  {
    id: 2,
    question: "어려운 문제에 직면했을 때 어떻게 해결하시나요?",
    options: [
      { value: "analytical", text: "데이터와 정보를 수집하여 논리적으로 분석" },
      { value: "intuitive", text: "경험과 직감을 바탕으로 해결책 모색" },
      { value: "consultative", text: "다양한 사람들의 의견을 듣고 종합" },
      { value: "experimental", text: "여러 방법을 시도해보며 최적해 찾기" }
    ]
  },
  {
    id: 3,
    question: "팀 내에서 주로 어떤 역할을 맡으시나요?",
    options: [
      { value: "leader", text: "팀을 이끌고 방향을 제시하는 역할" },
      { value: "supporter", text: "팀원들을 돕고 협력을 이끌어내는 역할" },
      { value: "innovator", text: "새로운 아이디어와 창의적 해결책 제시" },
      { value: "coordinator", text: "업무를 조율하고 효율성을 높이는 역할" }
    ]
  },
  {
    id: 4,
    question: "성취감을 느끼는 순간은 언제인가요?",
    options: [
      { value: "goal_achievement", text: "설정한 목표를 달성했을 때" },
      { value: "recognition", text: "내 노력을 인정받았을 때" },
      { value: "growth", text: "새로운 것을 배우고 성장했을 때" },
      { value: "impact", text: "타인에게 도움이 되었을 때" }
    ]
  },
  {
    id: 5,
    question: "커뮤니케이션 스타일은 어떠신가요?",
    options: [
      { value: "direct", text: "간결하고 명확하게 핵심만 전달" },
      { value: "detailed", text: "구체적이고 상세한 설명을 선호" },
      { value: "empathetic", text: "상대방의 감정을 고려하여 소통" },
      { value: "inspiring", text: "열정적이고 동기부여가 되는 방식" }
    ]
  }
]

export default function Analyzer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsCompleted(true)
      // 여기서 결과 분석 로직 실행
      analyzeTone()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const analyzeTone = async () => {
    // AI 분석 로직 + Supabase 저장
    console.log('분석 결과:', answers)
    
    try {
      // 1. 답변을 바탕으로 톤 결정 (간단한 로직)
      const toneResult = determineToneFromAnswers(answers)
      
      // 2. Supabase에 저장 (개발 환경에서는 더미 userId 사용)
      const userId = 'demo-user-id' // 실제로는 로그인된 사용자 ID 사용
      
      if (typeof window !== 'undefined' && window.localStorage) {
        // 브라우저 환경에서만 실행
        localStorage.setItem('writeме_analysis', JSON.stringify({
          answers,
          toneResult,
          timestamp: new Date().toISOString()
        }))
      }
      
      console.log('분석 완료 - 톤:', toneResult)
    } catch (error) {
      console.error('분석 저장 중 오류:', error)
    }
  }

  const determineToneFromAnswers = (answers) => {
    // 간단한 톤 결정 로직
    const toneScores = {
      logical: 0,
      emotional: 0,
      passionate: 0,
      careful: 0
    }

    Object.values(answers).forEach(answer => {
      if (answer.includes('logical') || answer.includes('analytical')) toneScores.logical++
      if (answer.includes('creative') || answer.includes('intuitive')) toneScores.emotional++
      if (answer.includes('leader') || answer.includes('inspiring')) toneScores.passionate++
      if (answer.includes('supporter') || answer.includes('detailed')) toneScores.careful++
    })

    const maxScore = Math.max(...Object.values(toneScores))
    const resultTone = Object.keys(toneScores).find(key => toneScores[key] === maxScore)
    
    const toneMap = {
      logical: '논리적',
      emotional: '감성적', 
      passionate: '열정적',
      careful: '신중한'
    }

    return toneMap[resultTone] || '논리적'
  }

  const progress = ((currentStep + 1) / questions.length) * 100

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">분석 완료!</h2>
            <p className="text-lg text-gray-600 mb-8">
              당신의 성향을 분석하고 있습니다.<br />
              곧 맞춤형 글쓰기 톤을 제안드릴게요.
            </p>
            <Link
              href="/experience"
              className="inline-flex items-center px-8 py-4 bg-indigo-500 text-white text-lg font-semibold rounded-xl hover:bg-indigo-600 transition-colors"
            >
              다음 단계로
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const currentAnswer = answers[currentQuestion.id]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentStep + 1}단계</span>
            <span>{questions.length}단계 중</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 ${
                    currentAnswer === option.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      currentAnswer === option.value
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-lg text-gray-900">{option.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            이전
          </button>
          
          <button
            onClick={nextStep}
            disabled={!currentAnswer}
            className={`px-8 py-3 rounded-xl font-medium transition-colors ${
              currentAnswer
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === questions.length - 1 ? '분석하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  </ProtectedRoute>
  )
} 