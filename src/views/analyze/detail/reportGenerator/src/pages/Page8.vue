<script setup>
import PageHeader from '../PageHeader.vue'
import HistoryGraph from '../HistoryGraph.vue'
import { tracking_hcr } from '@/assets/js/chart/rstText'

import { onBeforeMount, ref } from 'vue'

const props = defineProps({
  save: Boolean,
  userInfo: null,
  hcr: null,
  pdfScale: Number,
  hidePrivacy: {
    type: Boolean,
    default: false
  }
})

const dataList = ref([])

onBeforeMount(() => {
  const list = props.hcr?.resultDto.examinationData || []

  dataList.value = list.reverse()
  // exec()
})
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="6" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-history.png" />
          <h3 class="stretch-text">{{ userInfo.name }}{{ $t('Page8.text1') }}</h3>
        </div>
        <span class="stretch-text">{{ $t('Page8.text2') }}
        </span>
      </div>
      <div class="data-container pdf">
        <div v-if="props.hidePrivacy" class="spin-wrap no-print">
          <div class="spin--con">
            <p class="spin--con--txt">{{ $t('Page8.text3') }}<br />{{ $t('Page8.text4') }}</p>
          </div>
        </div>
        <div class="legend-container">
          <div class="legend1" />
          <span class="stretch-text">{{ $t('Common.warning') }}</span>
          <div class="legend2" />
          <span class="stretch-text">{{ $t('Common.manage') }}</span>
          <div class="legend3" />
          <span class="stretch-text">{{ $t('Common.attention') }}</span>
        </div>
        <!-- 항목별 그래프  -->
        <template v-for="(list, i) in tracking_hcr" :key="i">
          <div class="graph-wrap" v-if="dataList.length > 0">
            <h3
              :class="i >= 8 && i <= 11 ? 'double-line' : ''"
              class="stretch-text">
              {{
                list.name +
                  " (" +
                  list.unit.replaceAll("(", "").replaceAll(")", "") +
                  ")"
              }}
            </h3>
            <div class="gap" />
            <div class="graph">
              <HistoryGraph
                v-if="props.hcr"
                :data="dataList"
                :refData="props.hcr.resultDto.refHCR"
                :varRef="list.variables"
                :var="list.hcr_variables.toLowerCase()"
                :name="
                  list.name +
                    ' (' +
                    list.unit.replaceAll('(', '').replaceAll(')', '') +
                    ')'
                "
                :pdfScale="pdfScale" />
            </div>
          </div>
        </template>
      </div>
      <div class="desc">
        <span class="stretch-text">
          {{ $t('Page8.text8') }}
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        {{ $t('Page8.text9') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  padding-top: calc(21.98px * $pdf-scale);
  height: calc(122.55px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(9.9px * $pdf-scale);
    padding-left: calc(57.35px * $pdf-scale);
    line-height: calc(13px * $pdf-scale);
  }

  img {
    width: calc(42.9px * $pdf-scale) !important;
    height: calc(42.9px * $pdf-scale) !important;
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: $tit-color;
  }
}

.data-container {
  position: relative;
  //@include flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 auto;
  width: 99.8%;
  height: calc(498.66px * $pdf-scale);
  /* margin-top: calc(11.78px * $pdf-scale); */
  margin-bottom: calc(22.58px * $pdf-scale);
  border: calc(0.5px * $pdf-scale) solid #000000;
  border-width: calc(0.5px * $pdf-scale);
  padding: calc(23px * $pdf-scale) calc(8.6px * $pdf-scale);
  /* padding: calc(23px * $pdf-scale) calc(0px * $pdf-scale); */
  padding-bottom: 0;
}

.desc {
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: calc(66px * $pdf-scale);
  background-color: #e9f4f0;
  font-size: calc(10.923px * $pdf-scale);
  padding: calc(12.88px * $pdf-scale) calc(17.07px * $pdf-scale);
  color: #585859;
}

.graph-wrap {
  width: calc(115px * $pdf-scale);
  /* flex: 1; */
  h3 {
    /* @include flex(center, flex-end); */
    font-size: calc(8.91px * $pdf-scale);
    /* height: calc(11px * $pdf-scale); */
    font-weight: 500;
  }

  .double-line {
    height: calc(22px * $pdf-scale);
  }

  .graph {
    width: calc(115px * $pdf-scale);
    height: calc(106px * $pdf-scale);
  }
}

.pdf .graph-wrap {
  position: relative;
  height: auto;
}

.gap {
  flex: 1;
}

.legend-container {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(9px * $pdf-scale);
  right: calc(19.3px * $pdf-scale);
  .legend1 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #e29bb6;
  }
  .legend2 {
    margin-left: calc(8.62px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #f6ccaa;
  }

  .legend3 {
    margin-left: calc(8.62px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #c0dcad;
  }

  h3 {
    font-size: calc(12px * $pdf-scale);
  }
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.spin--con--txt{
  letter-spacing: 0;
  margin-top: 0;
  font-size: calc(24px * $pdf-scale);
}
.spin--con{
  width: max-content;
}
.no-print{
  position: absolute;
}
</style>
