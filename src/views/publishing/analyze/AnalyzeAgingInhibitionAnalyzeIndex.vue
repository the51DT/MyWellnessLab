<script>
import BaseTooltip from '../BaseTooltip.vue'
import router from '@/router'
import { sendData } from '@/views/publishing/tempData'
import { computed, ref } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'AnalyzeAgingInhibitionAnalyzeIndex',
  components: {
    BaseTooltip
  },
  data () {
    return {
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 231204 툴팁 꼬다리 위치 */
      score: 75, /* 노화 억제 분석지수 점수 */
      grade: '보통 수준', /* 평균과 비교하여, 좋은수준/보통수준/나쁜수준 */
      age: 45, /* 사용자 만 나이 */
      total: 100, /* 몇명 중 */
      rank: 53 /* 등수 */
    }
  },
  setup () {
    const echart = ref(null)
    const myChart = ref(null)
    const widthValue = ref(4)
    const chartData = computed(() => {
      const obj = {
        score: 0,
        ages: 0,
        comparisonGroup: 100,
        ranking: 0
      }

      if (sendData.hqData !== undefined) {
        Object.assign(obj, sendData.hqData)

        obj.ages = parseInt(sendData.analyzeAge / 10) * 10
        if (obj.ages < 20) obj.ages = 20
        if (obj.ages > 80) obj.ages = 80

        obj.score = obj.OXI
        obj.rank = obj.OXI_PERC
      }

      return obj
    })
    function chartDraw () {
      this.myChart.setOption({
        series: [
          {
            z: 3,
            type: 'gauge',
            animation: true,
            startAngle: 90,
            endAngle: 450,
            min: 0,
            max: 100,
            radius: '92%',
            splitNumber: 12,
            itemStyle: {
              color: '#fff'
            },
            progress: {
              show: true,
              roundCap: true,
              width: widthValue.value,
              itemStyle: {
                borderWidth: widthValue.value * 1.1,
                borderColor: '#7ED47C'
              }
            },
            pointer: {
              show: true,
              icon: 'circle',
              length: '197%',
              width: widthValue.value * 4,
              offsetCenter: ['7%', '0%'],
              itemStyle: {
                borderWidth: widthValue.value * 2,
                borderColor: '#7ED47C'
              }
            },
            axisLine: {
              show: false,
              roundCap: true,
              lineStyle: {
                width: widthValue,
                color: [[1, '#EFEFEF']],
                shadowColor: 'red',
                shadowBlur: -100
              }
            },
            axisTick: {
              show: false,
              splitNumber: 2,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              show: false,
              length: 12,
              lineStyle: {
                width: 3,
                color: '#999'
              }
            },
            axisLabel: {
              show: false,
              distance: 30,
              color: '#999',
              fontSize: 20
            },
            title: {
              show: false
            },
            label: { show: false },
            detail: {
              show: false,
              backgroundColor: '#fff',
              borderColor: '#999',
              borderWidth: 2,
              width: '60%',
              lineHeight: 40,
              height: 40,
              borderRadius: 8,
              offsetCenter: [0, '35%'],
              valueAnimation: true,
              formatter: function (value) {
                return '{value|' + value.toFixed(0) + '}{unit|명}'
              },
              rich: {
                value: {
                  fontSize: 50,
                  fontWeight: 'bolder',
                  color: '#777'
                },
                unit: {
                  fontSize: 20,
                  color: '#999',
                  padding: [0, 0, -20, 10]
                }
              }
            },
            data: [{ value: chartData.value.score }]
          }
        ]
      })
    }

    return {
      echart,
      myChart,
      chartDraw
    }
  },
  computed: {
    ages () { /* 나이대 계산 */
      const tempAge = String(this.age)
      return tempAge.slice(0, tempAge.length - 1) + 0
    }
  },
  methods: {
    tooltipClose () { /* 툴팁 닫기 */
      this.tooltip = false
    },
    openTooltip ($event) { /* 툴팁 열기 */
      this.tooltip = true
      this.tooltipEdge = $event.x
    },
    go () {
      router.push('/publishing/analyze/analyze-aging-inhibition-analyze-index-detail')
    }
  },
  mounted () {
    this.myChart = echarts.init(this.echart, null, {})
    this.chartDraw()
  }
}
</script>

<template>
  <div class="AnalyzeAgingInhibitionAnalyzeIndex"> <!--노화 억제 분석 지수-->
    <div class="tooltip AnalyzeAgingInhibitionAnalyzeIndex--tooltip">
      <h2 class="tooltip--tit AnalyzeAgingInhibitionAnalyzeIndex--tip-tit">노화 억제 분석 지수</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeAgingInhibitionAnalyzeIndex--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeAgingInhibitionAnalyzeIndex--tip-dom">
        <template v-slot:contents>
          <p class="AnalyzeAgingInhibitionAnalyzeIndex--tip-txt">노화 억제 분석 지수는 나의 몸이 산화 스트레스로부터 보호하는 능력을 100점 척도로 평가한 점수입니다
            나의 점수를 확인해 보세요</p>
        </template>
      </base-tooltip>

    </div>
    <div class="analyze-box">
      <p class="AnalyzeAgingInhibitionAnalyzeIndex--info">노화 억제 분석지수는
        <strong class="AnalyzeAgingInhibitionAnalyzeIndex--score">{{ score }}점</strong>이며, 50대 남성 평균과 비교하여
        <strong class="AnalyzeAgingInhibitionAnalyzeIndex--grade">{{ grade }}</strong>입니다
      </p>

      <div class="AnalyzeAgingInhibitionAnalyzeIndex--graph"> <!--그래프-->

        <div class="AnalyzeAgingInhibitionAnalyzeIndex--circle">
          <div class="echart scoreCom" ref="echart" />
          <div class="AnalyzeAgingInhibitionAnalyzeIndex--summary">
            <div class="AnalyzeAgingInhibitionAnalyzeIndex--rank-wrap">
              <div class="AnalyzeAgingInhibitionAnalyzeIndex--score-wrap">
                <strong class="AnalyzeAgingInhibitionAnalyzeIndex--sum-score">{{ score }}</strong>점
              </div>
              <div class="AnalyzeAgingInhibitionAnalyzeIndex--order">
                <span class="AnalyzeAgingInhibitionAnalyzeIndex--ages">{{ ages }}</span>대
                <span class="AnalyzeAgingInhibitionAnalyzeIndex--people">{{ total }}</span>명 중 <br />
              </div>
              <strong class="AnalyzeAgingInhibitionAnalyzeIndex--rank">{{ rank }}등</strong>
              <button @click="go" type="button" class="AnalyzeAgingInhibitionAnalyzeIndex--more-btn">자세히 보기</button>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.echart.scoreCom {
  /* 변경필요 */
  margin: 3rem auto 0;
  width: 27rem;
  height: 27rem;
}
</style>
