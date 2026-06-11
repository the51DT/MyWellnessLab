<script setup>

import { computed, ref, onBeforeUnmount, onMounted, watch, nextTick, onBeforeMount, defineExpose, defineProps, defineEmits } from 'vue';
// import { sessionStore, loadingStore } from '@/store/store'
import jsPDF from 'jspdf'
import html2canvas from "html2canvas";
// import router from '@/router/index.js';

import { renderImage, datetimeStrToDateFormat, convertName } from '@/utils/common.js'
import { HEALTH_NETWORK_CLUSTER_NUTRIENT, HEALTH_NETWORK_CLUSTER_NAME } from "@/utils/textCollection.js";
// import HeaderComponent from '@/components/header/HeaderComponent.vue'
import FrontCoverPage from "./DocumentPages/FrontCoverPage.vue";
import SummaryPage from "./DocumentPages/SummaryPage.vue";
import SummaryPageExcludeInbody from "./DocumentPages/SummaryPageExcludeInbody.vue";
import HealthCheckupRecordPage from "./DocumentPages/HealthCheckupRecordPage.vue";
import HealthStatusPage from "./DocumentPages/HealthStatusPage.vue";
import HealthStatusPageExcludeInbody from "./DocumentPages/HealthStatusPageExcludeInbody.vue";
import Health2DLocationPage from "./DocumentPages/Health2DLocationPage.vue";
import Health3DLocationPage from "./DocumentPages/Health3DLocationPage.vue";
import HealthOxiPage from "./DocumentPages/HealthOxiPage.vue";
import HealthMetPage from "./DocumentPages/HealthMetPage.vue";
import HealthMusPage from "./DocumentPages/HealthMusPage.vue";
import HealthMusPageExcludeInbody from "./DocumentPages/HealthMusPageExcludeInbody.vue";
import HealthAgingSpeedPage from "./DocumentPages/HealthAgingSpeedPage.vue";
import HealthAgingFactorPage from "./DocumentPages/HealthAgingFactorPage.vue";
import HealthAgingFactorPageExcludeInbody from "./DocumentPages/HealthAgingFactorPageExcludeInbody.vue";
import HealthDangerFactorPage1 from "./DocumentPages/HealthDangerFactorPage1.vue";
import HealthDangerFactorPage2 from "./DocumentPages/HealthDangerFactorPage2.vue";
import HealthDangerFactorPage3 from "./DocumentPages/HealthDangerFactorPage3.vue";
import HealthDangerFactorPage4 from "./DocumentPages/HealthDangerFactorPage4.vue";
import HealthDangerFactorPage5 from "./DocumentPages/HealthDangerFactorPage5.vue";
import HealthDangerFactorPage6 from "./DocumentPages/HealthDangerFactorPage6.vue";
import RfsRecommendPage1 from './DocumentPages/RfsRecommendPage1.vue';
import RfsRecommendPage2 from './DocumentPages/RfsRecommendPage2.vue';
import MyMusclePage from './DocumentPages/MyMusclePage.vue';
import MyMusclePageExcludeInbody from './DocumentPages/MyMusclePageExcludeInbody.vue';
import MyMuslcRecommendPage from './DocumentPages/MyMuslcRecommendPage.vue';
import MyMuslcRecommendPageExcludeInbody from './DocumentPages/MyMuslcRecommendPageExcludeInbody.vue';
import MySleepHabitPage from './DocumentPages/MySleepHabitPage.vue';
import MySleepHabitRecommendPage from './DocumentPages/MySleepHabitRecommendPage.vue';
import HealthNetworkPage from "./DocumentPages/HealthNetworkPage.vue";
import HealthNetworkNutrientPage1 from './DocumentPages/HealthNetworkNutrientPage1.vue';
import HealthNetworkNutrientPage2 from './DocumentPages/HealthNetworkNutrientPage2.vue';
import HealthRFSPage from './DocumentPages/HealthRFSPage.vue';
import HealthExerciseIntensityPage from './DocumentPages/HealthExerciseIntensityPage.vue';
import HealthNetworkSummaryPage from "./DocumentPages/HealthNetworkSummaryPage.vue";
import PageStatic from "./DocumentPages/PageStatic.vue";

// import {
//   getDietQualityReport,
//   getSleepHabitScoreReport,
//   getHealthConditionReport,
//   getARIndicatorReport,
//   getMHN2Report,
//   getHealthScore1Report,
//   getHealthScore2Report,
//   getHealthCheckupHistoryReport,
//   getHealthCheckup,
//   getExerciseIntensityReport
// } from "@/api/vitalLogHandler.js";

// import {
//   setUserActionLog,
//   getHealthReportInfo
// } from '@/api/userHandler.js';

import { sleep } from "@/utils/common.js";
import { HEALTH_DANGER_FACTOR, HEALTH_DANGER_FACTOR_DESC } from '@/utils/textCollection';
import HealthScore1 from "@/viewModels/HealthScore1.js";
import HealthScore2 from "@/viewModels/HealthScore2.js";
import HealthARIndicator from '@/viewModels/HealthARIndicator';
import HealthCondition from '@/viewModels/HealthCondition';
import HealthNetwork from '@/viewModels/HealthNetwork';
import RFSScore from '@/viewModels/RFSScore';
import HealthSleepHabits from '@/viewModels/HealthSleepHabits';
import HealthCheckupRecord from '@/viewModels/HealthCheckupRecord';
import ExerciseIntensity from "@/viewModels/ExerciseIntensity.js";

