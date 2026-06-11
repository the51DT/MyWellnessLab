<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep from '@/components/BaseStep.vue'
import BaseTimeInput from '@/components/BaseTimeInput.vue'
import { nextStep } from '@/assets/js/common'
import {
  useMoveNext,
  healthLifeStepNavigation,
  healthLifeStepRoutes,
  useSurveyStepCommon
} from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import { useRouter } from 'vue-router'

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
const data = [
  {
    key: 'psqik01',
    label: t('CheckupSleep.text2')
  },
  {
    key: 'psqik02',
    label: t('CheckupSleep.text3')
  },
  {
    key: 'psqik03',
    label: t('CheckupSleep.text4')
  },
  {
    key: 'psqik04',
    label: t('CheckupSleep.text5')
  },
  {
    key: 'psqik05',
    label: t('CheckupSleep.text6')
  },
  {
    key: 'psqik06',
    label: t('CheckupSleep.text7')
  },
  {
    key: 'psqik07',
    label: t('CheckupSleep.text8')
  },
  {
    key: 'psqik08',
    label: t('CheckupSleep.text9')
  },
  {
    key: 'psqik09',
    label: t('CheckupSleep.text10')
  },
  {
    key: 'psqik10',
    label: t('CheckupSleep.text11')
  },
  {
    key: 'psqik11',
    label: t('CheckupSleep.text12')
  },
  {
    key: 'psqik12',
    label: t('CheckupSleep.text13')
  },
  {
    key: 'psqik13',
    label: t('CheckupSleep.text14')
  },
  {
    key: 'psqik14',
    label: t('CheckupSleep.text15')
  },
  {
    key: 'psqik15',
    label: t('CheckupSleep.text16')
  },
  {
    key: 'psqik16',
    label: t('CheckupSleep.text17')
  }
]

// 기본 답변 목록 (2~16번 문항용)
const answer = [
  {
    label: t('CheckupSleep.text18'),
    value: 0
  },
  {
    label: t('CheckupSleep.text19'),
    value: 1
  },
  {
    label: t('CheckupSleep.text20'),
    value: 2
  },
  {
    label: t('CheckupSleep.text21'),
    value: 3
  }
]

// 1번 문항 전용 답변 목록
const answerForFirst = [
  {
    label: t('CheckupSleep.text24'),
    value: 0
  },
  {
    label: t('CheckupSleep.text25'),
    value: 1
  },
  {
    label: t('CheckupSleep.text26'),
    value: 2
  },
  {
    label: t('CheckupSleep.text27'),
    value: 3
  }
]

// 15번 문항 전용 답변 목록
const answerForFifteenth = [
  {
    label: t('CheckupSleep.text32'),
    value: 0
  },
  {
    label: t('CheckupSleep.text33'),
    value: 1
  },
  {
    label: t('CheckupSleep.text34'),
    value: 2
  },
  {
    label: t('CheckupSleep.text35'),
    value: 3
  }
]

// 16번 문항 전용 답변 목록
const answerForSixteenth = [
  {
    label: t('CheckupSleep.text18'),
    value: 0
  },
  {
    label: t('CheckupSleep.text36'),
    value: 1
  },
  {
    label: t('CheckupSleep.text37'),
    value: 2
  },
  {
    label: t('CheckupSleep.text38'),
    value: 3
  }
]

const formData = ref({
  id: null,
  basicsId: null,
  psqik01: -1,
  psqik02: -1,
  psqik03: -1,
  psqik04: -1,
  psqik05: -1,
  psqik06: -1,
  psqik07: -1,
  psqik08: -1,
  psqik09: -1,
  psqik10: -1,
  psqik11: -1,
  psqik12: -1,
  psqik13: -1,
  psqik14: -1,
  psqik15: -1,
  psqik16: -1,
  hour: null,
  min: null,
  createdDate: '',
  modifiedDate: '',
})

const foucusTarget = ref('')

const changeTime = (value) => {
  formData.value.hour = Math.floor(value / 60)
  formData.value.min = value % 60

  const hour = value / 60
  let score

  if (hour > 7) {
    score = 0
  } else if (hour >= 6) {
    score = 1
  } else if (hour >= 5) {
    score = 2
  } else {
    score = 3
  }

  formData.value.psqik02 = score
}

const totalSleepTime = computed(() => {
  if (Number.isInteger(formData.value.hour) && Number.isInteger(formData.value.min)) {
    return (formData.value.hour * 60) + formData.value.min
  }

  return null
})

