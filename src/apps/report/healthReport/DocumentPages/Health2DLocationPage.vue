<script setup>
import PageHeader from "./PageHeader.vue";
import { onMounted } from "vue";
import Bubble2DChartDocumentLarge from "./com/Bubble2DChartDocumentLarge.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthScoreData: null,
  pdfScale: null,
  page: Number
});
onMounted(() => {
  emit('mounted')
})
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-position-gray.png" />

          <h3 class="stretch-text">나의 건강 위치</h3>
          <span class="stretch-text">
            노화 억제 분석 지수와 만성질환 억제 분석 지수를 기반으로 2차원 그래프에 표현한 나의 건강 위치를 확인해보세요.
          </span>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [한국 성인 표본집단 분포 내 나의 건강 위치]
          </h3>
          <div class="legend-container">
            <span class="legend1"></span><span class="stretch-text">주의</span>
            <span class="legend2"></span><span class="stretch-text">보통</span>
            <span class="legend3"></span><span class="stretch-text">좋음</span>
            <span class="legend4"></span><span class="stretch-text">{{ props.userInfo.user_name }}님</span>
          </div>
        </div>
        <div class="data">
          <!-- 나의 건강 위치 그래프 -->
          <Bubble2DChartDocumentLarge :save="props.save" :pdfScale="props.pdfScale"
            :health-score-data="props.healthScoreData" :user-info="props.userInfo" />
        </div>
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ props.userInfo.user_name }}님의 건강상태는 파란색 아이콘으로 표시되어 있습니다.<br />
          노화 억제 분석 지수는 {{ props.healthScoreData.hq_oxi.score }}점,
          만성질환 억제 분석 지수는 {{ props.healthScoreData.hq_met.score }}점을 종합하면 건강 위치가
          {{ props.healthScoreData.health_status_color }} 영역에 위치합니다.<br />
          한국 성인 표본 집단과 비교했을 때 {{ props.userInfo.user_name }}님의 건강 상태는 {{ props.healthScoreData.health_status_msg }} 수준으로
          판정됩니다.
          <br /><br />
          <p> * 체성분 데이터 입력 시 ‘근육 밸런스 분석 지수’ 를 확인 할 수 있습니다. </p>
        </span>
      </div>
      <hr />
      <div class="bottom-info">
       *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다. 노화 억제 분석 지수와 만성질환 억제 분석 지수는 건강검진 결과, 생활 습관 등 다양한 요소 간의 상관관계를 종합적으로 고려하여 산출됩니다. 따라서, 입력한 결과가 정상 범위 내에 있더라도, 다른 건강한 사람과 비교하여 나의 건강 위험도가 높을 수 있습니다.
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";


.title-container {
  @include flex(flex-start, flex-start);

  margin-top: calc(18.55px * $pdf-scale);
  margin-bottom: calc(19.1px * $pdf-scale);
  height: calc(220px * $pdf-scale);

  .title {
    width: 100%; //calc(calc(382.68px - 41px) * $pdf-scale);
  }

  img {
    width: calc(51.08px * $pdf-scale);
    height: calc(51.08px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-top: calc(10.68px * $pdf-scale);
    font-size: calc(30px * $pdf-scale);
    color: #008452;
    font-weight: $medium;
    text-align: left;
  }

  span {
    display: inline-block;
    margin-top: calc(30px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    line-height: 150%;
  }
}

.data-container {
  width: 100%;
  height: calc(344.06px * $pdf-scale);
  background-color: white;
  border-top: calc(0.3px * $pdf-scale) solid #000000;

  .subject {
    display: flex;
    justify-content: space-between;
    padding-top: calc(12.39px * $pdf-scale);

    h3 {
      font-size: calc(10px * $pdf-scale);
      font-weight: 500;
    }

    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }

    .legend-container {
      @include flex(center, center);
    }

    .legend1 {
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      background-color: #E95371;
      margin-right: calc(2.83px * $pdf-scale);
      font-size: calc(6.402px * $pdf-scale);
      color: #727171;
      font-weight: 400;
    }

    .legend2 {
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      background-color: #F8B500;
      margin-left: calc(8px * $pdf-scale);
      margin-right: calc(2.83px * $pdf-scale);
      font-size: calc(6.402px * $pdf-scale);
      color: #727171;
      font-weight: 400;
    }

    .legend3 {
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      background-color: #5AB651;
      margin-left: calc(8px * $pdf-scale);
      margin-right: calc(2.83px * $pdf-scale);
      font-size: calc(6.402px * $pdf-scale);
      color: #727171;
      font-weight: 400;
    }

    .legend4 {
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      background-color: #00B4DE;
      margin-left: calc(8px * $pdf-scale);
      margin-right: calc(2.83px * $pdf-scale);
      font-size: calc(6.402px * $pdf-scale);
      color: #727171;
      font-weight: 400;
    }
  }
}

.data {
  width: 100%;
  height: 100%;
  @include flex(flex-start, center);
  // padding-left: calc(75px * $pdf-scale);
}

.bottom-info {
  margin-top: calc(5.5px * $pdf-scale);
  position: static;
}

.desc {
  font-size: calc(10px * $pdf-scale);
  height: calc(120px * $pdf-scale);

  p {
    font-weight: 500;
  }
}
</style>