const props = defineProps({
  analyzeData: {
    type: Object,
    default: null
  },
  surveyData: {
    type: Object,
    default: null
  },
  isOneTime: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  hasPdfPassword: {
    type: Boolean,
    default: true
  },
  hidePrivacy: {
    type: Boolean,
    default: false
  },
  save: {
    type: Boolean,
    default: true
  },
  pdfScale: {
    type: Number,
    default: 4
  }
})

const includeInbodyComponents = [
  FrontCoverPage, //1
  PageStatic, //2
  PageStatic, //3
  PageStatic, //4
  SummaryPage, //5
  HealthCheckupRecordPage, //6
  PageStatic, //7
  HealthStatusPage, //8
  PageStatic, //9
  PageStatic, //10
  Health3DLocationPage, //11
  PageStatic, //12
  HealthOxiPage, //13
  HealthMetPage, //14
  HealthMusPage, //15
  PageStatic, //16
  HealthAgingSpeedPage, //17
  HealthAgingFactorPage, //18
  PageStatic, //19
  HealthNetworkPage, //20
  HealthNetworkSummaryPage, //21
  HealthDangerFactorPage1, //22
  HealthDangerFactorPage2, //23
  HealthDangerFactorPage3, //24
  HealthDangerFactorPage4, //25
  HealthDangerFactorPage5, //26
  HealthDangerFactorPage6, //27
  HealthNetworkNutrientPage1, // 28
  HealthNetworkNutrientPage2, // 29
  PageStatic, //30
  HealthRFSPage, //31
  RfsRecommendPage1, //32
  RfsRecommendPage2, //33
  MyMusclePage, //34
  HealthExerciseIntensityPage, //35
  MyMuslcRecommendPage, //36
  MySleepHabitPage, //37
  MySleepHabitRecommendPage, //38
  PageStatic //39
]

const excludeInbodyComponents = [
  FrontCoverPage, //1
  PageStatic, //2
  PageStatic, //3
  PageStatic, //4
  SummaryPageExcludeInbody, //5 --> 체성분 데이터가 없어서 근육밸런스 지수는 잠금 표시.
  HealthCheckupRecordPage, //6
  PageStatic, //7
  HealthStatusPageExcludeInbody, //8
  PageStatic, //9
  PageStatic, //10
  Health2DLocationPage, //11
  PageStatic, //12
  HealthOxiPage, //13
  HealthMetPage, //14
  HealthMusPageExcludeInbody, //15
  PageStatic, //16
  HealthAgingSpeedPage, //17
  HealthAgingFactorPageExcludeInbody, //18
  PageStatic, //19
  HealthNetworkPage, //20
  HealthNetworkSummaryPage, //21
  HealthDangerFactorPage1, //22
  HealthDangerFactorPage2, //23
  HealthDangerFactorPage3, //24
  HealthDangerFactorPage4, //25
  HealthDangerFactorPage5, //26
  HealthDangerFactorPage6, //27
  HealthNetworkNutrientPage1, // 28
  HealthNetworkNutrientPage2, // 29
  PageStatic, //30
  HealthRFSPage, //31
  RfsRecommendPage1, //32
  RfsRecommendPage2, //33
  MyMusclePageExcludeInbody, //34
  HealthExerciseIntensityPage, //35
  MyMuslcRecommendPageExcludeInbody, //36
  MySleepHabitPage, //37
  MySleepHabitRecommendPage, //38
  PageStatic //39
]
const isPdfDownload = ref(false)
const pdfScale = 4;
let pdfProcessing = ref(false)
let popProgress = ref(-1)
let popPDF = ref(-1)
// const pdfBlob = ref(null)
// const pdfFileName = ref(null)
const healthScoreData = ref(null)
const healthArindicatorData = ref(null)
const healthConditionData = ref(null)
const healthNetworkData = ref(null)
const healthRFSData = ref(null)
const healthCheckupRecordData = ref(null) //  건강이력 데이터
const healthSleepHabitsData = ref(null) // 수면 습관 데이터
const healthExerciseIntensityData = ref(null) // 운동 강도 데이터
const check_date = ref(null)

const userInfo = ref(null)
const totalPage = 39;

// const SCROLL_THRESHOLD = 10
// const SCROLL_DELAY = 500
// const scrollArea = ref(null)
// let lastTouchY = null
// let isProcessing = false
// let scrollEndTimer = null;
// const lastPointerY = ref(null)
const renderedBatches = ref(1); // PDF 페이지 배치 인덱스
const pageImageList = ref(null)

// const report_id = ref(0)
const report_no = ref(null)
const loading = ref(true)
const loadingGraph = ref(false) // 나의 건강신호등 페이지 로딩 완료 여부
const loadingLastPage = ref(false)  // 29페이지 로딩 완료 여부
const enableDownload = ref(true) // 다운로드 여부
let isInbodyData = ref(false) // 인바디 데이터 여부 --> 인바디 데이터가 없는경우 몇개의 PDF 가 잠금표시로 보임

const emit = defineEmits(['progress', 'complete'])

const isGenerate = ref(false)

// const test = false
// const testPage = 6

// const useLoadingStore = loadingStore()
// const useSessionStore = sessionStore();

// // const visiblePages = computed(() => {
// //   return Array.from({ length: renderedBatches.value * batchSize }, (_, i) => i + 1)
// // });
const indexRange = computed(() =>
  Array.from({ length: totalPage }, (_, i) => renderedBatches.value + i)
)
// pdf 저장 watch
watch(() => isPdfDownload.value,
  (newVal) => {
    if (newVal) {
      // loadingFinished();
      // exportMultiPagePDF();
      createPDF();
    }
  }
);

