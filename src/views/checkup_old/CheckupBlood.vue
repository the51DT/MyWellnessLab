<script setup>
import BaseStep from '@/components/BaseStep.vue'
import BaseCheckupDate from '@/views/checkup/BaseCheckupDate.vue'
import CheckupBloodRequire from '@/views/checkup/CheckupBloodRequire.vue'
import CheckupBloodNonRequire from '@/views/checkup/CheckupBloodNonRequire.vue'
import { ref, inject, computed, onBeforeMount, toRaw } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import BasePopup from '@/views/publishing/BasePopup.vue'

const store = useStore()
const axios = inject('$axios')

// TODO LYH
const token = store.getters.getToken
const header = {
  Authorization: token
}

const healthDataType = store.getters['checkup/getHealthDataType']
const analysisType = store.getters['checkup/getAnalysisType']
const basicData = store.getters['checkup/getBasicsData']

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

const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/blood/temporary'
const commonInfoApi = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/common-info/temporary'

const commonInfo = ref({}) // 공통정보
const commonInfoStep = ref(2) // 공통정보 / 진행단계
const dispData = ref({
  blood: {
    basicsId: Number(basicData.id), // 기본검사 seq
    crea: (basicData.crea),
    glu: (basicData.glu),
    got: (basicData.got),
    gpt: (basicData.gpt),
    hb: (basicData.hb),
    id: 0 // 혈액검사 ID
  },
  bloodOptional: {
    bloodId: 0, // 기본검사 Seq
    hdl: (basicData.hdl),
    ldl: (basicData.ldl),
    tc: (basicData.tc),
    tg: (basicData.tg),
    id: 0 // 혈액검사 선택입력 Seq
  }
})

const isDisabled = basicData.analysisType == '1'

const nextDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  return !!((
    !dispData.value.blood.basicsId || !dispData.value.blood.crea || !dispData.value.blood.glu || !dispData.value.blood.got || !dispData.value.blood.gpt || !dispData.value.blood.hb/*  ||
    !dispData.value.bloodOptional.hdl || !dispData.value.bloodOptional.ldl || !dispData.value.bloodOptional.tc || !dispData.value.bloodOptional.tg */
  ))
})
const popup = ref(false) /* 팝업 보이고 안보이고 */

const basicsId = ref(basicData.basicsId)

const bloodId = ref(0)
const bloodOptionalId = ref(0)

const validMsg = ref('')// 입력하신 ~~~는 일상범위가 아닙니다 / 지질대사 저밀도 콜레스테롤이 입력되지 않았습니다.
const validMsg2 = ref('') // 그래도 계속 하시겠습니까? / 자동계산 하시겠습니까?

// Validate variable
const ignoreValidate = ref({
  hb: false,
  glu: false,
  crea: false,
  got: false,
  gpt: false,
  tc: false,
  hdl: false,
  tg: false,
  ldl: false
})

const validateErrKey = ref('')
const validRange = ref({
  min: 0,
  max: 999
})

const validateHb = computed(() => {
  return !(((dispData.value.blood.hb < validateData.HBRange.min || dispData.value.blood.hb > validateData.HBRange.max)))
})

const validateGlu = computed(() => {
  return !(((dispData.value.blood.glu < validateData.GLURange.min || dispData.value.blood.glu > validateData.GLURange.max)))
})

const validateCrea = computed(() => {
  return !(((dispData.value.blood.crea < validateData.CREARange.min || dispData.value.blood.crea > validateData.CREARange.max)))
})

const validateGot = computed(() => {
  return !(((dispData.value.blood.got < validateData.GOTRange.min || dispData.value.blood.got > validateData.GOTRange.max)))
})

const validateGpt = computed(() => {
  return !(((dispData.value.blood.gpt < validateData.GPTRange.min || dispData.value.blood.gpt > validateData.GPTRange.max)))
})

const validateTc = computed(() => {
  return !(((dispData.value.bloodOptional.tc < validateData.TCRange.min || dispData.value.bloodOptional.tc > validateData.TCRange.max)))
})

