<script setup>
import { ref, computed, onBeforeMount, inject, watch } from 'vue'
import { useStore } from 'vuex'

import BaseStep from '@/components/BaseStep.vue'
import BasePopup from '@/components/BasePopup.vue'
import BaseCheckupDate from '@/components/BaseCheckupDate.vue'
import DirectInputGuidePopup from '@/components/DirectInputGuidePopup.vue'
import CheckupBasicsBasic from './CheckupBasicsBasic.vue'
import CheckupBasicsBody from './CheckupBasicsBody.vue'
import CheckupBasicsBlood from './CheckupBasicsBlood.vue'

import * as checkupApi from '@/apis/checkup'
import {useMoveNext, useMovePrev} from '@/composables/checkup'
import { bodyScroll, isValidDate, calcAge } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import message from '@/components/message'

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const movePrev = useMovePrev()
const router = useRouter()


const user = store.getters.getUser
const nhisData = store.getters['checkup/getNhisData']
const healthDataType = store.getters['checkup/getHealthDataType']
const analysisType = store.getters['checkup/getAnalysisType']
const basicsId = store.getters['checkup/getBasicsId']

const validMsg = ref('')
const popup = ref(false)
const isProcessing = ref(false)
let debounceTimeout = null

const formData = ref({
  id: null,
  commonId: null,
  name: '',
  age: null,
  bmi: null,
  dbp: null,
  ht: null,
  sbp: null,
  sex: null,
  wc: null,
  wt: null,
  healthDataName: '',
  healthDataType: '',
  birthDate: '',
  checkDate: '',
  createdDate: '',
  modifiedDate: ''
})

const nextDisabled = computed(() => {
  if (isProcessing.value) {
    return true
  }
  
  // null, undefined만 체크 (0은 유효한 값으로 처리)
  const hasAge = formData.value.age !== null && formData.value.age !== undefined
  const hasSex = formData.value.sex !== -1
  const hasHt = formData.value.ht !== null && formData.value.ht !== undefined && formData.value.ht !== ''
  const hasWc = formData.value.wc !== null && formData.value.wc !== undefined && formData.value.wc !== ''
  const hasWt = formData.value.wt !== null && formData.value.wt !== undefined && formData.value.wt !== ''
  const hasSbp = formData.value.sbp !== null && formData.value.sbp !== undefined && formData.value.sbp !== ''
  const hasDbp = formData.value.dbp !== null && formData.value.dbp !== undefined && formData.value.dbp !== ''
  
  return !(hasAge && hasSex && hasHt && hasWc && hasWt && hasSbp && hasDbp)
})

const validateData = {
  AGERange: {
    min: 0,
    max: 120
  },
  HTRange: {
    min: 0,
    max: 198
  },
  WTRange: {
    min: 0,
    max: 164.8
  },
  WCRange: {
    min: 0,
    max: 160
  },
  SBPRange: {
    min: 0,
    max: 240
  },
  DBPRange: {
    min: 0,
    max: 160
  },
  GLURange: {
    min: 0,
    max: 200
  },
  TCRange: {
    min: 68,
    max: 482
  },
  LDLRange: {
    min: 0,
    max: 382.6
  },
  HDLRange: {
    min: 5.918,
    max: 145.298
  },
  TGRange: {
    min: 19,
    max: 2455
  },
  GOTRange: {
    min: 1,
    max: 732
  },
  GPTRange: {
    min: 8,
    max: 927
  },
  CREARange: {
    min: 0.2,
    max: 14.38
  },
  HBRange: {
    min: 5,
    max: 21.3
  }
}

const isShowEmptyNhisAlret = ref(false)
const ignoreValidate = ref({
  ht: false,
  wt: false,
  wc: false,
  sbp: false,
  dbp: false
})
const validateErrKey = ref('')
const validRange = ref({
  min: 0,
  max: 999
})
const showGuidePopup = ref(false) /* 직접 입력 가이드 팝업 */

