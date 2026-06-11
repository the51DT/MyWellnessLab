<script setup>
import { computed } from 'vue';

// Props 정의
const props = defineProps({
  pdfScale: null,
  data: null,
});

const imageSrc = () => {
  return new URL(`/src/assets/images/pdf/res/tracking/tracking-${props.data.imgSrc}.png`, import.meta.url).href
}

const getData = () => {
  let data = props.data.data
  if (data < props.data.range_min) {
    data = props.data.range_min
  }
  if (data > props.data.range_max) {
    data = props.data.range_max
  }

  return data
};

const getPos = () => {
  let dataValue = getData()

  if (props.data.range_min == dataValue) {
    return 0 + "%"
  } else if (props.data.range_max == dataValue) {
    return 100 + "%"
  } else {

    let pos

    const status = props.data.status

    switch (status) {
      case 1:
        pos = calculateNormal(dataValue)
        break
      case 2:
        pos = calculateWarn(dataValue)
        break
      case 3:
        pos = calculateDanger(dataValue)
        break
    }

    if (pos < 0) pos = 0
    if (pos > 100) pos = 100

    return pos + "%"
  }
};
// 화면상에 그래프에 표시하려는 위치 값
// ratio 는 그래프 이미지 0~1 비율의 위치값이다.
// normal 에서 nwd 는 구간 A-B(0.5 비율), B-C(0.85) 비율) 로 화면에 그려진다.
// 나머지 구간들도 마찬가지다. 
const calculateNormal = (value) => {
  let rate

  switch (props.data.type) {
    case 'nwd':
      var percentInC = (value - props.data.normal_range_min) / (props.data.normal_range_max - props.data.normal_range_min);
      rate = percentInC * (1 - props.data.warning_range_ratio); // normal ~ warning 구간에 대한 시각적 범위로 인해 곱함
      break;
    case 'dwn':
      var percentInC = (value - props.data.normal_range_min) / (props.data.normal_range_max - props.data.normal_range_min);
      rate = props.data.normal_range_ratio + percentInC * (1 - props.data.normal_range_ratio); // normal 구간에 대한 시각적 범위로 인해 곱함
      break;
    case 'dnd':
      var percentInC = (value - props.data.normal_range_min) / (props.data.normal_range_max - props.data.normal_range_min);
      rate = props.data.normal_range_ratio + percentInC * (props.data.danger_2_range_ratio - props.data.normal_range_ratio); // normal ~ danger 구간에 대한 시각적 범위로 인해
      break;
    case 'nd':
      var percentInc = (value - props.data.normal_range_min) / (props.data.normal_range_max - props.data.normal_range_min);
      rate = percentInc * (1 - props.data.danger_range_ratio); // normal 구간에 대한 시각적 범위로 인해 곱함
      break;
    case 'dn':
      var percentInc = (value - props.data.normal_range_min) / (props.data.normal_range_max - props.data.normal_range_min);
      rate = props.data.normal_range_ratio + percentInc * (1 - props.data.normal_range_ratio); // normal 구간에 대한 시각적 범위로 인해 곱함
      break;
    default:
      rate = (((value - props.data.normal_range_min) / (props.data.normal_range_max - props.data.normal_range_min)) + props.data.normal_range_ratio) * 10
      break;
  }

  return rate * 100;
};

const calculateWarn = (value) => {
  let rate
  switch (props.data.type) {
    case 'nwd':
      var percentInC = (value - props.data.warning_range_min) / (props.data.warning_range_max - props.data.warning_range_min);
      rate = props.data.warning_range_ratio + percentInC * (props.data.danger_range_ratio - props.data.warning_range_ratio);

      break;
    case 'dwn':
      var percentInC = (value - props.data.warning_range_min) / (props.data.warning_range_max - props.data.warning_range_min);
      rate = props.data.warning_range_ratio + percentInC * (props.data.normal_range_ratio - props.data.warning_range_ratio);
      break;
    case 'dnd':
      rate = 0;
      break;
    case 'nd':
      rate = 0; // normal 구간에 대한 시각적 범위로 인해 곱함
      break;
    case 'dn':
      rate = 0;
      break;
    default:
      var percentInC = (value - props.data.warning_range_min) / (props.data.warning_range_max - props.data.warning_range_min);
      rate = props.data.warning_range_ratio + percentInC * (props.data.danger_range_ratio - props.data.warning_range_ratio);

      break;
  }
  return rate * 100;

};

