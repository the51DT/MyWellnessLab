<script setup>
 
import Plotly from 'plotly.js-dist-min'
import { vector_normalise } from '@/utils/common.js';
import { dataset_3d } from '@/utils/3dData.js';
import { onBeforeMount, onMounted, ref, onUpdated, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
 
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
const wellnessScatter3d = ref(null);
const is_animation_running = ref(true);
const animation_frame = ref(null);
 
onBeforeMount(() => {
});
onMounted(async () => {
  /** 카드 재진입시 다시 그려주기 위해 */
  await nextTick();
  drawChart(props.oxi, props.met, props.mus)
  resizeChart();
  // animationRun(true);
  window.addEventListener("resize", resizeChart);
});
// onUpdated 훅 제거 - 차트 클릭 시 크기 변경 방지
// onUpdated(() => {
//   /** props 가 모두 업데이트 완료되면 실행 */
//   drawChart(props.oxi, props.met, props.mus);
//   resizeChart();
// })
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart);
})
const resizeChart = () => {
  Plotly.Plots.resize(document.querySelector('#Wellness3DChart .Wellness3DChart-container'));
  
}
const drawChart = (x, y, z) => {
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent); // 새 엣지
    const isEdgeLegacy = /Edge/.test(userAgent); // 구 엣지
    const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    
    return { isChrome, isEdge, isEdgeLegacy, isSafari, isFirefox };
  };

  // 브라우저별 마커 크기 설정
  const getMarkerSize = () => {
    const browser = getBrowserInfo();
    const pixelRatio = window.devicePixelRatio || 1;
    
    // 기본값
    let size = 5;
    if (browser.isEdge || browser.isEdgeLegacy) {
      // 크롬은 작게 (WebGL에서 크게 렌더링됨)
      size = pixelRatio > 1.5 ? 10 : 12;
    } else if (browser.isChrome) {
      // 엣지는 보통 (적당히 렌더링됨)
      size = pixelRatio > 1.5 ? 5 : 5;
    } else if (browser.isSafari) {
      // 사파리
      size = pixelRatio > 1.5 ? 12 : 15;
    } else if (browser.isFirefox) {
      // 파이어폭스
      size = pixelRatio > 1.5 ? 14 : 16;
    }
    return size;
  };
  var data_x = x;
  var data_y = y;
  var data_z = z;
  // var draw_text_location = { x: [x ** 2], y: [y ** 2], z: [10000] }; // '나의 위치' 텍스트 위치
  var draw_line_location = { x: [data_x ** 2, data_x ** 2], y: [data_y ** 2, data_y ** 2], z: [10000, data_z ** 2 + 300] }; // '나의 위치' 세로선 위치
  var draw_my_location_ring = { x: [data_x ** 2], y: [data_y ** 2], z: [data_z ** 2] };  // 나의 건강위치 파란색 링
  var draw_my_marker_circle = { x: [data_x ** 2], y: [data_y ** 2], z: [10000] }; // '나의 위치' 마커 동그라미 위치 (핀 머리)
  var draw_my_marker_diamond = { x: [data_x ** 2], y: [data_y ** 2], z: [10000] }; // '나의 위치' 마커 다이아몬드 위치 (핀 끝)
 
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
 
  var norm_y = vector_normalise(data_sum_list);
 
  var data_rand_list = {
    x: data_rand_x,
    y: data_rand_y,
    z: data_rand_z,
    mode: 'markers',
    marker: {
      size: 0.5,
      color: norm_y,
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
    hoverinfo: 'skip', // 호버 정보 완전히 비활성화
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
  /** 나의 위치 파란색 링 */
  var data_marker0_list = {
    x: draw_my_location_ring.x,
    y: draw_my_location_ring.y,
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 4,
      color: '#00afec'
    },
    type: 'scatter3d',
    hoverinfo: 'skip',
    hovermode: false,
    name: "",
  };
  /** 나의 위치 흰색 원형*/
  var data_marker1_list = {
    x: draw_my_location_ring.x,
    y: draw_my_location_ring.y,
    z: draw_my_location_ring.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 2.5,
      color: 'rgba(255,255,255,1)'
    },
    type: 'scatter3d',
    hoverinfo: 'skip',
    hovermode: false,
    name: "",
  };
  /** 나의위치 마커 동그라미 */
  var data_marker2_list = {
    x: draw_my_marker_circle.x,
    y: draw_my_marker_circle.y,
    z: draw_my_marker_circle.z,
    mode: 'markers',
    marker: {
      symbol: 'circle',
      size: 4,
      color: '#00afec',
      line: {
        color: '#00afec',
        width: 2
      }
    },
    type: 'scatter3d',
    hoverinfo: 'skip',
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
      color: '#00afec',
      dash: 'dash'
    },
    type: 'scatter3d',
    hoverinfo: 'skip',
    hovermode: false
  };
  const markerSize = getMarkerSize();
  // markerTrace 정의 전에 배경 원형 마커 추가
  const backgroundCirclesForAnnotation = {
    
    type: 'scatter3d',
    mode: 'markers',
    x: [draw_my_location_ring.x[0], 10000, 0],
    y: [0, draw_my_location_ring.y[0], 0],
    z: [0, 0, draw_my_location_ring.z[0]],
    marker: {
      symbol: 'circle',
      size: markerSize, // annotation 텍스트보다 크게
      color: 'black',
      sizemode: 'diameter',
      opacity: 0.9,
      line: {
        color: 'black',
        width: 0
      }
    },
    hoverinfo: 'skip',
    showlegend: false
  };
  const markerTrace = {
  type: 'scatter3d',
  mode: 'markers',
  x: [draw_my_location_ring.x[0], 10000, 0],
  y: [0, draw_my_location_ring.y[0], 0],
  z: [0, 0, draw_my_location_ring.z[0]],

  marker: {
    symbol: 'circle',
    size: 8,  // 
    color: '#222222',
    opacity: 1
  },
  hoverinfo: 'skip',
  showlegend: false
};
  //data_list.push(backgroundCirclesForAnnotation); // 먼저 배경
  data_list.push(markerTrace) // 새로운 마커 텍스트 추가
  data_list.push(data_rand_list)  // 백그라운드 데이터셋
  // data_list.push(data_text) // 나의위치 텍스트
  data_list.push(data_marker0_list) // 실제 나의 위치 파랑색 링
  data_list.push(data_marker1_list) // 실제 나의 위치 흰색 링
  //data_list.push(data_marker2_list) // 나의 위치 마커 동그라미 (핀 머리)
  //data_list.push(data_marker3_list) // 나의 위치 마커 다이아몬드 (핀 끝)
  //data_list.push(data_line) // 나의 위치 마커와 실제 나의 위치를 잇는 세로 선
  var data = data_list;
  var layout = {
    // width, height 제거 - responsive로 자동 조정
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: false,
    hoverlabel: {
      bgcolor: 'transparent',
      bordercolor: 'transparent',
      font: {
        color: 'transparent'
      }
    },
         scene: {
       camera: {
         eye: {
           x: -1.8,
           y: 2.0,
           z: 0
         }
       },
        dragmode: 'orbit', // 드래그로 회전 가능
        hovermode: false,
        showspikes: false, // 스파이크 라인 완전 비활성화
        spikedistance: -1, // 스파이크 거리 비활성화
        hoverinfo: 'skip', // 호버 정보 완전 비활성화
      xaxis: {
        // scaleratio: 2,
        title: {
          font: {
            size: 9
          },
          text: t('Bubble3DChart.agingSuppressionIndex'),
          position: 0.2,
        },
        automargin: true,
        showticklabels: false,
        showspikes: false, // X축 스파이크 라인 비활성화
        spikedistance: -1, // X축 스파이크 거리 비활성화
        range: [10000, 0]
      },
      yaxis: {
        scaleratio: 2,
        title: {
          font: {
            size: 9
          },
          text: t('Bubble3DChart.chronicDiseaseSuppressionIndex')
        },
        showticklabels: false,
        showspikes: false, // Y축 스파이크 라인 비활성화
        spikedistance: -1, // Y축 스파이크 거리 비활성화
        range: [10000, 0]
      },
      zaxis: {
        scaleratio: 2,
        title: {
          font: {
            size: 9
          },
          text: t('Bubble3DChart.muscleBalanceIndex')
        },
        showticklabels: false,
        showspikes: false, // Z축 스파이크 라인 비활성화
        spikedistance: -1, // Z축 스파이크 거리 비활성화
        range: [0, 10000]
      },
      annotations: [
         {
          x: draw_my_location_ring.x[0],
          y: 0,
          z: 0,
          text: data_x,
          showarrow: false,
          font: {
            size: 10,
            color: "white",
          },
          bgcolor: "transparent", // ✅ 배경색
          borderwidth: 0,                   // ✅ 테두리 두께
          opacity: 1,
          borderpad: 1
         },
         {
           x: 10000,
           y: draw_my_location_ring.y[0],
           z: 0,
           text: data_y,
           showarrow: false,
           font: {
             size: 10,
             color: "white",
           },
           bgcolor: "transparent", // ✅ 배경색
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
             size: 10,
             color: "white",
           },
           bgcolor: "transparent", // ✅ 배경색
           borderwidth: 0,                   // ✅ 테두리 두께
           opacity: 1,
           borderpad: 1
         }
       ]
    },
    showlegend: false,
  };
  /** 애니메이션 */
  wellnessScatter3d.value = document.getElementById('wellness-chart');
  Plotly.newPlot(wellnessScatter3d.value, data, layout, { 
    displayModeBar: false, 
    responsive: true, 
    scrollZoom: false,
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'resetScale2d', 'toggleSpikelines'],
    modeBarButtonsToAdd: [],
    doubleClick: false, // 더블클릭 확대 방지
    showTips: false,
    staticPlot: false,
    editable: false,
    selectable: false,
    hovermode: false, // 전역 호버 모드 비활성화
    hoverinfo: 'skip' // 전역 호버 정보 비활성화
  });

  // 휠 스크롤 방해 방지를 위한 강력한 설정
  const plotlyContainer = wellnessScatter3d.value.querySelector('.plotly');
  if (plotlyContainer) {
    // 휠 이벤트를 완전히 차단하여 페이지 스크롤 우선
    plotlyContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // 수동으로 페이지 스크롤 실행
      window.scrollBy(0, e.deltaY);
    }, { passive: false });

    // 마우스 호버 이벤트 완전 차단
    plotlyContainer.addEventListener('mouseenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    plotlyContainer.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    // 호버 관련 모든 이벤트 차단
    ['mouseover', 'mouseout', 'mousemove'].forEach(eventType => {
      plotlyContainer.addEventListener(eventType, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Plotly 호버 관련 DOM 요소들을 주기적으로 제거
    const removeHoverElements = () => {
      const hoverElements = plotlyContainer.querySelectorAll('.hoverlayer, .hovertext, .spikeline, .spikeline-3d, .spikeline-x, .spikeline-y, .spikeline-z, .spikeline-xy, .spikeline-xz, .spikeline-yz');
      hoverElements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      // 3D 격자 호버 효과 제거
      const gridElements = plotlyContainer.querySelectorAll('.scene .grid, .scene .axis');
      gridElements.forEach(el => {
        if (el) {
          el.style.pointerEvents = 'none';
          el.style.userSelect = 'none';
        }
      });
    };

    // 즉시 제거
    removeHoverElements();
    
    // 주기적으로 제거 (Plotly가 다시 생성하는 경우 대비)
    const hoverCleanupInterval = setInterval(removeHoverElements, 100);
    
    // 컴포넌트 언마운트 시 인터벌 정리
    onBeforeUnmount(() => {
      clearInterval(hoverCleanupInterval);
    });
  }
}
const animationRun = (animation_force_run = false) => {
  if (is_animation_running.value) {
    /** 마우스를 누르고 떼지 않을때 ( 첫 진입시)*/
    rotate('scene', Math.PI / 300);
    animation_frame.value = requestAnimationFrame(animationRun)
  } else {
    /** 마우스를 누르고 뗄때 */
    if (animation_force_run) {
      Plotly.relayout(wellnessScatter3d.value, 'scene.camera.eye', { x: -1, y: 2, z: 1 });
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
  var eye0 = wellnessScatter3d.value.layout[id].camera.eye
  var rtz = xyz2rtz(eye0);
  rtz.t += angle;
  var eye1 = rtz2xyz(rtz);
  Plotly.relayout(wellnessScatter3d.value, id + '.camera.eye', eye1)
}
const animationStop = () => {
  is_animation_running.value = false
  animation_frame.value = cancelAnimationFrame(animationRun)
}
 
const rotateInterval = ref(null);
 
const startRotate = (id, direction, axis = 'horizontal') => {
  if (rotateInterval.value) return;
 
  rotateInterval.value = setInterval(() => {
    if (axis === 'horizontal') {
      rotate(id, direction * (Math.PI / 180)); // 좌우 회전 (Y축 기준)
    } else {
      rotateVertical(id, direction * (Math.PI / 180)); // 위아래 회전 (X축 기준)
    }
  }, 16); // 약 60FPS 속도
};
 
const stopRotate = () => {
  clearInterval(rotateInterval.value);
  rotateInterval.value = null;
};

// 위아래 회전을 위한 새로운 함수 추가
const rotateVertical = (id, angle) => {
  var eye0 = wellnessScatter3d.value.layout[id].camera.eye
  
  // 현재 각도 계산 (Z축 기준)
  var currentAngle = Math.atan2(eye0.z, Math.sqrt(eye0.x * eye0.x + eye0.y * eye0.y));
  
  // 새로운 각도 계산
  var newAngle = currentAngle + angle;
  
  // 60도 제한으로 줄여서 뒤집힘 방지 (약 1.05 라디안)
  var maxAngle = Math.PI * 0.25; // 약 60도
  var minAngle = -Math.PI * 0.25; // 약 -60도
  
  if (newAngle > maxAngle) {
    newAngle = maxAngle;
  } else if (newAngle < minAngle) {
    newAngle = minAngle;
  }
  
  // 더 안전한 회전 방식 - 각도 제한을 더 엄격하게
  var distance = Math.sqrt(eye0.x * eye0.x + eye0.y * eye0.y + eye0.z * eye0.z);
  
  // X, Y축은 고정하고 Z축만 변경하여 좌표계 뒤바뀜 방지
  var newEye = {
    x: eye0.x,
    y: eye0.y,
    z: distance * Math.sin(newAngle) // sin 함수 사용으로 더 안전한 회전
  };
  
  // 거리를 원래대로 유지
  var newDistance = Math.sqrt(newEye.x * newEye.x + newEye.y * newEye.y + newEye.z * newEye.z);
  var scale = distance / newDistance;
  newEye.x *= scale;
  newEye.y *= scale;
  newEye.z *= scale;
  
  Plotly.relayout(wellnessScatter3d.value, id + '.camera.eye', newEye)
}

// 차트를 초기 위치로 리셋하는 함수 (기존 drawChart 활용)
const resetChart = () => {
  drawChart(props.oxi, props.met, props.mus);
}
 
</script>
 
 
<template>
  <div id="Wellness3DChart">
    <div class="Wellness3DChart-container" ref="target">
      <div id="wellness-chart" ref="wellnessScatter3d" class="chart" />
      <div class="btn-reload" @click="resetChart">
        <span>{{ $t('Bubble3DChart.resetPosition') }}</span>
        <img src="/img/ic_reload_mint.svg" alt="reload">
      </div>
      <div class="arrow-container">
        <!-- 위쪽 화살표 -->
        <div class="arrow-up" @click="rotateVertical('scene', Math.PI / 100)" @mousedown="startRotate('scene', +1, 'vertical')"
          @mouseup="stopRotate" @mouseleave="stopRotate" @touchstart.prevent="startRotate('scene', +1, 'vertical')"
          @touchend="stopRotate" @touchcancel="stopRotate"></div>
        
        <!-- 아래쪽 화살표 -->
        <div class="arrow-down" @click="rotateVertical('scene', -Math.PI / 100)" @mousedown="startRotate('scene', -1, 'vertical')"
          @mouseup="stopRotate" @mouseleave="stopRotate" @touchstart.prevent="startRotate('scene', -1, 'vertical')"
          @touchend="stopRotate" @touchcancel="stopRotate"></div>
        
        <!-- 왼쪽 화살표 -->
        <div class="arrow-left" @click="rotate('scene', Math.PI / 100)" @mousedown="startRotate('scene', +1, 'horizontal')"
          @mouseup="stopRotate" @mouseleave="stopRotate" @touchstart.prevent="startRotate('scene', +1, 'horizontal')"
          @touchend="stopRotate" @touchcancel="stopRotate"></div>
        
        <!-- 오른쪽 화살표 -->
        <div class="arrow-right" @click="rotate('scene', -Math.PI / 100)" @mousedown="startRotate('scene', -1, 'horizontal')"
          @mouseup="stopRotate" @mouseleave="stopRotate" @touchstart.prevent="startRotate('scene', -1, 'horizontal')"
          @touchend="stopRotate" @touchcancel="stopRotate"></div>
      </div>
    </div>
  </div>
</template>

<style>
#Wellness3DChart .Wellness3DChart-container {
    position: relative;
    margin: 0px auto 1.875rem;
    width: 100%;
}

#Wellness3DChart .btn-reload {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  width: 8.4rem;
  height: 2.6rem;
  padding: 0.5rem 0;
  border-radius: 1.3rem;
  transition: background-color 0.2s ease;
  border: 1px solid #1DB196;
  font-size: 1.2rem;
  color: #1DB196;
  background: #fff;
  font-family: "RixSinHead_Medium", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  @media (min-width: 960px) {
    top: -5rem;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  span{
    line-height: 1.2rem;
  }
  img{
    width: 1.6rem;
    height: 1.6rem;
    vertical-align: middle;
  }
}

#Wellness3DChart .arrow-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: 100%;
    @media (min-width: 960px) {
      display: none;
    }
}

#Wellness3DChart .arrow-container .arrow-left {
  left: -4%;
  top: 50%;
  position: absolute;
  display: inline-block;
  width: .625rem;
  height: .625rem;
  border-top: 2px solid #545759;
  border-left: 2px solid #545759;
  transform: rotate(-45deg);
  margin: 5px;
  cursor: pointer;
  @media (min-width: 960px) {
    left: 0;
  }
}

#Wellness3DChart .arrow-container .arrow-right {
  right: -4%;
  top: 50%;
  position: absolute;
  display: inline-block;
  width: .625rem;
  height: .625rem;
  border-top: 2px solid #545759;
  border-left: 2px solid #545759;
  transform: rotate(135deg);
  margin: 5px;
  cursor: pointer;
  @media (min-width: 960px) {
    right: 0;
  }
}

