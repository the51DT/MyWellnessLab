<script>
import BaseTooltip from '../BaseTooltip.vue'
import { funcIsPc } from '@/assets/js/common'
import { computed } from 'vue'

export default {
  name: 'AnalyzeHealthLocation',
  components: { BaseTooltip },
  props: {
    sendData: Object
  },
  data () {
    return {
      tooltip: false, /* 건강 위치 툴팁 */
      tooltipEdge: 0, /* 231204 툴팁 꼬다리 위치 */
      healthLocation: '보통', /* 건강 위치 요약, 건강한/보통의/위험한 */
      isPc: false, /* 231228 pc인지? */
      yIndicatorSpace: 75
    }
  },
  methods: {
    tooltipClose () { /* 툴팁 닫기 */
      this.tooltip = false
    },
    openTooltip ($event) { /* 툴팁 열기 */
      this.tooltipEdge = $event.x
      this.tooltip = true
    },
    lowXIndicator () {
      return this.chartData.OXI_X < 15
    },
    lowYIndicator () {
      return this.chartData.MET_Y < 15
    },
    getGrade (val) {
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
  },
  computed: {
    chartData () {
      const obj = {
        OXI: 0, // 0, //TODO TEMP
        MET: 0, // 0, //TODO TEMP
        OXI_X: 0,
        MET_Y: 0,
        AgingRateStatus: 0,
        Health_Status: '-'
      }

      if (this.sendData) {
        obj.OXI = this.sendData.hqData.OXI
        obj.MET = this.sendData.hqData.MET
        obj.AgingRateStatus = this.sendData.hqData.AgingRateStatus
        obj.Health_Status = this.getGrade(this.sendData.hqData.Health_Status)
        obj.OXI_X = (((this.sendData.hqData.OXI / 10) * this.sendData.hqData.OXI) / 10).toFixed(0)
        obj.MET_Y = ((this.sendData.hqData.MET / 10) * this.sendData.hqData.MET / 10).toFixed(0)
      }

      return obj
    },
    yIndicatorTop () {
      let topValue = 0
      if (this.chartData.MET_Y > this.yIndicatorSpace) {
        topValue = (this.chartData.MET_Y - this.yIndicatorSpace) * 1.5
      }
      return 'top:' + topValue + 'px'
    },
    yIndicator () {
      let topValue = -17
      if (this.chartData.MET_Y > this.yIndicatorSpace) {
        topValue = topValue - ((this.chartData.MET_Y - this.yIndicatorSpace) * 1.7)
      }
      return 'top: ' + topValue + 'px'
    },
    xIndicatorLabel () {
      let bottom = false
      if (this.lowYIndicator && this.chartData.OXI_X > 55) {
        bottom = true
      }
      return bottom
    }
  },
  mounted () {
    this.isPc = funcIsPc()
    window.addEventListener('resize', () => {
      this.isPc = funcIsPc()
    })
  }
}
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
      <p class="AnalyzeHealthLocation--txt">한국 성인 표본 집단과 비교한 건강상태는 <!--<br v-if="!isPc" />-->
        <strong class="AnalyzeHealthLocation--grade">{{healthLocation}} 수준</strong>입니다
      </p>
      <div class="chart-wrap" ref="target" :style="yIndicatorTop">
        <div class="graph-wrap">
          <!--          <div class="echart">-->
          <!--            <img class="position-scatter" src="/img/graph-scatter.png" alt="" />-->
          <!--            <img class="position-back" src="/img/graph-position.png" alt="" />-->
          <!--          </div>-->
          <div class="over-wrap">
            <!-- 내 점수에 따른 위치 설정 -->
            <div
              class="my-point"
              :style="{
                width: '100px',
                height: '150px',
              }">
              <div class="x-indicator" :class="lowXIndicator ? 'left' : ''">{{ chartData.MET }}</div>
              <div class="y-indicator" :class="lowYIndicator ? 'bottom' : ''">{{ chartData.OXI }}</div>
              <!--              <img class="my-point-img" src="@/assets/images/age-graph-icon.png" alt="" />-->
              <img class="my-point-img" src="/img/ico_me.svg" alt="나의 위치" />
              <div class="my-point-pointer">
                <div class="point" />
              </div>
            </div>
            <span class="label-y" :style="yIndicator">만성질환 억제 분석 지수</span>
            <span class="label-x" :class="xIndicatorLabel ? 'bottom' : ''">노화억제 분석 지수</span>
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
