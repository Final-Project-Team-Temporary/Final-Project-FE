"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Clock, Eye, Volume2, BookOpen, ArrowLeft, TrendingUp, Calendar, Tag } from "lucide-react"

interface ArticlesPageProps {
  onNavigate: (page: string, articleId?: number) => void
}

export default function ArticlesPage({ onNavigate }: ArticlesPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  // 모의 기사 데이터
  const articles = [
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
      summary: "ETF를 활용한 효과적인 분산투자 전략에 대해 알아봅니다.",
      author: "김투자",
    },
    {
      id: 2,
      title: "배당주 투자의 모든 것: 안정적인 수익 창출법",
      difficulty: "beginner",
      readTime: "5분",
      views: 2340,
      hasAudio: true,
      category: "주식",
      keywords: ["배당주", "배당수익률", "안정투자"],
      publishDate: "2024-01-14",
      summary: "배당주 투자를 통한 안정적인 수익 창출 방법을 소개합니다.",
      author: "이경제",
    },
    {
      id: 3,
      title: "부동산 시장 전망과 REITs 투자 가이드",
      difficulty: "advanced",
      readTime: "12분",
      views: 890,
      hasAudio: false,
      category: "부동산",
      keywords: ["부동산", "REITs", "시장전망"],
      publishDate: "2024-01-13",
      summary: "2024년 부동산 시장 전망과 REITs 투자 전략을 분석합니다.",
      author: "박부동산",
    },
    {
      id: 4,
      title: "경제지표 읽는 법: GDP, 인플레이션, 금리의 이해",
      difficulty: "intermediate",
      readTime: "9분",
      views: 1200,
      hasAudio: true,
      category: "경제지표",
      keywords: ["GDP", "인플레이션", "금리", "경제지표"],
      publishDate: "2024-01-12",
      summary: "주요 경제지표들의 의미와 투자에 미치는 영향을 설명합니다.",
      author: "최경제",
    },
    {
      id: 5,
      title: "암호화폐 시장 분석: 비트코인과 알트코인 전망",
      difficulty: "advanced",
      readTime: "15분",
      views: 3200,
      hasAudio: false,
      category: "암호화폐",
      keywords: ["비트코인", "알트코인", "블록체인"],
      publishDate: "2024-01-11",
      summary: "암호화폐 시장의 최신 동향과 투자 전략을 분석합니다.",
      author: "정블록체인",
    },
    {
      id: 6,
      title: "ESG 투자의 부상: 지속가능한 투자의 미래",
      difficulty: "beginner",
      readTime: "6분",
      views: 980,
      hasAudio: true,
      category: "ESG",
      keywords: ["ESG", "지속가능투자", "친환경"],
      publishDate: "2024-01-10",
      summary: "ESG 투자의 개념과 장기적 투자 가치에 대해 알아봅니다.",
      author: "한지속",
    },
  ]

  const categories = ["all", "ETF", "주식", "부동산", "경제지표", "암호화폐", "ESG"]

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

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || article.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
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
            </div>

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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">금융 기사</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              최신 금융 뉴스와 전문가 분석을 통해 투자 인사이트를 얻어보세요. 난이도별 맞춤 요약으로 쉽게 이해할 수
              있습니다.
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="제목이나 키워드로 검색하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">필터:</span>
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "전체 카테고리" : category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 난이도</option>
                    <option value="beginner">초급</option>
                    <option value="intermediate">중급</option>
                    <option value="advanced">고급</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  총 <span className="font-semibold">{filteredArticles.length}</span>개의 기사를 찾았습니다.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate("article-detail", article.id)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {getDifficultyText(article.difficulty)}
                      </Badge>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {article.hasAudio && <Volume2 className="w-3 h-3" />}
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">{article.title}</h3>

                    {/* Summary */}
                    <p className="text-gray-600 text-sm line-clamp-2">{article.summary}</p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1">
                      {article.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {keyword}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(article.publishDate).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <span>{article.author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보시거나 필터를 조정해보세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
