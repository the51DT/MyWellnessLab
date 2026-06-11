<script setup>
import * as echarts from "echarts";
import { useStore } from 'vuex'
import { convexHull } from '@/assets/js/chart/hull';
import { isMobile, centroid, getVector } from "@/utils/common.js";
import { clustering } from '@/assets/js/chart/clustering';
import { onMounted, ref, onUnmounted, watch } from "vue";
import { useI18n } from 'vue-i18n';
// BaseTooltip import 제거 - 커스텀 툴팁 사용
const store = useStore()
const { t } = useI18n()
const emit = defineEmits(['zoomMode'])
const props = defineProps({
  datas: {
    type: Object,
    required: true,
  },
  isExpand: {
    type: Boolean,
    default: false
  }
});

const healthNetworkData = ref(null);
const chart = ref(null);
const chartwrap = ref(null);
const linkList = ref(null); // 노드 연결정보 리스트

let scale = ref(1);
let scaleMax = 3;
let scaleMin = 1;
let x = ref(0);
let y = ref(0);
let loading = true;
let isZoomMode = ref(false);
let zoomIndex = ref(1);
let renderer = "canvas";
let resolution = 2;
let init = ref(0);
let hasAnimated = ref(false); // 애니메이션 완료 여부를 추적하는 플래그
let isAnimating = ref(false); // 애니메이션 실행 중 여부를 추적하는 플래그
let animationStartTime = ref(0); // 애니메이션 시작 시간
let cachedClusterData = ref(null); // 클러스터 배경색 데이터 캐시
let fixedRateX = null; // 초기 렌더링 시 prepareData에서 사용한 rateX 고정값
let fixedRateY = null; // 초기 렌더링 시 prepareData에서 사용한 rateY 고정값

let controlClientWidth = 100; // 차트 너비 조절
const FONT_SCALE = 1; // 캔버스 라벨 폰트 스케일
const LABEL_WIDTH_LARGE = 380; 
const LABEL_WIDTH_MEDIUM = 120;
const LABEL_WIDTH_MOBILE = 80;
// 최초 안정화 이후 고정할 차트 높이(동일 배치 유지 목적)
let fixedChartHeight = null;

// 툴팁 관련 변수
const showTooltip = ref(false);
const tooltipContent = ref('');
const tooltipPosition = ref({ x: 0, y: 0 });
const hasInitialTooltip = ref(false); // 초기 툴팁 표시 여부

// 노드 하이라이트 관련 변수
const highlightedClusterIndex = ref(null); // 현재 하이라이트된 클러스터 인덱스

// 건강 영역별 원료 가이드 데이터
const healthGuideData = {
  'CL_023': 'sleep_health',
  'CL_007': 'eye_health',
  'CL_024': 'nose_sensitivity',
  'CL_009': 'immune_function',
  'CL_008': 'sensitive_skin_improvement',
  'CL_001': 'liver_health',
  'CL_018': 'antioxidant',
  'CL_025': 'nutrition_balance',
  'CL_017': 'skin_health',
  'CL_012': 'stomach_health',
  'CL_003': 'joint_bone_health',
  'CL_013': 'intestinal_health',
  'CL_005': 'memory_improvement',
  'CL_006': 'tension_relief',
  'CL_022': 'blood_circulation',
  'CL_020': 'blood_pressure_control',
  'CL_021': 'blood_lipid_improvement',
  'CL_015': 'body_fat_control',
  'CL_019': 'blood_sugar_control',
  'CL_011': 'exercise_performance_endurance',
  'CL_016': 'fatigue_improvement',
  'CL_004': 'muscle_strength',
  'CL_014': 'prostate_health',
  'CL_002': 'menopause_women_health'
};

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart, { passive: false });
});

