<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

import BasePopup from '../BasePopup.vue'
import BaseTooltip from '../BaseTooltip.vue'
import BaseToast from '@/components/BaseToast.vue'
import AnalyzeCheckupData from './AnalyzeCheckupData.vue'
import AnalyzeHealthLocation from './AnalyzeHealthLocation.vue'
import AnalyzeAgingSpeed from '@/views/publishing/analyze/AnalyzeAgingSpeed.vue'
import AnalyzeHealthLight from '@/views/publishing/analyze/AnalyzeHealthLight.vue'
import AnalyzeScorecomAnalyzeIndex from '@/views/analyze/components/AnalyzeScorecomAnalyzeIndex.vue'
import AnalyzeDietDetailGuide from '@/views/analyze/AnalyzeDietDetailGuide.vue'
import AnalyzeExerciseDetailGuide from '@/views/analyze/AnalyzeExerciseDetailGuide.vue'
import AnalyzeSleepDetailGuide from '@/views/analyze/AnalyzeSleepDetailGuide.vue'
import BodyCompositionPopup from '@/components/BodyCompositionPopup.vue'
import ResultDocument from '@/apps/report/healthReport/ResultDocument.vue'
import BtnTop from '@/views/publishing/BtnTop.vue'

import { REPORT_OEPN_TYPE } from '@/utils/commonCode'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

const { t } = useI18n()

const popupReportDown = ref(true) /* 일회성 분석결과 진입 시 뜨는 팝업 오프너, 일회성인지 개발 적용 요망 */
const menu = ref(['노화 속도', '건강 위치', '건강 신호등', '인체 생리 네트워크']) /* 231219 속도를 건강위치 밑으로 이동 */

const isDragging = ref(false)
const startX = ref(0)
const startScroll = ref(0)
const scrollContainer = ref(null)

const isPc = ref(false) /* 231211 pc 인지 모바일인지 변수 */
const stickyTop = ref(110) /* 231211 상단 네비게이션 상단 마진 값 */
const activeMenuIndex = ref(0)

const tooltip = ref(false)
const tooltipEdge = ref(0)
const modules = ref([Navigation, Pagination])

const muscleBalanceKey = ref(0)
const muscleBalanceRefreshTrigger = ref(0)

const dietGuidePopup = ref(false)
const exerciseGuidePopup = ref(false)
const sleepGuidePopup = ref(false)
const showNoDataPopup = ref(false)

const checkupResultId = 'PUB-ANALYZE-0001'

/* [s] 퍼블 확인용 - 공통 사용자 기본값 */
const publishingUser = {
  name: '차동희',
  age: 45,
  sex: 'M',
  ht: 175,
  wt: 78,
  wc: 88,
  bmi: 25.5,
  analysedDate: '2026.10.25',
  analysedDateDash: '2026-10-25',
  healthDataType: 'direct',
  connectType: 'BODYKEY'
}
/* [e] 퍼블 확인용 - 공통 사용자 기본값 */

/* [s] 퍼블 확인용 - 공통 분석 점수 */
const publishingScore = {
  hqAr: {
    aging_rate: 1.18,
    status: 2
  },
  hqReage: {
    reage: 49
  },

  hqOxi: {
    score: 75,
    status: 1
  },

  hqMet: {
    score: 46,
    status: 3
  },

  hqMusBal: {
    score: 62,
    status: 2
  },

  // 건강 위치 상태값 추가
  hqHtype: {
    status: 2
  },

  hqData: {
    AgingRate: 1.18,
    ReAge: 49,
    OXI: 75,
    MET: 46
  },

  dqData: {
    RFS_score: 34,
    RFS: 34
  },

  metData: {
    met: 450
  },

  shData: {
    sh_score: 75
  },

  healthTrafficLight: {
    good: 2,
    manage: 2,
    warning: 2
  }
}
/* [e] 퍼블 확인용 - 공통 분석 점수 */

/* [s] 퍼블 확인용 - 공통 검진 수치 */
const publishingAriData = {
  SBP: 132,
  DBP: 86,
  WC: publishingUser.wc,
  BMI: publishingUser.bmi,
  GLU: 104,
  TG: 165,
  TC: 205,
  HDL: 46,
  LDL: 135,
  GOT: 32,
  GPT: 41,
  HB: 15.1,
  CREA: 1.0,
  MET: 450,
  RFS: 34
}

const publishingAriRisk = {
  SBP: 2,
  DBP: 2,
  WC: 2,
  BMI: 2,
  GLU: 2,
  TG: 3,
  TC: 2,
  HDL: 2,
  LDL: 3,
  GOT: 2,
  GPT: 2,
  HB: 1,
  CREA: 1,
  smok_dur: 2,
  pack_year: 2,
  sleep_time: 3,
  drink_amt: 2,
  MET: 2,
  EQ5D: 1,
  per_bodyfat: 2,
  WASM: 2
}

