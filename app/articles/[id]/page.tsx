"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Clock,
  Eye,
  Volume2,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  TrendingUp,
  Play,
  Pause,
  Tag,
  CheckCircle,
} from "lucide-react"

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id
  
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(15)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  // 모의 기사 데이터
  const article = {
    id: parseInt(articleId as string),
    title: "2024년 ETF 투자 전략: 분산투자의 핵심",
    difficulty: "intermediate",
    readTime: "7분",
    views: 1580,
    likes: 234,
    comments: 45,
    hasAudio: true,
    category: "ETF",
    keywords: ["ETF", "분산투자", "포트폴리오"],
    publishDate: "2024-01-15",
    author: "김투자",
    authorTitle: "투자 전문가",
    content: `
      <h2>ETF란 무엇인가?</h2>
      <p>ETF(Exchange Traded Fund)는 거래소에서 거래되는 상장지수펀드로, 특정 지수의 성과를 추적하는 펀드입니다. 개별 주식처럼 실시간으로 거래할 수 있으면서도 펀드의 분산투자 효과를 누릴 수 있는 장점이 있습니다.</p>
      
      <h2>2024년 ETF 투자 전략</h2>
      <p>올해 ETF 투자 시 고려해야 할 주요 전략들을 살펴보겠습니다:</p>
      
      <h3>1. 섹터별 분산투자</h3>
      <p>기술주, 헬스케어, 에너지 등 다양한 섹터에 분산투자하여 리스크를 최소화하고 안정적인 수익을 추구할 수 있습니다.</p>
      
      <h3>2. 지역별 분산투자</h3>
      <p>국내뿐만 아니라 미국, 유럽, 아시아 등 다양한 지역의 ETF에 투자하여 글로벌 포트폴리오를 구성하는 것이 중요합니다.</p>
      
      <h3>3. 테마별 투자</h3>
      <p>ESG, 클린에너지, 인공지능 등 미래 성장 테마에 투자하는 것도 좋은 전략입니다.</p>
      
      <h2>ETF 투자 시 주의사항</h2>
      <p>ETF 투자 시에는 다음과 같은 사항들을 고려해야 합니다:</p>
      <ul>
        <li>운용보수와 추적오차 확인</li>
        <li>유동성과 거래량 체크</li>
        <li>기초자산의 특성 이해</li>
        <li>환율 리스크 고려 (해외 ETF의 경우)</li>
      </ul>
    `,
    relatedArticles: [
      { id: 2, title: "배당주 투자의 모든 것", category: "주식" },
      { id: 3, title: "부동산 REITs 투자 가이드", category: "부동산" },
      { id: 4, title: "채권 투자 기초", category: "채권" },
    ]
  }

  const quizQuestions = [
    {
      question: "ETF의 가장 큰 장점은 무엇인가요?",
      options: ["높은 수익률", "분산투자 효과", "무료 거래", "원금 보장"],
      correct: 1,
    },
    {
      question: "2024년 ETF 투자 전략으로 언급되지 않은 것은?",
      options: ["섹터별 분산투자", "지역별 분산투자", "단일 종목 집중투자", "테마별 투자"],
      correct: 2,
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">EconoEasy</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "bg-blue-50 text-blue-700" : ""}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                북마크
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader className="pb-6">
                <div className="space-y-4">
                  {/* Article Meta */}
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {getDifficultyText(article.difficulty)}
                    </Badge>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.publishDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {article.title}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{article.author}</div>
                      <div className="text-sm text-gray-500">{article.authorTitle}</div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-sm">
                        <Tag className="w-3 h-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {/* Audio Controls */}
                  {article.hasAudio && (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                      >
                        {isAudioPlaying ? (
                          <Pause className="w-4 h-4 mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {isAudioPlaying ? "일시정지" : "음성 재생"}
                      </Button>
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">AI 음성으로 기사를 들어보세요</span>
                    </div>
                  )}

                  {/* Reading Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>읽기 진행률</span>
                      <span>{readingProgress}%</span>
                    </div>
                    <Progress value={readingProgress} className="h-2" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <Separator className="my-8" />

                {/* Article Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? "bg-red-50 text-red-700" : ""}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                      {article.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {article.comments}
                    </Button>
                  </div>

                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setShowQuiz(true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    이해도 퀴즈
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Section */}
            {showQuiz && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    이해도 퀴즈
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {quizQuestions.map((quiz, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-medium">Q{index + 1}. {quiz.question}</h4>
                        <div className="space-y-2">
                          {quiz.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {optionIndex + 1}. {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full bg-blue-900 hover:bg-blue-800">
                      정답 확인
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Related Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">관련 기사</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {article.relatedArticles.map((related) => (
                      <div key={related.id} className="cursor-pointer group">
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{related.category}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">학습 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">28</div>
                      <div className="text-sm text-gray-500">완독한 기사</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-500">평균 퀴즈 점수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">15일</div>
                      <div className="text-sm text-gray-500">연속 학습일</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}