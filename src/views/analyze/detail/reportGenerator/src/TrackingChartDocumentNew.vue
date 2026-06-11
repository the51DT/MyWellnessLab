<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: Object
})

const imageName = computed(() => {
  return props.data.class.replace(' ', '_')
})
</script>

<template>
  <div class="chart-wrap">
    <div class="top">
      <div class="check-box">
        <img v-if="props.data.status === 1" class="check" src="/img/pdf/res/tracking-check.png" />
      </div>
      <div class="name stretch-text">{{ props.data.label }}</div>
    </div>
    <div class="graph">
      <div class="my-point-pointer">
        <div class="pointer" :style="{ left: props.data.average + '%' }" />

        <img
          class="my-point-img"
          src="/img/pdf/res/age-graph-icon.png"
          alt=""
          :style="{ left: props.data.my + '%' }" />
      </div>

      <img :src="`/img/${imageName}.png`" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/pdf/result.scss";
@import "@/assets/css/pdf/document.scss";

.chart-wrap {
  margin-top: 8px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  .top {
    // (flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: calc(8px * $pdf-scale);
    font-weight: bold;
  }
  .check-box {
    position: relative;
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    border: calc(0.5px * $pdf-scale) solid #000;

    margin-right: calc(6px * $pdf-scale);

    .check {
      position: absolute;
      top: calc(-2px * $pdf-scale);
      left: calc(0px * $pdf-scale);
      width: calc(8px * $pdf-scale);
      height: calc(7px * $pdf-scale);
    }
  }
  .graph {
    position: relative;
    margin-top: calc(13.57px * $pdf-scale);
    margin-left: calc(11.9px * $pdf-scale);
    img {
      width: calc(201px * $pdf-scale);
      height: calc(16px * $pdf-scale);
      object-fit: contain;
    }

    .pointer {
      position: absolute;
      transform: translateX(-50%);
      width: calc(5.74px * $pdf-scale);
      height: calc(5.74px * $pdf-scale);
      border-radius: 50%;
      border: calc(0.3px * $pdf-scale) solid #fff;
      background-color: #92539d;
      top: calc(10.5px * $pdf-scale);
    }
  }
}

.my-point-pointer {
  position: absolute;
  left: 0;

  top: calc(-10px * $pdf-scale);
  background-color: transparent;
  width: calc(201px * $pdf-scale);

  z-index: 101;
}
.my-point-img {
  position: absolute;
  width: calc(11.8px * $pdf-scale) !important;
  height: auto;
  transform: translateX(-50%);
  left: 50%;
}
</style>
