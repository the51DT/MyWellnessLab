<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import BasePopupTit from '@/components/BasePopupTit.vue'
import BasePopup from '@/components/BasePopup.vue'
import BaseInput2 from '@/components/BaseInput2.vue'
import BaseCheckupDateCalendar from '@/components/BaseCheckupDateCalendar.vue'
import { bodyScroll } from '@/assets/js/common'

const store = useStore()
const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  showBodyKeyLogin: {
    type: Boolean,
    default: false
  },
  showBodyKeyResult: {
    type: Boolean,
    default: false
  },
  showBodyKeyDetail: {
    type: Boolean,
    default: false
  },
  showResultPopup: {
    type: Boolean,
    default: false
  },
  resultMessage: {
    type: String,
    default: ''
  },
  resultType: {
    type: String,
    default: 'success'
  },
  bodyKeyDataList: {
    type: Array,
    default: () => []
  },
  bodyCompositionDataList: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  selectedBodyKeyData: {
    type: Object,
    default: null
  },
  selectedDataType: {
    type: String,
    default: null
  },
  formatDatetime: {
    type: Function,
    required: true
  },
  loginFailed: {
    type: Boolean,
    default: false
  }
})

// 일회성 검사인지 확인
const isOneTimeAnalysis = computed(() => {
  return store.getters['checkup/getAnalysisType'] === 'onetime'
})

// 직접 입력 시 필수 필드들이 모두 입력되었는지 확인
const isDirectInputValid = computed(() => {
  if (props.selectedDataType !== 'custom') {
    return true // 직접 입력이 아닌 경우 항상 활성화
  }
  
  const data = props.selectedBodyKeyData
  if (!data) return false
  
  // 필수 필드들: 키, 체중, 골격근량, 체지방량, 체지방률
  const requiredFields = ['ht', 'wt', 'wbtBfMass', 'wbtBfPercent', 'wbtSmMass', 'ramMass', 'ramPercent', 'lamMass', 'lamPercent', 'rlmMass', 'rlmPercent', 'llmMass', 'llmPercent', 'trkMass', 'trkPercent']
  
  return requiredFields.every(field => {
    const value = data[field]
    return value !== null && value !== undefined && value !== '' && String(value).trim() !== ''
  })
})

// 로컬 상태로 관리
const bodyKeyId = ref('')
const bodyKeyPassword = ref('')
const showDirectInputDateSelection = ref(false)
const selectedCalendarDate = ref(null)
const hasLoginError = ref(false)
const isAnalyzing = ref(false) // 분석 중 상태 추가
const showPassword = ref(false) // 비밀번호 보임/숨김 상태
const isPasswordToggleActive = ref(false) // 토글 버튼 활성 상태

// 0값 검증 관련 상태
const showZeroValuePopup = ref(false)
const zeroValueFieldName = ref('')
const currentZeroFieldKey = ref('') // 현재 팝업에 표시 중인 필드 키
const confirmedZeroFields = ref([]) // 이미 "계속"을 누른 필드들

// 부모로부터 로그인 실패 상태를 받아서 hasLoginError에 반영
const updateLoginError = () => {
  if (props.loginFailed) {
    hasLoginError.value = true
  }
}

// props.loginFailed가 변경될 때마다 에러 상태 업데이트
watch(() => props.loginFailed, updateLoginError, { immediate: true })

const emit = defineEmits([
  'close',
  'update:selectedBodyKeyData',
  'update:showBodyKeyDetail',
  'handleBodyKeyLogin',
  'selectBodyKeyData',
  'selectExistingBodyComposition',
  'confirmBodyKeyData',
  'analyzeSelectedBodyKeyData',
  'closeBodyKeyDetail',
  'handleDirectInput',
  'refreshAnalysisData',
  'closeResultPopup'
])

const closePopup = () => {
  emit('close')
}

// 로그인 처리
const handleBodyKeyLogin = () => {
  if (!bodyKeyId.value || !bodyKeyPassword.value) {
    hasLoginError.value = true
    return
  }
  
  // 부모에게 로그인 데이터 전달
  emit('handleBodyKeyLogin', {
    bodyKeyId: bodyKeyId.value,
    bodyKeyPassword: bodyKeyPassword.value
  })
}

// 입력 필드 변경 시 에러 상태 제거 및 숫자만 허용
const handleInputChange = () => {
  if (hasLoginError.value) {
    hasLoginError.value = false
  }
  
  // bodyKeyId는 숫자만 허용
  bodyKeyId.value = bodyKeyId.value.replace(/[^0-9]/g, '')
}

