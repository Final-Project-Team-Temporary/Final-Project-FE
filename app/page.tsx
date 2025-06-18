"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Target,
  ChevronRight,
  BarChart3,
  PieChart,
  Newspaper,
  DollarSign,
  Volume2,
  Eye,
  Clock,
} from "lucide-react"
import LoginPage from "@/components/login-page"
import SignupPage from "@/components/signup-page"
import ArticlesPage from "@/components/articles-page"
import ArticleDetailPage from "@/components/article-detail-page"
import MyPage from "@/components/mypage"
import LearningCenterPage from "@/components/learning-center-page"

export default function FinancialLearningPlatform() {
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedArticleId, setSelectedArticleId] = useState<number | undefined>()

  // 모의 데이터
  const portfolioData = {
    totalValue: 1250000,
    dailyChange: 25000,
    dailyChangePercent: 2.04,
    investments: [
      { name: "삼성전자", value: 450000, change: 2.3, color: "#28A745" },
      { name: "KODEX 200", value: 300000, change: -1.2, color: "#DC3545" },
      { name: "SK하이닉스", value: 250000, change: 3.1, color: "#28A745" },
      { name: "현금", value: 250000, change: 0, color: "#6C757D" },
    ],
  }

  const userStats = {
    articlesRead: 28,
    badges: 8,
    quizScore: 85,
    streak: 15,
  }

  const userPreferences = {
    keywords: ["ETF", "배당주", "부동산", "경제지표"],
    difficultyLevel: "intermediate",
  }

  const recommendedArticles = [
    {
      id: 1,
      title: "2024년 ETF 투자 전략: 분산투자의 핵심",
      difficulty: "intermediate",
      readTime: "7분",
      views: 1580,
      hasAudio: true,
      category: "ETF",
      keywords: ["ETF", "분산투자", "포트폴리오"],
      publishDate: "2024-01-15",
      summary: "사용자 설정 난이도에 맞춘 요약문...",
    },
    {
      id: 2,
      title: "고금리 시대, 배당주 투자로 안정적인 수익 확보",
      difficulty: "intermediate",
      readTime: "9분",
      views: 1320,
      hasAudio: false,
      category: "배당주",
      keywords: ["배당주", "고금리", "안정적인 수익"],
      publishDate: "2024-02-01",
      summary: "고금리 시대 배당주 투자 전략...",
    },
    {
      id: 3,
      title: "부동산 투자, 지금 시작해도 괜찮을까?",
      difficulty: "advanced",
      readTime: "15분",
      views: 980,
      hasAudio: true,
      category: "부동산",
      keywords: ["부동산", "투자", "시장 분석"],
      publishDate: "2024-02-15",
      summary: "최근 부동산 시장 동향 분석...",
    },
    {
      id: 4,
      title: "주요 경제지표 발표, 투자 전략에 미치는 영향",
      difficulty: "advanced",
      readTime: "12분",
      views: 1100,
      hasAudio: false,
      category: "경제지표",
      keywords: ["경제지표", "투자 전략", "시장 예측"],
      publishDate: "2024-03-01",
      summary: "주요 경제지표 발표가 투자에 미치는 영향...",
    },
  ]

  const learningProgress = {
    completedCourses: 12,
    totalCourses: 20,
    currentLevel: "Intermediate",
    badges: 8,
    streak: 15,
  }

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
      {/* 로그인/회원가입 페이지일 때는 독립적으로 표시 */}
      {currentPage === "login" && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === "signup" && <SignupPage onNavigate={setCurrentPage} />}
      {currentPage === "mypage" && <MyPage onNavigate={setCurrentPage} />}
      {currentPage === "learning" && <LearningCenterPage onNavigate={setCurrentPage} />}

      {/* 대시보드 관련 페이지들 */}
      {currentPage === "dashboard" && (
        <>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-blue-900">EconoEasy</span>
                  </div>
                </div>

                <nav className="hidden md:flex space-x-8">
                  <button
                    onClick={() => setSelectedTab("dashboard")}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === "dashboard" ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:text-blue-900"
                    }`}
                  >
                    대시보드
                  </button>
                  <button
                    onClick={() => setCurrentPage("learning")}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === "learning" ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:text-blue-900"
                    }`}
                  >
                    학습센터
                  </button>
                  <button
                    onClick={() => setSelectedTab("simulation")}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === "simulation" ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:text-blue-900"
                    }`}
                  >
                    모의투자
                  </button>
                  <button
                    onClick={() => setSelectedTab("portfolio")}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === "portfolio" ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:text-blue-900"
                    }`}
                  >
                    포트폴리오
                  </button>
                </nav>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage("login")}>
                    로그인
                  </Button>
                  <Button size="sm" className="bg-blue-900 hover:bg-blue-800" onClick={() => setCurrentPage("signup")}>
                    회원가입
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage("mypage")}>
                    마이페이지
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {selectedTab === "dashboard" && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">안녕하세요, 김투자님!</h1>
                      <p className="text-blue-100">오늘도 현명한 투자 학습을 시작해보세요</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-200">연속 학습일</div>
                      <div className="text-3xl font-bold">{learningProgress.streak}일</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">총 자산</p>
                          <p className="text-2xl font-bold">₩{portfolioData.totalValue.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600">+{portfolioData.dailyChangePercent}%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">읽은 기사</p>
                          <p className="text-2xl font-bold">{userStats.articlesRead}</p>
                          <p className="text-sm text-gray-500">개 완독</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Newspaper className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">퀴즈 점수</p>
                          <p className="text-2xl font-bold">{userStats.quizScore}점</p>
                          <p className="text-sm text-gray-500">평균 점수</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">퀴즈 점수</p>
                          <p className="text-2xl font-bold">95</p>
                          <p className="text-sm text-gray-500">최근 퀴즈</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Portfolio Overview */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PieChart className="w-5 h-5 mr-2" />
                          포트폴리오 현황
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {portfolioData.investments.map((investment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: investment.color }} />
                                <span className="font-medium">{investment.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">₩{investment.value.toLocaleString()}</div>
                                <div
                                  className={`text-sm ${investment.change > 0 ? "text-green-600" : investment.change < 0 ? "text-red-600" : "text-gray-600"}`}
                                >
                                  {investment.change > 0 ? "+" : ""}
                                  {investment.change}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          포트폴리오 상세보기
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommended Articles */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Newspaper className="w-5 h-5 mr-2" />
                          맞춤 추천 기사
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                          선호 키워드: {userPreferences.keywords.join(", ")}
                        </div>

                        <div className="space-y-3">
                          {recentArticles.slice(0, 3).map((article, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setSelectedArticleId(article.id)
                                setCurrentPage("article-detail")
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm line-clamp-2">{article.title}</div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {article.category} • {article.readTime}
                                  </div>
                                </div>
                                <Badge className={getDifficultyColor(article.difficulty)} size="sm">
                                  {getDifficultyText(article.difficulty)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button
                          className="w-full bg-blue-900 hover:bg-blue-800"
                          onClick={() => setCurrentPage("articles")}
                        >
                          전체 기사 보기
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Newspaper className="w-5 h-5 mr-2" />
                        최신 금융 기사
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage("articles")}>
                        전체보기
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recentArticles.map((article) => (
                        <div
                          key={article.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedArticleId(article.id)
                            setCurrentPage("article-detail")
                          }}
                        >
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

                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{article.title}</h3>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime}
                            </span>
                            <span>{article.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === "learning" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">학습센터</h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    체계적인 커리큘럼으로 투자 전문가가 되어보세요. 기초부터 고급까지 단계별 학습을 제공합니다.
                  </p>
                </div>

                <div className="text-center">
                  <Button onClick={() => setCurrentPage("learning")} className="bg-blue-900 hover:bg-blue-800">
                    학습센터 바로가기
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {selectedTab === "simulation" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">모의투자</h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    실제 시장 데이터로 안전하게 투자를 연습해보세요. 가상 자금으로 실전 경험을 쌓을 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>모의투자 차트</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">실시간 차트가 여기에 표시됩니다</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">거래</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button className="bg-red-600 hover:bg-red-700">매도</Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">매수</Button>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">수량</label>
                          <input type="number" className="w-full p-2 border rounded-md" placeholder="0" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">가격</label>
                          <input type="number" className="w-full p-2 border rounded-md" placeholder="시장가" />
                        </div>

                        <Button className="w-full">주문하기</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">내 성과</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">총 수익률</span>
                          <span className="font-semibold text-green-600">+12.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">랭킹</span>
                          <span className="font-semibold">156위</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">거래 횟수</span>
                          <span className="font-semibold">23회</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "portfolio" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">포트폴리오</h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    나의 투자 현황을 한눈에 확인하고 최적화된 포트폴리오를 구성해보세요.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>자산 분배</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">포트폴리오 차트가 여기에 표시됩니다</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>보유 종목</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {portfolioData.investments.map((investment, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: investment.color }} />
                                <div>
                                  <div className="font-medium">{investment.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {Math.round((investment.value / portfolioData.totalValue) * 100)}% 비중
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">₩{investment.value.toLocaleString()}</div>
                                <div
                                  className={`text-sm ${investment.change > 0 ? "text-green-600" : investment.change < 0 ? "text-red-600" : "text-gray-600"}`}
                                >
                                  {investment.change > 0 ? "+" : ""}
                                  {investment.change}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>포트폴리오 요약</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900">
                            ₩{portfolioData.totalValue.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-700">총 자산</div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">일일 수익</span>
                            <span className="font-semibold text-green-600">
                              +₩{portfolioData.dailyChange.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">수익률</span>
                            <span className="font-semibold text-green-600">+{portfolioData.dailyChangePercent}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">투자 종목</span>
                            <span className="font-semibold">{portfolioData.investments.length - 1}개</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>AI 추천</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="text-sm font-medium text-yellow-800">리밸런싱 제안</div>
                          <div className="text-xs text-yellow-700 mt-1">현금 비중을 줄이고 ETF 투자를 늘려보세요</div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">분산 투자</div>
                          <div className="text-xs text-blue-700 mt-1">해외 ETF 추가로 지역 분산을 고려해보세요</div>
                        </div>

                        <Button className="w-full" variant="outline">
                          상세 분석 보기
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
      {currentPage === "articles" && (
        <ArticlesPage
          onNavigate={(page, articleId) => {
            setCurrentPage(page)
            if (articleId) setSelectedArticleId(articleId)
          }}
        />
      )}
      {currentPage === "article-detail" && (
        <ArticleDetailPage onNavigate={setCurrentPage} articleId={selectedArticleId} />
      )}
    </div>
  )
}
