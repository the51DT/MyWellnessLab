<script setup>
import { ref, computed } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseOpener from '@/components/BaseOpener.vue'
import { calcAge, makeBirthDay, isValidDate } from '@/assets/js/common'

const props = defineProps({
  basicData: {
    type: Object,
    default: null
  },
  analysisType: {
    type: String,
    default: ''
  },
  user: {
    type: Object,
    default: null
  },
  checkDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update'])

const isOpen = ref(true)

const isOneTime = computed(() => {
  return props.analysisType === 'onetime'
})

const birthDate = computed(() => {
  if (props.basicData.birthDate) {
    return props.basicData.birthDate.replace(/\./gi, '').substring(2)
  }
  return ''
})

const isBirthDayValidate = computed(() => {
  return !!isValidDate(props.basicData.birthDate)
})

function open (val) {
  isOpen.value = val
}

function changeSex (value) {
  emit('update', { sex: value })
}

function changeBirthDate (val) {
  console.log('val', val)
  let birthDate = makeBirthDay(val)
  const age = calcAge(birthDate)

  birthDate = birthDate.replace(/\-/gi, '.')

  emit('update', {
    birthDate,
    age,
    isBirthDayValidate
  })
}

// 생년월일과 검진일을 받아서 나이를 계산하는 함수 (Safari 호환)
const calculateAge = (birthDate, checkDate) => {
  if (!birthDate || !checkDate) return null
  
  try {
    // Safari 호환성을 위한 안전한 날짜 파싱
    let birth, check
    
    // birthDate 처리
    if (birthDate.includes('-')) {
      // YYYY-MM-DD 형식
      const birthParts = birthDate.split('-')
      if (birthParts.length === 3) {
        birth = new Date(parseInt(birthParts[0], 10), parseInt(birthParts[1], 10) - 1, parseInt(birthParts[2], 10))
      } else {
        birth = new Date(birthDate)
      }
    } else if (birthDate.includes('.')) {
      // YYYY.MM.DD 형식
      const birthParts = birthDate.split('.')
      if (birthParts.length === 3) {
        birth = new Date(parseInt(birthParts[0], 10), parseInt(birthParts[1], 10) - 1, parseInt(birthParts[2], 10))
      } else {
        birth = new Date(birthDate)
      }
    } else {
      // 기타 형식
      birth = new Date(birthDate)
    }
    
    // checkDate 처리
    if (checkDate.includes('-')) {
      // YYYY-MM-DD 형식
      const checkParts = checkDate.split('-')
      if (checkParts.length === 3) {
        check = new Date(parseInt(checkParts[0], 10), parseInt(checkParts[1], 10) - 1, parseInt(checkParts[2], 10))
      } else {
        check = new Date(checkDate)
      }
    } else if (checkDate.includes('.')) {
      // YYYY.MM.DD 형식
      const checkParts = checkDate.split('.')
      if (checkParts.length === 3) {
        check = new Date(parseInt(checkParts[0], 10), parseInt(checkParts[1], 10) - 1, parseInt(checkParts[2], 10))
      } else {
        check = new Date(checkDate)
      }
    } else {
      // 기타 형식
      check = new Date(checkDate)
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(birth.getTime()) || isNaN(check.getTime())) {
      console.warn('Invalid date:', { birthDate, checkDate })
      return null
    }
    
    let age = check.getFullYear() - birth.getFullYear()
    const monthDiff = check.getMonth() - birth.getMonth()
    
    // 생일이 아직 지나지 않았으면 1살 빼기
    if (monthDiff < 0 || (monthDiff === 0 && check.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  } catch (error) {
    console.warn('calculateAge error:', error)
    return null
  }
}

// 검진일에 맞는 나이 계산 (Safari 호환)
const calculatedAge = computed(() => {
  if (props.basicData.birthDate && props.checkDate) {
    const age = calculateAge(props.basicData.birthDate, props.checkDate)
    // null이나 NaN인 경우 기본 나이값 사용
    if (age === null || isNaN(age)) {
      console.warn('calculateAge failed, using fallback age:', props.basicData.age)
      return props.basicData.age || 0
    }
    return age
  }
  return props.basicData.age || 0 // 기본 나이값 fallback
})
</script>

<template>
  <!--  <div class="CheckupBasicsBasic" :class="isOpen ? 'active' : ''">-->
  <div class="CheckupBasicsBasic">
    <div class="align--between CheckupBasicsBasic--tit">
      <h2 class="CheckupBasicsBasic--tit-txt">{{ $t('CheckupBasicsBasic.text1') }}</h2>
      <BaseOpener @open="open" />
    </div>
    <transition name="downUp">
      <div v-show="isOpen" class="CheckupBasicsBasic--input-div">
        <BaseInput
            v-if="!isOneTime"
            :disabled="false"
            :itemName="$t('CheckupBasicsBasic.text2')"
            :value="props.basicData.name"
            :type="`text`"
            class="CheckupBasicsBasic--name wide" />
        <BaseInput
            v-if="!isOneTime"
            :disabled="false"
            :itemName="$t('CheckupBasicsBasic.text3')"
            :value="calculatedAge"
            :suf="$t('Common.age2')"
            class="CheckupBasicsBasic--age" />
        <BaseInput
            v-if="!isOneTime"
            :disabled="false"
            :itemName="$t('Common.sex')"
            :type="`text`"
            :value="props.basicData.gender"
            class="CheckupBasicsBasic--gender wide" />

        <BaseInput
            v-if="isOneTime"
            :isBaseFocus="!isBirthDayValidate"
            :itemName="$t('CheckupBasicsBasic.text6')"
            type="text"
            inputmode="numeric"
            :zeroCheck="false"
            :value="birthDate"
            @inputTxt="changeBirthDate"
            :validationMessage="$t('CheckupBasicsBasic.text7')"
            :isValidate="isBirthDayValidate"
            :maxlength="6"
            :placeholder="'010203'"
            class="CheckupBasicsBasicOne--birth wide" />
        <dl
            v-if="isOneTime"
            class="BaseInput CheckupBasicsBasicOne--dl">
          <dt class="BaseInput--dt CheckupBasicsBasicOne--dt">
            <span class="CheckupBasicsBasicOne--gender">{{ $t('Common.sex') }}</span>
          </dt>

          <dd class="BaseInput--dd CheckupBasicsBasicOne--dd">
            <div class="align--between CheckupBasicsBasicOne--con-div">
              <div class="CheckupBasicsBasicOne--con-left">
                <label
                    for="cbbo01"
                    class="CheckupBasicsBasicOne--male-label"
                    :class="basicData.sex === 1 ? 'active' : ''">
                  <input
                      type="radio"
                      name="cbbo"
                      id="cbbo01"
                      class="CheckupBasicsBasicOne--male-radio"
                      hidden="hidden"
                      @change="changeSex(1)" />
                  <span class="CheckupBasicsBasicOne--male-txt">{{ $t('Common.male') }}</span>
                </label>
              </div>

              <div class="CheckupBasicsBasicOne--con-right">
                <label
                    for="cbbo02"
                    class="CheckupBasicsBasicOne--female-label"
                    :class="basicData.sex === 2 ? 'active' : ''">
                  <input
                      type="radio"
                      name="cbbo"
                      id="cbbo02"
                      class="CheckupBasicsBasicOne--female-radio"
                      hidden="hidden"
                      @change="changeSex(2)" />
                  <span class="CheckupBasicsBasicOne--female-txt">{{ $t('Common.female') }}</span>
                </label>
              </div>
            </div>
          </dd>
        </dl>
      </div>
    </transition>
  </div>
</template>
