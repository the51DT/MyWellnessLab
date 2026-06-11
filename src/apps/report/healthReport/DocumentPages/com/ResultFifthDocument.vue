<script setup>
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps({
  healthNetworkData: {
    type: Object,
    required: true,
  },
  userInfo: {
    type: Object,
    required: true,
  },
})
let health_manage_list = ref([]); // 신경 써야 할 건강 분야
let health_network_data = ref(null);  // 건강 신호 네트워크

onBeforeMount(() => {
  setData();
  initSolutionReport();
});

const setData = () => {
  // health_network_data
  health_network_data.value = props.healthNetworkData;
}

const initSolutionReport = () => {

  // // 신경 써야 할 건강분야 계산
  health_network_data.value.clusterList.forEach((element, index) => {
    let skip = false;

    if (props.userInfo.user_gender === 1 && element.Cluster_NAME === "갱년기 여성건강") {
      //남
      skip = true;
    } else if (props.userInfo.user_gender === 2 && element.Cluster_NAME === "전립선 건강") {
      //여
      skip = true;
    }

    if (skip === false) {
      health_manage_list.value.push({
        name: element.Cluster_NAME,
        status: element.Cluster_State,
      });
    }
  });
}
/** 신경써야 할 분야 정렬 */
const manageData = computed(() => {
  Object.entries(health_manage_list.value).forEach((element) => {
    // 관심(40) 이면서 주의 혹은 위험인 경우 status - 40 함
    if(element[1].status >= 40) {
      element[1].status = element[1].status - 40;
    }
  });

  // status 낮은순으로 설정 , 0 과 1은 제외
  const sorted = Object.entries(health_manage_list.value).sort((a, b) => {
    return b[1].status - a[1].status;
  });

  const result = [];
  sorted.forEach((element) => {
    if (element[1].status !== 0 && element[1].status !== 1) {

      // // 관심(40) 이면서 주의 혹은 위험인 경우 status - 40 함
      // if(element[1].status >= 40) {
      //   element[1].status = element[1].status - 40;
      // }

      result.push({
        name: element[1].name,
        status: element[1].status,
      });
    }
  });
  return result;
});
</script>
<template>
  <div class="element-box">
    <!-- 주요 건강 위험 요인 -->
    <div class="check-list">
      <ul>
        <li v-for="(item, i) in manageData" :key="i" :class="{
          warn: item.status === 2,
          danger: item.status === 3,
          none: item.status <= 1,
        }">
          <h5 class="stretch-text">{{ item.name }}</h5>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/style.scss";

.check-list {
  >ul {
    justify-content: flex-start;
    align-content: center;

    display: grid;
    grid-template-columns: repeat(12, minmax(calc(31.48px * $pdf-scale), 1fr));
    grid-auto-rows: 1fr;

    width: 100%;
    height: calc(88px * $pdf-scale);
    max-height: calc(88px * $pdf-scale);
    margin: 0;
    flex-wrap: wrap;

    li {
      flex: 1;
      align-self: center;
      justify-self: center;
      max-width: calc(31.48px * $pdf-scale);
      max-height: calc(35.3px * $pdf-scale);
      width: 100%;
      height: 100%;
      display: none !important;
      background-size: contain;
      @include flex(center, center);
      position: relative;
      padding: calc(12px * $pdf-scale) calc(1.48px * $pdf-scale) calc(8.3px * $pdf-scale) calc(1px * $pdf-scale);


      h5 {
        text-align: center;
        font-size: calc(6px * $pdf-scale);
        letter-spacing: -(calc(6px * $pdf-scale) * 0.05);
        font-weight: $medium;
        line-height: 110%;
        color: #96999c;
        word-break: keep-all;
        white-space: normal;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      &.warn {
        display: flex !important;
        background: url("@/assets/images/pdf/res/status-warn.png") center center no-repeat;
        background-size: contain;

        h5 {
          color: #dd961a;
        }
      }

      &.danger {
        display: flex !important;
        background: url("@/assets/images/pdf/res/status-danger.png") center center no-repeat;
        background-size: contain;

        h5 {
          color: #c0373f;
        }
      }

      &.none {
        display: none !important;
      }
    }
  }

  .liner {
    margin: 40px 0;
    position: relative;

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #bababa;
    }

  }
}

.gap {
  flex: 1;
}

.element-box {
  // @include flex;
  width: 100%;
  height: calc(90px * $pdf-scale);
  // background-color: #eff7ef;
  // border-bottom: calc(0.3px * $pdf-scale) solid #000;

  .title {
    padding-top: calc(4.32px * $pdf-scale);
    padding-left: calc(4.85px * $pdf-scale);
    font-size: calc(9px * $pdf-scale);
    font-weight: 500;
    // line-height: 1.5;
  }
}


.left {
  height: 100%;
  flex: 1;
  border-right: calc(0.5px * $pdf-scale) solid #000;
}

.right {
  width: calc(260px * $pdf-scale); //calc(92.21px * $pdf-scale);
  height: 100%;

  .list {
    font-size: calc(11px * $pdf-scale);
    padding-top: calc(5.08px * $pdf-scale);
    padding-left: calc(4.85px * $pdf-scale);
    padding-right: calc(4.85px * $pdf-scale);
    font-weight: 600;

    span {
      &:after {
        content: ", ";
      }

      &:last-child {
        &:after {
          content: "";
        }
      }
    }
  }
}

.none {
  display: none !important;
}
</style>