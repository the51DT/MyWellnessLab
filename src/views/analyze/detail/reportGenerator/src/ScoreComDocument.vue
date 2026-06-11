<template>
  <div class="container pdf" :class="{ right: right }">
    <div class="chart" />
    <div class="echart" ref="chart" />
    <div class="title">
      <h5 v-if="!hideScore">{{ value }}<span>점</span></h5>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, computed, onMounted, toRaw } from 'vue'

const props = defineProps({
  value: Number,
  orange: Boolean,
  mean: Number,
  pdfScale: Number,
  right: Boolean,
  width: Number,
  hideScore: Boolean
})

const chart = ref(null)
const widthValue = ref(4)
const color = ref('#008352')

onMounted(() => {
  if (props.width) {
    widthValue.value = props.width
  }
  const myChart = echarts.init(chart.value, null, {
    // renderer: "svg",
  })
  let option

  // 차트 옵션
  option = {
    series: [
      {
        animation: false,
        type: 'gauge',
        // animation: false,
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 100,
        radius: '95%',
        splitNumber: 12,
        itemStyle: {
          color: color.value,
          shadowColor: 'rgba(0,138,255,0)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: {
          show: true,
          roundCap: false,
          width: props.pdfScale * widthValue.value,
          itemStyle: {
            borderWidth: props.pdfScale * widthValue.value,
            borderColor: color.value
          }
        },
        pointer: {
          show: false,
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '75%',
          width: 16,
          offsetCenter: [0, '5%']
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: props.pdfScale * widthValue.value,
            color: [[1, '#EFEFEF']],
            shadowColor: 'red',
            shadowBlur: -100
          }
        },
        axisTick: {
          show: false,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          show: false,
          length: 12,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 30,
          color: '#999',
          fontSize: 20
        },
        title: {
          show: false
        },
        label: { show: false },
        detail: {
          show: false,
          backgroundColor: '#fff',
          borderColor: '#999',
          borderWidth: 2,
          width: '60%',
          lineHeight: 40,
          height: 40,
          borderRadius: 8,
          offsetCenter: [0, '35%'],
          valueAnimation: true,
          formatter: function (value) {
            return '{value|' + value.toFixed(0) + '}{unit|km/h}'
          },
          rich: {
            value: {
              fontSize: 50,
              fontWeight: 'bolder',
              color: '#777'
            },
            unit: {
              fontSize: 20,
              color: '#999',
              padding: [0, 0, -20, 10]
            }
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

  myChart.setOption(option)
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
.container {
  position: relative;
  margin-bottom: -20px;
  /* position: absolute; */
  /* width: calc(85.26px * $pdf-scale);
  height: calc(85.26px * $pdf-scale); */
  width: 100%;
  height: 100%;
  min-height: auto;//ADD
  /* right: calc(20px * $pdf-scale);
  top: calc(16.52px * $pdf-scale); */
}

.right {
  right: calc(7px * $pdf-scale);
}
.chart {
  width: 100%;
  height: 100%;
  // margin: 0 ;

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
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  h5 {
    /* @include flex(center, flex-end); */
    /* position: absolute; */

    /* top: 50%; */
    /* margin-top: 20px; */
    width: 100%;
    /* height: 100%; */
    /* transform: translateY(50%); */
    font-weight: 500;
    font-size: calc(23px * $pdf-scale);
    line-height: normal;

    /* identical to box height */
    display: flex;
    /* height: 100%; */
    align-items: flex-end;
    justify-content: center;

    text-align: left;

    color: #008352;
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
  /* width: 100px;
  height: 100px; */
}

.stretch-page2 {
  .title {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    h5 {
      /* @include flex(center, flex-end); */
      /* position: absolute; */

      /* top: 50%; */
      /* margin-top: 20px; */
      width: 100%;
      /* height: 100%; */
      /* transform: translateY(50%); */
      font-weight: 500;
      font-family: "Pretendard";
      /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
      font-size: calc(23px * $pdf-scale);
      line-height: normal;

      /* identical to box height */
      display: flex;
      /* height: 100%; */
      align-items: flex-end;
      justify-content: center;

      text-align: left;

      color: #008352;
      span {
        left: calc(55px * $pdf-scale);
        font-weight: 500;
        font-size: calc(10px * $pdf-scale);
        line-height: normal;
        padding-bottom: calc(4px * $pdf-scale);
      }
    }
  }
}
</style>
