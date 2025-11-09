// 사용자 관련 타입
export interface User {
  id: string
  email: string
  name: string
  age?: string
  investmentExperience?: "beginner" | "intermediate" | "advanced"
  riskTolerance?: "conservative" | "moderate" | "aggressive"
  investmentGoals: string[]
  interests: string[]
  createdAt: Date
  updatedAt: Date
}

// 기사 관련 타입
export interface Article {
  id: number
  title: string
  content: string
  summary: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  keywords: string[]
  author: string
  authorTitle?: string
  publishDate: string
  readTime: string
  views: number
  likes: number
  comments: number
  hasAudio: boolean
  imageUrl?: string
}

// 포트폴리오 관련 타입
export interface Investment {
  name: string
  value: number
  change: number
  color: string
  percentage?: number
}

export interface Portfolio {
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
  investments: Investment[]
}

// 학습 관련 타입
export interface LearningProgress {
  completedCourses: number
  totalCourses: number
  currentLevel: string
  badges: number
  streak: number
  articlesRead: number
  quizScore: number
}

// 퀴즈 관련 타입
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

export interface Quiz {
  id: string
  articleId: number
  questions: QuizQuestion[]
  title: string
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 키워드 관리 관련 타입
export interface UserKeyword {
  userKeywordId: number
  keywordName: string
  priority: number
}

export interface UserKeywordsData {
  keywords: UserKeyword[]
}

export interface UserKeywordsResponse {
  code: string
  message: string
  success: boolean
  data: UserKeywordsData
}

export interface AddKeywordRequest {
  keywords: string[]
}

export interface UpdateKeywordsRequest {
  keywords: string[]
}

export interface DeleteKeywordRequest {
  keyword: string
}

// 필터 관련 타입
export interface ArticleFilters {
  category: string
  difficulty: string
  searchQuery: string
  sortBy: "latest" | "popular" | "views"
}

// 인증 관련 타입
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  confirmPassword: string
  name: string
  age: string
  investmentExperience: string
  riskTolerance: string
  investmentGoals: string[]
  interests: string[]
}

// 일반적인 셀렉트 옵션 타입
export interface SelectOption {
  value: string
  label: string
}

// 용어 관련 타입
export interface Term {
  termId: number
  term: string
  definition: string
  createdAt: string
}

export interface SaveTermRequest {
  termName: string
  termDescription: string
}

export interface TermsResponse {
  code: string
  message: string
  success: boolean
  data: {
    terms: Term[]
  }
}

export interface SaveTermResponse {
  code: string
  message: string
  success: boolean
  data: Term
}
