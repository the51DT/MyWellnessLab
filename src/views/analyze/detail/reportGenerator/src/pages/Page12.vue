<script setup>
import { computed } from 'vue'
import PageHeader from '../PageHeader.vue'
import BubbleChartDocumentLarge from '../BubbleChartDocumentLarge.vue'

const props = defineProps({
  save: Boolean,
  userInfo: null,
  value: null,
  health: null,
  pdfScale: null
})

const colorText = computed(() => {
  const healthStatus = props.health.resultDto.myHQ.Health_Status

  if (healthStatus === 1) {
    return '초록색'
  } else if (healthStatus === 2) {
    return '노란색'
  } else if (healthStatus === 3) {
    return '빨강색'
  }

  return ''
})

const healthStatusText = computed(() => {
  const healthStatus = props.health.resultDto.myHQ.Health_Status

  if (healthStatus === 1) {
    return '건강한'
  } else if (healthStatus === 2) {
    return '보통'
  } else if (healthStatus === 3) {
    return '위험한'
  }

  return ''
})
</script>

<template>
  <div id="page" class="custom-page a4" :class="props.save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="10" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-position-gray.png" />

          <h3 class="stretch-text">{{ $t('Page12.text1') }}</h3>
          <span class="stretch-text">
            {{ $t('Page12.text2') }}
          </span>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [{{ $t('Page12.text3') }}]
          </h3>
          <div class="legend-container">
            <span class="legend" /><span class="stretch-text">{{ props.userInfo.name }}{{ $t('Common.name') }}</span>
          </div>
        </div>
        <div class="data">
          <!-- 나의 건강 위치 그래프 -->
          <BubbleChartDocumentLarge
            :showPoint="true"
            :myValue="props.value" />
        </div>
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ $t('Page12.text5', { name: props.userInfo.name }) }}<br />
          {{ $t('Page12.text6', { 
            oxi: props.value.Oxi, 
            met: props.value.Met, 
            colorText: colorText 
          }) }}<br />
          {{ $t('Page12.text7', { 
            name: props.userInfo.name, 
            healthStatusText: healthStatusText 
          }) }}
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        {{ $t('Page12.text8') }}
      </div>
    </div>
  </div>
</template>

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
