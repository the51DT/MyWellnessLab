<script setup>
import { onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import GraphChartDocument from "./com/graphChartDocument.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthNetworkData: null,
  pdfScale: Number,
  loadingFinished: null,
  page: Number
});
onMounted(() => {
  emit('mounted');

  props.healthNetworkData.cluster_left_list.forEach(element => {
    if(element.drug_code.length > 0) {
      element.drug_code.forEach(code => {
        if(props.healthNetworkData.drug[code] === 1) {
          element.hasMedication = true;
        }
      });
    }
  });

  props.healthNetworkData.cluster_right_list.forEach(element => {
    if(element.drug_code.length > 0) {
      element.drug_code.forEach(code => {
        if(props.healthNetworkData.drug[code] === 1) {
          element.hasMedication = true;
        }
      });
    }
  });

  const clusterSumData = [
    ...props.healthNetworkData.cluster_left_list,
    ...props.healthNetworkData.cluster_right_list,
  ]

  // clusterSumData에서 hasMedication이 true인 항목의 name 리스트 추출 (중복 제거)
  const medicationNames = Array.from(
    new Set(
      clusterSumData
        .filter(item => item.hasMedication)
        .map(item => item.name)
    )
  );

  if(medicationNames.length > 0) {
    props.healthNetworkData.drug_msg = `현재 ${ medicationNames.join(', ') }과 관련된 의약품을 복용하고 있으므로, 해당 건강 지표가 실제 상태를 충분히 반영하지 않을 수 있습니다. 결과를 해석할 때 이점을 고려해 주세요.`;
  }
})
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-solution.png" />
          <h3 class="stretch-text">나의 인체 생리 네트워크</h3>
        </div>
        <span class="stretch-text">
          나의 인체 생리 네트워크는 나의 건강 점수, 빅데이터 기반 한국 성인 평균값과 분포를 기준으로 판정되는 건강 위험 요인과 과학적 근거에 따라 연결되어 있는 잠재적 위험 요인, 그리고 생활 습관 설문
          결과 등을 기반으로 도출됩니다. 인체 생리 네트워크에 기반해 내가 신경 써야 할 건강 분야와 건강 관심 분야를 확인해 보세요.
        </span>
      </div>
      <div class="subject">
        <h3 class="stretch-text">[나의 인체 생리 네트워크]</h3>
      </div>
      <div class="data-container">
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">주의</span>
          <div class="legend2"></div>
          <span class="stretch-text">관리</span>
          <div class="legend4"></div>
          <span class="stretch-text">관심</span>
          <div class="legend-medic"></div>
          <span class="stretch-text">복약</span>
        </div>
        <p class="stretch-text chart-desc">{{ props.healthNetworkData.drug_msg }}</p>
        <div class="chart">

          <!-- 네트워크 그래프 -->
          <GraphChartDocument :pdfScale="props.pdfScale" :healthNetworkData="props.healthNetworkData"
            :userInfo="userInfo" :loadingFinished="loadingFinished" :report_no="report_no" />
        </div>
      </div>

      <div class="bottom-info">
        *본 건강 신호등은 식품의약품안전처 건강기능식품 평가 가이드, 한국식품연구원 건강기능식품 플랫폼, 세계적으로 공인된 설문지 등의 과학적인 근거 자료를 바탕으로 설계되었습니다. 이 중 11가지
        건강분야(기억력 개선, 눈 건강, 코 과민 반응, 위 건강, 장 건강, 관절/뼈 건강, 면역 기능, 과민피부상태 개선, 피로개선, 갱년기 여성 건강, 전립선 건강)는 자가진단 설문을 바탕으로 개인의
        주관에 따라 판정됩니다. 근육 밸런스 분석 지수, 체지방률, 체중 대비 팔다리 근육률은 체성분 지표를 입력해야지만 반영된 결과를 정확히 확인할 수 있습니다.

        근육 밸런스 분석 지수, 체지방률, 체중 대비 팔다리 근육률은 체성분 지표를 입력하여야 반영된 결과를 정확히 확인할 수 있습니다.
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.page-inside {
  padding-bottom: 0px !important;
}

.title-container {
  padding-top: calc(10px * $pdf-scale);
  height: calc(125px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(11px * $pdf-scale);
    padding-top: calc(6px * $pdf-scale);
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
    color: #008452;
    font-weight: $medium;
  }
}

.data-container {
  position: relative;
  width: 100%;
  height: calc(580px * $pdf-scale);
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
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
  }
}

.legend-container {
  @include flex(center, center);
  position: absolute;
  top: calc(8.71px * $pdf-scale);
  right: calc(12.66px * $pdf-scale);

  div {
    display: inline-block;

    margin-left: calc(9.89px * $pdf-scale);

    margin-right: calc(2.75px * $pdf-scale);

    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
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

  .legend-medic {
    background: url("/img/ic_medic_grey.svg") no-repeat center center;
    background-size: 28px;
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

.chart-desc {
  position: absolute;
  top: calc(23px * $pdf-scale);
  font-size: calc(8px * $pdf-scale);
  padding: calc(0px * $pdf-scale) calc(8px * $pdf-scale);
  font-weight: 300;
  color: #000000;

}

.bottom-info {
  position: static;
  margin-top: calc(5px * $pdf-scale);
}
</style>