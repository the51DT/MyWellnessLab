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
    msg: "개발 파일 수정된 부분 '202606' 주석으로 표시, 해당 날짜 포함된 주석 확인 필요",
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
    msg: "가입 화면 이동 얼럿 App.vue에 위치<br>퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.06 퍼블 완료'
  },
  {
    div: '로그인 후',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Main.vue',
    go: '/publishing/main',
    msg: "**기존 home 내용이 건강수명분석으로 옮겨져 새로운 홈은 main으로 제작**<br>퍼블 확인용 라우터 케이스 적용<br>260721 / mission-select 내부 구조 수정<br>260721 / 플로팅 탭 전환 핸들러 추가<br>260727 인증방법 선택 사진 찍기 디바이스 체크 후 노출되게 수정<br>260727 미션 주의사항 추가",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '핀/배지 달성',
    div3: '',
    loca: '@/views/publishing/Main.vue',
    go: '/publishing/main/badge',
    msg: "퍼블 확인용 라우터 케이스 적용<br>2026.07.21 퍼블 확인 불가능해 따로 페이지 추가<br>260727 핀/배지 팝업 상단 x 버튼 추가 - src/views/publishing/BasePopupBadge.vue",
    confirm: '2026.07.27 퍼블 수정'
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
    msg: '퍼블 확인용 라우터 생성<br>사용 시 popupClose emit 필요',
    confirm: '2026.07.06 퍼블 완료'
  },
  { cate: 'blank'},
  {
    cate: '건강수명분석',
    div: '분석 전',
    div2: '',
    div3: '',
    loca: '@/views/Home.vue<br>@/views/publishing/Home.vue -> 퍼블 확인용 경로',
    go: '/publishing/home/before',
    msg: '**기존 home 내용이 건강수명분석으로 옮겨져 새로운 홈은 main으로 제작**',
    confirm: ''
  },
  {
    cate: '',
    div: '분석 후',
    div2: '',
    div3: '',
    loca: '@/views/Home.vue<br>@/views/publishing/Home.vue -> 퍼블 확인용 경로',
    go: '/publishing/home',
    msg: '**기존 home 내용이 건강수명분석으로 옮겨져 새로운 홈은 main으로 제작**',
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
  { cate: 'blank'},
  {
    cate: '챌린지',
    div: '챌린지(진행중)',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Challenge.vue',
    go: '/publishing/challenge',
    msg: "(PU) 인증사진 보기, (PU) 챌린지 인증 공유하기 퍼블 확인용으로 넣어둠",
    confirm: '2026.07.09 퍼블 완료'
  },
  {
    div: '챌린지(미진행)',
    div2: '',
    div3: '',
    loca: '@/views/publishing/Challenge.vue',
    go: '/publishing/challenge/no',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.08 퍼블 완료'
  },
  {
    div: '챌린지 이력보기',
    div2: '',
    div3: '',
    loca: '@/views/publishing/challenge/ChallengeHistory.vue',
    go: '/publishing/challenge-history',
    msg: "",
    confirm: '2026.07.08 퍼블 완료'
  },
  {
    div: '챌린지 이력보기 (진행중 없음)',
    div2: '',
    div3: '',
    loca: '@/views/publishing/challenge/ChallengeHistory.vue',
    go: '/publishing/challenge-history/no',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.08 퍼블 완료'
  },
  { cate: 'blank'},
  {
    cate: '나의 팀',
    div: '목록',
    div2: '팀 있는 경우',
    div3: '',
    loca: '@/views/publishing/MyTeam.vue',
    go: '/publishing/my-team',
    msg: "",
    confirm: '2026.07.15 퍼블 완료'
  },
  {
    cate: '',
    div: '',
    div2: '팀 없는 경우',
    div3: '',
    loca: '@/views/publishing/MyTeam.vue',
    go: '/publishing/my-team/no',
    msg: "",
    confirm: '2026.07.14 퍼블 완료'
  },
  {
    div: '팀 만들기',
    div2: '미 선택',
    div3: '',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create',
    msg: "'팀 구분 - 챌린지 인풋', '완료' 버튼 클릭 시 퍼블 확인용으로 팝업 노출<br>260727 회차 진행 안내로 변경<br>260727 회차 기간 수정<br>팀 구분 미선택 시 툴팁 & 팝업 추가 / 팀 관리 진입 시 팀 구분 변경 막기 개발 필요<br>260727 팝업 추가",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '챌린지',
    div3: '',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/challenge',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '챌린지 팀 관리',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/challenge/manage',
    msg: "팀 만들기에서 퍼블 확인용 라우터 관리 케이스 적용함",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '상시',
    div3: '',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/regular',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '상시 팀 관리',
    loca: '@/views/publishing/team/CreateTeam.vue',
    go: '/publishing/my-team/create/regular/manage',
    msg: "팀 만들기에서 퍼블 확인용 라우터 관리 케이스 적용함",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '챌린지',
    div2: '팀 정보',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/challenge/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출<br>260727 src/layouts/LayoutNormalLeader.vue 수정",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/challenge',
    msg: "진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '팀 랭킹',
    div3: '',
    loca: '@/views/publishing/team/TeamRanking.vue',
    go: '/publishing/my-team/ranking/challenge',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.22 퍼블 완료'
  },
  {
    div: '',
    div2: '팀원 현황보기',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/challenge/leader',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.23 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/challenge',
    msg: "",
    confirm: '2026.07.23 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '조회된 팀원 없음,<br>1회차만 있는 경우',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/challenge/no',
    msg: "",
    confirm: '2026.07.23 퍼블 완료'
  },
  {
    div: '',
    div2: '팀원 상세',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/challenge/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>배지 이미지 퍼블 확인용 임의",
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '팀원(대표뱃지 없는 경우)',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/challenge',
    msg: "",
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '상시',
    div2: '팀 정보',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/regular/leader',
    msg: "퍼블 확인용 라우터 케이스 적용<br>진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamInfo.vue',
    go: '/publishing/my-team/info/regular',
    msg: "진행중, 진행대기 등 케이스 페이지 분리하지 않고 전체 노출",
    confirm: '2026.07.27 퍼블 수정'
  },
  {
    div: '',
    div2: '팀 랭킹',
    div3: '',
    loca: '@/views/publishing/team/TeamRanking.vue',
    go: '/publishing/my-team/ranking/regular',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.22 퍼블 완료'
  },
  {
    div: '',
    div2: '팀원 현황보기',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/regular/leader',
    msg: "퍼블 확인용 라우터 케이스 적용",
    confirm: '2026.07.23 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '팀원',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/regular',
    msg: "",
    confirm: '2026.07.23 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '조회된 팀원 없음',
    loca: '@/views/publishing/team/TeamStatus.vue',
    go: '/publishing/my-team/status/regular/no',
    msg: "",
    confirm: '2026.07.23 퍼블 완료'
  },
  {
    div: '',
    div2: '팀원 상세',
    div3: '팀장',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/regular/leader',
    msg: "퍼블 확인용 [팀 내보내기] 버튼 노출",
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '',
    div2: '',
    div3: '팀원(대표뱃지 없는 경우)',
    loca: '@/views/publishing/team/TeamDetail.vue',
    go: '/publishing/my-team/detail/regular',
    msg: "",
    confirm: '2026.07.24 퍼블 완료'
  },
  {
    div: '초대한 팀원 보기',
    div2: '목록',
    div3: '',
    loca: '@/views/publishing/team/TeamInvited.vue',
    go: '/publishing/my-team/invited',
    msg: "",
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
    msg: "퍼블 확인용 라우터 생성<br>사용 시 popupClose emit 필요",
    confirm: '2026.07.16 퍼블 완료'
  },
  { cate: 'blank'},
  {
    cate: '나의 미션 활동',
    div: '',
    div2: '',
    div3: '',
    loca: '@/views/publishing//.vue',
    go: '',
    msg: "",
    confirm: ''
  },
  { cate: 'blank'},
  {
    cate: '더보기',
    div: '사이드바',
    div2: '비로그인',
    div3: '',
    loca: '@/layouts/LayoutHomeDock.vue',
    go: '/publishing/home/intro',
    msg: "페이지 확인 => 인트로로 이동<br>디자인 수정 반영 필요",
    confirm: ''
  },
  {
    cate: '',
    div: '',
    div2: '로그인',
    div3: '',
    loca: '@/layouts/LayoutHomeDock.vue',
    go: '/publishing/main',
    msg: "페이지 확인 => 메인으로 이동<br>디자인 수정 반영 필요",
    confirm: ''
  },
  {
    cate: '',
    div: '공지사항',
    div2: '',
    div3: '',
    loca: '@/layouts/.vue',
    go: '',
    msg: "",
    confirm: ''
  },
  {
    div: '서비스 이용안내',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/ServiceUseGuide.vue',
    go: '/publishing/coupon-status/service-use-guide',
    msg: '',
    confirm: ''
  },
  {
    div: 'FAQ',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/Faq.vue',
    go: '/publishing/coupon-status/pub-faq',
    msg: '',
    confirm: ''
  },
  {
    div: 'myWellness LAB 소개',
    div2: '',
    div3: '',
    loca: '@/views/publishing/etc/Introduce.vue',
    go: '/publishing/coupon-status/introduce',
    msg: '',
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
    msg: "0728 팝업 완료 목록<br>- 휴대폰번호 변경 팝업 = @/views/mypage/MyPagePhoneChangePopup.vue<br>- PIN번호 변경 팝업 = @/views/mypage/MyPagePinChangePopup.vue<br>- 서비스 탈퇴 팝업 (챌린지 팀 팝업 추가) = @/views/mypage/MyPageServiceQuitPopup.vue",
    confirm: '2026.07.28 퍼블 완료'
  },
  {
    div: '건강수명 분석 결과 이력',
    div2: '',
    div3: '',
    loca: '@/views/analyze/Analyze.vue<br>@/views/publishing/Analyze.vue -> 퍼블 확인용 경로',
    go: '/publishing/my-page/pub-my-anlyze',
    msg: '',
    confirm: '2026.07.28 퍼블 완료'
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
    msg: '디자인 대기중',
    confirm: ''
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
</style>
