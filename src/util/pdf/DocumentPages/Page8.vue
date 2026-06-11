<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="6"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-history.png" />
          <h3 class="stretch-text">{{ userInfo.name }}님의 검진 이력</h3>
        </div>
        <span class="stretch-text"
          >최근 5회의 건강검진 결과의 수치변화를 한 눈에 확인하여 건강 상태
          변화를 쉽게 비교해볼 수 있습니다. 각 지표의 막대가 초록색 영역 안에
          위치한다면 해당 지표는 정상범위에 있는 것이며, 초록색 영역 바깥에
          위치한다면, 주의 또는 위험 수치이니 개선하기 위한 노력이
          필요합니다.(주의: 노랑, 위험: 빨강)
        </span>
      </div>      
      <div class="data-container pdf">
        <div v-if="reportType === 'printReport'" class="spin-wrap no-print">
          <div class="spin--con">
            <p class="spin--con--txt">개인민감정보 보호를 위해<br>본 페이지는 인쇄서비스를 지원하지 않습니다</p>
          </div>
        </div>
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">위험</span>
          <div class="legend2"></div>
          <span class="stretch-text">주의</span>
          <div class="legend3"></div>
          <span class="stretch-text">정상</span>
        </div>
        <!-- 항목별 그래프  -->
        <template v-for="(list, i) in tracking_hcr" :key="i">
          <div class="graph-wrap" v-if="dataList.length > 0">
            <h3
              :class="i >= 8 && i <= 11 ? 'double-line' : ''"
              class="stretch-text"
            >
              {{
                list.name +
                " (" +
                list.unit.replaceAll("(", "").replaceAll(")", "") +
                ")"
              }}
            </h3>
            <div class="gap"></div>
            <div class="graph">
              <HistoryGraph
                :data="dataList"
                :comph="comph"
                :refData="filteredData.refHCR"
                :varRef="list.variables"
                :var="list.hcr_variables.toLowerCase()"
                :name="
                  list.name +
                  ' (' +
                  list.unit.replaceAll('(', '').replaceAll(')', '') +
                  ')'
                "
                :pdfScale="pdfScale"
              />
            </div>
          </div>
        </template>
      </div>
      <div class="desc">
        <span class="stretch-text">
          각 지표의 위험/주의/정상 범위는 사용된 가장 최신 연도의
          국민건강보험공단의 참고치를 따릅니다.
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
import { convertDateToYYYYMMDD } from "@/assets/js/chart/util";
import PageHeader from "./PageHeader.vue";
import { tracking_hcr } from "@/assets/js/chart/rstText";
import HistoryGraph from "./com/HistoryGraph.vue";

import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  save: Boolean,
  userInfo: null,
  comph: null,
  hcr: null,
  report_no: null,
  check_date: null,
  pdfScale: Number,
  reportType: String,
});

const singleData = ref(false);
const filteredData = computed(() => {
  let rtn = null;

  if(props.hcr.resultDto !== undefined) {
    rtn = { ...props.hcr.resultDto };
    console.log('@@pg80', props.hcr.resultDto);
  }
  return rtn;
})

const date_recent = ref(null);
const date_old = ref(null);

const old_code = ref(-1);
const current_code = ref(-1);

const old_index = ref(-1);
const current_index = ref(-1);

const dataList = ref([]);
const dataCount = ref(5);

async function exec() {
  // 레포트 날짜 기준 이전 5개 데이터 필터링
  let checkDate = props.check_date.replace(/\./gi, '-');
  current_code.value = parseInt(props.report_no);
  //240109 hcrData -> examinationData 로 변경
  /* filteredData.value.myHCR.forEach((element, i) => {//elem에 scode가 없기 때문에 수정
    if (element.check_date == checkDate) {
      current_index.value = i;
      dataList.value.push(element);
    }
  }); */
  console.log('@@pg81 ', filteredData.value);
  dataList.value = filteredData.value.examinationData;
  
  /* const currentDate = convertDateToYYYYMMDD(
    filteredData.value.myHCR[current_index.value].check_date,
    "."
  ); */

  /* old_index.value = -1;
  for (let i = current_index.value - 1; i >= 0; i--) {
    const old = filteredData.value.myHCR[i];

    if (
      old.check_date !==
      filteredData.value.myHCR[current_index.value].check_date
    ) {
      if (old_index.value === -1) old_index.value = i;
      if (dataList.value.length < dataCount.value) dataList.value.push(old);
    }
  } */

  //date_recent.value = currentDate;

  /* if (
    filteredData.value.myHCR.length > 1 &&
    current_index.value > 0 &&
    old_index.value !== -1
  ) {
    singleData.value = false;

    date_old.value = filteredData.value.myHCR[old_index.value].check_date
      .substr(0, 10)
      .replaceAll("-", ".");
    old_code.value = filteredData.value.myHCR[old_index.value].s_code;
  } else {
    singleData.value = true;
  } */
  console.log('@@pg82 ', filteredData.value)
  dataList.value = dataList.value.reverse();

  if(props.reportType === 'printReport'){
    let keyList;
    dataList.value.forEach(item => {
      keyList = Object.keys(item);
      keyList.forEach(key => {
        item[key] = 0;
      })
    });
  }
}

onMounted(() => {
  exec();
})

</script>

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
    color: #00a856;
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
  width: 100%;
  height: calc(498.66px * $pdf-scale);
  /* margin-top: calc(11.78px * $pdf-scale); */
  margin-bottom: calc(22.58px * $pdf-scale);
  border: calc(0.5px * $pdf-scale) solid #000000;

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
