<template>
  <!-- <div class="date">{{ date }}</div> -->
  <div class="content">
    <div class="left">
      <div class="title stretch-text">주요 건강 위험 요인</div>

      <!-- 주요 건강 위험 요인 -->
      <div
        class="check-list"
        :class="{ hide: hideList }"
        v-if="count.normal > 0"
      >
        <ul>
          <li
            v-for="(list, i) in rstData"
            :key="i"
            :class="{
              warn: list === 2,
              danger: list === 3,
              none: list !== 1,
            }"
          >
            <h5 class="stretch-text">{{ rstName[i] }}</h5>
          </li>
          <li
            v-for="(list, i) in nutList"
            :key="i + 10"
            :class="{
              warn: list === 2,
              danger: list === 3,
              none: list !== 1 && list !== 0,
            }"
          >
            <h5 class="stretch-text">
              {{ comphSm[i] }}
            </h5>
          </li>
          <li
            v-for="(list, i) in rstData"
            :key="i + 100"
            :class="{
              warn: list === 2,
              danger: list === 3,
              none: list !== 2,
            }"
          >
            <h5 class="stretch-text">{{ rstName[i] }}</h5>
          </li>
          <li
            v-for="(list, i) in nutList"
            :key="i + 10"
            :class="{
              warn: list === 2,
              danger: list === 3,
              none: list !== 2,
            }"
          >
            <h5 class="stretch-text">
              {{ comphSm[i] }}
            </h5>
          </li>
          <li
            v-for="(list, i) in rstData"
            :key="i + 1000"
            :class="{
              warn: list === 2,
              danger: list === 3,
              none: list !== 3,
            }"
          >
            <h5 class="stretch-text">{{ rstName[i] }}</h5>
          </li>
          <li
            v-for="(list, i) in nutList"
            :key="i + 10000"
            :class="{
              warn: list === 2,
              danger: list === 3,
              none: list !== 3,
            }"
          >
            <h5 class="stretch-text">
              {{ comphSm[i] }}
            </h5>
          </li>
          <!--  -->
        </ul>
      </div>
    </div>
    <!-- 신경 써야 할 건강 분야 -->
    <div class="right">
      <div class="title stretch-text">신경 써야 할 건강 분야</div>
      <div class="list stretch-text">
        <span v-for="(list, i) in dangerList" :key="i">{{ list }}</span>
        <span v-for="(list, i) in warnList" :key="i">{{ list }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
//1은 정상이고 0은 표시 안되게
import { com, comphSm, rst } from "@/assets/js/chart/rstText";
import {
  useClusterData
} from "@/assets/js/chart/graphData";

import { ref, computed, watch, onMounted, toRaw } from 'vue';
const { cluster_data,
  cluster_name_left,
  cluster_name_right } = useClusterData()
const props = defineProps({
  comph: Object,
  meal: Object,
  date: null,
  showButton: Boolean,
  hideList: Boolean,
  isSub: Boolean,
  recommendReport: null,
  userInfo: null,
  pdfScale: null,
});

const comphName = com;
const rstName = rst;
const clusterData = cluster_data;
const warnList = ref([]);
const dangerList = ref([]);

const recommendData = computed(() => {
  let rtn = null;
  if(props.recommendReport !== undefined) {
    rtn = props.recommendReport.resultDto;
  }
  return rtn;
});

const rstData = computed(() => {
  // console.log("meal", meal);
  const result = { ...props.meal.resultDto.myDataList[0] };
  const obj = {};
  for (let nut in rst) {
    obj[nut] = result[nut];
  }
  
  return obj;
});

//좋음 나쁜 숫자 카운팅
const count = computed(() => {
  
  const obj = { warn: 0, danger: 0, normal: 0 };
  for (let nut in rstData.value) {
    if (rstData.value[nut] === 2) {
      obj.warn++;
    } else if (rstData.value[nut] === 3) {
      obj.danger++;
    } else if (rstData.value[nut] === 1) {
      obj.normal++;
    }
  }

  for (let nut in nutList) {
    const value = props.comph.resultDto.myDataList[0][nut]; //0좋음 1 나쁨
    
    if (value === 0) {
      obj.normal++;
    } else if (value === 1) {
      obj.danger++;
    }
  }
  
  return obj;
});

const nutList = computed(() => {
  const obj = {};
  const result = { ...props.comph.resultDto.myDataList[0] };

  for (let nut in comphSm) {
    obj[nut] = result[nut];
  }
  return obj;
});

async function initSolutionReport() {
  prepareData();
  
  recommendData.value.MHN_CL.forEach((element, index) => {
    element.nodes = recommendData.value.MHN_NL.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    );

    element.nodes.forEach((elem) => {
      // console.log("elem", elem.Node_Category);
      //TODO NodeCategory가 없음.
      /* if (elem.Node_Category.includes("Core")) {
        elem.symbol = "circle";
        elem.symbolSize = 18;
      } */
    });
  });
  recommendData.value.MHN_CL = recommendData.value.MHN_CL.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace("CL_", "")) -
      Number(b.Cluster_ID.replace("CL_", ""))
    );
  });

  // 신경 써야 할 건강분야 계산
  recommendData.value.MHN_CL.forEach((element, index) => {
    // console.log("index", index, element);
    const name = getClusterName(index);
    let skip = false;

    if (props.userInfo.sex === 1 && name === "갱년기 여성건강") {
      //남
      skip = true;
    } else if (props.userInfo.sex === 2 && name === "전립선 건강") {
      //여
      skip = true;
    }
    //console.log("SKip", skip);

    if (skip === false) {
      switch (element.Cluster_State) {
        case 0:
        case 1:
          break;
        case 2: //warn
          warnList.value.push(name);

          break;
        case 3: //danger
          dangerList.value.push(name);
          break;
        case 4: //interest
          break;
      }
    }

    //console.log("dangerlist ", dangerList);
  });
}

