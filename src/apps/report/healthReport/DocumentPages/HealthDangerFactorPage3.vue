<script setup>
import { onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
import DimComponent from "@/components/dim/DimComponent.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthDangerFactorData: null,
  page: Number,
  isInbodyData: Boolean,
});
onMounted(() => {
  emit('mounted')
})
</script>
<template>
  <div id="Page18" class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-danger.png" />
          <h3 class="stretch-text">인체 생리 네트워크에 영향을 준 요인</h3>
        </div>
        <span class="stretch-text">
          나의 인체 생리 네트워크에서 ‘주의' 또는 ‘관리’가 필요한 영역이 있다면, 영향을 준 요인이 무엇인지 함께 확인해보세요.
          <ul>
            <li>
              각 건강 요인은 빅데이터 기반 한국 성인 평균값과 분포를 기준으로 판정하므로 건강검진 기준과 상이할 수 있습니다.
            </li>
            <li>
              요인 해석 가이드에 제시된 기준은 최신 국민건강보험공단 및 WHO 등 공인된 권고 기준을 바탕으로 정리되었습니다.
            </li>
          </ul>
        </span>
      </div>

      <div class="legend-container">
        <div class="legend1"></div>
        <span class="stretch-text">주의 요인</span>
        <div class="legend2"></div>
        <span class="stretch-text">관리 요인</span>
      </div>
      <div class="data-header">
        <div class="name stretch-text">건강 요인</div>
        <div class="description stretch-text">요인 해석 가이드</div>
      </div>
      <div class="data-container">
        <template v-for="(list, i) in props.healthDangerFactorData.slice(8, 12)" :key="i">
          <!-- <div class="name" :class="rstData[list.var] === 3 ? 'red' : ''"> -->
          <div class="name" :class="list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
            ">
            <span class="stretch-text">
              {{ list.name }}
            </span>
          </div>
          <div class="description" :class="list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
            ">
            <DimComponent :html-text="'체성분 데이터 입력 시 <br/>‘' + list.name + '’ 분석 결과를 확인할 수 있습니다.'" :icon-size="'medium'"
              :padding-flag="false" v-if="!props.isInbodyData && list.need_inbody" />

            <span class="stretch-text">
              {{ list.description }}
            </span>
            <ul>
              <template v-for="(list2, j) in list.description_list" :key="j">
                <li v-if="j == 0">

                  <div class="stretch-text font-bold">
                    <img src="@/assets/images/pdf/res/icon-check-danger.png" v-if="list.status == 3" />
                    <img src="@/assets/images/pdf/res/icon-check-warn.png" v-else-if="list.status == 2" />
                    <img src="@/assets/images/pdf/res/icon-check-b.png" v-else-if="list.status == 1" />
                    <img src="@/assets/images/pdf/res/icon-check-b.png" v-else />
                    {{ list2 }}
                  </div>
                </li>
                <li v-else>
                  {{ list2 }}
                </li>
              </template>

            </ul>
          </div>
        </template>
      </div>
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가
        아닙니다. 본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와
        상의하시기 바랍니다.
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

  padding-top: calc(11.66px * $pdf-scale);
  height: calc(115px * $pdf-scale);
  width: 100%;

  .title {
    @include flex(flex-start, center);
  }

  ul {
    font-size: calc(9px * $pdf-scale);
    padding-left: calc(15px * $pdf-scale);
    font-weight: $light;

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
    margin-left: calc(9.22px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    color: #008452;
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
  margin-top: calc(7.46px * $pdf-scale);
  height: calc(81.26px * $pdf-scale);

  b {
    font-size: calc(13px * $pdf-scale);
  }
}

.data-header {
  @include flex(flex-start, center);
  margin-top: calc(5px * $pdf-scale);
  width: 100%;
  height: calc(30px * $pdf-scale);
  padding-left: calc(4px * $pdf-scale);
  font-size: calc(12px * $pdf-scale);
  font-weight: $medium;
  color: #000;
  border-top: 0.5px solid #000000;
  background-color: #F1F1F1;

  .name {
    width: calc(119.71px * $pdf-scale);
    text-align: left;
  }

  .description {
    flex: 1;
    text-align: left;
  }
}

.data-container {
  width: 100%;
  height: calc(549px * $pdf-scale);
  background-color: white;
  // margin-top: calc(6px * $pdf-scale);

  border: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  display: grid;
  grid-template-columns: calc(119.71px * $pdf-scale) 1fr;
  grid-template-rows: repeat(4, 1fr);

  align-items: center;
  justify-items: center;

  .name {
    @include flex(flex-start, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(3px * $pdf-scale);

    font-size: calc(13px * $pdf-scale);
    font-weight: 400;
    line-height: 150%;

    span {
      white-space: pre-line;
    }
  }

  .description {
    @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(10px * $pdf-scale);
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
    line-height: 150%;
    position: relative;
  }

  span {
    display: inline-block;
  }

  ul {
    // padding-left: calc(10px * $pdf-scale);

    & img {
      width: calc(7px * $pdf-scale);
      height: calc(7px * $pdf-scale);
      margin-right: calc(3px * $pdf-scale);
    }

    li {
      position: relative;
      list-style: none;

      &:first-child {
        & span {
          font-weight: $semibold;
        }

      }

      &:not(:first-child) {
        padding-left: calc(10px * $pdf-scale);
      }

      &:not(:first-child):before {
        content: '';
        position: absolute;
        left: calc(0px);
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

    li {
      &:not(:first-child):before {
        background-color: #ea6176;
        /* 점 색상 */
      }
    }
  }

  .warn {
    color: #F8B500;

    li {
      &:not(:first-child):before {
        background-color: #F8B500;
        /* 점 색상 */
      }
    }
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
  @include flex(flex-end, center);
  width: 100%;
  margin-top: calc(13.5px * $pdf-scale);

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.legend1 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);

  width: calc(7px * $pdf-scale);
  height: calc(7px * $pdf-scale);
  background-color: #ea6176;
}

.legend2 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);
  margin-left: calc(3px * $pdf-scale);
  width: calc(7px * $pdf-scale);
  height: calc(7px * $pdf-scale);
  background-color: #f8b500;
}

.bottom-info {
  bottom: calc(45px * $pdf-scale);
}
</style>