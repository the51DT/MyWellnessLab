<script>
import BasePopupTit from '../BasePopupTit.vue'
import AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup from '@/views/publishing/analyze/AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup.vue'

export default {
  name: 'AnalyzeChronicDiseaseControlAnalyzeIndexDetail',
  components: {
    AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup,
    BasePopupTit
  },
  data () {
    return {
      myIndex: 75, /* 나의 지수 */
      ages: '40대 여성', /* 나이대, 개발 시 적용 요망 */
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
  <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail">
    <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--my">
      <h2 class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--tit">나의 지수</h2>
      <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--index-wrap">
        <strong class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--index" style="color: rgb(246, 174, 90);">{{ myIndex }}</strong>점
        <!--231208 점수에 따라 good, normal, bad 중에 하나 클래스로 넣어 주세요-->
      </div>
      <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--btn-wrap">
        <button
          @click="popupOpen"
          v-if="isOneTime"
          type="button"
          class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--btn">나의 변화 보기</button>
      </div>
    </div>

    <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--graph-wrap">
      <p class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--age-wrap">
        <strong class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--age">{{ ages }}</strong>의 연령별 분포와 나의 위치
      </p>
      <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--graph"> <!--그래프-->
        <div class="graph-wrap">
          <div class="violin-container">
            <div class="graph-back">
              <div class="legend">
                <div>
                  <span class="legend--avarage">{{ ages + " 평균" }}</span>
                  <div class="position" />
                  <span>나의 위치</span>
                </div>
              </div>
              <div class="graph-wrap-in" />
            </div>
            <img class="violin" src="/img/pdf/res/violin/violin-oxi-40-f.png" alt="" />
            <div class="my-point" :style="{ left: '50%', top: 100 - 50 + '%', }">
              <img class="my-point-img" src="/img/ico_me.svg" alt="" />
              <div class="my-point-pointer">
                <div class="point" />
              </div>
              <div class="my-point-score">
                <span class="my-rank">{{ rank }}등</span>
              </div>
            </div>
            <img
              class="violin-avg"
              src="/img/violin-avg.svg"
              alt=""
              :style="{top: 100 - meanScore + '%',}" />
            <div class="violin-container--max">100</div>
          </div>
        </div>
      </div>
    </div>

    <AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup
      v-if="popup"
      @popupClose="popupClose"
      class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--popup" />

  </div>
</template>

<style lang="scss" scoped>
.violin-title {
  width: 100%;

  h3 {
    text-align: left;
    /* top: 0; */
    /* position: absolute; */
    font-size: 12px;
    font-weight: 700;
    color: #000;
    align-self: flex-start;
    margin-bottom: 0px;
    line-height: normal;
  }
}

.violin-container {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  //margin-top: 65px;
  //height: 200px;
  height: 100%;
  width: 100%;

  img {
    position: absolute;
  }

  .indicator {
    position: absolute;
    /* right: -9px - 18px); */
    left: 102px;
    width: 8px;
    height: 200px;
    /* background-color: black; */
    border-top: 1px solid #414042;
    border-bottom: 1px solid #414042;

    text-align: center;

    font-weight: 400;
    font-size: 12px;
    color: #414042;

    .vertical {
      margin: 0 auto;
      width: 1px;
      background-color: #414042;
      height: 100%;
    }

    .max {
      text-align: left;
      position: absolute;
      width: 100px;
      right: -103px;
      top: 0;
      transform: translateY(-50%);
    }

    .mean {
      text-align: left;
      position: absolute;
      width: 100px;
      right: -103px;
      transform: translateY(-75%);
    }

    .min {
      position: absolute;
      text-align: left;
      width: 100px;
      right: -103px;
      bottom: 0;
      //transform: translateY(50%);
    }
  }

  &--max {
    font-size: 1.3rem;
    color: #555;
    position: absolute;
    top: -18px;
    left: 0;
  }
}

.graph-back {
  position: absolute;
  left: 0;
  top: 0;
  /* transform: translateX(calc(50% + 23px)); */

  //height: 236px;
  height: 100%;
  /* width: calc(239px + 23px); */
  width: 100%;
  //@include flex(flex-start, center);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  img {
    //margin-top: 18px;
    width: auto;
    //height: 219px;
    //transform: translateX(-11.5px);
  }

  .legend {
    width: calc(270px + 7px);
    margin-left: -18px;

    font-size: 14px;
    color: #555;
    text-align: left;
    //margin-bottom: 5px;
    //@include flex(space-between, center);
    display: flex;
    //justify-content: space-between;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -3rem;

    @media (min-width: 960px) {
      font-size: 1.5rem;
    }

    .name {
      margin-left: 0px;
    }

    div {
      display: inline-block;
      vertical-align: -8%;
      //@include flex(center, center);
      //display: flex;
      //justify-content: center;
      //align-items: center;
    }

    span {
      margin: 0;
      margin-left: 5px;
    }

    .position {
      $size: 1.2rem;
      width: $size;
      height: $size;
      border-radius: $size;
      background-color: #1DB196;
      margin-left: 13px;
    }

    img {
      position: relative;
      width: 19px;
      height: auto;
      margin: 0;
      transform: translateX(0%);
    }

    &--avarage {
      &:before {
        content: "";
        display: inline-block;
        width: 3rem;
        height: 1rem;
        margin-right: .5rem;
        background: url("/img/img_biolet_line.svg") no-repeat left;
      }
    }
  }
}

.violin {
  /* width: 104px;
  height: auto; */
  /* height: 138px; */
  height: 100%;
  width: auto;
  object-fit: contain;
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;

  .my-point-score {
    position: absolute;
    color: #1DB196;
    font-size: 17px;
    width: 100px;
    top: -47px;
    left: 18px;
    text-align: left;

    @media (min-width: 960px) {
      font-size: 2rem;
    }
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -17px);
    width: 24px !important;
    height: auto;
    right: 0;
    bottom: 0;
    z-index: 1;
    max-width: 2.4rem;
  }

  .my-point-pointer {
    z-index: 1;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
    height: 21.65px;
    width: 1px;
    /* background-color: #00b4de; */
    border-right: 1px dashed #00b4de;

    .point {
      position: absolute;

      /* right: -5.68px; */
      z-index: 100;
      transform: translate(-50%, 50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1.3px solid white;
      background-color: #1DB196;
      /* bottom: -5.68px; */
      bottom: 0;
    }
  }
}

.violin-avg {
  position: absolute;
  transform: translateY(-50%);
  //width: 90px;
  height: auto;
}
.my-rank{
  padding: 0 2px;
  background: white;
  border-radius: 5px;
  z-index: 1;
  position: relative;
}
</style>
