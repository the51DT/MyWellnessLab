<script setup>
import { onMounted, ref, computed } from 'vue'

// import PageHeader from '../PageHeader.vue'
// import BubbleChartDocument from '../BubbleChartDocument.vue'
// import ResultSecondDocument from '../ResultSecondDocument.vue'
// import GuageChart from '../GuageChart.vue'
// import ScoreComDocument from '../ScoreComDocument.vue'
// import ViolinOxi from '../ViolinOxi.vue'
// import ViolinMet from '../ViolinMet.vue'
// import ResultFifthDocument from '../ResultFifthDocument.vue'
// import { useI18n } from 'vue-i18n'

// const { t, locale } = useI18n()
// const props = defineProps({
//   save: Boolean,
//   health: Object,
//   integratedAriStatus: null,
//   hcr: null,
//   value: Object,
//   eatingHabit: Object,
//   userInfo: null,
//   pdfScale: null,
//   recommendData: null
// })

// const healthType = ref('')

// const myValue = computed(() => {
//   let MET = 0
//   let MET_MEAN = 0
//   let OXI = 0
//   let OXI_MEAN = 0

//   if (props.eatingHabit.resultDto.myHQ !== undefined) {
//     OXI = props.health.resultDto.myHQ.OXI
//     MET = props.health.resultDto.myHQ.MET
//     OXI_MEAN = props.health.resultDto.myHQ.OXI_MEAN
//     MET_MEAN = props.health.resultDto.myHQ.MET_MEAN
//   }

//   return {
//     Oxi: Number(OXI.toFixed(0)),
//     Met: Number(MET.toFixed(0)),
//     MET_MEAN,
//     OXI_MEAN
//   }
// })

// const speedText = computed(() => {
//   const status = props.health.resultDto.myHQ.AgingRateStatus

//   switch (status) {
//     case 1:
//       return t('Page5.text1')
//     case 2:
//       return t('Page5.text2')
//     case 3:
//       return t('Page5.text3')
//     default:
//       return ''
//   }
// })

// // 노화 억제 분석 지수 한국 성인 평균 상태명
// const agingGradeText = computed(() => {
//   const status = props.health.resultDto.myHQ.OXI_Status
//   return gradeText(status)
// })

// // 만성질환 억제 분석 지수 한국 성인 평균 상태명
// const chronicDiseaseGradeText = computed(() => {
//   const status = props.health.resultDto.myHQ.MET_Status
//   return gradeText(status)
// })

// const gradeText = (status) => {
//   switch (status) {
//     case 1:
//       return t('Page5.text4')
//     case 2:
//       return t('Page5.text5')
//     case 3:
//       return t('Page5.text6')
//     default:
//       return '-'
//   }
// }

