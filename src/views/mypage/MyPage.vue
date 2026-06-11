<script setup>
import { go } from '@/assets/js/common'
import { ref } from 'vue'
import { useStore } from 'vuex'
import MyPagePhoneChangePopup from '@/views/mypage/MyPagePhoneChangePopup.vue'
import MyPagePinChangePopup from '@/views/mypage/MyPagePinChangePopup.vue'
import MyPageServiceQuitPopup from '@/views/mypage/MyPageServiceQuitPopup.vue'
import * as bodykeyApi from '@/apis/bodykey'

const store = useStore()
const user = store.getters.getUser
const isPopupPhone = ref(false)
const isPopupPin = ref(false)
const isQuit = ref(false)
const isBodyKey = ref(false)
const bodyKeyId = ref('')
const bodyKeyPw = ref('')
const bodyKeyData = ref('')

/**
 * `isBodyKey`이라는 변수의 상태를 변경합니다.
 * 만약 `isBodyKey`의 값이 true라면, 그것을 false로 바꾸고,
 * 그렇지 않으면 (즉, `isBodyKey`가 false라면), 그것을 true로 바꿉니다.
 * 다시 말해서, 이 함수는 `isBodyKey` 값을 true와 false 사이에서 토글합니다.
 */
const openBodyKey = () => {
  if (isBodyKey.value === true) {
    isBodyKey.value = false
  } else {
    isBodyKey.value = true
  }
}

/**
 * 유저가 설정한 BodyKeyID와 BodyKeyPW를 사용하여 'bodykeyApi'에서 데이터를 가져옵니다.
 *   해당 함수는 비동기로 실행되며, 요청이 성공하면 최신의 'bodyKeyData' 값을 추출하여 사용합니다.
 *   만약 요청 중 에러가 발생하면, 에러 메시지를 콘솔에 출력합니다.
 * @returns {Promise<void>}
 */
const bodyKeyGetData = async () => {
  const param = {
    BodyKeyID: bodyKeyId.value,
    BodyKeyPW: bodyKeyPw.value
  }

  try {
    const response = await bodykeyApi.getBodykeyData(param)

    bodyKeyData.value = response.data.latest
  } catch (e) {
    console.error(e)
  }
}

function popupPhoneOpen () { /* 231212 폰번호 변경 팝업 오픈 */
  isPopupPhone.value = true
}
function popupPhoneClose () { /* 231212 팝업이 여러개 생겨서 이름 변경 */
  isPopupPhone.value = false
}
function popupPinOpen () { /* 231212 폰번호 변경 팝업 오픈 */
  isPopupPin.value = true
}
function popupPinClose () { /* 231212 핀번호 변경 팝업 오픈 */
  isPopupPin.value = false
}
function popupQuit () { /* 231212 탈퇴 팝업 추가 */
  isQuit.value = true
}
function popupQuitClose () { /* 231212 탈퇴 팝업 닫기 추가 */
  isQuit.value = false
}
function changeReload () {
  window.location.reload()
}
</script>

<template>
  <div class="MyPage">
    <div>
      <div class="align--center2 age-img" :class="{'age20' : user.genderName === '남성', 'age20f' : user.genderName === '여성'}" @dblclick="openBodyKey" />
      <!--여성의 경우 f를 붙여줌 ex) 남: age20, 여: age20f-->
      <div class="txt--center name">{{ user.name }}{{ $t('Common.name') }}</div>
    </div>
    <dl class="info">
      <dt>{{ $t('MyPage.text1') }}</dt>
      <dd>{{ user.distNo }}</dd>
      <dt>{{ $t('Common.sex') }}</dt>
      <dd>{{ user.genderName === '남성' ? $t('Common.male') : $t('Common.female') }}</dd>
      <dt>{{ $t('MyPage.text3') }}</dt>
      <dd>{{ user.dateOfBirth }}</dd>
      <dt>{{ $t('MyPage.text4') }}</dt>
      <dd>{{ user.mobile }}
        <button @click="popupPhoneOpen" type="button" class="btn--small2 btn">{{ $t('MyPage.text5') }}</button>
      </dd>
    </dl>
    <div class="btn-wrap">
      <a @click="go('/my-page/checkup-list')" href="javascript: void(0);" class="btn--big3">{{ $t('MyPage.text6') }}</a>
      <!--검진 데이터 이력 페이지 이동 처리 요망-->
      <a @click="go('/my-page/body-composition-list')" href="javascript: void(0);" class="btn--big3">{{ $t('MyPage.body_composition_history') }}</a>
      <!--      <a @click="go('my-page-report-request-history')" href="javascript: void(0);" class="btn&#45;&#45;big3">리포트 인쇄신청 이력</a> &lt;!&ndash;리포트 신청 이력 이동 요망&ndash;&gt;-->
      <!-- <router-link to="/my-page/print-list" class="btn--big3">{{ $t('MyPage.text7') }}</router-link> -->
      <a @click="popupPinOpen" href="javascript: void(0);" class="btn--big3">{{ $t('MyPage.text8') }}</a> <!--핀번호 변경 화면 이동 요망-->
    </div>
    <a @click="popupQuit" href="javascript: void(0);" class="btn--txt2 break">{{ $t('MyPage.text9') }}</a> <!--탈퇴 이동 요망-->

    <div v-if="isBodyKey">

      <dl class="info">
        <dt>ID</dt>
        <dd><input type="text" v-model="bodyKeyId" /></dd>
        <dt>PW</dt>
        <dd><input type="password" v-model="bodyKeyPw" /></dd>
        <dt />
        <dd>
          <button @click="bodyKeyGetData" type="button" class="btn--small2 btn">{{ $t('MyPage.text12') }}</button>
        </dd>
      </dl>
      <div>{{bodyKeyData}}</div>
    </div>

    <MyPagePhoneChangePopup
      :isPopupPhone="isPopupPhone"
      :user="user"
      @popupClose="popupPhoneClose"
      @changeReload="changeReload" /> <!--231212 닫기 함수명 변경-->
    <MyPagePinChangePopup :isPopupPin="isPopupPin" @popupClose="popupPinClose" /> <!--231212 핀번호 팝업 추가-->
    <MyPageServiceQuitPopup :isQuit="isQuit" @popupClose="popupQuitClose" /> <!--231212 탈퇴 팝업 추가-->
  </div>
</template>