// props.datas가 변경될 때마다 healthNetworkData 업데이트
watch(() => props.datas, (newData) => {
  if (!newData) return;
  
  // 데이터를 복사하여 직접 수정하지 않음
  const processedData = { ...newData };
  
  // cluster_left_list와 cluster_right_list의 name을 i18n 처리
  if (newData.cluster_left_list) {
    processedData.cluster_left_list = newData.cluster_left_list.map(item => {
      const clusterIdKey = `ClusterName.${item.Cluster_ID}`;
      const translatedName = t(clusterIdKey);
      return {
        ...item,
        name: translatedName === clusterIdKey ? item.name : translatedName
      };
    });
  }
  
  if (newData.cluster_right_list) {
    processedData.cluster_right_list = newData.cluster_right_list.map(item => {
      const clusterIdKey = `ClusterName.${item.Cluster_ID}`;
      const translatedName = t(clusterIdKey);
      return {
        ...item,
        name: translatedName === clusterIdKey ? item.name : translatedName
      };
    });
  }
  
  healthNetworkData.value = processedData;
}, { immediate: true, deep: true });
onMounted(async () => {
  init.value = 0;
  healthNetworkData.value = props.datas;



  // S_Node_ID -> source, E_Node_ID -> target 연결정보 데이터 세팅
  let convertedLinks = []; 
  
  healthNetworkData.value.edgeList.forEach((element) => {
    convertedLinks.push({
      ...element,
    });
  });
  // 연결정보 리스트에 인덱스값 추가
  linkList.value = convertedLinks;
  linkList.value.forEach((element, index) => {
    element.index = index;
  });
  
  const echart = echarts.init(chart.value, null, { renderer: renderer});
  
  await updateChart();

  window.onresize = echart.resize;
  window.addEventListener("resize", resizeChart, { passive: false });
  
  const optionFunc = getOption2;
  const updateFunc = updatePos;

  updateFunc(0, 0);
  echart.on("graphroam", function (params) {
    const option = optionFunc();
    updateFunc(params.dx, params.dy);
  });

  resizeChart()
  
  // 초기 로딩 완료 후 기본 툴팁 표시
  setTimeout(() => {
    showDefaultTooltip();
  }, 500);

  
  loading = true;
      healthNetworkData.value.clusterList.forEach((element) => {
      element.nodes = healthNetworkData.value.nodeList.filter(
        (item) => item.clusterInfo && item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
      );
    element.nodes.forEach((elem) => {
      elem.symbol = "triangle";
      if (elem.Node_Category.includes("Core")) {
        elem.symbol = "circle";
      }
    });
  });
  healthNetworkData.value.clusterList = healthNetworkData.value.clusterList.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace("CL_", "")) -
      Number(b.Cluster_ID.replace("CL_", ""))
    );
  });
  // await countClusterState();

})
const updatePos = (dx, dy) => {
  x.value += dx;
  y.value += dy;
}
const updateChart = async () => {
  await prepareData(false);
  const option = getOption(scale.value);
  
  // 기존 인스턴스가 있으면 재사용, 없으면 새로 생성
  let _echart = echarts.getInstanceByDom(chart.value);
  if (!_echart) {
    _echart = echarts.init(chart.value, null, {
      renderer: renderer,
    });
  }else{
  }
  
  _echart.setOption(option);
}
// 화면 해상도 변경시 처리
const resizeChart = () => {
  if (!chart.value) return;
  
  // expand 상태일 때는 resize 처리하지 않음
  if (props.isExpand && resolution !== 3) return;
  
  resizeProcess();
}
/** 디바이스 크기마다 그려지는 신호등의 사이즈를 설정하는 부분 */
const resizeProcess = () => {
  prepareData(false);

  const target = document.querySelector('.health-network-container');
  const option = getOption(scale.value);

  // 기존 인스턴스가 있으면 재사용, 없으면 새로 생성
  let _echart = echarts.getInstanceByDom(chart.value);
  if (!_echart) {
    _echart = echarts.init(chart.value, null, {
      renderer: renderer,
    });
  }

  _echart.setOption(option, { notMerge: true });

  const width = (target.clientWidth - controlClientWidth + 45) * resolution;
  const computedHeight = getHeight() * resolution;
  if (fixedChartHeight === null) {
    fixedChartHeight = getHeight();
  }
  //const height = (fixedChartHeight ?? getHeight()) * resolution;
  const height = computedHeight;

  _echart.resize({
    width: width,
    height: height,
  });

  // health-network-container의 높이를 canvas 실제 높이의 절반으로 설정
  if (target && chart.value) {
    // canvas element의 실제 높이를 가져와서 2로 나눈 값을 container에 적용
    // 최초 한 번만 컨테이너 높이 설정 후 고정
      setTimeout(() => {
        const canvasElement = chart.value.querySelector('canvas');
        if (canvasElement) {
          const canvasHeight = canvasElement.offsetHeight;
          target.style.height = `${canvasHeight / 2}px`;
        }
      }, 0);
  }

  let _chartWrap = chartwrap.value;

  let _scale = 1 / resolution;

  const chartWidth = (target.clientWidth - controlClientWidth + 45) * resolution;

  let margin = (target.clientWidth - chartWidth * _scale) / 2;

  let top = 0;

  let left = 0;

  if (isZoomMode.value) {

    var cluster_list = healthNetworkData.value.cluster_left_list.concat(
      healthNetworkData.value.cluster_right_list
    );

    // 클러스터 리스트에서 index 항목과 같은 값으로 가져옴
    var cluster = cluster_list.find((item) => {
      return item.index === zoomIndex.value;
    });

    left = cluster.zoomLeft * getRateX();
    _scale = _scale * cluster.zoomScale;
    top = (25 / _scale + headerHeight * _scale + cluster.zoomTop * _scale) * getRateY();
    margin = (target.clientWidth - chartWidth * _scale) / 2;
  }
  let marginLeft = (margin * 0.3) / _scale;
  
  if (isMobile()) {
    marginLeft = (margin * 0.45) / _scale;
    if (isZoomMode.value) {
      left += 40;
    }
  }
  
  _chartWrap.style =
    "top:" +
    top +
    "px;left:" +
    left +
    "px;margin: 0 " +
    margin +
    "px;margin-left:" +
    marginLeft +
    "px;transform: scale(" +
    _scale +
    ");transform-origin:top left;";
    
  // 클러스터 리스트를 차트 크기에 맞춰 조정
  const clusterList = document.querySelector('.cluster-list');
  if (clusterList) {
    // 차트의 실제 크기 계산
    const chartWidth = (target.clientWidth - controlClientWidth + 45) * resolution;
    const chartHeight = getHeight() * resolution;
    
    // 하얀색 공백을 제외한 실제 차트 영역 계산
    // 위아래 각각 약 10% 정도의 공백이 있다고 가정
    const actualChartHeight = chartHeight * 0.8; // 실제 데이터 영역은 80% 정도
    
    // 클러스터 리스트 크기를 실제 차트 영역에 맞춰 조정
    clusterList.style.width = `${chartWidth}px`;
    clusterList.style.height = `${actualChartHeight}px`;
    
    // 클러스터 리스트 위치도 조정 (위쪽 공백만큼 아래로 이동)
    clusterList.style.top = `${chartHeight * 0.1}px`; // 위쪽 공백만큼 아래로
  }
  
  // 애니메이션이 실제로 완료된 후에만 플래그 설정
  if (isAnimating.value && animationStartTime.value > 0) {
    const currentTime = Date.now();
    const animationDuration = 2500 + (100 * 25); // 최대 애니메이션 시간 (약 5초)
    
    // 애니메이션이 완료되었는지 확인
    if (currentTime - animationStartTime.value >= animationDuration) {
      hasAnimated.value = true;
      isAnimating.value = false; // 애니메이션 완료 플래그 설정
    }
  }

}

// 화면 줌인 (확대모드)
const setZoom = (index) => {
  isZoomMode.value = true;
  zoomIndex.value = index;
  resolution = 3; // 확대모드 해상도
  resizeProcess();
}
// 외부에서 호출할 수 있도록 resetZoom 함수 노출
defineExpose({
  resetZoom: () => {
    resolution = 2;
    emit("zoomMode", false)
    const _echart = echarts.getInstanceByDom(chart.value);
    isZoomMode.value = false;
    _echart.clear();
    updateChart();
    updatePos(-x.value, -y.value);
    resizeChart();
  }
})

const getRateX = () => {
  const targetWidth = document.querySelector('.health-network-container').clientWidth;
  const baseWidth = 175;
  let rateX = (targetWidth - controlClientWidth + 45) / baseWidth;
  return rateX * resolution;
}

