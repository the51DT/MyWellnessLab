<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AnalyzeExerciseDetailGuide from '@/views/analyze/AnalyzeExerciseDetailGuide.vue'
import { useI18n } from 'vue-i18n'
import { getScoreStatus, getScoreColor } from '@/assets/js/common'
import BasePopup from '@/components/BasePopup.vue'

const { t } = useI18n()
const store = useStore()

const popup = ref(false)
const exerciseGuidePopup = ref(false)
const showNoDataPopup = ref(false) // 체성분 데이터 없음 팝업

// Vuex store에서 데이터 가져오기
const detail = computed(() => {
  return store.getters['analyze/getInhibitionAnalysisDetail']
})

const sendData = computed(() => {
  return detail.value
})
// 운동 관련 computed 속성들
const totalMet = computed(() => {
  return sendData.value?.metData?.met || 0 
})

const lightMet = computed(() => {
  return sendData.value?.metData?.activ_walk_met || 0 
})

const mediumMet = computed(() => {
  return sendData.value?.metData?.activ_mod_met || 0 
})

const highMet = computed(() => {
  return sendData.value?.metData?.activ_ints_met || 0 
})

// 운동 상태 (common.js의 getScoreStatus 함수 사용)
const metStatus = computed(() => {
  return getScoreStatus(totalMet.value, 'musMass')
})

// 운동 상태에 따른 색상 (common.js의 getScoreColor 함수 사용)
const metColor = computed(() => {
  return getScoreColor(totalMet.value, 'musMass')
})

// 운동 상태 텍스트
const metStatusText = computed(() => {
  switch (metStatus.value) {
    case 1:
      return t('AnalyzeExerciseDetail.good')
    case 2:
      return t('AnalyzeExerciseDetail.manage')
    case 3:
      return t('AnalyzeExerciseDetail.caution')
    default:
      return ''
  }
})

// 바 차트 너비 계산 (퍼센트) - 소수점 유지로 정확한 비율
const lightWidth = computed(() => {
  if (totalMet.value === 0) return 0
  const baseValue = Math.max(totalMet.value, 600)
  return (lightMet.value / baseValue) * 100
})

const mediumWidth = computed(() => {
  if (totalMet.value === 0) return 0
  const baseValue = Math.max(totalMet.value, 600)
  return (mediumMet.value / baseValue) * 100
})

const highWidth = computed(() => {
  if (totalMet.value === 0) return 0
  const baseValue = Math.max(totalMet.value, 600)
  return (highMet.value / baseValue) * 100
})

// WHO 권장선 위치 계산 (600 MET 기준)
const whoLinePosition = computed(() => {
  if (totalMet.value === 0) return 100
  // 600 MET를 기준으로 퍼센트 계산
  const whoPercent = Math.min((600 / totalMet.value) * 100, 100)
  return Math.floor(whoPercent)
})

// hqMusMass 데이터 존재 여부 확인
const hasMusMassData = computed(() => {
  const result = sendData.value?.hqMusMass && Object.keys(sendData.value.hqMusMass).length > 0
  return result
})

/**
 * 맞춤 운동 가이드 팝업 열기
 */
function openExerciseGuide () {
  // hqMusMass 데이터 체크
  if (!sendData.value?.hqMusMass?.exerciseData || 
      sendData.value.hqMusMass.exerciseData.length === 0) {
    showNoDataPopup.value = true
    return
  }
  
  // 데이터가 있으면 팝업 열기
  exerciseGuidePopup.value = true
}

/**
 * 맞춤 운동 가이드 팝업 닫기
 */
function closeExerciseGuidePopup () {
  exerciseGuidePopup.value = false
}
</script>