// onBeforeUnmount(() => {
//   window.removeEventListener("resize", resizeMultiplePage);
// });
// onBeforeMount(async () => {
//   // 페이지 이동시 스크롤 위치 초기화
//   window.scrollTo(0, 0);

//   /** 사용자 액션 추가 */
//   // await setUserActionLog(`PDF 화면 보기 클릭`)

//   /** pdf 페이지 높이 수정 */
//   var deviceHeight = document.documentElement.clientHeight;
//   var headerHeight = document.querySelector('header').offsetHeight;
//   document.querySelector("#non-section").style.height = deviceHeight - headerHeight + "px";

//   /** 스크롤 이벤트 추가 */
//   const scrollAreaEl = scrollArea.value
//   if (!scrollAreaEl) return

//   scrollAreaEl.addEventListener('wheel', onWheel)
//   scrollAreaEl.addEventListener('touchstart', onTouchStart)
//   scrollAreaEl.addEventListener('touchmove', onTouchMove)
//   scrollAreaEl.addEventListener('touchend', onTouchEnd)
//   scrollAreaEl.addEventListener('pointerdown', onPointerDown)
//   scrollAreaEl.addEventListener('pointermove', onPointerMove)
//   scrollAreaEl.addEventListener('pointerup', onPointerUp)


// });
onMounted(async () => {
  // console.log(JSON.stringify(props.analyzeData));
  // console.log(JSON.stringify(props.surveyData));
  // console.log(JSON.stringify(props.user));
  // window.addEventListener("resize", resizeMultiplePage);

  // console.log(indexRange);

//   useLoadingStore.setLoading(true)

//   /** PDF에 필요한 데이터 전부 가져오기 */
//   report_id.value = useSessionStore.getReportId();
//   report_no.value = useSessionStore.getScode();
  report_no.value = props.isOneTime ? '일회성분석' : props.surveyData.commonInfo.aCode;
//   userInfo.value = { ...useSessionStore.getUserInfo() };
  userInfo.value = { 
    ...props.user,
    user_gender: props.user.gender == 'MALE' ? 1 : 2,
    user_birthdate: props.isOneTime ? props.surveyData.basics.birthDate.replace(/\./g, "-") : props.user.dateOfBirth.replace(/\./g, "-"),
  };

//   if (report_no.value == 0 || report_id.value == 0) {
//     router.push({ path: '/404' })
//     return;
//   }
//   var get_report_info = await getHealthReportInfo(report_id.value)
//   if (get_report_info == null || get_report_info == undefined || get_report_info == "") {
//     router.push('/400').then(() => router.go(0))
//   } else {
//     if (get_report_info.active_flag == 0) {
//       router.push('/400').then(() => router.go(0))
//     }
//   }
//   isInbodyData.value = get_report_info.inbody_id == 0 ? false : true
  isInbodyData.value = props.analyzeData.reportType === '2D' ? false : true

  /** 
   * PDF 에 사용될 사용자 이름은 바이탈 로그 엔진에서 내려온 메시지의 사용자 이름과 통일 되어야 하기 때문에
   * 건강검진 정보에서 사용자 이름을 가져온다
   */

//   var get_health_checkup = await getHealthCheckup(userInfo.value.user_id, report_no.value)
  var get_health_checkup = await getHealthCheckup();
  userInfo.value.user_name = props.isOneTime ? '일회성' : get_health_checkup.name;
  userInfo.value.name = props.isOneTime ? '일회성' : get_health_checkup.name;

  var get_report_health_score = null;

  if (isInbodyData.value) {
//     get_report_health_score = await getHealthScore2Report(userInfo.value.user_id, report_no.value)
    get_report_health_score = await getHealthScore2Report();
    healthScoreData.value = new HealthScore2().setData(get_report_health_score);

    /** PDF 에서 고정이미지로 필요한 pages 폴더 랜딩 */
    pageImageList.value = await renderImage("pdf/pages/3D");

  } else {
//     get_report_health_score = await getHealthScore1Report(userInfo.value.user_id, report_no.value)
    get_report_health_score = await getHealthScore1Report();
    healthScoreData.value = new HealthScore1().setData(get_report_health_score);

    /** PDF 에서 고정이미지로 필요한 pages 폴더 랜딩 */
    pageImageList.value = await renderImage("pdf/pages/2D");
  }


//   var get_health_report_condition = await getHealthConditionReport(userInfo.value.user_id, report_no.value)
  var get_health_report_condition = await getHealthConditionReport();
  healthConditionData.value = new HealthCondition().setData(get_health_report_condition);

//   var get_health_report_arindicator = await getARIndicatorReport(userInfo.value.user_id, report_no.value)
  var get_health_report_arindicator = await getARIndicatorReport();
  healthArindicatorData.value = new HealthARIndicator().setData(get_health_report_arindicator);

//   var get_health_network = await getMHN2Report(userInfo.value.user_id, report_no.value)
  var get_health_network = await getMHN2Report();
  healthNetworkData.value = new HealthNetwork().setData(get_health_network)

//   var get_health_report_rfs = await getDietQualityReport(userInfo.value.user_id, report_no.value)
  var get_health_report_rfs = await getDietQualityReport();
  healthRFSData.value = new RFSScore().setData(get_health_report_rfs)

//   var get_health_report_sleep = await getSleepHabitScoreReport(userInfo.value.user_id, report_no.value)
  var get_health_report_sleep = await getSleepHabitScoreReport();
  healthSleepHabitsData.value = new HealthSleepHabits().setData(get_health_report_sleep);

//   var get_health_checkup_history = await getHealthCheckupHistoryReport(userInfo.value.user_id, report_no.value)
  var get_health_checkup_history = await getHealthCheckupHistoryReport();
  healthCheckupRecordData.value = new HealthCheckupRecord().setData(get_health_checkup_history)

//   var get_exercise_intensity = await getExerciseIntensityReport(userInfo.value.user_id, report_no.value)
  var get_exercise_intensity = await getExerciseIntensityReport();
  healthExerciseIntensityData.value = new ExerciseIntensity().setData(get_exercise_intensity)

  // check_date.value = healthScoreData.value.health_reg_date
  check_date.value = props.analyzeData.regDate
  loading.value = false;
//   useLoadingStore.setLoading(false)
});

