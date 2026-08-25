<script setup>
import BaseTooltip from '@/components/BaseTooltip.vue'
import { mwlRound, getColor } from '@/assets/js/common'
import { ref, defineProps, computed, onMounted } from 'vue'
import { funcIsPc } from '@/assets/js/common'
import Wellness3DChart from '@/views/analyze/components/Wellness3DChart.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
// props
const props = defineProps({
  sendData: Object
})

const chartData = computed(() => {
  const obj = {
    OXI: 0, // 0, //TODO TEMP
    MET: 0, // 0, //TODO TEMP
    MUSCLE: 0,
    OXI_X: 0,
    MET_Y: 0,
    AgingRateStatus: 0,
    Health_Status: 0
  }
  
  obj.OXI = Number(mwlRound(props.sendData.hqOxi?.score || 0, 0))  || 0 
  obj.MET = Number(mwlRound(props.sendData.hqMet?.score || 0, 0)) || 0 
  obj.AgingRateStatus = props.sendData.hqData?.AgingRateStatus || 0
  obj.Health_Status = props.sendData.hqHtype?.status || 0
  
  obj.OXI_X = (((obj.OXI / 10) * obj.OXI) / 10).toFixed(0)
  obj.MET_Y = ((obj.MET / 10) * obj.MET / 10).toFixed(0)
  obj.MUSCLE = props.sendData.hqMusBal ? Math.round(props.sendData.hqMusBal.score) : undefined
  return obj
})

// 상태에 따른 색상 계산
const color = computed(() => {
  const healthStatus = props.sendData.hqHtype?.status || 0
  return getColor(healthStatus)
})/* ref({
  OXI: 75, //0, //TODO TEMP
  MET: 61, //0, //TODO TEMP
  grade: '-',
  Health_Status: '-'
});//API를 통해 가져올 데이터 */

const tooltip = ref(false) /* 툴팁 오프너 */
const tooltipEdge = ref(0) /* 툴팁 꼬다리 위치 */
const isPc = ref(false) /* 231228 pc인지? */

/**
 * 등급을 문자로 변환
 * @param {number} val - 등급
 * @return {string} - 문자열로 변환된 등급
 */
function getGrade (val) {
  let rtnTxt = ''

  switch (val) {
    case 1 :
      rtnTxt = t('AnalyzeHealthLocation.good')
      break
    case 2 :
      rtnTxt = t('AnalyzeHealthLocation.normal')
      break
    case 3 :
      rtnTxt = t('AnalyzeHealthLocation.attention')
      break
  }
  return rtnTxt
}

/**
 * 툴팁 닫기
 */
function tooltipClose () {
  tooltip.value = false
}

/**
 * 툴팁 열기
 * @param {*} $event
 */
function openTooltip ($event) {
  tooltip.value = true
  tooltipEdge.value = $event.x
}

const lowXIndicator = computed(() => {
  return chartData.value.OXI_X < 15
})
const lowYIndicator = computed(() => {
  return chartData.value.MET_Y < 15
})

const yIndicatorSpace = 75
const yIndicatorTop = computed(() => {
  let topValue = 0
  if (chartData.value.MET_Y > yIndicatorSpace) {
    topValue = (chartData.value.MET_Y - yIndicatorSpace) * 1.5
  }
  return 'top:' + topValue + 'px'
})
const yIndicator = computed(() => {
  let topValue = -17
  if (chartData.value.MET_Y > yIndicatorSpace) {
    topValue = topValue - ((chartData.value.MET_Y - yIndicatorSpace) * 1.7)
  }
  return 'top: ' + topValue + 'px'
})

const xIndicatorLabel = computed(() => {
  let bottom = false
  if (lowYIndicator.value && chartData.value.OXI_X > 55) {
    bottom = true
  }
  return bottom
})

onMounted(() => {
  isPc.value = funcIsPc()
  window.addEventListener('resize', () => {
    isPc.value = funcIsPc()
  })
})
</script>

