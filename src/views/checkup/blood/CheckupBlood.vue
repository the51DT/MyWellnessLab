<script setup>
import { ref, onBeforeMount, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep2 from '@/components/BaseStep2.vue'
import BasePopup from '@/components/BasePopup.vue'
import BaseCheckupDate from '@/components/BaseCheckupDate.vue'
import DirectInputGuidePopup from '@/components/DirectInputGuidePopup.vue'
import CheckupBloodRequire from './CheckupBloodRequire.vue'
import CheckupBloodNonRequire from './CheckupBloodNonRequire.vue'
import {useMoveNext, useMovePrev} from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import { useI18n } from 'vue-i18n'
import BaseStep from "@/components/BaseStep.vue";

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const movePrev = useMovePrev()

const nhisData = store.getters['checkup/getNhisData']
const analysisType = store.getters['checkup/getAnalysisType']
const healthDataType = store.getters['checkup/getHealthDataType']
const basicsId = store.getters['checkup/getBasicsId']

const validateData = {
  AGERange: {
    min: 0,
    max: 120
  },
  HTRange: {
    min: 125.3,
    max: 198
  },
  WTRange: {
    min: 30.6,
    max: 164.8
  },
  WCRange: {
    min: 50.5,
    max: 147.5
  },
  SBPRange: {
    min: 76,
    max: 243
  },
  DBPRange: {
    min: 10,
    max: 148
  },
  GLURange: {
    min: 0,
    max: 200
  },
  TCRange: {
    min: 0,
    max: 400
  },
  LDLRange: {
    min: 0,
    max: 260
  },
  HDLRange: {
    min: 0,
    max: 80
  },
  TGRange: {
    min: 0,
    max: 300
  },
  GOTRange: {
    min: 0,
    max: 80
  },
  GPTRange: {
    min: 0,
    max: 70
  },
  CREARange: {
    min: 0,
    max: 3
  },
  HBRange: {
    min: 0,
    max: 26
  }
}

const isLoading = ref(false)
const isAutoLdl = ref(false)
const isShowEmptyNhisAlret = ref(false)
const childComponent = ref(null)
const isProcessing = ref(false)
const isReady = ref(false)
const savedIsNhisDataEditYn = ref('N') // API에서 받아온 isNhisDataEditYn 상태

// 현재 isNhisDataEditYn 상태를 계산
// - API에서 'Y'를 받아왔거나
// - nhisData에 없는 값을 사용자가 직접 입력했으면 'Y'
const currentIsNhisDataEditYn = computed(() => {
  if (healthDataType !== 'formal') return 'N'
  
  // API에서 이미 'Y'를 받아왔으면 'Y' 유지
  if (savedIsNhisDataEditYn.value === 'Y') return 'Y'
  
  const optionalFields = [
    { nhis: nhisData.tc, form: formData.value.bloodOptional.tc },
    { nhis: nhisData.hdl, form: formData.value.bloodOptional.hdl },
    { nhis: nhisData.tg, form: formData.value.bloodOptional.tg },
    { nhis: nhisData.ldl, form: formData.value.bloodOptional.ldl }
  ]
  
  // nhisData에 없는데 formData에는 값이 있는 경우가 있으면 'Y'
  const hasUserInput = optionalFields.some(
    (field) => !field.nhis && field.form !== null && field.form !== '' && field.form !== undefined
  )
  
  return hasUserInput ? 'Y' : 'N'
})

let debounceTimeout = null

const formData = ref({
  blood: {
    id: null,
    basicsId: null,
    crea: null,
    glu: null,
    got: null,
    gpt: null,
    hb: null
  },
  bloodOptional: {
    id: null,
    bloodId: null,
    hdl: null,
    ldl: null,
    tc: null,
    tg: null
  }
})

const isDisabled = computed(() => {
  // 초기 로딩 중이거나 처리 중이면 비활성화
  if (isLoading.value || isProcessing.value || !isReady.value) {
    return true
  }

  // 필수 항목 검사
  const targetList = [
    formData.value.blood.hb,
    formData.value.blood.glu,
    formData.value.blood.crea,
    formData.value.blood.got,
    formData.value.blood.gpt
  ]

  // 필수 항목 중 하나라도 null이면 비활성화
  if (targetList.filter((item) => item === null).length > 0) {
    return true
  }

  // 선택 항목(bloodOptional) 검사: 하나라도 입력되면 전부 입력되어야 함
  const optionalFields = [
    formData.value.bloodOptional.tc,
    formData.value.bloodOptional.hdl,
    formData.value.bloodOptional.tg,
    formData.value.bloodOptional.ldl
  ]

  // null이 아닌 필드 개수 확인
  const filledCount = optionalFields.filter((item) => item !== null && item !== '').length
  
  // 일부만 입력된 경우 (0개는 OK, 4개 모두 입력도 OK, 1~3개 입력은 NG)
  if (filledCount > 0 && filledCount < 4) {
    return true
  }

  return false
})

const popup = ref(false) /* 팝업 보이고 안보이고 */
const validMsg = ref('')// 입력하신 ~~~는 일상범위가 아닙니다 / 지질대사 저밀도 콜레스테롤이 입력되지 않았습니다.
const showGuidePopup = ref(false) /* 직접 입력 가이드 팝업 */

// Validate variable
const ignoreValidate = ref({
  hb: false,
  glu: false,
  crea: false,
  got: false,
  gpt: false,
  tc: false,
  hdl: false,
  tg: false,
  ldl: false
})

const validateErrKey = ref('')
const validRange = ref({
  min: 0,
  max: 999
})

const validateHb = computed(() => {
  return !(((formData.value.blood.hb <= validateData.HBRange.min || formData.value.blood.hb > validateData.HBRange.max)))
})

const validateGlu = computed(() => {
  return !(((formData.value.blood.glu <= validateData.GLURange.min || formData.value.blood.glu > validateData.GLURange.max)))
})

const validateCrea = computed(() => {
  return !(((formData.value.blood.crea <= validateData.CREARange.min || formData.value.blood.crea > validateData.CREARange.max)))
})

const validateGot = computed(() => {
  return !(((formData.value.blood.got <= validateData.GOTRange.min || formData.value.blood.got > validateData.GOTRange.max)))
})

const validateGpt = computed(() => {
  return !(((formData.value.blood.gpt <= validateData.GPTRange.min || formData.value.blood.gpt > validateData.GPTRange.max)))
})

const validateTc = computed(() => {
  return !(((formData.value.bloodOptional.tc <= validateData.TCRange.min || formData.value.bloodOptional.tc > validateData.TCRange.max)))
})

const validateHdl = computed(() => {
  return !(((formData.value.bloodOptional.hdl <= validateData.HDLRange.min || formData.value.bloodOptional.hdl > validateData.HDLRange.max)))
})

const validateTg = computed(() => {
  return !(((formData.value.bloodOptional.tg <= validateData.TGRange.min || formData.value.bloodOptional.tg > validateData.TGRange.max)))
})

const validateLdl = computed(() => {
  return !(((formData.value.bloodOptional.ldl <= validateData.LDLRange.min || formData.value.bloodOptional.ldl > validateData.LDLRange.max)))
})

const emptyNhisStr = computed(() => {
  const form = {
    hb: {
      label: '혈색소',
      value: nhisData.hb
    },
    glu: {
      label: '공복혈당',
      value: nhisData.glu
    },
    crea: {
      label: '혈청 크레아티닌',
      value: nhisData.crea
    },
    got: {
      label: '아스파테이트 아미노전이효소',
      value: nhisData.got
    },
    gpt: {
      label: '알라닌 아미노전이효소',
      value: nhisData.gpt
    },
    tc: {
      label: '총 콜레스테롤',
      value: nhisData.tc
    },
    hdl: {
      label: '고밀도 콜레스테롤',
      value: nhisData.hdl
    },
    tg: {
      label: '중성지방',
      value: nhisData.tg
    },
    ldl: {
      label: '저밀도 콜레스테롤',
      value: nhisData.ldl
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

/**
 * 상위 라우터(@/layouts/LayoutCheckup.vue)에서 설문 종료시 boolean값 제공
 * @typeof {boolean} isStop
 */
const isStop = inject('stop')

watch(
  () => isStop.value,
  async () => {
    // 임시 저장
    await handleSave()
  }
)

const updateBloodRequire = (value) => {
  formData.value = {
    ...formData.value,
    blood: {
      ...formData.value.blood,
      ...value
    }
  }
}

const updateBloodNonRequire = (value) => {
  formData.value = {
    ...formData.value,
    bloodOptional: {
      ...formData.value.bloodOptional,
      ...value
    }
  }
  console.log('formData: '+ JSON.stringify(formData.value));
}

// debounce를 적용한 bloodInfoValidate 함수
const debouncedBloodInfoValidate = () => {
  // 이미 처리 중이면 중복 실행 방지 (즉시 체크)
  if (isProcessing.value) {
    return
  }
  
  // 기존 timeout이 있으면 클리어
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  // 300ms 후에 실행되도록 debounce 적용
  debounceTimeout = setTimeout(() => {
    bloodInfoValidate()
  }, 300)
}

function bloodInfoValidate () {
  // 이미 처리 중이면 중복 실행 방지
  if (isProcessing.value) {
    return
  }

  isProcessing.value = true

  let validFlag = true// hb glu crea got gpt
  let failedValue
  let failedFieldName = ''
  const failedMsgPrefix = ' ' + t('CheckupBlood.text11') + ' '
  const failedMsgSuffix = t('CheckupBlood.text12')

  for (const key in ignoreValidate.value) {
    if (!ignoreValidate.value[key]) {
      validateErrKey.value = key
      // hb glu crea got gpt  공복혈당 크레아티닌 아스파테이크 전이효소 알라닌 전이효소
      switch (key) {
        case 'hb':
          if (!validateHb.value) {
            failedFieldName = t('CheckupBlood.text13')
            validFlag = validateHb.value
            failedValue = formData.value.blood.hb
            validRange.value.min = validateData.HBRange.min
            validRange.value.max = validateData.HBRange.max
          }
          break
        case 'glu':
          if (!validateGlu.value) {
            failedFieldName = t('CheckupBlood.text14')
            validFlag = validateGlu.value
            failedValue = formData.value.blood.glu
            validRange.value.min = validateData.GLURange.min
            validRange.value.max = validateData.GLURange.max
          }
          break
        case 'crea':
          if (!validateCrea.value) {
            failedFieldName = t('CheckupBlood.text15')
            validFlag = validateCrea.value
            failedValue = formData.value.blood.crea
            validRange.value.min = validateData.CREARange.min
            validRange.value.max = validateData.CREARange.max
          }
          break
        case 'got':
          if (!validateGot.value) {
            failedFieldName = t('CheckupBlood.text16')
            validFlag = validateGot.value
            failedValue = formData.value.blood.got
            validRange.value.min = validateData.GOTRange.min
            validRange.value.max = validateData.GOTRange.max
          }
          break
        case 'gpt':
          if (!validateGpt.value) {
            failedFieldName = t('CheckupBlood.text17')
            validFlag = validateGpt.value
            failedValue = formData.value.blood.gpt
            validRange.value.min = validateData.GPTRange.min
            validRange.value.max = validateData.GPTRange.max
          }
          break
        case 'tc':
          if (!validateTc.value && formData.value.bloodOptional.tc) {
            failedFieldName = t('CheckupBlood.text18')
            validFlag = validateTc.value
            failedValue = formData.value.bloodOptional.tc
            validRange.value.min = validateData.TCRange.min
            validRange.value.max = validateData.TCRange.max
          }
          break
        case 'hdl':
          if (!validateHdl.value && formData.value.bloodOptional.hdl) {
            failedFieldName = t('CheckupBlood.text19')
            validFlag = validateHdl.value
            failedValue = formData.value.bloodOptional.hdl
            validRange.value.min = validateData.HDLRange.min
            validRange.value.max = validateData.HDLRange.max
          }
          break
        case 'tg':
          if (!validateTg.value && formData.value.bloodOptional.tg) {
            failedFieldName = t('CheckupBlood.text20')
            validFlag = validateTg.value
            failedValue = formData.value.bloodOptional.tg
            validRange.value.min = validateData.TGRange.min
            validRange.value.max = validateData.TGRange.max
          }
          break
        case 'ldl':
          if (!validateLdl.value && formData.value.bloodOptional.ldl) {
            failedFieldName = t('CheckupBlood.text21')
            validFlag = validateLdl.value
            failedValue = formData.value.bloodOptional.ldl
            validRange.value.min = validateData.LDLRange.min
            validRange.value.max = validateData.LDLRange.max
          }
          break
      }

      if (failedFieldName) {
        validMsg.value = failedFieldName + failedMsgPrefix + failedValue + failedMsgSuffix
        validFlag = false
        popup.value = true
        break
      }
    } else {
      validFlag = true
    }
  }

  const bloodOptional = formData.value.bloodOptional

  if (validFlag && (bloodOptional.tc && bloodOptional.tg && bloodOptional.hdl) && (bloodOptional.ldl === null || bloodOptional.ldl.length === 0)) {
    isAutoLdl.value = true
  }

  if (!isAutoLdl.value && validFlag) {
    handleSave()
  } else {
    // 처리가 완료되었으므로 isProcessing을 false로 설정
    isProcessing.value = false
  }
}

const cancleAutoLdl = () => {
  isAutoLdl.value = false
  // 자동 LDL 계산 취소 시 처리 상태 해제
  isProcessing.value = false
}

const confirmAutoLdl = () => {
  const bloodOptional = formData.value.bloodOptional
  let val = Number(bloodOptional.tc) - ((Number(bloodOptional.tg / 5)) + Number(bloodOptional.hdl))
  val = val < 0 ? 0 : val

  formData.value.bloodOptional.ldl = Math.trunc(val)
  childComponent.value.changeAutoLow()
  isAutoLdl.value = false
  // 자동 LDL 계산 완료 후 처리 상태 해제 (사용자가 다시 다음 버튼 클릭할 수 있도록)
  isProcessing.value = false
}

function validContinue () {
  ignoreValidate.value[validateErrKey.value] = true
  popup.value = false
  // 처리 상태 초기화 후 재검증
  isProcessing.value = false
  bloodInfoValidate()
}

function popupClose () {
  popup.value = false
  // 팝업 닫을 때 처리 상태 초기화
  isProcessing.value = false
}

const getCommonInfo = async () => {
  const response = await checkupApi.getCommonInfo(analysisType)

  const commonInfo = response.data?.commonInfo

  if (commonInfo) {
    store.dispatch('checkup/setAnalysisType', commonInfo.analysisType)
  }
}

const progressbar = ref([])

const getBloodTemporary = async () => {
  try {
    const response = await checkupApi.getBloodTemporary(basicsId)

    progressbar.value = response.data.progressbar || []
    
    // API에서 bloodOptional 내 isNhisDataEditYn 값 가져오기
    savedIsNhisDataEditYn.value = response.data.bloodOptional?.isNhisDataEditYn || 'N'

    if (response.data.blood) {
      formData.value = response.data
    } else if (healthDataType === 'formal') {
      // 건강검진 데이터
      const targetNhisList = [nhisData.hb, nhisData.glu, nhisData.crea, nhisData.got, nhisData.gpt, nhisData.tc, nhisData.hdl, nhisData.tg, nhisData.ldl]
      const isEmpty = targetNhisList.some((item) => !item)

      if (isEmpty) {
        isShowEmptyNhisAlret.value = true
      }

      formData.value = {
        blood: {
          ...formData.value.blood,
          ...nhisData
        },
        bloodOptional: {
          ...formData.value.bloodOptional,
          ...nhisData
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const handleSave = async (isAutoMove = true) => {
  try {
    // isNhisDataEditYn 결정 로직
    // - formal 모드에서 nhisData에 없는 값을 사용자가 직접 입력한 경우에만 'Y'
    // - direct 모드이거나, nhisData 값을 그대로 사용하거나, 빈 값 그대로 저장하면 'N'
    let isNhisDataEditYn = 'N'
    
    if (healthDataType === 'formal') {
      const optionalFields = [
        { nhis: nhisData.tc, form: formData.value.bloodOptional.tc },
        { nhis: nhisData.hdl, form: formData.value.bloodOptional.hdl },
        { nhis: nhisData.tg, form: formData.value.bloodOptional.tg },
        { nhis: nhisData.ldl, form: formData.value.bloodOptional.ldl }
      ]
      
      // nhisData에 없는데 formData에는 값이 있는 경우가 있으면 'Y'
      const hasUserInput = optionalFields.some(
        (field) => !field.nhis && field.form !== null && field.form !== '' && field.form !== undefined
      )
      
      isNhisDataEditYn = hasUserInput ? 'Y' : 'N'
    }

    const params = {
      blood: {
        ...formData.value.blood,
        basicsId
      },
      bloodOptional: {
        ...formData.value.bloodOptional,
        basicsId,
        nhisDataEditYn: isNhisDataEditYn
      },
      healthDataType: healthDataType,
      checkDate: nhisData.checkDate,

    }

    let response = null

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.blood.createdDate
    delete params.blood.modifiedDate
    delete params.bloodOptional.createdDate
    delete params.bloodOptional.modifiedDate

    if (formData.value.blood.id) {
      response = await checkupApi.updateBloodTemporary(params)
    } else {
      response = await checkupApi.setBloodTemporary(params)
    }

    if (response && !isStop.value && isAutoMove) {
      store.dispatch('checkup/setBasicsId', response.data.blood.basicsId)

      // 다음 설문으로 이동
      await moveNext()
      // 성공 시 다음 페이지로 이동하므로 isProcessing 상태 유지 (버튼 비활성화 유지)
    } else {
      // 응답이 없거나 중지 상태이거나 자동 이동하지 않을 때 버튼 재활성화
      isProcessing.value = false
    }
  } catch (e) {
    console.error(e)
    // 에러 발생 시에만 버튼 재활성화
    isProcessing.value = false
  }
}

const handleBack = async () => {
  await movePrev()
}

const closeEmptyNhisAlret = () => {
  isShowEmptyNhisAlret.value = false
}

const openGuidePopup = () => {
  showGuidePopup.value = true
}

const closeGuidePopup = () => {
  showGuidePopup.value = false
}


const goToStep = async (step) => {
  if (step === 1) {
    await handleSave(false);

    movePrev()
  }
}

onBeforeMount(async () => {
  console.log('nhisData:', nhisData);
  isLoading.value = true

  await getCommonInfo()
  await getBloodTemporary()

  isLoading.value = false
  
  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  await nextTick()
  isReady.value = true
})
</script>

<template>
  <section class="container CheckupBlood">
<!--    <BaseStep2 :total="2" :current="2" @clickStep="goToStep" class="CheckupBlood&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar="progressbar.slice(1)"
        :current="2"
        class="CheckupEye--step"
        @clickStep="goToStep"
    />

    <div v-if="!isLoading" class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ic_blood.svg" alt="혈액검사 아이콘">
          </div>
          {{ $t('Router.checkup.text2') }}
        </div>
        <p class="Checkup--contents-date">
          <BaseCheckupDate class="CheckupBlood--date" :checkDate="nhisData.checkDate" />
        </p>
        <button
          v-if="healthDataType === 'direct'"
          type="button" class="Checkup--contents-guide-btn"
          @click="openGuidePopup">
          {{ $t('Router.checkup.text31') }}
        </button>
      </div>

      <div class="Checkup--contents-wrapT">

        <CheckupBloodRequire
          class="CheckupBlood--require"
          :basicData="formData.blood"
          :healthDataType="healthDataType"
          @update="updateBloodRequire" />

        <CheckupBloodNonRequire
          class="CheckupBlood--non-require"
          :basicData="formData.bloodOptional"
          :nhisData="nhisData"
          :analysisType="analysisType"
          :healthDataType="healthDataType"
          :isNhisDataEditYn="currentIsNhisDataEditYn"
          @update="updateBloodNonRequire"
          ref="childComponent" />
      </div>

      <div class="Checkup--btn-wrap">
        <div class="btn--bottom CheckupBlood--btn-div">
          <button
            @click="debouncedBloodInfoValidate"
            :disabled="isDisabled"
            type="button"
            class="CheckupBlood--btn">{{ $t('Common.next') }}</button>
        </div>
        <div class="btn--bottom btn--bottom-line CheckupBlood----btn-div">
          <button
              @click="handleBack"
              type="button"
              class="CheckupBlood----btn">{{ $t('Common.prev') }}</button>
        </div>
      </div>
    </div>

    <base-popup v-if="isAutoLdl" class="CheckupBlood--popup">
      <template v-slot:contents>
        <div class="CheckupBlood--pop-con">
          <p class="pop-text-light">
            {{ $t('CheckupBlood.text2') }}
          </p>
          <p class="pop-text-bold">
            {{ $t('CheckupBlood.text3') }}
          </p>
        </div>

        <div class="pop-btn-wrap">
          <button type="button" class="pop-btn pop-btn--gray" @click="cancleAutoLdl">{{ $t('Common.cancle') }}</button>
          <button type="button" class="pop-btn pop-btn--green" @click="confirmAutoLdl">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="popup" class="CheckupBlood--popup">
      <template v-slot:contents>
        <div class="CheckupBlood--pop-con">
          <p class="pop-text-light">
            {{ validMsg }}
          </p>
          <p class="pop-text-bold">
            <!-- {{ validRange.min }} ~ {{ validRange.max }}  -->
            {{ $t('CheckupBlood.text22') }}
          </p>

        </div>
        <div class="pop-btn-wrap">
          <button @click="popupClose" type="button" class="pop-btn pop-btn--gray">{{ $t('CheckupBlood.text7') }}</button>
          <button @click="validContinue" type="button" class="pop-btn pop-btn--green">{{ $t('CheckupBlood.text8') }}</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="isShowEmptyNhisAlret" class="base-pop">
      <template v-slot:contents>
        <p class="pop-text-light">{{ $t('CheckupBlood.text9') }}</p>
        <p class="pop-text-bold">{{ $t('CheckupBlood.text10') }}<span class="txt--red">{{emptyNhisStr}}</span></p>
        <div class="pop-btn-wrap">
          <button type="button" class="pop-btn pop-btn--green" @click="closeEmptyNhisAlret">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <!-- 직접 입력 가이드 팝업 -->
    <DirectInputGuidePopup 
      :isOpen="showGuidePopup" 
      type="blood"
      @close="closeGuidePopup"
    />
  </section>
</template>
