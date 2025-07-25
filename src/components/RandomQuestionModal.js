'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getRandomQuestion } from '../lib/interviewData'
import { useAuth } from '../contexts/AuthContext'

export default function RandomQuestionModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [question, setQuestion] = useState(null)
  const [hasShownToday, setHasShownToday] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 로그인된 사용자에게만 표시
    if (!user) return

    // 오늘 이미 표시했는지 확인 (localStorage 사용)
    const today = new Date().toDateString()
    const lastShown = localStorage.getItem('writeme_last_question_shown')
    
    if (lastShown !== today) {
      // 3초 후에 모달 표시
      const timer = setTimeout(() => {
        const randomQuestion = getRandomQuestion()
        setQuestion(randomQuestion)
        setIsVisible(true)
        
        // 오늘 날짜 저장
        localStorage.setItem('writeme_last_question_shown', today)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [user])

  const closeModal = () => {
    setIsVisible(false)
  }

  const goToInterview = () => {
    router.push('/interview')
    closeModal()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  if (!question) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3"
                  >
                    <span className="text-2xl">🎤</span>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    오늘의 면접 질문
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-purple-100"
                  >
                    AI와 함께 면접 연습을 해보세요!
                  </motion.p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-purple-200 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-6"
              >
                {/* 질문 카테고리와 난이도 */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {question.categoryLabel}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.difficulty === 'basic' ? 'bg-green-100 text-green-700' :
                    question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {question.difficulty === 'basic' ? '기초' :
                     question.difficulty === 'intermediate' ? '중급' : '고급'}
                  </span>
                </div>

                {/* 질문 */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">
                  {question.question}
                </h3>

                {/* 팁 미리보기 */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">💡 답변 팁</h4>
                  <p className="text-sm text-blue-800">
                    {question.tips[0]}
                  </p>
                  {question.tips.length > 1 && (
                    <p className="text-xs text-blue-600 mt-1">
                      +{question.tips.length - 1}개 팁 더 보기
                    </p>
                  )}
                </div>

                {/* 특징 소개 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-500 text-lg">🎙️</span>
                    <p className="text-sm font-medium text-green-800 mt-1">음성 녹음</p>
                    <p className="text-xs text-green-600">실제 면접처럼</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-500 text-lg">📝</span>
                    <p className="text-sm font-medium text-purple-800 mt-1">실시간 변환</p>
                    <p className="text-xs text-purple-600">음성→텍스트</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-500 text-lg">🤖</span>
                    <p className="text-sm font-medium text-orange-800 mt-1">AI 피드백</p>
                    <p className="text-xs text-orange-600">즉시 분석</p>
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={goToInterview}
                  className="flex-1 py-3 px-6 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🎤</span>
                  지금 바로 연습하기
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  나중에 하기
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-center text-xs text-gray-500 mt-4"
              >
                이 질문은 하루에 한 번만 표시됩니다
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 