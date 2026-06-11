import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getTodayDateString } from '@/assets/js/common'
// 상태 관리 Composables
export function useBodyCompositionState() {
  const router = useRouter()
  const store = useStore()
  
  // 팝업 상태
  const openPopBodyComposition = ref(false)
  const showBodyKeyLogin = ref(false)
  const showBodyKeyResult = ref(false)
  const showBodyKeyDetail = ref(false)
  
  // 결과 팝업 상태
  const showResultPopup = ref(false)
  const resultMessage = ref('')
  const resultType = ref('success') // 'success', 'error'

  
  // 데이터 리스트
  const bodyKeyDataList = ref([])
  const bodyCompositionDataList = ref([])
  
  // 로딩 상태
  const isLoading = ref(false)
  
  // 선택된 데이터
  const selectedBodyKeyData = ref(null)
  const selectedBodyKeyId = ref(null)
  const selectedDataType = ref(null) // 'bodykey', 'existing', 'custom'
  
  // 현재 분석 정보
  const currentAnalysisId = ref(null)
  const currentBasicsId = ref(null)

  // 상태 초기화
  const resetBodyCompositionState = () => {
    openPopBodyComposition.value = false
    showBodyKeyLogin.value = false
    showBodyKeyResult.value = false
    showBodyKeyDetail.value = false
    showResultPopup.value = false
    resultMessage.value = ''
    resultType.value = 'success'
    bodyKeyDataList.value = []
    selectedBodyKeyData.value = null
    selectedBodyKeyId.value = null
    selectedDataType.value = null
    // currentAnalysisId.value = null  // 분석 ID는 유지
    // currentBasicsId.value = null    // basicsId는 유지
  }

  // 팝업 열기
  const openBodyCompositionPopup = (analysisId, basicsId) => {
    // 팝업 열기 전에 상태 초기화
    resetBodyCompositionState()
    
    currentAnalysisId.value = analysisId
    currentBasicsId.value = basicsId
    openPopBodyComposition.value = true
  }

  // 팝업 닫기
  const closeBodyCompositionPopup = () => {
    openPopBodyComposition.value = false
    resetBodyCompositionState()
  }

  // 바디키 상세 정보 팝업 닫기
  const closeBodyKeyDetail = () => {
    showBodyKeyDetail.value = false
  }

  // 바디키 데이터 선택
  const selectBodyKeyData = (item) => {
    selectedBodyKeyData.value = item
    selectedDataType.value = 'bodykey'
    selectedBodyKeyId.value = item.id || item.Id || item.ID
    showBodyKeyDetail.value = true
  }

  // 기존 체성분 데이터 선택
  const selectExistingBodyComposition = (item) => {
    selectedBodyKeyData.value = item
    selectedDataType.value = 'existing'
    showBodyKeyDetail.value = true
  }

  // 직접 입력 처리
  const handleDirectInput = (selectedDate = null) => {
    // 빈 체성분 데이터 객체 생성 (선택된 날짜 또는 오늘 날짜 포함)
    selectedBodyKeyData.value = {
      surveyDate: selectedDate || getTodayDateString(),
      ht: '',
      wt: '',
      wbtBfMass: '',
      wbtBfPercent: '',
      wbtSmMass: '',
      ramMass: '',
      ramPercent: '',
      lamMass: '',
      lamPercent: '',
      rlmMass: '',
      rlmPercent: '',
      llmMass: '',
      llmPercent: '',
      trkMass: '',
      trkPercent: ''
    }
    selectedDataType.value = 'custom'
    
    // 상세 팝업 표시 (직접 입력 모드)
    showBodyKeyDetail.value = true
  }

  // 결과 팝업 표시
  const showResultMessage = (message, type = 'success') => {
    resultMessage.value = message
    resultType.value = type
    showResultPopup.value = true
  }

  // 결과 팝업 닫기
  const closeResultPopup = () => {
    showResultPopup.value = false
    resultMessage.value = ''
    resultType.value = 'success'
    
    // 분석 결과 페이지로 이동
    router.push({ path: '/analyze/detail' })
    store.dispatch('checkup/setAnalysisType', 'normal')
    store.dispatch('checkup/setResultId', currentAnalysisId.value)
  }

  return {
    // 상태
    openPopBodyComposition,
    showBodyKeyLogin,
    showBodyKeyResult,
    showBodyKeyDetail,
    showResultPopup,
    resultMessage,
    resultType,
    bodyKeyDataList,
    bodyCompositionDataList,
    isLoading,
    selectedBodyKeyData,
    selectedBodyKeyId,
    currentAnalysisId,
    currentBasicsId,
    selectedDataType,
    
    // 상태 관리 함수들
    resetBodyCompositionState,
    openBodyCompositionPopup,
    closeBodyCompositionPopup,
    closeBodyKeyDetail,
    selectBodyKeyData,
    selectExistingBodyComposition,
    handleDirectInput,
    showResultMessage,
    closeResultPopup
  }
} 