const calculateDanger = (value) => {
  let rate
  switch (props.data.type) {
    case 'nwd':
      var percentInC = (value - props.data.danger_range_min) / (props.data.danger_range_max - props.data.danger_range_min);
      rate = props.data.danger_range_ratio + percentInC * (1 - props.data.danger_range_ratio);

      break;
    case 'dwn':
      var percentInC = (value - props.data.danger_range_min) / (props.data.danger_range_max - props.data.danger_range_min);
      rate = percentInC * (props.data.normal_range_ratio - props.data.warning_range_ratio);
      break;
    case 'dnd':
      if (value >= props.data.danger_1_range_min && value <= props.data.danger_1_range_max) {
        var percentInC = (value - props.data.danger_1_range_min) / (props.data.danger_1_range_max - props.data.danger_1_range_min);
        rate = percentInC * props.data.normal_range_ratio;

      } else if (value > props.data.danger_range_max) {
        var percentInC = (value - props.data.danger_1_range_min) / (props.data.danger_1_range_max - props.data.danger_1_range_min);
        rate = percentInC * props.data.normal_range_ratio;
      } else {
        var percentInC = (value - props.data.danger_1_range_min) / (props.data.danger_1_range_max - props.data.danger_1_range_min);
        rate = percentInC * props.data.normal_range_ratio;
      }
      break;
    case 'nd':
      var percentInc = (value - props.data.danger_range_min) / (props.data.danger_range_max - props.data.danger_range_min);
      rate = props.data.danger_range_ratio + percentInc * (1 - props.data.danger_range_ratio);
      break;
    case 'dn':
      var percentInc = (value - props.data.danger_range_min) / (props.data.danger_range_max - props.data.danger_range_min);
      rate =  percentInc * (1 - props.data.normal_range_ratio);
      break;
    default:
      var percentInC = (value - props.data.danger_range_min) / (props.data.danger_range_max - props.data.danger_range_min);
      rate = props.data.danger_range_ratio + percentInC * (1 - props.data.danger_range_ratio);

      break;
  }
  return rate * 100;
};

// 24.09.03 --> TC, LDL , HDL, TG 의 경우 data 가 0 이면 나의위치 표시안함
const checkValidMyPoint = computed(() => {
  if (props.data.key === "TC" || props.data.key === "LDL" || props.data.key === "HDL" || props.data.key === "TG") {
    return props.data.data !== 0;
  }
  return true;
});

</script>

<template>
  <div class="chart-wrap">

    <div class="graph">
      <div class="my-point-pointer">
        <img v-if="checkValidMyPoint" class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" :style="{ left: getPos() }" />
      </div>
      <!-- 그래프 그라데이션 이미지 -->
      <img :src="imageSrc()" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.chart-wrap {
  // margin-top: 8px;
  // margin-bottom: 20px;
  position: relative;
  overflow: visible;
  width: 100%;
  height: 100%;

  .graph {
    position: relative;
    margin-top: calc(11px * $pdf-scale);
    margin-left: calc(11.9px * $pdf-scale);

    img {
      width: calc(201px * $pdf-scale);
      height: calc(16px * $pdf-scale);
      object-fit: contain;
    }

    .pointer {
      position: absolute;
      transform: translateX(-50%);
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      /* border-radius: 50%; */
      /* border: calc(0.3px * $pdf-scale) solid #fff; */
      background-color: #92539d;
      top: calc(9.5px * $pdf-scale);

      background: url("~@/assets/images/pointer.png") center center;
      background-size: contain;
    }
  }
}

.my-point-pointer {
  position: absolute;
  left: 0;

  top: calc(-5px * $pdf-scale);
  background-color: transparent;
  width: calc(201px * $pdf-scale);

  z-index: 101;
}

.my-point-img {
  position: absolute;
  width: calc(11.8px * $pdf-scale) !important;
  height: auto;
  transform: translate(-50%, -20%);
  left: 50%;
}
</style>
