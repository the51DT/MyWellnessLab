<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="16"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-oxi.png" />
        </div>
        <div>
          <h3 class="stretch-text">나의 노화 속도에 영향을 미치는 요인</h3>
          <span class="stretch-text"
            >나의 건강 지표 중 노화 속도를 빠르게 만들 수 있는 요인을
            알려드립니다. 한국 성인 평균보다 위험이 높아 노화 속도에 영향을 미친
            요인은 각 지표의 체크박스에 빨간 체크로 표기되어 있습니다. 노화
            속도에 영향을 주는 요인 판정은 빅데이터 기반 한국 성인 평균값을
            기준으로 하므로, 건강 검진 판정 기준과는 상이할 수 있습니다.</span
          >
        </div>
      </div>

      <div class="subject">
        <h3 class="stretch-text">
          [한국 성인 표본집단의 건강 지표별 분포와 나의 건강 지표]
        </h3>
      </div>
      <div class="data-container">
        <div class="legend">
          <div class="avg"></div>
          <div class="stretch-text">한국인 평균</div>
          <div class="my"></div>
          <div class="stretch-text">{{ userInfo.name }}님</div>
          <div class="legend-icon">
            <img src="/img/pdf/res/icon-check.png" />
          </div>
          <div class="stretch-text">건강 위험요인</div>
        </div>

        <!-- 건강지표 그래프 -->
        <div class="data-chart" v-for="item in comph.resultDto.comDataList" v-bind:key="item">
          <!-- 허리둘레 -->
          <TrackingChartDocumentNew :data="item" />
        </div>
        <!-- </template> -->
      </div>
      <div class="desc">
        <span class="stretch-text">
          <!-- 체크항목들 모두 써주는 방법으로 -->
          <b>노화 속도에 영향을 준 요인들</b><br />
          {{ getWorstList }}
        </span>
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

<script setup>
import { tracking_hcr, comphSmCheckRange } from "@/assets/js/chart/rstText";
import PageHeader from "./PageHeader.vue";
/* import TrackingChartDocument from "./com/TrackingChartDocument.vue";
import TrackingChartDocument2 from "./com/TrackingChartDocument2.vue"; */
import TrackingChartDocumentNew from "./com/TrackingChartDocumentNew.vue";

import { computed } from 'vue';
/*
노화속도는 수정된 API를 사용 (hcrData, hcrRef -> ariData, ariMean, ariMax, ariStatus)
따라서 기존 로직이며 컴퍼넌트를 사용할 수 없어서 완전히 수정
*/

const props = defineProps({
  health: null,
    eatingHabit: null,
    save: Boolean,
    check_date:null,
    userInfo: null,
    comph: null,
    hcr: null,
    value: null,
    report_no: null,
    meal: null,
});

const getWorstList = computed(() => {
  let rtnTxt = '';

  if(props.comph.resultDto.comDataList !== undefined) {
    let arr = props.comph.resultDto.comDataList.filter(item => {
      return item.status !== 1;
    })

    if(arr.length > 0) {
      arr.forEach(item => {
        rtnTxt += item.name.concat(', ');
      })

      rtnTxt = rtnTxt.substring(0, rtnTxt.length - 2);
    }

  }

  return rtnTxt;
})

</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  /* flex-direction: column; */

  padding-top: calc(8.7px * $pdf-scale);
  /* margin-bottom: calc(19.1px * $pdf-scale); */
  height: calc(119.55px * $pdf-scale);
  width: 100%;

  .title {
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
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
    margin-left: calc(12.69px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    color: #008352;
    height: calc(23px * $pdf-scale);
  }

  span {
    display: inline-block;
    margin-left: calc(12.69px * $pdf-scale);
    margin-top: calc(15.82px * $pdf-scale);
    font-size: calc(11px * $pdf-scale);
    /* padding-right: calc(25.97px * $pdf-scale); */
    line-height: calc(17.5px * $pdf-scale);
    letter-spacing: calc(-0.01em * $pdf-scale);
    font-weight: 300;
  }

  .score-container {
    width: 100%;
    height: 100%;
    flex: 1;
  }
}

.desc {
  margin-top: calc(7.46px * $pdf-scale);
  height: calc(81.26px * $pdf-scale);
  font-size: calc(10.923px * $pdf-scale);
  color: #585859;
  b {
    color: #000000;
    font-size: calc(13px * $pdf-scale);
    font-weight: 500;
  }
}

.data-container {
  position: relative;
  width: 100%;
  height: calc(486.28px * $pdf-scale);
  background-color: white;

  border: calc(0.5px * $pdf-scale) solid #000000;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: calc(21.7px * $pdf-scale);
  padding-top: calc(16.08px * $pdf-scale);
  gap: 0 !important;
}
.subject {
  display: flex;
  justify-content: space-between;
  /* padding-top: calc(19.24px * $pdf-scale); */
  padding-right: calc(10.35px * $pdf-scale);
  padding-bottom: calc(6.2px * $pdf-scale);
  height: calc(15.5px * $pdf-scale);
  h3 {
    font-size: calc(10px * $pdf-scale);
    font-weight: bold;
  }
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.data-chart {
  height: calc(47px * $pdf-scale);
  width: calc(243px * $pdf-scale);
}

.legend {
  position: absolute;
  top: calc(9.76px * $pdf-scale);
  right: calc(12.21px * $pdf-scale);
  /* margin-top: calc(26px * $pdf-scale); */
  /* margin-bottom: calc(11px * $pdf-scale); */
  color: #727171;
  //@include flex(flex-end, center);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: calc(6.5px * $pdf-scale);
  .avg {
    margin-left: calc(17px * $pdf-scale);
    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #92539d;
    margin-right: calc(2.83px * $pdf-scale);
  }
  .my {
    margin-left: calc(17px * $pdf-scale);
    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(17px * $pdf-scale);
    width: calc(6px * $pdf-scale);
    height: auto;
    /* background-color: #00b4de; */
    margin-right: calc(2.83px * $pdf-scale);
  }
}

.desc2 {
  font-size: calc(8px * $pdf-scale);
  letter-spacing: -0.03em;
  line-height: 17.5px;
  font-weight: 300;
  font-family: Pretendard;
  color: #000;
  text-align: left;
  /* display: inline-block; */
  width: calc(321px * $pdf-scale);
  height: calc(18px * $pdf-scale);
  display: flex;
  align-items: center;
}
</style>
