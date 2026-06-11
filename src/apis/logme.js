import baseHttp from '@/utils/http/base'

// 로그미 데이터 생성 및 결과분석
export const setCheckup = (commonId, data) => {
  return baseHttp.post(`/v1/api/user/logme/create/${commonId}`, data)
}

// 로그미 데이터 분석 업그레이드
export const updateCheckup = (commonId) => {
  return baseHttp.post(`/v1/api/user/logme/upgrade/${commonId}`)
}

// PDF 상태 확인 (생성 완료 여부 및 다운로드 경로 조회)
export const getPdfStatus = (analysisId) => {
  return baseHttp.get(`/v1/api/analysis/${analysisId}/pdf-status`)
}

// PDF 다운로드 (jobId로 다운로드)
export const downloadPdfByAnalysisId = (completeAnalysisId) => {
  return baseHttp.get(`/v1/api/user/pdf/download/${completeAnalysisId}`, {
    responseType: 'arraybuffer'
  })
}