const checkedCount = computed(() => {
  const targetList = [
    formData.value.psqik01,
    formData.value.psqik02,
    formData.value.psqik03,
    formData.value.psqik04,
    formData.value.psqik05,
    formData.value.psqik06,
    formData.value.psqik07,
    formData.value.psqik08,
    formData.value.psqik09,
    formData.value.psqik10,
    formData.value.psqik11,
    formData.value.psqik12,
    formData.value.psqik13,
    formData.value.psqik14,
    formData.value.psqik15,
    formData.value.psqik16
  ]

  return targetList.filter((item) => item !== -1).length
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

const getShTemporary = async () => {
  try {
    const response = await checkupApi.getShTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const handleBack = () => {
  router.push({name:"CheckupDiet"})
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
      sh: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.sh.createdDate
    delete params.sh.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateShTemporary(params)
    } else {
      response = await checkupApi.setShTemporary(params)
    }

    if (response && !isStop.value){
      store.dispatch('checkup/setBasicsId', response.data.sh.basicsId)

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
    console.error(e)
    // 에러 발생 시에만 버튼 재활성화
    isProcessing.value = false
  }
}

const validate = () => {
  let rst = true
  if (formData.value.hour === 0 && formData.value.min === 0)
  {
    foucusTarget.value = 'minuteRef'
    rst = false
  }
  return rst
}

onBeforeMount(async () => {
  const shTemporary = await getShTemporary()

  if (shTemporary.sh) {
    formData.value = shTemporary.sh
  }

  progressbar.value = shTemporary.progressbar || []

  const idx = progressbar.value.findIndex(
      item => healthLifeStepRoutes[item.pType] === route.name
  )

  current.value = idx === -1 ? 1 : idx + 1

  // 다음 틱에서 컴포넌트가 완전히 준비되었음을 표시
  await nextTick()
  isReady.value = true
})

const isDisabled = computed(() => {
  // 처리 중이거나 초기 로딩이 완료되지 않았으면 비활성화
  if (isProcessing.value || !isReady.value) {
    return true
  }

  return checkedCount.value !== data.length
})

const current = ref(0)

const progressbar = ref([])
const { handleStepClick } = healthLifeStepNavigation(progressbar)
const { onStepClick } = useSurveyStepCommon(handleSave, handleStepClick, current, isDisabled)
</script>

<template>
  <section class="container CheckupSleep">
<!--    <BaseStep :total="6" :current="3" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar=" progressbar.slice(1)"
        :current="current"
        class="CheckupSleep--step"
        @clickStep="onStepClick"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ic_sleep.svg" alt="icon">
          </div>
          {{ $t('CheckupInterestHealth.text5') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupSleep.text1')"></span>
        </p>
        <div class="Checkup--contents-desc Checkup--info-box">
          <div class="Checkup--info-content">
            <img src="/img/ico_outlineFile.svg" alt="정보 아이콘" class="Checkup--info-icon">
            <span class="Checkup--info-title">{{ $t('CheckupSleep.text22') }}</span>
          </div>
          <p class="Checkup--info-description">
            {{ $t('CheckupSleep.text23') }}
          </p>
        </div>
      </div>
      
      <div class="Checkup--contents-wrapT">
        <div class="CheckupSleep--con">
          <div v-for="(item, index) in data" :key="index" class="CheckupSleep--div">
            <p class="CheckupSleep--q">
              <span>{{ index + 1 }}.</span> {{ item.label }}
            </p>
            <div :class="[item.key === 'psqik02' ? 'CheckupSleep--q2-wrap' : 'align--between CheckupSleep--a-div']">
              <template v-if="item.key === 'psqik02'">
                <BaseTimeInput
                    :foucusTarget="foucusTarget"
                    :value="totalSleepTime"
                    @change="changeTime"
                    :limit="false"
                />
                <!-- 잘못 입력했을 때 에러메시지 뜨도록 개발 필요 -->
                <ul class="CheckupSleep--q2-wrap--desc" style="display: none">
                  <li>{{ $t('BaseTimeInput.val1') }}</li>
                  <li>{{ $t('BaseTimeInput.val2') }}</li>
                  <li>{{ $t('BaseTimeInput.val3') }}</li>
                </ul>
              </template>
              <template v-else>
                <div v-for="(sItem, sIndex) in (item.key === 'psqik01' ? answerForFirst : item.key === 'psqik15' ? answerForFifteenth : item.key === 'psqik16' ? answerForSixteenth : answer)" :key="sIndex" class="CheckupSleep--for">
                  <label :for="'CheckupSleep' + index + sIndex" class="txt--center CheckupSleep--label">
                    <input
                      v-model="formData[item.key]"
                      @change="nextStep($event, '.CheckupSleep--div', formData, 'psqik')"
                      :value="sItem.value"
                      type="radio"
                      :name="'CheckupSleep' + index"
                      :id="'CheckupSleep' + index + sIndex"
                      class="CheckupSleep--input"
                      hidden="hidden" />

                    <span class="radio--icon" />

                    <span class="CheckupSleep--span">
                      {{ sItem.label }}
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
            <!-- <span class="answerNum">({{ checkedCount }}<span>/</span>{{ data.length }})</span> -->
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
