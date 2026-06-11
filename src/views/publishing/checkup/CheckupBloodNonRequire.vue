<script setup>

// 전체적으로 최초 값에 의해 form 요소를 disabled 처리해놓았고 데이터를 넣었을 때 실시간 처리는 안했습니다
// 개발 시 진행해주시면 좋고 안되면 퍼블 일정이 여유가 생기는 데로 진행하겠습니다

import { onMounted, ref } from 'vue'
import BaseInput from '@/views/publishing/checkup/BaseInput.vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const data = ref({
  CHEMISTRY1: '',
  CHEMISTRY2: 7,
  CHEMISTRY3: 1,
  CHEMISTRY4: ''
})
const low = ref('') /* 마지막 항목 자동계산 관련 변수 */
const item1 = ref(data.value.CHEMISTRY1) /* 항목 1 */
const item2 = ref(data.value.CHEMISTRY2) /* 항목 1 */
const item3 = ref(data.value.CHEMISTRY3) /* 항목 1 */

function open (val) {
  isOpen.value = val
}

function input1 (value) {
  /* 지질대사 총 콜레스테롤 */
  data.value.CHEMISTRY1 = value
}
function input2 (value) {
  /* 지질대사 고밀도 콜레스테롤 */
  data.value.CHEMISTRY2 = value
}
function input3 (value) {
  /* 지질대사 중성지방 */
  data.value.CHEMISTRY3 = value
}

onMounted(() => { /* 최초 자동계산, 직접입력 활성화 처리 */
  if (item1.value !== '' && item2.value !== '' && item3.value !== '') {
    low.value = 'auto'
  }
  if (item1.value === '' || item2.value === '' || item3.value === '') {
    low.value = 'direct'
  }
})

</script>

<template>
  <div class="CheckupBloodNonRequire">
    <div class="align--between CheckupBloodNonRequire--tit">
      <h2 class="CheckupBloodNonRequire--tit-txt">선택 입력</h2>
      <BaseOpener @open="open" class="CheckupBloodNonRequire--open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBloodNonRequire--input-div">
        <div
          v-if="data.CHEMISTRY1 !== '' && data.CHEMISTRY2 !== '' && data.CHEMISTRY3 !== '' && data.CHEMISTRY4 !== ''"
          class="CheckupBloodNonRequire--msg">
          ※ 선택입력 항목을 모두 입력하지 않은 경우, 지질대사 관련 분석결과는 반영되지 않습니다
        </div>
        <BaseInput
          :itemName="`총 콜레스테롤`"
          :disabled="!item1"
          :value="data.CHEMISTRY1"
          :suf="`mg/dl`"
          @inputTxt="input1"
          class="CheckupBloodNonRequire--name" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput
          :itemName="`고밀도 콜레스테롤`"
          :disabled="!item2"
          :value="data.CHEMISTRY2"
          :suf="`mg/dl`"
          @inputTxt="input2"
          class="CheckupBloodNonRequire--age" />
        <BaseInput
          :itemName="`중성지방`"
          :disabled="!item3"
          :value="data.CHEMISTRY3"
          :suf="`mg/dl`"
          @inputTxt="input3"
          class="CheckupBloodNonRequire--gender" />

        <!--      if 값이 있을 경우-->
        <BaseInput
          v-if="data.CHEMISTRY4"
          :itemName="`지질대사 저밀도 콜레스테롤`"
          :disabled="!data.CHEMISTRY4"
          :value="data.CHEMISTRY4"
          :suf="`mg/dl`"
          class="CheckupBloodNonRequire--gender" />

        <!--      else 값이 없을 경우-->
        <div v-else class="CheckupBloodNonRequire--cole">
          <span class="CheckupBloodNonRequire--cole-tit">저밀도 콜레스테롤</span>
          <p
            v-if="data.CHEMISTRY1 !== '' && data.CHEMISTRY2 !== '' && data.CHEMISTRY3 !== ''"
            class="CheckupBloodNonRequire--txt">위 3가지 선택 항목을 모두 입력해야 저밀도 콜레스테롤 ‘자동계산’이 가능합니다</p>
          <div class="align--between right CheckupBloodNonRequire--radio">
            <div class="CheckupBloodNonRequire--radio-l">
              <label for="cbnr01" class="CheckupBloodNonRequire--radio-label" :class="low === 'auto' ? 'active' : ''">
                <input
                  v-model="low"
                  value="auto"
                  type="radio"
                  name="cbnr"
                  id="cbnr01"
                  :checked="low === 'auto'"
                  class="CheckupBloodNonRequire--radio-radio" />
                <span class="radio--icon" />
                <span class="CheckupBloodNonRequire--radio-txt">자동계산</span>
              </label>
            </div>
            <div class="CheckupBloodNonRequire--radio-r">
              <label for="cbnr02" class="CheckupBloodNonRequire--radio-label" :class="low === 'direct' ? 'active' : ''">
                <input
                  v-model="low"
                  value="direct"
                  type="radio"
                  name="cbnr"
                  id="cbnr02"
                  :checked="low === 'direct'"
                  class="CheckupBloodNonRequire--radio-radio" />
                <span class="radio--icon" />
                <input
                  :disabled="low !== 'direct'"
                  placeholder="130"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  name="cbnr03"
                  id=""
                  class="CheckupBloodNonRequire--radio-input noBorder" /> <!--231204 셀렉트박스에 포커스가 들어가면 안되는 경우 noBorder 추가-->
                <span class="CheckupBloodNonRequire----radio-txt">mg/dl</span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </transition>
  </div></template>

<style scoped>@use "@/assets/css/default.scss";</style>
