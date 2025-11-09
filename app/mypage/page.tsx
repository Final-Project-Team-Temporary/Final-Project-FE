"use client"

import { useEffect, useState } from "react"
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
  Plus,
  Loader2,
  Tag,
  Sparkles,
} from "lucide-react"
import {
  addKeyword,
  deleteKeyword,
  fetchUserKeywords,
  fetchSuggestedKeywords,
} from "@/services/keywords"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/axios"

interface UserProfile {
  name: string
  email: string
  phone: string
  age: string
  investmentExperience: string
  riskTolerance: string
  investmentGoals: string[]
  interests: string[]
}

export default function MyPage() {
  const router = useRouter()
  const { toast } = useToast()
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

  // 키워드 관리 상태
  const [newKeyword, setNewKeyword] = useState("")
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false)
  const [isAddingKeyword, setIsAddingKeyword] = useState(false)

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
    loadUserKeywords()
    loadSuggestedKeywords()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await apiClient.get("/api/users/profile")
      console.log("User profile:", data)
      // TODO: 백엔드 응답에 따라 userProfile 상태 업데이트
      // if (data.success && data.data) {
      //   setUserProfile(data.data)
      // }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast({
        title: "프로필 불러오기 실패",
        description: "사용자 프로필을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 사용자 키워드 로드
  const loadUserKeywords = async () => {
    setIsLoadingKeywords(true)
    try {
      const keywords = await fetchUserKeywords()
      setUserProfile((prev) => ({
        ...prev,
        interests: keywords,
      }))
    } catch (error) {
      console.error("Failed to load user keywords:", error)
      toast({
        title: "키워드 불러오기 실패",
        description: "키워드 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingKeywords(false)
    }
  }

  // 추천 키워드 로드
  const loadSuggestedKeywords = async () => {
    try {
      const keywords = await fetchSuggestedKeywords()
      setSuggestedKeywords(keywords)
    } catch (error) {
      console.error("Failed to load suggested keywords:", error)
    }
  }

  // 키워드 추가
  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) {
      toast({
        title: "입력 오류",
        description: "키워드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (userProfile.interests.includes(newKeyword.trim())) {
      toast({
        title: "중복 키워드",
        description: "이미 추가된 키워드입니다.",
        variant: "destructive",
      })
      return
    }

    if (userProfile.interests.length >= 10) {
      toast({
        title: "키워드 제한",
        description: "키워드는 최대 10개까지 추가할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setIsAddingKeyword(true)
    try {
      const success = await addKeyword(newKeyword.trim())
      if (success) {
        // 백엔드에서 최신 키워드 목록 다시 불러오기
        await loadUserKeywords()
        setNewKeyword("")
        toast({
          title: "키워드 추가 완료",
          description: `"${newKeyword.trim()}" 키워드가 추가되었습니다.`,
        })
      } else {
        throw new Error("키워드 추가 실패")
      }
    } catch (error) {
      toast({
        title: "키워드 추가 실패",
        description: "키워드 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsAddingKeyword(false)
    }
  }

  // 키워드 삭제
  const handleDeleteKeyword = async (keyword: string) => {
    setIsLoadingKeywords(true)
    try {
      const success = await deleteKeyword(keyword)
      if (success) {
        // 백엔드에서 최신 키워드 목록 다시 불러오기
        await loadUserKeywords()
        toast({
          title: "키워드 삭제 완료",
          description: `"${keyword}" 키워드가 삭제되었습니다.`,
        })
      } else {
        throw new Error("키워드 삭제 실패")
      }
    } catch (error) {
      toast({
        title: "키워드 삭제 실패",
        description: "키워드 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingKeywords(false)
    }
  }

  // 추천 키워드에서 키워드 추가
  const handleAddSuggestedKeyword = async (keyword: string) => {
    if (userProfile.interests.includes(keyword)) {
      toast({
        title: "중복 키워드",
        description: "이미 추가된 키워드입니다.",
        variant: "destructive",
      })
      return
    }

    if (userProfile.interests.length >= 10) {
      toast({
        title: "키워드 제한",
        description: "키워드는 최대 10개까지 추가할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setIsAddingKeyword(true)
    try {
      const success = await addKeyword(keyword)
      if (success) {
        // 백엔드에서 최신 키워드 목록 다시 불러오기
        await loadUserKeywords()
        toast({
          title: "키워드 추가 완료",
          description: `"${keyword}" 키워드가 추가되었습니다.`,
        })
      } else {
        throw new Error("키워드 추가 실패")
      }
    } catch (error) {
      toast({
        title: "키워드 추가 실패",
        description: "키워드 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsAddingKeyword(false)
    }
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
                      selectedTab === "achievements"
                        ? "bg-blue-100 text-blue-900"
                        : "hover:bg-gray-100"
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
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
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

                  {/* Interests - Keyword Management */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-blue-600" />
                        관심 키워드
                      </h3>
                      <Badge variant="secondary">{userProfile.interests.length}/10</Badge>
                    </div>

                    {/* Add New Keyword */}
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="새 키워드 입력..."
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddKeyword()
                            }
                          }}
                          disabled={isAddingKeyword || userProfile.interests.length >= 10}
                        />
                        <Button
                          onClick={handleAddKeyword}
                          disabled={isAddingKeyword || userProfile.interests.length >= 10}
                          size="sm"
                        >
                          {isAddingKeyword ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              추가 중
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              추가
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Current Keywords */}
                    <div className="mb-6">
                      <Label className="text-sm text-gray-600 mb-2 block">내 키워드</Label>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.length === 0 ? (
                          <div className="text-sm text-gray-500 py-4">
                            등록된 키워드가 없습니다. 관심 있는 키워드를 추가해보세요.
                          </div>
                        ) : (
                          userProfile.interests.map((interest, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="pr-1 py-1 hover:bg-gray-100 transition-colors"
                            >
                              {interest}
                              <button
                                onClick={() => handleDeleteKeyword(interest)}
                                className="ml-2 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                                disabled={isLoadingKeywords}
                              >
                                <X className="w-3 h-3 text-gray-500 hover:text-red-600" />
                              </button>
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Suggested Keywords */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                        추천 키워드
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {suggestedKeywords
                          .filter((keyword) => !userProfile.interests.includes(keyword))
                          .map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                              onClick={() => handleAddSuggestedKeyword(keyword)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              {keyword}
                            </Badge>
                          ))}
                      </div>
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
                        <div className="text-2xl font-bold text-blue-600">
                          {learningStats.articlesRead}
                        </div>
                        <div className="text-sm text-gray-600">완독한 기사</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {learningStats.coursesCompleted}/{learningStats.totalCourses}
                        </div>
                        <div className="text-sm text-gray-600">완료한 강의</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {learningStats.quizScore}%
                        </div>
                        <div className="text-sm text-gray-600">평균 퀴즈 점수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {learningStats.streak}일
                        </div>
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
                        <span className="font-semibold">
                          {learningStats.points.toLocaleString()}P
                        </span>
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
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>강의 수강</span>
                          <span>1/2</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "50%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>퀴즈 도전</span>
                          <span>2/3</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: "67%" }}
                          ></div>
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
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
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
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                      >
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
