<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import healthLocation3DCard from './healthLocation3DCard.vue'
import healthLocation2DCard from './healthLocation2DCard.vue'
import healthLocationAgingSpeedCard from './healthLocationAgingSpeedCard.vue';
import HealthLocationOXIScore from './HealthLocationOXIScore.vue';
import healthLocationMETScore from './healthLocationMETScore.vue';
import healthLocationMUSScore from './healthLocationMUSScore.vue';
import emptyCard from './emptyCard.vue'
import LoaderModule from "@/components/loader/LoaderModule.vue";

import { getHealthConditionReport, getHealthScore2Report, getHealthScore1Report } from '@/api/vitalLogHandler';
import HealthCondition from '@/viewModels/HealthCondition'
import HealthScore1 from '@/viewModels/HealthScore1'
import HealthScore2 from '@/viewModels/HealthScore2'
import { sessionStore } from '@/store/store.js';

const useSessionStore = sessionStore();
const emit = defineEmits(['update-active-tab'])

const props = defineProps({
  isLastIndex: {
    type: Boolean
  },
  isInbodyData: {
    type: Boolean,
    required: true
  },
  userInfo: {
    type: Object,
    required: true
  },
  reportIssueDate: {
    type: String,
    required: true
  }
})
/** 
 * 체성분 유무에 따라 보여지는 건강보고서가 다르다. 
 * 체성분 유무에 따라 화면 디자인이 달라져야 한다면 컴포넌트를 새로 작성한다.
 * 만약 체성분 데이터가 있을때 보여지고 없을때 보여지지 않는 컴포넌트 라면 pages 리스트에서 없어지고
 * 다음 페이지는 props.isInbodyData 를 통해 activeCardNumber 를 설정해준다.
 */
const withInbodyPages = [
  { 'component': healthLocation3DCard, 'title': '3차원 건강 위치', 'subtitle': '' },
  { 'component': HealthLocationOXIScore, 'title': '노화 억제 분석 지수', 'subtitle': '' },
  { 'component': healthLocationMETScore, 'title': '만성질환 억제 분석 지수', 'subtitle': '' },
  { 'component': healthLocationMUSScore, 'title': '근육 밸런스 분석 지수', 'subtitle': '' },
  { 'component': healthLocationAgingSpeedCard, 'title': '노화 속도', 'subtitle': '' },
  { 'component': emptyCard, 'title': '', 'subtitle': '' },
]
const withoutInbodyPages = [
  { 'component': healthLocation2DCard, 'title': '2차원 건강 위치', 'subtitle': '' },
  { 'component': HealthLocationOXIScore, 'title': '노화 억제 분석 지수', 'subtitle': '' },
  { 'component': healthLocationMETScore, 'title': '만성질환 억제 분석 지수', 'subtitle': '' },
  // {'component': healthLocationMUSScore, 'title': '근육 밸런스 지수', 'subtitle': ''},
  { 'component': healthLocationAgingSpeedCard, 'title': '노화 속도', 'subtitle': '' },
  { 'component': emptyCard, 'title': '', 'subtitle': '' },
]


const isLoading = ref(false)
const activeCard = ref(null)
const activeCardNumber = ref(1) // 초기 활성화될 카드 번호
let user_id = props.userInfo.user_id
let s_code = ref(useSessionStore.getScode())

let health_condition_info = ref(null)
let health_score_info = ref(null)

onBeforeMount(async () => {
  await nextTick()
  await getData()
})
onMounted(async () => {
  setCardMinHeight()
  window.addEventListener("resize", setCardMinHeight);

})
onBeforeUnmount(() => {
  window.removeEventListener("resize", setCardMinHeight);
})
const changeCard = (new_id) => {
  if (new_id != 0) {
    window.scrollTo(0, 0)
    activeCard.value.$el.swiper.slideTo(parseInt(new_id) - 1)
  }
}
const changeSlide = (index) => {

  activeCardNumber.value = index.activeIndex + 1

  // 현재 탭의 슬라이드가 마지막일때 다음 탭으로 이동
  if (props.isInbodyData == true && activeCardNumber.value == withInbodyPages.length) {
    emit('update-active-tab', 1, 2, false)
  } else if (props.isInbodyData == false && activeCardNumber.value == withoutInbodyPages.length) {
    emit('update-active-tab', 1, 2, false)
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

  if (props.isInbodyData) {
    var get_health_report_score = await getHealthScore2Report(user_id, s_code.value)
    health_score_info.value = new HealthScore2()
    health_score_info.value.setData(get_health_report_score)
  } else {
    var get_health_report_score = await getHealthScore1Report(user_id, s_code.value)
    health_score_info.value = new HealthScore1()
    health_score_info.value.setData(get_health_report_score)
  }
}
</script>
<template>
  
  <div class="card-box health">
    <LoaderModule :is-loading="isLoading"></LoaderModule>
    <swiper ref="activeCard" 
      @slideChange="changeSlide" 
      :slidesPerView="1" 
      :spaceBetween="15" 
      :mousewheel="true"
      :touchStartPreventDefault="false"
      :touchMoveStopPropagation="false"
      :pagination="{
        clickable: true,
      }">
      <swiper-slide v-for="(page, i) in withInbodyPages" :key="i" :virtual-index="i" v-if="props.isInbodyData">
        <component :key="i" :is="page.component" :title="page.title" :subtitle="page.subtitle"
          :health-report-condition-data="health_condition_info" :health-report-score-data="health_score_info"
          :user-info="props.userInfo" :active-card-number="activeCardNumber" :is-inbody-data="props.isInbodyData"
          :report-issue-date="props.reportIssueDate"
          @changeCard="changeCard" />

      </swiper-slide>
      <swiper-slide v-for="(page, j) in withoutInbodyPages" :key="j" :virtual-index="j" v-else>
        <component :key="j" :is="page.component" :title="page.title" :subtitle="page.subtitle"
          :health-report-condition-data="health_condition_info" :health-report-score-data="health_score_info"
          :user-info="props.userInfo" :active-card-number="activeCardNumber" :is-inbody-data="props.isInbodyData"
          :report-issue-date="props.reportIssueDate"
          @changeCard="changeCard" />

      </swiper-slide>

    </swiper>
  </div>

</template>