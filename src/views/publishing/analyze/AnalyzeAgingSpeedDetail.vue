<script>
import BasePopupTit from '../BasePopupTit.vue'
import AnalyzeAgingSpeedDetailPopup from '@/views/publishing/analyze/AnalyzeAgingSpeedDetailPopup.vue'

export default {
  name: 'AnalyzeAgingSpeedDetail',
  components: {
    AnalyzeAgingSpeedDetailPopup,
    BasePopupTit
  },
  data () {
    return {
      speed: 1.42, /* 나의 속도 */
      popup: false, /* 나의 변화 팝업 오프너 */
      isOneTime: true /* 일회성 분석일 경우 false, 개발 시 적용 요망 */
    }
  },
  methods: {
    popupOpen () {
      this.popup = true
    },
    popupClose () {
      this.popup = false
    }
  }
}
</script>

<template>
  <div class="AnalyzeAgingSpeedDetail">
    <div class="AnalyzeAgingSpeedDetail--my">
      <h2 class="AnalyzeAgingSpeedDetail--tit">나의 속도</h2>
      <div class="AnalyzeAgingSpeedDetail--index-wrap">
        <strong class="AnalyzeAgingSpeedDetail--index" style="color: #F6AE5A;">{{ speed }}</strong>배속
        <!--231208 점수에 따라 good, normal, bad 중에 하나 클래스로 넣어 주세요-->
      </div>
      <div class="AnalyzeAgingSpeedDetail--btn-wrap">
        <button
          @click="popupOpen"
          v-if="isOneTime"
          type="button"
          class="AnalyzeAgingSpeedDetail--btn">나의 변화 보기</button>
      </div>
    </div>

    <div class="AnalyzeAgingSpeedDetail--graph-wrap">
      <p class="AnalyzeAgingSpeedDetail--age-wrap">한국 성인 표본집단의 노화 속도와
        <strong class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--age">나의 노화 속도</strong> <!--231208 strong 추가-->
      </p>
      <div class="AnalyzeAgingSpeedDetail--graph"> <!--그래프-->
        <div class="chart-wrap graph" ref="target">
          <div class="label-y">건강 나이</div>
          <div class="label-x">현재 나이</div>
          <div class="label-dst">목표속도</div>
          <div class="label-0">0</div>
          <div class="reage-graph">
            <img src="/img/chart/scatter/reage-graph.png" alt="" />
          </div>
          <div class="pointer" style="left: 48.0115%; top: 55.617%;">
            <div class="my-point-pointer">
              <!--            <div class="my-point-dashed" :style="{ top: getPointPos() + 'px' }"></div>-->
              <div class="my-point-dashed" />
              <!--            <img :style="{ top: getPointPos() + 'px' }" class="my-point-img" src="/img/ico_me.svg" alt="" />-->
              <img class="my-point-img" src="/img/ico_me.svg" alt="" />
              <div class="my-point-dot" />
            </div>
          </div>

          <div class="pointer" style="left: 48.0115%; top: 114%;">
            <span>45세</span>
          </div>

          <!-- 가로 세로 선 -->
          <div
            class="pointer-line-current"
            :style="{
              left: 48 + '%',
              top: 55 + '%',
              width: '0%',
              // height: getAxisCurrent().height + 4.5 + '%',
              height: 45 + '%',
            }" />

          <div
            class="pointer-diagonal"
            :style="{
              left: '0.1%',
              bottom: '12.5%',
              width: 48 + '%',
              height: 33.5 + '%',
            }" />
          <div class="pointer" :style="{ left: '10px', bottom: 46 + '%', }">
            <b> 45세 </b>
          </div>

          <!--          <div class="legend">-->
          <!--            <span class="legend&#45;&#45;avarage">{{ ageArea + "대 평균" }}</span>-->
          <!--            <div class="position" />-->
          <!--            <span>나의 위치</span>-->
          <!--          </div>-->

        </div>
      </div>
    </div>

    <AnalyzeAgingSpeedDetailPopup v-if="popup" @popupClose="popupClose" class="AnalyzeAgingSpeedDetail--popup" />

  </div>
</template>

