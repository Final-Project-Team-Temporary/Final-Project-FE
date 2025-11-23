"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { Search, BookOpen, Target, Clock, Loader2, X } from "lucide-react"
import TermDetailModal from "@/components/dictionary/TermDetailModal"
import { fetchUserTerms, searchTerms, fetchSearchSuggestions } from "@/services/terms"
import { useToast } from "@/hooks/use-toast"
import { Term } from "@/lib/types"

type SelectedTerm = {
  id: string
  term: string
  definition: string
  category: string
  savedDate: string
  lastReviewDate: string
  quizAttempts: number
  quizAccuracy: number
  relatedTerms: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function DictionaryPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [selectedTerm, setSelectedTerm] = useState<SelectedTerm | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isLoadingTerms, setIsLoadingTerms] = useState(false)
  const [userTerms, setUserTerms] = useState<Term[]>([])

  // 검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    loadUserTerms()
  }, [])

  const loadUserTerms = async () => {
    setIsLoadingTerms(true)
    try {
      const response = await fetchUserTerms()
      if (response?.data && Array.isArray(response.data)) {
        setUserTerms(response.data)
        setTotalElements(response.data.length)
      } else {
        setUserTerms([])
        setTotalElements(0)
      }
    } catch (error) {
      console.error("Failed to load user terms:", error)
      setUserTerms([])
      setTotalElements(0)
      toast({
        title: "용어 불러오기 실패",
        description: "저장한 용어를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingTerms(false)
    }
  }

  // 디바운싱된 검색 추천어 요청
  useEffect(() => {
    if (searchKeyword.trim().length === 0) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetchSearchSuggestions(searchKeyword)
        if (response.success && response.data.suggestions.length > 0) {
          setSearchSuggestions(response.data.suggestions)
          setShowSuggestions(true)
        } else {
          setSearchSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error)
        setSearchSuggestions([])
        setShowSuggestions(false)
      }
    }, 300) // 300ms 디바운싱

    return () => clearTimeout(timer)
  }, [searchKeyword])

  // 검색 실행
  const handleSearch = async (keyword: string, page: number = 0) => {
    if (!keyword.trim()) {
      loadUserTerms()
      return
    }

    setIsSearching(true)
    setShowSuggestions(false)
    try {
      const response = await searchTerms(keyword, page, 20)
      if (response.success) {
        setUserTerms(response.data.content)
        setCurrentPage(response.data.number)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Failed to search terms:", error)
      toast({
        title: "검색 실패",
        description: "용어 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setUserTerms([])
      setTotalElements(0)
    } finally {
      setIsSearching(false)
    }
  }

  // 검색어 입력 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  // 검색어 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchKeyword, 0)
  }

  // 추천 검색어 클릭
  const handleSuggestionClick = (suggestion: string) => {
    setSearchKeyword(suggestion)
    handleSearch(suggestion, 0)
  }

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchKeyword("")
    setSearchSuggestions([])
    setShowSuggestions(false)
    setCurrentPage(0)
    setTotalPages(0)
    loadUserTerms()
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    if (searchKeyword.trim()) {
      handleSearch(searchKeyword, page)
    } else {
      setCurrentPage(page)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleTermClick = (term: Term) => {
    setSelectedTerm({
      id: term.userTermId.toString(),
      term: term.termName,
      definition: term.termDescription,
      category: "금융",
      savedDate: formatDate(term.createdAt || ""),
      lastReviewDate: "-",
      quizAttempts: 5,
      quizAccuracy: 85,
      relatedTerms: ["통화정책", "콜금리", "시중금리"],
      difficulty: "intermediate",
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">나의 용어사전</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              저장한 금융 용어를 검색하고 학습하세요.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalElements}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {searchKeyword ? "검색 결과" : "저장한 용어"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalPages}</div>
                <div className="text-sm text-gray-600 mt-1">총 페이지</div>
              </div>
            </div>
          </div>

          {/* 검색 영역 */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="용어명으로 검색..."
                    value={searchKeyword}
                    onChange={handleSearchInputChange}
                    onFocus={() => {
                      if (searchSuggestions.length > 0) {
                        setShowSuggestions(true)
                      }
                    }}
                    className={`w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg ${
                      searchKeyword ? "pr-32" : "pr-24"
                    }`}
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "검색"}
                  </Button>
                </div>

                {/* 검색 추천어 드롭다운 */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-2">추천 검색어</div>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-2"
                        >
                          <Search className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* 검색 결과 표시 */}
          {searchKeyword && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                "{searchKeyword}" 검색 결과: {totalElements}개
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                <X className="w-4 h-4 mr-1" />
                초기화
              </Button>
            </div>
          )}

          {/* 로딩 상태 */}
          {isLoadingTerms || isSearching ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">
                {isSearching ? "검색 중..." : "용어를 불러오는 중..."}
              </span>
            </div>
          ) : (
            <>
              {/* 용어 목록 */}
              {userTerms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTerms.map((item) => (
                    <Card
                      key={item.userTermId}
                      className="hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-l-blue-500 cursor-pointer"
                      onClick={() => handleTermClick(item)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                              {item.termName}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              금융
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <BookOpen className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {item.termDescription}
                        </p>

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(item.createdAt)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    {searchKeyword ? "검색 결과가 없습니다" : "저장된 용어가 없습니다"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {searchKeyword
                      ? "다른 검색어로 시도해보세요"
                      : "기사를 읽으면서 용어를 저장해보세요"}
                  </p>
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
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
                    disabled={currentPage >= totalPages - 1}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              {searchKeyword ? `"${searchKeyword}" 검색 결과` : "전체 용어"}: {totalElements}개
            </div>
            <Button className="flex items-center gap-2" onClick={() => router.push("/quiz")}>
              <Target className="w-4 h-4" />
              퀴즈 학습
            </Button>
          </div>

          {selectedTerm && (
            <TermDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              term={selectedTerm}
            />
          )}
        </div>
      </main>
    </div>
  )
}
