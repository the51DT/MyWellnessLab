<script setup>
import { computed } from 'vue'

const props = defineProps({
  save: {
    type: Boolean,
    default: false
  },
  page: {
    type: Number,
    default: -1
  }
})

const INDICATOR_PAGES = [2, 3, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

const needPageIndicator = computed(() => {
  return INDICATOR_PAGES.includes(props.page)
})

const getPageBackgroundColorClass = computed(() => {
  switch (props.page) {
    case 9:
    case 10:
    case 11:
    case 14:
    case 15:
      return 'color'
    case 23:
      return 'color2'
    case 22:
    case 25:
    case 26:
      return 'color3'
    default:
      return ''
  }
})

const isP3Class = computed(() => {
  return props.page === 4 || props.page === 5
})

</script>

<template>
  <div class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <div v-if="needPageIndicator" class="page-indicator" :class="[getPageBackgroundColorClass, {p3: isP3Class}]">
        <b class="stretch-text" :style="{ 'margin-top': props.page === 27 ? '8px' : '0px' }">
          {{ props.page < 11 ? "0" + props.page : props.page }}
        </b>
      </div>
      <img :src="`/img/pdf/page${props.page}.png`" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";
.page-inside {
  position: relative;
  text-align: left;
  letter-spacing: 1px;
  padding: 0;
}

.color {
  background-color: #f3f9f5;
}
.color2 {
  background-color: #dff0e2;
}
.color3 {
  background-color: #e7f3e7;
}

.p3 {
  top: calc(53px * $pdf-scale);
}
b {
  display: inline-block;
}
</style>
