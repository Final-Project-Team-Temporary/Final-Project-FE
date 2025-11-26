"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Newspaper, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { fetchRecentlyViewedArticles } from "@/services/articles"
import { RecentlyViewedArticle } from "@/lib/types"

export default function RecentArticlesPanel() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [articles, setArticles] = useState<RecentlyViewedArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const loadRecentArticles = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetchRecentlyViewedArticles()
        if (response.success) {
          setArticles(response.data)
        } else {
          setError(response.message || "최근 읽은 기사를 불러오는데 실패했습니다.")
        }
      } catch (err) {
        console.error("Failed to load recent articles:", err)
        setError("최근 읽은 기사를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    loadRecentArticles()
  }, [isAuthenticated])

  // 로그인하지 않은 경우 패널을 표시하지 않음
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* 토글 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-0 z-40 bg-blue-900 hover:bg-blue-800 rounded-l-lg rounded-r-none shadow-lg"
        size="sm"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* 패널 */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "320px" }}
      >
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center text-lg">
              <Newspaper className="w-5 h-5 mr-2" />
              최근 읽은 기사
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto h-[calc(100%-5rem)]">
            {/* 로딩 상태 */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">불러오는 중...</p>
              </div>
            )}

            {/* 에러 상태 */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* 기사 목록 */}
            {!loading && !error && articles.length > 0 && (
              <div className="space-y-3">
                {articles.map((article) => (
                  <a
                    key={article.id}
                    href={`/articles/${article.id}/original`}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                  </a>
                ))}
              </div>
            )}

            {/* 기사가 없는 경우 */}
            {!loading && !error && articles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <Newspaper className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  아직 읽은 기사가 없습니다
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
