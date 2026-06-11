<script setup>
// 1은 정상이고 0은 표시 안되게
import { rstIntegratedAriStatus } from '@/assets/js/chart/rstText'
import { reactive, computed, onMounted } from 'vue'
import _ from 'lodash'

const props = defineProps({
  integratedAriStatus: Object,
  date: null,
  showButton: Boolean,
  hideList: Boolean,
  isSub: Boolean,
  recommendReport: null,
  userInfo: null,
  pdfScale: null
})

const rstName = rstIntegratedAriStatus

const needToCareList = reactive([])

const recommendData = computed(() => {
  let rtn = null

  if (props.recommendReport !== undefined) {
    rtn = props.recommendReport.resultDto
  }

  return rtn
})

const rstData = computed(() => {
  const res = orderByValue(props.integratedAriStatus, Object.keys(rstIntegratedAriStatus))
  return res
})

// 좋음 나쁜 숫자 카운팅
const count = computed(() => {
  const obj = {
    warn: 0,
    danger: 0,
    normal: 0
  }

  for (const data of rstData.value) {
    if (data.status === 2) {
      obj.warn++
    } else if (data.status === 3) {
      obj.danger++
    } else if (data.status === 1) {
      obj.normal++
    }
  }

  return obj
})
/**
 * 입력받은 object의 밸류를 status desc, keys의 인덱스 asc로 정렬한 배열로 반환
 *
 * @param {*} targetObj
 * @param {*} keys
 * @returns {*} - ordered data
 */
function orderByValue (targetObj, keys) {
  const data = []
  for (const key in targetObj) {
    data.push({
      key,
      ...targetObj[key],
      index: keys.indexOf(key)
    })
  }
  const res = _.orderBy(data.filter(e => e.status > 1), ['status', 'index'], ['desc', 'asc'])
  return res
}

/**
 * 차트 생성
 */
async function initSolutionReport () {
  prepareData()

  recommendData.value.MHN_CL.forEach((element, index) => {
    element.nodes = recommendData.value.MHN_NL.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    )
  })

  // needToCareList
  _.orderBy(recommendData.value.MHN_CL.filter(e => e.Cluster_State > 1), ['Cluster_State'], ['desc']).forEach(e => {
    needToCareList.push(e.Cluster_NAME)
  })
}

/**
 * 차트 데이터 생성
 */
async function prepareData () {
  // console.log("========================================================");
  recommendData.value.MHN_NCL = recommendData.value.MHN_NCL.filter(
    (val, idx) => {
      return (
        recommendData.value.MHN_NCL.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  )

  recommendData.value.MHN_NL = recommendData.value.MHN_NL.filter(
    (val, idx) => {
      return (
        recommendData.value.MHN_NL.findIndex(
          (item) => item.Node_ID === val.Node_ID
        ) === idx
      ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  )
  recommendData.value.MHN_NL.forEach((element) => {
    recommendData.value.MHN_NCL.forEach((element2, index) => {
      if (element.Node_ID === element2.Node_ID) {
        element.clusterInfo = element2
        element.clusterIndex = index
      }
    })
  })
  recommendData.value.MHN_NL.forEach((elem, index) => {
    elem.name = elem.Node_Name
    elem.id = elem.Node_ID

    elem.index = index
  })

  recommendData.value.MHN_EL.forEach((elem) => {
    elem.name = elem.Edge_Name
    elem.id = elem.Edge_ID
    elem.source = elem.S_Node_ID
    elem.target = elem.E_Node_ID
  })

  recommendData.value.MHN_CL = recommendData.value.MHN_CL.filter(
    (val, idx) => {
      return (
        recommendData.value.MHN_CL.findIndex(
          (item) => item.Cluster_ID === val.Cluster_ID
        ) === idx
      ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    }
  )

  recommendData.value.MHN_CL.forEach((element) => {
    element.nodes = recommendData.value.MHN_NL.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    )
  })

  recommendData.value.MHN_CL = recommendData.value.MHN_CL.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace('CL_', '')) -
        Number(b.Cluster_ID.replace('CL_', ''))
    )
  })
}

/**
 * 클러스터 네임 찾기
 * @param {*} index
 */
