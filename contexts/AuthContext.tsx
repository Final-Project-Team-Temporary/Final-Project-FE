"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  needsAdditionalInfo?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setNeedsAdditionalInfo: (needs: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 쿠키와 로컬 스토리지에서 토큰 확인
    const checkAuthStatus = async () => {
      // 먼저 쿠키에서 확인 (우선순위)
      const cookieUserData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userData="))
        ?.split("=")[1]

      const cookieAuthToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]

      const cookieRefreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1]

      if (cookieUserData && cookieAuthToken) {
        try {
          const parsedUserData = JSON.parse(decodeURIComponent(cookieUserData))
          setUser(parsedUserData)
          // 로컬 스토리지에도 동기화
          localStorage.setItem("userData", JSON.stringify(parsedUserData))
          localStorage.setItem("authToken", cookieAuthToken)
          if (cookieRefreshToken) {
            localStorage.setItem("refreshToken", cookieRefreshToken)
          }
          setIsLoading(false)
          return
        } catch (error) {
          console.error("Failed to parse cookie user data:", error)
        }
      }

      // 쿠키에 없으면 로컬 스토리지에서 확인
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("userData")

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData)
          setUser(parsedUserData)
        } catch (error) {
          console.error("Failed to parse user data:", error)
          localStorage.removeItem("authToken")
          localStorage.removeItem("userData")
        }
      }

      // 임시 토큰 체크 (카카오 로그인 중간 단계)
      const tempToken = localStorage.getItem("tempToken")
      const tempUserData = localStorage.getItem("tempUserData")

      if (tempToken && tempUserData && window.location.pathname === "/additional-info") {
        // 추가 정보 입력 페이지에서는 로딩 상태만 해제
        setIsLoading(false)
        return
      } else if (tempToken && tempUserData) {
        // 다른 페이지에서 임시 토큰이 있으면 추가 정보 페이지로 리다이렉트
        window.location.href = "/additional-info"
        return
      }

      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("tempToken")
    // 쿠키도 정리
    document.cookie = "authToken=; Max-Age=0; path=/"
    document.cookie = "userData=; Max-Age=0; path=/"
    document.cookie = "refreshToken=; Max-Age=0; path=/"
    document.cookie = "tempToken=; Max-Age=0; path=/"
    document.cookie = "userName=; Max-Age=0; path=/"
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("userData", JSON.stringify(updatedUser))
    }
  }

  const setNeedsAdditionalInfo = (needs: boolean) => {
    if (user) {
      updateUser({ needsAdditionalInfo: needs })
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    setNeedsAdditionalInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