const getHealthCheckup = () => {
  return {
    name: props.user.name,
  }
}

const getHealthConditionReport = () => {
  return {
    comphckData: props.analyzeData.comphckData,
    comphckMsg: props.analyzeData.comphckMsg,
  }
}

const getHealthCheckupHistoryReport = () => {
  return {
    hcrData: props.analyzeData.hcrData,
    hcrReference: props.analyzeData.hcrReference,
  }
}

const getARIndicatorReport = () => {
  return {
    ariData: props.analyzeData.ariData,
    ariStatus: props.analyzeData.ariStatus,
    ariMean: props.analyzeData.ariMean,
    ariMax: props.analyzeData.ariMax,
    ariReference: props.analyzeData.ariReference,
    ariRisk: props.analyzeData.ariRisk,
  }
}

const getHealthScore1Report = () => {
  var hq_htype = props.analyzeData.hqHtype;
  hq_htype.msg = hq_htype.msgData
  hq_htype.msg.msg_hs = convertName(hq_htype.msg.msg_hs, userInfo.value.user_name);
  hq_htype.msg.msg_total = convertName(hq_htype.msg.msg_total, userInfo.value.user_name);

  var hq_reage = props.analyzeData.hqReage;
  hq_reage.msg = convertName(hq_reage.msg, userInfo.value.user_name);

  var hq_met = props.analyzeData.hqMet;
  hq_met.msg = convertName(hq_met.msg, userInfo.value.user_name);

  var hq_oxi = props.analyzeData.hqOxi;
  hq_oxi.msg = convertName(hq_oxi.msg, userInfo.value.user_name);

  return {
    hqReference: props.analyzeData.hqReference,
    hq_ar: props.analyzeData.hqAr,
    hq_htype: hq_htype,
    hq_reage: hq_reage,
    hq_oxi: hq_oxi,
    hq_met: hq_met,
    reg_date: props.analyzeData.regDate,
  }
}

const getHealthScore2Report = () => {
  var hq_htype = props.analyzeData.hqHtype;
  hq_htype.msg.msg_hs = convertName(hq_htype.msg.msg_hs, userInfo.value.user_name);
  hq_htype.msg.msg_total = convertName(hq_htype.msg.msg_total, userInfo.value.user_name);

  var hq_reage = props.analyzeData.hqReage;
  hq_reage.msg = convertName(hq_reage.msg, userInfo.value.user_name);

  var hq_met = props.analyzeData.hqMet;
  hq_met.msg = convertName(hq_met.msg, userInfo.value.user_name);

  var hq_oxi = props.analyzeData.hqOxi;
  hq_oxi.msg = convertName(hq_oxi.msg, userInfo.value.user_name);

  var hq_musBal = props.analyzeData.hqMusBal;
  hq_musBal.msg = convertName(hq_musBal.msg, userInfo.value.user_name);

  var hq_musMass = props.analyzeData.hqMusMass;
  hq_musMass.msgData.msg_common = convertName(hq_musMass.msgData.msg_common, userInfo.value.user_name);
  
  for (var value of hq_musMass.exerciseData) {
    value.msg = convertName(value.msg, userInfo.value.user_name);
  }
  hq_musMass.exerciseData = hq_musMass.exerciseData;


  return {
    hqReference: props.analyzeData.hqReference,
    hq_ar: props.analyzeData.hqAr,
    hq_htype: hq_htype,
    hq_reage: hq_reage,
    hq_oxi: hq_oxi,
    hq_met: hq_met,
    reg_date: props.analyzeData.regDate,
    hq_musBal: hq_musBal,
    hq_musMass: hq_musMass,
  }
}

const getDietQualityReport = () => {
  var dqMsg = props.analyzeData.dqMsg;
  if(dqMsg.clMessage) dqMsg.clMessage = convertName(dqMsg.clMessage, userInfo.value.user_name);
  dqMsg.dqMessage = convertName(dqMsg.dqMessage, userInfo.value.user_name);
  dqMsg.dqMessage_sub1 = convertName(dqMsg.dqMessage_sub1, userInfo.value.user_name);
  return {
    dqStatus: props.analyzeData.dqStatus,
    dqMax: props.analyzeData.dqMax,
    dqCut: props.analyzeData.dqCut,
    dqData: props.analyzeData.dqData,
    dqMsg: dqMsg,
  }
}

const getExerciseIntensityReport = () => {
  var metMsg = props.analyzeData.metMsg;
  metMsg.metMessage = convertName(metMsg.metMessage, userInfo.value.user_name);
  return {
    metData: props.analyzeData.metData,
    metStatus: props.analyzeData.metStatus,
    metPercent: props.analyzeData.metPercent,
    metMsg: metMsg,
  }
}

