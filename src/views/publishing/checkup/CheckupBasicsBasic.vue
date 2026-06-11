<script setup>
import BaseInput from '@/views/publishing/checkup/BaseInput.vue'
import { ref } from 'vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isOne = ref(false) /* 일회성 분석의 경우 true */
const isGender = ref('') /* 성별 입력 시 */

function open(val) { /* 내용 열고 닫는 */
  isOpen.value = val
}

function inputName(value) {
  // /*이름*/console.log(value)
}
function inputAge(value) {
  /* 나이 */
}
</script>

<template>
  <!--  <div class="CheckupBasicsBasic" :class="isOpen ? 'active' : ''">-->
  <div class="CheckupBasicsBasic">
    <div class="align--between CheckupBasicsBasic--tit">
      <h2 class="CheckupBasicsBasic--tit-txt">기본 정보</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBasicsBasic--input-div">

        <!--    if 직접 입력, 공단 데이터이용-->
        <BaseInput :disabled="isOne" :itemName="`이름`" :value="`이하늘`" :type="`text`" @inputTxt="inputName"
          class="CheckupBasicsBasic--name wide" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등, 231204 인풋에 많은 텍스트가 필요한 경우 wide 추가-->
        <BaseInput :disabled="isOne" :itemName="`나이(만)`" :value="`34`" :suf="`세`" @inputTxt="inputAge"
          class="CheckupBasicsBasic--age" />
        <BaseInput :disabled="isOne" :itemName="`성별`" :type="`text`" :value="`남성`"
          class="CheckupBasicsBasic--gender wide" />

        <!--    else 일회성-->
        <BaseInput :itemName="`생년월일 6자리`" @inputTxt="inputName" class="CheckupBasicsBasicOne--birth wide" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등, 231204 인풋에 긴 글이 필요한 경우 wide 추가-->
        <dl class="BaseInput CheckupBasicsBasicOne--dl">
          <dt class="BaseInput--dt CheckupBasicsBasicOne--dt">
            <span class="CheckupBasicsBasicOne--gender">성별</span>
          </dt>
          <dd class="BaseInput--dd CheckupBasicsBasicOne--dd">
            <div class="align--between CheckupBasicsBasicOne--con-div">
              <div class="CheckupBasicsBasicOne--con-left">
                <label for="cbbo01" class="CheckupBasicsBasicOne--male-label"
                  :class="isGender === 'male' ? 'active' : ''">
                  <input v-model="isGender" value="male" type="radio" name="cbbo" id="cbbo01"
                    class="CheckupBasicsBasicOne--male-radio" hidden="hidden">
                  <span class="CheckupBasicsBasicOne--male-txt">남성</span>
                </label>
              </div>
              <div class="CheckupBasicsBasicOne--con-right">
                <label for="cbbo02" class="CheckupBasicsBasicOne--female-label"
                  :class="isGender === 'female' ? 'active' : ''">
                  <input v-model="isGender" value="female" type="radio" name="cbbo" id="cbbo02"
                    class="CheckupBasicsBasicOne--female-radio" hidden="hidden">
                  <span class="CheckupBasicsBasicOne--female-txt">여성</span>
                </label>
              </div>
            </div>
          </dd>
        </dl>

      </div>
  </transition>
</div></template>

<style scoped></style>
