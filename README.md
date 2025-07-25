# WriteMe - AI 이력서 & 자기소개서 생성기

한국 사용자를 위한 AI 기반 이력서 및 자기소개서 생성 웹 애플리케이션입니다.

## 🌟 주요 기능

- **성격 분석**: 5단계 질문을 통한 개성 파악
- **경험 입력**: 구조화된 경험 데이터 관리
- **AI 생성**: 맞춤형 이력서 및 자기소개서 생성
- **실시간 피드백**: AI 기반 문서 개선 제안
- **히스토리 관리**: 생성 이력 및 톤 프리셋 관리

## 🚀 Supabase 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 방문
2. 새 프로젝트 생성
3. 프로젝트 설정에서 URL과 API 키 복사

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 스키마 설정

1. Supabase 대시보드의 SQL Editor 접속
2. `database/schema.sql` 파일 내용 실행
3. 테이블 및 RLS 정책 자동 생성

### 4. Authentication 활성화

1. Supabase 대시보드 > Authentication 설정
2. Email/Password 또는 원하는 인증 방법 활성화

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js 앱 라우터
│   ├── analyzer/       # 성격 분석 페이지
│   ├── experience/     # 경험 입력 페이지
│   ├── results/        # AI 결과 페이지
│   └── settings/       # 설정 & 히스토리
├── components/         # 재사용 컴포넌트
├── lib/               # 유틸리티 & API
│   ├── supabase.js    # Supabase 클라이언트
│   └── database.js    # 데이터베이스 함수들
└── database/          # 데이터베이스 스키마
    └── schema.sql     # 테이블 생성 스크립트
```

## 🗄️ 데이터베이스 구조

- **profiles**: 사용자 프로필
- **personality_analyses**: 성격 분석 결과
- **experiences**: 사용자 경험 데이터
- **generated_documents**: 생성된 문서들
- **tone_presets**: 저장된 톤 프리셋

## 🛠️ 개발 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# http://localhost:3000 접속
```

## 🔒 보안

- Row Level Security (RLS) 적용
- 사용자별 데이터 격리
- Supabase 인증 연동

## 📱 반응형 디자인

- 모바일, 태블릿, 데스크톱 지원
- Tailwind CSS 활용
- Framer Motion 애니메이션

## 🎨 기술 스택

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Animation**: Framer Motion
- **Font**: Noto Sans KR, Inter
- **Auth**: Supabase Auth

---

💡 **개발 팁**: Supabase 환경변수가 설정되지 않으면 더미 데이터로 동작합니다.