const validateBirthdate = computed(() => {
  // Safari 호환성을 위해 isValidDate 함수 사용
  const birthDateValid = isValidDate(formData.value.birthDate)
  const ageValid = !Number.isNaN(formData.value.age) && 
                   formData.value.age >= validateData.AGERange.min && 
                   formData.value.age <= validateData.AGERange.max
  
  return formData.value.isBirthDayValidate && birthDateValid && ageValid
})

const validateHt = computed(() => {
  return !(((formData.value.ht <= validateData.HTRange.min || formData.value.ht > validateData.HTRange.max)))
})

const validateWt = computed(() => {
  return !(((formData.value.wt <= validateData.WTRange.min || formData.value.wt > validateData.WTRange.max)))
})

const validateWc = computed(() => {
  return !(((formData.value.wc <= validateData.WCRange.min || formData.value.wc > validateData.WCRange.max)))
})

const validateSbp = computed(() => {
  return !(((formData.value.sbp <= validateData.SBPRange.min || formData.value.sbp > validateData.SBPRange.max)))
})

const validateDbp = computed(() => {
  return !(((formData.value.dbp <= validateData.DBPRange.min || formData.value.dbp > validateData.DBPRange.max)))
})

const isShowInfoModal = ref(true)

const closeInfoModal = () => {
  isShowInfoModal.value = false
  bodyScroll(true)
}

// 일회성 검사 여부
const isOneTime = computed(() => {
  return analysisType === 'onetime'
})

const emptyNhisStr = computed(() => {
  const form = {
    name: {
      label: '이름',
      value: nhisData.name
    },
    age: {
      label: '나이',
      value: nhisData.age
    },
    ht: {
      label: '신장',
      value: nhisData.ht
    },
    wt: {
      label: t('CheckupBasics.text15'),
      value: nhisData.wt
    },
    wc: {
      label: t('CheckupBasics.text16'),
      value: nhisData.wc
    },
    sbp: {
      label: t('CheckupBasics.text17'),
      value: nhisData.sbp
    },
    dbp: {
      label: t('CheckupBasics.text18'),
      value: nhisData.dbp
    }
  }

  const result = []

  for (const key in form) {
    if (!form[key].value) {
      result.push(form[key].label)
    }
  }

  return result.join(', ')
})

function setInputValue (val) {
  formData.value = {
    ...formData.value,
    ...val
  }
}

// debounce를 적용한 basicInfoValidate 함수
const debouncedBasicInfoValidate = () => {
  // 이미 처리 중이면 중복 실행 방지 (즉시 체크)
  if (isProcessing.value) {
    return
  }
  
  // 버튼 클릭 즉시 처리 상태로 변경하여 비활성화
  isProcessing.value = true
  
  // 기존 timeout이 있으면 클리어
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  // 300ms 후에 실행되도록 debounce 적용
  debounceTimeout = setTimeout(() => {
    basicInfoValidate()
  }, 300)
}

