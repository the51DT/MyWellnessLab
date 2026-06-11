<script setup>
/**
 * 값 입력 시 숫자만 입력받는 콤포넌트
 */
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxlength: Number,
  id: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'inputTxt'])

const handleInput = (e) => {
  const value = e.target.value

  emit('update:modelValue', value)
  emit('inputTxt', value)
}

</script>

<template>
  <input
    :value="props.modelValue"
    :type="props.type"
    :maxlength="props.maxlength"
    :placeholder="props.placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :id="props.id"
    @input="handleInput" />
</template>
