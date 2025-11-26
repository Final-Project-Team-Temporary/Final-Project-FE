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
  userKeywordIds: number[]
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

// 백엔드 로그인 응답 타입
export interface LoginResponse {
  code: string
  message: string
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    userStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED"
    loginStatus: "EXISTING_USER" | "NEW_USER"
    userName: string
  }
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
  userTermId: number
  termName: string
  termDescription: string
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
  data: Term[]
}

export interface SaveTermResponse {
  code: string
  message: string
  success: boolean
  data: Term
}

// 퀴즈 관련 타입
export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  explanation?: string
  term?: string
}

export interface QuizData {
  quizzes: QuizQuestion[]
  generatedAt: string
  term?: string
  terms?: string
  totalQuestions?: number
  estimatedTime?: number
}

// 기사 퀴즈 데이터
export interface ArticleQuizData {
  quizzes: QuizQuestion[]
  createdAt: string | null
  term: string | null
}

export interface QuizResponse {
  code: string
  message: string
  success: boolean
  data: QuizData
}

export interface CustomQuizRequest {
  terms: string[]
  questionsPerTerm: number
  difficulty: string
}

export interface SmartQuizRequest {
  totalQuestions: number
}

export interface WeeklyChallenge {
  id: number
  weekStartDate: string
  weekEndDate: string
  totalQuestions: number
  timeLimit: number
  terms: string
  isActive: boolean
}

export interface ChallengeAttempt {
  score: number
  totalQuestions: number
  timeSpent: number
  accuracy: number
  rank: number
  attemptedAt: string
}

export interface ChallengeRanking {
  rank: number
  userId: number
  username: string
  score: number
  totalQuestions: number
  timeSpent: number
  accuracy: number
}

export interface ChallengeStats {
  totalParticipants: number
  averageScore: number
}

export interface WeeklyChallengeResponse {
  challenge: WeeklyChallenge
  myAttempt: ChallengeAttempt | null
  quizzes: QuizQuestion[] | null
  ranking: ChallengeRanking[]
  stats: ChallengeStats
}

export interface ChallengeSubmitRequest {
  challengeId: number
  score: number
  totalQuestions: number
  timeSpent: number
  answers: number[]
}

export interface QuizResultItem {
  question: string
  options: string[]
  answerIndex: number
  userAnswerIndex: number
  explanation?: string
  term: string
}

export interface QuizResultRequest {
  results: QuizResultItem[]
}

export interface LearningStats {
  totalTerms: number
  completedQuizzes: number
  averageAccuracy: number
  lastStudied: string
  streak: number
}

// 최근 읽은 기사 관련 타입
export interface RecentlyViewedArticle {
  id: string
  title: string
}

export interface RecentlyViewedArticlesResponse {
  code: string
  message: string
  success: boolean
  data: RecentlyViewedArticle[]
}

// 회원가입 관련 Enum 타입
export enum AgeRange {
  TWENTIES = "TWENTIES",
  THIRTIES = "THIRTIES",
  FOURTIES = "FOURTIES",
  FIFTIES = "FIFTIES",
  SIXTY_PLUS = "SIXTY_PLUS"
}

export enum InvestmentLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum RiskTolerance {
  STABLE = "STABLE",
  MODERATE = "MODERATE",
  AGGRESSIVE = "AGGRESSIVE"
}

export enum InvestmentGoal {
  LONG_TERM_GROWTH = "LONG_TERM_GROWTH",
  SHORT_TERM_PROFIT = "SHORT_TERM_PROFIT",
  STABLE_INCOME = "STABLE_INCOME",
  INFLATION_HEDGE = "INFLATION_HEDGE",
  RETIREMENT_PREP = "RETIREMENT_PREP",
  EDUCATION_FUND = "EDUCATION_FUND"
}

export enum Category {
  BATTERY = "BATTERY",
  MEDICINE = "MEDICINE",
  STEEL = "STEEL",
  GOLD = "GOLD",
  GENERAL = "GENERAL"
}

// 회원가입 API 요청/응답 타입
export interface RegisterRequest {
  username: string
  password: string
  email: string
}

export interface RegisterResponse {
  code: string
  message: string
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    userStatus: "PENDING" | "ACTIVE" | "INACTIVE"
    loginStatus: "NEW_USER" | "EXISTING_USER"
    userName: string
  }
}

export interface CompleteRegistrationRequest {
  ageRange: AgeRange
  investmentLevel: InvestmentLevel
  riskTolerance: RiskTolerance
  investmentGoal: InvestmentGoal
  interestCategories: Category[]
}

export interface CompleteRegistrationResponse {
  code: string
  message: string
  success: boolean
  data?: any
}
