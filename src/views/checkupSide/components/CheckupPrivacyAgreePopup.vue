<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import BaseInputOnlyNumber from '@/components/BaseInputOnlyNumber.vue'
import BasePersonal3 from '@/components/BasePersonal3.vue'
import BasePersonalInfo from '@/components/BasePersonalInfo.vue'
import BasePopup from '@/views/publishing/BasePopup.vue'

import { getCurDate, dateConvert, formatDateToYyyyMMdd, calcAge, bodyScroll } from '@/assets/js/common'

import * as codefApi from '@/apis/codef'
import * as checkupApi from '@/apis/checkup'
import message from '@/components/message'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()

const user = store.getters.getUser

const channel = [
  {
    label: t('CheckupPrivacyAgreePopup.text1'),
    value: 1,
    class: 'kakao'
  },
  {
    label: t('CheckupPrivacyAgreePopup.text2'),
    value: 6,
    class: 'naver'
  },
  {
    label: t('CheckupPrivacyAgreePopup.text3'),
    value: 5,
    class: 'pass'
  },
  {
    label: t('CheckupPrivacyAgreePopup.text4'),
    value: 8,
    class: 'toss'
  }
]

const emit = defineEmits(['success', 'close'])

const isReadonly = ref(true)
const baseInputOnlyNumber = ref(null)
const dispData = ref({
  selectChannel: '', /* 선택된 채널 */
  name: '',
  birth: '', /* 생년월일 */
  telecom: '', /* 통신사 */
  validationMsgTelecom: t('CheckupPrivacyAgreePopup.text9'), /* 통신사 */
  validationMsgBirth: t('CheckupPrivacyAgreePopup.text10'), //
  phoneNumber: '', /* 휴대폰번호 */
  validationMsgPhone: t('CheckupPrivacyAgreePopup.text11'), //
  agree1Title: t('CheckupPrivacyAgreePopup.text12'),
  agree2Title: t('CheckupPrivacyAgreePopup.text13'),
  agreeDefaultMsg: t('CheckupPrivacyAgreePopup.text14'),
  screen: false
})

const firstCertiData = ref(null)

// 서비스 이용에 대한 동의 관련
const checkboxAllEl = ref(false) /* 전체 동의 */
const checkboxTerms = ref(false) /* 이용약관 */
const checkboxPrivacy = ref(false) /* 개인정보 */
const openPopError = ref(false) // 에러시 팝업창
const errorMessage = ref('')
const isPopLoad = ref(false) // 2차 본인인증 로딩 팝업창

const dateRegex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/ // 생년월일 정규식
const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/ // 휴대폰 정규식

const isDisabled = computed(() => { /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
  let bool = true

  if (
    dispData.value.selectChannel !== '' && dispData.value.name !== '' && dateRegex.test(dispData.value.birth) &&
    phoneRegex.test(dispData.value.phoneNumber) && checkboxTerms.value && checkboxPrivacy.value
  ) {
    if (dispData.value.selectChannel === 5 && dispData.value.telecom === '') {
      return bool
    }
    bool = false
  }

  return bool
})

const secondCertiBtnDisabled = ref(false)

const validationTelecom = computed(() => {
  let bool = false
  if (dispData.value.selectChannel === 5 && dispData.value.telecom === '') {
    bool = true
  }
  return bool
})

const validationBirth = computed(() => {
  return !!((dispData.value.birth !== '' && !dateRegex.test(dispData.value.birth)))
})

const validationPhone = computed(() => {
  return !!((dispData.value.phoneNumber !== '' && !phoneRegex.test(dispData.value.phoneNumber)))
})

const unlockReadonly = () => {
  isReadonly.value = false
}

