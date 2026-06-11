<!-- [TODO] 추후 input 공통 컴포넌트 현재 컴포넌트로 전체 변경 예정 - (김현수) -->
<script setup>
/**
 * 웰니스 분석 시 값을 입력받는 콤포넌트
 */
import { ref, watch } from 'vue'
import * as cmnRegex from '@/utils/commonRegex'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: null
  },
  fixed: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

const isFocus = ref(false)
const inputValue = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
  }
)

watch(
  () => props.value,
  (newValue) => {
    inputValue.value = newValue
  },
  { immediate: true }
)

const handleFocus = (e) => {
  isFocus.value = true
}

/**
 * IME 입력(한글, 일본어, 중국어, 아랍어 등 모든 비-ASCII 문자) 차단
 */
const handleCompositionStart = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleCompositionUpdate = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleCompositionEnd = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * 입력 전에 검증 (최신 브라우저 지원)
 */
const handleBeforeInput = (e) => {
  const data = e.data
  
  // null이거나 undefined인 경우(삭제, 백스페이스 등) 허용
  if (!data) return
  
  // 숫자와 소수점만 허용
  if (!/^[0-9.]$/.test(data)) {
    e.preventDefault()
  }
}

/**
 * 사용자가 입력한 값을 특정 형식(여기서는 a와 b를 .으로 구분)에 따라 처리하고, 이를 상위 컴포넌트에 업데이트 처리
 * @param e - 이벤트 타겟
 */
const handleBlur = (e) => {
  const value = e.target.value
  
  // 빈 값이거나 소수점만 있는 경우 처리
  if (!value || value === '.') {
    e.target.value = ''
    emit('input', '')
    isFocus.value = false
    return
  }
  
  const [a, b] = value.split('.')

  if (props.fixed) {
    if (!b) {
      // 소수점 뒤에 숫자가 없는 경우 정수 부분만 사용
      e.target.value = a || ''
      emit('input', a || '')
    } else {
      // 소수점이 있는 경우 유효한 숫자로 변환
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        const formattedValue = numValue.toFixed(props.fixed)
        e.target.value = formattedValue
        emit('input', formattedValue)
      }
    }
  } else {
    // fixed가 0인 경우 정수만 허용
    e.target.value = a || ''
    emit('input', a || '')
  }

  isFocus.value = false
}

const handleInput = (e) => {
  // 먼저 쉼표, 하이픈, 플러스 등 특수문자 제거
  let value = e.target.value.replace(/[,\-+eE]/g, '')
  
  // 한글, 알파벳 등 비-숫자 문자 제거 (숫자와 소수점만 허용)
  value = value.replace(/[^0-9.]/g, '')
  
  // 빈 값을 줄경우 그대로 리턴
  if (cmnRegex.isEmpty(value)) {
    e.target.value = ''
    emit('update:modelValue', '')
    emit('input', '')
    return
  }

  // 소수점이 포함된 입력값 처리
  if (value.includes('.')) {
    const parts = value.split('.')
    if (parts.length > 2) {
      // 소수점이 2개 이상인 경우 마지막 소수점만 유지
      value = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // 소수점 뒤에 숫자가 없는 경우 (예: "123.") 허용
    if (parts.length === 2 && parts[1] === '') {
      e.target.value = value
      emit('update:modelValue', value)
      emit('input', value)
      return
    }
  }

  // 숫자와 소수점만 허용
  value = String(cmnRegex.changeOnlyDecimal(value))

  // 00 체크하는 이유는 0.1을 입력하는 과정에서 . 을누를때 '0.'을 주는게아니라 0값만 value를 주게되어 계속 0을 찍게됨
  if (value === '0' && e.target.value === '00') {
    e.target.value = 0
    emit('update:modelValue', 0)
    emit('input', 0)
    return
  }

  const [a, b] = value.split('.')

  if (props.maxlength && String(a).length > props.maxlength) {
    value = inputValue.value
    e.target.value = inputValue.value
  }

  if (props.fixed && b && b.length > props.fixed) {
    const newValue = Number(value).toFixed(props.fixed)

    value = newValue
    e.target.value = newValue
  } else {
    if (!props.fixed && b) {
      const newValue = Math.floor(Number(value))

      value = newValue
      e.target.value = newValue
    }
  }

  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (e) => {
  emit('change', e.target.value)
}
</script>

<template>
  <dl class="BaseInput">
    <dt class="BaseInput--dt">
      <span v-if="props.label">{{ props.label }}</span>
      <slot name="label" />
    </dt>

    <dd class="BaseInput--dd">
      <div class="BaseInput--dd-div" :class="{'disabled': disabled, 'active': isFocus}">
        <div class="BaseInput--pre">
          <slot name="prefix" />
        </div>

        <input
          :value="inputValue"
          class="BaseInput--input"
          :disabled="disabled"
          :placeholder="props.placeholder"
          :type="'text'"
          inputmode="decimal"
          autocomplete="off"
          :maxlength="props.maxlength"
          @focus="handleFocus"
          @blur="handleBlur"
          @beforeinput="handleBeforeInput"
          @input="handleInput"
          @change="handleChange"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd" />

        <div class="BaseInput--suf">
          <span class="BaseInput--suf-in">
            <slot name="suffix" />
          </span>
        </div>
      </div>
    </dd>
  </dl>
</template>

<style lang="scss" scoped>
.BaseInput--input {
  outline: none;
}
</style>
