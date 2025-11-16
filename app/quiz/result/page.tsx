"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/layout/Header"
import { Trophy, Star, RotateCcw, Home } from "lucide-react"
import { QuizData } from "@/lib/types"

interface QuizResult {
  score: number
  totalQuestions: number
  quizData: QuizData
  userAnswers: number[]
}

interface TermStat {
  term: string
  correct: number
  total: number
  accuracy: number
}

export default function QuizResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [termStats, setTermStats] = useState<TermStat[]>([])

  useEffect(() => {
    const savedResult = sessionStorage.getItem("quizResult")
    if (savedResult) {
      const data = JSON.parse(savedResult) as QuizResult
      setResult(data)

      // 용어별 통계 계산
      if (data.quizData.quizzes) {
        calculateTermStats(data)
      }
    } else {
      router.push("/quiz")
    }
  }, [router])

  const calculateTermStats = (data: QuizResult) => {
    const statsMap = new Map<string, { correct: number; total: number }>()

    data.quizData.quizzes.forEach((quiz, index) => {
      const term = quiz.term || "기타"
      const isCorrect = data.userAnswers[index] === quiz.answerIndex

      if (!statsMap.has(term)) {
        statsMap.set(term, { correct: 0, total: 0 })
      }

      const stat = statsMap.get(term)!
      stat.total++
      if (isCorrect) stat.correct++
    })

    const stats: TermStat[] = Array.from(statsMap.entries()).map(([term, { correct, total }]) => ({
      term,
      correct,
      total,
      accuracy: (correct / total) * 100,
    }))

    setTermStats(stats)
  }

  if (!result) {
    return null
  }

  const accuracy = (result.score / result.totalQuestions) * 100
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0

  const handleRetry = () => {
    // 동일한 퀴즈 다시 풀기
    sessionStorage.setItem("currentQuiz", JSON.stringify(result.quizData))
    sessionStorage.removeItem("quizResult")
    router.push("/quiz/solve")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 점수 카드 */}
          <Card className="border-2 border-blue-200">
            <CardContent className="p-8 text-center space-y-4">
              {/* 트로피 아이콘 */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-yellow-600" />
                </div>
              </div>

              {/* 점수 */}
              <div>
                <p className="text-gray-600 mb-2">최종 점수</p>
                <p className="text-6xl font-bold text-blue-900">
                  {result.score} / {result.totalQuestions}
                </p>
              </div>

              {/* 정답률 */}
              <div>
                <p className="text-2xl font-semibold text-gray-700">
                  정답률 {accuracy.toFixed(1)}%
                </p>
              </div>

              {/* 별점 */}
              <div className="flex justify-center space-x-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* 격려 메시지 */}
              <p className="text-gray-600">
                {accuracy >= 90
                  ? "완벽합니다! 🎉"
                  : accuracy >= 70
                    ? "훌륭합니다! 👍"
                    : accuracy >= 50
                      ? "잘하셨습니다! 💪"
                      : "다시 도전해보세요! 📚"}
              </p>
            </CardContent>
          </Card>

          {/* 용어별 분석 (커스텀 퀴즈인 경우) */}
          {termStats.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">용어별 정답률</h2>

                <div className="space-y-4">
                  {termStats.map((stat) => (
                    <div key={stat.term} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{stat.term}</span>
                        <span className="text-sm text-gray-600">
                          {stat.correct} / {stat.total}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Progress value={stat.accuracy} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {stat.accuracy.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 버튼 그룹 */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleRetry}
              className="w-full"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              다시 풀기
            </Button>
            <Button
              size="lg"
              className="w-full bg-blue-900 hover:bg-blue-800"
              onClick={() => router.push("/quiz")}
            >
              <Home className="w-5 h-5 mr-2" />
              퀴즈 홈
            </Button>
          </div>

          {/* 학습 팁 카드 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">학습 팁</h4>
                  <p className="text-sm text-blue-800">
                    {accuracy < 70
                      ? "틀린 문제의 용어를 다시 한 번 복습해보세요. 원문 기사를 읽으며 개념을 확실히 이해하면 도움이 됩니다."
                      : "훌륭합니다! 더 어려운 난이도의 퀴즈에 도전해보세요."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
