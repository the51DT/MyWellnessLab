<template>
  <div class="chart-wrap">
    <div class="gauge-chart" ref="chart"></div>
    <div class="vertical-line"></div>
    <div class="text stretch-text">{{ value }}<span>배속</span></div>
    <div class="max stretch-text">1.5</div>
    <div class="min stretch-text">0.5</div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "GuageChart",
  components: {},
  props: {
    pdfScale: null,
    value: null,
  },
  data() {},
  async mounted() {

    var value = this.value <= 1.5 ? this.value : 1.5;

    const option = {
      animation: false,
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%",
      },
      series: [
        {
          name: "Pressure",
          type: "gauge",
          radius: "100%",
          startAngle: 180,
          endAngle: 0,
          min: 0.5,
          max: 1.5,
          itemStyle: {
            color: "#008352",
          },
          pointer: {
            icon: "triangle",
            length: "110%",
            width: 30,
            itemStyle: {
              color: "#000",
            },
          },
          anchor: {
            show: true,
            size: 30,
            itemStyle: {
              color: "#000",
            },
          },
          axisTick: {
            show: false,
            length: 124.5,
          },
          axisLabel: { show: false },
            detail: { show: false },
            splitLine: {
            show: false,
          },
          axisLine: {
            z: 0,
            lineStyle: {
              width: 40,
              color: [
                [0, "transparent"],    // 0 ~ 0.9: 투명
                [0.6, "transparent"],  // 0.9까지 투명 유지
                [0.6, "transparent"],  // 0.9에서 투명으로 전환
                [0.73, "transparent"], // 0.9 ~ 1.1: 투명
                [0.73, "transparent"], // 1.1에서 투명으로 전환
                [1, "transparent"]     // 1.1 이상: 투명
              ],
            },
          },
          data: [
            {
              value: value,
            },
          ],
        },
      ],
    };
    const echart = echarts.init(this.$refs.chart, null, {
      renderer: "svg",
    });
    echart.setOption(option);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.chart-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-48%, -60%);
}
.gauge-chart {
  height: calc(130px * $pdf-scale);
  width: calc(130px * $pdf-scale);
  background-image: url('/img/bg_agingspeed_home.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center -10px;
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
  color: #008452;
  font-size: calc(40px * $pdf-scale);
  // font-family: "MarkPro";
  font-weight: 400;
  @include flex(center, baseline);

  span {
    color: #4C4C4C;
    font-size: calc(12px * $pdf-scale);
    font-weight: 400;
    padding-bottom: calc(10px * $pdf-scale);
  }
}
.max {
  position: absolute;
  color: #000;
  bottom: calc(50px * $pdf-scale) !important;
  right: 0 !important;

  text-align: right !important;
  font-size: calc(8px * $pdf-scale) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
}
.min {
  position: absolute;
  color: #000 !important;
  bottom: calc(50px * $pdf-scale) !important;

  text-align: right !important;
  font-size: calc(8px * $pdf-scale) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
}
</style>
