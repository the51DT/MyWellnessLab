<script setup>
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";

// Props 정의
const props = defineProps({
  pdfScale: null,
  data: null,
  dataRef: null,
});

// Reactive 상태 정의
const state = reactive({
  existWarn: false,
  bottomDanger: false,
  topDanger: false,
  isReverse: false,
  colorDanger: "#E9537166",
  colorWarning: "#F8B50066",
  colorSafe: "#5AB65166",
  minValue: 0,
  maxValue: 0,
});

const chartRef = ref(null);


// Lifecycle Hook
onMounted(() => {
  let refHCR = null;
  for (let element in props.data[0]) {

    if (element === props.dataRef) {
      refHCR = props.data[0][element]
    }
  }
  const value = [];
  const date = [];
  let needDummy = false;

  if (props.data.length <= 1) {
    needDummy = true;
    date.push("");
  }

  const markArea = getMarkArea(refHCR);

  props.data.forEach((element, index) => {
    const dataVal = Number(parseFloat(element[props.dataRef].data).toFixed(1));

    if(dataVal) {
      if (needDummy) {
        value.push({
          value: Number(parseFloat(element[props.dataRef].data).toFixed(1)),
          itemStyle: { color: "transparent" },
          label: { show: false },
        });
        value.push({
          value: dataVal,
          name: Number(parseFloat(element[props.dataRef].data).toFixed(1)),
        });
        value.push({
          value: dataVal,
          name: Number(parseFloat(element[props.dataRef].data).toFixed(1)),
          itemStyle: { color: "transparent" },
          label: { show: false },
        });
      } else {
        value.push({
          value: dataVal,
          name: Number(parseFloat(element[props.dataRef].data).toFixed(1)),
        });
      }

      date.push(element.check_date + index);
    }
  });

  if (needDummy) {
    date.push("");
  }

  const option = {
    grid: {
      show: true,
      left: "6%",
      right: "14%",
      bottom: "10%",
      top: "12%",
      containLabel: true,
      backgroundColor: "transparent",
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: date,
      name: "날짜",
      nameTextStyle: {
        fontSize: 6 * props.pdfScale,
        color: "#727171",
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 1 * props.pdfScale,
          color: "#9FA0A0",
        },
      },
      axisLabel: {
        color: "#727171",
        margin: 4 * props.pdfScale,
        formatter: (d, index) => {
          if (d === "") return "";
          if (d === undefined) return "";
          if (d === null) return "";
          let str = "";
          if (d === "-") {
            str = d;
          } else {
            d = d.replaceAll("-", "");
            const yyyyMMdd = String(d);
            const sYear = yyyyMMdd.substring(2, 4);
            const sMonth = yyyyMMdd.substring(4, 6);
            const sDate = yyyyMMdd.substring(6, 8);
            str = sYear + ". " + sMonth + ". " + sDate;
          }

          return str;
        },
        fontSize: 5 * props.pdfScale,
        interval: 0,
        rotate: -90,
      },
    },
    yAxis: {
      type: "value",
      show: false,
      min: refHCR.range_min,
      max: refHCR.range_max,
      axisLabel: {
        formatter: (d) => parseInt(d),
        show: true,
        fontSize: 5 * props.pdfScale,
        margin: 4 * props.pdfScale,
        color: "#727171",
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 1 * props.pdfScale,
          color: "#9FA0A0",
        },
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        animation: false,
        name: "",
        type: "bar",
        data: value,
        barWidth: 4 * props.pdfScale,
        itemStyle: {
          color: "#555555",
        },
        label: {
          show: true,
          fontSize: 5 * props.pdfScale,
          color: "#727171",
          position: "top",
          fontWeight: 400,
          formatter: "{b}",
        },
        markArea: markArea,
      },
    ],
  };

  const echart = echarts.init(chartRef.value, null, {
    renderer: "svg",
  });

  echart.setOption(option);
});

