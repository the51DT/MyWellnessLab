<script setup>
import { ref, computed, onBeforeMount, watch, inject, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep from '@/components/BaseStep.vue'
import BaseTimeInput from '@/components/BaseTimeInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import * as checkupApi from '@/apis/checkup'
import {
  healthLifeStepNavigation,
  healthLifeStepRoutes,
  useMoveNext,
  useSurveyStepCommon
} from '@/composables/checkup'
import { useI18n } from 'vue-i18n'
import {useRoute} from "vue-router";
import { useRouter } from 'vue-router'
import { useConditionalScroll, physicalActivityScrollRules } from '@/composables/useConditionalScroll'

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const route = useRoute()
const router = useRouter()

const basicsId = store.getters['checkup/getBasicsId']
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null

// 질문 목록
const questionList = [
  {
    key: 'activInts',
    question: t('CheckupPhysicalActivity.text3'),
    description: t('CheckupPhysicalActivity.text4'),
    select: [{
      item: t('CheckupPhysicalActivity.text5'),
      value: 0
    }, {
      item: t('CheckupPhysicalActivity.text6'),
      value: 1
    }, {
      item: t('CheckupPhysicalActivity.text7'),
      value: 2
    }, {
      item: t('CheckupPhysicalActivity.text8'),
      value: 3
    }, {
      item: t('CheckupPhysicalActivity.text9'),
      value: 4
    }, {
      item: t('CheckupPhysicalActivity.text10'),
      value: 5
    }, {
      item: t('CheckupPhysicalActivity.text11'),
      value: 6
    }, {
      item: t('CheckupPhysicalActivity.text12'),
      value: 7
    }]
  },
  {
    key: 'activIntsTime',
    question: t('CheckupPhysicalActivity.text13'),
    description: t('CheckupPhysicalActivity.text14')
  },
  {
    key: 'activMod',
    question: t('CheckupPhysicalActivity.text16'),
    select: [{
      item: t('CheckupPhysicalActivity.text5'),
      value: 0
    }, {
      item: t('CheckupPhysicalActivity.text6'),
      value: 1
    }, {
      item: t('CheckupPhysicalActivity.text7'),
      value: 2
    }, {
      item: t('CheckupPhysicalActivity.text8'),
      value: 3
    }, {
      item: t('CheckupPhysicalActivity.text9'),
      value: 4
    }, {
      item: t('CheckupPhysicalActivity.text10'),
      value: 5
    }, {
      item: t('CheckupPhysicalActivity.text11'),
      value: 6
    }, {
      item: t('CheckupPhysicalActivity.text12'),
      value: 7
    }]
  },
  {
    key: 'activModTime',
    question: t('CheckupPhysicalActivity.text18'),
    description: t('CheckupPhysicalActivity.text14')
  },
  {
    key: 'activWalk',
    question: t('CheckupPhysicalActivity.text19'),
    select: [{
      item: t('CheckupPhysicalActivity.text5'),
      value: 0
    }, {
      item: t('CheckupPhysicalActivity.text6'),
      value: 1
    }, {
      item: t('CheckupPhysicalActivity.text7'),
      value: 2
    }, {
      item: t('CheckupPhysicalActivity.text8'),
      value: 3
    }, {
      item: t('CheckupPhysicalActivity.text9'),
      value: 4
    }, {
      item: t('CheckupPhysicalActivity.text10'),
      value: 5
    }, {
      item: t('CheckupPhysicalActivity.text11'),
      value: 6
    }, {
      item: t('CheckupPhysicalActivity.text12'),
      value: 7
    }]
  },
  {
    key: 'activWalkTime',
    question: t('CheckupPhysicalActivity.text21'),
    description: t('CheckupPhysicalActivity.text14') + '<br>' +t('CheckupPhysicalActivity.text15')
  }
]

const questionListLength = ref(6)

const formData = ref({
  id: null,
  basicsId: null,
  activInts: null,
  activIntsTime: null,
  activMod: null,
  activModTime: null,
  activWalk: null,
  activWalkTime: null,
  createdDate: '',
  modifiedDate: ''
})

const foucusTarget = ref('')

// validation 상태 추적
const validationErrors = ref({
  activInts: false,
  activMod: false,
  activWalk: false
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.activInts,
    formData.value.activIntsTime,
    formData.value.activMod,
    formData.value.activModTime,
    formData.value.activWalk,
    formData.value.activWalkTime
  ]

  return targetList.filter((item) => Number.isInteger(item)).length
})

/**
 * 상위 라우터(@/layouts/LayoutCheckup.vue)에서 설문 종료시 boolean값 제공
 * @typeof {boolean} isStop
 */
