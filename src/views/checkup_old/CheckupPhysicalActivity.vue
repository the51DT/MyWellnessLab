<script setup>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import BaseTimeMinute from '@/views/checkup/BaseTimeMinute.vue'
import router from '@/router'
import { ref, inject, computed, watch, onBeforeMount, onUnmounted, toRaw } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const axios = inject('$axios')
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/physical-activity/temporary'
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'

// TODO Start
const token = store.getters.getToken

const header = {
  Authorization: token
}
// TODO END

const commonInfo = ref({})
const commonInfoStep = ref(5)

const analysisType = ref(history.state.analysisType)
const basicsId = ref(history.state.basicsId)
const checkDate = ref(history.state.checkDate)

const isModified = ref(false)
const seqId = ref(0)
const sendParam = ref({
  physicalActivity: {
    basicsId: basicsId.value,
    activDate: checkDate.value
  }
})

const checkedData = computed(() => { /* 질문을 선택한 항목 배열 */
  return selectedValues.value.filter(obj => ((obj.fieldName.indexOf('Time') == -1 && String(obj.val) !== '')) || (obj.fieldName.indexOf('Time') > -1 && Number(obj.val) >= 0 && obj.fieldName.indexOf('Time') > -1 && Number(obj.val) <= 480))
})

const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return checkedData.value.length !== questionData.value.length
})

const questionData = ref([
  { fieldName: 'activInts', question: '1지난 7일간 숨이 찰 만큼 몸을 움직이는 날은 얼마나 되나요?', description: '(무거운 짐 나르기, 달리기, 에어로빅 등  격렬한 신체활동)', select: [{ item: '전혀 없음', value: 0 }, { item: '1일', value: 1 }, { item: '2일', value: 2 }, { item: '3일', value: 3 }, { item: '4일', value: 4 }, { item: '5일', value: 5 }, { item: '6일', value: 6 }, { item: '7일', value: 7 }] },
  { fieldName: 'activIntsTime', question: '격렬한 신체활동으로 하루를 보낸 시간은 얼마나 되나요?', description: '시간을 24 이상의 수를 입력할 수 없습니다<br>분을 59 이상의 수를 입력할 수 없습니다' },
  { fieldName: 'activMod', question: '지난 7일간 중간정도의 신체 활동을 한날은 얼마나 되나요?', description: '(걷기제외,  가벼운 물건 나르기,  보통 속도의 자전거 타기 등)', select: [{ item: '전혀 없음', value: 0 }, { item: '1일', value: 1 }, { item: '2일', value: 2 }, { item: '3일', value: 3 }, { item: '4일', value: 4 }, { item: '5일', value: 5 }, { item: '6일', value: 6 }, { item: '7일', value: 7 }] },
  { fieldName: 'activModTime', question: '중간정도의 신체활동으로 하루를 보낸 시간은 얼마나 되나요?', description: '시간을 24 이상의 수를 입력할 수 없습니다<br>분을 59 이상의 수를 입력할 수 없습니다' },
  { fieldName: 'activWalk', question: '지난 7일간 적어도 10분 이상 걸은 날은  얼마나 되나요?', description: '(대중교통을 이용, 하거나 여가시간에 걸은 것도 포함)', select: [{ item: '전혀 없음', value: 0 }, { item: '1일', value: 1 }, { item: '2일', value: 2 }, { item: '3일', value: 3 }, { item: '4일', value: 4 }, { item: '5일', value: 5 }, { item: '6일', value: 6 }, { item: '7일', value: 7 }] },
  { fieldName: 'activWalkTime', question: '그러한 날 중 하루동안 걸은 시간은 얼마나 되나요?', description: '시간을 24 이상의 수를 입력할 수 없습니다<br>분을 59 이상의 수를 입력할 수 없습니다' }
])

const validation = ref([]) /* 시간 입력 벨리데이션 */

const selectedValues = ref([
  { fieldName: 'activInts', val: '', hour: '', minute: '' },
  { fieldName: 'activIntsTime', val: '', hour: '', minute: '' },
  { fieldName: 'activMod', val: '', hour: '', minute: '' },
  { fieldName: 'activModTime', val: '', hour: '', minute: '' },
  { fieldName: 'activWalk', val: '', hour: '', minute: '' },
  { fieldName: 'activWalkTime', val: '', hour: '', minute: '' }
]) /* 선택된 값 */

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, { headers: header })
    .then(res => {
      if (res.data.data.physicalActivity) {
        initTmpData(res.data.data)
      }
    }).catch(error => {
      console.log(error)
    })
}

