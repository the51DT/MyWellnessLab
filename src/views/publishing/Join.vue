<script setup>
import { ref } from 'vue'
import router from '@/router'
import BaseUserSelect from '@/views/publishing/BaseUserSelect.vue'

const data = ref([
  { name: '이하늘', sex: 0 },
  { name: '안지희', sex: 1 }
])

function userSelect(who) {
  /* who: 선택된 프로필 객체, 개발 후 삭제 요망 */
  router.push('/join-terms-agree') /* 선택된 프로필을 포함해서 링크 걸어야 함 to 개발 */
}
</script>

<template>
  <div class="join--wrap">

    <div class="join--center-wrap">
      <div class="join--txt">
        사용자 프로필을 <br> 선택해 주세요
      </div>

      <BaseUserSelect :data="data" @userSelect="userSelect" class="join--user" />

    </div>

  </div>
</template>

<style lang="scss"></style>
