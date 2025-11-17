"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { Search, BookOpen, Target, Clock, Newspaper, Download, Zap } from "lucide-react"
import TermDetailModal from "@/components/dictionary/TermDetailModal"
import { fetchUserTerms } from "@/services/terms"
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

  useEffect(() => {
    loadUserTerms()
  }, [])

  const loadUserTerms = async () => {
    setIsLoadingTerms(true)
    try {
      const response = await fetchUserTerms()
      if (response?.data && Array.isArray(response.data)) {
        setUserTerms(response.data)
      } else {
        setUserTerms([])
      }
    } catch (error) {
      console.error("Failed to load user terms:", error)
      setUserTerms([])
      toast({
        title: "용어 불러오기 실패",
        description: "저장한 용어를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingTerms(false)
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">금융 용어사전</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              금융 투자에 필요한 핵심 용어들을 쉽게 이해하고 학습하세요.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userTerms?.length || 0}</div>
                <div className="text-sm text-gray-600 mt-1">저장한 용어</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600 mt-1">이번 주 학습</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">5일</div>
                <div className="text-sm text-gray-600 mt-1">연속 학습</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-gray-600 mt-1">퀴즈 정답률</div>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="용어명, 설명, 카테고리로 검색..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>전체 카테고리</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>전체 상태</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>전체 기간</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>최신순</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #오늘_학습
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #퀴즈_오답
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #자주_검색
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #필수_용어
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTerms.map((item, index) => (
              <Card
                key={item.userTermId}
                className="hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-l-blue-500 cursor-pointer"
                onClick={() => handleTermClick(item)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{item.termName}</h3>

                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          금융
                        </Badge>

                        <Badge
                          variant="outline"
                          className={
                            index % 3 === 0
                              ? "bg-green-50 text-green-700"
                              : index % 3 === 1
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                          }
                        >
                          {index % 3 === 0
                            ? "완벽 이해"
                            : index % 3 === 1
                              ? "학습 중"
                              : "복습 필요"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="p-1">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Target className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.termDescription}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 3일 전 저장
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" /> 퀴즈 2회
                    </span>
                    <span className="flex items-center gap-1">
                      <Newspaper className="w-3 h-3" /> 관련 기사 5
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">연관 용어</div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        주가
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        수익률
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +2
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">총 {userTerms?.length || 0}개 용어 표시</div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> 내보내기
              </Button>
              <Button className="flex items-center gap-2" onClick={() => router.push("/quiz")}>
                <Target className="w-4 h-4" />
                전체 퀴즈 시작
              </Button>
            </div>
          </div>
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
              title="1분 빠른 복습"
            >
              <Zap className="w-6 h-6" />
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
