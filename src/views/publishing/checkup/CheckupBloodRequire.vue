<script setup>
import { ref } from 'vue'
import BaseInput from '@/views/publishing/checkup/BaseInput.vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isOne = ref(false) /* 일회성인지? */

function open (val) {
  isOpen.value = val
}

function input1 (value) {
  /* 일반혈액검사소 */
}
function input2 (value) {
  /* 당대사 공복혈당 */
}
function input3 (value) {
  /* 일반화학검사 혈청 크레아티닌 */
}
function input4 (value) {
  /* 간기능 아스파테이크 전이효소 */
}
function input5 (value) {
  /* 간기능 알라닌 전이효소 */
}
</script>

<template>
  <div class="CheckupBloodRequire">
    <div class="align--between CheckupBloodRequire--tit">
      <h2 class="CheckupBloodRequire--tit-txt">필수 입력</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBloodRequire--input-div">
        <BaseInput
          :disabled="isOne"
          :itemName="`혈색소`"
          :value="`15.1`"
          :suf="`g/dl`"
          @inputTxt="input1"
          class="CheckupBloodRequire--name" /> <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput
          :disabled="isOne"
          :itemName="`공복혈당`"
          :value="`100`"
          :suf="`mg/dl`"
          @inputTxt="input2"
          class="CheckupBloodRequire--age" />
        <BaseInput
          :disabled="isOne"
          :itemName="`혈청 크레아티닌`"
          :value="`0.8`"
          :suf="`mg/dL`"
          @inputTxt="input3"
          class="CheckupBloodRequire--gender" />
        <BaseInput
          :disabled="isOne"
          :itemName="`아스파테이트 아미노전이효소`"
          :value="`20`"
          :suf="`IU/ℓ`"
          @inputTxt="input4"
          class="CheckupBloodRequire--gender" />
        <BaseInput
          :disabled="isOne"
          :itemName="`알라닌 아미노전이효소`"
          :value="`20`"
          :suf="`IU/ℓ`"
          @inputTxt="input5"
          class="CheckupBloodRequire--gender" />
      </div>
    </transition>
  </div>
</template>

<style scoped>@use "@/assets/css/default.scss";</style>
