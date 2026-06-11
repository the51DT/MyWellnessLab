<script setup>
import * as echarts from 'echarts'
import { ref, computed, getCurrentInstance, onMounted, onUnmounted, toRaw } from 'vue'
import { mwlRound, bodyScroll } from '@/assets/js/common'
import _ from 'lodash'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  sendData: Object,
  ageArea: null
})


const instance = getCurrentInstance()

// chart var
const echart = ref(null)
const myChart = ref(null)

const dataSize = computed(() => {
  let size = 0

  if (props.sendData.hqDataList !== undefined) {
    size = props.sendData.hqDataList.length
  }

  return size
})
const chartMaxSize = 5
const dataPaging = ref(1)
const totalPaging = computed(() => {
  let page = 1

  if (dataSize.value > chartMaxSize) {
    const lest = dataSize.value / chartMaxSize
    if (Number.isInteger(lest)) {
      page = lest
    } else {
      page = parseInt(lest) + 1
    }
  }

  return page
})

const defData = computed(() => {
  let data = null
  if (props.sendData.hqDataList !== undefined) {
    data = _.orderBy(props.sendData.hqDataList, ['analysedDate'], ['desc'])
  }
  dataSize.value = data.length
  return data
})

const dateData = computed(() => {
  const arr = []
  let prevDate
  let date
  let dupCnt

  if (defData.value != null) {
    defData.value.forEach((item, index) => {
      date = item.analysedDate

      if ((index >= ((dataPaging.value - 1) * chartMaxSize)) && (index < (dataPaging.value * chartMaxSize))) {
        // 310번 -> 노화속도 관련 하루에 결과값 두번 입력 시(데이터 연동/ 수기입력) 그래프에서 구분가능하도록 수정
        // if (date === prevDate) {
        //   date = date.concat(`(${++dupCnt})`)
        // } else {
        //   dupCnt = 0
        // }
        arr.push(date)
        prevDate = item.analysedDate
      }
    })
  }
  
  // 데이터가 하나일 때 점선을 위해 3개로 확장 (앞뒤는 빈 값)
  if (arr.length === 1) {
    arr.unshift('')  // 앞에 빈 값 추가
    arr.push('')     // 뒤에 빈 값 추가
  }
  
  arr.reverse() /* 240127 as8t 기획에 보면 그래프가 우측부터 최근 순으로 나오도록 처리 */
  return arr
})

const myData = computed(() => {
  const arr = []
  if (defData.value != null) {
    defData.value.forEach((item, index) => {
      if ((index >= ((dataPaging.value - 1) * chartMaxSize)) && (index < (dataPaging.value * chartMaxSize))) {
        // arr.push( ((Math.random())).toFixed(1) )//TEMP
        arr.push(item.AgingRate)
      }
    })
  }
  
  // 데이터가 하나일 때 점선을 위해 3개로 확장 (앞뒤는 null)
  if (arr.length === 1) {
    arr.unshift(null)  // 앞에 null 추가
    arr.push(null)     // 뒤에 null 추가
  }
  
  arr.reverse() /* 240127 as8t 기획에 보면 그래프가 우측부터 최근 순으로 나오도록 처리 */
  return arr
})

const averageData = computed(() => {
  const arr = []

  if (defData.value != null) {
    defData.value.forEach((item, index) => {
      if ((index >= ((dataPaging.value - 1) * chartMaxSize)) && (index < (dataPaging.value * chartMaxSize))) {
        arr.push(1)
      }
    })
  }
  
  // 데이터가 하나일 때 점선을 위해 3개로 확장 (앞뒤는 같은 값)
  if (arr.length === 1) {
    arr.unshift(arr[0])  // 앞에 같은 값 추가
    arr.push(arr[0])     // 뒤에 같은 값 추가
  }
  
  arr.reverse() /* 240127 as8t 기획에 보면 그래프가 우측부터 최근 순으로 나오도록 처리 */
  return arr
})

const gender = computed(() => {
  return props.sendData.basics.sex === 1 ? t('Common.male') : t('Common.female')
})

/**
 * 이전 차트 데이터 생성
 */
function prev () {
  if (dataPaging.value > 1) {
    dataPaging.value--
    setChartData()
  }
}

/**
 * 다음 차트 데이터 생성
 */
function next () {
  if (dataPaging.value < totalPaging.value) {
    dataPaging.value++
    setChartData()
  }
}

const chartOption = getOption()

/**
 * 차트 옵션 생성
 * @return {object} - 차트옵션
 */
