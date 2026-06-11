<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { createGaugeChartDocument } from '@/utils/chartConfig.js'

// Props 정의
const props = defineProps({
  value: Number,
  maxValue: {
    type: Number,
    default: 100,
  },
  status: Number,
  pdfScale: Number,
  right: Boolean,
  width: {
    type: Number,
    default: 3,
  },
  hideScore: Boolean,

});
const myChart = ref(null);
const echart = ref(null);
// Reactive 상태 정의
const color = ref({
  red: "#E95371",
  yellow: "#F8B500",
  green: "#5AB651",
  none: "#D9D9D9",
});
// Methods 정의
const initializeChart = async () => {
  var value = parseInt(props.value);
  let chartColor = color.value.yellow;

  if (props.status == 1) {
    chartColor = color.value.green;
  } else if (props.status == 3) {
    chartColor = color.value.red;
  } else {
    chartColor = color.value.yellow;
  }

  /** score 0 에 대한 처리 */
  if (value == 0) {
    value = props.maxValue;
    chartColor = color.value.none;
  }

  var option = await createGaugeChartDocument(value, chartColor, props.width, props.pdfScale, props.maxValue);
  myChart.value = echarts.init(echart.value);
  myChart.value.setOption(option);
  // window.addEventListener('resize', () => {myChart.value.resize();});

};

// Lifecycle Hook
onMounted(() => {
  initializeChart();
});
</script>
<template>
  <div class="container" :class="{ right: right }">
    <div class="chart"></div>
    <div class="echart" ref="echart"></div>
    <div class="title">
      <h5 v-if="!props.hideScore">
        <div class="score" :class="props.status == 1 ? 'green' : props.status == 3 ? 'red' : 'yellow'">{{ props.value }}
        </div>
        <span>점</span>
      </h5>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.container {
  position: relative;
  margin-bottom: -20px;
  width: 100%;
  height: 100%;
}

.right {
  right: calc(7px * $pdf-scale);
}

.chart {
  width: 100%;
  height: 100%;

  position: absolute;

  .smile {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(37px * $pdf-scale);
    height: calc(37px * $pdf-scale);
  }
}

.title {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  @include flex(center, center);

  h5 {
    @include flex(center, center);
    width: 100%;
    text-align: left;

    & .score {
      letter-spacing: -(calc(20px * $pdf-scale) * 0.05);
      font-weight: $regular;
      font-size: calc(20px * $pdf-scale);
      line-height: 100%;

      &.green {
        color: #5AB651;
      }
      &.red {
        color: #E95371;
      }
      &.yellow {
        color: #F8B500;
      }
    }

    span {
      color: #3E3A39;
      left: calc(55px * $pdf-scale);
      font-weight: $light;
      font-size: calc(8px * $pdf-scale);
      line-height: normal;
      padding-top: calc(12px * $pdf-scale);
      padding-left: calc(0.81px * $pdf-scale);
      padding-bottom: calc(4px * $pdf-scale);
    }
  }
}

.echart {
  width: 100%;
  height: 100%;
}
</style>