<template>
  <div class="AnalyzeHealthLocation"> <!--건강 위치-->
    <div class="tooltip AnalyzeHealthLocation--tip">
      <h2 class="tooltip--tit AnalyzeHealthLocation--tit">{{ $t('AnalyzeHealthLocation.text2') }}</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeHealthLocation--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeHealthLocation--tip-dom">
        <template v-slot:contents>
          <!-- 2차원 그래프일 때 -->
          <p class="tooltip--contents" v-if="chartData.MUSCLE === null || chartData.MUSCLE === undefined">
            {{ $t('AnalyzeHealthLocation.tooltip2D') }}
          </p>
          <!-- 3차원 그래프일 때 -->
          <p class="tooltip--contents" v-else>
            {{ $t('AnalyzeHealthLocation.tooltip3D') }}
          </p>
        </template>
      </base-tooltip>

    </div>
    <div class="analyze-box"> <!--만성질환 억제 분석지수, 노화 억제 분석 지수 그래프-->
      <p class="AnalyzeHealthLocation--txt">
        {{ $t('AnalyzeAgingSpeed.text42') }}
        {{ $t('AnalyzeHealthLocation.text7') }}
        <strong class="AnalyzeHealthLocation--grade" :style="{color: color}">{{getGrade(chartData.Health_Status)}}
        {{ $t('AnalyzeHealthLocation.text8') }}</strong>
        {{ $t('AnalyzeAgingSpeed.text46') }}
      </p>
      <!-- <BubbleChart
        :oxi="89"
        :met="80"
        :mus="100"
      /> -->

      <!-- MUSCLE 값이 null이거나 undefined이면 기존 차트, 값이 있으면 3D 차트 -->
      <div v-if="chartData.MUSCLE === null || chartData.MUSCLE === undefined" class="chart-wrap" ref="target" :style="yIndicatorTop">
        <div class="graph-wrap">
          <div class="over-wrap">
            <div
              class="my-point"
              :style="{
                width: `${chartData.OXI_X}%`,
                height: `${chartData.MET_Y}%`,
              }">
              <div class="x-indicator" :class="lowXIndicator ? 'left' : ''">{{ chartData.MET }}</div>
              <div class="y-indicator" :class="lowYIndicator ? 'bottom' : ''">{{ chartData.OXI }}</div>
              <img class="my-point-img" src="/img/ico_me.svg" alt="나의 위치" />
              <div class="my-point-pointer">
                <div class="point" />
              </div>
            </div>
            <span class="label-y" :style="yIndicator">{{ $t('Page5.text17') }}</span>
            <span class="label-x" :class="xIndicatorLabel ? 'bottom' : ''">{{ $t('Page5.text16') }}</span>
          </div>
        </div>
      </div>
      <Wellness3DChart v-else :oxi="chartData.OXI" :met="chartData.MET" :mus="chartData.MUSCLE" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.graph-wrap {
  width: 100%;
  transform: translateX(0%);
}
.subject {
  position: absolute;
  z-index: 100;
  bottom: 50px;
  width: 100%;
  margin-left: 23px;
}

