<script setup>
import router from '@/router'
</script>

<template>
  <div class="error">
    <div>
      <img src="/img/img_error.png" class="error--img" alt="" />
    </div>
    <h2 class="error--tit">
      404 Not Found
      <!--      500 Internal Server Error-->
    </h2>
    <p class="error--txt">
      페이지를 찾을 수 없습니다
      <!--      페이지가 작동하지 않습니다-->
    </p>
    <div class="error--btn">
      <button @click="history.back()" class="btn-pop--gray" type="button">이전</button>
      <button @click="router.push('/')" class="btn-pop--gray" type="button">홈</button>
    </div>
  </div>
</template>

<style scoped>
</style>
