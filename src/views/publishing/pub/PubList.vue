<script setup>
import { ref } from 'vue'
import router from '@/router'
// import BasePinInput from "@/views/publishing/BasePinInput.vue";
// import jsPDF from "jspdf";

const data = ref([
  {
    cate: '',
    div: '',
    div2: '',
    div3: '',
    loca: '',
    go: '',
    msg: "개발 파일 수정된 부분 '202606' or '2606' 주석으로 표시, 해당 날짜 포함된 주석 확인 필요",
    confirm: ''
  },
  { cate: 'blank'},
  {
    cate: '홈',
    div: '인트로 (로그인 전)',
    div2: '',
    div3: '',
    loca: '@/views/Intro.vue',
    go: '/publishing/home/intro',
    msg: "가입 화면 이동 얼럿 App.vue에 위치<br>퍼블 확인용 라우터 케이스 적용<br>260807 서비스 이용안내 메뉴(비로그인,로그인 모두 노출로 변경) - LayoutHomeSideMenu.vue",
    confirm: '2026.08.07 퍼블 수정'
  },
  {
    div: '로그인 후',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Main.vue',
    go: '/publishing/main',
    msg: "**기존 home 내용이 건강수명분석으로 옮겨져 새로운 홈은 main으로 제작**<br>퍼블 확인용 라우터 케이스 적용<br>260721 / mission-select 내부 구조 수정<br>260721 / 플로팅 탭 전환 핸들러 추가<br>260727 인증방법 선택 사진 찍기 디바이스 체크 후 노출되게 수정<br>260727 미션 주의사항 추가<br>260818 홈 추가 버튼 수정<br>260819 tit 내부 버튼 추가<br>260820 문구 수정<br>260821 문구 수정<br>AddBtnHomeRound.vue 260826 기본값 노출로 수정, 260826 버튼 음영 추가<br>260827 문구 수정<br>260827 지정 미션 챌린지 변경 불가 팝업 추가 / 주석 풀고 사용<br>260901 문구 수정<br>260901 미션 데이터 수정",
    confirm: '2026.09.01 퍼블 수정'
  },
  {
    div: '',
    div2: '핀/배지 달성',
    div3: '',
    loca: '@/views/publishing/BasePopupBadge.vue',
    go: '/publishing/main/badge',
    msg: "퍼블 확인용 라우터 케이스 적용<br>2026.07.21 퍼블 확인 불가능해 따로 페이지 추가<br>260727 핀/배지 팝업 상단 x 버튼 추가 - src/views/publishing/BasePopupBadge.vue<br>260824 로티 추가<br>260825 로티 조건문 추가<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    div: '분석권 보유 현황',
    div2: '분석권 없는 경우',
    div3: '',
    loca: '@/views/coupon/CouponList.vue',
    go: '/publishing/coupon-status/none',
    msg: '메뉴 구조 변경으로 홈에서 제외 필요',
    confirm: '2026.07.10 퍼블 완료'
  },
  {
    div: '',
    div2: '분석권 보유 시(퍼블 확인용)',
    div3: '',
    loca: '@/views/coupon/CouponList.vue<br>@/views/publishing/etc/CouponStatus.vue -> 퍼블 확인용 경로',
    go: '/publishing/coupon-status',
    msg: '',
    confirm: '2026.07.10 퍼블 완료'
  },
  { cate: 'blank'},
  {
    cate: '서비스 가입',
    div: '사용자 선택',
    div2: '',
    div3: '',
    loca: '@/views/auth/Profile.vue<br>@/views/publishing/Join.vue -> 퍼블 확인용 경로',
    go: '/publishing/join/pub-join',
    msg: '로그인 사용자 선택과 동일<br>퍼블 확인용으로 팝업 진입 시 노출, 가입하기 선택 시 페이지 확인가능',
    confirm: '2026.07.06 퍼블 완료'
  },
  {
    div: '약관 동의',
    div2: '',
    div3: '',
    loca: '@/views/auth/TermsAgree.vue<br>@/views/publishing/join/JoinTermsAgree.vue -> 퍼블 확인용 경로',
    go: '/publishing/join/join-terms-agree',
    msg: "개발파일 '202606' 주석 확인 필요",
    confirm: '2026.07.06 퍼블 완료'
  },
  {
    div: '휴대폰 인증',
    div2: '',
    div3: '',
    loca: '@/views/auth/PhoneCertification.vue',
    go: '/publishing/join/join-phone-certification',
    msg: "'v-html 로 변경' 주석 확인 필요",
    confirm: '2026.07.06 퍼블 완료'
  },
  {
    div: 'PIN 번호 등록',
    div2: '',
    div3: '',
    loca: '@/views/auth/PinRegistration.vue<br>@/views/publishing/join/JoinPinRegistration.vue -> 퍼블 확인용 경로',
    go: '/publishing/join/join-pin-registration',
    msg: "'202606' 주석 개발파일 적용 필요",
    confirm: '2026.07.06 퍼블 완료'
  },
  { cate: 'blank'},
  {
    cate: '로그인',
    div: '사용자 선택',
    div2: '',
    div3: '',
    loca: '@/views/auth/Profile.vue<br>@/views/publishing/Login.vue -> 퍼블 확인용 경로',
    go: '/publishing/login/pub-login',
    msg: '',
    confirm: '2026.07.06 퍼블 완료'
  },
  {
    div: 'PIN 번호 입력',
    div2: '',
    div3: '',
    loca: '@/views/auth/Pin.vue<br>@/views/publishing/login/LoginPin.vue -> 퍼블 확인용 경로',
    go: '/publishing/login/login-pin',
    msg: "'202606' 주석 개발파일 적용 필요<br>퍼블 임시 PIN 1234",
    confirm: '2026.07.06 퍼블 완료'
  },
  {
    div: '팀가입 URL 접속 팝업',
    div2: '',
    div3: '',
    loca: '@/views/publishing/login/TeamAgree.vue',
    go: '/publishing/login/team-agree',
    msg: '퍼블 확인용 라우터 생성<br>사용 시 popupClose emit 필요<br>260820 문구 수정',
    confirm: '2026.08.20 퍼블 수정'
  },
  { cate: 'blank'},
  {
    cate: '건강수명분석',
    div: '분석 전',
    div2: '',
    div3: '',
    loca: '@/views/Home.vue<br>@/views/publishing/Home.vue -> 퍼블 확인용 경로',
    go: '/publishing/home/before',
    msg: '**기존 home 내용이 건강수명분석으로 옮겨져 새로운 홈은 main으로 제작**<br>퍼블 확인용 라우터 케이스 적용',
    confirm: '2026.08.21 퍼블 완료'
  },
  {
    cate: '',
    div: '분석 후',
    div2: '',
    div3: '',
    loca: '@/views/Home.vue<br>@/views/publishing/Home.vue -> 퍼블 확인용 경로',
    go: '/publishing/home',
    msg: '스와이퍼 체성분 입력 팝업 2-데이터없음, 4-myWellness LAB, 5-바디키<br><br>코드 수정 사항<br>2606 라이브 버전에 맞춰 복약 부분 미노출 - 0818 기획 요청<br>2606 하단 플로팅 버튼 텍스트 수정 - Home.text14, 16 수정으로 인해<br>2606 스타일 수정 - 하단 scoped style 태그 내부 수정<br>2606 swiper 옵션 수정 - .home--my-result<br>2606 분석권 없음 팝업 캡션 클래스 수정 - Home.text18, 19 텍스트 변경 <br>2606 이어하기 확인 팝업 x 버튼 삭제<br><br>AnalyzeAgingSpeed.vue 수정<br>2606 바늘 디자인 수정<br>2606 막대기 디자인 변경으로 인한 공유 팝업 렌더러 변경<br>2606 공유 이미지 캡처 시 배경 화질 보정<br>2606 건강수명분석, 공유팝업 그래프 디자인 수정<br><br>AnalysisSharePopup.vue 수정<br>2606 .AnalysisSummary--desc-user br 추가 / 퍼블 확인용 name 임의 설정<br>2606 그래프 텍스트 삭제<br>2606 .AnalysisSummary--list-num 숫자 띄어쓰기 삭제<br>2606 프리뷰 닫기 버튼 이미지 변경<br><br>src\router\index.js<br>2606 퍼블 확인을 위해 라우터 checkup 페이지 접근 id 확인 주석처리<br><br>BodyCompositionPopup.vue<br>2606 퍼블 확인용 아래 주석이 원본',
    confirm: '2026.08.26 퍼블 완료'
  },
  {
    div: '설문입력',
    div2: '가이드',
    div3: '',
    loca: '@/views/checkupSide/CheckupGuide.vue',
    go: '/publishing/checkup/guide',
    msg: '코드수정<br>라우터에서 wide 클래스 제거 필요<br>2606 퍼블 확인용 아래 주석이 원본 내용',
    confirm: '2026.08.25 퍼블 완료'
  },
  {
    div: '',
    div2: '건강데이터 입력방법 선택',
    div3: '',
    loca: '@/views/checkupSide/Checkup.vue',
    go: '/publishing/checkup',
    msg: '',
    confirm: '2026.08.25 퍼블 완료'
  },
  {
    div: '',
    div2: '민감정보 수집 및 이용',
    div3: '',
    loca: '@/views/checkupSide/CheckupPrivacyAgree.vue',
    go: '/publishing/checkup/checkup-privacy-agree',
    msg: '[PASS] 수단 선택 시 진행가능<br><br>2606 hr 태그 삭제<br>2606 label 밑 내용 감싸는 AnalyzePrivacyAgree--box 추가<br>2606 CheckupPrivacyAgree.text1, 16 (필수/선택) strong 태그 필요<br>2606 개인정보 표 리포트 항목 삭제',
    confirm: '2026.08.26 퍼블 완료'
  },
  {
    div: '',
    div2: '검진일 선택',
    div3: '',
    loca: '@/views/publishing/checkup/CheckupDateSelect.vue',
    go: '/publishing/checkup-input',
    msg: "2606 퍼블 확인위해 api 주석처리<br>2606 퍼블 확인용 아래 주석이 원본<br>2606 하단 버튼 문구 변경<br>2606 이전 버튼 퍼블 확인용 주석처리",
    confirm: '2026.08.26 퍼블 완료'
  },
  {
    div: '',
    div2: '건강검진 (1/4)',
    div3: '기본검사',
    loca: '@/views/checkup/basics/CheckupBasics.vue',
    go: '/publishing/checkup-input/checkup-basics',
    msg: '민감정보 수집 및 이용 페이지에서 진입 시 국민건강보험공단 케이스<br>home 분석 후에서 일회성으로 진입 시 일회성 케이스<br>"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요<br><br>Message.vue 2606 스타일 내용 수정',
    confirm: '2606.08.27 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '혈액검사',
    loca: '@/views/checkup/blood/CheckupBlood.vue',
    go: '/publishing/checkup-input/checkup-blood',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2606.08.27 퍼블 완료'
  },
  {
    div: '',
    div2: '체성분 (2/4)',
    div3: '',
    loca: '@/views/checkup/body/CheckupBodyGuide.vue',
    go: '/publishing/checkup-input/checkup-body-guide',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '체성분 데이터 입력',
    loca: '@/views/checkup/body/CheckupBody.vue',
    go: '/publishing/checkup-input/checkup-body',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '체성분 데이터 입력(목록 없음)',
    loca: '@/views/checkup/body/CheckupBody.vue',
    go: '/publishing/checkup-input/checkup-body-not',
    msg: '퍼블 확인용 라우터 적용',
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: 'myWellness LAB 측정 결과 상세',
    loca: '@/views/checkup/body/CheckupBodyDirectInput.vue',
    go: '/publishing/checkup-input/checkup-body-direct-input',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '바디키에서 가져오기',
    loca: '@/views/checkup/body/CheckupBodyKeyLogin.vue',
    go: '/publishing/checkup-input/checkup-body-key-login',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '바디키에서 가져오기 결과',
    loca: '@/views/checkup/body/CheckupBodyKeyDataList.vue',
    go: '/publishing/checkup-input/checkup-body-key-data-list',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '바디키에서 가져오기 결과 없음',
    loca: '@/views/checkup/body/CheckupBodyKeyDataList.vue',
    go: '/publishing/checkup-input/checkup-body-key-data-list-not',
    msg: '퍼블 확인용 라우터 적용',
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: '직접입력',
    loca: '@/views/checkup/body/CheckupBodyDateSelect.vue',
    go: '/publishing/checkup-input/checkup-body-date-select',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '관심 건강 설문 (3/4)',
    div3: '관심 건강분야',
    loca: '@/views/checkup/interests/CheckupInterestHealth.vue',
    go: '/publishing/checkup-input/checkup-interest-health',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '기억력',
    loca: '@/views/checkup/memory/CheckupMemory.vue',
    go: '/publishing/checkup-input/checkup-memory',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요",
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '눈',
    loca: '@/views/checkup/eye/CheckupEye.vue',
    go: '/publishing/checkup-input/checkup-eye',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '코 과민반응',
    loca: '@/views/checkup/nose/CheckupNoseHypersensitivity.vue',
    go: '/publishing/checkup-input/checkup-nose-hypersensitivity',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '위',
    loca: '@/views/checkup/stomach/CheckupStomach.vue',
    go: '/publishing/checkup-input/checkup-stomach',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '장',
    loca: '@/views/checkup/intestine/CheckupIntestine.vue',
    go: '/publishing/checkup-input/checkup-intestine',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '관절, 뼈',
    loca: '@/views/checkup/joint-bone/CheckupJointAndBone.vue',
    go: '/publishing/checkup-input/checkup-joint-and-bone',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '면역',
    loca: '@/views/checkup/immunity/CheckupImmunity.vue',
    go: '/publishing/checkup-input/checkup-immunity',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '갱년기',
    loca: '@/views/checkup/menopause/CheckupMenopause.vue',
    go: '/publishing/checkup-input/checkup-menopause',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '전립선',
    loca: '@/views/checkup/prostate/CheckupProstate.vue',
    go: '/publishing/checkup-input/checkup-prostate',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '월경',
    loca: '@/views/checkup/menstrual/CheckupMenstrual.vue',
    go: '/publishing/checkup-input/checkup-menstrual',
    msg: '',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '관심 건강 설문 (4/4)',
    div3: '복약',
    loca: '@/views/checkup/medication/CheckupMedication.vue',
    go: '/publishing/checkup-input/checkup-medication',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '식사',
    loca: '@/views/checkup/diet/CheckupDiet.vue',
    go: '/publishing/checkup-input/checkup-diet',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '수면',
    loca: '@/views/checkup/sleep/CheckupSleep.vue',
    go: '/publishing/checkup-input/checkup-sleep',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '운동',
    loca: '@/views/checkup/physical/CheckupPhysicalActivity.vue',
    go: '/publishing/checkup-input/checkup-physical',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '음주, 흡연, 물 섭취',
    loca: '@/views/checkup/drink-smoke-sleep/CheckupDrinkSmokeSleep.vue',
    go: '/publishing/checkup-input/checkup-drink-smoke-sleep',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '삶의 질',
    loca: '@/views/checkup/life/CheckupEq5d.vue',
    go: '/publishing/checkup-input/checkup-life',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.28 퍼블 완료'
  },
  {
    div: '',
    div2: '건강설문 완료',
    div3: '',
    loca: '@/views/checkupSide/CheckupComplete.vue',
    go: '/publishing/checkup/checkup-complete',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2026.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '분석권 없음',
    loca: '@/views/checkupSide/CheckupComplete.vue',
    go: '/publishing/checkup/checkup-complete-not',
    msg: '퍼블 확인용 라우터 케이스 적용',
    confirm: '"'
  },
  {
    div: '건강수명 분석 결과 이력',
    div2: '',
    div3: '',
    loca: '@/views/analyze/Analyze.vue<br>@/views/publishing/Analyze.vue -> 퍼블 확인용',
    go: '/publishing/analyze',
    msg: '코드 수정 (퍼블파일 확인)<br>설문 삭제 팝업 - BasePopup 퍼블 확인용 데이터 추가<br>삭제 완료 팝업 BaseToast 토스트 팝업으로 변경 (퍼블파일 확인)<br>winWidth() 사이즈 체크 920 -> 960<br>.AnalyzeList--ing-checkup 문구 수정 (검진일:date) -> 검진일date<br>.AnalyzeList--complete-total 데이터 없을 시 미노출<br>.AnalyzeList--complete-btn 퍼블 확인용 경로 지정됨<br>260821 문구 수정 (퍼블 파일만)',
    confirm: '2026.08.21 퍼블 수정'
  },
  {
    div: '',
    div2: '마이웰니스 랩 분석 결과',
    div3: '',
    loca: '@/views/analyze/detail/AnalyzeDetail.vue<br>@/views/publishing/analyze/AnalyzeDetail.vue -> 퍼블 확인용',
    go: '/publishing/analyze/analyze-detail',
    msg: "코드 수정<br>2606 ispc 기준점 수정<br>2606 스타일 태그 내용 수정<br>2606 나의 추천 미션 보기 버튼 추가 - 신규 버튼<br> 2606 복약 정보 있는 경우 텍스트 변경<br>**노화속도 [자세히 보기], 인체 생리 네트워크 [자세히 보기, 영향을 준 요인] 클릭 시 나오는 페이지 아래 리스트에서 확인 필요**<br><br>LayoutAnalyze.vue<br>2026 퍼블 확인용 헤더 홈 버튼 아래 주석 원본 - 개발 삭제 필요<br><br>AnalyzeCheckupData.vue<br>2606 라이브 버전에 맞춰서 안내 문구 삭제<br>2606 분석일 ':' 삭제<br><br>Wellness3DChart.vue<br>2606 스타일 태그 내용 수정<br>2606 차트 내부 스타일 수정용 변수<br>2606 차트 내부 마커 스타일 수정<br><br>AnalyzeScorecomAnalyzeIndex.vue<br>2606 스타일 태그 내용 수정<br>2606 --who 스타일 컬러 변수 추가<br>2606 커스텀 툴팁 꼬리 위치 수정<br><br>AnalyzeDietDetailGuide.vue, AnalyzeExerciseDetailGuide.vue, AnalyzeSleepDetailGuide.vue<br>'2606 퍼블 확인용' 들어간 주석 내용 개발 시 삭제 필요<br>2606 .AnalyzeExerciseDetailGuide-con-desc 내부 span 태그 텍스트 추가<br><br>AnalyzeScorecomAnalyzeIndex.vue<br>'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br><br>AnalyzeAgingSpeedPopGraph.vue<br>2606 라이브 버전에 맞춰 복약 부분 미노출",
    confirm: '2026.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '노화 속도(자세히 보기)',
    loca: '@/views/analyze/AnalyzeAgingSpeedDetail.vue',
    go: '/publishing/analyze/analyze-aging-speed-detail',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br>2606 라이브 버전에 맞춰 복약 부분 미노출<br>2606 스타일 태그 내용 수정<br><br>AnalyzeAgingSpeedDetailPopup.vue<br>2606 popup--wrap 이중 클래스 tit -> close 로 변경<br>2606 스타일 태그 내부 수정",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '노화 억제 분석 지수',
    loca: '@/views/analyze/AnalyzeScorecomAnalyzeIndexDetail.vue',
    go: '/publishing/analyze/analyze-aging-inhibition-analyze-index-detail',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br>2606 스타일 태그 내부 수정<br><br>AnalyzeScorecomAnalyzeIndexDetailPopup.vue<br>2606 popup--wrap 이중 클래스 tit -> close 로 변경<br>2606 스타일 태그 내부 수정",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '만성질환 억제 분석 지수',
    loca: '@/views/analyze/AnalyzeScorecomAnalyzeIndexDetail.vue',
    go: '/publishing/analyze/analyze-chronic-disease-control-analyze-index-detail',
    msg: "노화 억제 분석 지수와 같은 파일 사용중",
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: '근육 밸런스 분석 지수',
    loca: '@/views/analyze/AnalyzeMuscleBalanceDetail.vue',
    go: '/publishing/analyze/analyze-muscle-balance',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br>2606 라이브 버전에 맞춰 복약 부분 미노출<br>2606 스타일 태그 내용 수정<br><br>AnalyzeMuscleBalanceDetailPopup.vue<br>'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br>2606 스타일 태그 내용 수정<br>",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '식사',
    loca: '@/views/analyze/AnalyzeDietDetail.vue',
    go: '/publishing/analyze/analyze-diet',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '운동',
    loca: '@/views/analyze/AnalyzeExerciseDetail.vue',
    go: '/publishing/analyze/analyze-exercise',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '수면',
    loca: '@/views/analyze/AnalyzeSleepDetail.vue',
    go: '/publishing/analyze/analyze-sleep',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '나의 인체 생리 네트워크(자세히 보기)',
    loca: '@/views/analyze/AnalyzeHealthLightDetail.vue',
    go: '/publishing/analyze/analyze-health-light',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br><br>graphChart.vue<br>'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요<br>2606 스타일 태그 내부 수정<br>2606 이미지 src 수정",
    confirm: '2606.09.01 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '나의 인체 생리 네트워크(영향을 준 요인)',
    loca: '@/views/analyze/components/analyzeMajorHealthRisk/AnalyzeMajorHealthRisk.vue',
    go: '/publishing/analyze/major-health-risk',
    msg: "'2606 퍼블 확인용'으로 시작하는 주석확인 후 개발 시 제거 필요",
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '검진 데이터 이력',
    loca: '@/views/analyze/components/AnalyzeCheckupDataRecord.vue',
    go: '/publishing/analyze/analyze-checkup-data-record',
    msg: '"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요<br>2606 라이브 버전에 맞춰 복약 부분 미노출<br>2606 스타일 내용 삭제<br><br>AnalyzeCheckupDataRecordChart.vue<br>"2606 퍼블 확인용"으로 시작하는 주석확인 후 개발 시 제거 필요',
    confirm: '2606.08.31 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: 'ABC 건강 등급',
    loca: '@/views/publishing/AnalyzeABCHealthGradeDetail.vue',
    go: '/publishing/analyze/analyze-abc-health-grade-detail',
    msg: "미사용",
    confirm: ''
  },
  { cate: 'blank'},
  {
    cate: '챌린지',
    div: '챌린지(진행중)',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Challenge.vue',
    go: '/publishing/challenge',
    msg: "(PU) 인증사진 보기, (PU) 챌린지 인증 공유하기 퍼블 확인용으로 넣어둠<br>260820 문구 수정<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    div: '챌린지(미진행)',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Challenge.vue',
    go: '/publishing/challenge/no',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '"'
  },
  {
    div: '챌린지 이력보기',
    div2: '',
    div3: '',
    loca: '@/views/publishing/challenge/ChallengeHistory.vue',
    go: '/publishing/challenge-history',
    msg: "260807 이미지 변경<br>260824 문구 수정<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    div: '챌린지 이력보기 (진행중 없음)',
    div2: '',
    div3: '',
    loca: '@/views/publishing/challenge/ChallengeHistory.vue',
    go: '/publishing/challenge-history/no',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '"'
  },
  { cate: 'blank'},
  {
    cate: '나의 팀',
    div: '목록',
    div2: '팀 있는 경우',
    div3: '',
    loca: '@/views/publishing/MyTeam.vue',
    go: '/publishing/my-team',
    msg: "260807 이미지 변경<br>260820 문구 수정<br>260820 .team--card-info 내부구조 수정<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    cate: '',
    div: '',
    div2: '팀 없는 경우',
    div3: '',
    loca: '@/views/publishing/MyTeam.vue',
    go: '/publishing/my-team/no',
    msg: "",
    confirm: '"'
  },
  {
    div: '팀 만들기',
    div2: '미 선택',
    div3: '',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create',
    msg: "'팀 구분 - 챌린지 인풋', '완료' 버튼 클릭 시 퍼블 확인용으로 팝업 노출<br>260727 회차 진행 안내로 변경<br>260727 회차 기간 수정<br>팀 구분 미선택 시 툴팁 & 팝업 추가 / 팀 관리 진입 시 팀 구분 변경 막기 개발 필요<br>260727 팝업 추가<br>260820 문구 수정 / 챌린지 자율 미션 케이스 추가<br>260826 팀 유형 팀 관리 진입 시 비활성화<br>260827 문구 수정",
    confirm: '2026.08.26 퍼블 수정'
  },
  {
    div: '',
    div2: '챌린지',
    div3: '',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/challenge',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: '챌린지 팀 관리',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/challenge/manage',
    msg: "팀 만들기에서 퍼블 확인용 라우터 관리 케이스 적용함",
    confirm: '"'
  },
  {
    div: '',
    div2: '상시',
    div3: '',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/regular',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: '상시 팀 관리',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/regular/manage',
    msg: "팀 만들기에서 퍼블 확인용 라우터 관리 케이스 적용함",
    confirm: '"'
  },
  {
    div: '챌린지',
    div2: '팀 정보',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/challenge/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출<br>260727 src/layouts/LayoutNormalLeader.vue 수정<br>260820 문구 수정 / + LayoutNormalLeader.vue<br>260824 참여 인원 추가",
    confirm: '2026.08.24 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/challenge',
    msg: "진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출",
    confirm: '"'
  },
  {
    div: '',
    div2: '팀 랭킹',
    div3: '',
    loca: '@/views/publishing/team/TeamRanking.vue',
    go: '/publishing/my-team/ranking/challenge',
    msg: "퍼블 확인용 라우터 케이스 적용<br>260820 문구 수정<br>260820 퍼블 확인용 프로필 이미지 경로 수정",
    confirm: '2026.08.20 퍼블 수정'
  },
  {
    div: '',
    div2: '팀원 현황보기',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/challenge/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>260820 문구 수정 / .team-status--info 내부 수정<br>260820 퍼블 확인용 프로필 이미지 경로 수정",
    confirm: '2026.08.20 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/challenge',
    msg: "",
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: '조회된 팀원 없음,<br>1회차만 있는 경우',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/challenge/no',
    msg: "",
    confirm: '"'
  },
  {
    div: '',
    div2: '팀원 상세',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/challenge/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>배지 이미지 퍼블 확인용 임의<br>260820 문구 수정<br>260820 퍼블 확인용 프로필 이미지 경로 수정<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원(대표뱃지 없는 경우)',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/challenge',
    msg: "",
    confirm: '"'
  },
  {
    div: '상시',
    div2: '팀 정보',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/regular/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출<br>챌린지 팀 정보 주석 참고",
    confirm: '2026.08.20 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/regular',
    msg: "진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출",
    confirm: '"'
  },
  {
    div: '',
    div2: '팀 랭킹',
    div3: '',
    loca: '@/views/publishing/team/TeamRanking.vue',
    go: '/publishing/my-team/ranking/regular',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.08.20 퍼블 수정'
  },
  {
    div: '',
    div2: '팀원 현황보기',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/regular/leader',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.08.20 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/regular',
    msg: "",
    confirm: '"'
  },
  {
    div: '',
    div2: '',
    div3: '조회된 팀원 없음',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/regular/no',
    msg: "",
    confirm: '"'
  },
  {
    div: '',
    div2: '팀원 상세',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/regular/leader',
    msg: "퍼블 확인용 [팀 내보내기] 버튼 노출<br>260820 문구 수정",
    confirm: '2026.08.20 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원(대표뱃지 없는 경우)',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/regular',
    msg: "",
    confirm: '"'
  },
  {
    div: '초대한 팀원 보기',
    div2: '목록',
    div3: '',
    loca: '@/views/publishing/team/TeamInvited.vue',
    go: '/publishing/my-team/invited',
    msg: "260820 퍼블 확인용 프로필 이미지 경로 수정",
    confirm: '2026.07.16 퍼블 완료'
  },
  {
    div: '',
    div2: '없는 경우',
    div3: '',
    loca: '@/views/publishing/team/TeamInvited.vue',
    go: '/publishing/my-team/invited/not',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.16 퍼블 완료'
  },
  {
    div: '(PU) 팀 초대하기,<br>(PU) 이전 팀의 팀원 초대하기',
    div2: '',
    div3: '',
    loca: '@/views/publishing/team/TeamInvitePopup.vue',
    go: '/publishing/my-team/invite',
    msg: "퍼블 확인용 라우터 생성<br>사용 시 popupClose emit 필요<br>260820 문구 수정",
    confirm: '2026.08.20 퍼블 수정'
  },
  { cate: 'blank'},
  {
    cate: '나의 미션 활동',
    div: '',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mission/MyMissionActivity.vue',
    go: '/publishing/my-mission/MyMissionActivity',
    msg: "핀/배지 이미지 확정X - 확정 시 수정<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    cate: '',
    div: '이전 기록',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mission/MyMissionPrevious.vue',
    go: '/publishing/my-mission/MyMissionPrevious',
    msg: "",
    confirm: '2026.08.19 퍼블 완료'
  },
  {
    cate: '',
    div: '',
    div2: '데이터 없는 경우',
    div3: '',
    loca: '@/views/publishing/mission/MyMissionNoData.vue',
    go: '/publishing/my-mission/MyMissionNoData',
    msg: "",
    confirm: '2026.08.18 퍼블 완료'
  },
  {
    cate: '',
    div: '미션별 누적 인증 기록',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mission/MyMissionRecords.vue',
    go: '/publishing/my-mission/MyMissionRecords',
    msg: "260820 배지 아이콘 클래스 정리 주석 추가",
    confirm: '2026.08.19 퍼블 완료'
  },
  { cate: 'blank'},
  {
    cate: '더보기',
    div: '사이드바',
    div2: '비로그인',
    div3: '',
    loca: '@/layouts/LayoutHomeDock.vue',
    go: '/publishing/home/intro',
    msg: "페이지 확인 => 인트로로 이동",
    confirm: '2026.07.30 퍼블 완료'
  },
  {
    cate: '',
    div: '',
    div2: '로그인',
    div3: '',
    loca: '@/layouts/LayoutHomeDock.vue',
    go: '/publishing/main',
    msg: "페이지 확인 => 메인으로 이동",
    confirm: '2026.07.30 퍼블 완료'
  },
  {
    cate: '',
    div: '공지사항',
    div2: '리스트',
    div3: '',
    loca: '@/views/publishing/etc/NoticeList.vue',
    go: '/publishing/coupon-status/pub-noti-list',
    msg: "",
    confirm: '2026.07.31 퍼블 완료'
  },
  {
    cate: '',
    div: '',
    div2: '상세',
    div3: '',
    loca: '@/views/publishing/etc/NoticeDetail.vue',
    go: '/publishing/coupon-status/pub-noti-detail',
    msg: "",
    confirm: '2026.07.31 퍼블 완료'
  },
  {
    div: '서비스 이용안내',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/ServiceUseGuide.vue',
    go: '/publishing/coupon-status/service-use-guide',
    msg: '수급대기',
    confirm: ''
  },
  {
    div: 'FAQ',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/Faq.vue',
    go: '/publishing/coupon-status/pub-faq',
    msg: '',
    confirm: '2026.07.30 퍼블 완료'
  },
  {
    div: 'myWellness LAB 소개',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/Introduce.vue',
    go: '/publishing/coupon-status/introduce',
    msg: '수급대기',
    confirm: ''
  },
  { cate: 'blank'},
  {
    cate: 'ETC',
    div: '점검중',
    div2: '',
    div3: '',
    loca: '@/views/Construction.vue',
    go: '/publishing/construction',
    msg: '',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '에러',
    div2: '',
    div3: '', 
    loca: '@/views/NotFound.vue<br>@/views/publishing/etc/Construction.vue -> 퍼블 확인용 경로',
    go: '/publishing/error',
    msg: '500 error 주석처리',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    cate: '',
    div: '로딩',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/Spinner.vue',
    go: '/publishing/loading',
    msg: '일반 로딩 주석처리',
    confirm: '2026.07.29 퍼블 완료'
  },  
  { cate: 'blank'},
  {
    cate: '마이페이지',
    div: '마이페이지',
    div2: '',
    div3: '',
    loca: '@/views/mypage/MyPage.vue<br>@/views/publishing/MyPage.vue -> 퍼블 확인용 경로',
    go: '/publishing/my-page',
    msg: "0728 팝업 완료 목록<br>- 휴대폰번호 변경 팝업 = @/views/mypage/MyPagePhoneChangePopup.vue<br>- PIN번호 변경 팝업 = @/views/mypage/MyPagePinChangePopup.vue<br>- 서비스 탈퇴 팝업 (챌린지 팀 팝업 추가) = @/views/mypage/MyPageServiceQuitPopup.vue<br>MyPageServiceQuitPopup.vue / 260820 문구 수정<br>260827 문구 수정",
    confirm: '2026.08.27 퍼블 수정'
  },
  {
    div: '건강수명 분석 결과 이력',
    div2: '',
    div3: '',
    loca: '@/views/analyze/Analyze.vue<br>@/views/publishing/Analyze.vue -> 퍼블 확인용 경로',
    go: '/publishing/my-page/pub-my-anlyze',
    msg: '건강수명 분석 쪽 동일 파일',
    confirm: '2026.08.21 퍼블 수정'
  },
  {
    div: '',
    div2: '데이터 없는 경우',
    div3: '',
    loca: '@/views/analyze/Analyze.vue',
    go: '/publishing/my-page/pub-my-anlyze/not',
    msg: '',
    confirm: '2026.07.28 퍼블 완료'
  },
  {
    div: '챌린지 성공 보상 지급 이력',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageChallengeReward.vue',
    go: '/publishing/my-page/pub-my-challenge-reward',
    msg: '',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '',
    div2: '데이터 없는 경우',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageChallengeReward.vue',
    go: '/publishing/my-page/pub-my-challenge-reward/not',
    msg: '퍼블 확인용 라우터 케이스 적용',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '분석권 사용 이력',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageCouponHistory.vue',
    go: '/publishing/my-page/pub-my-coupon-history',
    msg: '',
    confirm: '2026.07.31 퍼블 완료'
  },
  {
    div: '',
    div2: '데이터 없는 경우',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageCouponHistory.vue',
    go: '/publishing/my-page/pub-my-coupon-history/not',
    msg: '퍼블 확인용 라우터 케이스 적용',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '검진 데이터 이력',
    div2: '',
    div3: '',
    loca: '@/views/mypage/MyPageCheckupDataRecord.vue<br>@/views/publishing/mypage/MyPageCheckupDataRecord.vue -> 퍼블 확인용 경로',
    go: '/publishing/my-page/pub-my-page-checkup-data-record',
    msg: '',
    confirm: '2026.07.28 퍼블 완료'
  },
  {
    div: '',
    div2: '데이터 없는 경우',
    div3: '',
    loca: '@/views/mypage/MyPageCheckupDataRecord.vue',
    go: '/publishing/my-page/pub-my-page-checkup-data-record/not',
    msg: '',
    confirm: '2026.07.28 퍼블 완료'
  },
  {
    div: '',
    div2: '상세',
    div3: '',
    loca: '@/views/mypage/MyPageCheckupDataRecordDetail.vue<br>@/views/publishing/mypage/MyPageCheckupDataRecordDetail.vue -> 퍼블 확인용 경로',
    go: '/publishing/my-page/pub-my-page-checkup-data-record-detail',
    msg: '',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '체성분 데이터 이력',
    div2: '',
    div3: '',
    loca: '@/views/mypage/MyPageBodyCompositionDataRecord.vue<br>@/views/publishing/mypage/MyPageBodyCompositionDataRecord.vue -> 퍼블 확인용',
    go: '/publishing/my-page/pub-my-body',
    msg: '',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '',
    div2: '데이터 없는 경우',
    div3: '',
    loca: '@/views/mypage/MyPageBodyCompositionDataRecord.vue',
    go: '/publishing/my-page/pub-my-body/not',
    msg: '',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: '',
    div2: '상세',
    div3: '',
    loca: '@/views/mypage/MyPageBodyCompositionDataRecordDetail.vue<br>@/views/publishing/mypage/MyPageBodyCompositionDataRecordDetail.vue -> 퍼블 확인용',
    go: '/publishing/my-page/pub-my-body/detail',
    msg: '',
    confirm: '2026.07.29 퍼블 완료'
  },
  {
    div: 'PIN 번호 분실',
    div2: '',
    div3: '',
    loca: '@/views/auth/PinLostModal/src/PinLostModal.vue',
    go: '/publishing/my-page/pin-lost',
    msg: '[PIN 번호 재설정] 클릭 시 나오는 모달<br>휴대폰번호 인증 -> PIN번호 변경 -> PIN 번호 재설정이 완료되었습니다',
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '',
    div2: '(PU) 휴대폰번호 인증',
    div3: '',
    loca: '@/views/auth/PinLostModal/src/PhoneCertification.vue',
    go: '/publishing/my-page/pub-my-page-phone-certification',
    msg: 'PIN 번호 분실에 포함 - 내용 확인용 퍼블 페이지(헤더 다름)',
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '',
    div2: '(PU) PIN번호 변경',
    div3: '',
    loca: '@/views/auth/PinLostModal/src/PinReset.vue',
    go: '/publishing/my-page/pub-my-page-pin-reset',
    msg: 'PIN 번호 분실에 포함 - 내용 확인용 퍼블 페이지(헤더 다름)',
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '리포트 인쇄신청 이력',
    div2: '',
    div3: '',
    loca: '@/views/publishing/mypage/MyPageReportPrintRecord.vue',
    go: '/publishing/my-page/pub-my-page-report-print-record',
    msg: '기존 리스트 파일, 페이지 기획서에 없음',
    confirm: ''
  },
  // {div: "",                       div2: "휴대폰번호 변경",                      div3: "",                loca: "@/views/publishing/mypage/MyPagePhoneChangePopup.vue",                             go: "/my-page-phone-change",                                        msg: "BasePhoneInput.vue '231212' 주석 수정 요망",                                  confirm: ""},
  { cate: 'blank'},
  {
    cate: '주문/결제',
    div: '주문/결제',
    div2: '',
    div3: '',
    loca: '@/views/publishing/OrderNpay.vue',
    go: '/publishing/order-pay',
    msg: '기존 리스트 파일, 페이지 기획서에 없음',
    confirm: ''
  },
  {
    div: '상세',
    div2: '',
    div3: '',
    loca: '@/views/publishing/orderNpay/OrderNpayDetail.vue',
    go: '/publishing/order-pay/order-pay-detail',
    msg: '기존 리스트 파일, 페이지 기획서에 없음',
    confirm: ''
  },
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
  window.open(val, '_blank')
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
    <thead>
      <tr>
        <th>분류</th>
        <th>분류2</th>
        <th>분류3</th>
        <th>분류4</th>
        <th>경로</th>
        <th>비고</th>
        <th>컨펌일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.go" :class="item.cate === 'blank' ? 'colorBg': ''">
        <td v-html="item.cate"></td>
        <td v-html="item.div"></td>
        <td v-html="item.div2"></td>
        <td v-html="item.div3"></td>
        <td>
          <a
            @click="go(item.go)"
            href="javascript:void(0);"
            v-html="item.loca"
          ></a>
        </td>
        <td v-html="item.msg"></td>
        <td>{{ item.confirm }}</td>
      </tr>
    </tbody>
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
.colorBg td{
  color: transparent;
  background-color: #f7f7f7;
  padding: 0;
  font-size: 1.4rem;
}
a{
  color: #1DB196;
}
</style>
