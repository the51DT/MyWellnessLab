<script setup>
import * as echarts from "echarts";

// import { sessionStore } from '@/store/store'
import { convexHull } from "@/utils/hull.js";

import { isMobile, centroid, getVector } from "@/utils/common.js";
import { clustering } from "@/utils/clustering.js";
import { onBeforeMount, onMounted, ref, onUnmounted } from "vue";

const emit = defineEmits(['zoomMode'])
const props = defineProps({
  healthNetworkData: {
    type: Object,
    required: true,
  },
  pdfScale: Number,
  userInfo: {
    type: Object,
    required: true
  }
});

// const useSessionStore = sessionStore();
const chart = ref(null);
const chart2 = ref(null); // useConvexHull
const chartwrap = ref(null);
const linkList = ref(null); // 노드 연결정보 리스트

let scale = ref(1);
let scaleMax = 3;
let scaleMin = 1;
let x = ref(0);
let y = ref(0);
const useConvexHull = ref(false);
let loading = true;
let zoomIndex = ref(1);
let dangerCount = ref(0);
let warnCount = ref(0);
let interestCount = ref(0);
let controlClientWidth = 180; // 차트 너비 조절
let renderer = "canvas";
let resolution = 1;
let init = ref(0);
// let userInfo = useSessionStore.getUserInfo();
const wrapper = ref(null);

onBeforeMount(async () => {

});
onUnmounted(() => {
  // window.removeEventListener("resize", resizeChart, { passive: false });
});
onMounted(async () => {
  init.value = 0;
  // props.healthNetworkData = props.datas;

  // S_Node_ID -> source, E_Node_ID -> target 연결정보 데이터 세팅
  let convertedLinks = [];
  let echart2 = null;

  props.healthNetworkData.edgeList.forEach((element) => {
    convertedLinks.push({
      ...element,
    });
  });
  // 연결정보 리스트에 인덱스값 추가
  linkList.value = convertedLinks;
  linkList.value.forEach((element, index) => {
    element.index = index;
  });

  const echart = echarts.init(chart.value, null, { renderer: renderer });

  if (useConvexHull.value) {
    echart2 = echarts.init(chart2.value, null, { renderer: renderer });
  }
  await updateChart();

  window.onresize = echart.resize;
  // window.addEventListener("resize", resizeChart, { passive: false });

  const optionFunc = getOption2;

  const updateFunc = updatePos;


  updateFunc(0, 0);
  echart.on("graphroam", function (params) {
    const option = optionFunc();
    updateFunc(params.dx, params.dy);
    if (useConvexHull.value) echart2.setOption(option, { lazyUpdate: false });
  });

  resizeChart()

  loading = true;
  props.healthNetworkData.clusterList.forEach((element) => {
    element.nodes = props.healthNetworkData.nodeList.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    );
    element.nodes.forEach((elem) => {
      elem.symbol = "triangle";
      if (elem.Node_Category.includes("Core")) {
        elem.symbol = "circle";
      }
    });
  });
  props.healthNetworkData.clusterList = props.healthNetworkData.clusterList.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace("CL_", "")) -
      Number(b.Cluster_ID.replace("CL_", ""))
    );
  });
  await countClusterState();

})
const countClusterState = async () => {
  dangerCount.value = 0;
  warnCount.value = 0;
  interestCount.value = 0;

  props.healthNetworkData.clusterList.forEach((element, index) => {
    let includeSex = true;
    props.healthNetworkData.cluster_left_list.forEach((element2) => {
      if (element2.index === index) {
        if
          (element2.sex && element2.sex != userInfo.user_gender)
          includeSex = false;
      }
    });
    props.healthNetworkData.cluster_right_list.forEach((element2) => {
      if (element2.index === index) {
        if (element2.sex && element2.sex !== userInfo.user_gender)
          includeSex = false;
      }
    });
    if (includeSex) {
      switch (element.Cluster_State) {
        case 0:
        case 1:
          break;
        case 2:
          warnCount.value++;
          break;
        case 3:
          dangerCount.value++;
          break;
        case 4:
          interestCount.value++;
          break;
      }
      if (element.Cluster_State >= 40) {
        switch (element.Cluster_State - 40) {
          case 0:
          case 1:
            break;
          case 2:
            warnCount.value++;
            break;
          case 3:
            dangerCount.value++;
            break;
        }
        interestCount.value++;
      }
    }
  });
}
const updatePos = (dx, dy) => {
  x.value += dx;
  y.value += dy;
}
const updateChart = async () => {
  await prepareData(false);
  const option = getOption(scale.value);

  const _echart = echarts.init(chart.value, null, {
    renderer: renderer,
  });

  _echart.setOption(option);

}
// 화면 해상도 변경시 처리
const resizeChart = () => {
  if (!chart.value) return;
  resizeProcess();
}
/** 디바이스 크기마다 그려지는 신호등의 사이즈를 설정하는 부분 */
const resizeProcess = () => {
  prepareData(false);

  const target = wrapper.value;
  const option = getOption(scale.value);

  const _echart = echarts.init(chart.value, null, {
    renderer: renderer,
  });

  _echart.setOption(option, { notMerge: true });

  const width = (target.clientWidth - (controlClientWidth * getScale()) / 1.5) * resolution;

  const height = getHeight() * resolution;

  _echart.resize({
    width: width,
    height: height,
  });

  let _scale = 1 / resolution;
  let chartWidth = 0

  /** 아이폰의 경우 */
  chartWidth =
    (target.clientWidth - (controlClientWidth * getScale()) / 1.5) * resolution; //this.$refs.chart.offsetWidth;

  let margin = (target.clientWidth - chartWidth * _scale) / 2;

  let marginLeft = (margin * 1.7) / _scale;

  if (isMobile()) {
    marginLeft = (margin * 1) / _scale;
  }

}
const getRateX = () => {
  const targetWidth = wrapper.value.clientWidth;
  const baseWidth = 175;
  let rateX = (targetWidth - controlClientWidth) / baseWidth;
  return rateX * resolution;

}

