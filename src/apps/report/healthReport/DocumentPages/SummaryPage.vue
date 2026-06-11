<script setup>
import { onMounted, computed } from "vue";
import PageHeader from "./PageHeader.vue";
import Bubble3DChartDocument from "./com/Bubble3DChartDocument.vue";
import ResultFifthDocument from "./com/ResultFifthDocument.vue";
import GuageChart from "./com/GuageChart.vue";
import ScoreComSummaryDocument from "./com/ScoreComSummaryDocument.vue";
const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  healthScoreData: Object,
  healthArindicatorData: Object,
  healthConditionData: Object,
  healthNetworkData: Object,
  healthRfsData: Object,
  exerciseIntensityData: Object,
  healthSleepHabitsData: Object,
  check_date: null,
  userInfo: null,
  pdfScale: null,
  page: Number,
  pdfScale: Number
});
onMounted(() => {
  emit('mounted')
})
const getMaxScoreValue = computed(() => {
  // 현재 나의 점수에 따라 최대값을 설정
  if (props.exerciseIntensityData.met_score >= 600) return props.exerciseIntensityData.met_score;
  return 600;
});

// 건강 기전과 생활습관의 상태별 갯수 체크
// 항목별로 Status 의미가 다를 수 있기 때문에 하나씩 체크함
const getNavigationCount = () => {
  var normal_count = 0;
  var warn_count = 0;
  var danger_count = 0;

  // 노화억제분석지수 
  if (props.healthScoreData.hq_oxi.status === 1) {
    normal_count++;
  } else if (props.healthScoreData.hq_oxi.status === 2) {
    warn_count++;
  } else if (props.healthScoreData.hq_oxi.status === 3) {
    danger_count++;
  }
  // 만성질환 억제분석 지수
  if (props.healthScoreData.hq_met.status === 1) {
    normal_count++;
  } else if (props.healthScoreData.hq_met.status === 2) {
    warn_count++;
  } else if (props.healthScoreData.hq_met.status === 3) {
    danger_count++;
  }

  // 근육 밸런스 분석 지수
  if (props.healthScoreData.hq_musBal.status === 1) {
    normal_count++;
  } else if (props.healthScoreData.hq_musBal.status === 2) {
    warn_count++;
  } else if (props.healthScoreData.hq_musBal.status === 3) {
    danger_count++;
  }

  //식사
  if (props.healthRfsData.rfs_status === 1) {
    normal_count++;
  } else if (props.healthRfsData.rfs_status === 2) {
    warn_count++;
  } else if (props.healthRfsData.rfs_status === 3) {
    danger_count++;
  }

  // 운동
  if (props.exerciseIntensityData.met_status === 1) {
    normal_count++;
  } else if (props.exerciseIntensityData.met_status === 2) {
    warn_count++;
  } else if (props.exerciseIntensityData.met_status === 3) {
    danger_count++;
  }

  // 수면
  if (props.healthSleepHabitsData.data_list[0].status === 1) {
    normal_count++;
  } else if (props.healthSleepHabitsData.data_list[0].status === 2) {
    warn_count++;
  } else if (props.healthSleepHabitsData.data_list[0].status === 3) {
    danger_count++;
  }

  const parts = [];
  if (normal_count > 0) parts.push(`좋음: ${normal_count}개`);
  if (warn_count > 0) parts.push(`관리: ${warn_count}개`);
  if (danger_count > 0) parts.push(`주의: ${danger_count}개`);

  return parts.join(', ');
};
</script>
<template>
  <div class="custom-page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title">
        <h3 class="stretch-text">
          {{ props.userInfo.user_name }}님의 건강수명 분석 결과 요약
        </h3>
        <span class="stretch-text">*이 페이지는 나의 건강수명 분석 결과를 한 장에 요약한 내용으로, 각 항목별 자세한 결과는 리포트 본문에서 확인하실 수 있습니다.</span>
      </div>
      <div class="summary">
        <div class="header">
          <span class="stretch-text">결과 요약</span>
        </div>
        <div class="summary-desc">
          주요 지수를 종합한 {{ props.userInfo.user_name }}님의 건강 위치와 건강 상태는 한국 성인 표본 집단과 비교해 {{
            props.healthScoreData.health_status_msg }} 수준입니다.<br />
          노화속도는 {{ props.healthScoreData.hq_ar.aging_rate }} 배속으로 {{ props.healthScoreData.hq_ar.status == 1 ? '저속 노화' :
            props.healthScoreData.hq_ar.status == 2 ? '보통 노화' : '가속 노화' }}가 진행중이며,
          건강 기전과 생활 습관으로 평가한 건강 신호등 결과는 {{ getNavigationCount() }}입니다.
          인체 생리 네트워크를 바탕으로 주의 및 관리가 필요한 건강 영역과 결과에 영향을 준 주요 요인을 확인하고, 마이웰니스 랩이 제안하는 맞춤 가이드를 실천하여 생활 습관 성형을 통한 건강수명 관리의
          여정을 시작해보세요.
        </div>
      </div>
      <div class="info">
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">주의</span>
          <div class="legend2"></div>
          <span class="stretch-text">보통</span>
          <div class="legend3"></div>
          <span class="stretch-text">좋음</span>
        </div>
        <div class="data-container">
          <div class="position">
            <div class="header">
              <span class="stretch-text">건강 위치</span>
            </div>
            <div class="chart">
              <div class="bubble">
                <div class="stretch-text reference">
                  <p>한국 성인 표본 집단 대비</p>
                  <p>건강상태 <span
                      :class="{ 'normal': props.healthScoreData.hq_htype.status == 1, 'warn': props.healthScoreData.hq_htype.status == 2, 'danger': props.healthScoreData.hq_htype.status == 3 }">{{
                        props.healthScoreData.hq_htype.status == 1 ? "좋음" : props.healthScoreData.hq_htype.status == 2
                          ? "보통" : "나쁨" }} </span></p>
                </div>
                <!-- 나의 건강 위치 그래프 -->
                <Bubble3DChartDocument :health-score-data="props.healthScoreData" :pdfScale="props.pdfScale"
                  :save="props.save" :left="-35" :user-info="props.userInfo" />
              </div>
            </div>
          </div>
          <div class="speed">
            <div class="header">
              <span class="stretch-text">노화 속도</span>
            </div>
            <div class="chart">
              <div class="speed-container">
                <div class="text stretch-text">
                  <span :class="{
                    'warn': props.healthScoreData.hq_ar.status === 2,
                    'normal': props.healthScoreData.hq_ar.status === 1,
                    'danger': props.healthScoreData.hq_ar.status === 3
                  }">{{

                    props.healthScoreData.hq_ar.status === 1
                      ? "저속 노화"
                      : props.healthScoreData.hq_ar.status === 2
                        ? "보통 노화"
                        : props.healthScoreData.hq_ar.status === 3
                          ? "가속 노화"
                          : "보통 노화"
                  }}</span> 진행 중
                </div>
                <!-- 나의 노화 속도 게이지 그래프 -->
                <GuageChart :value="props.healthScoreData.hq_ar.aging_rate" :pdfScale="props.pdfScale"
                  :showScore="true">
                </GuageChart>
              </div>
            </div>
          </div>
        </div>
        <div class="score-container">
          <div class="header">
            <span class="stretch-text">건강 신호등</span>
          </div>
          <div class="score">
            <div class="health">
              <div class="category">
                건강 지수
              </div>
              <div class="oxi-container">
                <div class="score-title">노화 억제 분석 지수</div>
                <div class="oxi-score">
                  <div class="oxi-score-desc stretch-text">

                    같은 연령대 <br />
                    100명 중 {{ props.healthScoreData.hq_oxi.percent }} 등
                  </div>
                  <div class="score-div">
                    <!-- 노화 억제 분석 지수 점수 그래프 -->
                    <ScoreComSummaryDocument :pdfScale="props.pdfScale" :value="props.healthScoreData.hq_oxi.score"
                      :status="props.healthScoreData.hq_oxi.status" :width="3.5" :right="false" />
                  </div>

                </div>
                <div class="vertical-line"></div>
              </div>

              <div class="met-container">
                <div class="score-title">만성질환 억제 분석 지수</div>
                <div class="met-score">

                  <div class="met-score-desc stretch-text">
                    같은 연령대 <br />
                    100명 중 {{ props.healthScoreData.hq_met.percent }} 등
                  </div>
                  <div class="score-div right">
                    <!-- 만성질환 억제 분석 지수 점수 그래프 -->
                    <ScoreComSummaryDocument :pdfScale="props.pdfScale" :value="props.healthScoreData.hq_met.score"
                      :status="props.healthScoreData.hq_met.status" :width="3.5" :right="false" />
                  </div>
                </div>
                <div class="vertical-line"></div>
              </div>
              <div class="mus-container">
                <div class="score-title">근육 밸런스 분석 지수</div>
                <div class="mus-score">
                  <div class="mus-score-desc stretch-text">

                    같은 연령대 <br />
                    100명 중 {{ props.healthScoreData.hq_musBal.percent }} 등
                  </div>
                  <div class="score-div right">
                    <!-- 근육밸런스 지수 점수 그래프 -->
                    <ScoreComSummaryDocument :pdfScale="props.pdfScale" :value="props.healthScoreData.hq_musBal.score"
                      :status="props.healthScoreData.hq_musBal.status" :width="3.5" :right="false" />
                  </div>
                </div>
              </div>
            </div>
            <div class="life">
              <div class="category">
                생활 습관
              </div>
              <div class="eat-container">
                <div class="score-title">식사</div>
                <div class="eat-score">
                  <div class="eat-score-desc stretch-text">
                  </div>
                  <div class="score-div">
                    <!-- 식사 점수 그래프 -->
                    <ScoreComSummaryDocument :pdfScale="props.pdfScale" :value="props.healthRfsData.rfs_cal_data"
                      :status="props.healthRfsData.rfs_status" :width="3.5" :right="false" />
                  </div>

                </div>
                <div class="vertical-line"></div>
              </div>
              <div class="exercise-container">
                <div class="score-title">운동</div>
                <div class="exercise-score">
                  <div class="exercise-score-desc stretch-text">
                  </div>
                  <div class="score-div">
                    <!-- 운동 점수 그래프 -->
                    <ScoreComSummaryDocument :pdfScale="props.pdfScale" :value="props.exerciseIntensityData.met_score"
                      :status="props.exerciseIntensityData.met_status" :width="3.5" :right="false"
                      :max-value="getMaxScoreValue" :hide-score="true" />
                    <div class="score-text">
                      <div class="score-top stretch-text"
                        :class="props.exerciseIntensityData.met_status == 1 ? 'green' : props.exerciseIntensityData.met_status == 3 ? 'red' : 'yellow'">
                        <div class="score-number">{{ props.exerciseIntensityData.met_score }}</div>
                      </div>
                      <div class="score-bottom stretch-text">
                        MET
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vertical-line"></div>
              </div>
              <div class="sleep-container">
                <div class="score-title">수면</div>
                <div class="sleep-score">
                  <div class="sleep-score-desc stretch-text">
                  </div>
                  <div class="score-div">
                    <!-- 수면 점수 그래프 -->
                    <ScoreComSummaryDocument :pdfScale="props.pdfScale"
                      :value="props.healthSleepHabitsData.data_list[0].cal_data"
                      :status="props.healthSleepHabitsData.data_list[0].status" :width="5" :right="false" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="legend-container">
        <img src="@/assets/images/pdf/res/legend-danger.png" class="legend4" />
        <span class="stretch-text">주의</span>
        <img src="@/assets/images/pdf/res/legend-warn.png" class="legend5" />
        <span class="stretch-text">관리</span>
      </div>
      <div class="danger-factor-container">
        <div class="position">
          <div class="header">
            <span class="stretch-text">주의 및 관리가 필요한 영역</span>
            <span class="appendix">*주의 및 관리가 필요한 영역은 나의 인체 생리 네트워크를 기반으로 분석되었습니다.</span>
          </div>
        </div>
        <div class="data-container">
          <!-- 주요 건강 위험 요인 / 신경 써야 할 건강 분야 -->
          <ResultFifthDocument :userInfo="props.userInfo" :health-network-data="props.healthNetworkData" />
        </div>
      </div>
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.본인의 건강 상태에 대한 정확한 진단이 필요한 경우 전문의와 상의하시기 바랍니다. 건강 위치, 노화 속도, 노화 억제분석
        지수, 만성질환 억제 분석 지수, 근육 밸런스 분석 지수는 건강검진 결과, 신체계측 및 생활습관등 다양한 요소 간의 상관관계를 종합적으로 고려해 산출됩니다/ 따라서, 입력한 결과가 정상 범위내에
        있더라도 다른 건강한 사람과 비교하여 나의 건강 위험도가 높을 수 있습니다.
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";

