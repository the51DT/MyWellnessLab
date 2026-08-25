<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { dateConvert } from '@/assets/js/common'

const { t } = useI18n()
const router = useRouter()
const store = useStore()

const rawProps = defineProps({
  sendData: {
    type: Object,
    default: null
  },
  currentSection: {
    type: Number,
    default: undefined
  }
})

/* [s] 퍼블 확인용 - 이미지 기준 임시 데이터 */
const publishingSendData = {
  name: '차동희',
  connectType: 'BODYKEY',
  commonInfo: {
    analysedDate: '2026-10-25',
    analysisType: 'normal',
    analysisName: ''
  },
  basics: {
    healthDataType: 'direct'
  },
  hqAr: {
    aging_rate: 0.72,
    status: 1
  },
  hqReage: {
    reage: 35
  },
  hqOxi: {
    score: 85,
    status: 1
  },
  hqMet: {
    score: 80,
    status: 1
  },
  hqMusBal: {
    score: 70,
    status: 2
  },
  hqData: {
    AgingRate: 0.72
  },
  healthTrafficLight: {
    good: 4,
    manage: 1,
    warning: 1
  }
}
/* [e] 퍼블 확인용 - 이미지 기준 임시 데이터 */

/* [s] 퍼블 확인용 - template 수정 없이 props.sendData null 방지 */
const viewData = computed(() => {
  const data = rawProps.sendData || {}

  return {
    ...publishingSendData,
    ...data,
    commonInfo: {
      ...publishingSendData.commonInfo,
      ...(data.commonInfo || {})
    },
    basics: {
      ...publishingSendData.basics,
      ...(data.basics || {})
    },
    hqAr: {
      ...publishingSendData.hqAr,
      ...(data.hqAr || {})
    },
    hqReage: {
      ...publishingSendData.hqReage,
      ...(data.hqReage || {})
    },
    hqOxi: {
      ...publishingSendData.hqOxi,
      ...(data.hqOxi || {})
    },
    hqMet: {
      ...publishingSendData.hqMet,
      ...(data.hqMet || {})
    },
    hqMusBal: {
      ...publishingSendData.hqMusBal,
      ...(data.hqMusBal || {})
    },
    hqData: {
      ...publishingSendData.hqData,
      ...(data.hqData || {})
    },
    healthTrafficLight: {
      ...publishingSendData.healthTrafficLight,
      ...(data.healthTrafficLight || {})
    }
  }
})

const props = computed(() => {
  return {
    ...rawProps,
    sendData: viewData.value
  }
})
/* [e] 퍼블 확인용 - template 수정 없이 props.sendData null 방지 */

const analysedDate = computed(() => {
  return dateConvert(props.value.sendData.commonInfo.analysedDate, '.')
})

const type = computed(() => {
  let txt = ''

  if (props.value.sendData.commonInfo.analysisName !== undefined) {
    txt = props.value.sendData.commonInfo.analysisName
  }

  return txt
})

const source = computed(() => {
  let txt = t('AnalyzeCheckupData.directInput')
  
  if (props.value.sendData.basics && props.value.sendData.commonInfo.analysisType !== 'onetime') {
    if (props.value.sendData.basics.healthDataType === 'direct') {
      txt = t('AnalyzeCheckupData.directInput')
    } else if (props.value.sendData.basics.healthDataType === 'formal') {
      txt = t('AnalyzeCheckupData.formalInput')
    }
  }
  
  return txt
})

/* [s] 퍼블 확인용 - 이미지 기준 분석 요약 문구 */
const agingRate = computed(() => {
  return props.value.sendData.hqAr?.aging_rate || 0.72
})

const agingSpeedStatus = computed(() => {
  return {
    text: '저속노화',
    class: 'good'
  }
})

const agingSpeedClassForAnalyze = computed(() => {
  return 'good'
})

const healthLocationStatus = computed(() => {
  return {
    text: '좋은',
    class: 'good'
  }
})

const healthTrafficLight = computed(() => {
  return {
    good: props.value.sendData.healthTrafficLight?.good || 4,
    manage: props.value.sendData.healthTrafficLight?.manage || 1,
    warning: props.value.sendData.healthTrafficLight?.warning || 1
  }
})
/* [e] 퍼블 확인용 - 이미지 기준 분석 요약 문구 */

const safeCurrentSection = computed(() => {
  const section = rawProps.currentSection
  
  if (section === undefined || section === null) {
    return 0
  }
  
  const numSection = Number(section)

  return isNaN(numSection) ? 0 : numSection
})

