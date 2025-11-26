"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Header from "@/components/layout/Header"
import { ArrowLeft, Trophy, Clock, Users, Calendar, Loader2, Medal, Star, Award } from "lucide-react"
import { fetchWeeklyChallenge } from "@/services/quiz"
import { useToast } from "@/hooks/use-toast"
import { WeeklyChallengeResponse, ChallengeAttempt } from "@/lib/types"

export default function WeeklyChallengePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [challengeData, setChallengeData] = useState<WeeklyChallengeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResultModal, setShowResultModal] = useState(false)
  const [challengeResult, setChallengeResult] = useState<ChallengeAttempt | null>(null)

  // 주간 챌린지 데이터 불러오기
  useEffect(() => {
    loadChallengeData()
    checkChallengeResult()
  }, [])

  const loadChallengeData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWeeklyChallenge()
      setChallengeData(data)
    } catch (error) {
      console.error("Failed to load weekly challenge:", error)
      toast({
        title: "챌린지 로드 실패",
        description: "주간 챌린지를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 챌린지 결과 확인
  const checkChallengeResult = () => {
    const resultStr = sessionStorage.getItem("challengeResult")
    if (resultStr) {
      try {
        const result = JSON.parse(resultStr) as ChallengeAttempt
        setChallengeResult(result)
        setShowResultModal(true)
        sessionStorage.removeItem("challengeResult")
      } catch (error) {
        console.error("Failed to parse challenge result:", error)
      }
    }
  }

  // 챌린지 시작
  const handleStartChallenge = () => {
    if (!challengeData || !challengeData.quizzes) return

    // 챌린지 퀴즈 데이터 저장
    const quizData = {
      quizzes: challengeData.quizzes,
      generatedAt: new Date().toISOString(),
      totalQuestions: challengeData.challenge.totalQuestions,
    }

    sessionStorage.setItem("currentQuiz", JSON.stringify(quizData))
    sessionStorage.setItem("quizType", "challenge")
    sessionStorage.setItem("challengeId", challengeData.challenge.id.toString())
    sessionStorage.setItem("challengeStartTime", Date.now().toString())
    sessionStorage.setItem("challengeTimeLimit", (challengeData.challenge.timeLimit * 60 * 1000).toString())

    router.push("/quiz/solve")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">챌린지를 불러오는 중...</span>
          </div>
        </main>
      </div>
    )
  }

  if (!challengeData || !challengeData.challenge.isActive) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                진행 중인 챌린지가 없습니다
              </h2>
              <p className="text-gray-600 mb-6">
                새로운 주간 챌린지를 기다려주세요!
              </p>
              <Button onClick={() => router.push("/quiz")}>퀴즈 홈으로</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const { challenge, myAttempt, ranking, stats } = challengeData
  const hasAttempted = myAttempt !== null

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
              <h1 className="text-2xl font-bold text-gray-900">주간 챌린지</h1>
              <p className="text-gray-600">다른 사용자들과 실력을 겨루세요</p>
            </div>
          </div>

          {/* 챌린지 정보 카드 */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {challenge.weekStartDate} ~ {challenge.weekEndDate}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">문제 수</p>
                      <p className="text-lg font-bold text-gray-900">
                        {challenge.totalQuestions}문제
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">제한 시간</p>
                      <p className="text-lg font-bold text-gray-900">
                        {challenge.timeLimit}분
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">참여자</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.totalParticipants}명
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">평균 점수</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.averageScore.toFixed(1)}점
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 내 기록 (도전 완료한 경우) */}
          {hasAttempted && myAttempt && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="w-5 h-5 mr-2 text-yellow-600" />
                  내 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">점수</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {myAttempt.score}/{myAttempt.totalQuestions}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">정답률</p>
                    <p className="text-2xl font-bold text-green-600">
                      {myAttempt.accuracy.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">소요 시간</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.floor(myAttempt.timeSpent / 60)}분
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">순위</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {myAttempt.rank}등
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 랭킹 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                실시간 랭킹
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ranking.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  아직 참여한 사용자가 없습니다. 첫 번째 도전자가 되어보세요!
                </p>
              ) : (
                <div className="space-y-2">
                  {ranking.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        entry.rank <= 3
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-500 text-white"
                              : entry.rank === 2
                                ? "bg-gray-400 text-white"
                                : entry.rank === 3
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{entry.username}</p>
                          <p className="text-sm text-gray-600">
                            {Math.floor(entry.timeSpent / 60)}분 {entry.timeSpent % 60}초
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {entry.score}/{entry.totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600">{entry.accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 시작 버튼 또는 완료 메시지 */}
          {!hasAttempted ? (
            <>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">주의사항</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 시작 후 {challenge.timeLimit}분 이내에 완료해야 합니다</li>
                        <li>• 주간 챌린지는 1회만 도전할 수 있습니다</li>
                        <li>• 높은 점수와 빠른 시간이 랭킹에 반영됩니다</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                size="lg"
                className="w-full bg-blue-900 hover:bg-blue-800"
                onClick={handleStartChallenge}
              >
                <Trophy className="w-5 h-5 mr-2" />
                챌린지 시작하기 ({challenge.totalQuestions}문제, {challenge.timeLimit}분)
              </Button>
            </>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-900 mb-2">
                  이번 주 챌린지를 완료했습니다!
                </h3>
                <p className="text-sm text-green-800">
                  다음 주 새로운 챌린지에서 더 좋은 성적을 기대합니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* 챌린지 결과 모달 */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              챌린지 완료!
            </DialogTitle>
            <DialogDescription className="text-center">
              이번 주 챌린지에 참여해주셔서 감사합니다
            </DialogDescription>
          </DialogHeader>

          {challengeResult && (
            <div className="space-y-4">
              {/* 점수 */}
              <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {challengeResult.score}/{challengeResult.totalQuestions}
                </div>
                <div className="text-gray-600">획득 점수</div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                    <div className="text-xl font-bold text-gray-900">
                      {challengeResult.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">정확도</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-xl font-bold text-gray-900">
                      {Math.floor(challengeResult.timeSpent / 60)}:{String(challengeResult.timeSpent % 60).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-600">소요 시간</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-xl font-bold text-gray-900">{challengeResult.rank}위</div>
                    <div className="text-xs text-gray-600">순위</div>
                  </CardContent>
                </Card>
              </div>

              {/* 순위 메시지 */}
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Medal className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-yellow-900">
                  {challengeResult.rank <= 3
                    ? `🎉 TOP 3 달성! 축하합니다!`
                    : challengeResult.rank <= 10
                      ? `👏 TOP 10 진입! 대단합니다!`
                      : `💪 계속 도전해서 더 높은 순위를 달성해보세요!`}
                </p>
              </div>

              {/* 닫기 버튼 */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setShowResultModal(false)
                  loadChallengeData()
                }}
              >
                확인
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
