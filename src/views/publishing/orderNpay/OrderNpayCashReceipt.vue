<script setup>
import { ref } from 'vue'
import PopupCashReceipt from '@/views/publishing/orderNpay/OrderNpayCashReceiptPopup.vue'

const popupCashReceipt = ref(false)

function closePop() {
  popupCashReceipt.value = false
}
</script>

<template>
  <div> <!--현금영수증-->
    <strong>
      현금영수증
    </strong>
    <button @click="popupCashReceipt = true" class="btn--big2" type="button">현금영수증 신청</button>

    <PopupCashReceipt v-if="popupCashReceipt" @closePop="closePop" />

  </div>
</template>

<style scoped></style>
