// 투자 목표 옵션
export const INVESTMENT_GOAL_OPTIONS = [
  "장기 자산 증식",
  "단기 수익 창출",
  "안정적인 배당 수익",
  "인플레이션 헤지",
  "은퇴 자금 마련",
  "자녀 교육비 준비",
] as const

// 관심 분야 옵션
export const INTEREST_OPTIONS = [
  "국내 주식",
  "해외 주식", 
  "ETF",
  "채권",
  "부동산",
  "암호화폐",
  "원자재",
  "ESG 투자"
] as const

// 기사 카테고리
export const ARTICLE_CATEGORIES = [
  "all",
  "주식",
  "ETF", 
  "부동산",
  "채권",
  "암호화폐",
  "경제지표"
] as const

// 난이도 레벨
export const DIFFICULTY_LEVELS = [
  "all",
  "beginner",
  "intermediate", 
  "advanced"
] as const

// 연령대 옵션
export const AGE_OPTIONS = [
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60s", label: "60대 이상" },
] as const

// 투자 경험 옵션
export const INVESTMENT_EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "초보자 (1년 미만)" },
  { value: "intermediate", label: "중급자 (1-3년)" },
  { value: "advanced", label: "고급자 (3년 이상)" },
] as const

// 위험 성향 옵션
export const RISK_TOLERANCE_OPTIONS = [
  { value: "conservative", label: "안정형 (원금 보존 중시)" },
  { value: "moderate", label: "중립형 (적당한 위험 감수)" },
  { value: "aggressive", label: "적극형 (높은 수익 추구)" },
] as const

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "views", label: "조회순" },
] as const

// 기본 설정값
export const DEFAULT_FILTERS = {
  category: "all",
  difficulty: "all",
  searchQuery: "",
  sortBy: "latest" as const,
}

// 색상 매핑
export const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800", 
  advanced: "bg-red-100 text-red-800",
} as const

export const DIFFICULTY_TEXT = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
} as const

// API 엔드포인트
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
  },
  articles: {
    list: "/api/articles",
    detail: (id: number) => `/api/articles/${id}`,
    search: "/api/articles/search",
  },
  user: {
    profile: "/api/user/profile",
    progress: "/api/user/progress",
    preferences: "/api/user/preferences",
  },
  portfolio: {
    overview: "/api/portfolio/overview",
    investments: "/api/portfolio/investments",
  },
} as const