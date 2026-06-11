<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import BaseInput2 from '@/components/BaseInput2.vue'
import BasePopup from '@/components/BasePopup.vue'
import DirectInputGuidePopup from '@/components/DirectInputGuidePopup.vue'
import * as checkupApi from '@/apis/checkup'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { t } = useI18n()

// 연속 클릭 방지를 위한 상태 관리
const isProcessing = ref(false)
let debounceTimeout = null

// 0값 검증 관련 상태
const showZeroValuePopup = ref(false)
const zeroValueFieldName = ref('')
const currentZeroFieldKey = ref('') // 현재 팝업에 표시 중인 필드 키
const confirmedZeroFields = ref([]) // 이미 "계속"을 누른 필드들

// 체성분 필드 정의 (필드명, 라벨키)
const bodyCompositionFields = [
  { key: 'ht', labelKey: 'BodyCompositionPop.text18' }, // 키
  { key: 'wt', labelKey: 'BodyCompositionPop.text19' }, // 체중
  { key: 'wbtSmMass', labelKey: 'BodyCompositionPop.text22' }, // 골격근량
  { key: 'wbtBfMass', labelKey: 'BodyCompositionPop.text20' }, // 체지방량
  { key: 'wbtBfPercent', labelKey: 'BodyCompositionPop.text21' }, // 체지방률
  { key: 'ramMass', labelKey: 'BodyCompositionPop.text23' }, // 오른팔 근육량
  { key: 'ramPercent', labelKey: 'BodyCompositionPop.text24' }, // 오른팔 비율
  { key: 'lamMass', labelKey: 'BodyCompositionPop.text27' }, // 왼팔 근육량
  { key: 'lamPercent', labelKey: 'BodyCompositionPop.text28' }, // 왼팔 비율
  { key: 'trkMass', labelKey: 'BodyCompositionPop.text31' }, // 몸통 근육량
  { key: 'trkPercent', labelKey: 'BodyCompositionPop.text32' }, // 몸통 비율
  { key: 'rlmMass', labelKey: 'BodyCompositionPop.text25' }, // 오른다리 근육량
  { key: 'rlmPercent', labelKey: 'BodyCompositionPop.text26' }, // 오른다리 비율
  { key: 'llmMass', labelKey: 'BodyCompositionPop.text29' }, // 왼다리 근육량
  { key: 'llmPercent', labelKey: 'BodyCompositionPop.text30' } // 왼다리 비율
]

// 페이지 모드 확인 (읽기 전용 모드인지 편집 모드인지)
const isViewMode = computed(() => route.query.mode === 'view')
const dataType = computed(() => route.query.dataType || 'custom')

const showGuidePopup = ref(false) /* 직접 입력 가이드 팝업 */

// surveyDate를 YYYYMMDD 형식으로 변환하는 함수
const formatSurveyDateToYYYYMMDD = (surveyDate) => {
  if (!surveyDate) return ''
  
  try {
    // "2025.07.11 오후 05:32" 형식에서 날짜 부분만 추출
    const dateStr = surveyDate.substring(0, 10) // "2025.07.11"
    
    // "."을 "-"로 변경하여 Date 객체 생성
    const date = new Date(dateStr.replace(/\./g, '-'))
    
    // YYYYMMDD 형식으로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}${month}${day}`
  } catch (error) {
    console.error('surveyDate 변환 실패:', error)
    return surveyDate // 변환 실패 시 원본 반환
  }
}

// 화면 표시용 날짜 형식으로 변환하는 함수 (YYYYMMDD → YYYY.MM.DD)
const formatDisplayDate = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd
  
  try {
    const year = yyyymmdd.substring(0, 4)
    const month = yyyymmdd.substring(4, 6)
    const day = yyyymmdd.substring(6, 8)
    
    return `${year}.${month}.${day}`
  } catch (error) {
    return yyyymmdd
  }
}

// 읽기 전용 모드에서 원본 날짜 형식 그대로 표시하는 함수
const formatFullDisplayDate = (originalDate) => {
  if (!originalDate) return '정보 없음'
  
  // 이미 "YYYY.MM.DD 오후 HH:MM" 형식이면 그대로 반환
  if (originalDate.includes('오전') || originalDate.includes('오후')) {
    return originalDate
  }
  
  // YYYYMMDD 형식이면 간단한 날짜로 변환
  if (originalDate.length === 8) {
    return formatDisplayDate(originalDate)
  }
  
  return originalDate
}

