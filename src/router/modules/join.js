import LayoutNormal from '@/layouts/LayoutNormal.vue'

const joinRouter = {
  path: '/join',
  name: 'Join',
  component: LayoutNormal,
  children: [
    {
      path: 'terms',
      name: 'JoinTermsAgree',
      component: () => import('@/views/auth/TermsAgree.vue'),
      meta: {
        title: 'Router.join.text1',
        class: 'middle'
      }
    },
    {
      path: 'phone',
      name: 'JoinPhoneCertification',
      component: () => import('@/views/auth/PhoneCertification.vue'),
      meta: {
        title: 'Router.join.text2',
        class: 'short'
      }
    },
    {
      path: 'pin',
      name: 'JoinPinRegistration',
      component: () => import('@/views/auth/PinRegistration.vue'),
      meta: {
        title: 'Router.join.text3',
        class: 'short'
      }
    }
  ]
}

export default joinRouter
