<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import PageHeader from "./PageHeader.vue";
import ScoreComDocument from "./com/ScoreComDocument.vue";
import { ageToAgeGroup } from '@/utils/common.js'

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  health: null,
  save: Boolean,
  userInfo: null,
  healthScoreData: null,
  pdfScale: Number,
  page: Number
});
const myPointX = ref(0);

onMounted(async () => {
  // 나의 점수 위치 X 좌표 계산
  await nextTick();

  getAgeGroupIndex(props.healthScoreData.hqReference.age, 20, 80, 7);

  // window.addEventListener("resize", () => {
  //   getAgeGroupIndex(props.healthScoreData.hqReference.age, 20, 80, 7);
  // });

  emit('mounted')
});

onUnmounted(() => {
  // window.removeEventListener("resize", () => {
  //   getAgeGroupIndex(props.healthScoreData.hqReference.age, 20, 80, 7);
  // });
});

const getAgeGroupIndex = async (age, minAge = 20, maxAge = 80, step = 7) => {

  if (age < minAge) {
    age = minAge;
  } else if (age > maxAge) {
    age = maxAge;
  } else {
    age = age;
  }
  const myPoint = document.querySelector("#page14 .my-point");
  const violin = document.querySelector("#VolinBox");

  const style = window.getComputedStyle(violin);
  const paddingLeft = parseFloat(style.paddingLeft);
  const paddingRight = parseFloat(style.paddingRight);

  const violinWidth = violin.clientWidth - paddingLeft - paddingRight; // 전체 차트 너비
  const perViolinWidth = violinWidth / step; // 각 구간의 화면 너비

  const positionIndex = Math.floor((age - minAge) / 10); // 몇 번째 구간인지

  myPoint.style.width = perViolinWidth + 'px';
  myPoint.style.left = (perViolinWidth * positionIndex) + 'px'; // CSS 적용

}

</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-met.png" />

          <h3 class="stretch-text">만성질환 억제 분석 지수</h3>
          <span class="stretch-text">
            만성질환 억제 분석 지수는 나의 신진대사 능력을 100점 척도로 평가한 점수입니다. 만성질환 억제 분석 지수가 낮으면 대사 능력이 낮고, 분석 지수가 높으면 대사 능력이 높음을 의미합니다. 나의
            점수를 확인해보세요.
          </span>
        </div>
        <div class="vertical-line"></div>
        <div class="score-container">
          <div class="stretch-text">[나의 만성질환 억제 분석 지수]</div>
          <div class="score-chart">
            <div class="score-div">
              <!-- 점수 그래프 -->
              <ScoreComDocument :pdfScale="props.pdfScale" :value="props.healthScoreData.hq_met.score"
                :status="props.healthScoreData.hq_met.status" :width="8" :hideScore="true" :right="false" />
            </div>
            <div class="score">
              <div class="score-top stretch-text"
                :class="props.healthScoreData.hq_met.status == 1 ? 'green' : props.healthScoreData.hq_met.status == 3 ? 'red' : 'yellow'">
                <div class="score-number">{{ props.healthScoreData.hq_met.score }}</div>
                <div class="score-text">점</div>
              </div>
              <div class="score-bottom stretch-text">
                {{ ageToAgeGroup(props.healthScoreData.hqReference.age) }}대
                {{ props.userInfo.user_gender == 2 ? '여성' : '남성' }} <br />
                100명 중 {{ props.healthScoreData.hq_met.percent }}등
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-container">
        <div class="subject">
          <h3 class="stretch-text">
            [한국 {{ props.userInfo.user_gender == 2 ? '여성' : '남성' }}의 연령별 만성질환 억제
            분석 지수 분포와 나의 위치]
          </h3>
          <div class="legend">
            <div class="avg"></div>
            <div class="stretch-text">연령대 평균</div>
            <div class="legend-icon"></div>
            <div class="stretch-text">{{ props.userInfo.user_name }}님</div>
          </div>
        </div>
        <!-- 바이올린 차트 -->
        <div class="violin-container">
          <img class="background" src="@/assets/images/pdf/res/violin/met-violin-m.png" alt=""
            v-if="props.userInfo.user_gender === 1" />
          <img class="background" src="@/assets/images/pdf/res/violin/met-violin-f.png" alt=""
            v-if="props.userInfo.user_gender === 2" />
          <div class="violin" id="VolinBox">

            <div class="my-point" :style="{
              // left: myPointX,
              top: 100 - props.healthScoreData.hq_met.score + '%',
            }">
              <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" />
              <div class="my-point-pointer">
                <div class="point"></div>
              </div>
              <div class="my-point-score stretch-text">
                {{ props.healthScoreData.hq_met.percent }}등
              </div>
            </div>
          </div>
          <div class="label-y stretch-text">만성질환 억제 분석 지수</div>
          <div class="label-x stretch-text">연령대</div>
        </div>
      </div>
      <div class="desc">
        {{ props.healthScoreData.hq_met.msg }}
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
        만성질환 억제 분석 지수는 건강검진 결과, 생활 습관 등 다양한 요소 간의 상관관계를 종합적으로 고려하여 산출됩니다.
        따라서, 입력한 결과가 정상 범위 내에 있더라도, 다른 건강한 사람과 비교하여 나의 건강 위험도가 높을 수 있습니다.
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";


