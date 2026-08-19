<script>
import BadgeDefault from '@/views/publishing/BadgeDefault.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation } from 'swiper/modules'

export default {
  name: 'MyMissionPrevious',
  components: {
    BadgeDefault,
    Swiper,
    SwiperSlide,
  },
  data () {
    return {
      activeHistoryIndex: 0,
      modules: [Navigation],
      swiperOptions: {
        navigation: {
          prevEl: '.arrow-left',
          nextEl: '.arrow-right',
        },
        slidesPerView: 1,
        spaceBetween: 40,
        autoHeight: true,
      },

      /* 퍼블 확인용 이전 기록 데이터 */
      historyList: [
        {
          period: '26년 9월 - 27년 8월',
          activePeriod: '2025년 9월 ~ 2026년 8월',
          pinImg: 'pin--diamond.svg',
          pinName: '다이아몬드',
          nickname: '닉네임 영문 최대 20자',
          record: { /* 나의 미션 활동 기록 */
            certTotal: '21',
            maxStreak: '10',
            challengeJoin: '5',
            challengeSuccess: '4',
            regularBestRate: '80',
            challengeBestRate: '80',
            regularBestRank: '1',
            challengeBestRank: '3',
          },
          badges: { /* 획득한 배지 리스트 */
            streak: [
              { img: 'mission_streak_10', name: '10일 연속 인증' },
              { img: 'mission_streak_20', name: '20일 연속 인증' },
              { img: 'mission_streak_30', name: '30일 연속 인증' },
              { img: 'mission_streak_60', name: '60일 연속 인증' },
              { img: 'mission_streak_90', name: '90일 연속 인증' },
              { img: 'mission_streak_100', name: '100일 연속 인증' },
              { img: 'mission_streak_180', name: '180일 연속 인증' },
              { img: 'mission_streak_200', name: '200일 연속 인증' },
              { img: 'mission_streak_240', name: '240일 연속 인증' },
              { img: 'mission_streak_300', name: '300일 연속 인증' },
              { img: 'mission_streak_365', name: '365일 연속 인증' },
            ],
            challenge: [],
            leader: [
              { img: 'self_starter', name: '솔플 축하' },
              { img: 'new_leader', name: '팀장' },
              { img: 'proven_leader', name: '팀장의 자질' },
              { img: 'inspiring_leader', name: '팀장의 정석' },
              { img: 'elite_leader', name: '우수 팀장' },
              { img: 'ultimate_leader', name: '혹독한 팀장' },
              { img: 'flawless_leader', name: '가혹한 팀장' },
            ],
            event: [
              { img: 'event_figure_richDevos', name: '리치 디보스 탄생일' },
              { img: 'event_figure_jayVanAndel', name: '제이 벤 엔델 탄생일' },
              { img: 'amway_korea', name: '한국암웨이 창립기념일' },
              { img: 'amway_global', name: '파운더스데이' },
              { img: 'happy_new_year', name: '새해 첫날' },
              { img: 'happy_chuseok', name: '추석' },
              { img: 'mission_start', name: '첫 인증' },
              { img: 'family_duo', name: '2대 것모너' },
              { img: 'big_family', name: '다둥이' },
              { img: 'family_day', name: '패밀리데이' },
              { img: 'childrens_day', name: '어린이날' },
              { img: 'octopus_mode', name: '문어발' },
              { img: 'happy_birthday', name: '나의 생일' },
              { img: 'returning_hero', name: '복귀왕' },
              { img: 'early_bird', name: '얼리 것모너' },
              { img: 'brunch_lover', name: '브런치 것모너' },
              { img: 'womens_day', name: '세계 여성의날' },
              { img: 'earth_day', name: '지구의 날' },
              { img: 'halloween_hustler', name: '고스트 것모닝' },
              { img: 'valentines_day', name: '스윗 것모닝' },
              { img: 'liberation_day', name: '광복절' },
              { img: 'summer_gutmoring', name: '썸머 것모닝' },
              { img: 'winter_gutmoring', name: '윈터 것모닝' },
              { img: 'merry_christmas', name: '메리 크리스마스' },
              { img: 'best_teammate', name: '베스트 팀메이트' },
              { img: 'family_power', name: '가족의 힘' },
            ],
          },
        },
        {
          period: '25년 9월 - 26년 8월',
          activePeriod: '2024년 9월 ~ 2025년 8월',
          pinImg: 'pin--ruby.svg',
          pinName: '루비',
          nickname: '닉네임 닉네임 영문',
          record: {
            certTotal: '18',
            maxStreak: '8',
            challengeJoin: '3',
            challengeSuccess: '2',
            regularBestRate: '70',
            challengeBestRate: '85',
            regularBestRank: '2',
            challengeBestRank: '5',
          },
          badges: {
            streak: [
              { img: 'mission_streak_10', name: '10일 연속 인증' },
              { img: 'mission_streak_30', name: '30일 연속 인증' },
            ],
            challenge: [
              { img: 'challenge_complete_1', name: '것모닝코리아 챌린지 1회 성공' },
            ],
            leader: [
              { img: 'new_leader', name: '팀장' },
              { img: 'proven_leader', name: '팀장의 자질' },
            ],
            event: [
              { img: 'mission_start', name: '첫 인증' },
              { img: 'happy_birthday', name: '나의 생일' },
              { img: 'returning_hero', name: '복귀왕' },
            ],
          },
        },
      ],
    }
  },
  computed: {
    activeHistory () {
      return this.historyList[this.activeHistoryIndex] || this.historyList[0]
    },
  },
  methods: {
    getBadgeCategories(history) {
      return [
        {
          key: 'streak',
          title: '연속인증',
          sectionClass: 'pt8',
          wrapClass: 'home',
          list: history.badges.streak || [],
        },
        {
          key: 'challenge',
          title: '챌린지 참여(본사)',
          sectionClass: '',
          wrapClass: 'home',
          list: history.badges.challenge || [],
        },
        {
          key: 'leader',
          title: '팀장',
          sectionClass: '',
          wrapClass: 'home',
          list: history.badges.leader || [],
        },
        {
          key: 'event',
          title: '이벤트 배지',
          sectionClass: '',
          wrapClass: 'home',
          list: history.badges.event || [],
        },
      ].filter(category => category.list.length > 0)
    },
    getBadgeTotal(history) { /* 획득한 배지 총 개수 계산 */
      return Object.values(history.badges).reduce((total, list) => {
        return total + list.length
      }, 0)
    },
    onSlideChange(swiper) { /* 스크롤따라 헤더 색상 변경 */
      this.activeHistoryIndex = swiper.activeIndex
      this.$nextTick(() => {
        this.checkHeaderBg()
      })
    },
    checkHeaderBg () { /* 스크롤따라 헤더 색상 변경 */
      const target = document.querySelector('.swiper-slide-active .activity__area-terms-tab') || document.querySelector('.activity__area-terms-tab')
      const header = document.querySelector('.header')

      if (!target || !header) return

      const headerHeight = header.offsetHeight
      const targetTop = target.getBoundingClientRect().top

      if (header.classList.contains('greenBg')) {
        header.classList.remove('greenBg')
      }

      if (targetTop <= headerHeight) {
        header.classList.add('whiteBg')
      } else {
        header.classList.remove('whiteBg')
      }
    },
  },
  mounted() {
    this.$nextTick(() => { /* 스크롤따라 헤더 색상 변경 */
      this.checkHeaderBg()
      window.addEventListener('scroll', this.checkHeaderBg)
    })
  },
  beforeUnmount() { /* 스크롤따라 헤더 색상 변경 */
    window.removeEventListener('scroll', this.checkHeaderBg)
    const header = document.querySelector('.header')
    if (header) {
      header.classList.remove('whiteBg')
    }
  }
}
</script>

