<script setup>
import { onUnmounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import AnalyzeScorecomAnalyzeIndexDetailPopup from '@/views/analyze/components/AnalyzeScorecomAnalyzeIndexDetailPopup.vue'
import { useI18n } from 'vue-i18n'
import { mwlRound, getColor } from '@/assets/js/common'

const { t, locale } = useI18n()
const store = useStore()
const detail = store.getters['analyze/getInhibitionAnalysisDetail']
const compId = detail.compId // TODO 아무 의미 없는 동적 클래스를 이걸로 분기하는거 제거하기 - 김현수

const score = computed(() => {
  if (detail.compId === 'AnalyzeAgingInhibitionAnalyzeIndex') {
    return mwlRound(detail.hqOxi?.score || 0, 0)
  } else if (detail.compId === 'AnalyzeChronicDiseaseControlAnalyzeIndex') {
    return mwlRound(detail.hqMet?.score || 0, 0)
  }

  return 0
})

const rank = computed(() => {
  if (detail.compId === 'AnalyzeAgingInhibitionAnalyzeIndex') {
    return detail.hqOxi?.percent || 0
  } else if (detail.compId === 'AnalyzeChronicDiseaseControlAnalyzeIndex') {
    return detail.hqMet?.percent || 0
  }

  return 0
})

const meanScore = computed(() => {
  if (detail.compId === 'AnalyzeAgingInhibitionAnalyzeIndex') {
    return detail.hqOxi?.t_mean
  } else if (detail.compId === 'AnalyzeChronicDiseaseControlAnalyzeIndex') {
    return detail.hqMet?.t_mean
  }

  return 0
})

const isOnceTime = computed(() => {
  return detail.commonInfo.analysisType === 'onetime'
})

const ageArea = computed(() => {
  let age = parseInt(detail.analyzeAge / 10) * 10
  if (age < 20) age = 20
  if (age > 80) age = 80
  if (isNaN(age)) age = 20

  return age
})

const gender = computed(() => {
  return detail.basics.sex === 1 ? t('Common.male') : t('Common.female')
})

const displayAgeArea = computed(() => ageArea.value)
const displayGender = computed(() => gender.value)
const displayAgeText = computed(() => t('Common.age'))

const genderImg = computed(() => {
  return detail.basics.sex === 1 ? 'm' : 'f'
})

const oxiOrMet = computed(() => {
  if (detail.compId === 'AnalyzeAgingInhibitionAnalyzeIndex') {
    return 'oxi'
  } else if (detail.compId === 'AnalyzeChronicDiseaseControlAnalyzeIndex') {
    return 'met'
  }
})

const violinImg = computed(() => { // 연령대에 해당하는 이미지 명
  let age = 20
  if (!isNaN(ageArea.value)) {
    age = ageArea.value
  }
  return '/img/pdf/res/violin/violin-' + oxiOrMet.value + '-' + age + '-' + genderImg.value + '.png' /* 병헌: 로그미가 준 원본 이미지에는 연령별, 성별 이미지가 pdf용과 웹용이 나뉘어 있지 않아서 pdf/웹 같은 이미지를 사용했음 */
})

const color = computed(() => {
  let status = 0
  if (detail.compId === 'AnalyzeAgingInhibitionAnalyzeIndex') {
    // 노화 억제 분석지수
    status = detail.hqOxi?.status || 0
  } else if (detail.compId === 'AnalyzeChronicDiseaseControlAnalyzeIndex') {
    // 만성질환 억제 분석지수
    status = detail.hqMet?.status || 0
  }

  return getColor(status)
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

onUnmounted(() => {
  store.dispatch('analyze/setInhibitionAnalysisDetail', null)
})
</script>

<template>
  <div :class="compId + 'Detail'">
    <div :class="compId + 'Detail--my'">
      <h2 :class="compId + 'Detail--tit'">{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text1') }}</h2>
      <div :class="compId + 'Detail--index-wrap'">
        <strong :class="compId + 'Detail--index'" :style="{color: color}">{{ score }}</strong> {{ t('Common.score') }}
      </div>
      <div :class="compId + 'Detail--btn-wrap'">
        <button
          @click="popupOpen"
          v-if="!isOnceTime"
          type="button"
          :class="compId + 'Detail--btn'">{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text2') }}</button>
      </div>
    </div>

    <div :class="compId + 'Detail--graph-wrap'">
      <p :class="compId + 'Detail--age-wrap'">
        <strong v-if="locale !== 'en'" :class="compId + 'Detail--age'">{{ displayAgeArea }}{{ displayAgeText }} {{ displayGender }}</strong>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text3', { age: displayAgeArea, gender: displayGender }) }}
      </p>
      <div :class="compId + 'Detail--graph'">
        <div class="graph-wrap">
          <div class="violin-container">
            <div class="graph-back">
              <div class="legend">
                <div>
                  <span class="legend--avarage">{{ ageArea }}{{ t('Common.age') }} {{ t('Common.average') }}</span>
                  <div class="position" />
                  <span>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text4') }}</span>
                </div>
              </div>
              <div class="graph-wrap-in" />
            </div>
            <img class="violin" :src="violinImg" alt="" />
            <div class="my-point" :style="{ left: '50%', top: 100 - score + '%', }">
              <img class="my-point-img" src="/img/ico_me.svg" alt="" />
              <div class="my-point-pointer">
                <div class="point" />
              </div>
              <div class="my-point-score">
                <span class="my-rank">{{ rank }}{{ t('Common.rank') }}</span>
              </div>
            </div>
            <img
              class="violin-avg"
              src="/img/violin-avg.svg"
              alt=""
              :style="{top: 100 - meanScore + '%',}" />
            <div class="violin-container--max">100</div>
          </div>
        </div>

      </div>
    </div>

    <AnalyzeScorecomAnalyzeIndexDetailPopup
      v-if="popup && detail"
      @popupClose="popupClose"
      :class="compId + 'Detail--popup'"
      :compId="compId"
      :ageArea="ageArea"
      :sendData="detail" />
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
.violin-title {
  width: 100%;

  h3 {
    text-align: left;
    /* top: 0; */
    /* position: absolute; */
    font-size: 12px;
    font-weight: 700;
    color: #000;
    align-self: flex-start;
    margin-bottom: 0px;
    line-height: normal;
  }
}

.violin-container {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  //margin-top: 65px;
  //height: 200px;
  height: 100%;
  width: 100%;

  img {
    position: absolute;
  }

  .indicator {
    position: absolute;
    /* right: -9px - 18px); */
    left: 102px;
    width: 8px;
    height: 200px;
    /* background-color: black; */
    border-top: 1px solid #414042;
    border-bottom: 1px solid #414042;

    text-align: center;

    font-weight: 400;
    font-size: 12px;
    color: #414042;

    .vertical {
      margin: 0 auto;
      width: 1px;
      background-color: #414042;
      height: 100%;
    }

    .max {
      text-align: left;
      position: absolute;
      width: 100px;
      right: -103px;
      top: 0;
      transform: translateY(-50%);
    }

    .mean {
      text-align: left;
      position: absolute;
      width: 100px;
      right: -103px;
      transform: translateY(-75%);
    }

    .min {
      position: absolute;
      text-align: left;
      width: 100px;
      right: -103px;
      bottom: 0;
      //transform: translateY(50%);
    }
  }

  &--max {
    font-size: 1.3rem;
    color: #555;
    position: absolute;
    top: -18px;
    left: 0;
  }
}

.graph-back {
  position: absolute;
  left: 0;
  top: 0;
  /* transform: translateX(calc(50% + 23px)); */

  //height: 236px;
  height: 100%;
  /* width: calc(239px + 23px); */
  width: 100%;
  //@include flex(flex-start, center);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  img {
    //margin-top: 18px;
    width: auto;
    //height: 219px;
    //transform: translateX(-11.5px);
  }

  .legend {
    width: calc(270px + 7px);
    margin-left: -18px;

    font-size: 14px;
    color: #555;
    text-align: left;
    //margin-bottom: 5px;
    //@include flex(space-between, center);
    display: flex;
    //justify-content: space-between;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -4rem;

    @media (min-width: 960px) {
      font-size: 1.5rem;
      bottom: -4.4rem;
    }

    .name {
      margin-left: 0px;
    }

    div {
      display: inline-block;
      vertical-align: -8%;
      //@include flex(center, center);
      //display: flex;
      //justify-content: center;
      //align-items: center;
    }

    span {
      margin: 0;
      margin-left: 5px;
      font-family: 'RixSinHead_Medium', sans-serif;
    }

    .position {
      $size: 1.2rem;
      width: $size;
      height: $size;
      border-radius: $size;
      background-color: #1DB196;
      margin-left: 13px;
    }

    img {
      position: relative;
      width: 19px;
      height: auto;
      margin: 0;
      transform: translateX(0%);
    }

    &--avarage {
      &:before {
        content: "";
        display: inline-block;
        width: 3rem;
        height: 1rem;
        margin-right: .5rem;
        background: url("/img/img_biolet_line.svg") no-repeat left;
      }
    }
  }
}

.violin {
  /* width: 104px;
  height: auto; */
  /* height: 138px; */
  height: 100%;
  width: auto;
  object-fit: contain;
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;

  .my-point-score {
    position: absolute;
    color: #1DB196;
    font-size: 17px;
    width: 100px;
    top: -47px;
    left: 18px;
    text-align: left;

    @media (min-width: 960px) {
      font-size: 2rem;
    }
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -17px);
    width: 24px !important;
    height: auto;
    right: 0;
    bottom: 0;
    z-index: 1;
    max-width: 2.4rem;
  }

  .my-point-pointer {
    z-index: 1;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
    height: 21.65px;
    width: 1px;
    /* background-color: #00b4de; */
    border-right: 1px dashed #00b4de;

    .point {
      position: absolute;

      /* right: -5.68px; */
      z-index: 100;
      transform: translate(-50%, 50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1.3px solid white;
      background-color: #1DB196;
      /* bottom: -5.68px; */
      bottom: 0;
    }
  }
}

.violin-avg {
  position: absolute;
  transform: translateY(-50%);
  //width: 90px;
  height: auto;
}
.my-rank{
  padding: 0 2px;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
  border-radius: 5px;
  z-index: 1;
  position: relative;
}
</style>
