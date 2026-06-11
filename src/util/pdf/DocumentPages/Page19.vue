<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="18"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-danger.png" />
          <h3 class="stretch-text">건강 위험 요인</h3>
        </div>
        <span class="stretch-text">
          건강 위험 요인은 건강 검진 판정 기준 (혈액 지표) 및 과학적 근거
          (생활습관)를 바탕으로 판정됩<br />니다. 나의 건강 위험 요인을 확인해
          보세요.
        </span>
      </div>

      <div class="legend-container">
        <div class="legend1"></div>
        <span class="stretch-text">위험 요인</span>
        <div class="legend2"></div>
        <span class="stretch-text">주의 요인</span>
      </div>

      <div class="data-container">
        <template v-for="(list, i) in list_data" :key="i">
          <div class="name" :class="isAbnormal(list.var) ? 'red' : ''">
            <span class="stretch-text">
              {{ list.name }}
            </span>
          </div>
          <div class="description" :class="isAbnormal(list.var) ? 'red' : ''">
            <span class="stretch-text">
              {{ list.description }}
            </span>
            <ul>
              <li v-for="(list2, j) in list.list" :key="j">
                <span class="stretch-text">
                  {{ list2 }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </div>
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from "./PageHeader.vue";
import { rst } from "@/assets/js/chart/rstText";
// 해당 페이지 표현해야할 항목, 텍스트
import { rst2 } from "@/assets/js/chart/documentText";
import { tracking_hcr } from "@/assets/js/chart/rstText";

import { computed } from 'vue';
/* 
   노화속도는 수정된 API를 사용 (hcrData, hcrRef -> ariData, ariMean, ariMax, ariStatus) 
   따라서 기존 로직이며 컴퍼넌트를 사용할 수 없어서 완전히 수정
*/

const props = defineProps({
  health: null,
  eatingHabit: null,
  save: Boolean,
  check_date: null,
  userInfo: null,
  comph: null,
  hcr: null,
  value: null,
  report_no: null,
  meal: null,
});

const list_data = rst2;

const rstData = computed(() => {
  let result = null;
  const obj = {};

  if(props.comph.resultDto.comData !== undefined) {
    result = props.comph.resultDto.comData;

    for (let key in rst) {
      obj[key] = result[key];
    }
  }

  return obj;
})

function isAbnormal(val) {
  let rst = '';
  
  switch(rstData.value[val].status){
    case 2:
      rst = 'warn'
      break;
    case 3:
      rst = 'red'
      break;
    case 1:
    default:
      break;
  }
  
  return rst;
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  //@include flex(flex-start, flex-start);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  padding-top: calc(11.66px * $pdf-scale);
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
  /* height: calc(560px * $pdf-scale); */
  background-color: white;
  margin-top: calc(13.61px * $pdf-scale);

  border: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns: calc(119.71px * $pdf-scale) 1fr;
  grid-template-rows: repeat(auto, 1fr);

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
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(3px * $pdf-scale);

    font-size: calc(13px * $pdf-scale);
    line-height: 155%;
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
    font-size: calc(10px * $pdf-scale);
    line-height: 155%;
    padding-top: calc(16.24px * $pdf-scale);
    padding-bottom: calc(16.24px * $pdf-scale);
  }
  span {
    display: inline-block;
  }
  ul {
    padding-left: calc(10px * $pdf-scale);
    li {
      list-style-type: disc;
      font-family: "Pretendard";
      * {
        vertical-align: text-top;
      }
    }
  }

  .red {
    color: #ea6176;
  }
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

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}
.legend1 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);

  width: calc(5.35px * $pdf-scale);
  height: calc(5.35px * $pdf-scale);
  background-color: #ea6176;
}
.legend2 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);
  margin-left: calc(8px * $pdf-scale);
  width: calc(5.35px * $pdf-scale);
  height: calc(5.35px * $pdf-scale);
  background-color: #f8b500;
}
</style>