.title {
  position: relative;
  font-size: calc(26px * $pdf-scale);
  height: calc(56px * $pdf-scale);
  line-height: 1;
  vertical-align: baseline;
  color: #00a856;
  padding-top: calc(5px * $pdf-scale);

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #64A531;
    font-weight: $medium;
    text-align: center;
    line-height: calc(28px * $pdf-scale) !important;
  }

  span {
    padding-top: calc(12px * $pdf-scale);
    color: #727171;

    font-size: calc(7px * $pdf-scale) !important;
    font-weight: $regular !important;
    text-align: left !important;
    line-height: 160% !important;
  }

  img {
    width: calc(42.9px * $pdf-scale) !important;
    height: calc(42.9px * $pdf-scale) !important;
    object-fit: contain;
  }
}

.summary {
  position: relative;
  width: 100%;
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  margin-top: 20px;

  .header {
    height: calc(17px * $pdf-scale);
    background-color: #008452;
    padding-left: calc(6.5px * $pdf-scale);
    @include flex(flex-start, center);
    width: 100%;
    font-size: calc(11px * $pdf-scale);
    font-weight: $semibold;
    color: #ffffff;

    span {
      display: inline-block;
    }
  }

}

.info {
  position: relative;
  width: 100%;
  margin-top: calc(8px * $pdf-scale);
  margin-bottom: calc(10px * $pdf-scale);
  color: #000;

  .data-container {
    @include flex(space-between, center);
    gap: calc(11px * $pdf-scale);
    margin-top: calc(4px * $pdf-scale);
  }

  .score-container {
    margin-top: calc(10px * $pdf-scale);
    height: calc(269px * $pdf-scale);
  }

  .position {
    width: calc(252px * $pdf-scale);
  }

  .speed {
    width: calc(252px * $pdf-scale);
  }

  .header {
    padding-left: calc(6.5px * $pdf-scale);
    @include flex(flex-start, center);
    height: calc(17px * $pdf-scale);
    background-color: #008452;
    color: #ffffff;
    font-size: calc(11px * $pdf-scale);
    font-weight: $semibold;

    span {
      display: inline-block;
    }
  }
}

