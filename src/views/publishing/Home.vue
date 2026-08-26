<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router' /* useRoute 퍼블 확인용 */
import BasePopup from '@/components/BasePopup.vue'
import AnalyzeAgingSpeed from '@/views/publishing/analyze/AnalyzeAgingSpeed.vue' /* 퍼블 확인용 아래가 원본 */
// import AnalyzeAgingSpeed from '@/views/analyze/components/analyzeAgingSpeed'
import AnalysisSharePopup from '@/components/AnalysisSharePopup.vue'
import BodyCompositionPopup from '@/components/BodyCompositionPopup.vue'
import AddBtnHome from '@/components/AddBtnHome.vue'
import { Navigation, Pagination } from 'swiper/modules'
import * as couponApi from '@/apis/coupon'
import * as checkupApi from '@/apis/checkup'
import { dateConvert, getScoreColor, getStatusColor, mwlRound, getColor } from '@/assets/js/common'
import { useAnalysis } from '@/composables/useAnalyze'
import { useMoveStep } from '@/composables/checkup'
import { useBodyComposition } from '@/composables/useBodyComposition'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()
const router = useRouter()
const route = useRoute() /* useRoute 퍼블 확인용 */
const moveStep = useMoveStep()

// PWA는 AddBtnHome 컴포넌트에서 처리

// useBodyComposition composable 사용
// 퍼블 확인용 아래 주석이 원본
const {
  openPopBodyComposition,
  showBodyKeyLogin,
  showBodyKeyResult,
  showBodyKeyDetail,
  showResultPopup,
  resultMessage,
  resultType,
  bodyKeyDataList,
  bodyCompositionDataList,
  isLoading,
  selectedBodyKeyData,
  selectedDataType,
  formatDatetime,
  handleBodyKeyLogin,
  selectBodyKeyData,
  selectExistingBodyComposition,
  confirmBodyKeyData,
  analyzeSelectedBodyKeyData,
  closeBodyKeyDetail,
  handleDirectInput,
  closeResultPopup
} = useBodyComposition()

// const {
//   openPopBodyComposition,
//   showBodyKeyLogin,
//   showBodyKeyResult,
//   showBodyKeyDetail,
//   showResultPopup,
//   resultMessage,
//   resultType,
//   bodyKeyDataList,
//   bodyCompositionDataList,
//   isLoading,
//   selectedBodyKeyData,
//   selectedDataType,
//   formatDatetime,
//   handleBodyKeyLogin,
//   selectBodyKeyData,
//   selectExistingBodyComposition,
//   confirmBodyKeyData,
//   analyzeSelectedBodyKeyData,
//   closeBodyKeyDetail,
//   handleDirectInput,
//   openBodyCompositionPopup,
//   closeResultPopup
// } = useBodyComposition()

// 로그인 실패 상태 관리
const bodyKeyLoginFailed = ref(false)

// 바디키 로그인 처리 함수 래핑
const handleBodyKeyLoginWrapper = async (loginData) => {
  bodyKeyLoginFailed.value = false // 로그인 시도 시 실패 상태 초기화

  // 2606 퍼블 확인용 - 4번 카드: 로그인 후 바디키 조회 결과 있음 화면
  if (selectedBodyCompositionAnalysisId.value === 4) {
    bodyKeyDataList.value = selectedAnalysisItem.value?.bodyKeyDataList || []
    showBodyKeyLogin.value = false
    showBodyKeyResult.value = true
    showBodyKeyDetail.value = false
    selectedBodyKeyData.value = null
    selectedDataType.value = null
    return
  }

  const result = await handleBodyKeyLogin(loginData)
  
  if (!result.success) {
    bodyKeyLoginFailed.value = true
    console.error('바디키 로그인 실패:', result.error)
  }
}

/* 퍼블 확인용 임시 하단 주석이 기존 */
const user = {
  name: '이하늘'
}

const isLogin = computed(() => {
  return route.meta.isLogin === true || store.getters.isLogin
})
// const user = store.getters.getUser
// const isLogin = store.getters.isLogin

const isBefore = computed(() => { /* 퍼블 확인용 분석전 */
  return route.meta.isBefore === true
})

const activeFab = ref(false)
const isBottomFab = ref(false)
const myAnalysisCompleteList = ref([])
const modules = ref([Navigation, Pagination])
const motivationMessage = ref(t('Home.text1'))
const isDataLoading = ref(true) // 데이터 로딩 상태 추가

const isEmptyAnalysisComplete = computed(() => {
  return myAnalysisCompleteList.value.length > 0
})

const hasCoupon = async () => {
  return true // 퍼블 확인용 아래 주석이 원본

  // const params = {
  //   pageNo: 0,
  //   perPageNum: 500
  // }

  // const response = await couponApi.getCouponList(params)

  // return response.data.coupons && response.data.coupons.length > 0
}

const openPopNoCoupon = ref(false) /* 240118 쿠폰을 사야한다는 팝업 오프너 */
const openPopContinue = ref(false) /* 240119 기존에 하다 말았던 설문을 이어받아서 하겠냐는 팝업 오프너 */
const isContinue = ref(null) /* 240118 하다 말았던 설문을 이어하려면 true, 새로 하려면 false */

/* [s] 퍼블 확인용 - 검진 진입 임시 데이터 */
const publishingCheckupCommonInfo = {
  id: 1,
  basicsId: 1,
  analysisId: 1,
  analysisType: 'normal',
  currentStep: 'basics',
  status: 'TEMP'
}

const publishingNhisData = {
  checkDate: '2026.10.25',
  ht: 175,
  wt: 78,
  wc: 88,
  bmi: 25.5,
  sbp: 132,
  dbp: 86,
  glu: 104,
  tc: 205,
  ldl: 135,
  hdl: 46,
  tg: 165,
  got: 32,
  gpt: 41,
  crea: 1.0,
  hb: 15.1
}
/* [e] 퍼블 확인용 - 검진 진입 임시 데이터 */

