<template>
  <div class="chart-wrap">
    <div class="gauge-chart" ref="chart" />
    <div class="vertical-line" />
    <div class="text stretch-text">{{ props.value }}<span>배속</span></div>
    <div class="max stretch-text">2.50</div>
    <div class="min stretch-text">0.50</div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'

import { ref, computed, onMounted, toRaw } from 'vue'

const props = defineProps({
  pdfScale: null,
  value: null
})

const chart = ref(null)

/**
 * 마운트시 차트 생성
 */
onMounted(() => {
  const option = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        animation: false,
        name: 'Pressure',
        type: 'gauge',
        radius: '100%',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 2,
        itemStyle: {
          color: '#008352'
        },
        splitNumber: 0,
        splitLine: {
          show: false
        },

        axisTick: {
          splitNumber: 1,
          length: 124.5
        },
        pointer: {
          icon: 'triangle',
          length: '110%',
          width: 30,
          showAbobe: true,
          itemStyle: {
            color: '#000'
          }
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 30,
          itemStyle: {
            borderWidth: 0,
            color: '#000'
          }
        },
        axisLabel: { show: false },
        detail: { show: false },
        axisLine: {
          lineStyle: {
            width: 40,
            color: [[1, '#008352']]
          }
        },
        data: [
          {
            value: props.value
          }
        ]
      }
    ]
  }
  const echart = echarts.init(chart.value, null, {
    renderer: 'svg'
  })
  echart.setOption(option)
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.chart-wrap {
  position: absolute;
  /* right: calc(7px * $pdf-scale);
  top: calc(88.74px * $pdf-scale); */
  left: calc(35px * $pdf-scale);
  /* bottom: calc(33px * $pdf-scale); */
  bottom: calc(53px * $pdf-scale);
}
.gauge-chart {
  height: calc(130px * $pdf-scale);
  width: calc(130px * $pdf-scale);
}

.vertical-line {
  position: absolute;
  z-index: -1;
  top: calc(10px * $pdf-scale);
  right: calc(65px * $pdf-scale);
  height: calc(40px * $pdf-scale);
  width: calc(0.2px * $pdf-scale);
  background-color: #c9caca;
}

.text {
  position: absolute;
  width: 100%;
  bottom: calc(-10px * $pdf-scale);
  text-align: center;
  color: #3e3a39;
  font-size: calc(43px * $pdf-scale);
  font-family: "MarkPro";
  font-weight: 400;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  span {
    font-size: calc(12px * $pdf-scale);
    padding-bottom: calc(10px * $pdf-scale);
  }
}
.max {
  position: absolute;
  color: #000;
  bottom: calc(32px * $pdf-scale) !important;
  right: 0 !important;

  text-align: right !important;
  font-family: Pretendard !important;
  font-size: calc(8px * $pdf-scale) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
}
.min {
  position: absolute;
  color: #000 !important;
  bottom: calc(32px * $pdf-scale) !important;

  text-align: right !important;
  font-family: Pretendard !important;
  font-size: calc(8px * $pdf-scale) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
}
</style>
