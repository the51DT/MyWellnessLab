import LayoutOrderNpay from '@/layouts/LayoutOrderNpay.vue'
import LayoutNormal from '@/layouts/LayoutNormal.vue'
import LayoutCheckup from '@/layouts/LayoutCheckup.vue'
import LayoutHome from '@/layouts/LayoutHome.vue'

const publishingRouter = {
  path: '/publishing',
  name: 'Publishing',
  children: [
    {
      path: '', /* 기타 */
      name: 'pubList',
      component: () => import('@/views/publishing/Pub.vue')
    },
    {
      path: 'home', /* 홈 */
      component: LayoutHome, /* 홈, 인트로, 설문 제외한 레이아웃 */
      children: [
        {
          path: '',
          name: 'pubHome',
          component: () => import('@/views/publishing/Home.vue'),
          meta: {
            title: '홈'
          }
        },
        {
          path: 'intro',
          name: 'pubIntro',
          component: () => import('@/views/publishing/Intro.vue'),
          meta: {
            title: '인트로',
            class: 'whiteHeader'
          }
        }
      ]
    },

    {
      path: 'join', /* 회원가입 */
      name: 'pubJoin',
      component: LayoutNormal, /* 홈, 인트로, 설문 제외한 레이아웃 */
      redirect: { name: 'pubProfile' },
      children: [
        {
          path: 'join-terms-agree',
          name: 'pubViewJoinTermsAgree',
          component: () => import('@/views/publishing/join/JoinTermsAgree.vue'),
          meta: {
            title: '약관 동의',
            class: 'middle'
          }
        },
        {
          path: 'join-phone-certification',
          name: 'pubViewJoinPhoneCertification',
          component: () => import('@/views/publishing/join/JoinPhoneCertification.vue'),
          meta: {
            title: '휴대폰 인증',
            class: 'short'
          }
        },
        {
          path: 'join-pin-registration',
          name: 'pubViewJoinPinRegistration',
          component: () => import('@/views/publishing/join/JoinPinRegistration.vue'),
          meta: {
            title: 'PIN 번호 등록',
            class: 'short'
          }
        }
      ]
    },

    {
      path: 'login', /* 로그인 */
      name: 'pubLogin',
      component: LayoutNormal, /* 홈, 인트로, 설문 제외한 레이아웃 */
      children: [
        {
          path: 'pub-login',
          name: 'pubViewLogin',
          component: () => import('@/views/publishing/Login.vue'),
          meta: {
            title: '사용자 선택',
            class: 'short'
          }
        },
        {
          path: 'login-pin',
          name: 'pubViewLoginPin',
          component: () => import('@/views/publishing/login/LoginPin.vue'),
          meta: {
            title: 'PIN 번호 입력',
            class: 'short'
          }
        }
      ]
    },

    {
      path: 'order-pay', /* 주문 결제 */
      component: LayoutOrderNpay, /* 주문 결제의 경우 mpn을 그대로 가져왔기 때문에 별도의 레이아웃 */
      children: [
        {
          path: '',
          name: 'pubOrderNpay',
          component: () => import('@/views/publishing/OrderNpay.vue'),
          meta: {
            title: '리포트 주문/결제'
          }
        },
        {
          path: 'order-pay-detail',
          name: 'pubOrderNpayDetail',
          component: () => import('@/views/publishing/orderNpay/OrderNpayDetail.vue'),
          meta: {
            title: '리포트 주문상세'
          }
        }
      ]
    },

    {
      path: 'checkup', /* 설문입력 관련 기타 페이지 */
      component: LayoutNormal, /* 홈, 인트로, 설문 제외한 레이아웃 */
      children: [
        {
          path: '',
          name: 'pubCheckup',
          component: () => import('@/views/publishing/Checkup.vue'),
          meta: {
            title: '건강데이터 등록방법 선택',
            class: 'short'
          }
        },
        {
          path: 'checkup-privacy-agree',
          name: 'pubCheckupPrivacyAgree',
          component: () => import('@/views/publishing/checkup/CheckupPrivacyAgree.vue'),
          meta: {
            title: '민감정보수집 이용동의 (필수)',
            class: 'wide'
          }
        },
        {
          path: 'checkup-complete',
          name: 'pubCheckupComplete',
          component: () => import('@/views/publishing/checkup/CheckupComplete.vue'),
          meta: {
            title: '건강설문 완료'
            // class: "short"
          }
        }
      ]
    },
    {
      path: 'checkup-input', /* 설문입력 */
      component: LayoutCheckup, /* 설문 레이아웃 */
      children: [
        {
          path: '',
          name: 'pubCheckupDateSelect',
          component: () => import('@/views/publishing/checkup/CheckupDateSelect.vue'),
          meta: {
            title: '검진일 선택',
            class: 'middle'
          }
        },
        {
          path: 'checkup-basics',
          name: 'pubCheckupBasics',
          component: () => import('@/views/publishing/checkup/CheckupBasics.vue'),
          meta: {
            title: '기본검사',
            class: 'middle'
          }
        },
        {
          path: 'checkup-blood',
          name: 'pubCheckupBlood',
          component: () => import('@/views/publishing/checkup/CheckupBlood.vue'),
          meta: {
            title: '혈액검사',
            class: 'middle'
          }
        },
        {
          path: 'checkup-interest-health',
          name: 'pubCheckupInterestHealth',
          component: () => import('@/views/publishing/checkup/CheckupHealthInterest.vue'),
          meta: {
            title: '관심 건강분야',
            class: 'middle'
          }
        },
        {
          path: 'checkup-memory',
          name: 'pubCheckupMemory',
          component: () => import('@/views/publishing/checkup/CheckupMemory.vue'),
          meta: {
            title: '기억력',
            class: 'middle'
          }
        },
        {
          path: 'checkup-eye',
          name: 'pubCheckupEye',
          component: () => import('@/views/publishing/checkup/CheckupEye.vue'),
          meta: {
            title: '눈',
            class: 'middle'
          }
        },
        {
          path: 'checkup-nose-hypersensitivity',
          name: 'pubCheckupNoseHypersensitivity',
          component: () => import('@/views/publishing/checkup/CheckupNoseHypersensitivity.vue'),
          meta: {
            title: '코 과민반응',
            class: 'middle'
          }
        },
        {
          path: 'checkup-stomach',
          name: 'pubCheckupStomach',
          component: () => import('@/views/publishing/checkup/CheckupStomach.vue'),
          meta: {
            title: '위',
            class: 'middle'
          }
        },
        {
          path: 'checkup-intestine',
          name: 'pubCheckupIntestine',
          component: () => import('@/views/publishing/checkup/CheckupIntestine.vue'),
          meta: {
            title: '장',
            class: 'middle'
          }
        },
        {
          path: 'checkup-joint-and-bone',
          name: 'pubCheckupJointAndBone',
          component: () => import('@/views/publishing/checkup/CheckupJointAndBone.vue'),
          meta: {
            title: '관절, 뼈',
            class: 'middle'
          }
        },
        {
          path: 'checkup-immunity',
          name: 'pubCheckupImmunity',
          component: () => import('@/views/publishing/checkup/CheckupImmunity.vue'),
          meta: {
            title: '면역',
            class: 'middle'
          }
        },
        {
          path: 'checkup-menopause',
          name: 'pubCheckupMenopause',
          component: () => import('@/views/publishing/checkup/CheckupMenopause.vue'),
          meta: {
            title: '갱년기',
            class: 'middle'
          }
        },
        {
          path: 'checkup-prostate',
          name: 'pubCheckupProstate',
          component: () => import('@/views/publishing/checkup/CheckupProstate.vue'),
          meta: {
            title: '전립선',
            class: 'middle'
          }
        },
        {
          path: 'checkup-menstrual',
          name: 'pubCheckupMenstrual',
          component: () => import('@/views/publishing/checkup/CheckupMenstrual.vue'),
          meta: {
            title: '월경',
            class: 'middle'
          }
        },
        {
          path: 'checkup-eq5d',
          name: 'pubCheckupEq5d',
          component: () => import('@/views/publishing/checkup/CheckupEq5d.vue'),
          meta: {
            title: '삶의 질',
            class: 'middle'
          }
        },
        {
          path: 'checkup-physical-activity',
          name: 'pubCheckupPhysicalActivity',
          component: () => import('@/views/publishing/checkup/CheckupPhysicalActivity.vue'),
          meta: {
            title: '운동 습관',
            class: 'middle'
          }
        },
        {
          path: 'checkup-drink-smoke-sleep',
          name: 'pubCheckupDrinkSmokeSleep',
          component: () => import('@/views/publishing/checkup/CheckupDrinkSmokeSleep.vue'),
          meta: {
            title: '음주, 흡연, 수면',
            class: 'middle'
          }
        }
      ]
    },
    { /* 분석 */
      path: 'analyze',
      component: LayoutNormal,
      children: [
        {
          path: '',
          name: 'pubAnalyze',
          component: () => import('@/views/publishing/Analyze.vue'),
          meta: {
            title: '분석 결과 이력',
            class: 'wide'
          }
        },
        {
          path: 'analyze-detail',
          name: 'pubAnalyzeDetail',
          component: () => import('@/views/publishing/analyze/AnalyzeDetail.vue'),
          meta: {
            title: '마이웰니스 랩 분석 결과',
            class: 'whiteHeader wide' /* 231201 이 페이지만 헤더 색이 달라서 클래스 추가 */
          }
        },
        {
          path: 'analyze-checkup-data-record',
          name: 'pubAnalyzeCheckupDataRecord',
          component: () => import('@/views/publishing/analyze/AnalyzeCheckupDataRecord.vue'),
          meta: {
            title: '검진 데이터 이력',
            class: 'wide'
          }
        },
        {
          path: 'analyze-aging-inhibition-analyze-index-detail',
          name: 'pubAnalyzeAgingInhibitionAnalyzeIndexDetail',
          component: () => import('@/views/publishing/analyze/AnalyzeAgingInhibitionAnalyzeIndexDetail.vue'),
          meta: {
            title: '노화 억제 분석 지수',
            class: 'wide'
          }
        },
        {
          path: 'analyze-chronic-disease-control-analyze-index-detail',
          name: 'pubAnalyzeChronicDiseaseControlAnalyzeIndexDetail',
          component: () => import('@/views/publishing/analyze/AnalyzeChronicDiseaseControlAnalyzeIndexDetail.vue'),
          meta: {
            title: '만성질환 억제 분석 지수',
            class: 'wide'
          }
        },
        {
          path: 'analyze-aging-speed-detail',
          name: 'pubAnalyzeAgingSpeedDetail',
          component: () => import('@/views/publishing/analyze/AnalyzeAgingSpeedDetail.vue'),
          meta: {
            title: '노화 속도',
            class: 'wide'
          }
        },
        {
          path: 'analyze-health-light-detail',
          name: 'pubAnalyzeHealthLightDetail',
          component: () => import('@/views/publishing/analyze/AnalyzeHealthLightDetail.vue'),
          meta: {
            title: '건강 신호등',
            class: 'wide'
          }
        },
        // { 상세 페이지로 하는 경우 이걸로 사용 예정
        //     path: "/analyze-major-health-risk",
        //     name: "AnalyzeMajorHealthRisk",
        //     component: () => import("@/views/publishing/analyze/AnalyzeMajorHealthRisk.vue"),
        //     meta: {
        //         title: "주요 건강 위험 요인"
        //     }
        // },
        {
          path: 'analyze-abc-health-grade-detail',
          name: 'pubAnalyzeABCHealthGradeDetail',
          component: () => import('@/views/publishing/analyze/AnalyzeABCHealthGradeDetail.vue'),
          meta: {
            title: 'ABC 건강 등급',
            class: 'wide'
          }
        }
      ]
    },
    {
      path: 'my-page', /* 마이페이지 */
      component: LayoutNormal, /* 홈, 인트로, 설문 제외한 레이아웃 */
      children: [
        { /* 231212 퍼블용 */
          path: 'pub-my-page',
          name: 'pubPubMyPage',
          component: () => import('@/views/publishing/MyPage.vue'),
          meta: {
            title: '마이페이지',
            class: 'short' /* 231207 width: 33rem */
          }
        },
        { /* 231212 퍼블용 */
          path: 'pub-my-page-checkup-data-record',
          name: 'pubPubMyPageCheckupDataRecord',
          component: () => import('@/views/publishing/mypage/MyPageCheckupDataRecord.vue'),
          meta: {
            title: '검진 데이터 이력',
            class: 'middle'
          }
        },
        { /* 231212 퍼블용 */
          path: 'pub-my-page-checkup-data-record-detail',
          name: 'pubPubMyPageCheckupDataRecordDetail',
          component: () => import('@/views/publishing/mypage/MyPageCheckupDataRecordDetail.vue'),
          meta: {
            title: ' ',
            class: 'wide'
          },
          props: true
        },
        { /* 231212 퍼블용 */
          path: 'pub-my-page-report-print-record',
          name: 'pubMyPageReportPrintRecord',
          component: () => import('@/views/publishing/mypage/MyPageReportPrintRecord.vue'),
          meta: {
            title: '리포트 인쇄신청 이력',
            class: 'middle'
          }
        }
      ]
    },
    { /* 기타 페이지 */
      path: 'coupon-status',
      component: LayoutNormal, /* 홈, 인트로, 설문 제외한 레이아웃 */
      children: [
        {
          path: '',
          name: 'pubCouponStatus',
          component: () => import('@/views/publishing/etc/CouponStatus.vue'),
          meta: {
            title: '쿠폰 보유 현황',
            class: 'short'
          }
        },
        {
          path: 'service-use-guide',
          name: 'pubServiceUseGuide',
          component: () => import('@/views/publishing/etc/ServiceUseGuide.vue'),
          meta: {
            title: '서비스 이용안내',
            class: 'whiteHeader wide'
          }
        },
        {
          path: 'pub-faq',
          name: 'pubPubFaq',
          component: () => import('@/views/publishing/etc/Faq.vue'),
          meta: {
            title: 'FAQ',
            class: 'whiteHeader wide'
          }
        },
        {
          path: 'introduce',
          name: 'pubIntroduce',
          component: () => import('@/views/publishing/etc/Introduce.vue'),
          meta: {
            title: 'myWellness LAB 소개',
            class: 'wide'
          }
        }
      ]
    },
    {
      path: 'error', /* 기타 */
      name: 'Error',
      component: () => import('@/views/publishing/Error.vue')
    }
  ]
}

export default publishingRouter
