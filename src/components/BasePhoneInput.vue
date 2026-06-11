<script setup>
/**
 * 폰 번호를 받아 인증 번호를 보내는 입력 그룹 콤포넌트
 */
import { getCurrentInstance, ref, watch } from 'vue'

const props = defineProps({
  maxlength: Number,
  id: String,
  type: {
    type: String,
    default: 'text'
  }
})
const inputValue = ref('')
const instance = getCurrentInstance()
const isFocus = ref(false) /* 240108 인풋에 포커스가 들어가면 색상을 바꿔주기위한 변수 */

function inputEmit () {
  instance.emit('inputTxt', inputValue.value)
}
function certificationStart () {
  instance.emit('certificationStart')
}

watch(
  inputValue, (newValue, oldValue) => {
    if (!/^\d*$/.test(newValue)) {
      inputValue.value = oldValue
    }
  }
)
</script>

<template>
  <div class="BasePhoneInput" :class="isFocus ? 'active' : ''">
    <input
      v-model="inputValue"
      @input="inputEmit"
      @focus="isFocus = true"
      @focusout="isFocus = false"
      :type="props.type"
      inputmode="numeric"
      pattern="[0-9]*"
      :maxlength="props.maxlength"
      name=""
      :id="props.id"
      :placeholder="$t('BodyCompositionPop.text36')"
      class="BasePhoneInput--input" />
    <button
      :disabled="inputValue === ''"
      @click="certificationStart"
      type="button"
      class="BasePhoneInput--btn">{{ $t('BasePhoneInput.sendButton')}}</button>
  </div>
</template>

<style lang="scss"></style>