const getHeight = () => {
  /* if (fixedChartHeight !== null) return fixedChartHeight; */
  const headerHeight = 55 + 30;
  const recommendListHeight = 0; //85;
  const agileHeight = 25;
  const windowHeight = document.documentElement.offsetHeight * 0.75; //window.innerHeight
  const height =
    windowHeight - recommendListHeight - headerHeight - agileHeight;
  return height;
}
const getRateY = () => {
  const baseHeight = 732;
  let rateY = getHeight() / baseHeight;
  return rateY * resolution;
}
const prepareData = async () => {

  // 초기 렌더링 시 rateX, rateY를 고정값으로 설정
  if (fixedRateX === null || fixedRateY === null) {
    fixedRateX = getRateX() / 1.2;
    fixedRateY = getRateY();
  }
  
  // 고정된 rateX, rateY 사용
  const rateX = fixedRateX;
  const rateY = fixedRateY;
  healthNetworkData.value.ncList = healthNetworkData.value.ncList.filter(
    (val, idx) => {
      return (
        healthNetworkData.value.ncList.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      );//값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );
  healthNetworkData.value.nodeList = healthNetworkData.value.nodeList.filter(
    (val, idx) => {
      return (
        healthNetworkData.value.nodeList.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      );//값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );
  healthNetworkData.value.nodeList.forEach((element) => {
    healthNetworkData.value.ncList.forEach((element2, index) => {
      if (element.Node_ID === element2.Node_ID) {
          // 노드정보에 클러스터 정보 매칭
        element.clusterInfo = element2;
        element.clusterIndex = index;
      }
    });
  });
  healthNetworkData.value.nodeList.forEach((elem, index) => {
  
    // Node_Name을 i18n 키로 변환하여 사용 (Node_ID는 문자열)
    const nodeNameKey = `NodeName.${elem.Node_ID}`;
    let translatedName;
    try {
      translatedName = t(nodeNameKey);
    } catch (e) {
      translatedName = nodeNameKey;
    }
    
    // 번역이 키와 동일하면 (번역이 없는 경우) 원본 사용
    elem.name = translatedName === nodeNameKey ? elem.Node_Name : translatedName;
    elem.id = elem.Node_ID;
    elem.x = (elem.X * rateX) / rateY ; 
    elem.y = elem.Y;
    elem.index = index;

    // 노드 하이라이트를 사용하지 않으므로 이 로직 제거
    // if (highlightedClusterIndex.value !== null) {
    //   const cluster = healthNetworkData.value.clusterList[highlightedClusterIndex.value];
    //   if (cluster && cluster.nodes && cluster.nodes.some(node => node.id === elem.id)) {
    //     return; // 하이라이트된 노드는 스타일 변경하지 않음
    //   }
    // }

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
  healthNetworkData.value.edgeList.forEach((elem) => {
    elem.name = elem.Edge_Name;
    elem.id = elem.Edge_ID;
    elem.source = elem.S_Node_ID;
    elem.target = elem.E_Node_ID;
    convertedLinks.push({
      ...elem,
      lineStyle: {
        color: window.innerWidth >= 960 ? "#000" : "#595959",
        width: 0.5,
      },
    });
  });
  linkList.value = convertedLinks;
  healthNetworkData.value.clusterList = healthNetworkData.value.clusterList.filter(
    (val, idx) => {
      return (
        healthNetworkData.value.clusterList.findIndex(
          (item) => item.Cluster_ID === val.Cluster_ID
        ) === idx
      );
    }
  );
  healthNetworkData.value.clusterList.forEach((element) => {
    element.nodes = healthNetworkData.value.nodeList.filter(
      (item) => item.clusterInfo && item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    );
    const textOption = {
      textBorderWidth: 0,
      textBorderColor: "transparent",
      fontFamily: "Pretendard",
      width: LABEL_WIDTH_LARGE,
      overflow: "break",
    };
    const textOption_Mobile = {
      textBorderWidth: 0,
      textBorderColor: "transparent",
      fontFamily: "Pretendard",
      width: LABEL_WIDTH_MOBILE,
      overflow: "break",
    };
    const textOption_Medium = {
      textBorderWidth: 0,
      textBorderColor: "transparent",
      fontFamily: "Pretendard",
      width: LABEL_WIDTH_MEDIUM,
      overflow: "break",
    };

    element.nodes.forEach((elem) => {
      elem.symbol = 'triangle';
      elem.symbolSize = 4;
      
      // 960px 이상에서는 폰트 크기를 2배로 증가
      const isDesktop = document.documentElement.clientWidth >= 960;
      const fontMultiplier = isDesktop ? 2 : 1;
      const isMobileDevice = isMobile();
      
      if (elem.Node_Category.includes("Core")) {
        elem.symbol = "circle";
        // 모바일에서는 Core 동그라미 사이즈를 작게 설정
        elem.symbolSize = isMobileDevice ? 7 : 10;
      }
      elem.label = { show: false };
      
      // PC용 폰트 크기 (기존 사이즈)
      const fontLarge = 10 * resolution * FONT_SCALE * fontMultiplier;
      const fontMedium = 6 * resolution * FONT_SCALE * fontMultiplier;
      const fontSmall = 6 * resolution * FONT_SCALE * fontMultiplier;
      
      // 모바일용 축소 폰트 크기
      const fontLargeMobile = 8 * resolution * FONT_SCALE;
      const fontMediumMobile = 6 * resolution * FONT_SCALE;
      const fontSmallMobile = 4 * resolution * FONT_SCALE;
      
      // 노드명 폰트 사이즈 모바일/PC에 따라 조절. 모든 노드 표시
      if (
        elem.Node_Category.includes("Core") ||
        elem.Node_Category.includes("Core-life")
      ) {
        /** 디바이스 크기에 따라 변경 */
        var device_width = document.documentElement.clientWidth;
        if (isMobileDevice) {
          // 모바일: 축소 크기
          if (device_width>=412) {
            elem.label = { show: true, fontSize: fontLargeMobile, lineHeight: Math.round(fontLargeMobile * 1.15), formatter: limitTwoLines, ...textOption };
          } else if(device_width <= 412 && device_width > 390) {
            elem.label = { show: true, fontSize: fontMediumMobile, lineHeight: Math.round(fontMediumMobile * 1.15), formatter: limitTwoLines, ...textOption_Medium };
          } else {
            elem.label = { show: true, fontSize: fontMediumMobile, lineHeight: Math.round(fontMediumMobile * 1.15), formatter: limitTwoLines, ...textOption_Mobile };
          }
        } else {
          // PC: 기존 사이즈
          if (device_width>=412) {
            elem.label = { show: true, fontSize: fontLarge, lineHeight: Math.round(fontLarge * 1.15), formatter: limitTwoLines, ...textOption };
          } else if(device_width <= 412 && device_width > 390) {
            elem.label = { show: true, fontSize: fontMedium, lineHeight: Math.round(fontMedium * 1.15), formatter: limitTwoLines, ...textOption_Medium };
          } else {
            elem.label = { show: true, fontSize: fontSmall, lineHeight: Math.round(fontSmall * 1.15), formatter: limitTwoLines, ...textOption_Mobile };
          }
        }
      } else {
        // 일반 노드도 모든 경우에 표시
        var device_width = document.documentElement.clientWidth;
        if (isMobileDevice) {
          // 모바일: 일반 노드는 더 작은 크기
          if (device_width>=412) {
            elem.label = { show: true, fontSize: fontSmallMobile, lineHeight: Math.round(fontSmallMobile * 1.15), formatter: limitTwoLines, ...textOption };
          } else if(device_width <= 412 && device_width > 390) {
            elem.label = { show: true, fontSize: fontSmallMobile, lineHeight: Math.round(fontSmallMobile * 1.15), formatter: limitTwoLines, ...textOption_Medium };
          } else {
            elem.label = { show: true, fontSize: fontSmallMobile, lineHeight: Math.round(fontSmallMobile * 1.15), formatter: limitTwoLines, ...textOption_Mobile };
          }
        } else {
          // PC: 기존 사이즈
          elem.label = { show: true, fontSize: fontSmall, lineHeight: Math.round(fontSmall * 1.15), formatter: limitTwoLines, ...textOption };
        }
      }
    });
  });
  healthNetworkData.value.clusterList = healthNetworkData.value.clusterList.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace("CL_", "")) -
      Number(b.Cluster_ID.replace("CL_", ""))
    );
  });
}
const getClusterStatus = (clusterIndex) => {
  if (!healthNetworkData.value.clusterList || !healthNetworkData.value.clusterList[clusterIndex]) {
    return 0;
  }
  let state = healthNetworkData.value.clusterList[clusterIndex].Cluster_State;
  if (state >= 40) {
    
    //40이상이면 관심이면서 주의/위험
    return state - 40;
  }
  return state;
}

const getClusterColor = (clusterIndex) => {
  const status = getClusterStatus(clusterIndex);
  
  switch (status) {
    case 0: case 1:
      return 'safe'
    case 2: case 42:
      return 'warn'
    case 3: case 43:
      return 'danger'
    case 4:
      return 'interest'
    default:
      return 'safe'
  }
}
const getOption = (zoom = 1) => {
  // 매번 새로 계산하되, isZoomMode일 때는 애니메이션만 비활성화
  let convexHullData = getClusterData();
  
  // isZoomMode일 때는 애니메이션만 비활성화하고 배경색은 유지
  if (isZoomMode.value) {
    convexHullData = convexHullData.map(item => {
      // style.fill이 함수인 경우 실제 색상 값을 계산
      let actualFill = item.style?.fill;
      if (typeof actualFill === 'function') {
        try {
          actualFill = actualFill();
        } catch (error) {
          console.warn('fill 함수 실행 실패:', error);
          actualFill = '#7171711A';
        }
      }
      
      return {
        ...item,
        keyframeAnimation: null, // 애니메이션 제거
        enterAnimation: null,    // 애니메이션 제거
        enterFrom: null,         // 애니메이션 제거
        style: {
          ...item.style,
          fill: actualFill, // 실제 색상 값 사용
          opacity: 1, // 항상 불투명하게 표시
        }
      };
    });
  }
      
  const option = {
    tooltip: {},
    legend: [],
    xAxis: { show: false },
    yAxis: { show: false },
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
        data: healthNetworkData.value.nodeList, //노드 리스트 세팅
        links: linkList.value, //연결 정보 데이터 세팅

        label: {
          show: true,
          position: "right",
          formatter: limitTwoLines,
          opacity: 1,
          fontSize: isZoomMode.value ? 0.5 * resolution * FONT_SCALE * (document.documentElement.clientWidth >= 960 ? 2 : 1) : 12,
          lineHeight: isZoomMode.value ? Math.round(0.5 * resolution * FONT_SCALE * (document.documentElement.clientWidth >= 960 ? 2 : 1) * 1.15) : 14,
          animation: false, // 라벨만 애니메이션 비활성화
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
        lineStyle: {
          color: "source",
          opacity: 0.25,
        },
      },
    ],
  };

  return option;
}

const getOption2 = (zoom=1) => {
  zoom;
  let optionData = getClusterData();
  return optionData;
}

// 라벨 줄 수를 최대 2줄로 제한하는 포맷터
const limitTwoLines = (params) => {
  const name = typeof params === 'string' ? params : params?.name || '';
  if (!name) return '';
  // 너무 강한 하이픈 분리는 피하고, 공백 기준으로 두 줄로 재조합
  const words = name.split(/\s+/);
  if (words.length <= 2) return name; // 짧은 텍스트는 그대로
  // 대강 절반 분할 후 최대 두 줄
  const mid = Math.ceil(words.length / 2);
  const first = words.slice(0, mid).join(' ');
  const second = words.slice(mid).join(' ');
  return `${first}\n${second}`;
}

const getClusterData = () => {
  let optionData = [];

  let selectIndex = [];

  // prepareData에서 사용한 고정값을 사용 (배경 위치가 노드 위치와 일치하도록)
  // getClusterData에서는 /1.35를 사용하지만, prepareData의 rateX를 기준으로 계산
  const rateX = fixedRateX ? (fixedRateX * 1.2 / 1.35) : (getRateX() / 1.35);
  const rateY = fixedRateY || getRateY();

  // let _scale = 0.2115 * scale * rateY;
  let _scale = 0.2115 * scale.value * rateY;
  const offset = 3 * _scale;
  let offsetX = -126 * rateX;
  let offsetY = 43.5 * rateY;
  let clusterCount = 0; // 로컬 카운터로 변경

  const radius = 60 * _scale;
  // var testIndex = 4;

  var polygonList = [];
  var polygonId = 0;
  healthNetworkData.value.clusterList.forEach((element, index) => {
    
    // if (index + 1 !== testIndex) return;
    let points = [];
    
    // 클러스터에 해당하는 노드 위치값 추출
    element.nodes.forEach((el) => {
      points.push([el.x * _scale, el.y * _scale]);
      /* selectIndex.push(el.index);  */
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
    
    /** 일정범위 넘어가는 포인트들은 각각의 그룹으로 분리 */ 

    // 11. 운동수행능력/지구력향상인경우 두 그룹으로 분리가 필요하여 범위기준을 120으로 축소해둠. 이외에는 160으로 통일.
    var clusters = [];
    if (index + 1 == 11) {
      clusters = clustering(points, 120 * rateY);
    } else {
      clusters = clustering(points, 160 * rateY);
    }

    // 위 건강일때, 클러스터 영역이 두 그룹으로 나뉘는데 첫 번재 그룹의 위치 조정이 되었는지의 여부를 확인 
    let index11FirstGroupCenterControl = false
    // 갱년기여성건강 일때, 클러스터 영역이 두 그룹으로 나뉘는데 두 번째 그룹의 위치조정을 위해 첫 번째 그룹이 지나갔는지 여부를 확인
    let index1FirstGroupPass = false
    
    clusters.forEach((cl_element) => {
      
      let _radius = 0;
      
      polygonId++;

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
      // 백그라운드 그룹화를 하기 위해
      let centerPoints = centroid(points);

      offsetX = -126 * rateX;
      offsetY = 43.5 * rateY;

      /** 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌 */ 
      // 디바이스별 위치 설정이 필요할때
      var device_width = document.documentElement.clientWidth;
      // Cluster : 관절/뼈 건강
      if (index + 1 === 3) {
        // Node: 관절 조직 및 구조변화 (텍스트가 갈어지면서 두줄로 되어 노드위치가 올라갔기 때문)
        points.push([centerPoints[0], top - radius * 0.1]);
      }
      if (index + 1 === 4) {
        //Node : 식사의질 노드 포함 및 영역 조정
        points.push([left, centerPoints[1] - radius * 7]);
        points.push([right + radius * 0.2, centerPoints[1]]);
      }

      // Cluster: 면역기능
      if (index + 1 === 9) {
      //Node : 면역글로불린 노드 포함
      points.push([centerPoints[0], top - radius * 0.01]);
      }

      if (index + 1 === 19) {
        //Node : 만성질환 억제분석 지수 노드 포함
        points.push([right, centerPoints[1] - radius * 3]);
      }
      
      // Cluster : 코 과민반응 
      if (index + 1 === 24) {
        //Node : 코 임상적 증상 포함 (텍스트가 갈어지면서 두줄로 되어 노드위치가 올라갔기 때문)
        points.push([centerPoints[0], top - radius * 0.3]);
      }
      
      // Cluster: 긴장완화
      if (index + 1 === 6) {

        //Node : 스트레스 포함
        points.push([centerPoints[0], top + 20]);
      }
      
      // Cluster: 혈행개선
      if (index + 1 === 22) {
        //Node : 적혈구 변형, 혈관 탄력성 포함
        points.push([centerPoints[0], top - radius * 0.01]);
      }

      // Cluster: 전립선 건강
      if (index + 1 === 14) {
        //Node : 전립선 임상적 증상 포함 
        points.push([centerPoints[0], top - radius * 0.0001]);
      }

      // Cluster: 위 건강
      if (index + 1 === 12) {
        // 위 건강은 두 그룹으로 영역이 표시되는데, 첫번째 그룹만 조정이 필요하기 때문에 분기 처리 필요.
        // 첫번째 그룹이 조정되면, index11FirstGroupCenterControl을 true 로 변경하여 두번재 그룹에 영향이 없도록 함.
        if ( !index11FirstGroupCenterControl ) {
          // Node : 소화효소 활성, 위/소장운동 포함 
          points.push([centerPoints[0], centerPoints[1] - radius * 3]);
          //points.push([centerPoints[0], bottom - 120]);
          index11FirstGroupCenterControl = true 
        }
      }
      // Cluster: 영양균형

      if (index + 1 === 25) {

        // 모바일 이상의 크기일때.

        // 430 : iphone 16 plus 기준

        if(device_width > 430) {

          points.push([centerPoints[0] + 20, centerPoints[1]]);
        }

      } 


      

      /** 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌 */
      
      // Cluster : 긴장완화
      if (index === 5) {
        _radius = 90 * _scale;

      // Cluster : 갱년기 여성건강
      } else if(index === 1) {

        _radius = 150 * _scale;
        
        // 두번째 그룹 이면서 모바일 이상의 크기일때.
        // 430 : iphone 16 plus 기준
        if(index1FirstGroupPass && device_width > 430) {
          _radius = 250 * _scale;
        } 

        if(!index1FirstGroupPass) index1FirstGroupPass = true

      // 나머지 클러스터 
      } else {
        _radius = 60 * _scale;
      }

      points.forEach((elem, index) => {
        index;
        const vector = getVector(elem, centerPoints);
        elem[0] += vector[0] * _radius;
        elem[1] += vector[1] * _radius;
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
      healthNetworkData.value.cluster_left_list.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== userInfo.sex)
            includeSex = false;
        }
      });
      healthNetworkData.value.cluster_right_list.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== userInfo.sex)
            includeSex = false;
        }
      });

      // 하이라이트된 클러스터인지 확인
      const isHighlighted = highlightedClusterIndex.value === index;
      
      // 클러스터 상태에 따른 stroke 색상 결정 (하이라이트용)
      let strokeColor = "transparent";
      if (isHighlighted) {
        // 하이라이트될 때 클러스터 상태에 맞는 색상 사용
        const clusterState = element.Cluster_State >= 40 ? element.Cluster_State - 40 : element.Cluster_State;
        switch (clusterState) {
          case 0:
          case 1:
            strokeColor = "#717171";
            break;
          case 2:
            strokeColor = "#F8B500";
            break;
          case 3:
            strokeColor = "#E95371";
            break;
          case 4:
            strokeColor = "#00AFEC";
            break;
          default:
            strokeColor = "#717171";
            break;
        }
      } else if (existInterestBorder) {
        strokeColor = "#55C3F1";
      }
      
      // 해당 성별에서 보여야하는 리스트인지 판단 후 맞는 경우 상태값에 따라 배경색 설정
      if (includeSex) {
        // 하이라이트된 클러스터는 원래 색상 유지 (내부 배경색 변경하지 않음)
        // 일반 클러스터는 하이라이트된 클러스터가 있으면 흐리게 표시
        const baseOpacity = highlightedClusterIndex.value !== null && !isHighlighted ? 0.3 : 1;
        
        switch (element.Cluster_State) {
          case 0:
            color = `#717171${Math.round(26 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 1:
            color = `#717171${Math.round(26 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 2:
            color = `#F8B500${Math.round(38 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 3:
            color = `#E95371${Math.round(77 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 4:
            color = `#00AFEC${Math.round(102 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          default:
            break;
        }

        switch (element.Cluster_State - 40) {
          case 0:
            color = `#717171${Math.round(26 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 1:
            color = `#717171${Math.round(26 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 2:
            color = `#F8B500${Math.round(38 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 3:
            color = `#E95371${Math.round(77 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          case 4:
            color = `#00AFEC${Math.round(102 * baseOpacity).toString(16).padStart(2, '0')}`;
            break;
          default:
            break;
        }
      } else {
        color = "#7171711A";
      }

      // 클러스터 하나씩 켜지는 애니메이션
      var enterFrom = {};
      var enterAnimation = {};
      var keyframeAnimation = [];
      if (!hasAnimated.value) {
        // 애니메이션 시작 시간 기록 (최초 한 번만)
        if (animationStartTime.value === 0) {
          animationStartTime.value = Date.now();
          isAnimating.value = true; // 애니메이션 시작 플래그 설정
        }
        
        // 현재 시간을 기준으로 애니메이션 상태 계산
        const currentTime = Date.now();
        const elapsedTime = currentTime - animationStartTime.value;
        const clusterDelay = 2500 + 50 * clusterCount;
        
        // 이미 애니메이션이 시작되어야 할 시간이 지났다면 완료된 상태로 표시
        if (elapsedTime >= clusterDelay) {
          enterFrom = {};
          enterAnimation = {};
          keyframeAnimation = [];
        } else {
          // 아직 애니메이션 시작 시간이 안 되었다면 애니메이션 설정 생성
          enterFrom = {}; // 회색 깜빡임 방지를 위해 빈 객체로 설정
          enterAnimation = {
            delay: clusterDelay - elapsedTime, // 남은 시간만큼 지연
            duration: 1.25,
            easing: "linear",
          };
          keyframeAnimation = [
            {
              delay: clusterDelay - elapsedTime,
              duration: 1.25,
              loop: false,
              keyframes: [
                {
                  percent: 0,
                  style: { 
                    opacity: 0,
                    fill: "#7171711A" // 처음에는 회색 배경
                  },
                },
                {
                  percent: 1,
                  style: {
                    opacity: 1,
                    fill: color, // 애니메이션 완료 후 실제 색상으로 변경
                  },
                },
              ],
            },
          ];
        }
      } else {
        // 애니메이션이 완료된 후에는 애니메이션 설정을 빈 객체로 설정
        enterFrom = {};
        enterAnimation = {};
        keyframeAnimation = [];
      }
      enterFrom;
      enterAnimation;
      optionData.push({
        type: "polygon",
        shape: {
          points: points,
          smooth: 0.5,
        },
        keyframeAnimation: keyframeAnimation,
        enterFrom: enterFrom,        // 추가: 초기 상태 설정
        enterAnimation: enterAnimation, // 추가: 애니메이션 설정
        left: x.value + left + offsetX,
        top: y.value + top + offsetY,
        focus: "none",
        silent: true,
        style: {
          fill: hasAnimated.value ? color : (() => {
            // 애니메이션 실행 중일 때는 현재 시간을 기준으로 색상 결정
            if (!hasAnimated.value && animationStartTime.value > 0) {
              const currentTime = Date.now();
              const elapsedTime = currentTime - animationStartTime.value;
              const clusterDelay = 2500 + 50 * clusterCount;
              
              // 이미 애니메이션이 시작되어야 할 시간이 지났다면 실제 색상 표시
              if (elapsedTime >= clusterDelay) {
                return color;
              }
            }
            return "black"; // 기본값
          })(),
          opacity: hasAnimated.value ? 1 : (() => {
            // 애니메이션 실행 중일 때는 현재 시간을 기준으로 투명도 결정
            if (!hasAnimated.value && animationStartTime.value > 0) {
              const currentTime = Date.now();
              const elapsedTime = currentTime - animationStartTime.value;
              const clusterDelay = 2500 + 50 * clusterCount;
              
              // 이미 애니메이션이 시작되어야 할 시간이 지났다면 불투명하게 표시
              if (elapsedTime >= clusterDelay) {
                return 1;
              }
            }
            return 0; // 기본값
          })(),
          // 선 두께를 고정하여 바운딩 변화 방지
          lineWidth: 3,
          stroke: strokeColor,
        },
      });
      
      // 클러스터 카운터 증가
      clusterCount++;
    });
  });

  return optionData;
}

