<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import AnalyzeAgingSpeed from '@/views/analyze/components/analyzeAgingSpeed'
import AnalysisSharePopup from '@/components/AnalysisSharePopup.vue'
import BodyCompositionPopup from '@/components/BodyCompositionPopup.vue'
import AddBtnHome from '@/components/AddBtnHome.vue'
import { Navigation, Pagination } from 'swiper/modules'
import * as couponApi from '@/apis/coupon'
import * as checkupApi from '@/apis/checkup'
import * as analysisApi from '@/apis/analysis'
import { dateConvert, getScoreColor, getStatusColor, mwlRound, getColor } from '@/assets/js/common'
import { useAnalysis } from '@/composables/useAnalyze'
import { useMoveStep } from '@/composables/checkup'
import { useBodyComposition } from '@/composables/useBodyComposition'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()
const router = useRouter()
const moveStep = useMoveStep()

// PWA는 AddBtnHome 컴포넌트에서 처리

// useBodyComposition composable 사용
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
  openBodyCompositionPopup,
  closeResultPopup
} = useBodyComposition()

// 로그인 실패 상태 관리
const bodyKeyLoginFailed = ref(false)

// 바디키 로그인 처리 함수 래핑
const handleBodyKeyLoginWrapper = async (loginData) => {
  bodyKeyLoginFailed.value = false // 로그인 시도 시 실패 상태 초기화
  
  const result = await handleBodyKeyLogin(loginData)
  
  if (!result.success) {
    bodyKeyLoginFailed.value = true
    console.error('바디키 로그인 실패:', result.error)
  }
}

const user = store.getters.getUser
const isLogin = store.getters.isLogin

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
  const params = {
    pageNo: 0,
    perPageNum: 500
  }

  const response = await couponApi.getCouponList(params)

  return response.data.coupons && response.data.coupons.length > 0
}



const openPopNoCoupon = ref(false) /* 240118 쿠폰을 사야한다는 팝업 오프너 */
const openPopContinue = ref(false) /* 240119 기존에 하다 말았던 설문을 이어받아서 하겠냐는 팝업 오프너 */
const isContinue = ref(null) /* 240118 하다 말았던 설문을 이어하려면 true, 새로 하려면 false */

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
    if (!await hasCoupon()) {
      openPopNoCoupon.value = true
      return
    }

    const checkupCommonInfo = await getCommonInfo('normal')

    if (checkupCommonInfo) {
      if (await confirmContinue()) {
        const nhisInfo = await getNhisInfo(checkupCommonInfo.id)

        if (nhisInfo) {
          const data = {
            checkDate: dateConvert(nhisInfo.resCheckupYear.concat(nhisInfo.resCheckupDate), '.'),
            ht: nhisInfo.resHeight,
            wt: nhisInfo.resWeight,
            wc: nhisInfo.resWaist,
            bmi: nhisInfo.resBMI,
            sbp: nhisInfo.resBloodPressure.split('/')[0],
            dbp: nhisInfo.resBloodPressure.split('/')[1],
            glu: nhisInfo.resFastingBloodSuger,
            tc: nhisInfo.resTotalCholesterol,
            ldl: nhisInfo.resLDLCholesterol,
            hdl: nhisInfo.resHDLCholesterol,
            tg: nhisInfo.resTriglyceride,
            got: nhisInfo.resAST,
            gpt: nhisInfo.resALT,
            crea: nhisInfo.resSerumCreatinine,
            hb: nhisInfo.resHemoglobin
          }

          store.dispatch('checkup/setNhisData', data)
          store.dispatch('checkup/setHealthDataType', 'formal')
        } else {
          store.dispatch('checkup/setHealthDataType', 'direct')
        }
        store.dispatch('checkup/setBasicsId', checkupCommonInfo.basicsId)

        moveStep(checkupCommonInfo)
      } else {
        await checkupApi.deleteCheckup(checkupCommonInfo.id)
        router.push({ name: 'CheckupGuide' })
      }
    } else {
      router.push({ name: 'CheckupGuide' })
    }
  } catch (e) {
    console.error(e)
  }
}

