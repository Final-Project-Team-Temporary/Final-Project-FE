"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import {
  Search,
  BookOpen,
  Target,
  Clock,
  Newspaper,
  Download,
  Zap,
} from "lucide-react"
import TermDetailModal from "@/components/dictionary/TermDetailModal"

export default function DictionaryPage() {
  const router = useRouter()
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 용어 카드 클릭 핸들러
  const handleTermClick = (term: any) => {
    setSelectedTerm({
      ...term,
      id: term.id || Math.random().toString(),
      savedDate: "2024-01-15",
      lastReviewDate: "2024-01-18",
      quizAttempts: 5,
      quizAccuracy: 85,
      relatedTerms: ["통화정책", "콜금리", "시중금리"],
      difficulty: "intermediate",
    })
    setIsModalOpen(true)
  }

  // 용어사전 데이터
  const dictionaryTerms = [
    {
      term: "ETF",
      definition:
        "Exchange Traded Fund의 줄임말로, 거래소에서 주식처럼 거래되는 인덱스 펀드입니다.",
      category: "펀드",
      saved: true,
    },
    {
      term: "PER",
      definition:
        "Price Earnings Ratio의 줄임말로, 주가수익비율을 의미합니다. 주가를 주당순이익으로 나눈 값입니다.",
      category: "지표",
      saved: false,
    },
    {
      term: "배당수익률",
      definition: "주식의 연간 배당금을 현재 주가로 나눈 비율로, 투자수익률의 한 지표입니다.",
      category: "지표",
      saved: true,
    },
    {
      term: "ROE",
      definition:
        "Return on Equity의 줄임말로, 자기자본이익률을 의미합니다. 기업의 자본 효율성을 나타내는 지표입니다.",
      category: "지표",
      saved: false,
    },
    {
      term: "분산투자",
      definition: "투자 위험을 줄이기 위해 여러 자산에 분산하여 투자하는 전략입니다.",
      category: "전략",
      saved: true,
    },
    {
      term: "리밸런싱",
      definition: "포트폴리오의 자산 비중을 원래 목표로 되돌리는 과정입니다.",
      category: "전략",
      saved: false,
    },
    {
      term: "PBR",
      definition:
        "Price Book-value Ratio의 줄임말로, 주가순자산비율을 의미합니다. 주가를 주당순자산으로 나눈 값입니다.",
      category: "지표",
      saved: true,
    },
    {
      term: "EPS",
      definition:
        "Earnings Per Share의 줄임말로, 주당순이익을 의미합니다. 기업의 순이익을 발행주식수로 나눈 값입니다.",
      category: "지표",
      saved: true,
    },
    {
      term: "시가총액",
      definition: "기업의 주가에 발행주식수를 곱한 값으로, 기업의 시장 가치를 나타냅니다.",
      category: "지표",
      saved: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">금융 용어사전</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              금융 투자에 필요한 핵심 용어들을 쉽게 이해하고 학습하세요.
            </p>
          </div>

          {/* 상단 학습 현황 대시보드 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {dictionaryTerms.filter((term) => term.saved).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">저장한 용어</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600 mt-1">이번 주 학습</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">5일</div>
                <div className="text-sm text-gray-600 mt-1">연속 학습</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-gray-600 mt-1">퀴즈 정답률</div>
              </div>
            </div>
          </div>

          {/* 고급 검색 및 필터 영역 */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 검색바 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="용어명, 설명, 카테고리로 검색..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>

                {/* 필터 옵션들 */}
                <div className="flex flex-wrap gap-3">
                  {/* 카테고리 필터 */}
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 카테고리</option>
                    <option value="펀드">펀드</option>
                    <option value="지표">지표</option>
                    <option value="전략">전략</option>
                    <option value="경제">경제</option>
                  </select>

                  {/* 학습 상태 필터 */}
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 상태</option>
                    <option value="mastered">완벽 이해</option>
                    <option value="learning">학습 중</option>
                    <option value="review">복습 필요</option>
                  </select>

                  {/* 저장 기간 필터 */}
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 기간</option>
                    <option value="today">오늘</option>
                    <option value="week">이번 주</option>
                    <option value="month">이번 달</option>
                  </select>

                  {/* 정렬 옵션 */}
                  <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="recent">최신순</option>
                    <option value="alphabet">가나다순</option>
                    <option value="quiz">퀴즈 성적순</option>
                    <option value="review">복습 필요순</option>
                  </select>
                </div>

                {/* 빠른 태그 필터 */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #오늘_학습
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #퀴즈_오답
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #자주_검색
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-blue-50">
                    #필수_용어
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 용어 카드 그리드 - 개선된 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dictionaryTerms
              .filter((item) => item.saved)
              .map((item, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-l-blue-500 cursor-pointer"
                  onClick={() => handleTermClick(item)}
                >
                  <CardContent className="p-5">
                    {/* 카드 헤더 */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{item.term}</h3>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          {/* 학습 상태 표시 */}
                          <Badge
                            variant="outline"
                            className={
                              index % 3 === 0
                                ? "bg-green-50 text-green-700"
                                : index % 3 === 1
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                            }
                          >
                            {index % 3 === 0
                              ? "완벽 이해"
                              : index % 3 === 1
                                ? "학습 중"
                                : "복습 필요"}
                          </Badge>
                        </div>
                      </div>
                      {/* 액션 버튼들 */}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-1">
                          <BookOpen className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Target className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* 설명 */}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.definition}</p>

                    {/* 카드 푸터 - 메타 정보 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        3일 전 저장
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        퀴즈 2회
                      </span>
                      <span className="flex items-center gap-1">
                        <Newspaper className="w-3 h-3" />
                        관련 기사 5
                      </span>
                    </div>

                    {/* 연관 용어 미리보기 */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">연관 용어</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          주가
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          수익률
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          +2
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* 하단 액션 영역 */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              총 {dictionaryTerms.filter((term) => term.saved).length}개 용어 중{" "}
              {dictionaryTerms.filter((term) => term.saved).length}개 표시
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                내보내기
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => router.push("/quiz")}
              >
                <Target className="w-4 h-4" />
                전체 퀴즈 시작
              </Button>
            </div>
          </div>

          {/* 플로팅 액션 버튼 (빠른 복습) */}
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
              title="1분 빠른 복습"
            >
              <Zap className="w-6 h-6" />
            </Button>
          </div>

          {/* 용어 상세 모달 */}
          {selectedTerm && (
            <TermDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              term={selectedTerm}
            />
          )}
        </div>
      </main>
    </div>
  )
}