const getMarkArea = (refHCR) => {
  let markArea;

  /** Type 에 따라 백그라운드 색상 다르게 설정 */
  switch (refHCR.type) {
    // 아래 정상 ,위 위험
    case "nd":
      markArea = {
        data: [[
          {
            yAxis: refHCR.range_min,
            itemStyle: { color: state.colorSafe },
          },
          {
            yAxis: refHCR.normal_range_max
          }
        ],
        [
          {
            yAxis: refHCR.normal_range_max,
            itemStyle: { color: state.colorDanger },
            name: Number(parseFloat(refHCR.normal_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.range_max
          }
        ]]
      };
      break;
    // 아래 위험, 가운데 정상, 위 위험
    case "dnd":
      markArea = {
        data: [[
          {
            yAxis: 0,
            itemStyle: { color: state.colorDanger },
          },
          {
            yAxis: refHCR.normal_range_min
          }
        ], [
          {
            yAxis: refHCR.normal_range_min,
            itemStyle: { color: state.colorSafe },
            name: Number(parseFloat(refHCR.normal_range_min).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.normal_range_max
          }
        ], [
          {
            yAxis: refHCR.normal_range_max,
            itemStyle: { color: state.colorDanger },
            name: Number(parseFloat(refHCR.normal_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.range_max
          }
        ]]
      };

      break;
    // 담기는 순서부터 아래 정상, 가운데 위험, 위 정상
    case "nwd":
      markArea = {
        data: [[
          {
            yAxis: refHCR.range_min,
            itemStyle: { color: state.colorSafe },
          },
          {
            yAxis: refHCR.normal_range_max
          }
        ], [
          {
            yAxis: refHCR.normal_range_max,
            itemStyle: { color: state.colorWarning },
            name: Number(parseFloat(refHCR.normal_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.warning_range_max
          }
        ], [
          {
            yAxis: refHCR.warning_range_max,
            itemStyle: { color: state.colorDanger },
            name: Number(parseFloat(refHCR.warning_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.range_max
          }
        ]]
      }
      break;

    // 아래 위험, 위 정상
    case "dn":
      markArea = {
        data: [[
          {
            yAxis: refHCR.range_min,
            itemStyle: { color: state.colorDanger },
          },
          {
            yAxis: refHCR.danger_range_max
          }
        ], [
          {
            yAxis: refHCR.danger_range_max,
            itemStyle: { color: state.colorSafe },
            name: Number(parseFloat(refHCR.danger_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.range_max
          }
        ]]
      }

    // 아래 위험, 중간 관리, 위 정상
    case "dwn":
      markArea = {
        data: [[
          {
            yAxis: refHCR.range_min,
            itemStyle: { color: state.colorDanger },
          },
          {
            yAxis: refHCR.danger_range_max
          }
        ], [
          {
            yAxis: refHCR.danger_range_max,
            itemStyle: { color: state.colorWarning },
            name: Number(parseFloat(refHCR.danger_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.normal_range_min
          }
        ], [
          {
            yAxis: refHCR.normal_range_min,
            itemStyle: { color: state.colorSafe },
            name: Number(parseFloat(refHCR.normal_range_min).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          {
            yAxis: refHCR.range_max
          }
        ]]
      }
  }
  return markArea;
};
</script>
<template>
  <div class="chart-wrap">
    <!-- <h3>{{ name }}</h3> -->
    <div class="y-axis stretch-text">
      결과값
    </div>
    <div ref="chartRef" class="chart" />
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.chart-wrap {
  /* margin-top: calc(6.2px * $pdf-scale); */

  position: relative;
  width: 100%;
  height: 100%;

  h3 {
    /* @include flex(center, flex-end); */
    font-size: calc(8.91px * $pdf-scale);
    line-height: calc(11px * $pdf-scale);
  }

  .y-axis {
    position: absolute;
    color: #727171;
    top: calc(5px * $pdf-scale);
    font-size: calc(6px * $pdf-scale);
  }
}

.chart {
  width: 100%;
  height: 100%;
}
</style>