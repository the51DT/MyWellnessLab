<script setup>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import BaseTimeMinute from '@/views/checkup/BaseTimeMinute.vue'
import router from '@/router'
import { ref, inject, computed, watch, onBeforeMount, onUnmounted, toRaw } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const axios = inject('$axios')
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/four-powers/temporary'
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'

// TODO Start
const token = store.getters.getToken

const header = {
  Authorization: token
}
// TODO END

const commonInfo = ref({})
const commonInfoStep = ref(6)

const analysisType = ref(history.state.analysisType)
const basicsId = ref(history.state.basicsId)
const checkDate = ref(history.state.checkDate)

const isModified = ref(false)
const seqId = ref(0)
const sendParam = ref({})

const checkedData = computed(() => { /* 질문을 선택한 항목 배열 */
  const checkedArr = []
  let tmpObj
  let tmpKey

  for (const k in selectedValues.value) {
    for (const k1 in selectedValues.value[k]) {
      if (
        k1 == 'drink' || k1 == 'drinkFreq' || k1 == 'drinkFreqType' || k1 == 'drinkVol' || k1 == 'sleepHr' || k1 == 'sleepMin' ||
        k1 == 'smok' || k1 == 'smokAmt' || k1 == 'smokDurYear' || k1 == 'waterAmt'
      ) {
        tmpObj = {}
        tmpKey = (k + '_' + k1)
        tmpObj[tmpKey] = selectedValues.value[k][k1]

        switch (k1) {
          case 'drink':
          case 'drinkSort':
          case 'drinkVolType':
            if (selectedValues.value[k][k1] > -1) checkedArr.push(tmpObj)
            break
          case 'drinkFreq':
          case 'drinkVol':
            if (selectedValues.value[k].drink == 0 && selectedValues.value[k][k1] == 0 ||
              selectedValues.value[k].drink == 1 && selectedValues.value[k][k1] > 0
            ) {
              checkedArr.push(tmpObj)
            }
            break
          case 'sleepHr':
          case 'smok':
          case 'waterAmt':
            if (selectedValues.value[k][k1] > 0) checkedArr.push(tmpObj)
            break
          case 'smokAmt':
          case 'smokDurYear':
            if (selectedValues.value[k].smok == 3 && selectedValues.value[k][k1] == 0 || // 비흡연인 경우
              selectedValues.value[k].drink != 3 && selectedValues.value[k][k1] > 0 // 흡연/금연인 경우
            ) {
              checkedArr.push(tmpObj)
            }
            break
          case 'sleepMin':
            if (selectedValues.value[k][k1] >= 0) checkedArr.push(tmpObj)
            break
        }
      }
    }
  }

  console.log(checkedArr)
  return checkedArr
})

const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return checkedData.value.length !== questionCount.value
})

const isDrinkInput = computed(() => { // 음주량 활성화
  const bool = selectedValues.value.drinking.drink < 1
  if (bool) {
    selectedValues.value.drinking.drinkFreq = ''
    selectedValues.value.drinking.drinkFreqType = 1
    selectedValues.value.drinking.drinkSort = 1
    selectedValues.value.drinking.drinkVol = ''
    selectedValues.value.drinking.drinkVolType = 1
  }
  return bool
})

const isSmokInput = computed(() => { // 담배 소비량 활성화
  const bool = selectedValues.value.smoking.smok == 3
  if (bool) {
    selectedValues.value.smoking.smokAmt = ''
    selectedValues.value.smoking.smokDurYear = ''
  }
  return bool
})

const userName = ref(store.getters.getUser.name)

const questionCount = ref(9)

const answer = ref([
  { label: '네', value: 1 },
  { label: '아니요', value: 0 }
])

const smokeBtn = ref([ /* 흡연 여부 보기 */
  { label: '현재 흡연을 하거나 금연기간 1년 이내', value: 1 },
  { label: '금연기간 1년 이상', value: 2 },
  { label: '피운 적 없음', value: 3 }
])