function basicInfoValidate () {
  try {
    if (isOneTime.value && !validateBirthdate.value) {
      alert(t('CheckupBasics.text7'))
      isProcessing.value = false
      return false
    }
    
    // 일회성 검사에서 생년월일이 있을 때 만 19세 미만 검증
    if (isOneTime.value && formData.value.birthDate) {
      const age = calcAge(formData.value.birthDate)
      if (age < 19) {
        message.alert(t('CheckupBasicsBasic.text8'))
        isProcessing.value = false
        return false
      }
    }
    let validFlag = true
    let failedValue
    let failedFieldName
    const failedMsgPrefix = ' ' + t('CheckupBasics.text8') + ' '
    const failedMsgSuffix = t('CheckupBasics.text9') + ' '

    for (const key in ignoreValidate.value) {
      if (!ignoreValidate.value[key]) {
        validateErrKey.value = key

        switch (key) {
          case 'ht':
            if (!validateHt.value) {
              failedFieldName = t('CheckupBasics.text10')
              validFlag = validateHt.value
              failedValue = formData.value.ht
              validRange.value.min = validateData.HTRange.min
              validRange.value.max = validateData.HTRange.max
            }
            break
          case 'wt':
            if (!validateWt.value) {
              failedFieldName = t('CheckupBasics.text11')
              validFlag = validateWt.value
              failedValue = formData.value.wt
              validRange.value.min = validateData.WTRange.min
              validRange.value.max = validateData.WTRange.max
            }
            break
          case 'wc':
            if (!validateWc.value) {
              failedFieldName = t('CheckupBasics.text12')
              validFlag = validateWc.value
              failedValue = formData.value.wc
              validRange.value.min = validateData.WCRange.min
              validRange.value.max = validateData.WCRange.max
            }
            break
          case 'sbp':
            if (!validateSbp.value) {
              failedFieldName = t('CheckupBasics.text13')
              validFlag = validateSbp.value
              failedValue = formData.value.sbp
              validRange.value.min = validateData.SBPRange.min
              validRange.value.max = validateData.SBPRange.max
            }
            break
          case 'dbp':
            if (!validateDbp.value) {
              failedFieldName = t('CheckupBasics.text14')
              validFlag = validateDbp.value
              failedValue = formData.value.dbp
              validRange.value.min = validateData.DBPRange.min
              validRange.value.max = validateData.DBPRange.max
            }
            break
        }
        if (failedFieldName !== undefined) {
          validMsg.value = failedFieldName + failedMsgPrefix + failedValue + failedMsgSuffix
          validFlag = false
          popup.value = true
          break
        }
      } else {
        validFlag = true
        continue
      }
    }
    if (validFlag) {
      // handleSave는 async 함수이므로 여기서는 isProcessing 해제하지 않음
      handleSave()
    } else {
      // 유효성 검사 실패 시 처리 상태 해제하지 않음 (팝업이 떠있는 상태)
      // 팝업에서 사용자가 선택할 때까지 버튼 비활성화 유지
    }
  } catch (e) {
    console.error('basicInfoValidate error:', e)
    // 예외 발생 시에만 처리 상태 해제
    isProcessing.value = false
  }
};

function validContinue () {
  ignoreValidate.value[validateErrKey.value] = true
  popup.value = false
  // 팝업에서 계속하기 선택 시 처리 상태는 이미 true이므로 유지
  basicInfoValidate()
}

function popupClose () {
  popup.value = false
  // 팝업 닫을 때 처리 상태 해제
  isProcessing.value = false
}

const handleSave = async () => {
  // basicInfoValidate에서 이미 isProcessing을 true로 설정했으므로 
  // 여기서는 중복 체크하지 않고 바로 진행
  if (!isProcessing.value) {
    isProcessing.value = true
  }
  try {
    delete formData.value.createdDate
    delete formData.value.modifiedDate

    // 2024.04.12 '-' 구분자로된 생년월일을 간헐적으로 받게 되어 에러발생
    // (사용자 정보 업데이트시 UAT 프로필정보로 추정. 로그인하면 MWL 사용자정보로 덮어쓰나... 간헐적으로 안되는 경우가 있는듯...)
    formData.value.birthDate = formData.value.birthDate.replace(/\-/gi, '.')

    // 검진일 기준으로 나이를 다시 계산하여 최신 값으로 업데이트
    const calculatedAge = calcAge(formData.value.birthDate, formData.value.checkDate)
    formData.value.age = calculatedAge

    let params = {
      basics: {
        ...formData.value,
        name: '@@@',
        healthDataType
      }
    }

    let response = null

    if (params.basics.id) {
      params = {
        ...params,
        basicsId
      }
      response = await checkupApi.updateBasicsTemporary(params)
    } else {
      const { nonRequired } = store.getters['checkup/getTermsCheck']
      response = await checkupApi.setBasicsTemporary(analysisType, nonRequired ? 'Y' : 'N', params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.basics.id)

      await moveNext()
      // 성공 시 다음 페이지로 이동하므로 isProcessing 상태 유지 (버튼 비활성화 유지)
    } else {
      // 응답이 없거나 중지 상태일 때 버튼 재활성화
      isProcessing.value = false
    }
  } catch (e) {
    console.error(e)
    // 에러 발생 시에만 버튼 재활성화
    isProcessing.value = false
  }
}

