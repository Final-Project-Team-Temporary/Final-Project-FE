"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { fetchUserTerms } from "@/services/terms"
import { createCustomQuiz } from "@/services/quiz"
import { useToast } from "@/hooks/use-toast"
import { Term } from "@/lib/types"

export default function CustomQuizPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [userTerms, setUserTerms] = useState<Term[]>([])
  const [selectedTerms, setSelectedTerms] = useState<string[]>([])
  const [questionsPerTerm, setQuestionsPerTerm] = useState(2)
  const [difficulty, setDifficulty] = useState("medium")
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

  // 용어 선택/해제
  const handleTermToggle = (term: string) => {
    setSelectedTerms((prev) => {
      if (prev.includes(term)) {
        return prev.filter((t) => t !== term)
      } else {
        if (prev.length >= 10) {
          toast({
            title: "선택 제한",
            description: "최대 10개까지 선택할 수 있습니다.",
            variant: "destructive",
          })
          return prev
        }
        return [...prev, term]
      }
    })
  }

  // 전체 선택
  const handleSelectAll = () => {
    const allTermNames = userTerms.slice(0, 10).map((t) => t.termName)
    setSelectedTerms(allTermNames)
  }

  // 전체 해제
  const handleDeselectAll = () => {
    setSelectedTerms([])
  }

  // 최근 5개 선택
  const handleSelectRecent = () => {
    const recentTermNames = userTerms.slice(0, 5).map((t) => t.termName)
    setSelectedTerms(recentTermNames)
  }

  // 퀴즈 시작
  const handleStartQuiz = async () => {
    if (selectedTerms.length < 2) {
      toast({
        title: "용어 선택 필요",
        description: "최소 2개 이상의 용어를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const quizData = await createCustomQuiz({
        terms: selectedTerms,
        questionsPerTerm,
        difficulty,
      })

      // 퀴즈 데이터를 세션 스토리지에 저장
      sessionStorage.setItem("currentQuiz", JSON.stringify(quizData))
      sessionStorage.setItem("quizType", "custom")

      // 퀴즈 풀이 페이지로 이동
      router.push("/quiz/solve")
    } catch (error) {
      console.error("Failed to create custom quiz:", error)
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">커스텀 모의고사 설정</h1>
              <p className="text-gray-600">원하는 용어를 선택하여 맞춤형 퀴즈를 만드세요</p>
            </div>
          </div>

          {/* 섹션 1: 용어 선택 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>용어 선택</CardTitle>
                <Badge variant="secondary" className="text-lg">
                  {selectedTerms.length} / 10
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 빠른 선택 버튼 */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  전체 해제
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  전체 선택
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectRecent}>
                  최근 5개
                </Button>
              </div>

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {userTerms.map((term) => {
                    const isSelected = selectedTerms.includes(term.termName)
                    return (
                      <button
                        key={term.userTermId}
                        onClick={() => handleTermToggle(term.termName)}
                        className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-sm">{term.termName}</span>
                          {isSelected && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 섹션 2: 각 용어당 문제 수 */}
          <Card>
            <CardHeader>
              <CardTitle>각 용어당 문제 수</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant={questionsPerTerm === num ? "default" : "outline"}
                    onClick={() => setQuestionsPerTerm(num)}
                    className={
                      questionsPerTerm === num ? "bg-blue-900 hover:bg-blue-800" : ""
                    }
                  >
                    {num}개
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                총 문제 수: {selectedTerms.length * questionsPerTerm}문제
              </p>
            </CardContent>
          </Card>

          {/* 섹션 3: 난이도 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>난이도</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "easy", label: "쉬움", color: "text-green-600" },
                  { value: "medium", label: "보통", color: "text-yellow-600" },
                  { value: "hard", label: "어려움", color: "text-red-600" },
                ].map((level) => (
                  <Button
                    key={level.value}
                    variant={difficulty === level.value ? "default" : "outline"}
                    onClick={() => setDifficulty(level.value)}
                    className={
                      difficulty === level.value ? "bg-blue-900 hover:bg-blue-800" : ""
                    }
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 시작 버튼 */}
          <Button
            size="lg"
            className="w-full bg-blue-900 hover:bg-blue-800"
            onClick={handleStartQuiz}
            disabled={selectedTerms.length < 2 || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                퀴즈 생성 중...
              </>
            ) : (
              `모의고사 시작하기 (${selectedTerms.length * questionsPerTerm}문제)`
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
