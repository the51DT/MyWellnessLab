<script setup>
import PageHeader from '../PageHeader.vue'
import { useClusterData } from '@/assets/js/chart/graphData'

import { ref, onMounted } from 'vue'
const {  cluster_name_left,
  cluster_name_right} = useClusterData()
const props = defineProps({
  save: Boolean,
  userInfo: null,
  recommendData: null
})

const dangerList = ref([])
const warnList = ref([])
const interestList = ref([])

const init = ref(false)

/**
 * 차트 데이터 세팅
 */
function initClusterStateData () {
  if (props.recommendData !== undefined) {
    warnList.value = []
    dangerList.value = []
    interestList.value = []

    props.recommendData.resultDto.MHN_CL.forEach((element, index) => {
      let name = ''
      let includeSex = true

      cluster_name_left.forEach((element) => {
        if (element.index === index) {
          if (element.sex && element.sex !== props.userInfo.sex) {
            includeSex = false
          }

          name = element.name
        }
      })

      cluster_name_right.forEach((element) => {
        if (element.index === index) {
          if (element.sex && element.sex !== props.userInfo.sex) {
            includeSex = false
          }

          name = element.name
        }
      })

      // 해당 성별에 표시해야 하는 항목인지 여부 체크 후 분류
      if (includeSex) {
        if (element.Cluster_State >= 40) {
          // 40이상일 경우 관심종목이지만 주의/위험인 경우
          interestList.value.push(name)
        }

        switch (element.Cluster_State) {
          case 2: case 42:
            // 2:주의, 42:관심&주의
            warnList.value.push(name)
            break
          case 3: case 43:
            // 3:위험, 43:관심&위험
            dangerList.value.push(name)
            break
          case 4:
            // 4: 관심
            interestList.value.push(name)
            break
        }
      }
    })
  }
}

onMounted(() => {
  initClusterStateData()
  init.value = true
})

</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside" v-if="init">
      <PageHeader page="23" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-solution.png" />
          <h3 class="stretch-text"> {{ $t('Page26.text1') }}</h3>
        </div>
      </div>

      <div class="data-container">
        <div class="data">
          <div class="item1 interest">
            <span class="stretch-text">
              {{ userInfo.name }}{{ $t('Page26.text2') }} {{ interestList.length }}{{ $t('Page26.text3') }}
            </span>
            <div class="name stretch-text">{{ $t('Common.attention') }}</div>
          </div>
          <div class="item2 stretch-text">
            <template v-for="(list, i) in interestList" :key="i">
              {{ list }}{{ i !== interestList.length - 1 ? ", " : "" }}
            </template>
          </div>
        </div>

        <div class="data">
          <div class="item1 danger">
            <span class="stretch-text">
              {{ userInfo.name }}{{ $t('Page26.text5') }}
              {{ dangerList.length }}{{ $t('Page26.text6') }}
            </span>
            <div class="name stretch-text">{{ $t('Common.warning') }}</div>
          </div>
          <div class="item2 stretch-text">
            <template v-for="(list, i) in dangerList" :key="i">
              {{ list }}{{ i !== dangerList.length - 1 ? ", " : "" }}
            </template>
          </div>
        </div>

        <div class="data">
          <div class="item1 warning">
            <span class="stretch-text">
              {{ userInfo.name }}{{ $t('Page26.text5') }}
              {{ warnList.length }}{{ $t('Page26.text8') }}
            </span>
            <div class="name stretch-text">{{ $t('Common.manage') }}</div>
          </div>
          <div class="item2 stretch-text">
            <template v-for="(list, i) in warnList" :key="i">
              {{ list }}{{ i !== warnList.length - 1 ? ", " : "" }}
            </template>
          </div>
        </div>
      </div>

      <div class="bottom-info">
        {{ $t('Page26.text10') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.stretch-text {
  display: inline-block;
}
.title-container {
  @include flex(flex-start, center);
  height: calc(98.75px * $pdf-scale);

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
    color: $tit-color;
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
  /* border: calc(0.3px * $pdf-scale) solid #000000; */
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
  /* padding-top: calc(12.39px * $pdf-scale); */
  padding-right: calc(10.35px * $pdf-scale);
  /* margin-bottom: calc(6.81px * $pdf-scale); */

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
  height: calc(189.39px * $pdf-scale);

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .item1 {
    position: relative;

    padding: calc(12.02px * $pdf-scale) calc(10.79px * $pdf-scale);
    width: calc(174.81px * $pdf-scale);
    height: 100%;
    border-right: calc(0.3px * $pdf-scale) solid #000000;
    font-size: calc(12px * $pdf-scale);
    line-height: 150%;
    font-weight: 400;
    span {
      font-weight: 200;
    }
  }

  .item2 {
    flex: 1;
    height: 100%;
    font-size: calc(16px * $pdf-scale);
    line-height: 150%;

    padding-left: calc(22.28px * $pdf-scale);
    @include flex(flex-start, center);
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
    }
  }
}
</style>
