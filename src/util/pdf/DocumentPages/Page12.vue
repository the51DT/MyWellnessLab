<template>
  <div id="page" class="custom-page a4" :class="props.save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="10"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-position-gray.png" />

          <h3 class="stretch-text">나의 건강 위치</h3>
          <span class="stretch-text">
            노화 억제 분석 지수와 만성질환 억제 분석 지수를 기반으로 이차원 상
            표현된 나의 건강 위치를 확인해 보세요.
          </span>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [한국 성인 표본 집단 분포 내 나의 건강 위치]
          </h3>
          <div class="legend-container">
            <span class="legend"></span
            ><span class="stretch-text">{{ props.userInfo.name }}님</span>
          </div>
        </div>
        <div class="data">
          <!-- 나의 건강 위치 그래프 -->
          <BubbleChartDocumentLarge
            :showPoint="true"
            :myValue="props.value"
            :chartData="props.health.resultDto.comDataList"
          />
        </div>
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ props.userInfo.name }}님의 건강상태는 파란 아이콘으로 표현되어
          있습니다.<br />
          노화 억제 분석 지수는 {{ props.value.Oxi }}점이고, 만성질환 억제 분석 지수는
          {{ props.value.Met }}점으로
          {{
            // 노화 65 만성질환 72
            props.value.Oxi > 65 && props.value.Met > 72
              ? "초록색"
              : props.value.Oxi <= 65 && props.value.Met <= 72
              ? "빨강색"
              : "노랑색"
          }}영역에 위치합니다.<br />한국 성인 표본 집단과 비교하여
          {{ props.userInfo.name }}님의 건강 상태는
          {{
            // 노화 65 만성질환 72
            props.value.Oxi > 65 && props.value.Met > 72
              ? "건강한"
              : props.value.Oxi <= 65 && props.value.Met <= 72
              ? "위험한"
              : "보통"
          }}
          수준으로 판정됩니다.
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다. 노화 억제 분석 지수와 만성질환 억제 분석 지수는
        건강 검진 결과, 생활 습관 등 다양한 요소 간의 상관관계를 종합적으로
        고려하여 산출됩니다. 따라서, 입력한 결과가 정상 범위 내에 있더라도, 다른
        건강한 사람과 비교하여 나의 건강 위험도가 높을 수 있습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "./PageHeader.vue";
import BubbleChartDocumentLarge from "./com/BubbleChartDocumentLarge.vue";

const props = defineProps({
  save: Boolean,
    userInfo: null,
    comph: null,
    hcr: null,
    value: null,
    health: null,
    report_no: null,
    pdfScale: null,
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  margin-top: calc(18.55px * $pdf-scale);
  margin-bottom: calc(19.1px * $pdf-scale);
  height: calc(210.3px * $pdf-scale);

  .title {
    width: 100%; //calc(calc(382.68px - 41px) * $pdf-scale);
  }

  ul {
    font-size: calc(12px * $pdf-scale);
    padding-left: calc((16.51px + 89.9px) * $pdf-scale);
    li {
      list-style-type: disc;
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
    }
  }

  img {
    width: calc(51.08px * $pdf-scale);
    height: calc(51.08px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-top: calc(10.68px * $pdf-scale);
    font-size: calc(30px * $pdf-scale);
    color: #008352;
  }

  span {
    display: inline-block;
    margin-top: calc(37.82px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    padding-right: calc(25.97px * $pdf-scale);
    line-height: 150%;
  }

  .score-container {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
  }
}

.data-container {
  width: 100%;
  height: calc(363.06px * $pdf-scale);
  background-color: white;

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */

  .subject {
    display: flex;
    justify-content: space-between;
    padding-top: calc(12.39px * $pdf-scale);
    /* padding-left: calc(13.21px * $pdf-scale); */
    /* padding-right: calc(10.35px * $pdf-scale); */

    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: bold;
    }
    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }

    .legend-container {
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .legend {
      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #00b4de;
      margin-right: calc(2.83px * $pdf-scale);
      font-size: calc(6.402px * $pdf-scale);
      color: #727171;
      font-weight: 400;
    }
  }
}

.score-div {
  position: absolute;
  width: calc(77.55px * $pdf-scale);
  height: calc(77.55px * $pdf-scale);
  right: calc(0px * $pdf-scale);
  top: calc(16.52px * $pdf-scale);
}

.data {
  width: 100%;
  height: 100%;
  //@include flex(flex-start, center);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: calc(75px * $pdf-scale);
}
.bottom-info {
  margin-top: calc(5.5px * $pdf-scale);

  position: static;
}
</style>
