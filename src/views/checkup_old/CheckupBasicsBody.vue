<script setup>
import BaseInput from '@/components/BaseInput.vue'
import { ref, getCurrentInstance, computed } from 'vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'

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

const compWaist = ref(null) // 허리둘레 컴포넌트
const isWaistUnit = ref('cm')

const dispData = computed(() => {
  return Object.assign({}, props.basicData)
}) // ref(Object.assign({}, props.basicData))

const isOpen = ref(true) /* 내용 열고 닫기 */
const isEnabled = computed(() => {
  return dispData.value.healthDataType != 'formal'
})

const inchCalc = 2.54 // cm / inch 변환 계산

const dispWaist = computed(() => { // 화면에 노출되는 허리둘레
  if (dispData.value.wc === undefined) {
    dispData.value.wc = 0
  }
  const rtnVal = isWaistUnit.value == 'cm' ? dispData.value.wc : Math.round((dispData.value.wc / inchCalc))
  return rtnVal
})

/* function setDispData() {
  dispData.value = Object.assign({}, props.basicData);
} */

function open(val) {
  isOpen.value = val
}

function inputHeight(value) { /* 신장 */
  dispData.value.ht = value
  emitParent()
}

function inputWeight(value) { /* 체중 */
  dispData.value.wt = value
  emitParent()
}

function inputWaist(value) { /* 허리둘레 */
  value = isWaistUnit.value == 'cm' ? value : value * inchCalc
  dispData.value.wc = value
  emitParent()
}

function changeWaist(val) { // 단위 변경에 따른 재계산 및 하위 컴퍼넌트 값 변경
  compWaist.value.txt = dispWaist.value // 허리둘레 컴퍼넌트의 값을 변경
  emitParent()
}

function emitParent() { // 상위 컴퍼넌트 update
  instance.emit('update', dispData.value)
}

function dataCheck() {
  console.log('##### basicBody')
  console.log(toRaw(props.basicData))
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
        <BaseInput :itemName="`신장`" :disabled="isEnabled" :value="props.basicData.ht" :suf="`cm`" @inputTxt="inputHeight"
          :maxlength="5" class="CheckupBasicsBody--height" />
        <!--pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등, itemName: 항목명, value: 기존 값, placeholder: placeholder-->
        <BaseInput :itemName="`체중`" :disabled="isEnabled" :value="props.basicData.wt" :suf="`kg`" @inputTxt="inputWeight"
          :maxlength="5" class="CheckupBasicsBody--weight" />
        <Base-input ref="compWaist" :itemName="`허리둘레`" :disabled="isEnabled" :value="dispWaist" @inputTxt="inputWaist"
          :maxlength="5" class="CheckupBasicsBody--waist">
          <template v-slot:custom>
            <div class="CheckupBasicsBody--select-wrap" :class="!isEnabled ? 'disabled' : ''">
              <select v-model="isWaistUnit" class="CheckupBasicsBody--select noBorder" @change="changeWaist"
                :disabled="!isEnabled">
                <option value="cm" selected>cm</option>
                <option value="inch">inch</option>
              </select>
            </div>
          </template>
        </base-input>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>
