<script>

import router from '@/router'
import { go } from '@/assets/js/common'
import MyPagePhoneChangePopup from '@/views/mypage/MyPagePhoneChangePopup.vue' /* 231212 팝업으로 수정 */
import MyPagePinChangePopup from '@/views/mypage/MyPagePinChangePopup.vue' /* 231212 팝업으로 수정 */
import MyPageServiceQuitPopup from '@/views/mypage/MyPageServiceQuitPopup.vue' /* 231212 추가 */
import BasePopup from '@/components/BasePopup.vue' /* 202606 추가 */
import BaseToast from '@/components/BaseToast.vue'

export default {
  name: 'MyPage',
  components: { MyPageServiceQuitPopup, MyPagePinChangePopup, MyPagePhoneChangePopup, BasePopup, BaseToast }, /* 202606 추가 */
  data() {
    return {
      data: { age: 20, nickname: '둘리아빠', name: '이하늘', userNum: 7480000, gender: '남성', birth: '1980.03.12', phone: '010-1234-5678' },
      isPopupPhone: false, /* 231212 폰번호 변경 팝업 오프너 */
      isPopupPin: false, /* 231212 핀번호변경 팝업 오프너 */
      isQuit: false, /* 231212 탈퇴 팝업 오프너 */
      imageUrl: null, /* 202606 프로필 이미지 변경 */
      nicknameDefault: true, /* 202606 닉네임 변경 */
      nicknameEdit: '', /* 202606 닉네임 변경 인풋 입력값 체크 */
      nicknameDisabledPopup: false, /* 사용 불가 닉네임 팝업 */ 
      toastMsg: '', /* 토스트 팝업 */ 
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
    },
    onFileChange(event) { /* 202606 프로필 이미지 변경 */
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    onEdit(){
      this.nicknameDefault = !this.nicknameDefault
    },
    showSuccess(message){
      this.toastMsg = message
      
      // 3초 후 자동으로 닫기
      setTimeout(() => {
        this.toastMsg = ''
      }, 3000)
    }
  }

}
</script>

<template>
  <div class="MyPage">
    <!-- <div>
      <div class="align&#45;&#45;center2 age-img" :class="data.age === 20 ? 'age20' : data.age === 40 ? 'age40' : data.age === 60 ? 'age60' : ''">
      <div class="align--center2 age-img" :class="{'age20' : data.gender === '남성', 'age20f' : data.gender === '여성'}">
      </div> -->
      <!--여성의 경우 f를 붙여줌 ex) 남: age20, 여: age20f-->
      <!-- <div class="txt--center name">{{ data.name }}님</div> -->
    <!-- </div> -->
    <div class="profile-wrap">
      <div class="upload-wrap">
        <input type="file" id="uploadIcon" class="upload-icon" @change="onFileChange" hidden />
        <label for="uploadIcon" class="upload-label">
          <img v-if="imageUrl" class="uploaded-img" :src="imageUrl" alt="업로드된 이미지" />
          <img v-else class="ico-logo" src="/img/age_20f.png" alt="파일 업로드 등록 아이콘" />
        </label>
        <div class="upload-ico">
          <img src="/img/ico_camera-white.svg">
        </div>
      </div>
      <div class="text-wrap">
        <div class="text-wrap-default" v-if="nicknameDefault">
          <p>{{ data.nickname }}</p>
          <button @click="onEdit" type="button" class="btn-modify" title="프로필명 변경" ></button>
        </div>
        <div class="text-wrap-modify" v-else>
          <div class="BasePhoneInput">
            <input type="text" v-model="nicknameEdit" placeholder="닉네임" />
            <button :disabled="!nicknameEdit" @click="data.nickname = nicknameEdit, onEdit(), nicknameDisabledPopup = true" type="button" class="BasePhoneInput--btn">확인</button> <!-- 퍼블 임의로 click 이벤트 실행 / 개발 금지어 적용 필요-->
          </div>
          <p class="text-wrap-modify-desc">* 개인정보가 식별되는 닉네임 사용은 자제해 주세요</p>
        </div>
      </div>
    </div>
    <dl class="info">
      <dt>회원 정보</dt>
      <dd>{{ data.userNum }}</dd>
      <dt>이름</dt>
      <dd>{{ data.name }}</dd>
      <dt>성별</dt>
      <dd>{{ data.gender }}</dd>
      <dt>생년월일</dt>
      <dd>{{ data.birth }}</dd>
      <dt>휴대폰번호</dt>
      <dd>
        <span>{{ data.phone }}</span>
        <button @click="popupPhoneOpen" type="button" class="btn--small2 btn">변경</button>
      </dd> <!--231212 함수명 변경-->
      <dt>PIN 번호 변경</dt>
      <dd><button @click="popupPinOpen" type="button" class="btn--small2 btn">변경</button></dd>
    </dl>
    <BaseToast :msg="toastMsg" class="toast-green"/>
    <div class="btn-wrap">
      <a @click="go('')" href="javascript: void(0);" class="btn--big3"><img src="/img/img_my_trophy.png">나의 미션 활동</a>
      <a @click="go('')" href="javascript: void(0);" class="btn--big3"><img src="/img/img_my_coupon.png">나의 분석권</a>

      <!-- <a @click="go('my-page/pub-my-page-checkup-data-record')" href="javascript: void(0);" class="btn--big3">검진 데이터 이력</a> -->
      <!--검진 데이터 이력 페이지 이동 처리 요망-->
      <!-- <a @click="go('my-page/pub-my-page-report-print-record')" href="javascript: void(0);" class="btn--big3">리포트 인쇄신청 이력</a> -->
      <!--리포트 신청 이력 이동 요망-->
      <!-- <a @click="popupPinOpen" href="javascript: void(0);" class="btn--big3">PIN 번호 변경</a> -->
      <!--핀번호 변경 화면 이동 요망-->
      <!--231212 함수 추가-->
    </div>
    <div class="box-wrap">
      <p>이력관리</p>
      <div class="box-wrap-cont">
        <a @click="go('my-page/pub-my-anlyze')" href="javascript: void(0);" class="box-link">건강수명 분석 결과 이력</a>
        <a @click="go('')" href="javascript: void(0);" class="box-link">챌린지 성공 보상 지급 이력</a>
        <a @click="go('')" href="javascript: void(0);" class="box-link">분석권 사용 이력</a>
        <a @click="go('my-page/pub-my-page-checkup-data-record')" href="javascript: void(0);" class="box-link">검진 데이터 이력</a>
        <a @click="go('')" href="javascript: void(0);" class="box-link">체성분 데이터 이력</a>
      </div>
    </div>

    <div class="box-wrap">
      <p>계정 연동 정보</p>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap">
          <span>바디키 미션</span>
        </div>
      </div>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap">
          <span>바디키 미션</span>
          <div>
            <button class="box-btn">연동하기</button>
          </div>
        </div>
      </div>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap">
          <span>바디키 미션</span>
          <div>
            <span>$프로필명$</span>
            <button class="box-btn" disabled>연동완료</button>
          </div>
        </div>
      </div>
      <div class="box-note">※ 계정은 해당 서비스에서 진행할 수 있습니다.</div>
    </div>
    <a @click="popupQuit" href="javascript: void(0);" class="btn--txt2 break">서비스 탈퇴</a> <!--탈퇴 이동 요망-->
    <!--231212 함수 추가-->

    <MyPagePhoneChangePopup :isPopupPhone="isPopupPhone" @popupClose="popupPhoneClose(), showSuccess('휴대폰번호가 변경되었습니다.')" /> <!--231212 닫기 함수명 변경--> <!-- 202606 토스트팝업 퍼블 확인용 임의 파일 내부에서 message.alert 수정 필요 -->
    <MyPagePinChangePopup :isPopupPin="isPopupPin" @popupClose="popupPinClose" /> <!--231212 핀번호 팝업 추가-->
    <MyPageServiceQuitPopup :isQuit="isQuit" @popupClose="popupQuitClose" /> <!--231212 탈퇴 팝업 추가-->

    <!-- 사용 불가 닉네임 팝업 -->
    <BasePopup v-if="nicknameDisabledPopup"> 
      <template v-slot:contents>
        <p class="pop-text-light">사용이 불가한 닉네임입니다.</p>
        <p class="pop-text-bold">다시 입력해 주세요.</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="nicknameDisabledPopup = false" class="pop-btn pop-btn--green">닫기</button>
        </div>
      </template>
    </BasePopup>

  </div>
</template>

<style lang="scss"></style>
