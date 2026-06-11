<script setup>
import { computed } from "vue";

// Props 정의
const props = defineProps({
  healthScoreData: Object,
  save: Boolean,
  userInfo: Object,
  check_date: String,
  pdfScale: Number,
});

const report_age = props.healthScoreData.hqReference.age

/** 발급당시 실제나이 (x 축) */
const getAgeGraphY = computed(() => {
  // 25.08.07 --> 19세 -> 20세~90세 로 범위 변경
  // 19세 미만일 경우 19세, 80세 초과일 경우 80세로 설정
  // var age = report_age
  /**
 * 25.08.25
 * 발급당시 실제 나이 -> 건강검진 당시 나이
 */
 //25.09.03 --> 20 ~ 80
  var age = report_age
  if (age < 20) {
    age = 20;
  } else if (age > 80) {
    age = 80;
  }
  var range = 80 - 20;
  var relativeValue = age - 20;

  return (relativeValue / range) * 100
})
/** 건강나이 (Y 축) */
const getAgeGraphX = computed(() => {
  // 25.08.07 --> 10세~90세 로 범위 변경
   //25.09.03 --> 0 ~ 100
  var age = props.healthScoreData.hq_reage.reage
  if (age < 0) {
    age = 0;
  } else if (age > 100) {
    age = 100;
  }
  var range = 100 - 0;
  var relativeValue = age - 0;

  return (relativeValue / range) * 100
})
</script>
<template>
  <div class="graph">
    <div class="reage-graph">
      <div class="label-y">건강 나이</div>
      <div class="label-x">실제 나이</div>
      <img class="graph-back" src="@/assets/images/pdf/res/reage-graph.png" alt="" />

      <div class="graph-pointer">
        <!-- 현재 위치 포인터 이미지 아이콘 -->

        <div class="graph-point-background">

          <div class="pointer" :style="{ left: getAgeGraphY + '%', bottom: getAgeGraphX + '%' }">
            <div class="my-point-pointer">
              <div class="my-point-dashed"></div>
              <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" />
              <div class="my-point-dot"></div>
            </div>
          </div>

          <div class="pointer x-label" :style="{ left: getAgeGraphY + '%', top: '112%' }">
            <span>{{ report_age }}세</span>
          </div>

          <!-- 현재위치 가로 세로 선 -->
          <div class="pointer-line-current" :style="{
            left: getAgeGraphY + '%',
            bottom: 0,
            width: '0%',
            height: getAgeGraphX + '%',
          }"></div>
          <!-- 현재위치 가로선인데, 백그라운드 이미지 때문에 left, width 를 조정해야함. 0%가 맨 왼쪽에 있지 않고 공간이 있기 때문-->
          <!-- 여기서 4 은 .graph-pointer 에 margin-left 값이고, 4는 pdfScale 값임 -->
          <div class="pointer-diagonal" :style="{
            left: `0`,
            bottom: getAgeGraphX + '%',
            width: `calc(${getAgeGraphY}%)`,
          }"></div>

          <div class="pointer y-label" :style="{
            bottom: getAgeGraphX + '%',
          }">
            <b> {{ props.healthScoreData.hq_reage.reage }}세 </b>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";


h3 {
  font-weight: 500;
  font-size: 23px;
  line-height: 27px;
  text-align: center;

  color: #414042;
}

