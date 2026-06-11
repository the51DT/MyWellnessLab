<script setup>
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import BaseInputOnlyNumber from '../BaseInputOnlyNumber.vue'

import { useStore } from 'vuex' // TODO LYH
import router from '@/router'
import axios from 'axios'

import { ref, reactive, computed, watch } from 'vue'
import BasePersonalInfo from '@/views/publishing/BasePersonalInfo.vue' /* 231228 약관 변경, 파일 수정 */
import BasePersonal3 from '@/views/publishing/BasePersonal3.vue' /* 231222 약관 추가 변경 */ /* 231227 3자제공 추가, 약관 변경 추가 */ /* 231228 약관 변경, 추가 */

const store = useStore()

// TODO LYH Start 근시일 중 정리 예정
const token = localStorage.getItem('mwlToken')
// let user = JSON.parse(localStorage.getItem('user'));
// const userName = localStorage.getItem('mwlUserName');
// user.dateOfBirth = user.dateOfBirth.substring(0, 10).replace(/\-/gi, '');

const header = {
  Authorization: token
}
// TODO END

// Emit Defnie
const emit = defineEmits(['popupClose', 'certificationFalse'])

// Deprecated Component Ref Define
const basePopup = ref(null)
const baseInputOnlyNumber = ref(null)
const basePopupTit = ref(null)

// Default Variable Define
const channel = [ /* 인증 채널 */
  { label: '카카오톡', value: 1, class: 'kakao' }, /* 선택된 항목에 active 클래스를 추가하기 위해 인덱스 추가 */
  { label: '네이버', value: 6, class: 'naver' },
  { label: 'PASS', value: 5, class: 'pass' },
  { label: '토스', value: 8, class: 'toss' },
  { label: '삼성패스', value: 3, class: 'samsung' },
  { label: '페이코', value: 2, class: 'payco' },
  { label: '국민인증서', value: 4, class: 'kb' },
  { label: '신한인증서', value: 7, class: 'shinhan' }
]

const dispData = reactive({
  selectChannel: '', /* 선택된 채널 */
  name: '',
  birth: '', /* 생년월일 */
  validationBirth: '', //
  phoneNumber: '', /* 휴대폰번호 */
  validationPhone: '', //
  agreeAll: false, /* 전체동의 */
  agree1: false, /* 제 3자 정보제공 동의 */
  agree2: false, /* 고유식별정보 처리 동의 */
  agree3: false, /* 간편인증과 간편인증 확인 화면 전환 변수, true: 확인 대기 화면 */
  agree1Title: '제 3자 정보제공',
  agree2Title: '고유식별정보 처리',
  agreeDefaultMsg: '에 동의 하셔야 합니다.',
  screen: false
})

let firstCertiData = { // 1차 인증 데이터
  data: {},
  firstCertification: {
    additionalProp1: {},
    additionalProp2: {},
    additionalProp3: {}
  },
  result: {}
}

let secondCertiData = {}// 2차 인증 데이터

// 서비스 이용에 대한 동의 관련
// const checkboxAllEl = computed(() => checkboxTerms.value && checkboxPrivacy.value);
const checkboxAllEl = ref(false) /* 전체 동의 */
const checkboxTerms = ref(false) /* 이용약관 */
const checkboxPrivacy = ref(false) /* 개인정보 */
// const serviceUseTerms = ref("서비스 이용약관 내용"); 231222 약관 추가 변경
// const personalInfoRule = ref("개인정보 처리방침 동의"); 231222 약관 추가 변경
function checkAll(event) {
  if (event.target.checked) {
    checkboxTerms.value = true
    checkboxPrivacy.value = true
  } else {
    checkboxTerms.value = false
    checkboxPrivacy.value = false
  }
}
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

/**********************************************************
 * analysesType : 1(공단 연계)|2(직접입력)|3(일회성)
 * 값은 추후 변경될 수 있음
 * 값에 따라 데이터 자동 바인딩 / 직접 입력 등 세부처리
 **********************************************************/
const analysesType = ref(0) // 검사 분류
let analysesData = null // 검사 데이터

// Func
function validateCheck() {
  // TODO LYH VALIDATE 정규식 처리 추가

  let rtnMsg = ''

  if (dispData.selectChannel === '') {
    rtnMsg = '인증하실 채널을 선택해 주십시오.'
    alert(rtnMsg)
    return false
  }

  if (!dispData.agree1) {
    rtnMsg = dispData.agree1Title + dispData.agreeDefaultMsg
    alert(rtnMsg)
    return false
  }
  if (!dispData.agree2) {
    rtnMsg = dispData.agree2Title + dispData.agreeDefaultMsg
    alert(rtnMsg)
    return false
  }

  firstCertification()
  // analysesStart(); //TODO
}

