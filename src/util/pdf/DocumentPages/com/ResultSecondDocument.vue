<template>
  <div class="graph">
    <div class="label-y">건강 나이</div>
    <div class="label-x">현재 나이</div>
    <div
      class="label-dst"
      :style="{ top: save ? '41.5%' : '43%', right: save ? '2%' : '0%' }"
    >
      목표속도
    </div>
    <img
      class="graph-back"
      src="/img/pdf/res/graph-position.png"
      alt=""
    />
    <div class="reage-graph">
      <img src="/img/pdf/res/reage-graph.png" alt="" />
    </div>

    <!-- 현재 위치 포인터 이미지 아이콘 -->
    <div
      class="pointer"
      :style="{ left: getAxis().x + '%', top: getAxis().y + '%' }"
    >
      <div class="my-point-pointer">
        <div
          class="my-point-dashed"
          :style="{ top: getPointPos() + 'px !important' }"
        ></div>
        <img
          :style="{ top: getPointPos() + 'px !important' }"
          class="my-point-img"
          src="/img/pdf/res/age-graph-icon.png"
          alt=""
        />
        <div class="my-point-dot"></div>
      </div>
    </div>

    <div class="pointer" :style="{ left: getAxis().x + '%', top: '112%' }">
      <span>{{ age.current }}세</span>
    </div>

    <!-- 현재위치 가로 세로 선 -->
    <div
      class="pointer-line-current"
      :style="{
        left: getAxisCurrent().isRight
          ? getAxisCurrent().x + '%'
          : getAxisCurrent().x + getAxisCurrent().width + '%',
        top: getAxisCurrent().y + '%',
        width: '0%',
        height: getAxisCurrent().height + 4.5 + '%',
      }"
    ></div>

    <div
      class="pointer-diagonal"
      :style="{
        left: '0.1%',
        bottom: '12.5%',
        width: getAxisCurrent().isRight
          ? getAxisCurrent().x + '%'
          : getAxisCurrent().x + getAxisCurrent().width + '%',
        height: getAxisCurrent().height - 12.5 + '%',
      }"
    ></div>

    <div
      class="pointer"
      :style="{
        left: save ? 18 + '% !important' : 14 + '% !important',
        // top: '87%',
        bottom: getAxisCurrent().height + '%',
      }"
    >
      <b> {{ age.health }}세 </b>
    </div>
  </div>
</template>

<script setup>
//import { mapState } from "vuex";
import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  data: Object,
  eatingHabit: Object,
  date: null,
  check_date: null,
  userInfo: null,
  save: null,
  pdfScale: null,
});

const metRate = ref(0);
const oxiRate = ref(0);
const metPer = computed(() => {
  let rtn = 0;
  if(props.data !== undefined) {
    rtn = props.data.resultDto.myHQ.MET_PERC;
  }
  return rtn;
});
const oxiPer = computed(() => {
  let rtn = 0;
  if(props.data !== undefined) {
    rtn = props.data.resultDto.myHQ.OXI_PERC;
  }
  return rtn;
});
const popReage = ref(false);

const age = computed(() => {
  let health = 0;
  let current = 0;
  let diff = 0;

  if(props.eatingHabit.resultDto.myHQ !== undefined){
    health = Math.round(props.eatingHabit.resultDto.myHQ.ReAge);
    current = Math.round(props.userInfo.age);
    diff = health - current;
  }

  return {health, current, diff};
});

// 노화/만성질환 억제 분석 지수 점수
const myValue = computed(() => {
  let MET = 0;
  let OXI = 0;

  
  if(props.data !== undefined) {
    MET = props.data.resultDto.myHQ.MET;
    OXI = props.data.resultDto.myHQ.OXI;
  }
  return {
    Met: Number(Math.sqrt(MET).toFixed(0)),
    Oxi: Number(Math.sqrt(OXI).toFixed(0)),
  };
});

function getPointPos() {
  let rate = (age.value.current - 19) / 61;

  const pos = -getAxis().y * (rate + 1);
  if (pos > -30) return -30 * props.pdfScale;
  return pos;
}

