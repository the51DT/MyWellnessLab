<script setup>

import router from "@/router";
</script>

<template>
  <div class="pay-header"> <!--제목-->
    <div class="pay-header--wrap">
      <div class="pay-header--back" style="height: 4.8rem;">
        <button @click="router.back()" type="button" class="header--back-btn"></button>
      </div>
      <h1 class="pay-header--tit">
        <span class="pay-header--txt">
          <slot name="title">리포트 주문/결제</slot>
        </span>
      </h1>
      <div class="pay-header--right"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>