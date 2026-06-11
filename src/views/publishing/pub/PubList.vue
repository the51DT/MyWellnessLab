<script setup>
import { ref } from 'vue'
import router from '@/router'
// import BasePinInput from "@/views/publishing/BasePinInput.vue";
// import jsPDF from "jspdf";

const data = ref([
  {
    div: '인트로',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Intro.vue',
    go: '/publishing/home/intro',
    msg: "영상, 이미지 누락 제외 완료<br>'231208' 주석 찾아서 수정 요망",
    confirm: '23.12.12'
  },
  {
    div: '홈',
    div2: '',
    div3: '',
    loca: '@/views/publishing/home.vue',
    go: '/publishing/home',
    msg: "완료<br>이용약관 팝업 추가<br>개인정보 처리방침 팝업 추가<br>사이드메뉴 추가, 공유하기 추가<br>이용약관, 개인정보보호방침 추가<br>CheckupPrivacyAgreePopup.vue '231222'주석 찾아 적용 요망",
    confirm: '23.12.12'
  },
  {
    div: '주문/결제',
    div2: '',
    div3: '',
    loca: '@/views/publishing/OrderNpay.vue',
    go: '/publishing/order-pay',
    msg: '완료<br>배송지등록 추가',
    confirm: '23.11.10'
  },
  {
    div: '',
    div2: '상세',
    div3: '',
    loca: '@/views/publishing/orderNpay/OrderNpayDetail.vue',
    go: '/publishing/order-pay/order-pay-detail',
    msg: '완료',
    confirm: '23.11.10'
  },
  {
    div: '가입',
    div2: '사용자 선택',
    div3: '',
    loca: '@/views/publishing/Login.vue',
    go: '/publishing/login/pub-login',
    msg: '완료',
    confirm: '23.12.5'
  },
  {
    div: '',
    div2: '약관 동의',
    div3: '',
    loca: '@/views/publishing/join/JoinTermsAgree.vue',
    go: '/publishing/join/join-terms-agree',
    msg: "완료<br>JoinTermsAgree.vue '231222'검색해서 변경 요망",
    confirm: '23.12.5'
  },
  {
    div: '',
    div2: '휴대폰 인증',
    div3: '',
    loca: '@/views/publishing/join/JoinPhoneCertification.vue',
    go: '/publishing/join/join-phone-certification',
    msg: "완료<br>vue파일 수정, 주석 처리 '231129'<br>변경된 vue 파일 : JoinPhoneCertification.vue, BaseCertificationInput.vue, BasePhoneInput.vue",
    confirm: '23.12.5'
  },
  {
    div: '',
    div2: 'PIN 번호 등록',
    div3: '',
    loca: '@/views/publishing/join/JoinPinRegistration.vue',
    go: '/publishing/join/join-pin-registration',
    msg: "완료<br>vue파일 수정, 주석 처리 '231129'<br>변경된 vue 파일 : BasePinInput.vue",
    confirm: '23.12.5'
  },
  {
    div: '로그인',
    div2: '사용자 선택',
    div3: '',
    loca: '@/views/publishing/Login.vue',
    go: '/publishing/login/pub-login',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '     ',
    div2: 'PIN 번호 입력',
    div3: '',
    loca: '@/views/publishing/login/LoginPin.vue',
    go: '/publishing/login/login-pin',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '설문입력',
    div2: '입력방법 선택',
    div3: '',
    loca: '@/views/publishing/Checkup.vue',
    go: '/publishing/checkup',
    msg: '완료',
    confirm: '23.12.5'
  },
  {
    div: '',
    div2: '민감정보수집 이용동의',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupPrivacyAgree.vue',
    go: '/publishing/checkup/checkup-privacy-agree',
    msg: '완료',
    confirm: '23.12.5'
  },
  {
    div: '',
    div2: '검진일 선택',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupDateSelect.vue',
    go: '/publishing/checkup-input',
    msg: "완료<br>vue파일 수정하여 주석 처리 '231129'",
    confirm: '23.12.5'
  },
  {
    div: '',
    div2: '기본검사',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupBasics.vue',
    go: '/publishing/checkup-input/checkup-basics',
    msg: '완료',
    confirm: '23.11.17'
  },
  {
    div: '',
    div2: '혈액검사',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupBlood.vue',
    go: '/publishing/checkup-input/checkup-blood',
    msg: '완료',
    confirm: '23.11.17'
  },
  {
    div: '',
    div2: '관심 건강분야',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupInterestHealth.vue',
    go: '/publishing/checkup-input/checkup-interest-health',
    msg: '완료',
    confirm: '23.11.17'
  },
  {
    div: '',
    div2: '',
    div3: '기억력',
    loca: '@/views/publishing/checkup/CheckupMemory.vue',
    go: '/publishing/checkup-input/checkup-memory',
    msg: "완료<br>vue파일 수정하여 주석 처리 CheckupMemory.vue '231201'<br>231204 인풋 포커스 처리 때문에 vue파일 수정함 : BaseInput.vue, BaseTimeMinute.vue, Checkup.vue, CheckupBasicsBasic.vue, CheckupBasicsBody.vue, CheckupBloodNonRequire.vue, CheckupDrinkSmokeSleep.vue, 231201 / 231204 설문 전체 변경됨",
    confirm: '23.11.17'
  },
  {
    div: '',
    div2: '',
    div3: '눈',
    loca: '@/views/publishing/checkup/CheckupEye.vue',
    go: '/publishing/checkup-input/checkup-eye',
    msg: '완료',
    confirm: '23.11.17'
  },
  {
    div: '',
    div2: '',
    div3: '코 과민반응',
    loca: '@/views/publishing/checkup/CheckupNoseHypersensitivity.vue',
    go: '/publishing/checkup-input/checkup-nose-hypersensitivity',
    msg: '완료',
    confirm: '23.11.17'
  },
  {
    div: '',
    div2: '',
    div3: '위',
    loca: '@/views/publishing/checkup/CheckupStomach.vue',
    go: '/publishing/checkup-input/checkup-stomach',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '',
    div3: '장',
    loca: '@/views/publishing/checkup/CheckupIntestine.vue',
    go: '/publishing/checkup-input/checkup-intestine',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '',
    div3: '관절, 뼈',
    loca: '@/views/publishing/checkup/CheckupJointAndBone.vue',
    go: '/publishing/checkup-input/checkup-joint-and-bone',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '',
    div3: '면역',
    loca: '@/views/publishing/checkup/CheckupImmunity.vue',
    go: '/publishing/checkup-input/checkup-immunity',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '',
    div3: '갱년기',
    loca: '@/views/publishing/checkup/CheckupMenopause.vue',
    go: '/publishing/checkup-input/checkup-menopause',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '',
    div3: '전립선',
    loca: '@/views/publishing/checkup/CheckupProstate.vue',
    go: '/publishing/checkup-input/checkup-prostate',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '',
    div3: '월경',
    loca: '@/views/publishing/checkup/CheckupMenstrual.vue',
    go: '/publishing/checkup-input/checkup-menstrual',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '삶의 질',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupEq5d.vue',
    go: '/publishing/checkup-input/checkup-eq5d',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '운동 습관',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupPhysicalActivity.vue',
    go: '/publishing/checkup-input/checkup-physical-activity',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '음주, 흡연, 수면',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupDrinkSmokeSleep.vue',
    go: '/publishing/checkup-input/checkup-drink-smoke-sleep',
    msg: "완료<br>'231219'주석 찾아서 수정 요망, 음주/흡연/수면/물섭취 타이틀 쪼갬",
    confirm: '23.11.28'
  },
  {
    div: '',
    div2: '건강설문 완료',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupComplete.vue',
    go: '/publishing/checkup/checkup-complete',
    msg: '완료',
    confirm: '23.11.28'
  },
  {
    div: '분석 결과 이력',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Analyze.vue',
    go: '/publishing/analyze',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '마이웰니스 랩 분석 결과',
    div3: '',
    loca: '@/views/publishing/analyze/AnalyzeDetail.vue',
    go: '/publishing/analyze/analyze-detail',
    msg: "완료<br>231205 주석 찾아 vue 수정 요망<br>전체에서 '231208' 주석 찾아 수정 요망<br>'231211' 주요건강위험요인 검색해서 수정 요망<br>'231219' 주석 찾아 변경 요망",
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: '검진 데이터 이력',
    loca: '@/views/publishing/analyze/AnalyzeCheckupDataRecord.vue',
    go: '/publishing/analyze/analyze-checkup-data-record',
    msg: '완료<br>그래프 리터칭 90 완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: '노화 억제 분석 지수',
    loca: '@/views/publishing/AnalyzeAgingInhibitionAnalyzeIndexDetail.vue',
    go: '/publishing/analyze/analyze-aging-inhibition-analyze-index-detail',
    msg: "완료<br>'231208' 주석 찾아 vue 수정 요망<br>AnalyzeAgingInhibitionAnalyzeIndexDetailPopup.vue: '231212' 수정 요망",
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: '만성질환 억제 분석 지수',
    loca: '@/views/publishing/AnalyzeChronicDiseaseControlAnalyzeIndexDetail.vue',
    go: '/publishing/analyze/analyze-chronic-disease-control-analyze-index-detail',
    msg: "나의 변화 그래프에서 x축 라벨 클릭하면 값 노출 부분 외 완<br>AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup.vue: '231212' 수정 요망",
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: '노화 속도',
    loca: '@/views/publishing/AnalyzeAgingSpeedDetail.vue',
    go: '/publishing/analyze/analyze-aging-speed-detail',
    msg: "나의 변화 그래프에서 x축 라벨 클릭하면 값 노출 부분 외 완<br>AnalyzeAgingSpeedDetailPopup.vue: '231212' 수정 요망",
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: '건강 신호등',
    loca: '@/views/publishing/AnalyzeHealthLightDetail.vue',
    go: '/publishing/analyze/analyze-health-light-detail',
    msg: '로그미 그래프 제외 완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: 'ABC 건강 등급',
    loca: '@/views/publishing/AnalyzeABCHealthGradeDetail.vue',
    go: '/publishing/analyze/analyze-abc-health-grade-detail',
    msg: "퍼블 완료<br>AnalyzeABCHealthGrade.vue, AnalyzeABCHealthGradeDetail.vue '231211' 검색해서 수정 요망",
    confirm: '23.12.12'
  },
  {
    div: '마이페이지',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mypage/MyPage.vue',
    go: '/publishing/my-page/pub-my-page',
    msg: "완료<br>MyPage.vue: '231212' 주석 찾아 수정 요망",
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '검진 데이터 이력',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageCheckupDataRecord.vue',
    go: '/publishing/my-page/pub-my-page-checkup-data-record',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '',
    div3: '상세',
    loca: '@/views/publishing/mypage/MyPageCheckupDataRecordDetail.vue',
    go: '/publishing/my-page/pub-my-page-checkup-data-record-detail',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '리포트 인쇄신청 이력',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageReportPrintRecord.vue',
    go: '/publishing/my-page/pub-my-page-report-print-record',
    msg: '완료',
    confirm: '23.12.12'
  },
  // {div: "",                       div2: "휴대폰번호 변경",                      div3: "",                loca: "@/views/publishing/mypage/MyPagePhoneChangePopup.vue",                             go: "/my-page-phone-change",                                        msg: "BasePhoneInput.vue '231212' 주석 수정 요망",                                  confirm: ""},
  {
    div: '기타',
    div2: '쿠폰 보유 현황',
    div3: '',
    loca: '@/views/publishing/etc/CouponStatus.vue',
    go: '/publishing/coupon-status',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '서비스 이용안내',
    div3: '',
    loca: '@/views/publishing/etc/ServiceUseGuide.vue',
    go: '/publishing/coupon-status/service-use-guide',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: 'FAQ',
    div3: '',
    loca: '@/views/publishing/etc/Faq.vue',
    go: '/publishing/coupon-status/pub-faq',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: '점검중',
    div3: '',
    loca: '@/views/publishing/etc/Construction.vue',
    go: '/construction',
    msg: '완료',
    confirm: '23.12.12'
  },
  {
    div: '',
    div2: 'myWellness LAB 소개',
    div3: '',
    loca: '@/views/publishing/etc/Introduce.vue',
    go: '/publishing/coupon-status/introduce',
    msg: '완료',
    confirm: '23.12.12'
  }
])