const getHeight = () => {
  const target = wrapper.value;

  let height = target.clientHeight * resolution;

  return height;
}
const getRateY = () => {
  const baseHeight = 732;
  let rateY = getHeight() / baseHeight;
  return rateY * resolution * 1.3;
}
const prepareData = async () => {

  const rateX = getRateX();
  const rateY = getRateY();
  props.healthNetworkData.ncList = props.healthNetworkData.ncList.filter(
    (val, idx) => {
      return (
        props.healthNetworkData.ncList.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      );//값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );
  props.healthNetworkData.nodeList = props.healthNetworkData.nodeList.filter(
    (val, idx) => {
      return (
        props.healthNetworkData.nodeList.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      );//값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );
  props.healthNetworkData.nodeList.forEach((element) => {
    props.healthNetworkData.ncList.forEach((element2, index) => {
      if (element.Node_ID === element2.Node_ID) {
        // 노드정보에 클러스터 정보 매칭
        element.clusterInfo = element2;
        element.clusterIndex = index;
      }
    });
  });
  props.healthNetworkData.nodeList.forEach((elem, index) => {

    elem.name = elem.Node_Name;
    elem.id = elem.Node_ID;
    elem.x = (elem.X * rateX) / rateY;
    elem.y = elem.Y;
    elem.index = index;

    switch (elem.Node_State) {
      case 0:
      case 1:
        // 정상 노트 색상
        elem.itemStyle = {
          animation: true,
          opacity: 0.3,
          color: "#5E5E5E",
        };
        break;
      case 2:
        //주의 노드 색상
        elem.itemStyle = {
          animation: true,
          opacity: 1,
          color: "#F8B500",
        };
        break;
      case 3:
        // 위험 노드 색상
        elem.itemStyle = {
          animation: true,
          opacity: 1,
          color: "#E95371",
        };
        break;
      case 4:
        break;
    }
  });
  let convertedLinks = [];
  props.healthNetworkData.edgeList.forEach((elem) => {
    elem.name = elem.Edge_Name;
    elem.id = elem.Edge_ID;
    elem.source = elem.S_Node_ID;
    elem.target = elem.E_Node_ID;
    convertedLinks.push({
      ...elem,
      selected: { itemStyle: { opacity: 1, borderWidth: 5, color: "red" } },
      emphasis: { lineStyle: { color: "red", width: 10 } },
      lineStyle: {
        color: "#000000",
        width: 0.5,
      },
    });
  });
  linkList.value = convertedLinks;
  props.healthNetworkData.clusterList = props.healthNetworkData.clusterList.filter(
    (val, idx) => {
      return (
        props.healthNetworkData.clusterList.findIndex(
          (item) => item.Cluster_ID === val.Cluster_ID
        ) === idx
      );
    }
  );
  props.healthNetworkData.clusterList.forEach((element) => {
    element.nodes = props.healthNetworkData.nodeList.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    );
    const textOption = {
      textBorderWidth: 0,
      textBorderColor: "transparent",
      fontFamily: "Pretendard",
      width: 155,
      overflow: "break",
    };
    const textOption_Mobile = {
      textBorderWidth: 0,
      textBorderColor: "transparent",
      fontFamily: "Pretendard",
      width: 60,
      overflow: "break",
    };
    const textOption_Medium = {
      textBorderWidth: 0,
      textBorderColor: "transparent",
      fontFamily: "Pretendard",
      width: 115,
      overflow: "break",
    };

    element.nodes.forEach((elem) => {
      elem.symbol = 'triangle';
      elem.symbolSize = 6;
      if (elem.Node_Category.includes("Core")) {
        elem.symbol = "circle";
        elem.symbolSize = 18;
      }
      elem.label = { show: false };

      const fontLarge = ((14 * getScale()) / 2) * resolution;
      const fontMedium = ((8 * getScale()) / 2) * resolution;
      const fontSmall = ((10 * getScale()) / 2) * resolution;
      // 노드명 폰트 사이즈 모바일/PC에 따라 조절. 특정 항목만 보이도록 설정
      if (
        elem.Node_Category.includes("Core") ||
        elem.Node_Category.includes("Core-life")
      ) {
        /** 디바이스 크기에 따라 변경 */
        var device_width = document.documentElement.clientWidth;

        if (device_width >= 412) {
          elem.label = { show: true, fontSize: fontLarge, ...textOption };
        } else if (device_width < 412 && device_width >= 390) {
          elem.label = { show: true, fontSize: fontMedium, ...textOption_Medium };
        } else {
          elem.label = { show: true, fontSize: fontSmall, ...textOption_Mobile };
        }
      } else {
        // 모바일 아닐때만 보이는 항목
        if (isMobile() === false) {
          elem.label = { show: true, fontSize: fontSmall, ...textOption };
        }
      }
    });
  });
  props.healthNetworkData.clusterList = props.healthNetworkData.clusterList.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace("CL_", "")) -
      Number(b.Cluster_ID.replace("CL_", ""))
    );
  });
}
const getClusterStatus = (clusterIndex) => {
  let state = props.healthNetworkData.clusterList[clusterIndex].Cluster_State;
  if (state >= 40) {

    //40이상이면 관심이면서 주의/위험
    return state - 40;
  }
  return state;
}
const getOption = (zoom = 1) => {
  let convexHullData = getClusterData();

  const option = {
    tooltip: {},
    legend: [],
    xAxis: { show: false },
    yAxis: { show: false },
    animation: false,
    graphic: {
      elements: convexHullData, //네트워크 영역 데이터. convexHull 알고리즘 사용
    },
    series: [
      {
        itemStyle: {
          color: "#59C370",
        },
        silent: true,

        type: "graph",
        data: props.healthNetworkData.nodeList, //노드 리스트 세팅
        links: linkList.value, //연결 정보 데이터 세팅

        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          opacity: 1,
        },
        labelLayout: {
          hideOverlap: false,
        },
        zoom: zoom,
        scaleLimit: {
          min: scaleMin,
          max: scaleMax,
        },
        blur: {
          itemStyle: {
            opacity: 1,
          },
          label: {
            opacity: 1,
          },
        },
        select: {
          animation: false,
          lineStyle: {
            // color: "#fc4a6a",
            color: "red",
            opacity: 1,
            width: 2,
          },
          itemStyle: {
            opacity: 1,
            color: "#fc4a6a",
          },
          label: {
            show: true,
            opacity: 1,
            fontWeight: "bold",
          },
        },
        selectedMode: "multiple",

        emphasis: {
          animation: false,

          disabled: false,
          focus: "adjacency",
          // scale: true,
          itemStyle: {
            opacity: 0.6,
            z: 100,
            color: "#C2373F",
          },
          lineStyle: {
            width: 10,
            color: "#ff0000",
            opacity: 1,
          },

          label: {
            position: ["0%", "120%"], //"right",
            // offset: [0, 15],
            align: "center",
            show: true,
            opacity: 1,
            fontWeight: "bold",
            fontFamily: "Pretendard",
          },
        },
        lineStyle: {
          color: "source",
          opacity: 0.25,
        },
      },
      convexHullData,
    ],
  };

  return option;
}
const getOption2 = (zoom = 1) => {
  zoom;
  let optionData = getClusterData();
  return optionData;
}

