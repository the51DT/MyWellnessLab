<script setup>

import BaseStep from '@/components/BaseStep.vue'
import router from '@/router'
import { ref, inject, computed, watch, onBeforeMount, toRaw } from 'vue'
import { useStore } from 'vuex'
import { findNextPage } from '@/assets/js/common'

const store = useStore()

const analysisType = store.getters['checkup/getAnalysisType']
const basicData = store.getters['checkup/getBasicsData']

const axios = inject('$axios')
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/health-interest/temporary'
// TODO Start
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'
const token = store.getters.getToken

const header = {
  Authorization: token
}
// TODO END

const commonInfo = ref({})
const commonInfoStep = ref(3)

const basicsId = ref((basicData ? basicData.id : history.state.interestParam.basicsId))
const interestId = ref(0)
const interestData = ref({ healthInterest: { basicsId: basicsId.value } })
const isModified = ref(false) // 등록/수정 여부

const data = ref([
  { label: '기억력', value: 'hthMemory' },
  { label: '긴장완화', value: 'hthTension' },
  { label: '수면', value: 'hthSleep' },
  { label: '피로', value: 'hthTired' },
  { label: '눈', value: 'hthEye' },
  { label: '피부', value: 'hthSkin' },
  { label: '위', value: 'hthStomach' },
  { label: '간', value: 'hthLiver' },
  { label: '장', value: 'hthIntestine' },
  { label: '체지방', value: 'hthBodyfat' },
  { label: '중성지방', value: 'hthTg' },
  { label: '콜레스테롤', value: 'hthTc' },
  { label: '혈압', value: 'hthBp' },
  { label: '혈행', value: 'hthBf' },
  { label: '혈당', value: 'hthGlu' },
  { label: '전립선', value: 'hthMen' }, /* 여성일 경우: {label: "갱년기", value: "갱년기"},  hthMen / hthWomen */
  { label: '관절/뼈', value: 'hthBj' },
  { label: '근육', value: 'hthMuscle' },
  { label: '과민 피부상태', value: 'hthAtopy' },
  { label: '면역', value: 'hthImmune' },
  { label: '항산화', value: 'hthOxi' },
  { label: '코 과민반응', value: 'hthNose' },
  { label: '운동/지구력', value: 'hthPhysi' }
  // 과민면역(hthAtopy) @Deprecated 정자운동성(hthSperm)
])

const defParam = ref({
  healthInterest: {
    hthAtopy: 0,
    hthBj: 0,
    hthBodyfat: 0,
    hthEye: 0,
    hthImmune: 0,
    hthIntestine: 0,
    hthMemory: 0,
    hthMen: 0,
    hthMuscle: 0,
    hthNose: 0,
    hthOxi: 0,
    hthPhysi: 0,
    hthSleep: 0,
    hthSperm: 0,
    hthStomach: 0,
    hthTired: 0,
    hthSexHor: 0,
    menstrual: 0,
    hthTension: 0,
    hthSkin: 0,
    hthLiver: 0,
    hthTg: 0,
    hthTc: 0,
    hthBp: 0,
    hthBf: 0,
    hthGlu: 0
  }
})

const checkedValues = ref([]) /* 선택된 분야 */
const notInterest = ref(false) /* 관심 분야 없음 */
const fakeCheckedValues = ref([]) /* 선택된 분야 후 관심 건강분야 없음 선택 눌렀을 때 해당 항목 유지용 */

const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return !(((notInterest.value /* && ( checkedValues.value.length == 0 ) */) || (!notInterest.value && (checkedValues.value.length > 0 && checkedValues.value.length < 4))))
})

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, { headers: header })
    .then(res => {
      checkedValues.value = []

      if (res.data.data.healthInterest) {
        isModified.value = true
        basicsId.value = res.data.data.healthInterest.basicsId
        interestId.value = res.data.data.healthInterest.id

        // if(analysisType == 'temporary'){//TODO LYH
        interestData.value = res.data.data
        if (commonInfo.value.lowerStep == 'notInterested') { // 관심없음이 아닌 경우에만 조회한다.
          if (history.state.forward) { /* 선택된 분야 후 관심 건강분야 없음 선택 눌렀을 때 해당 항목 유지용 */
            if (sessionStorage.getItem('notInterestArray')) {
              const fakeArr = sessionStorage.getItem('notInterestArray').split(',')
              checkedValues.value = fakeArr
              setTimeout(function() {
                notInterest.value = true
              }, 50)
            }
          }
        } else {
          setCheckedValues()
        }

        // }
      }
    }).catch(error => {

    })
}

const getCommonInfo = () => {
  const url = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/proceeding/' + analysisType
  axios.get(url, { headers: header })
    .then(res => {
      if (res.data != null && typeof res.data === 'object') {
        commonInfo.value = res.data.data.commonInfo
        basicsId.value = res.data.data.basics.id
        // analysisType = commonInfo.value.analysisType;

        if (commonInfo.value.lowerStep == 'notInterested') { // 관심없음이 아닌 경우에만 조회한다.
          notInterest.value = true
        }
        getTemporaryData()
      } else {
        console.log('임시저장 정보 없음') // TODO soon delete
      }
    })
    .catch(error => {
      console.log(error)
    })
}

