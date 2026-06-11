<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => null
  }
})

const barTypeClass = computed(() => {
  return { [props.value.class]: true }
})

</script>

<template>
  <div v-if="props.value" ref="bar" class="bar--wrap">
    <div class="bar--bg" :class="barTypeClass">
      <div class="divide1" />
      <div class="divide2" />
      <div class="divide3" />
      <!-- 평균 -->
      <div
        v-if="props.value.average !== null"
        class="bar--average"
        style="position: absolute;"
        :style="`left: calc(` + props.value.average + `% - 7.5px);`" />

      <!-- 내 위치 -->
      <img
        v-if="props.value.my > -1"
        src="/img/ico_me.svg"
        class="bar--me"
        :style="`left: calc(` + props.value.my + `% - 9px);`"
        alt="" />
    </div>
  </div>
</template>
