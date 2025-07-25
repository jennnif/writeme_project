import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 개발 환경에서 Supabase가 설정되지 않은 경우 경고
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.')
} 