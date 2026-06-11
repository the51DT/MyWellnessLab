<script setup>
import router from '@/router'
import { ref, inject, computed, onBeforeMount, toRaw } from 'vue'
import { useStore } from 'vuex'

// import {useStore} from 'vuex'; //TODO LYH
import CheckupBasicsBasic from '@/views/checkup/CheckupBasicsBasic.vue'
import BaseStep from '@/components/BaseStep.vue'
import CheckupBasicsBody from '@/views/checkup/CheckupBasicsBody.vue'
import CheckupBasicsBlood from '@/views/checkup/CheckupBasicsBlood.vue'
import BaseCheckupDate from '@/views/checkup/BaseCheckupDate.vue'
import BasePopup from '@/views/publishing/BasePopup.vue'

// Use
const store = useStore()
const axios = inject('$axios')
const token = store.getters.getToken
// TODO LYH Start 근시일 중 정리 예정
const header = {
  Authorization: token
}
// TODO END

const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/basics/temporary'
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'

const basicsId = ref(0)
const analysisType = ref(history.state.analysisType)
const healthDataType = ref(history.state.healthDataType)
const analysisData = history.state.analysisData

const checkUpBody = ref(null)
const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return !!((/* !basicData.value.name || */ !basicData.value.age || !basicData.value.sex || !basicData.value.ht || !basicData.value.wc || !basicData.value.wt || !basicData.value.sbp || !basicData.value.dbp))
})

const validMsg = ref('')

const commonInfo = ref({})
const commonInfoStep = ref(1)
const basicData = ref({})

const popup = ref(false)

// Validate variable
const validateData = {
  AGERange: {
    min: 0,
    max: 120
  },
  HTRange: {
    min: 125.3,
    max: 198
  },
  WTRange: {
    min: 30.6,
    max: 164.8
  },
  WCRange: {
    min: 50.5,
    max: 147.5
  },
  SBPRange: {
    min: 76,
    max: 243
  },
  DBPRange: {
    min: 10,
    max: 148
  },
  GLURange: {
    min: 40,
    max: 553
  },
  // Hb41cRange : {min:5, max:21.3},
  TCRange: {
    min: 68,
    max: 482
  },
  LDLRange: {
    min: 0,
    max: 382.6
  },
  HDLRange: {
    min: 5.918,
    max: 145.298
  },
  TGRange: {
    min: 19,
    max: 2455
  },
  GOTRange: {
    min: 1,
    max: 732
  },
  GPTRange: {
    min: 8,
    max: 927
  },
  CREARange: {
    min: 0.2,
    max: 14.38
  },
  HBRange: {
    min: 5,
    max: 21.3
  }
}

const ignoreValidate = ref({
  ht: false,
  wt: false,
  wc: false,
  sbp: false,
  dbp: false
})
const validateErrKey = ref('')
const validRange = ref({
  min: 0,
  max: 999
})

const validateBirthdate = computed(() => {
  return !(((Number.isNaN(basicData.value.age) || (basicData.value.age < validateData.AGERange.min || basicData.value.age > validateData.AGERange.max) ||
      Number.isNaN(new Date(basicData.value.birthDate).getMonth()) || Number.isNaN(new Date(basicData.value.birthDate).getDate()))))
})

const validateHt = computed(() => {
  return !(((basicData.value.ht < validateData.HTRange.min || basicData.value.ht > validateData.HTRange.max)))
})

const validateWt = computed(() => {
  return !(((basicData.value.wt < validateData.WTRange.min || basicData.value.wt > validateData.WTRange.max)))
})

const validateWc = computed(() => {
  return !(((basicData.value.wc < validateData.WCRange.min || basicData.value.wc > validateData.WCRange.max)))
})

const validateSbp = computed(() => {
  return !(((basicData.value.sbp < validateData.SBPRange.min || basicData.value.sbp > validateData.SBPRange.max)))
})

const validateDbp = computed(() => {
  return !(((basicData.value.dbp < validateData.DBPRange.min || basicData.value.dbp > validateData.DBPRange.max)))
})

// Func
function setInputValue (val) { // 하위 컴퍼넌트에서 값을 받아 반영
  Object.assign(basicData.value, basicData.value, val)
};

function basicInfoValidate () {
  // 검강검진데이터 정식(formal), 검강검진데이터 임시(temporary), 직접입력(direct)
  if (analysisType.value == 'onetime' && !validateBirthdate.value) {
    alert('생년월일 6자리 항목을 정확히 입력해 주십시오.')
    return false
  }
  let validFlag = true
  let failedValue
  let failedFieldName
  const failedMsgPrefix = '입력하신 '
  const failedMsgSuffix = '은(는) 일상범위가 아닙니다.'

  for (const key in ignoreValidate.value) {
    if (!ignoreValidate.value[key]) {
      validateErrKey.value = key

      switch (key) {
        case 'ht':
          if (!validateHt.value) {
            failedFieldName = '신장 항목에 '
            validFlag = validateHt.value
            failedValue = basicData.value.ht
            validRange.value.min = validateData.HTRange.min
            validRange.value.max = validateData.HTRange.max
          }
          break
        case 'wt':
          if (!validateWt.value) {
            failedFieldName = '체중 항목에 '
            validFlag = validateWt.value
            failedValue = basicData.value.wt
            validRange.value.min = validateData.WTRange.min
            validRange.value.max = validateData.WTRange.max
          }
          break
        case 'wc':
          if (!validateWc.value) {
            failedFieldName = '허리둘레 항목에 '
            validFlag = validateWc.value
            failedValue = basicData.value.wc
            validRange.value.min = validateData.WCRange.min
            validRange.value.max = validateData.WCRange.max
          }
          break
        case 'sbp':
          if (!validateSbp.value) {
            failedFieldName = '수축기 혈압 항목에 '
            validFlag = validateSbp.value
            failedValue = basicData.value.sbp
            validRange.value.min = validateData.SBPRange.min
            validRange.value.max = validateData.SBPRange.max
          }
          break
        case 'dbp':
          if (!validateDbp.value) {
            failedFieldName = '이완기 항목에 '
            validFlag = validateDbp.value
            failedValue = basicData.value.dbp
            validRange.value.min = validateData.DBPRange.min
            validRange.value.max = validateData.DBPRange.max
          }
          break
      }
      if (failedFieldName !== undefined) {
        validMsg.value = failedFieldName + failedMsgPrefix + failedValue + failedMsgSuffix
        validFlag = false
        popup.value = true
        break
      }
    } else {
      validFlag = true
      continue
    }
  }
  if (validFlag) tempSave()
};

