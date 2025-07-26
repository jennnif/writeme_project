import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Gemini 2.5 Flash-Lite 모델 사용
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

/**
 * 음성 인식된 텍스트를 Gemini AI로 분석
 * @param {string} transcript - 음성 인식된 텍스트
 * @param {string} context - 분석 컨텍스트 (면접, 일반 대화 등)
 * @returns {Promise<Object>} 분석 결과
 */
export async function analyzeTranscriptWithGemini(transcript, context = '면접') {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API 키가 설정되지 않았습니다.')
    return null
  }

  if (!transcript || transcript.trim().length === 0) {
    return null
  }

  try {
    const prompt = generatePrompt(transcript, context)
    
    console.log('Gemini 분석 시작:', transcript.substring(0, 50) + '...')
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = response.text()
    
    console.log('Gemini 분석 완료')
    
    // JSON 형태로 파싱 시도
    try {
      return JSON.parse(analysis)
    } catch (parseError) {
      // JSON 파싱 실패시 텍스트 그대로 반환
      return {
        analysis: analysis,
        confidence: 0.8,
        suggestions: ['AI 분석 결과를 확인해보세요.']
      }
    }
  } catch (error) {
    console.error('Gemini API 오류:', error)
    return {
      error: true,
      message: 'AI 분석 중 오류가 발생했습니다.',
      suggestions: ['네트워크 연결을 확인하고 다시 시도해보세요.']
    }
  }
}

/**
 * 컨텍스트에 맞는 프롬프트 생성
 * @param {string} transcript - 분석할 텍스트
 * @param {string} context - 분석 컨텍스트
 * @returns {string} 생성된 프롬프트
 */
function generatePrompt(transcript, context) {
  const basePrompt = `
다음은 ${context} 상황에서 사용자가 말한 내용입니다:

"${transcript}"

이 내용을 분석하여 다음 형태의 JSON으로 응답해주세요:
{
  "analysis": "내용 분석 결과 (한국어로 간결하게)",
  "confidence": 0.0-1.0 사이의 자신감 점수,
  "tone": "말투 분석 (친근함, 정중함, 긴장됨 등)",
  "key_points": ["핵심 포인트 1", "핵심 포인트 2"],
  "suggestions": ["개선 제안 1", "개선 제안 2"],
  "score": 1-100 사이의 점수
}
`

  // 컨텍스트별 추가 지침
  const contextPrompts = {
    '면접': `
특히 면접 상황에 맞게 다음을 고려해주세요:
- 답변의 논리성과 구조
- 자신감과 적극성
- 경험과 역량의 구체성
- 의사소통 능력
`,
    '발표': `
발표 상황에 맞게 다음을 고려해주세요:
- 내용의 명확성과 구조
- 청중과의 소통
- 핵심 메시지 전달력
- 설득력과 임팩트
`,
    '일반': `
일반적인 대화 상황에서 다음을 고려해주세요:
- 의사소통의 명확성
- 내용의 일관성
- 감정 표현의 적절성
`
  }

  return basePrompt + (contextPrompts[context] || contextPrompts['일반'])
}

/**
 * 실시간 음성 피드백 생성
 * @param {string} transcript - 현재까지의 텍스트
 * @returns {Promise<Object>} 실시간 피드백
 */
export async function getRealtimeFeedback(transcript) {
  if (!transcript || transcript.length < 10) {
    return null
  }

  try {
    const prompt = `
다음 텍스트에 대해 실시간 피드백을 제공해주세요:
"${transcript}"

간단한 JSON 형태로 응답:
{
  "status": "good/warning/poor",
  "message": "짧은 피드백 메시지",
  "tip": "간단한 개선 팁"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()
    
    try {
      return JSON.parse(feedback)
    } catch {
      return {
        status: 'good',
        message: '계속 말씀해주세요',
        tip: '자연스럽게 이야기하세요'
      }
    }
  } catch (error) {
    console.error('실시간 피드백 오류:', error)
    return null
  }
}

/**
 * 면접 질문 생성
 * @param {string} context - 면접 분야나 직무
 * @returns {Promise<Array>} 생성된 질문들
 */
export async function generateInterviewQuestions(context = '일반') {
  try {
    const prompt = `
${context} 분야의 면접을 위한 질문 5개를 생성해주세요.
실제 면접에서 자주 나오는 현실적인 질문들로 구성해주세요.

JSON 형태로 응답:
{
  "questions": [
    {
      "question": "질문 내용",
      "type": "자기소개/경험/역량/상황판단",
      "difficulty": "쉬움/보통/어려움"
    }
  ]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const questions = response.text()
    
    try {
      const parsed = JSON.parse(questions)
      return parsed.questions || []
    } catch {
      return [
        {
          question: "자기소개를 간단히 해주세요.",
          type: "자기소개",
          difficulty: "쉬움"
        }
      ]
    }
  } catch (error) {
    console.error('질문 생성 오류:', error)
    return []
  }
} 