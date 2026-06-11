<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="5"></PageHeader>
      <div class="title">
        <div class="title-content">
          <div class="title-container">
            <img src="/img/pdf/res/img-summary.png" />
            <h3 class="stretch-text">
              {{ userInfo.name }}님의 웰니스 결과 요약
            </h3>
          </div>
          <span class="stretch-text"
            >마이웰니스 랩의 분석 결과를 한눈에 쉽게 확인할 수 있습니다. 각
            항목에 대한 자세한 내용은 건강 점수 및 건강 내비게이션 파트를 참고해
            주세요.</span
          >
        </div>
        <div class="type">
          <span class="stretch-text">나의 건강 유형</span>
          <b class="stretch-text"> {{ healthType }}</b>
        </div>
      </div>
      <div class="info">
        <div class="header">
          <div class="position">
            <span class="stretch-text">나의 건강 위치</span>
          </div>
          <div class="speed">
            <span class="stretch-text"> 나의 노화 속도 </span>
          </div>
        </div>

        <div class="chart">
          <div class="bubble">
            <span class="stretch-text"
              >노화와 만성질환으로부터 나의 건강을 얼마나 잘 지킬 수 있는지를
              분석하여 이차원 상 위치로 표현된 나의 건강 위치는 아래와
              같습니다.</span
            >
            <!-- 나의 건강 위치 그래프 -->
            <BubbleChartDocument :myValue="props.value" :left="-35" />
          </div>
          <div class="speed-container">
            <!-- 나의 노화 속도 그래프 -->
            <ResultSecondDocument
              :save="props.save"
              :data="props.health"
              :eatingHabit="props.eatingHabit"
              :check_date="props.check_date"
              :userInfo="props.userInfo"
              :pdfScale="props.pdfScale"
            />
            <div class="text stretch-text">
              주민등록상 실제 나이와 신체 나이의 관계를 바탕으로 계산된 나의
              노화 속도는
              {{ eatingHabit.resultDto.myHQ.AgingRate }}배속으로
              {{
                eatingHabit.resultDto.myHQ.AgingRate > 1
                  ? "빠르게 진행 중입니다."
                  : "느리게 진행 중입니다."
              }}
            </div>
            <!-- 나의 노화 속도 게이지 그래프 -->
            <GuageChart
              :value="eatingHabit.resultDto.myHQ.AgingRate"
              :pdfScale="props.pdfScale"
              :showScore="true"
            ></GuageChart>
          </div>
        </div>
        <div class="header">
          <div class="oxi">
            <span class="stretch-text">노화 억제 분석 지수</span>
          </div>
          <div class="met">
            <span class="stretch-text">만성질환 억제 분석 지수</span>
          </div>
        </div>
        <div class="score">
          <div class="oxi-container">
            <div class="oxi-score">
              <div class="oxi-score-desc stretch-text">
                나의 몸이 산화 스트레스로부터 보호하는 능력을 100점 척도로
                평가한 나의 노화 억제 분석 지수는 {{ myValue.Oxi }}점으로 한국
                성인 평균과 비교하여
                {{
                  myValue.Oxi > health.resultDto.myHQ.OXI_MEAN.toFixed(1)
                    ? "좋은 편입니다."
                    : "나쁜 편입니다."
                }}
              </div>
              <div class="score-div">
                <!-- 노화 억제 분석 지수 점수 그래프 -->
                <ScoreComDocument
                  :pdfScale="props.pdfScale"
                  :value="myValue.Oxi"
                  :mean="myValue.OXI_MEAN"
                  :right="false"
                  :hideScore="false"
                />
              </div>
            </div>
            <!-- 노화 억제 분석 지수 바이올린 차트 -->
            <ViolinOxi
              :save="props.save"
              :userInfo="props.userInfo"
              :check_date="props.check_date"
              :comph="props.comph"
              :hcr="props.hcr"
              :value="props.value"
              :health="props.health"
              :report_no="props.report_no"
              :pdfScale="pdfScale"
            />
          </div>

          <div class="met-container">
            <div class="met-score">
              <div class="met-score-desc stretch-text">
                에너지를 생산하고 사용하는 능력인 신진대사 능력을 100점 척도로
                평가한 나의 만성질환 억제 분석 지수는 {{ myValue.Met }}점으로
                한국 성인 평균과 비교하여
                {{
                  myValue.Met > health.resultDto.myHQ.MET_MEAN.toFixed(1)
                    ? "좋은 편입니다."
                    : "나쁜 편입니다."
                }}
              </div>
              <div class="score-div right">
                <!-- 만성질환 억제 분석 지수 점수 그래프 -->
                <ScoreComDocument
                  :pdfScale="pdfScale"
                  :value="myValue.Met"
                  :mean="myValue.MET_MEAN"
                  :right="true"
                />
              </div>
            </div>
            <!-- 만성질환 억제 분석 지수 바이올린 차트 -->
            <ViolinMet
              :save="save"
              :userInfo="userInfo"
              :check_date="check_date"
              :comph="comph"
              :hcr="hcr"
              :value="value"
              :health="health"
              :report_no="report_no"
              :pdfScale="pdfScale"
            />
          </div>
        </div>
      </div>

      <!-- 주요 건강 위험 요인 / 신경 써야 할 건강 분야 -->
      <ResultFifthDocument
        :comph="comph"
        :meal="meal"
        :userInfo="userInfo"
        :recommendReport="recommendData"
      />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다. 노화 억제 분석 지수는 건강 검진 결과 생활 습관 등
        다양한 요소 간의 상관관계를 종합적으로 고려하여 산출됩니다. 따라서
        입력한 결과가 정상 범위 내에 있더라도 다른 건강한 사람과 비교하여 나의
        건강 위험도가 높을 수 있습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "@/util/pdf/DocumentPages/PageHeader.vue";
