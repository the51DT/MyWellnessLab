<script setup>
import { computed, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  page: Number,
  save: Boolean,
  userInfo: null,
  healthSleepHabitsData: null,
  pdfScale: Number,
  loadingFinished: null,
});
onMounted(() => {
  emit('mounted')
})
// 항목별 요약 설명 매칭
const getSleepHabitList = computed(() => {
  var datas = []
  props.healthSleepHabitsData.data_description_list.forEach((item1) => {
    var items = item1
    props.healthSleepHabitsData.data_list.forEach((item2) => {
      if (item1.key == item2.key) {
        items['status'] = item2.status
        items['name'] = item2.name
        datas.push(items)
      }
    });
  })
  datas.sort((a, b) => {
    if (b.status !== a.status) {
      return b.status - a.status; // status 내림차순
    } else {
      return a.order - b.order;   // order 오름차순
    }
  });
  return datas
});
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-sleep-habit.png" />
          <h3 class="stretch-text">맞춤 수면 가이드</h3>
        </div>
        <span class="stretch-text">
          수면은 건강 유지 및 생활의 질을 높이는 필수 요소이며, 수면 습관을 개선하면 신체 회복, 질병 예방, 항산화 효과 등을 극대화할 수 있습니다. 나의 수면의 질에 영향을 주는 요인들의 상태를
          확인하고 영역별로 종합적으로 관리해보세요.
        </span>
      </div>
      <p class="desc-title stretch-text">{{ props.userInfo.user_name }}님을 위한 수면 가이드</p>
      <div class="desc">
        {{ props.healthSleepHabitsData.sleep_habit_msg }}
      </div>
      <div class="legend-container">

        <div class="legend1"></div>
        <span class="stretch-text">관리 필요</span>
      </div>
      <div class="data-container-header">
        <div class="header">

          <div class="name">
            <span class="stretch-text">
              관리 영역
            </span>
          </div>
          <div class="description-list">
            <span class="stretch-text">
              추천 수면 습관
            </span>
          </div>
        </div>

      </div>
      <div class="data-box">

        <div class="data-container">
          <template v-if="getSleepHabitList.length > 0">

            <template v-for="(list, i) in getSleepHabitList" :key="i">
              <div class="name" :class="list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
                ">
                <span class="stretch-text"> {{ list.name }} </span>
              </div>
              <div class="description" :class="list.status == 3 ? 'red' : list.status == 2 ? 'warn' : ''
                ">
                <ul>
                  <template v-for="(list2, j) in list.description_list" :key="j">
                    <li v-if="j == 0">

                      <div class="stretch-text font-bold">
                        <img src="@/assets/images/pdf/res/icon-check-danger.png" v-if="list.status == 3" />
                        <img src="@/assets/images/pdf/res/icon-check-warn.png" v-if="list.status == 2" />
                        <img src="@/assets/images/pdf/res/icon-check-b.png" v-if="list.status == 1" />
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
          </template>
        </div>
      </div>

      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
        이 설문은 개인의 수면의 질을 평가하기 위해 사용되며,
        의학적 진단을 대체하지 않으므로 더 자세한 결과는 전문가와 상담하여 해석하는것이 바람직합니다.
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
  height: calc(90px * $pdf-scale);
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
  margin-top: calc(8px * $pdf-scale);
  margin-bottom: calc(12px * $pdf-scale);
  height: calc(50px * $pdf-scale);
  padding: calc(9px * $pdf-scale) calc(16.51px * $pdf-scale);

  b {
    font-size: calc(13px * $pdf-scale);
  }
}

.data-box {
  height: calc(479px * $pdf-scale);
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
    font-weight: 500;
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
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
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
  grid-template-rows: repeat(7, 1fr);

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
    font-weight: 400;
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
    font-size: calc(8px * $pdf-scale);
    font-weight: 400;
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
      list-style: none;

      &:first-child {
        & span {
          font-weight: $semibold;
        }
      }

      &:not(:first-child) {
        padding-left: calc(10px * $pdf-scale);
      }

      &:not(:first-child)::before {
        content: '';
        position: absolute;
        left: calc(10px);
        top: calc(7px * $pdf-scale);
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

.bottom-info {
  bottom: calc(42px * $pdf-scale);
}
</style>