function validContinue () {
  ignoreValidate.value[validateErrKey.value] = true
  popup.value = false
  basicInfoValidate()
}

function tempSave () {
  if (basicsId.value === 0) {
    axios.post(api.concat('/' + analysisType.value), { basics: basicData.value }, { headers: header })
      .then(res => {
        Object.assign(basicData.value, basicData.value, res.data.data.basics)
        basicData.value.basicsId = basicData.value.id
        nextStep()
      })
      .catch(error => {
        alert(error.response.data.message)
      })
  } else {
    axios.put(api, { basics: basicData.value }, { headers: header })
      .then(res => {
        Object.assign(basicData.value, basicData.value, res.data.data.basics)
        nextStep()
      })
      .catch(error => {
        alert(error.response.data.message)
      })
  }
}

function tempSaveCall () {
  if (basicsId.value === 0) {
    axios.post(api.concat('/' + analysisType.value), { basics: basicData.value }, { headers: header })
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.response.data.message)
      })
  } else {
    axios.put(api, { basics: basicData.value }, { headers: header })
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error.response.data.message)
      })
  }
}

function getCommonInfo () {
  const url = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/proceeding/' + analysisType.value

  axios.get(url, { headers: header })
    .then(res => {
      if (res.data.data.commonInfo) {
        commonInfo.value = res.data.data.commonInfo
      }
      if (res.data.data.basics) {
        basicData.value = res.data.data.basics
        basicData.value.analysisType = commonInfo.value.analysisType
        basicsId.value = basicData.value.id
        basicData.value.gender = basicData.value.sex == 1 ? '남성' : '여성'

        delete basicData.value.healthDataName
        delete basicData.value.commonId
        delete basicData.value.createdDate
        delete basicData.value.modifiedDate
      }
    })
    .catch(error => {
      console.log(error)
    })
}

function nextStep () {
  // console.log(toRaw(Object.assign({}, basicData.value)))
  router.push({
    name: 'CheckupBlood',
    state: {
      analysisType: analysisType.value,
      basicData: Object.assign({}, basicData.value),
      validateData
    }
  })
};

function dataCheck () { // TODO LYH TMP
  console.log('########### dataCheck start ', basicsId.value)
  console.log(toRaw(commonInfo.value))
  console.log(commonInfo.value.id)
  console.log(analysisType.value)
  console.log(toRaw(basicData.value))
  console.log('########### dataCheck end')
};

function popupClose () {
  popup.value = false
}

onBeforeMount(() => {
  // getCommonInfo();

  switch (analysisType.value) {
    case 'normal':
      getCommonInfo()
      Object.assign(basicData.value, basicData.value, analysisData)
      basicData.value.gender = basicData.value.sex == '1' ? '남성' : '여성'
      break
    case 'onetime':
      Object.assign(basicData.value, basicData.value, analysisData)
      break
  }
  basicData.value.analysisType = analysisType.value
  basicData.value.healthDataType = healthDataType.value
})

defineExpose({
  tempSaveCall
})

</script>

<template>
  <section class="CheckupBasics">
    <BaseStep class="CheckupBasics--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <BaseCheckupDate class="CheckupBasics--date" :checkDate="basicData.checkDate" />
        <!-- 기본 정보 -->
        <CheckupBasicsBasic class="CheckupBasics--basic" :basicData="basicData" v-on:update="setInputValue" />
        <!-- 신체 정보 -->
        <CheckupBasicsBody
          ref="checkUpBody"
          class="CheckupBasics--body"
          :basicData="basicData"
          v-on:update="setInputValue" />
        <!-- 혈압 정보 -->
        <CheckupBasicsBlood class="CheckupBasics--blood" :basicData="basicData" v-on:update="setInputValue" />

      </div>

      <div class="btn--bottom">
        <!-- <button @click="basicInfoValidate" :disabled="nextDisabled" type="button" class="">다음</button> -->
        <button
          @click="basicInfoValidate"
          :disabled="nextDisabled"
          type="button"
          class="">다음</button>
      </div>
    </div>

    <base-popup v-if="popup" class="CheckupBlood--popup">
      <template v-slot:contents class="CheckupBlood--popup-wrap">
        <div class="CheckupBlood--pop-con">

          <!--        입력값 오류 시-->
          <p class="CheckupBlood--p">
            {{ validMsg }}
          </p>
          <p class="CheckupBlood--p2">
            {{ validRange.min }} ~ {{ validRange.max }} 내에서 다시 입력해주세요.
          </p>

        </div>
        <div class="CheckupBlood--pop-btn-wrap">

          <!--    if    입력값 오류 시-->
          <button @click="popupClose" type="button" class="CheckupBlood--pop-btn--cancel">다시입력</button>
          <button @click="validContinue" type="button" class="CheckupBlood--pop-btn">계속</button>

        </div>
      </template>
    </base-popup>

  </section>
</template>

<style lang="scss"></style>
