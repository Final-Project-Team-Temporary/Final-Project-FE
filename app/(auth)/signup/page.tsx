"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Eye, EyeOff, ArrowLeft, Check, User, Target, BookOpen } from "lucide-react"
import { AgeRange, InvestmentLevel, RiskTolerance, InvestmentGoal, Category } from "@/lib/types"
import { registerUser, completeRegistration } from "@/services/auth"

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accessToken, setAccessToken] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    ageRange: "" as AgeRange | "",
    investmentLevel: "" as InvestmentLevel | "",
    riskTolerance: "" as RiskTolerance | "",
    investmentGoal: "" as InvestmentGoal | "",
    interestCategories: [] as Category[],
  })

  const totalSteps = 4
  const progressPercentage = (currentStep / totalSteps) * 100

  const ageRangeOptions = [
    { value: AgeRange.TWENTIES, label: "20대" },
    { value: AgeRange.THIRTIES, label: "30대" },
    { value: AgeRange.FOURTIES, label: "40대" },
    { value: AgeRange.FIFTIES, label: "50대" },
    { value: AgeRange.SIXTY_PLUS, label: "60대 이상" },
  ]

  const investmentLevelOptions = [
    { value: InvestmentLevel.BEGINNER, label: "초보자 (1년 미만)" },
    { value: InvestmentLevel.INTERMEDIATE, label: "중급자 (1-3년)" },
    { value: InvestmentLevel.ADVANCED, label: "고급자 (3년 이상)" },
  ]

  const riskToleranceOptions = [
    { value: RiskTolerance.STABLE, label: "안정형 (원금 보존 중시)" },
    { value: RiskTolerance.MODERATE, label: "중립형 (적당한 위험 감수)" },
    { value: RiskTolerance.AGGRESSIVE, label: "적극형 (높은 수익 추구)" },
  ]

  const investmentGoalOptions = [
    { value: InvestmentGoal.LONG_TERM_GROWTH, label: "장기 자산 증식" },
    { value: InvestmentGoal.SHORT_TERM_PROFIT, label: "단기 수익 창출" },
    { value: InvestmentGoal.STABLE_INCOME, label: "안정적인 배당 수익" },
    { value: InvestmentGoal.INFLATION_HEDGE, label: "인플레이션 헤지" },
    { value: InvestmentGoal.RETIREMENT_PREP, label: "은퇴 자금 마련" },
    { value: InvestmentGoal.EDUCATION_FUND, label: "자녀 교육비 준비" },
  ]

  const categoryOptions = [
    { value: Category.BATTERY, label: "배터리" },
    { value: Category.MEDICINE, label: "의약품" },
    { value: Category.STEEL, label: "철강" },
    { value: Category.GOLD, label: "금" },
    { value: Category.GENERAL, label: "일반" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInvestmentGoalSelect = (value: InvestmentGoal) => {
    setFormData((prev) => ({
      ...prev,
      investmentGoal: value,
    }))
  }

  const handleCategorySelect = (value: Category) => {
    setFormData((prev) => ({
      ...prev,
      interestCategories: prev.interestCategories.includes(value)
        ? prev.interestCategories.filter((item) => item !== value)
        : [...prev.interestCategories, value],
    }))
  }

  const handleKakaoSignup = () => {
    console.log("카카오 회원가입 시도")
    router.push("/dashboard")
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Step 1: 기본 정보 입력 후 register API 호출
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
        setError("모든 필드를 입력해주세요.")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.")
        return
      }

      setLoading(true)
      setError("")

      const response = await registerUser({
        username: formData.name,
        password: formData.password,
        email: formData.email,
      })

      setLoading(false)

      if (!response.success) {
        setError(response.message || "회원가입 중 오류가 발생했습니다.")
        return
      }

      // accessToken 저장
      setAccessToken(response.data.accessToken)
      setCurrentStep(currentStep + 1)
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 필수 필드 검증
    if (!formData.ageRange || !formData.investmentLevel || !formData.riskTolerance || !formData.investmentGoal) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (formData.interestCategories.length === 0) {
      setError("최소 하나의 관심 분야를 선택해주세요.")
      return
    }

    setLoading(true)
    setError("")

    const response = await completeRegistration(
      {
        ageRange: formData.ageRange as AgeRange,
        investmentLevel: formData.investmentLevel as InvestmentLevel,
        riskTolerance: formData.riskTolerance as RiskTolerance,
        investmentGoal: formData.investmentGoal as InvestmentGoal,
        interestCategories: formData.interestCategories,
      },
      accessToken
    )

    setLoading(false)

    if (!response.success) {
      setError(response.message || "추가 정보 등록 중 오류가 발생했습니다.")
      return
    }

    // 회원가입 완료 후 대시보드로 이동
    router.push("/dashboard")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">기본 정보</h3>
              <p className="text-gray-600 text-sm">계정 생성을 위한 기본 정보를 입력해주세요</p>
            </div>

            {/* 카카오 회원가입 */}
            <Button
              type="button"
              onClick={handleKakaoSignup}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-yellow-400 text-xs font-bold">K</span>
                </div>
                <span>카카오로 간편 가입</span>
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@econoeasy.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8자 이상, 영문+숫자 조합"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">투자 프로필</h3>
              <p className="text-gray-600 text-sm">맞춤형 서비스 제공을 위한 투자 정보를 알려주세요</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ageRange">연령대</Label>
                <select
                  id="ageRange"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {ageRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentLevel">투자 경험</Label>
                <select
                  id="investmentLevel"
                  name="investmentLevel"
                  value={formData.investmentLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {investmentLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">위험 성향</Label>
                <select
                  id="riskTolerance"
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {riskToleranceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">투자 목표</h3>
              <p className="text-gray-600 text-sm">가장 중요한 투자 목표를 선택해주세요</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {investmentGoalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInvestmentGoalSelect(option.value)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    formData.investmentGoal === option.value
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {formData.investmentGoal === option.value && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">관심 카테고리</h3>
              <p className="text-gray-600 text-sm">관심 있는 투자 카테고리를 선택해주세요 (복수 선택 가능)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCategorySelect(option.value)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    formData.interestCategories.includes(option.value)
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {formData.interestCategories.includes(option.value) && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">선택한 정보 요약</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">이름:</span> {formData.name}
                </div>
                <div>
                  <span className="text-gray-600">연령대:</span>{" "}
                  {ageRangeOptions.find((opt) => opt.value === formData.ageRange)?.label}
                </div>
                <div>
                  <span className="text-gray-600">투자 경험:</span>{" "}
                  {investmentLevelOptions.find((opt) => opt.value === formData.investmentLevel)?.label}
                </div>
                <div>
                  <span className="text-gray-600">위험 성향:</span>{" "}
                  {riskToleranceOptions.find((opt) => opt.value === formData.riskTolerance)?.label}
                </div>
                <div>
                  <span className="text-gray-600">투자 목표:</span>{" "}
                  {investmentGoalOptions.find((opt) => opt.value === formData.investmentGoal)?.label}
                </div>
                <div>
                  <span className="text-gray-600">관심 카테고리:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.interestCategories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {categoryOptions.find((opt) => opt.value === category)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로 돌아가기
          </button>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-900">EconoEasy</span>
          </div>
          <p className="text-gray-600">금융 투자 학습의 새로운 시작</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  단계 {currentStep} / {totalSteps}
                </span>
                <span>{Math.round(progressPercentage)}% 완료</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={
                currentStep === totalSteps
                  ? handleSubmit
                  : async (e) => {
                      e.preventDefault()
                      await handleNextStep()
                    }
              }
            >
              {renderStepContent()}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handlePrevStep} disabled={loading}>
                    이전
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-900 hover:bg-blue-800"
                    disabled={loading}
                  >
                    {loading ? "처리 중..." : "다음"}
                  </Button>
                ) : (
                  <Button type="submit" className="bg-blue-900 hover:bg-blue-800" disabled={loading}>
                    {loading ? "처리 중..." : "가입 완료"}
                  </Button>
                )}
              </div>
            </form>

            {currentStep === 1 && (
              <div className="text-center mt-6">
                <span className="text-gray-600">이미 계정이 있으신가요? </span>
                <button onClick={() => router.push("/login")} className="text-blue-600 hover:text-blue-800 font-medium">
                  로그인
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 EconoEasy. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}