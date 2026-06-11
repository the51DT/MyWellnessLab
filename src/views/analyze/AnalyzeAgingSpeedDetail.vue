<script setup>
import AnalyzeAgingSpeedDetailPopup from '@/views/analyze/components/AnalyzeAgingSpeedDetailPopup.vue'
import { useStore } from 'vuex'
import { ref, computed, onMounted, nextTick } from 'vue'
import { mwlRound, mwlRoundAgingRate } from '@/assets/js/common'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()
const route = useRoute()

// Router state 데이터를 안정적으로 저장
const routerData = ref(null)

// 데이터 로딩 상태를 computed로 변경하여 즉시 반응하도록 함
const isDataLoaded = computed(() => {
  return !!(routerData.value || store.getters['analyze/getDetail'])
})

// Router state에서 데이터를 가져오거나 Store에서 가져오기
const analyzeDetail = computed(() => {
  // Router state 데이터가 있으면 우선 사용
  if (routerData.value) {
    return routerData.value
  }
  // 없으면 Store에서 가져오기
  const storeData = store.getters['analyze/getDetail']
  return storeData
})

const agingSpeed = computed(() => {
  if (analyzeDetail.value?.hqData?.AgingRate !== undefined) {
    return mwlRoundAgingRate(analyzeDetail.value.hqData.AgingRate, 2)
  }
  return 0
})

const agingSpeedGrade = computed(() => {
  let txt = 'normal'
  const status = analyzeDetail.value.hqAr.status
  if (status === 1) txt = 'good'
  else if (status === 2) txt = 'normal'
  else if (status === 3) txt = 'bad'

  return txt
})

const ageInfo = computed(() => {
  const health = Math.round(analyzeDetail.value?.hqData?.ReAge || 0)
  const current = Math.round(analyzeDetail.value?.analyzeAge || 0)
  const diff = health - current
  return {
    health,
    current,
    diff
  }
})

const isOnceTime = computed(() => { // 일회성 여부 체크, 이후 일회성 결과보기 진입 방식에 따라 변경 필요
  let rtn = false

  if (analyzeDetail.value?.commonInfo?.analysisType === 'onetime') rtn = true

  return rtn
})

const popup = ref(false)

/**
 * 팝업 오픈
 */
function popupOpen () {
  popup.value = true
}

/**
 * 팝업 종료
 */
function popupClose () {
  popup.value = false
}

const agingRate = computed(() => {
  const ageData = analyzeDetail.value?.hqReference

  if (!ageData) return '0'

  const rate = ((ageInfo.value.health - ageData.min) / (ageData.max - ageData.min)) * 100

  return rate.toFixed(0)
})

const ageArea = computed(() => { /* 231221 내 나이대 */
  let ages = parseInt((analyzeDetail.value?.analyzeAge || 0) / 10) * 10
  if (ages < 20) ages = 20
  if (ages > 80) ages = 80
  return ages
})

/**
 * 차트의 x, y축을 계산한다.
 * @returns {object} - {x, y}
 */
const axisData = computed(() => {
  // 이미지에 맞춰 계산 한 값
  const x_value = 100 - 16
  const y_value = 61

  // 시작 x, y 축 값
  const startX = 6.7
  const startY = 77
  const yDiff = 17
  const rate = (ageInfo.value.current - 19) / 61

  const x = startX + x_value * rate
  const agingPos = (agingRate.value / 100) * 2 * yDiff

  let y = startY - y_value * rate - agingPos + yDiff
  // const ymin = 5;
  const ymin = 12
  const ymax = 105

  // y = ((ymax - ymin) * (100 - this.agingRate())) / 100 + ymin;
  // 0.9곱해서 목표속도 라인은 0.9에 그어져있고 노화속도 받는 값은 0.9일때 1.00으로 받기 때문에 이 차이를 0.9 곱해서 맞춰서 표현.
  y = ((ymax - ymin) * (100 - (ageInfo.value.health + 5))) / 100 + ymin

  // for test
  // y = ((ymax - ymin) * (100 - 60)) / 100 + ymin;

  return {
    x,
    y
  }
})
/**
 * 가로 세로 선 그을 때 사용
 * @returns {object}
 */
