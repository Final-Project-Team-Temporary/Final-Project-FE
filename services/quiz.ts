import apiClient from "@/lib/axios"
import {
  QuizData,
  QuizResponse,
  ArticleQuizData,
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
    const { data } = await apiClient.get<{
      code: string
      message: string
      success: boolean
      data: {
        quizzes: Array<{
          question: string
          options: string[]
          explanation: string
          answerIndex: number
          term?: string
        }>
        createdAt: string | null
        term?: string
      }
    }>(url, {
      timeout: 60000, // 60초 타임아웃
    })

    if (data.success) {
      const quizzes = data.data.quizzes.map((q) => ({
        question: q.question,
        options: q.options,
        explanation: q.explanation,
        answerIndex: q.answerIndex,
        term: q.term,
      }))

      return {
        quizzes,
        generatedAt: data.data.createdAt || new Date().toISOString(),
        term: data.data.term,
      }
    } else {
      throw new Error(data.message || "퀴즈를 불러오는데 실패했습니다")
    }
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
    const { data } = await apiClient.post<{
      code: string
      message: string
      success: boolean
      data: {
        quizzes: Array<{
          question: string
          options: string[]
          explanation: string
          answerIndex: number
          term?: string
        }>
        createdAt?: string | null
        terms?: string
        totalQuestions?: number
        estimatedTime?: number
      }
    }>("/api/quiz/mixed", request, {
      timeout: 60000, // 60초 타임아웃
    })

    if (data.success) {
      const quizzes = data.data.quizzes.map((q) => ({
        question: q.question,
        options: q.options,
        explanation: q.explanation,
        answerIndex: q.answerIndex,
        term: q.term,
      }))

      return {
        quizzes,
        generatedAt: data.data.createdAt || new Date().toISOString(),
        terms: data.data.terms,
        totalQuestions: data.data.totalQuestions,
        estimatedTime: data.data.estimatedTime,
      }
    } else {
      throw new Error(data.message || "커스텀 퀴즈를 생성하는데 실패했습니다")
    }
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
    const { data } = await apiClient.post<{
      code: string
      message: string
      success: boolean
      data: {
        quizzes: Array<{
          question: string
          options: string[]
          explanation: string
          answerIndex: number
          term?: string
        }>
        createdAt?: string | null
        terms?: string
        totalQuestions?: number
        estimatedTime?: number
      }
    }>("/api/quiz/smart-mix", request, {
      timeout: 60000, // 60초 타임아웃
    })

    if (data.success) {
      const quizzes = data.data.quizzes.map((q) => ({
        question: q.question,
        options: q.options,
        explanation: q.explanation,
        answerIndex: q.answerIndex,
        term: q.term,
      }))

      return {
        quizzes,
        generatedAt: data.data.createdAt || new Date().toISOString(),
        terms: data.data.terms,
        totalQuestions: data.data.totalQuestions,
        estimatedTime: data.data.estimatedTime,
      }
    } else {
      throw new Error(data.message || "스마트 퀴즈를 생성하는데 실패했습니다")
    }
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
    const { data } = await apiClient.get<{
      challenge: {
        id: number
        weekStartDate: string
        weekEndDate: string
        totalQuestions: number
        timeLimit: number
        terms: string
        isActive: boolean
      }
      myAttempt: {
        score: number
        totalQuestions: number
        timeSpent: number
        accuracy: number
        rank: number
        attemptedAt: string
      } | null
      quizzes: Array<{
        question: string
        options: string[]
        explanation?: string
        answerIndex: number
        term?: string
      }> | null
      ranking: Array<{
        rank: number
        userId: number
        username: string
        score: number
        totalQuestions: number
        timeSpent: number
        accuracy: number
      }>
      stats: {
        totalParticipants: number
        averageScore: number
      }
    }>("/api/quiz/weekly-challenge")

    const quizzes = data.quizzes
      ? data.quizzes.map((q) => ({
          question: q.question,
          options: q.options,
          explanation: q.explanation,
          answerIndex: q.answerIndex,
          term: q.term,
        }))
      : null

    return {
      challenge: data.challenge,
      myAttempt: data.myAttempt,
      quizzes,
      ranking: data.ranking,
      stats: data.stats,
    }
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

/**
 * 기사 기반 퀴즈 조회
 * @param articleId - 기사 ID (문자열)
 * @param count - 퀴즈 개수
 * @returns 기사 퀴즈 데이터
 */
export const fetchArticleQuiz = async (
  articleId: string,
  count: number = 3
): Promise<ArticleQuizData> => {
  try {
    const { data } = await apiClient.get<{
      code: string
      message: string
      success: boolean
      data: {
        quizzes: Array<{
          question: string
          options: string[]
          explanation: string
          answer_index: number
        }>
        createdAt: string | null
        term: string | null
      }
    }>("/api/quiz/article", {
      params: { articleId, count },
      timeout: 60000, // 60초 타임아웃
    })

    if (data.success) {
      // answer_index를 answerIndex로 변환
      const quizzes = data.data.quizzes.map((q) => ({
        question: q.question,
        options: q.options,
        explanation: q.explanation,
        answerIndex: q.answer_index,
      }))

      return {
        quizzes,
        createdAt: data.data.createdAt,
        term: data.data.term,
      }
    } else {
      throw new Error(data.message || "퀴즈를 불러오는데 실패했습니다")
    }
  } catch (error) {
    console.error("Error fetching article quiz:", error)
    throw error
  }
}
