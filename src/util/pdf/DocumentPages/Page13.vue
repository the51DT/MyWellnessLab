<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="11"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-oxi.png" />

          <h3 class="stretch-text">노화 억제 분석 지수</h3>
          <span class="stretch-text">
            노화 억제 분석 지수는 나의 몸이 산화 스트레스로부터 보호하는 능력을
            100점 척도로 평가한 점수입니다. 나의 점수를 확인해 보세요.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <div class="stretch-text">[나의 노화 억제 분석 지수]</div>
          <div class="score-chart">
            <div class="score-div">
              <!-- 점수 그래프 -->
              <ScoreComDocument
                :pdfScale="pdfScale"
                :value="value.Oxi"
                :mean="value.OXI_MEAN"
                :width="5"
                :hideScore="true"
              />
            </div>
            <div class="score">
              <div class="score-top stretch-text">
                {{ value.Oxi }}
                <div class="score-text">점</div>
              </div>
              <div class="score-bottom stretch-text">
                *{{ (getAgeGroup + 1) * 10 }}대 100명 중
                {{ myPercent.OxiPerc }}등
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [한국인 {{ userInfo.sex === 1 ? "남성" : "여성" }} 연령별 노화 억제
            분석 지수 분포와 나의 위치]
          </h3>
          <div class="legend">
            <div class="avg"></div>
            <div class="stretch-text">연령대 평균</div>
            <div class="legend-icon"></div>
            <div class="stretch-text">{{ userInfo.name }}님</div>
          </div>
        </div>
        <!-- 바이올린 차트 -->
        <div class="violin-container">
          <div class="violin">
            <div class="axis-y">
              <div class="label-y stretch-text">노화 억제 분석 지수</div>
              <div class="stretch-text">100</div>
              <div class="stretch-text">80</div>
              <div class="stretch-text">60</div>
              <div class="stretch-text">40</div>
              <div class="stretch-text">20</div>
            </div>
            <div class="table">
              <hr />
              <hr />
              <hr />
              <hr />
              <hr />
              <hr class="black" />
              <div
                class="my-point"
                :style="{
                  left: (getAgeGroup * 56.5 - 20) * pdfScale + 'px',
                  top: 100 - value.Oxi + '%',
                }"
              >
                <img
                  class="my-point-img"
                  src="/img/pdf/res/age-graph-icon.png"
                  alt=""
                />
                <div class="my-point-pointer">
                  <div class="point"></div>
                </div>
                <div class="my-point-score stretch-text">
                  {{ myPercent.OxiPerc }}등
                </div>
              </div>
            </div>
          </div>
          <img
            class="background"
            src="/img/pdf/res/violin/oxi-violin-m.png"
            alt=""
            v-if="userInfo.sex === 1"
          />
          <img
            class="background"
            src="/img/pdf/res/violin/oxi-violin-f.png"
            alt=""
            v-if="userInfo.sex === 2"
          />
          <div class="axis-x">
            <div class="label-x stretch-text">연령대</div>

            <div class="stretch-text">20</div>
            <div class="stretch-text">30</div>
            <div class="stretch-text">40</div>
            <div class="stretch-text">50</div>
            <div class="stretch-text">60</div>
            <div class="stretch-text">70</div>
            <div class="stretch-text">80</div>
          </div>
        </div>
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ userInfo.name }}님의 노화 억제 분석 지수는 {{ value.Oxi
          }}{{ "점이며," }} 한국 성인 평균 65점과 비교하여 건강상태가
          {{ value.Oxi <= 65 ? "나쁨" : value.Oxi > 65 ? "좋음" : "보통" }}으로
          판정됩니다. 이 수치는 {{ userInfo.name }}님의 연령대
          {{ parseInt(userInfo.age / 10) * 10 }}대
          {{ userInfo.sex === 1 ? "남성" : "여성" }} 100명 중에서
          {{ myPercent.OxiPerc }}등에 해당하여 평균 점수인
          {{ health.resultDto.myHQ.OXI_MEAN.toFixed(1) }}점과 비교하여
          {{
            value.Oxi > health.resultDto.myHQ.OXI_MEAN
              ? "높은 수준입니다. 건강을 위해 산화 스트레스로부터 방어하는 신체능력을 유지시킬 필요가 있습니다."
              : value.Oxi < health.resultDto.myHQ.OXI_MEAN
              ? "낮은 수준입니다. 건강을 위해 산화 스트레스로부터 방어하는 신체능력을 향상시킬 필요가 있습니다."
              : "비슷한 수준입니다. 건강을 위해 산화 스트레스로부터 방어하는 신체능력을 향상시킬 필요가 있습니다."
          }}
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다. 노화 억제 분석 지수는 건강 검진 결과, 생활 습관 등
        다양한 요소 간의 상관관계를 종합적으로 고려하여 산출됩니다. 따라서,
        입력한 결과가 정상 범위 내에 있더라도, 다른 건강한 사람과 비교하여 나의
        건강 위험도가 높을 수 있습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "./PageHeader.vue";
import ScoreComDocument from "./com/ScoreComDocument.vue";

import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  health: null,
  save: Boolean,
  userInfo: null,
  comph: null,
  hcr: null,
  value: null,
  report_no: null,
  pdfScale: Number,
});

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

