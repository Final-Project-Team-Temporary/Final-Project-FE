"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/Header"
import {
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
  Search,
  Filter,
  Zap,
  Download,
} from "lucide-react"
import TermDetailModal from "@/components/dictionary/TermDetailModal"

export default function LearningCenterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("articles")

  // 컴포넌트 내부에 state 추가
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 용어 카드 클릭 핸들러
  const handleTermClick = (term: any) => {
    setSelectedTerm({
      ...term,
      id: term.id || Math.random().toString(),
      savedDate: "2024-01-15",
      lastReviewDate: "2024-01-18",
      quizAttempts: 5,
      quizAccuracy: 85,
      relatedTerms: ["통화정책", "콜금리", "시중금리"],
      difficulty: "intermediate",
    })
    setIsModalOpen(true)
  }

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

  // 용어사전 데이터
  const dictionaryTerms = [
    {
      term: "ETF",
      definition:
        "Exchange Traded Fund의 줄임말로, 거래소에서 주식처럼 거래되는 인덱스 펀드입니다.",
      category: "펀드",
      saved: true,
    },
    {
      term: "PER",
      definition:
        "Price Earnings Ratio의 줄임말로, 주가수익비율을 의미합니다. 주가를 주당순이익으로 나눈 값입니다.",
      category: "지표",
      saved: false,
    },
    {
      term: "배당수익률",
      definition: "주식의 연간 배당금을 현재 주가로 나눈 비율로, 투자수익률의 한 지표입니다.",
      category: "지표",
      saved: true,
    },
    {
      term: "ROE",
      definition:
        "Return on Equity의 줄임말로, 자기자본이익률을 의미합니다. 기업의 자본 효율성을 나타내는 지표입니다.",
      category: "지표",
      saved: false,
    },
    {
      term: "분산투자",
      definition: "투자 위험을 줄이기 위해 여러 자산에 분산하여 투자하는 전략입니다.",
      category: "전략",
      saved: true,
    },
    {
      term: "리밸런싱",
      definition: "포트폴리오의 자산 비중을 원래 목표로 되돌리는 과정입니다.",
      category: "전략",
      saved: false,
    },
  ]

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
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">학습센터</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              체계적인 커리큘럼으로 투자 전문가가 되어보세요. 기초부터 고급까지 단계별 학습을
              제공합니다.
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
                    onClick={() => router.push(`/articles/${article.id}`)}
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

                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {article.title}
                        </h3>

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
                <Button
                  onClick={() => router.push("/articles")}
                  className="bg-blue-900 hover:bg-blue-800"
                >
                  전체 기사 보기
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dictionary" className="space-y-6">
              {/* 상단 학습 현황 대시보드 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {dictionaryTerms.filter((term) => term.saved).length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">저장한 용어</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-600 mt-1">이번 주 학습</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">5일</div>
                    <div className="text-sm text-gray-600 mt-1">연속 학습</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">85%</div>
                    <div className="text-sm text-gray-600 mt-1">퀴즈 정답률</div>
                  </div>
                </div>
              </div>

              {/* 고급 검색 및 필터 영역 */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* 검색바 */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="용어명, 설명, 카테고리로 검색..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>

                    {/* 필터 옵션들 */}
                    <div className="flex flex-wrap gap-3">
                      {/* 카테고리 필터 */}
                      <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">전체 카테고리</option>
                        <option value="펀드">펀드</option>
                        <option value="지표">지표</option>
                        <option value="전략">전략</option>
                        <option value="경제">경제</option>
                      </select>

                      {/* 학습 상태 필터 */}
                      <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">전체 상태</option>
                        <option value="mastered">완벽 이해 ✅</option>
                        <option value="learning">학습 중 🟡</option>
                        <option value="review">복습 필요 🔴</option>
                      </select>

                      {/* 저장 기간 필터 */}
                      <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">전체 기간</option>
                        <option value="today">오늘</option>
                        <option value="week">이번 주</option>
                        <option value="month">이번 달</option>
                      </select>

                      {/* 정렬 옵션 */}
                      <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="recent">최신순</option>
                        <option value="alphabet">가나다순</option>
                        <option value="quiz">퀴즈 성적순</option>
                        <option value="review">복습 필요순</option>
                      </select>
                    </div>

                    {/* 빠른 태그 필터 */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="px-3 py-1 cursor-pointer hover:bg-blue-50"
                      >
                        #오늘_학습
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1 cursor-pointer hover:bg-blue-50"
                      >
                        #퀴즈_오답
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1 cursor-pointer hover:bg-blue-50"
                      >
                        #자주_검색
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1 cursor-pointer hover:bg-blue-50"
                      >
                        #필수_용어
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 용어 카드 그리드 - 개선된 레이아웃 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dictionaryTerms
                  .filter((item) => item.saved)
                  .map((item, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-l-blue-500 cursor-pointer"
                      onClick={() => handleTermClick(item)}
                    >
                      <CardContent className="p-5">
                        {/* 카드 헤더 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{item.term}</h3>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                              {/* 학습 상태 표시 */}
                              <Badge
                                variant="outline"
                                className={
                                  index % 3 === 0
                                    ? "bg-green-50 text-green-700"
                                    : index % 3 === 1
                                      ? "bg-yellow-50 text-yellow-700"
                                      : "bg-red-50 text-red-700"
                                }
                              >
                                {index % 3 === 0
                                  ? "완벽 이해"
                                  : index % 3 === 1
                                    ? "학습 중"
                                    : "복습 필요"}
                              </Badge>
                            </div>
                          </div>
                          {/* 액션 버튼들 */}
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="p-1">
                              <BookOpen className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Target className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* 설명 */}
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.definition}</p>

                        {/* 카드 푸터 - 메타 정보 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            3일 전 저장
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            퀴즈 2회
                          </span>
                          <span className="flex items-center gap-1">
                            <Newspaper className="w-3 h-3" />
                            관련 기사 5
                          </span>
                        </div>

                        {/* 연관 용어 미리보기 */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">연관 용어</div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              주가
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              수익률
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              +2
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* 하단 액션 영역 */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  총 {dictionaryTerms.filter((term) => term.saved).length}개 용어 중{" "}
                  {dictionaryTerms.filter((term) => term.saved).length}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    내보내기
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    전체 퀴즈 시작
                  </Button>
                </div>
              </div>

              {/* 플로팅 액션 버튼 (빠른 복습) */}
              <div className="fixed bottom-8 right-8 z-50">
                <Button
                  className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
                  title="1분 빠른 복습"
                >
                  <Zap className="w-6 h-6" />
                </Button>
              </div>
              {selectedTerm && (
                <TermDetailModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  term={selectedTerm}
                />
              )}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