const validateHdl = computed(() => {
  return !(((dispData.value.bloodOptional.hdl < validateData.HDLRange.min || dispData.value.bloodOptional.hdl > validateData.HDLRange.max)))
})

const validateTg = computed(() => {
  return !(((dispData.value.bloodOptional.tg < validateData.TGRange.min || dispData.value.bloodOptional.tg > validateData.TGRange.max)))
})

const validateLdl = computed(() => {
  return !(((dispData.value.bloodOptional.ldl < validateData.LDLRange.min || dispData.value.bloodOptional.ldl > validateData.LDLRange.max)))
})

// Func
function bloodInfoValidate () {
  let validFlag = true// hb glu crea got gpt
  let failedValue
  let failedFieldName
  const failedMsgPrefix = '입력하신 '
  const failedMsgSuffix = '은(는) 일상범위가 아닙니다.'

  for (const key in ignoreValidate.value) {
    console.log(key)
    if (!ignoreValidate.value[key]) {
      validateErrKey.value = key
      // hb glu crea got gpt  공복혈당 크레아티닌 아스파테이크 전이효소 알라닌 전이효소
      switch (key) {
        case 'hb':
          if (!validateHb.value) {
            failedFieldName = '혈액검사소 항목에 '
            validFlag = validateHb.value
            failedValue = dispData.value.blood.hb
            validRange.value.min = validateData.HBRange.min
            validRange.value.max = validateData.HBRange.max
          }
          break
        case 'glu':
          if (!validateGlu.value) {
            failedFieldName = '공복혈당 항목에 '
            validFlag = validateGlu.value
            failedValue = dispData.value.blood.glu
            validRange.value.min = validateData.GLURange.min
            validRange.value.max = validateData.GLURange.max
          }
          break
        case 'crea':
          if (!validateCrea.value) {
            failedFieldName = '크레아티닌 항목에 '
            validFlag = validateCrea.value
            failedValue = dispData.value.blood.crea
            validRange.value.min = validateData.CREARange.min
            validRange.value.max = validateData.CREARange.max
          }
          break
        case 'got':
          if (!validateGot.value) {
            failedFieldName = '아스파테이크 전이효소 항목에 '
            validFlag = validateGot.value
            failedValue = dispData.value.blood.got
            validRange.value.min = validateData.GOTRange.min
            validRange.value.max = validateData.GOTRange.max
          }
          break
        case 'gpt':
          if (!validateGpt.value) {
            failedFieldName = '알라닌 전이효소 항목에 '
            validFlag = validateGpt.value
            failedValue = dispData.value.blood.gpt
            validRange.value.min = validateData.GPTRange.min
            validRange.value.max = validateData.GPTRange.max
          }
          break
        case 'tc':
          if (!validateTc.value && dispData.value.bloodOptional.tc > 0) {
            failedFieldName = '총 콜레스테롤 항목에 '
            validFlag = validateTc.value
            failedValue = dispData.value.bloodOptional.tc
            validRange.value.min = validateData.TCRange.min
            validRange.value.max = validateData.TCRange.max
          }
        case '':
          if (!validateHdl.value && dispData.value.bloodOptional.hdl > 0) {
            failedFieldName = '고밀도 콜레스테롤 항목에 '
            validFlag = validateHdl.value
            failedValue = dispData.value.bloodOptional.hdl
            validRange.value.min = validateData.HDLRange.min
            validRange.value.max = validateData.HDLRange.max
          }
        case '':
          if (!validateTg.value && dispData.value.bloodOptional.tg > 0) {
            failedFieldName = '중성지방 항목에 '
            validFlag = validateTg.value
            failedValue = dispData.value.bloodOptional.tg
            validRange.value.min = validateData.TGRange.min
            validRange.value.max = validateData.TGRange.max
          }
        case '':
          if (!validateLdl.value && dispData.value.bloodOptional.ldl > 0) {
            failedFieldName = '저밀도 콜레스테롤 항목에 '
            validFlag = validateLdl.value
            failedValue = dispData.value.bloodOptional.ldl
            validRange.value.min = validateData.LDLRange.min
            validRange.value.max = validateData.LDLRange.max
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
      console.log('continue')
      validFlag = true
      continue
    }
  }
  console.log(validFlag)
  if (validFlag) tempSave()
};

function validContinue () {
  ignoreValidate.value[validateErrKey.value] = true
  popup.value = false
  bloodInfoValidate()
}

function setInputValue (mapName, val) {
  Object.assign(dispData.value, dispData.value, val)
}

function getTemporaryData () {
  const url = api + '/' + basicsId.value
  axios.get(url, {
    headers: header
  })
    .then(res => {
      switch (res.status) {
        case 204:
          alert('임시저장된 기본검사 정보가 없습니다.')
          break
      }

      if (res.data.data.blood) {
        basicsId.value = dispData.value.blood.basicsId
        bloodId.value = dispData.value.blood.id
        bloodOptionalId.value = dispData.value.bloodOptional.id
        // if(analysisType.value == 'temporary'){//TODO LYH
        Object.assign(dispData.value, res.data.data)
        dataCleaning()
        // }
      }
    })
    .catch(error => {
      console.log(error)
      alert(error.response.data.message)
    })
}

const getCommonInfo = () => {
  console.log('### getComm')
  const url = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/proceeding/' + analysisType
  /* if(analysisType.value == 'onetime') {
    url = commonInfoApi;
  } */

  axios.get(url, { headers: header })
    .then(res => {
      if (res.data != null && typeof res.data === 'object') {
        commonInfo.value = res.data.data.commonInfo
        // analysisType.value = commonInfo.value.analysisType;
        basicsId.value = res.data.data.basics.id

        getTemporaryData()
      } else {
        console.log('임시저장 정보 없음') // TODO soon delete
      }
    })
    .catch(error => {
      console.log(error)
    })
}

function tempSave () {
  const param = {
    blood: dispData.value.blood,
    bloodOptional: dispData.value.bloodOptional
  }

  // nextDisabled.value = true;

  // save
  if (dispData.value.blood.id === 0) {
    axios.post(api, param, { headers: header })
      .then(res => {
        // Object.assign(dispData.value, dispData.value, res.data.data)
        nextStep()
      })
      .catch(error => {
        console.log(error)
        alert(error.response.data.message)
      })
  } else {
    axios.put(api, param, { headers: header })
      .then(res => {
        // Object.assign(dispData.value, dispData.value, res.data.data)
        nextStep()
      })
      .catch(error => {
        console.log(error)
        // alert(error.response.data.message);
      })
  }
}

const nextStep = () => {
  router.push({ name: 'CheckupInterestHealth' })
}

function dataCleaning () {
  delete dispData.value.blood.createdDate
  delete dispData.value.blood.modifiedDate
  delete dispData.value.bloodOptional.createdDate
  delete dispData.value.bloodOptional.modifiedDate
}

function popupClose () {
  popup.value = false
}

onBeforeMount(() => {
  // basicData.value.analysisType = analysisType.value
  getCommonInfo()
})
</script>

<template>
  <section class="container CheckupBlood">
    <BaseStep :step="`step2`" class="CheckupBlood--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">

        <!-- <div style="margin : 0px 0px 0px 20px; border-bottom : 0px 1px 0px 1px solid black;">
          <button @click="setTemporaryData">임시저장 불러오기</button>
          <button @click="dataCheck">데이터체크</button>
          </div> -->

        <BaseCheckupDate class="CheckupBlood--date" :checkDate="basicData.checkDate" />
        <CheckupBloodRequire
          class="CheckupBlood--require"
          :basicData="dispData"
          :analysisType="analysisType"
          :healthDataType="healthDataType"
          :mapName="`blood`"
          v-on:update="setInputValue" />
        <CheckupBloodNonRequire
          class="CheckupBlood--non-require"
          :basicData="dispData"
          :analysisType="analysisType"
          :healthDataType="healthDataType"
          :mapName="`bloodOptional`"
          v-on:update="setInputValue" />
      </div>
      <div class="btn--bottom CheckupBlood--btn-div">
        <button
          @click="bloodInfoValidate"
          :disabled="nextDisabled"
          type="button"
          class="CheckupBlood--btn">다음</button>
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
