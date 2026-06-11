<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep2 from '@/components/BaseStep2.vue'
import {useMoveNext, useMovePrev, dynamicRouterMap } from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const movePrev = useMovePrev()

const user = store.getters.getUser
const analysisType = store.getters['checkup/getAnalysisType']

const basicsId = store.getters['checkup/getBasicsId']

const data = ref([
  {
    key: 'hthMemory',
    label: t('CheckupInterestHealth.text3')
  },
  {
    key: 'hthTension',
    label: t('CheckupInterestHealth.text4')
  },
  {
    key: 'hthSleep',
    label: t('CheckupInterestHealth.text5')
  },
  {
    key: 'hthTired',
    label: t('CheckupInterestHealth.text6')
  },
  {
    key: 'hthEye',
    label: t('CheckupInterestHealth.text7')
  },
  {
    key: 'hthSkin',
    label: t('CheckupInterestHealth.text8')
  },
  {
    key: 'hthStomach',
    label: t('CheckupInterestHealth.text9')
  },
  {
    key: 'hthLiver',
    label: t('CheckupInterestHealth.text10')
  },
  {
    key: 'hthIntestine',
    label: t('CheckupInterestHealth.text11')
  },
  {
    key: 'hthBodyfat',
    label: t('CheckupInterestHealth.text12')
  },
  {
    key: 'hthTg',
    label: t('CheckupInterestHealth.text13')
  },
  {
    key: 'hthTc',
    label: t('CheckupInterestHealth.text14')
  },
  {
    key: 'hthBp',
    label: t('CheckupInterestHealth.text15')
  },
  {
    key: 'hthBf',
    label: t('CheckupInterestHealth.text16')
  },
  {
    key: 'hthGlu',
    label: t('CheckupInterestHealth.text17')
  },
  {
    key: 'hthMen',
    label: t('CheckupInterestHealth.text18')
  }, /* 여성일 경우: {label: "갱년기", key: "갱년기"},  hthMen / hthWomen */
  {
    key: 'hthBj',
    label: t('CheckupInterestHealth.text20')
  },
  {
    key: 'hthMuscle',
    label: t('CheckupInterestHealth.text21')
  },
  {
    key: 'hthAtopy',
    label: t('CheckupInterestHealth.text22')
  },
  {
    key: 'hthImmune',
    label: t('CheckupInterestHealth.text23')
  },
  {
    key: 'hthOxi',
    label: t('CheckupInterestHealth.text24')
  },
  {
    key: 'hthNose',
    label: t('CheckupInterestHealth.text25')
  },
  {
    key: 'hthPhysi',
    label: t('CheckupInterestHealth.text26')
  }
  // 과민면역(hthAtopy) @Deprecated 정자운동성(hthSperm)
])

const formData = ref({
  id: null,
  basicsId: null,
  hthAtopy: 0,
  hthBf: 0,
  hthBj: 0,
  hthBodyfat: 0,
  hthBp: 0,
  hthEye: 0,
  hthGlu: 0,
  hthImmune: 0,
  hthIntestine: 0,
  hthLiver: 0,
  hthMemory: 0,
  hthMen: 0,
  hthMuscle: 0,
  hthNose: 0,
  hthOxi: 0,
  hthPhysi: 0,
  hthSexHor: 0,
  hthSkin: 0,
  hthSleep: 0,
  hthStomach: 0,
  hthTc: 0,
  hthTension: 0,
  hthTg: 0,
  hthTired: 0,
  createdDate: '',
  modifiedDate: ''
})

const isNotInterest = ref(false)
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null

const checkedCount = computed(() => {
  const targetList = [
    formData.value.hthAtopy,
    formData.value.hthBf,
    formData.value.hthBj,
    formData.value.hthBodyfat,
    formData.value.hthBp,
    formData.value.hthEye,
    formData.value.hthGlu,
    formData.value.hthImmune,
    formData.value.hthIntestine,
    formData.value.hthLiver,
    formData.value.hthMemory,
    formData.value.hthMen,
    formData.value.hthMuscle,
    formData.value.hthNose,
    formData.value.hthOxi,
    formData.value.hthPhysi,
    formData.value.hthSexHor,
    formData.value.hthSkin,
    formData.value.hthSleep,
    formData.value.hthStomach,
    formData.value.hthTc,
    formData.value.hthTension,
    formData.value.hthTg,
    formData.value.hthTired
  ]

  return targetList.filter((item) => item === 1).length
})

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return !isNotInterest.value && (checkedCount.value === 0 || checkedCount.value > 5)
})