const setCheckedValues = () => {
  const arr = interestData.value.healthInterest

  for (const k in arr) {
    if (k.substring(0, 3) == 'hth' && arr[k] == 1) {
      checkedValues.value.push(k)
    }
  }
}

const tempSave = () => {
  if (notInterest.value) { // 관심 건강분야 없음
    fakeCheckedValues.value = checkedValues.value
    checkedValues.value = []
    // isModified.value = true;
  }
  const param = setParam()

  if (!isModified.value) {
    axios.post(api, param, { headers: header })
      .then(res => {
        interestData.value = res.data.data
        nextPage()
      })
      .catch(error => {
        console.log(error)
        alert(error.response.data.message)
      })
  } else {
    axios.put(api, param, { headers: header })
      .then(res => {
        interestData.value = res.data.data
        nextPage()
      })
      .catch(error => {
        console.log(error)
        alert(error.response.data.message)
      })
  }
}

const setParam = () => {
  const param = Object.assign({}, defParam.value.healthInterest)
  const val = (notInterest.value) ? 0 : 1

  for (const k in defParam.value.healthInterest) {
    if (k.substring(0, 3) == 'hth') {
      defParam.value.healthInterest[k] = 0
    }
  }

  for (let i = 0; i < checkedValues.value.length; i++) {
    param[checkedValues.value[i]] = val
  }
  // 관심건강분야 없음 상태가 아니고, 여성인 경우 월경추가
  if (!notInterest.value && basicData.sex == 2) {
    param.menstrual = 1
  }

  if (isModified.value) {
    param.basicsId = interestData.value.healthInterest.basicsId
    param.id = interestData.value.healthInterest.id
    param.checkDate = interestData.value.healthInterest.checkDate
  } else {
    param.basicsId = basicsId.value
    param.checkDate = basicData.checkDate
  }
  return { healthInterest: param }
}

const nextPage = () => {
  let param = {}
  param = findNextPage(toRaw(checkedValues.value), analysisType, Object.assign({ basicsId: basicsId.value, checkDate: basicData.checkDate, sex: basicData.sex }))
  // console.log(param)

  // 관심건강분야 선택 후 관심건강분야 없음 선택 > 다음 화면 이동 했다가 다시 돌아올 경우 이전에 선택한 항목유지되게끔. router.back 으로는 구현이 불가해서 sessionStorage 사용하기로 함.
  // notInterest:notInterest.value, fakeCheckedValues:toRaw(fakeCheckedValues.value)
  if (notInterest.value && fakeCheckedValues.value.length > 0) {
    sessionStorage.setItem('notInterestArray', toRaw(fakeCheckedValues.value))
  } else {
    sessionStorage.removeItem('notInterestArray')
  }

  router.push(param)
}

const changeGenderOption = () => {
  switch (basicData.sex) {
    case 2:
      data.value[15] = { label: '갱년기', value: 'hthSexHor' }
      break
    case 1:
      data.value[15] = { label: '전립선', value: 'hthMen' }
      break
  }
}

watch(checkedValues, () => {
  const maxLength = (basicData.sex == 1 ? 3 : 4)
  if (checkedValues.value.length > maxLength) {
    alert('3개 초과 선택할 수 없습니다')
    checkedValues.value.pop()
  } else if (checkedValues.value.length > 0) {
    notInterest.value = false
    // nextDisabled.value = false;
  } else if (checkedValues.value.length === 0) {
    // nextDisabled.value = true;
  }
})

// 관심 건강분야 없음 선택 시 해제
watch(notInterest, () => {
  if (notInterest.value) {
    // checkedValues.value = [];
  }
})

onBeforeMount(() => {
  changeGenderOption()
  getCommonInfo()
})

</script>

<template>
  <section class="container CheckupInterestHealth">
    <BaseStep :step="`step3`" class="CheckupInterestHealth--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupInterestHealth--info">
          <strong class="CheckupInterestHealth--info-strong">관심 건강분야를 최대 3개</strong>까지 선택해주세요.
        </div>
        <div class="CheckupInterestHealth--item-div">
          <label v-for="(item, index) in data" :for="'cih' + index" class="CheckupInterestHealth--label"
            :class="{ 'active': checkedValues.includes(item.value), 'disabled': notInterest }">
            <input v-model="checkedValues" :value="item.value" :disabled="notInterest" type="checkbox" name=""
              :id="'cih' + index" hidden="hidden" class="CheckupInterestHealth--input">
            <span class="CheckupInterestHealth--span">{{ item.label }}</span>
          </label>
        </div>
        <hr class="gray">
        <label for="qqw" class="CheckupInterestHealth--noSelect" :class="notInterest ? 'active' : ''">
          <input v-model="notInterest" type="checkbox" name="qqw" id="qqw" hidden="hidden">
          <span>관심 건강분야 없음 </span>
        </label>
        <!--          <button type="button" class="CheckupInterestHealth&#45;&#45;noSelect">관심 건강분야 없음</button>-->
        <p class="CheckupInterestHealth--msg">
          * 관심 건강분야가 없는 경우 선택해주세요
        </p>
      </div>
      <div class="btn--bottom CheckupInterestHealth----btn-div">
        <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupInterestHealth----btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
