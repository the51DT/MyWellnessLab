<template>
  <div class="chart-wrapper">
    <div class="data-container">
      <div class="subject">
        <h3>
          <!-- 분포와 나의 등수] -->
          [한국인 {{ userInfo.sex === 1 ? "남성" : "여성" }} 연령별 분포와 나의
          등수]
        </h3>
        <div class="legend">
          <div class="avg"></div>
          <div class="t">연령대 평균</div>
          <div class="legend-icon"></div>
          <div class="t">{{ userInfo.name }}님</div>
        </div>
      </div>
      <!-- 그래프 배경 -->
      <div class="violin-container">
        <div class="violin">
          <div class="axis-y">
            <div class="label-y">노화 억제 분석 지수</div>
            <div>100</div>
            <div>80</div>
            <div>60</div>
            <div>40</div>
            <div>20</div>
          </div>
          <div class="table">
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />
            <hr class="black" />
            <!-- 현재 위치/등수 -->
            <div
              class="my-point"
              :style="{
                left: (getAgeGroup() * 56.5 - 20) * pdfScale + 'px',
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
              <div class="my-point-score">{{ myPercent.OxiPerc }}등</div>
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
          <div class="label-x">연령대</div>

          <div>20</div>
          <div>30</div>
          <div>40</div>
          <div>50</div>
          <div>60</div>
          <div>70</div>
          <div>80</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

function getAgeGroup() {
  let age = 0;

  if(props.userInfo !== undefined) {
    age = props.userInfo.age;
  }

  return (parseInt(age / 10) * 10) / 10 - 1;
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.chart-wrapper {
  position: relative;
}

.title-container {
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

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
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    padding-top: calc(26.5px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);

    .score-chart {
      position: relative;
      margin-top: calc(35.51px * $pdf-scale);
      width: calc(136.58px * $pdf-scale);
      height: calc(136.58px * $pdf-scale);

      .score {
        position: absolute;
        flex-direction: column;
        top: 0;
        left: 0;
        //@include flex(center, center);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        .score-top {
          //@include flex(center, flex-end);
          display: flex;
        justify-content: center;
        align-items: flex-end;
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
        }
      }
    }
  }
}

.data-container {
  position: absolute;
  width: calc(510px * $pdf-scale);
  height: calc(363.06px * $pdf-scale);
  background-color: white;
  transform: scale(0.48);
  transform-origin: left top;
  left: calc(-5px * $pdf-scale);
  top: calc(5px * $pdf-scale);
  /* border-top: calc(0.3px * $pdf-scale) solid #000000; */
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */

  .subject {
    width: calc(515px * $pdf-scale);

    display: flex;
    justify-content: space-between;
    /* padding-top: calc(12.39px * $pdf-scale); */
    padding-left: calc(10px * $pdf-scale);
    /* padding-right: calc(10.35px * $pdf-scale); */
    margin-top: calc(26px * $pdf-scale);
    margin-bottom: calc(11px * $pdf-scale);
    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: 500;
    }
    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }
  }

  .violin-container {
    position: relative;
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    flex-direction: column;
    margin-top: calc(44px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
    .background {
      position: absolute;
      width: calc(414px * $pdf-scale);
      height: calc(170px * $pdf-scale);
      left: calc((106px - 43.51px) * $pdf-scale);
      top: calc(15px * $pdf-scale);
    }
    .violin {
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      gap: calc(6.51px * $pdf-scale);
      height: calc(212.56px * $pdf-scale);

      .axis-y {
        position: relative;
        //@include flex(flex-start, center);
        display: flex;
        justify-content: flex-start;
        align-items: center;
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
          width: calc(200px * $pdf-scale);
          top: calc(-20px * $pdf-scale);
          right: calc(-41px * $pdf-scale);
          font-weight: 100;
          text-align: right;
          color: #727171;
        }
      }

      .table {
        position: relative;
        //@include flex(flex-end, center);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;
        width: calc(412.26px * $pdf-scale);
        height: calc(200px * $pdf-scale);
        gap: calc(39px * $pdf-scale);
        border-left: calc(1px * $pdf-scale) solid #9fa0a0;
        /* border-bottom: calc(1px * $pdf-scale) solid #9fa0a0; */

        hr {
          width: 100%;
          margin: 0;
          background-color: #dcdddd;
          height: calc(1px * $pdf-scale);
        }

        .black {
          background-color: #9fa0a0;
        }
      }
    }
    .axis-x {
      position: relative;
      //@include flex(flex-start, center);
      display: flex;
      justify-content: flex-start;
      align-items: center;
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
        right: calc(-15px * $pdf-scale);
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
    transform: translate(-50%, -200%);
    width: calc(12.46px * $pdf-scale) !important;
    height: auto;
    right: 0;
    top: 0;
    z-index: 1001;
  }
  .my-point-pointer {
    z-index: 1000;
    position: relative;
    right: 0;
    top: 0;
    transform: translate(50%, -175%);
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
  //@include flex(flex-end, center);
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

.stretch-page2 {
  .label-y {
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
  }
  .t {
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
  }
  .subject {
    h3 {
      font-family: "Pretendard";

      /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    }
  }

  .my-point-score {
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
  }
  .label-x {
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
  }
  .axis-y > div {
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
  }
  .axis-x > div {
    font-family: "Pretendard";
    /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
  }
}
</style>
