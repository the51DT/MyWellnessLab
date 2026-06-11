<script setup>
import { ref, computed, onBeforeMount, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep from '@/components/BaseStep.vue'
import * as checkupApi from '@/apis/checkup'
import {
  healthLifeStepNavigation,
  healthLifeStepRoutes,
  useMoveNext,
  useSurveyStepCommon
} from '@/composables/checkup'
import * as cmnRegex from '@/utils/commonRegex'
import { calcAge } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'
import {useRoute, useRouter} from "vue-router";

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const route = useRoute()
const router = useRouter()

const user = store.getters.getUser
const basicsId = store.getters['checkup/getBasicsId']
const analysisType = store.getters['checkup/getAnalysisType']
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null

const drinkFreqTypeMonthValidation = ref(false)
const drinkFreqTypeWeekValidation = ref(false)
const isOverSmokingAge = ref(false)

const smokingAnswerList = [
  {
    label: t('CheckupDrinkSmokeSleep.text15'),
    value: 1
  },
  {
    label: t('CheckupDrinkSmokeSleep.text16'),
    value: 2
  },
  {
    label: t('CheckupDrinkSmokeSleep.text17'),
    value: 3
  }
]

const drinkAnswerList = [
  {
    label: t('Common.no'),
    value: 0
  },
  {
    label: t('Common.yes'),
    value: 1
  }
]

const formData = ref({
  drinking: {
    id: null,
    basicsId: null,
    drink: -1,
    drinkFreq: null,
    drinkFreqType: 1,
    drinkVol: null,
    createdDate: '',
    modifiedDate: ''
  },
  sleep: {
    id: null,
    basicsId: null,
    sleepHr: 0,
    sleepMin: 0,
    createdDate: '',
    modifiedDate: ''
  },
  smoking: {
    id: null,
    basicsId: null,
    smok: -1,
    smokAmt: null,
    smokDurYear: null,
    createdDate: '',
    modifiedDate: ''
  },
  water: {
    id: null,
    basicsId: null,
    waterAmt: null,
    createdDate: '',
    modifiedDate: ''
  }
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.drinking.drink,
    formData.value.drinking.drinkFreq,
    formData.value.drinking.drinkVol,
    formData.value.smoking.smok,
    formData.value.smoking.smokAmt,
    formData.value.smoking.smokDurYear,
    formData.value.water.waterAmt
  ]

  return targetList.filter((item) => Number.isInteger(item)).length
})

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return checkedCount.value !== 7
})

const isDrinkDisabled = computed(() => {
  return formData.value.drinking.drink !== 1
})

const isSmokingDisabled = computed(() => {
  return !formData.value.smoking.smok || formData.value.smoking.smok === 3
})

