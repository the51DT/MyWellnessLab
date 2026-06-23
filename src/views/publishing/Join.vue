<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import BaseUserSelect from '@/views/publishing/BaseUserSelect.vue'
import BasePopup from '@/views/publishing/BasePopup.vue'

const data = ref([
  { name: '안지희', sex: 1 },
  { name: '이하늘', sex: 0 }
])

/* 2026 퍼블확인용 */
const isPc = ref(false) /* 231228 pc인지? */
const isShowJoinConfirmPopup = ref(false)

function userSelect(who) {
  /* who: 선택된 프로필 객체, 개발 후 삭제 요망 */
  router.push('/join-terms-agree') /* 선택된 프로필을 포함해서 링크 걸어야 함 to 개발 */
}

/* 2026 퍼블확인용 */
/* 가입하기 버튼 클릭 시 팝업 닫기 */
const handleJoinConfirm = () => {
  isShowJoinConfirmPopup.value = false
}

/* 2026 퍼블확인용 */
/* 취소 버튼 클릭 시 환경에 따라 다른 암웨이 사이트로 이동 */
const handleJoinCancel = () => {
  const isDev = import.meta.env.DEV || window.location.hostname.includes('dev')
  const targetUrl = isDev ? 'https://www.uat.amway.co.kr/main' : 'https://amway.co.kr'
  window.location.href = targetUrl
}

/* 2026 퍼블확인용 */
onMounted(async () => {
  // 페이지 진입 시 가입 확인 팝업 표시
  isShowJoinConfirmPopup.value = true
})
</script>

<template>
  <div class="join--wrap">

    <div class="join--center-wrap">
      <div class="join--txt">
        사용자 프로필을 <br v-if="!isPc"> 선택해 주세요
      </div>

      <BaseUserSelect :data="data" @userSelect="userSelect(data)" class="join--user" />

    </div>

    <!-- 2026 / MWL_00002 = src\views\auth\TermsAgree.vue 참고 -->
    <!-- 가입 확인 팝업 -->
    <BasePopup v-if="isShowJoinConfirmPopup" class="TermsAgree--join-confirm">
      <template v-slot:contents>
        <div class="join-confirm-content">
          <p class="pop-text-light">829055</p>
          <p class="pop-text-light">안지희</p>
          <p class="pop-text-bold">마이웰니스 랩에 가입 하시겠습니까?</p>
        </div>
        <div class="pop-btn-wrap">
          <button type="button" @click="handleJoinCancel" class="pop-btn pop-btn--gray">취소</button>
          <button type="button" @click="handleJoinConfirm" class="pop-btn pop-btn--green">가입하기</button>
        </div>
      </template>
    </BasePopup>

  </div>
</template>

<style lang="scss"></style>
