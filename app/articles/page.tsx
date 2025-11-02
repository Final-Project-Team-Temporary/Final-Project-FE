"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Clock,
  Eye,
  Volume2,
  BookOpen,
  ArrowLeft,
  TrendingUp,
  Calendar,
  Tag,
  Loader2,
  User,
  LogOut,
} from "lucide-react"
import { ArticleSummary, ArticleListResponse } from "@/types/article"
import { useAuth } from "@/contexts/AuthContext"

export default function ArticlesPage() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [articles, setArticles] = useState<ArticleSummary[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // 백엔드에서 기사 목록 가져오기
  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage])

  const fetchArticles = async (page: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      const response = await fetch(`${backendUrl}/api/articles/summarized?page=${page}&size=20`)

      if (!response.ok) {
        throw new Error("기사 목록을 불러오는데 실패했습니다")
      }

      const data: ArticleListResponse = await response.json()

      if (data.success) {
        setArticles(data.data.content)
        setCurrentPage(data.data.currentPage)
        setTotalPages(data.data.totalPages)
        setTotalElements(data.data.totalElements)
        setHasNext(data.data.hasNext)
        setHasPrevious(data.data.hasPrevious)
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true
    return article.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">EconoEasy</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                    로그인
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-900 hover:bg-blue-800"
                    onClick={() => router.push("/signup")}
                  >
                    회원가입
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="w-4 h-4" />
                    <span>{user?.name || "사용자"}님</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/mypage")}>
                    마이페이지
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    로그아웃
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

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

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="기사 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{totalElements}</span>개의 기사
            {searchQuery && filteredArticles.length !== articles.length && (
              <span className="ml-2">
                (검색 결과:{" "}
                <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개)
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            페이지 {currentPage + 1} / {totalPages}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">기사를 불러오는 중...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <Button onClick={() => fetchArticles(currentPage)} variant="outline">
              다시 시도
            </Button>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !error && (
          <>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
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
                        </div>

                        {/* Read Button */}
                        <Button
                          className="w-full bg-blue-900 hover:bg-blue-800"
                          onClick={() => router.push(`/articles/${article.id}`)}
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
            {filteredArticles.length > 0 && !searchQuery && (
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
      </main>
    </div>
  )
}