const selectedValues = ref({
  drinking: {
    basicsId: basicsId.value,
    drink: -1, // 음주여부 0 : 비음주 1 : 음주 -1:최초 진입시 미선택 처리용
    drinkDate: checkDate.value, // 조사일(YYYY-MM-DD)
    drinkFreq: '', // 섭취횟수
    drinkFreqType: 1, // 섭취횟수 단위 1:주 2:월
    drinkSort: 1, // 술 종류 1: 소주, 2: 맥주, 3: 막걸리, 4: 포도주, 5: 양주, 6: 청주/정종
    drinkVol: '', // 섭취량
    drinkVolType: 1 // 섭취량 단위 1: 잔, 2: 병
  },
  sleep: {
    basicsId: basicsId.value,
    sleepDate: checkDate.value, // 조사일(YYYY-MM-DD)
    sleepHr: '', // 평균 수면시간 (시)
    sleepMin: '' // 평균 수면시간 (분)
  },
  smoking: {
    basicsId: basicsId.value,
    smok: -1, // 흡연여부 1: 흡연 2: 금연 3: 비흡연 -1:최초 진입시 미선택 처리용
    smokAmt: '', // 담배 소비량 개비/일
    smokDate: checkDate.value, // 조사일(YYYY-MM-DD)
    smokDurYear: '' // 총 흡연기간
  },
  water: {
    basicsId: basicsId.value,
    waterAmt: '', // 수분섭취량
    waterDate: checkDate.value // 조사일(YYYY-MM-DD)
  }
}) /* 선택된 값 */

const getTemporaryData = () => {
  axios.get(api + '/' + basicsId.value, { headers: header })
    .then(res => {
      if (res.data.data.drinking) {
        initTmpData(res.data.data)
      }
    }).catch(error => {
      console.log(error)
    })
}

const initTmpData = (data) => {
  // if(data.drinking ){
  isModified.value = true
  basicsId.value = data.drinking.basicsId
  // }

  // if(analysisType.value == 'temporary') {
  Object.assign(sendParam.value, data)
  delete sendParam.value.drinking.createdDate
  delete sendParam.value.drinking.modifiedDate
  delete sendParam.value.sleep.createdDate
  delete sendParam.value.sleep.modifiedDate
  delete sendParam.value.smoking.createdDate
  delete sendParam.value.smoking.modifiedDate
  delete sendParam.value.water.createdDate
  delete sendParam.value.water.modifiedDate

  Object.assign(selectedValues.value, sendParam.value)
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
        checkDate.value = commonInfo.value.analysedDate.substring(0, 10)

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
  Object.assign(sendParam.value, selectedValues.value)
  let data
  for (const k in selectedValues.value) {
    for (const k1 in selectedValues.value[k]) {
      if (k1.indexOf('date') > -1) {
        selectedValues.value[k][k1] = checkDate.value
      } else {
        // 미입력 변환처리
        if (selectedValues.value[k][k1] === '') {
          selectedValues.value[k][k1] = 0
        }
      }
    }
  }
}

const nextPage = () => {
  router.push({
    name: 'CheckupComplete',
    state: {
      analysisType: analysisType.value,
      basicsId: basicsId.value,
      checkDate: checkDate.value
    }
  })
}

const setSleepHour = (val) => { /* 자식에게서 받아서 값 세팅 */
  selectedValues.value.sleep.sleepHr = val.value
}

const setSleepMinute = (val) => { /* 자식에게서 받아서 값 세팅 */
  selectedValues.value.sleep.sleepMin = val.value
}

onBeforeMount(() => {
  getCommonInfo()
})

onUnmounted(function() {
  // scrollTo(0);
})
</script>

