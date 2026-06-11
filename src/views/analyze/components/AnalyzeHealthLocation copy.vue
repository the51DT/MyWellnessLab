<script setup>
import BaseTooltip from '../BaseTooltip.vue'

import { ref, defineProps, computed, watch, onBeforeMount, onMounted, toRaw } from 'vue'
import { funcIsPc } from '@/assets/js/common'

// props
const props = defineProps({
  sendData: Object
})

const chartData = computed(() => {
  const obj = {
    OXI: 0, // 0, //TODO TEMP
    MET: 0, // 0, //TODO TEMP
    OXI_X: 0,
    MET_Y: 0,
    AgingRateStatus: 0,
    Health_Status: '-'
  }

  if (props.sendData.hqData) {
    obj.OXI = props.sendData.hqData.OXI
    obj.MET = props.sendData.hqData.MET
    obj.AgingRateStatus = props.sendData.hqData.AgingRateStatus
    obj.Health_Status = getGrade(props.sendData.hqData.Health_Status)
    obj.OXI_X = (((props.sendData.hqData.OXI / 10) * props.sendData.hqData.OXI) / 10).toFixed(0)
    obj.MET_Y = ((props.sendData.hqData.MET / 10) * props.sendData.hqData.MET / 10).toFixed(0)
  }

  return obj
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
 * @param {number} val - grade
 * @return {string} - 변환된 등급
 */
function getGrade (val) {
  let rtnTxt = ''

  switch (val) {
    case 1 :
      rtnTxt = '좋은'
      break
    case 2 :
      rtnTxt = '보통'
      break
    case 3 :
      rtnTxt = '나쁨'
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
      <h2 class="tooltip--tit AnalyzeHealthLocation--tit">건강 위치</h2>
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
          <ul class="AnalyzeHealthLocation--tip-ul">
            <li>나의 건강 위치는 만 19세 이상 한국인 3만명의 실제 빅데이터 분포 중 노화와 만성질환으로부터 나의 건강을 얼마나 잘 지킬 수 있는 지를 분석하여 이차원 상 위치로 표현한 것입니다</li>
            <li>나의 건강 위치가 초록색 영역에 있다면 건강이 좋은 편에 속하고 빨간색 영역에 있다면 건강에 더 주의해야 한다는 것을 의미합니다</li>
            <li>현재의 건강 상태와 건강 위치 변화를 주기적으로 확인하여 건강 관리 습관을 갖는 것이 중요합니다</li>
          </ul>
        </template>
      </base-tooltip>

    </div>
    <div class="analyze-box"> <!--만성질환 억제 분석지수, 노화 억제 분석 지수 그래프-->
      <p class="AnalyzeHealthLocation--txt">한국 성인 표본 집단과 비교한 건강상태는 <br v-if="isPc" />
        <strong class="AnalyzeHealthLocation--grade">{{chartData.Health_Status}}</strong> 수준입니다
      </p>

      <div class="chart-wrap" ref="target">
        <div class="graph-wrap">
          <div class="echart">
            <img class="position-scatter" src="/img/graph-scatter.png" alt="" />
            <img class="position-back" src="/img/graph-position.png" alt="" />
          </div>
          <div class="over-wrap">
            <!-- 내 점수에 따른 위치 설정 -->
            <div
              class="my-point"
              :style="{
                width: `${chartData.OXI_X}%`,
                height: `${chartData.MET_Y}%`,
              }">
              <div class="x-indicator">{{ chartData.MET }}</div>
              <div class="y-indicator">{{ chartData.OXI }}</div>
              <!--              <img class="my-point-img" src="@/assets/images/age-graph-icon.png" alt="" />-->
              <img class="my-point-img" src="/img/ico_me.svg" alt="나의 위치" />
              <div class="my-point-pointer">
                <div class="point" />
              </div>
            </div>
            <span class="label-y" :style="'left:1px'">만성질환 억제 분석 지수</span>
            <span class="label-x">노화 억제 분석 지수</span>
          </div>
          <!-- <h3 class="none">[한국 성인 표본집단 대비 나의 건강 위치]</h3> -->
        </div>
      </div>

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
    box-shadow: 0px 0px 5px rgba(75, 92, 69, 0.2);
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
    left: 2.8rem;
    top: 0;
    transform: translate(-125%, -50%);
    background-color: white;
  }

  .y-indicator {
    position: absolute;
    font-size: 1.5rem;
    color: #555;
    right: 0;
    bottom: 2.8rem;
    transform: translate(50%, 125%);
    background-color: white;
  }
}
.over-wrap {
  position: absolute;

  z-index: 10;
  width: 100%;
  top: calc(35px * 1 /* $pdf-scale */);
  left: 0;
  height: calc(114.08px * 1 /* $pdf-scale */);
  min-height: 23.2rem;
  border-left: solid .1rem #B2B2B2;
  border-bottom: solid .1rem #B2B2B2;
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
    img {
      transform: rotate(90deg);
    }
  }
  .label-y {
    left: 0;
    top: -6%;

    font-weight: 500;
    line-height: 12px;

    img {
      transform: rotate(90deg);
    }
  }
}
.chart-wrap {
  position: relative;
  height: calc(115.16px * 1 /* $pdf-scale */);
}
.echart {
  width: 100%;
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
  top: .4rem;
}
.my-point-pointer {
  position: absolute;
  right: 0;
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
