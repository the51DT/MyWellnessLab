<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useBodyCompositionAPI } from '@/composables/useBodyCompositionAPI'
import BasePopupTit from '@/components/BasePopupTit.vue'

const { t } = useI18n()
const store = useStore()
const { getBodyCompositionData } = useBodyCompositionAPI()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const detail = computed(() => {
  return store.getters['analyze/getInhibitionAnalysisDetail']
})

const sendData = computed(() => {
  return detail.value
})

// MyPageBodyCompositionDataRecord와 동일한 데이터 구조 사용
const data = reactive({ target: [] })
const totalCount = ref(0)

/**
 * connectType에 따라 적절한 텍스트를 반환하는 함수입니다.
 *
 * @function getConnectTypeText
 * @param {string} connectType - 연결 타입 (INBODY, BODYKEY, CUSTOM)
 * @returns {string} 표시할 텍스트
 */
const getConnectTypeText = (connectType) => {
  switch (connectType) {
    case 'INBODY':
      return t('AnalyzeMuscleBalanceDetailHistory.myWellnessLab')
    case 'BODYKEY':
      return t('AnalyzeMuscleBalanceDetailHistory.bodykey')
    case 'CUSTOM':
      return t('AnalyzeMuscleBalanceDetailHistory.directInput')
    default:
      return connectType || ''
  }
}

/**
 * connectType에 따라 적절한 배경색을 반환하는 함수입니다.
 *
 * @function getConnectTypeColor
 * @param {string} connectType - 연결 타입 (INBODY, BODYKEY, CUSTOM)
 * @returns {string} 배경색 코드
 */
const getConnectTypeColor = (connectType) => {
  switch (connectType) {
    case 'INBODY':
      return '#d9f0ed'
    case 'BODYKEY':
      return '#d8ffe0'
    case 'CUSTOM':
      return '#e6e6ff'
    default:
      return '#f0f0f0'
  }
}

/**
 * connectType에 따라 적절한 폰트 색상을 반환하는 함수입니다.
 *
 * @function getConnectTypeTextColor
 * @param {string} connectType - 연결 타입 (INBODY, BODYKEY, CUSTOM)
 * @returns {string} 폰트 색상 코드
 */
const getConnectTypeTextColor = (connectType) => {
  switch (connectType) {
    case 'INBODY':
      return '#1db196'
    case 'BODYKEY':
      return '#01865f'
    case 'CUSTOM':
      return '#5353cb'
    default:
      return '#000000'
  }
}

/**
 * 날짜 문자열에서 날짜 부분만 반환하는 함수입니다.
 *
 * @function formatDateOnly
 * @param {string} dateString - 날짜 문자열 (예: "2024.01.15 오후 14:30")
 * @returns {string} 날짜만 포함된 문자열 (예: "2024.01.15")
 */
const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  
  // "오후" 또는 "오전" 이전의 부분만 추출
  const dateMatch = dateString.match(/^([\d.]+)/)
  return dateMatch ? dateMatch[1] : ''
}

/**
 * 날짜 문자열에서 시간 부분만 반환하는 함수입니다.
 *
 * @function formatTimeOnly
 * @param {string} dateString - 날짜 문자열 (예: "2024.01.15 오후 14:30")
 * @returns {string} 시간만 포함된 문자열 (예: "오후 14:30")
 */
const formatTimeOnly = (dateString) => {
  if (!dateString) return ''
  
  // "AM" 또는 "PM" 이후의 부분만 추출
  const timeMatch = dateString.match(/(AM|PM)\s+(\d{1,2}):(\d{2})/)
  if (!timeMatch) return ''
  
  const period = timeMatch[1] // AM 또는 PM
  let hour = parseInt(timeMatch[2]) // 시간
  const minute = timeMatch[3] // 분
  
  // AM/PM을 오전/오후로 변환
  const periodText = period === 'AM' ? t('AnalyzeMuscleBalanceDetailHistory.am') : t('AnalyzeMuscleBalanceDetailHistory.pm')
  
  // 12시간 형식으로 변환 (PM인 경우 12를 더하되, 12시는 그대로 유지)
  if (period === 'PM' && hour !== 12) {
    hour += 12
  } else if (period === 'AM' && hour === 12) {
    hour = 0
  }
  
  // 2자리 형식으로 포맷팅
  const formattedHour = hour.toString().padStart(2, '0')
  
  return `${periodText} ${formattedHour}:${minute}`
}

/**
 * API를 통해 체성분 데이터 목록을 가져오는 함수입니다.
 *
 * @async
 * @function getList
 *
 * useBodyCompositionAPI의 getBodyCompositionData를 사용하여 체성분 데이터 목록을 가져옵니다.
 * 응답 데이터가 존재하면 체성분 데이터를 설정하고,
 * 예외 발생 시 콘솔에 로그를 출력합니다.
 */
const getList = async () => {
  try {
    const types = ['INBODY', 'CUSTOM','BODYKEY']
    const response = await getBodyCompositionData(types)

    if (response && Array.isArray(response)) {
      data.target = response
      totalCount.value = response.length
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 팝업 닫기
 */
function closePopup () {
  emit('close')
}

/**
 * 상세 페이지로 이동
 */
function goToDetail (item) {
  // Vuex store에 item 저장
  store.dispatch('bodyComposition/setSelectedItem', item)
  
  // 팝업 닫기
  closePopup()
  
  // 실제로는 상세 페이지로 이동하는 로직
  // router.push({ name: 'MyPageBodyCompositionDetail' })
}

onMounted(() => {
  if (!detail.value) {
    closePopup()
    return
  }
  
  // 팝업이 열릴 때 데이터 로드
  getList()
})
</script>

<template>
  <BasePopupTit v-if="isOpen" @popupClose="closePopup">
    <template #title>
      {{ t('Router.checkup.text23') }}
    </template>
    
    <template #contents>
      <!-- 이력 리스트 -->
      <div class="AnalyzeMuscleBalanceHistory">
        <div 
          v-for="item in data.target" 
          :key="item.id"
          @click="goToDetail(item)"
          class="AnalyzeMuscleBalanceHistory--item">
            <div class="AnalyzeMuscleBalanceHistory--item-content">
              <!-- 태그 -->
              <div class="tag-wrap">
                <span 
                  class="tag" 
                  :style="{ 
                    backgroundColor: getConnectTypeColor(item.connectType), 
                    color: getConnectTypeTextColor(item.connectType) 
                  }">
                  {{ getConnectTypeText(item.connectType) }}
                </span>
              </div>
              <!-- 날짜/시간 -->
              <p class="AnalyzePagesDetail--date">
                {{ $t('BodyCompositionPop.text17') }}:
                <span class="AnalyzePagesDetail--date-day">{{ formatDateOnly(item.surveyDate) }}</span>
                <span class="AnalyzePagesDetail--date-time">{{ formatTimeOnly(item.surveyDate) }}</span>
              </p>
          </div>

          <div class="AnalyzeMuscleBalanceHistory--item-btn">
            <button
              type="button">
              <img src="/img/ico_arrow_right.svg">
            </button>
          </div>
        </div>

        <!-- 데이터가 없을 때 -->
        <div v-if="totalCount === 0" class="AnalyzeList--no-data">
          <span>{{ $t('AnalyzeMuscleBalanceDetailHistory.noData') }}</span>
        </div>
      </div>
    </template>
  </BasePopupTit>
</template>