import { LoginCredentials, SignupData, User, ApiResponse, LoginResponse, RegisterRequest, RegisterResponse, CompleteRegistrationRequest, CompleteRegistrationResponse } from "@/lib/types"
import apiClient from "@/lib/axios"

// 로그인 API 호출
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials)
    return response.data
  } catch (error: any) {
    // axios 에러 처리
    if (error.response?.data) {
      return error.response.data as LoginResponse
    }
    return {
      code: "E001",
      message: "로그인 중 오류가 발생했습니다.",
      success: false,
      data: {
        accessToken: "",
        refreshToken: "",
        userStatus: "INACTIVE",
        loginStatus: "EXISTING_USER",
        userName: "",
      },
    }
  }
}

// 회원가입 API 호출
export async function signupUser(signupData: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
  try {
    // 실제 API 호출 대신 모의 응답
    await new Promise(resolve => setTimeout(resolve, 1500)) // 네트워크 지연 시뮬레이션

    // 비밀번호 확인
    if (signupData.password !== signupData.confirmPassword) {
      return {
        success: false,
        error: "비밀번호가 일치하지 않습니다."
      }
    }

    // 이메일 중복 체크 (모의)
    if (signupData.email === "existing@example.com") {
      return {
        success: false,
        error: "이미 존재하는 이메일입니다."
      }
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: signupData.email,
      name: signupData.name,
      age: signupData.age,
      investmentExperience: signupData.investmentExperience as any,
      riskTolerance: signupData.riskTolerance as any,
      investmentGoals: signupData.investmentGoals,
      interests: signupData.interests,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return {
      success: true,
      data: {
        user: newUser,
        token: "mock-jwt-token"
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "회원가입 중 오류가 발생했습니다."
    }
  }
}

// 일반 회원가입 API 호출 (1단계: 기본 정보)
export async function registerUser(registerData: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await apiClient.post<RegisterResponse>("/api/auth/register", registerData)
    return response.data
  } catch (error: any) {
    // axios 에러 처리
    if (error.response?.data) {
      return error.response.data as RegisterResponse
    }
    return {
      code: "E001",
      message: "회원가입 중 오류가 발생했습니다.",
      success: false,
      data: {
        accessToken: "",
        refreshToken: "",
        userStatus: "PENDING",
        loginStatus: "NEW_USER",
        userName: "",
      },
    }
  }
}

// 추가 정보 등록 API 호출 (2단계: 프로필 정보)
export async function completeRegistration(
  profileData: CompleteRegistrationRequest,
  accessToken: string
): Promise<CompleteRegistrationResponse> {
  try {
    const response = await apiClient.post<CompleteRegistrationResponse>(
      "/api/auth/complete-registration",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    // axios 에러 처리
    if (error.response?.data) {
      return error.response.data as CompleteRegistrationResponse
    }
    return {
      code: "E001",
      message: "추가 정보 등록 중 오류가 발생했습니다.",
      success: false,
    }
  }
}

// 카카오 로그인 API 호출
export async function loginWithKakao(): Promise<ApiResponse<{ user: User; token: string }>> {
  try {
    // 실제 카카오 SDK 호출 대신 모의 응답
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      success: true,
      data: {
        user: {
          id: "kakao-123456",
          email: "kakao@example.com",
          name: "카카오사용자",
          age: "20s",
          investmentExperience: "beginner",
          riskTolerance: "conservative",
          investmentGoals: ["장기 자산 증식"],
          interests: ["ETF", "주식"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: "mock-kakao-jwt-token"
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "카카오 로그인 중 오류가 발생했습니다."
    }
  }
}

// 로그아웃 API 호출
export async function logoutUser(): Promise<ApiResponse<null>> {
  try {
    // 실제 API 호출 대신 모의 응답
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 로컬 스토리지에서 토큰 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
    }
    
    return {
      success: true,
      message: "성공적으로 로그아웃되었습니다."
    }
  } catch (error) {
    return {
      success: false,
      error: "로그아웃 중 오류가 발생했습니다."
    }
  }
}

// 토큰 갱신 API 호출
export async function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  try {
    // 실제 API 호출 대신 모의 응답
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: {
        token: "new-mock-jwt-token"
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "토큰 갱신 중 오류가 발생했습니다."
    }
  }
}

// 사용자 정보 가져오기
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    // 실제 API 호출 대신 로컬 스토리지에서 사용자 정보 가져오기
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data')
      if (userData) {
        return {
          success: true,
          data: JSON.parse(userData)
        }
      }
    }
    
    return {
      success: false,
      error: "로그인이 필요합니다."
    }
  } catch (error) {
    return {
      success: false,
      error: "사용자 정보를 가져오는 중 오류가 발생했습니다."
    }
  }
}