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
 * 더미 AI 설명 생성 (실제 AI API 구현 전 임시)
 * @param term - 설명을 요청할 용어
 * @returns 더미 설명
 */
export const getDummyTermExplanation = (term: string): string => {
  const dummyExplanations: { [key: string]: string } = {
    ETF: "상장지수펀드(Exchange Traded Fund)의 약자로, 특정 지수의 움직임에 따라 수익률이 결정되는 펀드입니다. 주식처럼 거래소에서 실시간으로 매매할 수 있습니다.",
    PER: "주가수익비율(Price Earnings Ratio)로, 주가를 주당순이익(EPS)으로 나눈 값입니다. 기업의 수익 대비 주가가 적정한지 판단하는 지표입니다.",
    PBR: "주가순자산비율(Price Book-value Ratio)로, 주가를 주당순자산(BPS)으로 나눈 값입니다. 기업의 순자산 대비 주가가 적정한지 판단하는 지표입니다.",
    배당: "기업이 벌어들인 이익 중 일부를 주주들에게 나누어주는 것을 말합니다. 주주가 보유한 주식 수에 비례하여 지급됩니다.",
    default: `"${term}"은(는) 금융/경제 관련 용어입니다. 해당 용어는 투자 및 재무 분석에서 중요한 개념으로 사용됩니다. 더 자세한 정보는 전문가에게 문의하거나 금융 용어 사전을 참고하세요.`,
  }

  return dummyExplanations[term] || dummyExplanations.default
}
