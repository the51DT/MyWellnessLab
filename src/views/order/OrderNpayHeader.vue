<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}

</script>

<template>
  <div class="pay-header">
    <div class="pay-header--wrap">
      <div class="pay-header--back">
        <button @click="handleBack" type="button" class="header--back-btn" />
      </div>
      <h1 class="pay-header--tit">
        <span class="pay-header--txt">
          <slot name="title">리포트 주문/결제</slot>
        </span>
      </h1>
      <div class="pay-header--right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>