const getClusterData = () => {
  let optionData = [];

  let selectIndex = [];

  const rateX = getRateX();
  const rateY = getRateY() / 3.5;

  let _scale = 1.34 / 2; //0.2115 * this.scale * rateY;
  const offset = 3 * _scale;
  let offsetX = -93 * rateX;
  let offsetY = 125 * rateY;

  const radius = 100 * _scale;

  props.healthNetworkData.clusterList.forEach((element, index) => {

    // if (index + 1 !== testIndex) return;
    let points = [];

    // 클러스터에 해당하는 노드 위치값 추출
    element.nodes.forEach((el) => {
      points.push([el.x * _scale, el.y * _scale]);
      selectIndex.push(el.index);
    });
    if (points.length === 0) {
      optionData.push({
        type: "polygon",
        shape: {
          points: points,
          smooth: 1,
        },
        left: x.value, //points[0][0],
        top: y.value, //points[0][1],

        focus: "none",
        silent: true,
      });

      return;
    }
    while (points.length <= 2) {
      points.push([points[0][0] + offset, points[0][1] - offset]);
      points.push([points[0][0] - offset, points[0][1] - offset]);
      points.push([points[0][0] + offset, points[0][1] + offset]);
      points.push([points[0][0] - offset, points[0][1] + offset]);

      points.push([points[1][0] + offset, points[1][1] - offset]);
      points.push([points[1][0] - offset, points[1][1] - offset]);
      points.push([points[1][0] + offset, points[1][1] + offset]);
      points.push([points[1][0] - offset, points[1][1] + offset]);
    }
    let left = 0;
    let top = 0;
    let right = 0;
    let bottom = 0;

    points.forEach((elem, index) => {
      if (index === 0) {
        left = elem[0];
        top = elem[1];
        right = elem[0];
        bottom = elem[1];
      } else {
        if (left > elem[0]) left = elem[0];
        if (top > elem[1]) top = elem[1];
        if (right < elem[0]) right = elem[0];
        if (bottom < elem[1]) bottom = elem[1];
      }
    });

    // 일정범위 넘어가는 포인트들은 각각의 그룹으로 분리
    const clusters = clustering(points, 400 * rateY);
    clusters.forEach((cl_element) => {
      // convexHull알고리즘으로 포인트 추출
      points = convexHull(cl_element);

      while (points.length <= 2) {
        points.push([
          points[0][0] + offset * rateX,
          points[0][1] - offset * rateY,
        ]);
        points.push([
          points[0][0] - offset * rateX,
          points[0][1] - offset * rateY,
        ]);
        points.push([
          points[0][0] + offset * rateX,
          points[0][1] + offset * rateY,
        ]);
        points.push([points[0][0] - offset, points[0][1] + offset * rateY]);

        points.push([
          points[1][0] + offset * rateX,
          points[1][1] - offset * rateY,
        ]);
        points.push([
          points[1][0] - offset * rateX,
          points[1][1] - offset * rateY,
        ]);
        points.push([
          points[1][0] + offset * rateX,
          points[1][1] + offset * rateY,
        ]);
        points.push([
          points[1][0] - offset * rateX,
          points[1][1] + offset * rateY,
        ]);
      }

      // 중심값 계산
      let centerPoints = centroid(points);

      // 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌
      if (index + 1 === 3) {
        points.push([centerPoints[0], top - radius * 0.1]);
      }

      if (index + 1 === 24) {
        points.push([centerPoints[0], top - radius * 0.3]);
      }

      points.forEach((elem, index) => {
        index;
        const vector = getVector(elem, centerPoints);
        elem[0] += vector[0] * radius;
        elem[1] += vector[1] * radius;
      });


      //각 포지션 radius값만큼 넓힌후 재계산
      points = convexHull(points);
      points.forEach((elem, index) => {
        if (index === 0) {
          left = elem[0];
          top = elem[1];
          right = elem[0];
          bottom = elem[1];
        } else {
          if (left > elem[0]) left = elem[0];
          if (top > elem[1]) top = elem[1];
          if (right < elem[0]) right = elem[0];
          if (bottom < elem[1]) bottom = elem[1];
        }
      });

      let color = "green";

      let existInterestBorder = false;
      if (element.Cluster_State >= 40) {
        existInterestBorder = true;
      }

      let includeSex = true;
      props.healthNetworkData.cluster_left_list.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== userInfo.user_gender)
            includeSex = false;
        }
      });
      props.healthNetworkData.cluster_right_list.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== userInfo.user_gender)
            includeSex = false;
        }
      });

      // 해당 성별에서 보여야하는 리스트인지 판단 후 맞는 경우 상태값에 따라 배경색 설정
      if (includeSex) {
        switch (element.Cluster_State) {
          case 0:
            color = "#7171711A";
            break;
          case 1:
            color = "#7171711A";

            break;
          case 2:
            color = "#F8B50026";
            break;
          case 3:
            color = "#E953714D";
            break;
          case 4:
            color = "#00AFEC66";
            break;
          default:
            break;
        }

        switch (element.Cluster_State - 40) {
          case 0:
            color = "#7171711A";
            break;
          case 1:
            color = "#7171711A";

            break;
          case 2:
            color = "#F8B50026";
            break;
          case 3:
            color = "#E953714D";
            break;
          case 4:
            color = "#00AFEC66";
            break;
          default:
            break;
        }
      } else {
        color = "#7171711A";
      }

      optionData.push({
        type: "polygon",
        shape: {
          points: points,
          // smooth: 0.5,
          smooth: 0.5,
        },
        left: x.value + left + offsetX, //points[0][0],
        top: y.value + top + offsetY, //points[0][1],
        focus: "none",
        silent: true,

        style: {
          fill: color, //"green",
          opacity: 1,
          // element.Cluster_State === 0 || element.Cluster_State === 1
          //   ? 0.1
          //   : !includeSex
          //   ? 0.1
          //   : 0.5,

          lineWidth: 3 * props.pdfScale,
          stroke: existInterestBorder ? "#55C3F1" : "transparent",
        },
      });
    });
  });

  return optionData;
}