// onMounted(() => {
//   healthType.value = props.health.resultDto.myHQ.Health_Type
// })
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="5" />
      <div class="title">
        <div class="title-content">
          <div class="title-container">
            <img src="/img/pdf/res/img-summary.png" />
            <h3 class="stretch-text">
              {{ userInfo.name }}{{ $t('Page5.text7') }}
            </h3>
          </div>
          <span class="stretch-text">{{ $t('Page5.text8') }}</span>
        </div>
        <div class="type">
          <span class="stretch-text">{{ $t('Page5.text9') }}</span>
          <b class="stretch-text"> {{ healthType }}</b>
        </div>
      </div>
      <div class="info">
        <div class="header">
          <div class="position">
            <span class="stretch-text">{{ $t('Page5.text10') }}</span>
          </div>
          <div class="speed">
            <span class="stretch-text"> {{ $t('Page5.text11') }} </span>
          </div>
        </div>

        <div class="chart">
          <div class="bubble">
            <span class="stretch-text">{{ $t('Page5.text12') }}</span>
            <!-- 나의 건강 위치 그래프 -->
            <BubbleChartDocument :myValue="props.value" :left="-35" />
          </div>
          <div class="speed-container">
            <!-- 나의 노화 속도 그래프 -->
            <ResultSecondDocument
              :save="props.save"
              :data="props.health"
              :eatingHabit="props.eatingHabit"
              :userInfo="props.userInfo"
              :pdfScale="props.pdfScale" />
            <div class="text stretch-text">
              {{ $t('Page5.text13') }}
              {{ eatingHabit.resultDto.myHQ.AgingRate }}{{ $t('Page5.text14') }}
              {{ speedText }} {{ $t('Page5.text15') }}
            </div>
            <!-- 나의 노화 속도 게이지 그래프 -->
            <GuageChart
              :value="eatingHabit.resultDto.myHQ.AgingRate"
              :pdfScale="props.pdfScale"
              :showScore="true" />
          </div>
        </div>
        <div class="header">
          <div class="oxi">
            <span class="stretch-text">{{ $t('Page5.text16') }}</span>
          </div>
          <div class="met">
            <span class="stretch-text">{{ $t('Page5.text17') }}</span>
          </div>
        </div>
        <div class="score">
          <div class="oxi-container">
            <div class="oxi-score">
              <div class="oxi-score-desc stretch-text">
                {{ $t('Page5.text18') }} {{ myValue.Oxi }} {{ $t('Page5.text19') }}
                {{ agingGradeText }}
              </div>
              <div class="score-div">
                <!-- 노화 억제 분석 지수 점수 그래프 -->
                <ScoreComDocument
                  :pdfScale="props.pdfScale"
                  :value="myValue.Oxi"
                  :mean="myValue.OXI_MEAN"
                  :right="false"
                  :hideScore="false" />
              </div>
            </div>
            <!-- 노화 억제 분석 지수 바이올린 차트 -->
            <ViolinOxi
              :save="props.save"
              :userInfo="props.userInfo"
              :hcr="props.hcr"
              :value="props.value"
              :health="props.health"
              :pdfScale="pdfScale" />
          </div>

          <div class="met-container">
            <div class="met-score">
              <div class="met-score-desc stretch-text">
                {{ $t('Page5.text20') }}{{ myValue.Met }}{{ $t('Page5.text21') }}
                {{ chronicDiseaseGradeText }}
              </div>
              <div class="score-div right">
                <!-- 만성질환 억제 분석 지수 점수 그래프 -->
                <ScoreComDocument
                  :pdfScale="pdfScale"
                  :value="myValue.Met"
                  :mean="myValue.MET_MEAN"
                  :right="true" />
              </div>
            </div>
            <!-- 만성질환 억제 분석 지수 바이올린 차트 -->
            <ViolinMet
              :save="save"
              :userInfo="userInfo"
              :hcr="hcr"
              :value="value"
              :health="health"
              :pdfScale="pdfScale" />
          </div>
        </div>
      </div>

      <!-- 주요 건강 위험 요인 / 신경 써야 할 건강 분야 -->
      <ResultFifthDocument
        :integratedAriStatus="integratedAriStatus"
        :userInfo="userInfo"
        :recommendReport="recommendData" />
      <div class="bottom-info">
        {{ $t('Page5.text22') }}
      </div>
    </div>
  </div>
</template>

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
    color: $tit-color;
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
      border-right: calc(0.3px * $pdf-scale) solid #777 !important;
      border-width: 0 calc(0.4px * $pdf-scale) 0 0 !important;
      font-weight: 500;
    }
    .speed {
      padding-left: calc(12.23px * $pdf-scale);
      font-weight: 500;
    }

    .oxi {
      width: calc(254.85px * $pdf-scale);
      height: calc(14.17px * $pdf-scale);
      border-right: calc(0.3px * $pdf-scale) solid #000000;
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

    border-right: calc(0.3px * $pdf-scale) solid #000000;
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
    border-left: calc(0.3px * $pdf-scale) solid #000000;
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
        border-right: calc(0.3px * $pdf-scale) solid #000000;
        font-weight: 500;
      }
      .speed {
        padding-left: calc(12.23px * $pdf-scale);
        font-weight: 500;
      }

      .oxi {
        width: calc(254.6px * $pdf-scale);
        height: calc(14.17px * $pdf-scale);
        border-right: calc(0.3px * $pdf-scale) solid #000000;
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

      border-right: calc(0.3px * $pdf-scale) solid #000000;
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
      border-right: calc(0.3px * $pdf-scale) solid #777 !important;
      border-width: 0 calc(0.4px * $pdf-scale) 0 0 !important;
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
