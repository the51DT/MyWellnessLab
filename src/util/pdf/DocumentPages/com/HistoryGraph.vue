<template>
  <div class="chart-wrap">
    <!-- <h3>{{ name }}</h3> -->
    <div class="y-axis stretch-text">결과값</div>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  pdfScale: null,
  name: null,
  data: null,
  comph: null,
  var: null,
  varRef: null,
  refData: null,
});

const chart = ref(null);

const existWarn = ref(false);
const bottomDanger = ref(false);
const topDanger = ref(false);
const isReverse = ref(false);

const colorDanger = ref("#E9537166");
const colorWarning = ref("#F8B50066");
const colorSafe = ref("#5AB65166");

const minValue = ref(0);
const maxValue = ref(0);

function getMarkArea(refHCR) {
  let markArea = { itemStyle: { color: "red" }, data: [] };
  //console.log("========================================");
  //console.log("refHCR", refHCR);
  //console.log("danger_range_min", refHCR.danger_range_min);

  if(props.varRef == 'BMI' || props.varRef == 'CREA') {
    console.log('@@@ 체크', props.varRef);
    console.log("refHCR", refHCR);
  }

  //안전구역이 중간에 있을경우. normal_range_min,max값 위치에 위험막대 표시. 주의표시는 없다
  if (
    (refHCR.danger_range_min === refHCR.danger_range_max ||
      refHCR.normal_range_min === refHCR.danger_range_min) &&
    refHCR.normal_range_min !== 0
  ) {
    if(props.varRef == 'BMI' || props.varRef == 'CREA') 
    console.log("normal");
    existWarn.value = false;
    bottomDanger.value = true;
    topDanger.value = true;

    minValue.value =
      refHCR.normal_range_min -
      (refHCR.normal_range_max - refHCR.normal_range_min);

    maxValue.value =
      refHCR.normal_range_max +
      (refHCR.normal_range_max - refHCR.normal_range_min);

    // 아래쪽 위험
    markArea.data.push([
      {
        coord: [0, refHCR.range_min],
        itemStyle: { color: colorDanger.value },
        name: Number(parseFloat(refHCR.normal_range_min).toFixed(1)),
        label: {
          show: true,
          fontSize: 6 * props.pdfScale,
          position: ["-5%", "0%"],
          align: "right",
          verticalAlign: "center",
        },
      },
      { coord: [100, refHCR.normal_range_min] },
    ]);
    // 위쪽 위험
    markArea.data.push([
      {
        coord: [0, refHCR.normal_range_max],
        itemStyle: { color: colorDanger.value },
        name: Number(parseFloat(refHCR.normal_range_max).toFixed(1)),
        label: {
          show: true,
          fontSize: 6 * props.pdfScale,
          position: ["-5%", "100%"],
          align: "right",
          verticalAlign: "center",
        },
      },
      { coord: [100, refHCR.range_max] },
    ]);
  }
  //주의 표시가 없고 위험만 존재
  else if (refHCR.warning_range_min === refHCR.warning_range_max) {
    if(props.varRef == 'BMI' || props.varRef == 'CREA') 
    console.log("no warning");
    if (refHCR.danger_range_min < refHCR.normal_range_min) {
      if(props.varRef == 'BMI' || props.varRef == 'CREA') 
      console.log("reverse");
      bottomDanger.value = true;
      isReverse.value = true;
      markArea.data.push([
        {
          coord: [0, refHCR.danger_range_min],
          itemStyle: {
            color: colorDanger.value,
          },
          name: Number(parseFloat(refHCR.normal_range_min).toFixed(1)),
          label: {
            show: true,
            fontSize: 6 * props.pdfScale,
            position: ["-10%", "0%"],
            verticalAlign: "center",
          },
        },
        { coord: [100, refHCR.danger_range_max] },
      ]);
      minValue.value =
        refHCR.danger_range_min -
        (refHCR.danger_range_max - refHCR.danger_range_min);

      maxValue.value = refHCR.range_max;
    } else if (refHCR.danger_range_min === refHCR.danger_range_max) {
      //console.log("no danger");
    } else {
      if(props.varRef == 'BMI' || props.varRef == 'CREA') 
      console.log("topDanger");
      topDanger.value = true;
      markArea.data.push([
        {
          coord: [0, refHCR.danger_range_min],
          itemStyle: { color: colorDanger.value },
          name: Number(parseFloat(refHCR.danger_range_min).toFixed(0)),
          label: {
            show: true,
            fontSize: 6 * props.pdfScale,
            position: ["-15%", "105%"],
            verticalAlign: "center",
          },
        },
        { coord: [100, refHCR.danger_range_max] },
      ]);
    }
    existWarn.value = false;

    minValue.value = refHCR.range_min;

    maxValue.value =
      refHCR.normal_range_max +
      (refHCR.normal_range_max - refHCR.normal_range_min);
  }
  //주의 위험 모두 존재
  else {
    if(props.varRef == 'BMI' || props.varRef == 'CREA') 
    console.log('bothDanger');
    existWarn.value = true;
    markArea.data.push([
      {
        coord: [0, refHCR.danger_range_min],
        itemStyle: { color: colorDanger.value },
        name: parseInt(refHCR.danger_range_min),
        label: {
          show: true,
          fontSize: 6 * props.pdfScale,
          position: ["-5%", "95%"],
          align: "right",
          verticalAlign: "center",
        },
      },
      { coord: [100, refHCR.danger_range_max] },
    ]);
    markArea.data.push([
      {
        coord: [0, refHCR.warning_range_min],
        itemStyle: { color: colorWarning.value },
        name: Number(parseFloat(refHCR.warning_range_min).toFixed(1)),
        label: {
          show: true,
          fontSize: 6 * props.pdfScale,
          position: ["-5%", "105%"],
          align: "right",
          verticalAlign: "center",
        },
      },
      { coord: [100, refHCR.warning_range_max] },
    ]);
    //정방향
    if (props.refData.warning_range_max < props.refData.danger_range_max) {
      //console.log("use normal");
      topDanger.value = true;
    }
    //역방향
    else {
      //console.log("use reverse");
      isReverse.value = true;
      bottomDanger.value = true;
    }

    minValue.value =
      refHCR.warning_range_min -
      (refHCR.warning_range_max - refHCR.warning_range_min);

    maxValue.value =
      refHCR.warning_range_max +
      (refHCR.warning_range_max - refHCR.warning_range_min);
  }

  minValue.value -= 20;

  if (minValue.value < refHCR.range_min) minValue.value = refHCR.range_min;

  if (maxValue.value > refHCR.range_max) maxValue.value = refHCR.range_max;
  {
    markArea.data.push([
      {
        coord: [0, refHCR.normal_range_min],
        // coord: [0, refHCR.range_min],
        itemStyle: { color: colorSafe.value },
      },
      { coord: [100, refHCR.normal_range_max] },
    ]);
  }

  return markArea;
}

