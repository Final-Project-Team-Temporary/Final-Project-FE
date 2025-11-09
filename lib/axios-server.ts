import axios from "axios"

// 서버 사이드 전용 axios 인스턴스 (API Routes에서 사용)
const serverApiClient = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // credentials: "include"와 동일
})

export default serverApiClient
