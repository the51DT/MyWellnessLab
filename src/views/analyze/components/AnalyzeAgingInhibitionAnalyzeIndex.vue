<script>
import BaseTooltip from '../BaseTooltip.vue'
import router from '../../router'
import 'vue3-circle-progress/dist/circle-progress.css'
import CircleProgress from 'vue3-circle-progress'

// Echart
import * as echarts from 'echarts'
import { ref, computed, watch } from 'vue'

export default {
  name: 'AnalyzeAgingInhibitionAnalyzeIndex',
  components: {
    BaseTooltip,
    CircleProgress
  },
  props: {
    hqData: {
      MET: Number, // 75.02155237781626,
      OXI: Number, // 82.80554848358123,
      ReAge: Number, // 24.043278970807933,
      MET_MSG: String, // " ETHELBERT님의 만성질환 억제지수는 75점으로 30대의 평균 만성질환 억제지수 75점 보다 0점 낮습니다. 이는 동일한 연령대의 만성질환 억제지수의 분포에서 하위 99%에 해당하는 점수이며, 신진대사 능력이 약간 부족하다고 판단됩니다.",
      OXI_MSG: String, // " ETHELBERT님의 노화 억제지수는 83점으로 30대의 평균 노화 억제지수 73점 보다 10점 높습니다. 이는 동일한 연령대의 노화 억제지수의 분포에서 상위 1%에 해당하는 점수이며, 산화 스트레스를 방어하는 능력이 비교적 높다고 판단됩니다.",
      MET_MEAN: Number, // 75.2214981357847,
      MET_PERC: Number, // 1,
      OXI_MEAN: Number, // 73.1607779200308,
      OXI_PERC: Number, // 1,
      AgingRate: Number, // 0.7071552638472921,
      ReAge_MSG: String, // "  인공지능이 판정한 ETHELBERT님의 AI 검진나이는 24세로 실제 나이보다 10세 더 적습니다. 또한  동일한 연령인 34세의 평균 AI 검진나이 33세 보다 9세 적습니다. ETHELBERT님을 동일한 연령대인 30대의 사람들과 비교하면 노화 억제지수는 100명 중에 1등 이고, 만성질환 억제지수는 100명 중에 1등 이며, AI 검진나이는 100명 중에 8등에 해당합니다. 또한 ETHELBERT님의 노화속도는 0.7이며, 이것은 신체 노화가 일반적인 기준보다 느리게 진행되고 있으며 이는 건강관리를 잘 하고 있음을 나타냅니다. 앞으로도 지속적인 건강관리 통하여 행복한 삶을 누리시길 바랍니다.",
      ReAge_PERC: Number, // 8,
      Health_Type: String, // "A",
      Health_Solutions: String// "AM"
    }
  },
  setup (props) {
    // chart var
    const echart = ref(null)
    const myChart = ref(null)

    const color = '#008352' // 차트 스코어 바 컬러
    const widthValue = 4 // 차트 스코어 바 너비

    // Default var
    const tooltip = ref(false) // 툴팁 온오프 변수
    const tooltipEdge = ref(false)

    // 툴팁 ZIndex
    const zIndexCls = computed(() => ({
      'z-index': props.tooltipZIndex
    }))

    // resp data
    const chartData = ref(null)// API를 통해 가져올 데이터
    Object.assign(chartData, props.hqData)

    // Deprecated
    const grade = ref(0)
    const age = ref(0)
    const ages = ref(0)
    const total = ref(0)
    const rank = ref(0)

    // 연령대 처리
    /* const ages = (props.hqData.age > 10) ?
      (String(props.hqData).slice(0, 1) +0) : 10; */

    // chart option
    const option = ref({
      series: [
        {
          type: 'gauge',
          // animation: false,
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 100,
          radius: '95%',
          splitNumber: 12,
          itemStyle: {
            color,
            shadowColor: 'rgba(0,138,255,0)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: {
            show: true,
            roundCap: false,
            width: widthValue,
            itemStyle: {
              borderWidth: widthValue,
              borderColor: '#008352'
            }
          },
          pointer: {
            show: false,
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45180,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 16,
            offsetCenter: [0, '5%']
          },
          axisLine: {
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
          data: [
            {
              value: 0
            }
          ]
        }
      ]
    })

    /**
     * 차트 그리기
     */
    function chartDraw () {
      option.value.series[0].data = [{ value: chartData.value.OXI }] // [{value:val}]
      myChart.value.setOption(option.value)
    }

    /**
     * 툴팁 닫기
     */
    function tooltipClose () {
      tooltip.value = false
      // tooltipZIndex.value--;
      // emit("tooltipClose", props.compId);
    }

    /**
     * 툴팁 열기
     * @param {*} event
     */
    function openTooltip (event) {
      tooltip.value = true
      tooltipEdge.value = event.x
      // emit("tooltipOpen", props.compId);
    }

    return {
      props,
      echart,
      myChart,
      tooltipEdge,
      grade,
      age,
      ages,
      total,
      rank,
      tooltip,
      openTooltip,
      tooltipClose
    }
  }
}
</script>

<template>
  <div class="AnalyzeAgingInhibitionAnalyzeIndex"> <!--노화 억제 분석 지수-->
    <div class="tooltip AnalyzeAgingInhibitionAnalyzeIndex--tooltip">
      <h2 class="tooltip--tit AnalyzeAgingInhibitionAnalyzeIndex--tip-tit">{{ t('AnalyzeAgingInhibitionAnalyzeIndex.text1') }}</h2>
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
          <p class="AnalyzeAgingInhibitionAnalyzeIndex--tip-txt">{{ t('AnalyzeAgingInhibitionAnalyzeIndex.text2') }}</p>
        </template>
      </base-tooltip>

    </div>
    <div class="analyze-box">
      <p class="AnalyzeAgingInhibitionAnalyzeIndex--info">{{ t('AnalyzeAgingInhibitionAnalyzeIndex.text3') }}
        <strong class="AnalyzeAgingInhibitionAnalyzeIndex--score">{{ props.hqData.OXI }}{{ t('Common.score') }}</strong>{{ t('AnalyzeAgingInhibitionAnalyzeIndex.text4') }}
        <strong class="AnalyzeAgingInhibitionAnalyzeIndex--grade">{{ grade }}</strong>{{ t('AnalyzeAgingInhibitionAnalyzeIndex.text5') }}
      </p>

      <div class="AnalyzeAgingInhibitionAnalyzeIndex--graph"> <!--그래프-->

        <div class="echart scoreCom" ref="echart" />

        <div class="AnalyzeAgingInhibitionAnalyzeIndex--summary">
          <div class="AnalyzeAgingInhibitionAnalyzeIndex--rank-wrap">
            <div class="AnalyzeAgingInhibitionAnalyzeIndex--score-wrap">
              <strong class="AnalyzeAgingInhibitionAnalyzeIndex--sum-score">{{props.hqData.OXI}}</strong>{{ t('Common.score') }}
            </div>
            <div class="AnalyzeAgingInhibitionAnalyzeIndex--order">
              <span class="AnalyzeAgingInhibitionAnalyzeIndex--ages">{{ ages }}</span>{{ t('Common.age') }}
              <span class="AnalyzeAgingInhibitionAnalyzeIndex--people">{{ total }}</span>{{ t('Common.people') }} <br />
            </div>
            <strong class="AnalyzeAgingInhibitionAnalyzeIndex--rank">{{ rank }}{{ t('Common.rank') }}</strong>
            <button @click="go" type="button" class="AnalyzeAgingInhibitionAnalyzeIndex--more-btn">{{ t('Common.detail2') }}</button>
          </div>
        </div>

        <!-- <div class="AnalyzeAgingInhibitionAnalyzeIndex--circle">
          <circle-progress
          :is-bg-shadow="false"
          :percent="score"
          :size="260"
          :border-width="8"
          :border-bg-width="0"
          :fill-color="`#7ED47C`"
          />

          </div> -->

      </div>

    </div>

  </div>
</template>

<style scoped>

</style>
