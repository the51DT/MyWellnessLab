<script setup>
import { ref, onMounted } from "vue";

// Props 정의
const props = defineProps({
  healthScoreData: Object,
  left: Number,
  pdfScale: Number,
  save: Boolean,
  userInfo: Object
});

// Refs 정의
const target = ref(null);

// Lifecycle Hook
onMounted(() => {
});
</script>
<template>
  <div class="chart-wrap" ref="target">
    <div class="graph-wrap">
      <img class="position-scatter" src="@/assets/images/pdf/res/graph-scatter.png" alt="" />
      <img class="position-back" src="@/assets/images/pdf/res/graph-position.png" alt="" />
    </div>

    <div class="over-wrap">
      <!-- 내 점수에 따른 위치 설정 -->
      <div class="my-point" :style="{
        width: `${props.healthScoreData.hq_oxi.score}%`,
        height: `${props.healthScoreData.hq_met.score}%`,
      }">
        <div class="x-indicator">{{ props.healthScoreData.hq_met.score }}</div>
        <div class="y-indicator">{{ props.healthScoreData.hq_oxi.score }}</div>
        <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" />
        <div class="my-point-pointer">
          <div class="point"></div>
        </div>
      </div>
      <span class="label-y" :style="left ? 'left:' + left + 'px' : ''">만성질환 억제 분석 지수</span>
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
  border-top: calc(1px * $pdf-scale) dashed #00B4DE;
  border-right: calc(1px * $pdf-scale) dashed #00B4DE !important;

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
  }

  img {
    position: absolute;
    /* left: 1px;
    bottom: 1px; */
    width: calc(20px * $pdf-scale) !important;
    height: auto;
  }

  .x-indicator {
    position: absolute;
    font-size: calc(12px * $pdf-scale);
    font-weight: $medium;
    color: #6C6C6C;
    left: calc(35px * $pdf-scale);
    top: 0;
    transform: translate(-125%, -100%);
    line-height: calc(4px);
    background-color: #ffffff;
    padding: 0 calc(5px * $pdf-scale);

  }

  .y-indicator {
    position: absolute;
    font-size: calc(12px * $pdf-scale);
    font-weight: $medium;
    color: #6C6C6C;
    right: 0;
    bottom: calc(24px * $pdf-scale);
    transform: translate(50%, 125%);
    line-height: calc(4px);
    background-color: #ffffff;
    padding: calc(6px * $pdf-scale) 0;
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
    font-size: calc(10px * $pdf-scale);

    font-weight: 400;
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
    bottom: calc(-15px * $pdf-scale);

    img {
      transform: rotate(90deg);
    }
  }

  .label-y {
    left: calc(0px * $pdf-scale);
    top: calc(-20px * $pdf-scale);

    img {
      transform: rotate(90deg);
    }
  }
}

.chart-wrap {
  position: relative;
  width: calc(325px * $pdf-scale);
  height: calc(220px * $pdf-scale);
  display: block;
  margin: 0 auto;
  .legend-container {
    @include flex(center, center);
    position: absolute;
    top: calc(-20px * $pdf-scale);
    right: calc(-10px * $pdf-scale);
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
    width: calc(8px * $pdf-scale);
    height: calc(8px * $pdf-scale);
    border-radius: 50%;
    border: calc(1.5px * $pdf-scale) solid #00B4DE;
    background-color: white;
    bottom: calc(2px * $pdf-scale);
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
