<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ACCESS_CONTROL_TYPE } from '@/utils/commonCode'
import BtnTop from '@/views/publishing/BtnTop.vue'

const store = useStore()
const router = useRouter()

// 접근 제어 확인 함수
const checkAccessControl = async () => {
  try {
    const accessControlType = await store.dispatch('getAccessControlType')
    if (accessControlType === ACCESS_CONTROL_TYPE.ENTRY) {
      router.push({ name: 'Reload' })
      return true
    }
    if (accessControlType === ACCESS_CONTROL_TYPE.RELOAD) {
      await store.dispatch('initUser')
      router.push({ name: 'Reload' })
      return true
    }
    return false // 로그인되지 않은 상태
  } catch (error) {
    console.error('접근 제어 확인 중 오류:', error)
    return false
  }
}

const moveAmwayLoginPage = async () => {
  // 먼저 접근 제어 확인
  const isLoggedIn = await checkAccessControl()
  
  if (!isLoggedIn) {
    // 로그인되지 않은 상태라면 암웨이 로그인 페이지로 이동
    window.location.href = import.meta.env.VITE_HYBRIS_LOGIN_URL
  }
}

onMounted(async () => {
  await checkAccessControl()
})
</script>

<template>
  <section class="intro">
    <div class="intro--main">
      <p class="intro--txt">{{ $t('Intro.mainTitle') }}</p>
      <div class="intro--logo">
        <img src="/img/logo.svg" alt="myWellness LAB" />
      </div>
      <div class="intro--btn">
        <a href="javascript: void(0);" class="intro--login" @click="moveAmwayLoginPage">
          <span>Amway {{ $t('Intro.text2') }}<span class="intro--grade">(ABO, Member, Customer)</span></span>
        </a>
      </div>
    </div>

    <div class="intro--unit">
      <p class="intro--copy-sub">{{ $t('Intro.copySub1') }}</p>
      <p class="intro--copy">{{ $t('Intro.copy1') }}</p>
      <p class="intro--desc">{{ $t('Intro.desc1') }}</p>
    </div>

    <div class="intro--unit unit2">
      <p class="intro--copy-sub">{{ $t('Intro.text6') }}</p>
      <p class="intro--copy">{{ $t('Intro.text7') }}</p>
      <p class="intro--desc" v-html="$t('Intro.desc2')"></p>
    </div>

    <div class="intro--unit unit3">
      <p class="intro--copy-sub">{{ $t('Intro.text9') }}</p>
      <p class="intro--copy">{{ $t('Intro.text10') }}</p>
      <p class="intro--desc" v-html="$t('Intro.desc3')"></p>
    </div>

    <BtnTop />
  </section>
</template>
