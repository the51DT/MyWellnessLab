<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import BaseTooltip from '@/components/BaseTooltip.vue'
import AnalyzeMajorHealthRiskPopup from './AnalyzeMajorHealthRiskPopup.vue'
import { useCommonForm } from '@/utils/commonForm'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import * as analysisApi from '@/apis/analysis'
import { mwlRound } from '@/assets/js/common'

const { t } = useI18n()
const { MAJOR_HEALTH_RIST_FORM }= useCommonForm()
const route = useRoute()
const store = useStore()
const sendData = store.getters['analyze/getAnalysisSendData']

// API에서 받은 데이터를 저장할 ref 추가
const hriData = ref({})
const hriStatus = ref({})
const sex = ref(0) // 0: 남자, 1: 여자

const isPop = ref(false)
const tooltip = ref(false)
const tooltipEdge = ref(false)

const selectedIndex = ref(0)

function tooltipClose () { /* 툴팁 닫기 */
  tooltip.value = false
}

function openTooltip ($event) { /* 툴팁 열기 */
  tooltip.value = true
  tooltipEdge.value = $event.x
}

const openPopup = (index) => {
  selectedIndex.value = index
  isPop.value = true
}

const closePopup = () => {
  isPop.value = false
}

const handlePrev = () => {
  selectedIndex.value -= 1
}

const handleNext = () => {
  selectedIndex.value += 1
}

const majorHealthRiskList = computed(() => {
  const result = []
  const data = hriData.value || {}
  const status = hriStatus.value || {}
  for (const key in MAJOR_HEALTH_RIST_FORM) {
    let currentStatus = status[key]
    let value = data[key]
    
    // RFS_score는 특수 처리: status는 RFS에서, value는 RFS_score에서
    if (key === 'RFS_score') {
      currentStatus = status['RFS']
      value = data['RFS_score'] || 0
    }
    
    if (currentStatus >= 2) {
      let valueText = value
      if (key === 'CK_drink') {
        value = data.drink_amt
      } else if (key === 'CK_sleep_time') {
        value = data.sleep_time
      } else if (key === 'CK_MH_stress' || key === 'CK_water_amt' || key === 'CK_smok') {
        value = status[key]
      } else if(key === 'RFS_score'){
        valueText =  mwlRound(value || 0 , 0)
        value = mwlRound(value || 0 , 0)
      } else if (!isNaN(valueText) && !Number.isInteger(valueText)) {
        valueText = valueText.toFixed(2)
      }

      const item = {
        key,
        value,
        valueText,
        status: currentStatus,
        statusColorClass: getStatusColorClass(currentStatus),
        sex: sex.value, // 0: 남자, 1: 여자
        ...MAJOR_HEALTH_RIST_FORM[key],
        index: Object.keys(MAJOR_HEALTH_RIST_FORM).indexOf(key)
      }
      result.push(item)
    }
  }
  const res = _.orderBy(result, ['status', 'index'], ['desc', 'asc'])
  return res
})

const getStatusColorClass = (status) => {
  return {
    caution: status === 2,
    danger: status === 3
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 2:
      return t('Common.manage')
    case 3:
      return t('Common.warning')
    default:
      return ''
  }
}

/**
 * 분석 결과 상세 조회
 */
async function getDetailAnalyzeData() {
  const detailId = route.params.detailId
  if (!detailId) {
    return
  }
  
  try {
    const res = await analysisApi.getAnalysisHeathLightDetail(detailId)
    if (res.data.logmeCompleteAnalysisDetail) {
      const analyzeData = res.data.logmeCompleteAnalysisDetail
      // API 응답에서 hriData와 hriStatus를 직접 가져와서 ref에 할당
      hriData.value = analyzeData.hriData || {}
      hriStatus.value = analyzeData.hriStatus || {}
      sex.value = analyzeData.sex ? analyzeData.sex - 1 : 0 // 1: 남자, 2: 여자 -> 0: 남자, 1: 여자로 변환
    }
  } catch (error) {
    console.error('API 호출 오류:', error)
  }
}

onMounted(() => {
  getDetailAnalyzeData()
})
</script>

<template>
  <div class="AnalyzeMajorHealthRisk">

    <div class="analyze-box">
      <p class="AnalyzeMajorHealthRisk--info">
        <strong class="AnalyzeMajorHealthRisk--danger">{{ majorHealthRiskList.length }}{{ $t('AnalyzeMajorHealthRisk.text6') }}</strong>{{ $t('AnalyzeMajorHealthRisk.text7') }}
      </p>

      <div class="AnalyzeMajorHealthRisk--wrap">
        <div
          v-for="(item, index) in majorHealthRiskList"
          :key="index"
          class="AnalyzeMajorHealthRisk--in"
          @click="openPopup(index)">
          <h2 class="AnalyzeMajorHealthRisk--wrap-tit">{{ item.label }}</h2>
          <div class="AnalyzeMajorHealthRisk--wrap-con">
            <div
              class="AnalyzeMajorHealthRisk--wrap-grade "
              :class="getStatusColorClass(item.status)">
              {{ getStatusText(item.status) }}
            </div>
            <div class="AnalyzeMajorHealthRisk--wrap-num-wrap">
              <div class="AnalyzeMajorHealthRisk--wrap-num">{{ item.valueText }}</div>
              <div class="AnalyzeMajorHealthRisk--wrap-unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="AnalyzeAgingSpeed--reason-txt">
        {{ $t('AnalyzeMajorHealthRisk.text8') }}
      </div>
    </div>

    <AnalyzeMajorHealthRiskPopup
      v-if="isPop"
      :majorHealthRiskList="majorHealthRiskList"
      :selectedIndex="selectedIndex"
      class="AnalyzeMajorHealthRisk--popup"
      @prev="handlePrev"
      @next="handleNext"
      @close="closePopup" />
  </div>

  <!-- S : 20260323 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
  <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
  <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
    <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
    <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

    <!-- to 개발 | 복약정보가 있을 경우 -->
    <p class="AnalyzeDetail--medicationPopup-detail">
      <span>{{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}</span> {{ $t('AnalyzeDetail.text48') }}
    </p>
  </div>
  <!-- E : 20260323 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
</template>
