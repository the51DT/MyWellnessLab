import { useBodyCompositionState } from './useBodyCompositionState'
import { useBodyCompositionAPI } from './useBodyCompositionAPI'
import { validateNumericFields } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'

// 체성분 관리 Main Composables
export function useBodyComposition() {
  const { t } = useI18n()
  
  // 상태 관리
  const state = useBodyCompositionState()
  
  // API 호출
  const api = useBodyCompositionAPI()
  
  // Destructure state
  const {
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
    resetBodyCompositionState,
    openBodyCompositionPopup,
    closeBodyCompositionPopup,
    closeBodyKeyDetail,
    selectBodyKeyData,
    selectExistingBodyComposition,
    handleDirectInput,
    showResultMessage,
    closeResultPopup
  } = state

    // 바디키 로그인 처리
  const handleBodyKeyLogin = async (loginData) => {
    if (!loginData.bodyKeyId || !loginData.bodyKeyPassword) {
      return { success: false, error: t('BodyComposition.error.missingInput') }
    }

    isLoading.value = true
    try {
      const data = await api.getBodyKeyData(loginData.bodyKeyId, loginData.bodyKeyPassword)
      console.log(data)
      bodyKeyDataList.value = data
      showBodyKeyResult.value = true
      showBodyKeyLogin.value = false
      return { success: true, data }
    } catch (error) {
      console.log('바디키 데이터 조회에 실패했습니다.')
      return { success: false, error: error.message || t('BodyComposition.error.loginFailed') }
    } finally {
      isLoading.value = false
    }
  }

  // 이 측정으로 분석 버튼 클릭 시 실행되는 함수
  const analyzeSelectedBodyKeyData = async () => {
    if (!selectedBodyKeyData.value) {
      showResultMessage(t('BodyComposition.error.selectData'), 'error')
      return
    }
    
    try {
      if (selectedDataType.value === 'bodykey') {
        // BodyKey 데이터 처리
        const result = await api.setBodyKeyCompositionData(
          selectedBodyKeyData.value, 
          currentAnalysisId.value, 
          currentBasicsId.value
        )
        showResultMessage(result.message, 'success')
        // 성공 시 closePopup 이벤트 emit
        return { success: true, action: 'closePopup' }
      } else if (selectedDataType.value === 'existing') {
        // 기존 체성분 데이터 처리
        const result = await api.setExistingBodyCompositionData(
          selectedBodyKeyData.value, 
          currentBasicsId.value,
          currentAnalysisId.value
        )
        showResultMessage(result.message, 'success')
        // 성공 시 closePopup 이벤트 emit
        return { success: true, action: 'closePopup' }
      } else if (selectedDataType.value === 'custom') {
        // 직접 입력 데이터 처리
        
        // 필수 필드 검증
        const requiredFields = ['ht', 'wt', 'wbtBfMass', 'wbtBfPercent', 'wbtSmMass']
        const missingFields = requiredFields.filter(field => !selectedBodyKeyData.value[field])
        
        if (missingFields.length > 0) {
          showResultMessage(t('BodyComposition.error.requiredFields', { fields: missingFields.join(', ') }), 'error')
          return false
        }
        
        // 데이터 형식 검증 (숫자 여부)
        const numericFields = ['ht', 'wt', 'wbtBfMass', 'wbtBfPercent', 'wbtSmMass', 'ramMass', 'ramPercent', 'lamMass', 'lamPercent', 'rlmMass', 'rlmPercent', 'llmMass', 'llmPercent', 'trkMass', 'trkPercent']
        const invalidFields = validateNumericFields(selectedBodyKeyData.value, numericFields)
        
        if (invalidFields.length > 0) {
          showResultMessage(t('BodyComposition.error.numericFields', { fields: invalidFields.join(', ') }), 'error')
          return false
        }
        
        const result = await api.setCustomBodyCompositionData(
          selectedBodyKeyData.value, 
          currentBasicsId.value,
          currentAnalysisId.value
        )
        showResultMessage(result.message, 'success')
        // 성공 시 closePopup 이벤트 emit
        return { success: true, action: 'closePopup' }
      }
    } catch (error) {
      showResultMessage(error.message || t('BodyComposition.error.processingError'), 'error')
    }
    
    return false
  }

  // 기존 체성분 데이터 조회
  const fetchBodyCompositionData = async () => {
    try {
      isLoading.value = true
      const data = await api.getBodyCompositionData('INBODY')
      bodyCompositionDataList.value = data
    } catch (error) {
      bodyCompositionDataList.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 팝업 열기 (기존 체성분 데이터 조회 포함)
  const openBodyCompositionPopupWithData = async (analysisId, basicsId) => {
    openBodyCompositionPopup(analysisId, basicsId)
    await fetchBodyCompositionData()
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
    
    // 함수
    formatDatetime: api.formatDatetime,
    handleBodyKeyLogin,
    selectBodyKeyData,
    selectExistingBodyComposition,
    analyzeSelectedBodyKeyData,
    closeBodyKeyDetail,
         openBodyCompositionPopup: openBodyCompositionPopupWithData,
     handleDirectInput,
     resetBodyCompositionState,
     closeResultPopup
   }
} 