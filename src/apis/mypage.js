import baseHttp from '@/utils/http/base'

// 로그인한 사용자 정보 조회
export const getLoggedInUserInfo = () => {
  return baseHttp.get('/v1/api/user/mypage/user-info')
}

// 검진 데이터 이력 목록
export const getExaminationDataList = (params) => {
  return baseHttp.get('/v1/api/user/mypage/examination-data/list', { params })
}

// 검진 데이터 이력 상세
export const getExaminationDataDetail = (id, completeType) => {
  return baseHttp.get(`/v1/api/user/mypage/examination-data/${id}/complete-type/${completeType}`)
}

// 리포트 인쇄신청 이력 목록
export const getReportHistoryDataList = (params) => {
  return baseHttp.get('/v1/api/user/report-history/list', { params })
}

// 인증번호 전송
export const sendCertificationSms = (params) => {
  return baseHttp.post('/v1/api/user/mypage/change-mobile/sms', params)
}

// 인증번호 인증
export const isCertificationSms = (certificationNumber) => {
  return baseHttp.get(`/v1/api/user/mypage/change-mobile/sms/${certificationNumber}`, { noMessage: true })
}

// 휴대폰번호 변경
export const changeNumber = (params) => {
  return baseHttp.put('/v1/api/user/mypage/change-mobile', params)
}

// 핀번호 확인
export const checkPin = (pin) => {
  return baseHttp.get(`/v1/api/user/mypage/check-pin/${pin}`, { noMessage: true })
}

// 핀번호 변경
export const changePin = (data) => {
  return baseHttp.put('/v1/api/user/mypage/change-pin', data)
}
