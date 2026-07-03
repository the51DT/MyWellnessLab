<template>
  <div class="home--addBtn" v-show="shouldShowAddBtn">
    <!-- active 클래스 추가 되는 경우, 하단 푸터 위치값 고정   -->
    <!-- 202606 내부 구조 수정 -->
    <button type="button" class="home--addBtn-close" @click="closeDisplay">
      <img src="/img/btn-close_black.svg" :alt="$t('AddBtnHome.close')">
    </button>
    <button type="button" class="home--addBtn-create" @click="handleInstallPrompt">
      <img src="/img/ic_addbtn_home.svg" :alt="$t('AddBtnHome.icon')">
      <span>홈 화면에<br>추가</span>
    </button>
    <button type="button" class="home--addBtn-hidden" @click="dontDisplay">다시 안 보기</button>
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

// 202606 그냥 닫기 이벤트 추가
const closeDisplay = () => {
  shouldShowAddBtn.value = false
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

<!-- 202606 스타일 수정 -->
<style lang="scss" scoped>
.home--addBtn {
  position: fixed;
  bottom: 169px;
  right: 28px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (min-width: 960px) {
    display: none;
  }
}
.home--addBtn button{
  border: none;
  padding: 0;
}
.home--addBtn-create {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 66px;
  height: 66px;
  border-radius: 48px;
  background: #092F28;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4);
  img{
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
  span{
    color: #fff;
    font-size: 10px;
    font-family: 'Pretendard', sans-serif;
  }
}
.home--addBtn-hidden {
  background: transparent;
  margin-top: 2px;
  font-size: 11px;
  line-height: 1.5;
  color: #092F28;
}
.home--addBtn-close {
  width: 12px;
  align-self: flex-end;
  background: transparent;
  img{
    width: 100%;
  }
}
</style>