.my-point {
  position: absolute;
  left: 0;
  bottom: 1%;
  border-top: dashed .1rem #7E7EFF;
  border-right: dashed .1rem #7E7EFF;

  span {
    position: absolute;
    top: -60px !important;
    transform: translate(-50%, 0%);

    background: #ffffff !important;
    box-shadow: 0 0 5px rgba(75, 92, 69, 0.2);
    border-radius: 123px;
    padding: 3px 4px;

    font-weight: 600;
    font-size: 14px;
    line-height: 17px;

    display: flex;
    align-items: center;
    text-align: center;

    color: #414042;
  }
  img {
    position: absolute;
    width: 3.2rem;
    height: 4.4rem;
  }

  .x-indicator {
    position: absolute;
    font-size: 1.5rem;
    color: #555;
    left: 6px;
    top: -7px;
    text-align: left;
    background: white;
    padding: 0 3px;
    border-radius: 5px;
    line-height: 1;
    &.left{
      left: -36px;
      text-align: right;
      width: 30px;
      @media (max-width: 430px) {
        background: initial;
      }
    }
  }

  .y-indicator {
    position: absolute;
    font-size: 1.5rem;
    color: #555;
    right: 0;
    bottom: 24px;
    transform: translate(50%, 125%);
    background: white;
    padding: 0 3px;
    border-radius: 5px;
    line-height: 1;
    &.bottom{
      right: 0;
      bottom: -5px;
    }
  }
}
.over-wrap {
  position: absolute;

  z-index: 10;
  width: 100%;
  top: calc(35px * 1 /* $pdf-scale */);
  left: 0;
  height: calc(114.08px * 1 /* $pdf-scale */);
  min-height: 24.8rem;
  border-left: solid .1rem #B2B2B2;
  border-bottom: solid .1rem #B2B2B2;
  background: url(/img/graph-scatter.png) no-repeat center 0, url(/img/graph-position.png?240215-2) no-repeat center bottom;
  background-size: 100%, 132%;
  .my-point {
    span {
      background: #0060af;
      &::after,
      &::before {
        display: none;
      }
    }
  }
  .label-x,
  .label-y {
    position: absolute;
    font-size: 1.3rem;
    color: #727171 !important;
//    @include flex(center, center);
//TODO LYH START 참조 scss 파일이 없어서 위 include를 처리할 수 없어 유추하여 스타일선언 처리함.
    display:flex;
    justify-content: center;
    align-content:center;
//TODO END
    gap: 6px;
    img {
      width: 11px;
      height: 18px;
    }
  }
  .label-x {
    right: 0;
    bottom: -2rem;

    font-weight: 500;
    line-height: 12px;
    &.bottom{
      bottom: -4rem;
    }
    img {
      transform: rotate(90deg);
    }
  }
  .label-y {

    font-weight: 500;

    position: absolute;
    top: -17px;
    left: 0;
    word-wrap: break-word;
    line-height: 1;
    display: initial;

    img {
      transform: rotate(90deg);
    }
    span{
      margin: .5rem 0;
      display: block;
    }
  }
}
.chart-wrap {
  position: relative;
  height: calc(115.16px * 1 /* $pdf-scale */);
}
.echart {
  width: 100%;
  @media (max-width: 420px) {
    top: 36px;
    position: relative;
  }
}
.over-chart {
  position: absolute;
  top: 3%;
  left: 54%;
  transform: translate(-50%);
  z-index: 10;
  width: calc(249px * 1 /* $pdf-scale */);
  height: calc(257px * 1 /* $pdf-scale */);
  overflow: hidden;
}
.chart-text {
  text-align: center;
  width: 300px;
}

.graph-img {
  width: 230px;
  height: 230px;
  left: 10px;
  position: absolute;
}
.axis {
  position: absolute;
  left: 20px;
  top: -35px;
  object-fit: contain;
  width: 300px;
  height: 354px;
}
.my-point-img {
  position: absolute;
  transform: translate(50%, -120%);
  height: auto;
  right: 0;
  top: 1rem;
  z-index: 1;
  max-width: none;
}
.my-point-pointer {
  position: absolute;
  right: 1px;
  top: 0;
  transform: translate(50%, -120%);
  height: calc(5.68px * 1 /* $pdf-scale */);
  width: calc(0.5px * 1 /* $pdf-scale */) !important;

  .point {
    position: absolute;

    z-index: 100;
    transform: translate(-50%, 100%);
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    border: solid .1rem #7E7EFF;
    background-color: white;
    bottom: .5rem;
    left: .1rem;
  }
}
.none {
  color: transparent;
}

.position-back {
  width: 100%;
  height: auto;
  position: absolute;
  top: calc((39px) * 1 /* $pdf-scale */);
}
.position-scatter {
  position: absolute;
  width: 100%;
  height: auto;
}
</style>
