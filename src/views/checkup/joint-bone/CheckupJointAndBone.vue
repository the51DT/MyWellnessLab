<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import BaseStep from '@/components/BaseStep.vue'
import { nextStep2 } from '@/assets/js/common'
import {useMoveNext, useDynamicMovePrev, dynamicRouterMap, useStepNavigation} from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import BaseOpener from '@/views/checkup_old/BaseOpener.vue'
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
    key: 'womac01',
    question: t('CheckupJointAndBone.text4')
  },
  {
    key: 'womac02',
    question: t('CheckupJointAndBone.text5')
  },
  {
    key: 'womac03',
    question: t('CheckupJointAndBone.text6')
  },
  {
    key: 'womac04',
    question: t('CheckupJointAndBone.text7')
  },
  {
    key: 'womac05',
    question: t('CheckupJointAndBone.text8')
  }
]

const questionData2 = [
  {
    key: 'womac06',
    question: t('CheckupJointAndBone.text15')
  },
  {
    key: 'womac07',
    question: t('CheckupJointAndBone.text16')
  }
]

const questionData3 = [
  {
    key: 'womac08',
    question: t('CheckupJointAndBone.text18')
  },
  {
    key: 'womac09',
    question: t('CheckupJointAndBone.text19')
  },
  {
    key: 'womac10',
    question: t('CheckupJointAndBone.text20')
  },
  {
    key: 'womac11',
    question: t('CheckupJointAndBone.text21')
  },
  {
    key: 'womac12',
    question: t('CheckupJointAndBone.text22')
  },
  {
    key: 'womac13',
    question: t('CheckupJointAndBone.text23')
  },
  {
    key: 'womac14',
    question: t('CheckupJointAndBone.text24')
  },
  {
    key: 'womac15',
    question: t('CheckupJointAndBone.text25')
  },
  {
    key: 'womac16',
    question: t('CheckupJointAndBone.text26')
  },
  {
    key: 'womac17',
    question: t('CheckupJointAndBone.text27')
  },
  {
    key: 'womac18',
    question: t('CheckupJointAndBone.text28')
  },
  {
    key: 'womac19',
    question: t('CheckupJointAndBone.text29')
  },
  {
    key: 'womac20',
    question: t('CheckupJointAndBone.text30')
  },
  {
    key: 'womac21',
    question: t('CheckupJointAndBone.text31')
  },
  {
    key: 'womac22',
    question: t('CheckupJointAndBone.text32')
  },
  {
    key: 'womac23',
    question: t('CheckupJointAndBone.text33')
  },
  {
    key: 'womac24',
    question: t('CheckupJointAndBone.text34')
  }
]

// 답변 목록
const answer = [
  {
    label: t('CheckupJointAndBone.text9'),
    value: 0
  },
  {
    label: t('CheckupJointAndBone.text10'),
    value: 1
  },
  {
    label: t('CheckupJointAndBone.text11'),
    value: 2
  },
  {
    label: t('CheckupJointAndBone.text12'),
    value: 3
  },
  {
    label: t('CheckupJointAndBone.text13'),
    value: 4
  }
]

const formData = ref({
  id: null,
  basicsId: null,
  womac01: -1,
  womac02: -1,
  womac03: -1,
  womac04: -1,
  womac05: -1,
  womac06: -1,
  womac07: -1,
  womac08: -1,
  womac09: -1,
  womac10: -1,
  womac11: -1,
  womac12: -1,
  womac13: -1,
  womac14: -1,
  womac15: -1,
  womac16: -1,
  womac17: -1,
  womac18: -1,
  womac19: -1,
  womac20: -1,
  womac21: -1,
  womac22: -1,
  womac23: -1,
  womac24: -1,
  createdDate: '',
  modifiedDate: ''
})

const isOpen = ref([true, true, true])

const checkedCount = computed(() => {
  const targetList = [
    formData.value.womac01,
    formData.value.womac02,
    formData.value.womac03,
    formData.value.womac04,
    formData.value.womac05,
    formData.value.womac06,
    formData.value.womac07,
    formData.value.womac08,
    formData.value.womac09,
    formData.value.womac10,
    formData.value.womac11,
    formData.value.womac12,
    formData.value.womac13,
    formData.value.womac14,
    formData.value.womac15,
    formData.value.womac16,
    formData.value.womac17,
    formData.value.womac18,
    formData.value.womac19,
    formData.value.womac20,
    formData.value.womac21,
    formData.value.womac22,
    formData.value.womac23,
    formData.value.womac24
  ]

  return targetList.filter((item) => item !== -1).length
})

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return checkedCount.value !== questionList.length + questionData2.length + questionData3.length
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

