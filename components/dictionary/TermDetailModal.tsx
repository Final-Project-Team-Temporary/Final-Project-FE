"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Newspaper,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Brain,
  ArrowUpRight,
  Calendar,
  User,
  BarChart3,
  FileText,
  Link2,
  Trash2,
  Loader2,
} from "lucide-react"
import { deleteTerm } from "@/services/terms"
import { useToast } from "@/hooks/use-toast"

interface TermDetailModalProps {
  isOpen: boolean
  onClose: () => void
  term: {
    id: string
    term: string
    definition: string
    category: string
    savedDate: string
    lastReviewDate: string
    quizAttempts: number
    quizAccuracy: number
    relatedTerms: string[]
    difficulty: "beginner" | "intermediate" | "advanced"
  }
  onDelete?: () => void
}

export default function TermDetailModal({ isOpen, onClose, term, onDelete }: TermDetailModalProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 모의 데이터 - 실제로는 API에서 가져옴
  const sourceArticles = [
    {
      id: 1,
      title: "한국은행, 기준금리 3.5% 동결... 물가 상황 주시",
      date: "2024-01-15",
      source: "한국경제신문",
      excerpt:
        "한국은행이 기준금리를 연 3.5%로 동결했다. 이주열 총재는 '물가 안정 목표 달성을 위해...'",
      url: "#",
      highlight: "한국은행이 <mark>기준금리</mark>를 연 3.5%로 동결했다.",
      readTime: "3분",
      relevance: 95,
    },
    {
      id: 2,
      title: "미 연준 FOMC, 금리 동결 시사... 글로벌 금융시장 안도",
      date: "2024-01-10",
      source: "매일경제",
      excerpt: "미국 연방준비제도(Fed)가 기준금리 동결을 시사하면서 글로벌 금융시장이...",
      url: "#",
      highlight: "시장에서는 <mark>기준금리</mark> 인하 시점을 두고 다양한 전망이...",
      readTime: "5분",
      relevance: 87,
    },
    {
      id: 3,
      title: "기준금리 변화가 부동산 시장에 미치는 영향 분석",
      date: "2024-01-08",
      source: "조선일보",
      excerpt: "전문가들은 현재의 기준금리 수준이 부동산 시장에 미치는 영향을...",
      url: "#",
      highlight: "<mark>기준금리</mark> 인상은 대출 금리 상승으로 이어져...",
      readTime: "7분",
      relevance: 82,
    },
  ]

  const usageExamples = [
    {
      context: "뉴스 기사",
      example: "한국은행이 기준금리를 0.25%p 인상하면서 대출 금리도 동반 상승할 것으로 예상됩니다.",
      explanation: "중앙은행의 금리 정책 변화를 설명할 때 사용",
    },
    {
      context: "경제 분석",
      example: "기준금리가 인상되면 시중 유동성이 감소하고 물가 상승 압력이 완화됩니다.",
      explanation: "통화정책의 효과를 설명할 때 활용",
    },
    {
      context: "투자 전략",
      example: "기준금리 인하 시기에는 성장주보다 배당주가 유리할 수 있습니다.",
      explanation: "투자 의사결정의 근거로 활용",
    },
  ]

  const relatedConcepts = [
    { term: "콜금리", similarity: 95, description: "은행 간 초단기 대출 금리" },
    { term: "시중금리", similarity: 90, description: "시장에서 실제 적용되는 금리" },
    { term: "통화정책", similarity: 88, description: "중앙은행의 경제 조절 정책" },
    { term: "인플레이션", similarity: 75, description: "물가 상승률" },
  ]

  const learningPath = [
    { step: 1, term: "금리", status: "completed", description: "기본 개념 이해" },
    { step: 2, term: "기준금리", status: "current", description: "현재 학습 중" },
    { step: 3, term: "통화정책", status: "next", description: "다음 학습 추천" },
    { step: 4, term: "경제지표", status: "future", description: "심화 학습" },
  ]

  const handleDeleteTerm = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteTerm(Number(term.id))
      if (success) {
        toast({
          title: "용어 삭제 완료",
          description: `"${term.term}" 용어가 삭제되었습니다.`,
        })
        setShowDeleteDialog(false)
        onClose()
        if (onDelete) {
          onDelete()
        }
      } else {
        throw new Error("삭제 실패")
      }
    } catch (error) {
      console.error("Failed to delete term:", error)
      toast({
        title: "삭제 실패",
        description: "용어 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {term.term}
                <Badge className="ml-2">{term.category}</Badge>
                <Badge
                  variant="outline"
                  className={
                    term.difficulty === "beginner"
                      ? "text-green-700"
                      : term.difficulty === "intermediate"
                        ? "text-yellow-700"
                        : "text-red-700"
                  }
                >
                  {term.difficulty === "beginner"
                    ? "초급"
                    : term.difficulty === "intermediate"
                      ? "중급"
                      : "고급"}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-2 text-base">{term.definition}</DialogDescription>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600">저장일</div>
              <div className="font-semibold">{term.savedDate}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">마지막 복습</div>
              <div className="font-semibold">{term.lastReviewDate}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">퀴즈 응시</div>
              <div className="font-semibold">{term.quizAttempts}회</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">정답률</div>
              <div className="font-semibold text-green-600">{term.quizAccuracy}%</div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="overview" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              개요
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex-1">
              <Newspaper className="w-4 h-4 mr-2" />
              출처 기사
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              사용 사례
            </TabsTrigger>
            <TabsTrigger value="related" className="flex-1">
              <Link2 className="w-4 h-4 mr-2" />
              연관 학습
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] p-6">
            {/* 개요 탭 */}
            <TabsContent value="overview" className="mt-0 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    상세 설명
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    기준금리는 한국은행(중앙은행)이 시중은행과 거래할 때 기준이 되는 금리입니다.
                    한국은행 금융통화위원회에서 연 8회 결정하며, 이는 시중 금리와 경제 전반에 큰
                    영향을 미칩니다. 기준금리가 인상되면 시중 금리도 오르고, 인하되면 시중 금리도
                    내려가는 경향이 있습니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    학습 경로
                  </h3>
                  <div className="space-y-2">
                    {learningPath.map((item) => (
                      <div key={item.step} className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                          ${
                            item.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : item.status === "current"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.term}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        {item.status === "next" && (
                          <Button size="sm" variant="outline">
                            학습하기
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 출처 기사 탭 */}
            <TabsContent value="articles" className="mt-0 space-y-4">
              {sourceArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{article.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {article.date}
                          </span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.source}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">관련도 {article.relevance}%</Badge>
                    </div>

                    <div className="mb-3">
                      <div className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: article.highlight }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        원문 보기
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        저장
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline">
                  더 많은 기사 보기
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            {/* 사용 사례 탭 */}
            <TabsContent value="usage" className="mt-0 space-y-4">
              {usageExamples.map((example, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{example.context}</Badge>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md mb-2">
                      <p className="text-sm italic">"{example.example}"</p>
                    </div>
                    <p className="text-sm text-gray-600">💡 {example.explanation}</p>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">실전 Tip</h4>
                  <p className="text-sm text-gray-700">
                    기준금리 변화는 보통 발표 전부터 시장에 반영되어 있습니다. 실제 발표 시에는
                    '예상과의 차이'가 시장에 더 큰 영향을 미칩니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 연관 학습 탭 */}
            <TabsContent value="related" className="mt-0 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">연관 용어</h3>
                  <div className="space-y-3">
                    {relatedConcepts.map((concept) => (
                      <div
                        key={concept.term}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{concept.term}</div>
                          <div className="text-sm text-gray-600">{concept.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-500">연관도 {concept.similarity}%</div>
                          <Button size="sm" variant="ghost">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    학습 통계
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>이 용어와 함께 학습한 용어</span>
                      <span className="font-semibold">12개</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>관련 기사 읽은 수</span>
                      <span className="font-semibold">8개</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>퀴즈 평균 소요 시간</span>
                      <span className="font-semibold">15초</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button className="flex-1">
                  연관 용어 퀴즈 시작
                  <Target className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1">
                  학습 맵 보기
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* 하단 액션 버튼 */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              수정하기
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              삭제하기
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">퀴즈 풀기</Button>
            <Button>복습 완료</Button>
          </div>
        </div>
      </DialogContent>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>용어를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-gray-900">"{term.term}"</span> 용어를 삭제하면
              저장된 모든 학습 기록이 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTerm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제하기
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
