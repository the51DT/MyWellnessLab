<script setup>
import { ref, onMounted } from "vue";
import { ageToAgeGroup, splitByNewLine } from '@/utils/common.js';
import { health_checkup_met_image } from '@/utils/render.js'

// Props 정의
const props = defineProps({
  healthScoreData: Object,
  userInfo: Object,
  pdfScale: Number,
});
const met = ref({
  score: 0, // met 값
  total_mean: 0,  // 전체 평균값
  age_mean: 0,  // 동일 성별 연령대 평균 값
  rank: 0,  // 등수
  msg: new Array()  // 메시지
})
const setData = (newData) => {
  met.value.score = newData.hq_met.score
  met.value.total_mean = newData.hq_met.t_mean
  met.value.age_mean = newData.hq_met.mean
  met.value.msg = splitByNewLine(newData.hq_met.msg)
  met.value.rank = newData.hq_met.percent

}
onMounted(() => {
  setData(props.healthScoreData)
});
</script>
<template>
  <div class="chart-wrapper">
    <div class="data-container">
      <div class="subject">
        <h3>
          <!-- 분포와 나의 등수] -->
          [한국인 {{ ageToAgeGroup(props.healthScoreData.hqReference.age) }}대 {{ userInfo.user_gender === 1 ? "남성" : "여성" }}
          연령별 분포와 나의
          등수]
        </h3>
        <div class="legend">
          <div class="avg"></div>
          <div class="t">평균</div>
          <div class="legend-icon"></div>
          <div class="t">{{ userInfo.user_name }}님</div>
        </div>
      </div>
      <!-- 그래프 배경 -->
      <div class="violin-container">
        <div class="label-y">만성질환 억제 분석 지수</div>
        <div class="violin">
          <img src="@/assets/images/report/violin/graph-back.png" />
          <div class="background-box">
            <div class="my-point-box">
              <div class="my-point" :style="{
                left: '50%',
                top: 100 - met.score + '%',
              }">
                <div class="my-point-pointer">
                  <img class="my-point-img" src="@/assets/images/icons/age-graph-icon.png" alt="" />
                  <div class="point"></div>
                </div>
                <div class="my-point-score">{{ met.rank }}등</div>
              </div>
              <img class="violin-avg" src="@/assets/images/report/violin/violin-avg.png" alt="" :style="{
                // left: '50%',
                top: 100 - met.age_mean + '%',
              }" />
              <img class="background"
                :src="health_checkup_met_image(ageToAgeGroup(props.healthScoreData.hqReference.age), props.userInfo.user_gender)" />
            </div>

          </div>



        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.chart-wrapper {
  position: relative;
}

.data-container {
  position: absolute;
  width: calc(335px * $pdf-scale);
  height: calc(333.06px * $pdf-scale);
  background-color: white;
  transform: scale(0.48);
  transform-origin: left top;
  // left: calc(-5px * $pdf-scale);
  top: calc(5px * $pdf-scale);
  /* border-top: calc(0.3px * $pdf-scale) solid #000000; */
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  padding-left: calc(10px * $pdf-scale);

  .subject {
    width: calc(335px * $pdf-scale);

    display: flex;
    justify-content: space-between;
    /* padding-top: calc(12.39px * $pdf-scale); */

    /* padding-right: calc(10.35px * $pdf-scale); */
    margin-top: calc(26px * $pdf-scale);
    margin-bottom: calc(11px * $pdf-scale);

    h3 {
      font-size: calc(12px * $pdf-scale);
      font-weight: 500;
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

    font-size: calc(10px * $pdf-scale);

    .label-y {
      position: absolute;
      // width: calc(200px * $pdf-scale);
      top: calc(-20px * $pdf-scale);
      // right: calc(-41px * $pdf-scale);
      left: 0;
      font-weight: 100;
      text-align: right;
      color: #727171;
      font-size: calc(12px * $pdf-scale);
    }

    .background {
      position: absolute;
      width: calc(50px * $pdf-scale);
      height: 100%;
      top: calc(15px * $pdf-scale);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-left: calc(66px * pdf-scale)
    }

    .violin {
      @include flex(center, center);
      flex-direction: row;
      gap: calc(6.51px * $pdf-scale);
      height: calc(212.56px * $pdf-scale);
      position: relative;

      .axis-y {
        position: relative;
        @include flex(flex-start, center);
        flex-direction: column;
        /* gap: calc(calc(200px / 6) * $pdf-scale); */
        height: calc(200px * $pdf-scale);
        margin-top: calc(-10px * $pdf-scale);

        div {
          flex: 1;
          height: 100%;
        }


      }
    }

    .violin-avg {
      width: calc(44px * $pdf-scale);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: auto;
      z-index: 1;
    }
  }
}

.background-box {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-left: calc(28px * $pdf-scale);
  // padding-top: calc(8px * $pdf-scale);
  // padding-bottom: calc(8px * $pdf-scale);

}

.my-point-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;

  .my-point-score {
    position: absolute;
    color: #00b4de;
    font-size: calc(12px * $pdf-scale);
    width: calc(100px * $pdf-scale);
    top: calc(-10px * $pdf-scale);
    left: calc(25px * $pdf-scale);
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -90%);
    width: calc(15.46px * $pdf-scale);
    height: auto;
    right: 0;
    top: 0;
    z-index: 1001;
  }

  .my-point-pointer {
    z-index: 1000;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
    height: calc(10.65px * $pdf-scale);
    width: calc(44px * $pdf-scale);
    /* background-color: #00b4de; */
    border-right: calc(1px * $pdf-scale) solid #00b4de;
    border-bottom: calc(1px * $pdf-scale) solid #00b4de;

    .point {
      position: absolute;

      right: calc(-3.68px * $pdf-scale);
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
  @include flex(flex-end, center);
  font-size: calc(12px * $pdf-scale);

  .avg {
    border-bottom: calc(1px * $pdf-scale) dashed #92539d;
    width: calc(8px * $pdf-scale);
    margin-right: calc(3px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(17px * $pdf-scale);
    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }
}
</style>