// 비밀번호 보임/숨김 토글
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  isPasswordToggleActive.value = true
  
  // 짧은 시간 후 활성 상태 해제
  setTimeout(() => {
    isPasswordToggleActive.value = false
  }, 150)
}

// 체성분 데이터 상세 닫기
const closeBodyKeyDetail = () => {
  emit('closeBodyKeyDetail');
}

// '직접 입력' 버튼 클릭 시 날짜 선택 화면을 보여주는 함수
const startDirectInputProcess = () => {
  showDirectInputDateSelection.value = true;
}

// 날짜 선택 후 체성분 상세 입력 화면으로 넘어가는 함수
const confirmDateAndShowDetail = () => {
  showDirectInputDateSelection.value = false; // 날짜 선택 화면 닫기
  
  // 선택된 날짜를 포함하여 부모 컴포넌트에 '직접 입력' 상세 팝업을 열라고 알림
  emit('handleDirectInput', selectedCalendarDate.value); 
}

// 캘린더에서 날짜가 선택될 때 호출되는 함수
const handleDateChange = (date) => {
  selectedCalendarDate.value = date
}

// 오늘 이후 날짜인지 확인하는 computed 속성
const isFutureDate = computed(() => {
  if (!selectedCalendarDate.value) return false
  
  const curDate = new Date()
  const checked = new Date(selectedCalendarDate.value.replace(/\./g, '-'))
  
  return checked > curDate
})

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

/**
 * 체성분 입력값에 0이 있는지 검증
 * @returns {boolean} 유효하면 true, 0값이 있으면 false
 */
const validateZeroValues = () => {
  // 직접 입력 모드가 아니면 검증 스킵
  if (props.selectedDataType !== 'custom') {
    return true
  }
  
  const data = props.selectedBodyKeyData
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
  
  // 모든 0값 필드를 확인했으면 분석 진행
  confirmedZeroFields.value = [] // 초기화
  proceedAnalyze()
}

/**
 * 실제 분석 진행 함수
 */
const proceedAnalyze = async () => {
  isAnalyzing.value = true // 분석 시작
  try {
    // 부모 컴포넌트에 분석 요청 이벤트 전송
    const result = await emit('analyzeSelectedBodyKeyData')
    if (result && result.success && result.action === 'closePopup') {
      // 성공 시 closePopup 이벤트 emit
      emit('closePopup')
    }
  } catch (error) {
    console.error('분석 처리 중 오류:', error)
  } finally {
    setTimeout(() => {
      isAnalyzing.value = false // 분석 완료
    }, 3000)
  }
}

// 분석 버튼 클릭 처리
const handleAnalyzeClick = async () => {
  if (isAnalyzing.value) return // 이미 분석 중이면 리턴
  
  // 0값 검증
  if (!validateZeroValues()) {
    return // 팝업이 표시되고 여기서 중단
  }
  
  // 검증 통과 시 분석 진행
  proceedAnalyze()
}

// isOpen 상태 변화에 따라 스크롤 제어
watch(() => props.isOpen, (newVal) => {
  bodyScroll(!newVal)
})
</script>

