<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside bg">
      <PageHeader page="9"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-position.png" />

          <h3>한국인의 헬스 스페이스</h3>
        </div>
        <ul>
          <li>
            로그미는 자사 보유 만 19 이상 한국인의 빅데이터를 사용해 노화와
            만성질환으로부터 나의 건강을 얼마나 지킬 수 있는지를 측정합니다. 이
            정보는 이차원상의 위치로 표현하여 현재의 건강 상태를 한 눈에 볼 수
            있게 도와줍니다.
          </li>
          <br />
          <li>
            나의 건강위치가 초록색 영역에 있다면 건강이 좋다는 것을, 반면 빨간색
            영역에 있다면 건강에 더 주의해야 한다는 것을 나타냅니다.
          </li>
          <br />
          <li>
            이 모델을 통해 건강상태 변화도 볼 수 있습니다. 초록색 영역으로 이동
            할 수록 건강이 좋아지는 것이고, 빨간색 영역으로 갈수록 건강이
            나빠지는 것입니다.
          </li>
          <br />
          <li>
            이처럼 모델을 통해 건강상태를 주기적으로 확인하는 습관을 가지는 것이
            중요합니다.
          </li>
        </ul>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3>[로그미 보유 빅데이터의 건강 점수 분포]</h3>
          <div class="legend-container">
            <div class="legend1"></div>
            <span>초기 건강위치</span>
            <div class="legend2"></div>
            <span>생활습관 개선 후 건강위치</span>
          </div>
        </div>
        <div class="data">
          <BubbleChartDocumentLarge
            :showPoint="false"
            :myValue="value"
            :chartData="health.resultDto.comDataList"
          />

          <img src="/img/pdf/res/graph-scatter-ex.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { convertDateToYYYYMMDD } from "@/assets/js/chart/util";
import PageHeader from "./PageHeader.vue";
import { tracking_hcr } from "@/assets/js/chart/rstText";
import BubbleChartDocumentLarge from "./com/BubbleChartDocumentLarge.vue";

import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  save: Boolean,
  userInfo: null,
  check_date : null,
  comph: null,
  hcr: null,
  value: null,
  report_no: null,
  health: null,
});

const singleData = ref(false);
const filteredData = computed(() => {
  let rtn = null;

  if(props.hcr.resultDto !== undefined) {
    rtn = { ...props.hcr.resultDto };
  }
  return rtn;
})

const date_recent = ref(null);
const date_old = ref(null);

const good = ref([]);
const bad = ref([]);

const old_code = ref(-1);
const current_code = ref(-1);

const old_index = ref(-1);
const current_index = ref(-1);

function calculateGoodBad() {
  good.value = [];
  bad.value = [];

  const current = filteredData.value.myHCR[current_index.value];

  if (singleData.value) {
    tracking_hcr.forEach((element) => {
      for (var i = 0; i < filteredData.value.refHCR.length; i++) {
        var item = filteredData.value.refHCR[i];
        if (
          item.variable === element.variables &&
          current[item.variable] !== 0
        ) {
          if (
            current[item.variable] > item.normal_range_max ||
            current[item.variable] < item.normal_range_min
          ) {
            bad.value.push(element);
          } else {
            good.value.push(element);
          }
        }
      }
    });
  } else {
    const old = filteredData.value.myHCR[old_index.value];
    tracking_hcr.forEach((element) => {
      for (var i = 0; i < filteredData.value.refHCR.length; i++) {
        var item = filteredData.value.refHCR[i];
        // console.log("current", current[item.variable]);

        if (
          item.variable === element.variables &&
          current[item.variable] &&
          current[item.variable] !== 0
        ) {
          if (
            (old[item.variable] > item.normal_range_max ||
              old[item.variable] < item.normal_range_min) &&
            old[item.variable !== 0]
          ) {
            if (
              current[item.variable] < item.normal_range_max &&
              current[item.variable] > item.normal_range_min
            ) {
              good.value.push(element);
            }
          }

          if (
            current[item.variable] > item.normal_range_max ||
            current[item.variable] < item.normal_range_min
          ) {
            // console.log("bad", current[item.variable]);

            bad.value.push(element);
          }
        }
      }
    });
  }
}

function getGoodString() {
  let text = "";
  good.value.forEach((element) => {
    if (text !== "") text += ", " + element.name;
    else text += element.name;
  });
  return text;
}

function getBadString() {
  let text = "";
  bad.value.forEach((element) => {
    if (text !== "") text += ", " + element.name;
    else text += element.name;
  });
  return text;
}

function exec() {
  //console.log("health", health, value);
  //filteredData.value = { ...props.hcr.resultDto };
  let checkDate = props.check_date.replace(/\./gi, '-');
  current_code.value = parseInt(props.report_no);
  filteredData.value.myHCR.forEach((element, i) => {//elem에 scode가 없기 때문에 수정
    if (element.check_date == checkDate) {
      current_index.value = i;
    }
  });

  const currentDate = convertDateToYYYYMMDD(
    filteredData.value.myHCR[current_index.value].check_date,
    "."
  );

  old_index.value = -1;
  for (let i = current_index.value - 1; i >= 0; i--) {
    const old = filteredData.value.myHCR[i];

    if (
      old.check_date !==
      filteredData.value.myHCR[current_index.value].check_date
    ) {
      old_index.value = i;
      break;
    }
  }

  date_recent.value = currentDate;

  if (
    filteredData.value.myHCR.length > 1 &&
    current_index.value > 0 &&
    old_index.value !== -1
  ) {
    console.log("index1", current_index.value);
    singleData.value = false;

    date_old.value = filteredData.value.myHCR[old_index.value].check_date
      .substr(0, 10)
      .replaceAll("-", ".");
    old_code.value = filteredData.value.myHCR[old_index.value].s_code;
  } else {
    singleData.value = true;
  }

  calculateGoodBad();
}

onMounted(() => {  
  exec();
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.bg {
  background-color: #f3f9f5;
  height: 100%;
}

.title-container {
  padding-top: calc(33.25px * $pdf-scale);
  height: calc(354.14px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(19.31px * $pdf-scale);
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
    width: calc(89.9px * $pdf-scale);
    height: calc(89.9px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(35px * $pdf-scale);
    color: #008352;
  }
}

.data-container {
  width: 100%;
  height: calc(381.51px * $pdf-scale);
  background-color: white;

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .subject {
    display: flex;
    justify-content: space-between;
    padding-top: calc(12.39px * $pdf-scale);
    padding-left: calc(13.21px * $pdf-scale);
    padding-right: calc(10.35px * $pdf-scale);

    .legend-container {
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .legend1 {
      display: inline-block;
      margin-right: calc(2.75px * $pdf-scale);

      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #727171;
    }
    .legend2 {
      margin-left: calc(12.24px * $pdf-scale);

      display: inline-block;
      margin-right: calc(2.75px * $pdf-scale);

      width: calc(5.35px * $pdf-scale);
      height: calc(5.35px * $pdf-scale);
      background-color: #00b4de;
    }
    h3 {
      font-size: calc(12px * $pdf-scale);
    }
    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }
  }
}
.data {
  width: 100%;
  height: 100%;
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    left: calc(190px * $pdf-scale);
    bottom: calc(163px * $pdf-scale);
    position: absolute;

    width: calc(176px * $pdf-scale);
    height: calc(155px * $pdf-scale);
  }
}
</style>
