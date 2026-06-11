import baseHttp from '@/utils/http/base'

// CodeF 1차 인증
export const getFirstCertification = (data) => {
  return baseHttp.post('/v1/api/user/codef/first-certification', data)
}

// CodeF 2차 인증
export const getSecondCertification = (data, config = {}) => {
  return baseHttp.post('/v1/api/user/codef/second-certification', data, config)
}
