<script setup>
import { ref } from "vue";

// Props 정의
const props = defineProps({
  healthScoreData: Object,
  left: Number,
  pdfScale: Number,
  save: Boolean,
  userInfo: Object
});
const calculatePercentage = (value, min, max) => {
  if (max === min) return 0; // 분모가 0이 되는 것을 방지
  return ((value - min) / (max - min)) * 100;
}
// Refs 정의
const target = ref(null);
</script>
<template>
  <div class="chart-wrap" ref="target">
    <!-- <div class="legend-container" >
      <div class="legend"></div>
      <span class="stretch-text">{{ props.userInfo.user_name }}님</span>
    </div> -->
    <div class="graph-wrap">
      <img class="position-scatter" src="@/assets/images/pdf/res/graph-scatter.png" alt="" />
      <img class="position-back" src="@/assets/images/pdf/res/graph-position.png" alt="" />
    </div>

    <div class="over-wrap">
      <!-- 내 점수에 따른 위치 설정 -->
      <div class="my-point" :style="{
        width: `${calculatePercentage(props.healthScoreData.hq_oxi.score, 0, 100)}%`,
        height: `${calculatePercentage(props.healthScoreData.hq_met.score, 0, 100)}%`,
      }">
        <div class="x-indicator">{{ props.healthScoreData.hq_met.score }}</div>
        <div class="y-indicator">{{ props.healthScoreData.hq_oxi.score }}</div>
        <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" />
        <div class="my-point-pointer">
          <div class="point"></div>
        </div>
      </div>
      <span class="label-y">만성질환 억제 분석 지수</span>
      <span class="label-x">노화 억제 분석 지수</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.my-point {
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: calc(0.5px * $pdf-scale) dashed #00b4de;
  border-right: calc(0.5px * $pdf-scale) dashed #00b4de !important;

  span {
    position: absolute;
    top: -60px !important;
    transform: translate(-50%, 0%);

    background: #ffffff !important;
    box-shadow: 0px 0px 5px rgba(75, 92, 69, 0.2);
    border-radius: 123px;
    padding: 3px 4px;

    font-weight: 600;
    font-size: 14px;
    line-height: 17px;

    display: flex;
    align-items: center;
    text-align: center;
    color: #414042;
  }

  img {
    position: absolute;
    width: 60px;
    height: auto;
  }

  .x-indicator {
    position: absolute;
    font-size: calc(7px * $pdf-scale);
    color: #6C6C6C;
    left: calc(20px * $pdf-scale);
    top: 0;
    transform: translate(-125%, -100%);
    line-height: calc(4px);
    background-color: #ffffff;
    padding: 0 calc(2px * $pdf-scale);
  }

  .y-indicator {
    position: absolute;
    font-size: calc(7px * $pdf-scale);
    color: #6C6C6C;
    right: 0;
    bottom: calc(14px * $pdf-scale);
    transform: translate(50%, 125%);
    line-height: calc(4px);
    background-color: #ffffff;
    padding: calc(4px * $pdf-scale) 0;
  }
}

.over-wrap {
  position: absolute;

  z-index: 10;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;

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
    font-size: calc(6px * $pdf-scale);

    font-weight: 500;
    line-height: 1.1;
    color: #BFBFC0 !important;
    @include flex(center, center);
    gap: 6px;

    img {
      width: 11px;
      height: 18px;
    }
  }

  .label-x {
    right: calc(0px * $pdf-scale);
    bottom: calc(-10px * $pdf-scale);

    img {
      transform: rotate(90deg);
    }
  }

  .label-y {
    /* transform: rotate(-90deg); */
    left: calc(0px * $pdf-scale);
    top: calc(-10px * $pdf-scale);


    img {
      transform: rotate(90deg);
    }
  }
}

.chart-wrap {
  position: relative;
  width: calc(143.78px * $pdf-scale);
  height: calc(100px * $pdf-scale);
  display: block;
  margin: calc(15px * $pdf-scale) auto auto auto;

  .legend-container {
    @include flex(center, center);
    position: absolute;
    top: calc(-20px * $pdf-scale);
    right: calc(0px * $pdf-scale);
    z-index: 1;

    .legend {
      display: inline-block;
      margin-right: calc(3px * $pdf-scale);

      width: calc(5px * $pdf-scale);
      height: calc(5px * $pdf-scale);
      background-color: #00B4DE;
    }

    span {
      display: inline-block;
      font-size: calc(6px * $pdf-scale);
      color: #000;
    }
  }
}

.graph-wrap {
  width: 100%;
  height: 100%;
}

.my-point-img {
  position: absolute;
  transform: translate(50%, -100%);
  width: calc(10.3px * $pdf-scale) !important;
  height: auto;
  right: 0;
  top: 0;
  z-index: 1;
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

    z-index: 100;
    transform: translate(-50%, 100%);
    width: calc(5px * $pdf-scale);
    height: calc(5px * $pdf-scale);
    border-radius: 50%;
    border: calc(1px * $pdf-scale) solid #00b4de;
    background-color: white;
    bottom: calc(1px * $pdf-scale);
  }
}

.position-back {
  position: absolute;
  left: 0;
  top: 0;
}

.position-scatter {
  width: 100%;
}
</style>