const isStop = inject('stop')

// selectbox validation - 커스텀 셀렉트 반영 (formData 기반)
const toggleTimeDisabled = (index, shouldDisable) => {
  const hourInput = document.getElementById(`pa${index}`)
  const minuteInput = document.getElementById(`pa2${index}`)
  const hourLabel = document.querySelector(`label[for="pa${index}"]`)
  const minuteLabel = document.querySelector(`label[for="pa2${index}"]`)

  if (!hourInput || !minuteInput || !hourLabel || !minuteLabel) return

  hourInput.disabled = shouldDisable
  minuteInput.disabled = shouldDisable

  if (shouldDisable) {
    hourInput.value = ''
    minuteInput.value = ''
    hourInput.classList.add('disabled')
    minuteInput.classList.add('disabled')
    hourLabel.classList.add('disabled')
    minuteLabel.classList.add('disabled')
  } else {
    hourInput.classList.remove('disabled')
    minuteInput.classList.remove('disabled')
    hourLabel.classList.remove('disabled')
    minuteLabel.classList.remove('disabled')
  }
}

const disableAction = () => {
  // 0이면 해당 시간 입력 비활성화
  const v0 = formData.value.activInts
  if (v0 === 0) toggleTimeDisabled(1, true)
  else if (v0 !== null && v0 !== undefined) toggleTimeDisabled(1, false)

  const v2 = formData.value.activMod
  if (v2 === 0) toggleTimeDisabled(3, true)
  else if (v2 !== null && v2 !== undefined) toggleTimeDisabled(3, false)

  const v4 = formData.value.activWalk
  if (v4 === 0) toggleTimeDisabled(5, true)
  else if (v4 !== null && v4 !== undefined) toggleTimeDisabled(5, false)

  calculateAnswerNumber()
}

// 조건부 스크롤 composable 사용
const { handleSelectChange } = useConditionalScroll({
  containerSelector: '.CheckupPhysicalActivity--for-wrap',
  pcMargin: 120,
  mobileMargin: 80
})

// Select box 변경 핸들러
const onSelectChange = (value, questionKey, index) => {
  // select 선택 시 validation 에러 해제
  validationErrors.value[questionKey] = false
  
  handleSelectChange(value, questionKey, index, disableAction, physicalActivityScrollRules)
}

const calculateAnswerNumber = () => {
  questionListLength.value = 6
  let minusNumber = 0
  if (formData.value.activInts === 0) {
    formData.value.activIntsTime = null
    minusNumber++
  }
  if (formData.value.activMod === 0) {
    formData.value.activModTime = null
    minusNumber++
  }
  if (formData.value.activWalk === 0) {
    formData.value.activWalkTime = null
    minusNumber++
  }
  questionListLength.value = questionListLength.value - minusNumber
}

watch(
  () => isStop.value,
  async () => {
    // 임시저장
    await handleSave()
  }
)

const changeTime = (value, key) => {
  formData.value[key] = value
  
  // 시간 입력 시 validation 체크
  if (value && value !== '') {
    const selectKey = key.replace('Time', '') // activIntsTime -> activInts
    if (formData.value[selectKey] === null || formData.value[selectKey] === undefined) {
      validationErrors.value[selectKey] = true
    } else {
      validationErrors.value[selectKey] = false
    }
  }
}

const handleBack = () => {
  router.push({name:"CheckupSleep"})
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
    if (!validate()) {
      // 검증 실패 시 버튼 재활성화
      isProcessing.value = false
      return
    }
    const params = {
      physicalActivity: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.physicalActivity.createdDate
    delete params.physicalActivity.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updatePhysicalTemporary(params)
    } else {
      response = await checkupApi.setPhysicalTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.physicalActivity.basicsId)

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

const getPhysicalTemporary = async () => {
  try {
    const response = await checkupApi.getPhysicalTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error('get temp data error', e)
  }
}

onBeforeMount(async () => {
  const physicalTemporary = await getPhysicalTemporary()

  if (physicalTemporary.physicalActivity) {
    formData.value = physicalTemporary.physicalActivity
  }

  progressbar.value = physicalTemporary.progressbar || []

  const idx = progressbar.value.findIndex(
      item => healthLifeStepRoutes[item.pType] === route.name
  )

  current.value = idx === -1 ? 1 : idx + 1

  await nextTick()
  disableAction()

  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  isReady.value = true
})

const validate = () => {
  let rst = true
  
  // 시간 입력이 있지만 select가 선택되지 않은 경우 체크
  if (formData.value.activIntsTime && formData.value.activIntsTime !== '' && 
      (formData.value.activInts === null || formData.value.activInts === undefined)) {
    validationErrors.value.activInts = true
    rst = false
  }
  
  if (formData.value.activModTime && formData.value.activModTime !== '' && 
      (formData.value.activMod === null || formData.value.activMod === undefined)) {
    validationErrors.value.activMod = true
    rst = false
  }
  
  if (formData.value.activWalkTime && formData.value.activWalkTime !== '' && 
      (formData.value.activWalk === null || formData.value.activWalk === undefined)) {
    validationErrors.value.activWalk = true
    rst = false
  }
  
  return rst
}

// validation 에러 상태를 반환하는 함수
const getValidationError = (key) => {
  const selectKey = key.replace('Time', '') // activIntsTime -> activInts
  return validationErrors.value[selectKey] || false
}

onMounted(() => {
  disableAction()
})
const current = ref(0)

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return checkedCount.value !== questionListLength.value
})
const progressbar = ref([])
const { handleStepClick } = healthLifeStepNavigation(progressbar)
const { onStepClick } = useSurveyStepCommon(handleSave, handleStepClick, current, isDisabled)
</script>

