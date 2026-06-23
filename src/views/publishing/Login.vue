<script setup>
import { onMounted, ref } from 'vue'
import BaseUserSelect from '@/views/publishing/BaseUserSelect.vue'
import router from '@/router'
import { funcIsPc } from '@/assets/js/common'
import BasePopup from '@/views/publishing/BasePopup.vue'

const data = ref([
  { name: '안지희', sex: 1 },
  { name: '이하늘', sex: 0 }
])
const isPc = ref(false) /* 231228 pc인지? */

function userSelect() {
  /* who: 선택된 프로필 객체, 개발 후 삭제 요망 */
  router.push('/login-pin') /* 선택된 프로필을 포함해서 링크 걸어야 함 to 개발 */
}

/**
 * 가입하기 버튼 클릭 시 팝업 닫기
 */
const handleJoinConfirm = () => {
  isShowJoinConfirmPopup.value = false
}

onMounted(() => {
  isPc.value = funcIsPc()
  window.addEventListener('resize', () => {
    isPc.value = funcIsPc()
  })
})

</script>

<template>
  <div class="login--wrap">

    <div class="login--center">
      <div class="login--txt">
        사용자 프로필을 <br v-if="!isPc"> 선택해 주세요
      </div>

      <BaseUserSelect :data="data" @userSelect="userSelect" class="login--user" />

    </div>

  </div>
</template>

<style lang="scss"></style>
