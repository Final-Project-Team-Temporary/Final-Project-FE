import { Article, ArticleFilters, ApiResponse } from "@/lib/types"

// 모의 기사 데이터
const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: "2024년 ETF 투자 전략: 분산투자의 핵심",
    content: `
      <h2>ETF란 무엇인가?</h2>
      <p>ETF(Exchange Traded Fund)는 거래소에서 거래되는 상장지수펀드로, 특정 지수의 성과를 추적하는 펀드입니다.</p>
      
      <h2>2024년 ETF 투자 전략</h2>
      <p>올해 ETF 투자 시 고려해야 할 주요 전략들을 살펴보겠습니다:</p>
      
      <h3>1. 섹터별 분산투자</h3>
      <p>기술주, 헬스케어, 에너지 등 다양한 섹터에 분산투자하여 리스크를 최소화합니다.</p>
    `,
    summary: "ETF를 활용한 효과적인 분산투자 전략에 대해 알아봅니다.",
    difficulty: "intermediate",
    category: "ETF",
    keywords: ["ETF", "분산투자", "포트폴리오"],
    author: "김투자",
    authorTitle: "투자 전문가",
    publishDate: "2024-01-15",
    readTime: "7분",
    views: 1580,
    likes: 234,
    comments: 45,
    hasAudio: true,
  },
  {
    id: 2,
    title: "배당주 투자의 모든 것: 안정적인 수익 창출법",
    content: `
      <h2>배당주란?</h2>
      <p>배당주는 정기적으로 배당금을 지급하는 주식을 의미합니다.</p>
      
      <h2>배당주 투자의 장점</h2>
      <p>안정적인 현금 흐름과 장기적인 자산 증식이 가능합니다.</p>
    `,
    summary: "배당주 투자를 통한 안정적인 수익 창출 방법을 소개합니다.",
    difficulty: "beginner",
    category: "주식",
    keywords: ["배당주", "배당수익률", "안정투자"],
    author: "이경제",
    authorTitle: "경제 분석가",
    publishDate: "2024-01-14",
    readTime: "5분",
    views: 2340,
    likes: 189,
    comments: 32,
    hasAudio: true,
  },
  {
    id: 3,
    title: "부동산 시장 전망과 REITs 투자 가이드",
    content: `
      <h2>REITs란?</h2>
      <p>REITs(Real Estate Investment Trusts)는 부동산투자신탁을 의미합니다.</p>
      
      <h2>2024년 부동산 시장 전망</h2>
      <p>금리 변화와 정책 변화가 부동산 시장에 미치는 영향을 분석합니다.</p>
    `,
    summary: "2024년 부동산 시장 전망과 REITs 투자 전략을 분석합니다.",
    difficulty: "advanced",
    category: "부동산",
    keywords: ["부동산", "REITs", "시장전망"],
    author: "박부동산",
    authorTitle: "부동산 전문가",
    publishDate: "2024-01-13",
    readTime: "12분",
    views: 890,
    likes: 156,
    comments: 28,
    hasAudio: false,
  },
]

// 기사 목록 가져오기
export async function getArticles(filters?: ArticleFilters): Promise<ApiResponse<Article[]>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // 네트워크 지연 시뮬레이션
    
    let filteredArticles = [...MOCK_ARTICLES]
    
    if (filters) {
      // 카테고리 필터
      if (filters.category && filters.category !== "all") {
        filteredArticles = filteredArticles.filter(article => article.category === filters.category)
      }
      
      // 난이도 필터
      if (filters.difficulty && filters.difficulty !== "all") {
        filteredArticles = filteredArticles.filter(article => article.difficulty === filters.difficulty)
      }
      
      // 검색어 필터
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredArticles = filteredArticles.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.keywords.some(keyword => keyword.toLowerCase().includes(query))
        )
      }
      
      // 정렬
      switch (filters.sortBy) {
        case "popular":
          filteredArticles.sort((a, b) => b.likes - a.likes)
          break
        case "views":
          filteredArticles.sort((a, b) => b.views - a.views)
          break
        case "latest":
        default:
          filteredArticles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
          break
      }
    }
    
    return {
      success: true,
      data: filteredArticles
    }
  } catch (error) {
    return {
      success: false,
      error: "기사 목록을 가져오는 중 오류가 발생했습니다."
    }
  }
}

// 특정 기사 가져오기
export async function getArticleById(id: number): Promise<ApiResponse<Article>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300)) // 네트워크 지연 시뮬레이션
    
    const article = MOCK_ARTICLES.find(article => article.id === id)
    
    if (!article) {
      return {
        success: false,
        error: "기사를 찾을 수 없습니다."
      }
    }
    
    return {
      success: true,
      data: article
    }
  } catch (error) {
    return {
      success: false,
      error: "기사를 가져오는 중 오류가 발생했습니다."
    }
  }
}

// 추천 기사 가져오기
export async function getRecommendedArticles(userId?: string): Promise<ApiResponse<Article[]>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400)) // 네트워크 지연 시뮬레이션
    
    // 사용자 기반 추천 로직 (모의)
    const recommendedArticles = MOCK_ARTICLES
      .sort(() => 0.5 - Math.random()) // 랜덤 셔플
      .slice(0, 3) // 상위 3개만
    
    return {
      success: true,
      data: recommendedArticles
    }
  } catch (error) {
    return {
      success: false,
      error: "추천 기사를 가져오는 중 오류가 발생했습니다."
    }
  }
}

// 기사 좋아요
export async function likeArticle(articleId: number): Promise<ApiResponse<{ likes: number }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const article = MOCK_ARTICLES.find(a => a.id === articleId)
    if (!article) {
      return {
        success: false,
        error: "기사를 찾을 수 없습니다."
      }
    }
    
    article.likes += 1
    
    return {
      success: true,
      data: { likes: article.likes }
    }
  } catch (error) {
    return {
      success: false,
      error: "좋아요 처리 중 오류가 발생했습니다."
    }
  }
}

// 기사 북마크
export async function bookmarkArticle(articleId: number): Promise<ApiResponse<{ bookmarked: boolean }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 실제로는 사용자별 북마크 상태를 데이터베이스에 저장
    const isBookmarked = Math.random() > 0.5 // 모의 응답
    
    return {
      success: true,
      data: { bookmarked: isBookmarked }
    }
  } catch (error) {
    return {
      success: false,
      error: "북마크 처리 중 오류가 발생했습니다."
    }
  }
}

// 기사 검색
export async function searchArticles(query: string): Promise<ApiResponse<Article[]>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const searchResults = MOCK_ARTICLES.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.summary.toLowerCase().includes(query.toLowerCase()) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    )
    
    return {
      success: true,
      data: searchResults
    }
  } catch (error) {
    return {
      success: false,
      error: "검색 중 오류가 발생했습니다."
    }
  }
}