<script setup>
import { onMounted } from "vue";
import PageHeader from "./PageHeader.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  page: Number,
  save: Boolean,
  userInfo: null,
  healthNetworkNutrientData: null,
  pdfScale: Number,
  loadingFinished: null,
});
onMounted(() => {
  emit('mounted')
})
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/Nut_Rstg_2022_Logo_Leaf_BLK_RGB.png" />
          <h3 class="stretch-text">건강 영역별 핵심 영양성분·원료</h3>
        </div>
        <span class="stretch-text">
          건강수명 관리에 중요한 영양은 균형 있는 식품군 섭취와 더불어 건강기능식품 섭취를 통해서도 보충할 수 있습니다. 나의 인체생리 네트워크에서 ‘주의’ 또는 ‘관리’가 필요한 영역이 있다면, 해당 건강 영역의 건강 유지를 돕는 주요 영양성분과 원료를 확인해 보세요. 부족한 부분을 보완하면 건강수명 관리에 도움을 줄 수 있습니다.
        </span>
      </div>
      <div class="legend-container">
        <div class="legend1"></div>
        <span class="stretch-text">주의</span>
        <div class="legend2"></div>
        <span class="stretch-text">관리</span>
        <div class="legend3"></div>
        <span class="stretch-text">관심</span>
      </div>
      <div class="data-container-header">
        <div class="header">

          <div class="name">
            <span class="stretch-text">
              건강 영역
            </span>
          </div>
          <div class="description-list">
            <span class="stretch-text">
              성분 및 원료
            </span>
          </div>
        </div>

      </div>
      <div class="data-box">

        <div class="data-container">
          <template v-if="props.healthNetworkNutrientData.length > 0">
            <template v-for="(list, i) in props.healthNetworkNutrientData.slice(19,25)" :key="i">
              <div class="name" :class="list.status == 4 ? 'blue' : list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
                ">
                <span class="stretch-text"> {{ list.name }} </span>
              </div>
              <div class="description" :class="list.status == 4 ? 'blue' : list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
                ">
                <ul>
                  <li>{{ list.nutrient_list }}</li>
                </ul>
              </div>
            </template>
          </template>
        </div>

        <div class="description-note">
          * 기능성을 나타낼 수 있는 각 성분 및 원료의 함량은 기능성 별로 상이할 수 있음을 안내드립니다.
        </div>
      </div>
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
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
  margin-bottom: calc(19.1px * $pdf-scale);
  height: calc(88px * $pdf-scale);
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
    width: calc(42px * $pdf-scale);
    height: calc(42px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    margin-left: calc(9.22px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    color: #00A856;
    font-weight: $medium;
  }

  span {
    display: inline-block;
    font-size: calc(11px * $pdf-scale);
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
  margin-top: calc(8px * $pdf-scale);
  margin-bottom: calc(12px * $pdf-scale);
  height: calc(50px * $pdf-scale);
  padding: calc(9px * $pdf-scale) calc(16.51px * $pdf-scale);

  b {
    font-size: calc(13px * $pdf-scale);
  }
}

.data-box {
  height: calc(159px * $pdf-scale);
}

.desc-title {
  // margin-top: calc(24px * $pdf-scale);
  font-size: calc(12px * $pdf-scale);
  color: #000000;
  font-weight: 600;

}

.data-container-header {
  width: 100%;

  background-color: white;
  // margin-top: calc(20px * $pdf-scale);
  position: relative;

  .header {
    margin-top: calc(5px * $pdf-scale);
    height: calc(24px * $pdf-scale);
    border-top: 1px solid #000000;
    border-left: none;
    border-right: none;
    display: grid;
    grid-template-columns: calc(140px * $pdf-scale) 1fr;
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
    border-bottom: 1px solid #000000;
    padding-left: calc(3px * $pdf-scale);

    font-size: calc(12px * $pdf-scale);
    font-weight: $medium;
    line-height: 150%;
  }

  .description {
    @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    // border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: 1px solid #000000;
    padding-left: calc(3px * $pdf-scale);
    // padding-top: calc(6px * $pdf-scale);
    font-size: calc(8px * $pdf-scale);
    font-weight: $medium;
    line-height: 150%;

  }

  .description-list {
    @include flex(center, center);
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #000000;
    padding-left: calc(3px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
    line-height: 150%;
  }
}

.data-container {
  width: 100%;
  height: 100%;
  background-color: white;
  // margin-top: calc(13.61px * $pdf-scale);

  border: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns: calc(140px * $pdf-scale) 1fr;
  grid-template-rows: repeat(4, 1fr);

  align-items: center;
  justify-items: center;


  .name {
    @include flex(flex-start, center);
    width: 100%;
    height: 100%;
    border-right: 1px solid #000000;
    border-bottom: 1px solid #000000;
    padding-left: calc(3px * $pdf-scale);
    font-size: calc(11px * $pdf-scale);
    font-weight: $medium;
    line-height: 150%;
  }

  .description {
    @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    // border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: 1px solid #000000;
    padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    padding-top: calc(6px * $pdf-scale);
    padding-bottom: calc(6px * $pdf-scale);
    font-size: calc(8px * $pdf-scale);
    font-weight: $semibold;
    line-height: 150%;

  }

  .description-list {
    @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #000000;
    padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    font-size: calc(8px * $pdf-scale);
    line-height: 150%;
  }

  span {
    display: inline-block;
  }

  ul {

    & img {
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      margin-right: calc(3px * $pdf-scale);
    }

    li {
      position: relative;
      padding-left: calc(10px * $pdf-scale);
      list-style: none;

      &::before {
        content: '';
        position: absolute;
        left: calc(10px);
        top: calc(5px * $pdf-scale);
        /* 수직 정렬 보정 */
        width: calc(2px * $pdf-scale);
        height: calc(2px * $pdf-scale);
        background-color: black;
        /* 점 색상 */
        border-radius: 50%;
        /* 동그랗게 만들기 */
      }
    }
  }

  .red {
    color: #ea6176;

    ul {
      & li {
        &:not(:first-child)::before {
          background-color: #ea6176;
        }
      }
    }
  }

  .warn {
    color: #F8B500;

    ul {
      & li {
        &:not(:first-child)::before {
          background-color: #F8B500;
        }
      }
    }
  }

  .blue {
    color: #00b4de;

    ul {
      & li {
        &::before {
          background-color: #00b4de;
        }
      }
    }
  }
}

.description-note {
  display: inline-block;
  font-size: 44px;
  letter-spacing: -0.05em;
  line-height: 155%;
  font-weight: 300;
  color: #000;
  padding-top: 15px;
  display: block;
  opacity: 1;
  visibility: visible;
  z-index: 9999;
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
  // position: absolute;
  // top: calc(5px * $pdf-scale);
  // right: calc(0px * $pdf-scale);
  @include flex(flex-end, center);
  width: 100%;

  span {
    display: inline-block;
    font-size: calc(7px * $pdf-scale);
    margin-top: 25px;
  }

  .legend1 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #ea6176;
    margin-top: 25px;
  }

  .legend2 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);
    margin-left: calc(3px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #f8b500;
    margin-top: 25px;
  }

  .legend3 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);
    margin-left: calc(3px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #00b4de;
    margin-top: 25px;
  }
}

// .bottom-info {
//   bottom: calc(50px * $pdf-scale);
// }
</style>