const axisCurrentData = computed(() => {
  const x_value = 100 - 16
  const y_value = 61

  const startX = 6.7
  const startY = 77
  const yDiff = 17
  const rate = (ageInfo.value.health - 19) / 61
  // rate = (80 - 19) / 61;

  const x = startX + x_value * rate
  const agingPos = (agingRate.value / 100) * 2 * yDiff

  let y = startY - y_value * rate - agingPos + yDiff
  // const ymin = 5;
  const ymin = 12
  const ymax = 105

  // y = ((ymax - ymin) * (100 - this.agingRate())) / 100 + ymin;
  // 0.9곱해서 목표속도 라인은 0.9에 그어져있고 노화속도 받는 값은 0.9일때 1.00으로 받기 때문에 이 차이를 0.9 곱해서 맞춰서 표현.
  y = ((ymax - ymin) * (100 - (ageInfo.value.health + 5))) / 100 + ymin

  // y = ((ymax - ymin) * (100 - 35)) / 100 + ymin;
  // console.log("agingrate", this.agingRate(), y);

  const origin = axisData.value

  const data = {
    x: 0,
    y: y - 1,
    width: 0,
    height: 100 - y + 1,
    isRight: false,
    age_x: 0
  }

  if (origin.x > x) {
    data.x = x
    data.width = origin.x - x
    data.age_x = x
  } else {
    data.x = origin.x
    data.width = x - origin.x
    data.isRight = true
    data.age_x = x
  }

  return data
})
/** 발급당시 실제나이 (X 축) */
const getAgeGraphY = computed(() => {
  // 25.08.07 --> 20 ~ 90세로 범위 변경
  // 20세 미만일 경우 20세, 90세 초과일 경우 90세로 설정
  // 25.09.03 --> 20~80으로 변경
  var age = ageInfo.value.current
  if (age < 20) {
    age = 20;
  } else if (age > 80) {
    age = 80;
  }
  var range = 80 - 20;
  var relativeValue = age - 20;

  return (relativeValue / range) * 100
})
/** 건강나이 (Y 축) */
const getAgeGraphX = computed(() => {

  // 25.08.07 --> 10 ~ 90세로 범위 변경
  // 10세 미만일 경우 10세, 90세 초과일 경우 90세로 설정
  // 25.09.03 --> 0~100으로 변경
  var age = ageInfo.value.health
  if (age < 0) {
    age = 0;
  } else if (age > 100) {
    age = 100;
  }
  // 나이대별 보정 적용
  let adjustedAge = age
  if (age <= 20) {
    adjustedAge = age + 1  // 20세 이하: 아래로 이동
  } else if (age >= 60) {
    adjustedAge = age - 1  // 60세 이상: 위로 이동
  }
  // 21-59세: 보정 없음
  
  var range = 100 - 0;
  var relativeValue = adjustedAge - 0;

  return (relativeValue / range) * 98

})
onMounted(async () => {
  // Store에서 데이터를 우선적으로 가져오기
  const storeData = store.getters['analyze/getDetail']
  if (storeData && Object.keys(storeData).length > 0) {
    routerData.value = storeData
  }
  
  // Store에 데이터가 없고 Router state에만 있는 경우
  if (!routerData.value && route.state?.sendData) {
    routerData.value = route.state.sendData
  }
  
  // 데이터가 로드될 때까지 대기
  await nextTick()
})
</script>

