# Vercel 배포 가이드

## 1. Vercel 환경변수 설정

Vercel 대시보드에서 다음 환경변수를 설정해주세요.

### 설정 방법
1. Vercel 프로젝트 대시보드 접속
2. Settings → Environment Variables 메뉴 이동
3. 아래 환경변수들을 추가

### 필수 환경변수

```
NEXT_PUBLIC_KAKAO_CLIENT_ID=1bdc3b319be38687340b6611b981cd93
NEXT_PUBLIC_KAKAO_REDIRECT_URI=https://v0-financial-learning-platform.vercel.app/api/auth/kakao/callback
BACKEND_URL=http://api.econoeasy.xyz
NEXT_PUBLIC_BACKEND_URL=http://api.econoeasy.xyz
NODE_ENV=production
```

### 환경변수 설정 시 주의사항
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서 접근 가능
- 모든 환경변수는 **Production**, **Preview**, **Development** 모두 체크
- 환경변수 추가 후 **Redeploy** 필요

---

## 2. ⚠️ 중요: Mixed Content 이슈

**현재 문제점:**
- 프론트엔드: `https://` (보안 연결)
- 백엔드: `http://` (비보안 연결)

### 발생 가능한 문제
HTTPS 페이지에서 HTTP API를 호출하면 브라우저가 차단할 수 있습니다.

### 해결 방법 (권장순)

#### ✅ 방법 1: 백엔드를 HTTPS로 업그레이드 (강력 권장)
```bash
# 백엔드 도메인에 SSL 인증서 적용
# Let's Encrypt 무료 인증서 사용 추천
```
**변경 후:**
```
NEXT_PUBLIC_BACKEND_URL=https://api.econoeasy.xyz
```

#### ⚠️ 방법 2: Next.js API 라우트 프록시 사용
Mixed Content 이슈를 우회하기 위해 프론트엔드에서 프록시 역할 수행

**장점:** 클라이언트에서 직접 HTTP 호출 안함
**단점:** 추가 레이턴시, 서버 부하 증가

---

## 3. CORS 설정 확인

백엔드에서 다음 도메인을 허용해야 합니다:

```
https://v0-financial-learning-platform.vercel.app
```

**백엔드 Spring Boot 설정 예시:**
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "https://v0-financial-learning-platform.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 4. 카카오 개발자 설정

카카오 개발자 콘솔에서 Redirect URI를 추가해주세요:

1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
2. 애플리케이션 선택
3. 제품 설정 → 카카오 로그인 → Redirect URI 설정
4. 추가: `https://v0-financial-learning-platform.vercel.app/api/auth/kakao/callback`

---

## 5. 배포 방법

### Git 연동 배포 (자동)
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

Vercel이 자동으로 감지하여 배포합니다.

### Vercel CLI 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로덕션 배포
vercel --prod
```

---

## 6. 배포 후 확인사항

### ✅ 체크리스트
- [ ] 환경변수가 Vercel에 정상 등록되었는가?
- [ ] 백엔드 API 호출이 정상 작동하는가?
- [ ] 카카오 로그인이 정상 작동하는가?
- [ ] 브라우저 콘솔에 Mixed Content 에러가 없는가?
- [ ] 백엔드 CORS 설정이 되어있는가?

### 디버깅 방법
```bash
# 브라우저 콘솔에서 환경변수 확인
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

# 네트워크 탭에서 API 호출 확인
# Failed 상태면 에러 메시지 확인
```

---

## 7. 문제 해결

### 환경변수가 적용되지 않을 때
1. Vercel 대시보드에서 환경변수 재확인
2. Deployments → 최신 배포 → Redeploy

### Mixed Content 에러 발생 시
```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure resource 'http://...'.
This request has been blocked.
```

**해결:**
- 백엔드를 HTTPS로 변경 (권장)
- 또는 API 라우트 프록시 구현

### CORS 에러 발생 시
```
Access to fetch at 'http://api.econoeasy.xyz/...' from origin
'https://v0-financial-learning-platform.vercel.app' has been blocked by CORS policy
```

**해결:**
- 백엔드 CORS 설정에 프론트엔드 도메인 추가

---

## 8. 보안 권장사항

### 민감한 정보 관리
- ❌ 절대 `.env` 파일을 Git에 커밋하지 마세요
- ✅ Vercel 환경변수로만 관리하세요
- ✅ API 키는 주기적으로 교체하세요

### HTTPS 사용
- ✅ 프로덕션 환경에서는 반드시 HTTPS 사용
- ✅ 백엔드도 HTTPS로 설정 권장

---

## 추가 참고 자료
- [Vercel 환경변수 가이드](https://vercel.com/docs/environment-variables)
- [Next.js 환경변수 문서](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Mixed Content 해결 가이드](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