function getOption () {
  return {
    grid: {
      show: true,
      width: 'auto',
      height: 'auto',
      backgroundColor: 'white',
      top: 0, /* 231222 컨테이너와 그리드 사이 간격 */
      right: 8, /* 231222 컨테이너와 그리드 사이 간격 */
      bottom: 80, /* 231222 컨테이너와 그리드 사이 간격 */
      left: 4, /* 231222 컨테이너와 그리드 사이 간격 */
      borderColor: {
        left: 'white',
        bottom: '#B2B2B2'
      },
      borderWidth: {
        top: 0,
        right: 1,
        bottom: 1,
        left: 0
      }
    },
    tooltip: {
      /* trigger: 'axis',
      //triggerOn:'click',
      axisPointer: {
        type:'line',
        axis:'x',
        label: {
          show:true,
          //color:'#333333'
        }
      },
      backgroundColor: 'rgba(30, 30, 30, 0.1)',
      position: function (pos, params, el, elRect, size) {
        console.log(pos)
        var obj = {top:10}
        obj[['left', 'right',][pos[0]]] = 30;
        return obj;
      }, */
      trigger: 'item',
      formatter: (params) => {
        console.log(params.data)
        return 'x' + mwlRound(params.data, 2)
      }
    },
    // title: {
    //   text: '나의 변화'
    // },
    // legend: {
    //   data: ['나의 지수', '평균 지수']
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateData.value,
      splitLine: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: '#B2B2B2'
          // type: "dashed",
        }
      },
      axisLabel: {
        color: '#555555',
        fontSize: 14,
        rotate: -90
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      // boundaryGap: [0, '100%'],
      position: 'right',
      splitNumber: 10,
      min: 0,
      max: 2.5,
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        show: false,
        fontSize: 14,
        formatter: '{value}'
      }
    },
    /* dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: (myData.value.length > 3 ? 50 : 100),
        //zoomOnMouseWheel: false
      },
    ], */
    series: [
      {
        name: t('AnalyzeAgingSpeedDetailPopup.text1'),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        // coordinateSystem:'cartesian2d',
        // coordinateSystem:'polar',
        sampling: 'lttb',
        data: myData.value,
        itemStyle: {
          color: '#7E7EFF'
        },
        lineStyle: {
          width: 1,
          color: '#7E7EFF'
        }
      },
      {
        name: t('AnalyzeAgingSpeedDetailPopup.text1'),
        type: 'line',
        // symbol: 'diamond',
        symbolSize: 10,
        // coordinateSystem:'cartesian2d',
        // coordinateSystem:'polar',
        sampling: 'lttb',
        smooth: true, /* 231222 라인을 곡선으로 */
        symbol: 'none', /* 231222 값 포인트를 보이게 안보이게 */
        itemStyle: {
          color: 'rgb(99, 99, 99)'
        },
        lineStyle: {
          type: 'dashed',
          color: '#7E7E7E',
          width: 1
        },
        data: averageData.value
      }
    ]
  }
}

/**
 * 차트 데이터 저장
 */
function setChartData () {
  const option = getOption()

  /* option.xAxis.data = dateData.value;
  option.series[0].data = myData.value;
  option.series[1].data = averageData.value; */

  myChart.value.setOption(option)
}

/**
 * 팝업 종료
 */
function close () {
  instance.emit('popupClose')
}

onMounted(() => {
  bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
  myChart.value = echarts.init(echart.value)
  window.addEventListener('resize', myChart.value.resize)
  setChartData()
})

onUnmounted(() => {
  bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
})
</script>

<template>
  <div class="popup AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup">
    <div class="popup--wrap tit AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--popup-wrap">
      <div class="align--between popup--header AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--header">
        <div />
        <div class="popup--tit-wrap AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--tit-wrap">
          <span class="popup--tit AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--tit">{{ t('AnalyzeAgingSpeedDetailPopup.text3') }}</span>
        </div>
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--close">
          <button @click="close" type="button" class="popup--close AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--close-btn" />
        </div>
      </div>
      <div class="popup--space AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--space">
        <div class="echart smoothLine" ref="echart" />
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--max">x{{chartOption.yAxis.max}}</div>
        <div class="graph-back">
          <div class="legend">
            <div>
              <div class="line-gray" />
              <span class="legend--avarage">1.00{{ $t('AnalyzeAgingSpeedDetail.text2')}}</span>
              <!-- <span class="legend--avarage">{{ ageArea + $t('Common.age')  + " " + gender + " " +  $t('Common.average')}}</span> -->
              <div class="line-biolet" />
              <span>{{ t('AnalyzeAgingSpeedDetailPopup.text4') }}</span>
            </div>
          </div>
        </div>
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn-wrap">
          <button
            type="button"
            @click="next"
            :disabled="totalPaging === dataPaging"
            class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn prev"
            aria-label="$t('AnalyzeAgingSpeedDetailPopup.text5')" />
          <button
            type="button"
            @click="prev"
            :disabled="dataPaging === 1"
            class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn next"
            :aria-label="$t('Common.next')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.echart.smoothLine { /* 변경필요 */
  margin: 4rem auto 0;
  width: calc(100% - 4rem);
  max-width: 41rem;
  height: 45rem;
}
.graph-back {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  img {
    width: auto;
  }

  .legend {
    margin-left: -18px;

    font-size: 1.4rem;
    color: #777;
    text-align: left;
    font-family: "RixSinHead_Medium", sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    .name {
      margin-left: 0px;
    }

    div {
      display: inline-block;
      vertical-align: -8%;
    }

    span {
      margin: 0;
      margin-left: 5px;
    }

    .position {
      $size: 1.2rem;
      width: $size;
      height: $size;
      border-radius: $size;
      background-color: #7E7EFF;
      margin-left: 13px;
    }

    img {
      position: relative;
      width: 19px;
      height: auto;
      margin: 0;
      transform: translateX(0%);
    }

  }
}
.line-gray, .line-biolet{
  width: 30px;
  height: 7px;
  display: inline-block;
  border-top: dashed 2px #B2B2B2;
}
.line-biolet{
  border-top-color: #7E7EFF;
  border-top-style: solid;
  margin-left: 20px;
}
.AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn-wrap{
  margin-top: 30px;
}
</style>
