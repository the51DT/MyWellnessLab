<script setup>
import { onMounted, ref } from 'vue'
import BasePinInput from '@/views/publishing/BasePinInput.vue'
import BasePopup from '@/views/publishing/BasePopup.vue'

const tempPin = ref(1234) /* 임시 핀번호 */
const pin1 = ref() /* 입력받은 첫번째 핀번호 */
const pin2 = ref() /* 입력받은 두번째 핀번호 */
const pin3 = ref() /* 입력받은 세번째 핀번호 */
const pin4 = ref() /* 입력받은 네번째 핀번호 */
const inputPin = ref() /* 입력받은 핀번호 */
const failCount = ref(0) /* 실패한 횟수 */
const validation = ref() /* 밸리데이션 메시지 */
const pin = ref(null) /* 핀 input 콤포넌트 */
const pinCheck = ref('') /* 컬러 확인용 */
const isShowLockPopup = ref() /* 팝업 확인용 */
const isShowSecessionPopup = ref(false)

function inputTxt(val) {
  switch (val.tg) {
    case 'p1':
      pin1.value = val.val
      break
    case 'p2':
      pin2.value = val.val
      break
    case 'p3':
      pin3.value = val.val
      break
    case 'p4':
      pin4.value = val.val
      break
  }
  inputPin.value = pin1.value + pin2.value + pin3.value + pin4.value
}

function confirm() {
  if (Number(inputPin.value) === tempPin.value) {
    alert('login ok')
    pinCheck.value = 'success' /* 퍼블 컬러 확인용 */
  } else {
    if (failCount.value >= 4) {
      isShowLockPopup.value = true /* 퍼블 팝업 확인용 */
      validation.value = `PIN 번호가 유효하지 않습니다 (${failCount.value + 1}/5)`
      pinCheck.value = 'failure'
      if (window.confirm('PIN 번호 입력 5회 오류입니다\nPIN 번호를 재설정 하시겠습니까?')) {
        // pin 번호 분실 페이지 이동 처리 요망
      } else {
        return
      }
    }
    validation.value = `PIN 번호가 유효하지 않습니다 (${failCount.value + 1}/5)`
    failCount.value++
    pin1.value = ''
    pin2.value = ''
    pin3.value = ''
    pin4.value = ''
    pin.value.reset()
  }
}

/**
 * PopWithDraw 종료
 */
const closeWithDrowModal = () => {
  isShowSecessionPopup.value = false
}

onMounted(async () => {
  // 페이지 진입 시 가입 확인 팝업 표시 - 퍼블확인용
  isShowSecessionPopup.value = true
})


</script>

<template>
  <div class="login--pin-wrap">

    <div class="login--pin-center">
      <div class="txt--center login--txt">
        <label for="lp01">PIN 번호 4자리를 입력해 주세요</label>
      </div>
      <BasePinInput @inputTxt="inputTxt" :focus="true" class="login--input" ref="pin"
        :class="{
          success: pinCheck === 'success',
          failure: pinCheck === 'failure'
        }"
      /> <!--231129 포커스 추가--> <!--202606 컬러 추가 login--input에 이중클래스 success = 초록색 / failure = 빨간색 개발 적용 필요 -->
      <div v-if="validation" class="login--validation">{{ validation }}</div>
      <div class="txt--center login--pin-find">
        <a href="javascript: void(0);" class="btn--txt2 c5">PIN 번호 재설정</a>
      </div>
    </div>

    <div class="btn--bottom txt--center login--btn-wrap">
      <button @click="confirm" :disabled="!(pin1 && pin2 && pin3 && pin4)" type="button" class="login--btn">확인</button>
    </div>

    <!-- 탙퇴 후 PIN번호 입력 및 로그인 시도 시 노출되는 얼럿 팝업 -->
    <BasePopup v-if="isShowSecessionPopup" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-light">탈퇴 진행 중인 회원입니다.</p>
        <p class="pop-text-bold">변경사항은 관리자에게 문의해 주세요.</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="closeWithDrowModal" class="pop-btn pop-btn--green">확인</button>
        </div>
      </template>
    </BasePopup>

    <!-- PIN 번호 5회 입력 및 계정 잠금 안내 팝업 -->
    <BasePopup v-if="isShowLockPopup" class="openPopContinue pin-lost-modal">
      <template v-slot:contents>
        <p class="pop-text-light">PIN 번호 입력 5회 오류로 인해<br>선택하신 프로필이 잠겼습니다.</p>
        <p class="pop-text-bold">PIN 번호 분실/재설정으로<br>잠금 해제가 가능합니다.<br>초기화 하시겠습니까?</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="openChangeModal" class="pop-btn pop-btn--green">확인</button>
        </div>
      </template>
    </BasePopup>

  </div>
</template>

<style lang="scss"></style>
