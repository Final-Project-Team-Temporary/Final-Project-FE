"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrendingUp, User, LogOut, Home, Newspaper, BookOpen, Brain } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:text-blue-900"
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">EconoEasy</span>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => router.push("/")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/")}`}
              >
                대시보드
              </button>
              <button
                onClick={() => router.push("/articles")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith("/articles") ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:text-blue-900"}`}
              >
                기사
              </button>
              <button
                onClick={() => router.push("/dictionary")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/dictionary")}`}
              >
                용어사전
              </button>
              <button
                onClick={() => router.push("/quiz")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/quiz")}`}
              >
                퀴즈
              </button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                    로그인
                  </Button>
                  <Button size="sm" className="bg-blue-900 hover:bg-blue-800" onClick={() => router.push("/signup")}>
                    회원가입
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="w-4 h-4" />
                    <span>{user?.name || '사용자'}님</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/mypage")}>
                    마이페이지
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    로그아웃
                  </Button>
                </>
              )}
            </div>

            {/* 모바일 로그인/회원가입 버튼 */}
            <div className="flex md:hidden items-center space-x-2">
              {!isAuthenticated ? (
                <Button size="sm" className="bg-blue-900 hover:bg-blue-800" onClick={() => router.push("/login")}>
                  로그인
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => router.push("/mypage")}>
                  <User className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 하단 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => router.push("/")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname === "/" ? "text-blue-900" : "text-gray-600"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">대시보드</span>
          </button>
          <button
            onClick={() => router.push("/articles")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname.startsWith("/articles") ? "text-blue-900" : "text-gray-600"
            }`}
          >
            <Newspaper className="w-6 h-6 mb-1" />
            <span className="text-xs">기사</span>
          </button>
          <button
            onClick={() => router.push("/dictionary")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname === "/dictionary" ? "text-blue-900" : "text-gray-600"
            }`}
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-xs">용어사전</span>
          </button>
          <button
            onClick={() => router.push("/quiz")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              pathname === "/quiz" ? "text-blue-900" : "text-gray-600"
            }`}
          >
            <Brain className="w-6 h-6 mb-1" />
            <span className="text-xs">퀴즈</span>
          </button>
        </div>
      </nav>
    </>
  )
}