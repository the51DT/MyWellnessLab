<script>
import { Navigation, Pagination } from 'swiper/modules'
import { SwiperSlide } from 'swiper/vue'
import AnalyzeAgingSpeed from '@/views/publishing/analyze/AnalyzeAgingSpeed.vue'

export default {
  name: 'Home',
  components: {
    AnalyzeAgingSpeed,
    SwiperSlide
  },
  data () {
    return {
      isLogin: true, /* 231206 로그인했나 안했나 임시 */
      modules: [Navigation, Pagination], /* 231206 슬라이더 관련 */
      data: [
        {
          date: '2023.10.28',
          speed: 1.84,
          index1: 56,
          index2: 67
        },
        {
          date: '2023.10.28',
          speed: 1.84,
          index1: 56,
          index2: 67
        },
        {
          date: '2023.10.28',
          speed: 1.84,
          index1: 56,
          index2: 67
        }
      ],
      isScroll: false,
      isBottom: false
    }
  },
  methods: {
    winWidth () { /* 브라우저 가로 사이즈 체크 */
      this.isScroll = window.scrollY > 200
      if (window.scrollY > 500) {
        this.isBottom = true
      } else {
        this.isBottom = false
      }
    }
  },
  mounted () {
    this.winWidth()
    window.addEventListener('scroll', () => {
      this.winWidth()
    })

    // 231213 스와이퍼 첫 슬라이드 활성화 시 클래스 추가, 마지막 슬라이드 활성화 시 클래스 추가
    // const slide = this.$refs.swiperDom;
    // slide.addEventListener("slideChange", ()=>{
    //   let activeSlide = slide.slides[slide.activeIndex];
    //   if(activeSlide.classList.contains("swiper-slide-active")){
    //     activeSlide.classList.add("firstSlide");
    //   }
    // })
  }
}
</script>

<template>
  <section class="home">
    <p class="home--hi"><strong>이하늘</strong>님 안녕하세요</p>

    <div class="home--msg" :class="isLogin ? 'login-after' : ''">
      <div class="home--balloon">
        <span v-if="!isLogin">아직 분석된 결과가 없습니다</span>
        <span v-else class="home--greeting">분석결과를 확인하고 생활습관을 건강하게 만들어보세요!
          <span class="home--doctor-s" />
        </span>
      </div>
    </div>

    <div class="home--start-wrap">

      <div class="home--my-result">
        <h2 v-if="isLogin" class="home--my-result--tit">나의 웰니스 분석 결과</h2>
        <swiper

          :centered-slides="true"
          :space-between="8"
          :pagination="{
            clickable: true,
          }"
          :navigation="true"
          :breakpoints="{
            '0': {
              slidesPerView: 1.2,
            },
            '700': {
              slidesPerView: 2,
            },
            '1000': {
              slidesPerView: 3,
            },
          }"
          :modules="modules"
          class="pay-method--swiper"
          ref="swiperDom">
          <swiper-slide v-for="item in data">
            <div class="home-swiper">
              <p class="home--date">분석일: {{item.date}}</p>
              <a href="javascript:void(0)" class="home--view-result">자세히 보기</a>
              <div class="home--aging">
                <h3 class="home--aging-tit">노화속도</h3>
                <div> <!--231206 그래프-->
                  <AnalyzeAgingSpeed :isMain="true" />
                </div>
              </div>
              <div class="home--index">

                <div>
                  <h4 class="home--index-tit">만성질환 억제<br />분석 지수</h4>
                  <div class="home--index-digit">
                    <strong class="danger">{{item.index1}}</strong>점 <!--231206 위험: danger, 주의: caution, 관심: interest 클래스 변경 요망-->
                  </div>
                </div>

                <div>
                  <h4 class="home--index-tit">노화 억제<br />분석 지수</h4>
                  <div class="home--index-digit">
                    <strong class="interest">{{item.index2}}</strong>점
                  </div>
                </div>

              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="home-swiper blank" :class="data.length === 0 ? 'small' : ''"> <!--231211 분석 데이터가 없을 경우 클래스 추가-->
              <a href="javascript:void(0)" class="home--start">
                <p class="home--txt">건강한 생활습관 형성의 시작</p>
                <p class="home--tit">
                  웰니스<br />
                  분석하기
                </p>
              </a>
              <div class="home--doctor" /> <!--의사 이미지-->
              <div class="home--plus" />
            </div>
          </swiper-slide>
        </swiper>
      </div>

    </div>

    <div class="home--instant">
      <a href="javascript:void(0)" class="home--instant-btn">일회성으로 분석 하기</a>
    </div>

    <div class="home--visual">
      <img src="/img/img_home.png?231213" alt="" />
    </div> <!--비주얼 이미지-->

    <div v-if="isLogin" class="btn--re-checkup" :class="[isScroll ? 'active' : '', isBottom ? 'bottom' : '']">
      <span>웰니스<br />분석하기</span>
    </div>

  </section>
</template>

<style lang="scss" scoped>
:deep(.swiper-button-next){
  top: var(--swiper-navigation-top-offset, 44%);
  @media (max-width: 1000px) {
    display: none;
  }
}
:deep(.swiper-button-prev) {
  @media (max-width: 1000px) {
    display: none;
  }
}
:deep(.swiper-button-next:after, .swiper-rtl .swiper-button-prev:after){
  content: "";
  display: block;
  width: 40px;
  height: 40px;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 60%;
}
:deep(.swiper-button-prev, .swiper-button-next){
  top: var(--swiper-navigation-top-offset, 44%);
}
:deep(.swiper-button-next, .swiper-rtl .swiper-button-prev) {
  right: auto;
  left: 50%;
  margin-left: 17%;
}
:deep(.swiper-button-prev, .swiper-rtl .swiper-button-next) {
  left: auto;
  right: 50%;
  margin-right: 18.7%;
}
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  content: "";
  display: block;
  width: 40px;
  height: 40px;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 60%;
  transform: rotate(180deg);
}
:deep(.swiper-button-prev.swiper-button-disabled){
  display: none;
}
:deep(.swiper-button-next.swiper-button-disabled){
  display: none;
}
</style>