import BubbleChartDocument from "@/util/pdf/DocumentPages/com/BubbleChartDocument.vue";
import ResultSecondDocument from "@/util/pdf/DocumentPages/com/ResultSecondDocument.vue";
import GuageChart from "@/util/pdf/DocumentPages/com/GuageChart.vue";
import ScoreComDocument from "@/util/pdf/DocumentPages/com/ScoreComDocument.vue";
import ViolinOxi from "@/util/pdf/DocumentPages/com/ViolinOxi.vue";
import ViolinMet from "@/util/pdf/DocumentPages/com/ViolinMet.vue";
import ResultFifthDocument from "@/util/pdf/DocumentPages/com/ResultFifthDocument.vue";


import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  save: Boolean,
  health: Object,
  meal: null,
  comph: null,
  hcr: null,
  value: Object,
  eatingHabit: Object,
  check_date: null,
  userInfo: null,
  pdfScale: null,
  recommendData: null,
  report_no: null,
});

const healthType = ref("");

const age = computed(() => {
  //console.log("eatingHabit", props.eatingHabit, props.userInfo);
  let health = 0;
  let current = 0;
  let diff = 0;

  if(props.eatingHabit !== undefined) {
    health = Math.round(props.eatingHabit.resultDto.myHQ.ReAge);
    current = Math.round(props.userInfo.age);
    diff = health - current;
  }

  return { health, current, diff };
});

const myPercent = computed(() => {
  //console.log("resultfirst", data);
  let OXI_PERC = 0;
  let MET_PERC = 0;

  if(props.eatingHabit.resultDto.myHQ !== undefined) {
    OXI_PERC = props.health.resultDto.myHQ.OXI_PERC;
    MET_PERC = props.health.resultDto.myHQ.MET_PERC;
  }

  return {
    MetPerc: Number(MET_PERC.toFixed(1)),
    OxiPerc: Number(OXI_PERC.toFixed(1)),
  };
})

const myValue = computed(() => {
  let MET = 0;
  let MET_MEAN = 0;
  let OXI = 0;
  let OXI_MEAN = 0;

  if(props.eatingHabit.resultDto.myHQ !== undefined) {
    OXI = props.health.resultDto.myHQ.OXI;
    MET = props.health.resultDto.myHQ.MET;
    OXI_MEAN = props.health.resultDto.myHQ.OXI_MEAN;
    MET_MEAN = props.health.resultDto.myHQ.MET_MEAN;
  }

  return {
    Oxi: Number(OXI.toFixed(0)),
    Met: Number(MET.toFixed(0)),
    MET_MEAN: MET_MEAN,
    OXI_MEAN: OXI_MEAN,
  };
})

