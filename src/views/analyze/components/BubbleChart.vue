
<script setup>
import Plotly from 'plotly.js-dist-min'
import { vector_normalise } from '@/utils/common.js';
import { dataset_3d } from '@/utils/3dData.js';
import { onBeforeMount, onMounted, ref, onUpdated, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  // 노화억제지수
  oxi: { 
    type: Number,
    required: true
  },
  // 만성질환 지수
  met: {
    type: Number,
    required: true
  },
  // 근육 밸런스 지수
  mus: {
    type: Number,
    required: true
  }
})

const target = ref(null);
const dataset3d = dataset_3d;
const scatter3d = ref(null);
const is_animation_running = ref(true);
const animation_frame = ref(null);

onBeforeMount(() => {
  scatter3d.value = document.getElementById('chart');
});
onMounted (async () => {
  /** 카드 재진입시 다시 그려주기 위해 */
  await nextTick();
  drawChart(props.oxi, props.met, props.mus)
  resizeChart();
  animationRun(true);
  window.addEventListener("resize", resizeChart);
});
onUpdated (() => {
  /** props 가 모두 업데이트 완료되면 실행 */
  drawChart(props.oxi, props.met, props.mus);
  resizeChart();
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart);
})
const resizeChart = () => {
  Plotly.Plots.resize(document.querySelector('#HealthLocationPage .container'));
}
/**
 * Config 로 빼놓기에 어려운 부분이 있을것 같음
 * 
 */
const drawChart = (x, y, z) => {
  var draw_text_location = { x: [x**2], y: [y**2], z: [10000] }; // '나의 위치' 텍스트 위치
  var draw_line_location = { x: [x**2, x ** 2], y: [y ** 2, y ** 2], z: [10000, z ** 2]}; // '나의 위치' 세로선 위치
  var draw_my_location_ring = {x: [x ** 2], y: [y ** 2], z: [z ** 2]};  // 나의 건강위치 파란색 링
  var draw_my_marker_circle = { x: [x ** 2], y: [y ** 2], z: [10000]}; // '나의 위치' 마커 동그라미 위치
  var draw_my_marker_diamond = { x: [x ** 2], y: [y ** 2], z: [9990]}; // '나의 위치' 마커 다이아몬드 위치
  
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
      size: 0.5,
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
      opacity: 0.5  
    },
    hovermode: false,
    name:"",
    type: 'scatter3d'
  }
  /** 나의 위치 텍스트문구 */
  var data_text = {
    x: draw_text_location.x, 
    y: draw_text_location.y, 
    z: draw_text_location.z,
    mode: 'lines+text',
    marker: {
      size: 1,
      color: 'rgba(0,181,221,1)'
    },
    textposition: ['top center'],
    type: 'scatter3d',
    text: ["나의 위치"],
    textfont: {
      color: 'rgba(0,181,221,1)',
      size: [8]
    }
  };
  /** 나의 위치 파랑색 링 */
  var data_marker0_list = {
    x: draw_my_location_ring.x, 
    y: draw_my_location_ring.y, 
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 4,
      color: 'rgba(0,181,221,1)',
    },
    type: 'scatter3d',
    hovermode: false,
    name:"",
  };
  /** 나의 위치 흰색 원형*/
  var data_marker1_list = {
    x: draw_my_location_ring.x, 
    y: draw_my_location_ring.y, 
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 2,
      color: 'rgba(255,255,255,1)'
    },
    type: 'scatter3d',
    hovermode: false,
    name:"",
  };
  /** 나의위치 마커 동그라미 */
  var data_marker2_list = {
    x: draw_my_marker_circle.x, 
    y: draw_my_marker_circle.y, 
    z: draw_my_marker_circle.z,
    mode: 'markers',
    marker: {
      size: 4,
      color: 'rgba(0,181,221,1)'
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
      size: 3,
      color: 'rgba(0,181,221,1)'
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
    line_width:2,
    line: {
      color: 'rgba(0,181,221,1)'
    },
    type: 'scatter3d',
    hovermode: false
  };
  data_list.push(data_rand_list)  // 백그라운드 데이터셋
  data_list.push(data_text) // 나의위치 텍스트
  data_list.push(data_marker0_list) // 실제 나의 위치 파랑색 링
  data_list.push(data_marker1_list) // 실제 나의 위치 흰색 링
  data_list.push(data_marker2_list) // 나의 위치 마커 동그라미
  data_list.push(data_marker3_list) // 나의 위치 마커 다이아몬드 (동그라미 바로 밑)
  data_list.push(data_line) // 나의 위치 마커와 실제 나의 위치를 잇는 세로 선
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
      camera: {
        eye : {
          x : -1.5, 
          y : 2, 
          z : 1,
        }
      },
      xaxis: {
        scaleratio: 2,
        title: {
          font: {
            size: 12
          },
          text: '노화 억제 분석 지수'
        },
        showticklabels: false,
        range: [10000, 0]
      },
      yaxis: {
        scaleratio: 2,
        title: {
          font: {
            size: 12
          },
          text: '만성질환 억제 분석 지수'
        },
        showticklabels: false,
        range: [10000, 0]
      },
      zaxis: {
        scaleratio: 2,
        title: {
          font: {
            size: 12
          },
          text: '근육 밸런스 분석 지수'
        },
        showticklabels: false,
        range: [0, 10000]
      }
    },
    showlegend:false,
  };
  /** 애니메이션 */
  scatter3d.value = document.getElementById('chart');
  Plotly.newPlot(scatter3d.value, data, layout, {displayModeBar: false, responsive: true, scrollZoom: false});
}
const animationRun = (animation_force_run=false) => {
  if(is_animation_running.value) {
    /** 마우스를 누르고 떼지 않을때 ( 첫 진입시)*/
    rotate('scene', Math.PI / 300);
    animation_frame.value = requestAnimationFrame(animationRun)
  } else {
    /** 마우스를 누르고 뗄때 */
    if(animation_force_run) {
      Plotly.relayout(scatter3d.value, 'scene.camera.eye', {x: -1, y:2, z:1});
      is_animation_running.value = true
    }
  }
}

const xyz2rtz = (xyz) => {
  return {
    r: Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y),
    t: Math.atan2(xyz.y, xyz.x),
    z: xyz.z
  };
}

const rtz2xyz = (rtz) => {
  return {
    x: rtz.r * Math.cos(rtz.t),
    y: rtz.r * Math.sin(rtz.t),
    z: rtz.z
  };
} 
const rotate = (id, angle) => {
  var eye0 = scatter3d.value.layout[id].camera.eye
  var rtz = xyz2rtz(eye0);
  rtz.t += angle;
  var eye1 = rtz2xyz(rtz);
  Plotly.relayout(scatter3d.value, id + '.camera.eye', eye1)
}
const animationStop = () => {
  is_animation_running.value = false
  animation_frame.value = cancelAnimationFrame(animationRun)
}
</script>


<template>
  <div id="HealthLocationPage" >
    <div class="container" ref="target">
      <div id="chart" ref="chart" class="chart" v-on:pointerdown="animationStop" v-on:pointerup="animationRun(true)" ></div>
    </div>
  </div>
  
</template>