/* 위쪽 화살표 */
#Wellness3DChart .arrow-container .arrow-up {
  top: -156px; /* -2%에서 -15%로 변경하여 더 위로 이동 */
  left: 50%;
  position: absolute;
  display: inline-block;
  width: .625rem;
  height: .625rem;
  border-top: 2px solid #545759;
  border-right: 2px solid #545759;
  transform: rotate(-45deg) translateX(-50%);
  margin: 5px;
  cursor: pointer;
}

/* 아래쪽 화살표 */
#Wellness3DChart .arrow-container .arrow-down {
  bottom: -178px;
  left: 50%;
  position: absolute;
  display: inline-block;
  width: .625rem;
  height: .625rem;
  border-top: 2px solid #545759;
  border-right: 2px solid #545759;
  transform: rotate(135deg) translateX(-50%);
  margin: 5px;
  cursor: pointer;
}

#Wellness3DChart .chart {
    width: 100%;
    height: 300px; /* 높이를 줄여서 왼쪽 글자가 보이도록 */
    -webkit-user-select: none; /* 웹킷 선택 방지 */
    -moz-user-select: none; /* 파이어폭스 선택 방지 */
    -ms-user-select: none; /* IE 선택 방지 */
    user-select: none; /* 텍스트 선택 방지 */
    pointer-events: auto; /* 마우스 이벤트 허용하되 호버 효과만 차단 */
    @media (min-width: 960px) {
      transform: scale(1.6);
      transform-origin: center center;
      padding-top: 1rem;
    }
}

