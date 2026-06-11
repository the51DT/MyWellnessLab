<script setup>
import { onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import ResultRadarChartDocument from "./com/ResultRadarChartDocument.vue";
import DimComponent from "@/components/dim/DimComponent.vue";
import { ageToAgeGroup } from '@/utils/common.js'

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  page: Number,
  save: Boolean,
  userInfo: null,
  healthScoreData: null,
  pdfScale: Number,
  loadingFinished: null,
  page: Number
});
onMounted(() => {
  emit('mounted')
})
</script>
<template>
  <div class="custom-page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title-box">
          <div class="title">
            <img src="@/assets/images/pdf/res/img-muscle.png" />
            <h3 class="stretch-text">나의 체성분</h3>
          </div>
          <span class="stretch-text">
            체성분 검사 결과를 바탕으로 몸의 부위별 근육량과 체지방률, 체지방량을 확인할 수 있습니다. 근육이 부족한 부위가 있는지 체크해 보세요.
            근육량은 일상생활의 움직임과 몸 전체의 건강을 유지하는데 중요한 요소입니다.
          </span>
        </div>
        <!--<div class="vertical-line"></div>
         <div class="score-container">
          <span class="stretch-text">[나의 근육량 판정]</span>
          <div class="score">
            <div class="score-top stretch-text">
              -
            </div>
            <div class="score-bottom stretch-text">
              {{ ageToAgeGroup(props.healthScoreData.hqReference.age) }}대
              {{ props.userInfo.user_gender == 1 ? '남성' : '여성' }} <br />
              100명 중 ?등
            </div>
          </div>
        </div> -->
      </div>
      <div class="data-desc-container">
        <DimComponent :html-text="'체성분 데이터 입력 시 <br/>나의 체성분과 판정 결과를<br/>확인할 수 있습니다.'" 
        :padding-flag="false" />
        <div class="data-container">
          <div class="subject">
            <h3 class="stretch-text">
              [나의 부위별 근육량 판정]
            </h3>
            <div class="legend">
              <div class="legend-icon"></div>
              <div class="stretch-text">기준</div>
              <div class="avg"></div>
              <div class="stretch-text">{{ props.userInfo.user_name }}님</div>
            </div>
          </div>
          <div class="data-box">
            <div class="legend">
              <div class="legend-icon">
                <img src="@/assets/images/pdf/res/icon-check.png">
              </div>
              <div class="stretch-text">관리 필요</div>
            </div>

            <div class="chart-container">
              <ResultRadarChartDocument :data="props.healthScoreData" :right="false" :hideScore="false"
                :loadingFinished="props.loadingFinished" />
            </div>
            <div class="right">
              <div class="table-container first">
                <div class="content-head first">
                  <span class="stretch-text"> 근육량 </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 판정 </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 근육률(%) </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 근육량(kg) </span>
                </div>

                <template v-for="(item, index) in props.healthScoreData.bodypartData" :key="index">
                  <div class="content-title">
                    <div class="check-box">
                      <img v-if="item.status == 3" class="check" src="@/assets/images/pdf/res/tracking-check.png">
                    </div>
                    <span :class="item.status == 3 ? 'stretch-text danger' : 'stretch-text'">{{ item.name }}</span>
                  </div>
                  <div class="content">
                    <span :class="item.status == 3 ? 'stretch-text danger' : 'stretch-text normal'">{{ item.status == 3
                      ?
                      '부족' : '충족' }}</span>
                  </div>
                  <div class="content">
                    <span :class="item.status == 3 ? 'stretch-text danger' : 'stretch-text'">{{ item.percent }}</span>
                  </div>
                  <div class="content">
                    <span :class="item.status == 3 ? 'stretch-text danger' : 'stretch-text'">{{ item.value }}</span>
                  </div>
                </template>
                <div class="content-head first">
                  <span class="stretch-text"> 종합 판정 </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> - </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> {{ ageToAgeGroup(props.healthScoreData.hqReference.age) }}대
                    {{ props.userInfo.user_gender == 1 ? '남성' : '여성' }} </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 100명 중 ?등 </span>
                </div>
              </div>
              <div class="table-container second">
                <div class="content-head first">
                  <span class="stretch-text"> 체지방 </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 판정 </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 체지방률(%) </span>
                </div>
                <div class="content-head">
                  <span class="stretch-text"> 체지방량(kg) </span>
                </div>
                <div class="content-title">
                  <div class="check-box">
                    <img v-if="props.healthScoreData.hq_musMass.fatData.bf_status == 3" class="check"
                      src="@/assets/images/pdf/res/tracking-check.png">
                  </div>
                  <span
                    :class="props.healthScoreData.hq_musMass.fatData.bf_status == 3 ? 'stretch-text danger' : 'stretch-text'">체지방률</span>
                </div>
                <div class="content">
                  <span
                    :class="props.healthScoreData.hq_musMass.fatData.bf_status == 3 ? 'stretch-text danger' : 'stretch-text normal'">
                    {{ props.healthScoreData.hq_musMass.fatData.bf_status == 3
                      ? '높음'
                      : props.healthScoreData.hq_musMass.fatData.bf_status == 2
                        ? '다소 높음'
                        : '표준' }}
                  </span>
                </div>
                <div class="content">
                  <span
                    :class="props.healthScoreData.hq_musMass.fatData.bf_status == 3 ? 'stretch-text danger' : 'stretch-text'">{{
                      props.healthScoreData.hq_musMass.fatData.bf_percent }}</span>
                </div>
                <div class="content">
                  <span
                    :class="props.healthScoreData.hq_musMass.fatData.bf_status == 3 ? 'stretch-text danger' : 'stretch-text'">{{
                      props.healthScoreData.hq_musMass.fatData.bf }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
        <div class="desc">
          <span class="stretch-text">
            <!-- {{ props.healthScoreData.hq_musMass.msgData.msg_common }}<br>
          <p class="bold">(1) 근육 밸런스 지수에 영향</p>
          {{ props.healthScoreData.hq_musMass.msgData.msg_1 }}<br>
          <p class="bold">(2) 만성질환 억제 분석 지수와 노화 억제 분석 지수에 영향</p>
          {{ props.healthScoreData.hq_musMass.msgData.msg_2 }}<br> -->
          </span>
        </div>

        <hr />
      </div>

      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문가와 상의하시기 바랍니다.
        나의 부위별 근육량 분포와 부위별 근육량 판정 및 부위별 근육량%(kg)은 체성분분석기의 측정 및 분석 내용을 따릅니다.
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  @include flex(flex-start, flex-start);
  padding-top: calc(15px * $pdf-scale);
  padding-bottom: calc(15px * $pdf-scale);
  height: calc(144px * $pdf-scale);

  .title-box {
    width: calc(calc(400px) * $pdf-scale);
    padding-right: calc(24px * $pdf-scale);
  }

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    padding-left: calc(53.35px * $pdf-scale);
    letter-spacing: -0.03em;
    line-height: 155%;
    font-weight: 300;
  }

  img {
    width: calc(42px * $pdf-scale);
    height: calc(42px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #00A856;
    font-weight: $medium;
  }

}

