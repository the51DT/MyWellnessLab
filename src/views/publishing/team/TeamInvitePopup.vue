<script setup>
import { ref } from 'vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'

const prevTeamInvitePopup = ref(false) /* 팀 초대하기 팝업 퍼블 확인용 */
</script>

<template>
  <BasePopupClose class="teamInvitePopup">
    <template v-slot:title>팀 초대하기</template>
    <template v-slot:contents>
      <button type="button" @click="" class="invite-pop--btn kakao">카톡으로 초대하기</button>
      <button type="button" @click="" class="pop-btn pop-btn--green">초대링크 복사하기</button>
      <p class="pop-text-caption center">초대링크를 복사하여<br>문자 또는 SNS 등으로 팀원을 초대하세요</p>
    </template>
    <template v-slot:button>
      <button type="button" @click="prevTeamInvitePopup = true" class="pop-btn pop-btn--gray">이전 팀의 팀원 초대하기</button>
    </template>
  </BasePopupClose>

  <BasePopupClose v-if="prevTeamInvitePopup" class="prevTeamInvitePopup">
    <template v-slot:title>이전 팀의 팀원 초대하기</template>
    <template v-slot:contents>
      <div class="pop-select">
        <span>이전 팀 목록</span>
        <div class="pop-select--wrap">
          <select name="prevTeamSelect" class="circle" required @change="$event.currentTarget.closest('.prevTeamInvitePopup').querySelector('.pop-btn').disabled = !$event.currentTarget.value"> <!-- 셀렉트 값 선택하면 아래 버튼 disabled 해제 퍼블 임의로 작업 -->
            <option value="" selected disabled>선택</option>
            <option value="1">이전 팀 1</option>
            <option value="2">이전 팀 2</option>
          </select>
        </div>
      </div>
      <p class="pop-text-light">팀원 모두에게 초대 메시지가 일괄 전송됩니다. 팀원은 초대받은 팀 목록에서 '참여하기'를 선택해야 팀에 참여할 수 있습니다.</p> <!-- 260820 문구 수정 -->
      <p class="pop-text-caption center">* 카카오톡으로 초대하기와 초대링크 복사하기로 초대한 경우 초대받은 팀 목록에 표시되지 않습니다.</p>
    </template>
    <template v-slot:button>
      <button type="button" @click="" class="pop-btn pop-btn--green" disabled>초대하기</button>
    </template>
  </BasePopupClose>
</template>

<style scoped>
</style>
