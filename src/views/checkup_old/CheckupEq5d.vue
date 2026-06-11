<script setup>

import BaseStep from '@/components/BaseStep.vue'
import router from '@/router'
import { nextStep, findNextPage } from '@/assets/js/common'
import { ref, inject, computed, onBeforeMount, onUnmounted, toRaw } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const axios = inject('$axios')
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/perceived-stress/temporary'
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'

// TODO Start
const token = store.getters.getToken

const header = {
  Authorization: token
}
// TODO END

const commonInfo = ref({})
const commonInfoStep = ref(4)
console.log(history.state)
const analysisType = ref(history.state.analysisType)
const interestParam = ref(history.state.interestParam) // 설문 관련 파람들
// const interestObj = ref(history.state.interestObj);     //관심건강분야 선택항목

const basicsId = ref(interestParam.value.basicsId)
// const pathIdx = ref(history.state.interestParam.pathIdx);

const isModified = ref(false)
const seqId = ref(0)
const sendParam = ref({
  eq5D: {
    basicsId: basicsId.value,
    svyDate: interestParam.value.checkDate
  },
  perceivedStress: {
    basicsId: basicsId.value,
    mhStress: 0,
    svyDate: interestParam.value.checkDate
  }
})

const checkedData = computed(() => { /* 질문을 선택한 항목 배열 */
  return selectedValues.value.filter(val => (val !== undefined))
})

const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return checkedData.value.length !== questionData.value.length
})

const questionData = ref([
  { fieldName: 'mhStress', question: '일상생활 중에 스트레스를 어느정도 느끼고 있나요?', answer: [{ label: '거의 없다', value: 0 }, { label: '조금 있다', value: 1 }, { label: '많이 있다', value: 2 }, { label: '대단히 있다', value: 3 }] },
  { fieldName: 'lq1Eql', question: '일상생활 중 걸을 때 지장이 있나요?' },
  { fieldName: 'lq2Eql', question: '일상생활 중 목욕을 하거나 옷을 입는데 지장이 있나요?' },
  { fieldName: 'lq3Eql', question: '평범한 일상생활을 하는데 지장이 있나요?' },
  { fieldName: 'lq4Eql', question: '일상생활에서 주로 사용하는 목, 어깨, 허리, 골반 등의 부위에서 움직이기 불편할 정도의 통증을 느끼나요?' },
  { fieldName: 'lq5Eql', question: '일상생활이 하기 힘들 정도로 불안하거나 우울한가요?' }
])

const answer = ref([
  { label: '거의 없다', value: 0 },
  { label: '조금 있다', value: 1 },
  { label: '많이 있다', value: 2 }
])

const selectedValues = ref([]) /* 선택된 값 */

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, { headers: header })
    .then(res => {
      selectedValues.value = []
      if (res.data.data.eq5D) {
        initTmpData(res.data.data)
      }
    }).catch(error => {

    })
}

const initTmpData = (data) => {
  isModified.value = true
  basicsId.value = data.eq5D.basicsId
  seqId.value = data.eq5D.id

  // if(analysisType.value == 'temporary'){
  Object.assign(sendParam.value, data)
  delete sendParam.value.eq5D.createdDate
  delete sendParam.value.eq5D.modifiedDate
  delete sendParam.value.perceivedStress.createdDate
  delete sendParam.value.perceivedStress.modifiedDate
  sendParam.value.eq5D.svyDate = interestParam.value.checkDate
  sendParam.value.perceivedStress.svyDate = interestParam.value.checkDate

  const tmpData = { fieldName: '', answerValue: '' }
  selectedValues.value.push({ fieldName: 'mhStress', answerValue: sendParam.value.perceivedStress.mhStress })

  for (const k in sendParam.value.eq5D) {
    if (k != 'basicsId' && k != 'id' && k != 'svyDate') {
      selectedValues.value.push({ fieldName: k, answerValue: sendParam.value.eq5D[k] })
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
        checkedData.value = commonInfo.value.analysedDate.substring(0, 10)

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
    if (k != 'mhStress') {
      sendParam.value.eq5D[data.fieldName] = data.answerValue
    } else {
      sendParam.value.perceivedStress[data.fieldName] = data.answerValue
    }
  }
  sendParam.value.eq5D.svyDate = interestParam.value.checkDate
  sendParam.value.perceivedStress.svyDate = interestParam.value.checkDate
  console.log(toRaw(sendParam.value))
}

const nextPage = () => {
  // let param = findNextPage( toRaw(interestObj.value), analysisType.value, toRaw(interestParam.value) );
  router.push({
    name: 'CheckupPhysicalActivity',
    state: {
      analysisType: analysisType.value,
      basicsId: basicsId.value,
      checkDate: interestParam.value.checkDate
    }
  })
}

onBeforeMount(() => {
  if (history.state.forward) { // 뒤로가기를 통해 들어온 경우 pathIdx 삭제
    // analysisType.value = 'temporary';
  }
  getCommonInfo()
})

onUnmounted(function() {
  // scrollTo(0);
})
</script>

<template>
  <section class="container CheckupEq5d">
    <BaseStep :step="`step4`" class="CheckupEq5d--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupEq5d--info">
          <p class="CheckupEq5d--p">
            <strong>일상생활</strong>에서 겪는 <br>
            증상을 아래 중 선택하세요
          </p>
        </div>
        <div class="CheckupEq5d--con">
          <div v-for="(item, index) in questionData" :key="index" class="CheckupEq5d--div">
            <p class="CheckupEq5d--q">
              {{ item.question }}
            </p>
            <div class="CheckupEq5d--a-div">

              <div v-if="index === 0" v-for="(ite, idx) in item.answer" :key="idx" class="CheckupEq5d--for">
                <label @click="nextStep($event, '.CheckupEq5d--div')" :for="'ce' + index + idx" class="CheckupEq5d--label"
                  :class="selectedValues[index] && selectedValues[index].answerValue === idx ? 'active' : ''">
                  <input v-model="selectedValues[index]" :value="{ fieldName: item.fieldName, answerValue: ite.value }"
                    type="radio" :name="'ce' + index" :id="'ce' + index + idx" class="CheckupEq5d--input" hidden="hidden">
                  <span v-html="ite.label" class="CheckupEq5d--span"></span>
                </label>
              </div>

              <div v-else v-for="(ite, idx2) in answer" :key="idx2" class="CheckupEq5d--for">
                <label @click="nextStep($event, '.CheckupEq5d--div')" :for="'ce' + index + idx2"
                  class="CheckupEq5d--label"
                  :class="selectedValues[index] && selectedValues[index].answerValue === idx2 ? 'active' : ''">
                  <input v-model="selectedValues[index]" :value="{ fieldName: item.fieldName, answerValue: ite.value }"
                    type="radio" :name="'ce' + index" :id="'ce' + index + idx2" class="CheckupEq5d--input"
                    hidden="hidden">
                  <span v-html="ite.label" class="CheckupEq5d--span"></span>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupEq5d--btn-div">
        <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupEq5d--btn">다음 <span
            class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
