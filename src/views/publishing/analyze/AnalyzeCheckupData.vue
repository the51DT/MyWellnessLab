<script>
import router from '@/router'

export default {
  name: 'AnalyzePreface',
  data () {
    return {
      targetName: '홍길동', /* 대상자 이름 없을 경우 일회성 분석으로 자동 표기 됨 */
      analyzeDate: '2023. 10. 25', /* 건강 분석일 */
      source: '국민건강보험공단' /* 직접 입력 or 국민건강보험공단 */
    }
  },
  methods: {
    goData () { /* 자세히보기 */
      router.push('/publishing/analyze/analyze-checkup-data-record')
    }
  }
}
</script>

<template>
  <div class="AnalyzePreface"> <!--개요-->
    <div class="AnalyzePreface--info">
      <div v-if="targetName" class="AnalyzePreface--name-wrap">
        <strong class="AnalyzePreface--name">{{ targetName }}</strong>님의
      </div>
      <div v-else class="AnalyzePreface==one">일회성 분석에 대한</div>
      <span class="AnalyzePreface--ment">웰니스 분석 결과입니다</span>
    </div>
    <div class="AnalyzePreface--con">
      <div class="AnalyzePreface--detail">
        웰니스 분석일: <span class="AnalyzePreface--date">{{ analyzeDate }}</span> <br />
      </div>
      <div class="AnalyzePreface--detail-view">
        <div class="AnalyzePreface--detail-data">
          검진 데이터: <span class="AnalyzePreface--data">{{ source }}</span>
        </div>
        <div class="AnalyzePreface--detail-btn">
          <button @click="goData" type="button" class="AnalyzePreface--btn">자세히 보기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
