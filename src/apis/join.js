import baseHttp from '@/utils/http/base'

// 사용자 서비스 가입
export const setUser = (data) => {
  return baseHttp.post('/v1/api/user/signup', data)
}

// 서비스 가입 여부
export const getJoinStatus = (customerId) => {
  return baseHttp.get(`/v1/api/user/signup/check/${customerId}`)
}

// 휴대폰 인증(SMS 보내기)
export const pushSMS = (customerId, data) => {
  return baseHttp.post(`/v1/api/user/signup/sms/${customerId}`, data)
}

// 휴대폰 인증확인
export const getCertificationSMS = (customerId, certificationNumber) => {
  return baseHttp.get(`/v1/api/user/signup/sms/${customerId}/${certificationNumber}`)
}