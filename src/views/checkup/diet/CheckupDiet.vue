<script setup>
import { onBeforeMount, ref, computed, watch, inject, nextTick } from 'vue'
import { useStore } from 'vuex'
import BaseStep from '@/components/BaseStep.vue'
import {
  healthLifeStepNavigation,
  useMoveNext,
  healthLifeStepRoutes,
  useSurveyStepCommon
} from '@/composables/checkup'
import * as checkupApi from '@/apis/checkup'
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import { useRouter } from 'vue-router'
import { scrollToElement } from '@/assets/js/common'

const { t, locale } = useI18n()
const store = useStore()
const moveNext = useMoveNext()
const route = useRoute()
const router = useRouter()

const basicsId = store.getters['checkup/getBasicsId']
const isProcessing = ref(false)
const isReady = ref(false)
let debounceTimeout = null
const data = ref([
  {
    key: 'rfs2',
    label: t('CheckupDiet.text5')
  },
  {
    key: 'rfs5',
    label: t('CheckupDiet.text9')
  },
  {
    key: 'rfs6',
    label: t('CheckupDiet.text10')
  },
  {
    key: 'rfs34',
    label: t('CheckupDiet.text8')
  },
  {
    key: 'rfs3',
    label: t('CheckupDiet.text7')
  },
  {
    key: 'rfs4',
    label: t('CheckupDiet.text6')
  },
  {
    key: 'rfs31',
    label: t('CheckupDiet.text11')
  },
  {
    key: 'rfs32',
    label: t('CheckupDiet.text12')
  },
  {
    key: 'rfs33',
    label: t('CheckupDiet.text13')
  },
  {
    key: 'rfs7',
    label: t('CheckupDiet.text14')
  },
  {
    key: 'rfs11',
    label: t('CheckupDiet.text22')
  },
  {
    key: 'rfs12',
    label: t('CheckupDiet.text23')
  },
  {
    key: 'rfs9',
    label: t('CheckupDiet.text15')
  },
  {
    key: 'rfs8',
    label: t('CheckupDiet.text16')
  },
  {
    key: 'rfs10',
    label: t('CheckupDiet.text17')
  },
  {
    key: 'rfs16',
    label: t('CheckupDiet.text18')
  },
  {
    key: 'rfs17',
    label: t('CheckupDiet.text19')
  },
  {
    key: 'rfs21',
    label: t('CheckupDiet.text21')
  },
  {
    key: 'rfs20',
    label: t('CheckupDiet.text24')
  },
  {
    key: 'rfs13',
    label: t('CheckupDiet.text25')
  },
  {
    key: 'rfs18',
    label: t('CheckupDiet.text20')
  },
  {
    key: 'rfs19',
    label: t('CheckupDiet.text26')
  },
  {
    key: 'rfs22',
    label: t('CheckupDiet.text27')
  },
  {
    key: 'rfs23',
    label: t('CheckupDiet.text28')
  },
  {
    key: 'rfs14',
    label: t('CheckupDiet.text29')
  },
  {
    key: 'rfs15',
    label: t('CheckupDiet.text30')
  },
  {
    key: 'rfs24',
    label: t('CheckupDiet.text31')
  },
  {
    key: 'rfs25',
    label: t('CheckupDiet.text32')
  },
  {
    key: 'rfs30',
    label: t('CheckupDiet.text33')
  },
  {
    key: 'rfs29',
    label: t('CheckupDiet.text34')
  },
  {
    key: 'rfs26',
    label: t('CheckupDiet.text35')
  },
  {
    key: 'rfs28',
    label: t('CheckupDiet.text36')
  },
  {
    key: 'rfs27',
    label: t('CheckupDiet.text37')
  },
  {
    key: 'rfs38',
    label: t('CheckupDiet.text38')
  },
  {
    key: 'rfs37',
    label: t('CheckupDiet.text39')
  },
  {
    key: 'rfs44',
    label: t('CheckupDiet.text40')
  },
  {
    key: 'rfs43',
    label: t('CheckupDiet.text41')
  },
  {
    key: 'rfs36',
    label: t('CheckupDiet.text42')
  },
  {
    key: 'rfs40',
    label: t('CheckupDiet.text43')
  },
  {
    key: 'rfs39',
    label: t('CheckupDiet.text44')
  },
  {
    key: 'rfs41',
    label: t('CheckupDiet.text45')
  },
  {
    key: 'rfs46',
    label: t('CheckupDiet.text46')
  },
  {
    key: 'rfs42',
    label: t('CheckupDiet.text47')
  },
  {
    key: 'rfs45',
    label: t('CheckupDiet.text48')
  },
  {
    key: 'rfs47',
    label: t('CheckupDiet.text49')
  },
  {
    key: 'rfs35',
    label: t('CheckupDiet.text50')
  },
])