const getSleepHabitScoreReport = () => {
  var shMsg = props.analyzeData.shMsg;
  shMsg.shMessage = convertName(shMsg.shMessage, userInfo.value.user_name);

  return {
    shData: props.analyzeData.shData,
    shStatus: props.analyzeData.shStatus,
    shMsg: shMsg,
  }
}

const getMHN2Report = () => {
  return {
    nodeList: props.analyzeData.nodeList,
    clusterList: props.analyzeData.clusterList,
    edgeList: props.analyzeData.edgeList,
    ncList: props.analyzeData.ncList,
    drug: props.analyzeData.drug,
    drug_Msg: '',
  }
}

// const applyScroll = async (direction) => {
//   useLoadingStore.setLoading(true)

//   if (direction === 'down') {
//     if (renderedBatches.value < totalPage) // 마지막 페이지는 스크롤 안됨
//       renderedBatches.value++
//   } else if (direction === 'up') {
//     if (renderedBatches.value > 1) // 1페이지는 스크롤 안됨
//       renderedBatches.value--
//   }
//   await sleep(SCROLL_DELAY)
//   useLoadingStore.setLoading(false)
// }
// const onWheel = async (event) => {
//   event.preventDefault(); // 브라우저 기본 스크롤 막음

//   if (scrollEndTimer) clearTimeout(scrollEndTimer);
//   // PC 에서 마우스 휠을 사용한 스크롤 이벤트 조정
//   // 마우스 휠의 이벤트 종료를 감지하여 이벤트 실행
//   scrollEndTimer = setTimeout(async () => {
//     if (event.deltaY > 0) {
//       await applyScroll('down')
//     } else if (event.deltaY < 0) {
//       await applyScroll('up')
//     }
//   }, 200);
// }

// const onTouchMove = async (event) => {
//   if (isProcessing || lastTouchY === null) return

//   const currentY = event.touches[0].clientY
//   const delta = currentY - lastTouchY

//   if (Math.abs(delta) > 10) {
//     isProcessing = true
//     useLoadingStore.setLoading(true)

//     if (delta < 0) {
//       await applyScroll('down')
//     } else {
//       await applyScroll('up')
//     }

//     await sleep(SCROLL_DELAY)
//     useLoadingStore.setLoading(false)
//     isProcessing = false
//     lastTouchY = null // 한 번 처리 후 기준점 초기화
//   }
// }
// const onTouchStart = (event) => {
//   lastTouchY = event.touches[0].clientY
// }
// const onTouchEnd = () => {
//   lastTouchY = null
// }
// const onPointerMove = async (event) => {
//   if (event.pointerType !== 'touch') return

//   const currentY = event.clientY
//   if (lastPointerY.value === null || isProcessing) return

//   const delta = currentY - lastPointerY.value

//   if (Math.abs(delta) > SCROLL_THRESHOLD) {
//     isProcessing = true
//     useLoadingStore.setLoading(true)

//     if (delta < 0) {
//       await applyScroll('down')
//     } else {
//       await applyScroll('up')
//     }

//     await sleep(SCROLL_DELAY)

//     // ✅ 기준점 잠시 비우고, 다음 pointerdown에서만 갱신
//     lastPointerY.value = null
//     useLoadingStore.setLoading(false)
//     isProcessing = false
//   }
// }

// const onPointerDown = (event) => {
//   if (event.pointerType === 'touch') {
//     lastPointerY.value = event.clientY
//   }
// }
// const onPointerUp = () => {
//   lastPointerY.value = null
// }
// const pdfSaveProgress = (progress) => {
//   // 반올림하여 정수로 표현
//   popProgress.value = Math.round(progress / totalPage * 100);
// }

// const pdfDownloadStart = () => {
//   isPdfDownload.value = true;
//   popProgress.value = 0;
//   popPDF.value = -1;
// }

const generate = () => {
  isPdfDownload.value = true;
  isGenerate.value = true;
}

defineExpose({
  generate,
  // pdfDownloadStart,
})

// const pdfDownloadStop = () => {
//   isPdfDownload.value = false;
//   popProgress.value = -1;
// }
// const pdfDownloadFinished = (data, filename) => {
const pdfDownloadFinished = () => {
  // if (needBlodDownload()) {
  //   pdfBlob.value = data;
  //   pdfFileName.value = filename;
  // }
  pdfProcessing.value = false;
  isPdfDownload.value = false;
  popPDF.value = -1;
  popProgress.value = 100;
  renderedBatches.value = 1; // 1로 초기화
}

