<script setup>
import * as echarts from "echarts";
import { ref, onMounted, watch, nextTick, onUpdated} from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'
import { ageToAgeGroup } from '@/utils/common.js'
import { createRadarChart } from "@/utils/chartConfig";

const echart = ref(null);
const datas  = ref(null)
const userAge = ref(0)
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

watch(() => props.activeCardNumber, async (newVal) => {
  if(newVal == 3) {
    if(isCardFliped.value == false){
      datas.value = props.healthReportScoreData
      userAge.value =props.healthReportScoreData.hqReference.age
      setTimeout(() => {
        makeChart()
        resizeMessage()
      }, 100)
    }
    
    window.addEventListener("resize", resizeMessage);
  } else {
    window.removeEventListener("resize", resizeMessage);
  }
})
const resizeMessage = () => {
  
  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_content_title = document.querySelector('.card-content-title')
  const chart_container = document.querySelector('.radar-chart-container'); // 차트부분
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분
  
  const main_height = card_content_box.offsetHeight - (chart_container.offsetHeight + card_content_title.offsetHeight);
  const card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`

}
const makeChart = async () =>{
   
  var max_values = [
    { name: '몸통', max: 100 },
    { name: '왼팔', max: 100 },
    { name: '왼다리', max: 100 },
    { name: '오른다리', max: 100 },
    { name: '오른팔', max: 100 }
  ]
  var mean_values = [
    90, 80, 90, 90, 80
  ]
  var values = [
    datas.value.hq_musMass.bodypartData.trk_percent, 
    datas.value.hq_musMass.bodypartData.lrm_percent,
    datas.value.hq_musMass.bodypartData.llg_percent,
    datas.value.hq_musMass.bodypartData.rlg_percent,
    datas.value.hq_musMass.bodypartData.rrm_percent,
  ]
  const chart = echarts.init(echart.value)
  var option = await createRadarChart(max_values, mean_values, values, '#E95371', 1.5)
  chart.setOption(option)
}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
  if(new_value == false){
    setTimeout(() => {
      makeChart()
    }, 100)
  }
}
</script>

<template>

<cardComponent :title=props.title :more="true" :description-title="'나의 체성분이란?'" :activeCard="props.activeCardNumber==3" @card-fliped="cardFliped">
  <template v-slot:content v-if="isCardFliped== false"> 
    <div class="card-content-title first">체성분 검사 결과를 바탕으로 부위별 근육량과 체지방률, 체지방량을 확인할 수 있습니다.</div>
    <div class="radar-chart-container" v-if="datas != null">
        <!-- 나의 부위별 근육량 그래프 -->
        <div class="container">
          <div class="echart" ref="echart"></div>
          <div class="info">
            <div class="info-list">
              <div class="info-item top">
                <p>몸통</p>
                <p :class="datas.hq_musMass.bodypartData.trk_status === 3 ? 'danger' : 'normal'">
                  {{ datas.hq_musMass.bodypartData.trk_status === 3 ? '부족' : '표준' }}
                </p>
              </div>
              <div class="info-item left-top">
                <p>왼팔</p>
                <p :class="datas.hq_musMass.bodypartData.lrm_status === 3 ? 'danger' : 'normal'">
                  {{ datas.hq_musMass.bodypartData.lrm_status === 3 ? '부족' : '표준' }}
                </p>
              </div>
              <div class="info-item left-bottom">
                <p>왼다리</p>
                <p :class="datas.hq_musMass.bodypartData.llg_status === 3 ? 'danger' : 'normal'">
                  {{ datas.hq_musMass.bodypartData.llg_status === 3 ? '부족' : '표준' }}
                </p>
              </div>
              <div class="info-item right-bottom">
                <p>오른다리</p>
                <p :class="datas.hq_musMass.bodypartData.rlg_status === 3 ? 'danger' : 'normal'">
                  {{ datas.hq_musMass.bodypartData.rlg_status === 3 ? '부족' : '표준' }}
                </p>
              </div>
              <div class="info-item right-top">
                <p>오른팔</p>
                <p :class="datas.hq_musMass.bodypartData.rrm_status === 3 ? 'danger' : 'normal'">
                  {{ datas.hq_musMass.bodypartData.rrm_status === 3 ? '부족' : '표준' }}
                </p>
              </div> 
            </div> 
          </div>
        </div>
        
        <div class="legend">
          <div class="position-item"></div>
          <span>기준</span>
          <div class="position"></div>
          <span>나의 근육량(%)</span>
        </div>
      
    </div>
    <div class="card-front-description">
      <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight!=''"> 
      <div class="card-description ">
        <div class="description-box">
          <div class="description">
            <p>{{ props.userInfo.user_name }}님의 부위별 근육량은 빨간선으로 표시되어 있으며,{{ props.userInfo.user_name }}님의 근육량은 {{ageToAgeGroup(userAge)}}대 {{props.userInfo.user_gender == 2 ? '여성' : '남성'}} 100명 중 {{datas.hq_musMass.percent}}등에 해당하여 
              {{
                datas.hq_musMass.status == 1 ? '평균 이상' :
                datas.hq_musMass.status == 2 ? '평균 이상' :
                datas.hq_musMass.status == 3 ? '평균 미만' :
                ''
              }} 입니다.</p>
          </div>
        </div>
      </div>
    </Scrollbar>
    </div>
  
  </template>
  <template v-slot:description>
    <div class="description">
      <p>나의 체성분에서는 체성분 검사 결과를 바탕으로 부위별 근육량을 제시하고 상태를 평가합니다.</p>
    </div>
    <div class="description">
      <p>근육은 우리 몸에서 가장 큰 조직이자 주요 대사기관으로, 에너지 소비와 산화적 스트레스 조절에 중요한 역할을 합니다. 근육량이 부족하거나 불균형하면 근력, 순발력, 균형감각이 저하되어 일상생활의 불편함이나 안전 문제로 이어질 수 있습니다.</p>
    </div>
  </template>
</cardComponent>

</template>