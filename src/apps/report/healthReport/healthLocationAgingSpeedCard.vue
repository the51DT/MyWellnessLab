<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import { splitByNewLine } from '@/utils/common.js';
import { createHalfDonutGaugeChart } from '@/utils/chartConfig.js'
import * as echarts from "echarts";

const myBottomSheet = ref(null)
const scrollbarHeight = ref("")
const isCardFliped = ref(false)
const chartObj = ref(null)

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  healthReportScoreData: {
    type: Object,
    required: false
  },
  activeCardNumber: {
    type: Number,
    required: true
  },
  userInfo: {
    type: Object,
    required: true
  },
  isInbodyData: {
    type: Boolean,
    required: true
  }
})
const reage = ref({
  age_rate: 0, // 노화 속도
  report_age: 0, // 발급 당시 나이
  health_age: 0, // 건강 나이
  max_age: 0, // 동일 연령대의 건강나이 최대 나이
  min_age: 0, // 동일 연령대의 건강나이 최소 나이
  total_max_age: 80, // 전체 연령대의 건강나이 최대 나이
  total_min_age: 19, // 전체 연령대의 건강나이 최소 나이
  msg: new Array()  // 메시지
})
watch(() => props.healthReportScoreData, async (newVal) => {
  setData(newVal)
})
watch(() => props.activeCardNumber, async (newVal) => {
  if (props.isInbodyData == true ? newVal == 5 : newVal == 4) {
    if (isCardFliped.value == false) {
      setData(props.healthReportScoreData)
      chartConfig()
      setTimeout(() => {
        resizeMessage()
      }, 100)
    }
  } else {
    window.removeEventListener('resize', () => { chartObj.value.resize(); });
  }
})
onMounted(async () => {
  window.scrollTo(0, 0)
})
const setData = async (newData) => {
  reage.value.age_rate = newData.hq_ar.aging_rate
  reage.value.msg = splitByNewLine(newData.hq_reage.msg)
  reage.value.health_age = newData.hq_reage.reage
  // reage.value.report_age = tagetDateToAge(newData.health_reg_date, props.userInfo.user_birthdate)
  /**
   * 25.08.25
   * 발급당시 실제 나이 -> 건강검진 당시 나이
   */
  reage.value.report_age = newData.hqReference.age
  reage.value.max_age = newData.hqReference.max
  reage.value.min_age = newData.hqReference.min
}

