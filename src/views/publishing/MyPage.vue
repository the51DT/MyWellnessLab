<script>

import router from '@/router'
import { go } from '@/assets/js/common'
import MyPagePhoneChangePopup from '@/views/publishing/mypage/MyPagePhoneChangePopup.vue' /* 231212 팝업으로 수정 */
import MyPagePinChangePopup from '@/views/publishing/mypage/MyPagePinChangePopup.vue' /* 231212 팝업으로 수정 */
import MyPageServiceQuitPopup from '@/views/publishing/mypage/MyPageServiceQuitPopup.vue' /* 231212 추가 */
export default {
  name: 'MyPage',
  components: { MyPageServiceQuitPopup, MyPagePinChangePopup, MyPagePhoneChangePopup }, /* 231212 추가 */
  data() {
    return {
      data: { age: 20, name: '이하늘', userNum: 7480000, gender: '남성', birth: '1980.03.12', phone: '010-1234-5678' },
      isPopupPhone: false, /* 231212 폰번호 변경 팝업 오프너 */
      isPopupPin: false, /* 231212 핀번호변경 팝업 오프너 */
      isQuit: false /* 231212 탈퇴 팝업 오프너 */
    }
  },
  methods: {
    go,
    router() {
      return router
    },
    popupPhoneOpen() { /* 231212 폰번호 변경 팝업 오픈 */
      this.isPopupPhone = true
    },
    popupPhoneClose() { /* 231212 팝업이 여러개 생겨서 이름 변경 */
      this.isPopupPhone = false
    },
    popupPinOpen() { /* 231212 폰번호 변경 팝업 오픈 */
      this.isPopupPin = true
    },
    popupPinClose() { /* 231212 핀번호 변경 팝업 오픈 */
      this.isPopupPin = false
    },
    popupQuit() { /* 231212 탈퇴 팝업 추가 */
      this.isQuit = true
    },
    popupQuitClose() { /* 231212 탈퇴 팝업 닫기 추가 */
      this.isQuit = false
    }
  }

}
</script>

<template>
  <div class="MyPage">
    <div>
<!--      <div class="align&#45;&#45;center2 age-img" :class="data.age === 20 ? 'age20' : data.age === 40 ? 'age40' : data.age === 60 ? 'age60' : ''">-->
      <div class="align--center2 age-img" :class="{'age20' : data.gender === '남성', 'age20f' : data.gender === '여성'}">
      </div>
      <!--여성의 경우 f를 붙여줌 ex) 남: age20, 여: age20f-->
      <div class="txt--center name">{{ data.name }}님</div>
    </div>
    <dl class="info">
      <dt>회원번호</dt>
      <dd>{{ data.userNum }}</dd>
      <dt>성별</dt>
      <dd>{{ data.gender }}</dd>
      <dt>생년월일</dt>
      <dd>{{ data.birth }}</dd>
      <dt>휴대폰번호</dt>
      <dd>{{ data.phone }}
        <button @click="popupPhoneOpen" type="button" class="btn--small2 btn">변경</button>
      </dd> <!--231212 함수명 변경-->
    </dl>
    <div class="btn-wrap">
      <a @click="go('pub-my-page-checkup-data-record')" href="javascript: void(0);" class="btn--big3">검진 데이터 이력</a>
      <!--검진 데이터 이력 페이지 이동 처리 요망-->
      <a @click="go('pub-my-page-report-print-record')" href="javascript: void(0);" class="btn--big3">리포트 인쇄신청 이력</a>
      <!--리포트 신청 이력 이동 요망-->
      <a @click="popupPinOpen" href="javascript: void(0);" class="btn--big3">PIN 번호 변경</a> <!--핀번호 변경 화면 이동 요망-->
      <!--231212 함수 추가-->
    </div>
    <a @click="popupQuit" href="javascript: void(0);" class="btn--txt2 break">서비스 탈퇴</a> <!--탈퇴 이동 요망-->
    <!--231212 함수 추가-->

    <MyPagePhoneChangePopup :isPopupPhone="isPopupPhone" @popupClose="popupPhoneClose" /> <!--231212 닫기 함수명 변경-->
    <MyPagePinChangePopup :isPopupPin="isPopupPin" @popupClose="popupPinClose" /> <!--231212 핀번호 팝업 추가-->
    <MyPageServiceQuitPopup :isQuit="isQuit" @popupClose="popupQuitClose" /> <!--231212 탈퇴 팝업 추가-->

  </div></template>

<style lang="scss"></style>
