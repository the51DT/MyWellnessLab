<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep from '@/components/BaseStep.vue'
import {useMoveNext, useMovePrev, healthLifeStepNavigation, healthLifeStepRoutes, useSurveyStepCommon} from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const movePrev = useMovePrev()
const route = useRoute()

const user = store.getters.getUser
const analysisType = store.getters['checkup/getAnalysisType']

const basicsId = store.getters['checkup/getBasicsId']
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null

const data = ref([
  {
    key: 'drugGLU',
    label: t('CheckupMedication.text7')
  },
  {
    key: 'drugTG',
    label: t('CheckupMedication.text8')
  },
  {
    key: 'drugTC',
    label: t('CheckupMedication.text9')
  },
  {
    key: 'drugBP',
    label: t('CheckupMedication.text10')
  },
  {
    key: 'drugBF',
    label: t('CheckupMedication.text11')
  },
  {
    key: 'drugBodyfat',
    label: t('CheckupMedication.text12'),
    label2: t('CheckupMedication.text13')
  },
  {
    key: 'drugBJ',
    label: t('CheckupMedication.text14')
  },
  {
    key: 'drugStomach',
    label: t('CheckupMedication.text15')
  },
  {
    key: 'drugIntestine',
    label: t('CheckupMedication.text16')
  },

  {
    key: 'drugLiver',
    label: t('CheckupMedication.text17')
  },
  {
    key: 'drugEye',
    label: t('CheckupMedication.text18')
  },
  {
    key: 'drugMuscle',
    label: t('CheckupMedication.text19')
  },
  {
    key: 'drugMemory',
    label3: t('CheckupMedication.text20')
  },
  {
    key: 'drugTired',
    label: t('CheckupMedication.text21'),
    label2: t('CheckupMedication.text22')
  },
  {
    key: 'drugSleep',
    label: t('CheckupMedication.text23')
  },
  {
    key: 'drugTension',
    label3: t('CheckupMedication.text24')
  },
  {
    key: 'drugNose',
    label: t('CheckupMedication.text25')
  },
  {
    key: 'drugAtopy',
    label: t('CheckupMedication.text26'),
    label2: t('CheckupMedication.text27')
  },
  {
    key: 'drugImmune',
    label3: t('CheckupMedication.text28')
  },
  {
    key: 'drugMen',
    label: t('CheckupMedication.text29')
  }, /* 여성일 경우: {label: "갱년기", key: "갱년기"},  hthMen / hthWomen */
])

const formData = ref({
  id: null,
  basicsId: null,
  drugAtopy: 0,
  drugBF: 0,
  drugBJ: 0,
  drugBodyfat: 0,
  drugBP: 0,
  drugEye: 0,
  drugGLU: 0,
  drugImmune: 0,
  drugIntestine: 0,
  drugLiver: 0,
  drugMemory: 0,
  drugMen: 0,
  drugMuscle: 0,
  drugNose: 0,
  drugSexHor: 0,
  drugSleep: 0,
  drugStomach: 0,
  drugTC: 0,
  drugTension: 0,
  drugTG: 0,
  drugTired: 0,
  createdDate: '',
  modifiedDate: ''
})

const isNotInterest = ref(false)

const checkedCount = computed(() => {
  const targetList = [
    formData.value.drugAtopy,
    formData.value.drugBF,
    formData.value.drugBJ,
    formData.value.drugBodyfat,
    formData.value.drugBP,
    formData.value.drugEye,
    formData.value.drugGLU,
    formData.value.drugImmune,
    formData.value.drugIntestine,
    formData.value.drugLiver,
    formData.value.drugMemory,
    formData.value.drugMen,
    formData.value.drugMuscle,
    formData.value.drugNose,
    formData.value.drugSexHor,
    formData.value.drugSleep,
    formData.value.drugStomach,
    formData.value.drugTC,
    formData.value.drugTension,
    formData.value.drugTG,
    formData.value.drugTired
  ]

  return targetList.filter((item) => item === 1).length
})

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

