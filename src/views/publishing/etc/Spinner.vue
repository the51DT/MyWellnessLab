<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {bodyScroll} from "@/assets/js/common";

const load = ref(34); /*240108 로딩된 양 개발 요망: %*/

const loadPer = () => { /* 202606 퍼블 확인용 퍼센트 오르기 */
  load.value = 0

  const timer = setInterval(() => {
    if (load.value >= 100) {
      clearInterval(timer)
      return
    }

    load.value += 1
  }, 30)
}

onMounted(() => {
  bodyScroll(false);
  loadPer(); /* 202606 퍼블 확인용 퍼센트 오르기 */
})

onUnmounted(() => {
  bodyScroll(true);
})
</script>

<template>
  <div class="spin-wrap">
    <div class="spin--con">
      <div class="spin--img">
        <img src="/img/img_loading.png">
      </div>
      <!-- <p class="spin--con--txt">text<br>일반 로딩</p> -->
      <p class="spin--con--per">{{ load }}%</p> <!-- 리포트 퍼센트 -->
      <p class="spin--con--txt">리포트 파일을 생성하고 있습니다<br>잠시만 기다려주세요</p> <!-- 리포트 텍스트 -->
    </div>
  </div>
</template>

<style scoped>

</style>