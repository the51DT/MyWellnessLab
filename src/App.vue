<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import { initGlobalPWA } from '@/composables/usePWA'

const store = useStore()
const router = useRouter()

const intervalId = ref(null)
const iframe = ref()

const isShowJoinAlert = computed(() => {
  return store.getters.getIsShowJoinAlert
})

const amwayKeepSessionUrl = computed(() => {
  const amwayUrl = import.meta.env.VITE_AMWAY_URL
  console.log('amwayUrl:', amwayUrl)
  return `${amwayUrl}/account/keepSession?SiteId=LOGME`
})

const handleResize = () => {
  store.dispatch('setIsPc', window.innerWidth > 960)
}

const updateAmwaySession = () => {
  iframe.value.src += ''
}

const moveJoinPage = () => {
  store.dispatch('setIsShowJoinAlert', false)
  router.push({ name: 'JoinTermsAgree' })
}

onBeforeMount(async () => {
  window.addEventListener('resize', handleResize)
})

onMounted(() => {
  const intervalTime = 1000 * 60 * 25 // 25분
  intervalId.value = setInterval(() => {
    updateAmwaySession()
  }, intervalTime)

  let checkPoint = 0
  const url = location.href
  const agent = navigator.userAgent.toLowerCase()

  if (agent.includes('kakao')) {
    location.href = 'kakaotalk://inappbrowser/close'
    if (navigator.userAgent.match(/iPhone|iPad/i)) {
      if (checkPoint === 0) {
        location.href = 'kakaotalk://web/openExternal?url=' + url
        checkPoint = 1
      }
    } else {
      location.href = 'intent://' + location.href.replace(/https?:\/\//i, '') + '#Intent;scheme=http;package=com.android.chrome;end'
    }
  }

  // 마우스 우클릭 방지
  window.addEventListener('contextmenu',
    (event) => {
      event.preventDefault()
    }
  )

  // PWA 초기화 (안드로이드에서만)
  if ('serviceWorker' in navigator) {
    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroid = /android/i.test(userAgent)
    
    if (isAndroid) {
      initGlobalPWA()
    }
  } 
})

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }

  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <router-view />

  <base-popup v-if="isShowJoinAlert" class="openPopContinue">
    <template v-slot:contents>
      <p>{{ $t('App.text1') }}</p>
      <p>{{ $t('App.text2') }}</p>
      <div class="txt--center">
        <button class="btn-pop--green" type="button" @click="moveJoinPage">{{ $t('Common.confirm') }}</button>
      </div>
    </template>
  </base-popup>

  <iframe
    ref="iframe"
    v-show="false"
    :src="amwayKeepSessionUrl"
    id="ifr1"
    style="width:200px;height:50px;" />
</template>