// 노드 하이라이트 관련 함수들
const highlightClusterNodes = (clusterIndex) => {
  
  
  if (!healthNetworkData.value || !healthNetworkData.value.clusterList) {
    
    return;
  }
  
  // 이전 하이라이트 제거
  clearNodeHighlight();
  
  // 클러스터 인덱스 저장
  highlightedClusterIndex.value = clusterIndex;
  
  // 해당 클러스터의 노드들 찾기
  const cluster = healthNetworkData.value.clusterList[clusterIndex];
  if (!cluster || !cluster.nodes) {
    
    return;
  }
  updateChart();
};

const clearNodeHighlight = () => {
  if (!healthNetworkData.value || !healthNetworkData.value.nodeList) return;
  
  // 노드 하이라이트는 사용하지 않으므로 스킵
  // healthNetworkData.value.nodeList.forEach(node => {
  //   if (originalNodeStyles.value.has(node.id)) {
  //     node.itemStyle = { ...originalNodeStyles.value.get(node.id) };
  //   }
  // });
  
  // 하이라이트 상태 초기화
  highlightedClusterIndex.value = null;
  
  // 차트 업데이트
  updateChart();
};

// 별도 배경 하이라이트 함수는 불필요하여 제거

// 툴팁 관련 함수들
const showClusterTooltip = (event, clusterId, alignment = 'left') => {
  // 클러스터 인덱스 찾기 및 노드 하이라이트 (모바일에서도 항상 처리)
  const clusterIndex = findClusterIndexById(clusterId);
  if (clusterIndex !== -1) {
    highlightClusterNodes(clusterIndex);
  }
  
  // expand 상태가 아니고 960px 미만이면 툴팁만 표시하지 않음 (하이라이트는 이미 처리됨)
  const isDesktop = window.innerWidth >= 960;
  if (!props.isExpand && !isDesktop) {
    return;
  }
  
  // 다른 클러스터를 클릭하면 초기 툴팁 플래그를 유지 (사용자가 직접 클릭한 것이므로)
  hasInitialTooltip.value = true;
  
  // Cluster_ID를 키로 사용하여 i18n 키 가져오기
  const i18nKey = healthGuideData[clusterId];
  if (!i18nKey) {
    tooltipContent.value = '정보가 없습니다.';
    return;
  }
  
  // i18n으로 원료 정보 가져오기
  const fullKey = `HealthGuideItems.${i18nKey}`;
  let translatedContent;
  try {
    translatedContent = t(fullKey);
  } catch (e) {
    translatedContent = '정보가 없습니다.';
  }
  
  // 번역이 키와 동일하면 (번역이 없는 경우) 정보 없음 표시
  if (translatedContent === fullKey) {
    translatedContent = '정보가 없습니다.';
  }
  
  tooltipContent.value = translatedContent;
  
  // 클릭한 요소의 위치를 부모 컨테이너 기준으로 계산
  const rect = event.target.getBoundingClientRect();
  const containerRect = document.querySelector('.health-network-container').getBoundingClientRect();
  
  let xPosition;
  if (alignment === 'right') {
    // 오른쪽 정렬: 요소의 오른쪽 끝을 기준으로 툴팁의 오른쪽 끝을 맞춤
    xPosition = rect.right - containerRect.left + 10;
  } else {
    // 왼쪽 정렬: 요소의 왼쪽 시작을 기준으로 툴팁의 왼쪽 시작을 맞춤
    xPosition = rect.left - containerRect.left + 10;
  }
  
  tooltipPosition.value = {
    x: xPosition,
    y: rect.bottom - containerRect.top + 15, // 컨테이너 기준 아래쪽 위치 + 15px 간격
    alignment: alignment // 정렬 정보 저장
  };
  
  showTooltip.value = true;
};