function getClusterName (index) {
  let name = ''
  cluster_name_left.forEach((element) => {
    if (element.index == index) return (name = element.name)
  })

  cluster_name_right.forEach((element) => {
    if (element.index == index) return (name = element.name)
  })

  return name
}

/**
 * color 세팅
 * @param {*} val
 */
const getColor = (val) => {
  let rst = ''

  switch (val) {
    case 2:
      rst = 'warn'
      break
    case 3:
      rst = 'danger'
      break
    default:
      break
  }

  return rst
}

onMounted(() => {
  initSolutionReport()
})
</script>

<template>
  <!-- <div class="date">{{ date }}</div> -->
  <div class="content">
    <div class="left">
      <div class="title stretch-text">{{ $t('ResultFifthDocument.text1') }}</div>

      <!-- 주요 건강 위험 요인 -->
      <div
        class="check-list major"
        :class="{ hide: hideList }"
        v-if="count.warn > 0 || count.danger > 0">
        <ul>
          <li
            v-for="(list, i) of rstData"
            :key="i"
            :class="getColor(list.status)">
            <h5 class="stretch-text">{{ rstName[list.key] }}</h5>
          </li>
          <!--  -->
        </ul>
      </div>
    </div>
    <!-- 신경 써야 할 건강 분야 -->
    <div class="right">
      <div class="title stretch-text">{{ $t('ResultFifthDocument.text2') }}</div>
      <div class="list stretch-text">
        <span v-for="(list, i) of needToCareList" :key="i">{{ list }}</span>
      </div>
    </div>
  </div>
</template>

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
    align-content: flex-start;

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
    //padding-top: calc(7.5px * $pdf-scale); //240111 겹침문제 때문에 추가
    //padding-top: calc(17px * $pdf-scale);
    padding-top: calc(3px * $pdf-scale);
    padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    flex-wrap: wrap;

    /* margin-top: 8px; */
    /* margin-bottom: 12px; */
    li {
      //flex: 1;
      align-self: center;
      justify-self: center;
      //max-width: calc(34px * $pdf-scale);
      //max-height: calc(34px * $pdf-scale);
      //width: 100%;
      //height: 100%;
      background: url("/img/pdf/res/status-normal.svg") left center
        no-repeat;
      background-size: calc(11px * $pdf-scale);
      display: none !important;
      //background-size: contain;
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      padding: calc(0.8px * $pdf-scale) calc(7px * $pdf-scale)
        calc(0.8px * $pdf-scale) calc(12px * $pdf-scale);

      h5 {
        text-align: center;
        font-size: calc(9px * $pdf-scale);
        font-weight: 400;
        color: #96999c;
        word-break: keep-all;
        /* transform: scale(0.5); */
      }
      &.warn {
        display: flex !important;
        background-image: url("/img/pdf/res/status-warn.svg");
        //background-size: contain;
        h5 {
          color: #dd961a;
        }
      }
      &.danger {
        display: flex !important;
        background-image: url("/img/pdf/res/status-danger.svg");
        background-position-y: 46%;
        //background-size: contain;
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
  &.major{ /*240117 pdf에서 가운데 정렬 요청이 와서 가로, 세로 가운데 정렬 처리*/
    > ul {
      justify-content: flex-start;
      display: flex;
      width: auto;
      margin: auto;
      //padding-top: calc(15px * $pdf-scale);
      padding-bottom: calc(7.5px * $pdf-scale);
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
  //border-right: calc(0.5px * $pdf-scale) solid #000;
  border-style: solid;
  border-color: #777;
  border-width: 0 calc(0.5px * $pdf-scale) 0 0;
}

.right {
  width: calc(260px * $pdf-scale); //calc(92.21px * $pdf-scale);
  height: 100%;
  /* border-left: calc(0.3px * $pdf-scale) solid #000; */

  .list {
    //font-size: calc(11px * $pdf-scale);
    font-size: calc(9.8px * $pdf-scale);
    //padding-top: calc(17.08px * $pdf-scale);
    padding-top: calc(3px * $pdf-scale);
    padding-left: calc(4.85px * $pdf-scale);
    padding-right: calc(4.85px * $pdf-scale);
    font-weight: 600;
    line-height: 1.43;
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
