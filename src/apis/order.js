import baseHttp from '@/utils/http/base'

// 배송 정보 조회
export const getDeliveryInfo = (transactionCode, reportCode) => {
  return baseHttp.get(`/v1/api/user/logme/print-delivery/transaction-code/${transactionCode}/report-code/${reportCode}`)
}

// 결제 취소
export const paymentCancel = (code, transactionCode) => {
  const params = {
    code,
    transactionCode
  }
  console.log(params)
  return baseHttp.get('/v1/api/user/order/order-remove', { params })
}