// 클러스터 ID로 인덱스 찾기
const findClusterIndexById = (clusterId) => {
  if (!healthNetworkData.value || !healthNetworkData.value.clusterList) return -1;
  
  const index = healthNetworkData.value.clusterList.findIndex(cluster => {
    return cluster.Cluster_ID === clusterId;
  });
  
  return index;
};

const hideTooltip = () => {
  showTooltip.value = false;
  // 툴팁을 닫을 때 노드 하이라이트도 제거
  clearNodeHighlight();
  // 레이아웃 및 데이터 재배치를 통해 현재 상태에 맞춤
  //resizeProcess();
};

// 첫 번째 클러스터 요소의 기본 툴팁 표시
const showDefaultTooltip = () => {
  // 모바일에서는 기본 툴팁을 표시하지 않음
  const isDesktop = window.innerWidth >= 960;
  if (!props.isExpand && !isDesktop) {
    return;
  }
  
  // 이미 초기 툴팁을 표시했거나 현재 툴팁이 표시 중이면 리턴
  if (hasInitialTooltip.value || showTooltip.value) {
    return;
  }
  
  // 첫 번째 클러스터 요소 찾기 (left-list의 첫 번째)
  if (healthNetworkData.value && healthNetworkData.value.cluster_left_list && healthNetworkData.value.cluster_left_list.length > 0) {
    const firstCluster = healthNetworkData.value.cluster_left_list[0];
    const clusterId = firstCluster.Cluster_ID;
    
    // Cluster_ID를 키로 사용하여 i18n 키 가져오기
    const i18nKey = healthGuideData[clusterId];
    if (!i18nKey) {
      return;
    }
    
    // i18n으로 원료 정보 가져오기
    const fullKey = `HealthGuideItems.${i18nKey}`;
    let translatedContent;
    try {
      translatedContent = t(fullKey);
    } catch (e) {
      return;
    }
    
    // 번역이 키와 동일하면 (번역이 없는 경우) 정보 없음 표시
    if (translatedContent === fullKey) {
      return;
    }
    
    tooltipContent.value = translatedContent;
    
    // 첫 번째 클러스터 요소의 위치 계산
    setTimeout(() => {
      const firstClusterElement = document.querySelector('.left-list span:first-child');
      if (firstClusterElement) {
        const rect = firstClusterElement.getBoundingClientRect();
        const containerRect = document.querySelector('.health-network-container').getBoundingClientRect();
        
        tooltipPosition.value = {
          x: rect.left - containerRect.left + 10,
          y: rect.bottom - containerRect.top + 15,
          alignment: 'left'
        };
        
        showTooltip.value = true;
        hasInitialTooltip.value = true;
      }
    }, 100); // DOM 업데이트 후 실행
  }
};

