<script setup>
/**
 * 웰니스 분석 시 값을 입력받는 콤포넌트
 */
import { ref, computed, watch, onMounted } from 'vue'
import { focusDom } from '@/assets/js/common' /* 231204 인풋 포커스 위해 신규 함수 추가 */

const props = defineProps({
  itemName: String, /* 항목명 */
  pre: { /* 인풋 앞 접두사 */
    type: String,
    default: ''
  },
  type: {
    default: 'number'
  },
  inputmode: { /* 모바일 키보드 타입 */
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: true
  },
  value: { /* 세팅된 값이 있는 경우 input값 */
    default: ''
  },
  placeholder: {
    default: '0'
  },
  suf: { /* 인풋 뒤 접미사 */
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: -1
  },
  zeroCheck: {
    type: Boolean,
    default: true
  },
  validationMessage: {
    type: String,
    default: ''
  },
  isValidate: {
    type: Boolean,
    default: false
  },
  isBaseFocus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['inputTxt'])
const isFocused = ref(false)
const txt = ref(props.value)
const baseInput = ref(null)

// 문자열이 숫자 또는 점(.)으로만 이루어져 있는지 확인
const regex = computed(() => {
  return (props.zeroCheck ? /^[0-9\.]{props.maxlength}$/gi : /^[0-9]{props.maxlength}$/gi)
})

// txt.value = props.value;

// 입력받은 값을 처리하고 이를 다른 컴포넌트와 공유할 수 있도록 해줍니다
function inputTxt (event) { /* 입력받은 값 */
  // event.target.value = event.target.value.replace(/^0+/, ''); //LeadingZero 수정
  
  // 숫자 타입이거나 inputmode가 numeric일 때 숫자만 허용 (소수점 포함 여부는 zeroCheck에 따름)
  if (props.type === 'number' || props.type === 'tel' || props.inputmode === 'numeric') {
    if (props.zeroCheck) {
      // 소수점 허용
      txt.value = String(txt.value).replace(/[^0-9.]/g, '')
    } else {
      // 정수만 허용
      txt.value = String(txt.value).replace(/[^0-9]/g, '')
    }
  }
  
  if (props.maxlength > 0 && (props.type === 'number' || props.inputmode === 'numeric')) { // 자릿수 정규식
    if (!regex.value.test(txt.value)) {
      txt.value = String(txt.value).substring(0, props.maxlength)
    }
  }
  emit('inputTxt', txt.value)
}
function focusHandler () {
  isFocused.value = true
}
function blurHandler () {
  isFocused.value = false
}

watch(() => props.value, (val) => {
  txt.value = val
})

watch(() => props.isBaseFocus, (val) => {
  val && baseInput.value.focus()
})
</script>

<template>
  <dl class="BaseInput">
    <dt class="BaseInput--dt">
      <span v-if="props.itemName">{{ props.itemName }}</span>
      <slot name="itemName" />
    </dt>
    <dd class="BaseInput--dd">
      <div class="BaseInput--dd-div" :class="{'disabled': !disabled, 'focus': isFocused}">
        <div class="BaseInput--pre">
          {{ props.pre }}
          <slot name="hCustom" />
        </div>
        <input
          ref="baseInput"
          :disabled="!disabled"
          v-model="txt"
          @input="inputTxt"
          @focus="[focusHandler, focusDom($event, true)]"
          @blur="[blurHandler, focusDom($event, false)]"
          :placeholder="props.placeholder"
          :type="props.type"
          :inputmode="props.inputmode || (props.type === 'number' || props.type === 'tel' ? 'numeric' : undefined)"
          :pattern="props.type === 'number' || props.type === 'tel' ? '[0-9]*' : undefined"
          name="baseInput"
          class="BaseInput--input"
          :maxlength="props.maxlength" />
        <div class="BaseInput--suf">
          <span class="BaseInput--suf-in">
            {{ props.suf }}
            <slot name="custom" class="BaseInput--custom" />
          </span>
        </div>
      </div>
      <div class="validation" v-if="!!txt&&!isValidate">{{ validationMessage }}</div>
    </dd>
  </dl>
</template>

<style scoped>

</style>
