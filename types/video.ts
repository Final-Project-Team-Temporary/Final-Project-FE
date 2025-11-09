// 유튜브 영상 메트릭 정보
export interface VideoMetrics {
  view_count: string
  like_count: string
  comment_count: number
  positive_ratio: number
}

// 유튜브 추천 영상 정보
export interface VideoRecommendation {
  rank: number
  title: string
  video_id: string
  video_url: string
  channel: string
  recommendation_score: number
  quality_score: number
  relevance_score: number
  educational_value: number
  content_accuracy: number
  analysis_summary: string
  trust_comment: string
  metrics: VideoMetrics
}

// 유튜브 추천 API 응답 데이터
export interface VideoRecommendationData {
  totalCount: number
  keywordBasedCount: number
  commonRecommendCount: number
  videos: VideoRecommendation[]
}

// 유튜브 추천 API 응답
export interface VideoRecommendationResponse {
  code: string
  message: string
  success: boolean
  data: VideoRecommendationData
}