const resizePage = (page) => {

  const baseWidth = 595;
  const baseHeight = 842;

  const deviceWidth = document.getElementById("non-section").offsetWidth;
  const deviceHeight = document.getElementById("non-section").offsetHeight;
  /** wdithRatio 에서 -100 -> padding 값으로 인한 조절
   * hegihtRatio 에서 -130 -> 다음장이 보여야 하기 때문에 조절
   * 위의 값은 디바이스 크기에 따라서 다르게 조절함.
   */
  var widthRatio = 0;
  var heightRatio = 0;

  if (deviceWidth < baseWidth) {
    widthRatio = (deviceWidth - 50) / baseWidth / pdfScale;
    heightRatio = (deviceHeight - 80) / baseHeight / pdfScale;


  } else {
    widthRatio = (deviceWidth - 100) / baseWidth / pdfScale;
    heightRatio = (deviceHeight - 130) / baseHeight / pdfScale;

  }
  // 가장 작은 쪽에 맞춰서 스케일
  const scale = Math.min(widthRatio, heightRatio);

  // DOM에 적용
  const elementDOM = document.querySelector("#page-wrapper" + page);
  if (!elementDOM) return;
  const wrapper = document.querySelector("#page" + page);

  elementDOM.style.transform = `scale(${scale})`;
  elementDOM.style.transformOrigin = "top left";

  wrapper.style.width = `${baseWidth * scale * pdfScale}px`;
  wrapper.style.height = `${baseHeight * scale * pdfScale}px`;
  wrapper.style.overflow = "hidden";


}
/*
const resizeMultiplePage = () => {
  for (let page = 1; page < totalPage; page++) {
    resizePage(page)
  }
  // pdf 페이지 높이 수정
  var deviceHeight = document.documentElement.clientHeight;
  var headerHeight = document.querySelector('header').offsetHeight;
  document.querySelector("#non-section").style.height = deviceHeight - headerHeight + "px";

}
*/
const reScaleDocumentPage = async (page) => {

  resizePage(page)

};
const getFileName = () => {
  return `MWL 리포트_${userInfo.value.user_name}_${check_date.value}.pdf`;
};
const needBlodDownload = () => {
  var browser = navigator.userAgent.toLowerCase();

  return (
    browser.indexOf("samsungbrowser") != -1 ||
    browser.indexOf("kakaotalk") != -1
  );
}

// const exportMultiPagePDF = async () => {
const createPDF = async () => {
  // await setUserActionLog('PDF 다운로드 클릭')

  let pixelRatio = window.devicePixelRatio * 2;
  //아이폰인 경우 메모리 제한이 있어서 기본 해상도로 설정
  if (/iPhone|iPod/i.test(navigator.userAgent)) {
    pixelRatio = window.devicePixelRatio;
  }

  // 해상도 낮을 경우 강제로 해상도 스케일업
  if (window.devicePixelRatio < 2) {
    pixelRatio = 4;
  }

  // 캔버스 내보내기 설정
  const canvasOptions = {
    allowTaint: true,
    useCORS: true,
    scale: pixelRatio,
    letterRendering: true,
    logging: false,
    skipAutoScale: true,
    skipFonts: false,
    removeContainer: true,
    foreignObjectRendering: false,
  };

  console.log(userInfo.value);
  // const password = '1111';
  const password = userInfo.value.user_birthdate.replaceAll("-", "").substr(2, 6)

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    // pdf 암호 설정
    encryption: {
      userPassword: password,
      ownerPassword: password,
      userPermissions: ["print", "modify", "copy", "annot-forms"],
    }, //패스워드 생년월일로 설정
  })

  renderedBatches.value = 1; // 1로 초기화

  for (let split_i = 0; split_i < totalPage; split_i++) {

    // 프로그래스 상태를 업데이트
    // pdfSaveProgress(split_i);
    await nextTick();

    if (!isPdfDownload.value) break;
    if (split_i + 1 > totalPage) break;
    await sleep(300);

    const elementDOM = document.querySelector("#page" + ((split_i + 1)));

    if (!elementDOM) continue;

    const canvas = await html2canvas(elementDOM, canvasOptions)
    const imgData = canvas.toDataURL('image/jpeg')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgHeight = (canvas.height * pageWidth) / canvas.width
    if (split_i !== 0) {
      pdf.addPage();  // 페이지가 생겨야 이미지를 계속 붙일 수 있음.
    }
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      pageWidth,
      imgHeight
    );

    let page = split_i + 1;
    emit('progress', page);

    // pdf 저장 후 캔버스 초기화
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();

    renderedBatches.value++;
  }

  // if (enableDownload.value === true) {
  //   let blob;
  //   let blobUrl;

  //   // 삼성 브라우저일 경우 자동 다운로드 안되고 유저가 다운로드 버튼을 클릭해야 다운로드 가능하다.
  //   if (needBlodDownload()) {
  //     blob = new Blob([pdf.output("blob")], {
  //       type: "application/pdf",
  //     });
  //     blobUrl = URL.createObjectURL(blob);
  //   }
  //   // 기타 모바일 브라우저 다운로드 코드
  //   else {
  //     pdf.save(getFileName())
  //   }
  //   pdfDownloadFinished(blobUrl, getFileName());
  // }

  pdfDownloadFinished();
  emit('complete', pdf.output('blob'));
}

const getSortHealthDangerFactorList = computed(() => {
  // Murge ARindicator , healthCondition
  let factorList = { ...healthArindicatorData.value, ...healthConditionData.value };
  let filtered_health_danger_factor = HEALTH_DANGER_FACTOR

  /** 건강위험 요인에 대한 status 매칭 */
  for (var item1 in filtered_health_danger_factor) {
    filtered_health_danger_factor[item1]['status'] = 0  // 0 으로 초기화
    filtered_health_danger_factor[item1]['need_inbody'] =
      filtered_health_danger_factor[item1].key == 'per_bodyfat' || filtered_health_danger_factor[item1].key == 'WASM' ? true : false

    for (var item2 in factorList) {
      if (filtered_health_danger_factor[item1].key == item2) {
        filtered_health_danger_factor[item1]['status'] = factorList[item2].status
      }
    }
  }
  /** 건강위험 요인에 대한 설명 매칭 */
  for (var item1 in filtered_health_danger_factor) {
    for (var item2 in HEALTH_DANGER_FACTOR_DESC) {
      if (filtered_health_danger_factor[item1].key == HEALTH_DANGER_FACTOR_DESC[item2].code) {
        /** 성별에 따라 설명이 다름 */
        if (userInfo.value.user_gender == 1) {
          filtered_health_danger_factor[item1]['description_list'] = HEALTH_DANGER_FACTOR_DESC[item2].description_male
        } else {
          filtered_health_danger_factor[item1]['description_list'] = HEALTH_DANGER_FACTOR_DESC[item2].description_female
        }
      }
    }
  }
  /** status 내림차순, order 오름차순  */
  filtered_health_danger_factor.sort((a, b) => {
    const aHigh = a.status > 1;
    const bHigh = b.status > 1;

    if (aHigh && bHigh) {
      return b.status - a.status; // 둘 다 > 1 → status 내림차순
    }
    if (!aHigh && !bHigh) {
      return a.order - b.order; // 둘 다 ≤ 1 → order 오름차순
    }

    // 하나만 high → high 먼저
    return aHigh ? -1 : 1;
  });
  return filtered_health_danger_factor
})

