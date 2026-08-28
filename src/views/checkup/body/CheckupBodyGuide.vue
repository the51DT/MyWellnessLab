<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useMovePrev, useMoveNext } from '@/composables/checkup'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as checkupApi from '@/apis/checkup'

const { t, locale } = useI18n()
const router = useRouter()
const store = useStore()
const movePrev = useMovePrev()
// 2606 퍼블 확인용 아래 주석이 원본
const moveNext = () => {
  router.push({ name: 'pubCheckupInterestHealth' })
}
// const moveNext = useMoveNext()

// 로딩 상태 추가 (중복 호출 방지)
const isProcessing = ref(false)
// 2606 퍼블 확인용 - 체성분 안내 페이지 진입용 기본 데이터
const publishingCheckupData = {
  basicsId: store.getters['checkup/getBasicsId'] || 1,
  analysisType: store.getters['checkup/getAnalysisType'] || 'onetime',
  healthDataType: store.getters['checkup/getHealthDataType'] || 'direct',
  nhisData: store.getters['checkup/getNhisData'] || {
    checkDate: '2026.10.25'
  }
}

// Emits 정의
const emit = defineEmits([
  'update:selectedBodyComposition',
  'nextStep',
  'prevStep'
])

// 바디키 로그인 페이지로 이동
const goToBody = () => {
  router.push({ name: 'pubCheckupBody' }) // 2606 퍼블 확인용 아래 주석이 원본
  // router.push({ name: 'CheckupBody' })
}


const handleBack = async () => {
  if (isProcessing.value) return
  await movePrev()
}

// 체성분 데이터 삭제 후 다음 페이지로 이동
const handleSkipBodyComposition = async () => {
  // 이미 처리 중이면 중복 실행 방지
  if (isProcessing.value) return
  
  isProcessing.value = true
  
  try {
    // 2606 퍼블 확인용 아래 주석이 원본
    store.dispatch('checkup/setBasicsId', publishingCheckupData.basicsId)
    store.dispatch('checkup/setAnalysisType', publishingCheckupData.analysisType)
    store.dispatch('checkup/setHealthDataType', publishingCheckupData.healthDataType)
    store.dispatch('checkup/setNhisData', publishingCheckupData.nhisData)

    await moveNext()
    return
    // const analysisType = store.getters['checkup/getAnalysisType']
    
    // // 공통 정보에서 basicsId 가져오기
    // const response = await checkupApi.getCommonInfo(analysisType)
    // const commonInfo = response.data.commonInfo
    
    // if (commonInfo.basicsId) {
    //   // 체성분 데이터 삭제
    //   await checkupApi.deleteInbodyTemporary(commonInfo.basicsId)
    //   console.log('체성분 데이터가 삭제되었습니다.')
    // }
  } catch (e) {
    console.error('체성분 데이터 삭제 실패:', e)
    // 삭제 실패해도 다음 페이지로 진행
  } finally {
    // 다음 페이지로 이동
    // await moveNext() // 2606 퍼블 확인용 주석 처리
    // 페이지 이동 후 상태 초기화는 하지 않음 (이미 페이지가 변경되었으므로)
  }
}

</script>

<template>
  <section class="CheckupBodyGuide">
    <div class="CheckupBodyGuide-main">
      <div class="CheckupBodyGuide-con">
        <h1 class="CheckupBodyGuide-tit">{{ $t('CheckupBody.text3')}}</h1>
        <p class="CheckupBodyGuide-desc">
          {{ $t('CheckupBody.text4')}}
        </p>
        <p class="CheckupBodyGuide-desc-sub" v-html="$t('CheckupBody.text5')"></p>
      </div>

      <!-- 선택 버튼들 -->
      <div class="Checkup--btn-wrap">
        <div class="btn--bottom">
          <button
            type="button" @click="goToBody">{{ $t('CheckupBody.text1')}}</button>
        </div>
        <div class="btn--bottom btn--bottom-line">
          <button type="button" @click="handleSkipBodyComposition">{{ $t('CheckupBody.text2')}}</button>
        </div>
        <div class="btn--bottom btn--bottom-line">
          <button type="button" @click="handleBack"> {{ $t('Common.prev')}}</button>
        </div>
      </div>
    </div>
  </section>
</template>