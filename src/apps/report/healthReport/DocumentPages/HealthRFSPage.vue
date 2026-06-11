<script setup>
import { computed, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import ScoreComDocument from "./com/ScoreComDocument.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthRfsData: null,
  pdfScale: null,
  page: Number
});

const getPos = () => {
  return props.healthRfsData.rfs_cal_data + "%";
};
const getFoodData = computed(() => {

  // 식사의질 항목은 제외
  const foodData = props.healthRfsData.food_data.filter((item) => {
    return item.key !== "Rfs" && item.key !== "Regularmeal";
  });
  return foodData
});

const getFoodHabitData = computed(() => {
  // 명칭 매칭
  props.healthRfsData.food_description.forEach(element => {
    props.healthRfsData.food_data.forEach(item => {
      if (element.key == item.key) {
        item.name = element.name;
      }
    });

  });

  // 식사의질 항목은 제외
  const foodHabitData = props.healthRfsData.food_data.filter((item) => {
    return item.key == "Regularmeal";
  });
  return foodHabitData
});
// Lifecycle Hook
onMounted(async () => {
  // 나의 점수 위치 X 좌표 계산
  // await nextTick();

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
            <img src="@/assets/images/pdf/res/img-rfs.png" />
            <h3 class="stretch-text">나의 식사 습관</h3>
          </div>
          <span class="stretch-text">
            식사 습관 점수는 식사의 질을 분석한 것으로, 한국인을 위한 식사 가이드라인의 권장 섭취식품을 일상에서 얼마나 자주 섭취하고 있는지 평가합니다. 여러 논문에서 식사의 질 점수와 항산화, 대사,
            근육, 수면과 관련한 건강 요인과의 상관 관계가 보고되었으며, 건강한 사람들에게서 식사의 질 점수가 유의미하게 높은 것이 확인되었습니다.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <span class="stretch-text">[나의 식사 습관]</span>
          <div class="score-chart">
            <div class="score-div">
              <!-- 점수 그래프 -->
              <ScoreComDocument :pdfScale="props.pdfScale" :value="props.healthRfsData.rfs_cal_data"
                :status="props.healthRfsData.rfs_status" :width="8" :hideScore="true" :right="false" />
            </div>
            <div class="score">
              <div class="score-top stretch-text"
                :class="props.healthRfsData.rfs_status == 1 ? 'green' : props.healthRfsData.rfs_status == 3 ? 'red' : 'yellow'">
                <div class="score-number">{{ props.healthRfsData.rfs_cal_data }}</div>
                <div class="score-text">점</div>
              </div>
              <div class="score-bottom stretch-text">
                100점 기준
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [나의 식사 습관 상세 판정]
          </h3>
        </div>

        <div class="data-box">
          <div class="legend">
            <div class="legend-icon">
              <img src="@/assets/images/pdf/res/icon-check.png">
            </div>
            <div class="stretch-text">관리 필요</div>
          </div>
          <div class="chart-container">
            <div class="my-point-pointer">
              <div class="my-point-dashed" :style="{ bottom: getPos() }" />
              <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt=""
                :style="{ bottom: getPos() }">
              <div class="my-point-dot" :style="{ bottom: getPos() }"></div>
              <div class="stretch-text my-point-score" :style="{ bottom: getPos() }"> 나의 <br /> 식사 습관 점수
                <p class="score">{{ props.healthRfsData.rfs_cal_data }}점</p>
              </div>
            </div>
            <div class="tracking-horizontal-chart">
              <img src="@/assets/images/pdf/res/tracking-rfs.png" alt="" class="data-chart">
            </div>
          </div>
          <div class="table-container food">
            <div class="content-head first">
              <span class="stretch-text"> 식품군 </span>
            </div>
            <div class="content-head">
              <span class="stretch-text"> 판정 </span>
            </div>

            <template v-for="(item, index) in getFoodData" :key="index">
              <div class="content-title">
                <div class="check-box">
                  <img v-if="item.status == 3" class="check" src="@/assets/images/pdf/res/tracking-check.png">
                </div>
                <span class="stretch-text" :class="item.status == 3 ? 'danger' : ''">{{ item.name }}</span>
              </div>
              <div class="content">
                <span class="stretch-text normal" v-if="item.status == 1">충족</span>
                <span class="stretch-text danger" v-else-if="item.status == 3">부족</span>
                <span class="stretch-text normal" v-else>충족</span>
              </div>

            </template>
            <div class="content-head first">
              <span class="stretch-text"> 식사 습관 </span>
            </div>
            <div class="content-head">
              <span class="stretch-text"> 판정 </span>
            </div>
            <template v-for="(item, index) in getFoodHabitData" :key="index">
              <div class="content-title">
                <div class="check-box">
                  <img v-if="item.status == 3" class="check" src="@/assets/images/pdf/res/tracking-check.png">
                </div>
                <span class="stretch-text" :class="item.status == 3 ? 'danger' : ''">{{ item.name }}</span>
              </div>
              <div class="content">
                <span class="stretch-text normal" v-if="item.status == 1">충족</span>
                <span class="stretch-text danger" v-else-if="item.status == 3">부족</span>
                <span class="stretch-text normal" v-else>충족</span>
              </div>

            </template>
          </div>
        </div>
      </div>
      <div class="desc">
        {{ props.userInfo.user_name }}님의 권장식품점수는 {{ props.healthRfsData.rfs_cal_data }}점으로,
        {{
          props.healthRfsData.rfs_cal_data < 49 ? `건강한 식사를 위한 목표 점수인 ${props.healthRfsData.rfs_cut_data}점에 비해, 권장 식품 섭취가
          많이 부족한 수준입니다.` : props.healthRfsData.rfs_cal_data >= 49 && props.healthRfsData.rfs_cal_data
            < 64 ? `건강한 식사를 위한 목표 점수인 ${props.healthRfsData.rfs_cut_data}점을 고려했을 때 관리가 필요한 수준입니다.` : `건강한 식사를 위한 목표 점수인
            ${props.healthRfsData.rfs_cut_data}점을 충족하거나 초과하여 건강한 수준입니다.` }} <br />
          {{ props.healthRfsData.food_msg.dqMessage_sub2 }}
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
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
  height: calc(210.3px * $pdf-scale);

  .title-box {
    width: calc(calc(340px) * $pdf-scale);
    padding-right: calc(10px * $pdf-scale);
  }

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(11px * $pdf-scale);
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
    height: 95%;
  }

  .score-container {
    width: calc(165px * $pdf-scale);
    height: calc(180px * $pdf-scale);
    padding-left: calc(14.3px * $pdf-scale);
    @include flex(center, center);
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
      width: calc(136.58px * $pdf-scale);
      height: calc(136.58px * $pdf-scale);

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
            font-size: calc(42px * $pdf-scale);
            //color: #008452;
            font-weight: 400;
          }

          .score-text {
            font-size: calc(10px * $pdf-scale);
            // color: #3E3A39;
            // padding-bottom: calc(5px * $pdf-scale);
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
          font-size: calc(9px * $pdf-scale);
          font-weight: 400;
          color: #727171;
          text-align: center;
        }
      }
    }
  }
}

