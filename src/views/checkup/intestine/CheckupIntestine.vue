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
    key: 'rome01',
    question: t('CheckupIntestine.text4')
  },
  {
    key: 'rome02',
    question: t('CheckupIntestine.text5')
  },
  {
    key: 'rome03',
    question: t('CheckupIntestine.text6')
  },
  {
    key: 'rome04',
    question: t('CheckupIntestine.text7')
  },
  {
    key: 'rome05',
    question: t('CheckupIntestine.text8')
  },
  {
    key: 'rome06',
    question: t('CheckupIntestine.text9')
  },
  {
    key: 'rome07',
    question: t('CheckupIntestine.text10')
  },
  {
    key: 'rome08',
    question: t('CheckupIntestine.text13')
  }
]

// 답변 목록
const answer = [
  {
    label: t('Common.no'),
    // label: t('Common.no'),
    value: 0
  },
  {
    label: t('Common.yes'),
    // label: t('Common.yes'),
    value: 1
  }
]

const poopQuestionList = [
  {
    label: t('CheckupIntestine.text16'),
    value: 1,
    imgUrl: 'img_ddong1.svg'
  },
  {
    label: t('CheckupIntestine.text17'),
    value: 2,
    imgUrl: 'img_ddong2.svg'
  },
  {
    label: t('CheckupIntestine.text18'),
    value: 3,
    imgUrl: 'img_ddong3.svg'
  },
  {
    label: t('CheckupIntestine.text19'),
    value: 4,
    imgUrl: 'img_ddong4.svg'
  },
  {
    label: t('CheckupIntestine.text20'),
    value: 5,
    imgUrl: 'img_ddong5.svg'
  },
  {
    label: t('CheckupIntestine.text21'),
    value: 6,
    imgUrl: 'img_ddong6.svg'
  },
  {
    label: t('CheckupIntestine.text22'),
    value: 7,
    imgUrl: 'img_ddong7.svg'
  }
]

const formData = ref({
  id: null,
  basicsId: null,
  rome01: -1,
  rome02: -1,
  rome03: -1,
  rome04: -1,
  rome05: -1,
  rome06: -1,
  rome07: -1,
  rome08: -1,
  createdDate: '',
  modifiedDate: ''
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.rome01,
    formData.value.rome02,
    formData.value.rome03,
    formData.value.rome04,
    formData.value.rome05,
    formData.value.rome06,
    formData.value.rome07,
    formData.value.rome08
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
    // 임시 저장
    await handleSave()
  }
)

const getIntestineTemporary = async () => {
  try {
    const response = await checkupApi.getIntestineTemporary(basicsId)

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
      intestine: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.intestine.createdDate
    delete params.intestine.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateIntestineTemporary(params)
    } else {
      response = await checkupApi.setIntestineTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.intestine.basicsId)

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
  const intestineTemporary = await getIntestineTemporary()

  if (intestineTemporary.intestine) {
    formData.value = intestineTemporary.intestine
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

  progressbar.value = intestineTemporary.progressbar || []

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
  <section class="container CheckupIntestine">
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupIntestine--step"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_intestine.svg" alt="icon">
          </div>
          {{ $t('CheckupIntestine.text0') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupIntestine.text1')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">

        <div class="CheckupIntestine--con">
          <div v-for="(item, index) in questionList" :key="index" class="CheckupIntestine--div">
            <p class="CheckupIntestine--q">
              <span>{{ index + 1 }}.</span> {{ item.question }}
            </p>

            <div v-if="item.key !== 'rome08'" class="CheckupIntestine--a-div">
              <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupIntestine--for">
                <label
                  :for="'ci' + index + sIndex"
                  class="CheckupIntestine--label"
                  :class="formData[item.key] === sItem.value ? 'active' : ''">
                   <input
                    @change="nextStep($event, '.CheckupIntestine--div', formData, 'rome')"
                    v-model="formData[item.key]"
                    :value="sItem.value"
                    type="radio"
                    :name="'ci' + index"
                    :id="'ci' + index + sIndex"
                    class="CheckupIntestine--input"
                    hidden="hidden" />
                  <span class="CheckupIntestine--span" v-html="sItem.label" />
                </label>
              </div>
            </div>

            <div v-else class="CheckupIntestine--poop">
              <div class="CheckupIntestine--poop--div">
                <div v-for="(poopItem, poopIndex) in poopQuestionList" :key="poopIndex" class="CheckupIntestine--poop--label-div">
                  <label :for="'cil' + poopIndex" class="CheckupIntestine--poop--label" :class="formData.rome08 === poopItem.value ? 'active' : ''"> <span class="CheckupIntestine--poop--img-wrap">
                      <img :src="'/img/' + poopItem.imgUrl" :alt="poopItem.label" class="CheckupIntestine--poop--img" />
                    </span>
                    <input
                      @change="nextStep($event, '.CheckupIntestine--poop', formData, 'rome')"
                      v-model="formData.rome08"
                      :value="poopItem.value"
                      type="radio"
                      name="cil"
                      :id="'cil' + poopIndex"
                      hidden="hidden"
                      class="CheckupIntestine--poop--input" />
                    <span class="CheckupIntestine--poop--span">{{ poopItem.label }}</span>
                  </label>
                </div>
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
            <!-- <span class="answerNum">({{ checkedCount }}<span>/</span>{{ questionList.length + 1 }})</span> -->
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
