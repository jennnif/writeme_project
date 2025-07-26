-- WriteMe 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 성격 분석 결과 테이블
CREATE TABLE IF NOT EXISTS personality_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- 질문 답변들을 JSON으로 저장
  tone_result TEXT NOT NULL, -- 분석된 톤 (논리적, 감성적, 열정적, 신중한)
  analysis_details JSONB, -- 상세 분석 결과
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 경험 데이터 테이블
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- work, project, education, volunteer, achievement, other
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 생성된 문서 테이블
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  personality_analysis_id UUID REFERENCES personality_analyses(id),
  title TEXT NOT NULL,
  tone TEXT NOT NULL,
  resume_content TEXT,
  cover_letter_content TEXT,
  ai_feedback JSONB,
  status TEXT DEFAULT 'draft', -- draft, complete
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 톤 프리셋 테이블
CREATE TABLE IF NOT EXISTS tone_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============== 트리거 함수 ==============

-- 회원가입 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

-- 새 사용자 생성 시 트리거 실행
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== RLS (Row Level Security) 정책 ==============

-- profiles 테이블 RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- personality_analyses 정책
CREATE POLICY "Users can view own analyses" ON personality_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON personality_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- experiences 정책
CREATE POLICY "Users can view own experiences" ON experiences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiences" ON experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences" ON experiences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences" ON experiences
  FOR DELETE USING (auth.uid() = user_id);

-- generated_documents 정책
CREATE POLICY "Users can view own documents" ON generated_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON generated_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON generated_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON generated_documents
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_personality_analyses_user_id ON personality_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_tone_presets_user_id ON tone_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_created_at ON generated_documents(created_at DESC); 