const publishingExaminationData = [
  {
    checkDate: publishingUser.analysedDate,
    healthDataType: publishingUser.healthDataType,
    sbp: publishingAriData.SBP,
    dbp: publishingAriData.DBP,
    glu: publishingAriData.GLU,
    tc: publishingAriData.TC,
    hdl: publishingAriData.HDL,
    ldl: publishingAriData.LDL,
    tg: publishingAriData.TG,
    got: publishingAriData.GOT,
    gpt: publishingAriData.GPT,
    crea: publishingAriData.CREA,
    hb: publishingAriData.HB,
    bmi: publishingUser.bmi,
    wc: publishingUser.wc,
    ht: publishingUser.ht,
    wt: publishingUser.wt
  }
]
/* [e] 퍼블 확인용 - 공통 검진 수치 */

const user = {
  name: publishingUser.name
}

const isOneTime = computed(() => {
  return false
})

/* [s] 퍼블 확인용 - AnalyzeCheckupData / AnalyzeAgingSpeed / AnalyzeHealthLocation / 건강 신호등 전달 데이터 */
const sendData = ref({
  id: 1,
  analysisId: 1,
  basicsId: 1,
  name: publishingUser.name,
  age: publishingUser.age,
  sex: publishingUser.sex,
  analyzeAge: publishingUser.age,
  analysedDate: publishingUser.analysedDate,
  connectType: publishingUser.connectType,

  commonInfo: {
    analysedDate: publishingUser.analysedDateDash,
    analysisType: 'normal',
    analysisName: '',
    aCode: checkupResultId
  },

  basics: {
    checkDate: publishingUser.analysedDate,
    healthDataType: publishingUser.healthDataType,
    age: publishingUser.age,
    sex: publishingUser.sex,
    ht: publishingUser.ht,
    wt: publishingUser.wt,
    wc: publishingUser.wc,
    bmi: publishingUser.bmi
  },

  hqAr: publishingScore.hqAr,
  hqReage: publishingScore.hqReage,
  hqOxi: publishingScore.hqOxi,
  hqMet: publishingScore.hqMet,
  hqMusBal: publishingScore.hqMusBal,
  hqHtype: publishingScore.hqHtype,
  hqData: publishingScore.hqData,

  hqReference: {
    AgingRate: {
      min: 0.5,
      max: 1.5,
      normal: 1
    },
    ReAge: {
      min: 20,
      max: 80,
      normal: publishingUser.age
    }
  },

  hqDataList: [
    {
      key: 'SBP',
      value: publishingAriData.SBP,
      status: publishingAriRisk.SBP,
      title: '수축기 혈압'
    },
    {
      key: 'DBP',
      value: publishingAriData.DBP,
      status: publishingAriRisk.DBP,
      title: '이완기 혈압'
    },
    {
      key: 'WC',
      value: publishingAriData.WC,
      status: publishingAriRisk.WC,
      title: '허리둘레'
    },
    {
      key: 'BMI',
      value: publishingAriData.BMI,
      status: publishingAriRisk.BMI,
      title: '체질량지수'
    },
    {
      key: 'GLU',
      value: publishingAriData.GLU,
      status: publishingAriRisk.GLU,
      title: '공복혈당'
    },
    {
      key: 'TG',
      value: publishingAriData.TG,
      status: publishingAriRisk.TG,
      title: '중성지방'
    },
    {
      key: 'TC',
      value: publishingAriData.TC,
      status: publishingAriRisk.TC,
      title: '총콜레스테롤'
    },
    {
      key: 'HDL',
      value: publishingAriData.HDL,
      status: publishingAriRisk.HDL,
      title: 'HDL 콜레스테롤'
    },
    {
      key: 'LDL',
      value: publishingAriData.LDL,
      status: publishingAriRisk.LDL,
      title: 'LDL 콜레스테롤'
    },
    {
      key: 'GOT',
      value: publishingAriData.GOT,
      status: publishingAriRisk.GOT,
      title: 'AST'
    },
    {
      key: 'GPT',
      value: publishingAriData.GPT,
      status: publishingAriRisk.GPT,
      title: 'ALT'
    },
    {
      key: 'HB',
      value: publishingAriData.HB,
      status: publishingAriRisk.HB,
      title: '혈색소'
    },
    {
      key: 'CREA',
      value: publishingAriData.CREA,
      status: publishingAriRisk.CREA,
      title: '크레아티닌'
    },
    {
      key: 'sleep_time',
      value: 5,
      status: publishingAriRisk.sleep_time,
      title: '수면 시간'
    },
    {
      key: 'drink_amt',
      value: 2,
      status: publishingAriRisk.drink_amt,
      title: '음주량'
    },
    {
      key: 'MET',
      value: publishingAriData.MET,
      status: publishingAriRisk.MET,
      title: '운동량'
    },
    {
      key: 'per_bodyfat',
      value: 25,
      status: publishingAriRisk.per_bodyfat,
      title: '체지방률'
    },
    {
      key: 'WASM',
      value: 28,
      status: publishingAriRisk.WASM,
      title: '골격근량'
    }
  ],

  ariData: publishingAriData,
  ariRisk: publishingAriRisk,

  hriData: {
    ...publishingAriData,
    RFS_score: publishingAriData.RFS,
    RFS: publishingAriData.RFS,
    sleep_time: 5,
    drink_amt: 2,
    per_bodyfat: 25,
    WASM: 28
  },
  hriStatus: {
    ...publishingAriRisk,
    RFS: 3,
    RFS_score: 3,
    CK_drink: publishingAriRisk.drink_amt,
    CK_sleep_time: publishingAriRisk.sleep_time,
    CK_MH_stress: 2,
    CK_water_amt: 2,
    CK_smok: 2
  },

  dqData: publishingScore.dqData,
  metData: publishingScore.metData,
  shData: publishingScore.shData,

  hqMusMass: {
    exerciseData: [
      {
        exCode: 'UPPER_001',
        target: 1,
        exName: '밴트오버 로우',
        reps: 15,
        sets: 3,
        exEffect: '대표적인 등 운동으로 굽은 어깨를 개선하고 약해진 등 근육을 강화하고 코어 안정성을 높혀 허리통증 예방 및 완화에 도움을 줍니다. 수건을 활용하면 더욱 효과적으로 수행할 수 있습니다.',
        qrURL: 'https://www.youtube.com/embed/EQibcTZgfEs',
        msg: '@@@님은 체성분 입력 결과를 기준으로 상체와 하체 근육 밸런스 관리가 필요합니다.'
      },
    ]
  },

  healthTrafficLight: publishingScore.healthTrafficLight,

  examinationData: publishingExaminationData,
})
/* [e] 퍼블 확인용 - AnalyzeCheckupData / AnalyzeAgingSpeed / AnalyzeHealthLocation / 건강 신호등 전달 데이터 */