function goToDataRecord () {
  const sectionToSave = safeCurrentSection.value

  store.dispatch('analyze/setCurrentSection', sectionToSave)
  store.dispatch('analyze/setAnalysisSendData', props.value.sendData)
  router.push({ name: 'AnalyzeCheckupDataRecord' })
}
</script>

<template>
  <div class="AnalyzePreface"> <!--개요-->
    <div class="AnalyzePreface--info">
      <div
        v-if="props.sendData.name && props.sendData.commonInfo.analysisType == 'normal'"
        class="AnalyzePreface--name-wrap">
        <strong class="AnalyzePreface--name">{{ props.sendData.name }}</strong>{{ $t('Common.name2')}}
      </div>
      <div v-else class="AnalyzePreface--one">{{ type }} {{ $t('AnalyzeCheckupData.text3')}}</div>
      <p>
      <span class="AnalyzePreface--ment">{{ $t('AnalyzeCheckupData.text1')}}</span>
      </p>
    </div>
    <div class="AnalyzePreface--con">
      <div class="AnalyzePreface--detail">
        {{ $t('AnalyzeCheckupData.text4')}}<span class="AnalyzePreface--date">{{ analysedDate }}</span> <br /> <!-- 2606 분석일 ':' 삭제 -->
        <!-- {{ $t('AnalyzeCheckupData.text4')}} : <span class="AnalyzePreface--date">{{ analysedDate }}</span> <br /> -->
      </div>
      <div class="AnalyzePreface--detail-view">
        <div class="AnalyzePreface--detail-data">
          <span class="AnalyzePreface--data">{{ $t('AnalyzeCheckupData.text6')}} {{ source }}</span>
          <span v-if="props.sendData.connectType" class="text-line">|</span>
          <!-- 추후 적용 (직접 입력, 바디키 입력, myWellnessLAB)  -->
          <span v-if="props.sendData.connectType" class="AnalyzePreface--data">
            {{ $t('AnalyzeCheckupData.text7')}}
            {{
              props.sendData.connectType === 'INBODY' ? 'myWellnessLAB' :
              props.sendData.connectType === 'CUSTOM' ? $t('AnalyzeCheckupData.directInput') :
              props.sendData.connectType === 'BODYKEY' ? $t('AnalyzeCheckupData.bodykeyInput') : ''
            }}
          </span>
        </div>
        <div class="AnalyzePreface--detail-btn">
          <button @click="goToDataRecord" type="button" class="AnalyzePreface--btn">{{ $t('Common.detail2')}}</button>
        </div>
      </div>
    </div>

    <!-- [s] 2606 라이브 버전에 맞춰서 안내 문구 삭제 -->
    <!-- S: 20260402 ASB-13836 결과 화면 안내 문구 추가 -->
    <!-- to 개발 | 영문일 때만 추가 -->
    <!-- <p class="AnalyzePreface--notice" v-html="$t('AnalyzeCheckupData.text8')"></p> -->
    <!-- E: 20260402 ASB-13836 결과 화면 안내 문구 추가 -->
    <!-- [e] 2606 라이브 버전에 맞춰서 안내 문구 삭제 -->
    <div class="AnalyzePreface--analyze">
      <p class="AnalyzePreface--analyze--text">
        <!-- 노화속도 -->
        {{ $t('AnalyzeDetail.text2')}}
        <span :class="agingSpeedClassForAnalyze">{{ agingRate }}{{ $t('AnalyzeAgingSpeed.text12')}},
        {{ agingSpeedStatus.text }}</span>{{ $t('AnalyzeAgingSpeed.text41')}},<br />
        <!-- 건강 위치는 -->
        {{ $t('AnalyzeAgingSpeed.text42')}}
        <span :class="healthLocationStatus.class">
        {{ healthLocationStatus.text }}
        {{ $t('AnalyzeHealthLocation.text8') }}
        </span>
        <!-- 입니다 -->
        {{ $t('AnalyzeAgingSpeed.text46') }}.<br />
        <!-- 건강 신호등은 -->
        {{ $t('AnalyzeDetail.text43')}}
        <span class="good">{{ $t('Common.good') }} {{ healthTrafficLight.good }}{{ $t('AnalyzeDetail.text44')}}</span>,
        <span class="manage">{{ $t('Common.manage') }} {{ healthTrafficLight.manage }}{{ $t('AnalyzeDetail.text44')}}</span>,
        <span class="warning">{{ $t('Common.warning') }} {{ healthTrafficLight.warning }}{{ $t('AnalyzeDetail.text44')}}</span>{{ $t('AnalyzeDetail.text45')}}.
      </p>
      <p class="AnalyzePreface--analyze--text light">
        {{ $t('AnalyzeDetail.text46') }}
      </p>
    </div>
  </div>
</template>