const getScale = () => {
  return props.pdfScale;
}
</script>
<template>
  <div class="graph-wrapper" ref="wrapper">
    <div class="chart-wrap" ref="chartwrap">
      <div class="echart" ref="chart" id="ehChart"></div>
    </div>

    

    <div class="cluster-list" v-if="props.healthNetworkData">
      <div class="left-list">
        <template v-for="(list, i) in props.healthNetworkData.cluster_left_list" :key="i">
          <div>
            <span :class="[
              { danger: getClusterStatus(list.index) === 3 },
              {
                safe:
                  getClusterStatus(list.index) === 0 ||
                  getClusterStatus(list.index) === 1,
              },
              { warn: getClusterStatus(list.index) === 2 },
              { interest: getClusterStatus(list.index) === 4 },
            ]" class="stretch-text">{{ list.name }}</span>
            <img v-if="list.hasMedication" src="/img/ic_medic_grey.svg" alt="복약중" class="medication-icon"></img>
          </div>
        </template>
      </div>
      <div class="right-list">
        <template v-for="(list, i) in props.healthNetworkData.cluster_right_list" :key="i">
          <div>
            <span :class="[
              { danger: getClusterStatus(list.index) === 3 },
              {
                safe:
                  getClusterStatus(list.index) === 0 ||
                  getClusterStatus(list.index) === 1,
              },
              { warn: getClusterStatus(list.index) === 2 },
              { interest: getClusterStatus(list.index) === 4 },
            ]" class="stretch-text">{{ list.name }}</span>
            <img v-if="list.hasMedication" src="/img/ic_medic_grey.svg" alt="복약중" class="medication-icon"></img>
          </div>
        </template>
      </div>
      <!-- <div class="right-list"></div> -->
    </div>

    <div class="loading" v-if="!loading">
      <div class="loading-box">
        <p>로딩중입니다.</p>
        <div class="loading-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

