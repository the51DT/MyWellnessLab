<script setup>
import { onMounted, ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BaseTooltip from '@/components/BaseTooltip.vue'
import * as echarts from 'echarts'
import { useCommonForm } from '@/utils/commonForm'
import { mwlRound, getScoreStatus } from '@/assets/js/common'

import { useI18n } from 'vue-i18n'
import BasePopup from '@/components/BasePopup.vue'

const { AGING_ANALYSIS_FORM, DISEASE_ANALYSIS_FORM } = useCommonForm()
const { t, locale } = useI18n()
const store = useStore()
const router = useRouter()

const props = defineProps({
  compId: String,
  title: String,
  sendData: Object,
  currentSection: Number,
  refreshTrigger: Number
})

const emit = defineEmits(['openDietGuide', 'openExerciseGuide', 'openSleepGuide', 'showNoDataPopup', 'openBodyCompositionPopup'])

// 일회성 검사인지 확인
const isOneTimeAnalysis = computed(() => {
  return props.sendData?.commonInfo?.analysisType === 'onetime'
})

const echart = ref(null)
const myChart = ref(null)
const widthValue = ref(4) // 차트 스코어 바 너비
const tooltip = ref(false) // 툴팁 온오프 변수
const tooltipEdge = ref(0)
const tooltipButton = ref(null) // 물음표 버튼 참조

const gradeIndex = computed(() => {
  let status = 0

  switch (props.compId) {
    case 'AnalyzeAgingInhibitionAnalyzeIndex':
      // 노화 억제 분석지수
      status = props.sendData.hqOxi?.status || 0
      break
    case 'AnalyzeChronicDiseaseControlAnalyzeIndex':
      // 만성질환 억제 분석지수
      status = props.sendData.hqMet?.status || 0
      break
    case 'AnalyzeMuscleBalanceAnalyzeIndex':
      // 근육밸런스 분석지수
      status = props.sendData.hqMusBal?.status || 0
      break
    case 'AnalyzeDietIndex':
      // 식사는 getScoreStatus 함수를 사용해서 status 계산
      const dietScore = props.sendData.dqData?.RFS_score || 0 
      status = getScoreStatus(dietScore, 'rfs')
      break
    case 'AnalyzeExerciseIndex':
      const exerciseScore = props.sendData.metData?.met || 0
      status = getScoreStatus(exerciseScore, 'musMass')
      break
    case 'AnalyzeSleepIndex':
      // 수면은 getScoreStatus 함수를 사용해서 status 계산
      const sleepScore = props.sendData.shData?.sh_score || 0
      status = getScoreStatus(sleepScore, 'sh')
      break
    default:
      return new Error('compId Error !!')
  }

  return status
})

const color = computed(() => {
  switch (gradeIndex.value) {
    case 1:
      return '#5ab651'
    case 2:
      return '#f8b500'
    case 3:
      return '#e95371'
    default:
      return ''
  }
})

const gradeText = computed(() => {
  switch (gradeIndex.value) {
    case 1:
      return t('AnalyzeInhibitionAnalysisIndex.text1')
    case 2:
      return t('AnalyzeInhibitionAnalysisIndex.text2')
    case 3:
      return t('AnalyzeInhibitionAnalysisIndex.text3')
    default:
      return '-'
  }
})

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

// 툴팁 리스트 메시지를 동적으로 생성하는 computed 속성
const tooltipList = computed(() => {
  const list = []
  
  switch (props.compId) {
    case 'AnalyzeAgingInhibitionAnalyzeIndex':
      list.push(t('AnalyzeInhibitionAnalysisIndex.text4'))
      list.push(t('AnalyzeInhibitionAnalysisIndex.text18'))
      break
    case 'AnalyzeChronicDiseaseControlAnalyzeIndex':
      list.push(t('AnalyzeInhibitionAnalysisIndex.text5'))
      list.push(t('AnalyzeInhibitionAnalysisIndex.text19'))
      break
    case 'AnalyzeMuscleBalanceAnalyzeIndex':
      list.push(t('AnalyzeInhibitionAnalysisIndex.text13'))
      list.push(t('AnalyzeInhibitionAnalysisIndex.text20'))
      break
    case 'AnalyzeDietIndex':
      list.push(t('AnalyzeInhibitionAnalysisIndex.text14'))
      list.push(t('AnalyzeInhibitionAnalysisIndex.text21'))
      break
    case 'AnalyzeExerciseIndex':
      list.push(t('AnalyzeInhibitionAnalysisIndex.text15'))
      list.push(t('AnalyzeInhibitionAnalysisIndex.text22'))
      break
    case 'AnalyzeSleepIndex':
      list.push(t('AnalyzeInhibitionAnalysisIndex.text16'))
      break
  }
  
  return list
})

const chartData = computed(() => {

  const obj = {
    score: 0,
    ages: 0,
    comparisonGroup: 100,
    ranking: 0
  }

  if (props.sendData) {
    obj.ages = parseInt(props.sendData.analyzeAge / 10) * 10
    if (obj.ages < 20) obj.ages = 20
    if (obj.ages > 80) obj.ages = 80

    switch (props.compId) {
      case 'AnalyzeAgingInhibitionAnalyzeIndex':
        obj.score = mwlRound(props.sendData.hqOxi?.score || 0, 0)
        obj.rank = props.sendData.hqOxi?.percent || 0
        break
      case 'AnalyzeChronicDiseaseControlAnalyzeIndex':
        obj.score = mwlRound(props.sendData.hqMet?.score || 0, 0)
        obj.rank = props.sendData.hqMet?.percent || 0
        break
      case 'AnalyzeMuscleBalanceAnalyzeIndex':
        // hqMusBal이 null이거나 undefined인 경우 안전하게 처리
        if (props.sendData.hqMusBal) {
          obj.score = mwlRound(props.sendData.hqMusBal.score || 0, 0)
          obj.rank = props.sendData.hqMusBal.percent || 0
        } else {
          obj.score = 0
          obj.rank = 0
        }
        break
      case 'AnalyzeDietIndex':
        obj.score = mwlRound(props.sendData.dqData?.RFS_score || 0 , 0)
        obj.rank = 0 // 식사는 점수만 있음
        break
      case 'AnalyzeExerciseIndex':
        obj.score = mwlRound(props.sendData.metData?.met || 0, 0) 
        obj.rank = 0
        break
      case 'AnalyzeSleepIndex':
        obj.score = mwlRound(props.sendData.shData?.sh_score || 0, 0)
        obj.rank = 0 // 수면은 점수만 있음
        break
    }
  }

  return obj
})

const gender = computed(() => {
  return props.sendData?.basics?.sex === 1 ? t('Common.male') : t('Common.female')
})

// 클래스 이름을 동적으로 생성하는 computed 속성(컴포넌트 별로 스타일이 다르다면 추후 지정 후 삭제)
const componentClass = computed(() => {
  if (props.compId === 'AnalyzeAgingInhibitionAnalyzeIndex') {
    return 'AnalyzeAgingInhibitionAnalyzeIndex'
  } else {
    return 'AnalyzeChronicDiseaseControlAnalyzeIndex'
  }
})

// 식사, 운동, 수면 분석의 경우 다른 문구를 사용하기 위한 computed 속성 (나중에 문구 Fix되면 다국어처리 필요)
const infoText = computed(() => {
  if (props.compId === 'AnalyzeDietIndex') {
    return t('AnalyzeScorecomAnalyzeIndex.dietText', {
      score: chartData.value?.score || 0,
      class: componentClass.value,
      color: color.value,
      grade: gradeText.value
    })
  } else if (props.compId === 'AnalyzeExerciseIndex') {
    return t('AnalyzeScorecomAnalyzeIndex.exerciseText', {
      class: componentClass.value,
      color: color.value,
      grade: gradeText.value
    })
  } else if (props.compId === 'AnalyzeSleepIndex') {
    return t('AnalyzeScorecomAnalyzeIndex.sleepText', {
      score: chartData.value?.score || 0,
      class: componentClass.value,
      color: color.value,
      grade: gradeText.value
    })
  } else {
    return `${t('AnalyzeInhibitionAnalysisIndex.text12')} <strong :class="componentClass + '--grade'" :style="{color: color}">${gradeText.value}</strong>${t('AnalyzeInhibitionAnalysisIndex.text9')} ${chartData.value?.ages || 0}${t('Common.age')} ${gender.value} 100${t('Common.people')} <strong :class="componentClass + '--score'">${chartData.value?.rank || 0}${t('Common.rank')}</strong> ${t('AnalyzeAgingInhibitionAnalyzeIndex.text5')}`
  }
})

// 가이드 버튼 텍스트를 동적으로 생성하는 computed 속성
const guideButtonText = computed(() => {
  switch (props.compId) {
    case 'AnalyzeDietIndex':
      return t('AnalyzeScorecomAnalyzeIndex.dietGuide')
    case 'AnalyzeExerciseIndex':
      return t('AnalyzeScorecomAnalyzeIndex.exerciseGuide')
    case 'AnalyzeSleepIndex':
      return t('AnalyzeScorecomAnalyzeIndex.sleepGuide')
    default:
      return '' // 다른 3개는 빈칸
  }
})

// 상태 텍스트를 동적으로 생성하는 computed 속성
const statusText = computed(() => {
  switch (gradeIndex.value) {
    case 1:
      return t('Common.good')
    case 2:
      return t('Common.manage')
    case 3:
      return t('Common.warning')
    default:
      return ''
  }
})

// 근육 밸런스 체성분 입력 툴팁
const showMuscleBalanceTooltip = ref(true)

function closeMuscleBalanceTooltip () {
  showMuscleBalanceTooltip.value = false
}

/**
 *  툴팁 닫기
 */
function tooltipClose () {
  tooltip.value = false
  tooltipButton.value = null
}

/**
 * 가이드 팝업 열기
 */
function openGuide () {
  switch (props.compId) {
    case 'AnalyzeDietIndex':
      emit('openDietGuide')
      break
    case 'AnalyzeExerciseIndex':
      // hqMusMass 데이터 체크
      if (!props.sendData?.hqMusMass?.exerciseData || 
          props.sendData.hqMusMass.exerciseData.length === 0) {
        emit('showNoDataPopup')
        return
      }
      emit('openExerciseGuide')
      break
    case 'AnalyzeSleepIndex':
      emit('openSleepGuide')
      break
  }
}

/**
 * 툴팁 위치 계산
 */
function calculateTooltipPosition () {
  if (!tooltipButton.value) return
  
  const buttonRect = tooltipButton.value.getBoundingClientRect()
  const tooltipContainer = tooltipButton.value.closest('.tooltip')
  
  if (!tooltipContainer) return
  
  const containerRect = tooltipContainer.getBoundingClientRect()
  
  // 컨테이너 기준으로 물음표 버튼 중앙 위치 계산
  const buttonCenterX = buttonRect.left + buttonRect.width / 2 - containerRect.left
  
  tooltipEdge.value = buttonCenterX - 10
}

/**
 * 툴팁 열기
 * @param {*} event
 */
function openTooltip (event) {
  tooltip.value = true
  tooltipButton.value = event.target
  
  // 다음 틱에서 툴팁 위치 계산 (DOM 업데이트 후)
  nextTick(() => {
    calculateTooltipPosition()
  })
}

/**
 * 윈도우 리사이즈 핸들러 (디바운스 적용)
 */
let resizeTimeout = null
function handleResize () {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  
  resizeTimeout = setTimeout(() => {
    if (tooltip.value) {
      calculateTooltipPosition()
    }
  }, 100)
}

/**
 * orientation change 핸들러
 */
function handleOrientationChange () {
  setTimeout(() => {
    if (tooltip.value) {
      calculateTooltipPosition()
    }
  }, 500) // orientation change 후 레이아웃 안정화 대기
}

/**
 * 강제 위치 재계산 (개발자 도구 모드 변경 감지)
 */
function forceRecalculate () {
  if (tooltip.value) {
    setTimeout(() => {
      calculateTooltipPosition()
    }, 200)
  }
}

/**
 * MutationObserver로 DOM 변화 감지
 */
let observer = null
function setupObserver () {
  if (typeof window !== 'undefined' && window.MutationObserver) {
    observer = new MutationObserver(() => {
      forceRecalculate()
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    })
  }
}

/**
 * 상세 페이지 이동
 */
const moveDetail = () => {
  store.dispatch('analyze/setInhibitionAnalysisDetail', {
    compId: props.compId,
    ...props.sendData
  })

  let routerName = null

  switch (props.compId) {
    case 'AnalyzeAgingInhibitionAnalyzeIndex':
      routerName = 'AnalyzeAging'
      break
    case 'AnalyzeChronicDiseaseControlAnalyzeIndex':
      routerName = 'AnalyzeChronicDisease'
      break
    case 'AnalyzeMuscleBalanceAnalyzeIndex':
      routerName = 'AnalyzeMuscleBalance'
      break
    case 'AnalyzeDietIndex':
      routerName = 'AnalyzeDiet'
      break
    case 'AnalyzeExerciseIndex':
      routerName = 'AnalyzeExercise'
      break
    case 'AnalyzeSleepIndex':
      routerName = 'AnalyzeSleep'
      break
  }

  if (routerName) {
    // 현재 섹션 정보를 store에 저장
    if (props.currentSection !== undefined) {
      store.dispatch('analyze/setCurrentSection', props.currentSection)
    }
    router.push({ name: routerName })
  }
}

/**
 * 체성분 팝업 열기
 */
const openBodyCompositionPopup = () => {
  emit('openBodyCompositionPopup', {
    analysisId: props.sendData.id,
    basicsId: props.sendData.basics.id
  })
}

/**
 * 차트 생성
 */
function chartDraw () {
  try {
    if (!myChart.value) {
      console.warn('Chart not initialized')
      return
    }
    
    myChart.value.setOption({
    series: [
      {
        z: 3,
        type: 'gauge',
        animation: true,
        // startAngle: 84,
        // endAngle: 93,
        startAngle: 90,
        endAngle: 95,
        min: 0,
        max: props.compId === 'AnalyzeExerciseIndex' ? 
          ((chartData.value?.score || 0) >= 600 ? (chartData.value?.score || 0) : 600) : 100,
        radius: '92%',
        splitNumber: 12,
        itemStyle: {
          color: '#fff'
        },
        progress: {
          show: true,
          roundCap: true,
          width: widthValue.value,
          itemStyle: {
            borderWidth: widthValue.value * 1.1,
            borderColor: color.value,
            cursor: 'default'
          }
        },
        pointer: {
          // show: (chartData.value?.score || 0) > 0, // 0점일 때는 포인터 숨기기
          // icon: 'circle',
          // length: '197%',
          // width: widthValue.value * 4,
          // offsetCenter: ['7%', '0%'],
          // itemStyle: {
          //   borderWidth: widthValue.value * 2,
          //   borderColor: color.value
          // }
          show: false
        },
        axisLine: {
          show: false,
          roundCap: true,
          lineStyle: {
            width: widthValue,
            color: [[1, '#EFEFEF']],
            shadowColor: 'red',
            shadowBlur: -100
          }
        },
        axisTick: {
          show: false,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          show: false,
          length: 12,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 30,
          color: '#999',
          fontSize: 20
        },
        title: {
          show: false
        },
        label: { show: false },
        detail: {
          show: false,
          backgroundColor: '#fff',
          borderColor: '#999',
          borderWidth: 2,
          width: '60%',
          lineHeight: 40,
          height: 40,
          borderRadius: 8,
          offsetCenter: [0, '35%'],
          valueAnimation: true,
          formatter: function (value) {
            return '{value|' + value.toFixed(0) + '}{unit|명}'
          },
          rich: {
            value: {
              fontSize: 50,
              fontWeight: 'bolder',
              color: '#777'
            },
            unit: {
              fontSize: 20,
              color: '#999',
              padding: [0, 0, -20, 10]
            }
          }
        },
        data: [{ value: chartData.value?.score || 0 }]
      }
    ]
  })
  
  // 차트 커서 설정
  setTimeout(() => setChartCursor(), 100)
  } catch (error) {
    console.error('Chart draw error:', error)
  }
}

watch(props, (val1, val2) => {
  try {
    chartDraw()
  } catch (error) {
    console.error('Chart update error:', error)
  }
})

// 근육밸런스만 새로고침 트리거 감지 - 강제 리렌더링
watch(() => props.refreshTrigger, (newTrigger) => {
  if (props.compId === 'AnalyzeMuscleBalanceAnalyzeIndex' && newTrigger > 0) {
    setTimeout(() => {
      // 차트 완전히 제거하고 다시 생성
      if (myChart.value) {
        myChart.value.dispose()
        myChart.value = null
      }
      // DOM도 강제로 비우고 다시 생성
      if (echart.value) {
        echart.value.innerHTML = ''
      }
      // 새로 차트 생성
      myChart.value = echarts.init(echart.value, null, {})
      chartDraw()
    }, 300)
  }
})

// 툴팁 상태 변경 감지해서 위치 재계산
watch(tooltip, (newValue) => {
  if (newValue && tooltipButton.value) {
    // 툴팁이 열릴 때 약간의 지연 후 위치 재계산
    setTimeout(() => {
      calculateTooltipPosition()
    }, 50)
  }
})

onMounted(() => {
  try {
    myChart.value = echarts.init(echart.value, null, {})
    chartDraw()
    
    // 차트 커서 설정
    setTimeout(() => setChartCursor(), 100)
    
    // 다양한 화면 변경 감지 리스너들 추가
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    // MutationObserver 설정 (개발자 도구 모드 변경 감지)
    setupObserver()
    
    // 페이지 visibility 변경 감지 (개발자 도구 켜졌을 때)
    document.addEventListener('visibilitychange', forceRecalculate)
    
  } catch (error) {
    console.error('Chart initialization error:', error)
  }
})

onBeforeUnmount(() => {
  // 모든 리스너 제거
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleOrientationChange)
  document.removeEventListener('visibilitychange', forceRecalculate)
  
  // MutationObserver 해제
  if (observer) {
    observer.disconnect()
    observer = null
  }
  
  // timeout 정리
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})

