<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { calcAge, dateConvert } from '@/assets/js/common'
import { useMoveStep } from '@/composables/checkup'
import BaseInput from '@/components/BaseInput.vue'
import BasePopup from '@/components/BasePopup.vue'
import * as couponApi from '@/apis/coupon'
import * as checkupApi from '@/apis/checkup'
import * as mypageApi from '@/apis/mypage'

const store = useStore()
const route = useRoute()
const router = useRouter()
const moveStep = useMoveStep()

const user = store.getters.getUser
const prefix = 'MyPageCheckupDataRecordDetail'

const detailData = ref({})
const openPopNoCoupon = ref(false) /* 240118 쿠폰을 사야한다는 팝업 오프너 */
const openPopContinue = ref(false) /* 240119 기존에 하다 말았던 설문을 이어받아서 하겠냐는 팝업 오프너 */
const isContinue = ref(null) /* 240118 하다 말았던 설문을 이어하려면 true, 새로 하려면 false */

/**
 * 이 함수는 mypageApi의 getExaminationDataDetail 메소드를 호출하여 데이터를 가져옵니다.
 * route.params.id와 route.params.completeType를 매개변수로 사용합니다.
 */
const getData = async () => {
  try {
    const response = await mypageApi.getExaminationDataDetail(route.params.id, route.params.completeType)
    detailData.value = response.data
  } catch (e) {
    console.error(e)
  }
}

// 보유 쿠폰 조회
// 쿠폰 리스트를 받아옵니다. 페이지 번호를 0, 페이지 당 항목 수를 500으로 설정해 요청을 합니다.
// 만약 쿠폰 항목 리스트의 길이가 0 이상이라면 true를, 그렇지 않다면 false를 반환하게 합니다.
const hasCoupon = async () => {
  const params = {
    pageNo: 0,
    perPageNum: 500
  }

  const response = await couponApi.getCouponList(params)

  return response.data.coupons && response.data.coupons.length > 0
}

// 진행중인 설문 조회
// 분석 유형을 인자로 받아 공통 정보를 조회하는 함수입니다.
const getCommonInfo = async (analysisType) => {
  try {
    const response = await checkupApi.getCommonInfo(analysisType)

    return response.data?.commonInfo
  } catch (e) {
    console.error(e)
  }
}

/**
 * 일시적인 기본 정보를 가져오는 함수입니다.
 * @param {string} id - 기준이 될 유니크 아이디입니다.
 * @returns {Object} 기본 정보를 담은 객체를 반환합니다.
 */
const getBasicsTemporary = async (id) => {
  try {
    const response = await checkupApi.getBasicsTemporary(id)

    return response.data?.basics
  } catch (e) {
    console.error(e)
  }
}

/**
 * 설문 조사를 계속할 것인지 판단하는 함수입니다.
 *        'isContinue'가 참이면 Promise는 'true'를 반환하고, 거짓이면 'false'를 반환합니다.
 */
const confirmContinue = () => { /* 240119 설문을 이어갈지 말지 판단하는 함수 */
  openPopContinue.value = true

  return new Promise((resolve) => {
    watch(isContinue, (newVal) => {
      newVal ? resolve(true) : resolve(false)
    })
  })
}

// 진행중인 설문 삭제
const deleteCheckup = async (id) => {
  await checkupApi.deleteCheckup(id)
}

// 기본검사 데이터 셋팅
const setCheckupData = () => {
  const birthDate = user.dateOfBirth.substring(0, 10)

  const nhisData = {
    ...detailData.value,
    name: user.name,
    birthDate,
    age: calcAge(birthDate),
    sex: (user.gender === 'MALE' ? 1 : 2)
  }
  nhisData.checkDate = nhisData.checkDate.substring(0, 10)

  delete nhisData.id
  // delete nhisData.birthDate

  store.dispatch('checkup/setAnalysisType', 'normal')
  store.dispatch('checkup/setNhisData', nhisData)
  store.dispatch('checkup/setHealthDataType', detailData.value.healthDataType)
}

/**
 * 한국의 국민건강보험공단(NHIS)에서 제공하는 정보를 가져오는 함수입니다.
 *
 * @param {string} id - 정보를 가져오려는 개인의 고유 ID.
 *
 * @return 서버로부터의 응답 데이터 중 'value' 속성을 반환합니다.
 */
const getNhisInfo = async (id) => {
  try {
    const response = await checkupApi.getNhisInfo(id)

    return response.data?.value
  } catch (e) {
    console.error(e)
  }
}

// 설문으로 이동
const movePage = async () => {
  try {
    if (!await hasCoupon()) {
      openPopNoCoupon.value = true
      return
    }

    const checkupCommonInfo = await getCommonInfo('normal')
    setCheckupData()

    if (checkupCommonInfo) {
      if (await confirmContinue()) {
        store.dispatch('checkup/setBasicsId', checkupCommonInfo.basicsId)

        // 임시저장된 데이터타입을 조회 후 healthDataType 셋팅
        const basicsData = await getBasicsTemporary(checkupCommonInfo.basicsId)

        if (basicsData) {
          store.dispatch('checkup/setHealthDataType', basicsData.healthDataType)

          // 건강보험공단일 경우, 공단데이터 조회
          if (basicsData.healthDataType === 'formal') {
            const nhisInfo = await getNhisInfo(checkupCommonInfo.id)

            if (nhisInfo) {
              const data = {
                checkDate: dateConvert(nhisInfo.resCheckupYear.concat(nhisInfo.resCheckupDate), '.'),
                ht: nhisInfo.resHeight,
                wt: nhisInfo.resWeight,
                wc: nhisInfo.resWaist,
                bmi: nhisInfo.resBMI,
                sbp: nhisInfo.resBloodPressure.split('/')[0],
                dbp: nhisInfo.resBloodPressure.split('/')[1],
                glu: nhisInfo.resFastingBloodSuger,
                tc: nhisInfo.resTotalCholesterol,
                ldl: nhisInfo.resLDLCholesterol,
                hdl: nhisInfo.resHDLCholesterol,
                tg: nhisInfo.resTriglyceride,
                got: nhisInfo.resAST,
                gpt: nhisInfo.resALT,
                crea: nhisInfo.resSerumCreatinine,
                hb: nhisInfo.resHemoglobin
              }

              store.dispatch('checkup/setNhisData', data)
            }
          }
        }

        moveStep(checkupCommonInfo)
      } else {
        await deleteCheckup(checkupCommonInfo.id)
        router.push({ name: 'CheckupBasics' })
      }
    } else {
      router.push({ name: 'CheckupBasics' })
    }
  } catch (e) {
    console.error(e)
  }
}