article {
  position: relative;
  overflow: hidden;
  height: calc(100vh);
  max-width: $max-width;
  padding-top: $header !important;
}

.chart-wrap {
  position: absolute;
  transform-origin: left top;
  overflow: visible;
  width: 100%;
  height: 100%;
  margin-top: calc(23px * $pdf-scale);
}

.echart-bg {
  position: absolute;
  width: 100%;
  max-width: $max-width;
  top: 0px;
  left: 0px;
  transform-origin: center center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  overflow: hidden;
  z-index: 0;

  img {
    position: absolute;
    object-fit: contain;
    transition: opacity 0.5s;
    opacity: 0.5;
  }

  .interest {
    opacity: 0.5;
    z-index: 1;
  }

  .warn {
    opacity: 0.3;
    z-index: 2;
  }

  .danger {
    opacity: 0.4;
    z-index: 3;
  }

  .safe {
    opacity: 0.1;
    z-index: 0;
  }
}

.echart {
  position: absolute;
  /* width: 500px; */
  // width: 100%;
  height: 100%;
  /* height: 732px; */

  margin: 0 auto;
  // margin-bottom: -50px;
  top: 0;
  left: 0px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  text {
    color: red !important;
  }
}

.echart2 {
  position: absolute;
  width: 100%;
  max-width: $max-width;
  height: 100%; //calc(100vh - $header); //600px;
  /* min-height: 300px; */

  margin: 0 auto;
  margin-bottom: -50px;
  top: 0px;
  left: 0px;
  transform-origin: left center;
}

