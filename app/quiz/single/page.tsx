"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { ArrowLeft, Target, Loader2, CheckCircle2 } from "lucide-react"
import { fetchUserTerms } from "@/services/terms"
import { fetchQuiz } from "@/services/quiz"
import { useToast } from "@/hooks/use-toast"
import { Term } from "@/lib/types"

export default function SingleTermQuizPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [userTerms, setUserTerms] = useState<Term[]>([])
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // 사용자 용어 목록 불러오기
  useEffect(() => {
    loadUserTerms()
  }, [])

  const loadUserTerms = async () => {
    setIsLoading(true)
    try {
      const response = await fetchUserTerms()
      if (response.success && response.data && Array.isArray(response.data)) {
        setUserTerms(response.data)
      } else {
        setUserTerms([])
      }
    } catch (error) {
      console.error("Failed to load user terms:", error)
      setUserTerms([])
      toast({
        title: "용어 목록 로드 실패",
        description: "저장된 용어를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 퀴즈 시작
  const handleStartQuiz = async () => {
    if (!selectedTerm) {
      toast({
        title: "용어 선택 필요",
        description: "학습할 용어를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const quizData = await fetchQuiz(selectedTerm)

      // 퀴즈 데이터를 세션 스토리지에 저장
      sessionStorage.setItem("currentQuiz", JSON.stringify(quizData))
      sessionStorage.setItem("quizType", "single")

      // 퀴즈 풀이 페이지로 이동
      router.push("/quiz/solve")
    } catch (error) {
      console.error("Failed to create quiz:", error)
      toast({
        title: "퀴즈 생성 실패",
        description: "퀴즈를 생성하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">단일 용어 집중 학습</h1>
              <p className="text-gray-600">하나의 용어를 깊이 있게 학습하세요</p>
            </div>
          </div>

          {/* 학습 방식 안내 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">집중 학습의 장점</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    한 가지 용어에 대해 3-5개의 다양한 문제를 풀면서 개념을 완벽하게 이해할 수 있습니다.
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 다양한 각도에서 용어 이해</li>
                    <li>• 관련 개념과 연결</li>
                    <li>• 실전 활용 방법 학습</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 용어 선택 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>학습할 용어 선택</CardTitle>
                {selectedTerm && (
                  <Badge variant="secondary" className="text-base">
                    선택됨
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 로딩 상태 */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">용어 목록을 불러오는 중...</span>
                </div>
              )}

              {/* 용어 목록이 비어있음 */}
              {!isLoading && (!userTerms || userTerms.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">저장된 용어가 없습니다</p>
                  <Button onClick={() => router.push("/dictionary")}>용어 사전으로 이동</Button>
                </div>
              )}

              {/* 용어 그리드 */}
              {!isLoading && userTerms && userTerms.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {userTerms.map((term) => {
                    const isSelected = selectedTerm === term.termName
                    return (
                      <button
                        key={term.userTermId}
                        onClick={() => setSelectedTerm(term.termName)}
                        className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{term.termName}</span>
                          {isSelected && (
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {term.termDescription}
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 예상 문제 수 */}
          {selectedTerm && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">선택한 용어</p>
                    <p className="text-lg font-bold text-gray-900">{selectedTerm}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">예상 문제 수</p>
                    <p className="text-lg font-bold text-blue-600">3-5문제</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 시작 버튼 */}
          <Button
            size="lg"
            className="w-full bg-blue-900 hover:bg-blue-800"
            onClick={handleStartQuiz}
            disabled={!selectedTerm || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                퀴즈 생성 중...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                집중 학습 시작하기
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