<template>
  <base-popup-tit @popupClose="closePopup" v-if="isOpen" class="popup BodyCompositionPop">
    <!-- 팝업 상단 타이틀 -->
    <template v-slot:title>
      <span v-if="!showBodyKeyLogin && !showBodyKeyResult && !showDirectInputDateSelection">{{ $t('BodyCompositionPop.text1')}}</span>
      <span v-else-if="showBodyKeyLogin">{{ $t('BodyCompositionPop.text8')}}</span>
      <span v-else-if="showDirectInputDateSelection">{{ $t('BodyCompositionPop.text38')}}</span>
      <span v-else>{{ $t('BodyCompositionPop.text3')}}</span>
    </template>

    <template v-slot:contents>

      <!-- step 1 : 체성분 데이터 선택 팝업 -->
      <div v-if="!showBodyKeyLogin && !showBodyKeyResult && !showDirectInputDateSelection" class="BodyCompositionPop-con-wrap">
        <!-- 기존 체성분 데이터 리스트 -->
        <div class="BodyCompositionPop-con">

          <!-- 측정 결과 없을 때 -->
          <div v-if="bodyCompositionDataList.length === 0 || isOneTimeAnalysis" class="BodyCompositionPop-con--no-data">
            <div class="BodyCompositionPop-con--no-data-wrap">
              <img class="BodyCompositionPop-con--img" src="/img/ic_no-data.png">
              <p class="BodyCompositionPop-con--text">
                <span class="BodyCompositionPop-con--text-light">{{ $t('BodyCompositionPop.text5')}}</span>
                {{ $t('BodyCompositionPop.text11')}}
              </p>
              <p class="BodyCompositionPop-con--desc" v-html="$t('BodyCompositionPop.text7')"></p>
            </div>
          
            <!-- 선택 버튼들 -->
            <div class="BodyCompositionPop-btn">
              <!-- 일회성 검사가 아닌 경우에만 BodyKey 로그인 버튼 표시 -->
              <div v-if="!isOneTimeAnalysis" class="btn--bottom">
                <button type="button" @click="$emit('update:showBodyKeyLogin', true)">
                  {{ $t('BodyCompositionPop.text8')}}
                </button>
              </div>
              <div class="btn--bottom btn--bottom-line">
                <button type="button" @click="startDirectInputProcess">
                  {{ $t('BodyCompositionPop.text9')}}
                </button>
              </div>
            </div>
          </div>

          <!-- 측정 결과 있을 때 -->
          <div v-else class="BodyCompositionPop-con--data">
            <p class="BodyCompositionPop-con--text">
              <span class="BodyCompositionPop-con--text-light">{{ $t('BodyCompositionPop.text5')}}</span>
              <span class="BodyCompositionPop-con--text-color">{{ bodyCompositionDataList.length }}{{ $t('BodyCompositionPop.text33')}}</span>{{ $t('BodyCompositionPop.text6')}}
            </p>
            <div class="BodyCompositionPop-con--list">
              <div
                v-for="(item, index) in bodyCompositionDataList"
                :key="index"
                class="data-item"
                @click="$emit('selectExistingBodyComposition', item)"
              >
                {{ item.surveyDate }}
              </div>
            </div>

            <!-- 선택 버튼들 -->
            <div class="BodyCompositionPop-btn scroll-btn-wrap">
              <div class="btn--bottom">
                <button type="button" @click="$emit('update:showBodyKeyLogin', true)">
                  {{ $t('BodyCompositionPop.text8')}}
                </button>
              </div>
              <div class="btn--bottom btn--bottom-line">
                <button type="button" @click="startDirectInputProcess">
                  {{ $t('BodyCompositionPop.text9')}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 직접 입력 > 측정일 선택 -->
      <div v-else-if="showDirectInputDateSelection" class="BodyCompositioDatePickPop">
        <div class="AnalyzeCheckDateSelect">
          <div class="AnalyzeCheckDateSelect--contents">
            <div class="AnalyzeCheckDateSelect--msg">
              {{ $t('BodyCompositionPop.text39') }}
            </div>
            <BaseCheckupDateCalendar class="CheckupBasics--date" @date-change="handleDateChange" />
          </div>
        </div>
        
        <div class="BodyCompositionPop-btn">
          <div class="btn--bottom">
            <button type="button" @click="confirmDateAndShowDetail" :disabled="isFutureDate">
              {{ $t('Common.next') }}
            </button>
          </div>
          <div class="btn--bottom btn--bottom-line">
            <button type="button" @click="showDirectInputDateSelection = false">
              {{ $t('Common.prev') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- step 2: 바디키에서 가져오기, 바디키 로그인 팝업 -->
      <div v-else-if="showBodyKeyLogin" class="BodyCompositionPop-BodykeyLogin">
        <div class="BodyCompositionPop-BodykeyLogin--con">
          <div class="BodyCompositionPop-BodykeyLogin--con--input">
            <label for="bodyKeyId">
              {{ $t('BodyCompositionPop.text12')}}
              <span>({{ $t('BodyCompositionPop.text13')}})</span>
            </label>
              <input 
               id="bodyKeyId"
               v-model="bodyKeyId"
               type="text" 
               inputmode="numeric"
               pattern="[0-9]*"
               :placeholder="$t('BodyCompositionPop.text36')"
               @input="handleInputChange"
             />
          </div>
          <!-- error시 아래 div에 input-error 클래스 추가되도록 개발 요망
           (input-error 클래스 추가시 아래 에러 메시지도 보이게 퍼블 작업 해두었습니다)
            -->
          <div class="BodyCompositionPop-BodykeyLogin--con--input" :class="{ 'input-error': hasLoginError }">
             <label for="bodyKeyPassword">{{ $t('BodyCompositionPop.text14')}}</label>
             <div class="password-input-wrapper">
               <input
                 id="bodyKeyPassword"
                 v-model="bodyKeyPassword"
                 :type="showPassword ? 'text' : 'password'"
                 :placeholder="$t('BodyCompositionPop.text37')"
                 @input="handleInputChange"
               />
               <button 
                 type="button" 
                 :class="['password-toggle-btn', { 'password-toggle-btn-active': isPasswordToggleActive }]"
                 @click="togglePasswordVisibility"
               >
                 <img 
                   :src="showPassword ? '/img/icon-show.svg' : '/img/icon-hide.svg'" 
                   :alt="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
                 />
               </button>
             </div>
             <p class="error-message">{{ $t('BodyCompositionPop.text15')}}</p>
           </div>
           <p class="BodyCompositionPop-BodykeyLogin--con--guide-text">
            {{ $t('BodyCompositionPop.text44') }}</p>
        </div>
        
        <div class="BodyCompositionDetailPop-btn BodyCompositionPop-BodykeyLogin--btn">
          <div class="btn--bottom">
            <button @click="handleBodyKeyLogin" :disabled="isLoading" type="button">
              {{ $t('Common.confirm')}}
            </button>
          </div>
          <div class="btn--bottom btn--bottom-line">
            <button @click="$emit('update:showBodyKeyLogin', false)" type="button">{{ $t('Common.prev') }}</button>
          </div>
        </div>
      </div>
      
      <!-- 바디키 조회 결과 리스트 -->
      <div v-else-if="showBodyKeyResult" class="BodyCompositionPop-con-wrap">
        <!-- 바디키 데이터 리스트 -->
        <div class="BodyCompositionPop-con">

          <!-- 바디키 데이터 없을 때 -->
          <div v-if="bodyKeyDataList.length === 0" class="BodyCompositionPop-con--no-data">
            <div class="BodyCompositionPop-con--no-data-wrap">
              <img class="BodyCompositionPop-con--img" src="/img/ic_no-data.png">
              <p class="BodyCompositionPop-con--text">
                {{ $t('BodyCompositionPop.text16') }}
              </p>
              <p class="BodyCompositionPop-con--desc">{{ $t('BodyCompositionPop.text34') }}</p>
            </div>

            <!-- 선택 버튼들 -->
            <div class="BodyCompositionPop-btn">
              <div class="btn--bottom">
                <button @click="$emit('handleDirectInput')" type="button">
                  {{ $t('BodyCompositionPop.text9') }}
                </button>
              </div>
              <div class="btn--bottom btn--bottom-line">
                <button @click="$emit('update:showBodyKeyResult', false)" type="button">
                  {{ $t('Common.prev') }}
                </button>
              </div>
            </div>
          </div>

          <!-- 바디키 데이터 있을 때 -->
          <div v-else class="BodyCompositionPop-con--data bodykey">
            <p class="BodyCompositionPop-con--text">
              <span class="BodyCompositionPop-con--text-light">{{ $t('BodyCompositionPop.text41') }}</span>
              <span class="BodyCompositionPop-con--text-color">{{ bodyKeyDataList.length }}{{ $t('BodyCompositionPop.text42') }}</span>{{ $t('BodyCompositionPop.text43') }}.
            </p>
            <div class="BodyCompositionPop-con--list">
              <div 
                v-for="(item, index) in bodyKeyDataList" 
                :key="index"
                :class="['data-item', { selected: selectedBodyKeyData === item }]"
                @click="$emit('selectBodyKeyData', item)"
              >
                {{ formatDatetime(item.datetimes) }}
              </div>
            </div>

            <!-- 선택 버튼 -->
            <div class="BodyCompositionPop-btn scroll-btn-wrap">
              <div class="btn--bottom">
                <button @click="$emit('update:showBodyKeyResult', false)" type="button">
                  {{ $t('Common.prev') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </base-popup-tit>
  
  <!-- 바디키 상세 정보 팝업 -->
  <base-popup-tit @popupClose="closeBodyKeyDetail" v-if="showBodyKeyDetail" class="openPopContinue BodyCompositionDetailPop">
    <template v-slot:title>
      <span>{{ $t('BodyCompositionPop.text4')}}</span>
    </template>
    
    <template v-slot:contents>
      <div class="BodyCompositionDetailPop-con">
        <div class="BodyCompositionDetailPop-con--list">
          
          <!-- 측정일 표시 (직접 입력 모드가 아닐 때만) -->
          <div v-if="selectedDataType !== 'custom'" class="BodyCompositionDetailPop-con--date">
            {{ $t('BodyCompositionPop.text17') }}: {{ selectedBodyKeyData?.surveyDate || formatDatetime(selectedBodyKeyData?.datetimes) }}
          </div>
          <div v-else class="BodyCompositionDetailPop-con--date">
            {{ $t('BodyCompositionPop.text34') }}
          </div>
          
          <!-- 직접 입력 모드일 때는 입력 필드, 그 외에는 읽기 전용 -->
          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.height')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedBodyKeyData?.ht"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  ht: value,
                });
              }
            "
            :maxlength="5"
            :fixed="1"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text18') }}
            </template>
            <template v-slot:suffix>
              <span>cm</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.weight')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedBodyKeyData?.wt"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  wt: value,
                });
              }
            "
            :maxlength="5"
            :fixed="1"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text19') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.bfm')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.smm : selectedBodyKeyData?.wbtSmMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  wbtSmMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text22') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pbf')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.bfm : selectedBodyKeyData?.wbtBfMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  wbtBfMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text20') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.smm')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.pbf : selectedBodyKeyData?.wbtBfPercent"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  wbtBfPercent: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text21') }}
            </template>
            <template v-slot:suffix>
              <span>%</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.lra')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.lra : selectedBodyKeyData?.ramMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  ramMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text23') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilra')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.pilra : selectedBodyKeyData?.ramPercent"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  ramPercent: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text24') }}
            </template>
            <template v-slot:suffix>
              <span>%</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.lra')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.lla : selectedBodyKeyData?.lamMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  lamMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text27') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilra')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.pilla : selectedBodyKeyData?.lamPercent"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  lamPercent: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text28') }}
            </template>
            <template v-slot:suffix>
              <span>%</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.lll')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.lt : selectedBodyKeyData?.trkMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  trkMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text31') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilra')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.pilt : selectedBodyKeyData?.trkPercent"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  trkPercent: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text32') }}
            </template>
            <template v-slot:suffix>
              <span>%</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilla')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.lrl : selectedBodyKeyData?.rlmMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  rlmMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text25') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilra')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.pilrl : selectedBodyKeyData?.rlmPercent"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  rlmPercent: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text26') }}
            </template>
            <template v-slot:suffix>
              <span>%</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilrl')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.lll : selectedBodyKeyData?.llmMass"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  llmMass: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text29') }}
            </template>
            <template v-slot:suffix>
              <span>kg</span>
            </template>
          </BaseInput2>

          <BaseInput2
            class="BodyCompositionDetailPop-input"
            :placeholder="t('BodyCompositionPopup.placeholder.pilll')"
            :disabled="selectedDataType !== 'custom'"
            :value="selectedDataType === 'bodykey' ? selectedBodyKeyData?.pilll : selectedBodyKeyData?.llmPercent"
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
            @input="
              (value) => {
                $emit('update:selectedBodyKeyData', {
                  ...selectedBodyKeyData,
                  llmPercent: value,
                });
              }
            "
            :maxlength="5"
            :fixed="2"
          >
            <template v-slot:label>
              {{ $t('BodyCompositionPop.text30') }}
            </template>
            <template v-slot:suffix>
              <span>%</span>
            </template>
          </BaseInput2>
        </div>
        
        <div class="BodyCompositionDetailPop-btn">
          <div class="btn--bottom">
            <button 
              @click="handleAnalyzeClick" 
              type="button"
              :disabled="!isDirectInputValid || isAnalyzing"
              :class="{ disabled: !isDirectInputValid || isAnalyzing }"
            >
              <span v-if="selectedDataType !== 'custom'">
                {{ $t('BodyCompositionPop.text10') }}
              </span>
              <span v-else>
                {{ $t('BodyCompositionPop.text35') }}
              </span>
            </button>
          </div>
          <div class="btn--bottom btn--bottom-line">
            <button @click="$emit('closeBodyKeyDetail')" type="button">{{ $t('Common.prev') }}</button>
          </div>
        </div>
      </div>
    </template>
  </base-popup-tit>
  
  <!-- 결과 팝업 -->
  <BasePopup v-if="showResultPopup" class="CheckupComplete--body-info">
    <template v-slot:contents>
        <p class="pop-text-bold">{{ resultMessage }}</p>
        <div class="pop-btn-wrap">
          <button @click="$emit('closeResultPopup')" type="button" class="pop-btn pop-btn--green">
            {{ $t('Common.confirm') }}
          </button>
        </div>
    </template>
  </BasePopup>

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

  <!-- 분석 중 로딩 팝업 -->
  <base-popup v-if="isAnalyzing" class="openPopContinue" style="z-index: 10000;">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('CheckupComplete.text17')}}</p>
      <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
  background-color: #7ED47C;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6746F;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6AE5A;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
  background-color: #7ED47C;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>