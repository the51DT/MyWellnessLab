<script setup>
import { computed, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import ScoreComDocument from "./com/ScoreComDocument.vue";


const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  pdfScale: null,
  exerciseIntensityData: null,
  page: Number
});
const getMaxPercentage = computed(() => {
  // 600 이 넘었을 경우 100% 아니면 600을 기준으로 100%로 환산
  if (props.exerciseIntensityData.met_score >= 600) return 100;
  return (props.exerciseIntensityData.met_score / 600) * 100;
});
const getMaxScoreValue = computed(() => {
  // 현재 나의 점수에 따라 최대값을 설정
  if (props.exerciseIntensityData.met_score >= 600) return props.exerciseIntensityData.met_score;
  return 600;
});
const getMyPos = computed(() => {
  // 현재 나의 위치를 계산
  // 나의 점수가 600을 넘었을경우 나의 점수를 100%으로 환산하여 계산
  // 600이 안넘었을경우 600을 기준으로 100%로 환산하여 계산
  if (props.exerciseIntensityData.met_score >= 600) return 100;
  return (props.exerciseIntensityData.met_score / 600) * 100;
});
const getStandardPos = computed(() => {
  // 현재 나의 위치를 계산
  // 나의 점수가 600을 넘었을경우 나의 점수를 100%으로 환산하여 계산
  // 600이 안넘었을경우 600을 기준으로 100%로 환산하여 계산
  if (props.exerciseIntensityData.met_score >= 600) return (600 / props.exerciseIntensityData.met_score) * 100;
  return 100;
});
onMounted(async () => {

  emit('mounted')
});
</script>
<template>
  <div id="page" class="custom-page a4">
    <div class="page-inside">
      <PageHeader :page="props.page" />
      <div class="title-container">
        <div class="title-box">
          <div class="title">
            <img src="@/assets/images/pdf/res/img-exercise-intensity.png" />
            <h3 class="stretch-text">나의 운동습관</h3>
          </div>
          <span class="stretch-text">
            나의 운동 습관은 일상 속 활동량을 평가하는 항목으로, 세계보건기구 (WHO) 기준에 따라 나의 활동 수준을 제시합니다. 일상에서의 활동을 저·중·고 운동 강도로 구분하며 소모하는
            에너지량(MET, Metabolic Equivalent of Task)을 분석 값으로 제공합니다. 나의 운동 습관을 확인해 보세요.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <span class="stretch-text">[나의 운동습관]</span>
          <div class="score-chart">
            <div class="score-div">
              <!-- 점수 그래프 -->
              <ScoreComDocument :pdfScale="props.pdfScale" :value="props.exerciseIntensityData.met_score"
                :status="props.exerciseIntensityData.met_status" :width="5" :hideScore="true" :right="false"
                :max-value="getMaxScoreValue" />
            </div>
            <div class="score">
              <div class="score-top stretch-text"
                :class="props.exerciseIntensityData.met_status == 1 ? 'green' : props.exerciseIntensityData.met_status == 3 ? 'red' : 'yellow'">
                <div class="score-number">{{ props.exerciseIntensityData.met_score }}</div>
              </div>
              <div class="score-bottom stretch-text">
                MET-min/week
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [나의 운동습관 상세 판정]
          </h3>
        </div>
        <div class="data-box">
          <div class="chart-container">
            <div class="my-point-pointer">
              <div class="my-point-line" :style="{ bottom: getMyPos + '%' }" />
              <div class="stretch-text my-point-score" :style="{ bottom: getMyPos + '%' }">
                <p>{{ props.userInfo.user_name }}님 활동량</p>
                <span class="score">{{ props.exerciseIntensityData.met_score }}</span>
              </div>
              <div class="standard-point-dashed" :style="{ bottom: getStandardPos + '%' }" />
              <div class="stretch-text standard-point-score" :style="{ bottom: getStandardPos + '%' }">
                <span class="score">600</span>
                <p>WHO 권장</p>
              </div>
              <div class="init-point-line" />
              <div class="stretch-text init-point-score">
                <span class="score">0</span>
              </div>
            </div>
            <div class="tracking-horizontal-container">
              <div class="background-container" :style="{ height: getMaxPercentage + '%' }">
                <!-- 저강도 운동 -->
                <div class="background1"
                  :style="{ bottom: (props.exerciseIntensityData.high_intensity_percent + props.exerciseIntensityData.moderate_intensity_percent) + '%', height: props.exerciseIntensityData.low_intensity_percent + '%' }">
                </div>
                <!-- 중강도 운동 -->
                <div class="background2"
                  :style="{ bottom: props.exerciseIntensityData.high_intensity_percent + '%', height: props.exerciseIntensityData.moderate_intensity_percent + '%' }">
                </div>
                <!-- 고강도 운동 -->
                <div class="background3"
                  :style="{ bottom: 0, height: props.exerciseIntensityData.high_intensity_percent + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="right-container">
            <div class="description">
              <span class="bold">MET란 무엇인가요?</span><br />
              MET는 신체활동의 강도를 나타내는 단위입니다.<br />
              1 MET는 가만히 앉아 있을때의 에너지 소비량을 의미하며, 활동이 격해질수록 MET 수치는 높아집니다.<br />
              <div class="pt-3 pb-3 light">
                · 📍 <span class="pl-0-5"></span>앉아 있기 = 1 MET <br />
                · 🚶‍♀️ <span class="pl-0-5"></span>걷기 = 3.3 MET <br />
                · 🚴 <span class="pl-0-5"></span>자전거 타기 = 4.0 MET <br />
                · 🏋️‍♀️ <span class="pl-0-5"></span>격한 운동 = 8.0 MET <br />
              </div>
              <div class="pb-0-5">
                일주일간의 활동 점수는 아래와 같이 계산됩니다. <br />
                → 활동 MET x 활동 시간(분) x 일수 <br />
                WHO는 이 점수의 총합이 600점 이상이면 건강을 위한 충분한 활동량으로 간주합니다.
              </div>
            </div>
            <div class="table-container food">
              <div class="content-head first">
                <span class="stretch-text"> 운동강도 </span>
              </div>
              <div class="content-head">
                <span class="stretch-text"> MET </span>
              </div>
              <div class="content-title">
                <div class="legend1"></div>
                <span class="stretch-text">저강도 운동</span>
              </div>
              <div class="content">
                {{ props.exerciseIntensityData.low_intensity_score }}
              </div>
              <div class="content-title">
                <div class="legend2"></div>
                <span class="stretch-text">중강도 운동</span>
              </div>
              <div class="content">
                {{ props.exerciseIntensityData.moderate_intensity_score }}
              </div>
              <div class="content-title">
                <div class="legend3"></div>
                <span class="stretch-text">고강도 운동</span>
              </div>
              <div class="content">
                {{ props.exerciseIntensityData.high_intensity_score }}
              </div>
              <div class="content-head">
                <span class="stretch-text"> 총 운동강도 </span>
              </div>
              <div class="content-head">
                <span class="stretch-text"> {{ props.exerciseIntensityData.met_score }} </span>
              </div>
              <div class="content-head no-border-top">
                <span class="stretch-text"> 판정 </span>
              </div>
              <div class="content-head no-border-top">
                <span class="stretch-text normal" v-if="props.exerciseIntensityData.met_status == 1">좋음</span>
                <span class="stretch-text warn" v-else-if="props.exerciseIntensityData.met_status == 2">관리</span>
                <span class="stretch-text danger" v-else> 주의</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="desc">
        {{ props.exerciseIntensityData.met_msg }}
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다. 나의 활동량 판정은 국민건강영양조사의
        MET(Metabolic Equivalent of Task) 계산법을 따릅니다.
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  @include flex(flex-start, flex-start);
  padding-top: calc(15px * $pdf-scale);
  height: calc(144px * $pdf-scale);

  .title-box {
    width: calc(calc(500px) * $pdf-scale);
    padding-right: calc(10px * $pdf-scale);
  }

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    padding-left: calc(53.35px * $pdf-scale);
    letter-spacing: -0.03em;
    line-height: 155%;
    font-weight: 300;
  }

  img {
    width: calc(42.9px * $pdf-scale);
    height: calc(42.9px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #00A856;
    font-weight: $medium;
  }

  .vertical-line {
    height: 90%;
  }

  .score-container {
    width: calc(165px * $pdf-scale);
    height: calc(144px * $pdf-scale);
    // padding-left: calc(14.3px * $pdf-scale);
    padding-top: calc(0px * $pdf-scale);
    @include flex(start, center);
    flex-direction: column;

    // padding-top: calc(10px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
    font-weight: 500;

    span {
      font-weight: 500;
      font-size: calc(10px * $pdf-scale);
      margin-top: calc(0px * $pdf-scale);
      padding-left: calc(0 * $pdf-scale);
    }

    .score-chart {
      position: relative;
      margin-top: calc(10px * $pdf-scale);
      width: calc(87px * $pdf-scale);
      height: calc(87px * $pdf-scale);

      // padding-left: calc(10px * $pdf-scale);
      .score {
        position: absolute;
        flex-direction: column;
        top: 0;
        // left: calc(10px * $pdf-scale);
        @include flex(center, center);
        width: 100%;
        height: 100%;

        .score-top {
          @include flex(center, baseline);

          .score-number {
            font-size: calc(28px * $pdf-scale);
            font-weight: 400;
          }

          .score-text {
            font-size: calc(10px * $pdf-scale);
          }

          &.green {
            color: #008452
          }

          &.red {
            color: #C53135;
          }

          &.yellow {
            color: #DF9D00;
          }
        }

        .score-bottom {
          font-size: calc(6px * $pdf-scale);
          font-weight: 400;
          color: #727171;
          text-align: center;
        }
      }
    }
  }
}

