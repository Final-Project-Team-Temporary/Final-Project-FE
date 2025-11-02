export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/login?error=카카오 로그인에 실패했습니다", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=인증 코드가 없습니다", request.url))
  }

  console.log("BACKEND_URL:", process.env.BACKEND_URL)
  console.log("Sending code:", code)

  try {
    // 백엔드 서버에 카카오 인증 코드 전송
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/auth/kakao-auth?code=${encodeURIComponent(code)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )

    if (!backendResponse.ok) {
      throw new Error("백엔드 인증 처리 실패")
    }

    const result = await backendResponse.json()

    console.log("status : ", result.data.loginStatus)
    console.log("accessToken : ", result.data.accessToken)
    console.log("refreshToken : ", result.data.refreshToken)
    console.log("userStatus : ", result.data.userStatus)

    if (result.data.loginStatus === "EXISTING_USER") {
      // 기존 사용자 - 바로 로그인 처리
      const response = NextResponse.redirect(new URL("/", request.url))

      // 쿠키에 토큰과 사용자 정보 저장
      response.cookies.set("authToken", result.data.accessToken, {
        httpOnly: false, // AuthContext에서 접근 가능하도록
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7일
      })

      response.cookies.set("refreshToken", result.data.refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7일
      })

      // 사용자 데이터를 쿠키에 저장
      const userData = {
        id: result.data.userId || "temp-id",
        email: result.data.email || result.data.userName + "@kakao.com",
        name: result.data.userName || "사용자",
        needsAdditionalInfo: false,
      }

      response.cookies.set("userData", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      })

      return response
    } else if (result.data.loginStatus === "NEW_USER") {
      // 신규 사용자 - 추가 정보 입력 페이지로 리다이렉트
      const response = NextResponse.redirect(new URL("/additional-info", request.url))
      response.cookies.set("tempToken", result.data.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60, // 30분
      })
      response.cookies.set("userName", result.data.userName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60, // 30분
      })
      return response
    }

    throw new Error("알 수 없는 응답 형태")
  } catch (error) {
    console.error("Kakao OAuth callback error:", error)
    return NextResponse.redirect(
      new URL("/login?error=로그인 처리 중 오류가 발생했습니다", request.url)
    )
  }
}
