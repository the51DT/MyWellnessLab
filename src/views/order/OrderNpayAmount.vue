<script setup>
import OrderNpayPromotion from "@/views/orderNpay/OrderNpayPromotion.vue";
import OrderNpayAmoutPrice from "@/views/orderNpay/OrderNpayAmoutPrice.vue";
import OrderNpayAmountTerms from "@/views/orderNpay/OrderNpayAmountTerms.vue";

const props = defineProps({
  payMethod: String
})
</script>

<template>
  <div class="space--top-small2 responsive">

    <OrderNpayAmoutPrice/>
    <OrderNpayPromotion/>
    <OrderNpayAmountTerms :payMethod="props.payMethod"/>

  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>