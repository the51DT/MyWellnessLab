<script>
import BaseTooltip from '../BaseTooltip.vue'
import { go } from '@/assets/js/common' /* 231211 페이지 이동 추가(기존에 있던 거임) */

export default {
  name: 'AnalyzeABCHealthGrade',
  components: { BaseTooltip },

  data () {
    return {
      tooltip: false, /* 툴팁 오프너 */
      tooltipEdge: 0, /* 231205 툴팁 꼬다리 위치 */
      gradeData: [
        {
          grade: 'A',
          txt: '노화억제 분석지수 또는 만성질환 억제 지수 모두 건강한 상태'
        },
        {
          grade: 'B',
          txt: '노화억제 분석지수 또는 만성질환 억제 지수 중 하나가 위험한 상태'
        },
        {
          grade: 'C',
          txt: '노화억제 분석지수 또는 만성질환 억제 지수 모두 위험한 상태'
        }
      ]
    }
  },
  methods: {
    go, /* 231211 페이지 이동 추가 */
    tooltipClose () { /* 툴팁 닫기 */
      this.tooltip = false
    },
    openTooltip ($event) { /* 툴팁 열기 */ /* 231205 변수추가 */
      this.tooltip = true
      this.tooltipEdge = $event.x /* 231205 추가 */
    }
    // 231211 기존 함수 삭제
  }
}
</script>

<template>
  <div class="AnalyzeABCHealthGrade">
    <div class="tooltip AnalyzeABCHealthGrade--tooltip">
      <h2 class="tooltip--tit AnalyzeABCHealthGrade--tip-tit">ABC 건강 등급</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeABCHealthGrade--tip-btn"
        type="button"
        title="도움말" /> <!--231205 함수에 파라미터 추가-->

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeABCHealthGrade--tip-dom"> <!--231205 프롭추가-->
        <template v-slot:contents>
          <p class="AnalyzeMajorHealthRisk--tip-txt">ABC 건강 등급은 노화 억제 분석 지수와 만성질환 억제 분석지수를 바탕으로 구분됩니다 가장 건강한 상태의 A형과 두  지수 중  하나가 위험한 B형, 모든 건강지표의 위험도를 점검해야 하는 C형으로 나누어집니다</p>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box"> <!--231205 div 추가-->
      <p class="AnalyzeABCHealthGrade--info">
        건강분석 결과 현재 <strong>{{gradeData[1].grade}}등급</strong>과 가장 유사한 건강상태를 보입니다
      </p>

      <div class="AnalyzeABCHealthGrade--grade">
        <div class="AnalyzeABCHealthGrade--grade-wrap b">
          <div class="AnalyzeABCHealthGrade--grade-alpa">{{gradeData[1].grade}}</div>
          <div class="AnalyzeABCHealthGrade--grade-unit">등급</div>
          <!--          231205 버튼 위치 아래로 이동-->
        </div>
      </div>

      <div class="AnalyzeABCHealthGrade--desc">
        <p class="AnalyzeABCHealthGrade--desc-txt">{{ gradeData[1].txt }}</p>
      </div>

      <div class="AnalyzeABCHealthGrade--btn-wrap">
        <button @click="go('/analyze-abc-health-grade-detail')" type="button" class="AnalyzeABCHealthGrade--btn">자세히 보기</button> <!--231211 함수 변경-->
      </div>

    </div>
    <div class="AnalyzeABCHealthGrade--desc2">
      <p class="AnalyzeABCHealthGrade--desc2-txt">* 본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다<br />본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다</p>
    </div>

  </div>
</template>

<style scoped>

</style>
