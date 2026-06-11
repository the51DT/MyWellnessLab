<script setup>
import { ref, watch, computed } from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'

const datas = ref(null)
const scrollbarHeight = ref("")
const isCardFliped = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  exerciseIntensityInfo: {
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
  if (props.isInbodyData == true ? newVal == 4 : newVal == 3) {
    if (isCardFliped.value == false) {
      setTimeout(() => {
        resizeMessage()
      }, 100)
    }
    window.addEventListener("resize", resizeMessage);
  } else {
    window.removeEventListener("resize", resizeMessage);
  }
})
const getMaxPercentage = computed(() => {
  // 600 이 넘었을 경우 100% 아니면 600을 기준으로 100%로 환산
  if (props.exerciseIntensityInfo.met_score >= 600) return 100;
  return (props.exerciseIntensityInfo.met_score / 600) * 100;
});
const getMyPos = computed(() => {
  // 현재 나의 위치를 계산
  // 나의 점수가 600을 넘었을경우 나의 점수를 100%으로 환산하여 계산
  // 600이 안넘었을경우 600을 기준으로 100%로 환산하여 계산
  if (props.exerciseIntensityInfo.met_score >= 600) return 100;
  return (props.exerciseIntensityInfo.met_score / 600) * 100;
});
const getStandardPos = computed(() => {
  // 현재 나의 위치를 계산
  // 나의 점수가 600을 넘었을경우 나의 점수를 100%으로 환산하여 계산
  // 600이 안넘었을경우 600을 기준으로 100%로 환산하여 계산
  if (props.exerciseIntensityInfo.met_score >= 600) return (600 / props.exerciseIntensityInfo.met_score) * 100;
  return 100;
});
const resizeMessage = () => {

  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_main_title = document.querySelector('.card-main-title') // 카드 제목
  const card_content_title = document.querySelector('.card-content-title')

  const row_box = document.querySelector('.item-row-box'); // 그리드 부분 (margin 포함됨)
  const chart_container = document.querySelector('#exerciseIntensityTrackingChart'); // 차트 부분
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분

  const main_height = card_content_box.offsetHeight - (
    card_main_title.offsetHeight + chart_container.offsetHeight + row_box.offsetHeight + card_content_title.offsetHeight);
  const card_front_description_h = main_height * 0.6;
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`

}
const cardFliped = (new_value) => {
  isCardFliped.value = new_value
}
// 메시지 문단 나눔
const splitMessage = computed(() => {
  // 첫번째 문단 빼고 나머지는 합침
  const index = props.exerciseIntensityInfo.met_msg.indexOf('\n');

  const firstPart = props.exerciseIntensityInfo.met_msg.slice(0, index);
  const restPart = props.exerciseIntensityInfo.met_msg.slice(index + 1); // \n 이후부터 끝까지

  return [firstPart, restPart]
});
</script>
<template>
  <cardComponent :title=props.title :more="true" :description-title="'나의 운동습관이란?'"
    :activeCard="props.isInbodyData == true ? props.activeCardNumber == 4 : props.activeCardNumber == 3"
    @card-fliped="cardFliped">
    <template v-slot:content v-if="isCardFliped == false">
      <div class="card-content-title first">나의 운동 습관은 일상 속 활동량을 평가하는 항목입니다.
        나의 운동 습관을 확인해 보세요.</div>
      <div id="exerciseIntensityTrackingChart">
        <div class="my-point-line" :style="{ left: getMyPos + '%' }" />
        <div class="my-point-score" :style="{ left: getMyPos + '%' }">
          <p>{{ props.userInfo.user_name }}님 활동량</p>
          <span class="score">{{ props.exerciseIntensityInfo.met_score }}</span>
        </div>
        <div class="standard-point-dashed" :style="{ left: getStandardPos + '%' }" />
        <div class="standard-point-score" :style="{ left: getStandardPos + '%' }">
          <span class="score">600</span>
          <p>WHO 권장</p>
        </div>
        <div class="init-point-line" />
        <div class="init-point-score">
          <span class="score">0</span>
        </div>

        <div class="tracking-horizontal-container">
          <div class="background-container" :style="{ width: getMaxPercentage + '%' }">
            <!-- 저강도 운동 -->
            <div class="background1"
              :style="{ left: 0, width: props.exerciseIntensityInfo.low_intensity_percent + '%' }">
            </div>
            <!-- 중강도 운동 -->
            <div class="background2"
              :style="{ left: props.exerciseIntensityInfo.low_intensity_percent + '%', width: props.exerciseIntensityInfo.moderate_intensity_percent + '%' }">
            </div>
            <!-- 고강도 운동 -->
            <div class="background3"
              :style="{ left: (props.exerciseIntensityInfo.low_intensity_percent + props.exerciseIntensityInfo.moderate_intensity_percent) + '%', width: props.exerciseIntensityInfo.high_intensity_percent + '%' }">
            </div>
          </div>
        </div>
      </div>
      <div class="item-row-box">
        <div class="row-box head">
          <div class="cell">운동강도</div>
          <div class="cell">MET</div>
        </div>

        <div class="row-box">
          <div class="cell">
            <div class="legend1"></div>
            <span class="ml-0-6">저강도 운동</span>
          </div>
          <div class="cell">{{ props.exerciseIntensityInfo.low_intensity_score }}</div>
        </div>
        <div class="row-box">
          <div class="cell">
            <div class="legend2"></div>
            <span class="ml-0-6">중강도 운동</span>
          </div>
          <div class="cell">{{ props.exerciseIntensityInfo.moderate_intensity_score }}</div>
        </div>
        <div class="row-box bold">
          <div class="cell">
            <div class="legend3"></div>
            <span class="ml-0-6">고강도 운동</span>
          </div>
          <div class="cell">{{ props.exerciseIntensityInfo.high_intensity_score }}</div>
        </div>
        <div class="row-box bold">
          <div class="cell font-medium">총 운동운동</div>
          <div class="cell font-medium">{{ props.exerciseIntensityInfo.met_score }}</div>
        </div>
        <div class="row-box bold">
          <div class="cell font-medium">판정</div>
          <div class="cell font-medium normal" v-if="props.exerciseIntensityInfo.met_status == 1">좋음</div>
          <div class="cell font-medium warn" v-else-if="props.exerciseIntensityInfo.met_status == 2">관리</div>
          <div class="cell font-medium danger" v-else>주의</div>
        </div>
      </div>
      <div class="card-front-description">
        <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight != ''">
          <div class="card-description ">
            <div class="description-box">
              <div class="description">
                <p>{{ splitMessage[0] }}</p>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>

    </template>
    <template v-slot:description>
      <div class="description">
        <p>나의 운동 습관은 일상 속 활동량을 평가하는 항목으로, 세계보건기구 (WHO) 기준에 따라 나의 활동 수준을 제시합니다. 일상에서의 활동을 저·중·고 운동 강도로 구분하며 소모하는
          에너지량(MET, Metabolic Equivalent of Task)을 분석 값으로 제공합니다. </p>
      </div>
      <div class="description">
        <p>MET는 신체활동의 강도를 나타내는 단위입니다. 1 MET는 가만히 앉아 있을때의 에너지 소비량을 의미하며, 활동이 격해질수록 MET 수치는 높아집니다. 
          <br />
          · 📍 앉아 있기 = 1 MET<br />
          · 🚶‍♀️ 걷기 = 3.3 MET<br />
          · 🚴 자전거 타기 = 4.0 MET<br />
          · 🏋️‍♀️ 격한 운동 = 8.0 MET<br />
        </p>
      </div>
      <div class="description">
        <p>일주일간의 활동 점수는 아래와 같이 계산됩니다. <br />→ 활동 MET x 활동 시간(분) x 일수<br />WHO는 이 점수의 총합이 600점 이상이면 건강을 위한 충분한 활동량으로
          간주합니다.</p>
      </div>
    </template>
  </cardComponent>

</template>