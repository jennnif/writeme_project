'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('history')

  // 더미 히스토리 데이터
  const historyData = [
    {
      id: 1,
      date: '2024-01-15',
      tone: '논리적',
      type: 'complete',
      title: '백엔드 개발자 지원용',
      status: '완료'
    },
    {
      id: 2,
      date: '2024-01-10',
      tone: '열정적',
      type: 'draft',
      title: '스타트업 마케터 지원용',
      status: '임시저장'
    },
    {
      id: 3,
      date: '2024-01-05',
      tone: '감성적',
      type: 'complete',
      title: '교육 분야 지원용',
      status: '완료'
    }
  ]

  const tonePresets = [
    { 
      name: '논리적', 
      description: '체계적이고 분석적인 접근',
      color: 'bg-blue-100 text-blue-700',
      count: 3
    },
    { 
      name: '감성적', 
      description: '따뜻하고 공감적인 스타일',
      color: 'bg-pink-100 text-pink-700',
      count: 2
    },
    { 
      name: '열정적', 
      description: '역동적이고 에너지 넘치는 표현',
      color: 'bg-orange-100 text-orange-700',
      count: 1
    },
    { 
      name: '신중한', 
      description: '차분하고 안정적인 어조',
      color: 'bg-green-100 text-green-700',
      count: 0
    }
  ]

  const regenerateDocument = (id) => {
    console.log('문서 재생성:', id)
    alert('문서를 재생성합니다.')
  }

  const deleteDocument = (id) => {
    console.log('문서 삭제:', id)
    if (confirm('정말 삭제하시겠습니까?')) {
      alert('문서가 삭제되었습니다.')
    }
  }

  const exportData = () => {
    console.log('데이터 내보내기')
    alert('데이터를 내보냅니다.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">설정 및 히스토리</h1>
          <p className="text-lg text-gray-600">이전 문서들을 관리하고 설정을 변경해보세요</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 히스토리
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'presets'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎨 톤 프리셋
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ 설정
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* History Tab */}
            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">생성 히스토리</h3>
                  <button
                    onClick={exportData}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    데이터 내보내기
                  </button>
                </div>

                <div className="space-y-4">
                  {historyData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === '완료' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📅 {item.date}</span>
                            <span>🎨 {item.tone} 톤</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => regenerateDocument(item.id)}
                            className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                          >
                            재생성
                          </button>
                          <button
                            onClick={() => deleteDocument(item.id)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Presets Tab */}
            {activeTab === 'presets' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900">저장된 톤 프리셋</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tonePresets.map((preset, index) => (
                    <motion.div
                      key={preset.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${preset.color}`}>
                          {preset.name}
                        </div>
                        <span className="text-sm text-gray-500">{preset.count}회 사용</span>
                      </div>
                      <p className="text-gray-600 mb-4">{preset.description}</p>
                      <div className="flex gap-2">
                        <Link
                          href="/analyzer"
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                        >
                          이 톤으로 생성
                        </Link>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                          편집
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="text-xl font-semibold text-gray-900">환경설정</h3>
                
                {/* 알림 설정 */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">생성 완료 알림</p>
                        <p className="text-sm text-gray-600">문서 생성이 완료되면 알림을 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">전문가 첨삭 완료 알림</p>
                        <p className="text-sm text-gray-600">전문가 첨삭이 완료되면 알림을 받습니다</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 개인정보 설정 */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">개인정보</h4>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-left">
                      개인정보 다운로드
                    </button>
                    <button className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-left">
                      계정 삭제
                    </button>
                  </div>
                </div>

                {/* 앱 정보 */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">앱 정보</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>버전: 1.0.0</p>
                    <p>최근 업데이트: 2024-01-15</p>
                    <Link href="#" className="text-indigo-600 hover:text-indigo-700">
                      이용약관 및 개인정보처리방침
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8 mb-16"
        >
          <Link
            href="/"
            className="px-8 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
          >
            새로운 문서 생성하기
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 