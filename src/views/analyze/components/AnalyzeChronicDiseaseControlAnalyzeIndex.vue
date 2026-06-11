<script>
import BaseTooltip from '../BaseTooltip.vue'
import router from '../../router'
import 'vue3-circle-progress/dist/circle-progress.css'
import CircleProgress from 'vue3-circle-progress'
import { useI18n } from 'vue-i18n'

export default {
  name: 'AnalyzeChronicDiseaseControlAnalyzeIndex',
  components: {
    BaseTooltip,
    CircleProgress
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data () {
    return {
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 231204 툴팁 꼬다리 위치 */
      score: 54, /* 노화 억제 분석지수 점수 */
      grade: t('AnalyzeChronicDiseaseControlAnalyzeIndex.normalLevel'), /* 평균과 비교하여, 좋은수준/보통수준/나쁜수준 */
      age: 45, /* 사용자 만 나이 */
      total: 100, /* 몇명 중 */
      rank: 53 /* 등수 */
    }
  },
  computed: {
    ages () { /* 나이대 계산 */
      const tempAge = String(this.age)
      return tempAge.slice(0, tempAge.length - 1) + 0
    }
  },
  methods: {
    /**
     * 툴팁 닫기
     */
    closeTooltip () {
      this.tooltip = false
    },
    /**
     * openTooltip ($event) { /* 툴팁 열기
     * @param {*} $event
     */
    openTooltip ($event) {
      this.tooltip = true
      this.tooltipEdge = $event.x
    },
    /**
     * 자세히 보기 이동
     */
    go () {
      router.push('/analyze/chronic-disease')
    }
  }
}
</script>

<template>
  <div class="AnalyzeChronicDiseaseControlAnalyzeIndex"> <!--노화 억제 분석 지수-->
    <div class="tooltip AnalyzeChronicDiseaseControlAnalyzeIndex--tooltip">
      <h2 class="tooltip--tit AnalyzeChronicDiseaseControlAnalyzeIndex--tip-tit">{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndex.text1')}}</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeChronicDiseaseControlAnalyzeIndex--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="closeTooltip"
        class="AnalyzeChronicDiseaseControlAnalyzeIndex--tip-dom">
        <template v-slot:contents>
          <p class="AnalyzeChronicDiseaseControlAnalyzeIndex--tip-txt">{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndex.text2')}}</p>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box">
      <p class="AnalyzeAgingInhibitionAnalyzeIndex--info">{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndex.text3')}}
        <strong class="AnalyzeAgingInhibitionAnalyzeIndex--score">{{ score }}{{ $t('Common.score')}}</strong>{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndex.text4')}}
        <strong class="AnalyzeAgingInhibitionAnalyzeIndex--grade">{{ grade }}</strong>{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndex.text5')}}
      </p>

      <div class="AnalyzeAgingInhibitionAnalyzeIndex--graph"> <!--그래프-->

        <div class="AnalyzeAgingInhibitionAnalyzeIndex--circle chronic">
          <circle-progress
            :is-bg-shadow="false"
            :percent="score"
            :size="260"
            :border-width="8"
            :border-bg-width="0"
            :fill-color="`#F6746F`" />
          <div class="AnalyzeAgingInhibitionAnalyzeIndex--summary">
            <div class="AnalyzeAgingInhibitionAnalyzeIndex--rank-wrap">
              <div class="AnalyzeAgingInhibitionAnalyzeIndex--score-wrap">
                <strong class="AnalyzeAgingInhibitionAnalyzeIndex--sum-score">{{ score }}</strong>{{ $t('Common.score')}}
              </div>
              <div class="AnalyzeAgingInhibitionAnalyzeIndex--order">
                <span class="AnalyzeAgingInhibitionAnalyzeIndex--ages">{{ ages }}</span>{{ $t('Common.age')}}
                <span class="AnalyzeAgingInhibitionAnalyzeIndex--people">{{ total }}</span>{{ $t('Common.people')}} <br />
              </div>
              <strong class="AnalyzeAgingInhibitionAnalyzeIndex--rank">{{ rank }}{{ $t('Common.rank')}}</strong>
              <button @click="go" type="button" class="AnalyzeAgingInhibitionAnalyzeIndex--more-btn">{{ $t('Common.detail')}}</button>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped></style>
