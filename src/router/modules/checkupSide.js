import LayoutNormal from '@/layouts/LayoutNormal.vue'
import store from '@/store'
const checkupSideRouter = {
  path: '/checkup-side',
  component: LayoutNormal,
  redirect: { name: 'CheckupSideSelect' },
  children: [
    {
      path: 'guide',
      name: 'CheckupGuide',
      component: () => import('@/views/checkupSide/CheckupGuide.vue'),
      meta: {
        title: 'Router.checkupSide.text5',
        class: 'wide'
      }
    },
    {
      path: 'select',
      name: 'CheckupSideSelect',
      component: () => import('@/views/checkupSide/Checkup.vue'),
      meta: {
        title: 'Router.checkupSide.text1',
        class: 'short'
      }
    },
    {
      path: 'date',
      name: 'CheckupDateSelect',
      component: () => import('@/views/checkupSide/CheckupDateSelect.vue'),
      meta: {
        title: 'Router.checkupSide.text2',
        class: 'middle'
      }
    },
    {
      path: 'terms',
      name: 'CheckupSideTerms',
      component: () => import('@/views/checkupSide/CheckupPrivacyAgree.vue'),
      meta: {
        title: 'Router.checkupSide.text3',
        class: 'wide'
      }
    },
    {
      path: 'complete',
      name: 'CheckupSideComplete',
      component: () => import('@/views/checkupSide/CheckupComplete.vue'),
      meta: {
        title: 'Router.checkupSide.text4'
      },
      beforeEnter: (to, from, next) => {
        const basicsId = store.getters['checkup/getBasicsId']

        if (basicsId || from.name === 'CheckupDrinkSmokeSleep') {
          next()
        }

        next({ name: 'Home' })
      }
    }
  ]
}

export default checkupSideRouter
