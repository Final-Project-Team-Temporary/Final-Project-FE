// 기사 요약 정보
export interface ArticleSummary {
  id: string
  title: string
  publishedAt: string
  isBookmarked: boolean
  bookmarkId: number | null
}

// 요약 난이도
export type SummaryLevel = "EASY" | "MEDIUM" | "ADVANCED"

// 난이도별 기사 요약
export interface ArticleDetail {
  title: string
  category: string
  summarizedContent: string
  summaryLevel: SummaryLevel
  publishedAt: string
}

// API 응답 페이지네이션 정보
export interface PaginationInfo {
  currentPage: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

// 기사 목록 API 응답
export interface ArticleListResponse {
  code: string
  message: string
  success: boolean
  data: {
    content: ArticleSummary[]
  } & PaginationInfo
}

// 기사 키워드 정보
export interface ArticleKeyword {
  term: string
  termSummary: string
}

// 관련 주식 정보
export interface ArticleStock {
  stockName: string
  stockCode: string
  market: string
  sector: string
}

// 기사 상세 API 응답
export interface ArticleDetailResponse {
  code: string
  message: string
  success: boolean
  data: {
    summaries: ArticleDetail[]
    keywords: ArticleKeyword[]
    stocks: ArticleStock[]
    isBookmarked: boolean
  }
}

// 원문 기사 정보
export interface ArticleOriginal {
  title: string
  content: string
  category: string
  publishedAt: string
  sourceUrl?: string
}

// 원문 기사 API 응답
export interface ArticleOriginalResponse {
  code: string
  message: string
  success: boolean
  data: ArticleOriginal
}

// 추천 기사
export interface RecommendedArticle {
  id: string
  title: string
  press: string | null
  url: string
  publishedAt: string
}

// 추천 기사 데이터 (페이지네이션 포함)
export interface RecommendedArticlesData {
  content: RecommendedArticle[]
  currentPage: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

// 추천 기사 API 응답
export interface RecommendedArticlesResponse {
  code: string
  message: string
  success: boolean
  data: RecommendedArticlesData
}
