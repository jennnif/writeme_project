# 🚀 Supabase 연동 가이드

WriteMe 앱을 실제 데이터베이스와 연동하여 사용하는 방법입니다.

## 📋 현재 상태

- ✅ **로컬 저장소**: 현재는 브라우저 `localStorage`를 사용해 데이터 저장
- ✅ **Supabase 준비**: 모든 데이터베이스 스키마와 API 함수 구현 완료
- 🔄 **연동 대기**: 환경변수 설정만 하면 즉시 Supabase 사용 가능

## 🛠️ Supabase 설정 단계

### 1단계: Supabase 프로젝트 생성

1. [Supabase 웹사이트](https://supabase.com) 방문
2. **"Start your project"** 클릭
3. GitHub 계정으로 로그인
4. **"New Project"** 클릭
5. 프로젝트 이름: `writeme-app` (또는 원하는 이름)
6. 데이터베이스 비밀번호 설정 (안전하게 보관!)
7. 리전 선택: **Northeast Asia (Seoul)** 추천

### 2단계: 데이터베이스 스키마 생성

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **"New query"** 클릭
3. `database/schema.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. **"Run"** 버튼 클릭
6. 성공 메시지 확인

### 3단계: 환경변수 설정

1. Supabase 프로젝트 **Settings** > **API** 이동
2. 다음 값들 복사:
   - **Project URL**
   - **anon/public key**

3. 프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4단계: Authentication 설정 (선택사항)

실제 사용자 로그인을 원한다면:

1. Supabase 대시보드 **Authentication** 이동
2. **Settings** 탭
3. **Email Auth** 활성화
4. **Site URL** 설정: `http://localhost:3000` (개발용)

## 🔄 데이터 흐름

### 현재 (localStorage)
```
사용자 입력 → localStorage 저장 → 페이지에서 읽기 → 표시
```

### Supabase 연동 후
```
사용자 입력 → Supabase 저장 → 실시간 동기화 → 모든 기기에서 접근
```

## 📊 데이터베이스 구조

생성되는 테이블들:

| 테이블명 | 용도 | 주요 필드 |
|---------|------|-----------|
| `profiles` | 사용자 정보 | id, email, name |
| `personality_analyses` | 성격 분석 결과 | user_id, answers, tone_result |
| `experiences` | 경험 데이터 | user_id, title, description, category |
| `generated_documents` | 생성 문서 | user_id, resume_content, cover_letter_content |
| `tone_presets` | 톤 프리셋 | user_id, name, settings, usage_count |

## 🔒 보안 기능

- **Row Level Security (RLS)**: 사용자는 자신의 데이터만 접근 가능
- **API 키 보호**: anon key는 공개적으로 안전함
- **실시간 인증**: 로그인한 사용자만 데이터 수정 가능

## 🧪 테스트 방법

### 1. 개발 환경 테스트
```bash
npm run dev
```

### 2. 기능별 테스트 순서
1. **성격 분석**: 5단계 질문 완료 → Supabase 저장 확인
2. **경험 입력**: 경험 추가 → 데이터베이스 반영 확인  
3. **문서 생성**: AI 결과 → 실제 입력 데이터 기반 생성 확인
4. **히스토리**: 설정 페이지에서 저장된 문서 목록 확인

### 3. Supabase 대시보드에서 확인
- **Table Editor**에서 실제 저장된 데이터 확인
- **API Logs**에서 요청/응답 모니터링

## 🚨 문제 해결

### 환경변수 오류
```
⚠️ Supabase 환경변수가 설정되지 않았습니다
```
→ `.env.local` 파일 확인 및 서버 재시작

### 데이터베이스 연결 오류
```
Invalid API key
```
→ API 키 재확인 및 프로젝트 URL 점검

### RLS 정책 오류
```
Row level security policy
```
→ `database/schema.sql` 재실행으로 정책 생성 확인

## 🎯 다음 단계

Supabase 연동 완료 후 추가 가능한 기능:

1. **실시간 협업**: 여러 사용자가 동시 편집
2. **파일 업로드**: 프로필 사진, 첨부 문서
3. **이메일 알림**: 문서 생성 완료시 이메일 발송
4. **백업/복원**: 자동 데이터 백업
5. **분석 대시보드**: 사용 통계 및 인사이트

---

💡 **팁**: 개발 중에는 Supabase 대시보드의 Table Editor를 자주 확인하여 데이터가 올바르게 저장되는지 모니터링하세요! 