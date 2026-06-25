<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'

/* 퍼블확인용 */
const isShowTeamTermsPopup = ref(false)
const isShowTeamJoinPopup = ref(false)

/* 퍼블확인용 */
function termsAgree() {
  isShowTeamTermsPopup.value = false
  isShowTeamJoinPopup.value = true
}

/* 퍼블확인용 */
onMounted(async () => {
  // 페이지 진입 시 개인정보 제3자 제공 이용동의 표시
  isShowTeamTermsPopup.value = true
})
</script>

<template>
  <!-- 개인정보 제3자 제공 이용동의 팝업 -->
  <BasePopupTit v-if="isShowTeamTermsPopup">
    <template v-slot:title>개인정보 제3자 제공 이용동의</template>
    <template v-slot:contents>
      <div class="pop-scroll-box">
        <p>
          것모닝(Gut Morning) 서비스 내 이용자 식별, 회원관리 및 것모닝(Gut Morning) 서비스 제공, 회원비교식별을 위하여 귀하의 개인정보를 <span class="red">가입을 신청한 팀의 팀장</span>에게 제공합니다. 해당 정보는 동의 철회나 서비스 탈퇴 시 또는 제공 목적 달성 시 지체없이 파기됩니다. 아래 동의를 거부할 권리가 있으며, 필수 동의를 거부할 경우 서비스 이용이 제한됩니다.<br>
          <br>
          [제공을 받는 자] 팀장<br>
          [필수 제공 항목]<span class="green">(팀 가입 시) 프로필 사진, 닉네임, 성명, 구매이력, (팀 활동 시)회원의 GUT Morning 미션 인증 정보, 미션 인증 사진</span><br>
          [이용목적] 팀 가입 및 활동 참가, 팀원의 미션 인증 확인<br>
          [제공 기간] 팀 탈퇴 및 개인정보 제3자 제공 동의 철회 시<br>
          [보유 기간] <strong>동의 철회 또는 서비스 탈퇴 시 지체 없이 파기</strong>
        </p>
      </div>
      <div class="pop-text-caption">원활한 서비스 이용을 위하여 개인정보 제3자 제공에 대하여 동의가 필요합니다. 동의하지 않으실 경우 서비스 이용이 제한됩니다.</div>
      <div class="pop-btn-wrap">
        <button type="button" @click="termsAgree" class="pop-btn pop-btn--gray">동의하지 않음</button>
        <button type="button" @click="termsAgree" class="pop-btn pop-btn--green">동의</button>
      </div>
    </template>
  </BasePopupTit>

  <!-- 팀 참여 완료 후 보상 수령처 선택 팝업 -->
  <!-- 
    팀 가입 완료 시 챌린지 팀일 경우이며, 팀별 개인 수령일 경우 해당 팝업 호출
    [2-1] 보상 수령처 선택 전에는 비활성화 처리 (확인버튼)
    [확인] 시 팀 목록화면으로 이동
    **팀가입 완료 시점에 한번만 호출 됨
  -->
  <BasePopupTit v-if="isShowTeamJoinPopup" class="TeamRewardPopup" :close-btn="false">
    <template v-slot:title>팀 참여 완료</template>
    <template v-slot:contents>
      <div class="pop-content-wrap">
        <p class="pop-text-light">$팀명$에 참여가 완료되었습니다.</p>
        <p class="pop-text-light">챌린지 성공 보상을 위해<br>보상 수령처를 선택해 주세요.</p>
        <div class="pop-select">
          <span>보상 수령처</span>
          <div class="pop-select--wrap">
            <select name="teamRewardPoint" class="circle">
              <option value="" selected disabled>선택</option>
              <option value="1">보상 수령처 예시1</option>
              <option value="2">보상 수령처 예시2</option>
            </select>
          </div>
        </div>
        <div class="pop-text-caption center">*챌린지 팀 가입의 경우, 카카오 알림톡을 통해<br>챌린지와 관련된 안내를 받으실 수 있습니다.</div>
      </div>
      <div class="pop-btn-wrap">
        <button type="button" @click="" class="pop-btn pop-btn--green">확인</button>
      </div>
    </template>
  </BasePopupTit>
</template>

<style lang="scss"></style>
