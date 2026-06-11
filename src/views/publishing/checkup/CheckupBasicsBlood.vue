<script setup>
import BaseInput from '@/views/publishing/checkup/BaseInput.vue'
import { ref } from 'vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isOne = ref(false)

function open (val) {
  isOpen.value = val
}

function inputShrinkBlood (value) {
  /* 수축기 혈압 */
}
function inputRelaxBlood (value) {
  /* 이완기 혈압 */
}
</script>

<template>
  <div class="CheckupBasicsBlood">
    <div class="align--between CheckupBasicsBlood--tit-div">
      <h2 class="CheckupBasicsBlood--tit">혈압 정보</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBasicsBlood--input-div">
        <BaseInput
          :disabled="isOne"
          :itemName="`수축기 혈압`"
          :value="`121`"
          :suf="`mmHg`"
          @inputTxt="inputShrinkBlood"
          class="CheckupBasicsBlood--shrink" /> <!--pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput
          :disabled="isOne"
          :itemName="`이완기 혈압`"
          :value="`98`"
          :suf="`mmHg`"
          @inputTxt="inputRelaxBlood"
          class="CheckupBasicsBlood--relax" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>
