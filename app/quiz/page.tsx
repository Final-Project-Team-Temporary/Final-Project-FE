"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import { FileEdit, Sparkles, Target, Trophy } from "lucide-react"

export default function QuizModePage() {
  const router = useRouter()

  const quizModes = [
    {
      id: "custom",
      title: "커스텀 모의고사",
      description: "원하는 용어로 구성",
      icon: FileEdit,
      color: "text-blue-600",
      features: ["✓ 자유 선택", "✓ 2-10개 용어", "✓ 난이도 조절"],
      path: "/quiz/custom",
    },
    {
      id: "smart",
      title: "스마트 랜덤 모의고사",
      description: "AI가 자동 선정",
      icon: Sparkles,
      color: "text-blue-600",
      features: ["✓ AI 자동 구성", "✓ 복습 필요 용어", "✓ 10-20문제"],
      path: "/quiz/smart",
    },
    {
      id: "single",
      title: "단일 용어 집중 학습",
      description: "한 가지 용어 집중",
      icon: Target,
      color: "text-blue-600",
      features: ["✓ 1개 용어", "✓ 심화 학습", "✓ 3-5문제"],
      path: "/quiz/single",
    },
    {
      id: "challenge",
      title: "주간 챌린지",
      description: "다른 사용자와 경쟁",
      icon: Trophy,
      color: "text-blue-600",
      features: ["✓ 랭킹 시스템", "✓ 12문제", "✓ 10분 제한"],
      path: "/quiz/challenge",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 페이지 제목 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 모드 선택</h1>
            <p className="text-gray-600">학습 목적에 맞는 모드를 선택하세요</p>
          </div>

          {/* 모드 카드 그리드 */}
          <div className="grid md:grid-cols-2 gap-6">
            {quizModes.map((mode) => {
              const Icon = mode.icon
              return (
                <Card
                  key={mode.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(mode.path)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center ${mode.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{mode.title}</CardTitle>
                        <CardDescription>{mode.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {mode.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-blue-900 hover:bg-blue-800">
                      시작하기
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
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
                    처음에는 단일 용어 학습으로 개념을 확실히 다진 후, 커스텀 모의고사로 복습하는 것을 추천합니다.
                    주간 챌린지는 다른 사용자들과 실력을 겨루며 동기부여를 받을 수 있습니다.
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
