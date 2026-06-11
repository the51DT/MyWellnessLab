import baseHttp from '@/utils/http/base'

// [설문 - 공통정보]
// 임시저장 설문 전체삭제
export const deleteTempSurvey = (id) => {
  return baseHttp.delete(`/v1/api/user/survey/common-info/temporary/${id}`)
}
