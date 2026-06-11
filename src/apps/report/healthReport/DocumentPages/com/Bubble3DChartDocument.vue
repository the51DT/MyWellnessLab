<script setup>
import Plotly from 'plotly.js-dist-min'
import { vector_normalise } from '@/utils/common.js';
import { dataset_3d } from '@/utils/3dData.js';
import { ref, onMounted, onUnmounted, watch } from "vue";

// Props 정의
const props = defineProps({
  healthScoreData: Object,
  chartData: Array,
  left: Number,
  pdfScale: Number,
  save: Boolean,
  userInfo: Object
});

// Refs 정의
const target = ref(null);
const dataset3d = dataset_3d;
const scatter3d = ref(null);

// Lifecycle Hooks
onMounted(() => {
  if (scatter3d.value) {
    drawChart(props.healthScoreData.hq_oxi.score, props.healthScoreData.hq_met.score, props.healthScoreData.hq_musBal.score)
  }
});

onUnmounted(() => {
  if (scatter3d.value) {
    Plotly.purge(scatter3d.value);
  }
});
const converToImage = () => {
  // PDF 저장 시 이미지로 변환
  if (scatter3d.value) {
    if (/iPhone|iPod/i.test(navigator.userAgent) == false) {
      Plotly.toImage(scatter3d.value, {
        format: 'jpeg',
        width: scatter3d.value.clientWidth,
        height: scatter3d.value.clientHeight + 115,
      }).then(dataUrl => {
        const img = new Image();
        img.onload = () => {
          // Plotly DOM 제거
          Plotly.purge(scatter3d.value); // 완전 삭제!
          scatter3d.value.innerHTML = '';
          scatter3d.value.appendChild(img);
        };
        img.src = dataUrl;
      });
    }
  }
}
const drawChart = (x, y, z) => {

  var data_x = x;
  var data_y = y;
  var data_z = z;

  // var draw_text_location = { x: [x ** 2], y: [y ** 2], z: [10000] }; // '나의 위치' 텍스트 위치
  var draw_line_location = { x: [data_x ** 2, data_x ** 2], y: [data_y ** 2, data_y ** 2], z: [10000, data_z ** 2 + 300] }; // '나의 위치' 세로선 위치
  var draw_my_location_ring = { x: [data_x ** 2], y: [data_y ** 2], z: [data_z ** 2] };  // 나의 건강위치 파란색 링
  var draw_my_marker_circle = { x: [data_x ** 2], y: [data_y ** 2], z: [10000] }; // '나의 위치' 마커 동그라미 위치
  var draw_my_marker_diamond = { x: [data_x ** 2], y: [data_y ** 2], z: [10000] }; // '나의 위치' 마커 다이아몬드 위치

  var data_rand_x = [];
  var data_rand_y = [];
  var data_rand_z = [];
  var data_sum_list = [];
  var data_list = [];

  dataset3d.forEach((element) => {
    data_rand_x.push(element[0])
    data_rand_y.push(element[1])
    data_rand_z.push(element[2])
    data_sum_list.push(element[0] + element[1] + element[2])
  })

  var y = vector_normalise(data_sum_list);

  var data_rand_list = {
    x: data_rand_x,
    y: data_rand_y,
    z: data_rand_z,
    mode: 'markers',
    marker: {
      size: 1,
      color: y,
      colorscale: [
        [0, 'rgba(233,83,113, 1)'],
        [0.3, 'rgba(233,83,113, 1)'],
        [0.5, 'rgba(248,181,0, 1)'],
        [0.75, 'rgba(90,182,81, 1)'],
        [1, 'rgba(90,182,81, 1)']
      ],
      cmin: 0,
      cmax: 1,
      opacity: 0.6
    },
    hovermode: false,
    name: "",
    type: 'scatter3d'
  }
  /** 나의 위치 텍스트문구 */
  // var data_text = {
  //   x: draw_text_location.x,
  //   y: draw_text_location.y,
  //   z: draw_text_location.z,
  //   mode: 'lines+text',
  //   marker: {
  //     size: 1,
  //     color: 'rgba(0,181,221,1)'
  //   },
  //   textposition: ['top center'],
  //   type: 'scatter3d',
  //   text: ["나의 위치"],
  //   textfont: {
  //     color: 'rgba(0,181,221,1)',
  //     size: [8]
  //   }
  // };
  /** 나의 위치 파랑색 링 */
  var data_marker0_list = {
    x: draw_my_location_ring.x,
    y: draw_my_location_ring.y,
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 3 * props.pdfScale,
      color: 'rgba(0, 180, 222,1)'
    },
    type: 'scatter3d',
    hovermode: false,
  };
  /** 나의 위치 흰색 원형*/
  var data_marker1_list = {
    x: draw_my_location_ring.x,
    y: draw_my_location_ring.y,
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 1.5 * props.pdfScale,
      color: 'rgba(255, 255, 255,1)'
    },
    type: 'scatter3d',
    hovermode: false,
  };
  /** 나의위치 마커 동그라미 */
  var data_marker2_list = {
    x: draw_my_marker_circle.x,
    y: draw_my_marker_circle.y,
    z: draw_my_marker_circle.z,
    mode: 'markers',
    marker: {
      size: 3 * props.pdfScale,
      color: 'rgba(139, 128, 235,1)'
    },
    type: 'scatter3d',
    hovermode: false
  };
  /** 나의위치 마커 다이아몬드 (동그라미 바로 밑) */
  var data_marker3_list = {
    x: draw_my_marker_diamond.x,
    y: draw_my_marker_diamond.y,
    z: draw_my_marker_diamond.z,
    mode: 'markers',
    marker: {
      symbol: 'diamond',
      size: 3 * props.pdfScale,
      color: 'rgba(139, 128, 235,1)'
    },
    type: 'scatter3d',
    hovermode: false
  };
  /** 나의위치 세로선 */
  var data_line = {
    x: draw_line_location.x,
    y: draw_line_location.y,
    z: draw_line_location.z,
    mode: 'lines',
    line_width: 1,
    line: {
      color: 'rgba(139, 128, 235, 1)',
      dash: 'dash'
    },
    type: 'scatter3d',
    hovermode: false
  };
  const markerTrace = {
    type: 'scatter3d',
    mode: 'markers',
    x: [draw_my_location_ring.x[0], 10000, 10000],
    y: [0, draw_my_location_ring.y[0], 10000],
    z: [0, 0, draw_my_location_ring.z[0]],

    marker: {
      size: 3.3 * props.pdfScale,
      color: 'rgba(0, 180, 222,1)',
      opacity: 1
    },
    hoverinfo: 'skip',
    showlegend: false
  };
  // data_list.push(markerTrace) // 새로운 마커 텍스트 추가
  data_list.push(data_rand_list)  // 백그라운드 데이터셋
  // data_list.push(data_text) // 나의위치 텍스트
  data_list.push(data_marker0_list) // 실제 나의 위치 파랑색 링
  data_list.push(data_marker1_list) // 실제 나의 위치 흰색 링
  // data_list.push(data_marker2_list) // 나의 위치 마커 동그라미
  // data_list.push(data_marker3_list) // 나의 위치 마커 다이아몬드 (동그라미 바로 밑)
  // data_list.push(data_line) // 나의 위치 마커와 실제 나의 위치를 잇는 세로 선
  var data = data_list;
  var layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    },
    hovermode: false,
    scene: {
      dragmode: false,
      camera: {
        eye: { x: -1.5, y: 1.4, z: 0.3 } // 작게 줄이면 확대됨
      },
      xaxis: {
        gridwidth: 1 * props.pdfScale,
        linewidth: 1 * props.pdfScale,
        // scaleratio: 2,
        title: {
          font: {
            size: 5 * props.pdfScale
          },
          text: '노화 억제 분석 지수',
          standoff: 1,
        },
        automargin: false,
        showticklabels: false,
        range: [10000, 0]
      },
      yaxis: {
        gridwidth: 1 * props.pdfScale,
        linewidth: 1 * props.pdfScale,
        scaleratio: 2,
        title: {
          font: {
            size: 5 * props.pdfScale
          },
          text: '만성질환 억제 분석 지수'
        },
        showticklabels: false,
        range: [10000, 0]
      },
      zaxis: {
        gridwidth: 1 * props.pdfScale,
        linewidth: 1 * props.pdfScale,
        scaleratio: 2,
        title: {
          font: {
            size: 5 * props.pdfScale
          },
          text: '근육 밸런스 분석 지수'
        },
        showticklabels: false,
        range: [0, 10000]
      },
      // annotations: [
      //   {
      //     x: draw_my_location_ring.x[0],
      //     y: 0,
      //     z: 0,
      //     text: data_x,
      //     showarrow: false,
      //     font: {
      //       size: 5 * props.pdfScale,
      //       color: "white",
      //     },
      //     bgcolor: "rgba(255,255,255,0)", // ✅ 배경색
      //     bordercolor: "black",             // ✅ 테두리 색
      //     borderwidth: 0,                   // ✅ 테두리 두께
      //     opacity: 1,
      //     borderpad: 1
      //   },
      //   {
      //     x: 10000,
      //     y: draw_my_location_ring.y[0],
      //     z: 0,
      //     text: data_y,
      //     showarrow: false,
      //     font: {
      //       size: 5 * props.pdfScale,
      //       color: "white",
      //     },
      //     bgcolor: "rgba(255,255,255,0)", // ✅ 배경색
      //     bordercolor: "black",             // ✅ 테두리 색
      //     borderwidth: 0,                   // ✅ 테두리 두께
      //     opacity: 1,
      //     borderpad: 1
      //   },
      //   {
      //     x: 10000,
      //     y: 10000,
      //     z: draw_my_location_ring.z[0],
      //     text: data_z,
      //     showarrow: false,
      //     font: {
      //       size: 5 * props.pdfScale,
      //       color: "white",
      //     },
      //     bgcolor: "rgba(255,255,255,0)", // ✅ 배경색
      //     bordercolor: "black",             // ✅ 테두리 색
      //     borderwidth: 0,                   // ✅ 테두리 두께
      //     opacity: 1,
      //     borderpad: 1
      //   }
      // ]
    },
    showlegend: false,
  };
  /** 애니메이션 */
  Plotly.newPlot(scatter3d.value, data, layout, { displayModeBar: false, responsive: true, scrollZoom: false });

  if (props.save) {
    converToImage()
  }
}
watch(
  () => props.save,
  (newVal) => {
    if (newVal) {
      converToImage()
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="chart-wrap" ref="target">
    <div class="graph-wrap">
      <div class="echart" id="3dChart" ref="scatter3d">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.graph-wrap {
  width: calc(130.92px * $pdf-scale);
  transform: translate(8%, -13%);
}

.subject {
  position: absolute;
  z-index: 100;
  bottom: 50px;
  width: 100%;
  margin-left: 23px;
}

.over-wrap {
  position: absolute;
  z-index: 10;
  width: calc(125px * $pdf-scale);
  top: calc(35px * $pdf-scale);
  left: calc(22px * $pdf-scale);
  height: calc(114.08px * $pdf-scale);

  .label-x,
  .label-y {
    position: absolute;
    font-size: calc(4px * $pdf-scale);
    color: #727171 !important;
    @include flex(center, center);
    gap: 6px;

    img {
      width: 11px;
      height: 18px;
    }
  }

  .label-x {
    right: -30%;
    bottom: -5%;

    font-weight: 500;
    /* font-size: 10px; */
    line-height: 12px;
    /* identical to box height */

    img {
      transform: rotate(90deg);
    }
  }

  .label-y {
    /* transform: rotate(-90deg); */
    left: -23%;
    top: -7%;

    font-weight: 500;
    /* font-size: 4px; */
    line-height: 12px;
    /* identical to box height */

    img {
      transform: rotate(90deg);
    }
  }
}

.chart-wrap {
  // position: absolute;
  // right:0;
  /* margin: 20px auto; */
  width: calc(130.92px * $pdf-scale);
  height: calc(104.84px * $pdf-scale);
  position: relative;

  /* transform: translateX(-10%); */
  .legend-container {
    @include flex(center, center);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;

    .legend {
      display: inline-block;
      margin-right: calc(3px * $pdf-scale);

      width: calc(5px * $pdf-scale);
      height: calc(5px * $pdf-scale);
      background-color: #00B4DE;
    }

    span {
      display: inline-block;
      font-size: calc(6px * $pdf-scale);
      color: #000;
    }
  }
}

.echart {
  width: calc(130.92px * $pdf-scale);
  height: calc(104.84px * $pdf-scale);
  // width: 100%;
  /* max-width: 300px; */
  margin: 0 auto calc(50px * $pdf-scale);
}

.over-chart {
  position: absolute;
  top: 3%;
  left: 54%;
  transform: translate(-50%);
  z-index: 10;
  width: calc(249px * $pdf-scale);
  height: calc(257px * $pdf-scale);
  overflow: hidden;
}

.chart-text {
  text-align: center;
  width: 300px;
}

.graph-img {
  width: 230px;
  height: 230px;
  left: 10px;
  position: absolute;
}

.axis {
  position: absolute;
  left: 20px;
  top: -35px;
  object-fit: contain;
  width: 300px;
  height: 354px;
}

.none {
  color: transparent;
}

.position-back {
  width: calc(154.55px * $pdf-scale);
  height: auto;
  position: absolute;
  left: calc(22px * $pdf-scale);
  top: calc((39px) * $pdf-scale);
}

.position-scatter {
  position: absolute;
  top: calc(23.5px * $pdf-scale);
  left: calc(22px * $pdf-scale);
  /* left: 0; */
  /* top: 500px; */
  width: calc(125px * $pdf-scale);
  height: auto;
}
</style>
