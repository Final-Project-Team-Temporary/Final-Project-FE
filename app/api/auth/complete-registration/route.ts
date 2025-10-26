import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tempToken = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!tempToken) {
      return NextResponse.json(
        { error: '임시 토큰이 필요합니다' },
        { status: 401 }
      )
    }

    // 백엔드 서버에 추가 정보와 함께 회원가입 완료 요청
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify(body)
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(
        { error: errorData.message || '회원가입 완료에 실패했습니다' },
        { status: backendResponse.status }
      )
    }

    const result = await backendResponse.json()

    // 성공 응답에 쿠키 설정
    const response = NextResponse.json(result)
    response.cookies.set('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7일
    })

    // 임시 쿠키 삭제
    response.cookies.delete('tempToken')
    response.cookies.delete('tempUserData')

    return response

  } catch (error) {
    console.error('Complete registration error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}