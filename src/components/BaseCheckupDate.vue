<script setup>
/**
 * 직접 입력 또는 일회성 웰니스 분석 날짜를 표시하는 콤포넌트
 */
import { computed } from 'vue'

const props = defineProps({
  checkDate: String
})

// 날짜를 .형태로 표현
const date = computed(() => {
  let date = ''
  if (props.checkDate) {
    date = props.checkDate.replace(/\-/gi, '.')
  }
  return date
})

</script>

<template>
  <div class="BaseCheckupDate">
    {{ $t('BaseCheckupDate.label') }}: {{ date }}
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>
