<template>
  <div class="chart-wrap">
    <div class="gauge-chart" ref="chart" />
    <div class="vertical-line" />
    <div class="text stretch-text">{{ value }}<span>배속</span></div>
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
            width: 20,
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
  right: calc(7px * $pdf-scale);
  top: calc(59px * $pdf-scale);
}
.gauge-chart {
  height: calc(80px * $pdf-scale);
  width: calc(83.5px * $pdf-scale);
}

.vertical-line {
  position: absolute;
  z-index: -1;
  top: calc(10px * $pdf-scale);
  right: calc(42px * $pdf-scale);
  height: calc(40px * $pdf-scale);
  width: calc(0.2px * $pdf-scale);
  background-color: #c9caca;
}

.text {
  position: absolute;
  width: 100%;
  bottom: calc(-2px * $pdf-scale);
  text-align: center;
  color: #008352;
  font-size: calc(25px * $pdf-scale);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  span {
    font-size: calc(8px * $pdf-scale);
    padding-bottom: calc(4px * $pdf-scale);
  }
}

.stretch-page2 {
  .text {
    position: absolute;
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */

    width: 100%;
    bottom: 0;
    text-align: center;
    color: #008352;
    font-size: calc(25px * $pdf-scale);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    span {
      font-size: calc(8px * $pdf-scale);
      padding-bottom: calc(4px * $pdf-scale);
    }
  }
}

.max {
  position: absolute;
  color: #000;
  bottom: calc(18px * $pdf-scale) !important;
  right: calc(-2px * $pdf-scale) !important;

  text-align: right !important;
  font-family: Pretendard !important;
  font-size: calc(6px * $pdf-scale) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
}
.min {
  position: absolute;
  color: #000 !important;
  bottom: calc(18px * $pdf-scale) !important;
  left: calc(-2px * $pdf-scale) !important;

  text-align: right !important;
  font-family: Pretendard !important;
  font-size: calc(6px * $pdf-scale) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
}
</style>