const data2 = ref([
  {
    div: '로그인',
    div2: '사용자 선택',
    div3: '',
    loca: '@/components/Login.vue',
    go: '/login',
    msg: '코딩 완, 디자인 미적용'
  }
])
function go (val) {
  router.push(val)
}

// onMounted(() => {
//   const shareButton = document.querySelector('#share-button');
//   shareButton.addEventListener('click', async event => {
//
//     const response = await fetch("https://media.amway.co.kr/sys-master/images/h0d/h71/9225432629278/pdf_220215_PF22_business_manual.pdf", {
//       mode : 'no-cors'
//     });
//     const buffer = await response.arrayBuffer();
//
//     const pdf = new File([buffer], "hello.pdf", { type: "application/pdf" });
//     const files = [pdf];
//
//     // Share PDF file if supported.
//     if (navigator.canShare({ files })) await navigator.share({ files });
//   });
// });

</script>

<template>
  <!--  <h1>개발 참조</h1>` `-->

  <!--  <button id="share-button">share-button</button>-->
  <!--  <table class="table">-->
  <!--    <tr>-->
  <!--      <th>분류</th>-->
  <!--      <th>분류2</th>-->
  <!--      <th>분류3</th>-->
  <!--      <th>경로</th>-->
  <!--      <th>비고</th>-->
  <!--    </tr>-->
  <!--    <tr v-for="item in data2">-->
  <!--      <td>{{ item.div }}</td>-->
  <!--      <td>{{ item.div2 }}</td>-->
  <!--      <td>{{ item.div3 }}</td>-->
  <!--      <td><a @click="go(item.go)" href="javascript: void(0);">{{ item.loca }}</a></td>-->
  <!--      <td>{{ item.msg }}</td>-->
  <!--    </tr>-->
  <!--  </table>-->
  <!--  <h1>&nbsp;</h1>-->
  <div class="wrap">
    <h1>퍼블리싱 리스트</h1>
    <table class="table">
      <tr>
        <th>분류</th>
        <th>분류2</th>
        <th>분류3</th>
        <th>경로</th>
        <th>비고</th>
        <th>컨펌일</th>
      </tr>
      <tr v-for="item in data">
        <td>{{ item.div }}</td>
        <td>{{ item.div2 }}</td>
        <td>{{ item.div3 }}</td>
        <td><a @click="go(item.go)" href="javascript: void(0);">{{ item.loca }}</a></td>
        <td v-html="item.msg" />
        <td>{{ item.confirm }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">
.wrap{
  padding: 30px;
}
.table {
  width: fit-content;
  border-top: solid 1px #ddd;
  border-right: solid 1px #ddd;
}
th,
td {
  border-bottom: solid 1px #ddd;
  border-left: solid 1px #ddd;
  padding: 1rem;
}
</style>
