<script setup>
  import router from "@/router";

  function payment(){
    router.push('/order-pay-detail');
  }
</script>

<template>
  <div class="price-pay-btn">
    <button @click="payment" type="button" class="btn--big2 space--top-default txt--default">
      <span class="txt--small4 txt--blue">총</span> 12,000
      <span class="txt--small4 txt--blue">원</span> 결제하기
    </button>
  </div>
</template>

<style scoped>

</style>