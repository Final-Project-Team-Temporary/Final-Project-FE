"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/layout/Header"
import { Target, Award, BarChart3, BookOpen } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()

  // 모의 데이터
  const quizzes = [
    { title: "ETF 기초 퀴즈", questions: 10, difficulty: "beginner", completed: true, score: 90 },
    {
      title: "배당주 투자 퀴즈",
      questions: 15,
      difficulty: "intermediate",
      completed: true,
      score: 85,
    },
    {
      title: "경제지표 해석 퀴즈",
      questions: 12,
      difficulty: "advanced",
      completed: false,
      score: null,
    },
    {
      title: "부동산 투자 퀴즈",
      questions: 8,
      difficulty: "intermediate",
      completed: false,
      score: null,
    },
    {
      title: "포트폴리오 관리 퀴즈",
      questions: 20,
      difficulty: "advanced",
      completed: false,
      score: null,
    },
    { title: "주식 기초 퀴즈", questions: 10, difficulty: "beginner", completed: true, score: 95 },
  ]

  const personalizedQuizzes = [
    {
      title: "내 용어사전 복습 퀴즈",
      description: "저장한 용어들로 구성된 맞춤형 퀴즈",
      difficulty: "beginner",
      score: 95,
      progress: 95,
      completed: true,
    },
    {
      title: "오답 노트 재도전 퀴즈",
      description: "틀렸던 문제들로 구성된 복습 퀴즈",
      difficulty: "intermediate",
      score: 68,
      progress: 68,
      completed: true,
    },
    {
      title: "AI 추천 심화 퀴즈",
      description: "학습 패턴 기반 맞춤형 심화 퀴즈",
      difficulty: "advanced",
      score: null,
      progress: 0,
      completed: false,
    },
  ]

  const quizStats = {
    weeklyAccuracy: 87,
    consecutiveCorrect: 12,
    totalQuestions: 156,
    badges: ["ETF마스터", "차트분석가", "용어박사"],
    weakAreas: ["파생상품", "국제금융"],
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "초급"
      case "intermediate":
        return "중급"
      case "advanced":
        return "고급"
      default:
        return "기타"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">금융 퀴즈</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              다양한 퀴즈로 금융 지식을 테스트하고 실력을 향상시키세요.
            </p>
          </div>

          {/* 맞춤형 퀴즈 섹션 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              맞춤형 퀴즈
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personalizedQuizzes.map((quiz, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {getDifficultyText(quiz.difficulty)}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>

                    {quiz.completed ? (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>점수</span>
                          <span className="font-semibold text-green-600">{quiz.score}점</span>
                        </div>
                        <Progress value={quiz.progress} className="h-2" />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">아직 시도하지 않은 퀴즈입니다</p>
                      </div>
                    )}

                    <Button className="w-full" variant={quiz.completed ? "outline" : "default"}>
                      {quiz.completed
                        ? quiz.title.includes("오답")
                          ? "재도전하기"
                          : "다시 풀기"
                        : "시작하기"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 퀴즈 성과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                나의 퀴즈 성과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">이번 주 정답률</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {quizStats.weeklyAccuracy}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">연속 정답</div>
                  <div className="text-2xl font-bold text-green-600">
                    {quizStats.consecutiveCorrect}개
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">총 풀이</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {quizStats.totalQuestions}문제
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  획득 배지:
                  <div className="flex flex-wrap gap-2 ml-2">
                    {quizStats.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Target className="w-4 h-4 mr-2 text-red-500" />
                  약한 분야:
                  <div className="flex flex-wrap gap-2 ml-2">
                    {quizStats.weakAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 일반 퀴즈 섹션 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              주제별 퀴즈
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {getDifficultyText(quiz.difficulty)}
                      </Badge>
                      <div className="text-sm text-gray-500">{quiz.questions}문제</div>
                    </div>

                    <h3 className="font-semibold text-lg mb-3">{quiz.title}</h3>

                    {quiz.completed ? (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>점수</span>
                          <span className="font-semibold text-green-600">{quiz.score}점</span>
                        </div>
                        <Progress value={quiz.score || 0} className="h-2" />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">아직 시도하지 않은 퀴즈입니다</p>
                      </div>
                    )}

                    <Button className="w-full" variant={quiz.completed ? "outline" : "default"}>
                      {quiz.completed ? "다시 풀기" : "시작하기"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
