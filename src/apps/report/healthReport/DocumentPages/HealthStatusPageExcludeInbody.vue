<script setup>
import { ref, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import DimComponent from "@/components/dim/DimComponent.vue";
const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthScoreData: null,
  healthRfsData: null,
  healthSleepHabitsData: null,
  exerciseIntensityData: null,
  report_no: null,
  page: Number
});
const datas = ref({
  oxi_status: 0,
  met_status: 0,
  mus_status: 0,
  exercise_intensity_status: 0,
  rfs_status: 0,
  sleep_status: 0,
  health_status_msg_1: "",
  health_status_msg_2: "",
  health_status_msg_3: ""
});
const setData = () => {
  datas.value.oxi_status = props.healthScoreData.hq_oxi.status
  datas.value.met_status = props.healthScoreData.hq_met.status
  datas.value.mus_status = props.healthScoreData.hq_musBal.status
  datas.value.exercise_intensity_status = props.exerciseIntensityData?.met_status || 0  
  datas.value.rfs_status = props.healthRfsData.food_data[0].status
  datas.value.sleep_status = props.healthSleepHabitsData.data_list[0].status
  datas.value.health_status_msg_1 = props.healthScoreData.hq_htype.msg.msg_hs
  datas.value.health_status_msg_2 = props.healthScoreData.hq_htype.msg.msg_lh
  datas.value.health_status_msg_3 = props.healthScoreData.hq_htype.msg.msg_sol
}

onMounted(async () => {
  setData()
  emit('mounted')
});
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside bg">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-health-status.png" />

          <h3>나의 건강 신호등</h3>

        </div>
        <span class="stretch-text">
          건강 신호등은 개인의 신체 건강과 생활습관을 종합한 건강 상태를 나타냅니다.<br/>
          건강 신호등을 통해 우선적으로 관리 해야할 건강 영역과 생활습관을 점검해 보세요.<br/>
        </span>
      </div>
      <div class="data-container">
        <div class="subject">
          <div class="legend-container">
            <div class="legend1"></div>
            <span class="stretch-text">주의</span>
            <div class="legend2"></div>
            <span class="stretch-text">관리</span>
            <div class="legend3"></div>
            <span class="stretch-text">좋음</span>
          </div>
        </div>
        <div class="data">
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
                <div class="img-box">
                  <DimComponent :padding-flag="false" />
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
          </div>

        </div>
      </div>
      <div class="desc">
        <p ><img src="@/assets/images/pdf/res/icon-check-b.png" /> 건강 지수</p>
        {{ datas.health_status_msg_1 }} <br />
        <p ><img src="@/assets/images/pdf/res/icon-check-b.png" /> 생활 습관</p>
        {{ datas.health_status_msg_2 }} <br />
        <img src="@/assets/images/pdf/res/icon-check-b.png" /> {{ datas.health_status_msg_3 }} <br />
        <br />
        <p> * 체성분 데이터 입력 시 ‘근육 밸런스 분석 지수’ 를 확인 할 수 있습니다. </p>
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  padding-top: calc(21.98px * $pdf-scale);
  height: calc(122.55px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(11px * $pdf-scale);
    padding-left: calc(57.35px * $pdf-scale);
    line-height: calc(17px * $pdf-scale);
    font-weight: 300;
  }

  img {
    width: calc(42.9px * $pdf-scale) !important;
    height: calc(42.9px * $pdf-scale) !important;
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #64A531;
    font-weight: $medium;
  }
}

.data-container {
  position: relative;
  width: 100%;
  height: calc(310px * $pdf-scale);
  margin-top: calc(6.81px * $pdf-scale);
  /* margin-bottom: calc(22.58px * $pdf-scale); */
  border-top: calc(0.3px * $pdf-scale) solid #000000;
}

.subject {
  display: flex;
  justify-content: space-between;
  /* padding-top: calc(12.39px * $pdf-scale); */
  padding-right: calc(10.35px * $pdf-scale);
  /* margin-bottom: calc(6.81px * $pdf-scale); */

  h3 {
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
  }
}

.legend-container {
  @include flex(end, center);
  position: absolute;
  top: calc(10px * $pdf-scale);
  right: calc(12.66px * $pdf-scale);

  div {
    display: inline-block;
    margin-left: calc(9.89px * $pdf-scale);
    margin-right: calc(2.75px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
  }

  .legend1 {
    background-color: #E95371;
  }

  .legend2 {
    background-color: #F8B500;
  }

  .legend3 {
    background-color: #5AB651;
  }

  h3 {
    font-size: calc(12px * $pdf-scale);
  }

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
    color: #727171;
  }
}

.status-grid-container {
  margin-top: calc(46px * $pdf-scale);


  .status-grid-box {
    justify-content: center;
    align-content: center;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: calc(5px * $pdf-scale);
    padding: 0;
    list-style: none;
    max-width: calc(252px * $pdf-scale);
    ;
    margin: 0 auto;

    & .status-item {

      & .img-box {
        position: relative;
        @include flex(center, center);
        aspect-ratio: 1 / 1;
        width: calc(80px * $pdf-scale);
        height: calc(80px * $pdf-scale);
        max-width: calc(80px * $pdf-scale);
        max-height: calc(80px * $pdf-scale);

        &.danger {
          background-color: #E95371;
        }

        &.warn {
          background-color: #F8B500;
        }

        &.normal {
          background-color: #5AB651
        }

        img {
          width: calc(48px * $pdf-scale);
          height: auto;
        }

      }

      span {
        text-align: center;
        padding-top: calc(8px * $pdf-scale);
        padding-bottom: calc(12px * $pdf-scale);
        font-size: calc(12px * $pdf-scale);
        font-weight: 500;
        display: block;
      }
    }
  }
}

.bottom-info {
  margin-top: calc(5.5px * $pdf-scale);

  position: static;
}

.desc {
  font-size: calc(10px * $pdf-scale);
  height: calc(267px * $pdf-scale);

  p {
    font-weight: $bold;
  }

  img {
    width: calc(8px * $pdf-scale);
    height: calc(8px * $pdf-scale);
    margin-right: calc(5px * $pdf-scale);
  }
}
</style>