/* Plotly 호버 효과 완전 차단 */
#Wellness3DChart .chart .plotly .hoverlayer {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

#Wellness3DChart .chart .plotly .hovertext {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

#Wellness3DChart .chart .plotly .spikeline {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

#Wellness3DChart .chart .plotly .spikeline-3d {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

/* 3D 격자 호버 효과 차단 */
#Wellness3DChart .chart .plotly .scene .grid {
    pointer-events: none !important;
}

#Wellness3DChart .chart .plotly .scene .axis {
    pointer-events: none !important;
}

/* 모든 스파이크 라인 차단 */
#Wellness3DChart .chart .plotly .spikeline,
#Wellness3DChart .chart .plotly .spikeline-3d,
#Wellness3DChart .chart .plotly .spikeline-x,
#Wellness3DChart .chart .plotly .spikeline-y,
#Wellness3DChart .chart .plotly .spikeline-z,
#Wellness3DChart .chart .plotly .spikeline-xy,
#Wellness3DChart .chart .plotly .spikeline-xz,
#Wellness3DChart .chart .plotly .spikeline-yz {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

/* 3D 격자 호버 시 진한 선 차단 */
#Wellness3DChart .chart .plotly .scene .grid line {
    pointer-events: none !important;
}

#Wellness3DChart .chart .plotly .scene .axis line {
    pointer-events: none !important;
}
</style>