const getBasicsTemporary = async (id) => {
  try {
    if (!id) {
      return null
    }

    const response = await checkupApi.getBasicsTemporary(id)

    return response.data.basics
  } catch (e) {
    console.error(e)
  }
}

const getDrugTemporary = async () => {
  try {
    const response = await checkupApi.getDrugTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const handleChanged = (key) => {
  const newValue = formData.value[key] === 0 ? 1 : 0

  formData.value = {
    ...formData.value,
    [key]: newValue
  }
}

const handleNoInterestChanged = () => {
  isNotInterest.value = !isNotInterest.value
  
  // 관심 건강분야 없음을 선택하면 다른 모든 항목 해제
  if (isNotInterest.value) {
    Object.keys(formData.value).forEach(key => {
      if (key !== 'basicsId' && key !== 'id' && key !== 'createdDate' && key !== 'modifiedDate') {
        formData.value[key] = 0
      }
    })
  }
}

const handleBack = async () => {
  await movePrev()
}

// debounce를 적용한 handleSave 함수
const debouncedHandleSave = () => {
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
    handleSave()
  }, 300)
}

const handleSave = async (shouldMoveNext = true) => {
  // debouncedHandleSave에서 이미 isProcessing을 true로 설정했으므로 
  // 여기서는 중복 체크하지 않고 바로 진행
  if (!isProcessing.value) {
    isProcessing.value = true
  }
  try {
    const params = {
      drug: {
        ...formData.value,
        basicsId
      }
    }

    if (isNotInterest.value) {
      params.drug.drugAtopy = 0
      params.drug.drugBF = 0
      params.drug.drugBJ = 0
      params.drug.drugBodyfat = 0
      params.drug.drugBP = 0
      params.drug.drugEye = 0
      params.drug.drugGLU = 0
      params.drug.drugImmune = 0
      params.drug.drugIntestine = 0
      params.drug.drugLiver = 0
      params.drug.drugMemory = 0
      params.drug.drugMen = 0
      params.drug.drugMuscle = 0
      params.drug.drugNose = 0
      params.drug.drugSexHor = 0
      params.drug.drugSleep = 0
      params.drug.drugStomach = 0
      params.drug.drugTC = 0
      params.drug.drugTension = 0
      params.drug.drugTG = 0
      params.drug.drugTired = 0
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.drug.createdDate
    delete params.drug.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateDrugTemporary(params)
    } else {
      response = await checkupApi.setDrugTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.drug.basicsId)

      if(shouldMoveNext){
        await moveNext()
        // 성공 시 다음 페이지로 이동하므로 isProcessing 상태 유지 (버튼 비활성화 유지)
      } else {
        // 다음 페이지로 이동하지 않을 때 버튼 재활성화
        isProcessing.value = false
      }
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

const changeGenderOption = async () => {
  const basicsTemporary = await getBasicsTemporary(basicsId)
  if (analysisType === 'onetime') {
    if (basicsTemporary.sex === 1) {
      data.value[19] = {
        key: 'drugMen',
        label: t('CheckupInterestHealth.text18')
      }
    } else if (basicsTemporary.sex === 2) {
      data.value[19] = {
        key: 'drugSexHor',
        label: t('CheckupMedication.text33')
      }
    }
  } else {
    if (user.gender === 'MALE') {
      data.value[19] = {
        key: 'drugMen',
        label: t('CheckupInterestHealth.text18')
      }
    } else if (user.gender === 'FEMALE') {
      data.value[19] = {
        key: 'drugSexHor',
        label: t('CheckupMedication.text33')
      }
    }
  }
}

onBeforeMount(async () => {
  await changeGenderOption()

  const drugTemporary = await getDrugTemporary()

  if (drugTemporary.drug) {
    formData.value = drugTemporary.drug

    const checkedList = [
      drugTemporary.drug.drugAtopy,
      drugTemporary.drug.drugBF,
      drugTemporary.drug.drugBJ,
      drugTemporary.drug.drugBodyfat,
      drugTemporary.drug.drugBP,
      drugTemporary.drug.drugEye,
      drugTemporary.drug.drugGLU,
      drugTemporary.drug.drugImmune,
      drugTemporary.drug.drugIntestine,
      drugTemporary.drug.drugLiver,
      drugTemporary.drug.drugMemory,
      drugTemporary.drug.drugMen,
      drugTemporary.drug.drugMuscle,
      drugTemporary.drug.drugNose,
      drugTemporary.drug.drugSexHor,
      drugTemporary.drug.drugSleep,
      drugTemporary.drug.drugStomach,
      drugTemporary.drug.drugTC,
      drugTemporary.drug.drugTension,
      drugTemporary.drug.drugTG,
      drugTemporary.drug.drugTired
    ]

    const isChecked = checkedList.some((item) => item === 1)

    if (!isChecked) {
      isNotInterest.value = true
    }

  }
  progressbar.value = drugTemporary.progressbar || []

  const idx = progressbar.value.findIndex(
      item => healthLifeStepRoutes[item.pType] === route.name
  )

  current.value = idx === -1 ? 1 : idx + 1

  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  await nextTick()
  isReady.value = true
})

const current = ref(0)

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return !isNotInterest.value && checkedCount.value === 0
})

