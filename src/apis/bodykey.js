import baseHttp from '@/utils/http/base'

// 바디키 조회 
export const getBodykeyData = (data) => {
  return baseHttp.post('/v1/api/user/inbodyapi/get-data', data)
}
// 바디키 데이터 체성분 등록
export const setBodyKeyCompositionData = (data) => {
  return baseHttp.post('/v1/api/user/bodyComposition/bodykey', data)
}
// 직접입력 데이터 체성분 등록
export const setCustomCompositionData = (data) => {
  return baseHttp.post('/v1/api/user/bodyComposition/custom', data)
}
// 체성분 리스트 조회
export const getBodyCompositionData = (connectTypes) => {
  // connectTypes가 배열인 경우 쉼표로 구분된 문자열로 변환
  const typesParam = Array.isArray(connectTypes) ? connectTypes.join(',') : connectTypes
  
  // 매개변수가 있는 경우 쿼리 파라미터로 전달 (백엔드 파라미터명에 맞춤)
  const url = typesParam ? `/v1/api/user/bodyComposition?connectTypes=${typesParam}` : '/v1/api/user/bodyComposition'
  
  return baseHttp.get(url)
}
// 특정 체성분 정보 조회
export const getBodyCompositionById = (id) => {
  return baseHttp.get(`/v1/api/user/bodyComposition/${id}`)
}