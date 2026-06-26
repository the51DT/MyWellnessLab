<script setup>
import { ref } from 'vue'
import router from '@/router'
// import BasePinInput from "@/views/publishing/BasePinInput.vue";
// import jsPDF from "jspdf";

const data = ref([
  {
    div: '',
    div2: '',
    div3: '',
    loca: '',
    go: '',
    msg: "개발 파일 수정된 부분에 '202606' 포함된 주석 확인 필요",
    confirm: ''
  },
  {
    div: '인트로',
    div2: '',
    div3: '',
    loca: '@/views/Intro.vue',
    go: '/publishing/home/intro',
    msg: "ver 26.06.22 완료",
    confirm: ''
  },
  {
    div: '홈',
    div2: '',
    div3: '',
    loca: '@/views/Home.vue<br>@/views/publishing/home.vue -> 확인용 경로로 이동됨',
    go: '/publishing/home',
    msg: "개발파일 수정 필요",
    confirm: ''
  },
  {
    div: '가입',
    div2: '사용자 선택',
    div3: '',
    loca: '@/views/auth/Profile.vue<br>@/views/publishing/Join.vue -> 확인용 경로로 이동됨',
    go: '/publishing/join/pub-join',
    msg: '로그인 사용자 선택과 동일<br>가입 확인 팝업 확인용 경로에서 노출<br>ver 26.06.22 완료',
    confirm: ''
  },
  {
    div: '',
    div2: '약관 동의',
    div3: '',
    loca: '@/views/auth/TermsAgree.vue<br>@/views/publishing/join/JoinTermsAgree.vue -> 확인용 경로로 이동됨',
    go: '/publishing/join/join-terms-agree',
    msg: "개발파일 `202606` 주석 확인 필요<br>ver 26.06.22 완료",
    confirm: ''
  },
  {
    div: '',
    div2: '휴대폰 인증',
    div3: '',
    loca: '@/views/auth/PhoneCertification.vue',
    go: '/publishing/join/join-phone-certification',
    msg: "ver 26.06.22 완료",
    confirm: ''
  },
  {
    div: '',
    div2: 'PIN 번호 등록',
    div3: '',
    loca: '@/views/auth/PinRegistration.vue<br>@/views/publishing/join/JoinPinRegistration.vue -> 확인용 경로로 이동됨',
    go: '/publishing/join/join-pin-registration',
    msg: "'202606' 주석 개발파일 적용 필요<br>ver 26.06.22 완료",
    confirm: ''
  },
  {
    div: '로그인',
    div2: '사용자 선택',
    div3: '',
    loca: '@/views/auth/Profile.vue<br>@/views/publishing/Login.vue -> 확인용 경로로 이동됨',
    go: '/publishing/login/pub-login',
    msg: 'ver 26.06.22 완료',
    confirm: ''
  },
  {
    div: '     ',
    div2: 'PIN 번호 입력',
    div3: '',
    loca: '@/views/auth/Pin.vue<br>@/views/publishing/login/LoginPin.vue -> 확인용 경로로 이동됨',
    go: '/publishing/login/login-pin',
    msg: "'202606' 주석 개발파일 적용 필요<br>ver 26.06.22 완료",
    confirm: ''
  },
  {
    div: '',
    div2: '팀가입 URL 접속 팝업',
    div3: '',
    loca: '@/views/publishing/login/TeamAgree.vue',
    go: '/publishing/login/team-agree',
    msg: '신규제작<br>ver 26.06.22 완료',
    confirm: ''
  },
  {
    div: '설문입력',
    div2: '입력방법 선택',
    div3: '',
    loca: '@/views/publishing/Checkup.vue',
    go: '/publishing/checkup',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '민감정보수집 이용동의',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupPrivacyAgree.vue',
    go: '/publishing/checkup/checkup-privacy-agree',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '검진일 선택',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupDateSelect.vue',
    go: '/publishing/checkup-input',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '기본검사',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupBasics.vue',
    go: '/publishing/checkup-input/checkup-basics',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '혈액검사',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupBlood.vue',
    go: '/publishing/checkup-input/checkup-blood',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '관심 건강분야',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupInterestHealth.vue',
    go: '/publishing/checkup-input/checkup-interest-health',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '기억력',
    loca: '@/views/publishing/checkup/CheckupMemory.vue',
    go: '/publishing/checkup-input/checkup-memory',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '눈',
    loca: '@/views/publishing/checkup/CheckupEye.vue',
    go: '/publishing/checkup-input/checkup-eye',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '코 과민반응',
    loca: '@/views/publishing/checkup/CheckupNoseHypersensitivity.vue',
    go: '/publishing/checkup-input/checkup-nose-hypersensitivity',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '위',
    loca: '@/views/publishing/checkup/CheckupStomach.vue',
    go: '/publishing/checkup-input/checkup-stomach',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '장',
    loca: '@/views/publishing/checkup/CheckupIntestine.vue',
    go: '/publishing/checkup-input/checkup-intestine',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '관절, 뼈',
    loca: '@/views/publishing/checkup/CheckupJointAndBone.vue',
    go: '/publishing/checkup-input/checkup-joint-and-bone',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '면역',
    loca: '@/views/publishing/checkup/CheckupImmunity.vue',
    go: '/publishing/checkup-input/checkup-immunity',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '갱년기',
    loca: '@/views/publishing/checkup/CheckupMenopause.vue',
    go: '/publishing/checkup-input/checkup-menopause',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '전립선',
    loca: '@/views/publishing/checkup/CheckupProstate.vue',
    go: '/publishing/checkup-input/checkup-prostate',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '월경',
    loca: '@/views/publishing/checkup/CheckupMenstrual.vue',
    go: '/publishing/checkup-input/checkup-menstrual',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '삶의 질',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupEq5d.vue',
    go: '/publishing/checkup-input/checkup-eq5d',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '운동 습관',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupPhysicalActivity.vue',
    go: '/publishing/checkup-input/checkup-physical-activity',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '음주, 흡연, 수면',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupDrinkSmokeSleep.vue',
    go: '/publishing/checkup-input/checkup-drink-smoke-sleep',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '건강설문 완료',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupComplete.vue',
    go: '/publishing/checkup/checkup-complete',
    msg: '',
    confirm: ''
  },
  {
    div: '분석 결과 이력',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Analyze.vue',
    go: '/publishing/analyze',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '마이웰니스 랩 분석 결과',
    div3: '',
    loca: '@/views/publishing/analyze/AnalyzeDetail.vue',
    go: '/publishing/analyze/analyze-detail',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '검진 데이터 이력',
    loca: '@/views/publishing/analyze/AnalyzeCheckupDataRecord.vue',
    go: '/publishing/analyze/analyze-checkup-data-record',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '노화 억제 분석 지수',
    loca: '@/views/publishing/AnalyzeAgingInhibitionAnalyzeIndexDetail.vue',
    go: '/publishing/analyze/analyze-aging-inhibition-analyze-index-detail',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '만성질환 억제 분석 지수',
    loca: '@/views/publishing/AnalyzeChronicDiseaseControlAnalyzeIndexDetail.vue',
    go: '/publishing/analyze/analyze-chronic-disease-control-analyze-index-detail',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '노화 속도',
    loca: '@/views/publishing/AnalyzeAgingSpeedDetail.vue',
    go: '/publishing/analyze/analyze-aging-speed-detail',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '건강 신호등',
    loca: '@/views/publishing/AnalyzeHealthLightDetail.vue',
    go: '/publishing/analyze/analyze-health-light-detail',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: 'ABC 건강 등급',
    loca: '@/views/publishing/AnalyzeABCHealthGradeDetail.vue',
    go: '/publishing/analyze/analyze-abc-health-grade-detail',
    msg: "",
    confirm: ''
  },
  {
    div: '마이페이지',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mypage/MyPage.vue',
    go: '/publishing/my-page/pub-my-page',
    msg: "",
    confirm: ''
  },
  {
    div: '',
    div2: '검진 데이터 이력',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageCheckupDataRecord.vue',
    go: '/publishing/my-page/pub-my-page-checkup-data-record',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '',
    div3: '상세',
    loca: '@/views/publishing/mypage/MyPageCheckupDataRecordDetail.vue',
    go: '/publishing/my-page/pub-my-page-checkup-data-record-detail',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '리포트 인쇄신청 이력',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageReportPrintRecord.vue',
    go: '/publishing/my-page/pub-my-page-report-print-record',
    msg: '',
    confirm: ''
  },
  // {div: "",                       div2: "휴대폰번호 변경",                      div3: "",                loca: "@/views/publishing/mypage/MyPagePhoneChangePopup.vue",                             go: "/my-page-phone-change",                                        msg: "BasePhoneInput.vue '231212' 주석 수정 요망",                                  confirm: ""},
  {
    div: '주문/결제',
    div2: '',
    div3: '',
    loca: '@/views/publishing/OrderNpay.vue',
    go: '/publishing/order-pay',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '상세',
    div3: '',
    loca: '@/views/publishing/orderNpay/OrderNpayDetail.vue',
    go: '/publishing/order-pay/order-pay-detail',
    msg: '',
    confirm: ''
  },
  {
    div: '기타',
    div2: '쿠폰 보유 현황',
    div3: '',
    loca: '@/views/publishing/etc/CouponStatus.vue',
    go: '/publishing/coupon-status',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '서비스 이용안내',
    div3: '',
    loca: '@/views/publishing/etc/ServiceUseGuide.vue',
    go: '/publishing/coupon-status/service-use-guide',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: 'FAQ',
    div3: '',
    loca: '@/views/publishing/etc/Faq.vue',
    go: '/publishing/coupon-status/pub-faq',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: '점검중',
    div3: '',
    loca: '@/views/publishing/etc/Construction.vue',
    go: '/construction',
    msg: '',
    confirm: ''
  },
  {
    div: '',
    div2: 'myWellness LAB 소개',
    div3: '',
    loca: '@/views/publishing/etc/Introduce.vue',
    go: '/publishing/coupon-status/introduce',
    msg: '',
    confirm: ''
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
        <td><a @click="go(item.go)" href="javascript: void(0);" v-html="item.loca"></a></td>
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
