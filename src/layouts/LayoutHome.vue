<script setup>
import { inject, onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LayoutHomeTerms from '@/layouts/LayoutHomeTerms.vue'
import LayoutHomePrivacy from '@/layouts/LayoutHomePrivacy.vue'
import LayoutHomeSideMenu from '@/layouts/LayoutHomeSideMenu.vue'
import { useStore } from 'vuex'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const title = ref(document.title) /* 페이지 제목 */
const externalLink = ref(false) /* 암웨이 이동 레이어 노출 */
const isSideBar = ref(false) /* 231214 사이드바 오프너 */
const isPopupTerms = ref(false) /* 231216 이용약관 오프너 */
const isPopupPrivacy = ref(false) /* 231216 개인정보 처리방침 오프너 */
const isPc = ref(false) /* 231217 pc인지? */
const store = useStore()
const axios = inject('$axios')
const token = store.getters.getToken
const accountTypeCode = ref('')
const isLogin = store.getters.isLogin

function showLink (val) { /* 231208 암웨이 링크 레이어 추가 */
  externalLink.value = val
}
function openTerms () {
  isPopupTerms.value = true
}
function termsClose () {
  isPopupTerms.value = false
}
function openPrivacy () {
  isPopupPrivacy.value = true
}
function privacyClose () {
  isPopupPrivacy.value = false
}
function winWidth () { /* 브라우저 가로 사이즈 체크 */
  isPc.value = window.innerWidth > 920
}
function closeSideMenu () {
  isSideBar.value = false
}

const moveCouponPage = () => {
  router.push({ name: 'CouponList' })
}

const moveAmway = () => {
  window.location.href = import.meta.env.VITE_AMWAY_URL
}

const getUserData = () => {
  if (token !== '') {
    axios.get(import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/mypage/user-info', { headers: { Authorization: token } })
      .then(res => {
        accountTypeCode.value = res.data.data.accountTypeCode
      })
      .catch(error => {
        console.log(error)
      })
  }
}

const isShowToast = computed(() => {
  return store.getters.isShowToast
})

const toastMessage = computed(() => {
  return store.getters.getToastMessage
})

onMounted(() => {
  winWidth()
  window.addEventListener('resize', () => {
    winWidth()
  })
  getUserData()
})

watch(
  () => route.path,
  () => {
    title.value = document.title
  },
  {
    immediate: true
  }
)
watch(isSideBar, () => { /* 231214 사이드바가 나오면 바디 스크롤 정지 */
  if (isSideBar.value) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
})

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll')
})

</script>

<template>
  <div class="layout--home" :class="$route.meta.class">
    <header class="header">
      <div class="header--wrap">

        <div class="header--logo">
          <a href="javascript:void(0)" class="btn--home" :class="externalLink ? 'display--none' : ''">
            <img src="/img/logo.svg" alt="$t('LayoutHome.alt.logo')" class="home--img" />
          </a>
          <button
            @click="showLink(true)"
            type="button"
            class="header--home"
            :class="externalLink ? 'display--none' : ''" /> <!--231208 이벤트 추가-->

          <div v-if="externalLink" class="select-home"> <!--231208 클래스 추가-->
            <div>
              <a href="javascript:void(0)" class="select-home--btn"> <!--231208 클래스 추가-->
                <img src="/img/logo.svg" :alt="$t('LayoutHome.alt.logo')" class="home--img" /> <!--231208 클래스 추가-->
              </a>
              <a href="javascript:void(0)" class="select-home--btn" @click="moveAmway"> <!--231208 클래스 추가-->
                <img src="/img/logo_amway.svg" :alt="$t('LayoutHome.alt.amway')" />
              </a>
            </div>
            <div>
              <button @click="showLink(false)" type="button" class="header--home" /> <!--231208 이벤트 추가-->
            </div>
          </div>

        </div>

        <div class="header--menu">
          <div v-if="isLogin">
            <button type="button" class="btn--menu" @click="moveCouponPage">
              <img src="/img/ico_coupon.svg" :alt="$t('LayoutHome.alt.coupon')" />
            </button>
          </div>
          <div>
            <button @click="isSideBar = true" type="button" class="btn--menu">
              <img src="/img/ico_hamburger.svg" :alt="$t('LayoutHome.alt.menu')" />
            </button>

            <transition name="fade">
              <div v-if="isSideBar" @click="closeSideMenu" class="side-bar--dark" /> <!--231214 암막-->
            </transition>

            <transition-group name="slide">
              <div v-if="isSideBar" class="side-bar--con">

                <LayoutHomeSideMenu
                  :isPc="isPc"
                  :isLogin="isLogin"
                  :accountTypeCode="accountTypeCode"
                  @closeSideMenu="closeSideMenu" />

              </div>
            </transition-group>

          </div>
        </div>

      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <div class="footer--wrap">
        <ul class="footer--menu">
          <li>
            <a @click="openTerms" href="javascript:void(0)" class="footer--btn">{{ $t('LayoutHome.link.terms') }}</a>
          </li>
          <li>
            <a @click="openPrivacy" href="javascript:void(0)" class="footer--btn">{{ $t('LayoutHome.link.privacy') }}</a>
          </li>
        </ul>
        <div class="footer--cs">
          <div>{{ $t('LayoutHome.footer.cs.line1') }}</div>
          <div>{{ $t('LayoutHome.emailInquiry') }} : cskorea@amway.com</div>
        </div>
        <address>
          {{ $t('LayoutHome.footer.address') }}
        </address>
        <div class="footer--link">
          {{ $t('LayoutHome.hostingProvider') }}: {{ $t('LayoutHome.amwayKorea') }}
          <a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1208103391" target="_blank">{{ $t('LayoutHome.businessInfoPage') }}</a>
        </div>
        <div class="footer--copy">
          ALL CONTENT Copyright © 2019 Amway Korea LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>

    <LayoutHomeTerms :isPopupTerms="isPopupTerms" @popupClose="termsClose" />
    <LayoutHomePrivacy :isPopupPrivacy="isPopupPrivacy" @popupClose="privacyClose" />

    <!--
      <transition name="toastFade">
      <div v-if="isShowToast" class="toast">
      {{ toastMessage }}
      </div>
      </transition>
    -->
  </div>
</template>
