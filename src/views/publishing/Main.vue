<script>
import { ref } from 'vue'
import BasePopup from '@/views/publishing/BasePopup.vue'
import BasePopupClose from '@/views/publishing/BasePopupClose.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import AnalyzeAgingSpeed from '@/views/publishing/analyze/AnalyzeAgingSpeed.vue'
import AddBtnHome from '@/components/AddBtnHome.vue'
import TabRound from '@/components/TabRound.vue'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'

export default {
  name: 'Main',
  components: {
    BasePopup,
    BasePopupClose,
    AnalyzeAgingSpeed,
    AddBtnHome,
    TabRound,
    BaseOpener,
    BasePopupTit,
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      isScroll: false,
      isBottom: false,
      imageUrl: ref(null),
      tab: ref(0),
      missionTab: ref(0),
      analyzeData: { /* 건강수명분석 퍼블 확인용 */
        total: 0.67,
        aging: 77,
        chronic: 79,
        muscles: 85,
      },
      isOpen: false, /* 미션 선택 팝업 아코디언 오프너 */
      isAnalyze: false, /* 건강수명분석 여부 */
      selectMission: false, /* 미션선택 여부 */
      popup: {
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
          img: 'https://automation.vuejs.org/images/chrome_frameworks_fund.avif',
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
              title: '기본',
              desc: '것모닝하기(아침에 물, 유산균, 프로틴 섭취)',
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
              title: '기본',
              desc: '20~30분 유산소 운동(빠른 걷기, 실내 자전거, 수영, 가벼운 조깅)',
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
              title: '기본',
              desc: '7시간 이상 연속 수면하기',
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
              title: '기본',
              desc: '취침 1시간 전 TV, 스마트폰등 전자기기 미사용',
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
              title: '영양',
              desc: '채소 1회 이상 섭취하기'
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
    window.addEventListener('scroll', () => {
      this.winWidth()
    })
    this.dayBtn()
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
    }
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
      <div class="main--analyze--btm" :class="{ active: selectedMission, open: selectedMissionOpen }">
        <button v-if="!selectedMissionId" @click="popup.missionPopup = true">
          <span v-if="!isAnalyze">기본 미션으로 시작하기</span> <!-- 건강수명분석 전 -->
          <span v-else>나의 추천 미션 보기</span> <!-- 건강수명분석 후 -->
        </button>
        <div v-else class="main--mission">
          <div class="main--mission__head" :class="{ open: selectedMissionOpen }">
            <span class="main--mission__badge">{{ selectedMission.groupTitle }}</span>
            <span class="main--mission__day">{{12}}일째</span>
            <span class="main--mission__title">{{ !selectedMissionOpen ? selectedMission.desc : selectedMission.title }}</span>
            <button type="button" @click="selectedMissionOpen = !selectedMissionOpen"></button>
          </div>
          <transition name="downUp">
            <div v-show="selectedMissionOpen" class="main--mission__body">
              <p>{{ selectedMission.desc }}</p>
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
              <div v-if="imageUrl" class="btn-wrap">
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
      <!-- 사진 찍기 버튼 -->
      <div>
        <input type="file" accept = "image/*" id="takePicture" @change="openCamera" capture="environment" hidden />
        <label for="takePicture">
          <div class="picture-btn">
            <span> 사진 찍기 </span>
            <div class="picture-btn-icon">
              <img src="/img/ico_main_picture-take.svg" alt="사진 찍기 아이콘" />
            </div>
          </div>
        </label>
      </div>
      <!-- 사진 보관함  -->
      <div>
        <input type="file" accept = "image/*" id="uploadPicture" @change="onFileChange" hidden />
        <label for="uploadPicture">
          <div class="picture-btn">
            <span> 사진 보관함 </span>
            <div class="picture-btn-icon">
              <img src="/img/ico_main_picture-box.svg" alt="사진 보관함 아이콘" />
            </div>
          </div>
        </label>
      </div>
    </template>
  </BasePopupClose>
  
  <!-- 미션선택 팝업  -->
  <BasePopupClose v-if="popup.missionPopup" class="MissionSelectPopup" @popupClose="popupClose('missionPopup')">
    <template v-slot:title>미션 선택하기</template>
    <template v-slot:contents>
      <TabRound :tabs="['추천 미션', '전체 미션']">
        <template #tab-0>
          <div class="mission-select">
            <div v-for="group in recommendMissionGroups" :key="group.key" class="mission-select__group">
              <button type="button" class="mission-select__head" :class="{ open: group.open }" @click="toggleMissionGroup(group)">
                <span>{{ group.title }}</span>
                <span class="mission-select__arrow"></span>
              </button>

              <transition name="downUp">
                <div v-show="group.open" class="mission-select__body">
                  <button v-for="mission in group.items" :key="mission.id" type="button" class="mission-card" :class="{ active: selectedMissionId === mission.id }" @click="selectMissionItem(mission)">
                    <span class="mission-card__title">
                      {{ mission.title }}
                      <span v-if="selectedMissionId === mission.id" class="mission-card__check"></span>
                    </span>
                    <span class="mission-card__desc">{{ mission.desc }}</span>
                    <span v-if="mission.recommend" class="mission-card__badge">추천</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </template>

        <template #tab-1>
          <div class="mission-select">
            <div v-for="group in allMissionGroups" :key="group.key" class="mission-select__group">
              <button type="button" class="mission-select__head" :class="{ open: group.open }" @click="toggleMissionGroup(group)">
                <span>{{ group.title }}</span>
                <span class="mission-select__arrow"></span>
              </button>

              <transition name="downUp">
                <div v-show="group.open" class="mission-select__body">
                  <button v-for="mission in group.items" :key="mission.id" type="button" class="mission-card" :class="{ active: selectedMissionId === mission.id }" @click="selectMissionItem(mission)">
                    <span class="mission-card__title">
                      {{ mission.title }}
                      <span v-if="selectedMissionId === mission.id" class="mission-card__check"></span>
                    </span>
                    <span class="mission-card__desc">{{ mission.desc }}</span>
                    <span v-if="mission.recommend" class="mission-card__badge" >추천</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </TabRound>
    </template>
    <template v-slot:button>
      <button type="button" @click="completeMissionSelect" class="pop-btn" :class="!selectedMissionId ? 'pop-btn--gray' : 'pop-btn--green'" :disabled="!selectedMissionId">선택 완료</button>
    </template>
  </BasePopupClose>

  <!-- 나의 인증 현황 팝업 -->
  <BasePopupTit v-if="popup.myDailyPopup" class="MissionSelectPopup" @popupClose="popupClose('myDailyPopup')">
    <template v-slot:title>나의 인증 현황</template>
    <template v-slot:contents>
      <VDatePicker
        v-model="selectDate"
        mode="date"
        :isToday="true"
        :attributes="attributes"
        :model-config="config"
        :masks="mask"
        is-required />
      <div class="pop-btn-wrap">
        <button type="button" @click="popupClose('myDailyPopup')" class="pop-btn pop-btn--green">인증 공유하기</button>
      </div>
    </template>
  </BasePopupTit>
  <AddBtnHome />
</template>

<style lang="scss" scoped>
</style>
