<script setup>

import BaseStep from '@/components/BaseStep.vue'
import router from '@/router'
import { findNextPage } from '@/assets/js/common'
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw } from 'vue'
import { useStore } from 'vuex'

// TODO Start
const store = useStore()
const axios = inject('$axios')
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/menstrual/temporary'
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'

// TODO Start
const token = store.getters.getToken

const header = {
  Authorization: token
}
// TODO END

const commonInfo = ref({})
const commonInfoStep = ref(3)

const analysisType = ref(history.state.analysisType)
const interestParam = ref(history.state.interestParam) // 설문 관련 파람들
const interestObj = ref(history.state.interestObj) // 관심건강분야 선택항목

const basicsId = ref(history.state.interestParam.basicsId)
const pathIdx = ref(history.state.interestParam.pathIdx)

const isModified = ref(false)
const seqId = ref(0)
const sendParam = ref({
  menstrual: {
    basicsId: basicsId.value
  }
})

const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return selectedValues.value.length !== questionData.value.length
})

const questionData = ref([
  { fieldName: 'lwMs', question: '' }
])

const answer = ref([
  { label: '생리(월경) 중', value: 0 },
  { label: '6개월 내 자녀계획 있음', value: 1 },
  { label: '임신 중', value: 2 },
  { label: '수유 중', value: 3 },
  { label: '폐경기 (마지막 생리 후 1년 미만)', value: 4 },
  { label: '폐경 (마지막 생리 후 1년 이상)', value: 5 },
  { label: '인공 폐경', value: 6 }
])

const selectedValues = ref([]) /* 선택된 값 */

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, { headers: header })
    .then(res => {
      if (res.data.data.menstrual) {
        initTmpData(res.data.data)
      }
    }).catch(error => {

    })
}

const initTmpData = (data) => {
  isModified.value = true
  basicsId.value = data.menstrual.basicsId
  seqId.value = data.menstrual.id

  // if(analysisType.value == 'temporary'){
  Object.assign(sendParam.value, data)
  delete sendParam.value.menstrual.createdDate
  delete sendParam.value.menstrual.modifiedDate

  const tmpData = { fieldName: '', answerValue: '' }

  for (const k in sendParam.value.menstrual) {
    if (k != 'basicsId' && k != 'id' && k != 'checkDate') {
      selectedValues.value.push({ fieldName: k, answerValue: sendParam.value.menstrual[k] })
    }
  }
  // }
}

const getCommonInfo = () => {
  const url = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/proceeding/' + analysisType.value
  axios.get(url, { headers: header })
    .then(res => {
      if (res.data != null && typeof res.data === 'object') {
        commonInfo.value = res.data.data.commonInfo
        basicsId.value = res.data.data.basics.id
        // analysisType.value = commonInfo.value.analysisType;

        getTemporaryData()
      } else {
        console.log('임시저장 정보 없음') // TODO soon delete
      }
    })
    .catch(error => {
      console.log(error)
    })
}

const tempSave = () => {
  setParam()

  if (!isModified.value) {
    axios.post(api, sendParam.value, { headers: header })
      .then(res => {
        nextPage()
      })
      .catch(error => {
        console.log(error)
        alert(error.response.data.message)
      })
  } else {
    axios.put(api, sendParam.value, { headers: header })
      .then(res => {
        nextPage()
      })
      .catch(error => {
        console.log(error)
        alert(error.response.data.message)
      })
  }
}

const setParam = () => {
  let data
  for (const k in selectedValues.value) {
    data = selectedValues.value[k]
    sendParam.value.menstrual[data.fieldName] = data.answerValue
  }
}

const nextPage = () => {
  const param = findNextPage(toRaw(interestObj.value), analysisType.value, toRaw(interestParam.value))
  /* router.push( {//월경이 Step 3 하위로 들어가게 되어서 변경
    name:'dev-CheckupEq5d',
    state:{
      analysisType: analysisType.value,
      basicsId: basicsId.value,
      checkDate: interestParam.value.checkDate,
    }
  }); */
  router.push(param)
}

onBeforeMount(() => {
  if (history.state.forward) { // 뒤로가기를 통해 들어온 경우 pathIdx 삭제
    --pathIdx.value
  }
  getCommonInfo()
})

onUnmounted(function() {
  // scrollTo(0);
})
</script>

<template>
  <section class="container CheckupMenstrual">
    <BaseStep :step="`step3`" class="CheckupMenstrual--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupMenstrual--info">
          <p class="CheckupMenstrual--p">
            현재 <strong>월경(생리, 달거리)</strong> <br> 여부를 알려주세요!
          </p>
        </div>
        <div class="CheckupMenstrual--con">
          <div v-for="(item, index) in questionData" :key="index" class="CheckupMenstrual--div">
            <p class="CheckupMenstrual--q">
              {{ item.question }}
            </p>
            <div class="CheckupMenstrual--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupMenstrual--for">
                <label :for="'cm' + index + idx" class="CheckupMenstrual--label"
                  :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                  <input v-model="selectedValues[index]" :value="{ fieldName: item.fieldName, answerValue: ite.value }"
                    type="radio" :name="'cm' + index" :id="'cm' + index + idx" class="CheckupMenstrual--input"
                    hidden="hidden">
                  <span v-html="ite.label" class="CheckupMenstrual--span"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupMenstrual--btn-div">
        <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupMenstrual--btn">다음</button>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
