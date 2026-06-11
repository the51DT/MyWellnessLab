<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import BaseStep from '@/components/BaseStep.vue'
import { nextStep2 } from '@/assets/js/common'
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
    key: 'ipss01',
    question: t('CheckupProstate.text1')
  },
  {
    key: 'ipss02',
    question: t('CheckupProstate.text2')
  },
  {
    key: 'ipss03',
    question: t('CheckupProstate.text3')
  },
  {
    key: 'ipss04',
    question: t('CheckupProstate.text4')
  },
  {
    key: 'ipss05',
    question: t('CheckupProstate.text5')
  },
  {
    key: 'ipss06',
    question: t('CheckupProstate.text6')
  },
  {
    key: 'ipss07',
    question: t('CheckupProstate.text7')
  }
]

// 답변 목록
const answer = [
  {
    label: t('CheckupProstate.text14'),
    value: 0
  },
  {
    label: t('CheckupProstate.text15'),
    value: 1
  },
  {
    label: t('CheckupProstate.text16'),
    value: 2
  },
  {
    label: t('CheckupProstate.text17'),
    value: 3
  },
  {
    label: t('CheckupProstate.text18'),
    value: 4
  },
  {
    label: t('CheckupProstate.text19'),
    value: 5
  }
]

const formData = ref({
  id: null,
  basicsId: null,
  ipss01: -1,
  ipss02: -1,
  ipss03: -1,
  ipss04: -1,
  ipss05: -1,
  ipss06: -1,
  ipss07: -1,
  createdDate: '',
  modifiedDate: ''
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.ipss01,
    formData.value.ipss02,
    formData.value.ipss03,
    formData.value.ipss04,
    formData.value.ipss05,
    formData.value.ipss06,
    formData.value.ipss07
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
    // 임시저장
    await handleSave()
  }
)

// 임시저장된 전립선 검사 조회
const getProstateTemporary = async () => {
  try {
    const response = await checkupApi.getProstateTemporary(basicsId)

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
      prostate: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.prostate.createdDate
    delete params.prostate.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateProstateTemporary(params)
    } else {
      response = await checkupApi.setProstateTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.prostate.basicsId)

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
  const prostateTemporary = await getProstateTemporary()

  if (prostateTemporary.prostate) {
    formData.value = prostateTemporary.prostate
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

  progressbar.value = prostateTemporary.progressbar || []

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
  <section class="container CheckupProstate">
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupProstate--step"
    />
    <div class="Checkup--contents-wrap">
      
      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_prostate.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text18') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupProstate.intro')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">
        <div class="CheckupProstate--con">
          <div v-for="(item, index) in questionList" :key="index" class="CheckupProstate--div">
            <p class="CheckupProstate--q">
              <span>{{ index + 1 }}.</span> {{ item.question }}
            </p>
            <div class="CheckupProstate--a-div">

              <template v-if="index === 6">
                <div
                  v-for="(sItem, sIndex) in answer"
                  :key="sIndex"
                  class="CheckupProstate--for">
                  <label :for="'cp' + index + sIndex" class="CheckupProstate--label" :class="formData[item.key] === sIndex ? 'active' : ''">
                    <input
                      @change="nextStep2('.CheckupProstate--div', formData, 'ipss')"
                      v-model="formData[item.key]"
                      :value="sItem.value"
                      type="radio"
                      :name="'cp' + index"
                      :id="'cp' + index + sIndex"
                      class="CheckupProstate--input"
                      hidden="hidden" />
                    <span class="CheckupProstate--span">
                      {{sItem.label}}
                    </span>
                  </label>
                </div>
              </template>

              <template v-else>
                <div
                  v-for="(sItem, sIndex) in answer"
                  :key="sIndex"
                  class="CheckupProstate--for">
                  <label
                    :for="'cp' + index + sIndex"
                    class="CheckupProstate--label"
                    :class="formData[item.key] === sIndex ? 'active' : ''">
                    <input
                      @change="nextStep2('.CheckupProstate--div', formData, 'ipss')"
                      v-model="formData[item.key]"
                      :value="sItem.value"
                      type="radio"
                      :name="'cp' + index"
                      :id="'cp' + index + sIndex"
                      class="CheckupProstate--input"
                      hidden="hidden" />
                    <span class="CheckupProstate--span">
                      {{sItem.label}}
                    </span>
                  </label>
                </div>
              </template>
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