const handleBack = async () => {
  if (isOneTime.value) {
    router.push({ name: 'CheckupDateSelect' })
  } else {
    await movePrev()
  }
}

const getBasicsTemporary = async (id) => {
  try {
    if (!id) {
      return null
    }

    const response = await checkupApi.getBasicsTemporary(id)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const closeEmptyNhisAlret = () => {
  isShowEmptyNhisAlret.value = false
}

/**
 * 상위 라우터(@/layouts/LayoutCheckup.vue)에서 설문 종료시 boolean값 제공
 * @typeof {boolean} isStop
 */
const isStop = inject('stop')

watch(
  () => isStop.value,
  async () => {
    // 임시저장
    await handleSave()
  }
)

const progressbar = ref([])

const goToStep = async (step) => {
  // step 2 클릭, ptype: blood, inputYn: 'Y' + nextDisabled === false 체크
  if (
      step === 2 &&
      progressbar.value[1]?.ptype === 'blood' &&
      progressbar.value[1]?.inputYn === 'Y' &&
      !nextDisabled.value
  ) {
    // 저장 실행
    await handleSave();

    // 페이지 이동
    moveNext()
  }
}

const openGuidePopup = () => {
  showGuidePopup.value = true
}

const closeGuidePopup = () => {
  showGuidePopup.value = false
}

onBeforeMount(async () => {
  const basicsTemporary = await getBasicsTemporary(basicsId)

  let sex = user.gender === 'MALE' ? 1 : 2

  if (isOneTime.value) {
    sex = -1
  }

  if (basicsTemporary && basicsTemporary.basics) {
    formData.value = {
      ...basicsTemporary.basics,
      name: user.name,
      gender: user.gender === 'MALE' ? t('Common.male') : t('Common.female'),
      isBirthDayValidate: !!isValidDate(basicsTemporary.basics.birthDate)
    }

    progressbar.value = basicsTemporary.progressbar || []
  } else {
    if (healthDataType === 'formal') {
      const targetNhisList = [nhisData.name, nhisData.age, nhisData.ht, nhisData.wt, nhisData.wc, nhisData.sbp, nhisData.dbp]
      const isEmpty = targetNhisList.some((item) => !item)

      if (isEmpty) {
        isShowEmptyNhisAlret.value = true
      }
    }

    formData.value = {
      ...nhisData,
      name: user.name,
      sex,
      gender: user.gender === 'MALE' ? t('Common.male') : t('Common.female')
    }
    progressbar.value = defaultProgressbar
  }

  // 검진일 검증: 이어하기가 아닌 경우에만 검증
  if (!basicsId && !formData.value.checkDate) {
    console.log('CheckupBasics 페이지 접근 시 검진일 없음 - Home으로 리다이렉트')
    alert(t('Common.invalidAccess'))
    router.push({ name: 'Home' })
    return
  }
})

const defaultProgressbar = [
  { ptype: 'default', inputYn: 'N' }, // 1번: 기본 정보
  { ptype: 'blood', inputYn: 'N' }  // 2번: 혈압 정보 (예시)
]

const computedProgressbar = computed(() => {
  // progressbar에 값이 있으면 slice(1), 없으면 defaultProgressbar.slice(1)
  return progressbar.value.length > 0
      ? progressbar.value.slice(1)
      : defaultProgressbar.slice(1)
})
</script>

<template>
  <section class="CheckupBasics">
<!--    <BaseStep :total="2" :current="1" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar="computedProgressbar"
        :current="1"
        class="CheckupBasics--step"
        @clickStep="goToStep"
    />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ic_basic.svg" alt="기본검사 아이콘">
          </div>
          {{ $t('Router.checkup.text1') }}
        </div>
        <p class="Checkup--contents-date">
          <BaseCheckupDate class="CheckupBasics--date" :checkDate="formData.checkDate" />
        </p>
        <p v-if="healthDataType === 'formal'" class="Checkup--contents-desc">
          {{ $t('CheckupBasics.text22') }}
        </p>
        <button 
          v-if="healthDataType === 'direct'"
          type="button" 
          class="Checkup--contents-guide-btn" 
          @click="openGuidePopup">
          {{ $t('Router.checkup.text31') }}
        </button>
      </div>

      <div class="Checkup--contents-wrapT">
        <!-- 기본 정보 -->
        <CheckupBasicsBasic
          class="CheckupBasics--basic"
          :user="user"
          :basicData="formData"
          :checkDate="formData.checkDate"
          :analysisType="analysisType"
          @update="setInputValue" />

        <!-- 신체 정보 -->
        <CheckupBasicsBody
          class="CheckupBasics--body"
          :basicData="formData"
          :healthDataType="healthDataType"
          @update="setInputValue" />

        <!-- 혈압 정보 -->
        <CheckupBasicsBlood
          class="CheckupBasics--blood"
          :basicData="formData"
          :healthDataType="healthDataType"
          @update="setInputValue" />
      </div>

      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            @click="debouncedBasicInfoValidate"
            :disabled="nextDisabled"
            type="button"
            class="">{{ $t('Common.next') }}</button>
        </div>
        <!-- <div class="btn--bottom btn--bottom-line" v-if="!isOneTime"> -->
        <div class="btn--bottom btn--bottom-line">
          <button
              @click="handleBack"
              type="button"
              class="">{{ $t('Common.prev') }}</button>
        </div>
      </div>
    </div>

    <BasePopup v-if="popup" class="CheckupBlood--popup">
      <template v-slot:contents class="CheckupBlood--popup-wrap">
        <div class="CheckupBlood--pop-con">
          <p class="pop-text-light">
            {{ validMsg }}
          </p>
          <p class="pop-text-bold" v-html="$t('CheckupBasics.text23', { min: validRange.min, max: validRange.max})">
          </p>
        </div>

        <div class="pop-btn-wrap">
          <button type="button" class="pop-btn pop-btn--gray" @click="popupClose">{{ $t('CheckupBasics.text3') }}</button>
          <button type="button" class="pop-btn pop-btn--green" @click="validContinue">{{ $t('CheckupBasics.text4') }}</button>
        </div>
      </template>
    </BasePopup>

    <base-popup v-if="isShowEmptyNhisAlret" class="base-pop">
      <template v-slot:contents>
        <p class="pop-text-light">{{ $t('CheckupBasics.text5') }}</p>
        <p class="pop-text-bold">{{ $t('CheckupBasics.text6') }} <span class="txt--red">{{emptyNhisStr}}</span></p>
        <div class="pop-btn-wrap">
          <button type="button" class="pop-btn pop-btn--green" @click="closeEmptyNhisAlret">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <div v-if="isShowInfoModal" class="popup base-pop checkupGuidePop">
      <div class="popup--wrap tit">
        <div class="popup--header">
          <div class="move-prev">
            <img src="/img/img_checkup_guide1.svg" alt="이전 단계 이동 버튼">
            <p>{{ $t('CheckupGuidePop.text1') }}</p>
          </div>
        </div>
        <div class="popup--space space">
          <p class="CheckupGuidePop--img-wrap">
            <img src="/img/img_checkup_guide2.svg" alt="설문 프로그레스바">
            <span class="CheckupGuidePop--con">{{ $t('CheckupGuidePop.text2') }}</span>
          </p>
          <div class="base-pop--btn-wrap">
            <p class="checkupGuidePop--desc">{{ $t('CheckupGuidePop.text3') }}</p>
            <button class="btn--big6" type="button" @click="closeInfoModal">{{ $t('Common.confirm') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 직접 입력 가이드 팝업 -->
    <DirectInputGuidePopup 
      :isOpen="showGuidePopup" 
      type="basics"
      @close="closeGuidePopup"
    />
  </section>
</template>

<style>
/* 팝업 뜰 때 body scroll 안 되게 임시로 적용한 css, 스크립트 적용되도록 개발 요망 */
body:has(.checkupGuidePop){
  overflow: hidden !important;
}
</style>