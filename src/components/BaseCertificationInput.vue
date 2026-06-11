<script setup>
/**
 * 폰 번호 인증시 사용되는 인증번호 입력 콤포넌트
 */
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  totalSeconds: Number
})
let timerId = null
const totalSeconds = ref(props.totalSeconds)
const minutes = ref() /* 분 초기값 */
const seconds = ref('00') /* 0초 초기값 */
const instance = getCurrentInstance() /* 어밋 인스턴스 */
const inputCertificationNumber = ref() /* 입력된 인증번호 */
const minStart = ref(false) /* 타이머 보이고 안보이고 변수 */ /* 231129 추가 */
const isFocus = ref(false) /* 240108 인풋 포커스 들어가면 테두리 색상 넣는 변수 */
const isCertificationSuccess = ref(false) /* 인증 성공 상태 */

/**
 * timerStart(val)라는 이름의 함수를 정의합니다. 이 함수의 주된 역할은 브라우저 타이머를 관리하는 것입니다
 * @param val
 */
function timerStart (val) {
  minStart.value = true /* 231129 타이머 보이기 시작 */
  if (val === 'complete') {
    clearInterval(timerId)
    timerId = null
    totalSeconds.value = props.totalSeconds
    isCertificationSuccess.value = true /* 인증 성공 시 상태 업데이트 */
    return
  }
  if (timerId) {
    return
  }
  isCertificationSuccess.value = false /* 새로운 인증 시작 시 상태 초기화 */
  timerId = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--
      minutes.value = Math.floor(totalSeconds.value / 60)
      seconds.value = totalSeconds.value % 60
      if (minutes.value < 10) {
        minutes.value = '0' + minutes.value
      }
      if (seconds.value < 10) {
        seconds.value = '0' + seconds.value
      }
    } else {
      clearInterval(timerId)
      timerId = null
      totalSeconds.value = props.totalSeconds
      isCertificationSuccess.value = false /* 타이머 종료 시 인증 상태 초기화 */
      instance.emit('timerEnd')
    }
  }, 1000)
}

function certificationConfirm () {
  if (isCertificationSuccess.value) {
    return // 이미 인증 성공한 경우 중복 실행 방지
  }
  instance.emit('certificationConfirm', inputCertificationNumber)
}

// 숫자만 입력 허용
function handleInput (e) {
  const value = e.target.value
  inputCertificationNumber.value = value.replace(/[^0-9]/g, '')
}

onMounted(() => {
  // totalSeconds.value를 60으로 나누어 분 (m)을 계산하는 로직, 시계 또는 타이머 같은 기능에서 시간을 표시할 때 사용
  const m = totalSeconds.value / 60
  if (m < 10) {
    minutes.value = '0' + m
  } else {
    minutes.value = m
  }
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
})

defineExpose({ timerStart }) /* 부모가 함수를 호출할 수 있도록 제공 */
</script>

<template>
  <div class="BasePhoneInput" :class="isFocus ? 'active' : ''">
    <!--    <input v-model="inputCertificationNumber" maxlength="6" type="password" name="" id="jpc02" placeholder="전송된 인증번호를 입력해주세요">-->
    <input
      v-model="inputCertificationNumber"
      @focus="isFocus = true"
      @focusout="isFocus = false"
      @input="handleInput"
      maxlength="6"
      type="password"
      inputmode="numeric"
      pattern="[0-9]*"
      name=""
      id="jpc02"
      :placeholder="$t('BaseCertInput.placeholder')" />
    <span v-if="minStart">{{ minutes }}:{{ seconds }}</span>
    <button
      @click="certificationConfirm"
      :disabled="!inputCertificationNumber || isCertificationSuccess"
      type="button"
      class="BasePhoneInput--btn">{{ $t('BaseCertInput.confirmButton')}}</button>
  </div>
</template>

<style scoped>

</style>