// expand 상태가 변경되면 툴팁 처리
watch(() => props.isExpand, (newValue) => {
  if (!newValue && showTooltip.value) {
    hideTooltip();
    hasInitialTooltip.value = false; // 초기 툴팁 플래그 리셋
  } else if (newValue) {
    // expand 상태가 되면 기본 툴팁 표시
    setTimeout(() => {
      showDefaultTooltip();
    }, 200);
  }
});

// 컴포넌트 언마운트 시 하이라이트 정리
onUnmounted(() => {
  clearNodeHighlight();
});

// 화면 크기 변화 감지하여 기본 툴팁 표시
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const isDesktop = window.innerWidth >= 960;
    if (isDesktop && !hasInitialTooltip.value) {
      showDefaultTooltip();
    } else if (!isDesktop && !props.isExpand && showTooltip.value) {
      hideTooltip();
      hasInitialTooltip.value = false;
    }
  }, 300);
});
</script>


<template>
  <div class="health-network-container">
    
    <div class="chart-wrap" ref="chartwrap">
      <div class="echart" ref="chart" id="ehChart"></div>
      
      <div 
        class="cluster-list" 
        v-if="healthNetworkData"
      >
      <div class="left-list">
          <template v-for="(list, i) in healthNetworkData.cluster_left_list" :key="i">
            <div class="cluster-item">
              <span 
                :class="[
                  getClusterColor(list.index),
                  list.name === t('ClusterName.CL_008') ? 'sensitive-skin' : ''
                ]"
                @click="showClusterTooltip($event, list.Cluster_ID, 'left')"
                style="cursor: pointer;"
              >
                {{ list.name }}
              </span>
              <img 
                v-if="list.hasMedication" 
                src="/img/ic_medic_grey.svg" 
                alt="복약중" 
                class="medication-icon"
              />
            </div>
          </template>
        </div>
        <div class="right-list">
          <template v-for="(list, i) in healthNetworkData.cluster_right_list" :key="i">
            <div class="cluster-item">
              <span 
                :class="[
                  getClusterColor(list.index),
                  list.name === t('ClusterName.CL_011') ? 'exercise-endurance' : '',
                  list.name === t('ClusterName.CL_002') ? 'menopause-health' : ''
                ]"
                @click="showClusterTooltip($event, list.Cluster_ID, 'right')"
                style="cursor: pointer;"
              >
                {{ list.name }}
              </span>
              <img 
                v-if="list.hasMedication" 
                src="/img/ic_medic_grey.svg" 
                alt="복약중" 
                class="medication-icon"
                @click.stop
              />
            </div>
          </template>
        </div>
        <div class="right-list"></div>
      </div>
    </div>

    <!-- <div class="zoom-info" v-if="isZoomMode && healthNetworkData">
      <div>
        {{ healthNetworkData.clusterList[zoomIndex].Cluster_NAME }}
      </div>
      <i class='i-close white btn'  @click="resetZoom()"  ></i>
    </div> -->

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

    <!-- 클러스터 커스텀 툴팁 -->
    <div 
      v-if="showTooltip" 
      class="tooltip--wrap"
      :class="{ 'tooltip--default': hasInitialTooltip }"
      :style="{
        position: 'absolute',
        left: tooltipPosition.x + 'px',
        top: tooltipPosition.y + 'px',
        transform: tooltipPosition.alignment === 'right' ? 'translate(-100%, 0)' : 'translate(0, 0)',
        zIndex: 1000
      }"
    >
      <div class="tooltip--contents">
        <div 
          class="tooltip--edge" 
          :style="tooltipPosition.alignment === 'right' ? { left: 'auto', right: '-30px' } : { left: '10px' }"
        ></div>
        <p>{{ tooltipContent }}</p>
      </div>
      <div class="tooltip--close">
        <button @click="hideTooltip" type="button" aria-label="닫기" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.health-network-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1500px;
  margin: -2rem auto 0;
  
  @media (min-width: 960px) {
    border-bottom: 1px solid #e5e5e5;
    .tooltip--wrap {
      width: max-content;
      min-width: 20rem;
      max-width: 40rem;
    }
  }
}

