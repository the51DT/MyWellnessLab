<script setup>
import BaseInput from '@/components/BaseInput.vue'
import { ref, getCurrentInstance, computed } from 'vue'
import BaseOpener from '@/views/checkup/BaseOpener.vue'

const props = defineProps({
  basicData: {
    age: Number, // 0,            //연령
    analysisType: String, // "",     //분석타입
    healthDataType: String,
    birthDate: String, // "2023-11-22", //생년월일
    bmi: Number, // 0,            //체질량지수
    checkDate: String, // "2023-11-22", //검진일
    createdDate: String, // "string",     //생성일
    customerId: String, // "string",     //사용자ID
    dbp: Number, // 0,            //이완기혈압
    ht: Number, // 0,            //신장
    id: Number, // 0,            //일련번호
    modifiedDate: String, // "string",     //수정일
    name: String, // "이하늘",     //성명
    sbp: Number, // 0,            //수축기혈압
    sex: Number, // 0,            //성별
    gender: Number, // 0,            //성별(한글)
    wc: Number, // 0,            //허리둘레
    wt: Number, // 0,            //체중
    tc: Number, // 0,            //총 콜레스테롤
    ldl: Number, // 0,            //저밀도 콜레스테롤
    hdl: Number, // 0,            //고밀도 콜레스테롤
    tg: Number, // 0,            //중성지방
    hb: Number, // 0,            //혈색소
    glu: Number, // 0,            //공복혈당
    crea: Number, // 0,            //혈청크레아틴
    got: Number, // 0,            //간 아스파테이크 전이효소
    gpt: Number// 0,            //간 알라닌 전이효소
  }
})
const instance = getCurrentInstance() /* 어밋 인스턴스 */

const dispData = computed(() => {
  return Object.assign({}, props.basicData)
}) // ref(Object.assign({}, props.basicData))

const isOpen = ref(true) /* 내용부분 열고 닫는 오프너 */
const isEnabled = computed(() => {
  return dispData.value.healthDataType != 'formal'
})

function open (val) {
  isOpen.value = val
}

function inputShrinkBlood (value) { /* 수축기 혈압 */
  dispData.value.sbp = value
  emitParent()
}
function inputRelaxBlood (value) { /* 이완기 혈압 */
  dispData.value.dbp = value
  emitParent()
}
function emitParent () { // 상위 컴퍼넌트 update
  instance.emit('update', dispData.value)
}

function dataCheck () {
  console.log('##### basicBlood')
  console.log(toRaw(props.basicData))
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
          :disabled="isEnabled"
          :itemName="`수축기 혈압`"
          :value="props.basicData.sbp"
          :suf="`mmHg`"
          @inputTxt="inputShrinkBlood"
          :maxlength="3"
          class="CheckupBasicsBlood--shrink" />
        <!--pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput
          :disabled="isEnabled"
          :itemName="`이완기 혈압`"
          :value="props.basicData.dbp"
          :suf="`mmHg`"
          @inputTxt="inputRelaxBlood"
          :maxlength="3"
          class="CheckupBasicsBlood--relax" />
      </div>
    </transition>
  </div>
</template>

<style scoped>@use "@/assets/css/default.scss";</style>