.score-div {
  width: calc(87px * $pdf-scale);
  height: calc(87px * $pdf-scale);
  .container {
    min-height: auto;
  }
}

.desc {
  margin-top: calc(20px * $pdf-scale);
  height: calc(160px * $pdf-scale);
  font-size: calc(10px * $pdf-scale);
  color: #000000;
  white-space: pre-line;
}

hr {
  margin-top: calc(3.87px * $pdf-scale);
}

.data-container {
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  // border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .subject {
    @include flex(space-between, center);
    position: relative;

    padding-top: calc(5.2px * $pdf-scale);
    padding-left: calc(10.35px * $pdf-scale);
    padding-right: calc(10.35px * $pdf-scale);
    padding-bottom: calc(5.2px * $pdf-scale);
    height: calc(35px * $pdf-scale);

    h3 {
      font-size: calc(10px * $pdf-scale);
      font-weight: 500;
    }

    span {
      display: inline-block;
      font-size: calc(7px * $pdf-scale);
    }
  }
}

.chart-container {
  position: relative;
  width: 55%;
  height: 100%;
  background-color: white;
  @include flex(center, flex-start);
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 0;
  margin-top: calc(32px * $pdf-scale);
  gap: 0 !important;

  .my-point-pointer {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    background-color: transparent;
    width: 100%;
    height: 100%;
    z-index: 101;
  }

  .my-point-line {
    position: absolute;
    height: calc(0.5px * $pdf-scale);
    width: calc(80px * $pdf-scale) !important;
    left: calc(86px * $pdf-scale);
    border-bottom: calc(2px * $pdf-scale) solid #000000;
    transform: translateY(calc(5px));
    bottom: 0;
    z-index: 10;
  }

  .my-point-score {
    position: absolute;
    height: calc(21.8px * $pdf-scale) !important;
    left: calc(30px * $pdf-scale) !important;
    transform: translate(-15%, -50%);
    font-size: calc(10px * $pdf-scale);
    text-align: center;
    color: #000000;
    font-weight: $regular;

    & .score {
      font-weight: $semibold;
      font-size: calc(25px * $pdf-scale);
      color: #048551;
    }
  }

  .standard-point-dashed {
    position: absolute;
    height: calc(0.5px * $pdf-scale);
    width: calc(80px * $pdf-scale) !important;
    right: calc(85px * $pdf-scale);
    border-bottom: calc(1.5px * $pdf-scale) dashed #000000;
    transform: translateY(calc(0px));
    bottom: 0;
    z-index: 10;
  }

  .standard-point-score {
    position: absolute;
    height: calc(21.8px * $pdf-scale) !important;
    right: calc(20px * $pdf-scale) !important;
    transform: translate(-15%, 10%);
    font-size: calc(10px * $pdf-scale);
    text-align: center;
    color: #000000;
    font-weight: $regular;

    & .score {
      font-weight: $semibold;
      font-size: calc(25px * $pdf-scale);
    }
  }

  .init-point-line {
    position: absolute;
    height: calc(0.5px * $pdf-scale);
    width: calc(60px * $pdf-scale) !important;
    right: calc(105px * $pdf-scale);
    border-bottom: calc(1.5px * $pdf-scale) solid #000000;
    transform: translateY(calc(0px));
    bottom: 0;
    z-index: 10;
  }

  .init-point-score {
    position: absolute;
    height: calc(21.8px * $pdf-scale) !important;
    right: calc(85px * $pdf-scale) !important;
    transform: translate(-15%, 0%);
    font-size: calc(18px * $pdf-scale);
    text-align: center;
    color: #000000;
    font-weight: $regular;
    bottom: calc(-5px * $pdf-scale) !important;

    & .score {
      font-weight: $semibold;
      font-size: calc(20px * $pdf-scale);
    }
  }
}

