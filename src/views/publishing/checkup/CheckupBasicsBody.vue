<script setup>
import BaseInput from '@/views/publishing/checkup/BaseInput.vue'
import { ref } from 'vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

const isOpen = ref(true) /* 내용 열고 닫기 */
const isOne = ref(true) /* 일회성인지? */

function open(val) {
  isOpen.value = val
}

function inputHeight(value) {
  /* 신장 */
}
function inputWeight(value) {
  /* 체중 */
}
function inputWaist(value) {
  /* 허리둘레 */
}
</script>

<template>
  <div class="CheckupBasicsBody">
    <div class="align--between CheckupBasicsBody--tit-div">
      <h2 class="CheckupBasicsBody--tit">신체 정보</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBasicsBody--input-div">
        <BaseInput :itemName="`신장`" :disabled="isOne" :value="`173`" :suf="`cm`" @inputTxt="inputHeight"
          class="CheckupBasicsBody--height" />
        <!--pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등, itemName: 항목명, value: 기존 값, placeholder: placeholder-->
        <BaseInput :itemName="`체중`" :disabled="isOne" :value="`81`" :suf="`kg`" @inputTxt="inputWeight"
          class="CheckupBasicsBody--weight" />
        <base-input :itemName="`허리둘레`" :disabled="isOne" :value="`98`" @inputTxt="inputWaist"
          class="CheckupBasicsBody--waist">
          <template v-slot:custom>
            <div class="CheckupBasicsBody--select-wrap">
              <select name="unit" id="" class="CheckupBasicsBody--select noBorder" :disabled="!isOne">
                <!--231204 selectbox 자체에 포커스 보더가 안들어 가야 할 경우 noBorder 추가-->
                <option value="" selected>cm</option>
                <option value="">inch</option>
              </select>
            </div>
          </template>
        </base-input>
      </div>
    </transition>
  </div>
</template>

<style scoped>@use "@/assets/css/default.scss";</style>