/* [s] 퍼블 확인용 - ResultDocument 전달 데이터 */
const surveyData = ref({
  commonInfo: {
    aCode: checkupResultId,
    analysisType: 'normal',
    analysedDate: publishingUser.analysedDateDash
  },
  basics: {
    checkDate: publishingUser.analysedDate,
    healthDataType: publishingUser.healthDataType,
    age: publishingUser.age,
    sex: publishingUser.sex,
    ht: publishingUser.ht,
    wt: publishingUser.wt,
    wc: publishingUser.wc,
    bmi: publishingUser.bmi
  }
})
/* [e] 퍼블 확인용 - ResultDocument 전달 데이터 */

/* [s] 퍼블 확인용 - AnalyzeHealthLight 전달 데이터 */
const analyzeData = ref({
  id: 1,
  analysisId: 1,
  basicsId: 1,
  name: publishingUser.name,
  age: publishingUser.age,
  sex: publishingUser.sex,
  analysedDate: publishingUser.analysedDate,
  examinationData: publishingExaminationData,
  clusterList: [
    {
      Cluster_ID: 'CARDIO',
      Cluster_NAME: '심혈관',
      Cluster_State: 2
    },
    {
      Cluster_ID: 'BLOOD_PRESSURE',
      Cluster_NAME: '혈압',
      Cluster_State: 42
    },
    {
      Cluster_ID: 'LIPID',
      Cluster_NAME: '혈중지질',
      Cluster_State: 43
    },
    {
      Cluster_ID: 'METABOLIC',
      Cluster_NAME: '대사',
      Cluster_State: 2
    },
    {
      Cluster_ID: 'BLOOD_SUGAR',
      Cluster_NAME: '혈당',
      Cluster_State: 4
    },
    {
      Cluster_ID: 'BODY_FAT',
      Cluster_NAME: '체지방',
      Cluster_State: 3
    },
    {
      Cluster_ID: 'MUSCLE',
      Cluster_NAME: '근육량',
      Cluster_State: 3
    },
    {
      Cluster_ID: 'EXERCISE',
      Cluster_NAME: '운동',
      Cluster_State: 2
    }
  ]
})
/* [e] 퍼블 확인용 - AnalyzeHealthLight 전달 데이터 */

/* [s] 퍼블 확인용 - 다운로드/공유/삭제/토스트 상태 */
const isSharePopup = ref(false)
const isViewerPopup = ref(false)
const isPopDeleteReport = ref(false)
const isDeleteReport = ref(null)
const isOneTimeDonwloadPopup = ref(false)

const toastMsg = ref('')
const successToastMessage = ref('')

const showErrorPopup = ref(false)
const errorPopupMessage = ref('')

const isResultDocumentOpen = ref(false)
const resultDocumentRef = ref(null)
const completePdfPageCount = ref(0)
/* [e] 퍼블 확인용 - 다운로드/공유/삭제/토스트 상태 */

