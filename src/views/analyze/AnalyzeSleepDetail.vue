<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AnalyzeSleepDetailGuide from '@/views/analyze/AnalyzeSleepDetailGuide.vue'
import * as vueI18n from 'vue-i18n'
import { getScoreStatus, mwlRound } from '@/assets/js/common'

const { t } = vueI18n.useI18n()
const store = useStore()

const popup = ref(false)
const sleepGuidePopup = ref(false)

// Vuex store에서 데이터 가져오기
const detail = computed(() => {
  return store.getters['analyze/getInhibitionAnalysisDetail']
})

const sendData = computed(() => {
  return detail.value
})

// 수면 점수와 상태 계산
const sleepScore = computed(() => {
  return mwlRound(sendData.value?.shData?.sh_score || 0, 0)
})

const sleepStatus = computed(() => {
  return getScoreStatus(sendData.value?.shData?.sh_score, 'sh')
})

// 수면 점수에 따른 색상
const sleepScoreColor = computed(() => {
  switch (sleepStatus.value) {
    case 1:
      return '#5ab651'  // 초록색 (양호)
    case 2:
      return '#f8b500'  // 노란색 (관리)
    case 3:
      return '#e95371'  // 빨간색 (주의)
    default:
      return '#e95371'  // 기본값
  }
})

// shStatus 데이터를 기반으로 한 computed 속성들
const sleepStatusData = computed(() => {
  const shStatus = sendData.value?.shStatus || {}
  
  return [
    {
      key: 'PSQIK_T01',
      title: t('AnalyzeSleepDetail.subjectiveSleepQuality'),
      description: t('AnalyzeSleepDetail.subjectiveSleepQualityDesc'),
      status: shStatus.PSQIK_T01
    },
    {
      key: 'PSQIK_T02',
      title: t('AnalyzeSleepDetail.sleepLatency'),
      description: t('AnalyzeSleepDetail.sleepLatencyDesc'),
      status: shStatus.PSQIK_T02
    },
    {
      key: 'PSQIK_T03',
      title: t('AnalyzeSleepDetail.sleepDuration'),
      description: t('AnalyzeSleepDetail.sleepDurationDesc'),
      status: shStatus.PSQIK_T03
    },
    {
      key: 'PSQIK_T04',
      title: t('AnalyzeSleepDetail.sleepEfficiency'),
      description: t('AnalyzeSleepDetail.sleepEfficiencyDesc'),
      status: shStatus.PSQIK_T04 
    },
    {
      key: 'PSQIK_T05',
      title: t('AnalyzeSleepDetail.sleepDisturbance'),
      description: t('AnalyzeSleepDetail.sleepDisturbanceDesc'),
      status: shStatus.PSQIK_T05
    },
    {
      key: 'PSQIK_T06',
      title: t('AnalyzeSleepDetail.sleepMedication'),
      description: t('AnalyzeSleepDetail.sleepMedicationDesc'),
      status: shStatus.PSQIK_T06 
    },
    {
      key: 'PSQIK_T07',
      title: t('AnalyzeSleepDetail.daytimeDysfunction'),
      description: t('AnalyzeSleepDetail.daytimeDysfunctionDesc'),
      status: shStatus.PSQIK_T07 
    }
  ]
})

// 상태값에 따른 클래스 반환
function getStatusClass (status) {
  switch (status) {
    case 1:
      return 'green'
    case 3:
      return 'red'
  }
}

// 상태값에 따른 텍스트 반환
function getStatusText (status) {
  switch (status) {
    case 1:
      return t('AnalyzeSleepDetail.good')
    case 3:
      return t('AnalyzeSleepDetail.insufficient')
  }
}

/**
 * 맞춤 운동 가이드 팝업 열기
 */
function openSleepGuidePopup () {
  sleepGuidePopup.value = true
}

/**
 * 맞춤 운동 가이드 팝업 닫기
 */
function closeSleepGuidePopup () {
  sleepGuidePopup.value = false
}
</script>

<template>
  <div class="AnalyzePagesDetail AnalyzeSleepDetail">
    <div class="AnalyzePagesDetail--my">
      <h2 class="AnalyzePagesDetail--tit">{{ $t('AnalyzeSleepDetail.myIndex') }}</h2>
      <div class="AnalyzePagesDetail--index-wrap">
        <!--  수면 점수 나오게, 색상 적용 되도록 개발 요망 -->
        <strong class="AnalyzePagesDetail--index" :style="{ color: sleepScoreColor }">{{ sleepScore }}</strong>
        {{ $t('AnalyzeSleepDetail.points') }}
      </div>
      <div class="AnalyzePagesDetail--btn-wrap">
        <button
          @click="openSleepGuidePopup"
          type="button"
          class="AnalyzePagesDetail--btn">{{ $t('AnalyzeSleepDetail.customSleepGuide') }}</button>
      </div>
    </div>

    <div class="AnalyzePagesDetail--wrap">
      <h2 class="AnalyzePagesDetail--section-tit">
        {{ $t('AnalyzeSleepDetail.mySleepDetail') }}
      </h2>
      <div class="AnalyzePagesDetail--table">
        <div class="legend-wrap">
          <span class="legend-red">{{ $t('AnalyzeSleepDetail.managementRequired') }}</span>
        </div>
        <table>
          <colgroup>
            <col width="75%">
            <col width="25%">
          </colgroup>
          <thead>
            <tr>
              <th>{{ $t('AnalyzeSleepDetail.pittsburghItems') }}</th>
              <th>{{ $t('AnalyzeSleepDetail.judgment') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sleepStatusData" :key="item.key">
              <td>
                {{ item.title }}<br />
                {{ item.description }}
              </td>
              <td :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AnalyzeSleepDetailGuide 
      class="AnalyzeSleepDetailGuidePop"
      :isOpen="sleepGuidePopup"
      @close="closeSleepGuidePopup" />
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