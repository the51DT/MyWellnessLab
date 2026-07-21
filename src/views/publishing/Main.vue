<script>
import { ref } from 'vue'
import BasePopup from '@/views/publishing/BasePopup.vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'
import BasePopupBadge from '@/views/publishing/BasePopupBadge.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import AddBtnHome from '@/components/AddBtnHome.vue'
import TabRound from '@/components/TabRound.vue'
import TextDatePicker from '@/components/TextDatePicker.vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'
import BasePopupTit from '@/components/BasePopupTit.vue'
import TargetGauge from '@/components/TargetGauge.vue'
import MainCalenderPop from '@/views/publishing/main/MainCalenderPop.vue'

export default {
  name: 'Main',
  components: {
    BasePopup,
    BasePopupClose,
    BasePopupBadge,
    MainCalenderPop,
    AddBtnHome,
    TabRound,
    TextDatePicker,
    TargetGauge,
    BaseOpener,
    BasePopupTit,
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      isScroll: false,
      isPc: false,
      imageUrl: ref(null),
      tab: ref(0),
      missionTab: ref(0),
      stickyScrollHandler: null, /* 260721 / 플로팅 탭 전환 핸들러 추가 */
      analyzeData: { /* 건강수명분석 퍼블 확인용 */
        total: 0.67,
        aging: 77,
        chronic: 79,
        muscles: 85,
      },
      agingSpeed: 0.67, /* 퍼블 확인용 노화속도 */
      isOpen: false, /* 미션 선택 팝업 아코디언 오프너 */
      isAnalyze: false, /* 건강수명분석 여부 */
      selectMission: false, /* 미션선택 여부 */
      floatingDay: true,  /* 챌린지대기 노출 플로팅 버튼 */
      popup: { /* 퍼블 확인용 팝업값 */
        missionPopup: false, /* 미션선택 팝업 */
        noMissionPopup: false, /* 선택 미션 없을 시 팝업 */
        dailyCompPopup: false, /* 인증완료 팝업 */
        dailyMethodPopup: false, /* 인증방법 선택 팝업 */
        surveyContinuePopup: false, /* 설문 이어하기 팝업 */
        noCouponPopup: false, /* 분석권 없을 시 팝업 */
        myDailyPopup: false, /* 나의 인증 현황 팝업 */
      },
      dailyData: [ /* 퍼블 확인용 데이터 */
        {
          day: 'tue',
          img: '/img/img_home_daily_exam.png',
        },
        {
          day: 'mon',
          img: '/img/img_home_daily_exam.png',
        },
        {
          day: 'sun',
          img: '/img/img_home_daily_exam.png',
        },
      ],
      selectedMissionId: null, /* 퍼블 확인용 선택된 미션 id 데이터 */
      selectedMissionOpen: null, /* 퍼블 확인용 미션 선택 후 버튼 오프너 */
      recommendMissionGroups: [ /* 퍼블 확인용 미션 데이터1 */
        {
          key: 'nutrition',
          title: '영양',
          open: true,
          items: [
            {
              id: 'recommend-nutrition-1',
              title: '기억력 개선',
              desc: '견과류 섭취하기',
              recommend: true
            }
          ]
        },
        {
          key: 'exercise',
          title: '운동',
          open: true,
          items: [
            {
              id: 'recommend-exercise-1',
              title: '체지방 조절',
              desc: '중강도 이상 유산소 운동 20~30분 (빠르게 걷기, 수영, 자전거)',
              recommend: true
            }
          ]
        },
        {
          key: 'sleep',
          title: '수면',
          open: true,
          items: [
            {
              id: 'recommend-sleep-1',
              title: '수면건강',
              desc: '7~8시간 이상 수면하기',
              recommend: true
            },
          ]
        },
        {
          key: 'life',
          title: '생활습관',
          open: true,
          items: [
            {
              id: 'recommend-life-1',
              title: '위건강',
              desc: '식후 3시간 이내 눕지 않기',
              recommend: true
            },
          ]
        }
      ],
      allMissionGroups: [ /* 퍼블 확인용 미션 데이터2 */
        {
          key: 'nutrition-all',
          title: '영양',
          open: false,
          items: [
            {
              id: 'all-nutrition-1',
              title: '혈압조절',
              desc: '혈압조절 제품 (코엔자임Q10, 마그네슘, 오메가 3) 챙겨 먹기'
            },
            {
              id: 'all-nutrition-2',
              title: '혈당조절',
              desc: '혈당 건강 제품(바나바잎 추출물) 챙겨먹기'
            },
            {
              id: 'all-nutrition-3',
              title: '운동수행능력/지구력 향상',
              desc: '매끼니 단백질 (콩, 두부, 달걀, 생선, 우유, 요거트, 살코기) 챙겨먹기'
            },
            {
              id: 'all-nutrition-4',
              title: '갱년기 여성건강',
              desc: '당/튀김음식/초가공식품 (달달한 음료, 튀김, 디저트, 빵/면 중심 식사) 줄이기'
            },
            {
              id: 'all-nutrition-5',
              title: '전립선건강',
              desc: '전립선 건강제품(쏘팔메토) 챙겨먹기'
            },
            {
              id: 'all-nutrition-6',
              title: '관절/뼈 건강',
              desc: '관절/뼈 건강 제품(칼슘/비타민 D, 글루코사민, MSM, 비타민 C, 오미자추출물) 챙겨먹기'
            }
          ]
        },
        {
          key: 'exercise-all',
          title: '운동',
          open: false,
          items: [
            {
              id: 'all-exercise-1',
              title: '운동',
              desc: '계단 이용하기'
            }
          ]
        },
        {
          key: 'sleep-all',
          title: '수면',
          open: false,
          items: [
            {
              id: 'all-sleep-1',
              title: '수면건강',
              desc: '7~8시간 이상 수면하기'
            },
            {
              id: 'all-sleep-2',
              title: '수면건강',
              desc: '취침 1시간 전 TV, 스마트폰 등 전자기기 미사용'
            },
            {
              id: 'all-sleep-3',
              title: '수면건강',
              desc: '취침 5분 전 명상, 요가, 심호흡하기'
            },
            {
              id: 'all-sleep-4',
              title: '수면건강',
              desc: '식후 2시간 이후 취침'
            }
          ]
        },
        {
          key: 'life-all',
          title: '생활습관',
          open: true,
          items: [
            {
              id: 'all-life-1',
              title: '생활습관',
              desc: '취침 1시간 전 TV, 스마트폰등 전자기기 미사용',
              recommend: true
            },
          ]
        }
      ],
      successDates: [ /* 나의 인증 현황 퍼블 확인용 데이터 */
        "2026-07-05",
        "2026-07-08",
        "2026-07-10",
        "2026-07-11",
        "2026-07-17",
      ],
    }
  },
  setup() {
    const homeSwiper = ref(null);
    const onSwiper = (swiper) => {
      homeSwiper.value = swiper;
    };
    const onSlideChange = (swiper) => {
      const dailyComp = swiper.slides[swiper.activeIndex].querySelector(".slide-img--comp");
      if(dailyComp){
        dailyComp.classList.add("ani");
      }
      let dayList = document.querySelectorAll(".main--daily--date .date");
      dayList.forEach((el) => {
        const dayListValue = el.getAttribute("data-day");
        const swiperActiveValue = swiper.slides[swiper.activeIndex].getAttribute("data-day");

        if (dayListValue === swiperActiveValue) {
          dayList.forEach((element) => {
            element.classList.remove("on");
          });
          el.classList.add("on");
        }
      });
    };
    return {
      onSwiper,
      onSlideChange,
      homeSwiper,
    };
  },
  methods: {
    winWidth () { /* 브라우저 가로 사이즈 체크 */
      this.isPc = window.innerWidth > 920
    },

    /* [start] 260721 / 플로팅 탭 전환 핸들러 추가 */
    selectTeamTab (value) {
      this.tab = value

      this.$nextTick(() => {
        this.updateMainSticky()
      })
    },

    updateMainSticky () {
      this.winWidth()

      const scrollY = window.scrollY
      const homeAddBtn = document.querySelector(".home--addBtn")
      const stickyCardBox = document.querySelector(".main-sticky")
      const stickyArea = document.querySelector(".main--team")

      if (!stickyCardBox || !stickyArea) return

      const stickyAreaY = stickyArea.offsetTop
      const winHeight = window.innerHeight
      const isTeamArea = scrollY + winHeight / 2 >= stickyAreaY

      /* 상시 탭이면 무조건 숨김 */
      if (this.tab === 1) {
        stickyCardBox.style.display = "none"
        stickyCardBox.classList.remove("sticky")
        if (homeAddBtn) {
          homeAddBtn.classList.remove("active")
        }
        return
      }

      /* 챌린지 탭 + floatingDay true면 계속 플로팅 */
      if (this.floatingDay) {
        stickyCardBox.style.display = ""
        stickyCardBox.classList.add("sticky")
        if (homeAddBtn) {
          homeAddBtn.classList.remove("active")
        }
        return
      }

      /* 챌린지 탭 + floatingDay false일 때 스크롤 조건 */
      stickyCardBox.style.display = ""

      if (isTeamArea) {
        stickyCardBox.classList.remove("sticky")
        if (homeAddBtn) {
          homeAddBtn.classList.add("active")
        }
        return
      }

      stickyCardBox.classList.add("sticky")

      if (homeAddBtn) {
        homeAddBtn.classList.remove("active")
      }
    },
    /* [end] 260721 / 플로팅 탭 전환 핸들러 추가 */
    /*  팝업 열기 */
    popupOpen (val) {
      this.popup[val] = true
    },
    /* 팝업 닫기 */
    popupClose (val) {
      this.popup[val] = false
    },
    openCamera() {
      const input = document.getElementById("takePicture");
      input.capture = "environment"; // 후면 카메라 설정
      input.click();
      this.popup.dailyMethodPopup = false;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
        this.popup.dailyMethodPopup = false;
        this.popup.dailyCompPopup = true;
      }
    },
    dayBtn() {
      const dayBtn = document.querySelectorAll(".main--daily--date .date");
      const swiperList = Array.from(
        document.querySelectorAll(".main .main--daily--swiper .swiper-slide")
      );
      dayBtn.forEach((el) => {
        const dayValue = el.dataset.day;
        const matchIndex = swiperList.findIndex(
          (slide) => slide.dataset.day === dayValue
        );

        if (matchIndex !== -1) {
          el.classList.add("select");
        }

        el.addEventListener("click", () => {
          if (matchIndex !== -1) {
            this.homeSwiper.slideTo(matchIndex);
          }
        });
      });
    },
    toggleMissionGroup (group) {
      group.open = !group.open
    },
    selectMissionItem (mission) {
      this.selectedMissionId = mission.id
    },
    completeMissionSelect () {
      if (!this.selectedMissionId) {
        this.popup.noMissionPopup = true
        return
      }
      this.selectMission = true
      this.popup.missionPopup = false
    },
  },
  mounted () {
    this.winWidth()

    /* [start] 260721 / 플로팅 탭 전환 핸들러 추가 */
    this.stickyScrollHandler = () => {
      this.updateMainSticky()
    }

    window.addEventListener('scroll', this.stickyScrollHandler)

    this.$nextTick(() => {
      this.updateMainSticky()
    })
    /* [end] 260721 / 플로팅 탭 전환 핸들러 추가 */

    this.dayBtn()
  },
  beforeUnmount () {
    /* [start] 260721 / 플로팅 탭 전환 핸들러 추가 */
    if (this.stickyScrollHandler) {
      window.removeEventListener('scroll', this.stickyScrollHandler)
    }
    /* [end] 260721 / 플로팅 탭 전환 핸들러 추가 */
  },
  computed: {
    selectedMission () {
      const groups = [
        ...this.recommendMissionGroups,
        ...this.allMissionGroups
      ]
      for (const group of groups) {
        const mission = group.items.find(item => item.id === this.selectedMissionId)
        if (mission) {
          return {
            ...mission,
            groupTitle: group.title
          }
        }
      }
      return null
    },
    angle() { // 바늘 각도
      const clamped = Math.min(Math.max(this.agingSpeed, 0.5), 1.5)
      return ((clamped - 0.5) / 1.0) * 180 - 90
    },
  }
}
</script>

