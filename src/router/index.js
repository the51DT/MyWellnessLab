import { createRouter, createWebHistory } from 'vue-router'
// modules
import analyzeRouter from './modules/analyze'
import checkupRouter from './modules/checkup'
import checkupSideRouter from './modules/checkupSide'
import couponRouter from './modules/coupon'
import infoRouter from './modules/info'
import joinRouter from './modules/join'
import loginRouter from './modules/login'
import myPageRouter from './modules/myPage'
import orderRouter from './modules/order'
import publishingRouter from './modules/publishing'

import LayoutHome from '@/layouts/LayoutHome.vue'

import store from '@/store'
import { ACCESS_CONTROL_TYPE } from '@/utils/commonCode'
import { useAccessControl } from '@/composables/accessControl'
import { requestHeapAnalytics } from '@/utils/heap'
import { i18n } from '@/locales'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/reload',
    name: 'Reload',
    component: () => import('@/views/Reload.vue')
  },
  {
    path: '/construction',
    name: 'Construction',
    component: () => import('@/layouts/LayoutConstruction.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Construction.vue'),
        meta: {
          title: '점검중',
          class: 'construction'
        }
      }
    ]
  },
  {
    path: '/test-analysis',
    name: 'TestAnalysis',
    component: () => import('@/views/TestAnalysis.vue'),
    meta: {
      title: '테스트 분석'
    }
  },
  {
    path: '/',
    component: LayoutHome,
    redirect: { name: 'Home' },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '홈'
        }
      },
      {
        path: 'intro',
        name: 'Intro',
        component: () => import('@/views/Intro.vue'),
        meta: {
          title: '인트로',
          class: 'whiteHeader'
        }
      }
    ]
  },

  analyzeRouter,
  checkupRouter,
  checkupSideRouter,
  couponRouter,
  infoRouter,
  joinRouter,
  loginRouter,
  myPageRouter,
  orderRouter,
  publishingRouter
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    // 브라우저 뒤로가기/앞으로가기로 이동한 경우 이전 스크롤 위치로 복원
    if (savedPosition) {
      return savedPosition
    }
    // 일반적인 페이지 이동의 경우 맨 위로 스크롤
    return { top: 0 }
  }
})

// Navigation Guard: 외부에서 진입하는 경우 currentSection 초기화
router.beforeEach((to, from, next) => {
  // 홈에서 진입하는 경우 currentSection 초기화
  if (from.path === '/home' || from.path === '/') {
    store.dispatch('analyze/setCurrentSection', undefined)
  }
  
  next()
})

// 페이지 제목 세팅
// router.afterEach((to) => {
//   document.title = to.meta.title || 'MyWellness LAB'
// })

router.beforeEach(async (to, from, next) => {
  const isLogin = store.getters.isLogin

  const nextWithTitle = (route) => {
    //setPageTitle(route || to)
    return next(route)
  }

  if (isLogin) {
    requestHeapAnalytics(to, store.getters.getUser)
  }

  if (to.name === 'Home') {
    const accessControl = useAccessControl()
    await accessControl()
  }

  // checkup 페이지 접근 시 basicsId 확인
  if (to.path.includes('/checkup/') && to.name !== 'CheckupBasics') {
    const basicsId = store.getters['checkup/getBasicsId']
    // null 또는 undefined 검증
    if (!basicsId) {
      console.log('Checkup 페이지 접근 시 basicsId 없음 - Home으로 리다이렉트')
      alert(i18n.global.t('Common.invalidAccess'))
      return nextWithTitle({ name: 'Home' })
    }

    // 양의 정수 검증
    const basicsIdNum = Number(basicsId)
    if (isNaN(basicsIdNum) || !Number.isInteger(basicsIdNum)) {
      console.log('Checkup 페이지 접근 시 basicsId 정수가 아님 - Home으로 리다이렉트')
      alert(i18n.global.t('Common.invalidAccess'))
      return nextWithTitle({ name: 'Home' })
    }
  }

  // console.log('to.path', to.path)
  if (to.path.includes('/publishing') || to.path.includes('/info') || to.path === '/construction' ) {
    return nextWithTitle()
  }

  try {
    const accessControlType = await store.dispatch('getAccessControlType')

    if (to.name === 'Intro') {
      if (isLogin) {
        return nextWithTitle({ name: 'Home' })
      } else {
        if (accessControlType === ACCESS_CONTROL_TYPE.ENTRY) {
          return nextWithTitle({ name: 'Reload' })
        }
      }

      return next()
    }

    if (accessControlType === ACCESS_CONTROL_TYPE.NO_ENTRY) {
      store.dispatch('initUser')
      return nextWithTitle({ name: 'Intro' })
    } else if (accessControlType === ACCESS_CONTROL_TYPE.RELOAD) {
      store.dispatch('initUser')
      return nextWithTitle({ name: 'Reload' })
    }
    return nextWithTitle()
  } catch (e) {
    store.dispatch('initUser')
    return nextWithTitle({ name: 'Intro' })
  }
})

// title 설정 헬퍼 함수
// myWellness LAB 일괄 적용으로 인해 주석처리
/* function setPageTitle(route) {
  if (route.meta?.title) {
    if (route.meta.title.startsWith('Router.')) {
      const translatedTitle = i18n.global.t(route.meta.title)
      document.title = translatedTitle
    } else {
      document.title = route.meta.title
    }
  } else {
    // title이 없으면 아무것도 하지 않음 (기존 title 유지)
  }
} */

export default router