const displayPopup = async () => {

  // await resizeGraph()
  // bottom sheet 가 기본 1개가 있기 때문
  // 디바이스에 따라 popup 높이를 다르게 설정
  if (window.innerHeight > 800) {
    document.querySelectorAll('.bottom-sheet__content')[1].setAttribute('style', `height: 50% !important`)
  } else {
    document.querySelectorAll('.bottom-sheet__content')[1].setAttribute('style', `height: 60% !important`)
  }
  await myBottomSheet.value.open()
}
const resizeMessage = () => {
  var card_content_box = document.querySelector('.card-content'); // 카드 전체
  var card_main_title = document.querySelector('.card-main-title') // 카드 제목
  var card_content_title = document.querySelector('.card-content-title')
  var chart_wrap = document.querySelector('.card-content-box .container'); // 차트 부분
  var card_front_description = document.querySelector('.card-front-description') // 설명 부분

  var main_height = card_content_box.offsetHeight - (card_main_title.offsetHeight + chart_wrap.offsetHeight + card_content_title.offsetHeight);
  var card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`
}
const chartConfig = async () => {
  await nextTick()
  var chartDom = document.querySelector('#GaugeChart')
  var option = await createHalfDonutGaugeChart(reage.value.age_rate);
  chartObj.value = echarts.init(chartDom);
  chartObj.value.setOption(option);

  window.addEventListener('resize', () => { chartObj.value.resize(); });
}
/** 발급당시 실제나이 (X 축) */
const getAgeGraphY = computed(() => {
  // 25.08.07 --> 20 ~ 90세로 범위 변경
  // 20세 미만일 경우 20세, 90세 초과일 경우 90세로 설정
  // 25.09.03 --> 20~80으로 변경
  var age = reage.value.report_age
  if (age < 20) {
    age = 20;
  } else if (age > 80) {
    age = 80;
  }
  var range = 80 - 20;
  var relativeValue = age - 20;

  return (relativeValue / range) * 100
})
/** 건강나이 (Y 축) */
const getAgeGraphX = computed(() => {

  // 25.08.07 --> 10 ~ 90세로 범위 변경
  // 10세 미만일 경우 10세, 90세 초과일 경우 90세로 설정
  // 25.09.03 --> 0~100으로 변경
  var age = reage.value.health_age
  if (age < 0) {
    age = 0;
  } else if (age > 100) {
    age = 100;
  }
  var range = 100 - 0;
  var relativeValue = age - 0;

  return (relativeValue / range) * 100

})
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
  if (new_value == false) {
    chartConfig() // Flip이 끝나고 차트 그리기
  }
}
</script>
<template>
  <div id="ReageSpeedPage">
    <cardComponent :title=props.title :more="true" :description-title="'노화 속도란?'"
      :activeCard="props.isInbodyData == true ? props.activeCardNumber == 5 : props.activeCardNumber == 4"
      @card-fliped="cardFliped">
      <template v-slot:content v-if="isCardFliped == false">
        <div class="card-content-title first">건강 상태, 식습관, 운동량과 같은 생활 습관의 영향을 받은 노화 진행 속도를 확인해 보세요.</div>
        <div class="container">

          <!-- 노화 속도 그래프 -->
          <div class="gauge-chart-container">
            <div class="gauge-chart" ref="chartObj" id="GaugeChart"></div>
            <div class="text">{{ reage.age_rate }}<span>배속</span></div>
            <div class="max">1.5</div>
            <div class="max-middle">1.2</div>
            <div class="min-middle">0.8</div>
            <div class="min">0.5</div>
          </div>
          <div class="detail-view-popup">
            <div class="popup-title" @click="displayPopup">
              자세히보기
            </div>
          </div>

          <div class="compare-age">
            <div>
              <span class="title">건강검진 당시 나이</span>
              <span class="age">{{ reage.report_age }}</span>
            </div>
            <div>
              <span class="title">건강 나이</span>
              <span class="age" :class="[
                { green: reage.report_age > reage.health_age },
                { red: reage.report_age < reage.health_age },
              ]">
                {{ reage.health_age }}</span>
            </div>

          </div>
        </div>
        <div class="card-front-description">
          <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight != ''">
            <div class="card-description">
              <div class="description-box">
                <div class="description" v-for="item in reage.msg">
                  <p>{{ item }}</p>
                </div>
              </div>
            </div>
          </Scrollbar>
        </div>

      </template>
      <template v-slot:description>
        <div class="description">
          <p>모든 사람의 노화 속도는 다르며 이는 식습관, 운동량, 수면 패턴과 같은 생활습관에 따라 결정됩니다. 건강한 생활습관을 유지할 때, 노화를 늦출 수 있습니다. </p>
        </div>
        <div class="description">
          <p>이런 사실을 바탕으로 한국 성인의 건강 점수를 결합한 “노화 속도” 알고리즘을 만들었습니다. </p>
        </div>
        <div class="description">
          <p>만약 노화 속도가 1.1 보다 빠르면, 나의 노화가 빠르게 진행되고 있으며, 건강에 더 주의를 기울여야 함을 나타냅니다. </p>
        </div>
      </template>
    </cardComponent>
    <vue-bottom-sheet ref="myBottomSheet"
      v-if="props.isInbodyData == true ? props.activeCardNumber == 5 : props.activeCardNumber == 4">
      <template #header>
        <div class="bottom-sheet-header"></div>
      </template>
      <div class="snack-bar-box">
        <div class="snack-bar-title">
          <div class="title">노화 속도와 건강 나이</div>
          <p>한국 성인 표본집단과 나의 노화 속도</p>
        </div>
        <div class="snack-bar-message">
          <div class="reage-graph-container" ref="target">
            <div class="reage-graph">
              <div class="label-y">건강 나이</div>
              <div class="label-x">실제 나이</div>
              <img class="graph-back" src="@/assets/images/report/graph/reage-graph.png" alt="" />
              <div class="graph-point">
                <div class="graph-point-background">
                  <div class="pointer" :style="{ left: getAgeGraphY + '%', bottom: getAgeGraphX + '%' }">
                    <div class="my-point-pointer">
                      <div class="my-point-dashed"></div>
                      <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" />
                      <div class="my-point-dot"></div>
                    </div>
                  </div>

                  <div class="pointer x-label" :style="{ left: getAgeGraphY + '%' }">
                    <span>{{ reage.report_age }}세</span>
                  </div>
                  <div class="pointer-line-current" :style="{
                    left: getAgeGraphY + '%',
                    bottom: 0,
                    width: '0%',
                    height: getAgeGraphX + '%',
                  }"></div>
                  <div class="pointer-diagonal" :style="{
                    left: `0`,
                    bottom: getAgeGraphX + '%',
                    width:  `calc(${getAgeGraphY}%)`,
                  }"></div>
                  <div class="pointer y-label" :style="{
                    bottom: getAgeGraphX + '%',
                  }">
                    <span> {{ reage.health_age }}세 </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="legend">
              <span class="legend1"></span><span class="stretch-text">고속 노화</span>
              <span class="legend2"></span><span class="stretch-text">보통 노화</span>
              <span class="legend3"></span><span class="stretch-text">저속 노화</span>
              <div class="avg-line"></div>
              <span>보통 노화 속도</span>
              <div class="position"></div>
              <span>{{ props.userInfo.user_name }}님</span>
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