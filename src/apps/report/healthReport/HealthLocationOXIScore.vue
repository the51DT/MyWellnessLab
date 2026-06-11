<script setup>
import { ref, onMounted, watch, nextTick} from 'vue';
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import cardComponent from '@/components/card/CardComponent.vue'
import {createGaugeChart} from '@/utils/chartConfig.js'
import { ageToAgeGroup, splitByNewLine } from '@/utils/common.js'
import { health_checkup_oxi_image } from '@/utils/render.js'
import * as echarts from "echarts";

const echart = ref(null)
const myBottomSheet = ref(null)

const oxi = ref({
  score: 0, // oxi 값
  total_mean: 0,  // 전체 평균값
  age_mean: 0,  // 동일 성별 연령대 평균 값
  rank: 0,  // 등수
  msg: new Array()  // 메시지
})
const userAge = ref(0)
const userGender = ref('')
const scrollbarHeight = ref("")
const isCardFliped= ref(false)
const props = defineProps({
  title:{
    type: String,
    required: true
  },
  healthReportScoreData:{
    type: Object,
    required: false
  },
  userInfo: {
    type: Object,
    required: true
  },
  activeCardNumber: {
    type: Number,
    required: true
  }
})
const myChart = ref(null)
watch(() => props.activeCardNumber, async (newVal) => {
  if(newVal == 2) {
    if(isCardFliped.value == false){
      setData(props.healthReportScoreData)
      chartConfig()
      setTimeout(() => {
        resizeMessage()
      }, 100)
    }
    
    window.addEventListener("resize", resizeMessage);
  } else {
    // myChart.value = null;
    window.removeEventListener("resize", resizeMessage);
    window.removeEventListener('resize', () => {myChart.value.resize();});
  }
})
watch(() => props.healthReportScoreData, async (newVal) => {
  setData(newVal)
})
onMounted ( async () => {
})
const setData = (newData) => {
  oxi.value.score = newData.hq_oxi.score
  oxi.value.total_mean = newData.hq_oxi.t_mean
  oxi.value.age_mean = newData.hq_oxi.mean
  oxi.value.msg = splitByNewLine(newData.hq_oxi.msg)
  oxi.value.rank = newData.hq_oxi.percent
  userAge.value = newData.hqReference.age
  userGender.value = props.userInfo.user_gender == 2 ? '여성' : '남성'

}
const resizeMessage = async () => {
  
  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_main_title = document.querySelector('.card-main-title') // 카드 제목
  const card_content_title = document.querySelector('.card-content-title')  // 카드 내용 제목
  const chart_wrap = document.querySelector('.card-content-box .container'); // 차트 부분
  const rank_popup = document.querySelector('.desc-popup-content')  // 랭크 팝업 클릭 부분
  const score_content = document.querySelector('.desc-score-content')  // 점수 부분

  const marginTop = parseFloat(window.getComputedStyle(score_content).marginTop);
  const marginBottom = parseFloat(window.getComputedStyle(score_content).marginBottom);
  const score_content_h = score_content.offsetHeight + marginTop + marginBottom;
  
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분
  const main_height = card_content_box.offsetHeight - (
    card_main_title.offsetHeight + chart_wrap.offsetHeight + card_content_title.offsetHeight + rank_popup.offsetHeight + score_content_h
  );

  // 설명 부분 스크롤 높이 --> 0.6 은 실제 그려질때 조정이 필요하기 때문
  const card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`
}
const displayPopup = () => {
  // bottom sheet 가 기본 1개가 있기 때문 --> 공통으로 쓰는 팝업 1개가 기본으로 지정되어있음
  document.querySelectorAll('.bottom-sheet__content')[1].setAttribute('style', `height: 60% !important`)
  myBottomSheet.value.open()
  
}
const chartConfig = async () => {
  await nextTick()
  if(document.querySelector('#OxiChart') == null) {
    return
  }
  var chartDom = document.querySelector('#OxiChart')
  var option = await createGaugeChart(oxi.value.score, "#E97B00");
  myChart.value = echarts.init(chartDom);
  myChart.value.setOption(option);
  window.addEventListener('resize', () => {myChart.value.resize();});
}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
  if(new_value == false) {
    chartConfig() // Flip이 끝나고 차트 그리기
  }
}

</script>

<template>
  <div id="OxiPage">
    <cardComponent :title=title :more="true" :description-title="'노화 억제 분석 지수란?'"  :activeCard="props.activeCardNumber==2" @card-fliped="cardFliped">
      <template v-slot:content v-if="isCardFliped== false">
        
        <div class="card-content-title first">내 몸이 산화 스트레스를 얼마나 잘 견디고 있는지 확인해 보세요.</div>
        <div class="container" >
          <div class="chart"></div>
          <div class="echart" ref="echart" id="OxiChart"></div>
          <div class="title">
            <div class="score">{{ oxi.score }}</div>
          </div>
        
        </div>
        <div class="desc-popup-content" >
          <div class="popup-title" @click="displayPopup" >
            {{ageToAgeGroup(userAge)}}대 {{userGender}} 100명 중 <span class="my-rank pl-0-2 pr-0-5">{{ oxi.rank }}등</span>
            <i class="mark-arrow-right"></i>
          </div>
        </div>
        <div class="desc-score-content">
          <div class="score-age-avg pr-1">
            {{ageToAgeGroup(userAge)}}대 {{userGender}} 평균 <span class="score pl-0-2">{{oxi.age_mean}}점</span>
          </div>|
          <div class="score-total-avg pl-1">
            성인 평균 <span class="score pl-0-2 ">{{oxi.total_mean}}점</span>
          </div>
        </div>
        
        <div class="card-front-description">
        <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight!=''"> 
            <div class="card-description">
              <div class="description-box">
                <div class="description" v-for="item in oxi.msg">
                  <p>{{item}}</p>
                </div>
              </div>
            </div>
          </Scrollbar>
        </div>
        
      </template>
      <template v-slot:description>
        <div class="description">
          <p>노화 억제 분석 지수는 한국 성인 빅데이터와 인공지능 기술을 이용해 만든 평가도구 입니다. </p>
        </div>
        <div class="description">
          <p>이 도구는 우리 몸이 산화 스트레스, 즉 몸속의 불필요한 화학반응으로부터 얼마나 스스로를 잘 보호하는지를 100점 만점으로  측정해줍니다. 점수가 높을수록 몸이 건강하게 유지될 수 있다는 뜻입니다. </p>
        </div>
        <div class="description">
          <p>만약 점수가 낮다면 우리 몸의 DNA, 단백질, 지질 등이 손상받을 가능성이 있고, 이는 우리가 빠르게 늙고 있다는 것을 의미합니다.</p>
        </div>
      </template>
    </cardComponent>
    <vue-bottom-sheet ref="myBottomSheet" v-if="props.activeCardNumber==2">
      <template #header>
        <div class="bottom-sheet-header"></div>
      </template>
      <div class="snack-bar-box">
        <div class="snack-bar-title">
          <div class="title">노화 억제 분석 지수</div>
          <p>한국인 {{ageToAgeGroup(userAge)}}대 {{props.userInfo.user_gender == 2 ? '여성' : '남성'}} 분포</p>
        </div>
        <div class="snack-bar-message" >
          <div class="chart-container">
            <div class="violin-container">
              <div class="graph-back">
                <img src="@/assets/images/report/violin/graph-back.png" />
              </div>
              <div class="violin-back"> 
                <img
                  class="violin"
                  :src="health_checkup_oxi_image(ageToAgeGroup(userAge), props.userInfo.user_gender)"
                />
                <!-- 노화 억제 분석지수 위치(점수) -->
                <div
                  class="my-point"
                  :style="{
                    left: '50%',
                    top: 100 - oxi.score + '%',
                  }"
                >
                  <div class="my-point-pointer">
                    <img
                      class="my-point-img"
                      src="@/assets/images/icons/graph-position-icon.svg"
                      alt=""
                    />
                    <div class="point-line"></div>
                    <div class="point"></div>
                  </div>
                </div>
                <img
                  class="violin-avg"
                  src="@/assets/images/report/violin/violin-avg.png"
                  alt=""
                  :style="{
                    // left: '50%',
                    top: 100 - oxi.age_mean + '%',
                  }"
                />
              </div>
            </div>
            <div class="legend">
              <div>
                <img
                  class="violin-point-img"
                  src="@/assets/images/report/violin/violin-legend.png"
                />
                <span>평균</span>
                <div class="position"></div>
                <span>나의 위치</span>
              </div>
            </div>
          </div>
        </div>
        <div class="close-box" @click="myBottomSheet.close()">
          <div>확인</div>
        </div>
      </div>

    </vue-bottom-sheet>
  </div>
</template>