<template>
  <div class="activity bg-case my--previous">
    <div class="activity__sub">
      <div class="swiper__area">
        <div class="swiper__area-arrow">
          <button class="arrow-left arrow" aria-label="이전 슬라이드"></button>
          <button class="arrow-right arrow" aria-label="다음 슬라이드"></button>
        </div>

        <swiper :modules="modules" class="mySwiper" v-bind="swiperOptions" @slideChange="onSlideChange">
          <swiper-slide v-for="history in historyList" :key="`${history.yearStart}-${history.startMonth}-${history.nickname}`">
            <div class="activity__area-profile-wrap">
              <p class="activity__period">{{ activeHistory.period }}</p>
              <p class="activity__area-profile-date">활동 기준일 : {{ activeHistory.activePeriod }}</p>
              <div class="activity__area-profile">
                <BadgeDefault :img="history.pinImg" />
                <p class="activity__area-profile-pin">{{ history.pinName }}</p>
                <div class="activity__area-profile-name">
                  <p>{{ history.nickname }}</p>
                </div>
              </div>
            </div>
            <div class="activity__area-record">
              <div class="para-title">
                <h5>나의 미션 활동 기록</h5>
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
                    <p>누적</p>
                    <p class="val">{{ history.record.certTotal }}개</p>
                  </div>
                  <div>
                    <p>최대 연속</p>
                    <p class="val">{{ history.record.maxStreak }}개</p>
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
                    <p>참여 수</p>
                    <p class="val">{{ history.record.challengeJoin }}회</p>
                  </div>
                  <div>
                    <p>성공</p>
                    <p class="val">{{ history.record.challengeSuccess }}회</p>
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
                    <p>상시</p>
                    <p class="val">{{ history.record.regularBestRate }}%</p>
                  </div>
                  <div>
                    <p>챌린지</p>
                    <p class="val">{{ history.record.challengeBestRate }}%</p>
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
                    <p>상시</p>
                    <p class="val">{{ history.record.regularBestRank }}위</p>
                  </div>
                  <div>
                    <p>챌린지</p>
                    <p class="val">{{ history.record.challengeBestRank }}위</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="activity__area-terms-tab">
              <div class="para-title">
                <h5>획득한 배지</h5>
                <p>총 <span class="green">{{ getBadgeTotal(history) }}개</span> 보유</p>
              </div>

              <div v-for="category in getBadgeCategories(history)" :key="category.key" class="activity__area_badge-section" :class="category.sectionClass">
                <div class="para-title-2rd">
                  <h6>{{ category.title }}</h6>
                </div>

                <div class="badge-box-wrap" :class="category.wrapClass">
                  <div v-for="badge in category.list" :key="`${category.key}-${badge.img}-${badge.name}`" class="badge-box">
                    <BadgeDefault :img="`badge--${badge.img}.svg`">{{ badge.name }}</BadgeDefault>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>

</template>


<style scoped>

</style>
