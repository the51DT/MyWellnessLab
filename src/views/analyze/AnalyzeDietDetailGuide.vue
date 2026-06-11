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

const isFoodTypes = ref(true) 

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

// dqStatus 데이터를 기반으로 한 식품군별 상태 computed
const dietStatusList = computed(() => {
  const dqStatus = sendData.value?.dqStatus || {}
  
  const result = [
    { key: 'Multigrain', label: 'AnalyzeDietDetail.text4', description: 'AnalyzeDietDetail.text19', status: dqStatus.Multigrain },
    { key: 'Legumes', label: 'AnalyzeDietDetail.text7', description: 'AnalyzeDietDetail.text17', status: dqStatus.Legumes },
    { key: 'Vegetable', label: 'AnalyzeDietDetail.text9', description: 'AnalyzeDietDetail.text18', status: dqStatus.Vegetable },
    { key: 'Seafood', label: 'AnalyzeDietDetail.text8', description: 'AnalyzeDietDetail.text21', status: dqStatus.Seafood },
    { key: 'DairyProducts', label: 'AnalyzeDietDetail.text11', description: 'AnalyzeDietDetail.text23', status: dqStatus.Dairyproducts },
    { key: 'Nuts', label: 'AnalyzeDietDetail.text5', description: 'AnalyzeDietDetail.text20', status: dqStatus.Nuts },
    { key: 'Tea', label: 'AnalyzeDietDetail.text6', description: 'AnalyzeDietDetail.text24', status: dqStatus.Tea },
    { key: 'Fruit', label: 'AnalyzeDietDetail.text10', description: 'AnalyzeDietDetail.text22', status: dqStatus.Fruit }
  ]
  
  return result
})

// status가 3인 부족한 항목들만 필터링
const needsItems = computed(() => {
  return dietStatusList.value.filter(item => item.status === 3)
})

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
function tabFoodType (val) {
  isFoodTypes.value = val
}
</script>

<template>
  <BasePopupTit v-if="isOpen" @popupClose="closeGuide" class="AnalyzeDietDetailGuide">
    <template v-slot:title>
      {{ $t('AnalyzeDetail.text40') }}
    </template>
    <template v-slot:contents>
      <p class="AnalyzeDetailGuide-desc" v-html="t('AnalyzeDietDetailGuide.description')">
      </p>
      <div class="AnalyzeDetailGuide--tab">
        <button
          @click="tabFoodType(true)"
          type="button"
          class="AnalyzeDetailGuide--tab-btn"
          :class="isFoodTypes ? 'active' : ''">{{ $t('AnalyzeDietDetail.text15') }}</button>
        <button
          @click="tabFoodType(false)"
          type="button"
          class="AnalyzeDetailGuide--tab-btn"
          :class="isFoodTypes ? '' : 'active'">{{ $t('AnalyzeDietDetail.text16') }}</button>
      </div>
      <div v-if="isFoodTypes" class="AnalyzeDetailGuide--con">
        <ul class="AnalyzeDetailGuide--con-ul">
          <li v-for="item in needsItems" :key="item.key" class="Needs">
            <h5>{{ $t(item.label) }}</h5>
            <p>{{ $t(item.description) }}</p>
          </li>
        </ul>
      </div>
      <div v-else class="AnalyzeDetailGuide--con">
        <ul class="AnalyzeDetailGuide--con-ul">
          <li v-for="item in dietStatusList" :key="item.key" :class="item.status === 3 ? 'Needs' : ''">
            <h5>{{ $t(item.label) }}</h5>
            <p>{{ $t(item.description) }}</p>
          </li>
        </ul>
      </div>
    </template>
  </BasePopupTit>
</template>