<style lang="scss" scoped>
.graph {
  //position: relative;
  position: absolute;
  //width: 100%;
  width: 84%;
  //height: 236px;
  height: 100%;
  //top: 0;
  //left: 50%;
  left: 0;
  //transform: translateX(-50%);
  transform: translateX(0);
  //margin-top: 88.5px;
  margin-top: 40px;
  //margin-bottom: 40px;
  margin-right: auto;
  margin-left: auto;
  border-bottom: solid 1px #B2B2B2;
  border-left: solid 1px #B2B2B2;
  background: url("/img/graph_line.svg") bottom;
  background-size: contain;
  @media (min-width: 460px) {
    width: 333px;
    left: 50%;
    transform: translateX(-50%);
  }

  div {
    position: absolute;

    img {
      width: 24px;
      height: auto;
    }
  }

  //img {
  //  position: absolute;
  //  top: -25px;
  //
  //  width: 333px;
  //  height: auto;
  //}
  .reage-graph {
    position: absolute;
    //top: -25px;
    left: 0;
    overflow: hidden;
    //width: 333px;
    width: 100%;
    //height: 333px;
    height: 100%;

    img {
      position: absolute;
      //top: 0;
      //bottom: 0;
      //left: -13.33px;
      //left: 0;
      bottom: -26px;
      left: -16px;
      //width: 333px;
      width: 100%;
      height: auto;
      transform: translate(0, 0) !important;
    }
  }
}

.legend {
  //position: absolute;

  //top: -70px;
  //right: -80px;

  //bottom: 0;
  bottom: -64px;

  //width: calc(283px + 7px);
  width: 100%;
  //margin-left: -18px;
  margin-left: 25px;
  font-size: 1.4rem;
  color: #555;
  font-family: "RixSinHead_Medium", sans-serif;
  text-align: left;
  margin-bottom: 5px;
  //@include flex(flex-end, center);
  display: flex;
  //justify-content: flex-end;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  .name {
    margin-left: 0px;
  }

  //div {
  //@include flex(center, center);
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //}
  span {
    margin: 0;
    margin-left: 5px;
  }

  .position {
    $size: 12px;
    position: relative;
    width: $size;
    height: $size;
    border-radius: $size;
    background-color: #1DB196;
    margin-left: 13px;
  }

  img {
    display: inline-block;
    position: relative !important;
    width: 17px !important;
    height: auto;
    margin: 0;
    top: 0 !important;
  }

  &:before {
    content: "";
    display: inline-block;
    width: 3rem;
    height: 1rem;
    background: url("/img/img_biolet_line.svg") no-repeat left 48%;
  }
}

.label-x {
  position: absolute;
  font-size: 1.3rem;
  font-family: "RixSinHead_Medium", sans-serif;
  color: #555;

  right: -52px;
  bottom: -11px;
}

.label-y {
  position: absolute;
  left: 0;
  top: -20px;
  font-size: 1.3rem;
  font-family: "RixSinHead_Medium", sans-serif;
  color: #555;
}

.label-dst {
  position: absolute;
  bottom: 58%;
  right: -50px;
  font-size: 1.3rem;
  color: #7E7EFF;
  font-family: "RixSinHead_Medium", sans-serif;
}

.label-0 {
  font-size: 1.3rem;
  color: #555;
  font-family: "RixSinHead_Medium", sans-serif;
  bottom: -25px;
}

.my-point-pointer {
  position: absolute;
  right: 0;
  bottom: 0;

  background-color: transparent;

  z-index: 101;

  .my-point-dashed {
    position: absolute;
    width: 1px;
    height: 30px;
    border-right: 1px dashed #00b4de;
    bottom: 0;
  }

  .my-point-dot {
    width: 8px;
    height: 8px;
    transform: translate(-50%, -79%);
    border-radius: 50%;
    background-color: #1DB196;
    border: 1px solid #fff;
  }
}

img.my-point-img {
  position: absolute;
  max-width: fit-content;
  width: 24px;
  height: 33px;
  transform: translate(-50%, -170%);
}

.pointer {

  /*231220 y축 폰트*/
  span {
    /*231220 x축 폰트*/
    position: absolute;
    bottom: 5px;
    white-space: nowrap;
    transform: translateX(-50%);

    color: #555;
    text-align: center;
    font-family: "RixSinHead_Medium", sans-serif;
    font-size: 1.3rem;
    font-style: normal;
    font-weight: 300;
    background-color: white;
    border-right: solid 3px white;
    border-left: solid 3px white;
    border-top: solid 1px white;
  }

  font-size: 1.5rem;
  font-family: "RixSinHead_Medium",
  sans-serif;
  color: #1DB196;
  margin-bottom: -11px;
  z-index: 1;

  b {
    background-color: white;
    font-weight: 300;
    border-right: solid 3px white;
    border-left: solid 3px white;
  }
}

.pointer-line-current {
  border-right: 1px solid #555;
}

.pointer-diagonal {
  background-color: transparent;
  border-top: 1px solid #555;
}
</style>