.data-box {
  width: 100%;
  position: relative;
  @include flex(flex-start, flex-start);
}

.tracking-horizontal-container {
  flex-wrap: wrap;
  overflow-y: hidden;
  height: calc(352px * $pdf-scale);
  width: calc(50px * $pdf-scale);
  // border: calc(1px * $pdf-scale) solid #000000;
  background-color: #D9D9D9;
  position: relative;

  & .background-container {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    bottom: 0;
  }

  & .background1 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #EBF6F1;
    border-bottom: calc(1px * $pdf-scale) solid #000000;
    border-left: calc(1px * $pdf-scale) solid #000000;
    border-right: calc(1px * $pdf-scale) solid #000000;
  }

  & .background2 {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #C4E1C1;
    border-bottom: calc(1px * $pdf-scale) solid #000000;
    border-left: calc(1px * $pdf-scale) solid #000000;
    border-right: calc(1px * $pdf-scale) solid #000000;
  }

  & .background3 {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #048551;
    border-left: calc(1px * $pdf-scale) solid #000000;
    border-right: calc(1px * $pdf-scale) solid #000000;
  }
}

.right-container {
  width: 45%;

  & .description {
    font-size: calc(10px * $pdf-scale);
    color: #000000;
    font-weight: $regular;
    margin-top: calc(10px * $pdf-scale);
    line-height: 1.5;

    & .bold {
      font-weight: $bold;
    }

    & .light {
      font-weight: $light;
    }
  }
}

