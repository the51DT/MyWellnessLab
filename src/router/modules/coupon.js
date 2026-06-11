import LayoutNormal from '@/layouts/LayoutNormal.vue'

const couponRouter = {
  path: '/coupon',
  component: LayoutNormal,
  redirect: { name: 'CouponList' },
  children: [
    {
      path: 'list',
      name: 'CouponList',
      component: () => import('@/views/coupon/CouponList.vue'),
      meta: {
        title: 'Router.coupon.text1',
        class: 'short'
      }
    }
  ]
}

export default couponRouter
