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
    key: 'ki01',
    question: t('CheckupMenopause.text4')
  },
  {
    key: 'ki02',
    question: t('CheckupMenopause.text5')
  },
  {
    key: 'ki03',
    question: t('CheckupMenopause.text6')
  },
  {
    key: 'ki04',
    question: t('CheckupMenopause.text7')
  },
  {
    key: 'ki05',
    question: t('CheckupMenopause.text8')
  },
  {
    key: 'ki06',
    question: t('CheckupMenopause.text9')
  },
  {
    key: 'ki07',
    question: t('CheckupMenopause.text10')
  },
  {
    key: 'ki08',
    question: t('CheckupMenopause.text11')
  },
  {
    key: 'ki09',
    question: t('CheckupMenopause.text12')
  },
  {
    key: 'ki10',
    question: t('CheckupMenopause.text13')
  },
  {
    key: 'ki11',
    question: t('CheckupMenopause.text14')
  },
  {
    key: 'ki12',
    question: t('CheckupMenopause.text15')
  }
]

const answer = [
  {
    label: t('CheckupMenopause.text16'),
    value: 0
  },
  {
    label: t('CheckupMenopause.text17'),
    value: 1
  },
  {
    label: t('CheckupMenopause.text18'),
    value: 2
  },
  {
    label: t('CheckupMenopause.text19'),
    value: 3
  }
]

const formData = ref({
  id: null,
  basicsId: null,
  ki01: -1,
  ki02: -1,
  ki03: -1,
  ki04: -1,
  ki05: -1,
  ki06: -1,
  ki07: -1,
  ki08: -1,
  ki09: -1,
  ki10: -1,
  ki11: -1,
  ki12: -1,
  createdDate: '',
  modifiedDate: ''
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.ki01,
    formData.value.ki02,
    formData.value.ki03,
    formData.value.ki04,
    formData.value.ki05,
    formData.value.ki06,
    formData.value.ki07,
    formData.value.ki08,
    formData.value.ki09,
    formData.value.ki10,
    formData.value.ki11,
    formData.value.ki12
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

// 임시저장된 갱년기 검사 조회
const getMenopauseTemporary = async () => {
  try {
    const response = await checkupApi.getMenopauseTemporary(basicsId)

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
      menopause: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.menopause.createdDate
    delete params.menopause.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateMenopauseTemporary(params)
    } else {
      response = await checkupApi.setMenopauseTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.menopause.basicsId)

      // 다음 설문으로 이동
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
  const menopauseTemporary = await getMenopauseTemporary()

  if (menopauseTemporary.menopause) {
    formData.value = menopauseTemporary.menopause
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

  progressbar.value = menopauseTemporary.progressbar || []

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
  <section class="container CheckupMenopause">
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupMenopause--step"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_menopause.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text19') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupMenopause.text1')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">

        <div class="CheckupMenopause--con">
          <div v-for="(item, index) in questionList" :key="index" class="CheckupMenopause--div">
            <p class="CheckupMenopause--q">
              <span>{{ index + 1 }}.</span> {{ item.question }}
            </p>

            <div class="align--around CheckupMenopause--a-div">
              <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupMenopause--for">
                <label :for="'Menopause' + index + sIndex" class="txt--center CheckupMenopause--label">
                  <input
                    @change="nextStep2('.CheckupMenopause--div', formData, 'ki')"
                    v-model="formData[item.key]"
                    :value="sItem.value"
                    type="radio"
                    :name="'Menopause' + index"
                    :id="'Menopause' + index + sIndex"
                    class="CheckupMenopause--input"
                    hidden="hidden" />

                  <span class="radio--icon" />

                  <span class="CheckupMenopause--span" v-html="sItem.label">
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