function analysesStart() {
  router.push({
    name: 'CheckupBasics',
    state: {
      analysesType: '1' // TODO 추후 값 재정의
    }
  })
}

async function firstCertification() { // 1차 인증
  const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/codef/first-certification'

  const param = { // TODO TEST DATA, 이후 input data로 변경.
    identity: dispData.birth,
    loginTypeLevel: dispData.selectChannel,
    phoneNo: dispData.phoneNumber,
    userName: dispData.name
  }

  // await
  axios.post(api, param, { headers: header })
    .then(res => {
      if (res.data.status === 'SUCCESS') {
        firstCertiData = res.data.data
        localStorage.setItem('firstCerti', res.data.data) // TODO LYH 임시 백업
        // TODO LYH data.result 체크도 필요(인증관련 앱 설치여부 등 체크)
        /*
            res.data.data.result.code || res.data.data.result.message
          */
        dispData.screen = true
      }
    })
    .catch(error => {
      console.log(error)
    })
}

function popupClose() { /* 팝업 닫기 */
  emit('popupClose')
}

function inputName(value) {
  dispData.name = value
}

function inputBirth(value) { /* 생년월일 받기 */
  dispData.birth = value
}

function inputPhone(value) { /* 폰번호 받기 */
  dispData.phoneNumber = value
}

const selectedIndex = computed(() => { /* 선택된 채널 active 클래스 추가위해 추가 */
  switch (dispData.selectChannel) {
    case 1:
      return 0
    case 6:
      return 1
    case 5:
      return 2
    case 8:
      return 3
    case 3:
      return 4
    case 2:
      return 5
    case 4:
      return 6
    case 7:
      return 7
  }
})

function checkboxAgreeAll() { /* 전체 동의 체크 콘트롤 */
  if (dispData.agreeAll) {
    dispData.agree1 = true
    dispData.agree2 = true
  } else {
    dispData.agree1 = false
    dispData.agree2 = false
  }
}

function checkboxAgree1() { /* 제 3자 정보제공 동의 콘트롤 */
  if (dispData.agree1) {
    if (dispData.agree2) {
      dispData.agreeAll = true
    }
  } else {
    dispData.agreeAll = false
  }
}

function checkboxAgree2() { /* 고유식별정보 처리 동의 콘트롤 */
  if (dispData.agree2) {
    if (dispData.agree1) {
      dispData.agreeAll = true
    }
  } else {
    dispData.agreeAll = false
  }
}

async function secondCertification() {
  const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/survey/codef/second-certification'

  // await
  axios.post(api, firstCertiData, { headers: header })
    .then(res => {
      switch (res.data.data.result.code) {
        case 'CF-00000':// 성공
          secondCertiData = res.data.data
          console.log(res.data.data)
          localStorage.setItem('secondCerti', JSON.stringify(res.data.data)) // TODO LYH 임시 백업
          analysesType.value = 1
          convetanalysesData()
          confirm(-1)
          break
        case 'CF-12872':
          confirm(0)
          break
        default:
          alert(res.data.data.result.message)
          break
      }
    })
    .catch(error => {
      console.log(error)
    })
}