.title-container {
  @include flex(flex-start, flex-start);

  margin-top: calc(18.55px * $pdf-scale);
  margin-bottom: calc(19.1px * $pdf-scale);
  height: calc(210.3px * $pdf-scale);

  .title {
    width: calc(calc(382.68px - 41px) * $pdf-scale);
  }

  ul {
    font-size: calc(12px * $pdf-scale);
    padding-left: calc((16.51px + 89.9px) * $pdf-scale);

    li {
      list-style-type: disc;
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
    }
  }

  img {
    width: calc(51.08px * $pdf-scale);
    height: calc(51.08px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-top: calc(8px * $pdf-scale);
    font-size: calc(30px * $pdf-scale);
    color: #008452;
    font-weight: $medium;
    text-align: left;
  }

  span {
    display: inline-block;
    margin-top: calc(30px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    padding-right: calc(8px * $pdf-scale);
    font-weight: 300;
    line-height: 150%;
  }

  .score-container {
    width: calc(165px * $pdf-scale);
    height: calc(210px * $pdf-scale);
    padding-left: calc(14.3px * $pdf-scale);
    @include flex(center, center);
    flex-direction: column;

    padding-top: calc(10px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
    font-weight: 500;

    .score-chart {
      position: relative;
      margin-top: calc(20px * $pdf-scale);
      width: calc(136.58px * $pdf-scale);
      height: calc(136.58px * $pdf-scale);

      // padding-left: calc(10px * $pdf-scale);
      .score {
        position: absolute;
        flex-direction: column;
        top: 0;
        // left: calc(10px * $pdf-scale);
        @include flex(center, center);
        width: 100%;
        height: 100%;

        .score-top {
          @include flex(center, baseline);

          .score-number {
            font-size: calc(42px * $pdf-scale);
            // color: #008452;
            font-weight: 400;
          }

          .score-text {
            font-size: calc(10px * $pdf-scale);
            color: #3E3A39;
            // padding-bottom: calc(5px * $pdf-scale);
          }

          &.green {
            color: #008452
          }

          &.red {
            color: #C53135;
          }

          &.yellow {
            color: #DF9D00;
          }
        }

        .score-bottom {
          font-size: calc(9px * $pdf-scale);
          font-weight: 400;
          color: #727171;
          text-align: center;
        }
      }
    }
  }
}

.data-container {
  width: 100%;
  height: calc(344px * $pdf-scale);
  background-color: white;

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */

  .subject {
    margin-top: calc(26px * $pdf-scale);
    margin-bottom: calc(11px * $pdf-scale);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: bold;
    }

    span {
      display: inline-block;
      font-size: calc(6.5px * $pdf-scale);
    }
  }

  .violin-container {
    position: relative;
    @include flex(center, center);
    width: 100%;
    flex-direction: column;
    margin-top: calc(44px * $pdf-scale);
    height: calc(212.56px * $pdf-scale);
    font-size: calc(10px * $pdf-scale);

    .background {
      position: absolute;
      width: 100%;
      height: auto;
    }

    .violin {
      position: relative;
      width: 100%;
      height: 100%;
      padding-left: calc(33px * $pdf-scale); // 나의 위치를 위한 이미지 맞춤
      margin-bottom: calc(33px * $pdf-scale); // 나의 위치를 위한 이미지 맞춤
      padding-right: calc(33px * $pdf-scale); // 나의 위치를 위한 이미지 맞춤
      margin-top: calc(19px * $pdf-scale); // 나의 위치를 위한 이미지 맞춤

    }

    .label-x {
      position: absolute;
      bottom: calc(30px * $pdf-scale);
      right: 0;
      text-align: right;
      color: #5E5E5E;
      font-size: calc(8px * $pdf-scale);
      font-weight: 400;
    }

    .label-y {
      position: absolute;
      top: calc(-5px * $pdf-scale);
      left: 0;
      text-align: right;
      color: #5E5E5E;
      font-size: calc(8px * $pdf-scale);
      font-weight: 400;
    }
  }
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: calc(1px * $pdf-scale) solid #0AB2ED;
  margin-left: calc(33px * $pdf-scale); // 나의 위치를 위한 이미지 맞춤

  .my-point-score {
    position: absolute;
    color: #00b4de;
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
    top: calc(-10px * $pdf-scale);

    right: calc(-30px * $pdf-scale);
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -150%);
    width: calc(15px * $pdf-scale) !important;
    height: auto;
    right: 0;
    top: 0;
    z-index: 1001;
  }

  .my-point-pointer {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
    height: calc(10.65px * $pdf-scale);
    width: calc(0.25px * $pdf-scale);
    /* background-color: #00b4de; */
    border-right: calc(1px * $pdf-scale) dashed #00b4de;

    .point {
      position: absolute;

      /* right: calc(-5.68px * $pdf-scale); */
      z-index: 100;
      transform: translate(-50%, 50%);
      width: calc(2.62px * $pdf-scale);
      height: calc(2.62px * $pdf-scale);
      border-radius: 50%;
      border: calc(0.3px * $pdf-scale) solid #00b4de;
      background-color: white;
      /* bottom: calc(-5.68px * $pdf-scale); */
      bottom: 0;
    }
  }
}

.legend {
  color: #727171;
  @include flex(flex-end, center);
  font-size: calc(6.5px * $pdf-scale);

  .avg {
    border-bottom: calc(1px * $pdf-scale) dashed #92539d;
    width: calc(8px * $pdf-scale);
    margin-right: calc(3px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(8px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }
}

.score-div {
  width: calc(140px * $pdf-scale);
  height: calc(140px * $pdf-scale);
  .container {
    min-height: auto;
  }
}

.desc {
  height: calc(120px * $pdf-scale);
  font-size: calc(10px * $pdf-scale);
  font-weight: $light;
  white-space: pre-line;

}

.bottom-info {
  bottom: calc(38.57px * $pdf-scale);
}
</style>
