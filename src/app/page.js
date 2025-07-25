'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              WriteMe
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-600 font-medium mb-8">
              나다운 글, 나답게 쓰다
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              AI가 당신의 개성과 경험을 분석하여<br />
              진정성 있는 이력서와 자기소개서를 만들어드립니다
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/analyzer"
              className="inline-flex items-center px-8 py-4 bg-indigo-500 text-white text-lg font-semibold rounded-xl hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              시작하기
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon="🎯"
            title="개성 분석"
            description="당신만의 톤과 스타일을 파악하여 진정성 있는 글을 만들어요"
          />
          <FeatureCard
            icon="✍️"
            title="맞춤형 작성"
            description="경험과 개성을 바탕으로 차별화된 이력서와 자기소개서를 생성해요"
          />
          <FeatureCard
            icon="🚀"
            title="전문가 피드백"
            description="AI 분석과 함께 전문가 첨삭 서비스로 완성도를 높여요"
          />
        </motion.div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}
