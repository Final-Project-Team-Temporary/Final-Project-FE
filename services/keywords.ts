import apiClient from "@/lib/axios"
import {
  AddKeywordRequest,
  UpdateKeywordsRequest,
  UserKeywordsResponse,
  UserKeyword,
  ApiResponse,
} from "@/lib/types"

/**
 * 사용자 키워드 목록 조회
 * @returns 우선순위 순으로 정렬된 키워드 이름 배열
 */
export const fetchUserKeywords = async (): Promise<string[]> => {
  try {
    const { data } = await apiClient.get<UserKeywordsResponse>("/api/users/keywords")

    if (data.success && data.data) {
      // priority 순으로 정렬 후 keywordName만 추출
      return data.data.keywords
        .sort((a, b) => a.priority - b.priority)
        .map((keyword) => keyword.keywordName)
    } else {
      throw new Error(data.message || "Failed to fetch keywords")
    }
  } catch (error) {
    console.error("Error fetching user keywords:", error)
    throw error
  }
}

/**
 * 사용자 키워드 전체 정보 조회 (ID 포함)
 * @returns 우선순위 순으로 정렬된 키워드 객체 배열
 */
export const fetchUserKeywordsWithId = async (): Promise<UserKeyword[]> => {
  try {
    const { data } = await apiClient.get<UserKeywordsResponse>("/api/users/keywords")

    if (data.success && data.data) {
      // priority 순으로 정렬
      return data.data.keywords.sort((a, b) => a.priority - b.priority)
    } else {
      throw new Error(data.message || "Failed to fetch keywords")
    }
  } catch (error) {
    console.error("Error fetching user keywords:", error)
    throw error
  }
}

/**
 * 키워드 추가
 * @param keywords - 추가할 키워드
 * @returns 성공 여부
 */
export const addKeyword = async (keywords: string[]): Promise<boolean> => {
  try {
    const requestBody: AddKeywordRequest = { keywords }
    const { data } = await apiClient.post<ApiResponse<null>>("/api/users/keywords", requestBody)

    return data.success
  } catch (error) {
    console.error("Error adding keyword:", error)
    throw error
  }
}

/**
 * 키워드 삭제
 * @param keyword - 삭제할 키워드
 * @returns 성공 여부
 */
export const deleteKeyword = async (keyword: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/api/users/keywords/${encodeURIComponent(keyword)}`
    )

    return data.success
  } catch (error) {
    console.error("Error deleting keyword:", error)
    throw error
  }
}

/**
 * 전체 키워드 업데이트 (일괄 수정)
 * @param keywords - 새로운 키워드 배열
 * @returns 성공 여부
 */
export const updateKeywords = async (keywords: string[]): Promise<boolean> => {
  try {
    const requestBody: UpdateKeywordsRequest = { keywords }
    const { data } = await apiClient.put<ApiResponse<null>>("/api/users/keywords", requestBody)

    return data.success
  } catch (error) {
    console.error("Error updating keywords:", error)
    throw error
  }
}

/**
 * 추천 키워드 목록 가져오기
 * @returns 추천 키워드 배열
 */
export const fetchSuggestedKeywords = async (): Promise<string[]> => {
  // 임시 데이터 (추후 백엔드 API로 대체)
  return [
    "ETF",
    "배당주",
    "부동산",
    "경제지표",
    "채권",
    "금리",
    "주식",
    "펀드",
    "예금",
    "적금",
    "연금",
    "ISA",
    "IRP",
    "퇴직연금",
    "리츠",
  ]
}
