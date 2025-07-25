'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function Experience() {
  const [experiences, setExperiences] = useState([
    { id: 1, title: '', description: '', category: 'work' }
  ])
  const [selectedTone, setSelectedTone] = useState('논리적')

  // 컴포넌트 마운트시 저장된 데이터 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // 이전 분석 결과에서 톤 가져오기
      const analysisData = localStorage.getItem('writeme_analysis')
      if (analysisData) {
        const analysis = JSON.parse(analysisData)
        setSelectedTone(analysis.toneResult || '논리적')
      }
      
      // 저장된 경험 데이터 불러오기
      const experienceData = localStorage.getItem('writeme_experiences')
      if (experienceData) {
        const savedData = JSON.parse(experienceData)
        if (savedData.experiences && savedData.experiences.length > 0) {
          setExperiences(savedData.experiences.map((exp, index) => ({
            ...exp,
            id: index + 1
          })))
        }
      }
    }
  }, [])

  const tones = [
    { name: '논리적', description: '체계적이고 분석적인 스타일', color: 'bg-blue-100 text-blue-700' },
    { name: '감성적', description: '따뜻하고 공감적인 스타일', color: 'bg-pink-100 text-pink-700' },
    { name: '열정적', description: '역동적이고 에너지 넘치는 스타일', color: 'bg-orange-100 text-orange-700' },
    { name: '신중한', description: '차분하고 안정적인 스타일', color: 'bg-green-100 text-green-700' }
  ]

  const categories = [
    { value: 'work', label: '직무 경험' },
    { value: 'project', label: '프로젝트' },
    { value: 'education', label: '교육/학습' },
    { value: 'volunteer', label: '봉사활동' },
    { value: 'achievement', label: '성과/수상' },
    { value: 'other', label: '기타' }
  ]

  const addExperience = () => {
    const newId = Math.max(...experiences.map(exp => exp.id)) + 1
    setExperiences([...experiences, { 
      id: newId, 
      title: '', 
      description: '', 
      category: 'work' 
    }])
  }

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id))
    }
  }

  const generateContent = async () => {
    // AI 생성 로직 + 데이터 저장
    console.log('경험 데이터:', experiences)
    console.log('선택된 톤:', selectedTone)
    
    try {
      // 브라우저 환경에서만 실행
      if (typeof window !== 'undefined' && window.localStorage) {
        // 경험 데이터 저장
        localStorage.setItem('writeme_experiences', JSON.stringify({
          experiences: experiences.filter(exp => exp.title.trim() || exp.description.trim()),
          selectedTone,
          timestamp: new Date().toISOString()
        }))
        
        // 이전 분석 결과 불러오기
        const analysisData = localStorage.getItem('writeme_analysis')
        const analysis = analysisData ? JSON.parse(analysisData) : null
        
        // 생성된 문서 데이터 저장
        const generatedData = {
          documentId: `doc_${Date.now()}`,
          tone: selectedTone,
          personalityAnalysis: analysis,
          experiences: experiences.filter(exp => exp.title.trim() || exp.description.trim()),
          createdAt: new Date().toISOString(),
          status: 'complete'
        }
        
        localStorage.setItem('writeme_latest_document', JSON.stringify(generatedData))
        
        console.log('데이터 저장 완료')
      }
    } catch (error) {
      console.error('데이터 저장 중 오류:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 사이드바 - 톤 선택 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">선택된 톤</h3>
              
              <div className="space-y-3">
                {tones.map((tone) => (
                  <motion.button
                    key={tone.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTone(tone.name)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTone === tone.name
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${tone.color}`}>
                      {tone.name}
                    </div>
                    <p className="text-sm text-gray-600">{tone.description}</p>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => {/* 톤 재분석 모달 또는 페이지 */}}
                className="w-full mt-6 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                톤 수정하기
              </button>
            </div>
          </div>

          {/* 메인 콘텐츠 - 경험 입력 */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">경험 입력하기</h1>
                <button
                  onClick={addExperience}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                >
                  + 경험 추가하기
                </button>
              </div>

              <div className="space-y-8">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border border-gray-200 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        경험 {index + 1}
                      </h3>
                      {experiences.length > 1 && (
                        <button
                          onClick={() => removeExperience(experience.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          카테고리
                        </label>
                        <select
                          value={experience.category}
                          onChange={(e) => updateExperience(experience.id, 'category', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제목/역할
                        </label>
                        <input
                          type="text"
                          value={experience.title}
                          onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                          placeholder="예: 마케팅 인턴, 웹개발 프로젝트 리더"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        상세 경험 (구체적인 활동, 성과, 배운 점 등)
                      </label>
                      <textarea
                        value={experience.description}
                        onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                        placeholder="어떤 일을 했는지, 어떤 성과를 얻었는지, 무엇을 배웠는지 구체적으로 작성해주세요."
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-between mt-12">
                <Link
                  href="/analyzer"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  이전 단계
                </Link>
                
                <Link
                  href="/results"
                  onClick={generateContent}
                  className="px-8 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                >
                  AI 생성하기
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 