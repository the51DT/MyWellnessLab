<script setup>
import { ref, computed, onBeforeMount, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import BaseStep from '@/components/BaseStep.vue'
import * as checkupApi from '@/apis/checkup'
import {useMoveNext, useDynamicMovePrev, dynamicRouterMap, useStepNavigation} from '@/composables/checkup'
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
const answerlist = [
  {
    label: t('CheckupMenstrual.text4'),
    value: 1
  },
  {
    label: t('CheckupMenstrual.text5'),
    value: 2
  },
  {
    label: t('CheckupMenstrual.text6'),
    value: 3
  },
  {
    label: t('CheckupMenstrual.text7'),
    value: 4
  },
  {
    label: t('CheckupMenstrual.text8'),
    value: 5
  },
  {
    label: t('CheckupMenstrual.text9'),
    value: 6
  },
  {
    label: t('CheckupMenstrual.text10'),
    value: 7
  }
]

const formData = ref({
  basicsId: null,
  id: 0,
  lwMs: -1,
  createdDate: '',
  modifiedDate: ''
})

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return formData.value.lwMs === -1
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

// 임시저장된 월경 검사 조회
const getMenstrualTemporary = async () => {
  try {
    const response = await checkupApi.getMenstrualTemporary(basicsId)

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
      menstrual: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.menstrual.createdDate
    delete params.menstrual.modifiedDate

    let response = null

    if (formData.value.basicsId) {
      response = await checkupApi.updateMenstrualTemporary(params)
    } else {
      response = await checkupApi.setMenstrualTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.menstrual.basicsId)

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
    console.error('save error !!')
    // 에러 발생 시에만 버튼 재활성화
    isProcessing.value = false
  }
}

const current = ref(0)
const healthInterest = computed(() => store.getters['checkup/getHealthInterest'])

onBeforeMount(async () => {
  const menstrualTemporary = await getMenstrualTemporary()

  if (menstrualTemporary.menstrual) {
    formData.value = menstrualTemporary.menstrual
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

  if (healthInterest.hthWomen === 1) {
    // 중복방지
    if (!selectedKeys.includes('hthWomen')) {
      selectedKeys.push('hthWomen')
    }
  }

  progressbar.value = menstrualTemporary.progressbar || []

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
  <section class="container CheckupMenstrual">
    <BaseStep
        :progressbar="progressbar.slice(1)"
        :current="current"
        @clickStep="handleStepClick"
        class="CheckupMenstrual--step"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_menstrual.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text30') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupMenstrual.text1')"></span>
        </p>
      </div>
      
      <div class="Checkup--contents-wrapT">

        <div class="CheckupMenstrual--con">
          <div class="CheckupMenstrual--div">
            <div class="CheckupMenstrual--a-div">
              <div v-for="(item, index) in answerlist" :key="index" class="CheckupMenstrual--for">
                <label
                  :for="'cm' + index"
                  class="CheckupMenstrual--label"
                  :class="formData.lwMs === item.value ? 'active' : ''">
                  <input
                    v-model="formData.lwMs"
                    :value="item.value"
                    type="radio"
                    :name="'cm' + index"
                    :id="'cm' + index"
                    class="CheckupMenstrual--input"
                    hidden="hidden" />
                  <span class="CheckupMenstrual--span" v-html="item.label">
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
            type="button">
            {{ $t('Common.next') }}
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
