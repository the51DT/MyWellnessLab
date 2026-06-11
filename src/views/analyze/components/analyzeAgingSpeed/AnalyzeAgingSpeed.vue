<script setup>
import { ref, defineProps, computed, watch, onMounted, onBeforeUnmount, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BaseTooltip from '@/components/BaseTooltip.vue'
import AnalyzeAgingSpeedPop from './AnalyzeAgingSpeedPop.vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import { mwlRound, mwlRoundAgingRate, getColor } from '@/assets/js/common'

const { t, locale } = useI18n()
const router = useRouter()
const store = useStore()

// 게이지 애니메이션 속도(ms)
const GAUGE_ANIMATION_MS = 3000

const props = defineProps({
  isMain: {
    type: Boolean,
    default: false
  },
  isShare: {
    type: Boolean,
    default: false
  },
  sendData: Object,
  currentSection: {
    type: Number,
    default: undefined
  }
})

const echart = ref(null)
const myChart = ref(null)

const chartData = ref({
  score: 0, // 점수
  grade: '-', // 수준
  ages: 0, // 연령대 비교군
  comparisonGroup: 0, // 비교군 수
  ranking: 0 // 순위
})// API를 통해 가져올 데이터

const tooltip = ref(false) /* 툴팁 오프너 */
const tooltipEdge = ref(0) /* 툴팁 꼬다리 위치 */
const isPopupReason = ref(false) /* 팝업 오프너 */

const speedText = computed(() => {
  const status = props.sendData.hqAr?.status || 2

  switch (status) {
    case 1:
      return t('AnalyzeAgingSpeed.text40') // 저속 노화
    case 2:
      return t('AnalyzeAgingSpeed.text43') // 보통 노화
    case 3:
      return t('AnalyzeAgingSpeed.text44') // 고속 노화
    default:
      return t('AnalyzeAgingSpeed.text43') // 보통 노화
  }
})

/**
 * 툴팁 닫기
 */
function tooltipClose () {
  tooltip.value = false
}

/**
 * 툴팁 열기
 * @param {*} $event
 */
function openTooltip ($event) {
  tooltip.value = true
  tooltipEdge.value = $event.x
}

/**
 * 자세히 보기 이동
 */
function detailView () {
  const sectionToSave = props.currentSection !== undefined ? props.currentSection : 0
  store.dispatch('analyze/setCurrentSection', sectionToSave)
  
  // AnalyzeAgingSpeedDetail에서 실제로 사용하는 데이터만 추출
  const essentialData = {
    hqData: {
      AgingRate: mwlRoundAgingRate(props.sendData.hqAr?.aging_rate),  // hqAr에서 aging_rate 사용
      ReAge: props.sendData.hqReage?.reage         // hqReage에서 reage 사용
    },
    hqReference: props.sendData.hqReference,
    analyzeAge: props.sendData.analyzeAge,
    commonInfo: {
      analysisType: props.sendData.commonInfo?.analysisType
    },
    hqAr: props.sendData.hqAr,                    // hqAr 전체 데이터
    hqReage: props.sendData.hqReage,              // 건강나이 데이터
    ariRisk: props.sendData.ariRisk,              // 위험 요인 데이터
    hqDataList: props.sendData.hqDataList,        // 차트 데이터용 hqDataList 추가
    basics: props.sendData.basics                  // 성별 등 기본 정보 추가
  }
  
  store.dispatch('analyze/setDetail', essentialData)
  
  router.push({
    path: '/analyze/aging-speed'
  })
}

/**
 * 노화 속도 요인 팝업
 */
function popupReason () {
  isPopupReason.value = true
}

/**
 * 팝업 종료
 */
function popupClose () {
  isPopupReason.value = false
}

/**
 * 차트 생성
 */
function chartDraw () {
  myChart.value.setOption({
    // 애니메이션을 더 느리게
    animation: true,
    animationDuration: GAUGE_ANIMATION_MS,
    animationDurationUpdate: GAUGE_ANIMATION_MS,
    animationEasing: 'cubicOut',
    animationEasingUpdate: 'cubicOut',
    tooltip: {
      show: false,
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        radius: props.isShare? '100%' : '120%', 
        center: props.isShare? ['50%', '75%'] : ['50%', '60%'], 
        // startAngle: props.isMain ? 180 : 135,
        startAngle: 180,
        endAngle: 0,
        min: 0.5,
        max: 1.5,
        itemStyle: {
          color: '#008352'
        },
        splitNumber: 0,
        splitLine: {
          show: false,
          distance: -30,
          length: 40,
          lineStyle: {
            color: '#000',
            width: 1
          }
        },
        axisTick: {
          splitNumber: 1,
          length: 124.5
        },
        pointer: {
          icon: 'triangle',
          length: props.isShare ? '138%' : (props.isMain ? '118%' : '85%'),
          width: 20,
          showAbobe: true,
          itemStyle: {
            color: '#646464'
          }
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 15,
          color: '#646464',
          borderColor: '#646464',
          itemStyle: {
            borderWidth: 5,
            color: '#fff',
            borderColor: '#646464'
          }
        },
        axisLabel: { show: false },
        detail: { show: false },
        axisLine: {
          lineStyle: {
            width: 0,
            color: [
              [0.1, '#7ED47C'],
              [0.2, '#A2C87A'],
              [0.3, '#B4BD6D'],
              [0.4, '#C9B05E'],
              [0.5, '#DDA450'],
              [0.6, '#F8B500'],
              [0.7, '#F09B5A'],
              [0.8, '#FC754B'],
              [0.9, '#FA7458'],
              [1, '#F87D7D']
            ]
          }
        },
        data: [{ value: chartData.value.AgingRate }]
      }
    ]
  })
}