onMounted(() => {
  let refHCR = null;
  
  props.refData.forEach((element) => {
    if (element.variable === props.varRef) refHCR = element;
  });

  if(props.varRef == 'BMI' || props.varRef == 'CREA') {
    console.log('@@@ 체크시작', props.varRef);
  }

  let value = [];

  let date = [];

  let min = 10000;
  let max = -10000;
  let needDummy = false;

  // 데이터가 하나일경우 좌우에 더미데이터 넣어줘야 그래프가 제대로 나온다
  if (props.data.length <= 1) {
    needDummy = true;
    date.push("");
  }

  let dateCount = date.length;
  //console.log("date", date);

  let markArea = getMarkArea(refHCR);
  //console.log("markArea", markArea);

  props.data.forEach((element) => {
    let dataVal = parseInt(element[props.var]);

    if (dataVal < min && dataVal !== 0) {
      min = dataVal;
    }

    if (dataVal > max) {
      max = dataVal;
    }
  });

  //console.log("data", props.data);
  props.data.forEach((element, index) => {
    let dataVal = Number(parseFloat(element[props.var]).toFixed(1));

    if (needDummy) {
      value.push({
        value: Number(parseFloat(element[props.var]).toFixed(1)),
        itemStyle: { color: "transparent" },
        label: { show: false },
      });
      value.push({
        value: dataVal,
        name: Number(parseFloat(element[props.var]).toFixed(1)),
      });
      value.push({
        value: dataVal,
        name: Number(parseFloat(element[props.var]).toFixed(1)),
        itemStyle: { color: "transparent" },
        label: { show: false },
      });
    } else {
      value.push({
        value: dataVal,
        name: Number(parseFloat(element[props.var]).toFixed(1)),
      });
    }

    date.push(element.check_date + index);
  });
  if (needDummy) {
    date.push("");
  }

  //console.log("maxValue", this.maxValue, refHCR.range_max);

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
        margin: 4 * props.pdfScale,
        formatter: (d, index) => {
          if (d === "") return "";
          let str = "";
          if (d === "-") {
            str = d;
          } else {
            d = d.replaceAll("-", "");
            var yyyyMMdd = String(d);
            var sYear = yyyyMMdd.substring(2, 4);
            var sMonth = yyyyMMdd.substring(4, 6);
            var sDate = yyyyMMdd.substring(6, 8);
            str = sYear + ". " + sMonth + ". " + sDate;
          }

          if (index === date.length - 1 && d !== "-") {
            return "{last|" + str + "}";
          } else if (dateCount - 1 === index) {
            //console.log("last", dateCount);
            return "{last|" + str + "}";
          } else {
            return "{normal|" + str + "}";
          }
        },
        rich: {
          last: {
            color: "#54585B",
            fontSize: 5 * props.pdfScale,
            fontWeight: 500,
          },
          normal: {
            color: "#54585B",
            fontSize: 5 * props.pdfScale,
            // opacity: 0.6,
            fontWeight: 400,
          },
        },
        interval: 0,

        rotate: -90, //If the label names are too long you can manage this by rotating the label.
      },
    },
    yAxis: {
      type: "value",
      show: true,
      name: "",
      nameTextStyle: {
        fontSize: 7 * props.pdfScale,
        color: "#727171",
        padding: [0, 0, 0, -19 * props.pdfScale],
        align: "left",
      },
      min: refHCR.range_min, //this.minValue, // ,
      max: refHCR.range_max, //this.maxValue, //

      axisLabel: {
        formatter: (d) => {
          return parseInt(d);
        },
        show: true,
        fontSize: 5 * props.pdfScale,
        margin: 4 * props.pdfScale,
        color: "transparent",
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
        lineStyle: {
          width: 1 * props.pdfScale,
        },
      },
    },
    series: [
      {
        animation: false,
        name: "",
        type: "bar",
        data: value,
        symbolSize: 14,
        silent: true,

        selectedMode: false,

        markArea: markArea,

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
      },
    ],
  };
  const echart = echarts.init(chart.value, null, {
    renderer: "svg",
  });
  echart.setOption(option);
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

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
    top: calc(3.2px * $pdf-scale);
    font-size: calc(7px * $pdf-scale);
  }
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
