<script>
import { ref } from 'vue'
import BasePopup from '@/views/publishing/BasePopup.vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import AnalyzeAgingSpeed from '@/views/publishing/analyze/AnalyzeAgingSpeed.vue'

export default {
  name: 'Main',
  components: {
    BasePopup,
    BasePopupClose,
    AnalyzeAgingSpeed,
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      isScroll: false,
      isBottom: false,
      imageUrl: ref(null),
      tab: ref(0),
      analyzeData: { /* 건강수명분석 퍼블 확인용 */
        total: 0.67,
        aging: 77,
        chronic: 79,
        muscles: 85,
      },
      popup: false,
      isAnalyze: false, /* 건강수명분석 여부 */
      selectMission: false, /* 미션선택 여부 */
      missionPopup: false, /* 미션선택 팝업 */
      noMissionPopup: false, /* 선택 미션 없을 시 팝업 */
      surveyContinuePopup: false, /* 설문 이어하기 팝업 */
      noCouponPopup: false, /* 분석권 없을 시 팝업 */
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
          img: 'https://automation.vuejs.org/images/chrome_frameworks_fund.avif',
        },
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
      this.isScroll = window.scrollY > 200
      if (window.scrollY > 500) {
        this.isBottom = true
      } else {
        this.isBottom = false
      }
    },
    /*  팝업 열기 */
    popupOpen () {
      this.popup = true
    },
    /* 팝업 닫기 */
    popupClose () {
      this.popup = false
    },
    openCamera() {
      const input = document.getElementById("uploadIcon");
      input.capture = "environment"; // 후면 카메라 설정
      input.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
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
  },
  mounted () {
    this.winWidth()
    window.addEventListener('scroll', () => {
      this.winWidth()
    })
    this.dayBtn()
  }
}
</script>

<template>
  <section class="main">
    <div class="main--analyze">
      <div v-if="!isAnalyze" class="main--analyze--before"> <!-- 건강수명분석 전 -->
        <video class="main--analyze--video" :src="'/img/video_main_graph.mp4'" autoplay muted playsinline></video>
        <p>나만의 추천 미션 확인을 위해,</p>
        <a @click="surveyContinuePopup = true" href="javascript:void(0)" class="main--analyze--link">건강수면 분석<br>시작하기</a>
      </div>
      <div v-else class="main--analyze--after"> <!-- 건강수명분석 후 -->
        <p>나의 건강수명분석과 미션</p>
        <div class="main--analyze--total">
          <div class="main--analyze--graph">
            <AnalyzeAgingSpeed :isNewMain="true" :isMain="true"/>
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
      <div class="main--analyze--btm">
        <button @click="missionPopup = true">
          <span v-if="!isAnalyze">미션 선택하기</span> <!-- 건강수명분석 전 -->
          <span v-else>나의 추천 미션 보기</span> <!-- 건강수명분석 후 -->
        </button>
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
          <button class="date--more">
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
              <div v-if="imageUrl" class="btn-wrap">
                <button class="share-btn"></button>
                <button class="img-btn"></button>
              </div>
              <div v-else class="upload-before">
                <button v-if="selectMission === false" @click="noMissionPopup = true"></button>
                <input type="file" id="uploadIcon" class="upload-icon" @change="onFileChange" hidden />
                <label for="uploadIcon" class="upload-label" :class="imageUrl ? 'slide-img--upload' : ''">
                  <img src="/img/img_home_daily_add.png" @click="openCamera" />
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
                <div class="btn-wrap">
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
          <button class="tab" type="button" @click="tab = 0" :class="tab === 0 ? 'active' : ''">챌린지</button>
          <button class="tab" type="button" @click="tab = 1" :class="tab === 1 ? 'active' : ''">상시</button>
        </div>
        <div v-if="tab === 0" class="tab-content tab-content-1">
          <div class="tab-content--active">챌린지</div>
          <div class="main--team--no">
            <img src="/img/img_home_error.png">
            <p>참여중인 챌린지가 없습니다.</p>
          </div>
        </div>
        <div v-else-if="tab === 1" class="tab-content tab-content-2">
          <div class="tab-content--active">상시</div>
          <div class="main--team--no">
            <img src="/img/img_home_error.png">
            <p>참여중인 상시 팀이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 설문 이어하기 팝업  -->
  <BasePopup v-if="surveyContinuePopup"> 
    <template v-slot:contents>
      <p class="pop-text-light">입력중인 건강 설문이 있습니다.</p>
      <p class="pop-text-bold">이어서 진행하시겠습니까?</p>
      <div class="pop-btn-wrap"> <!-- 건강분석설문 이동 필요 -->
        <button type="button" @click="surveyContinuePopup = false, noCouponPopup = true" class="pop-btn pop-btn--gray">새로하기</button> 
        <button type="button" @click="surveyContinuePopup = false, noCouponPopup = true" class="pop-btn pop-btn--green">이어하기</button>
      </div>
    </template>
  </BasePopup>

  <!-- 분석권 없을 시 팝업  -->
  <BasePopup v-if="noCouponPopup"> 
    <template v-slot:contents>
      <p class="pop-text-bold">사용 가능한 웰니스 분석 쿠폰이 없어<br>분석을 시작할 수 없습니다.</p>
      <p class="pop-text-caption center">※ 쿠폰은 암웨이 홈페이지에서 구매 하신 후 사용해 주세요</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="noCouponPopup = false, isAnalyze = true" class="pop-btn pop-btn--green">확인</button> <!-- 퍼블 확인을 위해 isAnalyze true 설정 -->
      </div>
    </template>
  </BasePopup>

  <!-- 선택 미션 없을 시 팝업  -->
  <BasePopupClose v-if="noMissionPopup" :close-btn="false">
    <template v-slot:title>선택된 미션이 없습니다.</template>
    <template v-slot:contents>
      <p class="pop-text-light">미션을 선택해 인증을 진행해 주세요.</p>
      <div class="pop-btn-wrap">
        <button type="button" @click="noMissionPopup = false" class="pop-btn pop-btn--green">확인</button>
      </div>
    </template>
  </BasePopupClose>
  
  <!-- 미션선택 팝업  -->
  <BasePopupClose v-if="missionPopup">
    <template v-slot:title>미션 선택하기</template>
    <template v-slot:contents>
      <div class="pop-btn-wrap">
        <button type="button" @click="missionPopup = false" class="pop-btn pop-btn--green">선택 완료</button>
      </div>
    </template>
  </BasePopupClose>
</template>

<style lang="scss" scoped>
</style>
