<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import BaseUserSelect from '@/views/publishing/BaseUserSelect.vue' // 퍼블 확인용
import BasePopup from '@/views/publishing/BasePopup.vue'

/* 퍼블확인용 */
const data = ref([
  { name: '안지희', sex: 1 },
  { name: '이하늘', sex: 0 }
])

/* 퍼블확인용 */
const isPc = ref(false) /* 231228 pc인지? */
const isShowJoinConfirmPopup = ref(false)

function userSelect(who) {
  /* who: 선택된 프로필 객체, 개발 후 삭제 요망 */
  router.push('/join-terms-agree') /* 선택된 프로필을 포함해서 링크 걸어야 함 to 개발 */
}

/* 퍼블확인용 */
/* 가입하기 버튼 클릭 시 팝업 닫기 */
const handleJoinConfirm = () => {
  isShowJoinConfirmPopup.value = false
}

/* 퍼블확인용 */
/* 취소 버튼 클릭 시 환경에 따라 다른 암웨이 사이트로 이동 */
const handleJoinCancel = () => {
  const isDev = import.meta.env.DEV || window.location.hostname.includes('dev')
  const targetUrl = isDev ? 'https://www.uat.amway.co.kr/main' : 'https://amway.co.kr'
  window.location.href = targetUrl
}

onMounted(async () => {
  // 페이지 진입 시 가입 확인 팝업 표시 - 퍼블확인용
  isShowJoinConfirmPopup.value = true
})
</script>

<template>
  <div class="login--wrap">

    <div class="login--center">
      <div class="login--txt">
        사용자 프로필을 <br> 선택해 주세요
      </div>

      <!-- 퍼블 확인용 -->
      <BaseUserSelect :data="data" @userSelect="userSelect" class="login--user" />
      <!-- 실제 개발 코드 -->
      <!-- <div class="align--center login--user">
        <ul class="user--select">
          <li v-for="(item, index) in userList" :key="index" class="login--li">
            <div class="login--a" @click="handleSelect(item)" style="cursor: pointer;">
              <div class="user--sex" :class="item.gender === 'MALE' ? 'male' : 'female'" />
              <strong class="login--name">{{ item.name }}</strong>
            </div>
          </li>
        </ul>
      </div> -->

    </div>

    <!-- 퍼블확인용 / MWL_00002 = src\views\auth\TermsAgree.vue 참고 -->
    <!-- 가입 확인 팝업 -->
    <BasePopup v-if="isShowJoinConfirmPopup" class="TermsAgree--join-confirm">
      <template v-slot:contents>
        <div class="join-confirm-content">
          <p class="pop-text-light">829055<br>안지희</p>
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
