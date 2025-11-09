"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { TrendingUp, User, CheckCircle, X } from "lucide-react"
import axios from "axios"

export default function AdditionalInfoPage() {
  const router = useRouter()
  const { login, setNeedsAdditionalInfo } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    ageRange: "",
    investmentLevel: "",
    riskTolerance: "",
    investmentGoal: "",
    monthlyInvestmentAmount: "",
    interestCategories: [] as string[],
  })

  useEffect(() => {
    // 임시 토큰과 사용자 데이터 확인
      const getCookie = (name: string) => {
          const value = document.cookie
              .split("; ")
              .find((row) => row.startsWith(`${name}=`))
          return value ? decodeURIComponent(value.split("=")[1]) : null
      }

      const tempToken = getCookie("tempToken")
      const uName = getCookie("userName")

      if (!tempToken) {
          router.push("/")
          return
      }

      setUserName(uName)

  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategorySelect = (category: string) => {
    if (!formData.interestCategories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        interestCategories: [...prev.interestCategories, category]
      }))
    }
  }

  const handleCategoryRemove = (category: string) => {
    setFormData(prev => ({
      ...prev,
      interestCategories: prev.interestCategories.filter(c => c !== category)
    }))
  }

  const getCategoryDisplayName = (category: string) => {
    const categoryMap = {
      'BATTERY': '배터리',
      'MEDICINE': '의약품', 
      'STEEL': '철강',
      'GOLD': '금'
    }
    return categoryMap[category as keyof typeof categoryMap] || category
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // const tempToken = localStorage.getItem('tempToken')

      const tempToken = document.cookie.split("; ")
          .find(row => row.startsWith("tempToken="))
          ?.split("=")[1]

      // 백엔드 API 호출
      const { data: result } = await axios.post('/api/auth/complete-registration', formData, {
        headers: {
          'Authorization': `Bearer ${tempToken}`
        }
      })

      // 정식 로그인 처리
      const userData = {
        id: result.data.userId || 'temp-id',
        email: result.data.email || userName + '@kakao.com',
        name: userName || result.data.userName || '사용자',
        needsAdditionalInfo: false
      }

      // AuthContext에 로그인 상태 설정 (accessToken 사용)
      login(result.data.accessToken, userData)

      // 추가로 refreshToken을 localStorage에 저장
      localStorage.setItem('refreshToken', result.data.refreshToken)

      // 임시 토큰과 데이터 정리
      document.cookie = 'tempToken=; Max-Age=0; path=/'
      document.cookie = 'userName=; Max-Age=0; path=/'

      // 메인 페이지로 리다이렉트
      router.push("/")
    } catch (error) {
      console.error('Registration completion failed:', error)
      alert('회원가입 완료에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.ageRange && 
           formData.investmentLevel && 
           formData.riskTolerance && 
           formData.investmentGoal &&
           formData.interestCategories.length > 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">EconoEasy</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">회원가입이 거의 완료되었습니다!</h1>
          </div>
          <p className="text-gray-600">
            {userName}님, 환영합니다! 맞춤형 투자 서비스 제공을 위해 추가 정보를 입력해 주세요.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              추가 정보 입력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 나이대 */}
              <div className="space-y-2">
                <Label htmlFor="ageRange">나이대 *</Label>
                <Select onValueChange={(value) => handleInputChange('ageRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="나이대를 선택해 주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TWENTIES">20대</SelectItem>
                    <SelectItem value="THIRTIES">30대</SelectItem>
                    <SelectItem value="FOURTIES">40대</SelectItem>
                    <SelectItem value="FIFTIES">50대</SelectItem>
                    <SelectItem value="SIXTY_PLUS">60대 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 투자 경험 */}
              <div className="space-y-2">
                <Label htmlFor="investmentLevel">투자 경험 *</Label>
                <Select onValueChange={(value) => handleInputChange('investmentLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="투자 경험을 선택해 주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">초보자</SelectItem>
                    <SelectItem value="INTERMEDIATE">중급자</SelectItem>
                    <SelectItem value="ADVANCED">상급자</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 위험 성향 */}
              <div className="space-y-2">
                <Label htmlFor="riskTolerance">위험 성향 *</Label>
                <Select onValueChange={(value) => handleInputChange('riskTolerance', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="위험 성향을 선택해 주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STABLE">안정형 (원금 보장 우선)</SelectItem>
                    <SelectItem value="MODERATE">중립형 (적당한 수익 추구)</SelectItem>
                    <SelectItem value="AGGRESSIVE">공격형 (고수익 추구)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 투자 목표 */}
              <div className="space-y-2">
                <Label htmlFor="investmentGoal">투자 목표 *</Label>
                <Select onValueChange={(value) => handleInputChange('investmentGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="투자 목표를 선택해 주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LONG_TERM_GROWTH">장기 자산 증식</SelectItem>
                    <SelectItem value="SHORT_TERM_PROFIT">단기 수익 추구</SelectItem>
                    <SelectItem value="STABLE_INCOME">안정적 수익</SelectItem>
                    <SelectItem value="INFLATION_HEDGE">인플레이션 헤지</SelectItem>
                    <SelectItem value="RETIREMENT_PREP">은퇴 준비</SelectItem>
                    <SelectItem value="EDUCATION_FUND">교육비 마련</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 관심 카테고리 */}
              <div className="space-y-3">
                <Label>관심 투자 카테고리 * (복수 선택 가능)</Label>
                
                {/* 카테고리 선택 드롭다운 */}
                <Select onValueChange={handleCategorySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="관심 투자 카테고리를 선택해 주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BATTERY" disabled={formData.interestCategories.includes('BATTERY')}>
                      배터리
                    </SelectItem>
                    <SelectItem value="MEDICINE" disabled={formData.interestCategories.includes('MEDICINE')}>
                      의약품
                    </SelectItem>
                    <SelectItem value="STEEL" disabled={formData.interestCategories.includes('STEEL')}>
                      철강
                    </SelectItem>
                    <SelectItem value="GOLD" disabled={formData.interestCategories.includes('GOLD')}>
                      금
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* 선택된 카테고리 태그들 */}
                {formData.interestCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.interestCategories.map((category) => (
                      <div
                        key={category}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <span>{getCategoryDisplayName(category)}</span>
                        <button
                          type="button"
                          onClick={() => handleCategoryRemove(category)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 월 투자 금액 */}
              <div className="space-y-2">
                <Label htmlFor="monthlyInvestmentAmount">월 투자 가능 금액 (선택사항)</Label>
                <Select onValueChange={(value) => handleInputChange('monthlyInvestmentAmount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="월 투자 가능 금액을 선택해 주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100">10만원 미만</SelectItem>
                    <SelectItem value="100-300">10만원 - 30만원</SelectItem>
                    <SelectItem value="300-500">30만원 - 50만원</SelectItem>
                    <SelectItem value="500-1000">50만원 - 100만원</SelectItem>
                    <SelectItem value="over-1000">100만원 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/")}
                >
                  나중에 입력하기
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? "처리 중..." : "완료"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>입력하신 정보는 맞춤형 투자 추천 서비스 제공을 위해서만 사용됩니다.</p>
        </div>
      </main>
    </div>
  )
}