const isOneTime = computed(() => {
  return analysisType === 'onetime'
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

watch(
  () => formData.value.drinking.drink,
  (value, oldValue) => {
    // 초기값(-1)에서 변경되거나 oldValue가 없는 경우는 제외 (데이터 로딩 시)
    if (!oldValue || oldValue === -1) {
      return
    }

    if (value === 0) {
      formData.value.drinking.drinkFreq = 0
      formData.value.drinking.drinkFreqType = 1
      formData.value.drinking.drinkVol = 0
    } else {
      formData.value.drinking.drinkFreq = null
      formData.value.drinking.drinkVol = null
    }
  }
)

watch(
  () => formData.value.drinking.drinkFreq,
  (value) => {
    if (formData.value.drinking.drink === 1 && value === 0) {
      formData.value.drinking.drinkFreq = null
    }
  }
)

watch(
  () => formData.value.smoking.smok,
  (value, oldValue) => {
    // 초기값(-1)에서 변경되거나 oldValue가 없는 경우는 제외 (데이터 로딩 시)
    if (!oldValue || oldValue === -1) {
      return
    }

    if (value === 3) {
      formData.value.smoking.smokAmt = 0
      formData.value.smoking.smokDurYear = 0
    } else {
      formData.value.smoking.smokAmt = null
      formData.value.smoking.smokDurYear = null
    }
  }
)

watch(
  () => formData.value.smoking.smokAmt,
  (value, oldValue) => {
    if (formData.value.smoking.smok !== 3 && parseInt(value, 0) === 0) {
      formData.value.smoking.smokAmt = null
    }
  }
)

watch(
  () => formData.value.smoking.smokDurYear,
  (value, oldValue) => {
    if (formData.value.smoking.smok !== 3 && parseInt(value, 0) === 0) {
      formData.value.smoking.smokDurYear = null
    }
  }
)

watch(() => formData.value.drinking.drinkVol,
  (value, oldValue) => {
    if (parseInt(value, 0) === 0 && formData.value.drinking.drink === 1) {
      formData.value.drinking.drinkVol = null
    }
  })

const handleDrinkFreqInput = (e) => {
  if (cmnRegex.isEmpty(e.target.value)) {
    formData.value.drinking.drinkFreq = e.target.value
    return
  }

  formData.value.drinking.drinkFreq = cmnRegex.changeOnlyNumber(e.target.value)
  handleDrinkValidation()
}

const handleDrinkVolInput = (e) => {
  if (cmnRegex.isEmpty(e.target.value)) {
    formData.value.drinking.drinkVol = e.target.value
    return
  }

  formData.value.drinking.drinkVol = cmnRegex.changeOnlyNumber(e.target.value)
}

const handleSmokDurYearInput = (e) => {
  if (cmnRegex.isEmpty(e.target.value)) {
    formData.value.smoking.smokDurYear = e.target.value
    return
  }

  const replcedBirthDate = user.dateOfBirth.replaceAll('.', '-')
  if (e.target.value <= calcAge(replcedBirthDate)) {
    formData.value.smoking.smokDurYear = cmnRegex.changeOnlyNumber(e.target.value)
    isOverSmokingAge.value = false
  } else {
    formData.value.smoking.smokDurYear = null
    isOverSmokingAge.value = true
  }
}

const handleSmokAmtInput = (e) => {
  if (cmnRegex.isEmpty(e.target.value)) {
    formData.value.smoking.smokAmt = e.target.value
    return
  }

  formData.value.smoking.smokAmt = cmnRegex.changeOnlyNumber(e.target.value)
}

const handleWaterAmtInput = (e) => {
  if (cmnRegex.isEmpty(e.target.value)) {
    formData.value.water.waterAmt = e.target.value
    return
  }

  const waterAmt = cmnRegex.changeOnlyNumber(e.target.value)
  if (waterAmt === 0) {
    formData.value.water.waterAmt = null
  } else {
    formData.value.water.waterAmt = cmnRegex.changeOnlyNumber(e.target.value)
  }
}

const getFourPowersTemporary = async () => {
  try {
    const response = await checkupApi.getFourPowersTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const handleBack = () => {
  router.push({name:"CheckupPhysicalActivity"})
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
      drinking: {
        ...formData.value.drinking,
        basicsId
      },
      sleep: {
        ...formData.value.sleep,
        basicsId
      },
      smoking: {
        ...formData.value.smoking,
        basicsId
      },
      water: {
        ...formData.value.water,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.drinking.createdDate
    delete params.drinking.modifiedDate
    delete params.sleep.createdDate
    delete params.sleep.modifiedDate
    delete params.smoking.createdDate
    delete params.smoking.modifiedDate
    delete params.water.createdDate
    delete params.water.modifiedDate

    let response = null

    if (formData.value.drinking.id) {
      response = await checkupApi.updateFourPowersTemporary(params)
    } else {
      response = await checkupApi.setFourPowersTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.drinking.basicsId)

      // 다음 설문 이동
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
    console.error('save error!!', e)
    // 에러 발생 시에만 버튼 재활성화
    isProcessing.value = false
  }
}
// scrollToElement 함수를 직접 import
import { scrollToElement } from '@/assets/js/common'

const disableDrinkAction = () => {
  if (formData.value.drinking.drink === 0) {
    if (formData.value.drinking.drinkFreq === null || formData.value.drinking.drinkFreq === '') {
      formData.value.drinking.drinkFreq = 0
      formData.value.drinking.drinkFreqType = 1
      formData.value.drinking.drinkVol = 0
    }
    // 아니오 선택 시 흡연 영역으로 스크롤
    setTimeout(() => {
      scrollToElement('.CheckupDrinkSmokeSleep--smoke--wrap', 100)
    }, 100)
  } else if (formData.value.drinking.drink === 1) {
    if (formData.value.drinking.drinkFreq === 0 && formData.value.drinking.drinkVol === 0) {
      formData.value.drinking.drinkFreq = null
      formData.value.drinking.drinkFreqType = 1
      formData.value.drinking.drinkVol = null
    }
    // 예 선택 시 2번 질문(음주 빈도)으로 스크롤
    setTimeout(() => {
      scrollToElement('.CheckupDrinkSmokeSleep--drink-fre', 120, 80)
    }, 150)
  }

  handleDrinkValidation()
}
const disableSmokeAction = () => {
  if (formData.value.smoking.smok === 3) {
    if (formData.value.smoking.smokAmt === null || formData.value.smoking.smokAmt === '') {
      formData.value.smoking.smokAmt = 0
      formData.value.smoking.smokDurYear = 0
    }
    // 피운 적 없음(3번) 선택 시 수면 영역으로 스크롤
    setTimeout(() => {
      scrollToElement('.CheckupDrinkSmokeSleep--moi', 100)
    }, 100)
  } else if (formData.value.smoking.smok === 1 || formData.value.smoking.smok === 2) {
    if (formData.value.smoking.smokAmt === 0 || formData.value.smoking.smokDurYear === 0) {
      formData.value.smoking.smokAmt = null
      formData.value.smoking.smokDurYear = null
    }
    // 흡연함(1,2번) 선택 시 2번 질문으로 스크롤
    setTimeout(() => {
      scrollToElement('.CheckupDrinkSmokeSleep--smoke-fre--q', 120, 80)
    }, 100)
  }
}

const handleDrinkValidation = () => {
  drinkFreqTypeMonthValidation.value = false
  drinkFreqTypeWeekValidation.value = false

  if (!isDrinkDisabled.value) {
    const drinkFreqType = Number(formData.value.drinking.drinkFreqType)
    const drinkFreq = Number(formData.value.drinking.drinkFreq)

    switch (drinkFreqType) {
      case 1:
        // 주 체크
        drinkFreqTypeWeekValidation.value = drinkFreq > 7
        break
      case 2:
        // 월 체크
        drinkFreqTypeMonthValidation.value = drinkFreq > 31
        break
      default:
        break
    }
    if (drinkFreqTypeWeekValidation.value || drinkFreqTypeMonthValidation.value) {
      formData.value.drinking.drinkFreq = null
    }
  }
}

const handleChangeDrinkFreqType = () => {
  handleDrinkValidation()
}

onBeforeMount(async () => {
  const fourPowersTemporary = await getFourPowersTemporary()

  if (fourPowersTemporary.drinking) {
    formData.value = fourPowersTemporary
  }

  progressbar.value = fourPowersTemporary.progressbar || []

  const idx = progressbar.value.findIndex(
      item => healthLifeStepRoutes[item.pType] === route.name
  )

  current.value = idx === -1 ? 1 : idx + 1

  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  await nextTick()
  isReady.value = true
})

const current = ref(0)
const progressbar = ref([])
const { handleStepClick } = healthLifeStepNavigation(progressbar)
const { onStepClick } = useSurveyStepCommon(handleSave, handleStepClick, current, isDisabled)
</script>

<template>
  <section class="container CheckupDrinkSmokeSleep">
<!--    <BaseStep :total="6" :current="5" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar=" progressbar.slice(1)"
        :current="current"
        class="CheckupSleep--step"
        @clickStep="onStepClick"
    />
    <div class="Checkup--contents-wrap">
      
      <!--음주-->
      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_drinkSmokeSleep.svg" alt="icon">
          </div>
          {{ $t('CommonForm.alcohol') }}
        </div>
        <p class="Checkup--contents-date">
          <span>
            <strong>{{ $t('CheckupDrinkSmokeSleep.text0')}}
            </strong>{{ $t('CheckupDrinkSmokeSleep.text1')}}
          </span>
        </p>
      </div>
      
      <div class="Checkup--contents-wrapT">
        <div class="CheckupDrinkSmokeSleep--con-wrap">
          <div class="CheckupDrinkSmokeSleep--con">
            <div class="CheckupDrinkSmokeSleep--unit">
              <p class="CheckupDrinkSmokeSleep--unit-tit">
                <span>1.</span> 
                <!-- <template v-if="!isOneTime">{{ user.name }}{{ $t('Common.name') }},</template> -->
                {{ $t('CheckupDrinkSmokeSleep.text2')}}
              </p>

              <div class="align--between CheckupDrinkSmokeSleep--unit-input">
                <div v-for="(item, index) in drinkAnswerList" :key="index" class="CheckupDrinkSmokeSleep--unit-l">
                  <label
                    :for="'cdss' + index"
                    class="CheckupDrinkSmokeSleep--unit-label"
                    :class="formData.drinking.drink == item.value ? 'active' : ''">
                    <input
                      v-model="formData.drinking.drink"
                      :value="item.value"
                      type="radio"
                      name="cdss"
                      :id="'cdss' + index"
                      class="CheckupDrinkSmokeSleep--unit-radio"
                      hidden="hidden"
                      @change="disableDrinkAction"
                      placeholder="0" />
                    <span class="CheckupDrinkSmokeSleep--unit-span">
                      {{ item.label }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div
              class="CheckupDrinkSmokeSleep--dink-group"
              :class="!isDrinkDisabled ? 'disabled' : ''">
              <div class="CheckupDrinkSmokeSleep--drink-fre">
                <p class="CheckupDrinkSmokeSleep--drink-fre--q">
                  <span>2.</span> {{ $t('CheckupDrinkSmokeSleep.text3')}}
                </p>

                <div class="align--between CheckupDrinkSmokeSleep--drink-fre--con-wrap">
                  <div class="CheckupDrinkSmokeSleep--drink-fre--select-wrap" :class="isDrinkDisabled ? 'disabled' : ''">
                    <select
                      v-model="formData.drinking.drinkFreqType"
                      name="cdss-s"
                      id=""
                      class="CheckupDrinkSmokeSleep--drink-fre--select"
                      :disabled="isDrinkDisabled"
                      @change="handleChangeDrinkFreqType">
                      <option value="1">{{ $t('CheckupDrinkSmokeSleep.text4')}}</option>
                      <option value="2">{{ $t('CheckupDrinkSmokeSleep.text5')}}</option>
                    </select>
                  </div>

                  <label
                    for="cdss03"
                    class="CheckupDrinkSmokeSleep--drink-fre--label inputBox"
                    :class="isDrinkDisabled ? 'disabled' : ''">
                    <input
                      v-model="formData.drinking.drinkFreq"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      maxlength="2"
                      id="cdss03"
                      class="CheckupDrinkSmokeSleep--drink-fre--input"
                      :disabled="isDrinkDisabled"
                      placeholder="2"
                      @input="handleDrinkFreqInput" />
                    <span class="CheckupDrinkSmokeSleep--drink-fre--span inputBox--txt">{{ $t('CheckupDrinkSmokeSleep.text6')}}</span>
                  </label>
                </div>
                <div class="align--between info-msg">
                  <p v-if="drinkFreqTypeMonthValidation" class="CheckupDrinkSmokeSleep--drink-fre--desc txt--desc txt--red">{{ $t('CheckupDrinkSmokeSleep.text8')}}</p>
                  <p v-if="drinkFreqTypeWeekValidation" class="CheckupDrinkSmokeSleep--drink-fre--desc txt--desc txt--red">{{ $t('CheckupDrinkSmokeSleep.text9')}}</p>
                </div>
              </div>

              <div class="CheckupDrinkSmokeSleep--drink-size--wrap">
                <p class="CheckupDrinkSmokeSleep--drink-size--q">
                  <span>3.</span> 
                  {{ $t('CheckupDrinkSmokeSleep.text10')}}
                </p>
                <div class="CheckupDrinkSmokeSleep--drink-size--con-wrap">
                  <label
                    for="cdss04"
                    class="CheckupDrinkSmokeSleep--drink-size--label inputBox"
                    :class="isDrinkDisabled ? 'disabled' : ''">
                    <input
                      v-model="formData.drinking.drinkVol"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      maxlength="3"
                      id="cdss04"
                      class="CheckupDrinkSmokeSleep--drink-size--input"
                      :disabled="isDrinkDisabled"
                      placeholder="2"
                      @input="handleDrinkVolInput " />
                    <span class="CheckupDrinkSmokeSleep--drink-size--span inputBox--txt">{{ $t('CheckupDrinkSmokeSleep.text11') }}</span>
                  </label>
                </div>
                <p class="CheckupDrinkSmokeSleep--drink-size--desc txt--desc">{{ $t('CheckupDrinkSmokeSleep.text12')}}</p>
              </div>
            </div>
          </div>

          <!--흡연-->
          <div class="CheckupDrinkSmokeSleep--smoke--wrap"> 

            <div class="Checkup--contents-tit-wrap">
              <div class="Checkup--contents-tit">
                <div class="Checkup--contents-icon">
                  <img src="/img/ico_smoke.svg" alt="icon">
                </div>
                {{ $t('CommonForm.smoking') }}
              </div>
              <p class="Checkup--contents-date">
                <span v-html="$t('CheckupDrinkSmokeSleep.text13')"></span>
              </p>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke--con-wrap">
              <p class="CheckupDrinkSmokeSleep--smoke--q">
                <span>1.</span>
                <template v-if="!isOneTime">{{ user.name }}{{ $t('Common.name')}},</template> {{ $t('CheckupDrinkSmokeSleep.text14')}}</p>
              <div class="CheckupDrinkSmokeSleep--smoke--input-wrap">
                <div v-for="(item, index) in smokingAnswerList" :key="index" class="CheckupDrinkSmokeSleep--smoke--btn-wrap">
                  <label
                    :for="'btn' + index"
                    class="CheckupDrinkSmokeSleep--smoke--label"
                    :class="formData.smoking.smok === (index + 1) ? 'active' : ''">
                    <input
                      v-model="formData.smoking.smok"
                      :value="item.value"
                      type="radio"
                      name="btn"
                      :id="'btn' + index"
                      hidden="hidden"
                      @change="disableSmokeAction"
                      class="CheckupDrinkSmokeSleep--smoke--input" />
                    <span class="CheckupDrinkSmokeSleep--smoke--span">{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke-fre">
              <p class="CheckupDrinkSmokeSleep--smoke-fre--q">
                <span>2.</span>
                {{ $t('CheckupDrinkSmokeSleep.text18')}}</p>
              <div class="CheckupDrinkSmokeSleep--smoke-fre--con-wrap">
                <label
                  for="cdss05"
                  class="CheckupDrinkSmokeSleep--smoke-fre--label inputBox"
                  :class="isSmokingDisabled ? 'disabled' : ''">
                  <input
                    v-model="formData.smoking.smokDurYear"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    maxlength="3"
                    id="cdss05"
                    class="CheckupDrinkSmokeSleep--smoke-fre--input"
                    :disabled="isSmokingDisabled"
                    placeholder="20"
                    @input="handleSmokDurYearInput" />
                  <span class="CheckupDrinkSmokeSleep--smoke-fre--span inputBox--txt">{{ $t('CheckupDrinkSmokeSleep.text19')}}</span>
                </label>
              </div>
              <div class="align--between">
                <p v-if="isOverSmokingAge" class="CheckupDrinkSmokeSleep--drink-fre--desc txt--desc txt--red">{{ $t('CheckupDrinkSmokeSleep.text20')}}</p>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke-quan--wrap">
              <p class="CheckupDrinkSmokeSleep--smoke-quan--q">
                <span>3.</span>
                <span class="CheckupDrinkSmokeSleep--smoke-quan--q-span" v-html="$t('CheckupDrinkSmokeSleep.text21')"></span>
              </p>
              <label
                for="cdss06"
                class="CheckupDrinkSmokeSleep--smoke-quan--label inputBox"
                :class="isSmokingDisabled ? 'disabled' : ''">
                <input
                  v-model="formData.smoking.smokAmt"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="3"
                  id="cdss06"
                  class="CheckupDrinkSmokeSleep--smoke-quan--input"
                  :disabled="isSmokingDisabled"
                  placeholder="20"
                  @input="handleSmokAmtInput" />
                <span class="CheckupDrinkSmokeSleep--smoke-quan--span inputBox--txt">{{ $t('CheckupDrinkSmokeSleep.text22')}}</span>
              </label>
            </div>

            <div class="align--between">
              <p v-if="formData.smoking.smokAmt>200" class="CheckupDrinkSmokeSleep--drink-fre--desc txt--desc txt--red">{{ $t('CheckupDrinkSmokeSleep.text23')}}</p>
            </div>
          </div>

          <!-- 물 섭취 -->
          <div class="CheckupDrinkSmokeSleep--moi"> 

            <div class="Checkup--contents-tit-wrap">
              <div class="Checkup--contents-tit">
                <div class="Checkup--contents-icon">
                  <img src="/img/ico_water.svg" alt="icon">
                </div>
                {{ $t('CheckupDrinkSmokeSleep.text24') }}
              </div>
              <p class="Checkup--contents-date">
                <span v-html="$t('CheckupDrinkSmokeSleep.text25')"></span>
              </p>
            </div>

            <p class="CheckupDrinkSmokeSleep--moi--q">
              <span>1.</span> {{ $t('CheckupDrinkSmokeSleep.text27')}}
            </p>
            <div class="CheckupDrinkSmokeSleep--moi--con-wrap">
              <label for="cdss09" class="CheckupDrinkSmokeSleep--moi--label inputBox long-txt">
                <input
                  v-model="formData.water.waterAmt"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="3"
                  placeholder="7"
                  id="cdss09"
                  class="CheckupDrinkSmokeSleep--moi--input"
                  @input="handleWaterAmtInput " />
                <span class="CheckupDrinkSmokeSleep--moi--span inputBox--txt">{{ $t('CheckupDrinkSmokeSleep.text29')}}</span>
              </label>
            </div>
            <p class="CheckupDrinkSmokeSleep--moi--desc txt--desc2">{{ $t('CheckupDrinkSmokeSleep.text31') }}</p>
          </div>
        </div>
      </div>

      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            @click="debouncedHandleSave"
            :disabled="isDisabled"
            type="button">
            {{ $t('Common.next')}}
            <!-- <span class="answerNum">({{ checkedCount }}<span>/</span>7)</span> -->
          </button>
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
