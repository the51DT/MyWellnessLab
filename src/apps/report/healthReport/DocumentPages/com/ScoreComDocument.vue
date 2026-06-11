
<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import {createGaugeChartDocument} from '@/utils/chartConfig.js'

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
  red: "#C53135",
  yellow: "#DF9D00",
  green: "#008452",
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
  myChart.value.setOption(option );
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
      <h5 v-if="!props.hideScore" :class="props.status == 1 ? 'green' : props.status == 3 ? 'red' : 'yellow'">
        <div class="score">{{ props.value }}</div>
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
    width: 100%;
    font-weight: 500;
    font-size: calc(23px * $pdf-scale);
    line-height: normal;

    @include flex(center, baseline);

    text-align: left;

    &.green {
      color : #008452
    }

    &.red {
      color : #C53135;
    }

    &.yellow {
      color : #DF9D00;
    }
    
    span {
      left: calc(55px * $pdf-scale);
      font-weight: 500;
      font-size: calc(10px * $pdf-scale);
      line-height: normal;
      padding-bottom: calc(4px * $pdf-scale);
    }
  }
}
.echart {
  width: 100%;
  height: 100%;
}

</style>