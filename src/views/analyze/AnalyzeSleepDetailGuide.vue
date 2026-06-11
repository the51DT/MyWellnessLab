<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import BasePopupTit from '@/components/BasePopupTit.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const isSleepTypes = ref(true) 

const emit = defineEmits(['close'])

const popup = ref(false)
const ageArea = ref('')

const detail = computed(() => {
  return store.getters['analyze/getInhibitionAnalysisDetail']
})

const sendData = computed(() => {
  return detail.value
})

const compId = computed(() => {
  return detail.value?.compId || ''
})

const myIndex = computed(() => {
  return sendData.value?.dqData?.RFS_score || 0 
})

const ages = computed(() => {
  return sendData.value?.basics?.age || 0
})

// shStatus 데이터를 기반으로 한 수면 상태 computed
const sleepStatusList = computed(() => {
  const shStatus = sendData.value?.shStatus || {}
  
  const result = [
    { key: 'PSQIK_T01', title: t('AnalyzeSleepDetailGuide.subjectiveSleepQuality'), status: shStatus.PSQIK_T01 || 1 },
    { key: 'PSQIK_T02', title: t('AnalyzeSleepDetailGuide.sleepLatency'), status: shStatus.PSQIK_T02 || 1 },
    { key: 'PSQIK_T03', title: t('AnalyzeSleepDetailGuide.sleepDuration'), status: shStatus.PSQIK_T03 || 1 },
    { key: 'PSQIK_T04', title: t('AnalyzeSleepDetailGuide.sleepEfficiency'), status: shStatus.PSQIK_T04 || 1 },
    { key: 'PSQIK_T05', title: t('AnalyzeSleepDetailGuide.sleepDisturbance'), status: shStatus.PSQIK_T05 || 1 },
    { key: 'PSQIK_T06', title: t('AnalyzeSleepDetailGuide.sleepMedication'), status: shStatus.PSQIK_T06 || 1 },
    { key: 'PSQIK_T07', title: t('AnalyzeSleepDetailGuide.daytimeDysfunction'), status: shStatus.PSQIK_T07 || 1 }
  ]
  
  return result
})

// status가 3인 부족한 항목들만 필터링
const needsItems = computed(() => {
  return sleepStatusList.value.filter(item => item.status === 3)
})

// 각 항목별 가이드 문구
const sleepGuideTexts = {
  PSQIK_T01: [
    t('AnalyzeSleepDetailGuide.guide1_1'),
    t('AnalyzeSleepDetailGuide.guide1_2'),
    t('AnalyzeSleepDetailGuide.guide1_3')
  ],
  PSQIK_T02: [
    t('AnalyzeSleepDetailGuide.guide2_1'),
    t('AnalyzeSleepDetailGuide.guide2_2'),
    t('AnalyzeSleepDetailGuide.guide2_3'),
    t('AnalyzeSleepDetailGuide.guide2_4')
  ],
  PSQIK_T03: [
    t('AnalyzeSleepDetailGuide.guide3_1'),
    t('AnalyzeSleepDetailGuide.guide3_2'),
    t('AnalyzeSleepDetailGuide.guide3_3')
  ],
  PSQIK_T04: [
    t('AnalyzeSleepDetailGuide.guide4_1'),
    t('AnalyzeSleepDetailGuide.guide4_2'),
    t('AnalyzeSleepDetailGuide.guide4_3')
  ],
  PSQIK_T05: [
    t('AnalyzeSleepDetailGuide.guide5_1'),
    t('AnalyzeSleepDetailGuide.guide5_2'),
    t('AnalyzeSleepDetailGuide.guide5_3'),
    t('AnalyzeSleepDetailGuide.guide5_4')
  ],
  PSQIK_T06: [
    t('AnalyzeSleepDetailGuide.guide6_1'),
    t('AnalyzeSleepDetailGuide.guide6_2'),
    t('AnalyzeSleepDetailGuide.guide6_3'),
    t('AnalyzeSleepDetailGuide.guide6_4')
  ],
  PSQIK_T07: [
    t('AnalyzeSleepDetailGuide.guide7_1'),
    t('AnalyzeSleepDetailGuide.guide7_2'),
    t('AnalyzeSleepDetailGuide.guide7_3'),
    t('AnalyzeSleepDetailGuide.guide7_4')
  ]
}

/**
 * 팝업 열기
 */
function popupOpen () {
  popup.value = true
}

/**
 * 팝업 닫기
 */
function popupClose () {
  popup.value = false
}

/**
 * 가이드 팝업 닫기
 */
function closeGuide () {
  emit('close')
}

onMounted(() => {
  if (!detail.value) {
    closeGuide()
    return
  }

  ageArea.value = sendData.value?.basics?.age || 0
})

/**
 * 탭 노출
 * @param {*} val
 */
function tabSleepType (val) {
  isSleepTypes.value = val
}
</script>

<template>
  <BasePopupTit v-if="isOpen" @popupClose="closeGuide" class="AnalyzeSleepDetailGuidePop">
    <template v-slot:title>
      {{ $t('AnalyzeSleepDetailGuide.customSleepGuide') }}
    </template>
    <template v-slot:contents>
      <p class="AnalyzeDetailGuide-desc" v-html="t('AnalyzeSleepDetailGuide.description')">
      </p>
      <div class="AnalyzeDetailGuide--tab">
        <button
          @click="tabSleepType(true)"
          type="button"
          class="AnalyzeDetailGuide--tab-btn"
          :class="isSleepTypes ? 'active' : ''">{{ $t('AnalyzeSleepDetailGuide.insufficientSleepHabits') }}</button>
        <button
          @click="tabSleepType(false)"
          type="button"
          class="AnalyzeDetailGuide--tab-btn"
          :class="isSleepTypes ? '' : 'active'">{{ $t('AnalyzeSleepDetailGuide.allSleepHabits') }}</button>
      </div>
      <div v-if="isSleepTypes" class="AnalyzeDetailGuide--con">
        <ul class="AnalyzeDetailGuide--con-ul">
          <li v-for="item in needsItems" :key="item.key" class="Needs">
            <h5>{{ item.title }}</h5>
            <ul>
              <li v-for="(text, index) in sleepGuideTexts[item.key]" :key="index">
                {{ text }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else class="AnalyzeDetailGuide--con">
        <ul class="AnalyzeDetailGuide--con-ul">
          <li v-for="item in sleepStatusList" :key="item.key" :class="item.status === 3 ? 'Needs' : ''">
            <h5>{{ item.title }}</h5>
            <ul>
              <li v-for="(text, index) in sleepGuideTexts[item.key]" :key="index">
                {{ text }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
  </BasePopupTit>
</template>