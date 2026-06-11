import baseHttp from '@/utils/http/base'

// FAQ 카테고리 조회
export const getFaqCategory = () => {
  return baseHttp.get('/v1/api/user/faq/category')
}

// FAQ 목록 조회
export const getFaqList = (faqCategoryCode) => {
  return baseHttp.get(`/v1/api/user/faq/list/${faqCategoryCode}`)
}