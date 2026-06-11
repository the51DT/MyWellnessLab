<script setup>
/**
 * 로딩 스피너 콤포넌트
 */
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { bodyScroll } from '@/assets/js/common'

const props = defineProps({
  progress: Number,
  autoLoadPdf: {
    type: Number,
    default: false
  }
})

const load = computed(() => {
  let val = 0

  if (props.progress !== undefined) {
    val = props.progress
  }

  return val
})

onMounted(() => {
  if (props.autoLoadPdf === -1) {
    return
  }
  bodyScroll(false)
})

onUnmounted(() => {
  bodyScroll(true)
})
</script>

<template>
  <div class="spin-wrap">
    <div class="spin--con">
      <p class="spin--con--title">{{ Math.round(load) }}%</p>
      <div class="spin--con--bar">
        <div class="spin--con--value" :style="`width: ` + load + `%`" /> <!--240108 load 값 개발 요망-->
      </div>
      <p class="spin--con--txt" v-html="$t('Spinner.loading').replace(/\n/g, '<br>')"></p>
    </div>
  </div>
</template>

<style scoped>

</style>
