<script setup>
import BaseInput from '@/components/BaseInput.vue'

import { ref, getCurrentInstance, computed, onMounted, toRaw } from 'vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'
import { dateConvert, calcAge } from '@/assets/js/common'

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
const isDisabled = computed(() => {
  // return props.basicData.analysisType == 'direct' ? true : false;
  return false
})
const isGender = ref('') /* 성별 입력 시 */
const birthDate = ref('') /* 생년월일(6자리) 입력 시 사용 */

function open(val) { /* 내용 열고 닫는 */
  isOpen.value = val
}

function inputValue(val) {
  emitParent()
}
function inputAge(value) {
  /* 나이 */
}

function inputGender() {
  dispData.value.sex = isGender.value
  emitParent()
}

function inputBirthDate(val) { /* 6자리 제한 */
  const now = new Date().getFullYear()
  const nowYear = String(now).substring(0, 2)
  let tmpYear
  let tmpVal

  if (String(val).length == 6) {
    tmpYear = String(val).substring(0, 2)
    tmpYear = (nowYear > tmpYear) ? (2000 + parseInt(tmpYear)) : (1900 + parseInt(tmpYear))
    tmpVal = tmpYear + String(val).substring(2, 6)
    tmpVal = dateConvert(tmpVal)

    // if(!Number.isNaN(new Date(tmpVal).getMonth())) {//tmpVal 의 날짜항목이 정상적일 경우에만 값을 담음
    dispData.value.birthDate = tmpVal // 날짜
    dispData.value.age = calcAge(tmpVal) // 연령계산
    if (Number.isNaN(dispData.value.age)) {
      dispData.value.age = -1
    }
    emitParent()
    // }
  }
}

function emitParent() { // 상위 컴퍼넌트 update
  instance.emit('update', dispData.value)
}

/*  function setDispData() {
  dispData.value = Object.assign({}, props.basicData);
} */

function dataCheck() {
  console.log('##### basicBasic')
  console.log(toRaw(props.basicData))
}

/*  watch(props.basicData, (val1, val2) => {
  setDispData();
}) */

onMounted(() => {
  birthDate.value = props.basicData.birthDate ? props.basicData.birthDate.replace(/\-/gi, '').substring(2) : ''
  console.log(toRaw(props.basicData))
})
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
        <BaseInput v-if="props.basicData.analysisType != 'onetime'" :disabled="isDisabled" :itemName="`이름`"
          :value="props.basicData.name" :type="`text`" @inputTxt="inputValue" class="CheckupBasicsBasic--name wide" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <BaseInput v-if="props.basicData.analysisType != 'onetime'" :disabled="isDisabled" :itemName="`나이(만)`"
          :value="props.basicData.age" :suf="`세`" @inputTxt="inputAge" class="CheckupBasicsBasic--age" />
        <BaseInput v-if="props.basicData.analysisType != 'onetime'" :disabled="isDisabled" :itemName="`성별`" :type="`text`"
          :value="props.basicData.gender" class="CheckupBasicsBasic--gender wide" />

        <!--    else 일회성-->
        <BaseInput v-if="props.basicData.analysisType == 'onetime'" :itemName="`생년월일 6자리`" :zeroCheck="false"
          :value="birthDate" @inputTxt="inputBirthDate" :maxlength="6" class="CheckupBasicsBasicOne--birth wide" />
        <!--itemName: 항목명, value: 이미 값이 있다면 여기에, pre 인풋 앞 설명문구, suf: 인풋 뒷 단위 등등-->
        <dl v-if="props.basicData.analysisType == 'onetime'" class="BaseInput CheckupBasicsBasicOne--dl">
          <dt class="BaseInput--dt CheckupBasicsBasicOne--dt">
            <span class="CheckupBasicsBasicOne--gender">성별</span>
          </dt>
          <dd class="BaseInput--dd CheckupBasicsBasicOne--dd">
            <div class="align--between CheckupBasicsBasicOne--con-div">
              <div class="CheckupBasicsBasicOne--con-left">
                <label for="cbbo01" class="CheckupBasicsBasicOne--male-label" :class="isGender === '1' ? 'active' : ''">
                  <input v-model="isGender" value="1" v-on:change="inputGender" type="radio" name="cbbo" id="cbbo01"
                    class="CheckupBasicsBasicOne--male-radio" hidden="hidden">
                  <span class="CheckupBasicsBasicOne--male-txt">남성</span>
                </label>
              </div>
              <div class="CheckupBasicsBasicOne--con-right">
                <label for="cbbo02" class="CheckupBasicsBasicOne--female-label" :class="isGender === '2' ? 'active' : ''">
                  <input v-model="isGender" value="2" v-on:change="inputGender" type="radio" name="cbbo" id="cbbo02"
                    class="CheckupBasicsBasicOne--female-radio" hidden="hidden">
                  <span class="CheckupBasicsBasicOne--female-txt">여성</span>
                </label>
              </div>
            </div>
          </dd>
        </dl>

      </div>
    </transition>
  </div>
</template>

<style scoped></style>
