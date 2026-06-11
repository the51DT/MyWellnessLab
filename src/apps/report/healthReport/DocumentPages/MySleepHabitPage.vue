<script setup>
import { computed, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import ScoreComDocument from "./com/ScoreComDocument.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  page: Number,
  save: Boolean,
  userInfo: null,
  healthSleepHabitsData: null,
  pdfScale: Number,
  loadingFinished: null,
});
onMounted(() => {
  emit('mounted')
})
// 항목별 요약 설명 매칭
const getSleepHabitList = computed(() => {
  var datas = []
  props.healthSleepHabitsData.data_list.forEach((item1) => {
    var items = item1
    props.healthSleepHabitsData.data_description_list.forEach((item2) => {
      if (item1.key == item2.key) {
        items['description'] = item2.description
        datas.push(items)
      }
    });
  })
  return datas
});
</script>
<template>
  <div class="custom-page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title-box">
          <div class="title">
            <img src="@/assets/images/pdf/res/img-sleep-habit.png" />
            <h3 class="stretch-text">나의 수면 습관</h3>
          </div>
          <span class="stretch-text">
            수면 습관은 수면의 질을 평가한 것으로, 한국인의 수면 습관에 맞게 수정된 피츠버그 수면의 질 지수(PSQI-K; the Korean version of the Pittsburgh Sleep
            Quality Index)를 사용합니다. 이 설문지는 지난 한 달 동안의 수면 습관과 수면의 질을 평가합니다. 지금 나의 수면의 질 상태를 확인해 보세요.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <span class="stretch-text">[나의 수면 습관]</span>
          <div class="score-chart">
            <div class="score-div">
              <!-- 점수 그래프 -->
              <ScoreComDocument :pdfScale="props.pdfScale" :value="props.healthSleepHabitsData.data_list[0].cal_data"
                :status="props.healthSleepHabitsData.data_list[0].status" :width="8" :hideScore="true" :right="false" />
            </div>
            <div class="score">
              <div class="score-top stretch-text"
                :class="props.healthSleepHabitsData.data_list[0].status == 1 ? 'green' : props.healthSleepHabitsData.data_list[0].status == 3 ? 'red' : 'yellow'">
                <div class="score-number">{{ props.healthSleepHabitsData.data_list[0].cal_data }}</div>
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
            [나의 수면 습관 상세 판정]
          </h3>
        </div>
        <div class="data-box">
          <div class="legend">
            <div class="legend-icon">
              <img src="@/assets/images/pdf/res/icon-check.png">
            </div>
            <div class="stretch-text">관리 필요</div>
          </div>

          <div class="table-container">
            <div class="row first">
              <div class="content-head">
                <span class="stretch-text"> 피츠버그 항목 </span>
              </div>
              <div class="content-head">
                <span class="stretch-text"> 판정 </span>
              </div>
            </div>

            <template v-for="(item, index) in getSleepHabitList" :key="index">
              <div class="row">
                <div class="content-title">
                  <div class="check-box">
                    <img v-if="item.status == 3" class="check" src="@/assets/images/pdf/res/tracking-check.png">
                  </div>
                  <span :class="item.status == 3 ? 'stretch-text danger' : 'stretch-text'">
                    {{ item.name }}<br />
                    {{ item.description }}
                  </span>
                </div>
                <div class="content">
                  <span :class="item.status == 3 ? 'stretch-text danger' : 'stretch-text normal'">{{ item.status == 3 ?
                    '미흡' : '양호' }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
      <div class="desc">
        {{ props.userInfo.user_name }}님의 수면의 질 점수는 {{ props.healthSleepHabitsData.data_list[0].cal_data }}점으로
        {{ props.healthSleepHabitsData.data_list[0].cal_data > 71 ? '좋은' : '나쁜' }}수준 입니다. 표에서 나의 수면의 질에 영향을 주는 요인들의 상태를
        확인해
        보세요. <br />
        성인의 권장 수면 시간은 7~9시간입니다.
        수면 시간이 너무 짧거나 과도하게 길면, 대사 질환이나 만성질환의 위험을 높이고 주간 활동과 생산성에도 부정적인 영향을 줄 수 있어 적정한 수면 시간을 유지하는 것이 중요합니다.
        또한, 수면의 질을 높이기 위해서는 깊은 잠을 유도하는 멜라토닌 호르몬의 분비가 활발한 시간대인 오후 11시부터 새벽 3시까지의 시간대를 수면 주기에 포함시키는 것이 좋습니다. 이 시간대에 잠을 자면
        보다
        효과적인 회복이 이루어지며, 건강한 수면 리듬 유지에도 도움이 됩니다. 또한, 질 높은 수면은 체내 항산화 반응에도 영향을 주므로 체내 항산화 시스템을 유지하고 강화하는 데 필수적입니다. 이를 위해서는
        규칙적인
        수면 습관을 들이고, 낮 동안 햇빛을 충분히 쬐어 생체 리듬을 조절하며, 카페인과 야식 섭취를 줄이는 생활 관리가 필요합니다.
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다. 이 설문은 개인의 수면의 질을 평가하기
        위해
        사용되며, 의학적 진단을 대체하지 않으므로 더 자세한 결과는 전문가와 상담하여 해석하는것이 바람직합니다.
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
  padding-top: calc(20px * $pdf-scale);

  height: calc(210.3px * $pdf-scale);

  .title-box {
    width: calc(calc(340px) * $pdf-scale);
    padding-right: calc(10px * $pdf-scale);
  }

  .title {
    display: flex;
    // gap: calc(12.57px * $pdf-scale);
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
    width: calc(42px * $pdf-scale);
    height: calc(42px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #00A856;
    font-weight: $medium;
    margin-left: calc(10px * $pdf-scale);
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
      font-weight: bold;
      font-size: calc(10px * $pdf-scale);
      margin-top: calc(0 * $pdf-scale);
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

.data-box {
  margin: 0 auto;
  width: calc(360px * $pdf-scale);
  padding-top: calc(10px * $pdf-scale);
  position: relative;
  @include flex(flex-start, flex-start);

  & .legend {
    position: absolute;
    right: calc(0px * $pdf-scale);
    top: calc(7px * $pdf-scale);
    @include flex(flex-end, baseline);
    // top: calc(9.76px * $pdf-scale);
    // right: calc(12.21px * $pdf-scale);
    /* margin-top: calc(26px * $pdf-scale); */
    /* margin-bottom: calc(11px * $pdf-scale); */
    width: calc(calc(128.32px - 41px) * $pdf-scale);
    color: #727171;

    font-size: calc(6.5px * $pdf-scale);

    & .avg {
      margin-left: calc(17px * $pdf-scale);
      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #92539d;
      margin-right: calc(2.83px * $pdf-scale);
    }

    & .my {
      margin-left: calc(17px * $pdf-scale);
      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #00b4de;
      margin-right: calc(2.83px * $pdf-scale);
    }

    & .legend-icon {
      margin-left: calc(17px * $pdf-scale);
      width: calc(6px * $pdf-scale);
      height: auto;
      /* background-color: #00b4de; */
      margin-right: calc(2.83px * $pdf-scale);
    }
  }
}

.data-container {
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  // border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  margin-bottom: calc(16px * $pdf-scale);

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
      font-weight: bold;
    }

    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }

    & .legend {
      color: #727171;
      font-weight: 400;
      @include flex(flex-end, center);
      font-size: calc(6.5px * $pdf-scale);

      & .avg {
        border-bottom: calc(1px * $pdf-scale) dashed #E95371;
        width: calc(8px * $pdf-scale);
        margin-right: calc(3px * $pdf-scale);
      }

      & .legend-icon {
        margin-left: calc(17px * $pdf-scale);
        width: calc(5.35px * $pdf-scale);
        height: calc(5.35px * $pdf-scale);
        background-color: #00b4de;
        margin-right: calc(2.83px * $pdf-scale);
      }
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
  margin-left: calc(8px * $pdf-scale);

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-items: center;
  color: #000000;

  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 12px;
    /* ✅ 여기서 행 단위로 padding 가능 */
    // background: #f9f9f9;
    width: 100%;
    height: 100%;
    border-top: calc(0.3px * $pdf-scale) solid #000000;

    &.first {
      background-color: #F1F1F1;
      border-top: calc(1px * $pdf-scale) solid #000000;
    }
  }

  .top {
    font-size: calc(10px * $pdf-scale);
    color: #727171;
  }

  .content-title {
    font-size: calc(10px * $pdf-scale);
    @include flex(start, center);
    text-align: left;
    width: 100%;
    height: 100%;
    font-weight: 300;
    padding-left: calc(10px * $pdf-scale);
    box-sizing: border-box;

    .check-box {
      @include flex(center, center);
    }

    .normal {
      color: #5AB651;
      font-weight: 600;
    }

    .danger {
      color: #E95371;
      font-weight: 600;
    }

  }

  .check-box {
    position: relative;
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    border: calc(0.5px * $pdf-scale) solid #000;
    margin-right: calc(6px * $pdf-scale);

    .check {
      position: absolute;
      top: calc(-2px * $pdf-scale);
      left: calc(0px * $pdf-scale);
      width: calc(8px * $pdf-scale);
      height: calc(7px * $pdf-scale);
    }
  }

  .content-head {
    color: #000000;
    font-size: calc(11px * $pdf-scale);
    @include flex(center, center);
    text-align: center;
    width: 100%;
    height: 100%;

    font-weight: 600;
    padding: calc(0.5px * $pdf-scale) 0;
  }

  .last {
    font-weight: 600;
  }

  .content {
    padding: calc(2.5px * $pdf-scale) 0;
    font-size: calc(10px * $pdf-scale);
    @include flex(center, );
    text-align: right;
    width: 100%;
    height: 100%;
    // border-left: calc(0.5px * $pdf-scale) solid #000000;
    // border-top: calc(0.3px * $pdf-scale) solid #000000;
    min-height: auto;

    .normal {
      color: #5AB651;
      font-weight: 600;
    }

    .danger {
      color: #E95371;
      font-weight: 600;
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
    font-weight: 700;
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

  .cell2 {
    grid-column: 1/3;
  }

  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

}

.data {
  width: 100%;
  height: 100%;
  @include flex(center, center);
  // padding-left: calc(75px * $pdf-scale);


  img {
    width: calc(276px * $pdf-scale);
    height: calc(267px * $pdf-scale);
  }
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  .my-point-score {
    position: absolute;
    color: #00b4de;
    font-size: calc(12px * $pdf-scale);
    width: calc(100px * $pdf-scale);
    top: calc(-40px * $pdf-scale);
    left: calc(8px * $pdf-scale);
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -220%);
    width: calc(12.46px * $pdf-scale) !important;
    height: auto;
    right: 0;
    top: 0;
    z-index: 1001;
  }

  .my-point-pointer {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
    height: calc(21.65px * $pdf-scale);
    width: calc(0.25px * $pdf-scale);
    /* background-color: #00b4de; */
    border-right: calc(1px * $pdf-scale) dashed #00b4de;

    .point {
      position: absolute;

      /* right: calc(-5.68px * $pdf-scale); */
      z-index: 100;
      transform: translate(-50%, 50%);
      width: calc(2.62px * $pdf-scale);
      height: calc(2.62px * $pdf-scale);
      border-radius: 50%;
      border: calc(0.3px * $pdf-scale) solid #00b4de;
      background-color: white;
      /* bottom: calc(-5.68px * $pdf-scale); */
      bottom: 0;
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
  color: #585859;
  font-size: calc(10px * $pdf-scale);
  height: calc(169px * $pdf-scale);
  // margin-bottom: calc(23px * $pdf-scale);
}

.bottom-info {
  bottom: calc(4px * $pdf-scale);
}
</style>