/**
 * 상위 라우터(@/layouts/LayoutCheckup.vue)에서 설문 종료시 boolean값 제공
 * @typeof {boolean} isStop
 */
const isStop = inject('stop')

// 숫자를 문자열로 변환 (0도 유효한 값으로 처리)
const toStringOrEmpty = (value) => {
  // null 또는 undefined이면 빈 문자열 반환
  if (value === null || value === undefined) return ''
  
  // 0을 포함한 모든 숫자를 문자열로 변환
  return String(value)
}

// 숫자 변환 헬퍼 함수 (0을 유효한 값으로 처리)
const toNumberOrNull = (value) => {
  // 빈 값이면 null 반환
  if (value === '' || value === null || value === undefined) return null
  
  const num = Number(value)
  // NaN이면 null, 아니면 숫자 반환 (0 포함)
  return isNaN(num) ? null : num
}

// 체성분 데이터 상태
const bodyCompositionData = ref({
  id: null, // 기존 데이터 ID (수정 시 사용)
  basicsId: null,
  surveyDate: '', // 원본 형식 그대로 저장
  connectType: '',
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
})

const openGuidePopup = () => {
  showGuidePopup.value = true
}

const closeGuidePopup = () => {
  showGuidePopup.value = false
}

// 페이지 진입 시 데이터 로드
onMounted(async () => {
  try {
    if (isViewMode.value && dataType.value === 'existing') {
      // 읽기 전용 모드: store에서 선택된 데이터 로드
      const selectedData = store.getters['checkup/getSelectedBodyKeyData']
      if (selectedData) {
        bodyCompositionData.value = {
          id: selectedData.id || null,
          basicsId: selectedData.basicsId || null,
          surveyDate: selectedData.surveyDate || '', // 원본 형식 그대로 저장
          connectType: selectedData.connectType || '',
          ht: toStringOrEmpty(selectedData.ht),
          wt: toStringOrEmpty(selectedData.wt),
          wbtBfMass: toStringOrEmpty(selectedData.wbtBfMass),
          wbtBfPercent: toStringOrEmpty(selectedData.wbtBfPercent),
          wbtSmMass: toStringOrEmpty(selectedData.wbtSmMass),
          ramMass: toStringOrEmpty(selectedData.ramMass),
          ramPercent: toStringOrEmpty(selectedData.ramPercent),
          lamMass: toStringOrEmpty(selectedData.lamMass),
          lamPercent: toStringOrEmpty(selectedData.lamPercent),
          rlmMass: toStringOrEmpty(selectedData.rlmMass),
          rlmPercent: toStringOrEmpty(selectedData.rlmPercent),
          llmMass: toStringOrEmpty(selectedData.llmMass),
          llmPercent: toStringOrEmpty(selectedData.llmPercent),
          trkMass: toStringOrEmpty(selectedData.trkMass),
          trkPercent: toStringOrEmpty(selectedData.trkPercent)
        }
        console.log('선택된 기존 체성분 데이터가 로드되었습니다:', bodyCompositionData.value)
      }
    } else {
      // 편집 모드: API를 통해 기존 체성분 데이터 조회
      const basicsId = store.getters['checkup/getBasicsId']
      if (basicsId) {
        const response = await checkupApi.getInbodyTemporary(basicsId)
        
        if (response?.data?.inbody?.connectType === 'CUSTOM') {
          // 기존 데이터가 있으면 폼에 설정
          const inbodyData = response.data.inbody
          
          // 각 필드를 폼 데이터에 설정
          bodyCompositionData.value = {
            id: inbodyData.id || null,
            basicsId: inbodyData.basicsId || null,
            surveyDate: inbodyData.surveyDate || '', // 원본 형식 그대로 저장
            connectType: inbodyData.connectType || '',
            ht: toStringOrEmpty(inbodyData.ht),
            wt: toStringOrEmpty(inbodyData.wt),
            wbtBfMass: toStringOrEmpty(inbodyData.wbtBfMass),
            wbtBfPercent: toStringOrEmpty(inbodyData.wbtBfPercent),
            wbtSmMass: toStringOrEmpty(inbodyData.wbtSmMass),
            ramMass: toStringOrEmpty(inbodyData.ramMass),
            ramPercent: toStringOrEmpty(inbodyData.ramPercent),
            lamMass: toStringOrEmpty(inbodyData.lamMass),
            lamPercent: toStringOrEmpty(inbodyData.lamPercent),
            rlmMass: toStringOrEmpty(inbodyData.rlmMass),
            rlmPercent: toStringOrEmpty(inbodyData.rlmPercent),
            llmMass: toStringOrEmpty(inbodyData.llmMass),
            llmPercent: toStringOrEmpty(inbodyData.llmPercent),
            trkMass: toStringOrEmpty(inbodyData.trkMass),
            trkPercent: toStringOrEmpty(inbodyData.trkPercent)
          }
          
          console.log('기존 인바디 데이터가 로드되었습니다:', bodyCompositionData.value)
        }
      }
    }
  } catch (error) {
    console.error('체성분 데이터 조회 실패:', error)
  }
})

