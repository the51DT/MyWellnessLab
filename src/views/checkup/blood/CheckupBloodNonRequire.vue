<script setup>
import { computed, ref } from 'vue'
import BaseInput2 from '@/components/BaseInput2.vue'
import BaseOpener from '@/components/BaseOpener.vue'
import * as cmnRegex from '@/utils/commonRegex'

const props = defineProps({
  basicData: {
    bloodId: Number,
    hdl: Number,
    ldl: Number,
    tc: Number,
    tg: Number,
    id: Number
  },
  nhisData: Object,
  analysisType: String,
  healthDataType: String,
  isNhisDataEditYn: String // 'Y'이면 사용자가 직접 입력한 데이터 → 수정 가능
})

const emit = defineEmits(['update'])

const dispData = ref({ ...props.basicData })
const isOpen = ref(true)

const isFormal = computed(() => {
  return props.healthDataType === 'formal'
})

function isNull (val) {
  return !!((val === '' || val === 0 || val === undefined || val === null))
}

const low = ref('direct')
const directRadio = ref(null)
const autoRadio = ref(null)

const calcDisabled = computed(() => { // 자동계산 버튼 활성화여부
  return (isNull(dispData.value.tc) || isNull(dispData.value.hdl) || isNull(dispData.value.tg))
})

function open (val) {
  isOpen.value = val
}

function onCalcLDL () { // 자동계산처리
  // TC, HDL, TG 중 하나라도 비어있으면 LDL도 빈 값으로 설정
  if (low.value === 'auto' && (isNull(dispData.value.tc) || isNull(dispData.value.hdl) || isNull(dispData.value.tg))) {
    dispData.value.ldl = ''
    emitParent()
    return
  }

  let rtnValue = dispData.value.ldl

  if (low.value === 'auto') {
    rtnValue = Number(dispData.value.tc) - ((Number(dispData.value.tg / 5)) + Number(dispData.value.hdl))
  }

  rtnValue = (rtnValue) || 0
  rtnValue = rtnValue < 0 ? 0 : rtnValue
  dispData.value.ldl = Math.trunc(rtnValue)

  emitParent()
}

const checkOptionValue = () => {
  if (calcDisabled.value && autoRadio.value.checked) {
    directRadio.value.click()
    dispData.value.ldl = ''
  }
}

function inputTC (value) { /* 지질대사 총 콜레스테롤 */
  // 숫자와 소수점만 허용하는 추가 검증
  let cleanValue = cmnRegex.changeOnlyDecimal(value)
  
  dispData.value.tc = cleanValue

  if (low.value === 'auto') {
    onCalcLDL()
  } else {
    emitParent()
  }

  checkOptionValue()
}

function inputHDL (value) { /* 지질대사 고밀도 콜레스테롤 */
  // 숫자와 소수점만 허용하는 추가 검증
  let cleanValue = cmnRegex.changeOnlyDecimal(value)
  
  dispData.value.hdl = cleanValue

  if (low.value === 'auto') {
    onCalcLDL()
  } else {
    emitParent()
  }

  checkOptionValue()
}
function inputTG (value) { /* 지질대사 중성지방 */
  // 숫자와 소수점만 허용하는 추가 검증
  let cleanValue = cmnRegex.changeOnlyDecimal(value)
  
  dispData.value.tg = cleanValue

  if (low.value === 'auto') {
    onCalcLDL()
  } else {
    emitParent()
  }

  checkOptionValue()
}
function inputLDL (value) {
  // 숫자와 소수점만 허용하는 추가 검증
  let cleanValue = cmnRegex.changeOnlyDecimal(value)
  
  // 소수점 한자리까지만 허용
  if (cleanValue.includes('.')) {
    const parts = cleanValue.split('.')
    if (parts[1] && parts[1].length > 1) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 1)
    }
  }
  
  dispData.value.ldl = cleanValue

  if (low.value === 'auto') {
    onCalcLDL()
  } else {
    emitParent()
  }
}

function directInputLDL (e) {
  let value = cmnRegex.changeOnlyDecimal(e.target.value)

  // 소수점 한자리까지만 허용
  if (value.includes('.')) {
    const parts = value.split('.')
    if (parts[1] && parts[1].length > 1) {
      value = parts[0] + '.' + parts[1].substring(0, 1)
    }
  }

  e.target.value = value
  inputLDL(value)
}

const isBloodNonRequireDisable = (value) => {
  // formal 모드이고, nhisData에 값이 있고, isNhisDataEditYn !== 'Y'이면 disabled
  // isNhisDataEditYn === 'Y'이면 사용자가 직접 입력한 데이터이므로 수정 가능
  return isFormal.value && !isNull(value) && props.isNhisDataEditYn !== 'Y'
}

function emitParent () {
  emit('update', dispData.value)
}

// 부모 컴포넌트에서 자동계산시 호출될 함수
const changeAutoLow = () => {
  low.value = 'auto'
  onCalcLDL()
}

defineExpose({
  changeAutoLow
})
</script>