const initTmpData = (data) => {
  isModified.value = true
  basicsId.value = data.physicalActivity.basicsId
  seqId.value = data.physicalActivity.id
  // sendParam.value.physicalActivity.basicsId = basicsId.value;
  sendParam.value.physicalActivity.id = seqId.value

  // if(analysisType.value == 'temporary') {
  Object.assign(sendParam.value, data)
  delete sendParam.value.physicalActivity.createdDate
  delete sendParam.value.physicalActivity.modifiedDate

  const tmpData = { fieldName: '', answerValue: '' }

  for (const k in sendParam.value.physicalActivity) {
    switch (k) {
      case 'activInts':
        selectedValues.value[0].val = sendParam.value.physicalActivity[k]
        break
      case 'activIntsTime':
        selectedValues.value[1].val = sendParam.value.physicalActivity[k]
        selectedValues.value[1].hour = parseInt(selectedValues.value[1].val / 60)
        selectedValues.value[1].minute = (selectedValues.value[1].val - (selectedValues.value[1].hour * 60))
        break
      case 'activMod':
        selectedValues.value[2].val = sendParam.value.physicalActivity[k]
        break
      case 'activModTime':
        selectedValues.value[3].val = sendParam.value.physicalActivity[k]
        selectedValues.value[3].hour = parseInt(selectedValues.value[3].val / 60)
        selectedValues.value[3].minute = (selectedValues.value[3].val - (selectedValues.value[3].hour * 60))
        break
      case 'activWalk':
        selectedValues.value[4].val = sendParam.value.physicalActivity[k]
        break
      case 'activWalkTime':
        selectedValues.value[5].val = sendParam.value.physicalActivity[k]
        selectedValues.value[5].hour = parseInt(selectedValues.value[5].val / 60)
        selectedValues.value[5].minute = (selectedValues.value[5].val - (selectedValues.value[5].hour * 60))
        break
    }
  }
  // }
}

const validate = () => {
  let bool = true
  let data

  for (const index in selectedValues.value) {
    data = selectedValues.value[index]
    if (index != 0 && index % 2 == 1 && data.val > 480) {
      alert('운동시간은 480분 이하로 입력해 주십시오.')
      bool = false
    }
  }

  if (bool) {
    tempSave()
  } else {
    return false
  }
}

const getCommonInfo = () => {
  const url = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/proceeding/' + analysisType.value
  axios.get(url, { headers: header })
    .then(res => {
      if (res.data != null && typeof res.data === 'object') {
        commonInfo.value = res.data.data.commonInfo
        basicsId.value = res.data.data.basics.id
        // analysisType.value = commonInfo.value.analysisType;
        checkDate.value = commonInfo.value.analysedDate.substring(0, 10)
        sendParam.value.physicalActivity.basicsId = basicsId.value
        sendParam.value.physicalActivity.activDate = checkDate.value
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
  sendParam.value.physicalActivity.activDate = checkDate.value
  for (const index in selectedValues.value) {
    data = selectedValues.value[index]
    sendParam.value.physicalActivity[data.fieldName] = data.val
  }
}

const nextPage = () => {
  router.push({
    name: 'CheckupDrinkSmokeSleep',
    state: {
      analysisType: analysisType.value,
      basicsId: basicsId.value,
      checkDate: checkDate.value
    }
  })
}

const inputTxtHour = (val) => {
  const { index, value } = val
  selectedValues.value[index].hour = value
}

const inputTxtMinute = (val) => {
  const { index, value } = val
  selectedValues.value[index].minute = value
}

watch(() => selectedValues.value, (val1, val2) => { // TODO LYH 480분 제한 발리데이션 관련하여 추후 수정 필요(컴포넌트 연계 등)
  let data
  const tmpValue = 0

  for (const index in selectedValues.value) {
    data = selectedValues.value[index]
    if (index != 0 && index % 2 == 1) {
      data.val = ((data.hour * 60) + data.minute)
      /* tmpValue = ( (data.hour*60)+data.minute );
      if(tmpValue > 480) {
        data.val = 480;
        validate = true;
      }else {
        data.val = ( (data.hour*60)+data.minute );
      } */
    }
  }
  console.log(toRaw(selectedValues.value))
}, { deep: true })

onBeforeMount(() => {
  getCommonInfo()
})

onUnmounted(function() {
  // scrollTo(0);
})
</script>

<template>
  <section class="container CheckupPhysicalActivity">
    <BaseStep :step="`step5`" class="CheckupPhysicalActivity--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupPhysicalActivity--info">
          <p class="CheckupPhysicalActivity--p">
            <strong>운동습관</strong>에 관련된 정보를 알려주세요
          </p>
        </div>
        <div class="CheckupPhysicalActivity--con">

          <div v-for="(item, index) in questionData" :key="index" class="CheckupPhysicalActivity--for-wrap">

            <div v-if="index % 2 == 0" class="CheckupPhysicalActivity--q-wrap">
              <div class="CheckupPhysicalActivity--q-tit">{{ item.question }}
                <span class="CheckupPhysicalActivity--q-desc">{{ item.description }}</span>
              </div>
              <div class="CheckupPhysicalActivity--select-wrap">
                <select v-model="selectedValues[index].val" :name="'cpaSelect' + index" id=""
                  class="select CheckupPhysicalActivity--select">
                  <option value="" selected disabled>선택해 주세요</option>
                  <option v-for="itemIn in item.select" :value="itemIn.value">{{ itemIn.item }}</option>
                </select>
              </div>
            </div>

            <div v-else class="CheckupPhysicalActivity--q2-wrap">
              <div class="CheckupPhysicalActivity--q2-tit">{{ item.question }}</div>
              <BaseTimeMinute @inputTxtHour="inputTxtHour" @inputTxtMinute="inputTxtMinute" :id="'pa'" :index="index"
                :hr="selectedValues[index].hour" :mnt="selectedValues[index].minute" />
            </div>

          </div>

        </div>
      </div>
      <div class="btn--bottom CheckupPhysicalActivity--btn-div">
        <button @click="validate" :disabled="nextDisabled" type="button" class="CheckupPhysicalActivity--btn">다음 <span
            class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionData.length }})</span></button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
