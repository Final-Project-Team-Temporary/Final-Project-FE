"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Clock, Eye, Volume2, BookOpen, ArrowLeft, TrendingUp, Calendar, Tag } from "lucide-react"

export default function ArticlesPage() {
  const router = useRouter()
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
  ]

  const categories = ["all", "주식", "ETF", "부동산", "채권", "암호화폐", "경제지표"]
  const difficulties = ["all", "beginner", "intermediate", "advanced"]

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

  const getCategoryText = (category: string) => {
    return category === "all" ? "전체" : category
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
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
                onClick={() => router.push("/")}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">EconoEasy</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                로그인
              </Button>
              <Button size="sm" className="bg-blue-900 hover:bg-blue-800" onClick={() => router.push("/signup")}>
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">금융 학습 기사</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            전문가가 엄선한 금융 투자 기사들을 통해 체계적으로 학습하세요. 
            난이도별, 카테고리별로 분류된 양질의 콘텐츠를 제공합니다.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="기사 제목, 내용, 키워드로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">카테고리:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {getCategoryText(category)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">난이도:</span>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedDifficulty === difficulty
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {difficulty === "all" ? "전체" : getDifficultyText(difficulty)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개의 기사
          </div>
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="views">조회순</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Article Header */}
                  <div className="flex items-center justify-between">
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

                  {/* Article Content */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {article.summary}
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1">
                    {article.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {/* Article Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(article.publishDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{article.author}</span>
                  </div>

                  {/* Read Button */}
                  <Button 
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    기사 읽기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            더 많은 기사 보기
          </Button>
        </div>
      </main>
    </div>
  )
}