.score-div {
  width: calc(140px * $pdf-scale);
  height: calc(140px * $pdf-scale);
  .container {
    min-height: auto;
  }
}

.desc {
  margin-top: calc(7.46px * $pdf-scale);
  height: calc(140px * $pdf-scale);
  font-size: calc(10px * $pdf-scale);
  color: #000000;
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

    padding-top: calc(10.2px * $pdf-scale);
    padding-left: calc(10.35px * $pdf-scale);
    padding-right: calc(10.35px * $pdf-scale);
    padding-bottom: calc(10.2px * $pdf-scale);
    height: calc(40px * $pdf-scale);

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
  width: calc(calc(278.38px - 41px) * $pdf-scale);
  // height: calc(322.28px * $pdf-scale);
  background-color: white;

  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  @include flex(flex-start, flex-start);
  flex-direction: row;
  flex-wrap: wrap;
  // padding-left: calc(21.7px * $pdf-scale);
  padding-top: calc(0px * $pdf-scale);
  margin-top: calc(24.08px * $pdf-scale);
  margin-bottom: calc(24.08px * $pdf-scale);
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

  .my-point-img {
    position: absolute;
    width: calc(27.69px * $pdf-scale) !important;
    height: calc(32px * $pdf-scale);
    transform: translateX(-50%);
    left: calc(110px * $pdf-scale) !important;
    object-fit: contain;
  }

  .my-point-dashed {
    position: absolute;
    height: calc(0.5px * $pdf-scale);
    width: calc(25.8px * $pdf-scale) !important;
    left: calc(98px * $pdf-scale);
    border-bottom: calc(0.5px * $pdf-scale) solid #00b4de;
    transform: translate(-50%);
    bottom: 0;
    z-index: 10;
  }

  .my-point-dot {
    bottom: 0;
    position: absolute;
    left: calc(81px * $pdf-scale);
    width: calc(5px * $pdf-scale);
    height: calc(5px * $pdf-scale);
    transform: translateY(2px * $pdf-scale);
    border-radius: 50%;
    background-color: white;
    border: calc(0.3px * $pdf-scale) solid #00b4de;
    z-index: 11;
  }

  .my-point-score {
    position: absolute;
    width: calc(63px * $pdf-scale) !important;
    height: calc(21.8px * $pdf-scale) !important;
    transform: translate(30%, -70%);
    left: calc(110px * $pdf-scale) !important;
    // width: calc(201px * $pdf-scale);
    font-size: calc(11px * $pdf-scale);
    color: #000000;
    font-weight: 300;

    p {
      font-weight: $bold;
    }
  }
}

