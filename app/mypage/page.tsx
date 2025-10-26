"use client"

import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/layout/Header"
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  BookOpen,
  Trophy,
  Target,
  Edit,
  Save,
  X,
} from "lucide-react"

interface UserProfile {
    name: string,
    email: string,
    phone: string,
    age: string,
    investmentExperience: string,
    riskTolerance: string,
    investmentGoals: string[],
    interests: string[],
}

export default function MyPage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTab, setSelectedTab] = useState("profile")

  // 모의 사용자 데이터
  const [userProfile, setUserProfile] = useState({
    name: "김투자",
    email: "kimtuza@example.com",
    phone: "010-1234-5678",
    age: "30대",
    investmentExperience: "중급자 (1-3년)",
    riskTolerance: "중립형 (적당한 위험 감수)",
    investmentGoals: ["장기 자산 증식", "은퇴 자금 마련"],
    interests: ["ETF", "주식", "부동산"],
  })

  const learningStats = {
    articlesRead: 28,
    coursesCompleted: 12,
    totalCourses: 20,
    quizScore: 85,
    streak: 15,
    badges: 8,
    points: 2340,
    rank: 156,
  }

  const achievements = [
    { title: "첫 걸음", description: "첫 번째 강의 완료", date: "2024-01-15" },
    { title: "꾸준함", description: "7일 연속 학습", date: "2024-01-20" },
    { title: "독서왕", description: "20개 기사 완독", date: "2024-02-01" },
  ]

    useEffect(() => {
        fetchProfile()
    }, [])

  const fetchProfile = async () => {

      // 현재 로그인 중인 사용자 정보를 넘김
      const authToken = localStorage.getItem("authToken");

      console.log(authToken)

      const response = await fetch("http://localhost:8080/api/users/profile", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
          }
      });

      const data = response.json();

      console.log(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          </div>
          <p className="text-gray-600">프로필 정보와 학습 현황을 확인하고 관리하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setSelectedTab("profile")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedTab === "profile" ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>프로필</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab("learning")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedTab === "learning" ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>학습 현황</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab("achievements")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedTab === "achievements" ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span>업적</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab("settings")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedTab === "settings" ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>설정</span>
                    </div>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTab === "profile" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>프로필 정보</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          취소
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          편집
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">이름</Label>
                        <Input
                          id="name"
                          value={userProfile.name}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                          id="email"
                          value={userProfile.email}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">전화번호</Label>
                        <Input
                          id="phone"
                          value={userProfile.phone}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">연령대</Label>
                        <Input
                          id="age"
                          value={userProfile.age}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Investment Profile */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">투자 프로필</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>투자 경험</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {userProfile.investmentExperience}
                        </div>
                      </div>
                      <div>
                        <Label>위험 성향</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {userProfile.riskTolerance}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Investment Goals */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">투자 목표</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.investmentGoals.map((goal, index) => (
                        <Badge key={index} variant="secondary">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Interests */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">관심 분야</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        취소
                      </Button>
                      <Button onClick={() => setIsEditing(false)}>
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedTab === "learning" && (
              <div className="space-y-6">
                {/* Learning Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>학습 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{learningStats.articlesRead}</div>
                        <div className="text-sm text-gray-600">완독한 기사</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {learningStats.coursesCompleted}/{learningStats.totalCourses}
                        </div>
                        <div className="text-sm text-gray-600">완료한 강의</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{learningStats.quizScore}%</div>
                        <div className="text-sm text-gray-600">평균 퀴즈 점수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{learningStats.streak}일</div>
                        <div className="text-sm text-gray-600">연속 학습일</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>레벨 & 랭킹</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>현재 레벨</span>
                        <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>포인트</span>
                        <span className="font-semibold">{learningStats.points.toLocaleString()}P</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>전체 랭킹</span>
                        <span className="font-semibold">{learningStats.rank}위</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>획득 배지</span>
                        <span className="font-semibold">{learningStats.badges}개</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>이번 주 목표</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>기사 읽기</span>
                          <span>3/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>강의 수강</span>
                          <span>1/2</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>퀴즈 도전</span>
                          <span>2/3</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {selectedTab === "achievements" && (
              <Card>
                <CardHeader>
                  <CardTitle>업적</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-yellow-800">{achievement.title}</h4>
                          <p className="text-sm text-yellow-700">{achievement.description}</p>
                          <p className="text-xs text-yellow-600 mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      알림 설정
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>새로운 기사 알림</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>학습 리마인더</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>마케팅 메일 수신</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      보안 설정
                    </h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        비밀번호 변경
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        2단계 인증 설정
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      계정 관리
                    </h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        결제 정보 관리
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                        계정 탈퇴
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}