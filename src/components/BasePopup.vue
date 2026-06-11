<script setup>
/**
 * 가운데 작게 뜨는 기본 레이어팝업 콤포넌트
 */
import { onMounted, onUnmounted } from 'vue'
import { bodyScroll } from '@/assets/js/common'

onMounted(() => {
  bodyScroll(false) /* 240110 팝업 노출 시 body 스크롤 정지 */
})

onUnmounted(() => {
  bodyScroll(true) /* 240110 팝업 삭제 시 body 스크롤 원복 */
})
</script>

<template>
  <div class="popup">
    <div class="popup--wrap">

      <slot name="contents" />
    </div>
  </div>
</template>

<style lang="scss">

</style>