// WHO 권장 위치 계산
const getWhoCirclePosition = () => {
  const userScore = chartData.value?.score || 0
  const chartMax = userScore >= 600 ? userScore : 600
  
  // 600이 전체에서 차지하는 비율 (0~1)
  const ratio = 600 / chartMax
  
  // 12시 방향(0도)에서 시작, 시계방향으로 회전
  // 0% = 12시(0도), 25% = 3시(90도), 50% = 6시(180도), 75% = 9시(270도)
  const angle = ratio * 358
  
  const radius = 124 // 차트 반지름
  const x = Math.sin(angle * Math.PI / 180) * radius  // sin: 12시 기준 x좌표
  const y = -Math.cos(angle * Math.PI / 180) * radius // -cos: 12시 기준 y좌표
  
  return {
    position: 'absolute',
    left: `calc(50% + ${x}px)`, // offsetCenter ['7%', '0%'] 반영
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)'
  }
}

// 포인터 위치 계산
const getPointerPosition = () => {
  const userScore = chartData.value?.score || 0
  const chartMax = props.compId === 'AnalyzeExerciseIndex' ? 
    (userScore >= 600 ? userScore : 600) : 100
  
  // 현재 점수가 전체에서 차지하는 비율 (0~1)
  const ratio = userScore / chartMax
  
  // 12시 방향에서 시작해서 시계방향으로 60도까지 회전
  const angle = ratio * 360
  
  const radius = 121 // 차트 반지름
  const x = Math.sin(angle * Math.PI / 180) * radius
  const y = -Math.cos(angle * Math.PI / 180) * radius
  
  return {
    position: 'absolute',
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)',
    zIndex: 100
  }
}