const getSortRfsRecommendFactorList = computed(() => {
  var filter_data = []
  let factorList = { ...healthRFSData.value };

  /** 식사의질, 규칙적인 식사 항목 제외 */
  factorList.food_data = factorList.food_data.filter(item => item.key != "Rfs" && item.key != "Regularmeal")

  /** 추천 식품군에 대한 설명 매칭 */
  factorList.food_description.forEach((item) => {
    var filter_item = item
    factorList.food_data.forEach((item2) => {
      if (item.key == item2.key) {
        filter_item['status'] = item2.status
        filter_data.push(filter_item)
      }
    })
  })
  /** status 내림차순, order 오름차순  */
  filter_data.sort((a, b) => {
    if (b.status !== a.status) {
      return b.status - a.status; // status 내림차순
    } else {
      return a.order - b.order;   // order 오름차순
    }
  });
  return filter_data
})

/** 25.10.01 인체생리네트워크 영양성분 리스트 추가 */
const getSortHealthNutrientList = computed(() => {
  var datas = []
  healthNetworkData.value.clusterList.forEach((item) => {
    if (HEALTH_NETWORK_CLUSTER_NAME[item.Cluster_ID] === undefined) return;
    var items = {}
    items['status'] = item.Cluster_State > 40 ? item.Cluster_State - 40 : item.Cluster_State
    items['name'] = HEALTH_NETWORK_CLUSTER_NAME[item.Cluster_ID]
    items['nutrient_list'] = HEALTH_NETWORK_CLUSTER_NUTRIENT[item.Cluster_ID].join(', ')
    items['order'] = 0;
    if(items['status'] == 3) items['order'] = 3;
    else if(items['status'] == 2) items['order'] = 2;
    else if(items['status'] == 4) items['order'] = 1;
    datas.push(items)
  })
  datas.sort((a, b) => {
    if (b.order !== a.order) {
      return b.order - a.order; // order 내림차순
    }
  });
  return datas
});

const pageMove = (path) => {
  switch (path) {
    case 'report':
      router.push({ name: 'Report', query: { report_id: useSessionStore.getReportId() } }).then(() => router.go(0))
      break;
  }
}

