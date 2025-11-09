"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  User,
  TrendingUp,
  Loader2,
  LogOut,
  Bookmark,
  Share2,
  FileText,
  ExternalLink,
} from "lucide-react"
import { ArticleOriginal, ArticleOriginalResponse } from "@/types/article"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"

export default function ArticleOriginalPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id
  const { isAuthenticated, user, logout } = useAuth()

  const [article, setArticle] = useState<ArticleOriginal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // 백엔드에서 원문 기사 정보 가져오기
  useEffect(() => {
    fetchOriginalArticle()
  }, [articleId])

  const fetchOriginalArticle = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get<ArticleOriginalResponse>(`/api/articles/${articleId}`)

      if (data.success) {
        setArticle(data.data)
      } else {
        throw new Error(data.message || "원문 기사를 불러오는데 실패했습니다")
      }
    } catch (err) {
      console.error("Failed to fetch original article:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">EconoEasy</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                    로그인
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "bg-blue-50 text-blue-700" : ""}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                    북마크
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    공유
                  </Button>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 ml-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || "사용자"}님</span>
                  </div>
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">원문 기사를 불러오는 중...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <Button onClick={fetchOriginalArticle} variant="outline">
              다시 시도
            </Button>
          </div>
        )}

        {/* Article Content */}
        {!isLoading && !error && article && (
          <div className="space-y-6">
            {/* Article Header */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  {/* Category and Date */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      {article.category}
                    </Badge>
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {article.title}
                  </h1>

                  {/* Original Label */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-lg font-semibold text-emerald-900">원문 기사</span>
                    </div>
                    <p className="text-sm text-emerald-700 mt-1">
                      원본 기사의 전체 내용을 확인하실 수 있습니다
                    </p>
                  </div>

                  {/* Source URL (if available) */}
                  {article.sourceUrl && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">출처</span>
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        원본 사이트에서 보기
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Article Original Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push(`/articles/${articleId}`)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                요약본 보기
              </Button>
              <Button
                onClick={() => router.push("/articles")}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                기사 목록으로
              </Button>
            </div>

            {/* Info Card */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900 mb-1">학습 팁</h4>
                    <p className="text-sm text-emerald-800">
                      원문 기사를 읽으신 후, 요약본을 다시 확인하시면 주요 내용을 더 잘 이해하실 수
                      있습니다. 난이도별 요약과 함께 비교해보세요!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
