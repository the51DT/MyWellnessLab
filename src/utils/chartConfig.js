import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(...registerables);
Chart.register(annotationPlugin);
/** chart.js add legend label padding */
const legendMargin = {
  id: "legendMargin",
  beforeInit(chart, legend, options) {
    let fitValue = chart.legend.fit;
    chart.legend.fit = function fit() {
      fitValue.bind(chart.legend)();
      return (this.height += options.paddingTop);
    };
  },
  defaults: {
    paddingTop: 0, // <-- default padding
  },
};
/** chart.js library */
export const createHorizontalBarChart = (
  ctx,
  labels,
  values,
  backgroundColors,
  nutrientColors
) => {
  var convertValues = values; // 데이터가 0인 경우엔 33.33으로 변경하기 위한 변수
  var _backgroundColors = nutrientColors;

  if (
    values.length == 0 ||
    (values[0] == 0 && values[1] == 0 && values[2] == 0)
  ) {
    convertValues = [33, 33, 34];
    _backgroundColors = backgroundColors;
  }

  var newChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [""],
      datasets: [
        {
          label: labels[0],
          data: [convertValues[0]],
          backgroundColor: _backgroundColors[0],
          borderWidth: 0,
          barThickness: 11,
          borderSkipped: false,
        },
        {
          label: labels[1],
          data: [convertValues[1]],
          borderWidth: 0,
          barThickness: 11,
          backgroundColor: _backgroundColors[1],
        },
        {
          label: labels[2],
          data: [convertValues[2]],
          borderWidth: 0,
          barThickness: 11,
          backgroundColor: _backgroundColors[2],
        },
      ],
    },
    options: {
      // maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          labels: {
            // font: {
            //   size: 10
            // },
            font: function (context) {
              const width = context.chart.width;
              let size = Math.round(width / 26);
              if (width > 430) {
                size = Math.round(width / 42);
              }

              return {
                size: size,
                family: "Pretendard",
              };
            },
            usePointStyle: true, // 범례의 아이콘을 동그라미 포인트로 변경
            pointStyle: "rect", // 포인트 스타일을 원형으로 설정
            boxHeight: 10, // 포인트 크기를 20px로 설정
            padding: 15,
            generateLabels: (chart) => {
              var elementList = [];
              const {
                labels: { pointStyle },
              } = chart.legend.options;
              chart.data.datasets.forEach((dataset, index) => {
                elementList.push({
                  text: `${dataset.label} (${values[index]}%)`,
                  fillStyle: _backgroundColors[index],
                  lineWidth: 0,
                  pointStyle: pointStyle,
                });
              });
              return elementList;
            },
          },
        },
      },

      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          display: false, // x축 숨기기
          grid: {
            display: false,
          },
          stacked: true,
        },
        y: {
          display: false, // x축 숨기기
          grid: {
            display: false,
          },
          stacked: true,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          bottom: 10,
        },
      },
    },
  });
  return newChart;
};