// 필수 필드 검증
const requiredFields = ['ht', 'wt', 'wbtBfMass', 'wbtBfPercent', 'wbtSmMass', 'ramMass', 'ramPercent', 'lamMass', 'lamPercent', 'rlmMass', 'rlmPercent', 'llmMass', 'llmPercent', 'trkMass', 'trkPercent']
const isFormValid = computed(() => {
  return requiredFields.every(field => {
    const value = bodyCompositionData.value[field]
    // 값이 존재하고, 문자열인 경우 trim() 사용, 숫자인 경우 그대로 검증
    return value !== null && value !== undefined && value !== '' && 
           (typeof value === 'string' ? value.trim() !== '' : true)
  })
})

// 버튼 비활성화 상태
const isDisabled = computed(() => {
  // 처리 중이면 비활성화
  if (isProcessing.value) {
    return true
  }
  
  // 읽기 전용 모드가 아닌 경우 폼 유효성 검사
  if (!isViewMode.value) {
    return !isFormValid.value
  }
  
  return false
})

// 입력 필드 업데이트
const updateField = (field, value) => {
  bodyCompositionData.value[field] = value
}

/**
 * 체성분 입력값에 0이 있는지 검증
 * @returns {boolean} 유효하면 true, 0값이 있으면 false
 */
const validateZeroValues = () => {
  // 읽기 전용 모드면 검증 스킵
  if (isViewMode.value) {
    return true
  }
  
  const data = bodyCompositionData.value
  if (!data) return true
  
  for (const field of bodyCompositionFields) {
    // 이미 확인한 필드는 스킵
    if (confirmedZeroFields.value.includes(field.key)) {
      continue
    }
    
    const value = data[field.key]
    // 값이 0인지 확인 (문자열 '0', '0.0', '0.00' 등도 포함)
    if (value !== null && value !== undefined && value !== '') {
      const numValue = parseFloat(value)
      if (numValue === 0) {
        zeroValueFieldName.value = t(field.labelKey)
        currentZeroFieldKey.value = field.key
        showZeroValuePopup.value = true
        isProcessing.value = false // 팝업 표시 시 처리 상태 해제
        return false
      }
    }
  }
  
  return true
}

/**
 * 0값 경고 팝업 닫기
 */
const closeZeroValuePopup = () => {
  showZeroValuePopup.value = false
  zeroValueFieldName.value = ''
  currentZeroFieldKey.value = ''
  // 확인된 필드 목록 초기화 (수정하러 돌아가면 처음부터 다시)
  confirmedZeroFields.value = []
}

/**
 * 0값 경고 무시하고 계속 진행
 */
const continueWithZeroValue = () => {
  // 현재 필드를 확인 완료 목록에 추가
  if (currentZeroFieldKey.value) {
    confirmedZeroFields.value.push(currentZeroFieldKey.value)
  }
  
  showZeroValuePopup.value = false
  zeroValueFieldName.value = ''
  currentZeroFieldKey.value = ''
  
  // 다음 0값 필드가 있는지 다시 검증
  if (!validateZeroValues()) {
    return // 다음 0값 필드에 대한 팝업이 표시됨
  }
  
  // 모든 0값 필드를 확인했으면 저장 진행
  confirmedZeroFields.value = [] // 초기화
  isProcessing.value = true
  handleSave()
}

// debounce를 적용한 handleSave 함수
const debouncedHandleSave = () => {
  // 이미 처리 중이면 중복 실행 방지 (즉시 체크)
  if (isProcessing.value) {
    return
  }
  
  // 버튼 클릭 즉시 처리 상태로 변경하여 비활성화
  isProcessing.value = true
  
  // 0값 검증
  if (!validateZeroValues()) {
    return // 팝업이 표시되고 여기서 중단
  }
  
  // 기존 timeout이 있으면 클리어
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  // 300ms 후에 실행되도록 debounce 적용
  debounceTimeout = setTimeout(() => {
    handleSave()
  }, 300)
}

