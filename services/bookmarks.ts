import apiClient from "@/lib/axios"

export interface BookmarkResponse {
  code: string
  message: string
  success: boolean
}

export interface BookmarkedArticle {
  id: string
  title: string
  publishedAt: string
  category?: string
  press?: string
  url?: string
}

export interface BookmarksListResponse {
  code: string
  message: string
  success: boolean
  data: {
    content: BookmarkedArticle[]
    number: number // 현재 페이지 번호 (0-based)
    size: number
    totalElements: number
    totalPages: number
    first: boolean // 첫 페이지 여부
    last: boolean // 마지막 페이지 여부
    numberOfElements: number
    empty: boolean
  }
}

/**
 * 북마크 추가
 * @param articleId - 기사 ID
 * @returns 성공 여부
 */
export const addBookmark = async (articleId: string): Promise<BookmarkResponse> => {
  try {
    const { data } = await apiClient.post<BookmarkResponse>("/api/articles/bookmarks", {
      articleId,
    })
    return data
  } catch (error) {
    console.error("Error adding bookmark:", error)
    throw error
  }
}

/**
 * 북마크 삭제
 * @param articleId - 기사 ID
 * @returns 성공 여부
 */
export const removeBookmark = async (articleId: string): Promise<BookmarkResponse> => {
  try {
    const { data } = await apiClient.delete<BookmarkResponse>(
      `/api/articles/bookmarks/${articleId}`
    )
    return data
  } catch (error) {
    console.error("Error removing bookmark:", error)
    throw error
  }
}

/**
 * 북마크 목록 조회
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 * @returns 북마크한 기사 목록
 */
export const fetchBookmarks = async (
  page: number = 0,
  size: number = 12
): Promise<BookmarksListResponse> => {
  try {
    const { data } = await apiClient.get<BookmarksListResponse>("/api/articles/bookmarks", {
      params: { page, size },
    })
    return data
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    throw error
  }
}

/**
 * 북마크 상태 확인
 * @param articleId - 기사 ID
 * @returns 북마크 여부
 */
export const checkBookmarkStatus = async (articleId: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: { isBookmarked: boolean } }>(
      `/api/articles/bookmarks/status/${articleId}`
    )
    return data.data.isBookmarked
  } catch (error) {
    console.error("Error checking bookmark status:", error)
    return false
  }
}
