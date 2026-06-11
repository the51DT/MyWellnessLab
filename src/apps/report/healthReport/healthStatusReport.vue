<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import healthStatusCardExcludeInbody from './healthStatusCardExcludeInbody.vue'
import healthStatusCard from './healthStatusCard.vue'
import healthStatusRFSCard from './healthStatusRFSCard.vue'
import healthStatusMuscleCard from './healthStatusMuscleCard.vue'
import healthStatusSleepCard from './healthStatusSleepCard.vue'
import healthStatusExerciseIntensityCard from './healthStatusExerciseIntensity.vue'
import LoaderModule from "@/components/loader/LoaderModule.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';

import {
  getHealthScore2Report,
  getHealthScore1Report,
  getDietQualityReport,
  getSleepHabitScoreReport,
  getExerciseIntensityReport
} from '@/api/vitalLogHandler';
import HealthScore1 from '@/viewModels/HealthScore1'
import HealthScore2 from '@/viewModels/HealthScore2'
import RFSScore from '@/viewModels/RFSScore';
import HealthSleepHabits from '@/viewModels/HealthSleepHabits';
import ExerciseIntensity from '@/viewModels/ExerciseIntensity';
import { sessionStore } from '@/store/store.js';

import 'swiper/css';

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
  }
})
/** 
 * 체성분 유무에 따라 보여지는 건강보고서가 다르다. 
 * 체성분 유무에 따라 화면 디자인이 달라져야 한다면 컴포넌트를 새로 작성한다.
 * 만약 체성분 데이터가 있을때 보여지고 없을때 보여지지 않는 컴포넌트 라면 pages 리스트에서 없어지고
 * 다음 페이지는 props.isInbodyData 를 통해 activeCardNumber 를 설정해준다.
 */
const withInbodyPages = [
  { 'component': healthStatusCard, 'title': '건강 상태', 'subtitle': '' },
  { 'component': healthStatusRFSCard, 'title': '나의 식사 습관', 'subtitle': '' },
  { 'component': healthStatusMuscleCard, 'title': '나의 체성분', 'subtitle': '' },
  { 'component': healthStatusExerciseIntensityCard, 'title': '나의 운동습관', 'subtitle': '' },
  { 'component': healthStatusSleepCard, 'title': '나의 수면 습관', 'subtitle': '' },
  // {'component': emptyCard, 'title': '', 'subtitle': ''},
]
const withoutInbodyPages = [
  { 'component': healthStatusCardExcludeInbody, 'title': '건강 상태', 'subtitle': '' },
  { 'component': healthStatusRFSCard, 'title': '나의 식사 습관', 'subtitle': '' },
  // {'component': healthStatusMuscleCard, 'title': '나의 근육량', 'subtitle': ''},
  { 'component': healthStatusExerciseIntensityCard, 'title': '나의 운동습관', 'subtitle': '' },
  { 'component': healthStatusSleepCard, 'title': '나의 수면 습관', 'subtitle': '' },
  // {'component': emptyCard, 'title': '', 'subtitle': ''},
]
let health_rfs_info = ref(null)
let health_score_info = ref(null)
let health_sleep_habits_info = ref(null)
let health_exercise_intensity_info = ref(null)
let user_id = props.userInfo.user_id
let s_code = ref(useSessionStore.getScode())

const isLoading = ref(false)
const activeCard = ref(null)
const activeCardNumber = ref(1)

onBeforeMount(async () => {
  await getData()
})
onMounted(async () => {
  setCardMinHeight()
  window.addEventListener("resize", setCardMinHeight);
})
const changeCard = (new_id) => {
  if (new_id != 0) {
    activeCard.value.$el.swiper.slideTo(parseInt(new_id) - 1)
  }
}
const changeSlide = (index) => {
  activeCardNumber.value = index.activeIndex + 1
}
const setCardMinHeight = () => {

  const card = document.querySelector('.swiper');
  const header = document.querySelector('header');
  const tabs = document.querySelector('.tabs');
  const footer = document.querySelector('footer');

  const mainHeight = window.innerHeight - (header.offsetHeight + footer.offsetHeight + tabs.offsetHeight);
  const minCardHeight = mainHeight * 0.93; // 카드 높이를 mainHeight의 80%로 설정
  card.style.height = `${minCardHeight}px`;
}
const getData = async () => {

  if (props.isInbodyData) {
    var get_health_report_score = await getHealthScore2Report(user_id, s_code.value)
    health_score_info.value = new HealthScore2()
    health_score_info.value.setData(get_health_report_score)
  } else {
    var get_health_report_score = await getHealthScore1Report(user_id, s_code.value)
    health_score_info.value = new HealthScore1()
    health_score_info.value.setData(get_health_report_score)
  }

  health_rfs_info.value = new RFSScore()
  var get_health_report_rfs = await getDietQualityReport(user_id, s_code.value)
  health_rfs_info.value.setData(get_health_report_rfs)

  health_sleep_habits_info.value = new HealthSleepHabits()
  var get_health_report_sleep = await getSleepHabitScoreReport(user_id, s_code.value)
  health_sleep_habits_info.value.setData(get_health_report_sleep)

  health_exercise_intensity_info.value = new ExerciseIntensity()
  var get_health_report_exercise = await getExerciseIntensityReport(user_id, s_code.value)
  health_exercise_intensity_info.value.setData(get_health_report_exercise)

}

</script>
<template>

  <div class="card-box health">
    <LoaderModule :is-loading="isLoading"></LoaderModule>

    <swiper @slideChange="changeSlide" :slidesPerView="1" ref="activeCard" :spaceBetween="15" :mousewheel="true"
      :pagination="{
        clickable: true,
      }">
      <swiper-slide v-for="(page, i) in withInbodyPages" :key="i" :virtual-index="i" v-if="props.isInbodyData">
        <component :is="page.component" :title="page.title" :subtitle="page.subtitle"
          :health-report-rfs-data="health_rfs_info" :health-report-score-data="health_score_info"
          :health-report-sleep-habits-data="health_sleep_habits_info" :user-info="props.userInfo"
          :is-inbody-data="props.isInbodyData" :exercise-intensity-info="health_exercise_intensity_info"
          @changeCard="changeCard" :active-card-number="activeCardNumber" />

      </swiper-slide>
      <swiper-slide v-for="(page, j) in withoutInbodyPages" :key="j" :virtual-index="j" v-else>
        <component :is="page.component" :title="page.title" :subtitle="page.subtitle"
          :health-report-rfs-data="health_rfs_info" :health-report-score-data="health_score_info"
          :health-report-sleep-habits-data="health_sleep_habits_info" :user-info="props.userInfo"
          :is-inbody-data="props.isInbodyData" :exercise-intensity-info="health_exercise_intensity_info"
          @changeCard="changeCard" :active-card-number="activeCardNumber" />

      </swiper-slide>

    </swiper>
  </div>

</template>