const confirmContinue = () => { /* 240119 설문을 이어갈지 말지 판단하는 함수 */
  openPopContinue.value = true

  return new Promise((resolve) => {
    watch(isContinue, (newVal) => {
      newVal ? resolve(true) : resolve(false)
    })
  })
}

const getNhisInfo = async (id) => {
  try {
    const response = await checkupApi.getNhisInfo(id)

    return response.data?.value
  } catch (e) {
    console.error(e)
  }
}

const moveCheckUpPage = async () => {
  try {
    // 퍼블 확인용 아래 주석이 원본
    store.dispatch('checkup/init')
    store.dispatch('checkup/setAnalysisType', 'normal')
    store.dispatch('checkup/setHealthDataType', 'direct')
    store.dispatch('checkup/setBasicsId', publishingCheckupCommonInfo.basicsId)
    store.dispatch('checkup/setNhisData', publishingNhisData)

    router.push('/publishing/checkup/guide')

    // if (!await hasCoupon()) {
    //   openPopNoCoupon.value = true
    //   return
    // }

    // const checkupCommonInfo = await getCommonInfo('normal')

    // if (checkupCommonInfo) {
    //   if (await confirmContinue()) {
    //     const nhisInfo = await getNhisInfo(checkupCommonInfo.id)

    //     if (nhisInfo) {
    //       const data = {
    //         checkDate: dateConvert(nhisInfo.resCheckupYear.concat(nhisInfo.resCheckupDate), '.'),
    //         ht: nhisInfo.resHeight,
    //         wt: nhisInfo.resWeight,
    //         wc: nhisInfo.resWaist,
    //         bmi: nhisInfo.resBMI,
    //         sbp: nhisInfo.resBloodPressure.split('/')[0],
    //         dbp: nhisInfo.resBloodPressure.split('/')[1],
    //         glu: nhisInfo.resFastingBloodSuger,
    //         tc: nhisInfo.resTotalCholesterol,
    //         ldl: nhisInfo.resLDLCholesterol,
    //         hdl: nhisInfo.resHDLCholesterol,
    //         tg: nhisInfo.resTriglyceride,
    //         got: nhisInfo.resAST,
    //         gpt: nhisInfo.resALT,
    //         crea: nhisInfo.resSerumCreatinine,
    //         hb: nhisInfo.resHemoglobin
    //       }

    //       store.dispatch('checkup/setNhisData', data)
    //       store.dispatch('checkup/setHealthDataType', 'formal')
    //     } else {
    //       store.dispatch('checkup/setHealthDataType', 'direct')
    //     }
    //     store.dispatch('checkup/setBasicsId', checkupCommonInfo.basicsId)

    //     moveStep(checkupCommonInfo)
    //   } else {
    //     await checkupApi.deleteCheckup(checkupCommonInfo.id)
    //     router.push({ name: 'CheckupGuide' })
    //   }
    // } else {
    //   router.push({ name: 'CheckupGuide' })
    // }
  } catch (e) {
    console.error(e)
  }
}

const openPopOneTime = ref(false) /* 240119 일회성을 하겠냐?는 팝업 오프너 */
const isOneTime = ref(false) /* 240119 일회성을 할거면 true, 안할거면 false */
const openSharePopup = ref(false) /* 분석 결과 요약 공유 팝업 오프너 */
const selectedAnalysisItem = ref(null) /* 선택된 분석 결과 아이템 */
const selectedBodyCompositionAnalysisId = ref(null) /* 2026 퍼블 확인용 */

const confirmOneTime = () => { /* 240119 일회성할지 말지 판단하는 함수 */
  openPopOneTime.value = true
  return new Promise((resolve) => {
    watch(isOneTime, (newVal) => {
      if (newVal) {
        resolve(true)
      }
    })
  })
}

const moveOneTimeAnalysis = async () => {
  const hasValidCoupon = await hasCoupon()

  if (!hasValidCoupon) {
    openPopNoCoupon.value = true
    return
  }

  if (await confirmOneTime()) {
    store.dispatch('checkup/setAnalysisType', 'onetime')
    store.dispatch('checkup/setHealthDataType', 'direct')

    router.push('/publishing/checkup/checkup-privacy-agree') //퍼블 확인용 아래 주석이 원본
    // router.push({ name: 'CheckupSideTerms' })
  }
  return false
}

const moveDetailPage = (id) => {
  router.push({ path: '/analyze/detail' })
  store.dispatch('checkup/setAnalysisType', 'normal')
  store.dispatch('checkup/setResultId', id)
}

/* 2606 퍼블 확인용 - 스와이퍼 체성분 추가 버튼 클릭 시 측정 결과 데이터 세팅 */
const openBodyCompositionPopup = (analysisId, basicsId) => {
  const target = myAnalysisCompleteList.value.find((item) => {
    return item.id === analysisId
  })

  selectedBodyCompositionAnalysisId.value = analysisId

  bodyCompositionDataList.value = target?.bodyCompositionDataList || []
  bodyKeyDataList.value = target?.bodyKeyDataList || []

  selectedAnalysisItem.value = target || null
  openPopBodyComposition.value = true
  showBodyKeyLogin.value = false
  showBodyKeyResult.value = false
  showBodyKeyDetail.value = false
  selectedBodyKeyData.value = null
  selectedDataType.value = null

  console.log('analysisId:', analysisId)
  console.log('basicsId:', basicsId)
  console.log('target:', target)
  console.log('bodyCompositionDataList:', bodyCompositionDataList.value)
  console.log('bodyKeyDataList:', bodyKeyDataList.value)
}

