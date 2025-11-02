/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // output: 'export', // API 라우트 사용을 위해 제거 (정적 내보내기와 API 라우트는 호환되지 않음)
}

export default nextConfig
