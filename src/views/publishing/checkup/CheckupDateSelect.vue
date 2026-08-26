<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { calcAge, dateConvert } from '@/assets/js/common'
import { format } from 'date-fns'
import { useCheckupSideNavigation } from '@/composables/checkup-side'
// 2606 퍼블 확인위해 api 주석처리
// import * as checkupApi from '@/apis/checkup'

const store = useStore()
const router = useRouter()
const route = useRoute()

// checkup-side 네비게이션 composable 사용
const { handleBack: handleCheckupSideBack } = useCheckupSideNavigation()

// 2606 퍼블 확인용 아래 주석이 원본
const analysisType = computed(() => {
  return store.getters['checkup/getAnalysisType'] || 'normal'
})

const healthDataType = computed(() => {
  return store.getters['checkup/getHealthDataType'] || 'direct'
})
// const analysisType = store.getters['checkup/getAnalysisType']
// const healthDataType = store.getters['checkup/getHealthDataType']

const nextDisabled = computed(() => {
  // 2606 퍼블 확인용 아래 주석이 원본
  const curDate = new Date()
  const checked = new Date(dateConvert(checkedDate.value, '-'))

  if (Number.isNaN(checked.getTime())) {
    return true
  }

  if (checked > curDate) {
    return true
  }

  if (analysisType.value === 'onetime') {
    return false
  }

  const dateOfBirth = userData.value.dateOfBirth || '1990.01.01'
  const birth = new Date(dateConvert(dateOfBirth, '-'))

  if (Number.isNaN(birth.getTime())) {
    return false
  }

  const birthDate = computed(() => {
    return (userData.value.dateOfBirth || '1990.01.01').substring(0, 10)
  })
  const checkupDate = format(checked, 'yyyyMMdd')

  return birthDate > checkupDate

  // const curDate = new Date()
  // const checked = new Date(dateConvert(checkedDate.value, '-'))

  // if (checked > curDate) {
  //   return true
  // }

  // if (analysisType === 'onetime') {
  //   return false
  // }

  // const dateOfBirth = store.getters.getUser.dateOfBirth
  // const birthDate = format(new Date(dateConvert(dateOfBirth, '-')), 'yyyyMMdd')
  // const checkupDate = format(checked, 'yyyyMMdd')

  // return birthDate > checkupDate
})

const selectDate = ref(new Date())
const maxDate = ref(new Date())
maxDate.value.setDate(maxDate.value.getDate() + 1)
// 2606 퍼블 확인용 아래 주석이 원본
const userData = computed(() => {
  const user = store.getters.getUser

  if (user && user.name && user.dateOfBirth) {
    return user
  }

  return {
    name: '홍길동',
    dateOfBirth: '1990.01.01',
    gender: 'MALE'
  }
})
// const userData = store.getters.getUser

const attributes = ref({
  highlight: { fillMode: 'solid' }
})

// TODO LYH Masking 옵션이 적용되지 않는데 추후 다시 확인해볼 필요 있음
const config = ref({
  type: 'string',
  masks: 'YYYY-MM-DD'
})

const mask = ref({
  L: 'YYYY-MM-DD',
  data: ['L', 'YYYY-MM-DD', 'YYYY-MM-DD']
})

const checkedDate = computed(() => {
  selectDate.value = selectDate.value || new Date()
  const fullYear = selectDate.value.getFullYear()
  let month = selectDate.value.getMonth() + 1
  month = (month < 10) ? '0' + month : month
  const date = (selectDate.value.getDate() < 10) ? '0' + selectDate.value.getDate() : selectDate.value.getDate()

  return fullYear + '.' + month + '.' + date
})

function back(){
  // checkup-side 경로인 경우 특별 처리
  if(route.path.startsWith('/checkup-side')){
    handleCheckupSideBack()
    return
  }

  if(route.path === "/dev-analyze-detail"){ /*일회성 분석 결과 페이지일 경우 별도 처리*/
    switch(history.state.back) {
      case '/dev-analyze':
        router.back();
        break;
      default:
        router.push('/');
        break;
    }
  }

  router.back();
}

const handleBack = back

const birthDate = computed(() => {
  // 2606 퍼블 확인용 아래 주석이 원본
  return userData.value.dateOfBirth.substring(0, 10)
  // return userData.dateOfBirth.substring(0, 10)
})

