'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function WelcomeModal() {
  const { user, showWelcome, setShowWelcome, getUserProfile } = useAuth()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (showWelcome && user) {
      loadUserName()
    }
  }, [showWelcome, user])

  const loadUserName = async () => {
    try {
      const profile = await getUserProfile()
      setUserName(profile?.name || user?.user_metadata?.name || '사용자')
    } catch (error) {
      console.error('사용자 이름 로드 오류:', error)
      setUserName('사용자')
    }
  }

  const closeModal = () => {
    setShowWelcome(false)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <AnimatePresence>
      {showWelcome && (
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
            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-3xl">🎉</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  환영합니다!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-indigo-100"
                >
                  {userName}님, WriteMe에 가입해주셔서 감사합니다
                </motion.p>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center mb-6"
              >
                <p className="text-gray-600 mb-4">
                  이제 AI가 도와주는 맞춤형 이력서와 자기소개서를 만들어보세요!
                </p>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                    <span className="text-indigo-500">✨</span>
                    <span className="text-gray-700">성격 분석으로 나만의 톤 찾기</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-500">📝</span>
                    <span className="text-gray-700">경험 기반 맞춤형 문서 생성</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-500">🚀</span>
                    <span className="text-gray-700">AI 피드백으로 완성도 향상</span>
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col space-y-3"
              >
                <button
                  onClick={closeModal}
                  className="w-full py-3 px-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105"
                >
                  시작하기
                </button>
                <button
                  onClick={closeModal}
                  className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  나중에 하기
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 