/* [s] 퍼블 확인용 - BodyCompositionPopup 상태 */
const openPopBodyComposition = ref(false)
const showBodyKeyLogin = ref(true)
const showBodyKeyResult = ref(false)
const showBodyKeyDetail = ref(false)
const showResultPopup = ref(false)
const resultMessage = ref('')
const resultType = ref('')
const bodyKeyDataList = ref([])
const bodyCompositionDataList = ref([])
const isLoading = ref(false)
const selectedBodyKeyData = ref(null)
const selectedDataType = ref('')
const bodyKeyLoginFailed = ref(false)
/* [e] 퍼블 확인용 - BodyCompositionPopup 상태 */

const isIos = computed(() => {
  const userAgent = navigator.userAgent || window.opera

  return /iPad|iPhone|iPod/.test(userAgent)
})

const isIosChrome = computed(() => {
  const userAgent = navigator.userAgent || window.opera

  return /CriOS/.test(userAgent)
})

function reportDown(val) { /* 다운로드 */
  if (val === 'ok') {
    // 다운로드 처리 요망
  }

  popupReportDown.value = false
}

function dragStart(event) {
  isDragging.value = true
  startX.value = event.clientX
  startScroll.value = scrollContainer.value.scrollLeft
}

function drag(event) {
  if (!isDragging.value) return

  const x = event.clientX
  const delta = startX.value - x

  scrollContainer.value.scrollLeft = startScroll.value + delta
}

function dragEnd() {
  isDragging.value = false
}

function winWidth() { /* 231211 브라우저 가로 사이즈 체크 */
  isPc.value = window.innerWidth > 960 /* 2606 ispc 기준점 수정 */
}

function move(event, tg) {
  const target = document.getElementById('g' + (tg + 1))

  if (!target) return

  if (isPc.value) { /* 231207 반응형에서 pc일 때 윗 높이가 달라 추가 */
    stickyTop.value = 150
  } else {
    stickyTop.value = 110
  }

  window.scrollBy({
    top: target.getBoundingClientRect().top - stickyTop.value,
    behavior: 'smooth'
  })

  activeMenuIndex.value = tg

  const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active')
  }

  event.target.classList.add('active')
}

function openTooltip($event) {
  tooltip.value = true
  tooltipEdge.value = $event.x
}

function tooltipClose() {
  tooltip.value = false
}

/* [s] 퍼블 확인용 - 가이드/체성분 팝업 이벤트 대응 */
function openDietGuide() {
  dietGuidePopup.value = true
}

function closeDietGuide() {
  dietGuidePopup.value = false
}

function openExerciseGuide() {
  exerciseGuidePopup.value = true
}

function closeExerciseGuide() {
  exerciseGuidePopup.value = false
}

function openSleepGuide() {
  sleepGuidePopup.value = true
}

function closeSleepGuide() {
  sleepGuidePopup.value = false
}

function handleShowNoDataPopup() {
  showNoDataPopup.value = true
}

function handleOpenBodyCompositionPopup() {
  openPopBodyComposition.value = true
  showBodyKeyLogin.value = true
  showBodyKeyResult.value = false
  showBodyKeyDetail.value = false
}

function formatDatetime(value) {
  return value
}

function handleBodyKeyLoginWrapper() {
  bodyKeyLoginFailed.value = false
}

function selectBodyKeyData(data) {
  selectedBodyKeyData.value = data
}

function selectExistingBodyComposition(data) {
  selectedBodyKeyData.value = data
}

function confirmBodyKeyData() {
  showBodyKeyDetail.value = true
}

function handleAnalyzeSelectedBodyKeyData() {
  openPopBodyComposition.value = false
  showBodyKeyDetail.value = false
  muscleBalanceRefreshTrigger.value += 1
  muscleBalanceKey.value += 1
}

function closeBodyKeyDetail() {
  showBodyKeyDetail.value = false
}

function handleDirectInput() {
  openPopBodyComposition.value = false
}

function closeResultPopup() {
  showResultPopup.value = false
}
/* [e] 퍼블 확인용 - 가이드/체성분 팝업 이벤트 대응 */

/* [s] 퍼블 확인용 - 다운로드/공유/삭제 이벤트 대응 */
function clickReportOpen(type) {
  if (type === REPORT_OEPN_TYPE.DOWNLOAD_VIEW) {
    isResultDocumentOpen.value = true
    successToastMessage.value = '다운로드 되었습니다.'
  }

  if (type === REPORT_OEPN_TYPE.KAKAO) {
    successToastMessage.value = '공유되었습니다.'
  }

  setTimeout(() => {
    successToastMessage.value = ''
  }, 3000)
}

function copyAnalysisNumber() {
  successToastMessage.value = '분석번호가 복사되었습니다.'

  setTimeout(() => {
    successToastMessage.value = ''
  }, 3000)
}