.score {
  position: relative;
  border: calc(0.3px * $pdf-scale) solid #000000;
  height: calc(252px * $pdf-scale);
  padding: calc(15px * $pdf-scale) calc(12px * $pdf-scale);

  .health {
    @include flex(flex-start, flex-end);
    position: relative;
    width: 100%;
    height: calc(116px * $pdf-scale);
    border: calc(0.3px * $pdf-scale) solid #C9CACA;
  }

  .life {
    @include flex(flex-start, flex-end);
    margin-top: calc(14px * $pdf-scale);
    position: relative;
    width: 100%;
    height: calc(95px * $pdf-scale);
    border: calc(0.3px * $pdf-scale) solid #C9CACA;
  }

  .category {
    @include flex(center, center);
    font-size: calc(10px * $pdf-scale);
    font-weight: $bold;
    color: #727171;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(-8px * $pdf-scale);
    background-color: #ffffff;
    width: calc(57px * $pdf-scale);

  }

  .score-title {
    font-size: calc(8px * $pdf-scale);
    font-weight: $semibold;
  }

  .oxi-container {

    width: 33.33%;
    position: relative;
    height: 100%;
    padding: calc(13px * $pdf-scale) calc(24px * $pdf-scale) calc(11px * $pdf-scale) calc(14px * $pdf-scale);
  }

  .oxi-score {
    @include flex(flex-start, flex-end);
    margin-top: calc(23.25px * $pdf-scale);
  }

  .oxi-score-desc {
    width: 50%;
    font-weight: $regular;
    line-height: 155%;
    font-size: calc(8px * $pdf-scale);
    color: #727171;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }

  .met-container {
    position: relative;
    flex: 1;
    padding: calc(13px * $pdf-scale) calc(24px * $pdf-scale) calc(11px * $pdf-scale) calc(14px * $pdf-scale);
    height: 100%;
  }

  .met-score {
    @include flex(flex-start, flex-end);
    margin-top: calc(23.25px * $pdf-scale);
  }

  .met-score-desc {
    width: 50%;
    font-weight: $regular;
    line-height: 155%;
    font-size: calc(8px * $pdf-scale);
    color: #727171;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }

  .mus-container {
    position: relative;
    flex: 1;
    padding: calc(13px * $pdf-scale) calc(24px * $pdf-scale) calc(11px * $pdf-scale) calc(14px * $pdf-scale);
    height: 100%;
  }

  .mus-score {
    @include flex(flex-start, flex-end);
    margin-top: calc(23.25px * $pdf-scale);
  }

  .mus-score-desc {
    width: 50%;
    font-weight: $regular;
    line-height: 155%;
    font-size: calc(8px * $pdf-scale);
    color: #727171;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }

  .eat-container {
    width: 33.33%;
    position: relative;
    height: 100%;
    padding: calc(13px * $pdf-scale) calc(24px * $pdf-scale) calc(15px * $pdf-scale) calc(14px * $pdf-scale);
  }

  .eat-score {
    @include flex(flex-start, flex-end);
    margin-top: calc(17.25px * $pdf-scale);
  }

  .eat-score-desc {
    width: 50%;
    padding-top: calc(12px * $pdf-scale);
    line-height: 155%;
    font-size: calc(8px * $pdf-scale);
    color: #727171;
    font-weight: $regular;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }

  .exercise-container {

    width: 33.33%;
    position: relative;
    height: 100%;
    padding: calc(13px * $pdf-scale) calc(24px * $pdf-scale) calc(15px * $pdf-scale) calc(14px * $pdf-scale);
  }

  .exercise-score {
    @include flex(flex-start, flex-end);
    margin-top: calc(17.25px * $pdf-scale);

    .score-div {
      position: relative;
    }

    .score-text {
      position: absolute;
      flex-direction: column;
      top: 0;
      @include flex(center, center);
      width: 100%;
      height: 100%;

      .score-top {
        @include flex(center, center);

        .score-number {
          font-size: calc(20px * $pdf-scale);
          font-weight: $regular;
          letter-spacing: -(calc(20px * $pdf-scale) * 0.05);
          line-height: 100%;
        }

        .score-text {
          font-size: calc(7px * $pdf-scale);
          font-weight: $medium;
          letter-spacing: -(calc(7px * $pdf-scale) * 0.05);
        }

        &.green {
          color: #5AB651
        }

        &.red {
          color: #E95371;
        }

        &.yellow {
          color: #F8B500;
        }
      }

      .score-bottom {
        font-size: calc(6px * $pdf-scale);
        font-weight: $regular;
        color: #727171;
        text-align: center;
      }
    }
  }

  .exercise-score-desc {
    width: 50%;
    padding-top: calc(12px * $pdf-scale);
    font-weight: 400;
    line-height: 155%;
    font-size: calc(8px * $pdf-scale);
    color: #727171;
    font-weight: $regular;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }

  .sleep-container {
    width: 33.33%;
    position: relative;
    height: 100%;
    padding: calc(13px * $pdf-scale) calc(24px * $pdf-scale) calc(15px * $pdf-scale) calc(14px * $pdf-scale);
  }

  .sleep-score {
    @include flex(flex-start, flex-end);
    margin-top: calc(17.25px * $pdf-scale);

  }

  .sleep-score-desc {
    width: 50%;
    padding-top: calc(12px * $pdf-scale);
    line-height: 155%;
    font-size: calc(8px * $pdf-scale);
    color: #727171;
    font-weight: $regular;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }
}

.summary-desc {
  @include flex(flex-start, flex-start);
  color: #000000;
  font-weight: $regular;
  font-size: calc(8px * $pdf-scale);
  padding: calc(12px * $pdf-scale) calc(11px * $pdf-scale);
  border: calc(0.3px * $pdf-scale) solid #000000;
  letter-spacing: -(calc(8px * $pdf-scale) * 0.04);
}

.chart {
  @include flex(flex-start, flex-start);

  height: calc(143px * $pdf-scale);
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  font-weight: $regular;

  .bubble {
    @include flex(flex-start, flex-end);
    width: calc(252px * $pdf-scale);
    height: 100%;
    border: calc(0.3px * $pdf-scale) solid #000000;
    padding: calc(10px * $pdf-scale) calc(17px * $pdf-scale) calc(11px * $pdf-scale) calc(14px * $pdf-scale);

    .reference {
      display: inline-block;
      margin-top: calc(5px * $pdf-scale);
      font-size: calc(8px * $pdf-scale);
      letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
      font-weight: $regular;
      width: 50%;
      color: #727171;
      line-height: 160% !important;

      & span {
        vertical-align: baseline;
        font-weight: $bold;

        &.normal {
          color: #5AB651;
        }

        &.warn {
          color: #F8B500;
        }

        &.danger {
          color: #E95371;
        }
      }
    }
  }

  .speed-container {
    @include flex(flex-start, flex-end);
    position: relative;
    flex: 1;
    height: 100%;
    border: calc(0.3px * $pdf-scale) solid #000000;
    padding: calc(12px * $pdf-scale) calc(22px * $pdf-scale) calc(11px * $pdf-scale) calc(14px * $pdf-scale);

    .text {
      color: #727171;
      width: 40%;
      font-weight: 400 !important;
      top: calc(3px * $pdf-scale) !important;
      left: calc(6.23px * $pdf-scale) !important;
      font-size: calc(8px * $pdf-scale) !important;
      line-height: 160% !important;
      letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
    }

    & span {
      vertical-align: baseline;
      font-weight: $bold;

      &.normal {
        color: #5AB651;
      }

      &.warn {
        color: #F8B500;
      }

      &.danger {
        color: #E95371;
      }
    }
  }
}

.bottom-info {
  position: static;
  margin-top: calc(4px * $pdf-scale);
}

.score-div {
  margin: 0 auto;
  width: calc(57px * $pdf-scale);
  height: calc(57px * $pdf-scale);
  transform: translateY(-36%);
  .container {
    min-height: auto;
  }
}

.right {
  right: calc(7px * $pdf-scale);
}

.legend-container {
  @include flex(flex-end, center);
  z-index: 1;

  img {
    width: calc(8.44px * $pdf-scale);
    height: calc(7.49px * $pdf-scale);
  }

  .legend1 {
    display: inline-block;
    margin-right: calc(3px * $pdf-scale);

    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #E95371;
  }

  .legend2 {
    display: inline-block;
    margin-right: calc(2px * $pdf-scale);
    margin-left: calc(8px * $pdf-scale);

    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #F8B500;
  }

  .legend3 {
    display: inline-block;
    margin-right: calc(2px * $pdf-scale);
    margin-left: calc(8px * $pdf-scale);

    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #5AB651;
  }

  .legend4 {
    margin-right: calc(1.12px * $pdf-scale);
    margin-left: calc(1.12px * $pdf-scale);
  }

  .legend5 {
    margin-right: calc(1.12px * $pdf-scale);
    margin-left: calc(9.44px * $pdf-scale);
  }

  span {
    display: inline-block;
    font-size: calc(8px * $pdf-scale);
    font-weight: $regular;
    line-height: 100%;
    color: #727171;
    letter-spacing: -(calc(8px * $pdf-scale) * 0.05);
  }
}

.danger-factor-container {
  position: relative;
  width: 100%;
  border: calc(0.3px * $pdf-scale) solid #000000;
  margin-top: calc(3px * $pdf-scale);

  .header {
    height: calc(17px * $pdf-scale);
    background-color: #008452;
    padding-left: calc(6.5px * $pdf-scale);
    @include flex(flex-start, baseline);
    width: 100%;
    font-size: calc(11px * $pdf-scale);
    font-weight: $semibold;
    color: #ffffff;

    span {
      display: inline-block;
    }

    .appendix {
      font-size: calc(6px * $pdf-scale);
      color: #ffffff;
      margin-left: calc(3px * $pdf-scale);
      font-weight: $regular;
    }
  }

  .data-container {
    @include flex(flex-start, center);
    gap: calc(14.85px * $pdf-scale);
    padding: calc(10px * $pdf-scale) calc(8px * $pdf-scale);
    height: calc(91px * $pdf-scale);
  }

}

.vertical-line {
  position: absolute;
  top: calc(12px * $pdf-scale);
  right: 0;
  width: calc(0.3px * $pdf-scale);
  height: 80%;
  background-color: #C9CACA;
}
</style>