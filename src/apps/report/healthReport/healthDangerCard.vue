<script setup>
import {ref, watch, onMounted, onUpdated} from 'vue';
import ResultElementGrid from '@/components/chart/ResultElementGrid.vue';
import cardComponent from '@/components/card/CardComponent.vue'

const datas  = ref(null)
const props = defineProps({
  title:{
    type: String,
    required: true
  },
  healthReportArindicatorData:{
    type: Object,
    required: true
  },
  healthReportConditionData:{
    type: Object,
    required: true
  },
  activeCardNumber: {
    type: Number,
    required: true
  },
  userInfo : {
    type: Object,
    required: true
  }

})

watch(() => props.activeCardNumber, async (newVal) => {
  if(newVal == 1) {
    setTimeout(() => {
      resizeMessage()
    }, 100)
    window.addEventListener("resize", resizeMessage);
  } else {
    window.removeEventListener("resize", resizeMessage);
  }
})
watch(
() => [props.healthReportConditionData, props.healthReportArindicatorData],
(
  [newHealthReportConditionData, newHealthReportArindicatorData], 
  [oldHealthReportConditionData, oldHealthReportArindicatorData]
) => {
  if(newHealthReportConditionData != null && newHealthReportArindicatorData !=null) {
    setData()
    setTimeout(() => {
      resizeMessage()
    }, 100)
  }
})
onMounted ( async () => {
  window.scrollTo(0, 0)
  setTimeout(() => {
      resizeMessage()
    }, 100)
})
const setData = async () => {

  // props 로 내려온 값을 합침
  const merged = { ...props.healthReportArindicatorData, ...props.healthReportConditionData };

  // 화면표시에서 제거되어야 할 항목
  delete merged['WWI']
  delete merged['FMR']
  delete merged['smok_dur']
  delete merged['pack_year']
  delete merged['CK_sleep_time']
  delete merged['CK_eq5d']
  delete merged['CK_met']
  delete merged['CK_drink']

  datas.value = merged;
  
}
const resizeMessage = async () => {
  //card content box
  var card_content = document.querySelector('#DangerElementPage .card-content'); // 카드 전체
  var card_main_title = document.querySelector('#DangerElementPage .card-main-title')  // 카드 상단 타이틀
  var card_sub_title = document.querySelector('#DangerElementPage .card-sub-title')  // 카드 상단 타이틀

  var card_height = (card_content.offsetHeight - (card_main_title.offsetHeight + card_sub_title.offsetHeight)) * 0.9;
  
  var card_content_box = document.querySelector('#DangerElementPage .card-content-box'); // 카드 전체
  card_content_box.style.height = `${card_height}px`

  var divider = document.querySelector('.divider')  // 카드 하단 탭 리스트
  var divider_h = 0;

  if(divider) {
    divider_h = divider.offsetHeight;
  }
  var content_child = document.querySelector('.card-content-box .content-child'); // 건강 타입 이미지
  if(content_child) {
    content_child.style.height = `${card_height - divider_h}px`
  }
}

</script>
<template>
  <div id="DangerElementPage">
    <cardComponent :title=title :more="true" :description-title="'‘노화 속도에 영향을 준 요인’ 이란?'" :activeCard="props.activeCardNumber==1">
      <template v-slot:content>
        <div class="card-content-title first">노화 속도와 건강 상태에 영향을 주는 건강 요인을 눌러 자세히 확인해 보세요.</div>
        <ResultElementGrid
          v-if="datas!=null"
            :datas="datas"
            :userInfo="props.userInfo"
          />
      
      </template>
      <template v-slot:description>
        <div class="description">
          <p>건강검진 기준치와 생활습관에 따라 건강요인의 상태를 분석하였습니다. </p>
        </div>
        <div class="description">
          <p>나의 건강점수와 신체 나이에 영향을 준 노화 속도에 영향을 준 요인을 확인해 보세요.</p>
        </div>
      </template>
    </cardComponent>
  </div>

</template>
  