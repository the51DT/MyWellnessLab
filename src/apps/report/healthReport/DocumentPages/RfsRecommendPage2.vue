<script setup>
import { onMounted } from "vue";
import PageHeader from "./PageHeader.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  rfsRecommendFactorData: null,
  page: Number
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
          <img src="@/assets/images/pdf/res/img-rfs.png" />
          <h3 class="stretch-text">맞춤 식사 가이드</h3>
        </div>
        <span class="stretch-text">
          건강한 식생활을 실천하기 위한 식품군별 권장식품과 추천 섭취방법을 확인해 보세요. 나에게 부족한 식품군을 확인하고, 이를 충분히 섭취하여 체내 영양 균형을 바르게 유지해 주세요.
        </span>
      </div>
      <div class="data-container-title">
        <p>{{ props.userInfo.user_name }}님을 위한 맞춤 식사 가이드</p>
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">관리 필요</span>
        </div>
      </div>
      <div class="data-header">
        <div class="name stretch-text">식품군과 권장식품</div>
        <div class="description stretch-text">추천 섭취방법</div>
      </div>
      <div class="data-container">
        <template v-for="(list, i) in props.rfsRecommendFactorData.slice(4, 8)" :key="i">
          <div class="name" :class="list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
            ">
            <span class="stretch-text"> {{ list.name }}</span>
            <p class="description">{{ list.description }}</p>
          </div>
          <div class="description-list" :class="list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
            ">
            <ul>
              <template v-for="(list2, j) in list.description_list" :key="j">
                <li>
                  <span class="stretch-text">
                    <img src="@/assets/images/pdf/res/icon-check-danger.png" v-if="list.status == 3" />
                    <img src="@/assets/images/pdf/res/icon-check-warn.png" v-else-if="list.status == 2" />
                    <img src="@/assets/images/pdf/res/icon-check-b.png" v-else-if="list.status == 1" />
                    <img src="@/assets/images/pdf/res/icon-check-b.png" v-else />
                    {{ list2.title }}
                  </span>
                <p class="stretch-text" v-html="list2.content" />
              </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
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
  /* margin-bottom: calc(19.1px * $pdf-scale); */
  height: calc(85.48px * $pdf-scale);
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
    margin-left: calc(9.22px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    font-weight: $medium;
    color: #00A856;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    letter-spacing: -0.05em;
    line-height: 160%;
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
    width: calc(132px * $pdf-scale);
    text-align: left;
  }

  .description {
    flex: 1;
    text-align: left;
  }
}

.data-container {
  width: 100%;
  height: calc(541px * $pdf-scale);
  background-color: white;
  // margin-top: calc(13.61px * $pdf-scale);

  border: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns: calc(132px * $pdf-scale) 1fr;
  grid-template-rows: repeat(4, 1fr);

  align-items: center;
  justify-items: center;


  .name {
    width: 100%;
    height: 100%;
    padding-top: calc(18px * $pdf-scale);
    // border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    padding-left: calc(6px * $pdf-scale);

    font-size: calc(11px * $pdf-scale);
    font-weight: 500;
    line-height: 150%;
    text-align: left;
  }

  .description {
    margin-top: calc(10px * $pdf-scale);
    word-break: keep-all;
    // @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    // border-right: calc(0.5px * $pdf-scale) solid #000000;
    // border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    // padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
    line-height: 150%;
  }

  .description-list {
    @include flex(center, flex-start);
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-left: calc(0.28px * $pdf-scale) solid #000000;
    border-bottom: calc(.28px * $pdf-scale) solid #000000;
    padding-left: calc(6px * $pdf-scale);
    padding-right: calc(6px * $pdf-scale);
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
    line-height: 150%;
    word-break: keep-all;

    & span {
      font-weight: $semibold;
    }
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
      list-style: none;

      & p {
        padding-left: calc(10px * $pdf-scale);
      }

      & p::before {
        content: '';
        position: absolute;
        left: calc(10px);
        top: calc(22px * $pdf-scale);
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
      & p::before {
        background-color: #ea6176;
        /* 점 색상 */
      }
    }
  }

  .warn {
    color: #F8B500;

    li {
      & p::before {
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

.data-container-title {
  @include flex(flex-end, center);
  margin-top: calc(40px * $pdf-scale);

  & p {
    width: 100%;
    font-size: calc(12px * $pdf-scale);
    font-weight: $semibold;
    color: #000;
    margin-bottom: calc(6.2px * $pdf-scale);
  }
}

.legend-container {
  @include flex(flex-end, center);
  width: 100%;
  margin-top: calc(13.5px * $pdf-scale);

  span {
    display: inline-block;
    font-size: calc(7px * $pdf-scale);
  }
}

.legend1 {
  display: inline-block;
  margin-right: calc(2.75px * $pdf-scale);

  width: calc(7px * $pdf-scale);
  height: calc(7px * $pdf-scale);
  background-color: #ea6176;
}

.bottom-info {
  bottom: calc(43px * $pdf-scale);
}
</style>