// 체성분 분석 처리 및 새로고침
const handleAnalyzeSelectedBodyKeyData = async () => {
  try {
    const result = await analyzeSelectedBodyKeyData()
    if (result && result.success) {
      // 성공 시 새로고침
      // BodyCompositionPopup에 closePopup 이벤트 전송
      // 이는 openPopBodyComposition을 false로 설정하는 것과 동일
      openPopBodyComposition.value = false
      showBodyKeyDetail.value = false
      await getMyAnalysisCompleteDetail()
    }
  } catch (error) {
    console.error('체성분 분석 처리 중 오류:', error)
  }
}

const getCommonInfo = async (analysisType) => {
  try {
    const response = await checkupApi.getCommonInfo(analysisType)

    return response.data?.commonInfo
  } catch (e) {
    console.error(e)
  }
}

const getMyAnalysisCompleteDetail = async () => {
  try {
    isDataLoading.value = true // 로딩 시작

    const swiperData = [ /* 퍼블 확인용 */
      {
        id: 1,
        basicsId: 1,
        analysedDate: '2026.07.22 13:40:05',
        reportType: '3D',
        hcrReference: [],
        showMuscleBalanceTooltip: true,

        // [s] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터
        hqAr: {
          aging_rate: 0.52,
          status: 1
        },
        hqReage: {
          reage: 35
        },
        ariRisk: {
          SBP: 1,
          DBP: 1,
          WC: 2,
          BMI: 1,
          GLU: 1,
          TG: 1,
          TC: 1,
          HDL: 1,
          LDL: 1,
          GOT: 1,
          GPT: 1,
          HB: 1,
          CREA: 1,
          smok_dur: 1,
          pack_year: 1,
          sleep_time: 2,
          drink_amt: 1,
          MET: 1,
          EQ5D: 1,
          per_bodyfat: 1,
          WASM: 1
        },
        hqReference: {},
        analyzeAge: 35,
        commonInfo: {
          analysisType: 'normal'
        },
        hqDataList: [],
        basics: {},
        // [e] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터

        hqOxi: {
          score: 77,
          status: 1
        },
        hqMet: {
          score: 85,
          status: 1
        },
        hqMusBal: {
          score: 62,
          status: 3
        },
        dqData: {
          RFS_score: 74
        },
        metData: {
          met: 600
        },
        shData: {
          sh_score: 81
        },
        agingRate: 0.87,
        agingSpeed: 0.87,
        agingSpeedStatus: 'GOOD'
      },
      {
        id: 2,
        basicsId: 2,
        analysedDate: '2026.11.01 09:20:00',
        reportType: '2D',
        hcrReference: [],
        showMuscleBalanceTooltip: true,

        // 2606 퍼블 확인용 - 측정 결과 없음
        bodyCompositionDataList: [],

        // [s] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터
        hqAr: {
          aging_rate: 1.12,
          status: 2
        },
        hqReage: {
          reage: 42
        },
        ariRisk: {
          SBP: 1,
          DBP: 2,
          WC: 2,
          BMI: 3,
          GLU: 2,
          TG: 1,
          TC: 1,
          HDL: 1,
          LDL: 2,
          GOT: 1,
          GPT: 1,
          HB: 1,
          CREA: 1,
          smok_dur: 2,
          pack_year: 1,
          sleep_time: 3,
          drink_amt: 2,
          MET: 1,
          EQ5D: 1,
          per_bodyfat: 2,
          WASM: 1
        },
        hqReference: {},
        analyzeAge: 39,
        commonInfo: {
          analysisType: 'normal'
        },
        hqDataList: [],
        basics: {},
        // [e] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터

        hqOxi: {
          score: 68,
          status: 1
        },
        hqMet: {
          score: 58,
          status: 2
        },
        dqData: {
          RFS_score: 65
        },
        metData: {
          met: 4.8
        },
        shData: {
          sh_score: 72
        },
        agingRate: 1.12,
        agingSpeed: 1.12,
        agingSpeedStatus: 'WARNING'
      },
      {
        id: 3,
        basicsId: 3,
        analysedDate: '2026.01.15 09:20:00',
        reportType: '2D',
        hcrReference: [],
        showMuscleBalanceTooltip: true,

        // 2606 퍼블 확인용 - 측정 결과 없음
        bodyCompositionDataList: [],

        // [s] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터
        hqAr: {
          aging_rate: 1.48,
          status: 3
        },
        hqReage: {
          reage: 48
        },
        ariRisk: {
          SBP: 3,
          DBP: 2,
          WC: 3,
          BMI: 3,
          GLU: 2,
          TG: 3,
          TC: 2,
          HDL: 1,
          LDL: 3,
          GOT: 1,
          GPT: 2,
          HB: 1,
          CREA: 1,
          smok_dur: 3,
          pack_year: 2,
          sleep_time: 3,
          drink_amt: 2,
          MET: 2,
          EQ5D: 1,
          per_bodyfat: 3,
          WASM: 1
        },
        hqReference: {},
        analyzeAge: 41,
        commonInfo: {
          analysisType: 'normal'
        },
        hqDataList: [],
        basics: {},
        // [e] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터

        hqOxi: {
          score: 68,
          status: 1
        },
        hqMet: {
          score: 58,
          status: 2
        },
        dqData: {
          RFS_score: 65
        },
        metData: {
          met: 4.8
        },
        shData: {
          sh_score: 72
        },
        agingRate: 1.38,
        agingSpeed: 1.38,
        agingSpeedStatus: 'WARNING'
      },
      {
        id: 4,
        basicsId: 4,
        analysedDate: '2026.12.01 10:30:00',
        reportType: '2D',
        hcrReference: [],
        showMuscleBalanceTooltip: true,

        // [s] 2606 퍼블 확인용 - 체성분 측정 결과 있음
        bodyCompositionDataList: [
          {
            id: 401,
            analysisId: 4,
            basicsId: 4,
            surveyDate: '2026.12.01',
            ht: 175,
            wt: 78,
            wbtSmMass: 31.4,
            wbtBfMass: 19.2,
            wbtBfPercent: 24.6,
            ramMass: 3.2,
            ramPercent: 101,
            lamMass: 3.1,
            lamPercent: 99,
            rlmMass: 9.1,
            rlmPercent: 100,
            llmMass: 9.0,
            llmPercent: 98,
            trkMass: 24.8,
            trkPercent: 102
          },
          {
            id: 402,
            analysisId: 4,
            basicsId: 4,
            surveyDate: '2026.11.20',
            ht: 174.8,
            wt: 77.2,
            wbtSmMass: 30.8,
            wbtBfMass: 18.7,
            wbtBfPercent: 24.2,
            ramMass: 3.1,
            ramPercent: 100,
            lamMass: 3.0,
            lamPercent: 98,
            rlmMass: 9.0,
            rlmPercent: 99,
            llmMass: 8.9,
            llmPercent: 97,
            trkMass: 24.4,
            trkPercent: 101
          }
        ],
        // [e] 2606 퍼블 확인용 - 체성분 측정 결과 있음

        // [s] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터
        hqAr: {
          aging_rate: 0.96,
          status: 1
        },
        hqReage: {
          reage: 37
        },
        ariRisk: {
          SBP: 1,
          DBP: 1,
          WC: 1,
          BMI: 2,
          GLU: 1,
          TG: 1,
          TC: 1,
          HDL: 1,
          LDL: 1,
          GOT: 1,
          GPT: 1,
          HB: 1,
          CREA: 1,
          smok_dur: 1,
          pack_year: 1,
          sleep_time: 2,
          drink_amt: 1,
          MET: 1,
          EQ5D: 1,
          per_bodyfat: 1,
          WASM: 1
        },
        hqReference: {},
        analyzeAge: 37,
        commonInfo: {
          analysisType: 'normal'
        },
        hqDataList: [],
        basics: {},
        // [e] 퍼블 확인용 - AnalyzeAgingSpeed 전달 데이터

        // [s] 2606 퍼블 확인용 - 바디키 조회 결과 있음
        bodyKeyDataList: [
          {
            id: 501,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261210121200',
            ht: 175,
            wt: 78,
            smm: 31.4,
            bfm: 19.2,
            pbf: 24.6,
            lra: 3.2,
            pilra: 101,
            lla: 3.1,
            pilla: 99,
            lrl: 9.1,
            pilrl: 100,
            lll: 9.0,
            pilll: 98,
            lt: 24.8,
            pilt: 102
          },
          {
            id: 502,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261209112000',
            ht: 174.8,
            wt: 77.6,
            smm: 31.1,
            bfm: 18.9,
            pbf: 24.3,
            lra: 3.1,
            pilra: 100,
            lla: 3.0,
            pilla: 98,
            lrl: 9.0,
            pilrl: 99,
            lll: 8.9,
            pilll: 97,
            lt: 24.4,
            pilt: 101
          },
          {
            id: 503,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261208183500',
            ht: 174.8,
            wt: 77.2,
            smm: 30.8,
            bfm: 18.7,
            pbf: 24.2,
            lra: 3.1,
            pilra: 100,
            lla: 3.0,
            pilla: 98,
            lrl: 9.0,
            pilrl: 99,
            lll: 8.9,
            pilll: 97,
            lt: 24.4,
            pilt: 101
          },
          {
            id: 504,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261207153000',
            ht: 175,
            wt: 77.9,
            smm: 31.2,
            bfm: 19.0,
            pbf: 24.4,
            lra: 3.2,
            pilra: 101,
            lla: 3.1,
            pilla: 99,
            lrl: 9.1,
            pilrl: 100,
            lll: 9.0,
            pilll: 98,
            lt: 24.8,
            pilt: 102
          },
          {
            id: 505,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261206100500',
            ht: 175,
            wt: 78.1,
            smm: 31.5,
            bfm: 19.3,
            pbf: 24.7,
            lra: 3.2,
            pilra: 101,
            lla: 3.1,
            pilla: 99,
            lrl: 9.1,
            pilrl: 100,
            lll: 9.0,
            pilll: 98,
            lt: 24.8,
            pilt: 102
          },
          {
            id: 506,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261205194000',
            ht: 174.9,
            wt: 77.8,
            smm: 31.0,
            bfm: 18.8,
            pbf: 24.1,
            lra: 3.1,
            pilra: 100,
            lla: 3.0,
            pilla: 98,
            lrl: 9.0,
            pilrl: 99,
            lll: 8.9,
            pilll: 97,
            lt: 24.4,
            pilt: 101
          },
          {
            id: 507,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261204142200',
            ht: 175,
            wt: 78.4,
            smm: 31.7,
            bfm: 19.5,
            pbf: 24.9,
            lra: 3.2,
            pilra: 101,
            lla: 3.1,
            pilla: 99,
            lrl: 9.1,
            pilrl: 100,
            lll: 9.0,
            pilll: 98,
            lt: 24.8,
            pilt: 102
          },
          {
            id: 508,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261203110700',
            ht: 174.7,
            wt: 77.1,
            smm: 30.7,
            bfm: 18.5,
            pbf: 24.0,
            lra: 3.1,
            pilra: 100,
            lla: 3.0,
            pilla: 98,
            lrl: 9.0,
            pilrl: 99,
            lll: 8.9,
            pilll: 97,
            lt: 24.4,
            pilt: 101
          },
          {
            id: 509,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261202165500',
            ht: 175,
            wt: 78.6,
            smm: 31.8,
            bfm: 19.7,
            pbf: 25.1,
            lra: 3.2,
            pilra: 101,
            lla: 3.1,
            pilla: 99,
            lrl: 9.1,
            pilrl: 100,
            lll: 9.0,
            pilll: 98,
            lt: 24.8,
            pilt: 102
          },
          {
            id: 510,
            analysisId: 4,
            basicsId: 4,
            datetimes: '20261201121200',
            ht: 175,
            wt: 78,
            smm: 31.4,
            bfm: 19.2,
            pbf: 24.6,
            lra: 3.2,
            pilra: 101,
            lla: 3.1,
            pilla: 99,
            lrl: 9.1,
            pilrl: 100,
            lll: 9.0,
            pilll: 98,
            lt: 24.8,
            pilt: 102
          }
        ],
        // [e] 2606 퍼블 확인용 - 바디키 조회 결과 있음

        hqOxi: {
          score: 72,
          status: 1
        },
        hqMet: {
          score: 64,
          status: 2
        },
        dqData: {
          RFS_score: 70
        },
        metData: {
          met: 5.2
        },
        shData: {
          sh_score: 76
        },
        agingRate: 0.96,
        agingSpeed: 0.96,
        agingSpeedStatus: 'GOOD'
      },
    ]

    if (isBefore.value === false) { /* 퍼블 확인용 */
      myAnalysisCompleteList.value = swiperData
    }

    // 퍼블 확인용: 실제 API 호출 막음
    // const response = await analysisApi.getMyAnalysisCompleteDetail()
    // const data = response.data?.logmeCompleteAnalysisMySimple || []

    // if (data && data.length > 0) {
    //   myAnalysisCompleteList.value = data.map((item) => {
    //     return {
    //       ...item,
    //       hcrReference: [],
    //       // 체성분 입력 툴팁 제어
    //       showMuscleBalanceTooltip: true
    //     }
    //   })

    //   // 현재 일자
    //   const today = new Date()
    //   // 첫 번째 분석 일자
    //   const aDate = new Date(dateConvert(myAnalysisCompleteList.value[0].analysedDate, '-'))
    //   // 분석일에서 6개월 더한 일자
    //   const addSixMonth = new Date(new Date(aDate).setMonth(aDate.getMonth() + 6))
    //   // 분석일에서 12개월 더한 일자
    //   const addOneYear = new Date(new Date(aDate).setMonth(aDate.getMonth() + 12))

    //   if (today >= addSixMonth && today < addOneYear) {
    //     // 6개월 경과시
    //     motivationMessage.value = ref(t('Home.text2'))//'건강한 생활습관을 꾸준히 관리해주세요'
    //   } else if (today >= addOneYear) {
    //     // 12개월 경과시
    //     motivationMessage.value = ref(t('Home.text3')) //'새로운 웰니스 분석을 통해 변화되는 결과를 확인해보세요'
    //   }
    // }
  } catch (e) {
    console.error(e)
  } finally {
    isDataLoading.value = false // 로딩 완료
  }
}

