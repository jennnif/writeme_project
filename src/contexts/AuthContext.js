'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // 초기 세션 확인
    getInitialSession()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        // 회원가입 완료시 환영 팝업 표시
        if (event === 'SIGNED_UP' && session?.user) {
          setShowWelcome(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('세션 확인 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 회원가입
  const signUp = async (email, password, name) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) throw error

      // 프로필 생성 (트리거로 자동 생성되지만 이름 업데이트)
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ name: name })
          .eq('id', data.user.id)
      }

      return { success: true, data }
    } catch (error) {
      console.error('회원가입 오류:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // 로그인
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('로그인 오류:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // 로그아웃
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // localStorage 데이터도 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('writeme_analysis')
        localStorage.removeItem('writeme_experiences')
        localStorage.removeItem('writeme_latest_document')
      }
      
      return { success: true }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // 사용자 프로필 가져오기
  const getUserProfile = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('프로필 조회 오류:', error)
      return null
    }
  }

  // 사용자 이름 업데이트
  const updateUserName = async (name) => {
    if (!user) return { success: false, error: '로그인이 필요합니다' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('이름 업데이트 오류:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    showWelcome,
    setShowWelcome,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    updateUserName
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 