<script>
import { Chart, registerables } from 'chart.js'
import { computed, getCurrentInstance, ref } from 'vue'
import { sendData } from '@/views/publishing/tempData'
import _ from 'lodash'
import { mwlRound } from '@/assets/js/common'
import * as echarts from 'echarts'
Chart.register(...registerables)

export default {
  name: 'AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup',
  setup () {
    const instance = getCurrentInstance()
    const echart = ref(null)
    const myChart = ref(null)

    const dataSize = computed(() => {
      let size = 0

      if (sendData.hqDataList !== undefined) {
        size = sendData.hqDataList.length
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
      if (sendData.hqDataList !== undefined) {
        data = _.orderBy(sendData.hqDataList, ['analysedDate'], ['desc'])
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
            arr.push(date)
            prevDate = item.analysedDate
          }
        })
      }
      // console.log(arr)
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
      // console.log(arr)
      arr.reverse() /* 240127 as8t 기획에 보면 그래프가 우측부터 최근 순으로 나오도록 처리 */
      return arr
    })

    const gender = computed(() => {
      return sendData.basics.sex === 1 ? '남성' : '여성'
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
          trigger: 'item',
          formatter: (params) => {
            console.log(params.data)
            return 'x' + mwlRound(params.data, 2)
          }
        },
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
        series: [
          {
            name: '나의 지수',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
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
            name: '평균 지수',
            type: 'line',
            symbolSize: 10,
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

    function setChartData () {
      const option = getOption()

      myChart.value.setOption(option)
    }

    function close () {
      instance.emit('popupClose')
    }
    return {
      echart,
      myChart,
      dataSize,
      chartMaxSize,
      dataPaging,
      totalPaging,
      defData,
      dateData,
      myData,
      averageData,
      gender,
      prev,
      next,
      chartOption,
      getOption,
      setChartData,
      close
    }
  },
  mounted () {
    this.myChart = echarts.init(this.echart)
    window.addEventListener('resize', this.myChart.resize)
    this.setChartData()
  }
}
</script>

<template>
  <div class="popup AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup">
    <div class="popup--wrap tit AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--popup-wrap">
      <div class="align--between popup--header AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--header">
        <div />
        <div class="popup--tit-wrap AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--tit-wrap">
          <span class="popup--tit AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--tit">나의 변화</span>
        </div>
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--close"> <!--231212 클래스 삭제-->
          <button @click="close" type="button" class="popup--close AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--close-btn" /> <!--231212 x 삭제-->
        </div>
      </div>
      <div class="popup--space AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--space">
        <div class="echart smoothLine" ref="echart" />
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--max">100</div>
        <div class="graph-back">
          <div class="legend">
            <div>
              <div class="line-gray" />
              <span class="legend--avarage">50대 남성 평균</span>
              <div class="line-biolet" />
              <span>나의 위치</span>
            </div>
          </div>
        </div>
        <div class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn-wrap">
          <button type="button" class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn prev" aria-label="이전" />
          <button type="button" class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--btn next" aria-label="다음" />
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