function moveReportHistoryListPage() {
  toastMsg.value = '분석 결과 이력으로 이동합니다.'

  setTimeout(() => {
    toastMsg.value = ''
  }, 2000)
}

function deleteReport() {
  isPopDeleteReport.value = true
}

function closeOneTimeDonwloadPopup() {
  isOneTimeDonwloadPopup.value = false
}

function confirmOneTimeDonwload() {
  isOneTimeDonwloadPopup.value = false
  clickReportOpen(REPORT_OEPN_TYPE.DOWNLOAD_VIEW)
}

function handleReportOpenByType() {
  isSharePopup.value = false
  isViewerPopup.value = false
}

function closeErrorPopup() {
  showErrorPopup.value = false
  errorPopupMessage.value = ''
}

function handleGenerateProgress(index) {
  completePdfPageCount.value = index + 1
}

function completeGenerateReport() {}

function iosSafari() {}

function downCancel() {}
/* [e] 퍼블 확인용 - 다운로드/공유/삭제 이벤트 대응 */

function getAnalysisCompleteDetail() {
  return analyzeData.value
}

function setData(data) {
  analyzeData.value = {
    ...analyzeData.value,
    ...data
  }
}

function handleResize() {
  winWidth()
}

onMounted(() => {
  winWidth()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section class="container AnalyzeDetail">

    <div class="AnalyzeDetail--menu--cover">
      <div
        ref="scrollContainer"
        class="AnalyzeDetail--menu"
        @mousedown="dragStart"
        @mousemove="drag"
        @mouseup="dragEnd">
        <button
          v-for="(item, index) in menu"
          @click="move($event, index)"
          type="button"
          class="AnalyzeDetail--menu-btn"
          :class="{ 'active': index === activeMenuIndex }"
          v-bind:key="item">
          {{ item }}
        </button>
      </div>
    </div>
    <!--검진 데이터-->
    <AnalyzeCheckupData id="g0" :sendData="sendData" :currentSection="0" />

    <!--노화 속도-->
    <AnalyzeAgingSpeed  id="g1" :isMain="false" :sendData="sendData" :currentSection="1" />

    <!--건강 위치-->
    <AnalyzeHealthLocation id="g2" :sendData="sendData" :currentSection="2" />

    <!--건강 신호등-->
    <div class="AnalyzeDetail--HealthLight" id="g3">
      <div class="AnalyzeDetail--HealthLight--tit-wrap">
        <h2 class="tooltip--tit AnalyzeDetail--HealthLight--tit">{{ $t('AnalyzeHealthLight.text1') }} </h2>
        <button
          @click="openTooltip($event)"
          class="btn--tooltip AnalyzeDetail--HealthLight--tip-btn"
          type="button"
          title="도움말" />

        <base-tooltip
          v-if="tooltip"
          :leftLoca="tooltipEdge"
          @tooltipClose="tooltipClose"
          class="AnalyzeDetail--HealthLight--tip-dom">
          <template v-slot:contents>
            <p class="tooltip--contents">
              {{ $t('AnalyzeHealthLight.text3')}}
            </p>
          </template>
        </base-tooltip>
      </div>

      <swiper
        :centered-slides="isPc ? false : true"
        :space-between="isPc ? 0 : 8"
        :pagination="isPc ? false : {
          clickable: true
        }"
        :navigation="isPc ? false : true"
        :breakpoints="isPc ? {} : {
          '0': {
            slidesPerView: 1.15,
          },
          '700': {
            slidesPerView: 1.8,
          },
          '1000': {
            slidesPerView: 2.8,
          },
        }"
        :slides-per-view="isPc ? 6 : 'auto'"
        :modules="isPc ? [] : modules"
        class="AnalyzeDetail--HealthLight--swiper">
        <swiper-slide>
          <!-- 노화 억제 분석 지수 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeAgingInhibitionAnalyzeIndex`"
            :title="t('AnalyzeDetail.text3')"
            :sendData="sendData"
            :currentSection="3"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 만성질환 억제 분석 지수 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeChronicDiseaseControlAnalyzeIndex`"
            :title="t('AnalyzeDetail.text4')"
            :sendData="sendData" 
            :currentSection="3"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 근육 밸런스 분석 지수 -->
          <AnalyzeScorecomAnalyzeIndex
            :key="`muscle-balance-${muscleBalanceKey}`"
            :compId="`AnalyzeMuscleBalanceAnalyzeIndex`"
            :title="t('AnalyzeDetail.text38')"
            :sendData="sendData" 
            :currentSection="3"
            :refreshTrigger="muscleBalanceRefreshTrigger"
            @openBodyCompositionPopup="handleOpenBodyCompositionPopup"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 식사 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeDietIndex`"
            :title="t('Home.text29')"
            :sendData="sendData" 
            :currentSection="3"
            @openDietGuide="openDietGuide"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 운동 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeExerciseIndex`"
            :title="t('Home.text30')"
            :sendData="sendData" 
            :currentSection="3"
            @openExerciseGuide="openExerciseGuide"
            @showNoDataPopup="handleShowNoDataPopup"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 수면 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeSleepIndex`"
            :title="t('Home.text31')"
            :sendData="sendData" 
            :currentSection="3"
            @openSleepGuide="openSleepGuide"
            class="swiper-slide-con" />
        </swiper-slide>
      </swiper>
    </div>

    <!-- 인체 생리 네트워크 -->
    <AnalyzeHealthLight
      id="g4"
      :key="`health-light-${analyzeData.id}`"
      :clusterList="analyzeData.clusterList"
      :detailId="analyzeData.id"
      :sendData="sendData"
      :currentSection="4" />

    <p class="AnalyzeDetail--desc" v-html="$t('Analyze.text12')" />
    <section class="AnalyzeDownload" id="g5">
      <div class="btn--bottom AnalyzeDownload--btn-div">
        <div class="AnalyzeDownload--down-wrap">
          <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12') }} </p>
        </div>
        <div class="AnalyzeDownload--report-kakao">
          <button @click="clickReportOpen(REPORT_OEPN_TYPE.DOWNLOAD_VIEW)" type="button" class="AnalyzeDownload--view">
            {{ $t('AnalyzeDetail.text10') }}
          </button>
          <button
            v-if="!isOneTime"
            @click="clickReportOpen(REPORT_OEPN_TYPE.KAKAO)"
            type="button"
            class="AnalyzeDownload--kakao">
            {{ $t('AnalyzeDetail.text11') }}
          </button>
          <!-- 비활성화 -->
<!--          <button
            v-if="!isOneTime"
            type="button"
            class="AnalyzeDownload&#45;&#45;kakao dimed">
            {{ $t('AnalyzeDetail.text11') }}
          </button>-->
        </div>
        <!-- [s] 2606 분석번호 버튼 비활성화 -->
        <!-- <button
          v-if="!isOneTime"
          type="button"
          @click="copyAnalysisNumber"
          class="AnalyzeDownload--copy"
          :title="$t('AnalyzeDetail.clickToCopy')">
          <span>{{ $t('AnalyzeDetail.analysisNumber') }}: {{ surveyData?.commonInfo?.aCode || checkupResultId }}</span>
          <img src="@/assets/images/icons/i-copy.png" alt="copy" />
        </button> -->
        <!-- [e] 2606 분석번호 버튼 비활성화 -->
        <!-- [s] 2606 나의 추천 미션 보기 버튼 추가 -->
        <button type="button" class="AnalyzeDownload--mission">
          나의 추천 미션 보기
        </button>
        <!-- [e] 2606 나의 추천 미션 보기 버튼 추가 -->
      </div>

      <div v-if="!isOneTime" class="AnalyzeDownload--print-wrap">
        <!-- <div class="AnalyzeDownload--print-wrap2">
          <button type="button" class="AnalyzeDownload--print" @click="movePrintRequestPage">
            {{ $t('AnalyzeDetail.text13') }} 
          </button>
        </div> -->
        <div class="AnalyzeDownload--other-wrap">
          <button type="button" class="AnalyzeDownload--other" @click="moveReportHistoryListPage">
            {{ $t('AnalyzeDetail.text14') }}
          </button>
        </div>
        <div class="AnalyzeDownload--delete-wrap">
          <button type="button" class="AnalyzeDownload--delete" @click="deleteReport">
            {{ $t('Common.delete') }} 
          </button>
        </div>
      </div>
    </section>

    <!-- S : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
    <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
    <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
      <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
      <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

      <!-- to 개발 | 복약정보가 있을 경우 -->
      <p class="AnalyzeDetail--medicationPopup-detail"> <!-- 2606 복약 정보 있는 경우 텍스트 변경 -->
        의약품을 복용 중인 경우, 분석 결과가 복용 전의 실제 건강상태보다 양호하게 산출될 수 있습니다.
        <span>마이웰니스 랩 리포트는 의학적 진단이나<br>약물의 치료 효과 판독을 대신하지 않습니다.</span>
      </p>
    </div>
    <!-- E : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->

    <BtnTop />

  </section>

  <ResultDocument 
    v-if="analyzeData && analyzeData.examinationData"
    ref="resultDocumentRef"
    :analyzeData="analyzeData"
    :surveyData="surveyData"
    :isOneTime="isOneTime"
    :user="user"
    @progress="handleGenerateProgress"
    @complete="completeGenerateReport"
  />

  <base-popup v-if="isSharePopup" class="popup"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          <p class="pop-text-light">{{ $t('AnalyzeDetail.text16') }} </p>
          <p class="pop-text-bold">{{ $t('AnalyzeDetail.text17') }} </p>
          <div class="pop-btn-wrap">
            <button type="button" @click="isSharePopup = false" class="pop-btn pop-btn--gray">{{ $t('Common.close') }} </button>
            <button type="button" @click="handleReportOpenByType" class="pop-btn pop-btn--green">{{ $t('AnalyzeDetail.text19') }} </button>
          </div>
        </div>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="isViewerPopup"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          <p>{{ $t('AnalyzeDetail.text16') }} </p>
          <p>{{ $t('AnalyzeDetail.text20') }} </p>
          <div class="AnalyzeDownload--down-pop--btn-wrap">
            <button type="button" @click="isViewerPopup = false" class="btn-pop--gray">{{ $t('Common.close') }} </button>
            <button type="button" @click="handleReportOpenByType" class="btn-pop--green">{{ $t('AnalyzeDetail.text21') }} </button>
          </div>
        </div>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="false"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div v-if="isIos" class="AnalyzeDownload--down-pop"> <!--ios-->
        <div class="AnalyzeDownload--down-pop--ios">
          {{ $t('AnalyzeDetail.text22') }} 

          <div v-if="isIosChrome" class="AnalyzeDownload--down-pop--chrome"> <!--크롬-->
            <img src="" alt="" class="AnalyzeDownload--down-pop--chrome-ico" /> {{ $t('AnalyzeDetail.text23') }}  <br />
            {{ $t('AnalyzeDetail.text18') }}  <img src="" alt="" class="AnalyzeDownload--down-pop--chrome-ico2" /> {{ $t('AnalyzeDetail.text16') }} 
          </div>

          <div v-else class="AnalyzeDownload--down-pop--safari"> <!--사파리-->
            <img
              src=""
              alt=""
              srcset=""
              class="AnalyzeDownload--down-pop--safari-ico" /> {{ $t('AnalyzeDetail.text13') }}  <br />
            {{ $t('AnalyzeDetail.text25') }} 
          </div>

        </div>
        <div class="AnalyzeDownload--down-pop--confirm">
          <button @click="iosSafari" type="button">{{ $t('Common.confirm') }} </button>
        </div>
      </div>

      <div v-else class="AnalyzeDownload--down-pop--aos">
        <div class="AnalyzeDownload--down-pop--aos-txt">
          {{ $t('AnalyzeDetail.text28') }}  <br />
          {{ $t('AnalyzeDetail.text29') }} 
          <div class="AnalyzeDownload--down-pop--load">{{ $t('AnalyzeDetail.text30') }} </div>
        </div>
        <div class="AnalyzeDownload--down-pop--cancel-wrap">
          <button @click="downCancel()" type="button" class="AnalyzeDownload--down-pop--cancel">{{ $t('Common.cancle') }} </button>
        </div>
      </div>

    </template>
  </base-popup>

  <base-popup v-if="isPopDeleteReport" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-light">{{ $t('AnalyzeDetail.text32') }} </p>
      <p class="pop-text-bold">{{ $t('AnalyzeDetail.text33') }} </p>
      <div class="pop-btn-wrap">
        <button @click="[isDeleteReport = false, isPopDeleteReport = false]" class="pop-btn pop-btn--gray" type="button">{{ $t('Common.cancle') }} </button>
        <button @click="[isDeleteReport = true, isPopDeleteReport = false]" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }} </button>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="isOneTimeDonwloadPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-light">{{ $t('AnalyzeDetail.text34') }} </p>
      <p class="pop-text-bold">{{ $t('AnalyzeDetail.text35') }} <br />{{ $t('AnalyzeDetail.text36') }} </p>
      <div class="pop-btn-wrap">
        <button @click="closeOneTimeDonwloadPopup" class="pop-btn pop-btn--gray" type="button">{{ $t('Common.cancle') }} </button>
        <button @click="confirmOneTimeDonwload" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }} </button>
      </div>
    </template>
  </base-popup>

  <transition name="toastFade">
    <div v-if="toastMsg !== ''" class="toast">
      {{ toastMsg }}
    </div>
  </transition>

  <!-- 가이드 팝업들 -->
  <AnalyzeDietDetailGuide
    :isOpen="dietGuidePopup"
    @close="closeDietGuide" />

  <AnalyzeExerciseDetailGuide
    :isOpen="exerciseGuidePopup"
    @close="closeExerciseGuide" />

  <AnalyzeSleepDetailGuide
    :isOpen="sleepGuidePopup"
    @close="closeSleepGuide" />

  <!-- 체성분 데이터 없음 팝업 -->
  <BasePopup v-if="showNoDataPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('AnalyzeDetail.noBodyCompositionData') }}</p>
      <div class="base-pop--footer">
        <button @click="showNoDataPopup = false" type="button" class="btn-pop--green">{{ $t('AnalyzeDetail.confirm') }}</button>
      </div>
    </template>
  </BasePopup>

  <!-- 에러 메시지 팝업 -->
  <BasePopup v-if="showErrorPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ errorPopupMessage }}</p>
      <div class="base-pop--footer">
        <button @click="closeErrorPopup" type="button" class="btn-pop--green">{{ $t('AnalyzeDetail.confirm') }}</button>
      </div>
    </template>
  </BasePopup>

  <!-- 성공 메시지 토스트 -->
  <BaseToast :msg="successToastMessage" />

  <!-- 체성분 데이터 선택 팝업 -->
  <BodyCompositionPopup 
    :isOpen="openPopBodyComposition"
    :showBodyKeyLogin="showBodyKeyLogin"
    :showBodyKeyResult="showBodyKeyResult"
    :showBodyKeyDetail="showBodyKeyDetail"
    :showResultPopup="showResultPopup"
    :resultMessage="resultMessage"
    :resultType="resultType"
    :bodyKeyDataList="bodyKeyDataList"
    :bodyCompositionDataList="bodyCompositionDataList"
    :isLoading="isLoading"
    :selectedBodyKeyData="selectedBodyKeyData"
    :selectedDataType="selectedDataType"
    :formatDatetime="formatDatetime"
    :loginFailed="bodyKeyLoginFailed"
    @close="openPopBodyComposition = false"
    @update:selectedBodyKeyData="selectedBodyKeyData = $event"
    @update:showBodyKeyLogin="showBodyKeyLogin = $event"
    @update:showBodyKeyResult="showBodyKeyResult = $event"
    @update:showBodyKeyDetail="showBodyKeyDetail = $event"
    @handleBodyKeyLogin="handleBodyKeyLoginWrapper"
    @selectBodyKeyData="selectBodyKeyData"
    @selectExistingBodyComposition="selectExistingBodyComposition"
    @confirmBodyKeyData="confirmBodyKeyData"
    @analyzeSelectedBodyKeyData="handleAnalyzeSelectedBodyKeyData"
    @closeBodyKeyDetail="closeBodyKeyDetail"
    @handleDirectInput="handleDirectInput"
    @closeResultPopup="closeResultPopup"
    @refreshAnalysisData="() => { getAnalysisCompleteDetail(checkupResultId); setData(analyzeData.value) }"
  />

  <!-- PDF 로딩 팝업 -->
  <base-popup v-if="isPdfLoadingPopup" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('Pdf.processing')}}</p>
      <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
      <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>

  <!-- 최초 Front 에서 PDF 생성중임을 알리는 팝업 -->
  <base-popup v-if="isMakePdfOnFrontPopup" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('Pdf.makeProcessing')}}</p>
      <p class="pop-text-light">{{ completePdfPageCount }} / {{ totalPage }}</p>
      <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>

  <!-- 일회성 PDF 생성 대기 로딩 팝업 -->
  <base-popup v-if="isOneTimePdfLoading" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('CheckupComplete.text17')}}</p>
      <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>

  <!-- 일회성 PDF 다운로드 확인 팝업 -->
  <base-popup v-if="isOneTimeDownloadPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-bold" v-html="$t('CheckupComplete.text27')"></p>
      <div class="pop-btn-wrap">
        <button type="button" @click="handleOneTimePdfDownload" class="pop-btn pop-btn--green pop-btn--wide">{{ $t('CheckupComplete.text28') }}</button>
      </div>
      <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12') }} </p>
      <div class="text-link-wrap">
        <span class="text-link" @click="closeOneTimeDownloadPopup">{{ $t('CheckupComplete.text29') }}</span>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped> /* 2606 스타일 태그 내용 수정 */
// PDF 로딩 팝업 스타일
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
  background-color: #7ED47C;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6746F;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6AE5A;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
  background-color: #7ED47C;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

// PDF 공유 옵션 팝업 스타일
.share-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.share-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7ED47C;
    background: #f8fff8;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.share-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.share-option-btn span:last-child {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next){
  width: 4.8rem;
  height: 4.8rem;
  top: 50%;
  transform: translateY(-50%);
  @media (min-width: 960px){
    display: none;
  }
}
:deep(.swiper-button-next:after, .swiper-rtl .swiper-button-prev:after),
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  content: "";
  display: block;
  width: 4.8rem;
  height: 4.8rem;
  background: url("/img/btn-arrow.png") no-repeat center;
  background-size: 4.8rem;
}
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  transform: rotate(180deg);
}
:deep(.swiper-button-prev.swiper-button-disabled){
  display: none;
}
:deep(.swiper-button-next.swiper-button-disabled){
  display: none;
}

// 일회성 PDF 다운로드 팝업 스타일
.pop-btn--wide {
  width: 100%;
  max-width: none;
}

.text-link-wrap {
  margin-top: 1.6rem;
  text-align: center;
}

.text-link {
  color: #666;
  font-size: 1.3rem;
  line-height: 1.5;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
  @media (min-width:960px) {
    font-size: 1.4rem;
  }
  &:hover {
    color: #333;
  }
  
  &:active {
    opacity: 0.7;
  }
}
</style>
