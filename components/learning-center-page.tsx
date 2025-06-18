"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  ChevronRight,
  Newspaper,
  Volume2,
  Eye,
  Clock,
  BookOpen,
  Target,
  Award,
  BarChart3,
} from "lucide-react"
import DictionaryPage from "./dictionary-page"

interface LearningCenterPageProps {
  onNavigate: (page: string, articleId?: number) => void
}

export default function LearningCenterPage({ onNavigate }: LearningCenterPageProps) {
  const [activeTab, setActiveTab] = useState("articles")

  // 모의 데이터
  const recentArticles = [
    {
      id: 1,
      title: "2024년 하반기 투자 전략: ETF 중심 포트폴리오 구성법",
      difficulty: "intermediate",
      readTime: "8분",
      views: 1240,
      hasAudio: true,
      category: "투자전략",
    },
    {
      id: 2,
      title: "초보자를 위한 주식 기초: PER, PBR 이해하기",
      difficulty: "beginner",
      readTime: "5분",
      views: 2150,
      hasAudio: true,
      category: "기초지식",
    },
    {
      id: 3,
      title: "글로벌 경제 동향과 한국 증시 전망",
      difficulty: "advanced",
      readTime: "12분",
      views: 890,
      hasAudio: false,
      category: "시장분석",
    },
    {
      id: 4,
      title: "배당주 투자 전략: 안정적인 수익을 위한 종목 선택법",
      difficulty: "intermediate",
      readTime: "7분",
      views: 1450,
      hasAudio: true,
      category: "투자전략",
    },
    {
      id: 5,
      title: "경제지표 해석하기: GDP, 인플레이션, 금리의 관계",
      difficulty: "advanced",
      readTime: "10분",
      views: 980,
      hasAudio: false,
      category: "경제지표",
    },
    {
      id: 6,
      title: "ETF 투자 가이드: 초보자를 위한 종류별 특징",
      difficulty: "beginner",
      readTime: "6분",
      views: 1820,
      hasAudio: true,
      category: "ETF",
    },
  ]

  const quizzes = [
    { title: "ETF 기초 퀴즈", questions: 10, difficulty: "beginner", completed: true, score: 90 },
    { title: "배당주 투자 퀴즈", questions: 15, difficulty: "intermediate", completed: true, score: 85 },
    { title: "경제지표 해석 퀴즈", questions: 12, difficulty: "advanced", completed: false, score: null },
    { title: "부동산 투자 퀴즈", questions: 8, difficulty: "intermediate", completed: false, score: null },
    { title: "포트폴리오 관리 퀴즈", questions: 20, difficulty: "advanced", completed: false, score: null },
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

  if (activeTab === "dictionary") {
    return <DictionaryPage onNavigate={onNavigate} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">EconoEasy</span>
              </div>
            </button>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                로그인
              </Button>
              <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">학습센터</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              체계적인 커리큘럼으로 투자 전문가가 되어보세요. 기초부터 고급까지 단계별 학습을 제공합니다.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles" className="flex items-center space-x-1">
                <Newspaper className="w-4 h-4" />
                <span>기사</span>
              </TabsTrigger>
              <TabsTrigger value="dictionary" className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>용어사전</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>퀴즈</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      onNavigate("article-detail", article.id)
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {getDifficultyText(article.difficulty)}
                          </Badge>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {article.hasAudio && <Volume2 className="w-3 h-3" />}
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.views}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{article.title}</h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime}
                          </span>
                          <span>{article.category}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={() => onNavigate("articles")} className="bg-blue-900 hover:bg-blue-800">
                  전체 기사 보기
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-8">
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
                          {quiz.completed ? (quiz.title.includes("오답") ? "재도전하기" : "다시 풀기") : "시작하기"}
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
                      <div className="text-2xl font-bold text-blue-600">{quizStats.weeklyAccuracy}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">연속 정답</div>
                      <div className="text-2xl font-bold text-green-600">{quizStats.consecutiveCorrect}개</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">총 풀이</div>
                      <div className="text-2xl font-bold text-purple-600">{quizStats.totalQuestions}문제</div>
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
                            <Progress value={quiz.score} className="h-2" />
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
