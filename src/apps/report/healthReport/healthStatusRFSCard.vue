<script setup>
import { snackBarStore } from '@/store/store'
import { ref, onMounted, watch, computed} from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'
import TrackingChart from '@/components/chart/TrackingChart.vue'
import iconCheck from '@/assets/images/pdf/res/icon-check-b.png'

const useSnackBarStore = snackBarStore()
const datas  = ref(null)
const scrollbarHeight = ref("")
const isCardFliped= ref(false)

const props = defineProps({
  title:{
    type: String,
    required: true
  },
  healthReportRfsData:{
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
  if(newVal == 2) {
    if(isCardFliped.value == false){
      setData()
      setTimeout(() => {
        resizeMessage()
      }, 100)
    }
    window.addEventListener("resize", resizeMessage);
  } else {
    window.removeEventListener("resize", resizeMessage);
  } 
})
onMounted ( async () => {
})
const getStatusList = computed(() => {
  // 식사기록 (id=0 인덱스는 제외)
  if(datas.value != null) {
    return datas.value.food_data.filter((item) => item.id != 0)
  }
})

const setData = () => {
  if(props.healthReportRfsData != null) {
    datas.value = props.healthReportRfsData
    datas.value.food_data.sort((a, b) => a.id - b.id)
  }
}
const resizeMessage = () => {
  
  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_main_title = document.querySelector('.card-main-title') // 카드 제목
  const card_content_title = document.querySelector('.card-content-title')
  const tracking_chart = document.querySelector('.tracking-chart'); // 차트, 설명 부분

  const marginTop = parseFloat(window.getComputedStyle(tracking_chart).marginTop);
  const marginBottom = parseFloat(window.getComputedStyle(tracking_chart).marginBottom);
  const tracking_chart_h = tracking_chart.offsetHeight + marginTop + marginBottom;

  const status_row_box = document.querySelector('.status-row-box'); // 그리드 부분 (margin 포함됨)
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분
  
  const main_height = card_content_box.offsetHeight - (
    card_main_title.offsetHeight + tracking_chart_h +  status_row_box.offsetHeight + card_content_title.offsetHeight);
  const card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`

}
const toggleSnacBarPopup = (item) => {
  
  var rfs_message = datas.value.food_description
  var title = item.name;
  var sub_title = '';
  var message = '<div class="card-description"> <div class="description-box">';

  for (let i in rfs_message) {
    var description_item = rfs_message[i]
    if(description_item.key == item.key) {
      
      sub_title =  `<div class='text-left'> ${description_item.description} </div>`; 
      for(let i in description_item.description_list) {
        message += `<div class='description font-bold add-check'> <img src='${iconCheck}'/>${description_item.description_list[i].title}</div>
          <div class='description'> ${description_item.description_list[i].content} </div>`;
      }
    }
  }
  message += '</div></div>';
  
  useSnackBarStore.setStore(title, sub_title, message, '1024', '70%')
}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
}
</script>
<template>

<cardComponent :title=props.title :more="true" :description-title="'나의 식사 습관이란?'" :activeCard="props.activeCardNumber==2" @card-fliped="cardFliped">
  <template v-slot:content v-if="isCardFliped== false">
    <div class="card-content-title first">일상에서 건강한 식사 습관을 실천하고 있는지, 부족한 영양 섭취는 없는지 확인해 보세요.</div>
    <div id="RfsTrackingChart" class="tracking-chart-container" v-if="datas != null">
      <TrackingChart
        :data="datas.rfs_cal_data"  
      />
    </div>
    <div class="status-row-box">
      <div class="row-box head">
        <div class="row">
          <div class="cell"><span>식품군</span></div>
          <div class="cell"><span>판정</span></div>
        </div>
        <div class="row">
          <div class="cell"><span>식품군</span></div>
          <div class="cell"><span>판정</span></div>
        </div>
      </div>

      <div class="row-box">
        <div class="row" v-for="item in getStatusList" v-if="getStatusList">
          <div class="cell"><span>{{item.name}}</span></div>
          <div class="cell" :class="item.status == 1 ? 'normal' : 'danger'" @click="item.popup_flag ? toggleSnacBarPopup(item) : function(){return}">
            <span>{{item.status == 1 ? '충족' : '부족'}}</span>
            <i v-if="item.popup_flag" class="mark-arrow-right grey"></i>
          </div>
        </div>
        <div class="row">
          <div class="cell"></div>
          <div class="cell"><span></span></div>
        </div>
      </div>
    </div>
    <div class="card-front-description">
      <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight!=''"> 
      <div class="card-description ">
        <div class="description-box">
          <div class="description">
            <p>{{ props.userInfo.user_name }}님의 권장식품점수는 {{datas.rfs_cal_data}}점으로, 건강한 식사 목표 점수인 {{datas.rfs_cut_data}} 
              {{
                // 환산 전 점수로 메시지 분기
                datas.food_data[0].data < 23 ? '에 비해 권장 식품 섭취가 많이 부족한' :
                datas.food_data[0].data < 30 ? '을 고려했을 때 관리가 필요한' :
                datas.food_data[0].data <= 47 ? '을 충족하거나 초과하여 건강한' :
                ''
              }} 수준입니다.</p>
          </div>
          <div class="description">
            <p>건강한 식생활을 위해서 규칙적으로 골고루 섭취하는 습관이 필요합니다.</p>
          </div>
        </div>
      </div>
    </Scrollbar>
    </div>
  
  </template>
  <template v-slot:description>
    <div class="description">
      <p>나의 식사 습관 점수는 식사의 질을 분석한 것으로, 한국인을 위한 식사 가이드라인에서 섭취를 권장하는 식품을 일상에서 얼마나 자주 섭취하고 있는지 평가합니다.</p>
    </div>
    <div class="description">
      <p>식사 습관 점수가 높으면 영양이 충분한 건강한 식사를 하고 있다는 의미입니다.</p>
    </div>
  </template>
</cardComponent>

</template>