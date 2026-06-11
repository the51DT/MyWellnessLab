<script setup>
import { convertDateToYYYYMMDD } from '@/assets/js/chart/util'
import PageHeader from '../PageHeader.vue'
import BubbleChartDocumentLarge from '../BubbleChartDocumentLarge.vue'
import { tracking_hcr } from '@/assets/js/chart/rstText'

import { ref, computed, onMounted, toRaw } from 'vue'

const props = defineProps({
  save: Boolean,
  userInfo: null,
  check_date: null,
  comph: null,
  hcr: null,
  value: null,
  report_no: null,
  health: null
})

const singleData = ref(false)
const filteredData = computed(() => {
  let rtn = null

  if (props.hcr.resultDto !== undefined) {
    rtn = { ...props.hcr.resultDto }
  }
  return rtn
})

const date_recent = ref(null)
const date_old = ref(null)

const good = ref([])
const bad = ref([])

const old_code = ref(-1)
const current_code = ref(-1)

const old_index = ref(-1)
const current_index = ref(-1)

function calculateGoodBad () {
  good.value = []
  bad.value = []

  const current = filteredData.value.myHCR[current_index.value]

  if (singleData.value) {
    tracking_hcr.forEach((element) => {
      for (let i = 0; i < filteredData.value.refHCR.length; i++) {
        const item = filteredData.value.refHCR[i]
        if (
          item.variable === element.variables &&
          current[item.variable] !== 0
        ) {
          if (
            current[item.variable] > item.normal_range_max ||
            current[item.variable] < item.normal_range_min
          ) {
            bad.value.push(element)
          } else {
            good.value.push(element)
          }
        }
      }
    })
  } else {
    const old = filteredData.value.myHCR[old_index.value]
    tracking_hcr.forEach((element) => {
      for (let i = 0; i < filteredData.value.refHCR.length; i++) {
        const item = filteredData.value.refHCR[i]
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
              good.value.push(element)
            }
          }

          if (
            current[item.variable] > item.normal_range_max ||
            current[item.variable] < item.normal_range_min
          ) {
            // console.log("bad", current[item.variable]);

            bad.value.push(element)
          }
        }
      }
    })
  }
}

/**
 * join 기능 구현
 * @return {string}
 */
function getGoodString () {
  let text = ''
  good.value.forEach((element) => {
    if (text !== '') text += ', ' + element.name
    else text += element.name
  })
  return text
}

/**
 * join 기능 구현
 * @return {string}
 */
function getBadString () {
  let text = ''
  bad.value.forEach((element) => {
    if (text !== '') text += ', ' + element.name
    else text += element.name
  })
  return text
}

/**
 * 마운트시 실행부
 */
function exec () {
  // console.log("health", health, value);
  // filteredData.value = { ...props.hcr.resultDto };
  const checkDate = props.check_date.replace(/\./gi, '-')
  current_code.value = parseInt(props.report_no)
  filteredData.value.myHCR.forEach((element, i) => { // elem에 scode가 없기 때문에 수정
    if (element.check_date == checkDate) {
      current_index.value = i
    }
  })

  const currentDate = convertDateToYYYYMMDD(
    filteredData.value.myHCR[current_index.value].check_date,
    '.'
  )

  old_index.value = -1
  for (let i = current_index.value - 1; i >= 0; i--) {
    const old = filteredData.value.myHCR[i]

    if (
      old.check_date !==
      filteredData.value.myHCR[current_index.value].check_date
    ) {
      old_index.value = i
      break
    }
  }

  date_recent.value = currentDate

  if (
    filteredData.value.myHCR.length > 1 &&
    current_index.value > 0 &&
    old_index.value !== -1
  ) {
    console.log('index1', current_index.value)
    singleData.value = false

    date_old.value = filteredData.value.myHCR[old_index.value].check_date
      .substr(0, 10)
      .replaceAll('-', '.')
    old_code.value = filteredData.value.myHCR[old_index.value].s_code
  } else {
    singleData.value = true
  }

  calculateGoodBad()
}

onMounted(() => {
  exec()
})
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside bg">
      <PageHeader page="9" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-position.png" />

          <h3>{{ $t('Page10.text1') }}</h3>
        </div>
        <ul>
          <li>
            {{ $t('Page10.text2') }}
          </li>
          <br />
          <li>
            {{ $t('Page10.text3') }}
          </li>
          <br />
          <li>
            {{ $t('Page10.text4') }}
          </li>
          <br />
          <li>
            {{ $t('Page10.text5') }}
          </li>
        </ul>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3>[{{ $t('Page10.text6') }}]</h3>
          <div class="legend-container">
            <div class="legend1" />
            <span>{{ $t('Page10.text7') }}</span>
            <div class="legend2" />
            <span>{{ $t('Page10.text8') }}</span>
          </div>
        </div>
        <div class="data">
          <BubbleChartDocumentLarge
            :showPoint="false"
            :myValue="value"
            :chartData="health.resultDto.comDataList" />

          <img src="/img/pdf/res/graph-scatter-ex.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

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
