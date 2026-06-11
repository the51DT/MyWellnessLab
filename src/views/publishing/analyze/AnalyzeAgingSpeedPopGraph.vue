<script setup>
import { onMounted, onUnmounted } from 'vue'
import { bodyScroll } from '@/assets/js/common'

const props = defineProps({
  data: Array
})

onMounted(() => {
  bodyScroll(false)
})

onUnmounted(() => {
  bodyScroll(true)
})
</script>

<template>
  <div class="analyze-box">
    <div class="txt--right AnalyzeCheckupDataRecord--label">
      <span class="AnalyzeCheckupDataRecord--label-wrap">
        <span class="AnalyzeCheckupDataRecord--label-rect bora" /> 한국인 평균
      </span>
      <span class="AnalyzeCheckupDataRecord--label-wrap">
        <span class="AnalyzeCheckupDataRecord--label-rect green" /> 나의 위치
      </span>
    </div>
    <div class="AnalyzeAgingSpeedPop--graph-wrap">

      <div v-for="item in props.data" :key="item.title" class="AnalyzeAgingSpeedPop--unit">
        <h2 class="AnalyzeAgingSpeedPop--tit">{{item.title}}</h2>
        <div class="bar--wrap">
          <!-- 총 바 형태는 8가지임
            크게 5가지 타입과 그 중 3가지는 뒤짚어져있는 형태
            5가지 타입은 type1 ~ 5
            뒤짚은 형태는 reverse를 넣어주기

            예) class="bar--bg type1 reverse"

            ********* 타입설명은 PPT참조

            ppt상의 수치를 계산해서 해당하는 위치(대부분 3등분인데 해당되는 위치의 내 위치아이콘과, 평균 아이콘을 보이도록 처리)
          -->
          <!--          1타입-->
          <div class="bar--bg type1">
            <div class="divide1">
              <!-- 해당되는 범위의 아이콘만 보이도록 -->
              <div v-if="true"> <!--여기다 v-if 처리하면 됨-->
                <div
                  class="bar--average"
                  :style="`left: calc(` + item.average + `% - 5px);`" /> <!-- 한국인 평균, 100을 변수로 사용 -->
                <img
                  src="/img/ico_me.svg"
                  class="bar--me"
                  :style="`left: calc(` + item.value + `% - 8px);`"
                  alt="" /> <!-- 나의 위치, 100을 변수로 사용 -->
              </div>
            </div>
            <div class="divide2">
              <!-- 해당되는 범위의 아이콘만 보이도록 -->
              <div v-if="false"> <!--여기다 v-if 처리하면 됨-->
                <div
                  class="bar--average"
                  :style="`left: calc(` + item.average + `% - 5px);`" /> <!-- 한국인 평균, 100을 변수로 사용 -->
                <img
                  src="/img/ico_me.svg"
                  class="bar--me"
                  :style="`left: calc(` + item.value + `% - 8px);`"
                  alt="" /> <!-- 나의 위치, 100을 변수로 사용 -->
              </div>
            </div>
            <div class="divide3">
              <!-- 해당되는 범위의 아이콘만 보이도록-->
              <div v-if="false"> <!--여기다 v-if 처리하면 됨-->
                <div
                  class="bar--average"
                  :style="`left: calc(` + item.average + `% - 5px);`" /> <!-- 한국인 평균, 100을 변수로 사용 -->
                <img
                  src="/img/ico_me.svg"
                  class="bar--me"
                  :style="`left: calc(` + item.value + `% - 8px);`"
                  alt="" /> <!-- 나의 위치, 100을 변수로 사용 -->
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
