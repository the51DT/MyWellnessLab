import baseHttp from '@/utils/http/base'

export const getCouponList = (params) => {
  return baseHttp.get('/v1/api/user/coupon/list', { params })
}
