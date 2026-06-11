<script setup>
import OrderNpayPromotion from '@/views/publishing/orderNpay/OrderNpayPromotion.vue'
import OrderNpayAmoutPrice from '@/views/publishing/orderNpay/OrderNpayAmoutPrice.vue'
import OrderNpayAmountTerms from '@/views/publishing/orderNpay/OrderNpayAmountTerms.vue'

const props = defineProps({
  payMethod: String
})
</script>

<template>
  <div class="space--top-small2 responsive">

    <OrderNpayAmoutPrice />
    <OrderNpayPromotion />
    <OrderNpayAmountTerms :payMethod="props.payMethod" />

  </div>
</template>

<style scoped></style>