<template>
  <div class="CheckupBloodNonRequire">
    <div class="align--between CheckupBloodNonRequire--tit">
      <h2 class="CheckupBloodNonRequire--tit-txt">{{ $t('CheckupBloodNonRequire.text1') }}</h2>
      <BaseOpener @open="open" class="CheckupBloodNonRequire--open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBloodNonRequire--input-div">
        <div
          v-if="!dispData.tc || !dispData.hdl || !dispData.tg"
          class="CheckupBloodNonRequire--msg">
          {{ $t('CheckupBloodNonRequire.text2') }}
        </div>

        <BaseInput2
          :value="dispData.tc"
          class="CheckupBloodNonRequire--name"
          placeholder="150"
          :disabled="isBloodNonRequireDisable(props.nhisData.tc)"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            // 숫자(0-9), 소수점(.), 백스페이스, Delete, Tab, Enter, Arrow keys만 허용
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDecimal = e.key === '.'
            
            if (!isNumber && !isDecimal && !allowedKeys.includes(e.key)) {
              e.preventDefault()
            }
          }"
          @input="inputTC">
          <template v-slot:label>
            {{ $t('CheckupBloodNonRequire.text3') }}<br />
            (T-Cholesterol)
          </template>
          <template v-slot:suffix>
            <span>mg/dl</span>
          </template>
        </BaseInput2>

        <BaseInput2
          :value="dispData.hdl"
          class="CheckupBloodNonRequire--age"
          placeholder="60"
          :disabled="isBloodNonRequireDisable(props.nhisData.hdl)"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            // 숫자(0-9), 소수점(.), 백스페이스, Delete, Tab, Enter, Arrow keys만 허용
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDecimal = e.key === '.'
            
            if (!isNumber && !isDecimal && !allowedKeys.includes(e.key)) {
              e.preventDefault()
            }
          }"
          @input="inputHDL">
          <template v-slot:label>
            {{ $t('CheckupBloodNonRequire.text5') }}<br />
            (HDL-C)
          </template>
          <template v-slot:suffix>
            <span>mg/dl</span>
          </template>
        </BaseInput2>

        <BaseInput2
          :value="dispData.tg"
          class="CheckupBloodNonRequire--gender"
          placeholder="70"
          :disabled="isBloodNonRequireDisable(props.nhisData.tg)"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            // 숫자(0-9), 소수점(.), 백스페이스, Delete, Tab, Enter, Arrow keys만 허용
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDecimal = e.key === '.'
            
            if (!isNumber && !isDecimal && !allowedKeys.includes(e.key)) {
              e.preventDefault()
            }
          }"
          @input="inputTG">
          <template v-slot:label>
            {{ $t('CheckupBloodNonRequire.text7') }}<br />
            (Triglyceride)
          </template>
          <template v-slot:suffix>
            <span>mg/dl</span>
          </template>
        </BaseInput2>

        <BaseInput2
          v-if="isFormal && props.nhisData.ldl"
          :value="dispData.ldl"
          class="CheckupBloodNonRequire--gender"
          placeholder="130"
          :disabled="isBloodNonRequireDisable(props.nhisData.ldl)"
          :maxlength="5"
          :fixed="1"
          @keydown="(e) => {
            // 숫자(0-9), 소수점(.), 백스페이스, Delete, Tab, Enter, Arrow keys만 허용
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDecimal = e.key === '.'

            if (!isNumber && !isDecimal && !allowedKeys.includes(e.key)) {
              e.preventDefault()
            }
          }"
          @input="inputLDL">
          <template v-slot:label>
            {{ $t('CheckupBloodNonRequire.text9') }}<br />
            (LDL-C)
          </template>
          <template v-slot:suffix>
            <span>mg/dl</span>
          </template>
        </BaseInput2>

        <div v-else class="CheckupBloodNonRequire--cole">
          <span class="CheckupBloodNonRequire--cole-tit">{{ $t('CheckupBloodNonRequire.text9') }}(LDL-C)</span>
          <p
            v-if="!dispData.tc || !dispData.hdl || !dispData.tg"
            class="CheckupBloodNonRequire--txt">{{ $t('CheckupBloodNonRequire.text12') }}</p>
          <div class="align--between right CheckupBloodNonRequire--radio">
            <div class="CheckupBloodNonRequire--radio-l">
              <label for="cbnr01" class="CheckupBloodNonRequire--radio-label" :class="low === 'auto' ? 'active' : ''">
                <input
                  ref="autoRadio"
                  v-model="low"
                  :disabled="calcDisabled"
                  value="auto"
                  type="radio"
                  name="cbnr"
                  id="cbnr01"
                  :checked="low === 'auto'"
                  @change="onCalcLDL"
                  class="CheckupBloodNonRequire--radio-radio" />
                <span class="radio--icon" />
                <span class="CheckupBloodNonRequire--radio-txt">{{ $t('CheckupBloodNonRequire.text13') }}</span>
              </label>
            </div>
            <div class="CheckupBloodNonRequire--radio-r">
              <label for="cbnr02" class="CheckupBloodNonRequire--radio-label" :class="low === 'direct' ? 'active' : ''">
                <input
                  ref="directRadio"
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
                  inputmode="decimal"
                  pattern="[0-9.]*"
                  name="cbnr03"
                  v-model="dispData.ldl"
                  @input="directInputLDL"
                  @keydown="(e) => {
                    // 숫자(0-9), 소수점(.), 백스페이스, Delete, Tab, Enter, Arrow keys만 허용
                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
                    const isNumber = /^[0-9]$/.test(e.key)
                    const isDecimal = e.key === '.'

                    if (!isNumber && !isDecimal && !allowedKeys.includes(e.key)) {
                      e.preventDefault()
                    }
                  }"
                  maxlength="5"
                  class="CheckupBloodNonRequire--radio-input" />
                <span class="CheckupBloodNonRequire----radio-txt">mg/dl</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>
