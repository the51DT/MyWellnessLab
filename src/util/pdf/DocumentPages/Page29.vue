<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="25"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-type.png" />
          <h3 class="stretch-text">ABC 건강 등급 및 변화 패턴</h3>
        </div>
        <span class="stretch-text">
          {{ userInfo.name }}님의 건강 등급은 분석 결과 {{ healthType }} 등급과
          가장 유사한 건강 상태를 보입니다.<br />
          직전 판정 결과와 현재 건강 상태를 확인해 보세요.
        </span>
      </div>
      <div class="subject">
        <h3 class="stretch-text">[나의 ABC 건강 등급 변화]</h3>
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">나쁨</span>
          <div class="legend2"></div>
          <span class="stretch-text">주의</span>
          <div class="legend3"></div>
          <span class="stretch-text">좋음</span>
        </div>
      </div>
      <div class="data-container" v-if="!isLoading">
        <div class="top stretch-text">판정일자</div>
        <div class="top stretch-text"></div>
        <div class="top stretch-text"><!-- {{ date_old }} --></div>
        <div class="top bold-light stretch-text">{{ date_recent }}</div>

        <div class="content cell bt bb">
          <span class="stretch-text">건강점수</span>
        </div>
        <div class="content row">
          <span class="stretch-text">건강지표</span>
        </div>

        <div class="content-title bg black bt">
          <span class="stretch-text"> 노화 억제 분석 지수 </span>
        </div>
        <div class="content bg black bt">
          <span v-if="oldHealth" class="stretch-text"
            >{{ oldValue.Oxi }}점</span
          >
        </div>
        <div class="content bg black bt">
          <span class="stretch-text">{{ value.Oxi }}점</span>
        </div>

        <div class="content-title bg black bb">
          <span class="stretch-text">만성질환 억제 분석 지수</span>
        </div>
        <div class="content bg black bb">
          <span v-if="oldHealth" class="stretch-text"
            >{{ oldValue.Met }}점</span
          >
        </div>
        <div class="content bg black bb">
          <span class="stretch-text">{{ value.Met }}점</span>
        </div>
        <template v-for="(list, i) in viewVariables" :key="i">
          <div class="content-title">
            <span class="stretch-text">
              {{ getRstName(list) }}
            </span>
          </div>
          <div class="content">
            <span :class="getStatusClass(rstOld, list, true)"></span>
          </div>
          <div class="content">
            <span :class="getStatusClass(rst, list, false)"></span>
          </div>
        </template>

        <div class="content-title bg last cell2 bt bb">
          <span class="stretch-text">나의 ABC 건강 등급</span>
        </div>
        <div class="content-type bg bt bb">
          <span class="stretch-text">{{ beforeType }}</span>
        </div>
        <div class="content-type bg bold bt bb">
          <span class="stretch-text">{{ healthType }}</span>
        </div>
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
//import { healthReport, mealReport } from "@/api/restApi";
import { rstDetail } from "@/assets/js/chart/rstText";

import { ref, computed, onMounted, toRaw } from 'vue';

