<script setup>
import { sessionStore, snackBarStore } from '@/store/store'
import { ref, watch } from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'
import iconCheck from '@/assets/images/pdf/res/icon-check-b.png'

const useSnackBarStore = snackBarStore()
const useSessionStore = sessionStore()
const datas = ref(null)
const table_datas = ref(null)
const userAge = ref(0)
const scrollbarHeight = ref("")
const isCardFliped = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  healthReportScoreData: {
    type: Object,
    required: false
  },
  healthReportSleepHabitsData: {
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

  },
  isInbodyData: {
    type: Boolean,
    required: true
  }
})
watch(() => props.activeCardNumber, async (newVal) => {
  if (props.isInbodyData == true ? newVal == 5 : newVal == 4) {
    if (isCardFliped.value == false) {
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
const setData = () => {
  var health_report_sleep_habits_data = props.healthReportSleepHabitsData
  // 수면의 질 제외
  datas.value = health_report_sleep_habits_data
  table_datas.value = health_report_sleep_habits_data.data_list.filter(item => item.key !== 'sh')
  userAge.value = props.healthReportScoreData.hqReference.age
}
const resizeMessage = () => {

  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_main_title = document.querySelector('.card-main-title')
  const card_content_title = document.querySelector('.card-content-title')
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분
  const row_box = document.querySelector('.assesment-row-box'); // 카드 테이블 부분

  const main_height = card_content_box.offsetHeight -
    (row_box.offsetHeight + card_main_title.offsetHeight + card_content_title.offsetHeight);
  const card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`

}
const toggleSnacBarPopup = (item) => {

  var message_list = datas.value.data_description_list
  var title = item.name;
  var sub_title = '';
  var message = '<div class="card-description"> <div class="description-box">';

  for (let i in message_list) {
    var description_item = message_list[i]
    if (description_item.key == item.key) {

      sub_title = description_item.description
      for (let i in description_item.description_list) {
        // 첫번째 문장은 볼드처리 (25.08.01)
        if (i == 0) {
          message += `<div class='description font-bold add-check'> <img src='${iconCheck}'/> ${description_item.description_list[i]} </div>`;
          continue;
        } else {
          message += `<div class='description'> ${description_item.description_list[i]} </div>`;
        }
      }
    }
  }
  message += '</div></div>';
  // 디바이스에 따라 popup 높이를 다르게 설정
  if (window.innerHeight > 800) {
    useSnackBarStore.setStore(title, sub_title, message, '1024', '60%')
  } else {
    useSnackBarStore.setStore(title, sub_title, message, '1024', '60%')
  }

}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
}
</script>
<template>

  <cardComponent :title=props.title :more="true" :description-title="'나의 수면 습관이란?'"
    :activeCard="props.isInbodyData == true ? props.activeCardNumber == 5 : props.activeCardNumber == 4"
    @card-fliped="cardFliped">
    <template v-slot:content v-if="isCardFliped == false">
      <div class="card-content-title first">올바른 수면 습관을 실천하고 있는지, 수면 부족으로 인한 문제는 없는지 확인해 보세요.</div>
      <div class="assesment-row-box">
        <div class="row-box head">
          <div class="row">
            <div class="cell"><span>수면 습관</span></div>
            <div class="cell"><span>판정</span></div>
          </div>
        </div>
        <div class="row-box">
          <div class="row" v-for="item in table_datas" v-if="table_datas">
            <div class="cell"><span>{{ item.name }}</span></div>
            <div class="cell" :class="item.status == 1 ? 'normal' : 'danger'"
              @click="item.popup_flag ? toggleSnacBarPopup(item) : function () { return }">
              <span>{{ item.status == 1 ? '충족' : '부족' }}</span>
              <i v-if="item.popup_flag" class="mark-arrow-right grey"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="card-front-description">
        <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight != ''">
          <div class="card-description ">
            <div class="description-box">
              <div class="description">
                <p>{{ useSessionStore.getUserInfo().user_name }}님의 수면의 질 점수는 {{ datas.data_list[0].cal_data }}점입니다.</p>
              </div>
              <div class="description">
                <p>성인의 권장 수면 시간은 7~9시간입니다. 수면 시간이 너무 짧거나 지나치게 길면 대사질환, 만성질환의 발병 위험을 증가시키고 주간 활동과 생산성에 영향을 미칠 수 있으므로 적정한
                  수면 시간을 유지하는 것이 중요합니다.</p>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>

    </template>
    <template v-slot:description>
      <div class="description">
        <p>나의 수면 습관에서 활용한 한국인의 수면 습관에 맞게 수정된 피츠버그 수면의 질 지수는 지난 한 달 동안의 수면 습관과 수면의 질을 평가합니다.</p>
      </div>
      <div class="description">
        <p>수면은 건강 유지 및 생활의 질을 높이는 필수 요소이며, 수면 습관을 개선하면 신체 회복, 질병 예방, 항산화 효과 등을 극대화할 수 있습니다.</p>
      </div>
    </template>
  </cardComponent>

</template>