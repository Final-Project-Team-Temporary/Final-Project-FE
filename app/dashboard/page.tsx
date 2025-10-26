"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // 대시보드 페이지는 메인 페이지로 리디렉션
    router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg text-gray-600">대시보드로 이동 중...</div>
      </div>
    </div>
  )
}