function convetanalysesData() {
  const user = JSON.parse(localStorage.getItem('user'))
  const data = secondCertiData.data

  analysesData = {
    name: dispData.name,
    birthDate: dateConvert(dispData.birth),
    age: calcAge(),
    sex: (user.gender === 'MALE' ? 1 : 2),
    checkDate: dateConvert(data.resCheckupYear.concat(data.resCheckupDate)),
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
  localStorage.setItem('analysesData', analysesData) // TODO LYH 임시 백업
}

function dateConvert(val) {
  return (val.substring(0, 4).concat('-')) + (val.substring(4, 6).concat('-')) + val.substring(6)
}

function calcAge() {
  const date = dateConvert(dispData.birth)

  const m = new Date(date)
  const d = new Date()

  let age = d.getFullYear() - m.getFullYear()
  if (d.getMonth() < m.getMonth()) {
    age--
  } else if (d.getMonth() === m.getMonth() && d.getDate() < m.getDate()) {
    age--
  }

  return age
}

function confirm() { /* 간편인증 확인 확인 버튼 클릭 시 */
  if (0 /* 인증 미완료 조건 수정 요망 */) {
    alert('간편 인증이 완료되지  않았습니다\n선택하신 간편인증을 확인 해주세요')
    emit('popupClose')
    return
  } else if (secondCertiData.data == null) { /* 건강검진 기록 없을 경우 조건 수정 요망 */
    alert('등록된 건강검진 기록이 없습니다.')
    emit('popupClose')
    router.push('/checkup')
    return
  }
  // router.push('/checkup-basics');
  router.push({
    path: '/checkup-basics',
    state: {
      analysesType,
      analysesData
    }
  })
}
</script>

<template>
  <base-popup-tit @popupClose="popupClose" class="CheckupPrivacyAgreePopup">

    <template v-slot:title>
      <span v-if="!dispData.screen" class="CheckupPrivacyAgreePopup--pop-tit">간편인증</span>
      <span v-else class="CheckupPrivacyAgreePopup--pop-tit">간편인증 확인</span>
    </template>
    <template v-slot:contents>

      <div v-if="!dispData.screen" class="CheckupPrivacyAgreePopup--pop-wrap"> <!--간편인증-->
        <div class="CheckupPrivacyAgreePopup--pop-wrap-min"> <!--콘텐츠 wrap-->
          <div class="CheckupPrivacyAgreePopup--con">
            <div class="CheckupPrivacyAgreePopup--tit-wrap">
              <h2 class="tit--big">간편인증서 채널</h2>
            </div>
            <div class="CheckupPrivacyAgreePopup--channel">
              <div v-for="(item, index) in channel" :key="index" class="CheckupPrivacyAgreePopup--ch-in-wrap">
                <label :for="item.class" class="CheckupPrivacyAgreePopup--ch-label"
                  :class="{ [item.class]: true, 'active': selectedIndex === index }">
                  <input v-model="dispData.selectChannel" :value="item.value" type="radio" name="ch" :id="item.class"
                    hidden="hidden" ref="valiChannel" class="CheckupPrivacyAgreePopup--ch-input">
                  <span class="txt--desc3 c222">{{ item.label }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="CheckupPrivacyAgreePopup--input-wrap">
            <div class="CheckupPrivacyAgreePopup--input-tit-wrap">
              <h2 class="CheckupPrivacyAgreePopup--input-tit">본인인증 정보입력</h2>
            </div>
            <div class="CheckupPrivacyAgreePopup--input-con-wrap">
              <div class="CheckupPrivacyAgreePopup--input-wrap">
                <h3 class="CheckupPrivacyAgreePopup--input-tit">이름</h3>
                <input placeholder="이름을 입력해주세요" v-model="dispData.name" ref="valiName" @inputTxt="inputName" type="text"
                  name="cpap01" id="" class="CheckupPrivacyAgreePopup--input-input">
              </div>
              <div class="CheckupPrivacyAgreePopup--input-wrap">
                <h3 class="CheckupPrivacyAgreePopup--input-tit">생년월일</h3>
                <baseInputOnlyNumber @inputTxt="inputBirth" :maxlength="8" :placeholder="`8자리 숫자입력 (예:19850902)`"
                  :id="`cpap02`" class="CheckupPrivacyAgreePopup--input-input--com" />
                <div v-if="dispData.validationBirth" class="CheckupPrivacyAgreePopup--vali">{{ dispData.validationBirth }}
                </div> <!--개발 시 벨리데이션 처리 요망-->
              </div>
              <div class="CheckupPrivacyAgreePopup--input-wrap" ref="valiPhone">
                <h3 class="CheckupPrivacyAgreePopup--input-tit">휴대폰번호 입력</h3>

                <!--                <baseInputOnlyNumber @inputTxt="inputPhone" :maxlength="11" :placeholder="`- 없이 숫자만 입력하세요`" :id="`cpap03`" class="CheckupPrivacyAgreePopup&#45;&#45;input-input&#45;&#45;com" />-->
                <div class="CheckupPrivacyAgreePopup--phone">
                  <div class="CheckupPrivacyAgreePopup--company">
                    <select name="" id="" class="select">
                      <option value="" disabled>통신사</option>
                      <option value="">SKT</option>
                      <option value="">SKT 알뜰폰</option>
                      <option value="">KT</option>
                      <option value="">KT 알뜰폰</option>
                      <option value="">LG U+</option>
                      <option value="">LG U+ 알뜰폰</option>
                    </select>
                  </div>
                  <div>
                    <input type="number" maxlength="8" name="" id="" placeholder=" - 없이 숫자만 입력하세요">
                  </div>
                </div>

                <div v-if="dispData.validationPhone" class="CheckupPrivacyAgreePopup--vali">{{ dispData.validationPhone }}
                </div> <!--개발 시 벨리데이션 처리 요망-->
              </div>
            </div>
          </div>

          <div class="CheckupPrivacyAgreePopup--terms">
            <div class="CheckupPrivacyAgreePopup--terms-tit">
              <h2 class="CheckupPrivacyAgreePopup--terms-h2">서비스 이용에 대한 동의</h2>
            </div>
            <div class="space--top-small">
              <div class="JoinTermsAgree--all-check-wrap">
                <label for="jta01" class="JoinTermsAgree--all"> <!--임의의 for값이니 수정해도 무방, 단 고칠 대는 아래 input id도 함께 고쳐야 함-->
                  <span class="checkbox" :class="checkboxAllEl ? 'active' : ''">
                    <input @change="checkAll" v-model="checkboxAllEl" type="checkbox" name="" id="jta01"
                      class="JoinTermsAgree--all-check" hidden="hidden">
                    <span></span>
                  </span>
                  <span class="JoinTermsAgree--all-txt">전체동의</span>
                </label>
              </div>
              <hr class="gray2 JoinTermsAgree--hr">
              <div class="JoinTermsAgree--terms-wrap">
                <div class="align--between JoinTermsAgree--terms-in-wrap" ref="valiTerms1">
                  <label for="jta02" class="JoinTermsAgree--terms">
                    <span class="checkbox" :class="checkboxTerms ? 'active' : ''">
                      <input v-model="checkboxTerms" type="checkbox" name="" id="jta02" class="JoinTermsAgree--check"
                        hidden="hidden">
                      <span></span>
                    </span>
                    <span class="JoinTermsAgree--tit">개인정보수집이용동의</span> <!--231227 3자제공 추가, 약관 변경, 텍스트 변경-->
                    <!--231228 약관 변경, 제목 변경-->
                  </label>
                </div>
                <div class="JoinTermsAgree--texts"> <!--231222 약관 추가 변경-->
                  <BasePersonalInfo /> <!--231228 약관 변경, 파일 변경-->
                </div>
              </div>
              <div class="JoinTermsAgree--privacy-wrap">
                <div class="align--between JoinTermsAgree--privacy-in-wrap" ref="valiTerms2">
                  <label for="jta04" class="JoinTermsAgree--privacy-check-wrap">
                    <span class="checkbox" :class="checkboxPrivacy ? 'active' : ''">
                      <input v-model="checkboxPrivacy" type="checkbox" name="" id="jta04"
                        class="JoinTermsAgree--privacy-check" hidden="hidden">
                      <span></span>
                    </span>
                    <span class="JoinTermsAgree--privacy-tit">개인정보 제3자 제공 동의</span> <!--231227 3자제공 추가, 약관 변경, 텍스트 변경-->
                    <!--231228 약관 변경, 제목 변경-->
                  </label>
                </div>
                <div class="JoinTermsAgree--texts"> <!--231222 약관 추가 변경-->
                  <BasePersonal3 /> <!--231228 약관 변경, 추가-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="CheckupPrivacyAgreePopup--finish">
          <button @click="validateCheck" type="button"
            class="CheckupPrivacyAgreePopup--finish-btn btn--big3 green-wide">다음</button>
        </div>
      </div>

      <div v-else class="CheckupPrivacyAgreePopup--wait"> <!--간편인증 확인-->
        <div class="CheckupPrivacyAgreePopup--pop-wrap-min2"> <!--콘텐츠 wrap-->
          <div>
            <div class="CheckupPrivacyAgreePopup--wait-img">
              <img src="/img/ico_simple_certi.svg" alt="간편인증 완료" srcset="">
            </div>
            <p class="CheckupPrivacyAgreePopup--wait-txt">나의 건강검진 기록 <br>
              간편인증 확인 중 …</p>
            <p class="CheckupPrivacyAgreePopup--wait-txt2">휴대폰으로 간편인증 요청이 발송되었습니다 <br>
              인증이 완료되면 확인 버튼을 눌러주세요</p>
          </div>
        </div>
        <div class="CheckupPrivacyAgreePopup--finish">
          <button @click="secondCertification();" type="button" disabled
            class="CheckupPrivacyAgreePopup--finish-btn">확인</button> <!--개발 시 링크 수정, disabled 콘트롤 요망-->
        </div>
    </div>

  </template>
</base-popup-tit></template>

<style lang="scss"></style>
