<script setup>
import * as echarts from 'echarts'
import { ref, computed, watch, onMounted, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  pdfScale: {
    type: Number,
    default: 2
  },
  chartData: Object
})

const echart = ref(null)
const myChart = ref(null)

// Chart Design var
const colorDanger = '#FBC0BE66'
const colorWarning = '#FBDAB466'
const colorNormal = '#C5ECC466'

const minValue = ref(0)
const maxValue = ref(0)

const existWarn = ref(false)
const bottomDanger = ref(true)
const topDanger = ref(true)
const isReverse = ref(false)

const chartData = computed(() => {
  let data = {}

  if (props.chartData !== undefined) {
    data = props.chartData
  }
  return data
})

const markArea = computed(() => {
  const markArea = {
    itemStyle: { color: 'red' },
    data: []
  }

  if (chartData.value !== undefined) {
    console.log(chartData.value)
    
    // HDL 전용 처리 (높을수록 좋음)
    if (chartData.value.variable === 'HDL') {
      existWarn.value = true
      bottomDanger.value = true
      topDanger.value = false
      isReverse.value = true
      
      // 위험 영역 (0~40) - 빨간색
      markArea.data.push([
        {
          coord: [0, chartData.value.danger_range_min],
          itemStyle: { color: colorDanger },
          name: Number(parseFloat(chartData.value.danger_range_max).toFixed(1)),
          label: {
            show: true,
            fontSize: 6 * props.pdfScale,
            position: ['-5%', '0%'],
            align: 'right',
            verticalAlign: 'center'
          }
        },
        { coord: [100, chartData.value.danger_range_max] }
      ])
      
      // 주의 영역 (40~51.33564) - 노란색
      markArea.data.push([
        {
          coord: [0, chartData.value.warning_range_min],
          itemStyle: { color: colorWarning },
          name: Number(parseFloat(chartData.value.warning_range_max).toFixed(1)),
          label: {
            show: true,
            fontSize: 6 * props.pdfScale,
            position: ['-5%', '0%'],
            align: 'right',
            verticalAlign: 'center'
          }
        },
        { coord: [100, chartData.value.warning_range_max] }
      ])
      
      // 정상 영역 (51.33564~80) - 초록색
      markArea.data.push([
        {
          coord: [0, chartData.value.normal_range_min],
          itemStyle: { color: colorNormal }
        },
        { coord: [100, chartData.value.normal_range_max] }
      ])
      
      minValue.value = chartData.value.range_min - 50
      maxValue.value = chartData.value.range_max + 10
    } 
    // 다른 항목들 처리 (낮을수록 좋음)
    else {
      // 안전구역이 중간에 있을경우. normal_range_min,max값 위치에 위험막대 표시. 주의표시는 없다
      if (
        (chartData.value.normal_range_max !== 9999 && chartData.value.danger_range_min <= chartData.value.normal_range_min &&
        chartData.value.normal_range_min !== 0)
      ) {
        existWarn.value = false
        bottomDanger.value = true
        topDanger.value = true

        minValue.value =
          chartData.value.normal_range_min -
          (chartData.value.normal_range_max - chartData.value.normal_range_min)

        maxValue.value =
          chartData.value.normal_range_max +
          (chartData.value.normal_range_max - chartData.value.normal_range_min)

        // 아래쪽 위험
        markArea.data.push([
          {
            coord: [0, chartData.value.range_min],
            itemStyle: { color: colorDanger },
            name: Number(parseFloat(chartData.value.normal_range_min).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ['-5%', '0%'],
              align: 'right',
              verticalAlign: 'center'
            }
          },
          { coord: [100, chartData.value.normal_range_min] }
        ])
        // 위쪽 위험
        markArea.data.push([
          {
            coord: [0, chartData.value.warning_range_min ? chartData.value.warning_range_min : chartData.value.normal_range_max],
            itemStyle: { color: colorDanger },
            name: Number(parseFloat(chartData.value.normal_range_max).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ['-5%', '100%'],
              align: 'right',
              verticalAlign: 'center'
            }
          },
          { coord: [100, chartData.value.range_max] }
        ])
      }
      // 주의 표시가 없고 위험만 존재
      else if (chartData.value.warning_range_min === chartData.value.warning_range_max) {
        if (chartData.value.danger_range_min < chartData.value.normal_range_min) {
          bottomDanger.value = true
          isReverse.value = true
          markArea.data.push([
            {
              coord: [0, chartData.value.danger_range_min],
              itemStyle: {
                color: colorDanger
              },
              name: Number(parseFloat(chartData.value.normal_range_min).toFixed(1)),
              label: {
                show: true,
                fontSize: 6 * props.pdfScale,
                position: ['-10%', '0%'],
                verticalAlign: 'center'
              }
            },
            { coord: [100, chartData.value.danger_range_max] }
          ])
          minValue.value =
            chartData.value.danger_range_min -
            (chartData.value.danger_range_max - chartData.value.danger_range_min)

          maxValue.value = chartData.value.range_max
        } else if (chartData.value.danger_range_min === chartData.value.danger_range_max) {
        } else {
          topDanger.value = true
          markArea.data.push([
            {
              coord: [0, chartData.value.danger_range_min],
              itemStyle: { color: colorDanger },
              name: Number(parseFloat(chartData.value.danger_range_min).toFixed(0)),
              label: {
                show: true,
                fontSize: 6 * props.pdfScale,
                position: ['-15%', '105%'],
                verticalAlign: 'center'
              }
            },
            { coord: [100, chartData.value.danger_range_max] }
          ])
        }
        existWarn.value = false

        minValue.value = chartData.value.range_min

        maxValue.value =
          chartData.value.normal_range_max +
          (chartData.value.normal_range_max - chartData.value.normal_range_min)
      }
      // 주의 위험 모두 존재
      else {
        existWarn.value = true
        markArea.data.push([
          {
            coord: [0, chartData.value.danger_range_min],
            itemStyle: { color: colorDanger },
            name: parseInt(chartData.value.danger_range_min),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ['-5%', '95%'],
              align: 'right',
              verticalAlign: 'center'
            }
          },
          { coord: [100, chartData.value.danger_range_max] }
        ])
        markArea.data.push([
          {
            coord: [0, chartData.value.warning_range_min],
            itemStyle: { color: colorWarning },
            name: Number(parseFloat(chartData.value.warning_range_min).toFixed(1)),
            label: {
              show: true,
              fontSize: 6 * props.pdfScale,
              position: ['-5%', '105%'],
              align: 'right',
              verticalAlign: 'center'
            }
          },
          { coord: [100, chartData.value.danger_range_min ? chartData.value.danger_range_min : chartData.value.warning_range_max] }
        ])
        // 정방향
        if (chartData.value.warning_range_max < chartData.value.danger_range_max) {
          topDanger.value = true
        }
        // 역방향
        else {
          isReverse.value = true
          bottomDanger.value = true
        }

        minValue.value =
          chartData.value.warning_range_min -
          (chartData.value.warning_range_max - chartData.value.warning_range_min)

        maxValue.value =
          chartData.value.warning_range_max +
          (chartData.value.warning_range_max - chartData.value.warning_range_min)
      }

      minValue.value -= 20

      if (minValue.value < chartData.value.range_min) minValue.value = chartData.value.range_min

      if (maxValue.value > chartData.value.range_max) maxValue.value = chartData.value.range_max

      // 안전 영역 (다른 항목들)
      markArea.data.push([
        {
          coord: [0, chartData.value.normal_range_min],
          itemStyle: { color: colorNormal }
        },
        { coord: [100, chartData.value.warning_range_min ? chartData.value.warning_range_min : chartData.value.normal_range_max] }
      ])
    }
  }

  return markArea
})

