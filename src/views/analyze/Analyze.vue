<script setup>
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useMoveStep } from '@/composables/checkup'
import BasePopup from '@/components/BasePopup.vue'
import { format } from 'date-fns'
import * as analysisApi from '@/apis/analysis'
import * as checkupApi from '@/apis/checkup'
import { dateConvert } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const router = useRouter()
const moveStep = useMoveStep()

const isPc = store.getters.getIsPc

const observerAnchor = ref()
const searchParam = ref({
  pageNo: 1,
  perPageNum: 10
})
const total = ref(0)
const totalPage = ref(0)
const successMsg = ref('')
const showSuccessPopup = ref(false)
const showConfirmPopup = ref(false)
const deleteId = ref(null)

const analysisList = ref([])
const progressCheckup = ref(null)

const isShowMoreBtn = computed(() => {
  return searchParam.value.pageNo < totalPage.value && isPc
})

/**
 * 날짜 포멧 변경
 * @param {*} date
 * @returns {string}
 */
const formatDate = (date) => {
  return format(new Date(dateConvert(date, '-')), 'yyyy.MM.dd')
}

/**
 * 분석 결과 조회
 */
const getAnalyzeCompleteList = async () => {
  const response = await analysisApi.getAnalysisCompleteList(searchParam.value)

  analysisList.value = analysisList.value.concat(response.data.content.logmeCompleteAnalysisList)
  total.value = response.data.totalCount
  totalPage.value = Math.ceil(response.data.totalCount / searchParam.value.perPageNum)
}

/**
 * 웰니스 분석 결과 이동
 * @param {number} id
 */
const goDetail = (id) => {
  store.dispatch('checkup/setResultId', id)
  store.dispatch('analyze/setCurrentSection', undefined) // currentSection 초기화

  router.push({ name: 'AnalyzeDetail' })
}

/**
 * 진행 중인 설문 조회
 */
const getProgressCheckup = async () => {
  try {
    const analysisType = 'normal'
    const response = await analysisApi.getProgressCheckup(analysisType)
    progressCheckup.value = response.data
  } catch (e) {
    console.error(e)
  }
}

/**
 * 건강보험공단 검진데이터 조회
 * @param {number} id
 * @returns {object}
 */
const getNhisInfo = async (id) => {
  try {
    const response = await checkupApi.getNhisInfo(id)

    return response.data?.value
  } catch (e) {
    console.error(e)
  }
}

/**
 * 이어서 하기 선택시 저장된 값을 불러와서 스토어에 저장후 페이지 이동
 */
const handleContinue = async () => {
  if (progressCheckup.value.basics.healthDataType === 'formal') {
    const nhisInfo = await getNhisInfo(progressCheckup.value.commonInfo.id)

    if (nhisInfo) {
      const data = {
        checkDate: dateConvert(nhisInfo.resCheckupYear.concat(nhisInfo.resCheckupDate), '.'),
        ht: nhisInfo.resHeight,
        wt: nhisInfo.resWeight,
        wc: nhisInfo.resWaist,
        bmi: nhisInfo.resBMI,
        sbp: nhisInfo.resBloodPressure.split('/')[0],
        dbp: nhisInfo.resBloodPressure.split('/')[1],
        glu: nhisInfo.resFastingBloodSuger,
        tc: nhisInfo.resTotalCholesterol,
        ldl: nhisInfo.resLDLCholesterol,
        hdl: nhisInfo.resHDLCholesterol,
        tg: nhisInfo.resTriglyceride,
        got: nhisInfo.resAST,
        gpt: nhisInfo.resALT,
        crea: nhisInfo.resSerumCreatinine,
        hb: nhisInfo.resHemoglobin
      }

      store.dispatch('checkup/setNhisData', data)
    }
  }

  store.dispatch('checkup/setHealthDataType', progressCheckup.value.basics.healthDataType)
  store.dispatch('checkup/setAnalysisType', progressCheckup.value.commonInfo.analysisType)
  store.dispatch('checkup/setBasicsId', progressCheckup.value.commonInfo.basicsId)
  store.dispatch('analyze/setCurrentSection', undefined) // currentSection 초기화

  moveStep(progressCheckup.value.commonInfo)
}

/**
 * 진행중인 설문 삭제 확인 팝업 표시
 * @param {*} id
 */
const handleDeleteCheckup = (id) => {
  deleteId.value = id
  showConfirmPopup.value = true
}

/**
 * 삭제 확인
 */
const confirmDelete = async () => {
  try {
    await checkupApi.deleteCheckup(deleteId.value)
    
    showConfirmPopup.value = false
    successMsg.value = t('Analyze.text2')
    showSuccessPopup.value = true

    progressCheckup.value = null
    deleteId.value = null
  } catch (e) {
    console.error(e)
    showConfirmPopup.value = false
  }
}