.table-container {
  @include flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  margin-top: calc(10px * $pdf-scale);
  margin-bottom: calc(13px * $pdf-scale);
  // margin-left: calc(100px * $pdf-scale);

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  display: grid;
  grid-template-columns: 1fr 1fr;


  align-items: center;
  justify-items: center;
  color: #000000;

  &.food {
    grid-template-rows: repeat(6, calc(24px * $pdf-scale));
  }

  .top {
    font-size: calc(10px * $pdf-scale);
    color: #727171;
  }

  .content-title {
    font-size: calc(12px * $pdf-scale);
    @include flex(center, center);
    text-align: left;
    width: 100%;
    height: 100%;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 300;

    & span {
      margin-left: calc(8px * $pdf-scale);
    }

  }

  .check-box {
    position: relative;
    width: calc(10px * $pdf-scale);
    height: calc(10px * $pdf-scale);
    border: calc(0.5px * $pdf-scale) solid #000;
    margin-right: calc(6px * $pdf-scale);

    .check {
      position: absolute;
      // top: calc(-2px * $pdf-scale);
      // left: calc(0px * $pdf-scale);
      width: calc(8px * $pdf-scale);
      height: calc(8px * $pdf-scale);
    }
  }

  .content-head {
    color: #000000;
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
    @include flex(center, center);
    // text-align: center;
    width: 100%;
    height: 100%;
    border-top: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: calc(0.5px * $pdf-scale) solid #000000;
    background-color: #F1F1F1;

    .normal {
      color: #5AB651;
      font-weight: 300;
    }

    .warn {
      color: #F8B500;
      font-weight: 300;
    }

    .danger {
      color: #E95371;
      font-weight: 300;
    }

    &.no-border-top {
      border-top: none;
    }
  }

  .last {
    font-weight: 600;
  }

  .content {
    padding: calc(2.5px * $pdf-scale) 0;
    font-size: calc(10px * $pdf-scale);
    @include flex(center, center);
    text-align: center;
    width: 100%;
    height: 100%;
    // border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    min-height: auto;

    .normal {
      color: #5AB651;
      font-weight: 700;
    }

    .danger {
      color: #E95371;
      font-weight: 700;
    }
  }

  .content-type {
    font-size: calc(18px * $pdf-scale);
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
  }

  .bold {
    font-weight: 600;
  }

  .bg {
    background-color: #eff7ef;
    color: #00a856;
  }

  .bt {
    border-top: calc(1px * $pdf-scale) solid #000000;
  }

  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

  .cell {
    grid-row: 2/4;
    background-color: #eff7ef;
    border-left: none;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
  }

  .row {
    border-left: none;
    grid-row: 4/17;
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 500;
  }

  .cell2 {
    grid-column: 1/3;
  }

  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

}

.bottom-info {
  bottom: calc(8px * $pdf-scale);
}

.legend1 {
  display: inline-block;
  border: calc(0.7px * $pdf-scale) solid #000000;
  width: calc(10px * $pdf-scale);
  height: calc(10px * $pdf-scale);
  background-color: #EBF6F1;
}

.legend2 {
  display: inline-block;
  width: calc(10px * $pdf-scale);
  height: calc(10px * $pdf-scale);
  background-color: #C4E1C1;
  border: calc(0.7px * $pdf-scale) solid #000000;
}


.legend3 {
  display: inline-block;
  width: calc(10px * $pdf-scale);
  height: calc(10px * $pdf-scale);
  background-color: #048551;
  border: calc(0.7px * $pdf-scale) solid #000000;
}
</style>