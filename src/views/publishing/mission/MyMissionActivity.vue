<script>
import { nextTick } from 'vue'
import MyBadgeSetting from '@/views/publishing/mission/MyBadgeSetting.vue'
import BadgeDefault from '@/views/publishing/BadgeDefault.vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'

export default {
  name: 'MyMissionActivity',
  components: {
    BadgeDefault,
    MyBadgeSetting,
    BasePopupClose,
  },
  data () {
    return {
      selectedBadge: null,
      isBadgeModalOpen: false,
      myBedgeSetting: false,
      isRewardTooltipOpen: false,
      rewardArrowLeft: '0rem',
      noBadgePopup: false,
      pinList: [ /* 핀 등급 툴팁 리스트 */
        {
          pinImg: 'beginner',
          pinName: '비기너',
          pinCount: '0',
        },
        {
          pinImg: 'rookie',
          pinName: '루키',
          pinCount: '2',
        },
        {
          pinImg: 'bronze_foundation',
          pinName: '브론즈 파운데이션',
          pinCount: '5',
        },
        {
          pinImg: 'bronze_builder',
          pinName: '브론즈 빌더',
          pinCount: '6',
        },
        {
          pinImg: 'silver_producer',
          pinName: '실버 프로듀서',
          pinCount: '11',
        },
        {
          pinImg: 'gold_producer',
          pinName: '골드 프로듀서',
          pinCount: '31',
        },
        {
          pinImg: 'platinum',
          pinName: '플래티늄',
          pinCount: '51',
        },
        {
          pinImg: 'ruby',
          pinName: '루비',
          pinCount: '71',
        },
        {
          pinImg: 'sapphire',
          pinName: '사파이어',
          pinCount: '91',
        },
        {
          pinImg: 'emerald',
          pinName: '에메랄드',
          pinCount: '111',
        },
        {
          pinImg: 'diamond',
          pinName: '다이아몬드',
          pinCount: '131',
        },
        {
          pinImg: 'exclutive_diamond',
          pinName: '수석 다이아몬드',
          pinCount: '151',
        },
        {
          pinImg: 'double_diamond',
          pinName: '더블 다이아몬드',
          pinCount: '181',
        },
        {
          pinImg: 'triple_diamond',
          pinName: '트리플 다이아몬드',
          pinCount: '211',
        },
        {
          pinImg: 'crown',
          pinName: '크라운',
          pinCount: '241',
        },
        {
          pinImg: 'founders_crown',
          pinName: '파운더스 크라운',
          pinCount: '271',
        },
        {
          pinImg: 'crown_ambassador',
          pinName: '크라운 앰배서더',
          pinCount: '301',
        },
        {
          pinImg: 'founders_crown_ambassador',
          pinName: '파운더스 크라운 앰배서더',
          pinCount: '316',
        },
        {
          pinImg: 'founders_crown_ambassador_40',
          pinName: '파운더스 크라운 앰배서더 40',
          pinCount: '331',
        },
        {
          pinImg: 'founders_crown_ambassador_50',
          pinName: '파운더스 크라운 앰배서더 50',
          pinCount: '346',
        },
        {
          pinImg: 'founders_crown_ambassador_60',
          pinName: '파운더스 크라운 앰배서더 60',
          pinCount: '361',
        },
      ],
      /* [s] 260904 배지 리스트 수정 */
      /* 배지 lockShape 종류
          1 : 이벤트
          2 : 팀장, 이벤트
          3 : (월별)챌린지, 이벤트
          4 : 이벤트
          5 : 이벤트 
          6 : 연속인증, 이벤트
          7 : 챌린지 성공, 이벤트
          8 : 이벤트 */
      badgeCate1: [
        {
          badgeImg: 'mission_streak_10',
          badgeName: '10일 연속 인증',
          badgeHint: '$10일 연속 미션 인증$',
          lockShape: '6',
        },
        {
          badgeImg: 'mission_streak_20',
          badgeName: '20일 연속 인증',
          badgeHint: '$20일 연속 미션 인증$',
          lockShape: '6',
        },
        {
          badgeImg: 'mission_streak_30',
          badgeName: '30일 연속 인증',
          badgeHint: '$30일 연속 미션 인증$',
          lockShape: '6',
        },
        {
          badgeImg: 'mission_streak_60',
          badgeName: '60일 연속 인증',
          badgeHint: '$60일 연속 미션 인증$',
          lockShape: '6',
        },
        {
          badgeImg: 'mission_streak_90',
          badgeName: '90일 연속 인증',
          badgeHint: '$90일 연속 미션 인증$',
          lockShape: '6',
        },
        {
          badgeImg: 'mission_streak_100',
          badgeName: '100일 연속 인증',
          badgeHint: '$100일 연속 미션 인증$',
          lockShape: '6',
          disabled: true,
        },
        {
          badgeImg: 'mission_streak_180',
          badgeName: '180일 연속 인증',
          badgeHint: '$180일 연속 미션 인증$',
          lockShape: '6',
          disabled: true,
        },
        {
          badgeImg: 'mission_streak_200',
          badgeName: '200일 연속 인증',
          badgeHint: '$200일 연속 미션 인증$',
          lockShape: '6',
          disabled: true,
        },
        {
          badgeImg: 'mission_streak_240',
          badgeName: '240일 연속 인증',
          badgeHint: '$240일 연속 미션 인증$',
          lockShape: '6',
          disabled: true,
        },
        {
          badgeImg: 'mission_streak_300',
          badgeName: '300일 연속 인증',
          badgeHint: '$300일 연속 미션 인증$',
          lockShape: '6',
          disabled: true,
        },
        {
          badgeImg: 'mission_streak_365',
          badgeName: '365일 연속 인증',
          badgeHint: '$365일 연속 미션 인증$',
          lockShape: '6',
          disabled: true,
        },
      ],
      badgeCate2: [
        {
          badgeImg: 'challenge_complete_1',
          badgeName: '것모닝코리아 챌린지 1회 성공',
          badgeHint: '$것모닝코리아 챌린지 1회 성공 배지 획득 방법$',
          lockShape: '7',
        },
        {
          badgeImg: 'challenge_complete_2',
          badgeName: '것모닝코리아 챌린지 2회 성공',
          badgeHint: '$것모닝코리아 챌린지 2회 성공 배지 획득 방법$',
          lockShape: '7',
        },
        {
          badgeImg: 'challenge_mania',
          badgeName: '챌린지 마니아',
          badgeHint: '$챌린지 마니아 배지 획득 방법$',
          lockShape: '7',
          disabled: true,
        },
        {
          badgeImg: 'challenge_starter',
          badgeName: '챌린지 스타터',
          badgeHint: '$챌린지 스타터 배지 획득 방법$',
          configured: true, /* 대표 배지 임의 설정 */
          lockShape: '3',
        },
        {
          badgeImg: 'challenge_builder',
          badgeName: '챌린지 빌더',
          badgeHint: '$챌린지 빌더 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'challenge_master',
          badgeName: '챌린지 마스터',
          badgeHint: '$챌린지 마스터 배지 획득 방법$',
          lockShape: '3',
          disabled: true,
        },
      ],
      badgeCate3: [
        {
          badgeImg: 'self_starter',
          badgeName: '솔플 축하',
          badgeHint: '$솔플 축하 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'new_leader',
          badgeName: '팀장',
          badgeHint: '$팀장 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'proven_leader',
          badgeName: '팀장의 자질',
          badgeHint: '$팀장의 자질 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'inspiring_leader',
          badgeName: '팀장의 정석',
          badgeHint: '$팀장의 정석 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'elite_leader',
          badgeName: '우수 팀장',
          badgeHint: '$우수 팀장 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'ultimate_leader',
          badgeName: '혹독한 팀장',
          badgeHint: '$혹독한 팀장 배지 획득 방법$',
          lockShape: '2',
          disabled: true,
        },
        {
          badgeImg: 'flawless_leader',
          badgeName: '가혹한 팀장',
          badgeHint: '$가혹한 팀장 배지 획득 방법$',
          lockShape: '2',
          disabled: true,
        },
      ],
      badgeCate4: [
        {
          badgeImg: 'rich_devos',
          badgeName: '리치 디보스 데이',
          badgeHint: '$리치 디보스 데이 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'jay_van_andel',
          badgeName: '제이 벤 엔델 데이',
          badgeHint: '$제이 벤 엔델 데이 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'amway_korea',
          badgeName: '한국암웨이 창립기념일',
          badgeHint: '$한국암웨이 창립기념일 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'amway_global',
          badgeName: '파운더스데이',
          badgeHint: '$파운더스데이 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'mission_start',
          badgeName: '첫 인증',
          badgeHint: '$첫 인증 배지 획득 방법$',
          lockShape: '8',
        },
        {
          badgeImg: 'octopus_mode',
          badgeName: '문어발',
          badgeHint: '$문어발 배지 획득 방법$',
          lockShape: '4',
        },
        {
          badgeImg: 'happy_birthday',
          badgeName: '나의 생일',
          badgeHint: '$나의 생일 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'welcome_back',
          badgeName: '복귀왕',
          badgeHint: '$복귀왕 배지 획득 방법$',
          lockShape: '1',
        },
        {
          badgeImg: 'early_habitter',
          badgeName: '얼리 해비터',
          badgeHint: '$얼리 해비터 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'brunch_habitter',
          badgeName: '브런치 해비터',
          badgeHint: '$브런치 해비터 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'merry_christmas',
          badgeName: '메리 크리스마스',
          badgeHint: '$메리 크리스마스 배지 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'summer_gutmoring',
          badgeName: '썸머 것모닝',
          badgeHint: '$썸머 것모닝 배지 획득 방법$',
          lockShape: '5',
        },
        {
          badgeImg: 'winter_gutmoring',
          badgeName: '윈터 것모닝',
          badgeHint: '$윈터 것모닝 배지 획득 방법$',
          lockShape: '5',
        },
        {
          badgeImg: 'slow_aging_achiever',
          badgeName: '저속노화 성공',
          badgeHint: '$저속노화 성공 배지 획득 방법$',
          lockShape: '2',
        },
        {
          badgeImg: 'healthy_aging_achiever',
          badgeName: '습관성형 모범생',
          badgeHint: '$습관성형 모범생 배지 획득 방법$',
          lockShape: '6',
        },
        /* 시즌형 */
        {
          badgeImg: 'happy_new_year',
          badgeName: '새해건강씨앗',
          badgeHint: '$새해건강씨앗 배지 획득 방법$',
          lockShape: '5',
        },
        {
          badgeImg: 'spring_begins',
          badgeName: '겨울잠 탈출',
          badgeHint: '$겨울잠 탈출 배지 획득 방법$',
          lockShape: '5',
        },
        {
          badgeImg: 'body_reset',
          badgeName: '내 몸 리셋',
          badgeHint: '$내 몸 리셋 배지 획득 방법$',
          lockShape: '5',
        },
        {
          badgeImg: 'earth_day',
          badgeName: '그린루틴',
          badgeHint: '$그린루틴 배지 획득 방법$',
          lockShape: '1',
        },
        {
          badgeImg: 'family_day',
          badgeName: '가족의 날',
          badgeHint: '$가족의 날 배지 획득 방법$',
          lockShape: '7',
        },
        {
          badgeImg: 'summer_high',
          badgeName: '햇살충전',
          badgeHint: '$햇살충전 배지 획득 방법$',
          lockShape: '5',
        },
        {
          badgeImg: 'hot_summer',
          badgeName: '여름아부탁해',
          badgeHint: '$여름아부탁해 배지 획득 방법$',
          lockShape: '4',
        },
        {
          badgeImg: 'liberation_day',
          badgeName: '저속노화만세!',
          badgeHint: '$저속노화만세! 배지 획득 방법$',
          lockShape: '8',
        },
        {
          badgeImg: 'health_harvest',
          badgeName: '건강풍년',
          badgeHint: '$건강풍년 배지 획득 방법$',
          lockShape: '6',
        },
        {
          badgeImg: 'walkers_day',
          badgeName: '루틴워커',
          badgeHint: '$루틴워커 배지 획득 방법$',
          lockShape: '7',
        },
        {
          badgeImg: 'glucose_care',
          badgeName: '혈당지킴이',
          badgeHint: '$혈당지킴이 배지 획득 방법$',
          lockShape: '7',
        },
        {
          badgeImg: 'full_year_finisher',
          badgeName: '한해완주!',
          badgeHint: '$한해완주! 배지 획득 방법$',
          lockShape: '6',
        },
      ],
      badgeCate5: [
        {
          badgeImg: 'slow_aging_starter',
          badgeName: '저속노화 스타트 분석 1회',
          badgeHint: '$저속노화 스타트 분석 1회 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'slow_aging_builder',
          badgeName: '저속노화 진행중 분석 2회',
          badgeHint: '$저속노화 진행중 분석 2회 획득 방법$',
          lockShape: '3',
        },
        {
          badgeImg: 'slow_aging_master',
          badgeName: '저속노화 완성중 분석 3회',
          badgeHint: '$저속노화 완성중 분석 3회 획득 방법$',
          disabled: true, /* 미획득 배지 */
          lockShape: '3',
        },
      ],
      /* [s] 260904 배지 리스트 수정 */
    }
  },
  computed: {
    badgeCategories() { /* 배지 카테고리 */
      return [
        {
          title: '연속 인증',
          sectionClass: 'pt0',
          list: this.badgeCate1,
        },
        {
          title: '챌린지', /* 260827 문구 수정 */
          sectionClass: '',
          list: this.badgeCate2,
        },
        {
          title: '팀장',
          sectionClass: '',
          list: this.badgeCate3,
        },
        {
          title: '이벤트 배지', /* 260827 문구 수정 */
          sectionClass: '',
          list: this.badgeCate4,
        },
        {
          title: '마이웰니스 랩 분석',
          sectionClass: '',
          list: this.badgeCate5,
        },
      ]
    },
    configuredBadge() { /* 대표 배지 확인 */
      return this.badgeCategories
        .flatMap(category => category.list)
        .find(badge => badge.configured === true)
    },
  },
  setup() {

  },
  mounted() {
    nextTick(() => {
      this.checkHeaderBg()
      window.addEventListener('scroll', this.checkHeaderBg)
    })
  },
  unmounted() {
    window.removeEventListener('scroll', this.checkHeaderBg)
    const header = document.querySelector('.header')
    if (header) {
      header.classList.add('greenBg')
    }
  },
  methods: {
    openBadgeSetting() {
      this.myBedgeSetting = true
    },
    handleBadgeClick(badge) {
      const isDisabled = badge.disabled === true

      this.selectedBadge = {
        title: badge.badgeName,
        img: isDisabled ? `badge--lock-${badge.lockShape}.svg` : `badge--${badge.badgeImg}.svg`,
        hint: badge.badgeHint,
        disabled: isDisabled,
        configured: badge.configured === true,
      }

      this.isBadgeModalOpen = true
    },
    closeBadgeModal() {
      this.isBadgeModalOpen = false
      this.selectedBadge = null
    },
    checkHeaderBg () {
      const target = document.querySelector('.activity__area-terms-tab.home')
      const header = document.querySelector('.header')

      if (!target || !header) return

      const headerHeight = header.offsetHeight
      const targetTop = target.getBoundingClientRect().top

      if (targetTop <= headerHeight) {
        header.classList.remove('greenBg')
      } else {
        header.classList.add('greenBg')
      }
    },
    openRewardTooltip(event) {
      const button = event.currentTarget
      const rewardWrap = this.$refs.rewardWrap

      if (!rewardWrap) return

      const buttonRect = button.getBoundingClientRect()
      const rewardRect = rewardWrap.getBoundingClientRect()
      const arrowLeftPx = buttonRect.left - rewardRect.left + (buttonRect.width / 2)

      this.rewardArrowLeft = `${arrowLeftPx / 10}rem`
      this.isRewardTooltipOpen = true
    },
    closeRewardTooltip() {
      this.isRewardTooltipOpen = false
    },
  },
}