const handleNewCheckup = () => {
  isContinue.value = false
  openPopContinue.value = false
}

const handleContinuCheckup = () => {
  isContinue.value = true
  openPopContinue.value = false
}

const initAnalysisData = () => {
  store.dispatch('checkup/init')
  store.dispatch('checkup/setAnalysisType', '')
  store.dispatch('checkup/setCheckDate', '')
}

onBeforeMount(async () => {
  try {
    initAnalysisData()

    await getMyAnalysisCompleteDetail()
  } catch (e) {
    console.error(e)
  }
})

// 체성분 입력 툴팁 제어
const closeMuscleBalanceTooltip = (item) => {
  item.showMuscleBalanceTooltip = false
}

const openShareAnalysis = (item) => {
  selectedAnalysisItem.value = item
  openSharePopup.value = true
}

const closeSharePopup = () => {
  openSharePopup.value = false
  selectedAnalysisItem.value = null
}

const closeBodyCompositionPopup = () => {
  openPopBodyComposition.value = false
  showBodyKeyLogin.value = false
  showBodyKeyResult.value = false
  showBodyKeyDetail.value = false
  selectedBodyKeyData.value = null
  selectedDataType.value = null
  selectedAnalysisItem.value = null
}

// 분석일로부터 60일 뒤 날짜 계산
const getUpgradeDate = (analysedDate) => {
  if (!analysedDate) return ''

  // "2025.07.22 13:40:05" 형식에서 날짜 부분만 추출 (YYYY.MM.DD)
  const dateStr = analysedDate.substring(0, 10)

  // Date 객체로 변환
  const date = new Date(dateStr.replace(/\./g, '-'))

  // 60일 뒤 계산
  const upgradeDate = new Date(date.setDate(date.getDate() + 60))

  const year = upgradeDate.getFullYear()
  const month = String(upgradeDate.getMonth() + 1).padStart(2, '0')
  const day = String(upgradeDate.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

// 업그레이드 기한이 만료되었는지 확인
const isUpgradeExpired = (analysedDate) => {
  if (!analysedDate) return false

  // "2025.07.22 13:40:05" 형식에서 날짜 부분만 추출 (YYYY.MM.DD)
  const dateStr = analysedDate.substring(0, 10)

  // 분석일을 Date 객체로 변환
  const date = new Date(dateStr.replace(/\./g, '-'))

  // 60일 뒤 계산
  const upgradeDate = new Date(date.setDate(date.getDate() + 60))

  // 오늘 날짜
  const today = new Date()

  // 오늘 날짜가 업그레이드 날짜보다 이후면 만료
  return today > upgradeDate
}

/**
 * 스크롤 핸들러
 * home--start-wrap를 지나는 시점에서 activeFab 활성화
 * 맨 하단에서 300px 위치 도달 시 isBottomFab 활성화
 */
const handleScroll = () => {
  const currentScrollY = window.scrollY

  // 100px 스크롤했을 때 버튼 활성화
  const triggerPoint = 100

  if (currentScrollY > triggerPoint) {
    activeFab.value = true
  } else {
    activeFab.value = false
  }

  // 맨 하단에서 80px 위치 도달 시 isBottomFab 활성화
  const documentHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight
  const scrollBottom = currentScrollY + windowHeight

  // 맨 하단에서 80px 이내에 도달하면 isBottomFab 활성화
  if (documentHeight - scrollBottom <= 80) {
    isBottomFab.value = true
  } else {
    isBottomFab.value = false
  }
}

// 데이터 로딩 완료 후 스크롤 이벤트 등록
watch(isDataLoading, (newValue) => {
  if (!newValue) {
    nextTick(() => {
      window.addEventListener('scroll', handleScroll)
      // 초기 상태 설정
      handleScroll()
    })
  }
}, { immediate: true })

/**
 * 컴포넌트 언마운트 시 이벤트 리스너 제거
 */
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

onMounted(() => {
  console.log('Home.vue 마운트됨')
})

// 공통 composable을 사용하는 헬퍼 함수들
const getAgingRate = (item) => {
  const { agingRate } = useAnalysis(computed(() => item))
  return agingRate.value
}

const getAgingSpeedText = (item) => {
  const { agingSpeedStatus } = useAnalysis(computed(() => item))
  return agingSpeedStatus.value.text
}

const getAgingSpeedClass = (item) => {
  const { agingSpeedClass } = useAnalysis(computed(() => item))
  return agingSpeedClass.value
}

const getHealthTrafficLight = (item) => {
  const { healthTrafficLight } = useAnalysis(computed(() => item))
  return healthTrafficLight.value
}
</script>

<template>
  <section class="home">
    <!-- 데이터 로딩이 완료된 후에만 실제 콘텐츠 표시 -->
    <template v-if="!isDataLoading">
      <div v-if="isLogin" class="home--hi">
        <p> {{user.name}}{{ $t('Common.name2') }}<br />
          <span>{{ $t('Router.analyze.text2') }}</span>
        </p>
      </div>

      <!-- <div class="home--msg" :class="isEmptyAnalysisComplete ? 'login-after' : ''">
        <div class="home--balloon">
          <span v-if="!isEmptyAnalysisComplete">{{ $t('Home.text5') }} </span>
          <span v-else class="home--greeting">{{motivationMessage}}
            <span class="home--doctor-s" />
          </span>
        </div>
      </div> -->

      <div class="home--start-wrap">
        <div class="home--my-result">
          <!-- <h2 v-if="isEmptyAnalysisComplete" class="home--my-result--tit">{{ $t('Home.text6') }} </h2> -->
          <!-- 2606 swiper 옵션 수정 -->
          <swiper
            :centered-slides="true"
            :space-between="8"
            :pagination="{
              clickable: true
            }"
            :navigation="true"
            :slides-per-view="1.2"
            :breakpoints="{
              '0': {
                slidesPerView: 1.2,
              },
              '520': {
                slidesPerView: 'auto'
              },
              '960': {
                slidesPerView: 'auto',
                spaceBetween: 12,
              }
            }"
            :modules="modules"
            class="pay-method--swiper">
            <swiper-slide v-for="(item, index) in myAnalysisCompleteList" :key="index">
              <div class="home-swiper">
                <div class="home--top">
                  <p class="home--date">{{ $t('Home.text7') }} : {{ item.analysedDate.substring(0, 10) }}</p>
                  <div class="home--top-right">
                    <button @click="moveDetailPage(item.id)" type="button" class="home--view-result">{{ $t('Analyze.text9') }}</button>
                    <button @click="openShareAnalysis(item)" class="home--ico-share">
                      <img
                        src="/img/ico_share.svg"
                        alt="공유하기" />
                    </button>
                  </div>
                </div>

                <!-- [s] 2606 라이브 버전에 맞춰 복약 부분 미노출 -->
                <!-- S : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
                <!-- <p class="home--medication"> -->
                  <!-- {{ $t('Router.checkup.text21') }}:  -->
                  <!-- <span class="home--medication-detail"> -->
                    <!-- to 개발 | 복약정보가 없을 경우 -->
                    <!-- {{ $t('CheckupMedication.text4') }} -->

                    <!-- to 개발 | 복약정보가 있을 경우 -->
                    <!-- {{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}, {{ $t('CheckupMedication.text14') }}, {{ $t('CheckupMedication.text7') }}, {{ $t('CheckupMedication.text12') }}, {{ $t('CheckupMedication.text8') }} -->
                  <!-- </span> -->
                <!-- </p> -->
                <!-- E : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
                <!-- [e] 2606 라이브 버전에 맞춰 복약 부분 미노출 -->

                <p class="home--info" v-html="$t('Home.healthSummary', {
                  rate: `<span class='${getAgingSpeedClass(item)}'>${getAgingRate(item)}${$t('AnalyzeAgingSpeedDetail.text2')}, ${getAgingSpeedText(item)}</span>`,
                  good: getHealthTrafficLight(item).good,
                  manage: getHealthTrafficLight(item).manage,
                  warning: getHealthTrafficLight(item).warning
                })"></p>

                <h3 class="home--aging-tit">{{ $t('Home.text9') }}</h3>
                <div class="home--aging">
                  <div>
                    <AnalyzeAgingSpeed :id="`g_` + item.id" :isMain="true" :sendData="item" />
                  </div>
                </div>
                <div class="home--index--top">
                  <h3 class="home--index--top-tit">{{ $t('Home.text27') }} </h3>
                  <ul class="home--index--legend-wrap">
                    <li class="home--index--legend-con is-red">{{ $t('Common.warning') }}</li>
                    <li class="home--index--legend-con is-yellow">{{ $t('Common.manage') }}</li>
                    <li class="home--index--legend-con is-green">{{ $t('Common.good') }}</li>
                  </ul>
                </div>
                <div class="home--index">

                  <!-- 노화 억제 분석 지수 -->
                  <div class="home--index--con" :style="{borderColor: getColor(item.hqOxi?.status)}">
                    <h4 class="home--index--con-tit">{{ $t('Home.text11') }}<br />{{ $t('Home.text12') }}</h4>
                    <div class="home--index--con-digit">
                      <strong :style="{color: getColor(item.hqOxi?.status)}" class="home--index--con-digit-total">
                        {{ mwlRound(item.hqOxi?.score || 0, 0) }}
                      </strong>
                      <span class="home--index--con-digit-unit">{{ $t('Common.score') }}</span>
                    </div>
                  </div>

                  <!-- 만성질환 억제 분석 지수 -->
                  <div class="home--index--con" :style="{borderColor: getColor(item.hqMet?.status)}">
                    <h4 class="home--index--con-tit">{{ $t('Home.text10') }} <br />{{ $t('Home.text12') }}</h4>
                    <div class="home--index--con-digit">
                      <strong :style="{color: getColor(item.hqMet?.status)}" class="home--index--con-digit-total">
                        {{ mwlRound(item.hqMet?.score || 0, 0) }}
                      </strong>
                      <span class="home--index--con-digit-unit">{{ $t('Common.score') }}</span>
                    </div>
                  </div>

                  <!-- 근육 밸런스 분석 지수 -->
                  <!-- 3D 리포트인 경우 -->
                  <div v-if="item.reportType === '3D'" class="home--index--con" :style="{borderColor: getColor(item.hqMusBal?.status)}">
                    <h4 class="home--index--con-tit">{{ $t('Home.text28') }} <br />{{ $t('Home.text12') }}</h4>
                    <div class="home--index--con-digit">
                      <strong :style="{color: getColor(item.hqMusBal?.status)}" class="home--index--con-digit-total">
                        {{ mwlRound(item.hqMusBal?.score || 0, 0) }}
                      </strong>
                      <span class="home--index--con-digit-unit">{{ $t('Common.score') }}</span>
                    </div>
                  </div>

                  <!-- 2D 리포트인 경우 - 기한 내 -->
                  <div v-else-if="item.reportType === '2D' && !isUpgradeExpired(item.analysedDate)" class="home--index--con home--index--con-disabled">
                    <h4 class="home--index--con-tit">{{ $t('Home.text28') }} <br />{{ $t('Home.text12') }} </h4>
                    <div class="home--index--con-digit">
                      <img src="/img/icon-add.svg" alt="추가하기" @click="openBodyCompositionPopup(item.id, item.basicsId)" style="cursor: pointer;">
                    </div>

                    <!-- 체성분 입력 업그레이드 안내 툴팁 -->
                    <div class="home--index--con-tooltip tooltip-bottom-arrow" v-if="item.showMuscleBalanceTooltip" @click="closeMuscleBalanceTooltip(item)">
                      <div class="tooltip-text">
                        <div v-html="$t('Home.bodyCompositionUpgrade')"></div>
                        <span>
                          <!-- 2026.12.31 까지 -->
                          <!-- [s] 2606 날짜 strong 태그 추가 -->
                          <strong>{{ getUpgradeDate(item.analysedDate) }}</strong>
                          {{ $t('Home.text33') }}
                          <!-- [s] 2606 날짜 strong 태그 추가 -->
                        </span>
                      </div>
                      <div class="tooltip-icon">
                        <img src="/img/ico_x.svg" alt="툴팁 닫기" @click="closeMuscleBalanceTooltip(item)">
                      </div>
                    </div>
                  </div>

                  <!-- 2D 리포트인 경우 - 만료 -->
                  <div v-else-if="item.reportType === '2D' && isUpgradeExpired(item.analysedDate)" class="home--index--con home--index--con-expired">
                    <h4 class="home--index--con-tit">{{ $t('Home.text28') }} <br />{{ $t('Home.text12') }}</h4>
                    <div class="home--index--con-digit">
                      <span class="expired-text">{{ $t('Home.expired') }}</span>
                    </div>
                  </div>

                  <!-- 식사 -->
                  <div class="home--index--con" :style="{borderColor: getScoreColor(item.dqData?.RFS_score || 0 , 'rfs')}">
                    <h4 class="home--index--con-tit">{{ $t('Home.text29') }}</h4>
                    <div class="home--index--con-digit">
                      <strong :style="{color: getScoreColor(item.dqData?.RFS_score || 0 , 'rfs')}" class="home--index--con-digit-total">
                        {{ mwlRound(item.dqData?.RFS_score || 0 , 0) }}
                      </strong>
                      <span class="home--index--con-digit-unit">{{ $t('Common.score') }}</span>
                    </div>
                  </div>

                  <!-- 운동 -->
                  <div class="home--index--con" :style="{borderColor: getScoreColor(item.metData?.met || 0, 'musMass')}">
                    <h4 class="home--index--con-tit">{{ $t('Home.text30') }}</h4>
                    <div class="home--index--con-digit">
                      <strong :style="{color: getScoreColor(item.metData?.met || 0, 'musMass')}" class="home--index--con-digit-total">
                        {{ mwlRound(item.metData?.met || 0, 0) }}
                      </strong>
                      <span class="home--index--con-digit-unit is-en">MET</span>
                    </div>
                  </div>

                  <!-- 수면 -->
                  <div class="home--index--con" :style="{borderColor: getScoreColor(item.shData?.sh_score, 'sh')}">
                    <h4 class="home--index--con-tit">{{ $t('Home.text31') }}</h4>
                    <div class="home--index--con-digit">
                      <strong :style="{color: getScoreColor(item.shData?.sh_score, 'sh')}" class="home--index--con-digit-total">
                        {{ mwlRound(item.shData?.sh_score || 0, 0) }}
                      </strong>
                      <span class="home--index--con-digit-unit">{{ $t('Common.score') }}</span>
                    </div>
                  </div>

                </div>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div
                class="home-swiper blank"
                :class="myAnalysisCompleteList.length === 0 ? 'small' : ''">
                <a @click="moveCheckUpPage" href="javascript:void(0)" class="home--start">
                  <p class="home--txt">
                    <span v-if="myAnalysisCompleteList.length > 0">{{ $t('Home.text13') }}</span>
                    <span v-else>{{ $t('Home.text13') }}</span>
                  </p>
                  <p class="home--tit">
                    <span>{{ $t('Home.text14') }}<br />
                      {{ $t('Home.text16') }}
                    </span>
                  </p>
                </a>
                <div class="home--doctor" /> <!--의사 이미지-->
                <div class="home--plus" />
              </div>
            </swiper-slide>
          </swiper>
        </div>

      </div>

      <div class="home--instant">
        <a href="javascript:void(0)" @click="moveOneTimeAnalysis" class="home--instant-btn">{{ $t('Home.text17') }}</a>
      </div>

      <div class="home--visual">
        <img src="/img/img_intro.svg" alt="" />
      </div> <!--비주얼 이미지-->

      <div class="btn--re-checkup" :class="[activeFab ? 'active' : '', isBottomFab ? 'bottom' : '']" @click="moveCheckUpPage">
        <span>마이웰니스 랩 분석 시작</span> <!-- 2606 하단 플로팅 버튼 텍스트 수정 -->
      </div>
    </template>

    <base-popup v-if="openPopNoCoupon" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('Home.text18') }}</p>
        <p class="pop-text-caption center">※ {{ $t('Home.text19') }}</p> <!-- 2606 분석권 없음 팝업 캡션 클래스 수정 -->
        <div class="pop-btn-wrap">
          <button @click="openPopNoCoupon = false" class="pop-btn--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="openPopContinue" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-light">{{ $t('Home.text25') }}</p>
        <p class="pop-text-bold">{{ $t('Home.text26') }}</p>
        <div class="pop-btn-wrap">
          <button @click="handleNewCheckup" class="pop-btn pop-btn--gray" type="button">{{ $t('Home.text20') }}</button>
          <button @click="handleContinuCheckup" class="pop-btn pop-btn--green" type="button">{{ $t('Home.text21') }}</button>
        </div>
        <!-- 2606 이어하기 확인 팝업 x 버튼 삭제 -->
        <!-- <div class="openPopContinue--close">
          <button
            @click="openPopContinue = false"
            type="button"
            aria-label="닫기"
            class="popup--close" />
        </div> -->
      </template>
    </base-popup>

    <base-popup v-if="openPopOneTime" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-light">{{ $t('Home.text23') }}</p>
        <p class="pop-text-bold">{{ $t('Home.text24') }}</p>
        <div class="pop-btn-wrap">
          <button @click="[openPopOneTime = false]" class="pop-btn pop-btn--gray" type="button">{{ $t('Common.cancle') }}</button>
          <button @click="[isOneTime = true, openPopOneTime = false]" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <!-- 분석 결과 요약 공유 팝업 -->
    <AnalysisSharePopup 
      :isOpen="openSharePopup"
      :analysisData="selectedAnalysisItem"
      @close="closeSharePopup"
    />

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
      @close="closeBodyCompositionPopup"
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
      @refreshAnalysisData="getMyAnalysisCompleteDetail"
    />

    <!-- PWA 홈 화면 추가 버튼 -->
    <AddBtnHome />
  </section>
