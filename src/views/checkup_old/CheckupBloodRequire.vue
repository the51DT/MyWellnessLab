<script setup>
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
      // createdDate: "", //혈액검사 필수입력 생성 일자
      // modifiedDate: "" //혈액검사 필수입력 수정 일자
    },
    bloodOptional: {
      bloodId: String, // 기본검사 Seq
      hdl: Number,
      ldl: Number,
      tc: Number,
      tg: Number,
      id: String // 혈액검사 선택입력 Seq
      // createdDate: "",  //혈액검사 선택입력 생성일자
      // modifiedDate: "", //혈액검사 선택입력 수정일자
    }
  }
})
const instance = getCurrentInstance() /* 어밋 인스턴스 */

const dispData = ref(Object.assign({}, props.basicData))

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isDisabled = computed(() => {
  return props.healthDataType != 'formal'
}) /* 공단연계인 경우 false */

function open (val) {
  isOpen.value = val
}

function inputHB (value) {
  /* 일반혈액검사소 */
  dispData.value.blood.hb = value
  emitParent()
}
function inputGLU (value) {
  /* 당대사 공복혈당 */
  dispData.value.blood.glu = value
  emitParent()
}
function inputCREA (value) {
  /* 일반화학검사 혈청 크레아티닌 */
  dispData.value.blood.crea = value
  emitParent()
}
function inputGOT (value) {
  /* 간기능 아스파테이크 전이효소 */
  dispData.value.blood.got = value
  emitParent()
}
function inputGPT (value) {
  /* 간기능 알라닌 전이효소 */
  dispData.value.blood.gpt = value
  emitParent()
}

function emitParent () { // 상위 컴퍼넌트 update)
  instance.emit('update', props.mapName, dispData.value)
}

watch(props, (val) => { // props 변경 시 처리
  dispData.value = val.basicData
})
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
          :disabled="isDisabled"
          :itemName="`일반혈액검사소`"
          :value="props.basicData.blood.hb"
          :suf="`g/dl`"
          :maxlength="5"
          @inputTxt="inputHB"
          class="CheckupBloodRequire--name" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput
          :disabled="isDisabled"
          :itemName="`당대사 공복혈당`"
          :value="props.basicData.blood.glu"
          :suf="`mg/dl`"
          :maxlength="5"
          @inputTxt="inputGLU"
          class="CheckupBloodRequire--age" />
        <BaseInput
          :disabled="isDisabled"
          :itemName="`일반화학검사 혈청 크레아티닌`"
          :value="props.basicData.blood.crea"
          :suf="`mg/dL`"
          :maxlength="5"
          @inputTxt="inputCREA"
          class="CheckupBloodRequire--gender" />
        <BaseInput
          :disabled="isDisabled"
          :itemName="`간기능 아스파테이크 전이효소`"
          :value="props.basicData.blood.got"
          :suf="`IU/ℓ`"
          :maxlength="5"
          @inputTxt="inputGOT"
          class="CheckupBloodRequire--gender" />
        <BaseInput
          :disabled="isDisabled"
          :itemName="`간기능 알라닌 전이효소`"
          :value="props.basicData.blood.gpt"
          :suf="`IU/ℓ`"
          :maxlength="5"
          @inputTxt="inputGPT"
          class="CheckupBloodRequire--gender" />
      </div>
    </transition>
  </div>
</template>

<style scoped>@use "@/assets/css/default.scss";</style>
