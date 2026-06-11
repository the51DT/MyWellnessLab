<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="22"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-solution.png" />
          <h3 class="stretch-text">나의 건강 신호등</h3>
        </div>
        <span class="stretch-text"
          >나의 건강 신호등은 나의 건강점수, 빅데이터 기반 한국 성인 평균값과
          분포를 기준으로 판정되는 건강 위험 요인과 과학적 근거에 따라 연결되어
          있는 잠재적 위험 요인, 그리고 생활습관 설문 결과 등을 기반으로
          도출됩니다. 인체 생리 네트워크에 기반해 내가 신경 써야 할 건강 분야와
          건강 관심 분야를 확인해 보세요.
        </span>
      </div>
      <div class="subject">
        <h3 class="stretch-text">[나의 건강 신호등]</h3>
      </div>
      <div class="data-container">
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">위험</span>
          <div class="legend2"></div>
          <span class="stretch-text">주의</span>
          <div class="legend4"></div>
          <span class="stretch-text">관심</span>
        </div>
        <div class="chart">
          <!-- 네트워크 그래프 -->
          <GraphChartDocument
            :pdfScale="pdfScale"
            :comph="comph"
            :recommendDataProps="recommendData"
            :userInfo="userInfo"
            :loadingFinished="loadingFinished"
            :report_no="report_no"
          />
        </div>
      </div>

      <div class="bottom-info">
        * 인체 생리 네트워크는 식품의약품안전처 건강기능식품 평가 가이드,
        한국식품연구원 건강기능식품 플랫폼, 세계적으로 공인된 설문지 등의
        과학적인 근거 자료를 바탕으로 설계되었습니다. 이 중 11가지
        건강분야(기억력 개선, 눈 건강, 코 과민 반응, 위 건강, 장 건강, 관절/뼈
        건강, 면역 기능, 과민피부상태 개선, 피로개선, 갱년기 여성건강, 전립선
        건강)는 자가진단 설문을 바탕으로 개인의 주관에 따라 판정됩니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "./PageHeader.vue";
import GraphChartDocument from "./com/graphChartDocument.vue";

const props = defineProps({
  save: Boolean,
    userInfo: null,
    comph: null,
    recommendData: null,
    hcr: null,
    report_no: null,
    pdfScale: Number,
    loadingFinished: null,
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.page-inside {
  padding-bottom: 0px !important;
}
.title-container {
  padding-top: calc(21.98px * $pdf-scale);
  height: calc(141.98px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(12px * $pdf-scale);
    padding-left: calc(53.35px * $pdf-scale);
    letter-spacing: -0.03em;
    line-height: 155%;
    font-weight: 300;
  }

  img {
    width: calc(42.9px * $pdf-scale);
    height: calc(42.9px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #00a856;
    font-weight: 500;
  }
}

.data-container {
  position: relative;
  width: 100%;
  height: calc(561.55px * $pdf-scale);
  margin-top: calc(6.81px * $pdf-scale);
  /* margin-bottom: calc(22.58px * $pdf-scale); */
  border: calc(0.5px * $pdf-scale) solid #000000;

  .chart {
    width: 100%;
    height: 100%;
  }
}

.desc {
  width: 100%;
  height: calc(66px * $pdf-scale);
  background-color: #e9f4f0;
  font-size: calc(10.923px * $pdf-scale);
  padding: calc(12.88px * $pdf-scale) calc(17.07px * $pdf-scale);
}
.subject {
  display: flex;
  justify-content: space-between;
  /* padding-top: calc(12.39px * $pdf-scale); */
  padding-right: calc(10.35px * $pdf-scale);
  /* margin-bottom: calc(6.81px * $pdf-scale); */

  h3 {
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
  }
}

.legend-container {
  @include flex(center, center);
  position: absolute;
  bottom: calc(8.71px * $pdf-scale);
  right: calc(12.66px * $pdf-scale);

  div {
    display: inline-block;

    margin-left: calc(9.89px * $pdf-scale);

    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
  }
  .legend1 {
    background-color: #ec7497;
  }
  .legend2 {
    background-color: #f8b500;
  }
  .legend3 {
    background-color: #008352;
  }
  .legend4 {
    background-color: #00afec;
  }

  h3 {
    font-size: calc(12px * $pdf-scale);
  }
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
    color: #727171;
  }
}
.bottom-info {
  position: static;
  margin-top: calc(8px * $pdf-scale);
}
</style>
