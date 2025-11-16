"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/layout/Header"
import {
  Target,
  ChevronRight,
  Newspaper,
  Play,
  Youtube,
  Loader2,
  AlertCircle,
  FileEdit,
  Sparkles,
  Brain,
  Trophy,
} from "lucide-react"
import { VideoRecommendation } from "@/types/video"
import { fetchRecommendedVideos, getYoutubeThumbnail } from "@/services/videos"

export default function FinancialLearningPlatform() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  // 유튜브 영상 추천 상태
  const [recommendedVideos, setRecommendedVideos] = useState<VideoRecommendation[]>([])
  const [videoStats, setVideoStats] = useState({
    totalCount: 0,
    keywordBasedCount: 0,
    commonRecommendCount: 0,
  })
  const [videosLoading, setVideosLoading] = useState(false)
  const [videosError, setVideosError] = useState<string | null>(null)

  // 사용자 통계
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

  // 유튜브 영상 추천 API 호출
  useEffect(() => {
    const loadRecommendedVideos = async () => {
      setVideosLoading(true)
      setVideosError(null)

      try {
        // 사용자 키워드를 기반으로 유튜브 영상 추천
        const response = await fetchRecommendedVideos()
        setRecommendedVideos(response.data.videos)
        setVideoStats({
          totalCount: response.data.totalCount,
          keywordBasedCount: response.data.keywordBasedCount,
          commonRecommendCount: response.data.commonRecommendCount,
        })
      } catch (error) {
        console.error("Failed to load recommended videos:", error)
        setVideosError("유튜브 영상을 불러오는데 실패했습니다.")
      } finally {
        setVideosLoading(false)
      }
    }

    loadRecommendedVideos()
  }, []) // 컴포넌트 마운트 시 한 번만 실행

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">안녕하세요, {user?.name || "김투자"}님!</h1>
                <p className="text-blue-100">오늘도 현명한 투자 학습을 시작해보세요</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200">연속 학습일</div>
                <div className="text-3xl font-bold">{learningProgress.streak}일</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <p className="text-sm text-gray-600">연속 학습일</p>
                    <p className="text-2xl font-bold">{learningProgress.streak}일</p>
                    <p className="text-sm text-gray-500">학습 중</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Quiz Start */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  퀴즈 빠른 시작
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/quiz")}>
                  전체 보기
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                다양한 방식으로 학습한 내용을 복습하고 실력을 키워보세요
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 커스텀 모의고사 */}
                <div
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push("/quiz/custom")}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                    <FileEdit className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">커스텀 모의고사</h3>
                  <p className="text-xs text-gray-600 mb-3">원하는 용어로 자유롭게 구성</p>
                  <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-800">
                    시작하기
                  </Button>
                </div>

                {/* 스마트 랜덤 모의고사 */}
                <div
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push("/quiz/smart")}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">스마트 랜덤</h3>
                  <p className="text-xs text-gray-600 mb-3">AI가 자동으로 문제 선정</p>
                  <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-800">
                    시작하기
                  </Button>
                </div>

                {/* 단일 용어 집중 학습 */}
                <div
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push("/quiz/single")}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">단일 용어 학습</h3>
                  <p className="text-xs text-gray-600 mb-3">하나의 용어를 깊이 학습</p>
                  <Button size="sm" className="w-full bg-blue-900 hover:bg-blue-800">
                    시작하기
                  </Button>
                </div>

                {/* 주간 챌린지 */}
                <div
                  className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push("/quiz/challenge")}
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">주간 챌린지</h3>
                  <p className="text-xs text-gray-600 mb-3">다른 사용자와 경쟁하기</p>
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                    도전하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Newspaper className="w-5 h-5 mr-2" />
                  맞춤 추천 기사
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/articles")}>
                  전체 보기
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                선호 키워드: {userPreferences.keywords.join(", ")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:shadow-md transition-all"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {getDifficultyText(article.difficulty)}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{article.category}</span>
                      <span>👁 {article.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended YouTube Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Youtube className="w-5 h-5 mr-2 text-red-600" />
                  <span>추천 유튜브 영상</span>
                </div>
                <Badge variant="outline">
                  총 {videoStats.totalCount}개
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                선호 키워드를 기반으로 선별한 금융 학습 영상입니다
              </p>
              {videoStats.totalCount > 0 && (
                <div className="flex gap-2 mt-2">
                  {videoStats.keywordBasedCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      키워드 기반 {videoStats.keywordBasedCount}개
                    </Badge>
                  )}
                  {videoStats.commonRecommendCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      일반 추천 {videoStats.commonRecommendCount}개
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* 로딩 상태 */}
              {videosLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-3" />
                  <p className="text-sm text-gray-600">추천 영상을 불러오는 중...</p>
                </div>
              )}

              {/* 에러 상태 */}
              {videosError && !videosLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
                  <p className="text-sm text-red-600 mb-4">{videosError}</p>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    다시 시도
                  </Button>
                </div>
              )}

              {/* 영상 목록 */}
              {!videosLoading && !videosError && recommendedVideos.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {recommendedVideos.map((video) => (
                      <a
                        key={video.video_id}
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                      >
                        {/* 썸네일 */}
                        <div className="relative aspect-video bg-gray-200">
                          <img
                            src={getYoutubeThumbnail(video.video_id)}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          {/* 호버 시 재생 아이콘 */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        {/* 영상 정보 */}
                        <div className="p-3">
                          {/* 제목 */}
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {video.title}
                          </h3>

                          {/* 채널명 */}
                          <p className="text-xs text-gray-600">{video.channel}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* 더보기 버튼 */}
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://www.youtube.com/results?search_query=${userPreferences.keywords.join("+")}`,
                          "_blank"
                        )
                      }
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube에서 더 많은 영상 보기
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}

              {/* 영상이 없는 경우 */}
              {!videosLoading && !videosError && recommendedVideos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Youtube className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">추천할 영상이 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