// 나이 범위에서 현재나이의 비율
const agingRate = computed(() => {
  const min = 19;
  const max = 80;

  let ageData = {
    min : 0,
    max : 80
  }

  if(props.data.resultData !== undefined) {
    ageData.min = props.data.resultData.refHQ.min;
    ageData.max = props.data.resultData.refHQ.max;
  }

  let rate =
    ((age.value.health - ageData.min) / (ageData.max - ageData.min)) * 100;

  return rate.toFixed(0);
});

// 포인터 아이콘 좌표
function getAxis() {
  let x_value = 85.2 - 14;
  let y_value = 61;

  let startX = 5.7;
  let startY = 77;
  const yDiff = 17;
  let rate = (age.value.current - 19) / 61;

  // for test
  // rate = (37 - 19) / 61;

  const x = startX + x_value * rate;
  const agingPos = (agingRate.value / 100) * 2 * yDiff;

  let y = startY - y_value * rate - agingPos + yDiff;
  // const ymin = 5;
  const ymin = 27;
  const ymax = 101.5;

  // y = ((ymax - ymin) * (100 - this.agingRate())) / 100 + ymin;
  y = ((ymax - ymin) * (100 - age.value.health * 0.9)) / 100 + ymin;

  // for test
  // y = ((ymax - ymin) * (100 - 34)) / 100 + ymin;

  return { x: x, y: y };
}

// 가로 세로 선 좌표
function getAxisCurrent() {
  let x_value = 85.2 - 14;
  let y_value = 61;

  let startX = 5.7;
  let startY = 77;
  const yDiff = 17;
  let rate = (age.value.health - 19) / 61;
  // rate = (80 - 19) / 61;

  const x = startX + x_value * rate;
  const agingPos = (agingRate.value / 100) * 2 * yDiff;

  let y = startY - y_value * rate - agingPos + yDiff;
  // const ymin = 5;
  const ymin = 27;
  const ymax = 101.5;

  // y = ((ymax - ymin) * (100 - this.agingRate())) / 100 + ymin;
  y = ((ymax - ymin) * (100 - age.value.health * 0.9)) / 100 + ymin;

  // y = ((ymax - ymin) * (100 - 100)) / 100 + ymin;
  // console.log("agingrate", this.agingRate(), y);

  const origin = getAxis();

  let data = {
    x: 0,
    y: y + 2,
    width: 0,
    height: 100 - y - 2,
    isRight: false,
    age_x: 0,
  };

  if (origin.x > x) {
    data.x = x;
    data.width = origin.x - x;
    data.age_x = x;
  } else {
    data.x = origin.x;
    data.width = x - origin.x;
    data.isRight = true;
    data.age_x = x;
  }

  return data;
};



