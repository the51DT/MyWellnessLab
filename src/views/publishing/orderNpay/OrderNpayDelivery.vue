<script setup>
import { ref } from 'vue'
import PopupDeliverySelect from '@/views/publishing/orderNpay/OrderNpayDeliveryPopup.vue'

const popupDeliverySelect = ref(false) /* 팝업 열고 닫기 */

function closePop() {
  popupDeliverySelect.value = false
}

</script>

<template>
  <section class="pay-delivery-address"> <!--배송지-->
    <div class="pay-delivery-address--header">
      <h2 class="pay-tit">우리 집 <span class="label--normal pay-delivery-address--label">기본배송지</span></h2>
      <button @click="popupDeliverySelect = true" type="button" class="btn--small">변경</button>

      <PopupDeliverySelect v-show="popupDeliverySelect" @closePop="closePop" />

    </div>
    <div class="pay-delivery-address--txt">
      서울 강남구 영동대로 517 아셈타워 1104F (삼성동) <br>
      휴대폰 : 010-3333-9999 <br>
      배송메시지 : 집앞에 부탁해요
    </div>
  </section>
</template>

<style scoped></style>
