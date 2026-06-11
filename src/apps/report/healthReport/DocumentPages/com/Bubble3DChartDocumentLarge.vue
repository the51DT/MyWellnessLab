<script setup>
import Plotly from 'plotly.js-dist-min'
import { vector_normalise } from '@/utils/common.js';
import { dataset_3d } from '@/utils/3dData.js';
import { ref, onBeforeMount, onMounted } from "vue";

// Props 정의
const props = defineProps({
  healthScoreData: Object,
  pdfScale: Number,
  save: Boolean,
});

// Refs 정의
const target = ref(null);
const dataset3d = dataset_3d;
const scatter3d = ref(null);

onBeforeMount(() => {
  scatter3d.value = document.getElementById('3dChartLarge');
});
// Lifecycle Hooks
onMounted(() => {
  drawChart(props.healthScoreData.hq_oxi.score, props.healthScoreData.hq_met.score, props.healthScoreData.hq_musBal.score)
  resizeChart();

});

const resizeChart = () => {
  Plotly.Plots.resize(document.querySelector('#chart'));
}
const converToImage = () => {
  // PDF 저장 시 이미지로 변환
  if (scatter3d.value) {
    if (/iPhone|iPod/i.test(navigator.userAgent) == false) {
      Plotly.toImage(scatter3d.value, {
        format: 'jpeg',
        width: scatter3d.value.clientWidth,
        height: scatter3d.value.clientHeight,
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

  var draw_my_location_ring = { x: [data_x ** 2], y: [data_y ** 2], z: [data_z ** 2] };  // 나의 건강위치 파란색 링
  
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
      size: 1.5,
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
      opacity: 1
    },
    hovermode: false,
    name: "",
    type: 'scatter3d',
    zorder: 1
  }
  /** 나의 위치 파랑색 링 */
  var data_marker0_list = {
    x: draw_my_location_ring.x,
    y: draw_my_location_ring.y,
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 4 * props.pdfScale,
      color: 'rgba(0, 180, 222,1)',
      opacity: 1
    },
    type: 'scatter3d',
    hovermode: false,
    name: "",
    zorder: 10
  };
  /** 나의 위치 흰색 원형*/
  var data_marker1_list = {
    x: draw_my_location_ring.x,
    y: draw_my_location_ring.y,
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 2 * props.pdfScale,
      color: 'rgba(255, 255, 255,1)',
      opacity: 1
    },
    type: 'scatter3d',
    hovermode: false,
    name: "",
    zorder: 10
  };
  const markerTrace = {
    type: 'scatter3d',
    mode: 'markers',
    x: [draw_my_location_ring.x[0], 9500, 0],
    y: [300, draw_my_location_ring.y[0], 0],
    z: [0, 0, draw_my_location_ring.z[0]],

    marker: {
      size: 6 * props.pdfScale,
      color: 'rgba(0, 180, 222,1)',
      opacity: 1
    },
    hoverinfo: 'skip',
    showlegend: false
  };
  data_list.push(data_rand_list)  // 백그라운드 데이터셋
  data_list.push(markerTrace) // 새로운 마커 텍스트 추가
  data_list.push(data_marker0_list) // 실제 나의 위치 파랑색 링
  data_list.push(data_marker1_list) // 실제 나의 위치 흰색 링
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
        showticklabels: true,
        tickvals: [0, 2000, 4000, 6000, 8000, 10000],  // 실제 위치
        ticktext: ['', '', '', '', '', ''],
        range: [10000, 0],
        title: {
          font: {
            size: 10 * props.pdfScale
          },
          text: '노화 억제 분석 지수',
        },
      },
      yaxis: {
        gridwidth: 1 * props.pdfScale,
        linewidth: 1 * props.pdfScale,
        showticklabels: true,
        tickvals: [0, 2000, 4000, 6000, 8000, 10000],  // 실제 위치
        ticktext: ['', '', '', '', '', ''],
        scaleratio: 2,
        title: {
          font: {
            size: 10 * props.pdfScale
          },
          text: '만성질환 억제 분석 지수'
        },
        range: [10000, 0]
      },
      zaxis: {
        gridwidth: 1 * props.pdfScale,
        linewidth: 1 * props.pdfScale,
        showticklabels: true,
        tickvals: [0, 2000, 4000, 6000, 8000, 10000],  // 실제 위치
        ticktext: ['', '', '', '', '', ''],
        scaleratio: 2,
        title: {
          font: {
            size: 10 * props.pdfScale
          },
          text: '근육 밸런스 분석 지수'
        },
        range: [0, 10000]
      },
      annotations: [
        {
          x: draw_my_location_ring.x[0],
          y: 300,
          z: 0,
          text: data_x,
          showarrow: false,
          font: {
            size: 8 * props.pdfScale,
            color: "white",
          },
          bgcolor: "rgba(255,255,255,0)", // ✅ 배경색
          bordercolor: "black",             // ✅ 테두리 색
          borderwidth: 0,                   // ✅ 테두리 두께
          opacity: 1,
          borderpad: 1
        },
        {
          x: 9500,
          y: draw_my_location_ring.y[0],
          z: 0,
          text: data_y,
          showarrow: false,
          font: {
            size: 8 * props.pdfScale,
            color: "white",
          },
          bgcolor: "rgba(255,255,255,0)", // ✅ 배경색
          bordercolor: "black",             // ✅ 테두리 색
          borderwidth: 0,                   // ✅ 테두리 두께
          opacity: 1,
          borderpad: 1
        },
        {
          x: 0,
          y: 0,
          z: draw_my_location_ring.z[0],
          text: data_z,
          showarrow: false,
          font: {
            size: 8 * props.pdfScale,
            color: "white",
          },
          bgcolor: "rgba(255,255,255,0)", // ✅ 배경색
          bordercolor: "black",             // ✅ 테두리 색
          borderwidth: 0,                   // ✅ 테두리 두께
          opacity: 1,
          borderpad: 1
        }
      ]
    },
    showlegend: false,
  };
  /** 애니메이션 */
  scatter3d.value = document.getElementById('chart');
  Plotly.newPlot(scatter3d.value, data, layout, { displayModeBar: false, responsive: true, scrollZoom: false });


  /** PDF 저장시 렌더링 이슈로 인해 이미지로 변환함 */
  if (props.save) {
    converToImage()
  }
}

