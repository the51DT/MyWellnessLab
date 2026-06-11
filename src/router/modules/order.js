import LayoutOrderNpay from '@/layouts/LayoutOrderNpay.vue'
import store from '@/store'

const orderRouter = {
  path: '/order',
  name: 'Order',
  component: LayoutOrderNpay,
  children: [
    {
      path: 'pay',
      name: 'OrderNpay',
      component: () => import('@/views/order/OrderNpay.vue'),
      meta: {
        title: '리포트 주문/결제'
      },
      beforeEnter: (to, from, next) => {
        const accessible = store.getters['order/getAccessible']

        if (!accessible) {
          alert('비정상적인 접근입니다.')
          next(false)
        }

        next()
      }
    },
    {
      path: 'detail/:orderCode/:transactionCode',
      name: 'OrderNpayDetail',
      component: () => import('@/views/order/OrderNpayDetail.vue'),
      meta: {
        title: '리포트 주문상세'
      }
    }
  ]
}

export default orderRouter
