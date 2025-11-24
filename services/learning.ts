import apiClient from "@/lib/axios"

// 학습 통계 응답 타입
export interface LearningStreakResponse {
  code: string
  message: string
  success: boolean
  data: {
    consecutiveDays: number
    totalLearningDays: number
    learnedToday: boolean
    quizCount: number
    articleCount: number
  }
}

// 학습 통계 데이터 타입
export interface LearningStats {
  consecutiveDays: number
  quizCount: number
  articleCount: number
}

// 학습 통계 가져오기
export async function fetchLearningStreak(): Promise<LearningStreakResponse> {
  const { data } = await apiClient.get<LearningStreakResponse>("/api/learning/streak")
  return data
}
