<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import BaseStep from '@/components/BaseStep.vue'
import { nextStep } from '@/assets/js/common'
import {useMoveNext, useDynamicMovePrev, dynamicRouterMap, useStepNavigation} from '@/composables/checkup'
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
    key: 'smcq01',
    question: t('CheckupMemory.text3')
  },
  {
    key: 'smcq02',
    question: t('CheckupMemory.text4')
  },
  {
    key: 'smcq03',
    question: t('CheckupMemory.text5')
  },
  {
    key: 'smcq04',
    question: t('CheckupMemory.text6')
  },
  {
    key: 'smcq05',
    question: t('CheckupMemory.text7')
  },
  {
    key: 'smcq06',
    question: t('CheckupMemory.text8')
  },
  {
    key: 'smcq07',
    question: t('CheckupMemory.text9')
  },
  {
    key: 'smcq08',
    question: t('CheckupMemory.text10')
  },
  {
    key: 'smcq09',
    question: t('CheckupMemory.text11')
  },
  {
    key: 'smcq10',
    question: t('CheckupMemory.text12')
  },
  {
    key: 'smcq11',
    question: t('CheckupMemory.text13')
  },
  {
    key: 'smcq12',
    question: t('CheckupMemory.text14')
  },
  {
    key: 'smcq13',
    question: t('CheckupMemory.text15')
  },
  {
    key: 'smcq14',
    question: t('CheckupMemory.text16')
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
  basicsId: null,
  id: 0,
  smcq01: -1,
  smcq02: -1,
  smcq03: -1,
  smcq04: -1,
  smcq05: -1,
  smcq06: -1,
  smcq07: -1,
  smcq08: -1,
  smcq09: -1,
  smcq10: -1,
  smcq11: -1,
  smcq12: -1,
  smcq13: -1,
  smcq14: -1
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.smcq01,
    formData.value.smcq02,
    formData.value.smcq03,
    formData.value.smcq04,
    formData.value.smcq05,
    formData.value.smcq06,
    formData.value.smcq07,
    formData.value.smcq08,
    formData.value.smcq09,
    formData.value.smcq10,
    formData.value.smcq11,
    formData.value.smcq12,
    formData.value.smcq13,
    formData.value.smcq14
  ]

  return targetList.filter((item) => item !== -1).length
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
    // 임서저장
    await handleSave()
  }
)

const getMemoryTemporary = async () => {
  try {
    const response = await checkupApi.getMemoryTemporary(basicsId)

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

const handleSave = async ( shouldMoveNext = true ) => {
  // debouncedHandleSave에서 이미 isProcessing을 true로 설정했으므로 
  // 여기서는 중복 체크하지 않고 바로 진행
  if (!isProcessing.value) {
    isProcessing.value = true
  }

  try {
    const params = {
      memory: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.memory.createdDate
    delete params.memory.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateMemoryTemporary(params)
    } else {
      response = await checkupApi.setMemoryTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.memory.basicsId)

      // 다음 설문 이동
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
  const memoryTemporary = await getMemoryTemporary()

  if (memoryTemporary.memory) {
    formData.value = memoryTemporary.memory
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

  progressbar.value = memoryTemporary.progressbar || []

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
  <section class="container CheckupMemory">
<!--    <BaseStep v-if="total > 0" :total="total" :current="current" @clickStep="handleStepClick" class="CheckupMemory&#45;&#45;step" />-->
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupMemory--step"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_memory.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text3') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupMemory.text1')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">

        <div class="CheckupMemory--con">
          <div
            v-for="(item, index) in questionList"
            :key="index"
            :id="'q'+index"
            class="CheckupMemory--div">
            <p class="CheckupMemory--q">
              <span>{{ index + 1 }}.</span> {{ item.question }}
            </p>

            <div class="align--between CheckupMemory--a-div">
              <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupMemory--for">
                <label
                  :for="'CheckupMemory' + index + sIndex "
                  class="CheckupMemory--label"
                  :class="formData[item.key] === sIndex ? 'active' : ''">
                  <input
                    v-model="formData[item.key]"
                    @change="nextStep($event, '.CheckupMemory--div', formData, 'smcq')"
                    :value="sItem.value"
                    type="radio"
                    :name="'CheckupMemory' + index"
                    :id="'CheckupMemory' + index + sIndex"
                    class="CheckupMemory--input"
                    hidden="hidden" />

                  <span class="CheckupMemory--span">{{ sItem.label }}</span>
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
            type="button">{{ $t('Common.next')}} 
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
