<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import healthDangerCard from './healthDangerCard.vue'
import healthDangerNetworkCard from './healthDangerNetworkCard.vue'
import emptyCard from './emptyCard.vue'
import LoaderModule from "@/components/loader/LoaderModule.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import { sessionStore} from '@/store/store.js';
import { getHealthConditionReport, getARIndicatorReport, getMHN2Report } from '@/api/vitalLogHandler';
import HealthARIndicator from '@/viewModels/HealthARIndicator'
import HealthCondition from '@/viewModels/HealthCondition'
import HealthNetwork from '@/viewModels/HealthNetwork'

const useSessionStore = sessionStore();
const emit = defineEmits(['update-active-tab'])

const props = defineProps({
  isLastIndex:{
    type: Boolean
  },
  userInfo: {
    type: Object,
    required: true
  }
})
/** 
 * 체성분 유무에 따라 보여지는 건강보고서가 해당 탭에서는 다르지 않다.
 */
const pages = [
  {'component': healthDangerCard, 'title': '노화 속도에 영향을 준 요인', 'subtitle': ''},
  {'component': healthDangerNetworkCard, 'title': '인체 생리 네트워크', 'subtitle': ''},
  {'component': emptyCard, 'title': '', 'subtitle': ''},
]

let user_id = useSessionStore.getUserInfo().user_id
let s_code = ref(useSessionStore.getScode())

const isLoading = ref(false)
const activeCard = ref(null)
const activeCardNumber = ref(1)
/*** 
 * 그래프 애니메이션 트리거 설정
 * -- 건강신호 네트워크 카드로 넘어가면 바로 애니메이션이 실행되는것을 방지.
 * -- 애니메이션 요소들이 이전카드에 맞춰지기때문에 왼쪽으로 쏠림방지.
 * */ 
const showHealthNetworkAnimation = ref(false) 

let health_arindicator_info = ref(null)
let health_condition_info = ref(null)
let health_network_info = ref(null)

onBeforeMount(async () => {
  await getData()
})
onMounted ( async () => {
  setCardMinHeight()
})
const changeCard = (new_id) => {
  
  if(new_id != 0) {
    activeCard.value.$el.swiper.slideTo(parseInt(new_id) - 1 )
  }
}

const setCardMinHeight = () => {
  
  const card = document.querySelector('.swiper');
  const tabs = document.querySelector('.tabs');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  const mainHeight = window.innerHeight - (header.offsetHeight + footer.offsetHeight + tabs.offsetHeight);
  const minCardHeight = mainHeight * 0.93; // 카드 높이를 mainHeight의 80%로 설정
  card.style.height = `${minCardHeight}px`;
}
const getData = async () => {
  
  health_condition_info.value = new HealthCondition()
  var get_health_report_condition = await getHealthConditionReport(user_id, s_code.value)
  health_condition_info.value.setData(get_health_report_condition)

  health_arindicator_info.value = new HealthARIndicator()
  var get_ar_indicator = await getARIndicatorReport(user_id, s_code.value)
  health_arindicator_info.value.setData(get_ar_indicator)

  health_network_info.value = new HealthNetwork()
  var get_health_network = await getMHN2Report(user_id, s_code.value)
  health_network_info.value.setData(get_health_network)
}
const changeSlide = (index) => {

  activeCardNumber.value = index.activeIndex + 1
  
  // 현재 탭의 슬라이드가 마지막일때 다음 탭으로 이동
  if(activeCardNumber.value == pages.length) {
    emit('update-active-tab', 2,3, false)
  }
}
const triggerShowHealthNetworkAnimation = () => {

  // 2 번째 카드일때만 건강신호등 애니메이션이 실행되어야 함
  if(activeCardNumber.value == 2) {
    showHealthNetworkAnimation.value = true
  } else {
    showHealthNetworkAnimation.value = false
  }
  
}
</script>
<template>
  
    <div class="card-box health">
      <LoaderModule :is-loading="isLoading"></LoaderModule>
      
      <swiper
        @slideChange="changeSlide"
        @slideChangeTransitionEnd="triggerShowHealthNetworkAnimation"
        :slidesPerView="1"
        ref="activeCard"
        :spaceBetween="15"
        :mousewheel="true"
        :pagination="{
            clickable: true,
          }"       
      >
      <swiper-slide v-for="(page, i) in pages" :key="i" :virtual-index="i">
        <component 
        :is="page.component" 
        :title="page.title" 
        :subtitle="page.subtitle" 
        :health-report-condition-data="health_condition_info" 
        :health-report-arindicator-data="health_arindicator_info"
        :health-network-data="health_network_info"
        :user-info="props.userInfo"
        @changeCard="changeCard" 
        :show-health-network-animation="showHealthNetworkAnimation"
        :active-card-number="activeCardNumber" />
        
      </swiper-slide>
         
      </swiper>
    </div>
  
</template>