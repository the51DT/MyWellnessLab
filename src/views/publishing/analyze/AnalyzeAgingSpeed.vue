<script>
import BaseTooltip from '../BaseTooltip.vue'
import router from '@/router'
import AnalyzeAgingSpeedPop from '@/views/publishing/analyze/AnalyzeAgingSpeedPop.vue'
import { defineProps, ref } from 'vue'
import * as echarts from 'echarts' /* 231208 팝업이 길어서 따로 뺌 */
import { sendData } from '@/views/publishing/tempData'

export default {
  name: 'AnalyzeAgingSpeed',
  props: {
    isMain: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const echart = ref(null)
    const myChart = ref(null)
    const chartData = ref({
      score: 0, // 점수
      grade: '-', // 수준
      ages: 0, // 연령대 비교군
      comparisonGroup: 0, // 비교군 수
      ranking: 0 // 순위
    })
    function chartDraw () {
      this.myChart.setOption({
        tooltip: {
          show: false,
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: 'Pressure',
            type: 'gauge',
            radius: '100%',
            startAngle: props.isMain ? 180 : 135,
            endAngle: 0,
            min: 0.5,
            max: 2.5,
            itemStyle: {
              color: '#008352'
            },
            splitNumber: 0,
            splitLine: {
              show: false,
              distance: -30,
              length: 40,
              lineStyle: {
                color: '#000',
                width: 1
              }
            },
            axisTick: {
              splitNumber: 1,
              length: 124.5
            },
            pointer: {
              icon: 'triangle',
              length: '105%',
              width: 8,
              showAbobe: true,
              itemStyle: {
                color: '#646464'
              }
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 15,
              color: '#646464',
              borderColor: '#646464',
              itemStyle: {
                borderWidth: 5,
                color: '#fff',
                borderColor: '#646464'
              }
            },
            axisLabel: { show: false },
            detail: { show: false },
            axisLine: {
              lineStyle: {
                width: 0,
                color: [
                  [0.1, '#7ED47C'],
                  [0.2, '#A2C87A'],
                  [0.3, '#B4BD6D'],
                  [0.4, '#C9B05E'],
                  [0.5, '#DDA450'],
                  [0.6, '#F8B500'],
                  [0.7, '#F09B5A'],
                  [0.8, '#FC754B'],
                  [0.9, '#FA7458'],
                  [1, '#F87D7D']
                ]
              }
            },
            data: [{ value: 1.2 }]
          }
        ]
      })
    }
    function setChartData () {
      Object.assign(chartData.value, {}, sendData.hqData)
    }
    return {
      props,
      echart,
      myChart,
      chartData,
      chartDraw,
      setChartData
    }
  },
  components: {
    AnalyzeAgingSpeedPop,
    BaseTooltip
  }, /* 231208 콤포넌트 추가 */

  data () {
    return {
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 툴팁 꼬다리 위치 */
      speed: 1.42, /* 노화 속도 */
      description: '일반적인', /* 노화 속도 설명, 빠른/일반적인/느린 */
      target: 0.9, /* 목표 속도 */
      isPopupReason: false /* 팝업 오프너 */
      // 231208 오프너 변수 팝업 안으로 이동
    }
  },
  computed: {
    setSpeed () {
      return this.speed * 180 / 2.28
    },
    setTarget () {
      return this.target * 180 / 2.28
    },
    isAllReason () {
      return !this.isDangerReason
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
    detailView () { /* 자세히 보기 이동 */
      router.push('/publishing/analyze/analyze-aging-speed-detail')
    },
    popupReason () { /* 노화 속도 요인 팝업 */
      this.isPopupReason = true
    },
    popupClose () {
      this.isPopupReason = false
    }
    // 231208 탭 노출 함수 팝업 안으로 이동
  },
  mounted () {
    this.myChart = echarts.init(this.echart, null, {
      renderer: 'svg'
    })
    this.setChartData()
    this.chartDraw()
  }
}
</script>

<template>
  <div class="AnalyzeAgingSpeed" :class="isMain ? 'home' : ''"> <!--노화 억제 분석 지수-->
    <div class="tooltip AnalyzeAgingSpeed--tooltip" v-if="!props.isMain">
      <h2 class="tooltip--tit AnalyzeAgingSpeed--tip-tit">노화 속도</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeAgingSpeed--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeAgingSpeed--tip-dom">
        <template v-slot:contents>
          <p class="AnalyzeAgingSpeed--tip-txt">노화 속도는 노화 억제 분석 지수 및 만성질환 억제 분석 지수를 결합한 점수와 실제 나이 사이의 관계를 바탕으로 산출된
            값입니다<br /> 건강하게 나이 드는 것에 대한 기준으로 보통의 노화 속도인 1.0배속보다 느린 0.9배속 이하로 노화 속도를 목표합니다 나의 노화 속도를 확인해 보세요</p>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box">
      <p class="AnalyzeAgingSpeed--info" v-if="!props.isMain">노화속도가
        <strong class="AnalyzeAgingSpeed--speed">{{ speed }}</strong>배속으로
        <strong class="AnalyzeAgingSpeed--description">{{ description }} 노화</strong>가 진행 중 입니다
      </p>

      <div class="AnalyzeAgingSpeed--graph"> <!--그래프-->
        <!--        <div class="echart guage" :class="isMain ? 'isMain' : ''" ref="echart" />-->
        <div class="echart guage" :class="isMain ? 'isMain' : ''" ref="echart" />
        <div class="AnalyzeAgingSpeed--summary">
          <div class="AnalyzeAgingSpeed--rank-wrap">
            <strong class="AnalyzeAgingSpeed--speed2" :class="speed <= 1 ? 'green' : 'orange'">
              <span v-if="!isMain">x</span>
              {{ speed }}
            </strong>
            <span v-if="isMain" class="AnalyzeAgingSpeed--speed3">배속</span>
          </div>
          <button
            v-if="!props.isMain"
            @click="detailView"
            type="button"
            class="AnalyzeAgingSpeed--more-btn">자세히 보기</button>
        </div>

      </div>

      <div v-if="!props.isMain" class="AnalyzeAgingSpeed--reason">
        <p class="AnalyzeAgingSpeed--reason-txt">* 나의 노화속도에 영향을 미치는 요인을 확인해 보세요</p>
        <div class="AnalyzeAgingSpeed--btn-wrap">
          <button @click="popupReason" type="button" class="AnalyzeAgingSpeed--btn">더보기</button>
        </div>
      </div>

    </div>

    <AnalyzeAgingSpeedPop :openPop="isPopupReason" @popupClose="popupClose" /> <!--231208 팝업 추가-->

  </div>
</template>

<style scoped lang="scss">
.echart.guage {
  /* 변경필요 */
  //width: 24.6rem;
  width: 120%;
  //height: 24.6rem;
  height: 120%;
  padding-top: 2.8rem;
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &.isMain {
    width: 100%;
    height: 100%;
  }
}

::v-deep(.echart div) {
  margin: 2.2rem auto;
}

::v-deep(.home .echart div) {
  margin-top: -2.6rem;
}</style>
