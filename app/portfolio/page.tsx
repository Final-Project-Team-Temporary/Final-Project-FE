"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import { PieChart } from "lucide-react"

export default function PortfolioPage() {
  const router = useRouter()

  // 모의 데이터
  const portfolioData = {
    totalValue: 1250000,
    dailyChange: 25000,
    dailyChangePercent: 2.04,
    investments: [
      { name: "삼성전자", value: 450000, change: 2.3, color: "#28A745" },
      { name: "KODEX 200", value: 300000, change: -1.2, color: "#DC3545" },
      { name: "SK하이닉스", value: 250000, change: 3.1, color: "#28A745" },
      { name: "현금", value: 250000, change: 0, color: "#6C757D" },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">포트폴리오</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              나의 투자 현황을 한눈에 확인하고 최적화된 포트폴리오를 구성해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>자산 분배</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">포트폴리오 차트가 여기에 표시됩니다</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>보유 종목</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.investments.map((investment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: investment.color }} />
                          <div>
                            <div className="font-medium">{investment.name}</div>
                            <div className="text-sm text-gray-500">
                              {Math.round((investment.value / portfolioData.totalValue) * 100)}% 비중
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₩{investment.value.toLocaleString()}</div>
                          <div
                            className={`text-sm ${investment.change > 0 ? "text-green-600" : investment.change < 0 ? "text-red-600" : "text-gray-600"}`}
                          >
                            {investment.change > 0 ? "+" : ""}
                            {investment.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>포트폴리오 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">
                      ₩{portfolioData.totalValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">총 자산</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">일일 수익</span>
                      <span className="font-semibold text-green-600">
                        +₩{portfolioData.dailyChange.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">수익률</span>
                      <span className="font-semibold text-green-600">+{portfolioData.dailyChangePercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">투자 종목</span>
                      <span className="font-semibold">{portfolioData.investments.length - 1}개</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI 추천</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">리밸런싱 제안</div>
                    <div className="text-xs text-yellow-700 mt-1">현금 비중을 줄이고 ETF 투자를 늘려보세요</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">분산 투자</div>
                    <div className="text-xs text-blue-700 mt-1">해외 ETF 추가로 지역 분산을 고려해보세요</div>
                  </div>

                  <Button className="w-full" variant="outline">
                    상세 분석 보기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}