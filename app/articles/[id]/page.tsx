"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  BookOpen,
} from "lucide-react"
import { ArticleDetail, ArticleDetailResponse, SummaryLevel } from "@/types/article"
import { useAuth } from "@/contexts/AuthContext"

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id
  const { isAuthenticated, user, logout } = useAuth()

  const [summaries, setSummaries] = useState<ArticleDetail[]>([])
  const [selectedLevel, setSelectedLevel] = useState<SummaryLevel>("MEDIUM")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // 백엔드에서 기사 상세 정보 가져오기
  useEffect(() => {
    fetchArticleDetail()
  }, [articleId])

  const fetchArticleDetail = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      const response = await fetch(`${backendUrl}/api/articles/${articleId}`)

      if (!response.ok) {
        throw new Error("기사를 불러오는데 실패했습니다")
      }

      const data: ArticleDetailResponse = await response.json()

      if (data.success) {
        setSummaries(data.data.summaries)
      } else {
        throw new Error(data.message || "기사를 불러오는데 실패했습니다")
      }
    } catch (err) {
      console.error("Failed to fetch article detail:", err)
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

  const getLevelText = (level: SummaryLevel) => {
    switch (level) {
      case "EASY":
        return "쉬운 설명"
      case "MEDIUM":
        return "보통 설명"
      case "ADVANCED":
        return "자세한 설명"
      default:
        return level
    }
  }

  const getLevelIcon = (level: SummaryLevel) => {
    switch (level) {
      case "EASY":
        return "🌱"
      case "MEDIUM":
        return "🌿"
      case "ADVANCED":
        return "🌳"
      default:
        return ""
    }
  }

  const getLevelDescription = (level: SummaryLevel) => {
    switch (level) {
      case "EASY":
        return "초보자를 위한 쉽고 간단한 설명"
      case "MEDIUM":
        return "기본 지식을 가진 분들을 위한 설명"
      case "ADVANCED":
        return "전문적이고 상세한 내용"
      default:
        return ""
    }
  }

  // 선택된 난이도의 요약 가져오기
  const currentSummary = summaries.find((s) => s.summaryLevel === selectedLevel)
  const title = summaries[0]?.title || ""
  const publishedAt = summaries[0]?.publishedAt || ""
  const category = summaries[0]?.category || ""

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
            <span className="ml-3 text-gray-600">기사를 불러오는 중...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <Button onClick={fetchArticleDetail} variant="outline">
              다시 시도
            </Button>
          </div>
        )}

        {/* Article Content */}
        {!isLoading && !error && summaries.length > 0 && (
          <div className="space-y-6">
            {/* Article Header */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  {/* Category and Date */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      {category}
                    </Badge>
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">{title}</h1>

                  {/* Difficulty Level Selector */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">난이도 선택</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      본인의 수준에 맞는 설명을 선택하세요
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(["EASY", "MEDIUM", "ADVANCED"] as SummaryLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedLevel === level
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-3xl">{getLevelIcon(level)}</span>
                            <span className="font-semibold text-gray-900">
                              {getLevelText(level)}
                            </span>
                            <span className="text-xs text-gray-500 text-center">
                              {getLevelDescription(level)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Article Summary Content */}
            {currentSummary && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getLevelIcon(selectedLevel)}</span>
                    <CardTitle className="text-xl">{getLevelText(selectedLevel)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {currentSummary.summarizedContent}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">학습 팁</h4>
                    <p className="text-sm text-blue-800">
                      다양한 난이도의 설명을 비교해보세요. 처음에는 쉬운 설명으로 시작해서 점차
                      자세한 설명으로 넘어가면 이해가 더 잘 됩니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back to List Button */}
            <div className="text-center">
              <Button
                onClick={() => router.push("/articles")}
                variant="outline"
                size="lg"
                className="w-full md:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                기사 목록으로 돌아가기
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