</script>

<template>
  <div class="activity bg-green my--activity">
    <div class="activity__area">
      <div class="activity__area-certified">
        <div>
          <p>최초 인증일</p>
          <p class="_date"><strong>$2025년 7월 5일$</strong></p>
        </div>
        <div>
          <p>미션별 누적 인증 기록</p>
          <a href=""><strong>자세히 보기</strong></a>
        </div>
        <div>
          <p>총 누적 인증 횟수</p>
          <p class="_count"><strong>$1,230$회</strong></p>
        </div>
      </div>
    </div>
    <div class="activity__area-terms-tab home">
      <div class="activity__area-profile">
        <h2>현재 나의 활동</h2>
        <p class="activity__area-profile-date">활동 기준일 : 2025년 9월 ~ 2026년 8월</p>
        
        <div class="badge__container">
          <BadgeDefault img="pin--diamond.svg" />
          <div class="badge__desc">
            <div class="badge__desc-info">
              <span class="badge__desc-my"> 다이아몬드 </span>            
              <button type="button" class="badges_reward_btn__open" @click="openRewardTooltip">
                <img src="/img/ico_tooltip_black.svg" alt="핀레벨 뱃지 설명 툴팁 오픈 버튼" />
              </button>
            </div>
            <div class="badge__desc-name">
              <span> 닉네임 영문 최대 20자 </span>
            </div>           
            <div class="badges_reward" ref="rewardWrap" :style="{ '--reward-arrow-left': rewardArrowLeft }">
              <div class="badges_reward_btn">
                <div class="badges_reward_btn__pop" :class="{ on: isRewardTooltipOpen }">
                  
                  <span class="badges_reward_btn-txt"> 총 인증 횟수에 따라<br/>마이웰니스 랩 핀이 올라갑니다. </span> <!-- 260827 문구 수정 -->
                  <button class="badges_reward_btn__pop__close" @click="closeRewardTooltip"></button>
                  <div class="activity__area_badge-section">
                    <div class="badge-box-wrap">
                      <div v-for="pin in pinList" :key="pin.pinImg" class="badge-box">
                        <BadgeDefault :img="`pin--${pin.pinImg}.svg`">
                          {{ pin.pinName }}
                        </BadgeDefault>
                        <span>{{ pin.pinCount }}회</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
      <div class="activity__area_badge-section activity__area-record">
        <div class="para-title">
          <h5> 현재 기록 </h5>
          <button type="button" @click="$router.push({ name: 'pubMyMissionPrevious' })">
            이전 기록
            <div class="img-wrap">
              <img src="/img/ico_arrow_right_black.svg" alt="" />
            </div>
          </button>
        </div>
        <div class="activity__area-record-box-wrap">
          <div class="record-box">
            <div class="ico">
              <span class="blind">인증횟수 아이콘</span>
            </div>
            <div>
              <h5>인증횟수</h5>
            </div>
            <div>
              <p> 누적 </p>
              <p class="val">21 개</p> <!-- 260827 문구 수정 -->
            </div>
            <div>
              <p>최대 연속 </p>
              <p class="val">10 개</p> <!-- 260827 문구 수정 -->
            </div>
          </div>
          <div class="record-box">
            <div class="ico">
              <span class="blind">챌린지 아이콘</span>
            </div>
            <div>
              <h5>챌린지(회차)</h5>
            </div>
            <div>
              <p> 참여 수 </p>
              <p class="val">5 회</p> <!-- 260827 문구 수정 -->
            </div>
            <div>
              <p>성공 </p>
              <p class="val">4 회</p> <!-- 260827 문구 수정 -->
            </div>
          </div>
          <div class="record-box">
            <div class="ico">
              <span class="blind">최고 인증률 아이콘</span>
            </div>
            <div>
              <h5>최고 인증률</h5>
            </div>
            <div>
              <p> 상시 </p>
              <p class="val">80 %</p> <!-- 260827 문구 수정 -->
            </div>
            <div>
              <p> 챌린지 </p>
              <p class="val">80 %</p> <!-- 260827 문구 수정 -->
            </div>
          </div>
          <div class="record-box">
            <div class="ico">
              <span class="blind">최고 달성 랭킹 아이콘</span>
            </div>
            <div>
              <h5>최고 달성 랭킹</h5>
            </div>
            <div>
              <p> 상시 </p>
              <p class="val">1 위</p> <!-- 260827 문구 수정 -->
            </div>
            <div>
              <p> 챌린지 </p>
              <p class="val">3 위</p> <!-- 260827 문구 수정 -->
            </div>
          </div>
        </div>
      </div>
      <div class="activity__area_badge-section para-title">
        <h5> 배지 활동 </h5>
        <p> 총 <span class="val green"> 13개</span> 보유 </p>
      </div>

      <div class="represent__badge-wrap">
        <!-- 대표 배지있을 시 -->
        <div v-if="configuredBadge" class="represent__badge" @click="handleBadgeClick(configuredBadge)">
          <BadgeDefault :img="`badge--${configuredBadge.badgeImg}.svg`">
            {{ configuredBadge.badgeName }}
          </BadgeDefault>
          <button class="btn" type="button" title="대표 배지 설정" @click.stop="openBadgeSetting">
            <div class="btn-text">대표 배지 설정</div>
            <div class="btn-modify">
              <span class="blind">대표 배지 설정</span>
            </div>
          </button>
        </div>

        <!-- 대표 배지없을 시 -->
        <template v-else>
          <div class="represent__badge no-represent">
            <p class="represent__badge-txt">획득한 배지 중에서 대표배지를<br/> 설정해 주세요.</p> <!-- 260827 문구 수정 -->
            <button class="btn" type="button" title="대표 배지 설정" @click="noBadgePopup = true">
              <div class="btn-text">대표 배지 설정</div>
              <div class="btn-modify">
                <span class="blind">대표 배지 설정</span>
              </div>
            </button>
          </div>
          <p class="represent__badge-subtxt">아직 획득한 배지가 없어요</p>
        </template>
      </div>
      <!-- s : 대표 배지없을 시 퍼블 확인용-->
      <div class="represent__badge-wrap">
        <div class="represent__badge no-represent">
          <p class="represent__badge-txt">획득한 배지에서 대표배지를<br/> 설정해주세요 </p>
          <button class="btn" type="button" title="대표 배지 설정" @click="noBadgePopup = true">
            <div class="btn-text"> 대표 배지 설정</div>
            <div class="btn-modify"><span class="blind">대표 배지 설정</span></div>
          </button>
        </div>
        <p class="represent__badge-subtxt">아직 획득한 배지가 없어요 </p>
      </div>
      <!-- e : 대표 배지없을 시 퍼블 확인용-->

      <div v-for="category in badgeCategories" :key="category.title" class="activity__area_badge-section" :class="category.sectionClass">
        <div class="para-title-2rd">
          <h6>{{ category.title }}</h6>
        </div>

        <div class="badge-box-wrap home">
          <div
            v-for="badge in category.list"
            :key="badge.badgeImg"
            class="badge-box"
            :class="{ 'is-disabled': badge.disabled }"
            @click="handleBadgeClick(badge)"
          >
            <BadgeDefault :img="badge.disabled ? `badge--lock-${badge.lockShape}.svg` : `badge--${badge.badgeImg}.svg`">
              {{ badge.badgeName }}
            </BadgeDefault>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- 대표 배지 설정 팝업 -->
  <MyBadgeSetting v-if="myBedgeSetting" @popupClose="myBedgeSetting = false">
    <template v-slot:title>대표 배지 설정</template>
  </MyBadgeSetting>

  <!-- 대표 배지 설정 없을 시 팝업  -->
  <BasePopupClose v-if="noBadgePopup" :close-btn="false">
    <template v-slot:title>대표 배지 설정</template>
    <template v-slot:contents>
      <p class="pop-text-light">아직 획득한 배지가 없어요.</p>
    </template>
    <template v-slot:button>
      <button type="button" @click="noBadgePopup = false" class="pop-btn pop-btn--green">닫기</button>
    </template>
  </BasePopupClose>

  <div
    v-if="isBadgeModalOpen"
    class="badge-modal-layer"
    @click.self="closeBadgeModal"
  >
    <div class="badge-modal-card">
      <button class="badge-modal__close" type="button" @click="closeBadgeModal" aria-label="닫기">
        <span class="blind">닫기</span>
      </button>

      <div class="badge-modal__hero">
        <div class="badge-modal__thumb">
          <BadgeDefault v-if="selectedBadge" :img="selectedBadge.img" />
        </div>

        <span v-if="selectedBadge && selectedBadge.configured" class="badge-modal__tag">대표배지</span>

        <p class="badge-modal__title">
          {{ selectedBadge ? selectedBadge.title : '' }}
        </p>

        <p v-if="selectedBadge && !selectedBadge.disabled" class="badge-modal__copy">
          배지를 획득하셨어요!
        </p>
      </div>

      <div class="badge-modal__guide">
        <span class="badge-modal__guide-tag">획득방법</span>
        <p class="badge-modal__guide-text">{{ selectedBadge ? selectedBadge.hint : '' }}</p>
      </div>

      <button v-if="selectedBadge && !selectedBadge.disabled" class="badge-modal__primary" type="button" @click="closeBadgeModal"> <!-- 2606 클릭 시 대표 배지 설정 기능 필요 -->
        {{ selectedBadge && selectedBadge.configured ? '대표 배지 설정 해제' : '대표 배지 설정' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
</style>
