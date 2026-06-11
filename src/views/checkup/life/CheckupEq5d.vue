<script setup>
import { ref, computed, onBeforeMount, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import {useRoute} from 'vue-router'
import BaseStep from '@/components/BaseStep.vue'
import { nextStep2 } from '@/assets/js/common'
import * as checkupApi from '@/apis/checkup'
import { useRouter } from 'vue-router'

import {
  useMoveNext,
  healthLifeStepRoutes,
  healthLifeStepNavigation,
  useSurveyStepCommon,
  useNextDisabled
} from '@/composables/checkup'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const route = useRoute()
const router = useRouter()

const basicsId = store.getters['checkup/getBasicsId']
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null

// 답변 목록
const answer1 = [
  {
    label: t('CheckupEq5d.text5'),
    value: 4
  },
  {
    label: t('CheckupEq5d.text6'),
    value: 3
  },
  {
    label: t('CheckupEq5d.text7'),
    value: 2
  },
  {
    label: t('CheckupEq5d.text8'),
    value: 1
  }
]
const answer2 = [
  {
    label: t('CheckupEq5d.text5'),
    value: 1
  },
  {
    label: t('CheckupEq5d.text6'),
    value: 2
  },
  {
    label: t('CheckupEq5d.text7'),
    value: 3
  }
]

const answer3 = [
  {
    label: t('CheckupEq5d.answer3_1'),
    value: 1
  },
  {
    label: t('CheckupEq5d.answer3_2'),
    value: 2
  },
  {
    label: t('CheckupEq5d.answer3_3'),
    value: 3
  }
]

const answer4 = [
  {
    label: t('CheckupEq5d.answer4_1'),
    value: 1
  },
  {
    label: t('CheckupEq5d.answer4_2'),
    value: 2
  },
  {
    label: t('CheckupEq5d.answer4_3'),
    value: 3
  }
]

// 질문 목록
const questionList = [
  {
    key: 'mhStress',
    question: t('CheckupEq5d.text4'),
    answer: answer1
  },
  {
    key: 'lq1Eql',
    question: t('CheckupEq5d.text9'),
    answer: answer2
  },
  {
    key: 'lq2Eql',
    question: t('CheckupEq5d.text10'),
    answer: answer2
  },
  {
    key: 'lq3Eql',
    question: t('CheckupEq5d.text11'),
    answer: answer3
  },
  {
    key: 'lq4Eql',
    question: t('CheckupEq5d.text12'),
    answer: answer2
  },
  {
    key: 'lq5Eql',
    question: t('CheckupEq5d.text13'),
    answer: answer4
  }
]

const isOpen = ref([true])

const open = (val) => { /* 내용 열고 닫는 */
  isOpen.value[val[1]] = val[0]
}

const formData = ref({
  eq5D: {
    basicsId: null,
    id: 0,
    lq1Eql: -1,
    lq2Eql: -1,
    lq3Eql: -1,
    lq4Eql: -1,
    lq5Eql: -1,
    createdDate: '',
    modifiedDate: ''
  },
  perceivedStress: {
    basicsId: null,
    createdDate: '',
    id: 0,
    mhStress: -1,
    modifiedDate: ''
  }
})
const formDataCopy = computed(() => { /* 답변 체크 후 답을 하지 않은 질문으로 스크롤하기 위해 새로 생성한 객체 */
  const obj = {
    lqEql01: -1,
    lqEql02: -1,
    lqEql03: -1,
    lqEql04: -1,
    lqEql05: -1,
    lqEql06: -1
  }
  obj.lqEql01 = formData.value.perceivedStress.mhStress
  for (let i = 2; i < 7; i++) {
    obj['lqEql0' + i] = formData.value.eq5D['lq' + (i - 1) + 'Eql']
  }
  return obj
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.eq5D.lq1Eql,
    formData.value.eq5D.lq2Eql,
    formData.value.eq5D.lq3Eql,
    formData.value.eq5D.lq4Eql,
    formData.value.eq5D.lq5Eql,
    formData.value.perceivedStress.mhStress
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

const getLifeTemporary = async () => {
  try {
    const response = await checkupApi.getLifeTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error('get temp data error', e)
  }
}

const handleBack = () => {
  router.push({name:"CheckupDrinkSmokeSleep"})
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
  try {
    const params = formData.value
    params.eq5D.basicsId = basicsId
    params.perceivedStress.basicsId = basicsId

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.eq5D.createdDate
    delete params.eq5D.modifiedDate
    delete params.perceivedStress.createdDate
    delete params.perceivedStress.modifiedDate

    let response = null

    if (formData.value.eq5D.id) {
      response = await checkupApi.updateLifeTemporary(params)
    } else {
      response = await checkupApi.setLifeTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.eq5D.basicsId)

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

onBeforeMount(async () => {
  const lifeTemporary = await getLifeTemporary()

  if (lifeTemporary.eq5D) {
    formData.value.eq5D  = lifeTemporary.eq5D
  }

  if (lifeTemporary.perceivedStress) {
    formData.value.perceivedStress = lifeTemporary.perceivedStress
  }

  progressbar.value = lifeTemporary.progressbar || []

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
const nextDisabled = useNextDisabled(isDisabled, progressbar)
</script>

<template>
  <section class="container CheckupEq5d">
<!--    <BaseStep :total="6" :current="6" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar=" progressbar.slice(1)"
        :current="current"
        class="CheckupEq5d--step"
        @clickStep="onStepClick"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ico_eq5d.svg" alt="icon">
          </div>
          {{ $t('CheckupEq5d.text16') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupEq5d.text14')"></span>
        </p>
        <!-- <p class="Checkup--contents-desc">
          {{ $t('CheckupEq5d.text15') }}
        </p> -->
        <div class="Checkup--contents-desc Checkup--info-box">
          <div class="Checkup--info-content">
            <img src="/img/ico_outlineFile.svg" alt="정보 아이콘" class="Checkup--info-icon">
            <span class="Checkup--info-title">{{ $t('CheckupEq5d.info_title') }}</span>
          </div>
          <p class="Checkup--info-description">
            {{ $t('CheckupEq5d.info_description') }}
          </p>
        </div>
      </div>

      <div class="Checkup--contents-wrapT">
        <div class="CheckupEq5d--con">
          <!-- <div class="align--between">
            <p class="CheckupEq5d--p2">
              {{ $t('CheckupEq5d.text1') }}
            </p>
            <BaseOpener :order=0 @open="open" />
          </div> -->
          <!-- <transition name="downUp"> -->
          <div class="CheckupEq5d--div-wrap">
          <!-- <div v-show="isOpen[0]" class="CheckupEq5d--div-wrap"> -->
            <div v-for="(item, index) in questionList" :key="index" class="CheckupEq5d--div">
              <p class="CheckupEq5d--q">
                <span>{{ index + 1 }}.</span> {{ item.question }}
              </p>

              <div class="CheckupEq5d--a-div">
                <div
                  v-for="(sItem, sIndex) in item.answer"
                  :key="sIndex"
                  class="CheckupEq5d--for">
                  <template v-if="index === 0">
                    <label
                      :for="'ce' + index + sIndex"
                      class="CheckupEq5d--label"
                      :class="formData.perceivedStress.mhStress === sItem.value ? 'active' : ''">
                      <input
                        @change="nextStep2('.CheckupEq5d--div', formDataCopy, 'lqEql')"
                        v-model="formData.perceivedStress.mhStress"
                        :value="sItem.value"
                        type="radio"
                        :name="'ce' + index"
                        :id="'ce' + index + sIndex"
                        class="CheckupEq5d--input"
                        hidden="hidden" />
                                             <span class="CheckupEq5d--span" v-html="sItem.label">
                       </span>
                     </label>
                   </template>

                   <template v-else>
                     <label
                       :for="'ce' + index + sIndex"
                       class="CheckupEq5d--label"
                       :class="formData.eq5D[item.key] === sItem.value ? 'active' : ''">
                       <input
                         @change="nextStep2('.CheckupEq5d--div', formDataCopy, 'lqEql')"
                         v-model="formData.eq5D[item.key]"
                         :value="sItem.value"
                         type="radio"
                         :name="'ce' + index"
                         :id="'ce' + index + sIndex"
                         class="CheckupEq5d--input"
                         hidden="hidden" />
                       <span class="CheckupEq5d--span" v-html="sItem.label">
                       </span>
                    </label>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- </transition> -->
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

    <!-- <div v-if="isShowInfoModal" class="popup base-pop whyLife">
      <div class="popup--wrap tit">
        <div class="align--between popup--header">
          <div>
            <button
              class="header--back-btn"
              title="뒤로"
              type="button"
              @click="handlePrev" />
          </div>
          <div class="popup--tit-wrap" />
          <div>
            <button
              @click="closeInfoModal"
              type="button"
              class="popup--close"
              aria-label="임시저장" />
          </div>
        </div>
        <div class="popup--space space">
          <p class="whyLife--txt">{{ $t('CheckupEq5d.text14') }}</p>
          <p class="whyLife--con">{{ $t('CheckupEq5d.text15') }}</p>
          <div class="base-pop--footer">
            <button class="btn--big6" type="button" @click="closeInfoModal">{{ $t('Common.confirm') }}</button>
          </div>
        </div>
      </div>
    </div> -->
  </section>
</template>

