
<script setup>
import { reactive, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthNetworkData: null,
  page: Number
});

// Reactive 상태 정의
const state = reactive({
  dangerList: [],
  warnList: [],
  interestList: []
});

// Methods 정의
const initClusterStateData = () => {
  if (props.healthNetworkData) {
    state.warnList = [];
    state.dangerList = [];
    state.interestList = [];

    props.healthNetworkData.clusterList.forEach((element, index) => {
      let name = "";
      let includeSex = true;

      // 왼쪽 클러스터 이름 처리
      props.healthNetworkData.cluster_left_list.forEach((item) => {
        if (item.index === index) {
          if (item.sex && item.sex !== userInfo.sex) includeSex = false;
          name = item.name;
        }
      });

      // 오른쪽 클러스터 이름 처리
      props.healthNetworkData.cluster_right_list.forEach((item) => {
        if (item.index === index) {
          if (item.sex && item.sex !== userInfo.sex) includeSex = false;
          name = item.name;
        }
      });

      // 해당 성별에 표시해야 하는 항목인지 여부 체크 후 분류
      if (includeSex) {
        switch (element.Cluster_State) {
          case 0:
          case 1:
            break;
          case 2:
            // 주의
            state.warnList.push(name);
            break;
          case 3:
            // 위험
            state.dangerList.push(name);
            break;
          case 4:
            // 관심
            state.interestList.push(name);
            break;
        }

        if (element.Cluster_State >= 40) {
          // 40 이상일 경우 관심 종목이면서 다른 상태 포함
          state.interestList.push(name);
          switch (element.Cluster_State - 40) {
            case 0:
            case 1:
              break;
            case 2:
              // 주의
              state.warnList.push(name);
              break;
            case 3:
              // 위험
              state.dangerList.push(name);
              break;
            case 4:
              // 관심
              break;
          }
        }
      }
    });
  }
};

// Lifecycle Hook
onMounted(() => {
  initClusterStateData();
  emit('mounted')
});
</script>

<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-solution.png" />
          <h3 class="stretch-text">나의 인체 생리 네트워크</h3>
        </div>
      </div>

      <div class="data-container">
        <div class="data">
          <div class="item1 danger">
            <span class="stretch-text">
              인체 생리 네트워크에 따르면 {{ props.userInfo.user_name }}님은 
              {{ state.dangerList.length }}가지 건강 분야에서 특히 주의가 필요하며, 
              세심한 관리가 요구됩니다.
            </span>
            <div class="name stretch-text">주의</div>
          </div>
          <div class="item2 stretch-text">
            <template v-for="(list, i) in state.dangerList" :key="i">
              {{ list }}{{ i !== state.dangerList.length - 1 ? ", " : "" }}
            </template>
          </div>
        </div>
        <div class="data">
          <div class="item1 warning">
            <span class="stretch-text">
              인체 생리 네트워크에 따르면 
              {{ props.userInfo.user_name }}님은 {{ state.warnList.length }}가지 
              건강 분야를 지속적으로 관리하는 것이 필요합니다.
            </span>
            <div class="name stretch-text">관리</div>
          </div>
          <div class="item2 stretch-text">
            <template v-for="(list, i) in state.warnList" :key="i">
              {{ list }}{{ i !== state.warnList.length - 1 ? ", " : "" }}
            </template>
          </div>
        </div>
        <div class="data">
          <div class="item1 interest">
            <span class="stretch-text">
              {{ props.userInfo.user_name }}님은 {{ state.interestList.length }}개 분야에 건강
              관심을 가지고 있습니다.
            </span>
            <div class="name stretch-text">관심</div>
          </div>
          <div class="item2 stretch-text">
            <template v-for="(list, i) in state.interestList" :key="i">
              {{ list }}{{ i !== state.interestList.length - 1 ? ", " : "" }}
            </template>
          </div>
        </div>
      </div>

      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다 
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  padding-top: calc(10px * $pdf-scale);
  padding-bottom: calc(24px * $pdf-scale);
  @include flex(flex-start, center);
  height: calc(76px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    padding-left: calc(53.35px * $pdf-scale);
    line-height: 150%;
  }

  img {
    width: calc(42.9px * $pdf-scale);
    height: calc(42.9px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #008452;
    font-weight: $medium;
  }
}

.data-container {
  @include flex;
  flex-direction: column;
  gap: calc(22.2px * $pdf-scale);

  position: relative;
  width: 100%;

  margin-top: calc(6.81px * $pdf-scale);
  margin-bottom: calc(22.58px * $pdf-scale);
}

.desc {
  width: 100%;
  height: calc(66px * $pdf-scale);
  background-color: #e9f4f0;
  font-size: calc(10.923px * $pdf-scale);
  padding: calc(12.88px * $pdf-scale) calc(17.07px * $pdf-scale);
}
.subject {
  display: flex;
  justify-content: space-between;
  padding-right: calc(10.35px * $pdf-scale);

  h3 {
    font-size: calc(12px * $pdf-scale);
  }

  span {
    display: inline-block;
  }
}

.data {
  @include flex(flex-start, flex-start);
  width: 100%;
  height: calc(200px * $pdf-scale);

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .item1 {
    position: relative;

    padding: calc(12.02px * $pdf-scale) calc(10.79px * $pdf-scale);
    width: calc(174.81px * $pdf-scale);
    height: 100%;
    // border-right: calc(0.5px * $pdf-scale) solid #000000;
    font-size: calc(12px * $pdf-scale);
    line-height: 150%;
    font-weight: 400;
    span {
      font-weight: 200;
    }
  }

  .item2 {
    @include flex(flex-start, center);
    flex: 1;
    height: 100%;
    font-size: calc(16px * $pdf-scale);
    line-height: 150%;
    padding-left: calc(10px * $pdf-scale);
    font-weight: 400;
  }

  .interest {
    background-color: #eaf6fc;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);
      color: #00b4de;
      font-size: calc(19px * $pdf-scale);
      font-weight: 700;
    }
  }

  .danger {
    background-color: #fce5e4;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #ea6176;
      font-size: calc(19px * $pdf-scale);
      font-weight: 700;
    }
  }

  .warning {
    background-color: #fbfbe2;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #f7b141;
      font-size: calc(19px * $pdf-scale);
      font-weight: 700;
    }
  }
}
.bottom-info{
  bottom: calc(42px * $pdf-scale);
}
</style>