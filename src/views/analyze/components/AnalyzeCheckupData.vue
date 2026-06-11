<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { dateConvert } from '@/assets/js/common'
import { useAnalysis } from '@/composables/useAnalyze'

const { t, locale } = useI18n()
const router = useRouter()
const store = useStore()

const props = defineProps({
  sendData: Object,
  currentSection: {
    type: Number,
    default: undefined
  }
})

const analysedDate = computed(() => {
  return dateConvert(props.sendData.commonInfo.analysedDate, '.')
})

const type = computed(() => {
  let txt = ''
  if (props.sendData.commonInfo.analysisName !== undefined) {
    txt = props.sendData.commonInfo.analysisName
  }
  return txt
})
const source = computed(() => {
  let txt = t('AnalyzeCheckupData.directInput')
  
  if (props.sendData.basics && props.sendData.commonInfo.analysisType !== 'onetime') {
    // healthDataType에 따라 다국어 적용
    if (props.sendData.basics.healthDataType === 'direct') {
      txt = t('AnalyzeCheckupData.directInput')
    } else if (props.sendData.basics.healthDataType === 'formal') {
      txt = t('AnalyzeCheckupData.formalInput')
    }
  }
  
  return txt
})

// 공통 composable 사용
const { 
  agingRate, 
  agingSpeedStatus, 
  agingSpeedClassForAnalyze, 
  healthLocationStatus, 
  healthTrafficLight 
} = useAnalysis(computed(() => props.sendData))

// currentSection prop을 안전하게 처리하는 computed 속성
const safeCurrentSection = computed(() => {
  const section = props.currentSection
  
  if (section === undefined || section === null) {
    return 0
  }
  
  // 문자열인 경우 숫자로 변환
  const numSection = Number(section)
  return isNaN(numSection) ? 0 : numSection
})

function goToDataRecord () {
  // 현재 섹션 정보를 store에 저장
  const sectionToSave = safeCurrentSection.value
  store.dispatch('analyze/setCurrentSection', sectionToSave)
  
  store.dispatch('analyze/setAnalysisSendData', props.sendData)
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
        {{ $t('AnalyzeCheckupData.text4')}} : <span class="AnalyzePreface--date">{{ analysedDate }}</span> <br />
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

    <!-- S: 20260402 ASB-13836 결과 화면 안내 문구 추가 -->
    <!-- to 개발 | 영문일 때만 추가 -->
    <p class="AnalyzePreface--notice" v-html="$t('AnalyzeCheckupData.text8')"></p>
    <!-- E: 20260402 ASB-13836 결과 화면 안내 문구 추가 -->
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