.data-box {
  padding-top: calc(20px * $pdf-scale);
  position: relative;
  @include flex(flex-start, flex-start);

  & .legend {
    position: absolute;
    right: calc(0px * $pdf-scale);
    top: calc(15px * $pdf-scale);
    @include flex(flex-end, baseline);
    // top: calc(9.76px * $pdf-scale);
    // right: calc(12.21px * $pdf-scale);
    /* margin-top: calc(26px * $pdf-scale); */
    /* margin-bottom: calc(11px * $pdf-scale); */
    width: calc(calc(128.32px - 41px) * $pdf-scale);
    color: #727171;

    font-size: calc(6.5px * $pdf-scale);

    & .avg {
      margin-left: calc(17px * $pdf-scale);
      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #92539d;
      margin-right: calc(2.83px * $pdf-scale);
    }

    & .my {
      margin-left: calc(17px * $pdf-scale);
      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #00b4de;
      margin-right: calc(2.83px * $pdf-scale);
    }

    & .legend-icon {
      margin-left: calc(17px * $pdf-scale);
      width: calc(6px * $pdf-scale);
      height: auto;
      /* background-color: #00b4de; */
      margin-right: calc(2.83px * $pdf-scale);
    }
  }
}

.data-container {
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  // border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  margin-bottom: calc(50px * $pdf-scale);

  .subject {
    @include flex(space-between, center);
    position: relative;

    padding-top: calc(10.2px * $pdf-scale);
    padding-left: calc(10.35px * $pdf-scale);
    // padding-right: calc(10.35px * $pdf-scale);
    padding-bottom: calc(10.2px * $pdf-scale);
    height: calc(40px * $pdf-scale);

    h3 {
      font-size: calc(10px * $pdf-scale);
      font-weight: 500;
    }

    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }

    & .legend {
      color: #727171;
      font-weight: 400;
      @include flex(flex-end, center);
      font-size: calc(6.5px * $pdf-scale);

      & .avg {
        border-bottom: calc(1px * $pdf-scale) solid #E95371;
        width: calc(8px * $pdf-scale);
        margin-right: calc(3px * $pdf-scale);
        margin-left: calc(3px * $pdf-scale);
      }

      & .legend-icon {
        margin-left: calc(17px * $pdf-scale);
        width: calc(7px * $pdf-scale);
        height: calc(7px * $pdf-scale);
        background-color: #ACDAA7;
        margin-right: calc(2.83px * $pdf-scale);
      }
    }
  }

}

