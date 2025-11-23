import apiClient from "@/lib/axios"
import { SaveTermRequest, SaveTermResponse, TermsResponse } from "@/lib/types"

/**
 * 용어 저장
 * @param term - 용어
 * @param definition - 설명
 * @returns 저장된 용어 정보
 */
export const saveTerm = async (term: string, definition: string): Promise<SaveTermResponse> => {
  try {
    const requestBody: SaveTermRequest = { termName: term, termDescription: definition }
    const { data } = await apiClient.post<SaveTermResponse>("/api/users/terms", requestBody)

    if (data.success) {
      return data
    } else {
      throw new Error(data.message || "용어 저장에 실패했습니다")
    }
  } catch (error) {
    console.error("Error saving term:", error)
    throw error
  }
}

/**
 * 저장된 용어 목록 조회
 * @returns 저장된 용어 목록
 */
export const fetchUserTerms = async (): Promise<TermsResponse> => {
  try {
    const { data } = await apiClient.get<TermsResponse>("/api/users/terms")

    if (data.success) {
      return data
    } else {
      throw new Error(data.message || "용어 목록 조회에 실패했습니다")
    }
  } catch (error) {
    console.error("Error fetching user terms:", error)
    throw error
  }
}

/**
 * 용어 삭제
 * @param termId - 삭제할 용어 ID
 * @returns 성공 여부
 */
export const deleteTerm = async (termId: number): Promise<boolean> => {
  try {
    const { data } = await apiClient.delete(`/api/users/terms/${termId}`)

    return data.success
  } catch (error) {
    console.error("Error deleting term:", error)
    throw error
  }
}

/**
 * AI 용어 설명 요청
 * @param term - 설명을 요청할 용어
 * @returns 용어와 설명
 */
export const fetchTermDefinition = async (
  term: string
): Promise<{ term: string; definition: string }> => {
  try {
    const { data } = await apiClient.get<{
      code: string
      message: string
      success: boolean
      data: { term: string; definition: string }
    }>("/api/users/terms/explain", { params: { term } })

    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || "용어 설명을 가져오는데 실패했습니다")
    }
  } catch (error) {
    console.error("Error fetching term definition:", error)
    throw error
  }
}

/**
 * 용어 검색
 * @param keyword - 검색 키워드
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 * @returns 검색된 용어 목록
 */
export const searchTerms = async (
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<{
  code: string
  message: string
  success: boolean
  data: {
    content: Array<{
      userTermId: number
      termName: string
      termDescription: string
      createdAt: string
    }>
    number: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
    numberOfElements: number
    empty: boolean
  }
}> => {
  try {
    const { data } = await apiClient.get("/api/users/terms/search", {
      params: { keyword, page, size },
    })

    if (data.success) {
      return data
    } else {
      throw new Error(data.message || "용어 검색에 실패했습니다")
    }
  } catch (error) {
    console.error("Error searching terms:", error)
    throw error
  }
}

/**
 * 용어 검색 추천어
 * @param keyword - 검색 키워드
 * @returns 추천 검색어 목록
 */
export const fetchSearchSuggestions = async (
  keyword: string
): Promise<{
  code: string
  message: string
  success: boolean
  data: {
    suggestions: string[]
  }
}> => {
  try {
    const { data } = await apiClient.get("/api/users/terms/search/suggestions", {
      params: { keyword },
    })

    if (data.success) {
      return data
    } else {
      throw new Error(data.message || "추천 검색어 조회에 실패했습니다")
    }
  } catch (error) {
    console.error("Error fetching search suggestions:", error)
    throw error
  }
}
