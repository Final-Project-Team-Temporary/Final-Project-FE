import apiClient from "@/lib/axios"
import {
  QuizData,
  QuizResponse,
  CustomQuizRequest,
  SmartQuizRequest,
  WeeklyChallengeResponse,
  ChallengeSubmitRequest,
  ChallengeAttempt,
  QuizResultRequest,
  LearningStats,
} from "@/lib/types"

/**
 * 단일 용어 퀴즈 조회
 * @param term - 용어명 (optional, 없으면 랜덤)
 * @returns 퀴즈 데이터
 */
export const fetchQuiz = async (term?: string): Promise<QuizData> => {
  try {
    const url = term ? `/api/quiz?term=${encodeURIComponent(term)}` : "/api/quiz"
    const { data } = await apiClient.get<QuizResponse>(url, {
      timeout: 60000, // 60초 타임아웃
    })
    return data.data
  } catch (error) {
    console.error("Error fetching quiz:", error)
    throw error
  }
}

/**
 * 커스텀 모의고사 생성
 * @param request - 커스텀 퀴즈 요청 데이터
 * @returns 퀴즈 데이터
 */
export const createCustomQuiz = async (request: CustomQuizRequest): Promise<QuizData> => {
  try {
    const { data } = await apiClient.post<QuizResponse>("/api/quiz/mixed", request, {
      timeout: 60000, // 60초 타임아웃
    })
    return data.data
  } catch (error) {
    console.error("Error creating custom quiz:", error)
    throw error
  }
}

/**
 * 스마트 랜덤 모의고사 생성
 * @param request - 스마트 퀴즈 요청 데이터
 * @returns 퀴즈 데이터
 */
export const createSmartQuiz = async (request: SmartQuizRequest): Promise<QuizData> => {
  try {
    const { data } = await apiClient.post<QuizResponse>("/api/quiz/smart-mix", request, {
      timeout: 60000, // 60초 타임아웃
    })
    return data.data
  } catch (error) {
    console.error("Error creating smart quiz:", error)
    throw error
  }
}

/**
 * 주간 챌린지 조회
 * @returns 주간 챌린지 정보
 */
export const fetchWeeklyChallenge = async (): Promise<WeeklyChallengeResponse> => {
  try {
    const { data } = await apiClient.get<WeeklyChallengeResponse>("/api/quiz/weekly-challenge")
    return data
  } catch (error) {
    console.error("Error fetching weekly challenge:", error)
    throw error
  }
}

/**
 * 주간 챌린지 제출
 * @param request - 챌린지 제출 데이터
 * @returns 결과 정보
 */
export const submitChallenge = async (
  request: ChallengeSubmitRequest
): Promise<ChallengeAttempt> => {
  try {
    const { data } = await apiClient.post<ChallengeAttempt>(
      "/api/quiz/weekly-challenge/submit",
      request
    )
    return data
  } catch (error) {
    console.error("Error submitting challenge:", error)
    throw error
  }
}

/**
 * 퀴즈 결과 저장
 * @param request - 퀴즈 결과 데이터
 * @returns 성공 메시지
 */
export const saveQuizResult = async (request: QuizResultRequest): Promise<string> => {
  try {
    const { data } = await apiClient.post<string>("/api/quiz/results", request)
    return data
  } catch (error) {
    console.error("Error saving quiz result:", error)
    throw error
  }
}

/**
 * 학습 통계 조회
 * @returns 학습 통계 데이터
 */
export const fetchLearningStats = async (): Promise<LearningStats> => {
  try {
    const { data } = await apiClient.get<LearningStats>("/stats")
    return data
  } catch (error) {
    console.error("Error fetching learning stats:", error)
    throw error
  }
}
