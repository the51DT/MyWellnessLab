<script setup>
import { getCurrentInstance, ref } from 'vue'
import BasePinInput from '@/views/publishing/BasePinInput.vue'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'

const props = defineProps({
  isPinRe: { /* 231212 팝업 오프너 */
    type: Boolean,
    default: false
  }
})
const pin1 = ref([]) /* 231129 배열로 변경 */
const pin2 = ref([]) /* 231129 배열로 변경 */
const pinResult = ref(false) /* 벨리데이션 텍스트 */
const btnNext = ref(false) /* 다음 버튼 */
const instance = getCurrentInstance()
const isPin5 = ref(false) /* 231212 핀번호 5회 틀렸을 때 나오는 파업 오프너 */

// 231129 핀 인풋이 4개로 나뉘어 있어서 새로 작업했습니다
let pin1Str = ''
let pin2Str = ''

function compare() {
  const pin1Arr = pin1.value.some((value) => { return !value })
  const pin2Arr = pin2.value.some((value) => { return !value })
  if (pin1.value.length === 4 && pin2.value.length === 4 && !pin1Arr && !pin2Arr) {
    pin1Str = pin1.value.join('')
    pin2Str = pin2.value.join('')
    if (pin1Str === pin2Str) {
      pinResult.value = ''
      btnNext.value = true
    } else {
      pinResult.value = '입력된 PIN 번호가 서로 다릅니다.\n다시 입력해주세요'
      btnNext.value = false
    }
  } else {
    btnNext.value = false
  }
}

function inputTxt(val) {
  switch (val.tg) {
    case 'p1':
      pin1.value[0] = val.val
      break
    case 'p2':
      pin1.value[1] = val.val
      break
    case 'p3':
      pin1.value[2] = val.val
      break
    case 'p4':
      pin1.value[3] = val.val
      break
  }
  compare()
}

function inputTxtRe(val) {
  switch (val.tg) {
    case 'p1':
      pin2.value[0] = val.val
      break
    case 'p2':
      pin2.value[1] = val.val
      break
    case 'p3':
      pin2.value[2] = val.val
      break
    case 'p4':
      pin2.value[3] = val.val
      break
  }
  compare()
}

function popupClose() {
  instance.emit('popupClose')
}

</script>

<template>
  <base-popup-tit v-if="isPinRe" @popupClose="popupClose">
    <template v-slot:title>
      PIN 번호 재설정
    </template>
    <template v-slot:contents>
      <section class="JoinPinRegistration--wrap"> <!--231129 클래스 삭제-->
        <div class="space--all-default JoinPinRegistration--in-wrap">

          <div class="JoinPinRegistration--txt">
            재설정할 PIN 번호를 입력해주세요
          </div>
          <div class="JoinPinRegistration--pin-wrap">
            <h2 class="JoinPinRegistration--tit-wrap">
              <label for="jpr01" class="JoinPinRegistration--tit">변경 PIN 번호 입력</label>
            </h2>
            <div class="JoinPinRegistration--input-wrap">
              <BasePinInput @inputTxt="inputTxt" :id="`jpr01`" class="login--input" /> <!--231129 콘포넌트 바꿈-->
            </div>
          </div>
          <div class="JoinPinRegistration--pin2-wrap">
            <h2 class="JoinPinRegistration--tit2-wrap">
              <label for="jpr02" class="JoinPinRegistration--tit2">변경 PIN 번호 확인</label>
            </h2>
            <div class="JoinPinRegistration--input-wrap">
              <BasePinInput @inputTxt="inputTxtRe" :id="`jpr02`" class="login--input" /> <!--231129 콘포넌트 바꿈-->
            </div>
            <div v-if="pinResult" class="JoinPinRegistration--validation">{{ pinResult }}</div>
          </div>

        </div>
      </section>
      <div class="btn--bottom JoinPinRegistration--btm">
        <button :disabled="!btnNext" type="button" class="JoinPinRegistration--btn">PIN 번호 재설정 완료</button>
      </div>

    </template>
  </base-popup-tit>
</template>

<style lang="scss" scoped>
.JoinPinRegistration--txt {
  margin-top: 2rem;
}
</style>