.info {
  @include flex(center, center);
  justify-content: space-between;
  height: 33px;
  /* margin-top: $header; */

  .info-list {
    @include flex(flex-start, center);
  }

  .info-recommend {
    margin-top: 13px;
    background: #d9d9d9;
    border-radius: 7px;
    padding: 4px 10px;
    margin-right: 31px;
  }

  .info-item {
    margin-top: 13px;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    display: flex;
    align-items: center;

    color: rgba(65, 64, 66, 0.8);
  }

  .info-danger {
    margin-left: 28px;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: #e95371;
    border-radius: 6px;

    @include flex(center, center);
  }

  .info-warn {
    margin-left: 7px;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: #f8b500;
    border-radius: 6px;

    @include flex(center, center);
  }

  .info-interest {
    margin-left: 7px;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: #00afec;
    border-radius: 6px;

    @include flex(center, center);
  }
}

.label {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 10px;
  bottom: 65px;
}

.label-safe {
  display: inline-block;
  text-align: right;
  font-size: 8px;

  span {
    vertical-align: baseline;
    display: inline-block;
    margin-right: 3px;
    width: 8px;
    height: 8px;
    background: #50cc1a; //#feae70;
  }
}

.label-danger {
  display: inline-block;
  text-align: right;
  font-size: 8px;

  span {
    vertical-align: baseline;
    display: inline-block;
    margin-right: 3px;
    width: 8px;
    height: 8px;
    background: #fc4a6a; //#feae70;
  }
}
  
