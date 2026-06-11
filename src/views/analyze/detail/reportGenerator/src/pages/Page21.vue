<!-- nutList['CK_eq5d'] === 1  -->
<script setup>
import PageHeader from '../PageHeader.vue'
// 해당 페이지 표현해야할 항목, 텍스트
import { rst4 } from '@/assets/js/chart/documentText'

import { computed } from 'vue'
/*
   노화속도는 수정된 API를 사용 (hcrData, hcrRef -> ariData, ariMean, ariMax, ariStatus)
   따라서 기존 로직이며 컴퍼넌트를 사용할 수 없어서 완전히 수정
*/

const props = defineProps({
  save: Boolean,
  userInfo: null,
  integratedAriStatus: null,
  value: null
})

const listData = rst4

const rstData = computed(() => {
  let result = null
  const obj = {}

  if (props.integratedAriStatus) {
    result = props.integratedAriStatus

    for (const data of listData) {
      obj[data.var] = result[data.var]
    }
  }

  return obj
})

/**
 * 설명 조회
 * @param {*} key
 * @param {*} str
 * @returns {string}
 */
const getDescription = (key, str) => {
  let data = str

  if (key === 'CK_water_amt') {
    // 수분은 성별/연령대에 따라 평균 수분 섭취량을 변경
    const amt = getNormalWaterAmt()
    data = data.replace('{amt}', amt)
  }

  return data
}

/**
 * 성별 및 연령대에 따른 정상 수분 섭취량
 * @returns {number}
 */
const getNormalWaterAmt = () => {
  let amt = 5

  // 남성 (여성은 모든 연령대 5잔이상)
  if (props.userInfo.sex === 1) {
    if (props.userInfo.age >= 50 && props.userInfo.age <= 74) {
      amt = 5
    } else {
      amt = 6
    }
  }

  return amt
}

/**
 * val의 값에 따라 status 체크
 * @param {*} val
 * @returns {string} warn or red or ''
 */
