<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="14"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-aging-rate.png" />

          <h3 class="stretch-text">나의 노화 속도</h3>
          <span class="stretch-text">
            노화 속도는 노화 억제 분석 지수 및 만성질환 억제 분석 지수를 결합한
            점수와 실제 나이 사이의 관계를 바탕으로 산출된 값입니다.<br /><br />
            건강하게 나이 드는 것에 대한 기준으로 보통의 노화속도인 1.00배속
            보다 느린 노화 속도를 목표합니다.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <span class="stretch-text">[나의 노화 속도]</span>
          <div class="speed-container">
            <!-- 노화 속도 배속 게이지 -->
            <GuageChart2
              :value="eatingHabit.resultDto.myHQ.AgingRate"
              :pdfScale="pdfScale"
              :showScore="true"
            ></GuageChart2>
          </div>
        </div>
      </div>
      <div class="data-container">
        <div class="legend">
          <div class="avg"></div>
          <div class="stretch-text">목표속도</div>
          <div class="legend-icon"></div>
          <div class="stretch-text">{{ userInfo.name }}님</div>
        </div>
        <div class="subject">
          <h3 class="stretch-text">
            [한국 성인 표본집단의 노화 속도와 나의 노화 속도]
          </h3>
        </div>
        <!-- 노화속도 그래프 -->
        <ResultSecondDocumentLarge
          :data="health"
          :eatingHabit="eatingHabit"
          :check_date="check_date"
          :userInfo="userInfo"
          :pdfScale="pdfScale"
        />
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ age.current }}세 {{ userInfo.name }}님의 노화 속도는
          {{ eatingHabit.resultDto.myHQ.AgingRate }}배속으로
          {{
            eatingHabit.resultDto.myHQ.AgingRate > 1
              ? "빠른 편입니다."
              : eatingHabit.resultDto.myHQ.AgingRate == 1
              ? "일반적인 편입니다."
              : "느린 편입니다."
          }}
          <br />지금의 노화 속도를 감안한 {{ userInfo.name }}님의 신체 노화
          나이는 {{ age.health }}세 입니다. 건강하게 나이들기 위해서는 지속적인
          건강관리가 필요합니다.
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "./PageHeader.vue";
import GuageChart2 from "./com/GuageChart2.vue";
import ResultSecondDocumentLarge from "./com/ResultSecondDocumentLarge.vue";

import { computed, toRaw } from 'vue';

const props = defineProps({
  health: null,
  eatingHabit: null,
  save: Boolean,
  userInfo: null,
  comph: null,
  hcr: null,
  value: null,
  pdfScale: null,
  report_no: null,
});

const metPer = computed(() => {
  let metPer = 0;
  if(props.health.resultDto.myHQ !== undefined) {
    metPer = props.health.resultDto.myHQ.MET_PERC;
  }

  return metPer;
})
const oxiPer = computed(() => {
  let oxiPer = 0;
  if(props.health.resultDto.myHQ !== undefined) {
    oxiPer = props.health.resultDto.myHQ.OXI_PERC;
  }

  return oxiPer;
})

const myPercent = computed(() => {
  let MET_PERC = 0;
  let OXI_PERC = 0;

  if(props.health.resultDto.myHQ !== undefined) {
    MET_PERC = props.health.resultDto.myHQ.MET_PERC;
    OXI_PERC = props.health.resultDto.myHQ.OXI_PERC;
  }

  return {
    MetPerc: Number(MET_PERC.toFixed(1)),
    OxiPerc: Number(OXI_PERC.toFixed(1)),
  };
})

const age = computed(() => {
  const health = Math.round(props.eatingHabit.resultDto.myHQ.ReAge);
  const current = Math.round(props.userInfo.age);
  const diff = health - current;
  return { health, current, diff };
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  @include flex(flex-start, flex-start);

  margin-top: calc(18.55px * $pdf-scale);
  margin-bottom: calc(19.1px * $pdf-scale);
  height: calc(210.3px * $pdf-scale);

  .title {
    width: calc(calc(382.68px - 41px) * $pdf-scale);
  }

  ul {
    font-size: calc(12px * $pdf-scale);
    padding-left: calc((16.51px + 89.9px) * $pdf-scale);
    li {
      list-style-type: disc;
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
    }
  }

  img {
    width: calc(51.08px * $pdf-scale);
    height: calc(51.08px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-top: calc(10.68px * $pdf-scale);
    font-size: calc(30px * $pdf-scale);
    color: #008352;
  }

  span {
    display: inline-block;
    margin-top: calc(10.13px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    padding-right: calc(17.57px * $pdf-scale);
    line-height: 155%;
  }

  .score-container {
    width: 100%;
    height: 100%;
    flex: 1;

    span {
      font-weight: bold;
      font-size: calc(10px * $pdf-scale);
      margin-top: calc(27px * $pdf-scale);
      padding-left: calc(18.69px * $pdf-scale);
    }
  }
}

.data-container {
  width: 100%;
  height: calc(363.06px * $pdf-scale);
  background-color: white;

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */

  .subject {
    left: 0;
    display: flex;
    justify-content: space-between;
    /* padding-top: calc(12.39px * $pdf-scale); */
    /* padding-left: calc(13.21px * $pdf-scale); */
    padding-right: calc(10.35px * $pdf-scale);

    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: bold;
    }
    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }
  }
}

.speed-container {
  position: relative;
  flex: 1;
  height: 100%;

  .text {
    position: absolute;
    font-weight: 400;
    top: calc(27.28px * $pdf-scale);
    left: calc(221.33px * $pdf-scale);
    font-size: calc(8px * $pdf-scale);
  }
}

.legend {
  margin-top: calc(26px * $pdf-scale);
  /* margin-bottom: calc(11px * $pdf-scale); */
  color: #727171;
  @include flex(flex-end, center);
  font-size: calc(6.5px * $pdf-scale);
  .avg {
    border-bottom: calc(1px * $pdf-scale) dashed #127f50;
    width: calc(8px * $pdf-scale);
    margin-right: calc(3px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(17px * $pdf-scale);
    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }
}

.desc {
  color: #585859;
  font-size: calc(10px * $pdf-scale);
}
</style>
