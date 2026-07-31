<script setup>
import { ref } from 'vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'

const prevTeamInvitePopup = ref(false) /* 팀 초대하기 팝업 퍼블 확인용 */
</script>

<template>
  <BasePopupClose class="guestInvitePopup">
    <template v-slot:title>비회원 고객 초대</template>
    <template v-slot:contents>
      <button type="button" @click="" class="invite-pop--btn kakao">카톡으로 초대하기</button>            
    </template>
  </BasePopupClose>  
</template>

<style scoped>
  .popup--space:last-child {
    padding-bottom: 2rem;
  }
</style>