onMounted(() => {
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/result.scss";
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
  > h4 {
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
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;

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
    color: $black;
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

  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
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
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
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

.legend {
  /* width: 137px; */
  /* height: auto; */
  align-self: center;
  //@include flex(flex-end, center);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 280px;
  flex-direction: row;
  margin-bottom: 44px;

  color: #54585b;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  .legend-age {
    width: 19px;
    height: 6px;
    background-color: rgba(39, 164, 255, 0.6);
  }
  span {
    margin-left: 5px;
  }

  img {
    width: 13px;
    height: 13px;
    margin-left: 12px;
  }
}
.graph {
  position: relative;
  /* width: 283px;
  height: 187px; */
  width: calc(160px * $pdf-scale) !important;
  height: calc(114.5px * $pdf-scale) !important;
  margin-top: calc(51.5px * $pdf-scale) !important;
  margin-left: calc(21.15px * $pdf-scale) !important;
  /* margin-bottom: calc(40px * $pdf-scale); */
  div {
    position: absolute;
    img {
      width: 30px;
      height: auto;
      transform: translate(-50%, -80%);
    }
  }
  img {
    position: absolute;
    top: calc(12px * $pdf-scale);
    /* margin-top: calc(14px * $pdf-scale); */
    width: calc(160px * $pdf-scale);
    height: auto;
  }

  .reage-graph {
    /* margin-left: -10px; */

    position: absolute;
    top: calc(12px * $pdf-scale);
    left: 0;
    /* transform: translateX(); */
    overflow: hidden;
    width: calc(160px * $pdf-scale); /* height: 100%; */
    height: calc(160px * $pdf-scale);
    img {
      position: absolute;
      top: 0 !important;
      left: calc(-7px * $pdf-scale);
      /* left: 0; */
      /* top: 0;
      left: 0; */
      width: calc(160px * $pdf-scale) !important;
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
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
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
  border-right: calc(0.3px * $pdf-scale) solid #000000;
}

.pointer-diagonal {
  /* background-color: rebeccapurple; */
  background-color: transparent;
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  /* background: linear-gradient(
    to bottom right,
    transparent calc(50% - 2px),
    #0066c5,
    transparent calc(50% + 2px)
  ); */
}

.diagonalCross2 {
  background: linear-gradient(
    to top right,
    #fff calc(50% - 1px),
    black,
    #fff calc(50% + 1px)
  );
}

.pointer {
  span {
    position: absolute;
    bottom: 0;
    white-space: nowrap;
    transform: translateX(-50%);

    color: #54585b;
    text-align: center;
    font-family: Pretendard;
    font-size: calc(6px * $pdf-scale);
    font-style: normal;
    font-weight: 500;
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
    left: calc(-12px * $pdf-scale);
    width: calc(50px * $pdf-scale);
    text-align: left;
    color: #00b4de;
    font-size: calc(6px * $pdf-scale);
    font-weight: 500;
  }

  .reage-current {
    width: 16px;
    height: 16px;
  }
}

.popup {
  position: fixed;
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
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
    padding-bottom: 40px; /* padding-bottom: 21px; */
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    background: $white;
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
    //@include flex(flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 6px;
    margin-bottom: 30px;
  }
  ul {
    font-weight: 400;
    font-size: 14px;
    color: #54585b;
  }

  .info {
    /* position: absolute;
    top: 16px;
    right: 16px; */
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
    //@include flex;
    display: flex;
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
  font-size: calc(4px * $pdf-scale);
  color: #727171;

  transform: translate(110%, 50%);
  right: 0;
  bottom: calc(-5px * $pdf-scale);
}

.label-y {
  position: absolute;
  transform: translate(-90%, 0);
  top: -8%;
  font-size: calc(4px * $pdf-scale);
  color: #727171;
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
  transform: translate(50%, -75%);
  height: calc(5.68px * $pdf-scale);
  width: calc(0.25px * $pdf-scale);
  background-color: transparent;
  border-right: calc(0.25px * $pdf-scale) dashed #00b4de;

  z-index: 101;

  .my-point-dashed {
    position: absolute;
    width: calc(0.3px * $pdf-scale);
    /* height: 100px; */
    border-right: calc(0.5px * $pdf-scale) dashed #00b4de;
    transform: translate(-50%);
    bottom: 0;
  }
  .my-point-dot {
    bottom: calc(-3px * $pdf-scale);

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
  /* transform: translate(0%, 0%) !important;
  width: calc(10.3px * $pdf-scale) !important;
  height: calc(14.22px * $pdf-scale) !important;
  right: calc(-5.3px * $pdf-scale) !important;
  top: calc(-14.22px * $pdf-scale) !important; */
  width: calc(11px * $pdf-scale) !important;
  height: auto !important;
  transform: translate(-50%);
  z-index: 100;
}

.stretch-page2 {
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
    > h4 {
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
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;

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
      color: $black;
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

    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
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
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
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

  .legend {
    /* width: 137px; */
    /* height: auto; */
    align-self: center;
    //@include flex(flex-end, center);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 280px;
    flex-direction: row;
    margin-bottom: 44px;

    color: #54585b;
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    .legend-age {
      width: 19px;
      height: 6px;
      background-color: rgba(39, 164, 255, 0.6);
    }
    span {
      margin-left: 5px;
    }

    img {
      width: 13px;
      height: 13px;
      margin-left: 12px;
    }
  }
  .graph {
    position: relative;
    /* width: 283px;
  height: 187px; */
    width: calc(160px * $pdf-scale);
    height: calc(114.5px * $pdf-scale);
    margin-top: calc(37.1px * $pdf-scale);
    margin-left: calc(21.15px * $pdf-scale);
    margin-bottom: 40px;
    div {
      position: absolute;
      img {
        width: 30px;
        height: auto;
        transform: translate(-50%, -80%);
      }
    }
    img {
      position: absolute;
      top: calc(14px * $pdf-scale);
      /* margin-top: calc(14px * $pdf-scale); */
      width: calc(160px * $pdf-scale);
      height: auto;
    }
  }
  .range {
    width: 8px;
    height: 187px;
    background: rgba(39, 164, 255, 0.6);
    transform: translate(-50%);
  }
  .card {
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
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
    border-right: calc(0.5px * $pdf-scale) solid #000000;
  }

  .pointer-diagonal {
    /* background-color: rebeccapurple; */
    background-color: transparent;
    border-top: calc(0.5px * $pdf-scale) solid #000000;
    /* background: linear-gradient(
    to bottom right,
    transparent calc(50% - 2px),
    #0066c5,
    transparent calc(50% + 2px)
  ); */
  }

  .diagonalCross2 {
    background: linear-gradient(
      to top right,
      #fff calc(50% - 1px),
      black,
      #fff calc(50% + 1px)
    );
  }

  .pointer {
    span {
      position: absolute;
      bottom: 0;
      white-space: nowrap;
      font-family: "Pretendard";

      transform: translate(-50%, 0%);

      color: #54585b;
      text-align: center;
      font-family: Pretendard;
      font-size: calc(6px * $pdf-scale);
      font-style: normal;
      font-weight: 500;
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
      font-family: "Pretendard";

      transform: translate(-65%, -45%);
      left: calc(-12px * $pdf-scale);
      width: calc(50px * $pdf-scale);
      text-align: left;
      color: #00b4de;
      font-size: calc(6px * $pdf-scale);
      font-weight: 500;
    }

    .reage-current {
      width: 16px;
      height: 16px;
    }
  }

  .popup {
    position: fixed;
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
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
      padding-bottom: 40px; /* padding-bottom: 21px; */
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      background: $white;
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
      //@include flex(flex-start, center);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 6px;
      margin-bottom: 30px;
    }
    ul {
      font-weight: 400;
      font-size: 14px;
      color: #54585b;
    }

    .info {
      /* position: absolute;
    top: 16px;
    right: 16px; */
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
      //@include flex;
      display: flex;
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
    top: calc(6.5px * $pdf-scale) !important;
    left: calc(0px * $pdf-scale);
  }

  .label-x {
    position: absolute;
    font-family: "Pretendard";

    font-size: calc(4px * $pdf-scale);
    color: #727171;

    /* transform: translate(110%, calc($pdf-text-ratio + 50%)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    right: 0;
    bottom: calc(-5px * $pdf-scale);
  }

  .label-y {
    position: absolute;
    font-family: "Pretendard";
    /* transform: translate(-90%, calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    top: -8%;
    font-size: calc(4px * $pdf-scale);
    color: #727171;
  }

  .label-dst {
    position: absolute;
    font-family: "Pretendard";

    /* transform: translate(95%, calc($pdf-text-ratio)); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    top: 45%;
    right: 0;
    font-size: calc(5px * $pdf-scale);
    color: #92539d;
  }
  .my-point-pointer {
    position: absolute;
    right: 0;
    top: 0;
    /* transform: translate(50%, -75%); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
    height: calc(5.68px * $pdf-scale);
    width: calc(0.25px * $pdf-scale);
    background-color: transparent;
    border-right: calc(0.25px * $pdf-scale) dashed #00b4de;

    z-index: 101;
    .point {
      position: absolute;

      /* right: calc(-5.68px * $pdf-scale); */
      z-index: 100;
      /* transform: translate(-45%, 110%); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
      width: calc(2.62px * $pdf-scale);
      height: calc(2.62px * $pdf-scale);
      border-radius: 50%;
      border: calc(0.3px * $pdf-scale) solid #00b4de;
      background-color: white;
      /* bottom: calc(-5.68px * $pdf-scale); */
      bottom: 0;
    }
  }
  .my-point-img {
    position: absolute;
    transform: translate(0%, 0%) !important;
    width: calc(10.3px * $pdf-scale) !important;
    height: calc(14.22px * $pdf-scale) !important;
    right: calc(-5.3px * $pdf-scale) !important;
    top: calc(-14.22px * $pdf-scale) !important;
    z-index: 100;
  }

  img.my-point-img {/* 24.01.03 타 CSS와의 충돌 문제로 추가 */
    max-width:none;
  }
}
</style>
