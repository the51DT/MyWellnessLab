<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})

onMounted(() => {
  document.body.classList.add('no-scroll')
})

onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <div class="spin-wrap">
    <div class="spin--con">
      <p class="spin--con--title">
        {{ Math.round(props.progress) }}%
      </p>

      <div class="spin--con--bar">
        <div class="spin--con--value" :style="`width: ` + props.progress + `%`" />
      </div>

      <p class="spin--con--txt">
        {{ $t('ReportGeneratorLoading.text1')}}
        <br />
        {{ $t('ReportGeneratorLoading.text2')}}
      </p>
    </div>
  </div>
</template>
