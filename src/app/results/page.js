'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function Results() {
  const [activeTab, setActiveTab] = useState('resume')
  const [copied, setCopied] = useState(false)
  const [documentData, setDocumentData] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(null)

  // 저장된 데이터 로드
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const latestDoc = localStorage.getItem('writeme_latest_document')
      if (latestDoc) {
        const data = JSON.parse(latestDoc)
        setDocumentData(data)
        
        // 데이터를 바탕으로 실제 컨텐츠 생성
        const content = generateContentFromData(data)
        setGeneratedContent(content)
      }
    }
  }, [])

  const generateContentFromData = (data) => {
    const { tone, experiences, personalityAnalysis } = data
    
    // 실제 경험 데이터를 바탕으로 컨텐츠 생성
    const workExperiences = experiences?.filter(exp => exp.category === 'work') || []
    const projectExperiences = experiences?.filter(exp => exp.category === 'project') || []
    
    const resume = `${data.userInfo?.name || '김하연'}

연락처: ${data.userInfo?.email || 'user@email.com'} | ${data.userInfo?.phone || '010-1234-5678'}

■ 핵심 역량
${generateSkillsFromExperiences(experiences, tone)}

■ 경험
${workExperiences.map(exp => `${exp.title}
• ${exp.description}`).join('\n\n')}

■ 프로젝트
${projectExperiences.map(exp => `${exp.title}
• ${exp.description}`).join('\n\n')}

■ 기타 경험
${experiences?.filter(exp => !['work', 'project'].includes(exp.category))
  .map(exp => `${exp.title} (${exp.category})\n• ${exp.description}`).join('\n\n') || ''}

■ 기술 스택
• ${generateTechStackFromExperiences(experiences)}`

    const coverLetter = `지원동기 및 포부

${generateMotivationByTone(tone, experiences)}

성격의 장단점

${generatePersonalityByTone(tone, personalityAnalysis)}

주요 경험 및 성과

${experiences?.slice(0, 2).map(exp => 
`${exp.title}에서는 ${exp.description} 이 경험을 통해 ${generateLearningByTone(tone)}를 배웠습니다.`
).join('\n\n') || ''}`

         // 피드백도 동적으로 생성
     const feedback = generateFeedbackByTone(tone, experiences)
     
     return { resume, coverletter: coverLetter, feedback }
  }

  const generateSkillsFromExperiences = (experiences, tone) => {
    const baseSkills = `• ${tone === '논리적' ? '체계적 문제 해결과 논리적 사고를 바탕으로 한' : 
                      tone === '감성적' ? '공감적 소통과 협력을 통한' :
                      tone === '열정적' ? '적극적이고 도전적인 자세로' : '신중하고 안정적인 접근을 통한'} 프로젝트 관리
• 다양한 팀원과의 협업을 통한 목표 달성 경험`
    
    if (experiences?.length > 0) {
      return baseSkills + `\n• ${experiences[0].title}를 통한 실무 경험`
    }
    return baseSkills
  }

  const generateTechStackFromExperiences = (experiences) => {
    return experiences?.some(exp => exp.description.includes('개발') || exp.description.includes('프로그래밍')) 
      ? 'Programming: Python, JavaScript\n• Tools: Git, Figma, Notion'
      : 'Microsoft Office, Google Workspace\n• 협업: Slack, Notion, Zoom'
  }

  const generateMotivationByTone = (tone, experiences) => {
    const baseText = {
      '논리적': '저는 체계적이고 논리적인 사고를 바탕으로 문제를 해결하는 것을 즐기는 사람입니다.',
      '감성적': '저는 사람과의 소통과 공감을 중시하며, 따뜻한 관계 속에서 성장하는 것을 추구합니다.',
      '열정적': '저는 새로운 도전에 대한 열정과 적극적인 자세로 목표를 달성해나가는 것을 즐깁니다.',
      '신중한': '저는 신중하고 안정적인 접근을 통해 확실한 결과를 만들어내는 것을 중시합니다.'
    }
    
    return baseText[tone] || baseText['논리적']
  }

  const generatePersonalityByTone = (tone, analysis) => {
    const personalityText = {
      '논리적': '장점으로는 체계적이고 논리적인 사고를 바탕으로 복잡한 문제를 단계별로 해결해 나가는 능력이 있습니다. 단점으로는 때로는 과도하게 계획에 의존하여 유연성이 부족할 수 있다는 점입니다.',
      '감성적': '장점으로는 타인의 감정을 잘 이해하고 공감하는 능력이 뛰어나며, 팀의 화합을 이끌어내는 데 강합니다. 단점으로는 때로는 감정에 치우쳐 객관적 판단이 어려울 수 있다는 점입니다.',
      '열정적': '장점으로는 새로운 일에 대한 열정과 추진력이 강하며, 주변 사람들에게 동기부여를 잘 해줍니다. 단점으로는 때로는 성급함으로 인해 세부적인 검토가 부족할 수 있다는 점입니다.',
      '신중한': '장점으로는 신중하고 안정적인 접근으로 실수를 최소화하며, 꼼꼼한 성격으로 완성도 높은 결과를 만들어냅니다. 단점으로는 때로는 과도한 신중함으로 인해 기회를 놓칠 수 있다는 점입니다.'
    }
    
    return personalityText[tone] || personalityText['논리적']
  }

  const generateLearningByTone = (tone) => {
    const learningText = {
      '논리적': '체계적인 접근의 중요성과 데이터 기반 의사결정',
      '감성적': '팀워크의 가치와 소통의 중요성',
      '열정적': '도전 정신과 적극적인 자세의 힘',
      '신중한': '꼼꼼한 준비와 안정적인 실행의 중요성'
    }
    
         return learningText[tone] || learningText['논리적']
   }

   const generateFeedbackByTone = (tone, experiences) => {
     const feedbackByTone = {
       '논리적': {
         strengths: [
           "논리적이고 체계적인 사고 과정이 잘 드러남",
           "구체적인 수치와 성과로 경험을 효과적으로 어필",
           "문제 해결 과정에서의 객관적 접근법이 인상적",
           "분석적 사고와 데이터 기반 의사결정 능력 강조"
         ],
         improvements: [
           "개인의 감정이나 열정적인 면모도 일부 포함하면 더욱 균형잡힌 인상",
           "팀워크나 소통 경험을 더욱 구체적으로 서술",
           "창의적 문제 해결 사례 추가 고려",
           "미래 비전을 더욱 구체적으로 제시"
         ],
         overall: `${tone} 스타일이 잘 반영되어 있습니다. 체계적인 사고와 논리적 접근법이 일관되게 드러나며, 분석적 업무나 기획 직무에 적합한 인상을 줍니다.`
       },
       '감성적': {
         strengths: [
           "공감적이고 따뜻한 커뮤니케이션 스타일이 돋보임",
           "팀워크와 협력 경험이 자연스럽게 녹아있음",
           "사람 중심적 가치관이 잘 표현됨",
           "관계 형성과 소통 능력이 효과적으로 어필됨"
         ],
         improvements: [
           "구체적인 성과 수치나 데이터 추가 고려",
           "목표 지향적인 면모도 일부 포함하면 균형잡힌 인상",
           "리더십 경험이 있다면 더욱 강조",
           "전문적 역량과 기술적 능력 보완"
         ],
         overall: `${tone} 스타일이 잘 반영되어 있습니다. 따뜻하고 공감적인 커뮤니케이션과 팀워크 중심의 접근이 돋보이며, 서비스업이나 HR 분야에 적합한 인상을 줍니다.`
       },
       '열정적': {
         strengths: [
           "적극적이고 도전적인 자세가 잘 드러남",
           "새로운 시도와 혁신에 대한 의지가 인상적",
           "목표 달성을 위한 추진력과 에너지가 느껴짐",
           "변화와 성장에 대한 열린 마음이 돋보임"
         ],
         improvements: [
           "신중함과 계획성도 일부 보완하면 더욱 균형잡힌 인상",
           "구체적인 실행 과정과 결과 측정 방법 추가",
           "팀워크와 협력적 측면 강화",
           "안정성과 지속가능성에 대한 고려 표현"
         ],
         overall: `${tone} 스타일이 잘 반영되어 있습니다. 역동적이고 에너지 넘치는 추진력이 돋보이며, 스타트업이나 영업 분야에 적합한 인상을 줍니다.`
       },
       '신중한': {
         strengths: [
           "꼼꼼하고 안정적인 접근 방식이 잘 표현됨",
           "위험 관리와 품질 확보에 대한 의식이 높음",
           "체계적인 계획과 단계적 실행 능력이 돋보임",
           "신뢰감 있고 책임감 있는 태도가 느껴짐"
         ],
         improvements: [
           "적극성과 도전 정신도 일부 표현하면 더욱 균형잡힌 인상",
           "창의적 사고나 혁신적 접근 사례 추가",
           "스피드와 효율성 측면 보완",
           "리더십과 주도적 역할 경험 강화"
         ],
         overall: `${tone} 스타일이 잘 반영되어 있습니다. 안정적이고 신뢰감 있는 접근이 돋보이며, 금융이나 공공기관 분야에 적합한 인상을 줍니다.`
       }
     }
     
     return feedbackByTone[tone] || feedbackByTone['논리적']
   }

  const tabs = [
    { id: 'resume', label: '이력서', icon: '📄' },
    { id: 'coverletter', label: '자기소개서', icon: '✍️' },
    { id: 'feedback', label: 'AI 피드백', icon: '🤖' }
  ]

  // 더미 생성 데이터 (저장된 데이터가 없을 때 사용)
  const fallbackContent = {
    resume: `김하연

연락처: hayeon.kim@email.com | 010-1234-5678
GitHub: github.com/hayeonkim

■ 핵심 역량
• 체계적 문제 해결과 논리적 사고를 바탕으로 한 프로젝트 관리
• 다양한 팀원과의 협업을 통한 목표 달성 경험
• 데이터 분석과 사용자 중심의 서비스 기획 능력

■ 교육
서울대학교 경영학과 | 2020.03 - 2024.02
• 주요 과목: 마케팅, 데이터 분석, 조직행동론
• GPA: 3.8/4.5

■ 프로젝트 경험
웹 서비스 기획 및 개발 프로젝트 | 2023.06 - 2023.12
• 사용자 니즈 분석을 통한 서비스 기획 및 UI/UX 설계
• 5명의 개발팀과 협업하여 MVP 개발 완료
• 베타 테스트를 통해 사용자 만족도 85% 달성

데이터 분석 경진대회 | 2023.03 - 2023.05
• Python과 SQL을 활용한 대용량 데이터 분석
• 예측 모델 구축으로 정확도 92% 달성
• 전국 대학생 경진대회 우수상 수상

■ 기술 스택
• Programming: Python, SQL, JavaScript
• Tools: Excel, Tableau, Figma
• 협업: Git, Notion, Slack`,

    coverletter: `지원동기 및 포부

저는 논리적 사고와 체계적 접근을 바탕으로 문제를 해결하는 것을 즐기는 사람입니다. 대학 재학 중 다양한 프로젝트를 통해 데이터 기반의 의사결정과 효율적인 팀 협업의 중요성을 깨달았습니다.

특히 웹 서비스 기획 프로젝트에서는 사용자 인터뷰와 데이터 분석을 통해 실제 니즈를 파악하고, 이를 바탕으로 서비스를 설계했습니다. 초기 가설과 다른 결과가 나왔을 때도 객관적 데이터를 바탕으로 방향을 수정하여 결과적으로 높은 사용자 만족도를 달성할 수 있었습니다.

데이터 분석 경진대회에서는 단순히 결과만을 추구하는 것이 아니라, 분석 과정의 논리적 타당성과 결과의 실무 적용 가능성을 중시했습니다. 이러한 접근 방식이 우수상 수상으로 이어졌다고 생각합니다.

앞으로도 논리적 사고와 데이터 기반의 접근을 통해 비즈니스 문제를 해결하고, 팀과 함께 더 나은 결과를 만들어가고 싶습니다. 귀사에서의 경험을 통해 한 단계 더 성장한 전문가가 되고자 합니다.

성격의 장단점

장점으로는 체계적이고 논리적인 사고를 바탕으로 복잡한 문제를 단계별로 해결해 나가는 능력이 있습니다. 또한 객관적 데이터를 중시하여 감정적 판단보다는 합리적 의사결정을 내리려 노력합니다.

단점으로는 때로는 과도하게 계획에 의존하여 유연성이 부족할 수 있다는 점입니다. 이를 보완하기 위해 최근에는 의도적으로 다양한 관점을 수용하고, 팀원들의 창의적 아이디어에 귀 기울이려 노력하고 있습니다.`,

    feedback: {
      strengths: [
        "논리적이고 체계적인 사고 과정이 잘 드러남",
        "구체적인 수치와 성과로 경험을 효과적으로 어필",
        "문제 해결 과정에서의 객관적 접근법이 인상적",
        "팀 협업 경험이 자연스럽게 녹아있음"
      ],
      improvements: [
        "개인의 감정이나 열정적인 면모도 일부 포함하면 더욱 균형잡힌 인상",
        "실패 경험과 그로부터의 학습 내용 추가 고려",
        "지원 기업의 특성에 맞는 구체적인 기여 방안 언급",
        "미래 비전을 더욱 구체적으로 제시"
      ],
      overall: "논리적이고 신뢰감 있는 글쓰기 스타일이 잘 반영되어 있습니다. 체계적인 사고와 데이터 기반 접근법이 일관되게 드러나며, 이는 분석적 업무나 기획 직무에 적합한 인상을 줍니다."
    }
  }

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  const downloadPDF = () => {
    // PDF 다운로드 로직 (더미)
    console.log('PDF 다운로드 시작')
    alert('PDF 다운로드가 시작됩니다.')
  }

  const requestExpertReview = () => {
    // 전문가 첨삭 요청 로직 (더미)
    console.log('전문가 첨삭 요청')
    alert('전문가 첨삭 요청이 접수되었습니다.')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI 생성 결과</h1>
          <p className="text-lg text-gray-600">당신의 경험과 성향을 바탕으로 생성된 맞춤형 문서입니다</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF 다운로드
          </button>
          
          <button
            onClick={() => copyToClipboard(activeTab === 'feedback' ? JSON.stringify((generatedContent && generatedContent.feedback) || fallbackContent.feedback, null, 2) : (generatedContent && generatedContent[activeTab]) || fallbackContent[activeTab])}
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a1 1 0 011 1v3M9 12l2 2 4-4" />
            </svg>
            {copied ? '복사됨!' : '클립보드 복사'}
          </button>
          
          <button
            onClick={requestExpertReview}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            전문가 첨삭 요청
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {(activeTab === 'resume' || activeTab === 'coverletter') && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="prose max-w-none"
              >
                <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
                  {(generatedContent && generatedContent[activeTab]) || fallbackContent[activeTab]}
                </pre>
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* 종합 평가 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 종합 평가</h3>
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <p className="text-gray-700 leading-relaxed">{(generatedContent && generatedContent.feedback?.overall) || fallbackContent.feedback.overall}</p>
                  </div>
                </div>

                {/* 강점 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">✅ 강점</h3>
                  <div className="space-y-3">
                    {((generatedContent && generatedContent.feedback?.strengths) || fallbackContent.feedback.strengths).map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-gray-700">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 개선 제안 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 개선 제안</h3>
                  <div className="space-y-3">
                    {((generatedContent && generatedContent.feedback?.improvements) || fallbackContent.feedback.improvements).map((improvement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-700">{improvement}</p>
                      </motion.div>
                    ))}
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
          className="flex justify-between mt-8 mb-16"
        >
          <Link
            href="/experience"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            다시 수정하기
          </Link>
          
          <Link
            href="/settings"
            className="px-8 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
          >
            히스토리 보기
          </Link>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  )
} 