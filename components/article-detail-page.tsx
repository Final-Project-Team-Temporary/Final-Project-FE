"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  User,
  Tag,
  BookOpen,
  Play,
  Pause,
  TrendingUp,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Check,
  HelpCircle,
  Search,
  Target,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipProvider } from "@/components/ui/tooltip"

interface ArticleDetailPageProps {
  onNavigate: (page: string) => void
  articleId?: number
}

export default function ArticleDetailPage({ onNavigate, articleId }: ArticleDetailPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [readingProgress, setReadingProgress] = useState(35)
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate")
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)

  // 모의 기사 데이터 (실제로는 articleId로 조회)
  const article = {
    id: 1,
    title: "2024년 ETF 투자 전략: 분산투자의 핵심",
    difficulty: "intermediate",
    readTime: "7분",
    views: 1580,
    hasAudio: true,
    category: "ETF",
    keywords: ["ETF", "분산투자", "포트폴리오"],
    publishDate: "2024-01-15",
    author: "김투자",
    authorTitle: "투자 전문가",
    content: {
      beginner: `
        <h2>ETF란 무엇인가요?</h2>
        <p>ETF(Exchange Traded Fund)는 거래소에서 거래되는 펀드입니다. 쉽게 말해, 여러 주식을 한 번에 살 수 있는 바구니 같은 상품이에요.</p>
        
        <h2>왜 ETF에 투자해야 할까요?</h2>
        <p>1. <strong>분산투자 효과</strong>: 한 번의 거래로 여러 주식에 투자할 수 있어요.</p>
        <p>2. <strong>낮은 수수료</strong>: 일반 펀드보다 관리비용이 저렴합니다.</p>
        <p>3. <strong>투명성</strong>: 어떤 주식들이 들어있는지 매일 공개됩니다.</p>
        
        <h2>초보자를 위한 ETF 선택법</h2>
        <p>처음에는 KODEX 200이나 TIGER 200 같은 대표적인 ETF부터 시작해보세요. 이들은 한국의 대표 200개 기업에 투자하는 상품입니다.</p>
      `,
      intermediate: `
        <h2>ETF 투자 전략의 핵심</h2>
        <p>ETF(Exchange Traded Fund) 투자는 현대 포트폴리오 이론의 핵심인 분산투자를 효율적으로 실현할 수 있는 방법입니다.</p>
        
        <h2>자산 배분 전략</h2>
        <p>효과적인 ETF 포트폴리오 구성을 위해서는 다음과 같은 자산 배분을 고려해야 합니다:</p>
        <ul>
          <li><strong>국내 주식 ETF (40-50%)</strong>: KODEX 200, TIGER 200</li>
          <li><strong>해외 주식 ETF (30-40%)</strong>: KODEX 미국S&P500, TIGER 나스닥100</li>
          <li><strong>채권 ETF (10-20%)</strong>: KODEX 국고채, TIGER 회사채</li>
        </ul>
        
        <h2>리밸런싱 전략</h2>
        <p>분기별 또는 반기별로 목표 비중에 맞춰 포트폴리오를 재조정하는 것이 중요합니다. 이를 통해 위험을 관리하고 수익률을 최적화할 수 있습니다.</p>
      `,
      advanced: `
        <h2>고급 ETF 투자 전략</h2>
        <p>ETF를 활용한 고도화된 투자 전략은 팩터 투자, 섹터 로테이션, 그리고 헤징 전략을 포함합니다.</p>
        
        <h2>팩터 ETF 활용</h2>
        <p>스마트 베타 전략을 통해 시장 초과 수익을 추구할 수 있습니다:</p>
        <ul>
          <li><strong>밸류 팩터</strong>: 저PBR, 저PER 종목 중심</li>
          <li><strong>모멘텀 팩터</strong>: 상승 추세 종목 중심</li>
          <li><strong>퀄리티 팩터</strong>: 재무 건전성 우수 종목 중심</li>
          <li><strong>로우 볼라틸리티</strong>: 변동성이 낮은 종목 중심</li>
        </ul>
        
        <h2>글로벌 자산 배분</h2>
        <p>지역별, 통화별 분산을 통한 리스크 관리:</p>
        <ul>
          <li>선진국 vs 신흥국 비중 조절</li>
          <li>통화 헤지 vs 언헤지 전략 선택</li>
          <li>섹터별 글로벌 분산 투자</li>
        </ul>
        
        <h2>파생상품 ETF 활용</h2>
        <p>인버스 ETF와 레버리지 ETF를 활용한 헤징 및 수익 증대 전략을 구사할 수 있으나, 높은 리스크를 수반합니다.</p>
      `,
    },
  }

  // 기사에서 하이라이트할 금융 용어들
  const financialTerms = [
    {
      term: "ETF",
      description: "상장지수펀드로, 특정 지수나 자산을 추종하도록 설계된 펀드",
      saved: true,
    },
    {
      term: "분산투자",
      description: "여러 자산에 투자하여 위험을 분산시키는 투자 전략",
      saved: true,
    },
    {
      term: "리밸런싱",
      description: "포트폴리오의 자산 배분을 원래 목표 비중으로 재조정하는 과정",
      saved: true,
    },
    {
      term: "PER",
      description: "주가수익비율로, 주식의 가격이 기업의 수익에 비해 얼마나 비싼지 나타내는 지표",
      saved: false,
    },
    {
      term: "PBR",
      description: "주가순자산비율로, 주식의 가격이 기업의 순자산에 비해 얼마나 비싼지 나타내는 지표",
      saved: false,
    },
    {
      term: "베타계수",
      description: "개별 주식의 변동성이 시장 전체 변동성에 비해 얼마나 큰지를 나타내는 지표",
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

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying)
  }

  // 기사 내용에서 금융 용어를 하이라이트하는 함수
  const highlightTerms = (content: string) => {
    let highlightedContent = content

    financialTerms.forEach((termObj) => {
      const regex = new RegExp(`\\b${termObj.term}\\b`, "g")
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="term-highlight" data-term="${termObj.term}">${termObj.term}</span>`,
      )
    })

    return highlightedContent
  }

  // 하이라이트된 HTML을 렌더링하고 용어 클릭 이벤트 처리
  const renderHighlightedContent = () => {
    const content = article.content[selectedDifficulty as keyof typeof article.content]
    const highlightedContent = highlightTerms(content)

    return (
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.classList.contains("term-highlight")) {
            const term = target.getAttribute("data-term")
            setSelectedTerm(term)
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => onNavigate("articles")}
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

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-3 space-y-8">
            {/* Article Header */}
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {getDifficultyText(article.difficulty)}
                      </Badge>
                      <span className="text-sm text-gray-500">{article.category}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">{article.title}</h1>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{article.author}</div>
                        <div className="text-sm text-gray-500">{article.authorTitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.publishDate).toLocaleDateString("ko-KR")}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reading Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Audio Controls */}
                    {article.hasAudio && (
                      <div className="flex items-center space-x-2">
                        <Button onClick={handleAudioToggle} size="sm" variant="outline">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <span className="text-sm text-gray-600">음성 재생</span>
                      </div>
                    )}

                    {/* Difficulty Selector */}
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">난이도:</span>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">초급</option>
                        <option value="intermediate">중급</option>
                        <option value="advanced">고급</option>
                      </select>
                    </div>
                  </div>

                  {/* Reading Progress */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">읽기 진행률</span>
                    <div className="w-32">
                      <Progress value={readingProgress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{readingProgress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Content */}
            <Card>
              <CardContent className="p-8">
                <style jsx global>{`
                  .term-highlight {
                    background-color: rgba(59, 130, 246, 0.1);
                    border-bottom: 1px dashed #3b82f6;
                    cursor: pointer;
                    padding: 0 2px;
                    border-radius: 2px;
                    transition: background-color 0.2s;
                  }
                  .term-highlight:hover {
                    background-color: rgba(59, 130, 246, 0.2);
                  }
                `}</style>
                {renderHighlightedContent()}
              </CardContent>
            </Card>

            {/* Article Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      도움됨 (24)
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      공유하기
                    </Button>
                  </div>
                  <Button onClick={() => onNavigate("articles")}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    다른 기사 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 핵심 용어 사이드바 */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-600" />이 기사의 핵심 용어
                  </h3>

                  <div className="space-y-2">
                    {financialTerms.map((term, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedTerm(term.term)}
                      >
                        <div className="flex items-center">
                          {term.saved ? (
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-orange-500 mr-2" />
                          )}
                          <span>{term.term}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {term.saved ? "저장됨" : "새 용어"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    모든 용어 저장하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI 질문 */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    AI 질문창
                  </h3>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">"PER이 높으면 항상 나쁜 건가요?"</p>
                  </div>

                  <Button className="w-full bg-blue-900 hover:bg-blue-800">질문하기</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 용어 클릭 팝오버 */}
      {selectedTerm && (
        <TooltipProvider>
          <Popover open={!!selectedTerm} onOpenChange={(open) => !open && setSelectedTerm(null)}>
            <PopoverTrigger asChild>
              <div className="fixed inset-0 z-50" />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{selectedTerm}</h4>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTerm(null)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI에게 질문하기
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    용어사전에 저장
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    자세한 설명 보기
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    관련 퀴즈 풀기
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      )}
    </div>
  )
}