.data-box {
  padding-top: calc(5px * $pdf-scale);
  position: relative;
  @include flex(flex-start, flex-start);
}

.tracking-horizontal-chart {
  display: flex;
  flex-wrap: wrap;
  // width: calc(15.8px * $pdf-scale) !important;
  height: calc(250px * $pdf-scale);

  // margin: 0 auto;
}

.legend {
  position: absolute;
  right: calc(0px * $pdf-scale);
  top: calc(0px * $pdf-scale);
  @include flex(flex-end, baseline);
  width: calc(calc(128.32px - 41px) * $pdf-scale);
  color: #727171;

  font-size: calc(7px * $pdf-scale);

  .legend-icon {
    margin-left: calc(17px * $pdf-scale);
    width: calc(6px * $pdf-scale);
    height: auto;
    /* background-color: #00b4de; */
    margin-right: calc(2.83px * $pdf-scale);
  }
}

.table-container {
  @include flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  margin-top: calc(10px * $pdf-scale);
  margin-bottom: calc(13px * $pdf-scale);
  margin-left: calc(100px * $pdf-scale);

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  display: grid;
  grid-template-columns: 1fr 1fr;


  align-items: center;
  justify-items: center;
  color: #000000;

  &.food {
    grid-template-rows: repeat(10, 112px);
  }

  &.habit {
    grid-template-rows: repeat(2, 112px);
  }

  .top {
    font-size: calc(10px * $pdf-scale);
    color: #727171;
  }

  .content-title {
    font-size: calc(12px * $pdf-scale);
    @include flex(start, center);
    text-align: left;
    width: 100%;
    height: 100%;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 300;
    padding-left: calc(10px * $pdf-scale);

    .normal {
      color: #5AB651;
      font-weight: 300;
    }

    .danger {
      color: #E95371;
      font-weight: 300;
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
    border-top: calc(1px * $pdf-scale) solid #000000;
    background-color: #F1F1F1;
    padding: calc(0.5px * $pdf-scale) 0;

    &.first {
      @include flex(flex-start, center);
      padding-left: calc(28px * $pdf-scale);
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
  bottom: calc(38.57px * $pdf-scale);
}
</style>