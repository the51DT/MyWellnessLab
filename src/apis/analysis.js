import baseHttp from '@/utils/http/base'

// 분석 완료 상세조회
export const getAnalysisCompleteDetail = (id) => {
  return baseHttp.get(`/v1/api/user/analysis/complete/${id}`)
}

// 분석 완료 삭제
export const deleteAnalysisCompleteDetail = (id) => {
  return baseHttp.delete(`/v1/api/user/analysis/complete/${id}`)
}

// 분석 완료 상세조회 - 검진 데이터 이력
export const getAnalysisCompleteExaminationDetail = () => {
  return baseHttp.get('/v1/api/user/analysis/complete/examination-data')
}

// 분석 완료 목록조회
export const getAnalysisCompleteList = (params) => {
  return baseHttp.get('/v1/api/user/analysis/complete/list', { params })
}

// 메인 - 나의 건강분석 결과
export const getMyAnalysisCompleteDetail = () => {
  return baseHttp.get('/v1/api/user/analysis/complete/my-simple')
}

// 진행 중인 설문조회
export const getProgressCheckup = (analysisType) => {
  return baseHttp.get(`/v1/api/user/analysis/proceeding/${analysisType}`)
}

export const getPrevABCDetail = (id) => {
  return baseHttp.get(`/v1/api/user/analysis/complete/previous-abc/${id}`)
}

/**
 * 건강신호등 상세조회
 *
 * @param {*} id - detailId
 * @returns 건강신호등 상세조회 데이터
 */
export const getAnalysisHeathLightDetail = (id) => {
  return baseHttp.get(`/v1/api/user/analysis/complete/${id}`)
}

/**
 * 분석 실행
 *
 * @param {*} basicsId - 기본 정보 ID
 * @returns 분석 실행 결과
 */
export const runAnalysis = (basicsId) => {
  return baseHttp.post(`/v1/api/user/analysis/run/${basicsId}`)
}