<template>
  <div class="AnalyzeAgingSpeedDetail">
    <div class="AnalyzeAgingSpeedDetail--my">
      <h2 class="AnalyzeAgingSpeedDetail--tit">{{ $t('AnalyzeAgingSpeedDetail.text1') }}</h2>
      <div class="AnalyzeAgingSpeedDetail--index-wrap">
        <strong class="AnalyzeAgingSpeedDetail--index" :class="agingSpeedGrade">{{ agingSpeed }}</strong> {{ $t('AnalyzeAgingSpeedDetail.text2') }}
      </div>
      <div class="AnalyzeAgingSpeedDetail--btn-wrap">
        <button
          @click="popupOpen"
          v-if="!isOnceTime"
          type="button"
          class="AnalyzeAgingSpeedDetail--btn">{{ $t('AnalyzeAgingSpeedDetail.text3') }}</button>
      </div>
    </div>

    <div class="AnalyzeAgingSpeedDetail--graph-wrap">
      <p class="AnalyzeAgingSpeedDetail--age-wrap">{{ $t('AnalyzeAgingSpeedDetail.text4') }}
        <strong class="AnalyzeChronicDiseaseControlAnalyzeIndexDetail--age">{{ $t('AnalyzeAgingSpeedDetail.text5') }}</strong>
      </p>
      <div class="AnalyzeAgingSpeedDetail--graph"> <!--그래프-->

        <div class="chart-wrap graph" ref="target">
          <div class="label-y">{{ $t('AnalyzeAgingSpeedDetail.text6') }}</div>
          <div class="label-x">{{ $t('AnalyzeAgingSpeedDetail.text7') }}</div>
          <div class="label-x label-speed">{{ $t('AnalyzeAgingSpeedDetail.text9') }}</div>
          <div class="label-0">0</div>
          <div class="reage-graph">
            <img src="/img/chart/scatter/reage-graph.png" alt="" />
          </div>
            <div class="pointer" :style="{ left: getAgeGraphY + '%', bottom: getAgeGraphX + 2+ '%' }">
             <div class="my-point-pointer">
               <div class="my-point-dashed" />
               <img class="my-point-img" src="/img/ico_me.svg" alt="" />
               <div class="my-point-dot" />
             </div>
           </div>

           <div class="pointer" :style="{ left: getAgeGraphY + '%' , bottom: -5 + '%' }">
             <span>{{ ageInfo.current }}{{ $t('AnalyzeAgingSpeedDetail.ageUnit') }}</span>
           </div>

                     <!-- 가로 세로 선 -->
          <div class="pointer-line-current" :style="{
              left: getAgeGraphY + '%',
              bottom: 0,
              width: '0%',
              height: getAgeGraphX + '%',
            }"></div>
          <div class="pointer-diagonal" :style="{
              left: `0`,
              bottom: getAgeGraphX + '%',
              width:  `calc(${getAgeGraphY}%)`,
              marginBottom: `-3px`,
            }"></div>
           <div class="pointer" :style="{ bottom: getAgeGraphX + '%' }">
             <b> {{ ageInfo.health }}{{ $t('AnalyzeAgingSpeedDetail.ageUnit') }} </b>
           </div>

                    <div class="legend">
                      <span class="legend&#45;&#45;avarage">{{ ageArea + $t('AnalyzeAgingSpeedDetail.ageGroupAverage') }}</span>
                      <div class="position" />
                      <span>{{ $t('AnalyzeAgingSpeedDetail.myPosition') }}</span>
                    </div>

        </div>

      </div>
    </div>

    <AnalyzeAgingSpeedDetailPopup
      v-if="popup"
      :sendData="analyzeDetail"
      :ageArea="ageArea"
      @popupClose="popupClose"
      class="AnalyzeAgingSpeedDetail--popup" />

  </div>

  <!-- S : 20260319 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
  <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
  <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
    <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
    <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

    <!-- to 개발 | 복약정보가 있을 경우 -->
    <p class="AnalyzeDetail--medicationPopup-detail">
      <span>{{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}</span> {{ $t('AnalyzeDetail.text48') }}
    </p>
  </div>
  <!-- E : 20260319 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
</template>

<style lang="scss" scoped>
.graph {
  //position: relative;
  overflow: visible !important;
  position: absolute;
  width: 76%;
  height: 100%;
  left: 8%;
  transform: translateX(0);
  margin-top: 40px;
  margin-right: auto;
  margin-left: auto;
  border-bottom: solid 1px #B2B2B2;
  border-left: solid 1px #B2B2B2;
  //background: url("/img/graph_line.svg") bottom;
  background-size: contain;
  @media (min-width: 460px) {
    max-width: 333px;
    left: 50%;
    transform: translateX(-50%);
  }
  @media (min-width: 960px) {
    height: 280px;
    margin-top: 5.6rem;
  }

  div {
    position: absolute;

    img {
      width: 24px;
      height: auto;
    }
  }

  //img {
  //  position: absolute;
  //  top: -25px;
  //
  //  width: 333px;
  //  height: auto;
  //}
  .reage-graph {
    position: absolute;
    //top: -25px;
    left: 0;
    overflow: visible !important;
    //width: 333px;
    width: 100%;
    //height: 333px;
    height: 100%;

    img {
      position: absolute;
      //top: 0;
      //bottom: 0;
      //left: -13.33px;
      //left: 0;
      //bottom: -26px;
      //left: -16px;
      //width: 333px;
      width: 100%;
      height: 100%;
      transform: translate(0, 0) !important;
    }
  }
}

.legend {
  bottom: -70px;
  width: 100%;
  font-size: 1.4rem;
  color: #555;
  font-family: "RixSinHead_Medium", sans-serif;
  text-align: left;
  margin-bottom: 5px;
  //@include flex(flex-end, center);
  display: flex;
  //justify-content: flex-end;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  .name {
    margin-left: 0px;
  }

  //div {
  //@include flex(center, center);
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //}
  span {
    margin: 0;
    margin-left: 5px;
  }

  &--avarage{
    display: none;
  }

  .position {
    $size: 12px;
    position: relative;
    width: $size;
    height: $size;
    border-radius: $size;
    background-color: #1DB196;
    margin-left: 34px;
  }

  img {
    display: inline-block;
    position: relative !important;
    width: 17px !important;
    height: auto;
    margin: 0;
    top: 0 !important;
  }

  &:before {
    content: "";
    display: inline-block;
    width: 3rem;
    height: 1rem;
    background: url("/img/img_biolet_line.svg") no-repeat left 48%;
    filter: hue-rotate(240deg) saturate(0.8) brightness(1.1);
    display: none;
  }
}