.chart-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 40rem;
  @media (min-width: 960px) {
    height: 140rem;
  }
}

.cluster-list {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
  @media (min-width: 960px) {
    max-width: 290rem;
    left: 97%;
    transform: translateX(-50%);
  }

  .left-list,
  .right-list {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
    padding: 20px 0;
    @media (min-width: 960px) {
      height: calc(100% + 15rem);
      top: -10rem;
    }
    span {
      display: inline-block;
      font-size: 1.2rem;
      padding: 4px 8px;
      margin: 2px 0;
      color: rgba(65, 64, 66, 0.6);
      @media (min-width: 600px) {
        font-size: 1.6rem;
      }
      @media (min-width: 960px) {
        font-size: 3.8rem;
        border: 1px solid #7e7e7e;
        border-radius: 3.8rem;
        padding: 8px 24px;
        &.danger{
          border-color: #e95371;
        }
        &.warn{
          border-color: #f8b500;
        }
        &.interest{
          border-color: #55C3F1;
        }
        &.sensitive-skin,
        &.exercise-endurance,
        &.menopause-health{
          border-radius: 6rem;
        }
      }
    }
  }
  .left-list {
    left: 0;
    max-width: 80px;
    align-items: flex-start;
    @media (min-width: 600px) {
      max-width: 10rem;
    }
    @media (min-width: 960px) {
      max-width: 26rem;
      .sensitive-skin{
        width: 20rem;
      }
    }
    span {
      text-align: left;
    }
  }
  .right-list {
    right: 0;
    max-width: 105px;
    align-items: flex-end;
    @media (min-width: 600px) {
      max-width: 10rem;
    }
    @media (min-width: 960px) {
      max-width: 30rem;
      .exercise-endurance{
        width: 26rem;
      }
      .menopause-health{
        width: 19rem;
      }
    }
    span {
      text-align: right;
    }
  }

  // 클러스터 상태별 색상 클래스
  .danger {
    background-color: transparent;
    color: #F6746F !important;
  }
  .warn {
    background-color: transparent;
    color: #F6AE5A !important;
  }
  .safe {
    background-color: transparent ;
    color: #717171 !important;
  }
  .interest {
    background-color: transparent;
    color: #55C3F1 !important;
  }
}



