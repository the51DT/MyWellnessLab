<script setup>
import { sessionStore } from '@/store/store'
import { ref, onMounted, watch } from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'
import Bubble2DChart from "@/components/chart/Bubble2DChart.vue";

import { onBeforeUnmount } from 'vue';

const useSessionStore = sessionStore()
const datas = ref(null)
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
  if (newVal == 1) {
    setTimeout(() => {
      resizeMessage()
    }, 100)
  } else {
    window.removeEventListener("resize", resizeMessage);
  }
})
watch(() => props.healthReportScoreData, async (newVal) => {
  datas.value = newVal
  setTimeout(() => {
    resizeMessage()
  }, 100)
})
onMounted(async () => {
  window.addEventListener("resize", resizeMessage);
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeMessage);
})
const resizeMessage = () => {
  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_main_title = document.querySelector('.card-main-title') // 카드 제목
  const card_content_title = document.querySelector('.card-content-title')
  const chart_wrap = document.querySelector('.chart-wrap'); // 차트 부분
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분

  const main_height = card_content_box.offsetHeight - (
    chart_wrap.offsetHeight + card_main_title.offsetHeight + card_content_title.offsetHeight
  );
  const card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`
}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
}
</script>
<template>

  <cardComponent :title=props.title :more="true" :description-title="'건강 위치란?'"
    :activeCard="props.activeCardNumber == 1" @card-fliped="cardFliped">
    <template v-slot:content v-if="isCardFliped == false">
      <div class="card-content-title first">몸 속 산화 스트레스, 대사 능력을 고려한 건강 상태를 확인해 보세요.</div>
      <div class="bubble-2d-chart">
        <div class="legend-container">
          <span class="legend1"></span><span class="stretch-text">주의</span>
          <span class="legend2"></span><span class="stretch-text">보통</span>
          <span class="legend3"></span><span class="stretch-text">좋음</span>
          <div class="legend4"></div>
          <span class="stretch-text">{{ props.userInfo.user_name }}님</span>
        </div>
        <Bubble2DChart v-if="datas != null" :oxi="datas.hq_oxi.score" :met="datas.hq_met.score"
          :mus="datas.hq_musBal.score" />

      </div>
      <div class="card-front-description">
        <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight != ''">
          <div class="card-description ">
            <div class="description-box">
              <div class="description">
                <p>{{ props.userInfo.user_name }}님의 건강 상태는 파란색 아이콘으로 표시되어 있습니다.</p>
              </div>
              <div class="description">
                <p>노화 억제 분석 지수는 {{ datas.hq_oxi.score }} 점이고, 만성질환 억제 분석 지수는
                  {{ datas.hq_met.score }}점으로 {{ datas.health_status_color }} 영역에 위치합니다.</p>
              </div>
              <div class="description">
                <p>한국 성인 표본 집단과 비교하여 {{ props.userInfo.user_name }}님의 건강 상태는 {{ datas.health_status_msg }} 수준으로 판정됩니다.
                </p>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    </template>
    <template v-slot:description>
      <div class="description">
        <p>19세 이상의 한국 성인 빅데이터를 사용해 건강 점수 분포를 그래프 상에 표현하였습니다. 이를 통해 현재의 건강 상태를 한눈에 볼 수 있게 도와줍니다.</p>
      </div>
      <div class="description">
        <p>초록색 영역은 건강이 좋다는 것을, 반면 빨간색 영역은 건강에 더 주의해야 한다는 것을 나타냅니다.</p>
      </div>
      <div class="description">
        <p>건강 위치의 변화는 곧 건강 상태의 변화를 의미합니다. 나의 건강 위치를 주기적으로 확인하여, 초록색 영역으로 이동할 수 있도록 건강 관리에 힘써주세요. </p>
      </div>
    </template>
  </cardComponent>

</template>