</template>

<style lang="scss" scoped> /* 2606 스타일 수정 */
:deep(.swiper-button-next){
  @media (max-width: 960px) {
    display: none;
  }
}
:deep(.swiper-button-prev) {
  @media (max-width: 960px) {
    display: none;
  }
}
:deep(.swiper-button-next:after, .swiper-rtl .swiper-button-prev:after){
  content: "";
  display: block;
}
:deep(.swiper-button-prev, .swiper-button-next){
  top: var(--swiper-navigation-top-offset, 50%);
}
:deep(.swiper-button-next, .swiper-rtl .swiper-button-prev) {
  top: 50%;
  right: auto;
  left: calc(50% + 18.2rem);
  transform: translateY(-100%);
  margin-top: 0;
  width: 5.6rem;
  height: 5.6rem;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 100%;
}
:deep(.swiper-button-prev, .swiper-rtl .swiper-button-next) {
  top: 50%;
  left: auto;
  right: calc(50% + 21rem);
  transform: translateY(-100%) rotate(180deg);
  margin-top: 0;
  width: 5.6rem;
  height: 5.6rem;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 100%;
}
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  content: "";
  display: block;
}
:deep(.swiper-button-prev.swiper-button-disabled){
  display: none;
}
:deep(.swiper-button-next.swiper-button-disabled){
  display: none;
}

/* PC에서 home--instant-btn 클릭 문제 해결 */
@media (min-width: 960px) {
  .home--instant-btn {
    cursor: pointer !important;
    pointer-events: auto !important;
    position: relative;
    z-index: 1;
    &:hover {
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
  }
  
  .home--instant {
    position: relative;
    z-index: 1;
  }
}

/* PWA 스타일은 AddBtnHome.vue에서 처리 */
</style>