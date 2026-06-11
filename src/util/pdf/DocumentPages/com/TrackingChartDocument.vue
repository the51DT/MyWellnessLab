<template>
  <div class="chart-wrap">
    <div class="top">
      <div class="check-box">
        <img
          v-if="isCheckedList()"
          class="check"
          src="/img/pdf/res/tracking-check.png"
        />
      </div>
      <div class="name stretch-text">{{ name }}</div>
    </div>
    <div class="graph">
      <div class="my-point-pointer">
        <div class="pointer" :style="{ left: getMean() }"></div>

        <img
          class="my-point-img"
          src="/img/pdf/res/age-graph-icon.png"
          alt=""
          :style="{ left: getPos() }"
          v-if="existData()"
        />
      </div>
      <!-- 그래프 그라데이션 이미지 -->
      <img :src="'/img/pdf/res/tracking-' + imgSrc + '.png'" />
    </div>
  </div>
</template>

<script setup>
// import * as echarts from "echarts";
import { tracking_hcr } from "@/assets/js/chart/rstText";

import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  save: Boolean,
  userInfo: null,
  pdfScale: null,
  name: null,
  data: null,
  comph: null,
  var: null,
  varRef: null,
  refData: null,
  meal: null,
  imgSrc: null,
});

const imgName = ref(null);
const refHCR =  ref(null);

function isnormal_range() {
  return (
    props.data[props.var] >= refHCR.value.normal_range_min &&
    props.data[props.var] <= refHCR.value.normal_range_max
  );
}

function existData() {
  let exist = true;
  tracking_hcr.forEach((element) => {
    if (
      element.hcr_variables === props.var &&
      element.blood &&
      props.data[props.var] == 0
    ) {
      exist = false;
    }
  });
  return exist;
}

// 체크여부 계산
function isCheckedList() {
  if (!existData()) return false;

  let checked = false;
  tracking_hcr.forEach((element) => {
    if (element.hcr_variables === props.var) {
      console.log('########################')
      console.log(element.hcr_variables + ' / ' + props.var)
      console.log(props.data)
      if (element.check_min && element.check_min > props.data[props.var]) {
        console.log(
          "trackingchartmin",
          props.var,
          props.data[props.var],
          element.check_min
        );
        checked = true;
      }

      if (element.check_max && element.check_max < props.data[props.var]) {
        checked = true;
        console.log(
          "trackingchartmax",
          props.var,
          props.data[props.var],
          element.check_max
        );
      }
    }
  });
  return checked;
}

// 평균값
function getMean() {
  let pos;
  const mean = props.meal.resultDto.comData[props.var];
  console.log("getMean", props.var, mean);
  initChart();

  let status = 0;
  if (
    refHCR.value.normal_range_min <= mean &&
    refHCR.value.normal_range_max >= mean
  ) {
    // 일반범위
    status = 1;
  } else if (
    refHCR.value.danger_range_min <= mean &&
    refHCR.value.danger_range_max >= mean
  ) {
    // 위험 범위
    status = 3;
  } else {
    // 주의 범위
    status = 2;
  }

  switch (status) {
    case 1:
      pos = calculateNormal(mean);
      break;
    case 2:
      pos = calculateWarn(mean);
      break;
    case 3:
      pos = calculateDanger(mean);
      break;
  }

  // return this.meal.resultDto.comData[this.var];

  return pos + "%";
  // return (
  //   (mean / (this.refHCR.range_max - this.refHCR.range_min)) * 100 + "%"
  // );
}

// 건강 지표 수치
function getData() {
  let data = props.data[props.var];
  if (data < props.refData.range_min) {
    data = props.refData.range_min;
  }
  if (data > props.refData.range_max) {
    data = props.refData.range_max;
  }

  return data;
}

// 현재 수치의 좌표
function getPos() {
  let dataValue = getData();
  let pos =
    (getData() / (refHCR.value.range_max - refHCR.value.range_min)) *
    100;

  initChart();

  let status = 0;
  if (
    refHCR.value.normal_range_min <= dataValue &&
    refHCR.value.normal_range_max >= dataValue
  ) {
    // 일반범위
    status = 1;
  } else if (
    refHCR.value.danger_range_min <= dataValue &&
    refHCR.value.danger_range_max >= dataValue
  ) {
    // 위험 범위
    status = 3;
  } else {
    // 주의 범위
    status = 2;
  }

  switch (status) {
    case 1:
      pos = calculateNormal(dataValue);
      break;
    case 2:
      pos = calculateWarn(dataValue);
      break;
    case 3:
      pos = calculateDanger(dataValue);
      break;
  }

  if (pos < 0) pos = 0;
  if (pos > 100) pos = 100;
  return pos + "%";
}