// 2606 퍼블 확인용 아래 주석이 원본
const handleProceed = async () => {
  const paramObj = {
    checkDate: checkedDate.value,
    name: userData.value.name,
    birthDate: birthDate.value,
    age: calcAge(birthDate.value),
    sex: userData.value.gender === 'MALE' ? 1 : 2,
    ht: '',
    wt: '',
    bmi: '',
    sbp: '',
    dbp: '',
    glu: '',
    tc: '',
    ldl: '',
    hdl: '',
    tg: '',
    got: '',
    gpt: '',
    crea: '',
    hb: ''
  }

  if (analysisType.value === 'onetime') {
    delete paramObj.name
    delete paramObj.birthDate
    delete paramObj.age
    delete paramObj.sex
  }

  store.dispatch('checkup/setNhisData', paramObj)
  store.dispatch('checkup/setAnalysisType', analysisType.value)
  store.dispatch('checkup/setHealthDataType', healthDataType.value)
  store.dispatch('checkup/setCheckDate', checkedDate.value)

  router.push('/publishing/checkup-input/checkup-basics')
}
// const handleProceed = async () => {
//   // 기존 설문 내용 초기화 - 진행중인 설문이 있으면 삭제
//   try {
//     const response = await checkupApi.getCommonInfo('normal')
//     const commonInfo = response?.data?.commonInfo

//     if (commonInfo?.id && analysisType !== 'onetime') {
//       await checkupApi.deleteCheckup(commonInfo.id)
//     }
//   } catch (deleteError) {
//     console.error('설문 삭제 실패:', deleteError)
//   }

//   const paramObj = {
//     checkDate: checkedDate.value,
//     name: userData.name,
//     birthDate: birthDate.value,
//     age: calcAge(birthDate.value),
//     sex: (userData.gender === 'MALE' ? 1 : 2),
//     ht: '',
//     wt: '',
//     bmi: '',
//     sbp: '',
//     dbp: '',
//     glu: '',
//     tc: '',
//     ldl: '',
//     hdl: '',
//     tg: '',
//     got: '',
//     gpt: '',
//     crea: '',
//     hb: ''
//   }

//   if (analysisType === 'onetime') {
//     delete paramObj.name
//     delete paramObj.birthDate
//     delete paramObj.age
//     delete paramObj.sex
//   }

//   store.dispatch('checkup/setNhisData', paramObj)
//   store.dispatch('checkup/setAnalysisType', analysisType)
//   store.dispatch('checkup/setHealthDataType', healthDataType)
//   store.dispatch('checkup/setCheckDate', checkedDate.value)

//   router.push({ name: 'CheckupBasics' })
// }
</script>

<template>
  <div class="AnalyzeCheckDateSelect-wrap">
    <section class="AnalyzeCheckDateSelect"> <!--231129 클래스 삭제-->
      <div class="AnalyzeCheckDateSelect--contents"> <!--231129 클래스 삭제-->
        <div class="AnalyzeCheckDateSelect--msg">
          {{ $t('CheckupDateSelect.text1') }}
        </div>
        <div class="AnalyzeCheckDateSelect--cal">
          <!-- <VCalendar :isToday="true" /> --> <!--231129 변수 추가-->
          <VDatePicker
            v-model="selectDate"
            mode="date"
            :isToday="true"
            :attributes="attributes"
            :model-config="config"
            :masks="mask"
            is-required />
        </div>
      </div>
    </section>

    <div class="Checkup--btn-wrap">
      <div class="btn--bottom">
        <button
          @click="handleProceed"
          :disabled="nextDisabled"
          type="button">{{ $t('Common.confirm') }}</button> <!-- 2606 하단 버튼 문구 변경 -->
      </div>
      <!-- 이전 버튼 개발 요망 --> <!-- 2606 이전 버튼 퍼블 확인용 주석처리 -->
      <!-- <div class="btn--bottom btn--bottom-line">
        <button
            @click="handleBack"
            type="button">{{ $t('Common.prev') }}</button>
      </div> -->
    </div>

  </div>
</template>

<style scoped lang="scss">
:deep(.AnalyzeCheckDateSelect .vc-container .vc-day.is-today .vc-day-content.vc-highlight-content-solid){
  background-color: initial;
  &:hover{
    color: white;
  }
}
</style>
