import baseHttp from '@/utils/http/base'

// 리포트 파일 이력 등록
export const createReportFileHistory = (params) => {
  return baseHttp.post('/v1/api/user/report-file-history', params)
}
