<template>
  <div class="home--addBtn" v-show="shouldShowAddBtn">
    <!-- active 클래스 추가 되는 경우, 하단 푸터 위치값 고정   -->
    <button type="button" class="home--addBtn-create" @click="handleInstallPrompt">
      <img src="/img/ic_addbtn_home.png" :alt="$t('AddBtnHome.icon')">
      <span>{{ $t('AddBtnHome.addToHomeScreen') }}</span>
    </button>
    <button type="button" class="home--addBtn-hidden" @click="dontDisplay">
      <img src="/img/btn-close.svg" :alt="$t('AddBtnHome.close')">
    </button>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { isAndroidDevice, isPwaInstalled, getCookie, showInstallPrompt, checkPwaInstallability } from '@/composables/usePWA'

defineOptions({ name: 'AddBtnHome' })

const shouldShowAddBtn = ref(false)
const deferredPrompt = ref(null)

// PWA 설치 프롬프트 표시
const handleInstallPrompt = () => {
  showInstallPrompt()
}

const dontDisplay = () => {
  shouldShowAddBtn.value = false
  
  const expires = new Date()
  expires.setDate(expires.getDate() + 1)
  document.cookie = `noAddHome=Y; expires=${expires.toUTCString()}; path=/`
}

onMounted(() => {
  // PWA 설치 가능성 변경 이벤트 리스너 (usePWA에서 발생)
  window.addEventListener('pwa-installability-changed', (event) => {
    shouldShowAddBtn.value = event.detail.isInstallable
  })
  
  // 초기 상태 체크 (UI 상태 업데이트 포함)
  const isInstallable = checkPwaInstallability()
  shouldShowAddBtn.value = isInstallable
})
</script>

<style lang="scss" scoped>
.home--addBtn {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 48px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 24px;
  background: #1db196;
  @media (min-width: 960px) {
    display: none;
  }
}
.home--addBtn button{
  border: none;
  background: transparent;
  padding: 0;
}
.home--addBtn-create {
  display: flex;
  align-items: center;
  img{
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  }
  span{
    color: #fff;
    font-size: 16px;
    font-family: 'RixSinHead_Light', sans-serif;
  }
}
.home--addBtn-hidden {
  img{
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }
}
</style>
