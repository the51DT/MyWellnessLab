<template>
  <div class="chart-wrap">
    <!-- <h3>{{ name }}</h3> -->
    <div class="y-axis stretch-text">결과값</div>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "GuageChart",
  components: {},
  props: {
    pdfScale: null,
    name: null,
    data: null,
    comph: null,
    var: null,
    varRef: null,
    refData: null,
  },
  data() {
    return {
      existWarn: false,
      bottomDanger: false,
      topDanger: false,
      isReverse: false,

      colorDanger: "#E9537166",
      colorWarning: "#F8B50066",
      colorSafe: "#5AB65166",

      minValue: 0,
      maxValue: 0,
    };
  },
  async mounted() {
    let refHCR = null;

    this.refData.forEach((element) => {
      if (element.variable === this.varRef) {
        refHCR = element;
      }
    });

    let value = [];

    let date = [];

    let min = 10000;
    let max = -10000;
    let needDummy = false;

    // 데이터가 하나일경우 좌우에 더미데이터 넣어줘야 그래프가 제대로 나온다
    if (this.data.length <= 1) {
      needDummy = true;
      date.push("");
    }

    let dateCount = date.length;

    let markArea = this.getMarkArea(refHCR);

    this.data.forEach((element) => {
      let dataVal = parseInt(element[this.var]);

      if (dataVal < min && dataVal !== 0) {
        min = dataVal;
      }

      if (dataVal > max) {
        max = dataVal;
      }
    });

    this.data.forEach((element, index) => {
      let dataVal = Number(parseFloat(element[this.var]).toFixed(1));

      if (needDummy) {
        value.push({
          value: Number(parseFloat(element[this.var]).toFixed(1)),
          itemStyle: { color: "transparent" },
          label: { show: false },
        });
        value.push({
          value: dataVal,
          name: Number(parseFloat(element[this.var]).toFixed(1)),
        });
        value.push({
          value: dataVal,
          name: Number(parseFloat(element[this.var]).toFixed(1)),
          itemStyle: { color: "transparent" },
          label: { show: false },
        });
      } else {
        value.push({
          value: dataVal,
          name: Number(parseFloat(element[this.var]).toFixed(1)),
        });
      }

      date.push(element.check_date + index);
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
          fontSize: 6 * this.pdfScale,
          color: "#727171",
        },

        axisLine: {
          show: true,
          lineStyle: {
            width: 1 * this.pdfScale,
            color: "#9FA0A0",
          },
        },
        axisLabel: {
          margin: 4 * this.pdfScale,
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
              return "{last|" + str + "}";
            } else {
              return "{normal|" + str + "}";
            }
          },
          rich: {
            last: {
              color: "#54585B",
              fontSize: 5 * this.pdfScale,
              fontWeight: 500,
            },
            normal: {
              color: "#54585B",
              fontSize: 5 * this.pdfScale,
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
          fontSize: 7 * this.pdfScale,
          color: "#727171",
          padding: [0, 0, 0, -19 * this.pdfScale],
          align: "left",
        },
        min: refHCR.range_min, //this.minValue, // ,
        max: refHCR.range_max, //this.maxValue, //

        axisLabel: {
          formatter: (d) => {
            return parseInt(d);
          },
          show: true,
          fontSize: 5 * this.pdfScale,
          margin: 4 * this.pdfScale,
          color: "transparent",
        },

        axisLine: {
          show: true,
          lineStyle: {
            width: 1 * this.pdfScale,
            color: "#9FA0A0",
          },
        },

        splitLine: {
          show: false,
          lineStyle: {
            width: 1 * this.pdfScale,
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

          barWidth: 4 * this.pdfScale,

          itemStyle: {
            color: "#555555",
          },
          label: {
            show: true,
            fontSize: 5 * this.pdfScale,
            color: "#727171",
            position: "top",
            fontWeight: 400,
            formatter: "{b}",
          },
        },
      ],
    };
    const echart = echarts.init(this.$refs.chart, null, {
      renderer: "svg",
    });
    echart.setOption(option);
  },
  methods: {
    // 배경 위험/주의/정상 영역 배경색 설정하는 부분
    getMarkArea(refHCR) {
      let markArea = { itemStyle: { color: "red" }, data: [] };
    
      //안전구역이 중간에 있을경우. normalRange_min,max값 위치에 위험막대 표시. 주의표시는 없다
      if (
        (refHCR.dangerRange_min === refHCR.dangerRange_max ||
          refHCR.normalRange_min === refHCR.dangerRange_min) &&
        refHCR.normalRange_min !== 0
      ) {
        this.existWarn = false;
        this.bottomDanger = true;
        this.topDanger = true;

        this.minValue =
          refHCR.normalRange_min -
          (refHCR.normalRange_max - refHCR.normalRange_min);

        this.maxValue =
          refHCR.normalRange_max +
          (refHCR.normalRange_max - refHCR.normalRange_min);

        // 아래쪽 위험
        markArea.data.push([
          {
            coord: [0, refHCR.range_min],
            itemStyle: { color: this.colorDanger },
            name: Number(parseFloat(refHCR.normalRange_min).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * this.pdfScale,
              position: ["-5%", "0%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          { coord: [100, refHCR.normalRange_min] },
        ]);
        // 위쪽 위험
        markArea.data.push([
          {
            coord: [0, refHCR.normalRange_max],
            itemStyle: { color: this.colorDanger },
            name: Number(parseFloat(refHCR.normalRange_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * this.pdfScale,
              position: ["-5%", "100%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          { coord: [100, refHCR.range_max] },
        ]);
      }
      //주의 표시가 없고 위험만 존재
      else if (refHCR.warningRange_min === refHCR.warningRange_max) {
        
        if (refHCR.dangerRange_min < refHCR.normalRange_min) {
        
          this.bottomDanger = true;
          this.isReverse = true;
          markArea.data.push([
            {
              coord: [0, refHCR.dangerRange_min],
              itemStyle: {
                color: this.colorDanger,
              },
              name: Number(parseFloat(refHCR.normalRange_min).toFixed(1)),
              label: {
                show: true,
                fontSize: 6 * this.pdfScale,
                position: ["-10%", "0%"],
                verticalAlign: "center",
              },
            },
            { coord: [100, refHCR.dangerRange_max] },
          ]);
          this.minValue =
            refHCR.dangerRange_min -
            (refHCR.dangerRange_max - refHCR.dangerRange_min);

          this.maxValue = refHCR.range_max;
        } else if (refHCR.dangerRange_min === refHCR.dangerRange_max) {
          
        } else {
          
          this.topDanger = true;
          markArea.data.push([
            {
              coord: [0, refHCR.dangerRange_min],
              itemStyle: { color: this.colorDanger },
              name: Number(parseFloat(refHCR.dangerRange_min).toFixed(0)),
              label: {
                show: true,
                fontSize: 6 * this.pdfScale,
                position: ["-15%", "105%"],
                verticalAlign: "center",
              },
            },
            { coord: [100, refHCR.dangerRange_max] },
          ]);
        }
        this.existWarn = false;

        this.minValue = refHCR.range_min;

        this.maxValue =
          refHCR.normalRange_max +
          (refHCR.normalRange_max - refHCR.normalRange_min);
      }
      //주의 위험 모두 존재
      else {
        this.existWarn = true;
        markArea.data.push([
          {
            coord: [0, refHCR.dangerRange_min],
            itemStyle: { color: this.colorDanger },
            name: parseInt(refHCR.dangerRange_min),
            label: {
              show: true,
              fontSize: 6 * this.pdfScale,
              position: ["-5%", "95%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          { coord: [100, refHCR.dangerRange_max] },
        ]);
        markArea.data.push([
          {
            coord: [0, refHCR.warningRange_min],
            itemStyle: { color: this.colorWarning },
            name: Number(parseFloat(refHCR.warningRange_min).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * this.pdfScale,
              position: ["-5%", "105%"],
              align: "right",
              verticalAlign: "center",
            },
          },
          { coord: [100, refHCR.warningRange_max] },
        ]);
        //정방향
        if (this.refData.warningRange_max < this.refData.dangerRange_max) {
          
          this.topDanger = true;
        }
        //역방향
        else {
          
          this.isReverse = true;
          this.bottomDanger = true;
        }

        this.minValue =
          refHCR.warningRange_min -
          (refHCR.warningRange_max - refHCR.warningRange_min);

        this.maxValue =
          refHCR.warningRange_max +
          (refHCR.warningRange_max - refHCR.warningRange_min);
      }

      this.minValue -= 20;

      if (this.minValue < refHCR.range_min) this.minValue = refHCR.range_min;

      if (this.maxValue > refHCR.range_max) this.maxValue = refHCR.range_max;

      // markArea = { data: [] };
      // 안전 영역 for 체질량지수
      // if (
      //   refHCR.normalRange_min > refHCR.range_min &&
      //   refHCR.normalRange_min < refHCR.warningRange_min
      // ) {
      //   markArea.data.push([
      //     {
      //       // coord: [0, refHCR.normalRange_min],
      //       coord: [0, refHCR.range_min],
      //       itemStyle: { color: this.colorSafe },
      //     },
      //     { coord: [100, refHCR.normalRange_max] },
      //   ]);
      // } else
      {
        markArea.data.push([
          {
            coord: [0, refHCR.normalRange_min],
            // coord: [0, refHCR.range_min],
            itemStyle: { color: this.colorSafe },
          },
          { coord: [100, refHCR.normalRange_max] },
        ]);
      }

      return markArea;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~@/assets/scss/document.scss";

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
