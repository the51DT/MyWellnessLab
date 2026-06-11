<script setup>
import * as echarts from 'echarts'
import { ref, computed, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { bodyScroll } from '@/assets/js/common'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const props = defineProps({
  compId: String,
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
    data = _.orderBy(
      props.sendData.hqDataList.filter(item => item.musYn === 'Y'), 
      ['analysedDate'], 
      ['desc']
    )
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
      if ((index >= ((dataPaging.value - 1) * chartMaxSize)) && (index < (dataPaging.value * chartMaxSize))) {
        date = item.analysedDate
        if (date === prevDate) {
          // date = date.concat(`(${++dupCnt})`)
        } else {
          dupCnt = 0
        }
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
  
  arr.reverse()
  return arr
})

const myData = computed(() => {
  const arr = []

  if (defData.value != null) {
    defData.value.forEach((item, index) => {
      if ((index >= ((dataPaging.value - 1) * chartMaxSize)) && (index < (dataPaging.value * chartMaxSize))) {
        switch (props.compId) {
          case 'AnalyzeAgingInhibitionAnalyzeIndex':
            arr.push(item.OXI.toFixed(0))
            break
          case 'AnalyzeChronicDiseaseControlAnalyzeIndex':
            arr.push(item.MET.toFixed(0))
            break
          case 'AnalyzeAgingSpeedAnalyzeIndex':
            arr.push(item.AgingRate.toFixed(0))
            break
          case 'AnalyzeMuscleBalanceAnalyzeIndex':
            arr.push(item.MUSBAL?.toFixed(0) || 0)
            break
          case 'AnalyzeDietIndex':
            arr.push(item.Rfs?.toFixed(0) || 0)
            break
          case 'AnalyzeExerciseIndex':
            arr.push(item.MusMass?.toFixed(0) || 0)
            break
          case 'AnalyzeSleepIndex':
            arr.push(item.ShScore?.toFixed(0) || 0)
            break
        }
      }
    })
  }
  
  // 데이터가 하나일 때 점선을 위해 3개로 확장 (앞뒤는 null)
  if (arr.length === 1) {
    arr.unshift(null)  // 앞에 null 추가
    arr.push(null)     // 뒤에 null 추가
  }
  
  arr.reverse()
  return arr
})

const averageData = computed(() => {
  const arr = []

  if (defData.value != null) {
    defData.value.forEach((item, index) => {
      if ((index >= ((dataPaging.value - 1) * chartMaxSize)) && (index < (dataPaging.value * chartMaxSize))) {
        switch (props.compId) {
          case 'AnalyzeAgingInhibitionAnalyzeIndex':
            arr.push(item.OXI_MEAN.toFixed(0))
            break
          case 'AnalyzeChronicDiseaseControlAnalyzeIndex':
            arr.push(item.MET_MEAN.toFixed(0))
            break
          case 'AnalyzeAgingSpeedAnalyzeIndex':
            arr.push(0.9)
            break
          case 'AnalyzeMuscleBalanceAnalyzeIndex':
            arr.push(item.MUSBAL_MEAN?.toFixed(0) || 50)
            break
          case 'AnalyzeDietIndex':
            arr.push(item.Rfs_MEAN?.toFixed(0) || 50)
            break
          case 'AnalyzeExerciseIndex':
            arr.push(item.MusMass_MEAN?.toFixed(0) || 50)
            break
          case 'AnalyzeSleepIndex':
            arr.push(item.ShScore_MEAN?.toFixed(0) || 50)
            break
        }
      }
    })
  }
  
  // 데이터가 하나일 때 점선을 위해 3개로 확장 (앞뒤는 같은 값)
  if (arr.length === 1) {
    arr.unshift(arr[0])  // 앞에 같은 값 추가
    arr.push(arr[0])     // 뒤에 같은 값 추가
  }
  
  arr.reverse()
  return arr
})

const gender = computed(() => {
  return props.sendData.basics.sex === 1 ? t('Common.male') : t('Common.female')
})

function prev () {
  if (dataPaging.value > 1) {
    dataPaging.value--
    setChartData()
  }
}

function next () {
  if (dataPaging.value < totalPaging.value) {
    dataPaging.value++
    setChartData()
  }
}

const chartOption = getOption()

/**
 * 차트 옵션 생성
 * @return {object} - 차트 옵션
 */
function getOption () {
  return {
    // backgroundColor: "white",
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
      trigger: 'item',
      formatter: (params) => {
        return params.data
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, /* 231222 최대값의 범위를 설정해 그래프를 확대, 축소하는 효과 */
      data: dateData.value,
      splitLine: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: '#B2B2B2'
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
      max: 100,
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
        name: t('AnalyzeAgingInhibitionAnalyzeIndexDetailPopup.text1'),
        type: 'line',
        // coordinateSystem:'cartesian2d',
        // coordinateSystem:'polar',
        sampling: 'lttb',
        smooth: true,
        symbol: 'circle', /* 231222 값이 있는 포인트의 점 모양 */
        symbolSize: 8, /* 231222 점 크기 */
        itemStyle: {
          color: '#7E7EFF'
        },
        data: myData.value,
        lineStyle: {
          width: 1,
          color: '#7E7EFF'
        }
      },
      {
        name: t('AnalyzeAgingInhibitionAnalyzeIndexDetailPopup.text2'),
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
  myChart.value = echarts.init(echart.value)

  window.addEventListener('resize', myChart.value.resize)
  setChartData()

  bodyScroll(false) /* 240110 팝업 노출 시 body 스크롤 정지 */
})

onUnmounted(() => {
  bodyScroll(true) /* 240110 팝업 삭제 시 body 스크롤 원복 */
})
</script>

<template>
  <!-- 체성분 나의 변화 개발 요망 -->
  <div class="popup AnalyzeAgingInhibitionAnalyzeIndexDetailPopup">
    <div class="popup--wrap tit AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--popup-wrap">
      <div class="align--between popup--header AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--header">
        <div />
        <div class="popup--tit-wrap AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--tit-wrap">
          <span class="popup--tit AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--tit">{{ $t('AnalyzeAgingInhibitionAnalyzeIndexDetailPopup.text3') }}</span>
        </div>
        <div class="AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--close">
          <button @click="close" type="button" class="popup--close AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--close-btn" />
        </div>
      </div>
      <div class="popup--space AnalyzeAgingInhibitionAnalyzeIndexDetailPopup--space">
        <div class="echart smoothLine" ref="echart" />
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--max">{{chartOption.yAxis.max}}</div>
        <div class="graph-back">
          <div class="legend">
            <div>
              <div class="line-gray" />
              <span class="legend--avarage">{{ ageArea + $t('Common.age')  + " " + gender + " " +  $t('Common.average')}}</span>
              <div class="line-biolet" />
              <span>{{ $t('AnalyzeAgingInhibitionAnalyzeIndexDetailPopup.text5') }}</span>
            </div>
          </div>
        </div>
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn-wrap">
          <button
            type="button"
            @click="next"
            :disabled="totalPaging === dataPaging"
            class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn prev"
            aria-label="이전" />
          <button
            type="button"
            @click="prev"
            :disabled="dataPaging === 1"
            class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn next"
            aria-label="다음" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.echart.smoothLine { /* 변경필요 */
  /*margin-top:20px;
  width: 100%;
  height: 70%;*/
  /*margin: 3rem 20px 3rem 20px;*/
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