const getJoinAndBoneTemporary = async () => {
  try {
    const response = await checkupApi.getJoinAndBoneTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const open = (val) => { /* 내용 열고 닫는 */
  isOpen.value[val[1]] = val[0]
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
      jointBone: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.jointBone.createdDate
    delete params.jointBone.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateJoinAndBoneTemporary(params)
    } else {
      response = await checkupApi.setJoinAndBoneTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.jointBone.basicsId)

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
  const joinAndBoneTemporary = await getJoinAndBoneTemporary()

  if (joinAndBoneTemporary.jointBone) {
    formData.value = joinAndBoneTemporary.jointBone
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

  progressbar.value = joinAndBoneTemporary.progressbar || []

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
  <section class="container CheckupJointAndBone">
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
            <img src="/img/ico_jointAndBone.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text20') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupJointAndBone.text1')"></span>
        </p>
      </div>

      <div class="Checkup--contents-wrapT">
        <div class="CheckupJointAndBone--con">
          <div class="align--between">
            <p class="CheckupJointAndBone--p2">
              {{ $t('CheckupJointAndBone.text3') }}
            </p>
            <BaseOpener :order=0 @open="open" />
          </div>
          <transition name="downUp">
            <div v-show="isOpen[0]" class="CheckupJointAndBone--div-wrap">
              <div v-for="(item, index) in questionList" :key="index" class="CheckupJointAndBone--div">
                <p class="CheckupJointAndBone--q">
                  {{ item.question }}
                </p>
                <div class="CheckupJointAndBone--a-div">
                  <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupJointAndBone--for">
                    <label
                      :for="'cjab' + index + sIndex"
                      class="CheckupJointAndBone--label"
                      :class="formData[item.key] === sIndex ? 'active' : ''">
                      <input
                        @change="nextStep2('.CheckupJointAndBone--div', formData, 'womac')"
                        v-model="formData[item.key]"
                        :value="sItem.value"
                        type="radio"
                        :name="'cjab' + index"
                        :id="'cjab' + index + sIndex"
                        class="CheckupJointAndBone--input"
                        hidden="hidden" />
                      <span class="CheckupJointAndBone--span">
                        {{ sItem.label }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="CheckupJointAndBone--con">
          <div class="align--between">
            <p class="CheckupJointAndBone--p2">
              {{ $t('CheckupJointAndBone.text14') }}
            </p>
            <BaseOpener :order=1 @open="open" />
          </div>
          <transition name="downUp">
            <div v-show="isOpen[1]" class="CheckupJointAndBone--div-wrap">
              <div v-for="(item, index) in questionData2" :key="index" class="CheckupJointAndBone--div">
                <p class="CheckupJointAndBone--q">
                  {{ item.question }}
                </p>
                <div class="CheckupJointAndBone--a-div">
                  <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupJointAndBone--for">
                    <label
                      :for="'cjab2' + index + sIndex"
                      class="CheckupJointAndBone--label"
                      :class="formData[item.key] === sIndex ? 'active' : ''">
                      <input
                        @change="nextStep2('.CheckupJointAndBone--div', formData, 'womac')"
                        v-model="formData[item.key]"
                        :value="sItem.value"
                        type="radio"
                        :name="'cjab2' + index"
                        :id="'cjab2' + index + sIndex"
                        class="CheckupJointAndBone--input"
                        hidden="hidden" />
                      <span class="CheckupJointAndBone--span">
                        {{ sItem.label }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="CheckupJointAndBone--con">
          <div class="align--between">
            <p class="CheckupJointAndBone--p2">
              {{ $t('CheckupJointAndBone.text17') }}
            </p>
            <BaseOpener :order=2 @open="open" />
          </div>
          <transition name="downUp">
            <div v-show="isOpen[2]" class="CheckupJointAndBone--div-wrap">
              <div v-for="(item, index) in questionData3" :key="index" class="CheckupJointAndBone--div">
                <p class="CheckupJointAndBone--q">
                  {{ item.question }}
                </p>
                <div class="CheckupJointAndBone--a-div">
                  <div v-for="(sItem, sIndex) in answer" :key="sIndex" class="CheckupJointAndBone--for">
                    <label
                      :for="'cjab3' + index + sIndex"
                      class="CheckupJointAndBone--label"
                      :class="formData[item.key] === sIndex ? 'active' : ''">
                      <input
                        @change="nextStep2('.CheckupJointAndBone--div', formData, 'womac')"
                        v-model="formData[item.key]"
                        :value="sItem.value"
                        type="radio"
                        :name="'cjab3' + index"
                        :id="'cjab3' + index + sIndex"
                        class="CheckupJointAndBone--input"
                        hidden="hidden" />
                      <span class="CheckupJointAndBone--span">
                        {{ sItem.label }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            @click="debouncedHandleSave"
            :disabled="isDisabled"
            type="button">{{ $t('Common.next') }} 
            <!-- <span class="answerNum">({{ checkedCount }}<span>
              /</span>{{ (questionList.length + questionData2.length + questionData3.length) }})</span> -->
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