onMounted(() => {
  healthType.value = props.health.resultDto.myHQ.Health_Type;
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title {
  //@include flex(space-between, flex-start);
  display: flex;
  justify-content: space-between;
  align-items:flex-start;

  position: relative;
  /* padding-top: calc(11.69px * $pdf-scale); */
  font-weight: 300;
  font-size: calc(26px * $pdf-scale);
  height: calc(92.22px * $pdf-scale);
  line-height: normal;
  font-variant: normal;

  color: #00a856;
  /* letter-spacing: -2px; */
  h3 {
    margin-top: calc(6px * $pdf-scale);
    color: #00a856;
    /* font-weight: 300 !important; */
    font-size: calc(26px * $pdf-scale) !important;
  }

  .title-container {
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items:flex-start;
    
    flex-direction: row;
    gap: calc(9.1px * $pdf-scale);
  }
  .title-content {
    position: relative;
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items:flex-start;
    flex-direction: column;
    flex: 1;
    height: 100%;

    padding-top: calc(9.4px * $pdf-scale);
    span {
      color: #000;

      font-size: calc(9.9px * $pdf-scale) !important;
      font-weight: 300 !important;
      /* padding-top: calc(4px * $pdf-scale); */
      padding-bottom: calc(15.49px * $pdf-scale);
      text-align: left !important;
      padding-right: calc(20px * $pdf-scale);
      padding-left: calc(52px * $pdf-scale);
      line-height: 155% !important;
    }
  }
  img {
    width: calc(42.9px * $pdf-scale) !important;
    height: calc(42.9px * $pdf-scale) !important;
    object-fit: contain;
  }
}
.type {
  position: relative;
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items:flex-start;
  padding: calc(10px * $pdf-scale) calc(8px * $pdf-scale);
  border-left: calc(0.5px * $pdf-scale) solid #000000;
  width: calc(82px * $pdf-scale);
  height: calc(92.5px * $pdf-scale);
  position: relative;

  span {
    font-size: calc(9px * $pdf-scale);
    color: #000;
    font-weight: 500;
  }

  b {
    top: calc(29.58px * $pdf-scale);
    /* bottom: 0; */
    /* left: calc(36px * $pdf-scale); */
    left: 50%;
    /* transform: translate(-50%, 0); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    position: absolute;
    font-size: calc(40px * $pdf-scale);
    color: #000;
    /* height: calc(51px * $pdf-scale); */
    font-family: "MarkPro";
    font-weight: 400;
    padding-bottom: calc(3.82px * $pdf-scale);
  }
}

.info {
  position: relative;
  width: 100%;
  /* height: 206px; */
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  color: #000;
  .header {
    //@include flex(flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items:center;
    height: calc(14.2px * $pdf-scale);
    background-color: #e7f3e7;

    span {
      display: inline-block;
    }
    font-size: calc(9px * $pdf-scale);

    .position {
      //@include flex(flex-start, center);
      display: flex;
      justify-content: flex-start;
      align-items:center;
      padding-left: calc(6.5px * $pdf-scale);
      width: calc(203.59px * $pdf-scale);
      height: calc(14.17px * $pdf-scale);
      border-right: calc(0.5px * $pdf-scale) solid #000000 !important;
      font-weight: 500;
    }
    .speed {
      padding-left: calc(12.23px * $pdf-scale);
      font-weight: 500;
    }

    .oxi {
      width: calc(254.85px * $pdf-scale);
      height: calc(14.17px * $pdf-scale);
      border-right: calc(0.5px * $pdf-scale) solid #000000;
      padding-left: calc(6.5px * $pdf-scale);
      //@include flex(flex-start, center);
      display: flex;
      justify-content: flex-start;
      align-items:center;
      font-weight: 500;
    }

    .met {
      flex: 1;
      height: 100%;
      padding-left: calc(12.23px * $pdf-scale);
      //@include flex(flex-start, center);
      display: flex;
      justify-content: flex-start;
      align-items:center;
      font-weight: 500;
    }
  }
}

.score {
  position: relative;
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items:flex-start;

  height: calc(313.29px * $pdf-scale);
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .oxi-container {
    position: relative;

    border-right: calc(0.5px * $pdf-scale) solid #000000;
    height: calc(313.29px * $pdf-scale);
  }
  .oxi-score {
    width: calc((254.85px - 11.5px) * $pdf-scale);

    height: calc(127.24px * $pdf-scale);
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    margin-right: calc(10.98px * $pdf-scale);

    font-size: calc(8px * $pdf-scale);
    font-weight: 300;
  }
  .oxi-score-desc {
    width: calc(140px * $pdf-scale);
    padding-top: calc(20.73px * $pdf-scale);
    font-weight: 400;
    line-height: 155%;
    padding-left: calc(6.5px * $pdf-scale);
  }

  .met-container {
    position: relative;

    flex: 1;
    height: calc(313.29px * $pdf-scale);
  }
  .met-score {
    flex: 1;
    height: calc(127.24px * $pdf-scale);
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    /* margin-left: calc(10.98px * $pdf-scale); */

    font-size: calc(8px * $pdf-scale);
    font-weight: 300;
    margin-left: calc(12.23px * $pdf-scale);
  }

  .met-score-desc {
    width: calc(140px * $pdf-scale);
    padding-top: calc(20.73px * $pdf-scale);
    font-weight: 400;
    line-height: 155%;
  }
}

.chart {
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items:flex-start;

  height: calc(191.62px * $pdf-scale);
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  font-weight: 400;

  .bubble {
    width: calc(203.59px * $pdf-scale);
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;

    span {
      display: inline-block;
      margin-top: calc(5px * $pdf-scale);
      margin-bottom: calc(-20px * $pdf-scale);
      font-size: calc(8px * $pdf-scale);
      line-height: 155%;
      padding-left: calc(6.5px * $pdf-scale);
      font-weight: 400;
    }
  }
  .speed-container {
    position: relative;
    flex: 1;
    height: 100%;

    .text {
      position: absolute;
      font-weight: 400 !important;
      top: calc(3px * $pdf-scale) !important;
      left: calc(6.23px * $pdf-scale) !important;
      font-size: calc(8px * $pdf-scale) !important;
      line-height: 155% !important;
    }
  }
}

.bottom-info {
  position: static;
  /* position: absolute; */
  /* position: relative; */
  margin-top: calc(6px * $pdf-scale);
}
.score-div {
  position: absolute;
  width: calc(85.26px * $pdf-scale);
  height: calc(85.26px * $pdf-scale);
  right: calc(20px * $pdf-scale);
  top: calc(16.52px * $pdf-scale);
}

.right {
  right: calc(7px * $pdf-scale);
}

.stretch-page2 {
  .title {
    //@include flex(space-between, flex-start);
    display: flex;
    justify-content: space-between;
    align-items:flex-start;

    /* padding-top: calc(11.69px * $pdf-scale); */
    font-weight: 700;
    font-size: calc(27px * $pdf-scale);
    height: calc(92.22px * $pdf-scale);
    font-variant: normal;

    color: #000;

    .title-content {
      position: relative;

      h3 {
        position: relative;
        /* position: absolute; */
        font-family: "Pretendard";
        /* transform: translateY($pdf-text-ratio); //220기준 탑 + 70 *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
        /* top: calc(300px * $pdf-scale); */
      }
      //@include flex(space-between, space-between);
      display: flex;
      justify-content: space-between;
      align-items:space-between;
      flex-direction: column;
      flex: 1;
      height: 100%;
      padding-top: calc(11.69px * $pdf-scale);
      span {
        font-family: "Pretendard";

        font-size: calc(16px * $pdf-scale);
        font-weight: 700;
        padding-bottom: calc(15.49px * $pdf-scale);
        text-align: right;
        padding-right: calc(20px * $pdf-scale);
      }
    }

    img {
      width: calc(42.9px * $pdf-scale) !important;
      height: calc(42.9px * $pdf-scale) !important;
      object-fit: contain;
    }
  }
  .type {
    position: relative;
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items:flex-start;
    padding: calc(10px * $pdf-scale) calc(8px * $pdf-scale);
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    width: calc(82px * $pdf-scale);
    height: calc(92.5px * $pdf-scale);
    position: relative;

    span {
      font-size: calc(9px * $pdf-scale);
      font-family: "Pretendard";
      /* transform: translateY($pdf-text-ratio); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    }

    b {
      /* top: calc(29.58px * $pdf-scale);
      left: 50%;
      position: absolute;
      font-size: calc(40px * $pdf-scale);

      font-family: "Pretendard";

      color: #000;
      font-family: "MarkPro";
      font-weight: 400;
      transform: translateX(-50%);
      transform: translateY($pdf-text-ratio); */

      top: calc(29.58px * $pdf-scale);
      /* bottom: 0; */
      /* left: calc(36px * $pdf-scale); */
      left: 50%;
      /* transform: translate(-50%, $pdf-text-ratio); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
      position: absolute;
      font-size: calc(40px * $pdf-scale);
      color: #000;
      /* height: calc(51px * $pdf-scale); */
      font-family: "MarkPro";
      font-weight: 400;
      padding-bottom: calc(3.82px * $pdf-scale);
    }
  }

  .info {
    position: relative;
    width: 100%;
    /* height: 206px; */
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;

    color: #000;
    .header {
      //@include flex(flex-start, center);
      display: flex;
    justify-content: flex-start;
    align-items:center;
      height: calc(14.2px * $pdf-scale);
      background-color: #e7f3e7;
      font-family: "Pretendard";

      font-size: calc(9px * $pdf-scale);

      .position {
        //@include flex(flex-start, center);
        display: flex;
        justify-content: flex-start;
        align-items:center;
        padding-left: calc(6.5px * $pdf-scale);
        width: calc(203.59px * $pdf-scale);
        height: calc(14.17px * $pdf-scale);
        border-right: calc(0.5px * $pdf-scale) solid #000000;
        font-weight: 500;
      }
      .speed {
        padding-left: calc(12.23px * $pdf-scale);
        font-weight: 500;
      }

      .oxi {
        width: calc(254.85px * $pdf-scale);
        height: calc(14.17px * $pdf-scale);
        border-right: calc(0.5px * $pdf-scale) solid #000000;
        padding-left: calc(6.5px * $pdf-scale);
        //@include flex(flex-start, center);
        display: flex;
      justify-content: flex-start;
      align-items: center;
        font-weight: 500;
      }

      .met {
        flex: 1;
        height: 100%;
        padding-left: calc(12.23px * $pdf-scale);
        //@include flex(flex-start, center);
        display: flex;
        justify-content: flex-start;
        align-items:center;
        font-weight: 500;
      }
    }
  }

  .score {
    position: relative;
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items:flex-start;

    height: calc(313.29px * $pdf-scale);
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;

    .oxi-container {
      position: relative;

      border-right: calc(0.5px * $pdf-scale) solid #000000;
      height: calc(313.29px * $pdf-scale);
    }
    .oxi-score {
      width: calc((254.85px - 11.5px) * $pdf-scale);

      height: calc(127.24px * $pdf-scale);
      border-bottom: calc(0.3px * $pdf-scale) solid #000000;
      margin-right: calc(10.98px * $pdf-scale);
      font-family: "Pretendard";

      font-size: calc(8px * $pdf-scale);
      font-weight: 300;
    }
    .oxi-score-desc {
      width: calc(140px * $pdf-scale);
      padding-top: calc(20.73px * $pdf-scale);
      font-weight: 400;
      line-height: 155%;
      padding-left: calc(6.5px * $pdf-scale);
    }

    .met-container {
      position: relative;

      flex: 1;
      height: calc(313.29px * $pdf-scale);
    }
    .met-score {
      flex: 1;
      height: calc(127.24px * $pdf-scale);
      border-bottom: calc(0.3px * $pdf-scale) solid #000000;
      /* margin-left: calc(10.98px * $pdf-scale); */
      font-family: "Pretendard";

      font-size: calc(8px * $pdf-scale);
      font-weight: 300;
      margin-left: calc(12.23px * $pdf-scale);
    }

    .met-score-desc {
      width: calc(140px * $pdf-scale);
      padding-top: calc(20.73px * $pdf-scale);
      font-weight: 400;
      line-height: 155%;
    }
  }

  .chart {
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items:flex-start;

    height: calc(191.62px * $pdf-scale);
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 400;

    .bubble {
      width: calc(203.59px * $pdf-scale);
      height: 100%;
      border-right: calc(0.5px * $pdf-scale) solid #000000 !important;

      span {
        display: inline-block;
        margin-top: calc(5px * $pdf-scale);
        margin-bottom: calc(-20px * $pdf-scale);
        font-family: "Pretendard";

        font-size: calc(8px * $pdf-scale);
        line-height: 155%;
        padding-left: calc(6.5px * $pdf-scale);
        font-weight: 400;
      }
    }
    .speed-container {
      position: relative;
      flex: 1;
      height: 100%;

      .text {
        position: absolute;
        font-weight: 400;
        top: calc(3.71px * $pdf-scale);
        left: calc(221.33px * $pdf-scale);
        font-family: "Pretendard";

        font-size: calc(8px * $pdf-scale);
        line-height: 155%;
      }
    }
  }

  .bottom-info {
    position: static;
    /* position: absolute; */
    /* position: relative; */
    margin-top: calc(6px * $pdf-scale);
  }
  .score-div {
    position: absolute;
    width: calc(85.26px * $pdf-scale);
    height: calc(85.26px * $pdf-scale);
    right: calc(20px * $pdf-scale);
    top: calc(16.52px * $pdf-scale);
  }
  .right {
    right: calc(7px * $pdf-scale);
  }
}
</style>
