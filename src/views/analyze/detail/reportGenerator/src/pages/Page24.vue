<script setup>
import PageHeader from '../PageHeader.vue'
import GraphChartDocument from '../graphChartDocument.vue'

const props = defineProps({
  save: Boolean,
  userInfo: null,
  recommendData: null,
  pdfScale: Number
})
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="22" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-solution.png" />
          <h3 class="stretch-text">{{ $t('Page24.text1') }}</h3>
        </div>
        <span class="stretch-text">{{ $t('Page24.text2') }}
        </span>
      </div>
      <div class="subject">
        <h3 class="stretch-text">{{ $t('Page24.text3') }}</h3>
      </div>
      <div class="data-container">
        <div class="legend-container">
          <div class="legend1" />
          <span class="stretch-text">{{ $t('Common.warning') }}</span>
          <div class="legend2" />
          <span class="stretch-text">{{ $t('Common.manage') }}</span>
          <div class="legend4" />
          <span class="stretch-text">{{ $t('Common.attention') }}</span>
        </div>
        <div class="chart">
          <!-- 네트워크 그래프 -->
          <GraphChartDocument
            :pdfScale="pdfScale"
            :recommendDataProps="recommendData"
            :userInfo="userInfo" />
        </div>
      </div>

      <div class="bottom-info">
        {{ $t('Page24.text7') }}
      </div>
    </div>
  </div>
</template>

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
    color: $tit-color;
  }
}

.data-container {
  position: relative;
  width: 99.8%;
  height: calc(561.55px * $pdf-scale);
  margin-top: calc(6.81px * $pdf-scale);
  /* margin-bottom: calc(22.58px * $pdf-scale); */
  border: calc(0.5px * $pdf-scale) solid #000000;
  border-width: calc(0.5px * $pdf-scale);

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
