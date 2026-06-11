<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import BaseInput from '@/components/BaseInput2.vue'
import BaseOpener from '@/components/BaseOpener.vue'

const props = defineProps({
  basicData: {
    age: Number, // 0,            //연령
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
  },
  healthDataType: {
    type: String,
    default: ''
  }
})
const instance = getCurrentInstance() /* 어밋 인스턴스 */

const isWaistUnit = ref('cm')

const dispData = computed(() => {
  return Object.assign({}, props.basicData)
}) // ref(Object.assign({}, props.basicData))

const isOpen = ref(true) /* 내용 열고 닫기 */
const isDisabeld = computed(() => {
  return props.healthDataType === 'formal'
})

const inchCalc = 2.54 // cm / inch 변환 계산

const dispWaist = computed(() => {
  // null과 undefined만 체크, 0은 유효한 값으로 처리
  if (dispData.value.wc !== null && dispData.value.wc !== undefined && dispData.value.wc !== '') {
    return isWaistUnit.value === 'cm' ? dispData.value.wc : Math.round((dispData.value.wc / inchCalc))
  }

  return null
})

/* function setDispData() {
  dispData.value = Object.assign({}, props.basicData);
} */

function open (val) {
  isOpen.value = val
}

function inputHeight (value) { /* 신장 */
  dispData.value.ht = value
  emitParent()
}

function inputWeight (value) { /* 체중 */
  dispData.value.wt = value
  emitParent()
}

function inputWaist (value) { /* 허리둘레 */
  value = isWaistUnit.value === 'cm' ? value : value * inchCalc
  dispData.value.wc = value
  emitParent()
}

function changeWaist (val) { // 단위 변경에 따른 재계산 및 하위 컴퍼넌트 값 변경
  emitParent()
}

function emitParent () { // 상위 컴퍼넌트 update
  instance.emit('update', dispData.value)
}
</script>

<template>
  <div class="CheckupBasicsBody">
    <div class="align--between CheckupBasicsBody--tit-div">
      <h2 class="CheckupBasicsBody--tit">{{ $t('CheckupBasicsBody.text1') }}</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBasicsBody--input-div">
        <BaseInput
          :value="props.basicData.ht"
          :label="$t('CheckupBasicsBody.text2')"
          class="CheckupBasicsBody--height"
          placeholder="170"
          :disabled="isDisabeld"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputHeight">
          <template v-slot:suffix>
            <span>cm</span>
          </template>
        </BaseInput>

        <BaseInput
          :label="$t('CheckupBasicsBody.text3')"
          class="CheckupBasicsBody--weight"
          :value="props.basicData.wt"
          placeholder="60"
          :disabled="isDisabeld"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputWeight">
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput>

        <BaseInput
          :label="$t('CheckupBasicsBody.text4')"
          class="CheckupBasicsBody--waist"
          :value="dispWaist"
          placeholder="80"
          :disabled="isDisabeld"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }"
          @input="inputWaist">
          <template v-slot:suffix>
            <div class="CheckupBasicsBody--select-wrap" :class="isDisabeld ? 'disabled' : ''">
              <select
                v-model="isWaistUnit"
                class="CheckupBasicsBody--select noBorder"
                @change="changeWaist"
                :disabled="isDisabeld">
                <option value="cm" selected>cm</option>
                <option value="inch">inch</option>
              </select>
            </div>
          </template>
        </BaseInput>
      </div>

    </transition>
  </div>
</template>
