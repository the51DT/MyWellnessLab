<script setup>
import {ref, watch, onMounted} from 'vue';
import { snackBarStore, loadingStore } from '@/store/store.js'
import ResultElementGridAnimation from '@/components/chart/ResultElementGridAnimation.vue';
import GraphChart from "@/components/chart/graphChart.vue";
import cardComponent from '@/components/card/CardComponent.vue'
import { splitByNewLine } from '@/utils/common.js'

const isCardFliped= ref(false)
const useLoadingStore = loadingStore()
const useSnackBarStore = snackBarStore()
const animation_datas  = ref(null)
const network_datas = ref(null)
const showAnimation = ref(false)
const showZoomMode = ref(false)
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
  healthNetworkData:{
    type: Object,
    required: true
  },
  activeCardNumber: {
    type: Number,
    required: true
  },
  showHealthNetworkAnimation: {
    type: Boolean,
    required: true
  },

})
watch(
() => [props.activeCardNumber, props.showHealthNetworkAnimation],

(newVal, oldVal) => {
  if(newVal[0] == 2) {
    useLoadingStore.setLoading(true)
  } else{
    // 다른카드로 넘겨졌을 시 애니메이션 데이터를 null로 초기화
    animation_datas.value = null
    network_datas.value = null
  }
  if(newVal[0] == 2 && newVal[1] == true) {
    if(isCardFliped.value == false) {
      // 값 세팅
      setAnimationData()
      setNetworkData()
      setTimeout(() => {
        resizeMessage()
      }, 100)
    }
    useLoadingStore.setLoading(false)
  }
})
onMounted ( async () => {
  
  window.scrollTo(0, 0)
})
const setAnimationData = async () => {

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
 
  animation_datas.value = merged;  
}
const setNetworkData = async () => {
  network_datas.value = props.healthNetworkData;
}
const afterEnter = () => {
  showAnimation.value = false
}
const showZoomModeFlag = (flag) => {
  showZoomMode.value = flag
}
const resizeMessage = async () => {
  //card content box
  var card_content_box = document.querySelector('#HealthNetworkPage .card-content'); // 카드 전체
  var card_main_title = document.querySelector('#HealthNetworkPage .card-main-title')  // 카드 상단 타이틀
  var card_card_title = document.querySelector('#HealthNetworkPage .card-content-title')  // 카드 본문 타이틀
  
  var card_height = (card_content_box.offsetHeight - card_main_title.offsetHeight - card_card_title.offsetHeight);

  var card_content_box = document.querySelector('#HealthNetworkPage .card-content-box'); // 카드 전체
  card_content_box.style.height = `${card_height}px`
  card_content_box.style.overflowY = `hidden` // 건강위험요인 애니메이션은 전체가 카드 안에 담겨야 하기 때문에 overflowY를 hidden으로 설정
  card_content_box.style.position='relative' // 건강위험요인 애니메이션은 전체가 카드 안에 담겨야 하기 때문에 position을 relative로 설정
  

  // 건강신호등 높이
  var health_network_info = document.querySelector('.health-network-info'); // 건강신호등 정보
  var health_network_container = document.querySelector('.health-network-container'); // 카드 전체
  health_network_container.style.height = `${(card_height - health_network_info.offsetHeight) * 0.95}px`

}
const toggleSnacBarPopup = () => {

  var message_list = splitByNewLine(props.healthNetworkData.drug_msg);
  var message = '<div class="card-description"> ' +
    '<div class="description-box">' ;
      message_list.forEach((item) => {
        message += `<div class='description'>${item}</div>`;
      });
  message += '</div> </div>' ;

  
  useSnackBarStore.setStore('인체 생리 네트워크', '', message, '1024', '40%')
}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
}
const showAnimationEnd = () => {

  showAnimation.value = false
  if(props.healthNetworkData.drug_msg != '') toggleSnacBarPopup()
  
}
</script>
<template>
  <div id="HealthNetworkPage">
    <cardComponent :title=title :activeCard="props.activeCardNumber==2" :more="false" @card-fliped="cardFliped">
      <template v-slot:content >
        <div class="card-content-title first" v-if="!showZoomMode">건강 위험 요소와 건강 사이의 관계를 연결한 생리적 네트워크를 확인해 보세요.</div>
        <!-- 애니메이션 연출용 -->
        <ResultElementGridAnimation
          v-if="animation_datas !=null"
          :datas="animation_datas"
          @animation-end="showAnimationEnd"
        />
        
        <!-- 건강 위험 판정 -->
        <transition 
          name="fade"
          @after-enter="afterEnter"
        >
          <!-- 나의 건강 신호등 네트워크 그래프 -->
          <GraphChart
            v-if="!showAnimation && network_datas !=null"
            :datas="network_datas"
            @zoomMode="showZoomModeFlag"
          />
        </transition>
      </template>
    </cardComponent>
  </div>

</template>