const getAgeGroup = computed(() => {
  let rtn = 0;

  if(props.userInfo !== undefined) {
    rtn = (parseInt(props.userInfo.age / 10) * 10) / 10 - 1;
  }

  return rtn;
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
    margin-top: calc(37.82px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    padding-right: calc(25.97px * $pdf-scale);
    line-height: 150%;
  }

  .score-container {
    width: calc(165px * $pdf-scale);
    height: calc(210px * $pdf-scale);
    padding-left: calc(14.3px * $pdf-scale);
    @include flex(center, flex-start);
    flex-direction: column;

    padding-top: calc(26.5px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
    font-weight: bold;

    .score-chart {
      position: relative;
      margin-top: calc(35.51px * $pdf-scale);
      width: calc(136.58px * $pdf-scale);
      height: calc(136.58px * $pdf-scale);

      padding-left: calc(10px * $pdf-scale);
      .score {
        position: absolute;
        flex-direction: column;
        top: 0;
        left: calc(10px * $pdf-scale);
        @include flex(center, center);
        width: 100%;
        height: 100%;

        .score-top {
          @include flex(center, flex-end);
          font-size: calc(30px * $pdf-scale);
          font-family: "MarkPro";
          font-weight: 400;

          .score-text {
            font-size: calc(10px * $pdf-scale);
            padding-bottom: calc(5px * $pdf-scale);
          }
        }

        .score-bottom {
          font-size: calc(9px * $pdf-scale);
          font-weight: 400;
          color: #727171;
        }
      }
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
    margin-top: calc(26px * $pdf-scale);
    margin-bottom: calc(11px * $pdf-scale);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    /* padding-top: calc(12.39px * $pdf-scale); */
    /* padding-left: calc(13.21px * $pdf-scale); */
    /* padding-right: calc(10.35px * $pdf-scale); */
    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: bold;
    }
    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }
  }

  .violin-container {
    position: relative;
    @include flex(center, center);
    width: 100%;

    flex-direction: column;
    margin-top: calc(44px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
    .background {
      position: absolute;
      width: calc(410px * $pdf-scale);
      height: auto;
      left: calc((108px - 43.51px) * $pdf-scale);
      top: calc(12px * $pdf-scale);
    }
    .violin {
      @include flex(center, center);
      flex-direction: row;
      gap: calc(6.51px * $pdf-scale);
      height: calc(212.56px * $pdf-scale);

      .axis-y {
        position: relative;
        @include flex(flex-start, center);
        flex-direction: column;
        /* gap: calc(calc(200px / 6) * $pdf-scale); */
        height: calc(200px * $pdf-scale);
        margin-top: calc(-10px * $pdf-scale);
        div {
          flex: 1;
          height: 100%;
        }

        .label-y {
          position: absolute;
          width: calc(100px * $pdf-scale);
          top: calc(-20px * $pdf-scale);
          right: calc(-24px * $pdf-scale);
          text-align: right;
          color: #727171;
          z-index:2;
        }
      }

      .table {
        position: relative;
        @include flex(flex-end, center);
        flex-direction: column;
        width: calc(412.26px * $pdf-scale);
        height: calc(200px * $pdf-scale);
        gap: calc(39px * $pdf-scale);
        border-left: calc(0.5px * $pdf-scale) solid #bfbfc0;
        /* border-bottom: calc(1px * $pdf-scale) solid #9fa0a0; */

        hr {
          width: 100%;
          margin: 0;
          background-color: #bfbfc0;
          height: calc(0.3px * $pdf-scale);
        }

        .black {
          background-color: #bfbfc0;
        }
      }
    }
    .axis-x {
      position: relative;
      @include flex(flex-start, center);
      flex-direction: row;
      align-self: flex-start;

      /* width: calc(412.26px * $pdf-scale); */
      padding-left: calc(94px * $pdf-scale);
      div {
        /* flex: 1; */
        width: calc(56px * $pdf-scale);
      }

      .label-x {
        position: absolute;
        /* width: calc(200px * $pdf-scale); */
        top: calc(-13px * $pdf-scale);
        right: calc(-19px * $pdf-scale);
        text-align: right;
        color: #727171;
        width: 100%;
      }
    }
  }
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  /* 24.01.03 아이콘이 나오지 않아서 추가 */
  width: calc(42px * $pdf-scale);
  height:auto;
  .my-point-score {
    position: absolute;
    color: #00b4de;
    font-size: calc(12px * $pdf-scale);
    width: calc(100px * $pdf-scale);
    top: calc(-40px * $pdf-scale);
    left: calc(8px * $pdf-scale);
  }

  .my-point-img {
    position: relative;
    transform: translate(-50%, -200%);/* 24.01.04 값 수정 */
    width: calc(12.46px * $pdf-scale) !important;
    height: auto;
    right: 0;
    top: 0;
    z-index: 1001;
  }
  .my-point-pointer {
    position: relative;
    right: 0;
    top: 0;
    transform: translate(50%, -175%);/* 24.01.04 값 수정 */
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

.legend {
  color: #727171;
  @include flex(flex-end, center);
  font-size: calc(6.5px * $pdf-scale);
  .avg {
    border-bottom: calc(1px * $pdf-scale) dashed #92539d;
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

.score-div {
  width: calc(139.58px * $pdf-scale);
  height: calc(138.58px * $pdf-scale);
}
</style>
