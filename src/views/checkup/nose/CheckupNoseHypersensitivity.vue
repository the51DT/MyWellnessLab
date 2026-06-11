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
    key: 'nt01',
    question: t('CheckupNoseHypersensitivity.text2')
  },
  {
    key: 'nt02',
    question: t('CheckupNoseHypersensitivity.text3')
  },
  {
    key: 'nt03',
    question: t('CheckupNoseHypersensitivity.text4')
  },
  {
    key: 'nt04',
    question: t('CheckupNoseHypersensitivity.text5')
  },
  {
    key: 'nt05',
    question: t('CheckupNoseHypersensitivity.text6')
  },
  {
    key: 'nt06',
    question: t('CheckupNoseHypersensitivity.text7')
  },
  {
    key: 'nt07',
    question: t('CheckupNoseHypersensitivity.text8')
  },
  {
    key: 'nt08',
    question: t('CheckupNoseHypersensitivity.text9')
  },
  {
    key: 'nt09',
    question: t('CheckupNoseHypersensitivity.text10')
  },
  {
    key: 'nt10',
    question: t('CheckupNoseHypersensitivity.text11')
  }
]

// 답변 목록
const answer = [
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
  id: null,
  basicsId: null,
  nt01: null,
  nt02: null,
  nt03: null,
  nt04: null,
  nt05: null,
  nt06: null,
  nt07: null,
  nt08: null,
  nt09: null,
  nt10: null,
  createdDate: '',
  modifiedDate: ''
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.nt01,
    formData.value.nt02,
    formData.value.nt03,
    formData.value.nt04,
    formData.value.nt05,
    formData.value.nt06,
    formData.value.nt07,
    formData.value.nt08,
    formData.value.nt09,
    formData.value.nt10
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

const getNoseTemporary = async () => {
  try {
    const response = await checkupApi.getNoseTemporary(basicsId)

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
      noseHypersensitivity: {
        ...formData.value,
        basicsId
      }
    }

    delete params.noseHypersensitivity.createdDate
    delete params.noseHypersensitivity.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateNoseTemporary(params)
    } else {
      response = await checkupApi.setNoseTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.noseHypersensitivity.basicsId)

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
    console.error('save error!!', e)
    // 에러 발생 시에만 버튼 재활성화
    isProcessing.value = false
  }
}

const current = ref(0)
const healthInterest = computed(() => store.getters['checkup/getHealthInterest'])

onBeforeMount(async () => {
  const noseTemporary = await getNoseTemporary()

  if (noseTemporary.noseHypersensitivity) {
    formData.value = noseTemporary.noseHypersensitivity
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

  progressbar.value = noseTemporary.progressbar || []

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
  <section class="container CheckupNoseHypersensitivity">
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupNoseHypersensitivity--step"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_nose.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text25') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupNoseHypersensitivity.text1')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">

        <div class="CheckupNoseHypersensitivity--con">
          <div v-for="(item, index) in questionList" :key="index" class="CheckupNoseHypersensitivity--div">
            <p class="CheckupNoseHypersensitivity--q">
              <span>{{ index + 1 }}.</span> {{ item.question }}
            </p>

            <div class="align--between CheckupNoseHypersensitivity--a-div">
              <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupNoseHypersensitivity--for">
                <label
                  :for="'cm' + index + sIndex"
                  class="CheckupNoseHypersensitivity--label"
                  :class="formData[item.key] === sIndex ? 'active' : ''">
                  <input
                    @change="nextStep($event, '.CheckupNoseHypersensitivity--div', formData, 'nt')"
                    v-model="formData[item.key]"
                    :value="sItem.value"
                    type="radio"
                    :name="'cm' + index"
                    :id="'cm' + index + sIndex"
                    class="CheckupNoseHypersensitivity--input"
                    hidden="hidden" />

                  <span class="CheckupNoseHypersensitivity--span">{{ sItem.label }}</span>
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
            type="button">{{ $t('Common.next') }}
            <!-- <span class="answerNum">({{ checkedCount }}<span>/</span>{{ questionList.length }})</span> -->
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
