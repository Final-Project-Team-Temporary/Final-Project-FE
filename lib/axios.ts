import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터: 모든 요청에 자동으로 토큰 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 브라우저 환경에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 공통 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // 401 Unauthorized: 인증 토큰 만료 또는 유효하지 않음
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        // 로그인 페이지로 리다이렉트
        window.location.href = "/login"
      }
    }

    // 403 Forbidden: 권한 없음
    if (error.response?.status === 403) {
      console.error("접근 권한이 없습니다.")
    }

    // 500 Internal Server Error: 서버 오류
    if (error.response?.status === 500) {
      console.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }

    return Promise.reject(error)
  }
)

export default apiClient