<template>
  <section class="main">
    <div class="main--analyze">
      <div v-if="!isAnalyze" class="main--analyze--before"> <!-- 건강수명분석 전 -->
        <video class="main--analyze--video" :src="'/img/video_main_graph.mp4'" autoplay muted playsinline></video>
        <p>건강수명 분석을 하고</p>
        <a @click="popup.surveyContinuePopup = true" href="javascript:void(0)" class="main--analyze--link">맞춤 미션 추천을<br>받아보세요</a>
      </div>
      <div v-else class="main--analyze--after"> <!-- 건강수명분석 후 -->
        <p>나의 건강수명분석과 미션</p>
        <div class="main--analyze--total">
          <div class="main--analyze--graph">
            <img src="/img/bg_main_agingspeed.png">
            <div class="main--analyze--needle-wrap">
              <div class="main--analyze--needle-center"> <!-- 배경색 - 기본 초록, .orange 노랑, .red 빨강 -->
                <img src="/img/icon_agingspeed_logo.svg">
              </div>
              <img class="main--analyze--needle" :style="{ transform: `translateX(-50%) rotate(${angle}deg)` }" src="/img/img_agingspeed_needle.svg">
            </div>
          </div>
          <div class="main--analyze--score">
            <p>노화속도</p>
            <p class="total" :class="0.9 < analyzeData.total && analyzeData.total <= 1.10 ? 'orange' :  1.10 < analyzeData.total ? 'red' : ''"
            >{{ analyzeData.total }}<span>배속</span></p>
          </div>
        </div>
        <!-- 퍼블 확인용 점수 컬러 기준 임의 설정 -->
        <div class="main--analyze--result">
          <div>
            <p class="score" :class="75 < analyzeData.aging && analyzeData.aging <= 90 ? 'orange' :  90 < analyzeData.total ? 'red' : ''">{{ analyzeData.aging }}<span>점</span></p>
            <p>노화억제</p>
          </div>
          <div>
            <p class="score" :class="80 < analyzeData.chronic && analyzeData.chronic <= 90 ? 'orange' :  90 < analyzeData.total ? 'red' : ''">{{ analyzeData.chronic }}<span>점</span></p>
            <p>만성질환 억제</p>
          </div>
          <div>
            <p class="score" :class="70 < analyzeData.muscles && analyzeData.muscles <= 80 ? 'orange' :  80 < analyzeData.muscles ? 'red' : ''">{{ analyzeData.muscles }}<span>점</span></p>
            <p>근육 밸런스</p>
          </div>
        </div>
      </div>
      <div class="main--analyze--btm" :class="{ active: selectedMission, open: selectedMissionOpen }">
        <button v-if="!selectedMissionId" @click="popup.missionPopup = true">
          <span v-if="!isAnalyze">기본 미션으로 시작하기</span> <!-- 건강수명분석 전 -->
          <span v-else>나의 맞춤 미션으로 선택하기</span> <!-- 건강수명분석 후 -->
        </button>
        <div v-else class="main--mission">
          <div class="main--mission__head" :class="{ open: selectedMissionOpen }">
            <div class="main--mission__title">
              <span class="main--mission__badge">{{ selectedMission.groupTitle }}</span>
              {{ selectedMission.desc }}
            </div>
            <button type="button" @click="selectedMissionOpen = !selectedMissionOpen"></button>
          </div>
          <transition name="downUp">
            <div v-show="selectedMissionOpen" class="main--mission__body">
              <span>#{{ selectedMission.title }}</span>
              <span>#{{12}}일째</span>
              <button type="button" class="main--mission__change" @click.stop="popup.missionPopup = true">미션 변경하기</button>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="main--daily">
      <div class="main--daily--box">
        <div class="main--daily--date">
          <button data-day="sun" class="date">일</button>
          <button data-day="mon" class="date">월</button>
          <button data-day="tue" class="date">화</button>
          <button data-day="wed" class="date">수</button>
          <button data-day="thu" class="date">목</button>
          <button data-day="fri" class="date">금</button>
          <button data-day="sat" class="date today on">토</button>
          <button class="date--more" @click="popup.myDailyPopup = true">
            <img src="/img/ico_plus.svg" /><span>더보기</span>
          </button>
        </div>

        <div class="main--daily--swiper">
          <swiper :slides-per-view="1" :space-between="24" @swiper="onSwiper" @slideChange="onSlideChange"
            dir="rtl">
            <swiper-slide data-day="sat">
              <div v-if="imageUrl" class="slide-img">
                <img class="slide-img--comp ani" src="/img/img_home_daily_comp.png" />
                <div class="slide-img--upload">
                  <img :src="imageUrl" alt="업로드된 이미지" />
                </div>
              </div>
              <div v-if="imageUrl" class="share-btn-wrap">
                <button class="share-btn"></button>
                <button class="img-btn"></button>
              </div>
              <div v-else class="upload-before">
                <button v-if="selectMission === false" @click="popup.noMissionPopup = true"></button>
                <!-- 것모닝 구조 -->
                <!-- <input type="file" id="uploadIcon" class="upload-icon" @change="onFileChange" hidden />
                <label for="uploadIcon" class="upload-label" :class="imageUrl ? 'slide-img--upload' : ''">
                  <img src="/img/img_home_daily_add.png" @click="openCamera" />
                  <div>
                    <p class="upload-date">2026년 7월 16일</p>
                    <p class="upload-text">미션 인증하기</p>
                  </div>
                </label> -->
                <!-- 퍼블 팝업 확인용 -->
                <label for="" class="upload-label" :class="imageUrl ? 'slide-img--upload' : ''">
                  <img src="/img/img_home_daily_add.png" @click="popup.dailyMethodPopup = true" />
                  <div>
                    <p class="upload-date">2026년 7월 16일</p>
                    <p class="upload-text">미션 인증하기</p>
                  </div>
                </label>
              </div>
            </swiper-slide>
            <swiper-slide v-for="item in dailyData" :key="item.day" :data-day="item.day">
              <div class="slider-wrap">
                <div class="slide-img">
                  <img class="slide-img--comp" src="/img/img_home_daily_comp.png" />
                  <div class="slide-img--upload">
                    <img :src="item.img" />
                  </div>
                </div>
                <div class="share-btn-wrap">
                  <button class="share-btn"></button>
                  <button class="img-btn"></button>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

      </div>
    </div>
    <div class="main--team">
      <p class="main--team--tit">나의 팀</p>
      <div class="main--team--folder">
        <div class="tab-wrap">
          <!-- 260721 / 플로팅 탭 전환 핸들러 추가 - 버튼 클릭 이벤트 수정 -->
          <button class="tab" type="button" @click="selectTeamTab(0)" :class="tab === 0 ? 'active' : ''">챌린지</button>
          <button class="tab" type="button" @click="selectTeamTab(1)" :class="tab === 1 ? 'active' : ''">상시</button>
        </div>
        <div v-if="tab === 0" class="tab-content tab-content-1">
          <div class="tab-content--active"><span>챌린지</span></div>
          <!-- 챌린지 없는 경우 -->
          <!-- <div class="main--team--no">
            <img src="/img/img_home_error.png">
            <p>참여중인 챌린지가 없습니다.</p>
          </div> -->
          <div>
            <div class="challenge--box-tit">6월 건강수면 챌린지팀</div>
            <div class="challenge--box-tag">진행중</div>
            <div class="challenge--box-info">
              <p>
                <span>성공조건</span>
                <span><em>팀 인증률</em><strong>80%</strong><em>이상</em></span>
              </p>
              <p>
                <span>전체기간</span>
                <span>2026.06.11~2025.08.20 /<em>70일</em></span>
              </p>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>팀 인증률</span><strong><span>40</span>%</strong></div>
                <TargetGauge :gaugePer="40" :targetPer="60" :compPer="80"></TargetGauge>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="tab === 1" class="tab-content tab-content-2">
          <div class="tab-content--active"><span>상시</span></div>
          <div class="main--team--no">
            <img src="/img/img_home_error.png">
            <p>참여중인 상시 팀이 없습니다.</p>
          </div>
          <!-- <div>
            <div class="challenge--box-tit">6월 건강수면 챌린지팀</div>
            <div class="challenge--box-tag">진행중</div>
            <div class="challenge--box-info">
              <p>
                <span>성공조건</span>
                <span><em>팀 인증률</em><strong>80%</strong><em>이상</em></span>
              </p>
              <p>
                <span>전체기간</span>
                <span>2026.06.11~2025.08.20 /<em>70일</em></span>
              </p>
            </div>
            <div class="challenge--box-rate">
              <div class="challenge--box-rate--wrap">
                <div class="challenge--box-rate--per"><span>팀 인증률</span><strong><span>40</span>%</strong></div>
                <TargetGauge :gaugePer="40" :targetPer="60" :compPer="80" :bgColor="'green'"></TargetGauge>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 하단 플로팅 -->
    <div v-if="!isPc" class="main-sticky">
      <!-- 진행 전 -->
      <div v-if="floatingDay" class="main-sticky-before">
        <strong>챌린지 시작 D-$00$</strong>
        <span>챌린지 참여를 위해 팀에 참여해 주세요.</span>
        <button @click="floatingDay = false; updateMainSticky()"></button> <!-- 260721 / 플로팅 탭 전환 핸들러 추가 -->
      </div>
      <!-- 진행중 -->
      <div v-else class="challenge--box-rate--wrap">
        <div class="challenge--box-rate--per"><span>팀 인증률</span><strong><span>40</span>%</strong></div>
        <TargetGauge :gaugePer="40" :compPer="80"></TargetGauge>
      </div>
    </div>
  </section>

  <!-- 설문 이어하기 팝업  -->
  <BasePopup v-if="popup.surveyContinuePopup"> 
    <template v-slot:contents>
      <p class="pop-text-light">입력중인 건강 설문이 있습니다.</p>
      <p class="pop-text-bold">이어서 진행하시겠습니까?</p>
      <div class="pop-btn-wrap"> <!-- 건강분석설문 이동 필요 -->
        <button type="button" @click="popup.surveyContinuePopup = false, popup.noCouponPopup = true" class="pop-btn pop-btn--gray">새로하기</button> 
        <button type="button" @click="popup.surveyContinuePopup = false, popup.noCouponPopup = true" class="pop-btn pop-btn--green">이어하기</button>
      </div>
    </template>
  </BasePopup>

  <!-- 분석권 없을 시 팝업  -->
  <BasePopup v-if="popup.noCouponPopup"> 
    <template v-slot:contents>
      <p class="pop-text-bold">사용 가능한 분석권이 없어<br>분석을 시작할 수 없습니다.</p>
      <p class="pop-text-caption center">※ 쿠폰은 암웨이 홈페이지에서 구매 하신 후 사용해 주세요</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="popup.noCouponPopup = false, isAnalyze = true" class="pop-btn pop-btn--green">확인</button> <!-- 퍼블 확인을 위해 isAnalyze true 설정 -->
      </div>
    </template>
  </BasePopup>

  <!-- 선택 미션 없을 시 팝업  -->
  <BasePopupClose v-if="popup.noMissionPopup" :close-btn="false">
    <template v-slot:title>선택된 미션이 없습니다.</template>
    <template v-slot:contents>
      <p class="pop-text-light">미션을 선택해 인증을 진행해 주세요.</p>
    </template>
    <template v-slot:button>
      <button type="button" @click="popup.noMissionPopup = false" class="pop-btn pop-btn--green">확인</button>
    </template>
  </BasePopupClose>

  <!-- 인증완료 팝업  -->
  <BasePopupClose v-if="popup.dailyCompPopup" :close-btn="false">
    <template v-slot:title>인증완료</template>
    <template v-slot:contents>
      <p class="pop-text-light">2026년 6월 26일<br>미션 인증이 완료되었습니다.</p>
    </template>
    <template v-slot:button>
      <button type="button" @click="popup.dailyCompPopup = false" class="pop-btn pop-btn--green">확인</button>
    </template>
  </BasePopupClose>

  <!-- 인증방법 선택 팝업  -->
  <BasePopupClose v-if="popup.dailyMethodPopup" @popupClose="popupClose('dailyMethodPopup')">
    <template v-slot:title>인증방법 선택</template>
    <template v-slot:contents>
      <div class="popup--ico-btn--wrap">
        <!-- 사진 찍기 버튼 -->
        <input type="file" accept = "image/*" id="takePicture" @change="openCamera" capture="environment" hidden />
        <label for="takePicture" class="popup--ico-btn">
          <span>사진 찍기</span>
          <div class="popup--ico-btn--ico">
            <img src="/img/ico_main_picture-take.svg" />
          </div>
        </label>
        <!-- 사진 보관함  -->
        <input type="file" accept = "image/*" id="uploadPicture" @change="onFileChange" hidden />
        <label for="uploadPicture" class="popup--ico-btn">
          <span>사진 보관함</span>
          <div class="popup--ico-btn--ico">
            <img src="/img/ico_main_picture-box.svg"/>
          </div>
        </label>
      </div>
    </template>
  </BasePopupClose>
  
  <!-- 미션선택 팝업  -->
  <!-- 260721 / mission-select 내부 구조 수정 -->
  <BasePopupClose v-if="popup.missionPopup" class="MissionSelectPopup" @popupClose="popupClose('missionPopup')">
    <template v-slot:title>미션 선택하기</template>
    <template v-slot:contents>
      <TabRound :tabs="[{title: isAnalyze ? '추천 미션' : '기본 미션'}, {title:'전체 미션'}]">
        <template #tab-0>
          <div class="mission-select">
            <div v-for="group in recommendMissionGroups" :key="group.key" class="mission-select__group">
              <div class="mission-select__head" :class="{ open: group.open }">
                <span>{{ group.title }}</span>
                <button type="button" class="mission-select__arrow" @click="toggleMissionGroup(group)"></button>

                <transition name="downUp">
                  <div v-show="group.open" class="mission-select__body">
                    <button v-for="mission in group.items" :key="mission.id" type="button" class="mission-card" :class="{ active: selectedMissionId === mission.id }" @click="selectMissionItem(mission)">
                      <span class="mission-card__title">
                        {{ mission.title }}
                        <span v-if="selectedMissionId === mission.id" class="mission-card__check"></span>
                      </span>
                      <span class="mission-card__desc">{{ mission.desc }}</span>
                      <span v-if="mission.recommend" class="mission-card__badge" >{{ isAnalyze ? '추천' : '기본' }}</span>
                    </button>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </template>

        <template #tab-1>
          <div class="mission-select">
            <div v-for="group in allMissionGroups" :key="group.key" class="mission-select__group">
              <div class="mission-select__head" :class="{ open: group.open }">
                <span>{{ group.title }}</span>
                <button type="button" class="mission-select__arrow" @click="toggleMissionGroup(group)"></button>

                <transition name="downUp">
                  <div v-show="group.open" class="mission-select__body">
                    <button v-for="mission in group.items" :key="mission.id" type="button" class="mission-card" :class="{ active: selectedMissionId === mission.id }" @click="selectMissionItem(mission)">
                      <span class="mission-card__title">
                        {{ mission.title }}
                        <span v-if="selectedMissionId === mission.id" class="mission-card__check"></span>
                      </span>
                      <span class="mission-card__desc">{{ mission.desc }}</span>
                      <span v-if="mission.recommend" class="mission-card__badge" >{{ isAnalyze ? '추천' : '기본' }}</span>
                    </button>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </template>
      </TabRound>
    </template>
    <template v-slot:button>
      <button type="button" @click="completeMissionSelect" class="pop-btn pop-btn--green" :disabled="!selectedMissionId">선택 완료</button>
    </template>
  </BasePopupClose>

  <!-- 나의 인증 현황 팝업 -->
  <MainCalenderPop v-if="popup.myDailyPopup" @popupClose="popupClose('myDailyPopup')" :success-dates="successDates">
    <template v-slot:title>나의 인증 현황</template>
  </MainCalenderPop>

  <!-- 핀/배지 달성 팝업 -->
  <!-- <BasePopupBadge type="pin" frontImg="/img/pin_ruby.svg" backImg="/img/pin_ruby-back.svg">$마웰랩 핀 명칭$</BasePopupBadge> -->
  <!-- <BasePopupBadge type="badge" frontImg="/img/badge_happy-birthday.svg" backImg="/img/badge_happy-birthday-back.svg">$배지 명칭$</BasePopupBadge> -->

  <AddBtnHome />
</template>

<style lang="scss" scoped>
</style>
