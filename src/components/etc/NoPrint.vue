<script setup>
/**
 * 분석결과 pdf에서 인쇄되지 않는 페이지를 안내하는 콤포넌트
 */
import { bodyScroll } from '@/assets/js/common'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  bodyScroll(false)
})

onUnmounted(() => {
  bodyScroll(true)
})
</script>

<template>
  <div class="spin-wrap">
    <div class="spin--con">
      <p class="spin--con--txt" v-html="$t('noPrint.message').replace(/\n/g, '<br>')"></p>
    </div>
  </div>
</template>

<style scoped>
.spin--con--txt{
  letter-spacing: 0;
  margin-top: 0;
}
.spin--con{
  width: max-content;
}
</style>