/**
 * 차트 데이터 저장
 */
function setChartData () {
  const agingRate = props.sendData.hqAr.aging_rate ? 
    mwlRoundAgingRate(props.sendData.hqAr.aging_rate) : '0.0'
  
  chartData.value = {
    ...props.sendData.hqAr,
    AgingRate: agingRate
  }
}

function getWorstList () {
  let rtnTxt
  const arr = []
  const worst = []
  let obj
  let ariRisk = null
  if (props.sendData.ariRisk) {
    ariRisk = props.sendData.ariRisk

    // WWI, FMR, RFS 제외하고 ariRisk 값이 2 or 3인 항목만 필터링
    for (const key in ariRisk) {
      if (key !== 'WWI' && key !== 'FMR' && key !== 'RFS' && ariRisk[key] >= 2) {
        obj = {}
        obj.key = key
        obj.val = ariRisk[key]
        worst.push(obj)
      }
    }

    // ariRisk 값이 높은 순으로 정렬
    worst.sort((a, b) => {
      if (a.val < b.val) return 1
      if (a.val > b.val) return -1
      return 0
    })

    worst.forEach((item, index) => {
      arr.push(titleObj[worst[index].key])
    })

    rtnTxt = arr.join(', ')
  }

  return rtnTxt
}

const titleObj = {
  SBP: t('AnalyzeAgingSpeed.text16'),
  DBP: t('AnalyzeAgingSpeed.text17'),
  WC: t('AnalyzeAgingSpeed.text18'),
  BMI: t('AnalyzeAgingSpeed.text19'),
  GLU: t('AnalyzeAgingSpeed.text20'),
  TG: t('AnalyzeAgingSpeed.text21'),
  TC: t('AnalyzeAgingSpeed.text22'),
  HDL: t('AnalyzeAgingSpeed.text23'),
  LDL: t('AnalyzeAgingSpeed.text24'),
  GOT: t('AnalyzeAgingSpeed.text25'),
  GPT: t('AnalyzeAgingSpeed.text26'),
  HB: t('AnalyzeAgingSpeed.text27'),
  CREA: t('AnalyzeAgingSpeed.text28'),
  smok_dur: t('AnalyzeAgingSpeed.text29'),
  pack_year: t('AnalyzeAgingSpeed.text30'),
  sleep_time: t('AnalyzeAgingSpeed.text31'),
  drink_amt: t('AnalyzeAgingSpeed.text32'),
  MET: t('AnalyzeAgingSpeed.text33'),
  EQ5D: t('AnalyzeAgingSpeed.text34'),
  per_bodyfat: t('AnalyzeAgingSpeed.text38'),
  WASM: t('AnalyzeAgingSpeed.text39')
}

watch(props, (val1, val2) => {
  setChartData()
  chartDraw()
})