async function prepareData() {
  //console.log("========================================================");
  recommendData.value.MHN_NCL = recommendData.value.MHN_NCL.filter(
    (val, idx) => {
      return (
        recommendData.value.MHN_NCL.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      ); //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );

  recommendData.value.MHN_NL = recommendData.value.MHN_NL.filter(
    (val, idx) => {
      return (
        recommendData.value.MHN_NL.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      ); //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );
  recommendData.value.MHN_NL.forEach((element) => {
    recommendData.value.MHN_NCL.forEach((element2, index) => {
      if (element.Node_ID === element2.Node_ID) {
        element.clusterInfo = element2;
        element.clusterIndex = index;
      }
    });
  });
  recommendData.value.MHN_NL.forEach((elem, index) => {
    elem.name = elem.Node_Name;
    elem.id = elem.Node_ID;

    elem.index = index;
  });

  recommendData.value.MHN_EL.forEach((elem) => {
    elem.name = elem.Edge_Name;
    elem.id = elem.Edge_ID;
    elem.source = elem.S_Node_ID;
    elem.target = elem.E_Node_ID;
  });

  recommendData.value.MHN_CL = recommendData.value.MHN_CL.filter(
    (val, idx) => {
      return (
        recommendData.value.MHN_CL.findIndex(
          (item) => item.Cluster_ID === val.Cluster_ID
        ) === idx
      ); //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  );

  recommendData.value.MHN_CL.forEach((element) => {
    element.nodes = recommendData.value.MHN_NL.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    );
  });

  recommendData.value.MHN_CL = recommendData.value.MHN_CL.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace("CL_", "")) -
      Number(b.Cluster_ID.replace("CL_", ""))
    );
  });
};

function getClusterName(index) {
  let name = "";
  cluster_name_left.forEach((element) => {
    if (element.index == index) return (name = element.name);
  });

  cluster_name_right.forEach((element) => {
    if (element.index == index) return (name = element.name);
  });

  return name;
}

function getDateStr(dateStr) {
  var yyyyMMdd = String(dateStr);
  var sYear = yyyyMMdd.substring(0, 4);
  var sMonth = yyyyMMdd.substring(4, 6);
  var sDate = yyyyMMdd.substring(6, 8);
  return sYear + "년 " + sMonth + "월 " + sDate + "일";
}

/* function next() {
  $emit("next");
}

function back() {
  $emit("back");
} */

onMounted(() => {
  initSolutionReport();
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/result.scss";
@import "@/assets/css/pdf/document.scss";
article {
  /* height: 100%; */

  padding-top: calc(30px + $header) !important;
  overflow: scroll;
  height: calc($vh);
  max-width: $target-width;
  margin: 0 auto;
}
.date {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}
h4 {
  color: #414042;
  text-align: center;
  font-size: 23px;
  font-family: Pretendard;
  font-weight: 500;

  /* margin-bottom: 31px; */
}
.recent {
  > h4 {
    font-size: 15px;
    font-weight: 500;
    color: #000;
    margin-bottom: 20px;
  }
}
.legend {
  //@include flex(flex-start);
  display: flex;
  justify-content: flex-start;
  gap: 17px;
  padding-right: 25px;
  margin-bottom: 12px;
  li {
    color: #54585b;
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    span {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #96999c;
      margin-right: 4px;
    }
  }
}

.check-list {
  > ul {
    /* @include flex(flex-start);
      gap: 15px 0px;
      justify-content: space-between;
      flex-wrap: wrap; */
    justify-content: flex-start;
    align-content: center;

    display: grid;
    /* @include flex(flex-start, flex-start); */
    /*
      24.01.04 주요요인이 3줄 이상으로 넘어가면서 화면이 틀어질 경우가 있을 시 아래를 수행한다.
      1. grid-auto-rows를 주석처리 후
      2. grid-template-rows를 복구
      3. grid-template-columns, grid-template-rows의 minmax 사이즈 조절이 필요
      현재 위 사항 처리 후 각각의 사이즈를 34 -> 30으로 수정한 상태
    */
    grid-template-columns: repeat(7, minmax(calc(30px * $pdf-scale), 1fr));
    /* grid-template-columns: repeat(auto-fit, calc(34px * $pdf-scale)); */

    //grid-auto-rows: 1fr;
    grid-template-rows: repeat(3, minmax(calc(30px * $pdf-scale), 1fr));

    /* grid-gap: auto; */
    /* align-content: space-evenly; */

    /* gap: calc(6.47px * $pdf-scale); */
    /* grid-row-gap: calc(1.47px * $pdf-scale); */

    width: calc(254px * $pdf-scale);
    height: calc(78px * $pdf-scale);
    max-height: calc(78px * $pdf-scale);
    /* margin: 0 auto; */
    margin: 0;
    padding-top: calc(7.5px * $pdf-scale); //240111 겹침문제 때문에 추가
    padding-left: calc(9.75px * $pdf-scale);
    padding-right: calc(9.75px * $pdf-scale);
    flex-wrap: wrap;

    /* margin-top: 8px; */
    /* margin-bottom: 12px; */
    li {
      flex: 1;
      align-self: center;
      justify-self: center;
      max-width: calc(34px * $pdf-scale);
      max-height: calc(34px * $pdf-scale);
      width: 100%;
      height: 100%;
      background: url("/img/pdf/res/status-normal.png") center center
        no-repeat;

      display: none !important;
      background-size: contain;
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      padding: calc(10px * $pdf-scale) calc(5px * $pdf-scale)
        calc(5px * $pdf-scale);

      h5 {
        text-align: center;
        font-size: calc(5px * $pdf-scale);
        font-weight: 400;
        color: #96999c;
        word-break: keep-all;
        /* transform: scale(0.5); */
      }
      &.warn {
        display: flex !important;
        background: url("/img/pdf/res/status-warn.png") center center
          no-repeat;
        background-size: contain;
        h5 {
          color: #dd961a;
        }
      }
      &.danger {
        display: flex !important;
        background: url("/img/pdf/res/status-danger.png") center center
          no-repeat;
        background-size: contain;
        h5 {
          color: #c0373f;
        }
      }

      &.none {
        display: none !important;
      }
    }
  }
  .liner {
    margin: 40px 0;
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #bababa;
    }
    h4 {
      color: $black;
      position: relative;
      margin: 0 auto;
      font-size: 15px;
      font-weight: 400;
      padding: 0 15px;
      background: $white;
      width: fit-content;
    }
  }
}

.divider {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 18px;

  hr {
    border-top: 0.3px solid #54585b;

    flex: 1;
  }

  div {
    width: 83px;
    line-height: 18px;
    text-align: center;

    color: #54585b;
    text-align: center;
    font-size: 15px;
    font-family: Pretendard;
  }
}

article {
  padding-top: 30px;
}
.card {
  margin-bottom: 0;
  padding-bottom: 8px;
}

.gap {
  flex: 1;
}
.content {
  //@include flex;
  display: flex;
  width: 100%;
  height: calc(94.59px * $pdf-scale);
  background-color: #eff7ef;
  border-bottom: calc(0.3px * $pdf-scale) solid #000;

  .title {
    padding-top: calc(4.32px * $pdf-scale);
    padding-left: calc(4.85px * $pdf-scale);
    font-size: calc(9px * $pdf-scale);
    font-weight: 500;
  }
}

.button-box {
  width: 100%;
  bottom: 0;
  align-self: center;
  /* justify-self: flex-end; */
}
.hide {
  opacity: 0;
  pointer-events: none;
}
.btn-next {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  border-radius: 16px;
  background: #fff;

  margin-bottom: 20px;

  color: #54585b;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  cursor: pointer;

  img {
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
  .solution-arrow {
    width: 23px;
    height: 9.9px;
    margin: 0;
    margin-left: 6.5px;
  }

  &:hover {
    background: rgba(196, 146, 109, 0.2);
  }
}
.left {
  /* width: calc(255px * $pdf-scale); */
  height: 100%;
  flex: 1;
  border-right: calc(0.5px * $pdf-scale) solid #000;
}

.right {
  width: calc(260px * $pdf-scale); //calc(92.21px * $pdf-scale);
  height: 100%;
  /* border-left: calc(0.3px * $pdf-scale) solid #000; */

  .list {
    font-size: calc(11px * $pdf-scale);
    padding-top: calc(17.08px * $pdf-scale);
    padding-left: calc(4.85px * $pdf-scale);
    padding-right: calc(4.85px * $pdf-scale);
    font-weight: 600;
    span {
      &:after {
        content: ", ";
      }
      &:last-child {
        &:after {
          content: "";
        }
      }
    }
  }
}
.none {
  display: none !important;
}
</style>
