<script>
import BaseTooltip from '../BaseTooltip.vue'
import router from '@/router'
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import AnalyzeHealthLightPopup from '@/views/publishing/analyze/AnalyzeHealthLightPopup.vue'
import AnalyzeMajorHealthRiskPopup from '@/views/publishing/analyze/AnalyzeMajorHealthRiskPopup.vue' /* 231211 주요건강위험요인 팝업 추가 */

export default {
  name: 'AnalyzeMajorHealthRisk',
  components: {
    AnalyzeMajorHealthRiskPopup,
    AnalyzeHealthLightPopup,
    BasePopupTit,
    BaseTooltip
  }, /* 231211 콤포넌트 추가 */

  data () {
    return {
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 231205 툴팁 꼬다리 위치 */
      data: [ /* 개발 시 수정 요망 */
        {
          factor: '체질량 지수',
          grade: '위험',
          num: 28,
          unit: '(kg/m2)'
        },
        {
          factor: '저밀도 콜레스테롤',
          grade: '주의',
          num: 145,
          unit: '(mg/dL)'
        },
        {
          factor: '아스파테이트 아미노 전이효소',
          grade: '위험',
          num: 12,
          unit: '(AST/SGOT,IU/L)'
        },
        {
          factor: '수면',
          grade: '주의',
          num: 67,
          unit: '(시간:분)'
        },
        {
          factor: '스트레스',
          grade: '위험',
          num: '대단히 많음',
          unit: ''
        }
      ],
      isPop: false /* 231211 팝업 오프너 */
    }
  },
  methods: {
    tooltipClose () { /* 툴팁 닫기 */
      this.tooltip = false
    },
    openTooltip ($event) { /* 툴팁 열기 */ /* 231205 매개변수 추가 */
      this.tooltip = true
      this.tooltipEdge = $event.x /* 231205 추가 */
    },
    detailView () { /* 자세히 보기 이동, 페이지로 갈지 팝업으로 갈지 결정이 안나 작업 안함, 확인 필요 */
      router.push('')
    },
    openPop () { /* 231211 팝업 열기 */
      this.isPop = true
    },
    popupClose () { /* 231211 팝업 닫기 */
      this.isPop = false
    }
  }
}
</script>

<template>
  <div class="AnalyzeMajorHealthRisk">
    <div class="tooltip AnalyzeMajorHealthRisk--tooltip">
      <h2 class="tooltip--tit AnalyzeMajorHealthRisk--tip-tit">주요 건강 위험 요인</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeMajorHealthRisk--tip-btn"
        type="button"
        title="도움말" /> <!--231205 함수 매개변수 추가-->

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeMajorHealthRisk--tip-dom"> <!--231205 프롭 추가-->
        <template v-slot:contents>
          <p class="AnalyzeMajorHealthRisk--tip-txt">나의 건강데이터를 바탕으로 건강 위험 요인을 알려드립니다</p>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box"> <!--231205 div 추가-->
      <p class="AnalyzeMajorHealthRisk--info">
        <strong class="AnalyzeMajorHealthRisk--danger">5가지</strong>의 주의 또는 관리가 필요한 요인이 있습니다
      </p>

      <div class="AnalyzeMajorHealthRisk--wrap">
        <div v-for="item in data" class="AnalyzeMajorHealthRisk--in" @click="openPop">
          <!--231211 팝업이 열릴 때 해당 지수가 기본값으로 나오도록 요망-->
          <h2 class="AnalyzeMajorHealthRisk--wrap-tit"><span>{{ item.factor }}</span></h2>
          <div class="AnalyzeMajorHealthRisk--wrap-grade" :class="item.grade === '위험' ? 'danger' : item.grade === '주의' ? 'caution' : ''">{{ item.grade }}</div>
          <div class="AnalyzeMajorHealthRisk--wrap-num">{{ item.num }}</div>
          <div class="AnalyzeMajorHealthRisk--wrap-unit">{{ item.unit }}</div>
        </div>
      </div>

    </div>

    <AnalyzeMajorHealthRiskPopup :isPop="isPop" @popupClose="popupClose" /> <!--231211 팝업-->

  </div>
</template>

<style scoped></style>