.date {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

p {
  align-self: flex-start;
  font-size: 14px;
  text-align: left;

  b {
    display: block;
    font-size: 15px;
  }
}

.recent {
  >h4 {
    font-size: 15px;
    font-weight: 500;
    color: #000;
    margin-bottom: 20px;
  }
}

.explain-list {
  /* margin: 0px 20px 0px 40px; */
  font-size: 14px;
}

.explain-list li {
  list-style-type: circle !important;
  list-style: inside !important;
  text-indent: -20px;
}

.score-title {
  font-size: 18px !important;
  align-self: flex-start;
  @include flex(center, center);

  span {
    font-weight: 500;
    font-size: 18px;
    /* margin-top: 5px; */
  }

  .info-icon {
    width: 26px !important;
    height: 26px;
  }

  .question-icon {
    /* display: none; */
    width: 15px;
    height: 17px;
    margin-left: 8px;

    cursor: pointer;
  }
}

.score-text {
  margin-bottom: 40px;
  font-size: 11px;

  .title {
    display: inline;
    height: 100%;
    font-size: 11px;
    color: #000000;
    font-weight: normal;
  }

  span {
    display: inline;
    vertical-align: middle;
    font-size: 16px;
    // color: red;
    font-weight: bold;
  }
}

.age-speed {
  width: 267px;
  height: 77px;

  background: rgba(243, 243, 243, 0.5);
  border-radius: 25px;

  text-align: center;
  font-family: Pretendard;
  font-size: 34px;
  font-style: normal;
  font-weight: 900;
  line-height: 131.453%;

  color: #414042;
  margin-top: 9px;
  margin-bottom: 14px;

  @include flex(center, center);
  gap: 49px;

  span {
    color: #414042;
    text-align: center;
    font-family: Pretendard;
    font-size: 18.857px;
    font-style: normal;
    font-weight: 300;
    line-height: 125%;
  }

  .vertical {
    @include flex(center, center);
    flex-direction: column;

    .current-age {
      font-weight: 700;
      font-size: 29px;
      line-height: 35px;
      /* identical to box height */

      text-align: center;
      letter-spacing: 0.03em;

      color: #e1392c;
    }

    .diff-age {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      text-align: center;

      color: #54585b;
    }

    span {
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
      /* identical to box height */

      text-align: center;
      letter-spacing: 0.03em;

      color: #54585b;
    }
  }
}

.subject {
  width: calc(140px * $pdf-scale);
  display: flex;
  justify-content: space-between;

}

.legend {
  position: absolute;
  top: calc(-10px * $pdf-scale);
  right: calc(20px * $pdf-scale);
  @include flex(flex-end, center);
  font-size: calc(7px * $pdf-scale);

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

.graph {
  position: relative;
  width: calc(316px * $pdf-scale) !important;
  height: calc(260px * $pdf-scale) !important;
  margin: 0 auto !important;
  margin-top: calc(37.1px * $pdf-scale) !important;

  div {

    .graph-back {
      width: 30px;
      height: auto;
      transform: translate(-50%, -80%);
    }
  }

  .graph-back {
    position: absolute;
    top: calc(12px * $pdf-scale);
    width: calc(353px * $pdf-scale);
    height: auto;
  }

  .reage-graph {

    position: absolute;
    left: calc(-1px * $pdf-scale);
    width: calc(386.5px * $pdf-scale);
    height: calc(259px * $pdf-scale);

    .graph-back {
      position: absolute;
      top: 0 !important;
      width: 100%;
      height: auto;
      transform: translate(0, 0) !important;
    }
  }
}

.range {
  width: 8px;
  height: 187px;
  background: rgba(39, 164, 255, 0.6);
  transform: translate(-50%);
}

.card {
  @include flex(center, center);
  flex-direction: column;

  hr {
    /* margin-top: 34px; */
    margin-bottom: 16px;
    margin-right: 16px;
    margin-left: 16px;
    width: 100%;
    height: 0;
    border-top: 1px solid #cccccc;
  }

  p {
    font-weight: 400;
    font-size: 11px;
    color: #c4926d;
  }
}

.speed-desc {
  color: rgba(84, 88, 91, 0.7);
  text-align: center;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 131.453%;

  margin-top: 17px;
}

.target-speed {
  font-weight: 500;
  font-size: 12px;
  color: #414042;
  right: -55px;
  bottom: 110px;
}

.pointer-dot {
  border-top: 2px dashed #0066c5;
  border-left: 2px dashed #0066c5;

  .triangle {
    width: 0;
    height: 0;
    border-top: 10px solid #0066c5;
    border-bottom: 10px solid transparent;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    left: -8px;
    bottom: -10px;
  }
}

.pointer-dot-right {
  border-top: 2px dashed #0066c5;
  border-right: 2px dashed #0066c5;

  .triangle {
    width: 0;
    height: 0;
    border-top: 10px solid #0066c5;
    border-bottom: 10px solid transparent;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    right: -8px;
    bottom: -10px;
  }
}

.pointer-line-current {
  position: absolute;
  border-right: calc(0.5px * $pdf-scale) solid #0AB2ED;
  // padding-left: calc(4px * $pdf-scale);
}

.pointer-diagonal {
  position: absolute;
  // padding-left: calc(4px * $pdf-scale);
  background-color: transparent;
  border-top: calc(0.5px * $pdf-scale) solid #0AB2ED;
}

.diagonalCross2 {
  background: linear-gradient(to top right,
      #fff calc(50% - 1px),
      black,
      #fff calc(50% + 1px));
}

.pointer {
  position: absolute;
  // padding-left: calc(4px * $pdf-scale);

  span {
    position: absolute;
    bottom: calc(10px * $pdf-scale);
    white-space: nowrap;
    transform: translateX(-50%);

    color: #0AB2ED;
    text-align: center;
    font-family: Pretendard;
    color: #00B4DE;
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
    /* line-height: 13px; */
  }

  .pointer-my-speed {
    font-weight: 500;
    font-size: calc(12px * $pdf-scale);
    color: #2382da;
    width: calc(50px * $pdf-scale);
    text-align: center;
    transform: translateX(-50%);
    top: calc(-60px * $pdf-scale);
    z-index: 100;
  }

  b {
    position: absolute;
    transform: translate(-50%, -50%);
    left: calc(-5px * $pdf-scale);
    width: calc(50px * $pdf-scale);
    text-align: left;
    color: #00B4DE;
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
  }

  .reage-current {
    width: 16px;
    height: 16px;
  }
}

.popup {
  position: fixed;
  @include flex(center, center);
  top: 0;
  width: 100%;
  max-width: $max-width;
  height: 100vh;
  //   background: rgba($color: #000000, $alpha: 0.4);
  z-index: 1000;

  word-break: keep-all;

  .pop-body {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 319px;
    padding: 20px;
    padding-bottom: 40px;
    /* padding-bottom: 21px; */
    @include flex(center, center);
    background: #ffffff;
    border-radius: 25px;
    box-shadow: 0px 0px 6px rgba($color: #000000, $alpha: 0.16);

    div {
      width: 100%;
    }
  }

  h4 {
    color: #54585b;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 23px;
  }

  h3 {
    color: #414042;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 0;
  }

  .popup-header {
    @include flex(flex-start, center);
    gap: 6px;
    margin-bottom: 30px;
  }

  ul {
    font-weight: 400;
    font-size: 14px;
    color: #54585b;
  }

  .info {
    width: 26px;
    height: 26px;
  }

  .close {
    position: absolute;
    top: 24px;
    right: 20px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .btn-wrap {
    @include flex;
    gap: 10px;

    .btn {
      height: 32px;
      font-size: 14px;

      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
}

.graph-back {
  position: absolute;
  top: calc(6px * $pdf-scale) !important;
  left: calc(-1px * $pdf-scale);
}

.label-x {
  position: absolute;
  font-size: calc(10px * $pdf-scale);
  color: #5E5E5E;
  font-weight: 400;
  transform: translate(110%, 50%);
  right: calc(55px * $pdf-scale);
  bottom: calc(0px * $pdf-scale);
}

.label-y {
  position: absolute;
  transform: translate(-90%, 0);
  left: calc(10px * $pdf-scale);
  top: -8%;
  font-size: calc(10px * $pdf-scale);
  font-weight: 400;
  color: #5E5E5E;
}

.label-dst {
  position: absolute;
  transform: translate(95%, 0);
  top: 43%;
  right: 0;
  font-size: calc(5px * $pdf-scale);
  color: #127f50 !important;
}

.my-point-pointer {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(100%, -75%);
  height: calc(5.68px * $pdf-scale);
  width: calc(16px * $pdf-scale);
  background-color: transparent;
  // border-right: calc(0.25px * $pdf-scale) dashed #00b4de;

  z-index: 101;

  .my-point-dashed {
    position: absolute;
    width: calc(0.3px * $pdf-scale);
    height: calc(15px * $pdf-scale);
    border-right: calc(0.5px * $pdf-scale) solid #00b4de;
    transform: translate(-50%);
    bottom: 0;
  }

  .my-point-dot {
    position: absolute;
    bottom: calc(-1px * $pdf-scale);

    width: calc(2.3px * $pdf-scale);
    height: calc(2.3px * $pdf-scale);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: white;
    border: calc(0.3px * $pdf-scale) solid #00b4de;
  }
}

.my-point-img {
  position: absolute;
  width: calc(16px * $pdf-scale) !important;
  height: auto !important;
  transform: translate(-50%, -115%);
  z-index: 100;
}

.graph-pointer {
  position: absolute;
  width: calc(301px * $pdf-scale);
  // padding-left: calc(4px * $pdf-scale);
  padding-top: calc(10.5px * $pdf-scale);
  height: 100%;

}

.graph-point-background {
  position: relative;
  width: 100%;
  height: 100%;

}
</style>
