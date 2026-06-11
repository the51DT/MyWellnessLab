<script setup>

// 전체적으로 최초 값에 의해 form 요소를 disabled 처리해놓았고 데이터를 넣었을 때 실시간 처리는 안했습니다
// 개발 시 진행해주시면 좋고 안되면 퍼블 일정이 여유가 생기는 데로 진행하겠습니다

import { ref, getCurrentInstance, computed, watch } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

const props = defineProps({
  analysisType: String,
  healthDataType: String,
  mapName: String,
  basicData: {
    blood: {
      basicsId: String, // 기본검사 seq
      crea: Number,
      glu: Number,
      got: Number,
      gpt: Number,
      hb: Number,
      id: String // 혈액검사 ID
    },
    bloodOptional: {
      bloodId: String, // 기본검사 Seq
      hdl: Number,
      ldl: Number,
      tc: Number,
      tg: Number,
      id: String // 혈액검사 선택입력 Seq
    }
  }
})
const instance = getCurrentInstance() /* 어밋 인스턴스 */

const dispData = ref(Object.assign({}, props.basicData))

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isDisabled = ref((props.healthDataType != 'formal'))/* 공단연계인 경우 수정불가 */

if (props.healthDataType == 'formal' && props.basicData.bloodOptional.tc == 0) { // 공단연계여도 콜레스테롤 관련 값이 없을 경우 입력받을 수 있게
  isDisabled.value = true
}

function isNull(val) {
  return !!((val == '' || val == 0 || val === undefined || val === null))
}

const low = ref(
  (
    !isNull(props.basicData.bloodOptional.tc) && !isNull(props.basicData.bloodOptional.hdl) && !isNull(props.basicData.bloodOptional.tg)
  )
    ? 'auto'
    : 'direct'
) /* 마지막 항목 자동계산 관련 변수 */

const calcLDL = computed(() => { // 저밀도 콜레스테롤, 1. 공단에서 가져온 경우 값 강제. 2. 직접입력/일회성인 경우 자동계산을 선택한 경우 3. 직접입력/일회성이고 직접입력인 경우
  const rtnValue = onCalcLDL()
  return rtnValue
})

const calcDisabled = computed(() => { // 자동계산 버튼 활성화여부
  const bool = (isNull(props.basicData.bloodOptional.tc) || isNull(props.basicData.bloodOptional.hdl) || isNull(props.basicData.bloodOptional.tg))
  return bool
})

function open(val) {
  isOpen.value = val
}

function onCalcLDL() { // 자동계산처리
  let rtnValue = props.basicData.bloodOptional.ldl
  if (low.value == 'auto') {
    rtnValue = Number(props.basicData.bloodOptional.tc) - ((Number(props.basicData.bloodOptional.tg / 5)) + Number(props.basicData.bloodOptional.hdl))
  }
  // rtnValue = rtnValue.toFixed(2);
  rtnValue = (rtnValue) || 0
  dispData.value.bloodOptional.ldl = rtnValue

  emitParent()
  return rtnValue
}

function inputTC(value) { /* 지질대사 총 콜레스테롤 */
  dispData.value.bloodOptional.tc = value
  emitParent()
}
function inputHDL(value) { /* 지질대사 고밀도 콜레스테롤 */
  dispData.value.bloodOptional.hdl = value
  emitParent()
}
function inputTG(value) { /* 지질대사 중성지방 */
  dispData.value.bloodOptional.tg = value
  emitParent()
}
function inputLDL(e) {
  dispData.value.bloodOptional.ldl = e.target.value
  emitParent()
}

function emitParent() { // 상위 컴퍼넌트 update
  instance.emit('update', props.mapName, dispData.value)
}

function dataCheck() { // TODO LYH TMP
  console.log('########### dataCheck start')
  console.log(toRaw(props.basicData))
  console.log(toRaw(dispData.value.bloodOptional))
  console.log(calcLDL.value)
  console.log('########### dataCheck end')
}

watch(props, (val) => { // props 변경 시 처리
  dispData.value = val.basicData
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
          v-if="props.basicData.bloodOptional.tc == '' || props.basicData.bloodOptional.hdl == '' || props.basicData.bloodOptional.tg == ''"
          class="CheckupBloodNonRequire--msg">
          ※ 선택입력 항목을 모두 입력하지 않은 경우, 지질대사 관련 분석결과는 반영되지 않습니다
        </div>
        <BaseInput :itemName="`지질대사 총 콜레스테롤`" :disabled="isDisabled" :value="props.basicData.bloodOptional.tc"
          :suf="`mg/dl`" :maxlength="5" @inputTxt="inputTC" class="CheckupBloodNonRequire--name" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput :itemName="`지질대사 고밀도 콜레스테롤`" :disabled="isDisabled" :value="props.basicData.bloodOptional.hdl"
          :suf="`mg/dl`" :maxlength="5" @inputTxt="inputHDL" class="CheckupBloodNonRequire--age" />
        <BaseInput :itemName="`지질대사 중성지방`" :disabled="isDisabled" :value="props.basicData.bloodOptional.tg" :suf="`mg/dl`"
          :maxlength="5" @inputTxt="inputTG" class="CheckupBloodNonRequire--gender" />

        <!--      if 값이 있을 경우-->
        <BaseInput v-if="!isDisabled" :itemName="`지질대사 저밀도 콜레스테롤`" :disabled="!props.basicData.bloodOptional.ldl"
          :value="props.basicData.bloodOptional.ldl" :suf="`mg/dl`" :maxlength="5"
          class="CheckupBloodNonRequire--gender" />

        <!--      else 값이 없을 경우-->
        <div v-else class="CheckupBloodNonRequire--cole">
          <span class="CheckupBloodNonRequire--cole-tit">지질대사 저밀도 콜레스테롤</span>
          <p v-if="props.basicData.bloodOptional.tc == '' || props.basicData.bloodOptional.hdl == '' || props.basicData.bloodOptional.tg == ''"
            class="CheckupBloodNonRequire--txt">위 3가지 선택 항목을 모두 입력해야 저밀도 콜레스테롤 ‘자동계산’이 가능합니다</p>
          <div class="align--between right CheckupBloodNonRequire--radio">
            <div class="CheckupBloodNonRequire--radio-l">
              <label for="cbnr01" class="CheckupBloodNonRequire--radio-label" :class="low === 'auto' ? 'active' : ''">
                <input v-model="low" :disabled="calcDisabled" value="auto" type="radio" name="cbnr" id="cbnr01"
                  :checked="low === 'auto'" @change="onCalcLDL" class="CheckupBloodNonRequire--radio-radio">
                <span class="radio--icon"></span>
                <span class="CheckupBloodNonRequire--radio-txt">자동계산</span>
              </label>
            </div>
            <div class="CheckupBloodNonRequire--radio-r">
              <label for="cbnr02" class="CheckupBloodNonRequire--radio-label" :class="low === 'direct' ? 'active' : ''">
                <input v-model="low" :disabled="!isDisabled" value="direct" type="radio" name="cbnr" id="cbnr02"
                  :checked="low === 'direct'" class="CheckupBloodNonRequire--radio-radio">
                <span class="radio--icon"></span>
                <input :disabled="low !== 'direct'" placeholder="130" type="text" name="cbnr03" :value="calcLDL"
                  @blur="inputLDL" maxlength="5" class="CheckupBloodNonRequire--radio-input">
                <span class="CheckupBloodNonRequire----radio-txt">mg/dl</span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </transition>
  </div>
</template>

<style scoped>@use "@/assets/css/default.scss";</style>