// 약관 전체 선택
function checkAll (event) {
  if (event.target.checked) {
    checkboxTerms.value = true
    checkboxPrivacy.value = true
  } else {
    checkboxTerms.value = false
    checkboxPrivacy.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const selectedIndex = computed(() => { /* 선택된 채널 active 클래스 추가위해 추가 */
  switch (dispData.value.selectChannel) {
    case 1:
      return 0
    case 6:
      return 1
    case 5:
      return 2
    case 8:
      return 3
  }
  return null
})

// 선택된 통신사 값
const getTelecom = () => {
  let result = ''

  // 알뜰폰일 경우 0, 1, 2로 변경(ex: KT, KT 알뜰폰 코드가 동일함)
  if (dispData.value.selectChannel === 5) {
    switch (dispData.value.telecom) {
      case '0': case '1': case '2':
        result = dispData.value.telecom
        break
      case '3':
        result = '0'
        break
      case '4':
        result = '1'
        break
      case '5':
        result = '2'
        break
      default:
        result = ''
        break
    }
  }

  return result
}

// 에러 메세지 팝업창
const setErrorMessage = (message) => {
  errorMessage.value = message
  openPopError.value = true
}

// 1차 인증
const handleFirstCertification = async () => {
  try {
    const params = {
      identity: dispData.value.birth,
      loginTypeLevel: dispData.value.selectChannel,
      telecom: getTelecom(),
      phoneNo: dispData.value.phoneNumber,
      userName: dispData.value.name
    }
    const response = await codefApi.getFirstCertification(params)

    firstCertiData.value = response.data
    dispData.value.screen = true
  } catch (e) {
    console.error(e)
  }
}

// 2차 인증
const handleSecondCertification = async () => {
  try {
    isPopLoad.value = true // 로딩 팝업 표시
    const params = firstCertiData.value

    const response = await codefApi.getSecondCertification(params, { noMessage: true })

    if (!response.data.result) {
      isPopLoad.value = false // 로딩 팝업 숨김
      setErrorMessage(t('CheckupPrivacyAgreePopup.text51'))
      return
    }

    if (!response.data.data.resHeight) {
      isPopLoad.value = false // 로딩 팝업 숨김
      const isConfirm = confirm(t('CheckupPrivacyAgreePopup.text52'))

      if (isConfirm) {
        store.dispatch('checkup/setAnalysisType', 'direct')
      } else {
        router.push({ name: 'CheckupDateSelect' })
      }

      return
    }

    const nhisData = convertAnalysisData(response.data.data)

    // 기존 설문 내용 초기화 - 진행중인 설문이 있으면 삭제
    try {
      const response = await checkupApi.getCommonInfo('normal')
      const commonInfo = response?.data?.commonInfo
      
      if (commonInfo?.id) {
        await checkupApi.deleteCheckup(commonInfo.id)
      }
    } catch (deleteError) {
      console.error('설문 삭제 실패:', deleteError)
    }

    store.dispatch('checkup/setNhisData', nhisData)
    store.dispatch('checkup/setHealthDataType', 'formal')

    isPopLoad.value = false // 로딩 팝업 숨김
    emit('success')
  } catch (e) {
    console.error(e)
    isPopLoad.value = false // 로딩 팝업 먼저 숨김
    
    let errorCode = ''
    let errorMessage = '일시적인 오류로 서버와 연결이 끊겼습니다.\n잠시 후 다시 시도해 주세요.'

    if (e.response?.data?.data?.result) {
      errorCode = e.response.data.data.result.code
    }
    
    if (e.response?.data?.message) {
      errorMessage = e.response.data.message
    }

    if (errorCode === 'CF-01004') {
      // TODO :: 이전 팝업으로 돌아가야하는 개선점이 나오면 주석 해제
      // dispData.value.screen = false;
    }
    
    // 로딩 팝업이 닫힌 후 에러 메시지 표시
    await message.alert(errorMessage)
  }
}

const convertAnalysisData = (value) => {
  let data = { ...value }

  if (!value) {
    data = {
      resCheckupYear: getCurDate().substring(0, 4),
      resCheckupDate: getCurDate().substring(4),
      resHeight: 0,
      resWeight: 0,
      resWaist: 0,
      resBMI: 0,
      resBloodPressure: '0/0',
      resFastingBloodSuger: 0,
      resTotalCholesterol: 0,
      resLDLCholesterol: 0,
      resHDLCholesterol: 0,
      resTriglyceride: 0,
      resAST: 0,
      resALT: 0,
      resSerumCreatinine: 0,
      resHemoglobin: 0
    }
  }

  return {
    name: dispData.value.name,
    birthDate: user.dateOfBirth,
    age: calcAge(user.dateOfBirth),
    checkDate: dateConvert(data.resCheckupYear.concat(data.resCheckupDate), '.'),
    ht: data.resHeight,
    wt: data.resWeight,
    wc: data.resWaist,
    bmi: data.resBMI,
    sbp: data.resBloodPressure.split('/')[0],
    dbp: data.resBloodPressure.split('/')[1],
    glu: data.resFastingBloodSuger,
    tc: data.resTotalCholesterol,
    ldl: data.resLDLCholesterol,
    hdl: data.resHDLCholesterol,
    tg: data.resTriglyceride,
    got: data.resAST,
    gpt: data.resALT,
    crea: data.resSerumCreatinine,
    hb: data.resHemoglobin
  }
}

watch(
  () => dispData.value.selectChannel,
  () => {
    if (dispData.value.selectChannel !== 5) {
      dispData.value.telecom = ''
    }
  },
  { deep: true }
)

watch(checkboxTerms, () => {
  if (checkboxTerms.value) {
    if (checkboxPrivacy.value) {
      checkboxAllEl.value = true
    }
  } else {
    checkboxAllEl.value = false
  }
})

watch(checkboxPrivacy, () => {
  if (checkboxPrivacy.value) {
    if (checkboxTerms.value) {
      checkboxAllEl.value = true
    }
  } else {
    checkboxAllEl.value = false
  }
})

onBeforeMount(() => {
  dispData.value.name = user.name
  
  // Safari 호환성을 위한 안전한 생년월일 처리
  console.log('user.dateOfBirth 원본:', user.dateOfBirth)
  
  if (user.dateOfBirth) {
    // formatDateToYyyyMMdd 함수 사용
    const formattedBirth = formatDateToYyyyMMdd(user.dateOfBirth)
    console.log('formatDateToYyyyMMdd 결과:', formattedBirth)
    
    if (formattedBirth) {
      dispData.value.birth = formattedBirth
    } else {
      // formatDateToYyyyMMdd가 실패한 경우 대체 방법 시도
      console.log('formatDateToYyyyMMdd 실패, 대체 방법 시도')
      
      // 점(.)으로 구분된 형식인지 확인
      if (user.dateOfBirth.includes('.')) {
        dispData.value.birth = user.dateOfBirth.split('.').join('')
        console.log('점 제거 결과:', dispData.value.birth)
      } else {
        // 기타 형식은 그대로 사용
        dispData.value.birth = user.dateOfBirth
        console.log('원본 그대로 사용:', dispData.value.birth)
      }
    }
  } else {
    console.warn('user.dateOfBirth가 없습니다:', user.dateOfBirth)
    dispData.value.birth = ''
  }
  
  dispData.value.phoneNumber = user.mobile.split('-').join('')
})

onMounted(() => {
  bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
})

onUnmounted(() => {
  bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
})
</script>

<template>
  <div>
    <BasePopupTit @popupClose="handleClose" class="CheckupPrivacyAgreePopup">

      <template v-slot:title>
        <span v-if="!dispData.screen" class="CheckupPrivacyAgreePopup--pop-tit">{{ $t('CheckupPrivacyAgreePopup.text15') }}</span>
        <span v-else class="CheckupPrivacyAgreePopup--pop-tit">{{ $t('CheckupPrivacyAgreePopup.text16') }}</span>
      </template>
      <template v-slot:contents>

        <div v-if="!dispData.screen" class="CheckupPrivacyAgreePopup--pop-wrap"> <!--간편인증-->
          <div class="CheckupPrivacyAgreePopup--pop-wrap-min"> <!--콘텐츠 wrap-->
            <div class="CheckupPrivacyAgreePopup--con">
              <div class="CheckupPrivacyAgreePopup--tit-wrap">
                <h2 class="tit--big">{{ $t('CheckupPrivacyAgreePopup.text17') }}</h2>
              </div>
              <div class="CheckupPrivacyAgreePopup--channel">
                <div v-for="(item, index) in channel" :key="index" class="CheckupPrivacyAgreePopup--ch-in-wrap">
                  <label
                    :for="item.class"
                    class="CheckupPrivacyAgreePopup--ch-label"
                    :class="{ [item.class]: true, 'active': selectedIndex === index }">
                    <input
                      v-model="dispData.selectChannel"
                      :value="item.value"
                      type="radio"
                      name="ch"
                      :id="item.class"
                      hidden="hidden"
                      ref="valiChannel"
                      class="CheckupPrivacyAgreePopup--ch-input" />
                    <span class="txt--desc3 c222">{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="CheckupPrivacyAgreePopup--input-wrap">
              <div class="CheckupPrivacyAgreePopup--input-tit-wrap">
                <h2 class="CheckupPrivacyAgreePopup--input-tit" @dblclick="unlockReadonly">
                  {{ $t('CheckupPrivacyAgreePopup.text18') }}
                </h2>
              </div>
              <div class="CheckupPrivacyAgreePopup--input-con-wrap">
                <div class="CheckupPrivacyAgreePopup--input-wrap">
                  <h3 class="CheckupPrivacyAgreePopup--input-tit">{{ $t('CheckupPrivacyAgreePopup.text19') }}</h3>
                  <input
                    v-model="dispData.name"
                    :disabled="isReadonly"
                    :placeholder="$t('CheckupPrivacyAgreePopup.text20')"
                    ref="valiName"
                    type="text"
                    name="cpap01"
                    id=""
                    class="CheckupPrivacyAgreePopup--input-input" />
                </div>
                <div class="CheckupPrivacyAgreePopup--input-wrap">
                  <h3 class="CheckupPrivacyAgreePopup--input-tit">{{ $t('CheckupPrivacyAgreePopup.text21') }}</h3>
                  <BaseInputOnlyNumber
                    v-model="dispData.birth"
                    :disabled="isReadonly"
                    :maxlength="8"
                    :placeholder="$t('CheckupPrivacyAgreePopup.text22')"
                    :id="`cpap02`"
                    class="CheckupPrivacyAgreePopup--input-input--com" />
                  <div v-if="validationBirth" class="CheckupPrivacyAgreePopup--vali">{{ dispData.validationMsgBirth }}
                  </div>
                  <!--개발 시 벨리데이션 처리 요망-->
                </div>
                <div class="CheckupPrivacyAgreePopup--input-wrap" ref="valiPhone">
                  <h3 class="CheckupPrivacyAgreePopup--input-tit">{{ $t('CheckupPrivacyAgreePopup.text23') }}</h3>
                  <div class="CheckupPrivacyAgreePopup--phone">
                    <div v-if="dispData.selectChannel === 5" class="CheckupPrivacyAgreePopup--company">
                      <select
                        name="telecom"
                        id="telecom"
                        class="select"
                        v-model="dispData.telecom">
                        <option value="" disabled selected>{{ $t('CheckupPrivacyAgreePopup.text24') }}</option>
                        <option value="0">{{ $t('CheckupPrivacyAgreePopup.text25') }}</option>
                        <option value="3">{{ $t('CheckupPrivacyAgreePopup.text26') }}</option>
                        <option value="1">{{ $t('CheckupPrivacyAgreePopup.text27') }}</option>
                        <option value="4">{{ $t('CheckupPrivacyAgreePopup.text28') }}</option>
                        <option value="2">{{ $t('CheckupPrivacyAgreePopup.text29') }}</option>
                        <option value="5">{{ $t('CheckupPrivacyAgreePopup.text30') }}</option>
                      </select>
                    </div>

                    <div class="CheckupPrivacyAgreePopup--p-num" :class="dispData.selectChannel !== 5 ? 'wide' : ''">
                      <baseInputOnlyNumber
                        v-model="dispData.phoneNumber"
                        :disabled="isReadonly"
                        :maxlength="11"
                        :placeholder="$t('CheckupPrivacyAgreePopup.text31')"
                        :id="`cpap03`" />
                    </div>
                  </div>
                  <div v-if="validationTelecom" class="CheckupPrivacyAgreePopup--vali">{{ dispData.validationMsgTelecom }}
                  </div>
                  <div v-if="validationPhone" class="CheckupPrivacyAgreePopup--vali">{{ dispData.validationMsgPhone }}
                  </div>
                  <!--개발 시 벨리데이션 처리 요망-->
                </div>
              </div>
            </div>

            <div class="CheckupPrivacyAgreePopup--terms">
              <div class="CheckupPrivacyAgreePopup--terms-tit">
                <h2 class="CheckupPrivacyAgreePopup--terms-h2">{{ $t('CheckupPrivacyAgreePopup.text32') }}</h2>
              </div>
              <div class="space--top-small">
                <div class="JoinTermsAgree--all-check-wrap">
                  <label for="jta01" class="JoinTermsAgree--all"> <!--임의의 for값이니 수정해도 무방, 단 고칠 대는 아래 input id도 함께 고쳐야 함-->
                    <span class="checkbox" :class="checkboxAllEl ? 'active' : ''">
                      <input
                        @change="checkAll"
                        v-model="checkboxAllEl"
                        type="checkbox"
                        name=""
                        id="jta01"
                        class="JoinTermsAgree--all-check"
                        hidden="hidden" />
                      <span />
                    </span>
                    <span class="JoinTermsAgree--all-txt">{{ $t('CheckupPrivacyAgreePopup.text33') }}</span>
                  </label>
                </div>
                <hr class="gray2 JoinTermsAgree--hr" />
                <div class="JoinTermsAgree--terms-wrap">
                  <div class="align--between JoinTermsAgree--terms-in-wrap" ref="valiTerms1">
                    <label for="jta02" class="JoinTermsAgree--terms">
                      <span class="checkbox" :class="checkboxTerms ? 'active' : ''">
                        <input
                          v-model="checkboxTerms"
                          type="checkbox"
                          name=""
                          id="jta02"
                          class="JoinTermsAgree--check"
                          hidden="hidden" />
                        <span />
                      </span>
                      <span class="JoinTermsAgree--tit">{{ $t('CheckupPrivacyAgreePopup.text34') }}</span>
                    </label>
                  </div>
                  <!-- <div v-html="serviceUseTerms" class="JoinTermsAgree--texts">

                    </div> -->
                  <div class="JoinTermsAgree--texts">
                    <BasePersonalInfo />
                  </div>
                </div>
                <div class="JoinTermsAgree--privacy-wrap">
                  <div class="align--between JoinTermsAgree--privacy-in-wrap" ref="valiTerms2">
                    <label for="jta04" class="JoinTermsAgree--privacy-check-wrap">
                      <span class="checkbox" :class="checkboxPrivacy ? 'active' : ''">
                        <input
                          v-model="checkboxPrivacy"
                          type="checkbox"
                          name=""
                          id="jta04"
                          class="JoinTermsAgree--privacy-check"
                          hidden="hidden" />
                        <span />
                      </span>
                      <span class="JoinTermsAgree--privacy-tit">{{ $t('CheckupPrivacyAgreePopup.text35') }}</span>
                    </label>
                  </div>
                  <!-- <div v-html="personalInfoRule" class="JoinTermsAgree--texts"></div> -->
                  <div class="JoinTermsAgree--texts">
                    <BasePersonal3 />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="CheckupPrivacyAgreePopup--finish">
            <button
              type="button"
              @click="handleFirstCertification"
              class="CheckupPrivacyAgreePopup--finish-btn btn--big3 green-wide"
              :disabled="isDisabled">{{ $t('Common.next') }}</button>
          </div>
        </div>

        <div v-else class="CheckupPrivacyAgreePopup--wait"> <!--간편인증 확인-->
          <div class="CheckupPrivacyAgreePopup--pop-wrap-min2"> <!--콘텐츠 wrap-->
            <div>
              <div class="CheckupPrivacyAgreePopup--wait-img">
                <img src="/img/ico_simple_certi.svg" alt="간편인증 완료" srcset="" />
              </div>
              <p class="CheckupPrivacyAgreePopup--wait-txt" v-html="$t('CheckupPrivacyAgreePopup.text37')"></p>
              <p class="CheckupPrivacyAgreePopup--wait-txt2" v-html="$t('CheckupPrivacyAgreePopup.text38')"></p>
            </div>
          </div>
          <div class="CheckupPrivacyAgreePopup--finish">
            <button
              @click="handleSecondCertification"
              :disabled="secondCertiBtnDisabled"
              type="button"
              class="CheckupPrivacyAgreePopup--finish-btn">{{ $t('Common.confirm') }}</button> <!--개발 시 링크 수정, disabled 콘트롤 요망-->
          </div>
        </div>

      </template>
    </BasePopupTit>

    <!--    240123 기획서 75페이지 개발 필요, v-if 값 수정바랍니다-->
    <base-popup v-if="isPopLoad" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('CheckupPrivacyAgreePopup.text53')}}</p>
        <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
        <div class="text-center">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </base-popup>

    <!--    240119 레이어팝업 추가 v-if 수정해야 함-->
    <base-popup v-if="false" class="base-pop">
      <template v-slot:contents>
        <p>{{ $t('CheckupPrivacyAgreePopup.text40') }}</p>
        <p>{{ $t('CheckupPrivacyAgreePopup.text41') }}</p>
        <div class="base-pop--footer">
          <button type="button" class="btn-pop--green">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="false" class="base-pop">
      <template v-slot:contents>
        <p>{{ $t('CheckupPrivacyAgreePopup.text42') }}</p>
        <ul class="bull--billiards analyze--ul txt--desc">
          <li>{{ $t('CheckupPrivacyAgreePopup.text43') }}</li>
        </ul>
        <div class="base-pop--footer">
          <button type="button" class="btn-pop--green">{{ $t('Common.confirm') }}</button> <!--클릭 이벤트 개발 요망-->
        </div>
      </template>
    </base-popup>

    <base-popup v-if="false" class="base-pop">
      <template v-slot:contents>
        <p>{{ $t('CheckupPrivacyAgreePopup.text44') }}</p>
        <p>{{ $t('CheckupPrivacyAgreePopup.text45') }} <span class="txt--red">{{ $t('CheckupPrivacyAgreePopup.text46') }}</span></p> <!--항목 노출 개발 요망-->
        <div class="base-pop--footer">
          <button type="button" class="btn-pop--green">{{ $t('Common.confirm') }}</button> <!--클릭 이벤트 개발 요망-->
        </div>
      </template>
    </base-popup>

    <base-popup v-if="false" class="base-pop">
      <template v-slot:contents>
        <p>{{ $t('CheckupPrivacyAgreePopup.text47') }}</p>
        <p>{{ $t('CheckupPrivacyAgreePopup.text48') }}</p>
        <p class="txt--green">2021년 9월 28일</p> <!--날짜 개발 요망-->
        <ul class="bull--billiards analyze--ul txt--desc">
          <li>{{ $t('CheckupPrivacyAgreePopup.text43') }}</li>
        </ul>
        <div class="base-pop--footer">
          <button type="button" class="btn-pop--gray">{{ $t('CheckupPrivacyAgreePopup.text49') }}</button> <!--클릭 이벤트 개발 요망-->
          <button type="button" class="btn-pop--green">{{ $t('CheckupPrivacyAgreePopup.text50') }}</button> <!--클릭 이벤트 개발 요망-->
        </div>
      </template>
    </base-popup>

    <base-popup v-if="openPopError" class="openPopContinue">
      <template v-slot:contents>
        <p>{{ errorMessage }}</p>
        <p class="color--gray space--top-small" />
        <div class="txt--center">
          <button @click="openPopError = false" class="btn-pop--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>
  </div>
</template>

<style lang="scss" scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
  background-color: #7ED47C;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6746F;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6AE5A;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
  background-color: #7ED47C;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>