// 차트 커서를 기본값으로 설정
const setChartCursor = () => {
  if (echart.value) {
    const canvas = echart.value.querySelector('canvas')
    if (canvas) {
      canvas.style.cursor = 'default'
    }
  }
}

</script>

<template>
  <div :class="componentClass"> <!--노화 억제 분석 지수-->
    <div class="tooltip" :class="componentClass + '--tooltip'">
      <h2 class="tooltip--tit" :class="componentClass + '--tip-tit'">{{ props.title }} 
        <!-- {{ $t('AnalyzeInhibitionAnalysisIndex.text6') }} -->
      </h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip"
        :class="componentClass + '--tip-btn'"
        type="button"
        title="도움말" />

      <!-- 커스텀 툴팁 (BaseTooltip 대신 사용) -->
      <div v-if="tooltip" class="tooltip--wrap" :class="componentClass + '--tip-dom'">
        <div class="tooltip--contents">
          <div class="tooltip--edge" :style="{ left: tooltipEdge + 'px' }" />
            <ul>
              <li v-for="(item, index) in tooltipList" :key="index">{{ item }}</li>
            </ul>
        </div>
        <div class="tooltip--close">
          <button @click="tooltipClose" type="button" aria-label="닫기" />
        </div>
      </div>

    </div>
    <div class="analyze-box">
      <p :class="componentClass + '--info'" v-if="props.compId === 'AnalyzeDietIndex' || props.compId === 'AnalyzeExerciseIndex' || props.compId === 'AnalyzeSleepIndex'" v-html="infoText"></p>
      <p :class="componentClass + '--info'" v-else-if="props.compId === 'AnalyzeMuscleBalanceAnalyzeIndex' && !props.sendData.hqMusBal">
        {{ $t('AnalyzeScorecomAnalyzeIndex.noMuscleBalanceData') }}
      </p>
      <p :class="componentClass + '--info'" v-else>
        {{ $t('AnalyzeInhibitionAnalysisIndex.text12') }}
        <strong :class="componentClass + '--grade'" :style="{color: color}">{{ gradeText }}</strong>{{ $t('AnalyzeInhibitionAnalysisIndex.text9') }}<br />
        {{chartData?.ages || 0}}{{ $t('Common.age') }} {{ gender }}
        100{{ $t('Common.people') }}
        {{ chartData?.rank || 0 }}{{ $t('Common.rank') }}
        {{ $t('AnalyzeAgingInhibitionAnalyzeIndex.text5') }}
      </p>

      <!-- case A-1: 원형 그래프 안 데이터 있을 때 -->
      <div v-if="!(props.compId === 'AnalyzeMuscleBalanceAnalyzeIndex' && !props.sendData.hqMusBal)" :class="componentClass + '--graph'"> <!--그래프-->

        <div class="echart scoreCom" ref="echart" />

        <div :class="componentClass + '--summary'" :style="{borderColor: color}">
          <div :class="componentClass + '--rank-wrap'">
            <div :class="componentClass + '--score-wrap'">

                <!-- case B-1: '~ 분석 지수, 식사, 수면' 원형 콘텐츠 -->
               <span v-if="props.compId !== 'AnalyzeExerciseIndex'" :class="componentClass + '--state'" :style="{color: color}">{{ statusText }}</span>
               <div v-if="props.compId !== 'AnalyzeExerciseIndex'" :class="componentClass + '--num-wrap'">
                 <strong :class="componentClass + '--sum-score'" :style="{color: color}">{{ chartData?.score || 0 }}</strong>
                 <span>{{ $t('Common.score') }}</span>
               </div>
             
                <!-- case B-2: 운동 원형 콘텐츠 -->
                <div v-if="props.compId === 'AnalyzeExerciseIndex'" :class="componentClass + '--num-wrap'">
                  <span :class="componentClass + '--state'" :style="{color: color}">{{ statusText }}</span>
                  <strong :class="componentClass + '--sum-score'" :style="{color: color}">{{ chartData?.score || 0 }}</strong>
                  <span>MET</span>
                </div>

                <!-- 600 이하일 때 'Who 권장 600' 표시 -->
                <span v-if="props.compId === 'AnalyzeExerciseIndex' && (chartData?.score || 0) < 600" :class="componentClass + '--who'">
                  <span>600</span> {{ $t('AnalyzeScorecomAnalyzeIndex.whoRecommended') }}
                </span>
               
                <!-- 커스텀 포인터 -->
                <div 
                  v-if="(chartData?.score || 0) > 0"
                  :style="getPointerPosition()"
                  :class="'custom-pointer-border'"
                >
                </div>
                
                <!-- 600 이상일 때 600 지점에 'who 권장' 표시 -->
                <span
                  v-if="props.compId === 'AnalyzeExerciseIndex' && (chartData?.score || 0) >= 600"
                  :class="componentClass + '--who-circle'"
                  :style="getWhoCirclePosition()"
                  v-html="$t('AnalyzeScorecomAnalyzeIndex.whoRecommendedCircle')">
                </span>
            </div>
            <button @click="moveDetail" type="button" :class="componentClass + '--more-btn'">{{ $t('Common.detail2') }}</button>
          </div>
        </div>
      </div>
      
      <!-- case A-2: 근육 밸런스 분석 지수 데이터 없을 때, 만료일 때 -->
      <div v-if="props.compId === 'AnalyzeMuscleBalanceAnalyzeIndex' && !props.sendData.hqMusBal" class="analyze-box analyze-box--no-data">
        <!-- 근육 밸런스 분석 지수 데이터 없을 때 -->
        <div v-if="!isUpgradeExpired(props.sendData.analysedDate)">
          <div class="analyze-box--no-data-circle" @click="openBodyCompositionPopup">
            <img src="/img/ic_add.svg" alt="추가하기">
          </div>
          
          <div class="analyze-box--no-data-tooltip tooltip-top-arrow" v-if="showMuscleBalanceTooltip" @click="closeMuscleBalanceTooltip">
            <div class="tooltip-text">
              <div v-html="$t('AnalyzeScorecomAnalyzeIndex.bodyCompositionUpgrade')"></div>
              <span v-if="!isOneTimeAnalysis"><strong>{{ getUpgradeDate(props.sendData.analysedDate) }}</strong> {{ $t('Home.text33') }}</span>
            </div>
            <div class="tooltip-icon">
              <img src="/img/btn-close.svg" alt="툴팁 닫기" @click="closeMuscleBalanceTooltip">
            </div>
          </div>
        </div>

        <!-- 근육 밸런스 분석 지수 데이터 만료일 때 -->
        <div v-else class="analyze-box--no-data-circle expiration">
          {{ $t('Common.expired') }}
        </div>
      </div>
        
      <!-- 식사, 운동, 수면 가이드 버튼 -->
      <button v-if="guideButtonText" @click="openGuide" type="button" :class="componentClass + '--guide-btn'">{{ guideButtonText }}</button>
    </div>
  </div>
</template>

<style scoped>
/* 커스텀 포인터 */
.custom-pointer-border {
  border: 8px solid v-bind(color);
  width: 2.6rem; 
  height: 2.6rem; 
  background-color: #ffffff; 
  border-radius: 50%; 
  box-sizing: border-box;
}

.echart.scoreCom {
  /* 변경필요 */
  margin: 1rem auto 0;
  width: 26.8rem;
  height: 26.8rem;
  @media (max-width: 350px) {
    width: 26rem;
    height: 26rem;
  }
  @media (min-width: 960px) {
    margin-top: 1.6rem;
  }
}
</style>
