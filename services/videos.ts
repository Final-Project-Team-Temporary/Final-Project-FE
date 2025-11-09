import apiClient from "@/lib/axios"
import { VideoRecommendationResponse, VideoRecommendation } from "@/types/video"

/**
 * 유튜브 영상 썸네일 URL 생성
 * @param videoId - 유튜브 영상 ID
 * @returns 썸네일 이미지 URL
 */
export const getYoutubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

/**
 * 유튜브 영상 재생 시간 포맷팅 (초 -> MM:SS)
 * @param seconds - 초 단위 시간
 * @returns 포맷된 시간 문자열
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * 사용자 키워드 기반 유튜브 추천 영상 가져오기
 * @returns 추천 영상 목록과 통계 정보
 */
export const fetchRecommendedVideos = async (): Promise<VideoRecommendationResponse> => {
  try {
    const { data } = await apiClient.get<VideoRecommendationResponse>(
      "/api/recommends/videos/youtube"
    )

    if (data.success) {
      return data
    } else {
      throw new Error(data.message || "Failed to fetch video recommendations")
    }
  } catch (error) {
    console.error("Error fetching recommended videos:", error)
    throw error
  }
}

/**
 * 조회수 포맷팅 (숫자 -> 한국어 단위)
 * @param viewCount - 조회수 문자열
 * @returns 포맷된 조회수
 */
export const formatViewCount = (viewCount: string): string => {
  const num = parseInt(viewCount, 10)
  if (isNaN(num)) return viewCount

  if (num >= 10000) {
    return `${Math.floor(num / 10000)}만`
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}천`
  }
  return num.toString()
}

/**
 * 업로드 시간 계산 (상대 시간)
 * @param uploadDate - 업로드 날짜 (ISO 8601 형식)
 * @returns 상대 시간 문자열 (예: "3일 전", "1주 전")
 */
export const getRelativeTime = (uploadDate: string): string => {
  const now = new Date()
  const uploaded = new Date(uploadDate)
  const diffMs = now.getTime() - uploaded.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "오늘"
  if (diffDays === 1) return "1일 전"
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`
  return `${Math.floor(diffDays / 365)}년 전`
}
