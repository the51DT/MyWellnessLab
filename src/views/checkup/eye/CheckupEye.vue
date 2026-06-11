<script setup>
import { ref, computed, onBeforeMount, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute,useRouter } from 'vue-router'
import BaseStep from '@/components/BaseStep.vue'
import { nextStep } from '@/assets/js/common'
import {dynamicRouterMap, useMoveNext, useDynamicMovePrev, useStepNavigation } from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import { useI18n } from 'vue-i18n'
import BasePopup from "@/views/publishing/BasePopup.vue";

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const moveDynamicPrev = useDynamicMovePrev()
const route = useRoute()
const router = useRouter()

const basicsId = store.getters['checkup/getBasicsId']
const user = store.getters.getUser
const openPopError = ref(false) // 에러시 팝업창
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null

// 질문 목록
const questionList = [
  {
    key: 'esq01',
    question: t('CheckupEye.text2')
  },
  {
    key: 'esq02',
    question: t('CheckupEye.text3')
  },
  {
    key: 'esq03',
    question: t('CheckupEye.text4')
  },
  {
    key: 'esq04',
    question: t('CheckupEye.text5')
  },
  {
    key: 'esq05',
    question: t('CheckupEye.text6')
  },
  {
    key: 'esq06',
    question: t('CheckupEye.text7')
  },
  {
    key: 'esq07',
    question: t('CheckupEye.text8')
  },
  {
    key: 'esq08',
    question: t('CheckupEye.text9')
  },
  {
    key: 'esq09',
    question: t('CheckupEye.text10')
  },
  {
    key: 'esq10',
    question: t('CheckupEye.text11')
  }
]

// 답변 목록
const answer = [
  {
    label: t('CheckupEye.text12'),
    value: 0
  },
  {
    label: t('CheckupEye.text13'),
    value: 1
  },
  {
    label: t('CheckupEye.text14'),
    value: 2
  },
  {
    label: t('CheckupEye.text15'),
    value: 3
  }
]

const formData = ref({
  id: null,
  basicsId: null,
  esq01: null,
  esq02: null,
  esq03: null,
  esq04: null,
  esq05: null,
  esq06: null,
  esq07: null,
  esq08: null,
  esq09: null,
  esq10: null,
  createdDate: '',
  modifiedDate: ''
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.esq01,
    formData.value.esq02,
    formData.value.esq03,
    formData.value.esq04,
    formData.value.esq05,
    formData.value.esq06,
    formData.value.esq07,
    formData.value.esq08,
    formData.value.esq09,
    formData.value.esq10
  ]

  return targetList.filter((item) => Number.isInteger(item)).length
})

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return checkedCount.value !== questionList.length
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

const getEyeTemporary = async () => {
  try {
    const response = await checkupApi.getEyeTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const handleBack = async () => {
  await moveDynamicPrev()
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
      eye: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.eye.createdDate
    delete params.eye.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateEyeTemporary(params)
    } else {
      response = await checkupApi.setEyeTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.eye.basicsId)

      if (shouldMoveNext) {
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

const current = ref(0)
const healthInterest = computed(() => store.getters['checkup/getHealthInterest'])

onBeforeMount(async () => {
  const eyeTemporary = await getEyeTemporary()

  if (eyeTemporary.eye) {
    formData.value = eyeTemporary.eye
  }

  let healthInterest = store.getters['checkup/getHealthInterest']

  if (!healthInterest || healthInterest.basicsId !== basicsId) {
    try {
      healthInterest = await store.dispatch('checkup/fetchHealthInterest', basicsId)
    } catch (e) {
      console.error('❌ fetchHealthInterest 실패', e)
      openPopError.value = true
    }
  }

  if (!healthInterest) {
    openPopError.value = true
    return
  }

  // 3. dynamicRouterMap 기준으로 선택된 key만 추출
  const detailSurveyKeys = Object.keys(dynamicRouterMap)
  const selectedKeys = detailSurveyKeys.filter(key => healthInterest[key] === 1)

  progressbar.value = eyeTemporary.progressbar || []

  // 5. current 계산
  const currentIndex = selectedKeys.findIndex(
      key => dynamicRouterMap[key] === route.name
  )

  current.value = currentIndex + 1

  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  await nextTick()
  isReady.value = true
})

const progressbar = ref([])

const { handleStepClick } = useStepNavigation({
  current,
  isDisabled,
  handleSave,
  user,
  router,
  healthInterest,
  progressbar
})

</script>

<template>
  <section class="container CheckupEye">
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupEye--step"
    />
    <div class="Checkup--contents-wrap">
      
      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_eye.svg" alt="icon">
          </div>
          눈 건강
        </div>
        <p class="Checkup--contents-date" >
          <span v-html="$t('CheckupEye.text1')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">
        <div class="CheckupEye--con">
          <div v-for="(item, index) in questionList" :key="index" class="CheckupEye--div">
            <p class="CheckupEye--q">
              <span>{{ index + 1 }}.</span> {{ item.question }}
            </p>

            <div class="align--between CheckupEye--a-div">
              <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupEye--for">
                <label :for="'eye' + index + sIndex" class="txt--center CheckupEye--label">
                  <input
                    @change="nextStep($event, '.CheckupEye--div', formData, 'esq')"
                    v-model="formData[item.key]"
                    :value="sItem.value"
                    type="radio"
                    :name="'eye' + index"
                    :id="'eye' + index + sIndex"
                    class="CheckupEye--input"
                    hidden="hidden" />

                  <span class="radio--icon" />

                  <span class="CheckupEye--span">
                    {{ sItem.label }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            @click="debouncedHandleSave"
            :disabled="isDisabled"
            type="button"
            class="CheckupEye--btn">{{ $t('Common.next')}} 
            <!-- <span class="answerNum">({{ checkedCount }}<span>/</span>{{ questionList.length }})</span> -->
          </button>
        </div>
        <div class="btn--bottom btn--bottom-line">
          <button
              @click="handleBack"
              type="button"
              class="CheckupEye----btn">{{ $t('Common.prev') }}</button>
        </div>
      </div>
    </div>
  </section>

  <base-popup v-if="openPopError" class="openPopContinue">
    <template v-slot:contents>
      <p>{{ $t('CheckupInterestHealth.text31') }}</p>
      <p class="color--gray space--top-small" />
      <div class="txt--center">
        <button @click="handleBack" class="btn-pop--green" type="button">{{ $t('Common.confirm') }}</button>
      </div>
    </template>
  </base-popup>

</template>