<template>
  <div class="AnalyzePagesDetail AnalyzeExerciseDetail">
    <div class="AnalyzePagesDetail--my">
      <h2 class="AnalyzePagesDetail--tit">{{ $t('AnalyzeExerciseDetail.myActivity') }}</h2>
      <div class="AnalyzePagesDetail--index-wrap">
        <!-- 운동 점수 나오게, 색상 적용 되도록 개발 요망 -->
        <strong class="AnalyzePagesDetail--index" :style="{color: metColor}">{{ totalMet }}</strong>
        {{ $t('AnalyzeExerciseDetail.met') }}
      </div>
      <div class="AnalyzePagesDetail--btn-wrap">
        <button 
          @click="openExerciseGuide"
          type="button"
          class="AnalyzePagesDetail--btn">
          {{ $t('AnalyzeExerciseDetail.customExerciseGuide') }}
        </button>
      </div>
    </div>

    <div class="AnalyzePagesDetail--graph-wrap">

      <!-- 나의 식사 습관 상세 판정 -->
      <div class="AnalyzePagesDetail--my-diet-wrap">
        <h2 class="AnalyzePagesDetail--section-tit">
          {{ $t('AnalyzeExerciseDetail.myActivityDetail') }}
        </h2>

        <div class="AnalyzePagesDetail--exercise-graph">

          <div class="met-chart">
            <!-- MET 바 차트 -->
            <div class="met-bar-container">
              <div class="met-bar" :style="`--met-bar-left: ${lightWidth + mediumWidth + highWidth}%`">
                <!-- 저강도 운동 -->
                <div class="met-segment light-green" :style="`width: ${lightWidth}%`"></div>
                <!-- 중간도 운동 -->
                <div class="met-segment medium-green" :style="`width: ${mediumWidth}%`"></div>
                <!-- 고강도 운동 -->
                <div class="met-segment dark-green" :style="`width: ${highWidth}%`"></div>
              </div>
              
              <!-- WHO 권장선 -->
              <div class="who-line" :style="`left: ${whoLinePosition}%`">
                <div class="who-line-dash"></div>
                <span class="who-text">
                  <span>600</span>
                  {{ $t('AnalyzeExerciseDetail.whoRecommended') }}</span>
              </div>
            
              <!-- 숫자 표시 -->
              <span class="met-start">0</span>
              <span class="met-end" :style="`right: ${100 - (lightWidth + mediumWidth + highWidth) }%`">{{ totalMet }} <span>{{ $t('AnalyzeExerciseDetail.met') }}</span></span>
            </div>
          </div>
        </div>

        <div class="AnalyzePagesDetail--table">
          <table>
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('AnalyzeExerciseDetail.exerciseIntensity') }}</th>
                <th>{{ $t('AnalyzeExerciseDetail.met') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="icon light-green"></span>{{ $t('AnalyzeExerciseDetail.lowIntensity') }}</td>
                <td>{{ lightMet }}</td>
              </tr>
              <tr>
                <td><span class="icon medium-green"></span>{{ $t('AnalyzeExerciseDetail.moderateIntensity') }}</td>
                <td>{{ mediumMet }}</td>
              </tr>
              <tr>
                <td><span class="icon dark-green"></span>{{ $t('AnalyzeExerciseDetail.highIntensity') }}</td>
                <td>{{ highMet }}</td>
              </tr>
              <tr class="tr-result white">
                <td>{{ $t('AnalyzeExerciseDetail.totalIntensity') }}</td>
                <td>{{ totalMet }}</td>
              </tr>
              <tr class="tr-result">
                <td>{{ $t('AnalyzeExerciseDetail.judgment') }}</td>
                <td :class="metStatus === 1 ? 'green' : metStatus === 2 ? 'yellow' : metStatus === 3 ? 'red' : ''">{{ metStatusText }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="met-info">
          <h4 class="met-info-tit">{{ $t('AnalyzeExerciseDetail.whatIsMet') }}</h4>
          <p  class="met-info-desc">{{ $t('AnalyzeExerciseDetail.metDescription') }}</p>
          <div class="met-info-box">
            <ul>
              <li>{{ $t('AnalyzeExerciseDetail.sitting') }}= 1 MET</li>
              <li>{{ $t('AnalyzeExerciseDetail.walking') }}= 3.3 MET</li>
              <li>{{ $t('AnalyzeExerciseDetail.cycling') }}= 4.0 MET</li>
              <li>{{ $t('AnalyzeExerciseDetail.vigorousExercise') }}= 8.0 MET</li>
            </ul>
          </div>
          <p class="met-info-desc">{{ $t('AnalyzeExerciseDetail.weeklyActivityScore') }}</p>
          <div class="met-info-box">
            <ul>
              <li>{{ $t('AnalyzeExerciseDetail.activityCalculation') }}</li>
            </ul>
          </div>
          <p class="met-info-desc">{{ $t('AnalyzeExerciseDetail.whoRecommendation') }}</p>
        </div>
      </div>
    </div>

    <AnalyzeExerciseDetailGuide 
      class="AnalyzeExerciseDetailGuidePop"
      :isOpen="exerciseGuidePopup"
      @close="closeExerciseGuidePopup" />

    <BasePopup v-if="showNoDataPopup" class="base-pop">
      <template v-slot:contents>
        <p>{{ $t('AnalyzeExerciseDetail.noBodyCompositionData') }}</p>
        <div class="base-pop--footer">
          <button @click="showNoDataPopup = false" type="button" class="btn-pop--green">{{ $t('AnalyzeExerciseDetail.confirm') }}</button>
        </div>
      </template>
    </BasePopup>
  </div>

  <!-- S : 20260319 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
  <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
  <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
    <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
    <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

    <!-- to 개발 | 복약정보가 있을 경우 -->
    <p class="AnalyzeDetail--medicationPopup-detail">
      <span>{{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}</span> {{ $t('AnalyzeDetail.text48') }}
    </p>
  </div>
  <!-- E : 20260319 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
</template>