<template>
  <section class="container CheckupPhysicalActivity">
<!--    <BaseStep :total="6" :current="4" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar="progressbar.slice(1)"
        :current="current"
        class="CheckupPhysicalActivity--step"
        @clickStep="onStepClick"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_physicalActivity.svg" alt="icon">
          </div>
          {{ $t('CheckupPhysicalActivity.text24') }}
        </div>
        <p class="Checkup--contents-date">
          <span>
            <strong>{{ $t('CheckupPhysicalActivity.text25') }}
            </strong>{{ $t('CheckupPhysicalActivity.text26') }}
          </span>
        </p>
        <div class="Checkup--contents-desc Checkup--info-box">
          <div class="Checkup--info-content">
            <img src="/img/ico_outlineFile.svg" alt="정보 아이콘" class="Checkup--info-icon">
            <span class="Checkup--info-title">{{ $t('CheckupPhysicalActivity.text27') }}
            </span>
          </div>
          <p class="Checkup--info-description">
            {{ $t('CheckupPhysicalActivity.text28') }}
          </p>
        </div>
      </div>
      
      <div class="Checkup--contents-wrapT">

        <div class="CheckupPhysicalActivity--con">
          <div v-for="(item, index) in questionList" :key="index" class="CheckupPhysicalActivity--for-wrap">
            <div v-if="index % 2 == 0" class="CheckupPhysicalActivity--q-wrap">
              <div class="CheckupPhysicalActivity--q-tit">
                <span>{{ index + 1 }}.</span>
                <span v-html="item.question" class="CheckupPhysicalActivity--q-tit-span"></span>
              </div>
              <span class="CheckupPhysicalActivity--q-desc">{{ item.description }}</span>

              <div class="CheckupPhysicalActivity--select-wrap select">
                <BaseSelect
                  v-model="formData[item.key]"
                  :name="'cpaSelect' + index"
                  :options="item.select.map(s => ({ label: s.item, value: s.value }))"
                  :placeholder="$t('CheckupPhysicalActivity.text22')"
                  @change="(value) => onSelectChange(value, item.key, index)"
                />
                <p class="CheckupPhysicalActivity--select-desc" 
                   :style="{ display: getValidationError(item.key) ? 'block' : 'none' }">
                  {{ $t('CheckupPhysicalActivity.text23') }}
                </p>
              </div>
            </div>

            <div v-else class="CheckupPhysicalActivity--q2-wrap">
              <div class="CheckupPhysicalActivity--q2-tit">
                <span>{{ index + 1 }}.</span> 
                <span v-html="item.question" class="CheckupPhysicalActivity--q-tit-span"></span>
              </div>
              <BaseTimeInput
                :foucusTarget="foucusTarget === item.key ? 'minuteRef'
                  :
                  ''"
                :value="formData[item.key]"
                :id="'pa'"
                :index="index"
                :placeholderHour="1"
                @change="(value) => changeTime(value, item.key)" />
                <ul class="CheckupPhysicalActivity--q2--desc" style="display: none">
                  <li>{{ $t('BaseTimeInput.val1') }}</li>
                  <li>{{ $t('BaseTimeInput.val2') }}</li>
                  <li>{{ $t('BaseTimeInput.val3') }}</li>
                </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            @click="debouncedHandleSave"
            :disabled="isDisabled"
            type="button">{{ $t('Common.next') }}
            <!-- <span class="answerNum">({{ checkedCount }}<span>/</span>{{ questionListLength }})</span> -->
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