let resizeObserver = null;

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        if (!myChart.value) {
          myChart.value = echarts.init(echart.value, null, { renderer: 'svg' })
          setChartData()
          chartDraw()
        } else {
          myChart.value.resize()
        }
      }
    }
  })

  resizeObserver.observe(echart.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div class="AnalyzeAgingSpeed" :class="{ 'home': isMain, 'isShare': isShare }"> <!--노화 억제 분석 지수--> <!--231208 메인용 동적 클래스 추가-->
    <div class="tooltip AnalyzeAgingSpeed--tooltip" v-if="!props.isMain">
      <h2 class="tooltip--tit AnalyzeAgingSpeed--tip-tit">{{ $t('AnalyzeAgingSpeed.text4') }}</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeAgingSpeed--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeAgingSpeed--tip-dom">
        <template v-slot:contents>
          <ul class="AnalyzeAgingSpeed--tip-txt">
            <li>{{ $t('AnalyzeAgingSpeed.text47') }}</li>
            <li>{{ $t('AnalyzeAgingSpeed.text6') }}</li>
            <li>{{ $t('AnalyzeAgingSpeed.text7') }}</li>
          </ul>
        </template>
      </base-tooltip>
    </div>

    <div class="analyze-box">
      <p class="AnalyzeAgingSpeed--info" v-if="!props.isMain"
        :class="{
         'red': props.sendData.hqAr?.status === 3,
          'orange': props.sendData.hqAr?.status === 2,
          'green': props.sendData.hqAr?.status === 1
        }">
        {{ $t('AnalyzeAgingSpeed.text8') }}
        <strong class="AnalyzeAgingSpeed--speed">
          {{ chartData.AgingRate }}{{ $t('AnalyzeAgingSpeed.text35') }}</strong>{{ $t('AnalyzeAgingSpeed.text36') }}
        <strong class="AnalyzeAgingSpeed--description">
          {{ speedText }}
        </strong>{{ $t('AnalyzeAgingSpeed.text41') }}
        {{ $t('AnalyzeAgingSpeed.text45') }}
        <!-- 건강 나이 적용 개발 요망 -->
        <strong class="AnalyzeAgingSpeed--speed black">{{ mwlRound(props.sendData?.hqReage?.reage || 0, 0) }}{{ $t('Common.age2') }}</strong>{{ $t('AnalyzeAgingSpeed.text46') }}
      </p>

      <div class="AnalyzeAgingSpeed--graph" :data-lang="$i18n.locale">
        <div class="echart gauge" :class="isMain ? 'isMain' : ''" ref="echart" />

        <div class="AnalyzeAgingSpeed--summary">
          <div class="AnalyzeAgingSpeed--rank-wrap"  :class="{
            'red': props.sendData.hqAr?.status === 3,
              'orange': props.sendData.hqAr?.status === 2,
              'green': props.sendData.hqAr?.status === 1
            }">
            <strong class="AnalyzeAgingSpeed--speed2">
              <!-- <span v-if="!isMain">x</span> -->
              {{ chartData.AgingRate }}
            </strong>
            <!-- <span v-if="isMain" class="AnalyzeAgingSpeed--speed3">{{ $t('AnalyzeAgingSpeed.text12') }}</span> -->
            <span class="AnalyzeAgingSpeed--speed3">{{ $t('AnalyzeAgingSpeed.text12') }}</span>
          </div>
          <button
            v-if="!props.isMain"
            @click="detailView"
            type="button"
            class="AnalyzeAgingSpeed--more-btn">{{ $t('Common.detail2') }}</button>
        </div>
      </div>

      <div v-if="!props.isMain" class="AnalyzeAgingSpeed--reason">
        <p class="AnalyzeAgingSpeed--reason-tit">{{ $t('AnalyzeAgingSpeed.text37') }}</p>
        <p class="AnalyzeAgingSpeed--reason-txt">
                   {{ getWorstList() }}
        </p>
        <div class="AnalyzeAgingSpeed--btn-wrap">
          <button @click="popupReason" type="button" class="AnalyzeAgingSpeed--btn">{{ $t('Common.detail2') }}</button>
        </div>
      </div>
    </div>

    <AnalyzeAgingSpeedPop :openPop="isPopupReason" :sendData="props.sendData" @popupClose="popupClose" />
  </div>
</template>

<style scoped lang="scss">
.echart.gauge {
  width: 100%;
  height: 100%;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &.isMain {
    width: 100%;
    height: 100%;
  }
}

::v-deep(.echart div) {
  //bottom: -11.5px;
  overflow: visible !important;
  & svg {
    overflow: visible;
    
  }
}

// ::v-deep(.home .echart div) {
//   margin-top: -2.6rem;
// }
</style>
