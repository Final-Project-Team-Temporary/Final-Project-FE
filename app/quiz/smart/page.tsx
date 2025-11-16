"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { ArrowLeft, Sparkles, Loader2, Brain, TrendingUp, Clock } from "lucide-react"
import { createSmartQuiz } from "@/services/quiz"
import { useToast } from "@/hooks/use-toast"

export default function SmartQuizPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [totalQuestions, setTotalQuestions] = useState(10)
  const [isCreating, setIsCreating] = useState(false)

  // 퀴즈 시작
  const handleStartQuiz = async () => {
    setIsCreating(true)
    try {
      const quizData = await createSmartQuiz({ totalQuestions })

      // 퀴즈 데이터를 세션 스토리지에 저장
      sessionStorage.setItem("currentQuiz", JSON.stringify(quizData))
      sessionStorage.setItem("quizType", "smart")

      // 퀴즈 풀이 페이지로 이동
      router.push("/quiz/solve")
    } catch (error) {
      console.error("Failed to create smart quiz:", error)
      toast({
        title: "퀴즈 생성 실패",
        description: "AI 퀴즈를 생성하는데 실패했습니다. 다시 시도해주세요.",
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
              <h1 className="text-2xl font-bold text-gray-900">스마트 랜덤 모의고사</h1>
              <p className="text-gray-600">AI가 당신에게 필요한 문제를 자동으로 선정합니다</p>
            </div>
          </div>

          {/* AI 설명 카드 */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">AI 자동 선정 방식</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <Brain className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>최근 저장한 용어 중 복습이 필요한 항목 우선 선정</span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>과거 퀴즈에서 정답률이 낮았던 용어 포함</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>오랫동안 학습하지 않은 용어 자동 추가</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 문제 수 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>총 문제 수</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTotalQuestions(num)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      totalQuestions === num
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-3xl font-bold text-gray-900 mb-1">{num}</div>
                    <div className="text-sm text-gray-600">문제</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">예상 소요 시간</span>
                <Badge variant="secondary" className="text-base">
                  약 {Math.ceil(totalQuestions * 0.5)} 분
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 특징 안내 */}
          <Card>
            <CardHeader>
              <CardTitle>이런 점이 좋아요</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✨</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">자동 맞춤</h4>
                    <p className="text-sm text-gray-600">
                      용어를 직접 고르지 않아도 AI가 최적의 조합을 선택
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">약점 보완</h4>
                    <p className="text-sm text-gray-600">
                      틀렸던 문제와 오래된 용어를 우선적으로 복습
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">빠른 시작</h4>
                    <p className="text-sm text-gray-600">
                      복잡한 설정 없이 바로 퀴즈 시작
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">학습 분석</h4>
                    <p className="text-sm text-gray-600">
                      학습 패턴을 분석하여 효율적인 복습 제공
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시작 버튼 */}
          <Button
            size="lg"
            className="w-full bg-blue-900 hover:bg-blue-800"
            onClick={handleStartQuiz}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI가 퀴즈를 생성하는 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                스마트 퀴즈 시작하기 ({totalQuestions}문제)
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