<template>
  <section class="container CheckupDrinkSmokeSleep">
    <BaseStep :step="`step6`" class="CheckupDrinkSmokeSleep--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupDrinkSmokeSleep--info-wrap">
          <p class="CheckupDrinkSmokeSleep--info">
            <strong>음주</strong>에 관련된 정보를 알려주세요
          </p>
        </div>
        <div class="CheckupDrinkSmokeSleep--con-wrap">

          <div class="CheckupDrinkSmokeSleep--con"> <!--음주-->

            <div class="CheckupDrinkSmokeSleep--unit">
              <p class="CheckupDrinkSmokeSleep--unit-tit">
                {{ userName }}님, 음주를 하시나요?
              </p>
              <div class="align--between CheckupDrinkSmokeSleep--unit-input">
                <div v-for="(item, index) in answer" :key="index" class="CheckupDrinkSmokeSleep--unit-l">
                  <label :for="'cdss' + index" class="CheckupDrinkSmokeSleep--unit-label"
                    :class="selectedValues.drinking.drink == item.value ? 'active' : ''">
                    <input v-model="selectedValues.drinking.drink" :value="item.value" type="radio" name="cdss"
                      :id="'cdss' + index" class="CheckupDrinkSmokeSleep--unit-radio" hidden="hidden" placeholder="0">
                    <span class="CheckupDrinkSmokeSleep--unit-span">
                      {{ item.label }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--dink-group"
              :class="selectedValues.drinking.drink === 0 ? 'disabled' : ''">

              <div class="CheckupDrinkSmokeSleep--drink-fre">
                <p class="CheckupDrinkSmokeSleep--drink-fre--q">
                  음주 빈도는 어떻게 되시나요?
                </p>
                <div class="align--between CheckupDrinkSmokeSleep--drink-fre--con-wrap">
                  <div class="CheckupDrinkSmokeSleep--drink-fre--select-wrap" :class="isDrinkInput ? 'disabled' : ''">
                    <select v-model="selectedValues.drinking.drinkFreqType" name="cdss-s" id=""
                      class="CheckupDrinkSmokeSleep--drink-fre--select" :disabled="isDrinkInput">
                      <option value="1">주</option>
                      <option value="2">월</option>
                    </select>
                  </div>
                  <label for="cdss03" class="CheckupDrinkSmokeSleep--drink-fre--label inputBox"
                    :class="isDrinkInput ? 'disabled' : ''">
                    <input type="number" v-model="selectedValues.drinking.drinkFreq" name="" id="cdss03" min="0" step="1"
                      class="CheckupDrinkSmokeSleep--drink-fre--input" :disabled="isDrinkInput" placeholder="0">
                    <span class="CheckupDrinkSmokeSleep--drink-fre--span inputBox--txt">회</span>
                  </label>
                </div>
                <p class="CheckupDrinkSmokeSleep--drink-fre--desc txt--desc">월 1회 미만의 경우는 0회로 입력하세요</p>
              </div>

              <div class="CheckupDrinkSmokeSleep--drink-size--wrap">
                <p class="CheckupDrinkSmokeSleep--drink-size--q">한 번에 술은 얼마나 마시나요? </p>
                <div class="CheckupDrinkSmokeSleep--drink-size--con-wrap">
                  <label for="cdss04" class="CheckupDrinkSmokeSleep--drink-size--label inputBox"
                    :class="isDrinkInput ? 'disabled' : ''">
                    <input type="number" v-model="selectedValues.drinking.drinkVol" name="" min="0" step="1" id="cdss04"
                      class="CheckupDrinkSmokeSleep--drink-size--input" :disabled="isDrinkInput" placeholder="0">
                    <span class="CheckupDrinkSmokeSleep--drink-size--span inputBox--txt">잔</span>
                  </label>
                </div>
                <p class="CheckupDrinkSmokeSleep--drink-size--desc txt--desc">소주, 양주 구분없이 각각의 술잔으로 계산해주세요 소주 1병은 7잔과 같고
                  캔맥주 1개(355cc)는 맥주 1.6잔과 같습니다 </p>
              </div>

            </div>

          </div>

          <div class="CheckupDrinkSmokeSleep--smoke--wrap"> <!--흡연-->

            <div class="CheckupDrinkSmokeSleep--info-wrap">
              <p class="CheckupDrinkSmokeSleep--info">
                <strong>흡연</strong>에 관련된 정보를 알려주세요
              </p>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke--con-wrap">
              <p class="CheckupDrinkSmokeSleep--smoke--q">{{ userName }}님, 흡연 여부를 알려주세요!</p>
              <div class="CheckupDrinkSmokeSleep--smoke--input-wrap">
                <div v-for="(item, index) in smokeBtn" class="CheckupDrinkSmokeSleep--smoke--btn-wrap">
                  <label :for="'btn' + index" class="CheckupDrinkSmokeSleep--smoke--label"
                    :class="selectedValues.smoking.smok === (index + 1) ? 'active' : ''">
                    <input v-model="selectedValues.smoking.smok" :value="item.value" type="radio" name="btn"
                      :id="'btn' + index" hidden="hidden" class="CheckupDrinkSmokeSleep--smoke--input">
                    <span class="CheckupDrinkSmokeSleep--smoke--span">{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke-fre">
              <p class="CheckupDrinkSmokeSleep--smoke-fre--q">총 흡연 기간이 어떻게 되시나요?</p>
              <div class="CheckupDrinkSmokeSleep--smoke-fre--con-wrap">
                <label for="cdss05" class="CheckupDrinkSmokeSleep--smoke-fre--label inputBox"
                  :class="isSmokInput ? 'disabled' : ''">
                  <input type="number" v-model="selectedValues.smoking.smokDurYear" name="" min="0" step="1" id="cdss05"
                    class="CheckupDrinkSmokeSleep--smoke-fre--input" :disabled="isSmokInput" placeholder="0">
                  <span class="CheckupDrinkSmokeSleep--smoke-fre--span inputBox--txt">년</span>
                </label>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke-quan--wrap">
              <p class="CheckupDrinkSmokeSleep--smoke-quan--q">하루에 평균 몇 개비를 피우시나요?</p>
              <label for="cdss06" class="CheckupDrinkSmokeSleep--smoke-quan--label inputBox"
                :class="isSmokInput ? 'disabled' : ''">
                <input type="number" v-model="selectedValues.smoking.smokAmt" name="" min="0" step="1" id="cdss06"
                  class="CheckupDrinkSmokeSleep--smoke-quan--input" :disabled="isSmokInput" placeholder="0">
                <span class="CheckupDrinkSmokeSleep--smoke-quan--span inputBox--txt">개비</span>
              </label>
            </div>

          </div>

          <div class="CheckupDrinkSmokeSleep--sleep--wrap"> <!--수면-->
            <div class="CheckupDrinkSmokeSleep--info-wrap">
              <p class="CheckupDrinkSmokeSleep--info">
                <strong>수면</strong>에 관련된 정보를 알려주세요
              </p>
            </div>

            <p class="CheckupDrinkSmokeSleep--sleep--q">지난 한달 동안의 하루 평균 수면시간은 얼마나 되나요?</p>
            <BaseTimeMinute @inputTxtHour="setSleepHour" @inputTxtMinute="setSleepMinute" :id="'dss'"
              :hr="selectedValues.sleep.sleepHr" :mnt="selectedValues.sleep.sleepMin" :limitEight="false" />
            <!--밸리데이션 처리 후 입력이 안된 input을 focus하기 위해 값 전달-->
          </div>

          <div class="CheckupDrinkSmokeSleep--moi"> <!--수분-->

            <div class="CheckupDrinkSmokeSleep--info-wrap">
              <p class="CheckupDrinkSmokeSleep--info">
                <strong>물섭취</strong>에 관련된 정보를 알려주세요
              </p>
            </div>

            <p class="CheckupDrinkSmokeSleep--moi--q">하루에 물을 얼마나 섭취하세요?</p>
            <p class="CheckupDrinkSmokeSleep--moi--desc txt--desc2">(생수, 보리차, 결명자차, 옥수수차 등)</p>
            <div class="CheckupDrinkSmokeSleep--moi--con-wrap">
              <label for="cdss09" class="CheckupDrinkSmokeSleep--moi--label inputBox long-txt">
                <input type="number" name="" v-model="selectedValues.water.waterAmt" min="0" step="1" placeholder="20"
                  id="cdss09" class="CheckupDrinkSmokeSleep--moi--input">
                <span class="CheckupDrinkSmokeSleep--moi--span inputBox--txt">컵(200ml)</span>
              </label>
            </div>
          </div>

        </div>
      </div>
      <div class="btn--bottom CheckupDrinkSmokeSleep--btn-div">
        <button @click="tempSave" :disabled="nextDisabled" type="button" class="CheckupDrinkSmokeSleep--btn">입력 완료 <span
            class="answerNum">({{ checkedData.length }}<span>/</span>{{ questionCount }})</span></button>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
