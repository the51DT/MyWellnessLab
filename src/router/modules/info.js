import LayoutNormal from '@/layouts/LayoutNormal.vue'

const infoRouter = {
  path: '/info',
  name: 'Info',
  component: LayoutNormal,
  children: [
    {
      path: 'guide',
      name: 'ServiceUseGuide',
      component: () => import('@/views/info/ServiceUseGuide.vue'),
      meta: {
        title: 'Router.info.text1',
        class: 'whiteHeader wide'
      }
    },
    {
      path: 'faq',
      name: 'Faq',
      component: () => import('@/views/info/Faq.vue'),
      meta: {
        title: 'FAQ',
        class: 'whiteHeader wide'
      }
    },
    {
      path: 'introduce',
      name: 'Introduce',
      component: () => import('@/views/info/Introduce.vue'),
      meta: {
        title: 'Router.info.text2',
        class: 'wide whiteHeader'
      }
    }
  ]
}

export default infoRouter