</script>
<template>
  <!-- <HeaderComponent :title="'PDF 보고서'" :is-back="true" @backClick="pageMove('report')" @menuClick="popPDF = 0"
    :header-type="3" /> -->
  <!-- <main v-if="isGenerate" id="main"> -->
  <main v-if="isGenerate" id="main" :class="{ hidden: true }">
    <section id="non-section" ref="scrollArea">
      <article v-if="!loading" id="non-article">
        <div id="mainpage" class="mainpage" v-if="isInbodyData">

          <div v-for="page in indexRange" :key="page" :id="'page' + page" class="page-container">
            <div class="page-wrapper" :id="'page' + page">
              <component :is="includeInbodyComponents[page - 1]" :id="'page-wrapper' + page" :page="page"
                :save="isPdfDownload" :imgSrc="pageImageList[page - 1]" :userInfo="userInfo" :report_no="report_no"
                :health-score-data="healthScoreData" :health-arindicator-data="healthArindicatorData"
                :health-condition-data="healthConditionData" :health-network-data="healthNetworkData"
                :health-rfs-data="healthRFSData" :health-checkup-record-data="healthCheckupRecordData"
                :health-sleep-habits-data="healthSleepHabitsData"
                :health-danger-factor-data="getSortHealthDangerFactorList"
                :rfs-recommend-factor-data="getSortRfsRecommendFactorList" 
                :health-network-nutrient-data="getSortHealthNutrientList"
                :exercise-intensity-data="healthExerciseIntensityData" :check_date="check_date" :pdfScale="pdfScale"
                :loading-graph="loadingGraph" :loading-last-page="loadingLastPage" :is-inbody-data="isInbodyData"
                @mounted="reScaleDocumentPage(page)" />
            </div>
          </div>
        </div>
        <div id="mainpage" class="mainpage" v-else>
          <div v-for="page in indexRange" :key="page" :id="'page' + page" class="page-container">
            <div class="page-wrapper" :id="'page' + page">
              <component :is="excludeInbodyComponents[page - 1]" :id="'page-wrapper' + page" :page="page"
                :save="isPdfDownload" :imgSrc="pageImageList[page - 1]" :userInfo="userInfo" :report_no="report_no"
                :health-score-data="healthScoreData" :health-arindicator-data="healthArindicatorData"
                :health-condition-data="healthConditionData" :health-network-data="healthNetworkData"
                :health-rfs-data="healthRFSData" :health-checkup-record-data="healthCheckupRecordData"
                :health-sleep-habits-data="healthSleepHabitsData"
                :health-danger-factor-data="getSortHealthDangerFactorList"
                :rfs-recommend-factor-data="getSortRfsRecommendFactorList" 
                :health-network-nutrient-data="getSortHealthNutrientList"
                :exercise-intensity-data="healthExerciseIntensityData" :check_date="check_date" :pdfScale="pdfScale"
                :loading-graph="loadingGraph" :loading-last-page="loadingLastPage" :is-inbody-data="isInbodyData"
                @mounted="reScaleDocumentPage(page)" />
            </div>
          </div>
        </div>
      </article>
    </section>
    <!-- <div class="popup2" v-if="popPDF !== -1">
      <div class="pop-body">
        <img class="btn-close" @click="popPDF = -1" src="@/assets/images/icons/popup_close.png" />
        <div class="mb-2">
          <h3 class="mb-2">PDF 파일 다운로드</h3>
          <span>
            {{ datetimeStrToDateFormat(check_date, "yyyy년mm월dd일dd요일") }}
          </span>
          <span>파일을 다운로드 하시겠습니까?</span>
        </div>
        <div class="gap"></div>
        <div class="btn-wrap" @click="pdfDownloadStart()">
          <button class="btn sm">확인</button>
        </div>
      </div>
    </div> -->

    <!-- <div class="popup2" v-if="popProgress !== -1">
      <div class="pop-body">
        <img class="btn-close" @click="pdfDownloadStop()" src="@/assets/images/icons/popup_close.png" />
        <div class="mb-2">
          <h3 class="mb-2">PDF 다운로드</h3>
          <div class="download">
            <span class="percentage" v-if="popProgress !== 100">
              <span>{{ popProgress }}</span><small>%</small>
            </span>
            <span v-if="popProgress !== 100">{{
              popProgress === 100 ? "pdf다운로드 완료" : "pdf 다운로드중.."
            }}</span>
            <span v-if="popProgress == 100" style="flex: 1">
              다운로드 완료<br />패스워드는 생년월일 6자리입니다.
            </span>
          </div>
        </div>
        <div v-if="pdfBlob">
          <a v-if="popProgress == 100 && pdfBlob" :href="pdfBlob" :download="pdfFileName">
            <div class="btn-wrap">
              <button class="btn sm" @click="popProgress = -1">
                다운로드
              </button>
            </div>
          </a>
        </div>
        <div class="progress-container" v-if="popProgress !== 100">
          <div class="progress" :style="{
            transform: 'translateX(' + Math.min(0, popProgress - 100) + '%)',
          }"></div>
        </div>
        <div class="gap"></div>
      </div>
    </div> -->
  </main>
</template>
<style lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixin.scss';
@import "@/assets/scss/_font.scss";
@import "@/assets/scss/_document.scss";

@page {
  size: A4;
  margin: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

$scroll-padding: 3px;

*,
*::before,
*::after {
  box-sizing: border-box;
}

main {
  // font-family: "210MGothic", "MarkPro" !important;
  font-family: "Pretendard", sans-serif !important;
  font-size: 0;
  font-variant: normal;
}

#non-section {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  min-height: auto;
}

.btn-wrap {
  // @include flex;
  width: 100%;
  gap: 15px;
  background: #2aaa93;
  text-align: center;
  border-radius: 1rem;
  cursor: pointer;

  .btn {
    color: #ffffff;
    height: 32px;
    font-size: 14px;

  }
}

.popup2 {
  position: fixed;
  @include flex(flex-start, center);
  top: 0;
  width: 100vw;
  max-width: $max-width;
  height: 100vh;
  //   background: rgba($color: #000000, $alpha: 0.4);
  z-index: 1000;

  .pop-body {
    position: relative;
    margin: 0 auto;
    width: 269px;

    flex-shrink: 0;
    padding: 19px 16px 21.87px;
    @include flex(center, center);
    flex-direction: column;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 0px 6px rgba($color: #000000, $alpha: 0.16);

    >div {
      width: 100%;
    }
  }

  h4 {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  h3 {
    text-align: center;

    color: #54585b;
    font-size: 16px;
    font-weight: 500;
  }

  span {
    @include flex(center, center);
    text-align: center;

    color: #54585b;
    font-size: 15px;
    font-weight: 400;
  }

  .btn-close {
    position: absolute;
    width: 14.455px;
    height: 14.455px;
    right: 17.77px;
    top: 17.77px;
    cursor: pointer;
  }

  .download {
    @include flex(space-between, flex-end);
    width: 100%;
    flex: 1;
  }

  .percentage {
    /* @include flex(flex-end, flex-end); */

    /* vertical-align: top; */
    span {
      color: #54585b;
      font-size: 25px;
      font-weight: 600;
      line-height: normal;
    }

    small {
      color: #54585b;
      font-size: 19px;
      font-weight: 600;
      line-height: normal;
      vertical-align: bottom;
    }
  }

  .progress-container {
    height: 23px;
    width: 100%;
    border-radius: 30px;
    background: rgba(84, 88, 91, 0.1);
    overflow: hidden;

    .progress {
      width: 100%;
      height: 100%;
      border-radius: 30px;
      background: #2aaa93;
    }
  }
}

.scroll-anchor {
  height: 50px;
}

.stretch-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: keep-all;
  /* 또는 break-word */
  white-space: normal;
}

#page5 .position .chart-wrap {
  transform: translateX(-10%);
}
</style>