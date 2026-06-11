<script setup>
/**
 * 폰 인증 시 3분 타이머 콤포넌트
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

/**
 * 매개변수 val을 받아, 이 값이 "complete"인 경우 타이머를 중지하고
 * Interval을 설정하는 로직이 포함
 * @param val
 */
function timerStart (val) {
  if (val === 'complete') {
    clearInterval(timerId)
    timerId = null
    totalSeconds.value = props.totalSeconds
    return
  }
  if (timerId) {
    return
  }
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
      instance.emit('timerEnd')
    }
  }, 1000)
}

onMounted(() => {
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
  <span>{{ minutes }}:{{ seconds }}</span>
</template>

<style scoped>

</style>