</script>


<template>
  <div class="chart-wrap" ref="target">
    <div id="chart" ref="scatter3d" class="chart">
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.chart-wrap {
  position: relative;
  width: calc(343.7px * $pdf-scale) !important;
  height: calc(269.26px * $pdf-scale) !important;
  top: calc(-20px * $pdf-scale);
}

.chart {
  position: relative;
  width: calc(343.7px * $pdf-scale) !important;
  height: calc(269.26px * $pdf-scale) !important;
  transform: translateX(0%);
}

.my-point {
  position: absolute;
  left: -7.5%;
  bottom: 14% !important;
  border-top: calc(1.3px * $pdf-scale) solid #000;
  border-right: calc(1.3px * $pdf-scale) solid #000;

  span {
    position: absolute;
    top: -60px !important;
    transform: translate(-50%, 0%);

    background: #ffffff !important;
    box-shadow: 0px 0px 5px rgba(75, 92, 69, 0.2);
    border-radius: 123px;
    padding: 3px 4px;

    font-weight: 600;
    font-size: 14px;
    line-height: 17px;

    display: flex;
    align-items: center;
    text-align: center;

    color: #414042;
  }

  img {
    position: absolute;
    width: 60px;
    height: auto;
  }

  .x-indicator {
    position: absolute;
    font-size: calc(10px * $pdf-scale);
    font-weight: 500;
    color: #00b4de;
    left: 0;
    top: 0;
    transform: translate(-125%, -50%);
  }

  .y-indicator {
    position: absolute;
    font-size: calc(10px * $pdf-scale);
    font-weight: 500;
    color: #00b4de;
    right: 0;
    bottom: 0;
    transform: translate(50%, 125%);
  }
}


.my-point-pointer {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -120%);
  height: calc(5.68px * $pdf-scale);
  width: calc(1px * $pdf-scale);
  background-color: #00b4de;

  .point {
    position: absolute;
    z-index: 100;
    width: calc(4.46px * $pdf-scale);
    height: calc(4.46px * $pdf-scale);
    border-radius: 50%;
    border: calc(1px * $pdf-scale) solid #00b4de;
    background-color: white;
    bottom: 0;
    bottom: calc(-2.23px * $pdf-scale);
    right: calc(-2.23px * $pdf-scale);
  }
}
</style>