.chart-container {
  position: relative;
  width: calc(calc(231px) * $pdf-scale);
  height: auto;
  // height: calc(322.28px * $pdf-scale);
  background-color: white;
  margin-top: calc(40px * $pdf-scale);

  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  @include flex(flex-start, flex-start);
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: calc(21.7px * $pdf-scale);
  padding-right: calc(31.7px * $pdf-scale);
  padding-top: calc(0px * $pdf-scale);
  // margin-top: calc(24.08px * $pdf-scale);
  // margin-bottom: calc(24.08px * $pdf-scale);
  gap: 0 !important;

  img {
    width: 100%;
    height: auto;
  }
}

.right {
  width: 100%;
}

.table-container {
  @include flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  margin-top: calc(10px * $pdf-scale);
  margin-bottom: calc(13px * $pdf-scale);
  // margin-left: calc(8px * $pdf-scale);

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;


  align-items: center;
  justify-items: center;
  color: #000000;

  &.first {
    grid-template-rows: repeat(7, calc(24px * $pdf-scale));
  }

  &.second {
    grid-template-rows: repeat(2, calc(24px * $pdf-scale));
  }

  .top {
    font-size: calc(10px * $pdf-scale);
    color: #727171;
  }

  .content-title {
    font-size: calc(10px * $pdf-scale);
    @include flex(start, center);
    text-align: left;
    width: 100%;
    height: 100%;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 300;
    padding-left: calc(10px * $pdf-scale);

    .normal {
      color: #5AB651;
      font-weight: 600;
    }

    .danger {
      color: #E95371;
      font-weight: 600;
    }

  }

  .check-box {
    position: relative;
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    border: calc(0.5px * $pdf-scale) solid #000;
    margin-right: calc(6px * $pdf-scale);

    .check {
      position: absolute;
      top: calc(-2px * $pdf-scale);
      left: calc(0px * $pdf-scale);
      width: calc(8px * $pdf-scale);
      height: calc(7px * $pdf-scale);
    }
  }

  .content-head {
    color: #000000;
    font-size: calc(11px * $pdf-scale);
    @include flex(center, center);
    text-align: center;
    width: 100%;
    height: 100%;
    border-top: calc(1px * $pdf-scale) solid #000000;
    font-weight: 600;
    background-color: #F1F1F1;
    padding: calc(0.5px * $pdf-scale) 0;
  }

  .last {
    font-weight: 600;
  }

  .content {
    padding: calc(2.5px * $pdf-scale) 0;
    font-size: calc(10px * $pdf-scale);
    @include flex(center, center);
    text-align: center;
    width: 100%;
    height: 100%;
    // border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    min-height: auto;

    .normal {
      color: #5AB651;
      font-weight: 600;
    }

    .danger {
      color: #E95371;
      font-weight: 600;
    }
  }

  .content-type {
    font-size: calc(18px * $pdf-scale);
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
  }

  .bold {
    font-weight: 600;
  }

  .bg {
    background-color: #eff7ef;
    color: #00a856;
  }

  .bt {
    border-top: calc(1px * $pdf-scale) solid #000000;
  }

  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

  .cell {
    grid-row: 2/4;
    background-color: #eff7ef;
    border-left: none;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
  }

  .row {
    border-left: none;
    grid-row: 4/17;
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 500;
  }

  .cell2 {
    grid-column: 1/3;
  }

  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

}

.data {
  width: 100%;
  height: 100%;
  @include flex(center, center);
  // padding-left: calc(75px * $pdf-scale);


  img {
    width: calc(276px * $pdf-scale);
    height: calc(267px * $pdf-scale);
  }
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  .my-point-score {
    position: absolute;
    color: #00b4de;
    font-size: calc(12px * $pdf-scale);
    width: calc(100px * $pdf-scale);
    top: calc(-40px * $pdf-scale);
    left: calc(8px * $pdf-scale);
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -220%);
    width: calc(12.46px * $pdf-scale) !important;
    height: auto;
    right: 0;
    top: 0;
    z-index: 1001;
  }

  .my-point-pointer {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
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


.desc {
  color: #585859;
  font-size: calc(10px * $pdf-scale);
  height: calc(220px * $pdf-scale);

  .bold {
    font-weight: 600;
  }
}
.bottom-info {
  bottom: calc(25px * $pdf-scale);
}
</style>
