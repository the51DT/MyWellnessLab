<script setup>
/**
 * 로그인 시 필요한 핀번호를 입력받는 콤포넌트, 4개의 핀번호 각각에 입력되면 다음 input으로 자동 focus이동
 */
import { onMounted, ref } from 'vue'

const props = defineProps({
  autoFocus: {
    type: Boolean,
    default: true
  },
  disabled: Boolean,
  autoCheck: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['inputTxt', 'checkEnter'])

const pin = ref(['', '', '', ''])

const input1 = ref(null)
const input2 = ref(null)
const input3 = ref(null)
const input4 = ref(null)

const handleInput = (e, index) => {
  let value = e.target.value

  if (!value) {
    return
  }

  // 숫자만 허용
  value = value.replace(/[^0-9]/g, '')
  
  if (!value) {
    e.target.value = ''
    pin.value[index] = ''
    return
  }

  if (value.length > 1) {
    value = value[value.length - 1]
  }
  
  e.target.value = value

  emit('inputTxt', {
    tg: `p${index + 1}`,
    val: value
  })

  switch (index) {
    case 0:
      pin.value[0] = value
      input2.value.focus()
      break
    case 1:
      pin.value[1] = value
      input3.value.focus()
      break
    case 2:
      pin.value[2] = value
      input4.value.focus()
      break
    case 3:
      pin.value[3] = value
      break
  }

  if (pin.value.every((item) => item) && props.autoCheck) {
    emit('checkEnter')
  }
}

const handleDelete = (index) => {
  emit('inputTxt', {
    tg: `p${index + 1}`,
    val: ''
  })

  switch (index) {
    case 0:
      pin.value[0] = ''
      break
    case 1:
      pin.value[1] = ''
      input1.value.focus()
      break
    case 2:
      pin.value[2] = ''
      input2.value.focus()
      break
    case 3:
      pin.value[3] = ''
      input3.value.focus()
      break
  }
}

const focus = () => {
  if (input1.value) {
    input1.value.focus()
  }
}

const reset = () => { /* 틀렸을 경우 입력값 날리기 */
  pin.value = ['', '', '', '']

  focus()
}

const blur = () => {
  if (input4.value) {
    input4.value.blur()
  }
}

defineExpose({
  focus,
  reset,
  blur
})

onMounted(() => {
  if (props.autoFocus) {
    focus()
  }
})
</script>

<template>
  <div class="align--between ea4">
    <div class="pin--wrap" :class="pin[0] ? 'input' : ''">
      <input
        ref="input1"
        :value="pin[0]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="txt--center pinI"
        :class="pin[0] ? 'input' : ''"
        autocomplete="off"
        :disabled="disabled"
        @input="(e) => handleInput(e, 0)"
        @keyup.delete="handleDelete(0)" />
    </div>
    <div class="pin--wrap" :class="pin[1] ? 'input' : ''">
      <input
        ref="input2"
        :value="pin[1]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="txt--center pinI"
        :class="pin[1] ? 'input' : ''"
        autocomplete="off"
        :disabled="disabled"
        @input="(e) => handleInput(e, 1)"
        @keyup.delete="handleDelete(1)" />
    </div>
    <div class="pin--wrap" :class="pin[2] ? 'input' : ''">
      <input
        ref="input3"
        :value="pin[2]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="txt--center pinI"
        :class="pin[2] ? 'input' : ''"
        autocomplete="off"
        :disabled="disabled"
        @input="(e) => handleInput(e, 2)"
        @keyup.delete="handleDelete(2)" />
    </div>
    <div class="pin--wrap" :class="pin[3] ? 'input' : ''">
      <input
        ref="input4"
        :value="pin[3]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]"
        maxlength="1"
        class="txt--center pinI"
        :class="pin[3] ? 'input' : ''"
        autocomplete="off"
        :disabled="disabled"
        @input="(e) => handleInput(e, 3)"
        @keyup.delete="handleDelete(3)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pinI{
  -webkit-text-security: disc;
}
</style>
