<script setup>
import router from '@/router'
import { ref, computed } from 'vue'
import { dateConvert, calcAge } from '@/assets/js/common'
import { useStore } from 'vuex'

const store = useStore()

const analysisType = ref(history.state.analysisType)
const healthDataType = ref(history.state.healthDataType)
const nextDisabled = computed(() => {
  const curDate = new Date()
  const checked = new Date(checkedDate.value)
  return (checked > curDate)
})/* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
const selectDate = ref(new Date())
const maxDate = ref(new Date())
maxDate.value.setDate(maxDate.value.getDate() + 1)
const userData = store.getters.getUser // TODO LYH, 추후 pinia 적용 시 변경 필요

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

  return fullYear + '-' + month + '-' + date
})

const birthDate = computed(() => {
  return userData.dateOfBirth.substring(0, 10).replace(/\./gi, '-')
})

function proceed() {
  const paramObj = {
    checkDate: checkedDate.value,
    name: userData.name,
    birthDate: birthDate.value,
    age: calcAge(birthDate.value, '.'),
    sex: (userData.gender == 'MALE' ? 1 : 2),
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

  if (analysisType.value == 'onetime') {
    delete paramObj.name
    delete paramObj.birthDate
    delete paramObj.age
    delete paramObj.sex
  }

  router.push({
    name: 'CheckupBasics',
    state: {
      analysisType: analysisType.value,
      healthDataType: healthDataType.value,
      analysisData: paramObj
    }
  })
}
</script>

<template>
  <div>
    <section class="AnalyzeCheckDateSelect"> <!--231129 클래스 삭제-->
      <div class="AnalyzeCheckDateSelect--contents"> <!--231129 클래스 삭제-->
        <div class="AnalyzeCheckDateSelect--msg">
          건강데이터의 검진일을 입력해 주세요
        </div>
        <div class="AnalyzeCheckDateSelect--cal">
          <!-- <VCalendar :isToday="true" /> --> <!--231129 변수 추가-->
          <VDatePicker v-model="selectDate" mode="date" :isToday="true" :attributes="attributes" :model-config="config"
            :masks="mask" is-required />
        </div>
      </div>
    </section>
    <div class="btn--bottom">
      <button @click="proceed" :disabled="nextDisabled" type="button" class="btn-one">다음</button>
    </div>

  </div>
</template>

<style lang="scss"></style>
