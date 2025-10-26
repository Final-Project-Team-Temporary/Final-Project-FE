"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import { BarChart3 } from "lucide-react"

export default function SimulationPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">모의투자</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              실제 시장 데이터로 안전하게 투자를 연습해보세요. 가상 자금으로 실전 경험을 쌓을 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>모의투자 차트</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">실시간 차트가 여기에 표시됩니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">거래</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-red-600 hover:bg-red-700">매도</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">매수</Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">수량</label>
                    <input type="number" className="w-full p-2 border rounded-md" placeholder="0" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">가격</label>
                    <input type="number" className="w-full p-2 border rounded-md" placeholder="시장가" />
                  </div>

                  <Button className="w-full">주문하기</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">내 성과</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">총 수익률</span>
                    <span className="font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">랭킹</span>
                    <span className="font-semibold">156위</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">거래 횟수</span>
                    <span className="font-semibold">23회</span>
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