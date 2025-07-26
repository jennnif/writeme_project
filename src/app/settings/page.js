'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Settings() {
  const { user, getUserProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [userProfile, setUserProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState('')

  // 사용자 프로필 정보 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && getUserProfile) {
        console.log('Settings: 프로필 로딩 시작, user:', user.email)
        try {
          const profile = await getUserProfile()
          console.log('Settings: 프로필 로딩 결과:', profile)
          
          if (profile) {
            setUserProfile(profile)
            setProfileForm({
              name: profile.name || '',
              email: profile.email || user.email || '',
              phone: profile.phone || ''
            })
          } else {
            // 프로필이 없으면 기본 사용자 정보로 fallback
            console.log('Settings: 프로필이 없어서 fallback 사용')
            const fallbackProfile = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              phone: null
            }
            setUserProfile(fallbackProfile)
            setProfileForm({
              name: fallbackProfile.name,
              email: fallbackProfile.email,
              phone: fallbackProfile.phone || ''
            })
          }
        } catch (error) {
          console.error('Settings: 프로필 로딩 오류:', error)
          // 오류 발생시에도 fallback 사용
          const fallbackProfile = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            phone: null
          }
          setUserProfile(fallbackProfile)
          setProfileForm({
            name: fallbackProfile.name,
            email: fallbackProfile.email,
            phone: fallbackProfile.phone || ''
          })
        }
      }
    }
    loadUserProfile()
  }, [user, getUserProfile])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateError('')
    setUpdateSuccess(false)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profileForm.name,
          phone: profileForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
      setUpdateError('프로필 업데이트 중 오류가 발생했습니다.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }))
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">설정</h1>
            <p className="text-lg text-gray-600">프로필 정보와 앱 설정을 관리하세요</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-b border-gray-200 mb-8"
          >
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                프로필 정보
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                생성 이력
              </button>
            </nav>
          </motion.div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">프로필 정보 수정</h3>
                
                {updateSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">프로필이 성공적으로 업데이트되었습니다!</p>
                  </div>
                )}
                
                {updateError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{updateError}</p>
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="이메일 주소"
                    />
                    <p className="text-xs text-gray-500 mt-1">이메일은 로그인 정보로 변경할 수 없습니다.</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="010-1234-5678"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? '업데이트 중...' : '저장하기'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">생성 이력</h3>
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">아직 생성된 문서가 없습니다</p>
                  <p className="text-sm">성격 분석을 시작해서 첫 번째 문서를 생성해보세요!</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 