#page20 .cluster-list .right-list > div {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 36px;
}

#page20 .cluster-list .right-list > div .medication-icon {
  position: absolute;
  right: 10px;
}

#page20 .medication-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

.control {
  position: absolute;
  bottom: 50px;
  left: 5%;
  display: flex;
  gap: 10px;

  div {
    width: 30px;
    height: 30px;
    font-size: 20px;
    background-color: white;
    box-shadow: 3px 10px 30px #00000053;
    gap: 10px;
    flex-direction: column;
    border-radius: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.zoom-info {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  top: $header;
  /* margin-top: $header; */

  background-color: #f3f3f3;

  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */

  letter-spacing: 0.0703846px;
  text-decoration-line: underline;

  padding: 0 28px;

  color: #414042;

  img {
    width: 22px;
    height: 22px;
  }
}

article {
  padding: 0;
}

.cluster-list {
  color: rgba(65, 64, 66, 0.6);
  text-align: right;
  font-size: calc(12px / 1.5 * $pdf-scale);
  font-weight: 400;
  letter-spacing: calc(0.07px * $pdf-scale);


  .focused {
    color: #414042;
    text-align: right;
    font-size: calc(12px / 1.5 * $pdf-scale);
    font-family: Pretendard;
    font-weight: 700;
    letter-spacing: calc(0.07px * $pdf-scale);
    text-decoration-line: underline;
  }

  .left-list {
    position: absolute;
    /* width: 90px; */
    left: 0;
    padding-top: calc(110px / 1.5 * $pdf-scale);
    padding-bottom: calc(30px / 1.5 * $pdf-scale);
    margin-left: calc(28px / 1.5 * $pdf-scale);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;

    /* height: calc(100% - calc(136.5px * $pdf-scale)); */
  }

  span {
    display: inline-block;
    text-align: left;
    white-space: pre-wrap;
    text-align: right;
    padding: calc(7px / 1.5 * $pdf-scale) calc(13px / 1.5 * $pdf-scale);

    border-radius: calc(8px / 1.5 * $pdf-scale);
    background: rgba(204, 204, 204, 0.2);
  }

  .right-list {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    text-align: right;
    /* margin-top: calc(30px * $pdf-scale); */
    margin-right: calc(28px / 1.5 * $pdf-scale);
    padding-top: calc(110px / 1.5 * $pdf-scale);
    padding-bottom: calc(30px / 1.5 * $pdf-scale);
    height: 100%;
    /* height: calc(100% - calc(136.5px * $pdf-scale)); */
  }

  .danger {
    /* border-radius: calc(8px / 1.5 * $pdf-scale);
    border: calc(0.5px / 1.5 * $pdf-scale) solid #c0373f;
    background: rgba(192, 55, 63, 0.4);

    color: #414042; */
    background-color: transparent;
    color: #e95371;
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
    letter-spacing: calc(0.07px * $pdf-scale);
  }

  .warn {
    /* border-radius: calc(8px / 1.5 * $pdf-scale); */
    /* border: calc(0.5px / 1.5 * $pdf-scale) solid #fdc840; */
    /* background: rgba(253, 200, 64, 0.4); */

    /* color: #414042; */
    background-color: transparent;
    color: #f8b500;
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
    letter-spacing: calc(0.07px * $pdf-scale);
  }

  .safe {
    /* color: #414042;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07px; */
    background-color: transparent;
    color: #717171;
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
    letter-spacing: calc(0.07px * $pdf-scale);
  }

  .interest {
    /* border-radius: calc(8px / 1.5 * $pdf-scale);
    border: calc(0.5px / 1.5 * $pdf-scale) solid #73c0eb;

    background: rgba(115, 192, 235, 0.4); */

    background-color: transparent;
    color: #00afec;
    font-size: calc(12px / 1.5 * $pdf-scale);
    font-weight: 700;
    letter-spacing: calc(0.07px * $pdf-scale);
  }
}

.on {
  // bottom: 409px !important;
  transition: bottom 0.5s;
  bottom: 0px !important;
}

.recommend-list {
  opacity: 0.5;
  pointer-events: none;
  z-index: 1000;
  position: absolute;
  width: 100%;
  transition: bottom 0.5s;
  /* bottom: -409px; */
  bottom: 0px;
  background-color: #f3f3f3;

  color: #414042;

  .header {
    @include flex(flex-start, center);
    flex-direction: column;
    gap: 6px;

    padding-top: 28px;
    height: calc(85px * $pdf-scale);

    font-weight: 500;
    font-size: calc(16px * $pdf-scale);
    line-height: 19px;
    /* identical to box height */

    letter-spacing: 0.0703846px;
    border-top: calc(1px * $pdf-scale) solid #d9d9d9;

    span {
      font-weight: 400;
      font-size: calc(12px * $pdf-scale);
      line-height: calc(14px * $pdf-scale);
      text-align: center;
      letter-spacing: 0.0703846px;

      color: #db621e;
    }

    .btn {
      @include flex(center, center);
      position: absolute;
      top: 0px;
      width: 33px;
      height: 13px;
      background-color: black;
      border-top-right-radius: 0px;
      border-top-left-radius: 0px;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;

      img {
        width: 9px;
        height: auto;
      }

      .down {
        rotate: 180deg;
      }
    }
  }

  .list {
    width: 100%;
    height: 409px;
    background-color: #f3f3f3;
  }

  .control_product {
    // position: absolute;
    display: flex;
    // gap: 10px;
    flex-direction: column;
    height: 409px;
    overflow: scroll;
    background-color: #e6e6e6;

    .product-item {
      width: 100%;
      height: 96px;
      font-size: 20px !important;
      gap: 10px;
      flex-direction: row;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 0 16px;

      font-size: 15px;

      .text {
        @include flex(center, flex-start);
        flex-direction: column;
        gap: 5px;
      }

      span {
        font-weight: 300;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.0703846px;

        color: rgba(65, 64, 66, 0.8);
      }

      p {
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.0703846px;

        color: #414042;
      }
    }

    hr {
      border-top: 1px solid white;

      margin: 0 16px;

      &:last-child {
        display: none;
      }
    }

    .icon {
      width: 72px;
      height: 72px;
    }

    img {
      width: 72px;
      height: 72px;
      background-color: white;
      border-radius: 10px;
    }

    .unselected {
      opacity: 0.5;
    }
  }
}

.chk_box {
  display: block;
  position: relative;
  //   padding-left: 25px;
  //   margin-bottom: 10px;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  width: 19px;
  height: 19px;
}

label {
  width: 19px;
  z-index: 1000;
}

.chk_box input[type="checkbox"] {
  display: none;
  width: 19px;
  height: 19px;
}

.chk-on {
  z-index: 1000;
  margin-left: 5px;
  margin-top: 5px;

  width: 19px;
  height: 19px;
  background: white;
  border: 1px solid #707070;
  border-radius: 3px;
  position: absolute;
  top: 0;
  left: 0;
}

.chk_box input[type="checkbox"]:checked+.chk-on {
  background: #c4926d;
  border: 1px solid #c4926d;
}

.chk-on:after {
  content: "";
  position: absolute;
  display: none;
}

.chk_box input[type="checkbox"]:checked+.chk-on:after {
  display: block;
}

.chk-on:after {
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  position: absolute;
  left: 5px;
  top: 0px;
}

.graph-wrapper {
  width: 100%;
  height: 100%;
}
</style>
