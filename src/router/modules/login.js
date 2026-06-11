import LayoutNormal from '@/layouts/LayoutNormal.vue'

const loginRouter = {
  path: '/login',
  name: 'Login',
  component: LayoutNormal,
  children: [
    {
      path: 'profile',
      name: 'LoginProfile',
      component: () => import('@/views/auth/Profile.vue'),
      meta: {
        title: 'Router.login.text1',
        class: 'short'
      }
    },
    {
      path: 'pin',
      name: 'LoginPin',
      component: () => import('@/views/auth/Pin.vue'),
      meta: {
        title: 'Router.login.text2',
        class: 'short'
      }
    },
    {
      path: 'terms',
      name: 'LoginTerms',
      component: () => import('@/views/auth/TermsAgree.vue'),
      meta: {
        title: 'Router.login.text3',
        class: 'middle'
      }
    }
  ]
}

export default loginRouter
