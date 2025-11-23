"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Calendar, Loader2, Sparkles, Bookmark, Heart } from "lucide-react"
import { ArticleSummary, ArticleListResponse, RecommendedArticle } from "@/types/article"
import apiClient from "@/lib/axios"
import Header from "@/components/layout/Header"
import { fetchRecommendedArticles } from "@/services/articles"
import {
  fetchBookmarks,
  addBookmark,
  removeBookmark,
  BookmarkedArticle,
} from "@/services/bookmarks"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { useAuth } from "@/contexts/AuthContext"

type TabType = "all" | "recommended" | "bookmarks"

export default function ArticlesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  // 추천 기사 상태
  const [recommendedArticles, setRecommendedArticles] = useState<RecommendedArticle[]>([])
  const [recommendedCurrentPage, setRecommendedCurrentPage] = useState(0)
  const [recommendedTotalPages, setRecommendedTotalPages] = useState(0)
  const [recommendedTotalElements, setRecommendedTotalElements] = useState(0)
  const [recommendedHasNext, setRecommendedHasNext] = useState(false)
  const [recommendedHasPrevious, setRecommendedHasPrevious] = useState(false)
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(false)
  const [recommendedError, setRecommendedError] = useState<string | null>(null)

  // 북마크 상태
  const [bookmarkedArticles, setBookmarkedArticles] = useState<BookmarkedArticle[]>([])
  const [bookmarksCurrentPage, setBookmarksCurrentPage] = useState(0)
  const [bookmarksTotalPages, setBookmarksTotalPages] = useState(0)
  const [bookmarksTotalElements, setBookmarksTotalElements] = useState(0)
  const [bookmarksHasNext, setBookmarksHasNext] = useState(false)
  const [bookmarksHasPrevious, setBookmarksHasPrevious] = useState(false)
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false)
  const [bookmarksError, setBookmarksError] = useState<string | null>(null)

  // 북마크 상태 트래킹 (articleId -> isBookmarked)
  const [bookmarkStates, setBookmarkStates] = useState<Record<string, boolean>>({})

  // 검색어 변경 시 페이지 리셋
  useEffect(() => {
    if (activeTab === "all") {
      setCurrentPage(0)
    }
  }, [debouncedSearchQuery])

  // 백엔드에서 기사 목록 가져오기
  useEffect(() => {
    if (activeTab === "all") {
      if (debouncedSearchQuery) {
        searchArticles(debouncedSearchQuery, currentPage)
      } else {
        fetchArticles(currentPage)
      }
    }
  }, [currentPage, activeTab, debouncedSearchQuery])

  // 추천 기사 가져오기
  useEffect(() => {
    if (activeTab === "recommended") {
      fetchRecommendedArticlesList(recommendedCurrentPage)
    }
  }, [recommendedCurrentPage, activeTab])

  // 북마크 목록 가져오기
  useEffect(() => {
    if (activeTab === "bookmarks" && isAuthenticated) {
      fetchBookmarksList(bookmarksCurrentPage)
    }
  }, [bookmarksCurrentPage, activeTab, isAuthenticated])

  const fetchArticles = async (page: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get<ArticleListResponse>(
        `/api/articles/summarized?page=${page}&size=20`
      )

      if (data.success) {
        setArticles(data.data.content)
        setCurrentPage(data.data.currentPage)
        setTotalPages(data.data.totalPages)
        setTotalElements(data.data.totalElements)
        setHasNext(data.data.hasNext)
        setHasPrevious(data.data.hasPrevious)

        // API에서 받은 북마크 상태로 초기화
        const states: Record<string, boolean> = {}
        data.data.content.forEach((article) => {
          states[article.id] = article.isBookmarked
        })
        setBookmarkStates((prev) => ({ ...prev, ...states }))
      } else {
        throw new Error(data.message || "기사 목록을 불러오는데 실패했습니다")
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const searchArticles = async (keyword: string, page: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get<ArticleListResponse>(
        `/api/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=20`
      )

      if (data.success) {
        setArticles(data.data.content)
        setCurrentPage(data.data.currentPage)
        setTotalPages(data.data.totalPages)
        setTotalElements(data.data.totalElements)
        setHasNext(data.data.hasNext)
        setHasPrevious(data.data.hasPrevious)

        // API에서 받은 북마크 상태로 초기화
        const states: Record<string, boolean> = {}
        data.data.content.forEach((article) => {
          states[article.id] = article.isBookmarked
        })
        setBookmarkStates((prev) => ({ ...prev, ...states }))
      } else {
        throw new Error(data.message || "기사 검색에 실패했습니다")
      }
    } catch (err) {
      console.error("Failed to search articles:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecommendedArticlesList = async (page: number) => {
    setIsRecommendedLoading(true)
    setRecommendedError(null)

    try {
      const response = await fetchRecommendedArticles(page, 20)

      if (response.success) {
        setRecommendedArticles(response.data.content)
        setRecommendedCurrentPage(response.data.currentPage)
        setRecommendedTotalPages(response.data.totalPages)
        setRecommendedTotalElements(response.data.totalElements)
        setRecommendedHasNext(response.data.hasNext)
        setRecommendedHasPrevious(response.data.hasPrevious)
      } else {
        throw new Error(response.message || "추천 기사를 불러오는데 실패했습니다")
      }
    } catch (err) {
      console.error("Failed to fetch recommended articles:", err)
      setRecommendedError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsRecommendedLoading(false)
    }
  }

  const fetchBookmarksList = async (page: number) => {
    setIsBookmarksLoading(true)
    setBookmarksError(null)

    try {
      const response = await fetchBookmarks(page, 30)

      if (response.success) {
        setBookmarkedArticles(response.data.content)
        setBookmarksCurrentPage(response.data.number) // Spring의 number 필드 사용
        setBookmarksTotalPages(response.data.totalPages)
        setBookmarksTotalElements(response.data.totalElements)
        setBookmarksHasNext(!response.data.last) // last가 false면 다음 페이지 있음
        setBookmarksHasPrevious(!response.data.first) // first가 false면 이전 페이지 있음

        // 북마크 상태 업데이트
        const states: Record<string, boolean> = {}
        response.data.content.forEach((article) => {
          states[article.id] = true
        })
        setBookmarkStates((prev) => ({ ...prev, ...states }))
      } else {
        throw new Error(response.message || "북마크 목록을 불러오는데 실패했습니다")
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err)
      setBookmarksError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsBookmarksLoading(false)
    }
  }

  const handleToggleBookmark = async (articleId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "북마크 기능을 사용하려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const isCurrentlyBookmarked = bookmarkStates[articleId]

    try {
      if (isCurrentlyBookmarked) {
        await removeBookmark(articleId)
        setBookmarkStates((prev) => ({ ...prev, [articleId]: false }))
        toast({
          title: "북마크 해제",
          description: "북마크가 해제되었습니다.",
        })

        // 북마크 탭이라면 목록에서 제거
        if (activeTab === "bookmarks") {
          fetchBookmarksList(bookmarksCurrentPage)
        }
      } else {
        await addBookmark(articleId)
        setBookmarkStates((prev) => ({ ...prev, [articleId]: true }))
        toast({
          title: "북마크 추가",
          description: "북마크에 추가되었습니다.",
        })
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
      toast({
        title: "오류 발생",
        description: "북마크 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    if (activeTab === "all") {
      setCurrentPage(newPage)
    } else if (activeTab === "recommended") {
      setRecommendedCurrentPage(newPage)
    } else {
      setBookmarksCurrentPage(newPage)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchQuery("")
    setCurrentPage(0)
    setRecommendedCurrentPage(0)
    setBookmarksCurrentPage(0)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setCurrentPage(0)
      if (searchQuery) {
        searchArticles(searchQuery, 0)
      } else {
        fetchArticles(0)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 추천 기사와 북마크는 클라이언트 필터링 유지 (검색 API 미지원)
  const filteredRecommendedArticles = recommendedArticles.filter((article) => {
    if (!searchQuery) return true
    return article.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredBookmarkedArticles = bookmarkedArticles.filter((article) => {
    if (!searchQuery) return true
    return article.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">금융 학습 기사</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            전문가가 엄선한 금융 투자 기사들을 통해 체계적으로 학습하세요.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => handleTabChange("all")}
            className="flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            전체 기사
          </Button>
          <Button
            variant={activeTab === "recommended" ? "default" : "outline"}
            onClick={() => handleTabChange("recommended")}
            className="flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            추천 기사
          </Button>
          {isAuthenticated && (
            <Button
              variant={activeTab === "bookmarks" ? "default" : "outline"}
              onClick={() => handleTabChange("bookmarks")}
              className="flex items-center"
            >
              <Bookmark className="w-4 h-4 mr-2" />내 북마크
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="기사 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Results Header */}
        {activeTab === "all" && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {searchQuery ? (
                <>
                  검색 결과: <span className="font-semibold text-gray-900">{totalElements}</span>개의 기사
                </>
              ) : (
                <>
                  총 <span className="font-semibold text-gray-900">{totalElements}</span>개의 기사
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              페이지 {currentPage + 1} / {totalPages}
            </div>
          </div>
        )}

        {activeTab === "recommended" && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{recommendedTotalElements}</span>개의
              추천 기사
              {searchQuery && filteredRecommendedArticles.length !== recommendedArticles.length && (
                <span className="ml-2">
                  (검색 결과:{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredRecommendedArticles.length}
                  </span>
                  개)
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              페이지 {recommendedCurrentPage + 1} / {recommendedTotalPages}
            </div>
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{bookmarksTotalElements}</span>개의
              북마크
              {searchQuery && filteredBookmarkedArticles.length !== bookmarkedArticles.length && (
                <span className="ml-2">
                  (검색 결과:{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredBookmarkedArticles.length}
                  </span>
                  개)
                </span>
              )}
            </div>
            {bookmarksTotalPages > 0 && (
              <div className="text-sm text-gray-600">
                페이지 {bookmarksCurrentPage + 1} / {bookmarksTotalPages}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {(isLoading || isRecommendedLoading || isBookmarksLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">
              {activeTab === "bookmarks" ? "북마크를 불러오는 중..." : "기사를 불러오는 중..."}
            </span>
          </div>
        )}

        {/* Error State */}
        {((error && !isLoading && activeTab === "all") ||
          (recommendedError && !isRecommendedLoading && activeTab === "recommended") ||
          (bookmarksError && !isBookmarksLoading && activeTab === "bookmarks")) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">
              {activeTab === "all"
                ? error
                : activeTab === "recommended"
                  ? recommendedError
                  : bookmarksError}
            </p>
            <Button
              onClick={() => {
                if (activeTab === "all") fetchArticles(currentPage)
                else if (activeTab === "recommended")
                  fetchRecommendedArticlesList(recommendedCurrentPage)
                else fetchBookmarksList(bookmarksCurrentPage)
              }}
              variant="outline"
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* All Articles Grid */}
        {activeTab === "all" && !isLoading && !error && (
          <>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer relative group"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleToggleBookmark(article.id, e)}
                      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          bookmarkStates[article.id]
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Article Content */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 line-clamp-3 leading-tight pr-8">
                            {article.title}
                          </h3>
                        </div>

                        {/* Article Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>

                        {/* Read Button */}
                        <Button
                          className="w-full bg-blue-900 hover:bg-blue-800"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/articles/${article.id}`)
                          }}
                        >
                          기사 읽기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}

            {/* Pagination */}
            {articles.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevious || isLoading}
                >
                  이전
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i
                    } else if (currentPage < 3) {
                      pageNum = i
                    } else if (currentPage > totalPages - 3) {
                      pageNum = totalPages - 5 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum + 1}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext || isLoading}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}

        {/* Recommended Articles Grid */}
        {activeTab === "recommended" && !isRecommendedLoading && !recommendedError && (
          <>
            {filteredRecommendedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendedArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Article Content */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 line-clamp-3 leading-tight">
                            {article.title}
                          </h3>
                        </div>

                        {/* Article Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </span>
                          {article.press && (
                            <Badge variant="secondary" className="text-xs">
                              {article.press}
                            </Badge>
                          )}
                        </div>

                        {/* Read Button */}
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button className="w-full bg-blue-900 hover:bg-blue-800">
                            기사 읽기
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredRecommendedArticles.length > 0 && !searchQuery && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(recommendedCurrentPage - 1)}
                  disabled={!recommendedHasPrevious || isRecommendedLoading}
                >
                  이전
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, recommendedTotalPages) }, (_, i) => {
                    let pageNum: number
                    if (recommendedTotalPages <= 5) {
                      pageNum = i
                    } else if (recommendedCurrentPage < 3) {
                      pageNum = i
                    } else if (recommendedCurrentPage > recommendedTotalPages - 3) {
                      pageNum = recommendedTotalPages - 5 + i
                    } else {
                      pageNum = recommendedCurrentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={recommendedCurrentPage === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum + 1}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(recommendedCurrentPage + 1)}
                  disabled={!recommendedHasNext || isRecommendedLoading}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}

        {/* Bookmarked Articles Grid */}
        {activeTab === "bookmarks" && !isBookmarksLoading && !bookmarksError && (
          <>
            {filteredBookmarkedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarkedArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer relative group"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleToggleBookmark(article.id, e)}
                      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                    >
                      <Bookmark className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </button>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Article Content */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 line-clamp-3 leading-tight pr-8">
                            {article.title}
                          </h3>
                        </div>

                        {/* Article Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </span>
                          {article.category && (
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                          )}
                        </div>

                        {/* Read Button */}
                        <Button
                          className="w-full bg-blue-900 hover:bg-blue-800"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/articles/${article.id}`)
                          }}
                        >
                          기사 읽기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">아직 북마크한 기사가 없습니다</p>
                <p className="text-gray-400 text-sm">
                  관심있는 기사를 북마크하여 나중에 다시 읽어보세요
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredBookmarkedArticles.length > 0 && !searchQuery && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(bookmarksCurrentPage - 1)}
                  disabled={!bookmarksHasPrevious || isBookmarksLoading}
                >
                  이전
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, bookmarksTotalPages) }, (_, i) => {
                    let pageNum: number
                    if (bookmarksTotalPages <= 5) {
                      pageNum = i
                    } else if (bookmarksCurrentPage < 3) {
                      pageNum = i
                    } else if (bookmarksCurrentPage > bookmarksTotalPages - 3) {
                      pageNum = bookmarksTotalPages - 5 + i
                    } else {
                      pageNum = bookmarksCurrentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={bookmarksCurrentPage === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum + 1}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(bookmarksCurrentPage + 1)}
                  disabled={!bookmarksHasNext || isBookmarksLoading}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