// 저장 및 다음 단계로 이동
const handleSave = async (shouldMoveNext = true) => {
  // debouncedHandleSave에서 이미 isProcessing을 true로 설정했으므로 
  // 여기서는 중복 체크하지 않고 바로 진행
  if (!isProcessing.value) {
    isProcessing.value = true
  }
  // 읽기 전용 모드가 아닐 때만 유효성 검증
  if (!isViewMode.value) {
    // 숫자 필드 검증
    const numericFields = ['ht', 'wt', 'wbtBfMass', 'wbtBfPercent', 'wbtSmMass', 'ramMass', 'ramPercent', 'lamMass', 'lamPercent', 'rlmMass', 'rlmPercent', 'llmMass', 'llmPercent', 'trkMass', 'trkPercent']
    const invalidFields = numericFields.filter(field => {
      const value = bodyCompositionData.value[field]
      return value && isNaN(Number(value))
    })
  }
  
  try {
    const basicsId = store.getters['checkup/getBasicsId']

    let dataToSave
    
    if (isViewMode.value && dataType.value === 'existing') {
      // 읽기 전용 모드: 기존 체성분 데이터를 현재 분석에 적용
      dataToSave = {
        inbody: {
          basicsId: basicsId,
          connectType: bodyCompositionData.value.connectType || "CUSTOM",
          surveyDate: formatSurveyDateToYYYYMMDD(bodyCompositionData.value.surveyDate) || '',
          ht: toNumberOrNull(bodyCompositionData.value.ht),
          wt: toNumberOrNull(bodyCompositionData.value.wt),
          wbtBfMass: toNumberOrNull(bodyCompositionData.value.wbtBfMass),
          wbtBfPercent: toNumberOrNull(bodyCompositionData.value.wbtBfPercent),
          wbtSmMass: toNumberOrNull(bodyCompositionData.value.wbtSmMass),
          ramMass: toNumberOrNull(bodyCompositionData.value.ramMass),
          ramPercent: toNumberOrNull(bodyCompositionData.value.ramPercent),
          lamMass: toNumberOrNull(bodyCompositionData.value.lamMass),
          lamPercent: toNumberOrNull(bodyCompositionData.value.lamPercent),
          rlmMass: toNumberOrNull(bodyCompositionData.value.rlmMass),
          rlmPercent: toNumberOrNull(bodyCompositionData.value.rlmPercent),
          llmMass: toNumberOrNull(bodyCompositionData.value.llmMass),
          llmPercent: toNumberOrNull(bodyCompositionData.value.llmPercent),
          trkMass: toNumberOrNull(bodyCompositionData.value.trkMass),
          trkPercent: toNumberOrNull(bodyCompositionData.value.trkPercent)
        }
      }
    } else {
      // 편집 모드: 직접 입력된 데이터 저장
      dataToSave = {
        inbody: {
          id: bodyCompositionData.value.id, // 기존 데이터 ID (수정 시 필요)
          basicsId: basicsId,
          connectType: "CUSTOM",
          ht: toNumberOrNull(bodyCompositionData.value.ht),
          wt: toNumberOrNull(bodyCompositionData.value.wt),
          wbtBfMass: toNumberOrNull(bodyCompositionData.value.wbtBfMass),
          wbtBfPercent: toNumberOrNull(bodyCompositionData.value.wbtBfPercent),
          wbtSmMass: toNumberOrNull(bodyCompositionData.value.wbtSmMass),
          ramMass: toNumberOrNull(bodyCompositionData.value.ramMass),
          ramPercent: toNumberOrNull(bodyCompositionData.value.ramPercent),
          lamMass: toNumberOrNull(bodyCompositionData.value.lamMass),
          lamPercent: toNumberOrNull(bodyCompositionData.value.lamPercent),
          rlmMass: toNumberOrNull(bodyCompositionData.value.rlmMass),
          rlmPercent: toNumberOrNull(bodyCompositionData.value.rlmPercent),
          llmMass: toNumberOrNull(bodyCompositionData.value.llmMass),
          llmPercent: toNumberOrNull(bodyCompositionData.value.llmPercent),
          trkMass: toNumberOrNull(bodyCompositionData.value.trkMass),
          trkPercent: toNumberOrNull(bodyCompositionData.value.trkPercent)
        }
      }
      
      // 편집 모드에서만 선택된 날짜를 surveyDate로 설정
      const selectedDate = store.getters['checkup/getCheckDate']
      if (selectedDate) {
        // 선택된 날짜를 YYYYMMDD 형식으로 변환
        const date = new Date(selectedDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        dataToSave.inbody.surveyDate = `${year}${month}${day}`
      } else {
        // 홈에서 직접입력: 현재 날짜 사용
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        
        dataToSave.inbody.surveyDate = `${year}${month}${day}`
      }
    }
    
    // API 호출 (읽기 전용 모드에서는 항상 새로 등록, 편집 모드에서는 기존 로직 유지)
    let response
    if (isViewMode.value || !bodyCompositionData.value.basicsId) {
      await checkupApi.setInbodyTemporary(dataToSave)
    } else {
      await checkupApi.updateInbodyTemporary(dataToSave)
    }
    
    // store에 데이터 저장 (로컬 상태 관리용)
    store.commit('checkup/SET_SELECTED_BODY_KEY_DATA', bodyCompositionData.value)
    
    // 설문 중단 상태인지 확인
    if (isStop && isStop.value) {
      // 설문 중단 시 Home으로 이동
      await router.push({ name: 'Home' })
      // 성공 시 다음 페이지로 이동하므로 isProcessing 상태 유지 (버튼 비활성화 유지)
    } else {
      // 정상 진행 시 다음 단계로 이동
      await router.push({ name: 'CheckupInterestHealth' })
      // 성공 시 다음 페이지로 이동하므로 isProcessing 상태 유지 (버튼 비활성화 유지)
    }
    
  } catch (error) {
    console.error('체성분 데이터 저장 실패:', error)
  } finally {
    isProcessing.value = false
  }
}

// 이전 단계로 이동
const handleBack = () => {
  if (isViewMode.value) {
    // 읽기 전용 모드에서 출처에 따라 다른 페이지로 이동
    const fromPage = route.query.from
    if (fromPage === 'CheckupBodyKeyDataList') {
      // 바디키 데이터 리스트에서 온 경우
      router.push({ name: 'CheckupBodyKeyDataList' })
    } else {
      // 기본적으로는 CheckupBody로 돌아감
      router.push({ name: 'CheckupBody' })
    }
  } else {
    // 편집 모드에서는 날짜 선택 페이지로 돌아감
    router.push({ name: 'CheckupBodyDateSelect' })
  }
}



watch(
  () => isStop.value,
  async () => {
    // 임시저장
    await handleSave()
  }
)
</script>

<template>
  <div class="CheckupBodyDirectInput">
    <!-- 헤더 -->
    <div class="checkupBody-header">
      <h1 class="checkupBody-header-part-tit">
        <span class="checkupBody-header-part-tit-ic"><img src="/img/ic_step2_n.png" alt="체성분"></span>
        {{ $t('CheckupBody.text3') }}
      </h1>
      <p class="checkupBody-header-desc">
        <span v-if="isViewMode"> {{ $t('CheckupBody.text7') }} {{ formatFullDisplayDate(bodyCompositionData.surveyDate) }}</span>
        <span v-else>{{ $t('CheckupBody.text8') }}</span>
      </p>
      <button
        v-if="dataType === 'custom'"
        type="button" class="Checkup--contents-guide-btn"
        @click="openGuidePopup">
        {{ $t('Router.checkup.text31') }}
      </button>
    </div>
    
    <div class="CheckupBodyDirectInput-content">
      <div class="CheckupBodyDirectInput-form">
        <!-- 신장 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 170"
          :value="bodyCompositionData.ht"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('ht', value)"
          :maxlength="5"
          :fixed="1"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text18') }}
          </template>
          <template v-slot:suffix>
            <span>cm</span>
          </template>
        </BaseInput2>

        <!-- 체중 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 60"
          :value="bodyCompositionData.wt"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('wt', value)"
          :maxlength="5"
          :fixed="1"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text19') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 골격근량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 25.5"
          :value="bodyCompositionData.wbtSmMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('wbtSmMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text22') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 체지방량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 14"
          :value="bodyCompositionData.wbtBfMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('wbtBfMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text20') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 체지방률 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 24"
          :value="bodyCompositionData.wbtBfPercent"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('wbtBfPercent', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text21') }}
          </template>
          <template v-slot:suffix>
            <span>%</span>
          </template>
        </BaseInput2>

        <!-- 우측 팔 근육량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 2.5"
          :value="bodyCompositionData.ramMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('ramMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text23') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 우측 팔 근육률 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 90"
          :value="bodyCompositionData.ramPercent"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('ramPercent', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text24') }}
          </template>
          <template v-slot:suffix>
            <span>%</span>
          </template>
        </BaseInput2>

        <!-- 좌측 팔 근육량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 2.5"
          :value="bodyCompositionData.lamMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('lamMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text27') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 좌측 팔 근육률 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 90"
          :value="bodyCompositionData.lamPercent"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('lamPercent', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text28') }}
          </template>
          <template v-slot:suffix>
            <span>%</span>
          </template>
        </BaseInput2>

        <!-- 몸통 근육량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 25"
          :value="bodyCompositionData.trkMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('trkMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text31') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 몸통 근육률 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 90"
          :value="bodyCompositionData.trkPercent"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('trkPercent', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text32') }}
          </template>
          <template v-slot:suffix>
            <span>%</span>
          </template>
        </BaseInput2>

        <!-- 우측 다리 근육량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 8.5"
          :value="bodyCompositionData.rlmMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('rlmMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text25') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 우측 다리 근육률 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 90"
          :value="bodyCompositionData.rlmPercent"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('rlmPercent', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text26') }}
          </template>
          <template v-slot:suffix>
            <span>%</span>
          </template>
        </BaseInput2>

        <!-- 좌측 다리 근육량 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 8.5"
          :value="bodyCompositionData.llmMass"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('llmMass', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text29') }}
          </template>
          <template v-slot:suffix>
            <span>kg</span>
          </template>
        </BaseInput2>

        <!-- 좌측 다리 근육률 -->
        <BaseInput2
          class="CheckupBodyDirectInput-input"
          placeholder="예: 90"
          :value="bodyCompositionData.llmPercent"
          @keydown="(e) => {
            // 한글 입력 차단 (IME 조합 중)
            if (e.isComposing || e.keyCode === 229) {
              e.preventDefault()
              return
            }
            
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
            const isNumber = /^[0-9]$/.test(e.key)
            const isDot = e.key === '.'
            const isAllowed = allowedKeys.includes(e.key) || (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
            
            if (!isNumber && !isDot && !isAllowed) {
              e.preventDefault()
            }
          }"
          @input="(value) => updateField('llmPercent', value)"
          :maxlength="5"
          :fixed="2"
          :disabled="isViewMode"
        >
          <template v-slot:label>
            {{ $t('BodyCompositionPop.text30') }}
          </template>
          <template v-slot:suffix>
            <span>%</span>
          </template>
        </BaseInput2>
      </div>
    </div>
    
    <!-- 선택 버튼들 -->
    <div class="Checkup--btn-wrap">
      <div class="btn--bottom">
        <button 
          v-if="isViewMode"
          @click="debouncedHandleSave"
          :disabled="isDisabled"
          type="button"
        >
        {{ $t('Common.next') }}
        </button>
        <button 
          v-else
          @click="debouncedHandleSave"
          :disabled="isDisabled"
          type="button"
        >
          {{ $t('Common.next') }}
        </button>
      </div>
      <div class="btn--bottom btn--bottom-line">
        <button type="button" @click="handleBack">
          {{ $t('Common.prev') }}
        </button>
      </div>
    </div>
  </div>

  <!-- 직접 입력 가이드 팝업 -->
  <DirectInputGuidePopup 
    :isOpen="showGuidePopup" 
    type="body"
    @close="closeGuidePopup"
  />

  <!-- 0값 경고 팝업 -->
  <BasePopup v-if="showZeroValuePopup" class="CheckupBlood--popup">
    <template v-slot:contents>
      <div class="CheckupBlood--pop-con">
        <p class="pop-text-light">
          {{ zeroValueFieldName }} {{ $t('BodyCompositionPop.zeroValueWarning') }}
        </p>
        <p class="pop-text-bold">
          {{ $t('BodyCompositionPop.zeroValueConfirm') }}
        </p>
      </div>
      <div class="pop-btn-wrap">
        <button type="button" class="pop-btn pop-btn--gray" @click="closeZeroValuePopup">
          {{ $t('CheckupBasics.text3') }}
        </button>
        <button type="button" class="pop-btn pop-btn--green" @click="continueWithZeroValue">
          {{ $t('CheckupBasics.text4') }}
        </button>
      </div>
    </template>
  </BasePopup>
</template>