const props = defineProps({
  save: Boolean,
  userInfo: null,
  comph: null,
  hcr: null,
  report_no: null,
  health: null,
  value: null,
  meal: null,
  loadingFinished: null,
  check_date: null,
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

const old_code = ref(-1);
const current_code = ref(-1);

const old_index = ref(-1);
const current_index = ref(-1);
const healthType = ref("A");
const beforeType = ref("");
const oldHealth = ref(null);
const oldMeal = ref(null);

const rst = ref({});
const rstOld = ref({});

const viewVariables = ref([
  "SBP",
  "DBP",
  "GLU",
  "HDL",
  "TG",
  "CREA",
  "WC",
  "BMI",
  "HB",
  "GOT",
  "GPT",
  "TC",
  "LDL",
]);

const isLoading = ref(true);

const oldValue = computed(() => {
  const { MET, MET_MEAN, OXI, OXI_MEAN } = oldHealth.value.resultDto.myHQ;

  return {
    Oxi: Number(OXI.toFixed(0)),
    Met: Number(MET.toFixed(0)),
    MET_MEAN: MET_MEAN,
    OXI_MEAN: OXI_MEAN,
  };
});

function getRstName(variable) {
  let name = "";
  rst.value[props.userInfo.sex].forEach((element) => {
    if (element.variables === variable) {
      name = element.name;
    }
  });
  return name;
}

// 건강지표 상태값 계산
function getStatusClass(data, variable, isOld) {
  let className = "none";
  if (singleData.value && isOld) return className;

  data[props.userInfo.sex].forEach((element) => {
    if (element.variables === variable) {
      console.log("getStatusClass", element.value, variable, isOld);
      switch (element.value) {
        case 1:
          className = "safe";
          break;
        case 2:
          className = "warning";
          break;
        case 3:
          className = "danger";
          break;
      }
    }
  });
  return className;
}

onMounted(() => {
  // 현재 데이터
  rst.value = JSON.parse(JSON.stringify(rstDetail));
  // 이전 데이터
  rstOld.value = JSON.parse(JSON.stringify(rstDetail));

  //console.log("health", this.health, this.value);
  //console.log("hcr", this.hcr);
  healthType.value = props.health.resultDto.myHQ.Health_Type;  

  let checkDate = props.check_date.replace(/\./gi, '-');

  current_code.value = parseInt(props.report_no);
  filteredData.value.myHCR.forEach((element, i) => {//elem에 scode가 없기 때문에 수정
    if (element.check_date == checkDate) current_index.value = i;
  });

  const currentDate = convertDateToYYYYMMDD(
    filteredData.value.myHCR[current_index.value].check_date,
    "."
  );

  // 현재 데이터 날짜
  date_recent.value = currentDate;

  // 현재 데이터 기준으로 이전 데이터 검색
  old_index.value = -1;
  for (let i = current_index.value - 1; i >= 0; i--) {
    const old = filteredData.value.myHCR[i];

    if (
      old.s_code !== 0 &&
      filteredData.value.myHCR[current_index.value].check_date
    ) {
      old_index.value = i;
      break;
    }
  }

  if (
    filteredData.value.myHCR.length > 1 &&
    current_index.value > 0 &&
    old_index.value !== -1
  ) {
    // 현재/이전 데이터 모두 있을때 이전 데이터 세팅
    singleData.value = false;

    date_old.value = filteredData.value.myHCR[old_index.value].check_date
      .substr(0, 10)
      .replaceAll("-", ".");
    old_code.value = filteredData.value.myHCR[old_index.value].s_code;
  } else {
    // 현재 데이터만 있을 경우
    console.log("singleData");
    singleData.value = true;
  }
  
  if (singleData.value === false) {
    let old_health_info = {
      op_code: 2,
      report_no: parseInt(old_code.value),
      uid: props.userInfo.uid,
      name: props.userInfo.name,
    };

    console.log("old_health_info", old_code.value);

    //TODO 이 아래로는 다른 정보 조회하는 걸 만들어야 함
    /* this.oldHealth = await healthReport(old_health_info).catch(async () => {
      this.error = 1;
    });
    console.log("oooldhealth", this.oldHealth);

    console.log("meal", this.meal);
    this.beforeType = this.oldHealth.resultDto.myHQ.Health_Type;

    this.oldMeal = await mealReport(old_health_info).catch(async () => {
      this.error = 1;
    });
    const oldMealData =
      this.oldMeal.resultDto.myDataList[
        this.oldMeal.resultDto.myDataList.length - 1
      ];

    console.log(this.rstOld[this.userInfo.sex]);
    // 이전 데이터 값 불러오기
    this.rstOld[this.userInfo.sex].forEach((element) => {
      element.value = oldMealData[element.variables];
    }); */
  }
  const myMealData =
    props.meal.resultDto.myDataList[props.meal.resultDto.myDataList.length - 1];
  // 현재 데이터 값 불러오기
  rst.value[props.userInfo.sex].forEach((element) => {
    element.value = myMealData[element.variables];
  });

  isLoading.value = false;

  setTimeout(() => {
    if (props.loadingFinished) props.loadingFinished();
  }, 1000);
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  @include flex(flex-start, flex-start);
  flex-direction: column;
  height: calc(145.69px * $pdf-scale);
  padding-top: calc(22px * $pdf-scale);

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    padding-left: calc(53.35px * $pdf-scale);
    line-height: 150%;
  }

  img {
    width: calc(42.9px * $pdf-scale);
    height: calc(42.9px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #00a856;
  }
}

.data-container {
  @include flex;
  flex-direction: column;
  /* gap: calc(22.2px * $pdf-scale); */

  position: relative;
  width: 100%;

  margin-top: calc(19px * $pdf-scale);
  margin-bottom: calc(36.24px * $pdf-scale);
  /* border: calc(0.3px * $pdf-scale) solid #000000; */

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns:
    calc(56.69px * $pdf-scale) 1fr calc(89.66px * $pdf-scale)
    calc(89.66px * $pdf-scale);
  /* calc(112.58px * $pdf-scale) */
  grid-template-rows: repeat(16, calc(22.545px * $pdf-scale)) calc(
      35.38px * $pdf-scale
    );

  align-items: center;
  justify-items: center;
  color: #000000;

  .top {
    font-size: calc(10px * $pdf-scale);
    color: #727171;
  }

  .content-title {
    font-size: calc(12px * $pdf-scale);
    @include flex(flex-start, center);
    padding-left: calc(6.6px * $pdf-scale);
    width: 100%;
    height: 100%;
    /* border-right: calc(0.5px * $pdf-scale) solid #000000; */
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 300;
  }

  .last {
    font-weight: 600;
  }

  .content {
    font-size: calc(12px * $pdf-scale);
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
  }

  .content-type {
    font-size: calc(18px * $pdf-scale);
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
  }

  .bold {
    font-weight: 700;
  }

  .bg {
    background-color: #eff7ef;
    color: #00a856;
  }

  .cell {
    grid-row: 2/4;
    background-color: #eff7ef;
    border-left: none;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
  }
  .row {
    border-left: none;
    grid-row: 4/17;
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 500;
  }

  .cell2 {
    grid-column: 1/3;
  }

  .black {
    color: #000000;
  }

  .bt {
    border-top: calc(1px * $pdf-scale) solid #000000;
  }
  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

  .danger {
    border-radius: 50%;
    width: calc(12.76px * $pdf-scale);
    height: calc(12.76px * $pdf-scale);

    background-color: #e95371;
  }

  .warning {
    border-radius: 50%;
    width: calc(12.76px * $pdf-scale);
    height: calc(12.76px * $pdf-scale);

    background-color: #f8b500;
  }

  .safe {
    border-radius: 50%;
    width: calc(12.76px * $pdf-scale);
    height: calc(12.76px * $pdf-scale);

    background-color: #5ab651;
  }
}

.desc-title {
  font-size: calc(10px * $pdf-scale);
  margin-bottom: calc(7.76px * $pdf-scale);
  font-weight: bold;
}

.desc {
  width: 100%;
  height: calc(66px * $pdf-scale);
  background-color: #e9f4f0;
  font-size: calc(13px * $pdf-scale);
  padding: calc(12.88px * $pdf-scale) calc(17.07px * $pdf-scale);
}
.subject {
  display: flex;
  justify-content: space-between;
  padding-top: calc(10.18px * $pdf-scale);
  padding-right: calc(10.35px * $pdf-scale);
  /* margin-bottom: calc(6.81px * $pdf-scale); */

  .legend-container {
    @include flex(center, center);
  }
  .legend1 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #e95371;
  }
  .legend2 {
    margin-left: calc(12.24px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #f8b500;
  }

  .legend3 {
    margin-left: calc(12.24px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #5ab651;
  }
  h3 {
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
  }
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }

  h3 {
    font-size: calc(12px * $pdf-scale);
  }
}

.data {
  @include flex(flex-start, flex-start);
  width: 100%;
  height: calc(189.39px * $pdf-scale);

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .item1 {
    position: relative;

    padding: calc(12.02px * $pdf-scale) calc(10.79px * $pdf-scale);
    width: calc(174.81px * $pdf-scale);
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    font-size: calc(12px * $pdf-scale);
    line-height: 150%;
  }

  .item2 {
    flex: 1;
    height: 100%;
    font-size: calc(16px * $pdf-scale);
    line-height: 150%;

    padding-left: calc(22.28px * $pdf-scale);
    @include flex(flex-start, center);
  }

  .interest {
    background-color: #eaf6fc;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #00b4de;
      font-size: calc(19px * $pdf-scale);
    }
  }

  .danger {
    background-color: #fce5e4;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #ea6176;
      font-size: calc(19px * $pdf-scale);
    }
  }

  .warning {
    background-color: #fbfbe2;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #f7b141;
      font-size: calc(19px * $pdf-scale);
    }
  }
}

.bold-light {
  font-weight: 700;
}

hr {
  margin-top: calc(139px * $pdf-scale);
}
</style>
