<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'
import BasePopup from '@/views/publishing/BasePopup.vue' /* 260923 미션 선택 팝업 추가 */

/* 퍼블확인용 */
const isShowTeamTermsPopup = ref(false)
const isShowTeamJoinPopup = ref(false)
const isShowMissionPopup = ref(false) /* 260923 미션 선택 팝업 추가 */

/* 퍼블확인용 */
function termsAgree() {
  isShowTeamTermsPopup.value = false
  isShowTeamJoinPopup.value = true
}

/* 퍼블확인용 */
onMounted(async () => {
  isShowMissionPopup.value = true // 260923 미션 선택 팝업 추가 - 페이지 진입 시 노출
})
</script>

<template>
  <!-- [s] 260923 미션 선택 팝업 추가 -->
  <BasePopup v-if="isShowMissionPopup">
    <template v-slot:contents>
      <p class="pop-text-light">팀 가입을 위해 미션 선택이 필요합니다.</p>
      <p class="pop-text-bold">현재 선택된 미션이 없어<br>‘기본 미션’으로 자동으로 설정됩니다.</p>
      <div class="teamJoinBasicMission">
        <span>기본 미션</span>
        <strong>영양 - 것모닝+ 하기(아침에 물, 프락토올리고당, 유산균, 단백질 섭취)</strong>
      </div>
      <div class="pop-text-caption center">*미션은 홈 > 미션 변경하기에서 변경할 수 있습니다.</div>
      <div class="pop-btn-wrap">
        <button type="button" @click="isShowMissionPopup = false, isShowTeamTermsPopup = true" class="pop-btn pop-btn--green">확인</button> <!-- 클릭 이벤트 퍼블 확인용 개발 수정 필요 -->
      </div>
    </template>
  </BasePopup>
  <!-- [e] 260923 미션 선택 팝업 추가 -->
  <!-- 개인정보 제3자 제공 이용동의 팝업 -->
  <!-- 261020 개인정보 이용동의 팝업 수정 -->
  <BasePopupClose v-if="isShowTeamTermsPopup">
    <template v-slot:title>개인정보 수집∙이용 동의 <span class="green">(필수)</span></template>
    <template v-slot:contents>
      <div class="pop-scroll-box">
        <div class="agree3">
          <div class="agree3--group">
            <p class="agree3--p">한국암웨이㈜는(이하 “회사”라 함) 서비스 제공을 위해 다음과 같이 회원님의 개인정보를 제3자 제공하고자 합니다.</p>
            <p class="agree3--underline">개인정보의 제3자 제공에 동의하지 않을 수 있으며, 다만 동의하지 않을 경우 마이웰니스 랩 서비스 이용이 제한됩니다.</p>
            <table class="table">
              <tbody>
                <tr>
                  <th>제공<br>받는 자</th>
                  <td class="bold">팀장</td>
                </tr>
                <tr>
                  <th>이용<br>목적</th>
                  <td class="bold">팀 가입 및 활동 참가 팀원 미션 인증 확인</td>
                </tr>
                <tr>
                  <th>제공<br>항목</th>
                  <td>프로필 사진, 닉네임, 성명, 제품 구매 여부, 회원의 미션 인증정보, 미션 인증사진, 챌린지 이력</td>
                </tr>
                <tr>
                  <th>보유 및<br>이용기간</th>
                  <td class="bold">팀 탈퇴 및 회원탈퇴일로부터 5일까지</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:button>
      <button type="button" @click="termsAgree" class="pop-btn pop-btn--gray">동의하지 않음</button>
      <button type="button" @click="termsAgree" class="pop-btn pop-btn--green">동의</button>
    </template>
  </BasePopupClose>

  <!-- 팀 참여 완료 후 보상 수령처 선택 팝업 -->
  <!-- 
    팀 가입 완료 시 챌린지 팀일 경우이며, 팀별 개인 수령일 경우 해당 팝업 호출
    [2-1] 보상 수령처 선택 전에는 비활성화 처리 (확인버튼)
    [확인] 시 팀 목록화면으로 이동
    **팀가입 완료 시점에 한번만 호출 됨
  -->
  <BasePopupClose v-if="isShowTeamJoinPopup" class="TeamRewardPopup" :close-btn="false">
    <template v-slot:title>팀 참여 완료</template>
    <template v-slot:contents>
      <div class="pop-content-wrap">
        <p class="pop-text-light">$챌린지명$의 $팀명$ 팀에 참여가 완료되었습니다.</p> <!-- 260820 문구 수정 -->
        <p class="pop-text-light">챌린지 성공 보상을 위해<br>보상 수령처를 선택해 주세요.</p>
        <div class="pop-select">
          <span>보상 수령처</span>
          <div class="pop-select--wrap">
            <select name="teamRewardPoint" class="circle" required>
              <option value="" selected disabled>선택</option>
              <option value="1">보상 수령처 예시1</option>
              <option value="2">보상 수령처 예시2</option>
            </select>
          </div>
        </div>
        <div class="pop-text-caption center">*챌린지 팀 가입의 경우, 카카오 알림톡을 통해<br>챌린지와 관련된 안내를 받으실 수 있습니다.</div>
      </div>
    </template>
    <template v-slot:button>
      <button type="button" @click="" class="pop-btn pop-btn--green">확인</button>
    </template>
  </BasePopupClose>
</template>

<style lang="scss"></style>