const handleNewCheckup = () => {
  isContinue.value = false
  openPopContinue.value = false
}

const handleContinuCheckup = () => {
  isContinue.value = true
  openPopContinue.value = false
}

onBeforeMount(() => {
  getData()
})
</script>

<template>
  <div :class="prefix">
    <div :class="prefix + '--top'">
      <div class="tag-wrap">
        <span
          class="tag"
          :class="detailData.healthDataType === 'formal' ? 'red' : 'direct' ? 'biolet' : ''">
            {{ detailData.healthDataName }}
        </span>
      </div>
      <dl :class="prefix + '--dl'">
        <dt>{{ $t('MyPageCheckupDataRecordDetail.text1') }} :</dt>
        <dd>{{ detailData.checkDate }}</dd>
      </dl>
      <div :class="prefix + '--btn-wrap'">
        <button
          v-if="detailData.completeType === 'completeBefore'"
          type="button"
          :class="prefix + '--btn btn--big3 green-wide'"
          @click="movePage">
          {{ $t('MyPageCheckupDataRecordDetail.text3') }}
        </button>
      </div>
      <div class="MyPageBodyCompositionDataRecordDetail--date-line"></div>
    </div>
    <div :class="prefix + '--data'">
      <BaseInput
        :itemName="$t('MyPageCheckupDataRecordDetail.text4')"
        :value="detailData.sbp"
        :disabled="false"
        :suf="`mmHg`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name" />
      <BaseInput
        :itemName="$t('MyPageCheckupDataRecordDetail.text5')"
        :value="detailData.dbp"
        :disabled="false"
        :suf="`mmHg`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name" />
      <BaseInput
        :value="detailData.glu"
        :disabled="false"
        :suf="`mg/dl`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text6') }}<br />(Glucose)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.tg"
        :disabled="false"
        :suf="`mg/dl`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text8') }}<br />(Triglyceride)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.tc"
        :disabled="false"
        :suf="`mg/dl`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text10') }}<br />(T-Cholesterol)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.hdl"
        :disabled="false"
        :suf="`mg/dl`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text12') }}<br />(HDL-C)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.ldl"
        :disabled="false"
        :suf="`mg/dl`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text14') }}<br />(LDL-C)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.bmi"
        :disabled="false"
        :suf="`kg/m2`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text16') }}
        </template>
      </BaseInput>
      <BaseInput
        :itemName="$t('MyPageCheckupDataRecordDetail.text17')"
        :value="detailData.wc"
        :disabled="false"
        :suf="`cm`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name" />
      <BaseInput
        :value="detailData.got"
        :disabled="false"
        :suf="`IU/ℓ`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text18') }}<br />(AST/SGOT)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.gpt"
        :disabled="false"
        :suf="`IU/ℓ`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text20') }}<br />(ALT/SGPT)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.crea"
        :disabled="false"
        :suf="`mg/dL`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text22') }}<br />(Cr/Creatinine)
        </template>
      </BaseInput>
      <BaseInput
        :value="detailData.hb"
        :disabled="false"
        :suf="`g/dl`"
        :placeholder="`-`"
        class="CheckupBasicsBasic--name">
        <template v-slot:itemName>
          {{ $t('MyPageCheckupDataRecordDetail.text24') }}<br />(Hb/Hemoglobin)
        </template>
      </BaseInput>
    </div>
  </div>

  <base-popup v-if="openPopContinue" class="openPopContinue">
    <template v-slot:contents>
      <p>{{ $t('MyPageCheckupDataRecordDetail.text26') }}</p>
      <p>{{ $t('MyPageCheckupDataRecordDetail.text27') }}</p>
      <div class="pop-btn-wrap">
        <button @click="handleNewCheckup" class="pop-btn pop-btn--gray" type="button">{{ $t('MyPageCheckupDataRecordDetail.text28') }}</button>
        <button @click="handleContinuCheckup" class="pop-btn pop-btn--green" type="button">{{ $t('MyPageCheckupDataRecordDetail.text29') }}</button>
      </div>
      <div class="openPopContinue--close">
        <button
          @click="openPopContinue = false"
          type="button"
          :aria-label="$t('Common.close')"
          class="popup--close" />
      </div>
    </template>
  </base-popup>

  <base-popup v-if="openPopNoCoupon" class="openPopContinue">
    <template v-slot:contents>
      <p>{{ $t('MyPageCheckupDataRecordDetail.text31') }}</p>
      <p class="color--gray space--top-small">{{ $t('MyPageCheckupDataRecordDetail.text32') }}</p>
      <div class="pop-btn-wrap">
        <button @click="openPopNoCoupon = false" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }}</button>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped>.MyPageCheckupDataRecordDetail--mt {
  margin-bottom: 1rem;
}</style>
