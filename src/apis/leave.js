import baseHttp from '@/utils/http/base'

// 사용자 서비스 탈퇴
export const leave = (data) => {
  return baseHttp.post('/v1/api/user/leave', data)
}