const openPopOneTime = ref(false) /* 240119 일회성을 하겠냐?는 팝업 오프너 */
const isOneTime = ref(false) /* 240119 일회성을 할거면 true, 안할거면 false */
const openSharePopup = ref(false) /* 분석 결과 요약 공유 팝업 오프너 */
const selectedAnalysisItem = ref(null) /* 선택된 분석 결과 아이템 */



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
    // alert('사용가능한 마이웰니스 랩 쿠폰이 없어\n건강분석을 시작할 수 없습니다')
    openPopNoCoupon.value = true
    return
  }

  if (await confirmOneTime()) {
    store.dispatch('checkup/setAnalysisType', 'onetime')
    store.dispatch('checkup/setHealthDataType', 'direct')

    router.push({ name: 'CheckupSideTerms' })
  }
  return false
}

const moveDetailPage = (id) => {
  router.push({ path: '/analyze/detail' })
  store.dispatch('checkup/setAnalysisType', 'normal')
  store.dispatch('checkup/setResultId', id)
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
    const response = await analysisApi.getMyAnalysisCompleteDetail()
    
        const data = response.data?.logmeCompleteAnalysisMySimple || []

    if (data && data.length > 0) {
      myAnalysisCompleteList.value = data.map((item) => {
        return {
          ...item,
          hcrReference: [],
          // 체성분 입력 툴팁 제어
          showMuscleBalanceTooltip: true
        }
      })

      // 현재 일자
      const today = new Date()
      // 첫 번째 분석 일자
      const aDate = new Date(dateConvert(myAnalysisCompleteList.value[0].analysedDate, '-'))
      // 분석일에서 6개월 더한 일자
      const addSixMonth = new Date(new Date(aDate).setMonth(aDate.getMonth() + 6))
      // 분석일에서 12개월 더한 일자
      const addOneYear = new Date(new Date(aDate).setMonth(aDate.getMonth() + 12))
      
      if (today >= addSixMonth && today < addOneYear) {
        // 6개월 경과시
        motivationMessage.value = ref(t('Home.text2'))//'건강한 생활습관을 꾸준히 관리해주세요'
      } else if (today >= addOneYear) {
        // 12개월 경과시
         motivationMessage.value = ref(t('Home.text3')) //'새로운 웰니스 분석을 통해 변화되는 결과를 확인해보세요'
      }
    }
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
          <swiper
            :centered-slides="true"
            :space-between="10"
            :pagination="{
              clickable: true
            }"
            :navigation="true"
            :slidesPerView="1.2"
            :breakpoints="{
              '0': {
                slidesPerView: 1.2,
              },
              '520': {
                slidesPerView: 'auto'
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

                <!-- S : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
                <p class="home--medication">
                  {{ $t('Router.checkup.text21') }}: 
                  <span class="home--medication-detail">
                    <!-- to 개발 | 복약정보가 없을 경우 -->
                    <!-- {{ $t('CheckupMedication.text4') }} -->
                    
                    <!-- to 개발 | 복약정보가 있을 경우 -->
                    {{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}, {{ $t('CheckupMedication.text14') }}, {{ $t('CheckupMedication.text7') }}, {{ $t('CheckupMedication.text12') }}, {{ $t('CheckupMedication.text8') }}
                  </span>
                </p>
                <!-- E : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->

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
                          {{ getUpgradeDate(item.analysedDate) }} {{ $t('Home.text33') }}
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
                      <!--                    <span v-if="myAnalysisCompleteList.length > 0">다시</span>-->
                      <!--                    <span v-else>시작</span>-->
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
        <span>{{ $t('Home.text14') }}<br /><span>{{ $t('Home.text16') }}</span></span>
      </div>
    </template>

    <base-popup v-if="openPopNoCoupon" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('Home.text18') }}</p>
        <p class="color--gray space--top-small">※ {{ $t('Home.text19') }}</p>
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
        <div class="openPopContinue--close">
          <button
            @click="openPopContinue = false"
            type="button"
            aria-label="닫기"
            class="popup--close" />
        </div>
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

<style lang="scss" scoped>
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
  width: 40px;
  height: 40px;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 60%;
}
:deep(.swiper-button-prev, .swiper-button-next){
  top: var(--swiper-navigation-top-offset, 44%);
}
:deep(.swiper-button-next, .swiper-rtl .swiper-button-prev) {
  top: 50%;
  right: auto;
  left: calc(50% + 23rem);
  transform: translateY(-50%);
  margin-top: 0;
}
:deep(.swiper-button-prev, .swiper-rtl .swiper-button-next) {
  top: 50%;
  left: auto;
  right: calc(50% + 23rem);
  transform: translateY(-50%);
  margin-top: 0;
}
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  content: "";
  display: block;
  width: 40px;
  height: 40px;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 60%;
  transform: rotate(180deg);
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
