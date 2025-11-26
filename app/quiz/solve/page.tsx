"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle2, XCircle, Clock } from "lucide-react"
import { QuizData, QuizQuestion } from "@/lib/types"
import { submitChallenge } from "@/services/quiz"
import { useToast } from "@/hooks/use-toast"

export default function QuizSolvePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [score, setScore] = useState(0)

  // 챌린지 타이머 관련
  const [isChallenge, setIsChallenge] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  // 퀴즈 데이터 불러오기
  useEffect(() => {
    const savedQuiz = sessionStorage.getItem("currentQuiz")
    const quizType = sessionStorage.getItem("quizType")

    if (savedQuiz) {
      const data = JSON.parse(savedQuiz) as QuizData
      setQuizData(data)

      // 챌린지인 경우 타이머 설정
      if (quizType === "challenge") {
        setIsChallenge(true)
        const startTime = parseInt(sessionStorage.getItem("challengeStartTime") || "0")
        const timeLimit = parseInt(sessionStorage.getItem("challengeTimeLimit") || "0")
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, timeLimit - elapsed)
        setRemainingTime(remaining)
      }
    } else {
      // 퀴즈 데이터가 없으면 선택 페이지로 리다이렉트
      router.push("/quiz")
    }
  }, [router])

  // 챌린지 타이머
  useEffect(() => {
    if (!isChallenge || remainingTime <= 0) return

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          // 시간 종료
          handleTimeUp()
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isChallenge, remainingTime])

  // 시간 종료 처리
  const handleTimeUp = async () => {
    toast({
      title: "시간 종료",
      description: "제한 시간이 종료되어 자동으로 제출됩니다.",
      variant: "destructive",
    })

    // 현재까지의 답안으로 자동 제출
    await handleChallengeSubmit([...userAnswers, selectedAnswer ?? -1])
  }

  // 챌린지 제출
  const handleChallengeSubmit = async (answers: number[]) => {
    const challengeId = parseInt(sessionStorage.getItem("challengeId") || "0")
    const startTime = parseInt(sessionStorage.getItem("challengeStartTime") || "0")
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    try {
      const result = await submitChallenge({
        challengeId,
        score,
        totalQuestions: quizData?.quizzes.length || 0,
        timeSpent,
        answers,
      })

      // 챌린지 결과를 sessionStorage에 저장
      sessionStorage.setItem("challengeResult", JSON.stringify(result))

      sessionStorage.removeItem("currentQuiz")
      sessionStorage.removeItem("challengeId")
      sessionStorage.removeItem("challengeStartTime")
      sessionStorage.removeItem("challengeTimeLimit")
      sessionStorage.removeItem("quizType")

      toast({
        title: "챌린지 제출 완료",
        description: `점수: ${result.score}/${result.totalQuestions} | 정확도: ${result.accuracy.toFixed(1)}% | 순위: ${result.rank}위`,
      })

      // 챌린지 페이지로 이동
      router.push("/quiz/challenge")
    } catch (error) {
      console.error("Failed to submit challenge:", error)
      toast({
        title: "제출 실패",
        description: "챌린지 제출에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  if (!quizData || !quizData.quizzes || quizData.quizzes.length === 0) {
    return null
  }

  const currentQuiz = quizData.quizzes[currentIndex]
  const progress = ((currentIndex + 1) / quizData.quizzes.length) * 100
  const isLastQuestion = currentIndex === quizData.quizzes.length - 1

  // 답안 제출
  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuiz.answerIndex
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setUserAnswers((prev) => [...prev, selectedAnswer])
    setShowExplanation(true)
  }

  // 다음 문제
  const handleNext = async () => {
    if (isLastQuestion) {
      // 챌린지인 경우
      if (isChallenge) {
        const allAnswers = [...userAnswers, selectedAnswer!]
        await handleChallengeSubmit(allAnswers)
        return
      }

      // 일반 퀴즈인 경우 - 결과 저장 후 결과 페이지로 이동
      const resultData = {
        score,
        totalQuestions: quizData.quizzes.length,
        quizData: {
          quizzes: quizData.quizzes,
          terms: quizData.terms,
          term: quizData.term,
        },
        userAnswers: [...userAnswers, selectedAnswer!],
      }

      try {
        sessionStorage.setItem("quizResult", JSON.stringify(resultData))
        sessionStorage.removeItem("currentQuiz")
        sessionStorage.removeItem("quizType")
        router.push("/quiz/result")
      } catch (error) {
        console.error("Failed to save quiz result:", error)
        // 에러 발생 시에도 결과 페이지로 이동하되, 최소 데이터만 전달
        const minimalData = {
          score,
          totalQuestions: quizData.quizzes.length,
        }
        sessionStorage.setItem("quizResult", JSON.stringify(minimalData))
        router.push("/quiz/result")
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  // 퀴즈 종료
  const handleExit = () => {
    if (confirm("퀴즈를 종료하시겠습니까? 진행 상황은 저장되지 않습니다.")) {
      sessionStorage.removeItem("currentQuiz")
      router.push("/quiz")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 - 고정 */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* 상단 바 */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={handleExit}>
              <X className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              {isChallenge && remainingTime > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold tabular-nums">
                    {Math.floor(remainingTime / 60000)}:
                    {String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, "0")}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} / {quizData.quizzes.length}
              </span>
            </div>
          </div>

          {/* 진행률 바 */}
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="space-y-6">
          {/* 문제 카드 */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* 용어 뱃지 */}
              {currentQuiz.term && (
                <Badge variant="secondary" className="text-sm">
                  📚 {currentQuiz.term}
                </Badge>
              )}

              {/* 문제 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {currentQuiz.question}
                </h2>
              </div>

              {/* 선택지 */}
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === currentQuiz.answerIndex

                  let buttonClass = "w-full justify-start text-left h-auto py-4 px-4 "

                  if (!showExplanation) {
                    // 제출 전
                    buttonClass += isSelected
                      ? "border-2 border-blue-600 bg-blue-50"
                      : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } else {
                    // 제출 후
                    if (isCorrect) {
                      buttonClass += "border-2 border-green-600 bg-green-50"
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-2 border-red-600 bg-red-50"
                    } else {
                      buttonClass += "border border-gray-200"
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !showExplanation && setSelectedAnswer(index)}
                      disabled={showExplanation}
                      className={`${buttonClass} rounded-lg transition-all flex items-center space-x-3`}
                    >
                      <span className="flex-1">{option}</span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 설명 카드 (제출 후) */}
          {showExplanation && (
            <Card
              className={
                selectedAnswer === currentQuiz.answerIndex
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  {selectedAnswer === currentQuiz.answerIndex ? (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      {selectedAnswer === currentQuiz.answerIndex ? "정답입니다!" : "틀렸습니다"}
                    </h3>
                    <p className="text-sm text-gray-700">{currentQuiz.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* 하단 버튼 - 고정 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            size="lg"
            className="w-full bg-blue-900 hover:bg-blue-800"
            onClick={showExplanation ? handleNext : handleSubmit}
            disabled={!showExplanation && selectedAnswer === null}
          >
            {showExplanation
              ? isLastQuestion
                ? "결과 보기"
                : "다음 문제"
              : "제출하기"}
          </Button>
        </div>
      </div>
    </div>
  )
}
