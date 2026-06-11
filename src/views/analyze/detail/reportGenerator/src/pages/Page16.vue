<script setup>
import { computed } from 'vue'
import PageHeader from '../PageHeader.vue'
import GuageChart2 from '../GuageChart2.vue'
import ResultSecondDocumentLarge from '../ResultSecondDocumentLarge.vue'

const props = defineProps({
  health: null,
  eatingHabit: null,
  save: Boolean,
  userInfo: null,
  value: null,
  pdfScale: null
})

const description = computed(() => {
  return props.eatingHabit.resultDto.myHQ.ReAge_MSG.replaceAll('@@@', props.userInfo.name)
})
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="14" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-aging-rate.png" />

          <h3 class="stretch-text">{{ $t('Page16.text1') }}</h3>
          <span class="stretch-text">
            {{ $t('Page16.text2') }}
          </span>
        </div>
        <div class="vertical-line" />
        <div class="score-container">
          <span class="stretch-text">[{{ $t('Page16.text1') }}]</span>
          <div class="speed-container">
            <!-- 노화 속도 배속 게이지 -->
            <GuageChart2
              :value="eatingHabit.resultDto.myHQ.AgingRate"
              :pdfScale="pdfScale"
              :showScore="true" />
          </div>
        </div>
      </div>
      <div class="data-container">
        <div class="legend">
          <div class="avg" />
          <div class="stretch-text">{{ $t('Page16.text4') }}</div>
          <div class="legend-icon" />
          <div class="stretch-text">{{ userInfo.name }}{{ $t('Common.name') }}</div>
        </div>
        <div class="subject">
          <h3 class="stretch-text">
            [{{ $t('Page16.text5') }}]
          </h3>
        </div>
        <!-- 노화속도 그래프 -->
        <ResultSecondDocumentLarge
          :data="health"
          :eatingHabit="eatingHabit"
          :userInfo="userInfo"
          :pdfScale="pdfScale" />
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ description }}
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        *{{ $t('Page16.text6') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

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
    margin-top: calc(10.68px * $pdf-scale);
    font-size: calc(30px * $pdf-scale);
    color: #008352;
  }

  span {
    display: inline-block;
    margin-top: calc(10.13px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    padding-right: calc(17.57px * $pdf-scale);
    line-height: 155%;
  }

  .score-container {
    width: 100%;
    height: 100%;
    flex: 1;

    span {
      font-weight: bold;
      font-size: calc(10px * $pdf-scale);
      margin-top: calc(27px * $pdf-scale);
      padding-left: calc(18.69px * $pdf-scale);
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
    display: flex;
    justify-content: space-between;
    /* padding-top: calc(12.39px * $pdf-scale); */
    /* padding-left: calc(13.21px * $pdf-scale); */
    padding-right: calc(10.35px * $pdf-scale);

    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: bold;
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
  margin-top: calc(26px * $pdf-scale);
  /* margin-bottom: calc(11px * $pdf-scale); */
  color: #727171;
  @include flex(flex-end, center);
  font-size: calc(6.5px * $pdf-scale);
  .avg {
    border-bottom: calc(1px * $pdf-scale) dashed #127f50;
    width: calc(8px * $pdf-scale);
    margin-right: calc(3px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(17px * $pdf-scale);
    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }
}

.desc {
  color: #585859;
  font-size: calc(10px * $pdf-scale);
}
</style>