export const createVerticalBarChart = (ctx, labels, values, references) => {
  // check all value is 0
  const annotation_common = {
    type: "line",
    borderColor: "rgb(126,126,126)",
    borderWidth: 1,
    borderDash: [3, 3],
    xScaleID: "x",
    yScaleID: "y",
  };
  const annotation1 = {
    ...annotation_common,
    xMax: indexToMax(0) + 0.05,
    xMin: indexToMin(0) - 0.05,
    yMax: references[0],
    yMin: references[0],
  };
  const annotation2 = {
    ...annotation_common,
    xMax: indexToMax(1) + 0.05,
    xMin: indexToMin(1) - 0.05,
    yMax: references[1],
    yMin: references[1],
  };
  const annotation3 = {
    ...annotation_common,
    xMax: indexToMax(2) + 0.05,
    xMin: indexToMin(2) - 0.05,
    yMax: references[2],
    yMin: references[2],
  };
  const annotation4 = {
    ...annotation_common,
    xMax: indexToMax(3) + 0.05,
    xMin: indexToMin(3) - 0.05,
    yMax: references[3],
    yMin: references[3],
  };
  const annotation5 = {
    ...annotation_common,
    xMax: indexToMax(4) + 0.05,
    xMin: indexToMin(4) - 0.05,
    yMax: references[4],
    yMin: references[4],
  };
  Chart.defaults.font.size = 8.5;
  var newChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "섭취율",
          data: values,
          barThickness: 10,
          backgroundColor: "rgba(245,192,86,1)",
          borderSkipped: false,
        },
        {
          backgroundColor: "rgb(226, 226, 226, 1)",
          borderWidth: 0,
          barThickness: 10,
          data: [120.0, 120.0, 120.0, 120.0, 120.0],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          maxWidth: 100,
          align: "center",
          labels: {
            // font: {
            //   size: 11
            // },
            font: function (context) {
              const width = context.chart.width;
              let size = Math.round(width / 26);
              if (width > 430) {
                size = Math.round(width / 42);
              }
              return {
                size: size,
                family: "Pretendard",
              };
            },
            usePointStyle: true, // 범례의 아이콘을 동그라미 포인트로 변경
            // pointStyle: 'rect', // 포인트 스타일을 원형으로 설정
            boxHeight: 80, // 포인트 크기를 20px로 설정
            boxWidth: 80,
            padding: 10,
            // pointStyleWidth: 15,
            generateLabels: () => {
              return [
                {
                  text: `섭취량`,
                  fillStyle: "rgba(250,164,3,1)",
                  lineWidth: 0,
                  pointStyle: "rect",
                },
                {
                  text: `1일 기준치`,
                  fillStyle: "rgba(126,126,126,1)",
                  // lineDashOffset: 3,
                  // borderDash: [],
                  lineDash: [1, 2],
                  lineWidth: 3,
                  usePointStyle: true,
                  pointStyle: "dash",
                },
              ];
            },
          },
        },
        annotation: {
          annotations: {
            annotation1,
            annotation2,
            annotation3,
            annotation4,
            annotation5,
          },
        },
        tooltip: {
          enabled: true,
          filter: function (tooltipItem) {
            if (tooltipItem.datasetIndex == 1) {
              // <-- dataset index
              return false;
            } else {
              return true;
            }
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
            drawBorder: false,
            drawTicks: false,
            drawOnChartArea: false,
          },
          ticks: {
            drawOnChartArea: false,
            maxRotation: 0,
            minRotation: 0,
            font: function (context) {
              const width = context.chart.width;
              let size = Math.round(width / 36);
              if (width > 430) {
                size = Math.round(width / 48);
              }

              return {
                size: size,
                family: "Pretendard",
              };
            },
          },
        },
        y: {
          display: false, // x축 숨기기
          stacked: true,
          min: 0.0,
          max: 120.0,
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
          },
        },
      },
    },
  });
  return newChart;
};
export const createHalfDoughnutChart = (
  ctx,
  labels,
  values,
  nutrientColors,
  backgroundColors,
  labelPosition,
  padding_list,
  label_value
) => {
  var convertValues = values; // 데이터가 0인 경우엔 33.33으로 변경하기 위한 변수
  var _backgroundColors = nutrientColors;
  var _labelDisplay = true;
  var _labelPosition = "bottom";
  var _labelValue = values;
  var _padding_list = [-10, 10, -50, 0]; // left right top bottom
  if (labelPosition != null && labelPosition != undefined) {
    _labelPosition = labelPosition;
  }
  if (padding_list != null && padding_list != undefined) {
    _padding_list = padding_list;
  }
  if (label_value != null && label_value != undefined) {
    _labelValue = label_value;
  }

  if (
    values.length == 0 ||
    (values[0] == 0 && values[1] == 0 && values[2] == 0)
  ) {
    convertValues = [33, 33, 33];
    _backgroundColors = backgroundColors;
    _labelDisplay = true;
  }

  var newChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: convertValues,
          backgroundColor: _backgroundColors,
          hoverOffset: 4,
          rotation: -90,
          borderWidth: 0,
          circumference: 180,
          borderRadius: 100,
        },
      ],
    },
    plugins: [legendMargin],
    options: {
      cutout: "90%",
      maintainAspectRatio: 1,
      responsive: false,
      layout: {
        padding: {
          left: _padding_list[0],
          right: -_padding_list[1],
          top: _padding_list[2],
          bottom: _padding_list[3],
        },
      },
      plugins: {
        legendMargin: {
          paddingTop: 0,
        },
        legend: {
          display: _labelDisplay,
          position: _labelPosition,
          labels: {
            font: function (context) {
              const width = context.chart.width;
              let size = Math.round(width / 22);
              if (width >= 430) {
                size = Math.round(width / 45);
              }
              return {
                size: size,
                family: "Pretendard",
              };
            },
            usePointStyle: true, // 범례의 아이콘을 동그라미 포인트로 변경
            pointStyle: "rect", // 포인트 스타일을 원형으로 설정
            boxHeight: 10, // 포인트 크기를 20px로 설정
            boxWidth: 10,
            padding: 10,
            generateLabels: (chart) => {
              var elementList = [];
              const {
                labels: { pointStyle },
              } = chart.legend.options;

              chart.data.datasets[0].data.map((mapping, index) => {
                let options = {};
                options["text"] =
                  `${chart.data.labels[index]}(${_labelValue[index]}%)`;
                options["pointStyle"] = pointStyle;
                options["fillStyle"] = nutrientColors[index];
                options["lineWidth"] = 0;
                elementList.push(options);
              });
              return elementList;
            },
          },
        },
        tooltip: {
          enabled: true,
          position: "nearest",
          xAlign: "center",
          filter: function (tooltipItem) {
            if (values[tooltipItem.datasetIndex] == 0) {
              // <-- dataset index
              return false;
            } else {
              return true;
            }
          },
        },
      },
    },
  });

  return newChart;
};
/** Gauge Chart */
export const createGaugeChart = async (value, color) => {
  var option = {
    series: [
      {
        type: "gauge",
        // animation: false,
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 100,
        radius: "95%",
        splitNumber: 12,
        itemStyle: {
          color: color,
          shadowColor: "rgba(0,138,255,0)",
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        progress: {
          width: 10,
          show: true,
          roundCap: false,
          itemStyle: {
            color: "#E97B00",
          },
        },
        pointer: {
          show: false,
          icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
          length: "75%",
          width: 16,
          offsetCenter: [0, "5%"],
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 10,
            color: [[1, "#EFEFEF"]],
            shadowColor: "#E97B00",
            shadowBlur: -100,
          },
        },
        axisTick: {
          show: false,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: "#999",
          },
        },
        splitLine: {
          show: false,
          length: 12,
          lineStyle: {
            width: 3,
            color: "#999",
          },
        },
        axisLabel: {
          show: false,
          distance: 30,
          color: "#999",
          fontSize: 20,
        },
        title: {
          show: false,
        },
        label: { show: false },
        detail: {
          show: false,
          backgroundColor: "#fff",
          borderColor: "#999",
          borderWidth: 2,
          width: "60%",
          lineHeight: 40,
          height: 40,
          borderRadius: 8,
          offsetCenter: [0, "35%"],
          valueAnimation: true,
          formatter: function (value) {
            return "{value|" + value.toFixed(0) + "}{unit|km/h}";
          },
          rich: {
            value: {
              fontSize: 50,
              fontWeight: "bolder",
              color: "#777",
            },
            unit: {
              fontSize: 20,
              color: "#999",
              padding: [0, 0, -20, 10],
            },
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
  return option;
};

export const createGaugeChartDocument = async (
  value,
  color,
  width,
  pdf_scale,
  max_value = 100
) => {
  var option = {
    series: [
      {
        type: "gauge",
        // animation: false,
        startAngle: 90,
        endAngle: -270,
        animation: true, // 애니메이션은 켜둔다
        animationDuration: 0.1, // 대신 애니메이션 지속시간 0ms로 설정
        animationDurationUpdate: 0.1, // 업데이트 애니메이션도 0ms      },
        min: 0,
        max: max_value,
        radius: "95%",
        splitNumber: 12,
        itemStyle: {
          color: color,
          shadowColor: "rgba(0,138,255,0)",
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        progress: {
          show: true,
          roundCap: false,
          width: pdf_scale * width,
          itemStyle: {
            // borderWidth: pdf_scale * width,
            color: color,
          },
        },
        pointer: {
          show: false,
          icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
          length: "75%",
          width: 16,
          offsetCenter: [0, "5%"],
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: pdf_scale * width,
            color: [[1, "#EFEFEF"]],
            // shadowColor: "red",
            // shadowBlur: -100,
          },
        },
        axisTick: {
          show: false,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: "#999",
          },
        },
        splitLine: {
          show: false,
          length: 12,
          lineStyle: {
            width: 3,
            color: "#999",
          },
        },
        axisLabel: {
          show: false,
          distance: 30,
          color: "#999",
          fontSize: 20,
        },
        title: {
          show: false,
        },
        label: { show: false },
        detail: {
          show: false,
          backgroundColor: "#fff",
          borderColor: "#999",
          borderWidth: 2,
          width: "60%",
          lineHeight: 40,
          height: 40,
          borderRadius: 8,
          offsetCenter: [0, "35%"],
          valueAnimation: true,
          formatter: function (value) {
            return "{value|" + value.toFixed(0) + "}{unit|km/h}";
          },
          rich: {
            value: {
              fontSize: 50,
              fontWeight: "bolder",
              color: "#777",
            },
            unit: {
              fontSize: 20,
              color: "#999",
              padding: [0, 0, -20, 10],
            },
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
  return option;
};

/** half donut gauge chart */
export const createHalfDonutGaugeChart = async (value) => {
  var option = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        name: "Pressure",
        type: "gauge",
        radius: "100%", // 크기를 키워서 여백 제거
        center: ["50%", "60%"], // 차트를 위로 올려서 상단 여백 제거
        startAngle: 180,
        endAngle: 0,
        min: 0.5,
        max: 1.5,
        grid: {
          top: 0,
          bottom: 0,
        },
        itemStyle: {
          color: "#008352",
        },
        splitNumber: 0,
        splitLine: {
          show: false,
        },

        axisTick: {
          splitNumber: 1,
          length: 124.5,
        },
        pointer: {
          icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
          length: "60%",
          width: 2.5,
          itemStyle: {
            color: "#FF0000",
          },
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 5,
          itemStyle: {
            // borderWidth: 0,
            color: "#FF0000",
          },
        },
        axisLabel: {
          color: "#464646",
          fontSize: 20,
          distance: -60,
          rotate: "tangential",
          formatter: function (value) {
            if (value === 0.5) {
              return "Grade A";
            } else if (value === 1.0) {
              return "Grade B";
            } else if (value === 1.5) {
              return "Grade C";
            } else if (value === 2.0) {
              return "Grade D";
            }
            return "";
          },
        },
        detail: { show: false },
        data: [
          {
            value: value,
          },
        ],
      },
      {
        name: "Pressure",
        type: "gauge",
        radius: "100%", // 크기를 키워서 여백 제거
        center: ["50%", "60%"], // 차트를 위로 올려서 상단 여백 제거
        startAngle: 180,
        endAngle: 0,
        min: 0.5,
        max: 2,
        grid: {
          top: 0,
          bottom: 0,
        },
        itemStyle: {
          color: "#008352",
        },
        splitNumber: 0,
        splitLine: {
          show: false,
        },
        axisTick: {
          splitNumber: 1,
          length: 124.5,
        },
        axisLabel: {
          color: "#464646",
          fontSize: 20,
          distance: -60,
          rotate: "tangential",
          formatter: function (value) {
            if (value === 0.5) {
              return "Grade A";
            } else if (value === 1.0) {
              return "Grade B";
            } else if (value === 1.5) {
              return "Grade C";
            } else if (value === 2.0) {
              return "Grade D";
            }
            return "";
          },
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.16666666666666666, "#5AB651"],
              [0.3333333333333333, "#89C983"],
              [0.5, "#F8C94A"],
              [0.6666666666666666, "#F8B500"],
              [0.8333333333333334, "#F78E00"],
              [1, "#E95371"],
            ],
          },
        },
        pointer: { show: false },
        detail: { show: false },
        progress: { show: false },
        anchor: { show: false },
      },
    ],
  };
  return option;
};
/** Radar 차트  */
export const createRadarChart = async (
  max_value_list,
  mean_value_list,
  value_list,
  line_color,
  width
) => {
  var option = {
    animation: false,
    radar: {
      indicator: max_value_list,
      name: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: { color: "#A6A6A6" },
      },
      splitLine: {
        show: false, // ✅ 중간 그리드 선 숨김
      },
      splitArea: {
        show: false,
      },
      radius: "100%",
    },
    series: [
      // ✅ max값을 따라 외곽선 하나만 그리는 시리즈
      {
        name: "외곽선",
        type: "radar",
        data: [
          {
            value: max_value_list.map((i) => i.max), // max 값으로 직접 외곽선 그림
            name: "Max Boundary",
          },
        ],
        lineStyle: {
          width: width,
          color: "#A6A6A6",
        },
        symbol: "none", // 꼭짓점 마커 없음
        areaStyle: {
          opacity: 0, // 배경 없음
        },
      },
      {
        name: "mean",
        type: "radar",
        data: [
          {
            value: mean_value_list,
            areaStyle: {
              color: "#ACDAA7",
            },
          },
        ],
        lineStyle: {
          width: 0, // ✅ 선 없음
        },
        symbolSize: 10,
        symbol: "none",
      },
      ,
      {
        name: "mass",
        type: "radar",
        data: [
          {
            value: value_list,
          },
        ],
        lineStyle: {
          color: line_color,
          width: width,
        },
        symbolSize: 10,
        symbol: "none",
      },
    ],
  };

  return option;
};

function indexToMax(index) {
  return index + 0.45;
}
function indexToMin(index) {
  return index - 0.45;
}
