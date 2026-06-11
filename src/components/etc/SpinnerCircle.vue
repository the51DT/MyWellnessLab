<script setup>
/**
 * 서클 스피너 콤포넌트
 */
import { onMounted, onUnmounted, computed } from 'vue'
import { bodyScroll } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  txt: {
    type: String,
    default: '' // 정적 값만 가능
  }
})

// computed로 번역 처리
const displayText = computed(() => {
  const text = props.txt || t('spinnerCircle.message')
  return text.replace(/\n/g, '<br>')
})

onMounted(() => {
  bodyScroll(false) /* body 스크롤 정지 */
})

onUnmounted(() => {
  bodyScroll(true) /* body 스크롤 원래대로 */
})
</script>

<template>
  <div class="spin-wrap">
    <div class="spin-wrap--con">
      <img src="/img/img_spin.svg" alt="" class="spin-rotate" />
      <p class="spin-wrap--txt" v-html="displayText" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.spin-wrap{
  &--con{
    text-align: center;
  }
  &--txt{
    color: white;
    font-family: "RixSinHead_Medium", sans-serif;
    font-size: 1.4rem;
    margin-top: 1rem;
  }
}
</style>