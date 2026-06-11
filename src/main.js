import '@/assets/css/default.scss'

import App from './App.vue'
import { createApp } from 'vue'
//import { createI18n } from 'vue-i18n'
//import { messages, detectUserLocale } from './locales'
import i18n from './locales'
import router from '@/router'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import store from '@/store/index'
import apiInterceptors from '@/api/common/apiInterceptors'
import { setAppContext } from '@/components/message/src/message'
import { Navigation, Pagination /* Scrollbar, A11y */ } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import axios from 'axios'

// iOS Safari vh 문제 해결을 위한 폴백 초기화
import { initVHFallback } from '@/assets/js/common'

apiInterceptors(store)

// const i18n = createI18n({
//   legacy: false, 
//   locale: detectUserLocale(), // 사용자 언어 자동 감지
//   fallbackLocale: 'en',
//   messages
// })

const app = createApp(App)
app.use(router)
app.use(VCalendar, {})
app.use(store)
app.use(i18n)
setAppContext(app)

// 스와이퍼 관련
// import 'swiper/css/scrollbar';
app.component('swiper', Swiper)
app.component('swiper-slide', SwiperSlide)
app.component('navigation', Navigation)
app.component('pagination', Pagination)
// app.component('scrollbar', Scrollbar)
// app.component('A11y', A11y)

app.provide('$axios', axios)

app.mount('#app')

// iOS Safari vh 문제 해결 초기화 (앱 마운트 후 실행)
initVHFallback()

// 개발시 스토어 확인을 위해 추가
if (['development', 'staging'].includes(import.meta.env.MODE)) {
  window.$store = store
}
