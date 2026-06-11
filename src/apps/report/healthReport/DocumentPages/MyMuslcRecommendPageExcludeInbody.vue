<script setup>
import { ref, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import DimComponent from "@/components/dim/DimComponent.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthScoreData: null,
  page: Number
});

const qr_images = ref([]);

onMounted(async () => {
  emit('mounted')
});
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-muscle.png" />
          <h3 class="stretch-text">맞춤 운동 가이드</h3>
        </div>
        <span class="stretch-text">
          우리 몸에서 가장 큰 조직인 근육은 신체의 주요 대사기관으로, 에너지 소비와 산화적 스트레스에 중요한 역할을 합니다. 근육량이 부족하거나 근육의 분포가 불균형할 경우 근력, 순발력, 균형감각 저하를
          초래할 수 있으며, 이로 인해 일상생활에서 불편함이나 안전에 영향을 미칠 수 있습니다. 또한, 근육 활동은 산화적 대사과정을 통해 에너지를 생성하고, 규칙적인 운동은 근육의 대사 기능을 개선하며
          산화 스트레스를 완화하는 데 도움을 줄 수 있습니다. 마이웰니스 랩에서는 근육의 물리적, 대사적 기능을 고려해 전신의 근육 관리를 소홀히 하지 않으면서 부족한 근육을 집중적으로 관리할 수 있는
          최적의 근력 운동 루틴을 제안합니다.
        </span>
      </div>

      <div class="data-desc-container">
        <DimComponent :html-text="'체성분 데이터 입력 시 <br/> ‘맞춤 운동 가이드’를<br/> 확인할 수 있습니다.'"
          :padding-flag="false" />
        <!-- <div class="data-container-header"> -->
        <p class="desc-title stretch-text">{{ props.userInfo.user_name }}님을 위한 맞춤 운동 가이드</p>
        <div class="desc">
          <span class="stretch-text">
            <!-- {{ props.healthScoreData.hq_musMass.exerciseData[0].msg }} -->
          </span>
        </div>
        <div class="data-header">

          <div class="name">
            <span class="stretch-text">
              부위
            </span>
          </div>
          <div class="description">
            <span class="stretch-text">
              운동
            </span>
          </div>
          <div class="description">
            <span class="stretch-text">
              영상
            </span>
          </div>
          <div class="description-list">
            <span class="stretch-text">
              운동 방법
            </span>
          </div>
        </div>
        <!-- </div> -->
        <div class="data-box">
          <div class="data-container">

            <div class="name">
              <span class="stretch-text"> 상체 </span>
            </div>
            <div class="description">
              <span class="stretch-text" v-html="'상체 운동1'"></span>
            </div>
            <div class="description">
              <span class="stretch-text">
                <!-- <img :src="qr_images[list.exCode.replace('ex_', '') - 1]" alt="QR Code" /> -->
              </span>
            </div>
            <div class="description-list">
              <ul>
                <li>
                  <span class="stretch-text">1회 * 1세트</span>
                </li>
              </ul>
            </div>
            <div class="description">
              <span class="stretch-text" v-html="'상체 운동2'"></span>
            </div>
            <div class="description">
              <span class="stretch-text">
                <!-- <img :src="qr_images[list.exCode.replace('ex_', '') - 1]" alt="QR Code" /> -->
              </span>
            </div>
            <div class="description-list">
              <ul>
                <li>
                  <span class="stretch-text">1회 * 1세트</span>
                </li>
              </ul>
            </div>

          </div>
          <div class="data-container">

            <div class="name">
              <span class="stretch-text"> 하체 </span>
            </div>
            <div class="description">
              <span class="stretch-text" v-html="'하체 운동1'"></span>
            </div>
            <div class="description">
              <span class="stretch-text">
                <!-- <img :src="qr_images[list.exCode.replace('ex_', '') - 1]" alt="QR Code" /> -->
              </span>
            </div>
            <div class="description-list">
              <ul>
                <li>
                  <span class="stretch-text">1회 * 1세트</span>
                </li>
              </ul>
            </div>
            <div class="description">
              <span class="stretch-text" v-html="'하체 운동2'"></span>
            </div>
            <div class="description">
              <span class="stretch-text">
                <!-- <img :src="qr_images[list.exCode.replace('ex_', '') - 1]" alt="QR Code" /> -->
              </span>
            </div>
            <div class="description-list">
              <ul>
                <li>
                  <span class="stretch-text">1회 * 1세트</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
        제안드리는 운동은 나의 부위별 근육량 분포에 따라 추천되는 운동으로 개인의 근골격계 질환 이력을 반영하지 않습니다.
        따라서 본인의 근골격계 질환 여부에 따라 운동 강도를 조절하고, 근력운동 경험에 따라 더 많은 종류의 운동을 추가하거나 변형하여 수행하는 것도 가능합니다.
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  @include flex(flex-start, flex-start);
  flex-direction: column;

  padding-top: calc(20px * $pdf-scale);
  /* margin-bottom: calc(19.1px * $pdf-scale); */
  height: calc(146px * $pdf-scale);
  width: 100%;

  .title {
    @include flex(flex-start, center);
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
    width: calc(42.66px * $pdf-scale);
    height: calc(42.66px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-left: calc(10px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    color: #00A856;
    font-weight: $medium;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    letter-spacing: -0.05em;
    line-height: 155%;
    font-weight: 300;
    color: #000;
    padding-left: calc(50.8px * $pdf-scale);
  }

  .score-container {
    width: 100%;
    height: 100%;
    flex: 1;
  }
}

.desc {
  margin-top: calc(7.46px * $pdf-scale);
  height: calc(120px * $pdf-scale);

  b {
    font-size: calc(13px * $pdf-scale);
  }
}

.data-box {
  height: calc(369px * $pdf-scale);
}

.desc-title {
  // margin-top: calc(24px * $pdf-scale);
  font-size: calc(12px * $pdf-scale);
  color: #000000;
  font-weight: 600;

}

.data-header {
  margin-top: calc(20px * $pdf-scale);
  height: calc(24px * $pdf-scale);
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  display: grid;
  grid-template-columns: calc(52px * $pdf-scale) calc(90px * $pdf-scale) calc(80px * $pdf-scale) 1fr;
  grid-template-rows: repeat(1, 1fr);
  text-align: center;
  align-items: center;
  justify-items: center;
  background-color: #F1F1F1;
}

.name {
  @include flex(center, center);
  width: 100%;
  height: 100%;
  // border-right: calc(0.5px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  padding-left: calc(3px * $pdf-scale);

  font-size: calc(12px * $pdf-scale);
  font-weight: 500;
  line-height: 150%;
}

.description {
  @include flex(center, center);
  flex-direction: column;
  width: 100%;
  height: 100%;
  // border-right: calc(0.5px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  padding-left: calc(3px * $pdf-scale);
  font-size: calc(12px * $pdf-scale);
  font-weight: 500;
  line-height: 150%;
  text-align: center;

}

.description-list {
  @include flex(center, center);
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  padding-left: calc(3px * $pdf-scale);
  font-size: calc(12px * $pdf-scale);
  font-weight: 500;
  line-height: 150%;
}

.data-container {
  width: 100%;
  height: 50%;
  background-color: white;
  // margin-top: calc(13.61px * $pdf-scale);

  // border: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns: calc(52px * $pdf-scale) calc(90px * $pdf-scale) calc(80px * $pdf-scale) 1fr;
  // grid-template-rows: repeat(3, 1fr);

  align-items: center;
  justify-items: center;


  .name {
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(3px * $pdf-scale);
    grid-row: 1 / 3;
    font-size: calc(11px * $pdf-scale);
    font-weight: 400;
    line-height: 150%;
  }

  .description {
    @include flex(center, center);
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    font-size: calc(11px * $pdf-scale);
    font-weight: 400;
    line-height: 150%;

    & img {
      width: calc(68px * $pdf-scale);
      height: calc(68px * $pdf-scale);
    }
  }

  .description-list {
    @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    font-size: calc(10px * $pdf-scale);
    line-height: 150%;
  }

  span {
    display: inline-block;
  }

  ul {
    padding-left: calc(10px * $pdf-scale);

    li {
      // list-style-type: disc;
      font-family: "Pretendard";
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: calc(-30px);
        top: calc(7px * $pdf-scale);
        /* 수직 정렬 보정 */
        width: calc(3px * $pdf-scale);
        height: calc(3px * $pdf-scale);
        background-color: black;
        /* 점 색상 */
        border-radius: 50%;
        /* 동그랗게 만들기 */
      }
    }
  }

  .red {
    color: #ea6176;
  }

  .warn {
    color: #b2850d;
  }
}

.subject {
  display: flex;
  justify-content: space-between;
  padding-right: calc(10.35px * $pdf-scale);
  margin-bottom: calc(6.2px * $pdf-scale);

  h3 {
    font-size: calc(12px * $pdf-scale);
  }

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.legend-container {
  position: absolute;
  top: calc(5px * $pdf-scale);
  right: calc(0px * $pdf-scale);
  @include flex(flex-end, baseline);
  width: 100%;

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.legend1 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);

  width: calc(5.35px * $pdf-scale);
  height: calc(5.35px * $pdf-scale);
  background-color: #ea6176;
}

.legend2 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);
  margin-left: calc(3px * $pdf-scale);
  width: calc(5.35px * $pdf-scale);
  height: calc(5.35px * $pdf-scale);
  background-color: #f8b500;
}
</style>