"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, Search, BookOpen, Star, RefreshCw, Lightbulb, X, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

interface DictionaryPageProps {
  onNavigate: (page: string) => void
}

export default function DictionaryPage({ onNavigate }: DictionaryPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTerm, setSelectedTerm] = useState<FinancialTerm | null>(null)

  // 모의 데이터
  const categories = ["all", "주식", "채권", "ETF", "경제지표", "거시경제", "파생상품"]

  const terms: FinancialTerm[] = [
    {
      id: 1,
      name: "PER",
      fullName: "Price Earnings Ratio",
      description:
        "주가를 주당순이익으로 나눈 비율로, 주식이 얼마나 비싼지를 알아보는 지표입니다. PER이 낮을수록 상대적으로 저평가된 주식일 가능성이 높습니다.",
      example: "삼성전자의 PER은 15배로 업계 평균인 20배보다 낮아 상대적으로 저평가되어 있다.",
      difficulty: "beginner",
      category: "주식",
      relatedTerms: ["PBR", "EPS", "ROE", "주가", "저평가"],
      status: "new",
      isFavorite: false,
      learnedDate: "2024-06-15",
      koreanName: "주가수익비율",
    },
    {
      id: 2,
      name: "EBITDA",
      fullName: "Earnings Before Interest, Taxes, Depreciation and Amortization",
      description:
        "기업의 이자비용, 세금, 감가상각비, 무형자산상각비를 제외한 순이익으로, 기업의 실질적인 영업 성과를 평가하는 지표입니다.",
      example: "해당 기업의 EBITDA는 전년 대비 15% 증가하여 영업 실적이 개선되었음을 보여준다.",
      difficulty: "intermediate",
      category: "주식",
      relatedTerms: ["영업이익", "순이익", "감가상각", "기업가치"],
      status: "mastered",
      isFavorite: true,
      learnedDate: "2024-05-20",
      koreanName: "기업가치측정지표",
    },
    {
      id: 3,
      name: "CDS",
      fullName: "Credit Default Swap",
      description:
        "채권 발행자의 부도 위험을 거래하는 파생상품으로, CDS 스프레드가 높을수록 해당 발행자의 부도 위험이 높다고 평가됩니다.",
      example: "국가 CDS 스프레드가 상승하면 해당 국가의 국채 금리도 상승하는 경향이 있다.",
      difficulty: "advanced",
      category: "파생상품",
      relatedTerms: ["부도위험", "파생상품", "스프레드", "헤지", "신용등급"],
      status: "review",
      isFavorite: false,
      learnedDate: "2024-06-01",
      koreanName: "신용파생상품",
    },
    {
      id: 4,
      name: "ROE",
      fullName: "Return On Equity",
      description:
        "자기자본이익률로, 기업이 주주로부터 조달한 자본을 얼마나 효율적으로 사용하여 이익을 창출하는지 보여주는 지표입니다.",
      example: "A기업의 ROE는 15%로, 업계 평균 10%보다 높아 자본 효율성이 우수하다.",
      difficulty: "beginner",
      category: "주식",
      relatedTerms: ["ROA", "자기자본", "순이익", "수익성"],
      status: "mastered",
      isFavorite: false,
      learnedDate: "2024-04-10",
      koreanName: "자기자본이익률",
    },
    {
      id: 5,
      name: "베타계수",
      fullName: "Beta Coefficient",
      description:
        "개별 주식의 변동성이 시장 전체 변동성에 비해 얼마나 큰지를 나타내는 지표입니다. 베타가 1보다 크면 시장보다 변동성이 크고, 1보다 작으면 변동성이 작습니다.",
      example: "방어주는 일반적으로 베타계수가 1보다 낮아 시장 하락기에 상대적으로 안정적인 성과를 보인다.",
      difficulty: "intermediate",
      category: "주식",
      relatedTerms: ["변동성", "시스템적 위험", "알파", "샤프비율"],
      status: "mastered",
      isFavorite: false,
      learnedDate: "2024-05-05",
      koreanName: "베타계수",
    },
    {
      id: 6,
      name: "ETF",
      fullName: "Exchange Traded Fund",
      description: "특정 지수나 자산을 추종하도록 설계된 상장지수펀드로, 주식처럼 거래소에서 매매할 수 있습니다.",
      example: "KODEX 200은 한국의 대표적인 ETF로 코스피 200 지수를 추종한다.",
      difficulty: "beginner",
      category: "ETF",
      relatedTerms: ["인덱스펀드", "패시브투자", "추적오차", "분산투자"],
      status: "mastered",
      isFavorite: true,
      learnedDate: "2024-03-20",
      koreanName: "상장지수펀드",
    },
  ]

  const userStats = {
    totalTerms: 47,
    newTermsThisWeek: 8,
    needReview: 3,
    mastered: 44,
    progressPercentage: 89,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Lightbulb className="w-4 h-4 mr-1 text-blue-500" />
      case "review":
        return <RefreshCw className="w-4 h-4 mr-1 text-orange-500" />
      case "mastered":
        return null
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "새로 배움"
      case "review":
        return "복습 필요"
      case "mastered":
        return ""
      default:
        return ""
    }
  }

  const filteredTerms = terms.filter((term) => {
    const matchesSearch =
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleOpenTermDetail = (term: FinancialTerm) => {
    setSelectedTerm(term)
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
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">금융 용어사전</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              투자와 금융에 관한 핵심 용어들을 쉽게 이해하고 학습하세요. 용어를 클릭하면 상세 설명을 볼 수 있습니다.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="금융 용어를 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Learning Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  용어 학습 현황
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">총 학습한 용어</div>
                    <div className="text-2xl font-bold text-blue-900">{userStats.totalTerms}개</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">이번 주 신규</div>
                    <div className="text-2xl font-bold text-green-600">{userStats.newTermsThisWeek}개</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">복습 필요</div>
                    <div className="text-2xl font-bold text-orange-600">{userStats.needReview}개</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">마스터한 용어</div>
                    <div className="text-2xl font-bold text-purple-600">{userStats.mastered}개</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>학습 진행률</span>
                    <span>{userStats.progressPercentage}%</span>
                  </div>
                  <Progress value={userStats.progressPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category === "all" ? "전체" : category}
              </button>
            ))}
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <Card
                key={term.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleOpenTermDetail(term)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(term.difficulty)}>
                        {getDifficultyText(term.difficulty)}
                      </Badge>
                      {term.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{term.name}</h3>
                      <p className="text-gray-700">{term.koreanName}</p>
                    </div>

                    {getStatusIcon(term.status) && (
                      <div className="flex items-center text-sm">
                        {getStatusIcon(term.status)}
                        <span>{getStatusText(term.status)}</span>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full">
                      자세히 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보시거나 필터를 조정해보세요.</p>
            </div>
          )}
        </div>
      </main>

      {/* Term Detail Modal */}
      <Dialog open={!!selectedTerm} onOpenChange={(open) => !open && setSelectedTerm(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DialogTitle className="text-2xl">{selectedTerm?.name}</DialogTitle>
                <Badge className={selectedTerm ? getDifficultyColor(selectedTerm.difficulty) : ""}>
                  {selectedTerm ? getDifficultyText(selectedTerm.difficulty) : ""}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Star
                  className={`w-5 h-5 ${selectedTerm?.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                />
              </Button>
            </div>
            <p className="text-gray-600 mt-1">{selectedTerm?.fullName}</p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="flex items-center text-sm font-medium text-blue-700 mb-1">
                <Lightbulb className="w-4 h-4 mr-1" />
                AI 설명
              </div>
              <p className="text-gray-800">{selectedTerm?.description}</p>
            </div>

            <div>
              <div className="text-sm font-medium text-blue-700 mb-1">📝 예시 문장</div>
              <p className="text-gray-800 bg-blue-50 p-3 rounded-md">{selectedTerm?.example}</p>
            </div>

            <div>
              <div className="text-sm font-medium text-blue-700 mb-1">🔗 관련 용어</div>
              <div className="flex flex-wrap gap-2">
                {selectedTerm?.relatedTerms.map((term, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm font-medium text-blue-700 mb-2">💬 더 궁금한 점이 있나요?</div>
              <Button className="w-full bg-blue-900 hover:bg-blue-800">🤖 AI에게 질문하기</Button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                학습일: {selectedTerm?.learnedDate}
              </div>
              <div>학습 상태: ✅ 학습 완료</div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              복습하기
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              관련 퀴즈 풀기
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 타입 정의
interface FinancialTerm {
  id: number
  name: string
  fullName: string
  description: string
  example: string
  difficulty: string
  category: string
  relatedTerms: string[]
  status: string
  isFavorite: boolean
  learnedDate: string
  koreanName: string
}