onMounted(() => {
  const dataArr = []
  const dateArr = []

  let min = 10000
  let max = -10000
  let needDummy = false
  let dateCount

  let val

  // 데이터가 하나일 경우 좌우로 더미데이터가 존재해야 그래프가 제대로 노출됨
  if (chartData.value.dateList.length <= 1) {
    needDummy = true
    dateArr.push('')
  }

  dateCount = dateArr.length

  chartData.value.valueList.forEach((item) => {
    if (item < min && item !== 0) {
      min = item
    }
    if (item > max) max = item
  })

  chartData.value.valueList.forEach((item) => {
    val = Number(parseFloat(item).toFixed(1))

    if (needDummy) {
      dataArr.push({
        value: val,
        itemStyle: { color: 'transparent' },
        label: { show: false }
      })
      dataArr.push({
        value: val,
        name: val
      })
      dataArr.push({
        value: val,
        name: val,
        itemStyle: { color: 'transparent' },
        label: { show: false }
      })
    } else {
      dataArr.push({
        value: val,
        name: val
      })
    }
  })

  chartData.value.dateList.forEach((item) => {
    dateArr.push(item)// need Index?
  })

  if (needDummy) {
    dateArr.push('')
  }

  const option = {
    grid: {
      show: true,
      left: '6.6%',
      right: '11%',
      bottom: '0',
      top: '8%',
      containLabel: true,
      backgroundColor: 'transparent'
    },

    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: dateArr,

      name: t('AnalyzeCheckupDataRecordChart.date'),
      nameTextStyle: {
        fontSize: 6.5 * props.pdfScale,
        color: '#555',
        padding: [0, 0, 0, -3 * props.pdfScale]
      },

      axisLine: {
        show: true,
        lineStyle: {
          width: 1 * props.pdfScale,
          color: '#9FA0A0'
        }
      },
      axisLabel: {
        // fontSize: 12 * props.pdfScale,
        margin: 3 * props.pdfScale,
        fontFamily: 'RixSinHead_Bold !important',
        // inside: false,
        formatter: (d, index) => {
          if (d === '' || d === null || d === undefined) return ''
          
          let str = ''
          if (d === '-') {
            str = d
          } else {
            // 안전한 날짜 포맷팅
            const formatDate = (dateStr) => {
              try {
                // 문자열로 변환하고 점, 슬래시, 공백 제거
                const cleanDate = String(dateStr).replace(/[.\/\s]/g, '')
                
                // 8자리 YYYYMMDD 형식인지 확인
                if (!/^\d{8}$/.test(cleanDate)) {
                  console.warn('Invalid date format:', dateStr)
                  return dateStr // 원본 반환
                }
                
                // 년, 월, 일 추출
                const year = cleanDate.substring(2, 4)
                const month = cleanDate.substring(4, 6)
                const date = cleanDate.substring(6, 8)
                
                return `${year}.${month}.${date}`
              } catch (error) {
                console.error('Date formatting error:', error, 'Input:', dateStr)
                return dateStr // 원본 반환
              }
            }
            
            str = formatDate(d)
          }

          // 스타일 적용
          if (index === dateArr.length - 1 && d !== '-') {
            return '{last|' + str + '}'
          } else if (dateCount - 1 === index) {
            return '{last|' + str + '}'
          } else {
            return '{normal|' + str + '}'
          }
        },
        rich: { /* 231219 x좌표 축 숫자들 */
          last: {
            color: '#54585B',
            fontSize: 6.5 * props.pdfScale,
            fontWeight: 500
          },
          normal: {
            color: '#54585B',
            fontSize: 6.5 * props.pdfScale,
            // opacity: 0.6,
            fontWeight: 400
          }
        },
        interval: 0,

        rotate: -90 // If the label names are too long you can manage this by rotating the label.
      }
    },
    yAxis: {
        type: 'value',
        show: true,
        name: t('AnalyzeCheckupDataRecordChart.resultValue'), /* 231219 y축 이름 */
        nameTextStyle: { /* 231219 y축 이름 스타일 */
          fontSize: 6.5 * props.pdfScale,
          color: '#555',
          padding: [6 * props.pdfScale, 0, -4 * props.pdfScale, -22 * props.pdfScale],
          align: 'left',
          verticalAlign: 'top',
        },
        min: chartData.value.variable === 'HDL' 
          ? Math.max(chartData.value.range_min, chartData.value.range_max)  // HDL인 경우 더 큰 값을 min으로 (y축 반전)
          : Math.min(chartData.value.range_min, chartData.value.range_max), // 다른 항목들은 더 작은 값을 min으로
        max: chartData.value.variable === 'HDL'
          ? Math.min(chartData.value.range_min, chartData.value.range_max)  // HDL인 경우 더 작은 값을 max로 (y축 반전)
          : Math.max(chartData.value.range_min, chartData.value.range_max), // 다른 항목들은 더 큰 값을 max로
      axisLabel: { /* 231219 y축 숫자 */
        show: true,
        showMaxLabel: false,
        formatter: (d) => {
          return parseInt(d)
        },
        fontSize: 12 * props.pdfScale,
        margin: 6.8 * props.pdfScale,
        color: 'transparent',
        fontFamily: 'RixSinHead_Bold !important',
        verticalAlign: 'bottom',
        // inside: false,
        align: 'left',
        rich: {
          normal: {
            fontFamily: 'RixSinHead_Bold !important',
            fontSize: 6.5 * props.pdfScale
          }
        }
      },

      axisLine: { /* 231219 축 */
        show: true,
        lineStyle: {
          width: 1 * props.pdfScale,
          color: '#9FA0A0'
        }
      },

      splitLine: { /* 231219 눈금 */
        show: false,
        lineStyle: {
          width: 1 * props.pdfScale
        }
      }

      // axisPointer: {
      //   label: {
      //     show: true,
      //     margin: 10,
      //   }
      // }

    },
    series: [ /* 231219 막대 */
      {
        animation: true,
        name: '',
        type: 'bar',
        data: dataArr,
        symbolSize: 14,
        silent: true,

        selectedMode: false,

        markArea: markArea.value,

        barWidth: 5 * props.pdfScale,

        itemStyle: {
          color: '#707070' /* 231219 막대 바 색 */
        },
        label: { /* 231219 막대 수치 */
          show: true,
          fontFamily: 'RixSinHead_Bold !important',
          fontSize: 6.5 * props.pdfScale,
          color: '#727171',
          position: 'top',
          fontWeight: 400,
          formatter: '{b}'
        }
      }
    ]
  }

  myChart.value = echarts.init(echart.value, null, {
    renderer: 'svg'
  })
  myChart.value.setOption(option)

  // console.log(toRaw(chartData.value))
})

</script>

<template>
  <div class="chart-wrap">
    <!-- <h3>{{ name }}</h3> -->
    <!-- <div class="y-axis stretch-text">결과값</div> -->
    <div class="chart" ref="echart" />
  </div>
</template>

<style scoped lang="scss">
.chart-wrap {
  width:100%;
  height:100%;
  min-height:50px;
}
.chart {
  width:100%;
  height:100%;
  /*min-height:280px;
  min-width:380px;*/
}
:deep(.chart > div) {
  @media (max-width: 960px) {
    margin: auto;
  }
}
</style>
