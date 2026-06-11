<script setup>
import { ref } from 'vue'
import BasePinInput from '@/views/publishing/BasePinInput.vue'

const tempPin = ref(1234) /* 임시 핀번호 */
const pin1 = ref() /* 입력받은 첫번째 핀번호 */
const pin2 = ref() /* 입력받은 두번째 핀번호 */
const pin3 = ref() /* 입력받은 세번째 핀번호 */
const pin4 = ref() /* 입력받은 네번째 핀번호 */
const inputPin = ref() /* 입력받은 핀번호 */
const failCount = ref(0) /* 실패한 횟수 */
const validation = ref() /* 밸리데이션 메시지 */
const pin = ref(null) /* 핀 input 콤포넌트 */

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
  } else {
    if (failCount.value > 4) {
      if (window.confirm('PIN 번호 입력 5회 오류입니다\nPIN 번호를 재설정 하시겠습니까?')) {
        // pin 번호 분실 페이지 이동 처리 요망
      } else {
        return
      }
    }
    validation.value = 'PIN 번호가 유효하지 않습니다'
    failCount.value++
    pin1.value = ''
    pin2.value = ''
    pin3.value = ''
    pin4.value = ''
    pin.value.reset()
  }
}

</script>

<template>
  <div class="login--pin-wrap">

    <div class="login--pin-center">
      <div class="txt--center login--txt">
        <label for="lp01">PIN 번호 <br> 4자리를 입력해주세요</label>
      </div>
      <BasePinInput @inputTxt="inputTxt" :focus="true" class="login--input" ref="pin" /> <!--231129 포커스 추가-->
      <div v-if="validation" class="login--validation">{{ validation }}</div>
      <div class="txt--center login--pin-find">
        <a href="javascript: void(0);" class="btn--txt2 c5">PIN번호 찾기</a>
      </div>
    </div>

    <div class="btn--bottom txt--center login--btn-wrap">
      <button @click="confirm" :disabled="!(pin1 && pin2 && pin3 && pin4)" type="button" class="login--btn">확인</button>
    </div>

  </div>
</template>

<style lang="scss"></style>