.label-x {
  position: absolute;
  font-size: 1.2rem;
  font-family: "RixSinHead_Medium", sans-serif;
  color: #555;
  right: -45px;
  bottom: -25px;
  &.label-speed{
    right: -44px;
    top: 13%;
    width: 40px;
    color: #5ab651;
    font-size: 1.3rem;
    line-height: 1.8rem
  }
}

.label-y {
  position: absolute;
  left: 0;
  top: -20px;
  font-size: 1.3rem;
  font-family: "RixSinHead_Medium", sans-serif;
  color: #555;
}

.label-dst {
  position: absolute;
  bottom: 58%;
  right: -50px;
  font-size: 1.3rem;
  color: #7E7EFF;
  font-family: "RixSinHead_Medium", sans-serif;
}

.label-0 {
  font-size: 1.3rem;
  color: #555;
  font-family: "RixSinHead_Medium", sans-serif;
  bottom: -25px;
}

.my-point-pointer {
  position: absolute;
  right: 0;
  bottom: 0;

  background-color: transparent;

  z-index: 101;

  .my-point-dashed {
    position: absolute;
    width: 1px;
    height: 30px;
    border-right: 1px dashed #00b4de;
    bottom: 0;
  }

  .my-point-dot {
    width: 8px;
    height: 8px;
    transform: translate(-50%, -79%);
    border-radius: 50%;
    background-color: #1DB196;
    border: 1px solid #fff;
  }
}

img.my-point-img {
  position: absolute;
  max-width: fit-content;
  width: 24px;
  height: 33px;
  transform: translate(-50%, -170%);
}

.pointer {
  right: 102%;

  /*231220 y축 폰트*/
  span {
    /*231220 x축 폰트*/
    position: absolute;
    bottom: -5px;
    white-space: nowrap;
    transform: translateX(-50%);
    color: #555;
    text-align: center;
    font-family: "RixSinHead_Medium", sans-serif;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 300;
    background-color: white;
    border-right: solid 3px white;
    border-left: solid 3px white;
    border-top: solid 1px white;
  }

  font-size: 1.2rem;
  font-family: "RixSinHead_Medium",
  sans-serif;
  color: #1DB196;
  margin-bottom: -11px;
  z-index: 1;

  b {
    background-color: white;
    font-size: 1.3rem;
    font-weight: 300;
    border-right: solid 3px white;
    border-left: solid 3px white;
  }
}

.pointer-line-current {
  border-right: 1px solid #555;
}

.pointer-diagonal {
  background-color: transparent;
  border-top: 1px solid #555;
}
</style>
