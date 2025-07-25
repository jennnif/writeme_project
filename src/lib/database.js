import { supabase } from './supabase'

// ============== 성격 분석 관련 ==============

/**
 * 성격 분석 결과 저장
 */
export async function savePersonalityAnalysis(userId, answers, toneResult, analysisDetails = null) {
  try {
    const { data, error } = await supabase
      .from('personality_analyses')
      .insert([
        {
          user_id: userId,
          answers,
          tone_result: toneResult,
          analysis_details: analysisDetails
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('성격 분석 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 사용자의 최신 성격 분석 결과 가져오기
 */
export async function getLatestPersonalityAnalysis(userId) {
  try {
    const { data, error } = await supabase
      .from('personality_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116: no rows returned
    return { success: true, data }
  } catch (error) {
    console.error('성격 분석 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

// ============== 경험 관련 ==============

/**
 * 경험 데이터 저장
 */
export async function saveExperiences(userId, experiences) {
  try {
    // 기존 경험 삭제
    await supabase
      .from('experiences')
      .delete()
      .eq('user_id', userId)

    // 새 경험 데이터 삽입
    const experiencesWithUserId = experiences.map(exp => ({
      ...exp,
      user_id: userId,
      id: undefined // auto-generated
    }))

    const { data, error } = await supabase
      .from('experiences')
      .insert(experiencesWithUserId)
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('경험 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 사용자의 경험 데이터 가져오기
 */
export async function getUserExperiences(userId) {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('경험 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 개별 경험 수정
 */
export async function updateExperience(experienceId, updates) {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', experienceId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('경험 수정 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 경험 삭제
 */
export async function deleteExperience(experienceId) {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', experienceId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('경험 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// ============== 생성된 문서 관련 ==============

/**
 * 생성된 문서 저장
 */
export async function saveGeneratedDocument(userId, documentData) {
  try {
    const { data, error } = await supabase
      .from('generated_documents')
      .insert([
        {
          user_id: userId,
          ...documentData
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('문서 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 사용자의 문서 히스토리 가져오기
 */
export async function getUserDocuments(userId) {
  try {
    const { data, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('문서 히스토리 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 특정 문서 가져오기
 */
export async function getDocument(documentId) {
  try {
    const { data, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('문서 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 문서 삭제
 */
export async function deleteDocument(documentId) {
  try {
    const { error } = await supabase
      .from('generated_documents')
      .delete()
      .eq('id', documentId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('문서 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// ============== 톤 프리셋 관련 ==============

/**
 * 톤 프리셋 저장
 */
export async function saveTonePreset(userId, presetData) {
  try {
    const { data, error } = await supabase
      .from('tone_presets')
      .insert([
        {
          user_id: userId,
          ...presetData
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('톤 프리셋 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 사용자의 톤 프리셋 가져오기
 */
export async function getUserTonePresets(userId) {
  try {
    const { data, error } = await supabase
      .from('tone_presets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('톤 프리셋 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 톤 프리셋 사용 횟수 증가
 */
export async function incrementTonePresetUsage(presetId) {
  try {
    const { data, error } = await supabase
      .from('tone_presets')
      .update({ usage_count: supabase.raw('usage_count + 1') })
      .eq('id', presetId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('톤 프리셋 사용 횟수 업데이트 오류:', error)
    return { success: false, error: error.message }
  }
}

// ============== 유틸리티 함수 ==============

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, user }
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 사용자 프로필 가져오기
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('프로필 조회 오류:', error)
    return { success: false, error: error.message }
  }
} 