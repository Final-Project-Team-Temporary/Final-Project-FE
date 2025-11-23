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
  FileText,
  Target,
  Tag,
  ChevronRight,
  Info,
} from "lucide-react"
import {
  ArticleDetail,
  ArticleDetailResponse,
  ArticleKeyword,
  ArticleStock,
  SummaryLevel,
} from "@/types/article"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import { addBookmark, removeBookmark } from "@/services/bookmarks"
import { useToast } from "@/hooks/use-toast"

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  const { isAuthenticated, user, logout } = useAuth()
  const { toast } = useToast()

  const [summaries, setSummaries] = useState<ArticleDetail[]>([])
  const [keywords, setKeywords] = useState<ArticleKeyword[]>([])
  const [stocks, setStocks] = useState<ArticleStock[]>([])
  const [selectedLevel, setSelectedLevel] = useState<SummaryLevel>("MEDIUM")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedKeyword, setSelectedKeyword] = useState<ArticleKeyword | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // 백엔드에서 기사 상세 정보 가져오기
  useEffect(() => {
    fetchArticleDetail()
  }, [articleId])

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "북마크 기능을 사용하려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    console.log("북마크 토글 - 현재 상태:", isBookmarked)
    setIsTogglingBookmark(true)
    try {
      if (isBookmarked) {
        console.log("북마크 해제 API 호출:", articleId)
        await removeBookmark(articleId)
        setIsBookmarked(false)
        toast({
          title: "북마크 해제",
          description: "북마크가 해제되었습니다.",
        })
      } else {
        console.log("북마크 추가 API 호출:", articleId)
        await addBookmark(articleId)
        setIsBookmarked(true)
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
    } finally {
      setIsTogglingBookmark(false)
    }
  }

  const fetchArticleDetail = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get<ArticleDetailResponse>(
        `/api/summarized-articles?originalArticleId=${articleId}`
      )

      if (data.success) {
        console.log("기사 상세 API 응답:", data.data)
        console.log("북마크 상태:", data.data.bookmarked)
        setSummaries(data.data.summaries)
        setKeywords(data.data.keywords || [])
        setStocks(data.data.stocks || [])
        // API에서 받은 북마크 상태 설정
        setIsBookmarked(data.data.isBookmarked || false)
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
                  <div className="flex items-center space-x-2 text-sm text-gray-700 mr-2">
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

                  {/* Action Bar - Bookmark & Share */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleBookmark}
                      disabled={isTogglingBookmark}
                      className={`${
                        isBookmarked
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                      {isBookmarked ? "북마크" : "북마크"}
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-gray-50">
                      <Share2 className="w-4 h-4 mr-2" />
                      공유
                    </Button>
                  </div>

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

            {/* Keywords Section */}
            {keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-xl">핵심 키워드</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    AI가 추출한 기사의 핵심 용어입니다. 클릭하면 설명을 볼 수 있습니다.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* 중복 제거 */}
                    {keywords
                      .filter(
                        (keyword, index, self) =>
                          index === self.findIndex((k) => k.term === keyword.term)
                      )
                      .map((keyword, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedKeyword(keyword)}
                          className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Tag className="w-4 h-4 text-orange-600" />
                              <span className="font-semibold text-gray-900">{keyword.term}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {keyword.termSummary}
                          </p>
                        </button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Stocks Section */}
            {stocks.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-xl">관련 주식</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    이 기사와 관련된 주요 주식 종목입니다.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stocks.map((stock, index) => (
                      <Card
                        key={index}
                        className="border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg mb-1">
                                {stock.stockName}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {stock.stockCode}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-700"
                                >
                                  {stock.market}
                                </Badge>
                              </div>
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">업종:</span> {stock.sector}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* View Original Article Button */}
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-between gap-4 h-full">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900">원문 기사</h4>
                        <p className="text-sm text-emerald-700">전체 내용 읽기</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/articles/${articleId}/original`)}
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      원문 기사 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Article Quiz Button */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-between gap-4 h-full">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900">AI 퀴즈</h4>
                        <p className="text-sm text-purple-700">내용 이해도 확인</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/articles/${articleId}/quiz`)}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      퀴즈 풀기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

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

      {/* Keyword Detail Modal */}
      {selectedKeyword && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedKeyword(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-6 h-6 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">{selectedKeyword.term}</h3>
              </div>
              <button
                onClick={() => setSelectedKeyword(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-800 leading-relaxed">{selectedKeyword.termSummary}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setSelectedKeyword(null)} variant="outline" className="flex-1">
                닫기
              </Button>
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700">용어집에 저장</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