const progressbar = ref([])
const { handleStepClick } = healthLifeStepNavigation(progressbar)
const { onStepClick } = useSurveyStepCommon(handleSave, handleStepClick, current, isDisabled)
</script>

<template>
  <section class="container CheckupInterestHealth CheckupMedication">
<!--    <BaseStep :total="6" :current="currentStep" @clickStep="handleStepClick" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar="progressbar.slice(1)"
        :current="current"
        class="CheckupMedication--step"
        @clickStep="onStepClick"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ic_pill.svg" alt="icon">
          </div>
          {{ $t('CheckupMedication.text6') }}
        </div>
        <p class="Checkup--contents-date">
          <span>
            <strong>{{ $t('CheckupMedication.text1') }}</strong>{{ $t('CheckupMedication.text2') }}
          </span>
        </p>
        <div class="Checkup--contents-desc Checkup--info-box">
          <div class="Checkup--info-content">
            <img src="/img/ico_outlineFile.svg" alt="정보 아이콘" class="Checkup--info-icon">
            <span class="Checkup--info-title" >{{ $t('CheckupMedication.text30') }}
            </span>
          </div>
          <p class="Checkup--info-description" v-html="$t('CheckupMedication.text31')">
          </p>
        </div>
      </div>

      <div class="Checkup--contents-wrapT">

        <div class="CheckupInterestHealth--item-div">
          <!-- 관심 건강분야 없음 버튼을 맨 앞으로 이동 -->
          <label
            for="noInterest"
            class="CheckupInterestHealth--label"
            :class="{ 'active': isNotInterest }">
            <input
              type="checkbox"
              id="noInterest"
              hidden="hidden"
              class="CheckupInterestHealth--input"
              @input="handleNoInterestChanged" />
            <span class="CheckupMedication--label">{{ $t('CheckupMedication.text32') }}
            </span>
          </label>
          
          <label
            v-for="(item, index) in data"
            :key="index"
            :for="'cih' + index"
            class="CheckupInterestHealth--label"
            :class="{ 'active': formData[item.key], 'disabled': isNotInterest }">
            <input
              :disabled="isNotInterest"
              type="checkbox"
              :id="'cih' + index"
              hidden="hidden"
              class="CheckupInterestHealth--input"
              @input="handleChanged(item.key)" />
              <span class="CheckupMedication--label">{{ item.label }}</span>
              <span class="CheckupMedication--label-sub">{{ item.label2 }}</span>
              <span class="CheckupMedication--label-sm">{{ item.label3 }}</span>
          </label>
        </div>
      </div>
      
      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            @click="debouncedHandleSave"
            :disabled="isDisabled"
            type="button">{{ $t('Common.next') }}</button>
        </div>
        <div class="btn--bottom btn--bottom-line">
          <button
              @click="handleBack"
              type="button">{{ $t('Common.prev') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>
