import { NextRequest, NextResponse } from 'next/server'
import serverApiClient from '@/lib/axios-server'
import { AxiosError } from 'axios'

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
    const { data: result } = await serverApiClient.post('/api/auth/complete-registration', body, {
      headers: {
        'Authorization': `Bearer ${tempToken}`
      }
    })

    // 성공 응답에 쿠키 설정
    const response = NextResponse.json(result)

    // token이 있는 경우에만 쿠키 설정
    if (result.token || result.data?.accessToken) {
      const token = result.token || result.data?.accessToken
      response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7일
      })
    }

    // 임시 쿠키 삭제
    response.cookies.delete('tempToken')
    response.cookies.delete('tempUserData')

    return response

  } catch (error) {
    console.error('Complete registration error:', error)

    // Axios 에러 처리
    if (error instanceof AxiosError) {
      const status = error.response?.status || 500
      const message = error.response?.data?.message || error.response?.data?.error || '서버 오류가 발생했습니다'

      return NextResponse.json(
        { error: message },
        { status }
      )
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}