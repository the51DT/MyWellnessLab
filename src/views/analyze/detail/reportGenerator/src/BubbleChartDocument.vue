<template>
  <div class="chart-wrap" ref="target">
    <div class="graph-wrap">
      <div class="echart">
        <img
          class="position-scatter"
          src="/img/pdf/res/graph-scatter.png"
          alt="" />
        <img
          class="position-back"
          src="/img/pdf/res/graph-position.png"
          alt="" />
      </div>
      <div class="over-wrap">
        <!-- 내 점수에 따른 위치 설정 -->
        <div
          class="my-point"
          :style="{
            width: `${((myValue.Oxi / 10) * myValue.Oxi) / 10}%`,
            height: `calc(${((myValue.Met / 10) * myValue.Met) / 10}% - 27px)`,
          }">
          <div class="x-indicator">{{ myValue.Met }} {{ $t('Common.score') }}</div>
          <div class="y-indicator">{{ myValue.Oxi }} {{ $t('Common.score') }}</div>
          <img
            class="my-point-img"
            src="/img/pdf/res/age-graph-icon.png"
            alt="" />
          <div class="my-point-pointer">
            <div class="point" />
          </div>
        </div>
        <span class="label-y" :style="left ? 'left:' + left + 'px' : ''">{{ $t('BubbleChartDocument.text2') }}</span>
        <span class="label-x">{{ $t('BubbleChartDocument.text3') }}</span>
      </div>
      <h3 class="none">[{{ $t('BubbleChartDocument.text4') }}]</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from 'vue'

const props = defineProps({
  myValue: Object,
  chartData: Array,
  left: Number
})

const target = ref(null)

/**
 * 차트 사이즈 조정
 */
function resizeChart () {
  const baseWidth = 420
  const rate = (window.innerWidth - 50) / (baseWidth - 50)
  const height = 354 * rate + 20
  const width = 300 * rate
  if (rate < 1) {
    target.value.style =
      'transform-origin:left top; transform:scale(' +
      rate +
      ') translateX(0%);height:' +
      height +
      'px;' +
      'width:' +
      width +
      'px;'
  } else {
    target.value.style = 'transform:scale(1);'
  }
};