function isAbnormal (val) {
  let rst = ''

  switch (rstData.value[val].status) {
    case 2:
      rst = 'warn'
      break
    case 3:
      rst = 'red'
      break
    default:
      break
  }

  return rst
}
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="20" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-danger.png" />
          <h3 class="stretch-text">{{ $t('Page21.text1') }}</h3>
        </div>
        <span class="stretch-text">
          {{ $t('Page21.text2') }}
        </span>
      </div>

      <div class="legend-container">
        <div class="legend1">
          <img src="/img/pdf/res/ico_caution.svg" alt="" />
        </div>
        <span class="stretch-text">{{ $t('Page21.text3') }}</span>
        <div class="legend2">
          <img src="/img/pdf/res/ico_manage.svg" alt="" />
        </div>
        <span class="stretch-text">{{ $t('Page21.text4') }}</span>
      </div>

      <div class="data-container">
        <template v-for="(list, i) in listData" :key="i">
          <div class="name" :class="isAbnormal(list.var, list)">
            <span class="stretch-text">
              {{ list.name }}
            </span>
          </div>
          <div
            class="description"
            :class="isAbnormal(list.var, list)">
            <span class="stretch-text">
              {{ list.description }}
            </span>
            <ul>
              <li v-for="(list2, j) in list.list" :key="j">
                <span class="stretch-text">
                  {{ getDescription(list.var, list2) }}
                </span>
              </li>
              <li v-if="list.sex">
                <span class="stretch-text">
                  {{ userInfo.sex === 1 ? list.sex[0] : list.sex[1] }}
                </span>
              </li>
              <li v-if="list.good && !isAbnormal(list.var)">
                <span class="stretch-text">
                  {{ list.good }}
                </span>
              </li>
              <li v-if="list.bad && isAbnormal(list.var)">
                <span class="stretch-text">
                  {{ list.bad }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </div>
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
  flex-direction: column;

  padding-top: calc(5px * $pdf-scale);
  /* margin-bottom: calc(19.1px * $pdf-scale); */
  height: calc(85.48px * $pdf-scale);
  width: 100%;

  .title {
    //@include flex(flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items: center;
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
    width: calc(42.66px * $pdf-scale);
    height: calc(42.66px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-left: calc(9.22px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    color: #008352;
  }

  span {
    display: inline-block;
    font-size: calc(11px * $pdf-scale);
    letter-spacing: -0.05em;
    line-height: 155%;
    font-weight: 300;
    font-family: Pretendard;
    color: #000;
    padding-left: calc(50.8px * $pdf-scale);
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
  b {
    font-size: calc(13px * $pdf-scale);
  }
}

.data-container {
  width: 100%;
  height: calc(616px * $pdf-scale);
  background-color: white;
  margin-top: calc(2.5px * $pdf-scale);

  border: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns: calc(119.71px * $pdf-scale) 1fr;
  grid-template-rows: repeat(6, 1fr);

  align-items: center;
  justify-items: center;

  .name {
    //@include flex(flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    /* height: calc(106.08px * $pdf-scale); */
    /*border-right: calc(0.3px * $pdf-scale) solid #777 !important;
    border-bottom: calc(0.3px * $pdf-scale) solid #777;*/
    border-style: solid;
    border-color: #777;
    border-width: 0 calc(0.5px * $pdf-scale) calc(0.4px * $pdf-scale) 0;
    padding-left: calc(3px * $pdf-scale);

    font-size: calc(13px * $pdf-scale);
    line-height: 150%;
    &.warn{
      background-color: #FFFCF2;
      .stretch-text{
        &:before{
          content: '';
          display: block;
          background: url("/img/pdf/res/ico_manage.svg") no-repeat;
          background-size: contain;
          width: calc( 21px * $pdf-scale);
          height: calc( 21px * $pdf-scale);
        }
      }
    }
    &.red{
      background-color: #FFFBFB;
      .stretch-text{
        &:before{
          content: '';
          display: block;
          background: url("/img/pdf/res/ico_caution.svg") no-repeat;
          background-size: contain;
          width: calc( 22px * $pdf-scale);
          height: calc( 22px * $pdf-scale);
        }
      }
    }
  }
  .description {
    //@include flex(center, flex-start);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 100%;
    /* height: calc(106.08px * $pdf-scale); */
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(3px * $pdf-scale);
    font-size: calc(10px * $pdf-scale) !important;
    line-height: 155% !important;
    padding-top: calc(4.5px * $pdf-scale);
    padding-bottom: calc(4.5px * $pdf-scale);
    span {
      display: inline-block;
    }
    &.warn{
      background-color: #FFFCF2;
    }
    &.red{
      background-color: #FFFBFB;
    }
  }

  ul {
    padding-left: calc(10px * $pdf-scale);
    li {
      list-style-type: disc;
      * {
        vertical-align: text-top;
      }
    }
  }

  //.red {
  //  color: #ea6176;
  //}
  //
  //.warn {
  //  color: #b2850d;
  //}
}
.subject {
  display: flex;
  justify-content: space-between;
  /* padding-top: calc(12.39px * $pdf-scale); */
  padding-right: calc(10.35px * $pdf-scale);
  margin-bottom: calc(6.2px * $pdf-scale);

  h3 {
    font-size: calc(12px * $pdf-scale);
  }
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.legend-container {
  //@include flex(flex-end, center);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-top: calc(11px * $pdf-scale);
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}
.legend1 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);

  width: calc(14px * $pdf-scale);
  height: calc(14px * $pdf-scale);
  //background-color: #ea6176;
  //img{
  //  width: calc(14px * $pdf-scale);
  //}
}
.legend2 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);
  margin-left: calc(12px * $pdf-scale);
  width: calc(13px * $pdf-scale);
  height: calc(13px * $pdf-scale);
  //background-color: #f8b500;
}
.stretch-page2 {
  .data-container {
    width: 100%;
    height: calc(616px * $pdf-scale);
    background-color: white;
    margin-top: calc(2.5px * $pdf-scale);

    border: calc(0.3px * $pdf-scale) solid #000000;
    border-left: none;
    border-right: none;
    /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
    display: grid;
    grid-template-columns: calc(119.71px * $pdf-scale) 1fr;
    grid-template-rows: repeat(6, 1fr);

    align-items: center;
    justify-items: center;

    .name {
      //@include flex(flex-start, center);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 100%;
      /* height: calc(106.08px * $pdf-scale); */
      /*border-right: calc(0.3px * $pdf-scale) solid #777;
      border-bottom: calc(0.3px * $pdf-scale) solid #777;*/
      border-style: solid;
      border-color: #777;
      border-width: 0 calc(0.5px * $pdf-scale) calc(0.4px * $pdf-scale) 0;
      padding-left: calc(3px * $pdf-scale);

      font-size: calc(13px * $pdf-scale);
      line-height: 150%;
    }
    .description {
      //@include flex(center, flex-start);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      height: 100%;
      /* height: calc(106.08px * $pdf-scale); */
      border-bottom: calc(0.3px * $pdf-scale) solid #000000;
      padding-left: calc(3px * $pdf-scale);
      font-size: calc(11px * $pdf-scale);
      line-height: 150%;
    }

    ul {
      padding-left: calc(10px * $pdf-scale);
      li {
        list-style-type: disc;
        font-family: "Pretendard";
      }
    }

    //.red {
    //  color: #ea6176;
    //}
  }
}
</style>