function calculateNormal(value) {
  let rate;

  switch (props.imgSrc) {
    case "reverse":
      console.log("reverse value", value, props.var);
      rate =
        100 / 3 +
        ((value - refHCR.value.normal_range_min) /
          (refHCR.value.normal_range_max - refHCR.value.normal_range_min)) *
          (100 / 3);
      return rate;
    case "normal":
      console.log("normal value", value, props.var);

      rate =
        ((value - refHCR.value.normal_range_min) /
          (refHCR.value.normal_range_max - refHCR.value.normal_range_min)) *
        (100 / 3);
      return rate;

    case "center":
      console.log("center value", value, props.var);

      break;
    case "normal-reverse":
      console.log("normal-reverse value", value, props.var);
      rate =
        (100 / 3) * 2 +
        ((value - refHCR.value.normal_range_min) /
          (refHCR.value.normal_range_max - refHCR.value.normal_range_min)) *
          (100 / 3);
      return rate;
  }
}

function calculateWarn(value) {
  let rate;

  switch (props.imgSrc) {
    case "reverse":
      console.log("reverse value", value, props.var);
      if (value < refHCR.value.normal_range_min) {
        rate =
          ((value - refHCR.value.range_min) /
            (refHCR.value.normal_range_min - refHCR.value.range_min)) *
          (100 / 3);
        return rate;
      } else {
        rate =
          (100 / 3) * 2 +
          ((value - refHCR.value.normal_range_max) /
            (refHCR.value.range_max - refHCR.value.normal_range_max)) *
            (100 / 3);
        return rate;
      }

    case "normal":
      console.log("normal value", value, props.var);

      rate =
        100 / 3 +
        ((value - refHCR.value.normal_range_max) /
          (refHCR.value.danger_range_min - refHCR.value.normal_range_max)) *
          (100 / 3);
      return rate;

    case "center":
      console.log("center value", value, props.var);

      break;
    case "normal-reverse":
      console.log("normal-reverse value", value, props.var);
      rate =
        (100 / 3) * 1 +
        ((value - refHCR.value.danger_range_max) /
          (refHCR.value.normal_range_min - refHCR.value.danger_range_max)) *
          (100 / 3);
      return rate;
  }
}

function calculateDanger(value) {
  let rate;

  switch (props.imgSrc) {
    case "reverse":
      console.log("reverse value", value, props.var);
      if (value < refHCR.value.normal_range_min) {
        rate =
          ((value - refHCR.value.range_min) /
            (refHCR.value.normal_range_min - refHCR.value.range_min)) *
          (100 / 3);
        return rate;
      } else {
        rate =
          (100 / 3) * 2 +
          ((value - refHCR.value.normal_range_max) /
            (refHCR.value.range_max - refHCR.value.normal_range_max)) *
            (100 / 3);
        return rate;
      }

    case "normal":
      console.log("normal value", value, props.var);

      rate =
        (100 / 3) * 2 +
        ((value - refHCR.value.danger_range_min) /
          (refHCR.value.range_max - refHCR.value.danger_range_min)) *
          (100 / 3);
      return rate;

    case "center":
      console.log("center value", value, props.var);

      break;
    case "normal-reverse":
      console.log("normal-reverse value", value, props.var);
      rate =
        ((value - refHCR.value.range_min) /
          (refHCR.value.danger_range_max - refHCR.value.range_min)) *
        (100 / 3);
      return rate;
  }
}

function initChart() {
  imgName.value = "reverse";
  props.refData.forEach((element) => {
    if (element.variable === props.varRef) refHCR.value = element;
  });

  //안전구역이 중간일경우
  if (
    refHCR.value.danger_range_min === refHCR.value.danger_range_max &&
    refHCR.value.normal_range_min !== 0
  ) {
    console.log("normal");
    imgName.value = "center";
  }
  //주의 표시가 없고 위험만 존재
  else if (refHCR.value.warning_range_min === refHCR.value.warning_range_max) {
    console.log("no warning");
    if (refHCR.value.danger_range_min < refHCR.value.normal_range_min) {
      console.log("reverse");
      //   this.imgName = "normal";
    } else if (
      refHCR.value.danger_range_min === refHCR.value.danger_range_max
    ) {
      console.log("no danger");
    } else {
      console.log("topDanger");
      imgName.value = "normal";
    }
  }
  //주의 위험 모두 존재
  else {
    //정방향
    if (props.refData.warning_range_max < props.refData.danger_range_max) {
      console.log("use normal");
    }
    //역방향
    else {
      console.log("use reverse");
      imgName.value = "normal";
    }
  }
}

onMounted(() => {
  initChart();
})
</script>

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
    //@include flex(flex-start, center);
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
      top: calc(10.25px * $pdf-scale);
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