onMounted(() => {
  resizeChart()
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";

h3 {
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #c3926d;
}
.graph-wrap {
  width: calc(154.55px * $pdf-scale);
  transform: translateX(0%);
}
.subject {
  position: absolute;
  z-index: 100;
  bottom: 50px;
  width: 100%;
  margin-left: 23px;
  /* background: red; */
  // margin-top: -90px;
  // margin-bottom: 20px;
}

.my-point {
  position: absolute;
  left: 0;
  bottom: 1%;
  border-top: calc(0.5px * $pdf-scale) solid #000;
  border-right: calc(0.5px * $pdf-scale) solid #000 !important;

  span {
    position: absolute;
    /* width: 8px;
    height: 8px; */
    /* left: -50%; */
    top: -60px !important;
    /* background: transparent !important; */
    transform: translate(-50%, 0%);

    background: #ffffff !important;
    box-shadow: 0px 0px 5px rgba(75, 92, 69, 0.2);
    border-radius: 123px;
    padding: 3px 4px;

    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    /* identical to box height */

    display: flex;
    align-items: center;
    text-align: center;

    color: #414042;
    /* border-radius: 50%; */
    /* &:after {
      content: "";
      width: 1000px;
      height: 1px;
      background: #0060af;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:before {
      content: "";
      width: 1px;
      height: 1000px;
      background: #0060af;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
    } */
  }
  img {
    position: absolute;
    /* left: 1px;
    bottom: 1px; */
    width: 60px;
    height: auto;
  }

  .x-indicator {
    position: absolute;
    font-size: calc(5px * $pdf-scale);
    color: #00b4de;
    left: 0;
    top: 0;
    transform: translate(-125%, -50%);
  }

  .y-indicator {
    position: absolute;
    font-size: calc(5px * $pdf-scale);
    color: #00b4de;
    right: 0;
    bottom: 0;
    transform: translate(50%, 125%);
  }
}
.over-wrap {
  position: absolute;

  /* transform: translate(-50%); */
  z-index: 10;
  /* width: 249px;
  // width: 83%;
  height: 237px; */
  width: calc(125px * $pdf-scale);
  top: calc(35px * $pdf-scale);
  left: calc(22px * $pdf-scale);
  height: calc(114.08px * $pdf-scale);
  .my-point {
    span {
      background: #0060af;
      &::after,
      &::before {
        display: none;
      }
    }
  }
  .label-x,
  .label-y {
    position: absolute;
    font-size: calc(4px * $pdf-scale);
    color: #727171 !important;
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    img {
      width: 11px;
      height: 18px;
    }
  }
  .label-x {
    right: -30%;
    bottom: -5%;

    font-weight: 500;
    /* font-size: 10px; */
    line-height: 12px;
    /* identical to box height */

    img {
      transform: rotate(90deg);
    }
  }
  .label-y {
    /* transform: rotate(-90deg); */
    left: -23%;
    top: -7%;

    font-weight: 500;
    /* font-size: 4px; */
    line-height: 12px;
    /* identical to box height */

    img {
      transform: rotate(90deg);
    }
  }
}
.chart-wrap {
  position: relative;
  /* margin: 20px auto; */
  width: calc(154.55px * $pdf-scale);
  // width: 100%;
  /* max-width: 300px; */
  margin-bottom: -74px;
  height: calc(115.16px * $pdf-scale);
  /* transform: translateX(-10%); */
}
.echart {
  width: calc(154.55px * $pdf-scale);
  height: calc(115.16px * $pdf-scale);
  // width: 100%;
  /* max-width: 300px; */
  margin: 0 auto 40px;
}
.over-chart {
  position: absolute;
  top: 3%;
  left: 54%;
  transform: translate(-50%);
  z-index: 10;
  width: calc(249px * $pdf-scale);
  height: calc(257px * $pdf-scale);
  overflow: hidden;
}
.chart-text {
  text-align: center;
  width: 300px;
}

.graph-img {
  width: 230px;
  height: 230px;
  left: 10px;
  position: absolute;
}
.axis {
  position: absolute;
  left: 20px;
  top: -35px;
  object-fit: contain;
  width: 300px;
  height: 354px;
}
.my-point-img {
  position: absolute;
  transform: translate(50%, -120%);
  width: calc(10.3px * $pdf-scale) !important;
  height: auto;
  right: 0;
  top: 0;
}
.my-point-pointer {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -120%);
  height: calc(5.68px * $pdf-scale);
  width: calc(0.5px * $pdf-scale) !important;
  background-color: #00b4de;

  .point {
    position: absolute;

    /* right: calc(-5.68px * $pdf-scale); */
    z-index: 100;
    transform: translate(-50%, 100%);
    width: calc(2.62px * $pdf-scale);
    height: calc(2.62px * $pdf-scale);
    border-radius: 50%;
    border: calc(0.3px * $pdf-scale) solid #00b4de;
    background-color: white;
    /* bottom: calc(-5.68px * $pdf-scale); */
    bottom: 0;
  }
}
.none {
  color: transparent;
}

.position-back {
  width: calc(154.55px * $pdf-scale);
  height: auto;
  position: absolute;
  left: calc(22px * $pdf-scale);
  top: calc((39px) * $pdf-scale);
}
.position-scatter {
  position: absolute;
  top: calc(23.5px * $pdf-scale);
  left: calc(22px * $pdf-scale);
  /* left: 0; */
  /* top: 500px; */
  width: calc(125px * $pdf-scale);
  height: auto;
}

.stretch-page2 {
  h3 {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    color: #c3926d;
    font-family: "Pretendard";
  }
  .graph-wrap {
    width: calc(154.55px * $pdf-scale);
    transform: translateX(0%);
  }
  .subject {
    position: absolute;
    z-index: 100;
    bottom: 50px;
    width: 100%;
    margin-left: 23px;
    /* background: red; */
    // margin-top: -90px;
    // margin-bottom: 20px;
  }

  .my-point {
    position: absolute;
    left: 0;
    bottom: 3%;
    border-top: calc(0.5px * $pdf-scale) solid #000 !important;
    border-right: calc(0.5px * $pdf-scale) solid #000 !important;

    span {
      position: absolute;
      /* width: 8px;
    height: 8px; */
      /* left: -50%; */
      top: -60px !important;
      /* background: transparent !important; */
      /* transform: translate(-50%, 0%); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */

      background: #ffffff !important;
      box-shadow: 0px 0px 5px rgba(75, 92, 69, 0.2);
      border-radius: 123px;
      padding: 3px 4px;

      font-weight: 600;
      font-family: "Pretendard";
      font-size: 14px;
      line-height: 17px;
      /* identical to box height */

      display: flex;
      align-items: center;
      text-align: center;

      color: #414042;
      /* border-radius: 50%; */
      /* &:after {
      content: "";
      width: 1000px;
      height: 1px;
      background: #0060af;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:before {
      content: "";
      width: 1px;
      height: 1000px;
      background: #0060af;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
    } */
    }
    img {
      position: absolute;
      /* left: 1px;
    bottom: 1px; */
      width: 60px;
      height: auto;
    }

    .x-indicator {
      position: absolute;
      font-family: "Pretendard";

      vertical-align: bottom;

      color: #00b4de;
      left: 0;
      top: 0;
      /* transform: translate(-125%, -50%); */
      /* transform: translateY(calc(-300px * $pdf-scale)); */
      /* transform: translate(-125%, calc($pdf-text-ratio - 50%)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    }

    .y-indicator {
      position: absolute;
      font-family: "Pretendard";
      /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */

      font-size: calc(5px * $pdf-scale);
      color: #00b4de;
      right: 0;
      bottom: 0;
      /* transform: translate(50%, 125%); */
      /* transform: translate(50%, calc($pdf-text-ratio + 125%)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    }
  }
  .over-wrap {
    position: absolute;

    /* transform: translate(-50%); */
    z-index: 10;
    /* width: 249px;
  // width: 83%;
  height: 237px; */
    width: calc(125px * $pdf-scale);
    top: calc(35px);
    left: calc(22px);
    height: calc(114.08px * $pdf-scale);
    .my-point {
      span {
        background: #0060af;
        &::after,
        &::before {
          display: none;
        }
      }
    }
    .label-x,
    .label-y {
      position: absolute;
      font-family: "Pretendard";
      font-size: calc(4px * $pdf-scale);
      /* transform: translateY(calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
      color: #727171 !important;
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      img {
        width: 11px;
        height: 18px;
      }
    }
    .label-x {
      right: -30%;
      bottom: -5%;

      font-weight: 500;
      /* font-size: 10px; */
      line-height: 12px;
      /* identical to box height */

      img {
        transform: rotate(90deg);
      }
    }
    .label-y {
      /* transform: rotate(-90deg); */
      left: -23%;
      top: -2%;
      font-family: "Pretendard";
      font-weight: 500;
      /* font-size: 4px; */
      line-height: 12px;
      /* identical to box height */

      img {
        transform: rotate(90deg);
      }
    }
  }
  .chart-wrap {
    position: relative;
    /* margin: 20px auto; */
    width: calc(154.55px * $pdf-scale);
    // width: 100%;
    /* max-width: 300px; */
    margin-bottom: -74px;
    height: calc(115.16px * $pdf-scale);
    /* transform: translateX(-10%); */
  }
  .echart {
    width: calc(154.55px * $pdf-scale);
    height: calc(115.16px * $pdf-scale);
    // width: 100%;
    /* max-width: 300px; */
    margin: 0 auto 40px;
  }
  .over-chart {
    position: absolute;
    top: 3%;
    left: 54%;
    transform: translate(-50%);
    z-index: 10;
    width: calc(249px * $pdf-scale);
    height: calc(257px * $pdf-scale);
    overflow: hidden;
  }
  .chart-text {
    text-align: center;
    width: 300px;
  }

  .graph-img {
    width: 230px;
    height: 230px;
    left: 10px;
    position: absolute;
  }
  .axis {
    position: absolute;
    left: 20px;
    top: -35px;
    object-fit: contain;
    width: 300px;
    height: 354px;
  }
  .my-point-img {
    position: absolute;
    transform: translate(50%, -120%);
    width: calc(10.3px * $pdf-scale) !important;
    height: auto;
    right: 0;
    top: 0;
  }
  .my-point-pointer {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -120%);
    height: calc(5.68px * $pdf-scale);
    width: calc(0.25px * $pdf-scale);
    background-color: #00b4de;

    .point {
      position: absolute;

      /* right: calc(-5.68px * $pdf-scale); */
      z-index: 100;
      transform: translate(-50%, 100%);
      width: calc(2.62px * $pdf-scale);
      height: calc(2.62px * $pdf-scale);
      border-radius: 50%;
      border: calc(0.3px * $pdf-scale) solid #00b4de;
      background-color: white;
      /* bottom: calc(-5.68px * $pdf-scale); */
      bottom: 0;
    }
  }
  .none {
    color: transparent;
  }

  .position-back {
    width: calc(154.55px * $pdf-scale) !important;
    height: auto;
    position: absolute;
    /* 24.01.04 위치가 맞지 않아서 수정 */
    left: 21px;
    top: 39px;
  }
  .position-scatter {
    position: absolute;
    /* 24.01.04 위치가 맞지 않아서 수정 */
    top: 35px;
    left: 22px;
    /* left: 0; */
    /* top: 500px; */
    width: calc(125px * $pdf-scale);
    height: auto;
  }
}
</style>