.zoom-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 20;
  
  .i-close {
    cursor: pointer;
    width: 16px;
    height: 16px;
    background: url('/img/ico_x.svg') no-repeat center;
    background-size: contain;
  }
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
  
  .loading-box {
    text-align: center;
    
    p {
      margin-bottom: 10px;
      color: #666;
    }
    
    .loading-icon {
      display: flex;
      justify-content: center;
      gap: 5px;
      
      span {
        width: 8px;
        height: 8px;
        background: #00AFEC;
        border-radius: 50%;
        animation: loading 1.4s infinite ease-in-out both;
        
        &:nth-child(1) { animation-delay: -0.32s; }
        &:nth-child(2) { animation-delay: -0.16s; }
      }
    }
  }
}

// 클러스터 커스텀 툴팁 스타일
.cluster-tooltip-wrap {
  .cluster-tooltip-contents {
    position: relative;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    
    .cluster-tooltip-edge {
      position: absolute;
      top: -8px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid white;
      
      &::before {
        content: '';
        position: absolute;
        top: 1px;
        left: -8px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #ddd;
        z-index: -1;
      }
    }
  }
  
  .cluster-tooltip-close {
    position: absolute;
    top: 8px;
    right: 8px;
    
    button {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      
      &::after {
        content: '×';
        font-size: 20px;
        color: #999;
      }
      
      &:hover::after {
        color: #333;
      }
    }
  }
}
.medication-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  display: inline-block;
  position: absolute;
  right: -19px;
  @media (min-width: 960px) {
    width: 24px;
    height: 24px;
    transform: scale(2);
    right: -48px;
  }
}


.cluster-list {
  .left-list,
  .right-list {
    .cluster-item {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }
  }
}

.tooltip-content {
  max-width: 300px;
  
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    color: #333;
    word-break: keep-all;
  }
}
</style> 
