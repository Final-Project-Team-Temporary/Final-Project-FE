"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  User,
  Settings,
  BookOpen,
  Target,
  Tag,
  Plus,
  X,
  Save,
  Edit,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react"

interface MyPageProps {
  onNavigate: (page: string) => void
}

export default function MyPage({ onNavigate }: MyPageProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")

  // 사용자 프로필 데이터
  const [userProfile, setUserProfile] = useState({
    name: "김투자",
    email: "kim.investor@econoeasy.com",
    joinDate: "2024-01-15",
    preferredDifficulty: "intermediate",
    keywords: ["ETF", "배당주", "부동산", "경제지표", "ESG투자"],
    investmentProfile: {
      experience: "intermediate",
      riskTolerance: "moderate",
      investmentGoals: ["장기 자산 증식", "안정적인 배당 수익", "인플레이션 헤지"],
      age: "30s",
    },
  })

  // 학습 통계
  const learningStats = {
    articlesRead: 28,
    totalReadingTime: "14시간 32분",
    averageQuizScore: 85,
    streak: 15,
    badges: [
      { name: "첫 기사 읽기", icon: "📖", earnedDate: "2024-01-16" },
      { name: "연속 7일 학습", icon: "🔥", earnedDate: "2024-01-22" },
      { name: "퀴즈 만점", icon: "🎯", earnedDate: "2024-01-25" },
      { name: "ETF 전문가", icon: "📊", earnedDate: "2024-02-01" },
      { name: "배당주 마스터", icon: "💰", earnedDate: "2024-02-10" },
      { name: "월간 독서왕", icon: "👑", earnedDate: "2024-02-15" },
      { name: "퀴즈 챔피언", icon: "🏆", earnedDate: "2024-02-20" },
      { name: "꾸준한 학습자", icon: "⭐", earnedDate: "2024-03-01" },
    ],
  }

  const availableKeywords = [
    "주식",
    "ETF",
    "배당주",
    "부동산",
    "REITs",
    "경제지표",
    "금리",
    "인플레이션",
    "암호화폐",
    "비트코인",
    "ESG투자",
    "친환경",
    "기술주",
    "성장주",
    "가치주",
    "채권",
    "원자재",
    "달러",
    "환율",
    "글로벌경제",
  ]

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "초급"
      case "intermediate":
        return "중급"
      case "advanced":
        return "고급"
      default:
        return "중급"
    }
  }

  const getRiskToleranceText = (risk: string) => {
    switch (risk) {
      case "conservative":
        return "안정형"
      case "moderate":
        return "중립형"
      case "aggressive":
        return "적극형"
      default:
        return "중립형"
    }
  }

  const getExperienceText = (exp: string) => {
    switch (exp) {
      case "beginner":
        return "초보자 (1년 미만)"
      case "intermediate":
        return "중급자 (1-3년)"
      case "advanced":
        return "고급자 (3년 이상)"
      default:
        return "중급자"
    }
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !userProfile.keywords.includes(newKeyword.trim())) {
      setUserProfile((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setUserProfile((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // 여기서 실제 저장 로직 구현
    console.log("프로필 저장:", userProfile)
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
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}님의 마이페이지</h1>
            <p className="text-gray-600">
              가입일: {new Date(userProfile.joinDate).toLocaleDateString("ko-KR")} • 연속 학습 {learningStats.streak}일
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="preferences">설정</TabsTrigger>
              <TabsTrigger value="investment">투자 성향</TabsTrigger>
              <TabsTrigger value="achievements">성취</TabsTrigger>
            </TabsList>

            {/* 프로필 탭 */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      기본 정보
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "취소" : "편집"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{userProfile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{userProfile.email}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        취소
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 학습 통계 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    학습 통계
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{learningStats.articlesRead}</div>
                      <div className="text-sm text-gray-600">읽은 기사</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{learningStats.totalReadingTime}</div>
                      <div className="text-sm text-gray-600">총 학습 시간</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{learningStats.averageQuizScore}점</div>
                      <div className="text-sm text-gray-600">평균 퀴즈 점수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{learningStats.streak}일</div>
                      <div className="text-sm text-gray-600">연속 학습</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 설정 탭 */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    기사 요약 난이도 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>선호하는 기사 요약 난이도</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["beginner", "intermediate", "advanced"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setUserProfile((prev) => ({ ...prev, preferredDifficulty: level }))}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            userProfile.preferredDifficulty === level
                              ? "bg-blue-100 border-blue-500 text-blue-700"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">{getDifficultyText(level)}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {level === "beginner" && "쉬운 용어로 설명"}
                            {level === "intermediate" && "적당한 수준의 설명"}
                            {level === "advanced" && "전문적인 내용 포함"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    관심 키워드 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>현재 설정된 키워드</Label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                          <span>{keyword}</span>
                          <button onClick={() => handleRemoveKeyword(keyword)} className="ml-1 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>새 키워드 추가</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="키워드 입력..."
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                      />
                      <Button onClick={handleAddKeyword}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>추천 키워드</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableKeywords
                        .filter((keyword) => !userProfile.keywords.includes(keyword))
                        .slice(0, 10)
                        .map((keyword) => (
                          <button
                            key={keyword}
                            onClick={() =>
                              setUserProfile((prev) => ({
                                ...prev,
                                keywords: [...prev.keywords, keyword],
                              }))
                            }
                            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            + {keyword}
                          </button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 투자 성향 탭 */}
            <TabsContent value="investment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    투자 성향 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">투자 경험</Label>
                        <p className="text-lg font-semibold text-gray-900">
                          {getExperienceText(userProfile.investmentProfile.experience)}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">위험 성향</Label>
                        <p className="text-lg font-semibold text-gray-900">
                          {getRiskToleranceText(userProfile.investmentProfile.riskTolerance)}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">연령대</Label>
                        <p className="text-lg font-semibold text-gray-900">
                          {userProfile.investmentProfile.age === "30s" ? "30대" : userProfile.investmentProfile.age}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">투자 목표</Label>
                        <div className="space-y-2 mt-2">
                          {userProfile.investmentProfile.investmentGoals.map((goal, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-gray-900">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">맞춤 투자 조언</h4>
                    <p className="text-sm text-blue-800">
                      중급 투자자이면서 중립형 성향을 가지신 분께는 ETF를 활용한 분산투자를 추천드립니다. 안정적인 배당
                      수익과 장기 자산 증식을 목표로 하시는 만큼, 국내외 주식 ETF와 배당 ETF를 조합한 포트폴리오가
                      적합할 것 같습니다.
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    투자 성향 재진단하기
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 성취 탭 */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    획득한 배지
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {learningStats.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 text-center"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="font-medium text-gray-900 text-sm mb-1">{badge.name}</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(badge.earnedDate).toLocaleDateString("ko-KR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>학습 진행률</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>이번 달 목표 (20개 기사)</span>
                        <span>14/20</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>퀴즈 정답률</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>연속 학습 목표 (30일)</span>
                        <span>15/30</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
