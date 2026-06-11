<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {bodyScroll} from "@/assets/js/common";

const load = ref(34); /*240108 로딩된 양 개발 요망: %*/

onMounted(() => {
  bodyScroll(false);
})

onUnmounted(() => {
  bodyScroll(true);
})
</script>

<template>
  <div class="spin-wrap">
    <div class="spin--con">
      <div class="spin--con--bar">
        <div class="spin--con--value" :style="`width: ` + load + `%`"></div>
      </div>
      <p class="spin--con--txt">리포트 파일을 생성하고 있습니다<br>잠시만 기다려주세요</p>
    </div>
  </div>
</template>

<style scoped>

</style>