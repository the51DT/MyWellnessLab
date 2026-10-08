<script>

import router from '@/router'
import { go } from '@/assets/js/common'
import MyPagePhoneChangePopup from '@/views/mypage/MyPagePhoneChangePopup.vue' /* 231212 팝업으로 수정 */
import MyPagePinChangePopup from '@/views/mypage/MyPagePinChangePopup.vue' /* 231212 팝업으로 수정 */
import MyPageServiceQuitPopup from '@/views/mypage/MyPageServiceQuitPopup.vue' /* 231212 추가 */
import BasePopup from '@/components/BasePopup.vue' /* 202606 추가 */
import BaseToast from '@/components/BaseToast.vue'
 /* 261008 선택 약관 동의 내역 추가 */
import BaseTooltip from '@/components/BaseTooltip.vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'

export default {
  name: 'MyPage',
  components: { MyPageServiceQuitPopup, MyPagePinChangePopup, MyPagePhoneChangePopup, BasePopup, BaseToast, BaseTooltip, BasePopupClose }, /* 202606 추가 */ /* 261008 선택 약관 동의 내역 추가 */
  data() {
    return {
      data: { age: 20, nickname: null, name: '이하늘', userNum: 7480000, gender: '남성', birth: '1980.03.12', phone: '010-1234-5678' },
      isPopupPhone: false, /* 231212 폰번호 변경 팝업 오프너 */
      isPopupPin: false, /* 231212 핀번호변경 팝업 오프너 */
      isQuit: false, /* 231212 탈퇴 팝업 오프너 */
      imageUrl: null, /* 202606 프로필 이미지 변경 */
      nicknameDefault: true, /* 202606 닉네임 변경 */
      nicknameEdit: '', /* 202606 닉네임 변경 인풋 입력값 체크 */
      nicknameDisabledPopup: false, /* 사용 불가 닉네임 팝업 */ 
      toastMsg: '', /* 토스트 팝업 */ 
      /* 261008 선택 약관 동의 내역 추가 */
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 툴팁 꼬다리 위치 */
      TermsAgreePopup: false, /* 약관 동의 확인 팝업 */
      TermsAgreeCompPopup: false, /* 약관 동의 완료 팝업 */
      TermsCancelPopup: false, /* 약관 철회 확인 팝업 */
      TermsCancelCompPopup: false, /* 약관 철회 완료 팝업 */
      TermsDetailPopup: false, /* 약관 상세 팝업 */
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
    },
    openTooltip($event) { /* 툴팁 열기 */ /* 261008 선택 약관 동의 내역 추가 */
      this.tooltip = true
      this.tooltipEdge = $event.clientX
      console.log(this.tooltipEdge)
    },
    tooltipClose() { /* 툴팁 닫기 */ /* 261008 선택 약관 동의 내역 추가 */
      this.tooltip = false
    },
    toggleTerms($event) { /* 동의 토글 */ /* 261008 선택 약관 동의 내역 추가 */
      const target = $event.currentTarget
      const isActive = target.classList.contains('active')

      this.TermsAgreePopup = false
      this.TermsCancelPopup = false

      if (isActive) {
        target.classList.remove('active')
        this.TermsCancelPopup = true
        return
      }
      target.classList.add('active')
      this.TermsAgreePopup = true
    },
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
          <img v-else class="ico-logo" src="/img/team_profile_exam.png" alt="파일 업로드 등록 아이콘" /> <!-- 260909 이미지 src 변경 -->
        </label>
        <div class="upload-ico">
          <img src="/img/ico_camera-white.svg">
        </div>
      </div>
      <div class="text-wrap">
        <div class="text-wrap-default" v-if="nicknameDefault">
          <p :class="data.nickname === null ? 'noNickname' : ''">{{ data.nickname === null ? '닉네임 미설정' : data.nickname }}</p> <!-- 261007 닉네임 미설정 추가 -->
          <button @click="onEdit" type="button" class="btn-modify" title="프로필명 변경" ></button>
          <button @click="" type="button" class="btn-user" title="사용자 선택"></button> <!-- 260923 공동사업자 사용자 선택 버튼 추가 -->
        </div>
        <div class="text-wrap-modify" v-else>
          <div class="BasePhoneInput">
            <input type="text" v-model="nicknameEdit" :placeholder="data.nickname === null ? '닉네임을 설정해주세요' : '닉네임'" /> <!-- 261007 닉네임 미설정 시 플레이스홀더 문구 변경 -->
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
      <dt>휴대폰 번호</dt> <!-- 260827 문구 수정 -->
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
        <a @click="go('my-page/pub-my-challenge-reward')" href="javascript: void(0);" class="box-link">챌린지 성공 보상 지급 이력</a>
        <!-- <a @click="go('')" href="javascript: void(0);" class="box-link">분석권 사용 이력</a> --> <!-- 260909 분석권 사용 이력 메뉴 제외 -->
        <a @click="go('my-page/pub-my-page-checkup-data-record')" href="javascript: void(0);" class="box-link">검진 데이터 이력</a>
        <a @click="go('my-page/pub-my-body')" href="javascript: void(0);" class="box-link">체성분 데이터 이력</a>
      </div>
    </div>

    <!-- [s] 261008 계정 연동 정보 수정 및 약관 동의 내역 추가 -->
    <div class="box-wrap">
      <p>계정 연동 정보</p>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap">
          <span>바디키 미션</span>
        </div>
        <div class="box-note">※ 계정 연동은 해당 서비스에서 진행할 수 있습니다</div>
      </div>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap">
          <span>바디키 미션</span>
          <div>
            <button class="box-btn">연동하기</button>
          </div>
        </div>
        <div class="box-note">※ 계정 연동은 해당 서비스에서 진행할 수 있습니다</div>
      </div>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap">
          <span>바디키 미션</span>
          <div>
            <span>$프로필명$</span>
            <button class="box-btn" disabled>연동완료</button>
          </div>
        </div>
        <div class="box-note">※ 계정 연동은 해당 서비스에서 진행할 수 있습니다</div>
      </div>
      <div class="box-wrap-cont">
        <div class="box-btn-wrap tooltip">
          <span>선택 약관 동의 내역</span>
          <button
            @click="openTooltip($event)"
            class="btn--tooltip"
            type="button"
            title="도움말" />
          <BaseTooltip
            v-if="tooltip"
            :leftLoca="tooltipEdge"
            @tooltipClose="tooltipClose">
            <template v-slot:contents>
              <p class="tooltip--contents">선택 약관에 대한 동의, 철회를 관리할 수 있습니다.<br>약관의 동의 상태를 변경하면 즉시 반영됩니다.</p>
            </template>
          </BaseTooltip>
        </div>
        <div class="box-terms-wrap">
          <div class="box-terms">
            <button class="box-terms-text" @click="TermsDetailPopup = true">민감정보(건강정보) 제3자 제공 동의</button>
            <button type="button" title="동의, 철회 관리" class="box-toggle active" @click="toggleTerms"></button>
          </div>
        </div>
      </div>
    </div>
    <!-- [e] 261008 계정 연동 정보 수정 및 약관 동의 내역 추가 -->
    <a @click="popupQuit" href="javascript: void(0);" class="btn--txt2 break">서비스 탈퇴</a> <!--탈퇴 이동 요망-->
    <!--231212 함수 추가-->

    <MyPagePhoneChangePopup :isPopupPhone="isPopupPhone" @popupClose="popupPhoneClose(), showSuccess('휴대폰 번호가 변경되었습니다.')" /> <!--231212 닫기 함수명 변경--> <!-- 202606 토스트팝업 퍼블 확인용 임의 파일 내부에서 message.alert 수정 필요 --> <!-- 260827 문구 수정 -->
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

    <!-- 약관 동의 확인 팝업 -->
    <BasePopup v-if="TermsAgreePopup"> 
      <template v-slot:contents>
        <p class="pop-text-bold">“$약관명$” 약관에 동의<br>하시겠습니까?</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="TermsAgreePopup = false" class="pop-btn pop-btn--gray">취소</button>
          <button type="button" @click="TermsAgreePopup = false, TermsAgreeCompPopup = true" class="pop-btn pop-btn--green">확인</button>
        </div>
      </template>
    </BasePopup>

    <!-- [s] 261008 선택 약관 동의 내역 추가 -->
    <!-- 약관 동의 완료 팝업 -->
    <BasePopup v-if="TermsAgreeCompPopup" class="MyPageTermsCompPop"> 
      <template v-slot:contents>
        <p class="pop-text-bold">“$약관명$” 약관에 동의<br>하였습니다.</p>
        <p class="pop-text-caption center">동의 일자 : YYYY.MM.DD</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="TermsAgreeCompPopup = false" class="pop-btn pop-btn--green">확인</button>
        </div>
      </template>
    </BasePopup>

    <!-- 약관 철회 확인 팝업 -->
    <BasePopup v-if="TermsCancelPopup"> 
      <template v-slot:contents>
        <p class="pop-text-bold">“$약관명$” 약관에 동의를<br>철회 하시겠습니까?</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="TermsCancelPopup = false" class="pop-btn pop-btn--gray">취소</button>
          <button type="button" @click="TermsCancelPopup = false, TermsCancelCompPopup = true" class="pop-btn pop-btn--green">확인</button>
        </div>
      </template>
    </BasePopup>

    <!-- 약관 철회 완료 팝업 -->
    <BasePopup v-if="TermsCancelCompPopup" class="MyPageTermsCompPop"> 
      <template v-slot:contents>
        <p class="pop-text-bold">“$약관명$” 약관에<br>철회하였습니다.</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="TermsCancelCompPopup = false" class="pop-btn pop-btn--green">확인</button>
        </div>
      </template>
    </BasePopup>

    <!-- 약관 상세 팝업 -->
    <BasePopupClose @popupClose="TermsDetailPopup = false" v-if="TermsDetailPopup" class="MyPageTermsDetailPop">
    <template v-slot:title>민감정보(건강정보) 제3자 제공 동의</template>
    <template v-slot:contents>
      <div class="pop-text-light">
        한국 암웨이(주)는 (이하'회사'라 함) 회원님의 민감정보를 수집,처리하고자 합니다.
      </div>
      <div class="pop-text-bold">
        개인정보의 수집 · 이용에 동의하지 않을 수 있으며, 이에 동의하지 않을 경우에도 마이웰니스 랩  서비스를 이용 하실 수 있습니다.
      </div>
      <table class="AnalyzePrivacyAgree--tb">
        <tbody>
          <tr>
            <th>개인정보를 제공받는 자</th>
            <td>㈜로그미</td>
          </tr>
          <tr>
            <th>이용<br>목적</th>
            <td>
              <ul>
                <li>개인식별정보 삭제 후 표본 축적을 통한 리포트 정확도 및 신뢰도 향상을 통한 서비스 개선</li>
                <li>개인식별정보 삭제 후 표본 축적을 통해 서비스 확장 방향과 컨텐츠 개선</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>수집<br>항목</th>
            <td>
              <ul>
                <li>나이, 성별</li>
                <li>건강설문 (생활습관, 건강습관, 삶의 질, 관심건강분야 등)</li>
                <li>건강검진 결과 항목 [키, 체중, 허리둘레, 혈압(수축기혈압, 이완기혈압), 공복혈당, 지질대사 수치 (총 콜레스테롤, 고밀도 콜레스테롤(HDL), 저밀도 콜레스테롤(LDL), 중성지방), 혈색소(Hb), 혈청크레아티닌, 아스파테이트 전이효소(AST, SGOT), 알라닌 전이효소(ALT, SGPT)]</li>
                <li>웰니스 분석 결과 데이터</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>보유<br>기간</th>
            <td>동의 철회 시 또는 회원 탈퇴 시 또는 개인정보 유효기간* 도래 시 또는 3년간</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-slot:button>
      <button type="button" @click="TermsDetailPopup = false" class="pop-btn pop-btn--green">확인</button>
    </template>
  </BasePopupClose>
    <!-- [e] 261008 선택 약관 동의 내역 추가 -->

  </div>
</template>

<style lang="scss"></style>