const formData = ref({
  id: null,
  basicsId: null,
  rfs1: -1,
  rfs2: 0,
  rfs3: 0,
  rfs4: 0,
  rfs5: 0,
  rfs6: 0,
  rfs7: 0,
  rfs8: 0,
  rfs9: 0,
  rfs10: 0,
  rfs11: 0,
  rfs12: 0,
  rfs13: 0,
  rfs14: 0,
  rfs15: 0,
  rfs16: 0,
  rfs17: 0,
  rfs18: 0,
  rfs19: 0,
  rfs20: 0,
  rfs21: 0,
  rfs22: 0,
  rfs23: 0,
  rfs24: 0,
  rfs25: 0,
  rfs26: 0,
  rfs27: 0,
  rfs28: 0,
  rfs29: 0,
  rfs30: 0,
  rfs31: 0,
  rfs32: 0,
  rfs33: 0,
  rfs34: 0,
  rfs35: 0,
  rfs36: 0,
  rfs37: 0,
  rfs38: 0,
  rfs39: 0,
  rfs40: 0,
  rfs41: 0,
  rfs42: 0,
  rfs43: 0,
  rfs44: 0,
  rfs45: 0,
  rfs46: 0,
  rfs47: 0,
  createdDate: '',
  modifiedDate: ''
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


// 사용자 인터랙션 추적
const userInteracted = ref(false)

watch(
  () => formData.value.rfs1,
  (newValue, oldValue) => {
    // 사용자가 실제로 인터랙션한 경우에만 스크롤
    if (userInteracted.value && oldValue === -1 && (newValue === 0 || newValue === 1)) {
      setTimeout(() => {
        scrollToElement('.CheckupDiet--unit:nth-child(2) .CheckupDiet--unit-tit', 120, 80)
      }, 100)
    }
  }
)

const getDqTemporary = async () => {
  try {
    const response = await checkupApi.getDqTemporary(basicsId)

    return response.data
  } catch (e) {
    console.error(e)
  }
}

const handleBack = async () => {
  router.push({name:"CheckupMedication"})
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
    const params = {
      dq: {
        ...formData.value,
        basicsId
      }
    }

    // createdDate, modifiedDate 전송하면 서버 에러 발생
    delete params.dq.createdDate
    delete params.dq.modifiedDate

    let response = null

    if (formData.value.id) {
      response = await checkupApi.updateDqTemporary(params)
    } else {
      response = await checkupApi.setDqTemporary(params)
    }

    if (response && !isStop.value) {
      store.dispatch('checkup/setBasicsId', response.data.dq.basicsId)

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
onBeforeMount( async () => {
  const dqTemporary = await getDqTemporary()

  if (dqTemporary.dq) {
    formData.value = dqTemporary.dq
  }
  progressbar.value = dqTemporary.progressbar || []

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

  return formData.value.rfs1 === -1
})
const current = ref(0)
const progressbar = ref([])
const { handleStepClick } = healthLifeStepNavigation(progressbar)
const { onStepClick } = useSurveyStepCommon(handleSave, handleStepClick, current, isDisabled)
</script>

<template>
  <section class="container CheckupDiet">
<!--    <BaseStep :total="6" :current="currentStep" @clickStep="handleStepClick" class="CheckupBasics&#45;&#45;step" />-->
    <BaseStep
        v-if="progressbar.length > 0"
        :progressbar="progressbar.slice(1)"
        :current="current"
        class="CheckupDiet--step"
        @clickStep="onStepClick"
    />
    <div class="Checkup--contents-wrap">

      <div class="Checkup--contents-tit-wrap">
        <div class="Checkup--contents-tit">
          <div class="Checkup--contents-icon">
            <img src="/img/ic_diet.svg" alt="icon">
          </div>
          {{ $t('CheckupDiet.text51') }}
        </div>
        <p class="Checkup--contents-date">
          <span v-html="$t('CheckupDiet.text1')"></span>
        </p>
        <div class="Checkup--contents-desc Checkup--info-box">
          <div class="Checkup--info-content">
            <img src="/img/ico_outlineFile.svg" alt="정보 아이콘" class="Checkup--info-icon">
            <span class="Checkup--info-title">{{ $t('CheckupDiet.text2') }}</span>
          </div>
          <p class="Checkup--info-description">
            {{ $t('CheckupDiet.text52') }}
          </p>
        </div>
      </div>

      <div class="Checkup--contents-wrapT">

        <div class="CheckupDiet--con">
          <div class="CheckupDiet--unit">
            <p class="CheckupDiet--unit-tit">
              <span>1.</span> {{ $t('CheckupDiet.text3') }}
            </p>

            <div class="align--between CheckupDiet--unit-input">
              <div class="CheckupDrinkSmokeSleep--unit-l">
                <label
                class="CheckupDiet--unit-label" :class="{ active: formData.rfs1 === 0 }">
                  <input
                    type="radio"
                    name="cdss"
                    class="CheckupDiet--unit-radio"
                    hidden="hidden"
                    :value="0"
                    v-model="formData.rfs1"
                    @click="userInteracted = true"/>
                  <span class="CheckupDiet--unit-span">
                    {{ $t('Common.no') }}
                  </span>
                </label>
              </div>
              <div class="CheckupDiet--unit-l">
                <label
                class="CheckupDiet--unit-label" :class="{ active: formData.rfs1 === 1 }">
                  <input
                    type="radio"
                    name="cdss"
                    class="CheckupDiet--unit-radio"
                    hidden="hidden"
                    :value="1"
                    v-model="formData.rfs1"
                    @click="userInteracted = true"/>
                  <span class="CheckupDiet--unit-span">
                    {{ $t('Common.yes') }}
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="CheckupDiet--unit">
            <p class="CheckupDiet--unit-tit">
              <span>2.</span> 
              <span class="CheckupDiet--unit-tit-span" v-html="$t('CheckupDiet.text4')"></span>
            </p>
            <div class="CheckupDiet--item-div">
              <label
                v-for="(item, index) in data"
                :key="index"
                :for="'cih' + index"
                class="CheckupDiet--label"
                :class="{ 'active': formData[item.key] === 1}">
                <input
                  v-model="formData[item.key]"
                  :true-value="1"
                  :false-value="0"
                  type="checkbox"
                  :id="'cih' + index"
                  hidden="hidden"
                  class="CheckupDiet--input"/>
                  <div class="CheckupDiet--image">
                    <img :src="`/img/diet/ic_${item.key}.svg`"  aria-hidden />
                  </div>
                <span class="CheckupDiet--span" v-html="item.label"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="Checkup--btn-wrap ">
        <div class="btn--bottom">
          <button
            @click="debouncedHandleSave"
            :disabled="isDisabled"
            type="button">{{ $t('Common.next') }}</button>
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
