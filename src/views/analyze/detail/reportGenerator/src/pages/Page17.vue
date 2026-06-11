<script setup>
import { computed } from 'vue'
import PageHeader from '../PageHeader.vue'
import TrackingChartDocumentNew from '../TrackingChartDocumentNew.vue'
import { useCommonForm } from '@/utils/commonForm'
import { nameObj } from '@/views/analyze/detail/reportGenerator/util'
import _ from 'lodash'

const { AGING_SPEED_FORM } = useCommonForm()
const props = defineProps({
  save: Boolean,
  userInfo: null,
  analyzeData: null
})

const list = computed(() => {
  const arr = []

  for (const key in AGING_SPEED_FORM) {
    const target = AGING_SPEED_FORM[key]
    let value = props.analyzeData.ariData[key]

    if (value === undefined) {
      continue
    }

    const sex = props.analyzeData.sex - 1 // 0: 남자, 1: 여자
    let average = 50

    if (target.class === 'type2') {
      average = (Number(props.analyzeData.ariMean[key]) / Number(target.max) * 100).toFixed(0)
    }

    let sectionValue = 0
    let prevPercent = 0
    let ratio = 0
    const sectionValue1 = Array.isArray(target.value1) ? target.value1[sex] : target.value1
    let sectionValue2 = 0

    if (target.value2) {
      sectionValue2 = Array.isArray(target.value2) ? target.value2[sex] : target.value2
    } else {
      sectionValue2 = sectionValue1
    }

    if (value < sectionValue1) {
      sectionValue = sectionValue1
      ratio = target.type.ratio[0]
    } else if (value < sectionValue2) {
      value -= sectionValue1
      sectionValue = sectionValue2 - sectionValue1
      prevPercent = target.type.ratio[0] * 10
      ratio = target.type.ratio[1]
    } else if (value < target.max) {
      value -= sectionValue2 || sectionValue1
      sectionValue = target.max - (sectionValue2 || sectionValue1)

      if (target.type.ratio.length === 3) {
        prevPercent = (target.type.ratio[0] + target.type.ratio[1]) * 10
      } else {
        prevPercent = target.type.ratio[0] * 10
      }

      ratio = target.type.ratio[target.type.ratio.length - 1]
    } else {
      prevPercent = 100
      sectionValue = 1
    }

    let my = ((value / sectionValue * 100) * (ratio / 10)) + prevPercent

    if (my > 100) {
      my = 100
    }

    if (my < 0) {
      my = 0
    }

    const detailObj = {
      label: target.label,
      average,
      my,
      class: target.type.class,
      ariStatus: props.analyzeData.ariStatus[key] || 0,
      status: props.analyzeData.ariCheck[key] === 1 ? 1 : 0,
      index: Object.keys(AGING_SPEED_FORM).indexOf(key)
    }

    arr.push(detailObj)
  }

  const res = _.orderBy(arr, ['ariStatus', 'index'], ['desc', 'asc'])
  return res
})

const getWorstList = computed(() => {
  let rtnTxt = ''

  const ariRisk = reverseByValue(props.analyzeData.ariRisk, Object.keys(AGING_SPEED_FORM))

  if (ariRisk) {
    ariRisk.forEach(item => {
      rtnTxt += nameObj[item.key].name.concat(', ')
    })

    rtnTxt = rtnTxt.substring(0, rtnTxt.length - 2)
  }

  return rtnTxt
})
/**
 * 입력받은 object의 밸류를 기준으로 역순으로 정렬하여 배포한다.
 *
 * @param {*} targetObj
 * @returns {*} - revereseObject
 */
function reverseByValue (targetObj, keys) {
  const data = []
  for (const key in targetObj) {
    data.push({
      key,
      value: targetObj[key],
      index: keys.indexOf(key)
    })
  }
  const res = _.orderBy(data, ['value', 'index'], ['desc', 'asc'])
  return res
}

</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="16" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-oxi.png" />
        </div>
        <div class="contents">
          <h3 class="stretch-text">{{ $t('Page17.text1') }}</h3>
          <span class="stretch-text">
            {{ $t('Page17.text2') }}
          </span>
        </div>
      </div>

      <div class="subject">
        <h3 class="stretch-text">
          [{{ $t('Page17.text3') }}]
        </h3>
      </div>
      <div class="data-container">
        <div class="legend">
          <div class="avg" />
          <div class="stretch-text">{{ $t('Page17.text4') }}</div>
          <div class="my" />
          <div class="stretch-text">{{ userInfo.name }}{{ $t('Common.name') }}</div>
          <div class="legend-icon">
            <img src="/img/pdf/res/icon-check.png" />
          </div>
          <div class="stretch-text">{{ $t('Page17.text5') }}</div>
        </div>

        <!-- 건강지표 그래프 -->
        <div class="data-chart" v-for="item in list" v-bind:key="item">
          <!-- 허리둘레 -->
          <TrackingChartDocumentNew :data="item" />
        </div>
        <!-- </template> -->
      </div>
      <div class="desc">
        <span class="stretch-text">
          <!-- 체크항목들 모두 써주는 방법으로 -->
          <b>{{ $t('Page17.text6') }}</b><br />
          {{ getWorstList }}
        </span>
      </div>
      <div class="stretch-text stretch-text-desc">※{{ $t('Page17.text7') }}</div>
      <hr />
      <div class="bottom-info">
        *{{ $t('Page17.text8') }}
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
  /* flex-direction: column; */

  //padding-top: calc(8.7px * $pdf-scale); 240117 텍스트가 늘어나서 간격을 조정하느라 아랫줄로 수정함
  padding-top: calc($pdf-scale);
  /* margin-bottom: calc(19.1px * $pdf-scale); */
  height: calc(119.55px * $pdf-scale);
  width: 100%;

  $size: 170px;
  .title {
    //@include flex(flex-start, flex-start);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: $size;
    margin-top: calc( 5px * $pdf-scale );
  }

  .contents{
    width: calc( 100% - $size);
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
    //width: calc(51.08px * $pdf-scale);
    //height: calc(51.08px * $pdf-scale);
    //object-fit: contain;
    width: $size;
    height: $size;
  }

  h3 {
    //margin-top: calc(10.68px * $pdf-scale); 240117 텍스트가 늘어나서 간격을 조정하느라 아랫줄로 수정함
    margin-top: calc($pdf-scale);
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
    line-height: calc(15px * $pdf-scale);
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
  width: 99.8%;
  height: calc(486.28px * $pdf-scale);
  background-color: white;

  border: calc(0.5px * $pdf-scale) solid #000000;
  border-width: calc(0.5px * $pdf-scale);
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
.stretch-text-desc{ /*240117 텍스트가 늘어나서 간격을 조정하느라 추가함*/
  font-size: calc(10px * $pdf-scale);
  margin-top: calc(6px * $pdf-scale);
}
.bottom-info{
  bottom: 116px;
}
</style>