/**
 * 삭제 취소
 */
const cancelDelete = () => {
  showConfirmPopup.value = false
  deleteId.value = null
}

/**
 * 다음 페이지를 조회한다.
 */
const handleMore = async () => {
  searchParam.value.pageNo += 1

  await getAnalyzeCompleteList()
}

onBeforeMount(async () => {
  await getProgressCheckup()
  await getAnalyzeCompleteList()
})

onMounted(async () => {
  const observer = new IntersectionObserver(async ([entrie]) => {
    if (entrie.isIntersecting) {
      if (searchParam.value.pageNo >= totalPage.value) {
        return
      }

      await handleMore()
    }
  }, { rootMargin: '0px 0px 20px 0px' })

  if (!isPc.value) {
    observer.observe(observerAnchor.value)
  }
})

</script>

<template>
  <section class="container AnalyzeList">
    <div class="AnalyzeList--ing">
      <h2 class="AnalyzeList--ing-tit">{{ $t('Analyze.text3') }}</h2>
      <div class="AnalyzeList--ing-con">
        <div v-if="progressCheckup && progressCheckup.commonInfo" class="AnalyzeList--ing-for">
          <div class="AnalyzeList--ing-date-wrap">
            <strong class="AnalyzeList--ing-date">{{ formatDate(progressCheckup.basics.createdDate) }}</strong>
            <span class="AnalyzeList--ing-checkup">({{ $t('Analyze.text4') }}:
              <span class="AnalyzeList--ing-checkup-date">{{ formatDate(progressCheckup.basics.checkDate) }}</span>)
            </span>
          </div>
          <div class="align--between AnalyzeList--ing-btn-wrap">
            <div class="AnalyzeList--ing-continue">
              <button @click="handleContinue" type="button" class="AnalyzeList--ing-continue-btn">{{ $t('Analyze.text5') }}</button>
            </div>
            <div class="AnalyzeList--ing-delete">
              <button
                @click="handleDeleteCheckup(progressCheckup.commonInfo.id)"
                type="button"
                aria-label="삭제"
                class="AnalyzeList--ing-delete-btn">{{ $t('Common.delete') }}</button>
            </div>
          </div>
        </div>

        <div v-else class="AnalyzeList--no-data">{{ $t('Analyze.text6') }}</div>
      </div>
    </div>

    <div class="AnalyzeList--complete">
      <h2 class="AnalyzeList--complete-tit">{{ $t('Analyze.text8') }}</h2>
      <p class="AnalyzeList--complete-total">
        {{ $t('CheckupComplete.text4')}}
        <strong class="AnalyzeList--complete-number">{{ total }}</strong>{{ $t('Analyze.text7') }}
      </p>

      <div class="AnalyzeList--complete-con">
        <div v-for="(item, index) in analysisList" :key="index" class="AnalyzeList--complete-for">
          <div class="AnalyzeList--complete-date-wrap">
            <strong class="AnalyzeList--complete-date">{{ item.analysedDate.substring(0, 10) }}</strong>
            <span class="AnalyzeList--complete-checkup">({{ $t('Analyze.text4') }}:
              <span class="AnalyzeList--complete-checkup-date">{{ item.checkDate }}</span>)
            </span>
          </div>
          <div class="AnalyzeList--complete-btn-wrap">
            <button @click="goDetail(item.id)" type="button" class="AnalyzeList--complete-btn">{{ $t('Analyze.text9') }}</button>
          </div>
        </div>

        <!-- scroll observer -->
        <div ref="observerAnchor" />

        <div v-if="isShowMoreBtn" class="AnalyzeList--more">
          <button @click="handleMore" type="button" class="AnalyzeList--more-btn">{{ $t('Analyze.text10') }}</button>
        </div>

        <div v-if="analysisList.length === 0" class="AnalyzeList--no-data">{{ $t('Analyze.text11') }}</div>

      </div>
    </div>

    <!-- 삭제 확인 팝업 -->
    <BasePopup v-if="showConfirmPopup" class="AnalyzeList--confirm-popup">
      <template #contents>
        <p class="pop-text-bold">{{ $t('Analyze.text1') }}</p>
        <div class="pop-btn-wrap">
          <button @click="cancelDelete" type="button" class="pop-btn pop-btn--gray">{{ $t('Common.cancle') }}</button>
          <button @click="confirmDelete" type="button" class="pop-btn pop-btn--green">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </BasePopup>

    <!-- 삭제 완료 팝업 -->
    <BasePopup v-if="showSuccessPopup" class="AnalyzeList--success-popup">
      <template #contents>
        <p class="pop-text-bold">{{ successMsg }}</p>
        <div class="pop-btn-wrap">
          <button @click="showSuccessPopup = false" type="button" class="pop-btn pop-btn--green">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </BasePopup>
  </section>
</template>
