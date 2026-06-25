<script setup>
import { getCurrentInstance, ref, watch } from 'vue'

const props = defineProps({
  maxlength: Number,
  id: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: { /* 231212 플레이스 홀더 추가 */
    type: String,
    default: ''
  }
})
const inputValue = ref('')
const instance = getCurrentInstance()
const focusTg = ref(false) /* 231129 추가 */
const inputError = ref(false) /* 202606 오류 추가 */

function inputEmit() {
  instance.emit('inputTxt', inputValue.value)
  instance.emit('inputError', inputError.value)
}
function certificationStart() {
  instance.emit('certificationStart')
}

function focusDom(val) { /* 231129 함수 추가 */
  focusTg.value = val
}

watch(
  inputValue, (newValue, oldValue) => {
    if (!/^\d*$/.test(newValue)) {
      inputValue.value = oldValue
      return /* 202606 오류 추가 */
    }

    /* 202606 오류 추가 - 휴대폰 규칙 오류 : 010, 011~019 아닌 경우 오류메시지 노출 */
    if (newValue === '') {
      inputError.value = false
      return
    }

    var regExp = /^01[0-9]\d{3,4}\d{4}$/;
    if (!regExp.test(newValue)) {
      inputError.value = true;
    } else {
      inputError.value = false;
    }
  }
)
</script>

<template>
  <div class="BasePhoneInput" :class="inputError ? 'red' : focusTg ? 'active' :''"> <!--231129 클래스 추가--><!--202606 오류 추가-->
    <input v-model="inputValue" @focus="focusDom(true)" @blur="focusDom(false)" @input="inputEmit" :type="props.type"
      :maxlength="props.maxlength" name="" :id="props.id" :placeholder="props.placeholder" class="BasePhoneInput--input">
    <!--231129 focus, blur 이벤트 추가--> <!--231212 플레이스홀더 추가--> <!--231129 클래스 추가-->
    <button :disabled="!inputValue || inputError" @click="certificationStart" type="button" class="btn--small2 BasePhoneInput--btn">인증
      보내기</button> <!--231129 gray 클래스 삭제--><!--202606 오류 추가-->
  </div>
</template>

<style lang="scss"></style>
