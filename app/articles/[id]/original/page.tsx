"use client"

import { useState, useEffect, useRef } from "react"
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
  Sparkles,
} from "lucide-react"
import { ArticleOriginal, ArticleOriginalResponse } from "@/types/article"
import { useAuth } from "@/contexts/AuthContext"
import apiClient from "@/lib/axios"
import TermExplanationModal from "@/components/dictionary/TermExplanationModal"
import { fetchTermDefinition } from "@/services/terms"
import { useToast } from "@/hooks/use-toast"

export default function ArticleOriginalPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id
  const { isAuthenticated, user, logout } = useAuth()

  const [article, setArticle] = useState<ArticleOriginal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // 텍스트 선택 관련 상태
  const [selectedText, setSelectedText] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [showModal, setShowModal] = useState(false)
  const [termExplanation, setTermExplanation] = useState("")
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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

  // 텍스트 선택 핸들러
  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()

    if (text && text.length > 0) {
      setSelectedText(text)

      // 선택 영역의 위치 계산
      const range = selection?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()

      if (rect) {
        setPopupPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        })
        setShowPopup(true)
      }
    } else {
      setShowPopup(false)
    }
  }

  // 설명 보기 핸들러
  const handleShowExplanation = async () => {
    if (!selectedText || isLoadingExplanation) return

    setIsLoadingExplanation(true)
    setShowPopup(false)

    try {
      const response = await fetchTermDefinition(selectedText)
      setTermExplanation(response.definition)
      setShowModal(true)
    } catch (error) {
      console.error("Failed to fetch term definition:", error)
      toast({
        title: "용어 설명 실패",
        description: "용어 설명을 가져오는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      setShowPopup(true) // 실패 시 팝업 다시 표시
    } finally {
      setIsLoadingExplanation(false)
    }
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedText("")
    setTermExplanation("")
  }

  // 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".text-selection-popup") && !target.closest(".article-content")) {
        setShowPopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
                  <div
                    ref={contentRef}
                    className="article-content text-gray-800 leading-relaxed whitespace-pre-wrap select-text"
                    onMouseUp={handleTextSelection}
                  >
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

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-1">학습 팁</h4>
                      <p className="text-sm text-emerald-800">
                        원문 기사를 읽으신 후, 요약본을 다시 확인하시면 주요 내용을 더 잘 이해하실
                        수 있습니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">AI 용어 설명</h4>
                      <p className="text-sm text-blue-800">
                        모르는 용어를 드래그하면 AI가 설명해드립니다. 나의 용어집에도 저장할 수
                        있어요!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* 텍스트 선택 팝업 */}
      {showPopup && (
        <div
          className="text-selection-popup fixed z-50 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
          }}
        >
          <Button
            onClick={handleShowExplanation}
            size="sm"
            className="bg-blue-900 hover:bg-blue-800 shadow-lg"
            disabled={isLoadingExplanation}
          >
            {isLoadingExplanation ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                설명 요청 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI 설명 보기
              </>
            )}
          </Button>
        </div>
      )}

      {/* 용어 설명 모달 */}
      <TermExplanationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedTerm={selectedText}
        explanation={termExplanation}
      />
    </div>
  )
}
