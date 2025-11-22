"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Target, Check, X, Loader2, Trophy, RefreshCw, BookOpen } from "lucide-react"
import { fetchArticleQuiz } from "@/services/quiz"
import { ArticleQuizData, QuizQuestion } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ArticleQuizPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  // params.id를 문자열로 안전하게 파싱
  const getArticleId = (): string => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    return id || ""
  }

  const articleId = getArticleId()

  const [quizData, setQuizData] = useState<ArticleQuizData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!articleId) {
      toast({
        title: "잘못된 접근",
        description: "유효하지 않은 기사 ID입니다.",
        variant: "destructive",
      })
      router.push("/articles")
      return
    }
    loadQuiz()
  }, [articleId])

  const loadQuiz = async () => {
    setIsLoading(true)
    try {
      console.log("기사 기반 퀴즈 조회 요청: articleId=", articleId, "count=5")
      const data = await fetchArticleQuiz(articleId, 3)
      setQuizData(data)
      setUserAnswers(new Array(data.quizzes.length).fill(null))
    } catch (error) {
      console.error("Failed to load quiz:", error)
      toast({
        title: "퀴즈 로드 실패",
        description: "퀴즈를 불러오는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !quizData) return

    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = selectedAnswer
    setUserAnswers(newUserAnswers)
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (!quizData) return

    setShowExplanation(false)
    setSelectedAnswer(null)

    if (currentQuestionIndex < quizData.quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // 퀴즈 완료
      calculateScore()
      setIsQuizCompleted(true)
    }
  }

  const calculateScore = () => {
    if (!quizData) return

    let correctCount = 0
    userAnswers.forEach((answer, index) => {
      if (answer === quizData.quizzes[index].answerIndex) {
        correctCount++
      }
    })
    setScore(correctCount)
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers(new Array(quizData?.quizzes.length || 0).fill(null))
    setShowExplanation(false)
    setIsQuizCompleted(false)
    setScore(0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          <p className="text-gray-600 text-lg">AI가 퀴즈를 생성하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">퀴즈를 불러올 수 없습니다.</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quizData.quizzes[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizData.quizzes.length) * 100

  // 퀴즈 완료 화면
  if (isQuizCompleted) {
    const accuracy = Math.round((score / quizData.quizzes.length) * 100)
    const isPerfect = score === quizData.quizzes.length
    const isGood = accuracy >= 70

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Trophy Icon */}
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    isPerfect ? "bg-yellow-100" : isGood ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  <Trophy
                    className={`w-12 h-12 ${
                      isPerfect ? "text-yellow-600" : isGood ? "text-green-600" : "text-blue-600"
                    }`}
                  />
                </div>

                {/* Result Text */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isPerfect ? "완벽해요! 🎉" : isGood ? "잘하셨어요! 👏" : "좋은 시도였어요! 💪"}
                  </h2>
                  <p className="text-gray-600">
                    {isPerfect
                      ? "모든 문제를 맞히셨습니다!"
                      : isGood
                        ? "거의 다 맞히셨네요!"
                        : "다시 도전해보세요!"}
                  </p>
                </div>

                {/* Score Card */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-purple-600">{score}</div>
                        <div className="text-sm text-gray-600 mt-1">정답</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          {quizData.quizzes.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">총 문제</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                        <div className="text-sm text-gray-600 mt-1">정답률</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Wrong Answers Review */}
                {score < quizData.quizzes.length && (
                  <Card className="text-left">
                    <CardHeader>
                      <CardTitle className="text-lg">틀린 문제 복습</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {quizData.quizzes.map((q, index) => {
                        if (userAnswers[index] !== q.answerIndex) {
                          return (
                            <div key={index} className="p-4 bg-red-50 rounded-lg">
                              <p className="font-semibold text-gray-900 mb-2">
                                {index + 1}. {q.question}
                              </p>
                              <div className="space-y-1 text-sm">
                                <p className="text-red-600">
                                  내 답: {q.options[userAnswers[index] || 0]}
                                </p>
                                <p className="text-green-600">정답: {q.options[q.answerIndex]}</p>
                                {q.explanation && (
                                  <p className="text-gray-700 mt-2">💡 {q.explanation}</p>
                                )}
                              </div>
                            </div>
                          )
                        }
                        return null
                      })}
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleRetry}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    다시 풀기
                  </Button>
                  <Button
                    onClick={() => router.push(`/articles/${articleId}`)}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    기사 다시 보기
                  </Button>
                  <Button
                    onClick={() => router.push("/articles")}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    기사 목록으로
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 퀴즈 풀이 화면
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              기사 퀴즈
            </h1>
            <Badge variant="secondary" className="text-sm">
              {currentQuestionIndex + 1} / {quizData.quizzes.length}
            </Badge>
          </div>

          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              Q{currentQuestionIndex + 1}. {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === currentQuestion.answerIndex
                const showResult = showExplanation

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      showResult
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        : isSelected
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showExplanation && currentQuestion.explanation && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">💡 해설</p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Button */}
            <div className="pt-4">
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  정답 확인
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {currentQuestionIndex < quizData.quizzes.length - 1 ? "다음 문제" : "결과 보기"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
