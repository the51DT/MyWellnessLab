<template>
  <div class="chart-wrap">
    <div class="top">
      <div class="check-box">
        <img
          v-if="!isnormal_range()"
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
        />
      </div>
      <!-- 그래프 그라데이션 이미지 -->
      <img :src="'/img/pdf/res/tracking-' + imgName + '.png'" />
    </div>
  </div>
</template>

<script>
// import * as echarts from "echarts";
import { comphSmCheckRange } from "@/assets/js/chart/rstText";

export default {
  props: {
    pdfScale: null,
    name: null,
    data: null,
    comph: null,
    var: null,
    varRef: null,
    refData: null,
    meal: null,
    report_no: null,
  },
  data() {
    return {
      imgName: null,
      refHCR: null,
      comData: null,
    };
  },
  unmounted() {},
  created() {
    this.initChart();

    console.log("tracking2", this.data, this.comph);
  },
  methods: {
    // 정상범위 여부 체크하여 체크표시
    isnormal_range() {      
      let myDataValue = this.comph.resultDto.myData[this.var]; //this.comph.resultDto.myData;

      if (
        comphSmCheckRange[this.var].check_max &&
        myDataValue > comphSmCheckRange[this.var].check_max
      ) {
        return false;
      }

      if (
        comphSmCheckRange[this.var].check_min &&
        myDataValue < comphSmCheckRange[this.var].check_min
      ) {
        return false;
      }
      return true;
    },
    getMean() {
      // return "50%";
      const mean = this.comph.resultDto.comData[getVarName(this.var)];
      console.log("getMean2", this.var, getVarName(this.var), mean);
      console.log(this.comData)
      // return this.meal.resultDto.comData[this.var];

      let pos;
      let status = 0;
      if (
        this.comData.normal_range_min <= mean &&
        this.comData.normal_range_max >= mean
      ) {
        // 일반범위
        status = 1;
      } else if (
        this.comData.danger_range_min <= mean &&
        this.comData.danger_range_max >= mean
      ) {
        // 위험 범위
        status = 3;
      } else {
        // 주의 범위
        status = 2;
      }

      switch (status) {
        case 1:
          pos = this.calculateNormal(mean);
          break;
        case 2:
          pos = this.calculateWarn(mean);
          break;
        case 3:
          pos = this.calculateDanger(mean);
          break;
      }

      return pos + "%";
      // return (
      //   (mean /
      //     (comphSmCheckRange[this.var].max - comphSmCheckRange[this.var].min)) *
      //     100 +
      //   "%"
      // );
    },
    calculateNormal(value) {
      let rate;

      switch (this.imgName) {
        case "half":
          console.log("reverse value", value, this.var);
          if (this.comData.normal_range_max >= this.comData.range_max)
            this.comData.normal_range_max = this.comData.range_max;
          rate =
            100 / 2 +
            ((value - this.comData.normal_range_min) /
              (this.comData.normal_range_max - this.comData.normal_range_min)) *
              (100 / 2);

          console.log("reverse value result", rate);
          return rate;

        case "normal":
          console.log("normal value", value, this.var);

          if (
            this.comData.normal_range_max - this.comData.normal_range_min ===
            0
          ) {
            rate = 0;
          } else {
            rate =
              ((value - this.comData.normal_range_min) /
                (this.comData.normal_range_max - this.comData.normal_range_min)) *
              (100 / 3);
          }

          return rate;

        case "center":
          console.log("center value", value, this.var);

          break;
        case "normal-reverse":
          console.log("normal-reverse value", value, this.var);
          rate =
            (100 / 3) * 2 +
            ((value - this.comData.normal_range_min) /
              (this.comData.normal_range_max - this.comData.normal_range_min)) *
              (100 / 3);
          return rate;
      }
    },
    calculateWarn(value) {
      let rate;

      switch (this.imgName) {
        case "half":
          console.log("reverse value", value, this.var);
          if (value < this.comData.normal_range_min) {
            rate =
              ((value - this.comData.range_min) /
                (this.comData.normal_range_min - this.comData.range_min)) *
              (100 / 3);
            return rate;
          } else {
            rate =
              (100 / 3) * 2 +
              ((value - this.comData.normal_range_max) /
                (this.comData.range_max - this.comData.normal_range_max)) *
                (100 / 3);
            return rate;
          }

        case "normal":
          console.log("normal value", value, this.var);

          rate =
            100 / 3 +
            ((value - this.comData.normal_range_max) /
              (this.comData.danger_range_min - this.comData.normal_range_max)) *
              (100 / 3);
          return rate;

        case "center":
          console.log("center value", value, this.var);

          break;
        case "normal-reverse":
          console.log("normal-reverse value", value, this.var);
          rate =
            (100 / 3) * 1 +
            ((value - this.comData.danger_range_max) /
              (this.comData.normal_range_min - this.comData.danger_range_max)) *
              (100 / 3);
          return rate;
      }
    },
    calculateDanger(value) {
      let rate;

      switch (this.imgName) {
        case "half":
          console.log("reverse value", value, this.var);
          if (value < this.comData.normal_range_min) {
            rate =
              ((value - this.comData.range_min) /
                (this.comData.normal_range_min - this.comData.range_min)) *
              (100 / 2);
            return rate;
          } else {
            rate =
              (100 / 2) * 2 +
              ((value - this.comData.normal_range_max) /
                (this.comData.range_max - this.comData.normal_range_max)) *
                (100 / 2);
            return rate;
          }

        case "normal":
          console.log("normal value", value, this.var);

          rate =
            (100 / 3) * 2 +
            ((value - this.comData.danger_range_min) /
              (this.comData.range_max - this.comData.danger_range_min)) *
              (100 / 3);
          return rate;

        case "center":
          console.log("center value", value, this.var);

          break;
        case "normal-reverse":
          console.log("normal-reverse value", value, this.var);
          rate =
            ((value - this.comData.range_min) /
              (this.comData.danger_range_max - this.comData.range_min)) *
            (100 / 3);
          return rate;
      }
    },
    // 기준되는 값
    getCenterData() {
      console.log("getCenterdata", this.comph.resultDto.comData[this.var]);

      return this.comph.resultDto.comData[this.var];
    },
    // 사용자 지표 수치
    getData() {
      console.log("getdata", this.data, this.data[this.var]);
      return this.data[this.var];
    },
    // 그래프 좌표 계산
    getPos() {
      let pos = this.getData();

      // let data = 0;
      let dataValue = this.getData();

      let status = 0;
      if (
        this.comData.normal_range_min <= dataValue &&
        this.comData.normal_range_max >= dataValue
      ) {
        // 일반범위
        status = 1;
      } else if (
        this.comData.danger_range_min <= dataValue &&
        this.comData.danger_range_max >= dataValue
      ) {
        // 위험 범위
        status = 3;
      } else {
        // 주의 범위
        status = 2;
      }

      switch (status) {
        case 1:
          pos = this.calculateNormal(dataValue);
          break;
        case 2:
          pos = this.calculateWarn(dataValue);
          break;
        case 3:
          pos = this.calculateDanger(dataValue);
          break;
      }

      if (pos < 0) pos = 0;
      if (pos > 99) pos = 99;
      return pos + "%";

      // if (pos < this.getCenterData()) {
      //   console.log(
      //     "low",
      //     pos,
      //     comphSmCheckRange[this.var].min,
      //     comphSmCheckRange[this.var].max,
      //     this.getCenterData()
      //   );
      //   data =
      //     ((pos - comphSmCheckRange[this.var].min) /
      //       (this.getCenterData() - comphSmCheckRange[this.var].min)) *
      //     50;
      // } else {
      //   console.log(
      //     "high",
      //     pos,
      //     comphSmCheckRange[this.var].min,
      //     comphSmCheckRange[this.var].max,
      //     this.getCenterData()
      //   );
      //   data =
      //     50 +
      //     ((pos - this.getCenterData()) /
      //       (comphSmCheckRange[this.var].max - this.getCenterData())) *
      //       50;
      // }
      // console.log("datapos", data, pos);

      // if (data < 0) data = 0;
      // if (data > 99) data = 99.3; //맥스값 맞추려는 값

      // return data + "%";
    },
    initChart() {
      this.imgName = "half";
      switch (this.var) {
        case "CK_drink_amt":
        case "CK_smok_amt":
        case "CK_smok_dur":
        this.imgName = "normal";
          break;
        case "CK_MET":
          this.imgName = "normal-reverse";
          break;
      }

      let varName = getVarName(this.var);

      console.log("@@@@@@@@@???? ", this.comph.resultDto);
      this.comph.resultDto.comDataList.forEach((element) => {
         console.log("tracking2 findcom", element, this.var);
         console.log(varName + ' / ' + element.variable)
        if (element.variable === varName) {
          console.log("tracking2 find", element);
          this.comData = element;
        }
      });
    },
  },
};

function getVarName(val){
  let varName = '';
  switch (val) {
    case "CK_drink_amt":
      varName = "drink_amt";
      break;
    case "CK_smok_amt":
      varName = "pack_year";
      break;
    case "CK_smok_dur":
      varName = "smok_dur";
      break;
    case "CK_MET":
      varName = "MET";
      break;
    case "CK_sleep_time":
      varName = "sleep_time";
      break;
    case "CK_eq5d":
      varName = "EQ5D";
      break;
  }
  return varName;
}
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
    // (flex-start, center);
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
      top: calc(10.5px * $pdf-scale);
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
