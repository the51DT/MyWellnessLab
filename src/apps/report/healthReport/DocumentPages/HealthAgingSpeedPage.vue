<script setup>
import { onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import GuageChart2 from "./com/GuageChart2.vue";
import ResultSecondDocumentLarge from "./com/ResultSecondDocumentLarge.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  healthScoreData: null,
  save: Boolean,
  userInfo: null,
  pdfScale: null,
  page: Number,
  check_date: String,
  pdfScale: Number
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
          <img src="@/assets/images/pdf/res/img-aging-rate.png" />

          <h3 class="stretch-text">나의 노화 속도</h3>
          <span class="stretch-text">
            노화 속도는 생물학적 나이인 건강 나이와 실제 나이를 비교해 계산한 값입니다.<br />
            이 둘이 같으면 노화속도는 1.0이며, 이보다 낮을수록 건강하게 나이 들고 있다는 의미입니다. <br />
            예를 들어, 0.9 이하일 경우 건강 나이가 실제 나이보다 젊은 상태로 이상적인 건강 노화 상태로 볼 수 있습니다.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <span class="stretch-text">[나의 노화 속도]</span>
          <div class="speed-container">
            <!-- 노화 속도 배속 게이지 -->
            <GuageChart2 :value="props.healthScoreData.hq_ar.aging_rate" :pdfScale="props.pdfScale" :showScore="true">
            </GuageChart2>
          </div>
        </div>
      </div>
      <div class="data-container">

        <div class="subject">
          <h3 class="stretch-text">
            [한국 성인 표본집단의 노화 속도와 나의 노화 속도]
          </h3>
          <div class="legend">
            <span class="legend1"></span><span class="stretch-text">고속 노화</span>
            <span class="legend2"></span><span class="stretch-text">보통 노화</span>
            <span class="legend3"></span><span class="stretch-text">저속 노화</span>
            <div class="avg-line"></div>
            <span>보통 노화 속도</span>
            <div class="legend-icon"></div>
            <div class="stretch-text">{{ props.userInfo.user_name }}님</div>
          </div>
        </div>
        <!-- 노화속도 그래프 -->
        <ResultSecondDocumentLarge :health-score-data="props.healthScoreData" :check_date="props.check_date"
          :userInfo="props.userInfo" :pdfScale="props.pdfScale" />
      </div>
      <div class="desc">
        {{ props.healthScoreData.hq_reage.msg }}
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다.
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

  margin-top: calc(18.55px * $pdf-scale);
  margin-bottom: calc(19.1px * $pdf-scale);
  height: calc(210.3px * $pdf-scale);


  .title {
    width: calc(calc(382.68px - 41px) * $pdf-scale);
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
    margin-top: calc(8px * $pdf-scale);
    font-size: calc(30px * $pdf-scale);
    color: #008452;
    font-weight: $medium;
    text-align: left;
  }

  span {
    display: inline-block;
    margin-top: calc(10.13px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    padding-right: calc(8px * $pdf-scale);
    line-height: 155%;
  }

  .score-container {
    width: 100%;
    height: 100%;
    flex: 1;
    text-align: center;

    span {
      font-weight: 500;
      font-size: calc(10px * $pdf-scale);
      margin-top: calc(10px * $pdf-scale);
      padding: 0;
      // padding-left: calc(18.69px * $pdf-scale);
    }
  }
}

.data-container {
  width: 100%;
  height: calc(363.06px * $pdf-scale);
  background-color: white;

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */

  .subject {
    left: 0;
    @include flex(space-between, center);
    padding-right: calc(10.35px * $pdf-scale);
    margin-top: calc(23px * $pdf-scale);

    h3 {
      font-size: calc(10px * $pdf-scale);
      font-weight: 500;
    }

    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }
  }
}

.speed-container {
  position: relative;
  flex: 1;
  height: 100%;

  .text {
    position: absolute;
    font-weight: 400;
    top: calc(27.28px * $pdf-scale);
    left: calc(221.33px * $pdf-scale);
    font-size: calc(8px * $pdf-scale);
  }
}

.legend {
  /* margin-bottom: calc(11px * $pdf-scale); */
  color: #727171;
  @include flex(flex-end, center);
  font-size: calc(6.5px * $pdf-scale);

  .avg {
    margin-left: calc(8px * $pdf-scale);
    border-bottom: calc(1px * $pdf-scale) dashed #127f50;
    width: calc(8px * $pdf-scale);
    margin-right: calc(3px * $pdf-scale);
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

  .avg-line {
    border: 1px dashed #127f50;
    width: calc(7px * $pdf-scale);
    margin-left: calc(8px * $pdf-scale);
    margin-right: calc(2.83px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(8px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }
}

.desc {
  white-space: pre-line;
  font-size: calc(10px * $pdf-scale);
  font-weight: 300;
}
</style>