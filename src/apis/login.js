import axios from 'axios'
import baseHttp from '@/utils/http/base'
import hybrisHttp from '@/utils/http/hybris'
import { getCookie } from '@/utils/cookies'

// 암웨이 로그인 여부 확인 (Hybris 쿠키 기반 체크)
export const getAmwayAuthorize = async () => {
  const occBaseUrl = (import.meta.env.VITE_HYBRIS_API_URL || import.meta.env.VITE_HYBRIS_DOMAIN_URL || '').replace(/\/$/, '')
  const endpoint = occBaseUrl ? `${occBaseUrl}/api/v2/amwaykorea/sso/authorizeEvent` : '/api/v2/amwaykorea/sso/authorizeEvent'
  const ssoToken = (getCookie('ssoToken') || getCookie('SSO_TOKEN') || '').trim()

  const response = await axios.get(endpoint, {
    withCredentials: true,
    headers: ssoToken ? { ssoToken } : {}
  })

  return response.data
}

// 암웨이 사용자 정보 가져오기
export const getAmwayProfileList = (customerUid, params) => {
  return hybrisHttp.get(`/api/v2/amwaykorea/acontent/customers/Uid/${customerUid}`, { params })
}

// PIN 번호 분실 - 휴대폰 인증(SMS 보내기)
export const pushSMS = (customerId, data) => {
  return baseHttp.post(`/v1/api/user/login/lost-pin/sms/${customerId}`, data)
}

// PIN 번호 분실 - 휴대폰 인증확인
export const getCertificationSMS = (customerId, certificationNumber) => {
  return baseHttp.get(`/v1/api/user/login/lost-pin/sms/${customerId}/${certificationNumber}`)
}

// Hybris 토큰 발행
export const getHybrisToken = () => {
  return baseHttp.get('/v1/api/user/login/token')
}

// Hybris 토큰 재발행
export const getNewHybrisToken = () => {
  return baseHttp.get('/v1/api/user/login/token/refresh')
}

// 사용자 현재 핀번호 실패회수 조회
export const getPinFailCount = (data) => {
  return baseHttp.post('/v1/api/user/login/pin', data)
}

// 사용자 핀번호 확인
export const getPinCheck = (data) => {
  return baseHttp.post('/v1/api/user/login/pin/check', data)
}

// PIN 번호 재설정
export const updatePin = (data) => {
  return baseHttp.put('/v1/api/user/login/reset-pin', data)
}

// 사용자 약관 동의
export const setTerms = (data) => {
  return baseHttp.post('/v1/api/user/login/term/agree', data)
}

// 사용자 최신 약관 체크
export const getLatestTermsChecked = (customerId) => {
  return baseHttp.get(`/v1/api/user/login/terms/check/${customerId}`)
}

// 최신 약관 중 미동의 목록
export const getDisagreeTermsList = (customerId) => {
  return baseHttp.get(`/v1/api/user/login/terms/disagree/${customerId}`)
}

// 사용자 로그인
export const login = (data) => {
  return baseHttp.post('/v1/api/user/login/signin', data)
}

// 사용자 전화번호 조회
export const getUserMobile = (customerId) => {
  return baseHttp.get(`/v1/api/user/login/user-phone/${customerId}`)
}