const detailSurveyKeys = Object.keys(dynamicRouterMap)

const selectedDetailCount = computed(() => {
  const baseCount = detailSurveyKeys.filter((key) => formData.value[key] === 1).length
  return user.gender === 'FEMALE' ? baseCount + 1 : baseCount
})

const totalSteps = computed(() => {
  // 관심 건강분야 없음(isNotInterest)일 경우
  if (isNotInterest.value) {
    return user.gender === 'FEMALE' ? 2 : 1
  }

  return 1 + selectedDetailCount.value
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

// isNotInterest가 true가 되면 모든 관심분야를 0으로 초기화
watch(
  () => isNotInterest.value,
  (newValue) => {
    if (newValue) {
      // 모든 관심분야 항목들을 0으로 초기화
      formData.value.hthAtopy = 0
      formData.value.hthBf = 0
      formData.value.hthBj = 0
      formData.value.hthBodyfat = 0
      formData.value.hthBp = 0
      formData.value.hthEye = 0
      formData.value.hthGlu = 0
      formData.value.hthImmune = 0
      formData.value.hthIntestine = 0
      formData.value.hthLiver = 0
      formData.value.hthMemory = 0
      formData.value.hthMen = 0
      formData.value.hthMuscle = 0
      formData.value.hthNose = 0
      formData.value.hthOxi = 0
      formData.value.hthPhysi = 0
      formData.value.hthSexHor = 0
      formData.value.hthSkin = 0
      formData.value.hthSleep = 0
      formData.value.hthStomach = 0
      formData.value.hthTc = 0
      formData.value.hthTension = 0
      formData.value.hthTg = 0
      formData.value.hthTired = 0
    }
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

const handleChanged = (key) => {
  formData.value[key] = formData.value[key] === 0 ? 1 : 0
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

const handleSave = async () => {
  // debouncedHandleSave에서 이미 isProcessing을 true로 설정했으므로 
  // 여기서는 중복 체크하지 않고 바로 진행
  if (!isProcessing.value) {
    isProcessing.value = true
  }

  try {
    const params = {
      healthInterest: {
        ...formData.value,
        basicsId
      }
    }

    if (isNotInterest.value) {
      params.healthInterest.hthAtopy = 0
      params.healthInterest.hthBf = 0
      params.healthInterest.hthBj = 0
      params.healthInterest.hthBodyfat = 0
      params.healthInterest.hthBp = 0
      params.healthInterest.hthEye = 0
      params.healthInterest.hthGlu = 0
      params.healthInterest.hthImmune = 0
      params.healthInterest.hthIntestine = 0
      params.healthInterest.hthLiver = 0
      params.healthInterest.hthMemory = 0
      params.healthInterest.hthMen = 0
      params.healthInterest.hthMuscle = 0
      params.healthInterest.hthNose = 0
      params.healthInterest.hthOxi = 0
      params.healthInterest.hthPhysi = 0
      params.healthInterest.hthSexHor = 0
      params.healthInterest.hthSkin = 0
      params.healthInterest.hthSleep = 0
      params.healthInterest.hthStomach = 0
      params.healthInterest.hthTc = 0
      params.healthInterest.hthTension = 0
      params.healthInterest.hthTg = 0
      params.healthInterest.hthTired = 0
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.healthInterest.createdDate
    delete params.healthInterest.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateInterestHealthTemporary(params)
    } else {
      response = await checkupApi.setInterestHealthTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.healthInterest.basicsId)

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

const changeGenderOption = async () => {
  const basicsTemporary = await getBasicsTemporary(basicsId)
  if (analysisType === 'onetime') {
    if (basicsTemporary.sex === 1) {
      data.value[15] = {
        key: 'hthMen',
        label: t('CheckupInterestHealth.text18')
      }
    } else if (basicsTemporary.sex === 2) {
      data.value[15] = {
        key: 'hthSexHor',
        label: t('CheckupInterestHealth.text19')
      }
    }
  } else {
    if (user.gender === 'MALE') {
      data.value[15] = {
        key: 'hthMen',
        label: t('CheckupInterestHealth.text18')
      }
    } else if (user.gender === 'FEMALE') {
      data.value[15] = {
        key: 'hthSexHor',
        label: t('CheckupInterestHealth.text19')
      }
    }
  }
}

onBeforeMount(async () => {
  await changeGenderOption()

  const interestHealthTemporary = await store.dispatch(
      'checkup/fetchHealthInterest',
      basicsId
  )

  if (interestHealthTemporary) {
    formData.value = interestHealthTemporary

    const checkedList = [
      interestHealthTemporary.hthAtopy,
      interestHealthTemporary.hthBf,
      interestHealthTemporary.hthBj,
      interestHealthTemporary.hthBodyfat,
      interestHealthTemporary.hthBp,
      interestHealthTemporary.hthEye,
      interestHealthTemporary.hthGlu,
      interestHealthTemporary.hthImmune,
      interestHealthTemporary.hthIntestine,
      interestHealthTemporary.hthLiver,
      interestHealthTemporary.hthMemory,
      interestHealthTemporary.hthMen,
      interestHealthTemporary.hthMuscle,
      interestHealthTemporary.hthNose,
      interestHealthTemporary.hthOxi,
      interestHealthTemporary.hthPhysi,
      interestHealthTemporary.hthSexHor,
      interestHealthTemporary.hthSkin,
      interestHealthTemporary.hthSleep,
      interestHealthTemporary.hthStomach,
      interestHealthTemporary.hthTc,
      interestHealthTemporary.hthTension,
      interestHealthTemporary.hthTg,
      interestHealthTemporary.hthTired
    ]

    const isChecked = checkedList.some((item) => item === 1)

    if (!isChecked) {
      isNotInterest.value = true
    }
  }

  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  await nextTick()
  isReady.value = true
})

</script>

<template>
  <section class="container CheckupInterestHealth">
    <div class="Checkup--contents-wrap">
      
      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          {{ $t('Router.checkup.text3') }}
        </div>
        <p class="Checkup--contents-date">
          <span>
            <strong>{{ $t('CheckupInterestHealth.text1') }}</strong>{{ $t('CheckupInterestHealth.text2') }}
          </span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">
        <!-- <div class="CheckupInterestHealth--info">
          <strong class="CheckupInterestHealth--info-strong">{{ $t('CheckupInterestHealth.text1') }}</strong>{{ $t('CheckupInterestHealth.text2') }}
        </div> -->

        <div class="CheckupInterestHealth--item-div">
          <label
            v-for="(item, index) in data"
            :key="index"
            :for="'cih' + index"
            class="CheckupInterestHealth--label"
            :class="{ 'active': formData[item.key], 'disabled': isNotInterest || (checkedCount >= 5 && !formData[item.key]) }">
            <input
              :disabled="isNotInterest || (checkedCount >= 5 && !formData[item.key])"
              type="checkbox"
              :id="'cih' + index"
              hidden="hidden"
              class="CheckupInterestHealth--input"
              @input="handleChanged(item.key)" />
            <span class="CheckupInterestHealth--span">{{ item.label }}</span>
          </label>
        </div>

        <hr class="gray" />

        <label for="qqw" class="CheckupInterestHealth--noSelect" :class="isNotInterest ? 'active' : ''">
          <input
            v-model="isNotInterest"
            type="checkbox"
            name="qqw"
            id="qqw"
            hidden="hidden" />
          <span>{{ $t('CheckupInterestHealth.text27') }} </span>
        </label>
        <!--          <button type="button" class="CheckupInterestHealth&#45;&#45;noSelect">관심 건강분야 없음</button>-->
        <p class="CheckupInterestHealth--msg">
          {{ $t('CheckupInterestHealth.text28') }}
        </p>
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
