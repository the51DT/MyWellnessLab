<script setup>
import { ref, onMounted, watch } from 'vue';
import cardComponent from '@/components/card/CardComponent.vue'
const datas = ref({
  oxi_status: 0,
  met_status: 0,
  mus_status: 0,
  exercise_intensity_status: 0,
  rfs_status: 0,
  sleep_status: 0,
  msg_hs: '',
  msg_lh: '',
  msg_sol: ''
})
const scrollbarHeight = ref("")

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  healthReportScoreData: {
    type: Object,
    required: false
  },
  healthReportRfsData: {
    type: Object,
    required: false
  },
  healthReportSleepHabitsData: {
    type: Object,
    required: false
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
watch(() => props.healthReportScoreData, (newVal) => {
  if (newVal) {
    datas.value.oxi_status = newVal.hq_oxi.status
    datas.value.met_status = newVal.hq_met.status
    datas.value.mus_status = newVal.hq_musBal.status
    datas.value.msg_hs = newVal.hq_htype.msg.msg_hs
    datas.value.msg_lh = newVal.hq_htype.msg.msg_lh
    setTimeout(() => {
      resizeMessage()
    }, 100)
  }
})
watch(() => props.activeCardNumber, async (newVal) => {
  if (newVal == 1) {
    window.addEventListener("resize", resizeMessage);
  } else {
    window.removeEventListener("resize", resizeMessage);
  }
})
onMounted(async () => {
})

/** 아래 부분은 값이 늦게 들어오는 경우가 있어 상태를 확인해야함 */

// 식사 지표
watch(
  () => props.healthReportRfsData?.food_data[0]?.status,
  (newVal, oldVal) => {
    if (newVal !== undefined && newVal !== null) {
      datas.value.rfs_status = newVal
    }
  }
);

// 수면 지표
watch(
  () => props.healthReportSleepHabitsData?.data_list[0]?.status,
  (newVal, oldVal) => {
    if (newVal !== undefined && newVal !== null) {
      datas.value.sleep_status = newVal
    }
  }
);

// 운동 지표
watch(
  () => props.exerciseIntensityInfo?.met_status,
  (newVal, oldVal) => {
    if (newVal !== undefined && newVal !== null) {
      datas.value.exercise_intensity_status = newVal
    }
  }
);
const resizeMessage = () => {
  const card_content_box = document.querySelector('.card-content'); // 카드 전체
  const card_main_title = document.querySelector('.card-main-title') // 카드 제목
  const card_content_title = document.querySelector('.card-content-title')
  const status_grid_container = document.querySelector('.status-grid-container'); // 그리드 부분 (margin 포함됨)
  const card_front_description = document.querySelector('.card-front-description') // 설명 부분

  const marginTop = parseFloat(window.getComputedStyle(status_grid_container).marginTop);
  const marginBottom = parseFloat(window.getComputedStyle(status_grid_container).marginBottom);
  const status_grid_container_h = status_grid_container.offsetHeight + marginTop + marginBottom;

  var main_height = card_content_box.offsetHeight - (card_main_title.offsetHeight + status_grid_container_h + card_content_title.offsetHeight);
  const card_front_description_h = main_height * 0.65; // 0.65는 조정
  card_front_description.style.height = `${card_front_description_h}px`
  scrollbarHeight.value = `${card_front_description.offsetHeight}px`
}
</script>
<template>
  <!-- props.activeCardNumber 를 설정하는 이유는, 해당 카드로 접근했을때 보여지기 위함임. 
 만약 설정해주지 않으면 카드리스트 페이지 (여기서는 healthStatusReport 컴포넌트에 해당)에 접근했을때 onMounted 가 실행되어,
 그려지는 화면에 충돌이 발생할 가능성이 있음-->
  <cardComponent :title=props.title :more="false" :activeCard="props.activeCardNumber == 1">
    <template v-slot:content>
      <div class="card-content-title first">신체 건강과 생활 습관을 한눈에 파악하고, 개선이 필요한 영역을 확인해 보세요.</div>
      <div class="status-grid-container">
        <div class="status-grid-box">
          <div class="status-item">
            <div class="img-box" :class="{
              normal: datas.oxi_status === 1,
              warn: datas.oxi_status === 2,
              danger: datas.oxi_status === 3
            }">
              <img src="@/assets/images/icons/i-oxi.png"></img>
            </div>

            <span>노화 억제<br />분석 지수</span>
          </div>
          <div class="status-item">
            <div class="img-box" :class="{
              normal: datas.met_status === 1,
              warn: datas.met_status === 2,
              danger: datas.met_status === 3
            }">
              <img src="@/assets/images/icons/i-met.png"></img>
            </div>

            <span>만성질환 억제<br />분석 지수</span>
          </div>
          <div class="status-item">
            <div class="img-box" :class="{
              normal: datas.mus_status === 1,
              warn: datas.mus_status === 2,
              danger: datas.mus_status === 3
            }">
              <img src="@/assets/images/icons/i-mus.png"></img>
            </div>

            <span>근육 밸런스<br />분석 지수</span>
          </div>
          <div class="status-item">
            <div class="img-box" :class="{
              normal: datas.rfs_status === 1,
              warn: datas.rfs_status === 2,
              danger: datas.rfs_status === 3
            }">
              <img src="@/assets/images/icons/i-rfs.png"></img>
            </div>
            <span>식사</span>
          </div>
          <div class="status-item">
            <div class="img-box" :class="{
              normal: datas.exercise_intensity_status === 1,
              warn: datas.exercise_intensity_status === 2,
              danger: datas.exercise_intensity_status === 3
            }">
              <img src="@/assets/images/icons/i-fitness.png"></img>
            </div>
            <span>운동</span>
          </div>
          <div class="status-item">
            <div class="img-box" :class="{
              normal: datas.sleep_status === 1,
              warn: datas.sleep_status === 2,
              danger: datas.sleep_status === 3
            }">
              <img src="@/assets/images/icons/i-sleep.png"></img>
            </div>
            <span>수면</span>
          </div>

        </div>
        <div class="info">
          <div class="info-list">
            <div class="info-item">
              <div class="info-danger"></div>
              <span>주의</span>
            </div>
            <div class="info-item">
              <div class="info-warn"></div>
              <span>관리</span>
            </div>
            <div class="info-item">
              <div class="info-normal"></div>
              <span>좋음</span>
            </div>
          </div>
        </div>

      </div>
      <div class="card-front-description">
        <Scrollbar :maxHeight="scrollbarHeight" always v-if="scrollbarHeight != ''">
          <div class="card-description ">
            <div class="description-box">
              <!--25.08.07 체크아이콘 추가-->
              <div class="description add-check">
                <img src="@/assets/images/pdf/res/icon-check-b.png" /> 
                <p class="font-bold">건강 지수</p>
              </div>
              <div class="description">
                <p>{{ datas.msg_hs }}</p>
              </div>
              <div class="description add-check">
                <img src="@/assets/images/pdf/res/icon-check-b.png" /> 
                <p class="font-bold">생활 습관</p>
              </div>
              <div class="description">
                <p>{{ datas.msg_lh }}</p>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>

    </template>
  </cardComponent>

</template>