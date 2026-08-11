<script>
import { nextTick } from 'vue'
import BadgeDefault from '@/views/publishing/BadgeDefault.vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from 'swiper/modules';

export default {
  name: 'MyMissionPrevious',
  components: {    
    BadgeDefault,
    Swiper,
    SwiperSlide,

  },
  data () {
    return {
        leftArea: "",
        isIntersecting: false,
        observer: null,
        refs: [],
        modules: [Navigation],
    }
  },
  setup() {
    const swiperOptions = {
      modules: [Navigation],
      navigation: {
        prevEl: '.arrow-left',
        nextEl: '.arrow-right',
      },
      slidesPerView: 1,
      spaceBetween: 40,
    };
    return { swiperOptions };

  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        const HEADER_HEIGHT = 72; // 헤더 높이(px)
        const sentinels = this.$refs.sentinel;
        this.observer = new IntersectionObserver(
          ([entry]) => {
            // sentinel이 사라지면(=섹션이 헤더를 지나면) bgGray → bgWhite
            this.isIntersecting = entry.isIntersecting || window.scrollY <= 2;
          },
          {
            rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`,
            threshold: 0.1
          }
        );
        this.observer.observe(sentinels);

        // 초기 상태 바로 반영
        const rect = sentinels.getBoundingClientRect();
        this.isIntersecting = rect.top >= HEADER_HEIGHT;

      }, 100);
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY <= 3) {
        this.isIntersecting = true;
      }
    });
  },
  beforeUnmount() {
    const target = this.$refs.targetSection
    if (this.observer && target) {
      this.observer.unobserve(target)
    }
  }
};
</script>

<template>
  <div class="activity bg-case">
    <div class="activity__sub">      
      <div class="swiper__area">
        <div class="swiper__area-arrow">
          <button class="arrow-left arrow" aria-label="이전 슬라이드"></button>
          <button class="arrow-right arrow" aria-label="다음 슬라이드"></button>
        </div>
        <swiper :navigation="true" :modules="modules" class="mySwiper" v-bind="swiperOptions">
          <swiper-slide>
            <div class="activity__area-profile-wrap">
              <div class="activity__area-profile">
                <div class="activity__period-wrap">
                  <p class="activity__period">26년 9월 - 27년 8월</p>
                </div>
                <p class="activity__area-profile-date"> 활동 기준일 : 2025년 9월 ~ 2026년 8월</p>
                <BadgeDefault img="pin--diamond.svg" />
                <div class="activity__area-profile-name">
                  <p>닉네임 영문 최대 20자</p>
                </div>
              </div>
            </div>
            <div class="activity__area-record">
              <div class="para-title">
                <h5>현재 기록</h5>
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
                    <p class="val"> 21개 </p>
                  </div>
                  <div>
                    <p>최대 연속 </p>
                    <p class="val"> 10개 </p>
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
                    <p class="val"> 5회 </p>
                  </div>
                  <div>
                    <p>성공 </p>
                    <p class="val"> 4회 </p>
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
                    <p class="val"> 80% </p>
                  </div>
                  <div>
                    <p> 챌린지 </p>
                    <p class="val"> 80% </p>
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
                    <p class="val"> 1개 </p>
                  </div>
                  <div>
                    <p> 챌린지 </p>
                    <p class="val"> 3위 </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ref 중복 사용 불가능하여 첫번째 슬라이드에만 ref 활성화 (??) -->            
            <!-- <div ref="sentinel" style="height:0"></div> -->

            <div class="activity__area-terms-tab">
              <div class="para-title" ref="targetSection">
                <h5> 획득한 배지 </h5>
                <p> 총 <span class="green"> 11개</span> 보유 </p>
              </div>
              
              <div class="activity__area_badge-section pt8">
                <div class="para-title-2rd">
                  <h6> 연속인증 </h6>
                </div>
                <div class="badge-box-wrap home">
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_10.svg">10일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_20.svg">20일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_30.svg">30일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_60.svg">60일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_90.svg">90일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_100.svg">100일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_180.svg">180일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_200.svg">200일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_240.svg">240일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_300.svg">300일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_365.svg">365일 연속 인증</BadgeDefault>
                  </div>
                </div>
              </div>

              <div class="activity__area_badge-section">
                <div class="para-title-2rd">
                  <h6> 챌린지 참여 </h6>
                </div>
                <div class="badge-box-wrap home">
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg">한줄 텍스트</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg">한줄 텍스트</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg">한줄 텍스트</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg">한줄 텍스트</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg">한줄 텍스트</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg">한줄 텍스트</BadgeDefault>
                  </div>
                </div>
              </div>

              <div class="activity__area_badge-section">
                <div class="para-title-2rd">
                  <h6> 팀장 </h6>
                </div>
                <div class="badge-box-wrap home">
                  <div class="badge-box">
                    <BadgeDefault img="badge--self_starter.svg">솔플 축하</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--new_leader.svg">팀장</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--proven_leader.svg">팀장의 자질</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--inspiring_leader.svg">팀장의 정석</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--elite_leader.svg">우수 팀장</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--ultimate_leader.svg">혹독한 팀장</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--flawless_leader.svg">가혹한 팀장</BadgeDefault>
                  </div>
                </div>
              </div>

              <div class="activity__area_badge-section">
                <div class="para-title-2rd">
                  <h6> 이벤트 배지 </h6>
                </div>
                <div class="badge-box-wrap home">
                  <div class="badge-box">
                    <BadgeDefault img="badge--event_figure_richDevos.svg">리치 디보스 탄생일</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--event_figure_jayVanAndel.svg">제이 벤 엔델 탄생일</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--amway_korea.svg">한국암웨이 창립기념일 </BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--amway_global.svg">파운더스데이 </BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--happy_new_year.svg">새해 첫날</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--happy_chuseok.svg">추석</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_start.svg">첫 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--family_duo.svg">2대 것모너</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--big_family.svg">다둥이</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--family_day.svg">패밀리데이</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--childrens_day.svg">어린이날</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--octopus_mode.svg">문어발</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--happy_birthday.svg">나의 생일</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--returning_hero.svg">복귀왕</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--early_bird.svg">얼리 것모너</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--brunch_lover.svg">브런치 것모너</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--womens_day.svg">세계 여성의날</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--earth_day.svg">지구의 날</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--halloween_hustler.svg">고스트 것모닝</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--valentines_day.svg">스윗 것모닝</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--liberation_day.svg">광복절</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--summer_gutmoring.svg">썸머 것모닝</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--winter_gutmoring.svg">윈터 것모닝</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--merry_christmas.svg">메리 크리스마스</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--best_teammate.svg">베스트 팀메이트</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--family_power.svg">가족의 힘</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--lock.svg" pointColor="lock">$미획득 배지$</BadgeDefault>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="activity__area-profile-wrap">
              <div class="activity__area-profile">
                <div class="activity__period-wrap">
                  <p class="activity__period">26년 9월 - 27년 8월</p>
                </div>
                <p class="activity__area-profile-date"> 활동 기준일 : 2025년 9월 ~ 2026년 8월</p>
                <BadgeDefault img="pin--ruby.svg" />
                <div class="activity__area-profile-name">
                  <p>닉네임 닉네임 영문</p>
                </div>
              </div>
            </div>
            <div class="activity__area-record">
              <div class="para-title">
                <h5>현재 기록</h5>
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
                    <p class="val"> 21개 </p>
                  </div>
                  <div>
                    <p>최대 연속 </p>
                    <p class="val"> 10개 </p>
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
                    <p class="val"> 5회 </p>
                  </div>
                  <div>
                    <p>성공 </p>
                    <p class="val"> 4회 </p>
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
                    <p class="val"> 80% </p>
                  </div>
                  <div>
                    <p> 챌린지 </p>
                    <p class="val"> 80% </p>
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
                    <p class="val"> 1개 </p>
                  </div>
                  <div>
                    <p> 챌린지 </p>
                    <p class="val"> 3위 </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ref 중복 사용 불가능하여 첫번째 슬라이드에만 ref 활성화 (??) -->            
            <!-- <div ref="sentinel" style="height:0"></div> -->

            <div class="activity__area-terms-tab">
              <div class="para-title" ref="targetSection">
                <h5> 획득한 배지 </h5>
                <p> 총 <span class="green"> 8개</span> 보유 </p>
              </div>
              <div class="activity__area_badge-section pt8">
                <div class="para-title-2rd">
                  <h6> 연속인증 </h6>
                </div>
                <div class="badge-box-wrap">
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_10.svg">10일 연속 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_streak_30.svg">30일 연속 인증</BadgeDefault>
                  </div>
                </div>
              </div>

              <div class="activity__area_badge-section">
                <div class="para-title-2rd">
                  <h6> 챌린지 참여 </h6>
                </div>
                <div class="badge-box-wrap">
                  <div class="badge-box">
                    <BadgeDefault img="badge--challenge_complete_1.svg"> 것모닝코리아 챌린지 1회 성공</BadgeDefault>
                  </div>
                </div>
              </div>

              <div class="activity__area_badge-section">
                <div class="para-title-2rd">
                  <h6> 팀장 </h6>
                </div>
                <div class="badge-box-wrap">
                  <div class="badge-box">
                    <BadgeDefault img="badge--new_leader.svg">팀장</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--proven_leader.svg">팀장의 자질</BadgeDefault>
                  </div>
                </div>
              </div>

              <div class="activity__area_badge-section">
                <div class="para-title-2rd">
                  <h6> 이벤트 뱃지 </h6>
                </div>
                <div class="badge-box-wrap">
                  <div class="badge-box">
                    <BadgeDefault img="badge--mission_start.svg">첫 인증</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--happy_birthday.svg">나의 생일</BadgeDefault>
                  </div>
                  <div class="badge-box">
                    <BadgeDefault img="badge--returning_hero.svg">복귀왕</BadgeDefault>
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
