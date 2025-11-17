import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 토큰 재발급 관련 변수
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

// 실패한 요청들을 큐에 저장
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Refresh Token으로 Access Token 재발급
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/auth/refresh`,
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const { accessToken, refreshToken: newRefreshToken } = response.data.data

  // 새 토큰 저장
  localStorage.setItem("authToken", accessToken)
  console.log("authToken", accessToken)
  console.log("refreshToken", refreshToken)
  if (newRefreshToken) {
    localStorage.setItem("refreshToken", newRefreshToken)
  }

  return accessToken
}

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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 403 Forbidden: 토큰 만료 - Refresh Token으로 재발급 시도
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 재발급 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await refreshAccessToken()

        // 큐에 있는 요청들 처리
        processQueue(null, newAccessToken)

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh Token도 만료되었거나 재발급 실패
        processQueue(refreshError as AxiosError, null)

        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken")
          localStorage.removeItem("refreshToken")
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 401 Unauthorized: 인증 토큰 없음 또는 유효하지 않음
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("refreshToken")
      }
    }

    // 500 Internal Server Error: 서버 오류
    if (error.response?.status === 500) {
      console.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }

    return Promise.reject(error)
  }
)

export default apiClient
