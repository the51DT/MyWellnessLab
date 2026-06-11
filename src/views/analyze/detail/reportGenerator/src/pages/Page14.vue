<script setup>
import PageHeader from '../PageHeader.vue'
import ScoreComDocument from '../ScoreComDocument.vue'

import { computed } from 'vue'

const props = defineProps({
  health: null,
  save: Boolean,
  userInfo: null,
  value: null,
  pdfScale: Number
})

const myPercent = computed(() => {
  let MET_PERC = 0
  let OXI_PERC = 0

  if (props.health.resultDto.myHQ !== undefined) {
    MET_PERC = props.health.resultDto.myHQ.MET_PERC
    OXI_PERC = props.health.resultDto.myHQ.OXI_PERC
  }

  return {
    MetPerc: Number(MET_PERC.toFixed(1)),
    OxiPerc: Number(OXI_PERC.toFixed(1))
  }
})

const getAgeGroup = computed(() => {
  let rtn = 0

  if (props.userInfo !== undefined) {
    rtn = (parseInt(props.userInfo.age / 10) * 10) / 10 - 1
  }

  return rtn
})

const gender = computed(() => {
  return props.userInfo.sex === 1 ? '남성' : '여성'
})

const description = computed(() => {
  return props.health.resultDto.myHQ.MET_MSG.replaceAll('@@@', props.userInfo.name)
})
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="12" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-met.png" />

          <h3 class="stretch-text">{{ $t('Page14.text1') }}</h3>
          <span class="stretch-text">
            {{ $t('Page14.text2') }}
          </span>
        </div>
        <div class="vertical-line" />
        <div class="score-container">
          <div class="bold stretch-text">[{{ $t('Page14.text3') }}]</div>
          <div class="score-chart">
            <div class="score-div">
              <ScoreComDocument
                :pdfScale="pdfScale"
                :value="value.Met"
                :mean="value.MET_MEAN"
                :width="5"
                :hideScore="true" />
            </div>
            <div class="score">
              <div class="score-top stretch-text">
                {{ value.Met }}
                <div class="score-text">{{ $t('Common.score') }}</div>
              </div>
              <div class="score-bottom stretch-text">
                {{ $t('Page13.text5', {
                  age: (getAgeGroup + 1) * 10, 
                  gender: gender, 
                  rank: myPercent.MetPerc 
                }) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [{{ $t('Page14.text5', {
                  gender: gender
                }) }}]
          </h3>
          <div class="legend">
            <div class="avg" />
            <div class="stretch-text">{{ $t('Page14.text4') }}</div>
            <div class="legend-icon" />
            <div class="stretch-text">{{ userInfo.name }}{{ $t('Common.name') }}</div>
          </div>
        </div>
        <div class="violin-container">
          <div class="violin">
            <div class="axis-y">
              <div class="label-y stretch-text">{{ $t('Page14.text1') }}</div>
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
              <hr class="black" />
              <div
                class="my-point"
                :style="{
                  left: (getAgeGroup * 56.5 - 20) * pdfScale + 'px',
                  top: 100 - value.Met + '%',
                }">
                <img
                  class="my-point-img"
                  src="/img/pdf/res/age-graph-icon.png"
                  alt="" />
                <div class="my-point-pointer">
                  <div class="point" />
                </div>
                <div class="my-point-score stretch-text">
                  {{ myPercent.MetPerc }}{{ $t('Common.rank') }}
                </div>
              </div>
            </div>
          </div>
          <img
            class="background"
            src="/img/pdf/res/violin/met-violin-m.png"
            alt=""
            v-if="userInfo.sex === 1" />
          <img
            class="background"
            src="/img/pdf/res/violin/met-violin-f.png"
            alt=""
            v-if="userInfo.sex === 2" />
          <div class="axis-x">
            <div class="label-x stretch-text">{{ $t('Page13.text7') }}</div>

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
          {{ description }}
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        {{ $t('Page12.text8') }}
      </div>
    </div>
  </div>
</template>

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
    .bold {
      font-weight: bold;
    }
    @include flex(center, flex-start);
    flex-direction: column;

    padding-top: calc(26.5px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);

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
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: calc(26px * $pdf-scale);
    margin-bottom: calc(11px * $pdf-scale);
    /* padding-top: calc(12.39px * $pdf-scale); */
    /* padding-left: calc(13.21px * $pdf-scale); */
    /* padding-right: calc(10.35px * $pdf-scale); */

    h3 {
      font-weight: bold;
      font-size: calc(12px * $pdf-scale);
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
      /* height: calc(137px * $pdf-scale); */
      height: auto;
      left: calc((116px - 43.51px) * $pdf-scale);
      top: calc(13px * $pdf-scale);
      transform: translateX(calc(-10px * $pdf-scale));
      object-fit: contain;
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
          right: calc(-36px * $pdf-scale);
          text-align: right;
          color: #727171;
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
      @include flex(flex-start, flex-start);
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
        width: 100% !important;
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
  width: calc(100px * $pdf-scale);
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
  font-weight: 400;
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
