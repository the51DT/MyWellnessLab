<script setup>
import { go } from '@/assets/js/common'
import { ref, onMounted, inject, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import PopupDeliverySelect from '@/views/order/OrderNpayDeliveryPopup.vue'

const store = useStore()
const axios = inject('$axios')
const token = store.getters.getToken
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/address-list'

// TODO LYH Start 근시일 중 정리 예정
const header = {
  Authorization: token
}
// TODO END

const props = defineProps(['myAddressList'])

const defaultAddress = ref('')

const popupDeliverySelect = ref(false) /* 팝업 열고 닫기 */

function closePop() {
  popupDeliverySelect.value = false
}

onMounted(() => {
  props.myAddressList.target.forEach((target) => {
    if (target.defaultAddress) {
      defaultAddress.value = target
    }
  })
})
</script>

<template>
  <section class="pay-delivery-address"> <!--배송지-->
    <div class="pay-delivery-address--header">
      <h2 class="pay-tit">{{ defaultAddress.name }} <span class="label--normal pay-delivery-address--label">기본배송지</span>
      </h2>
      <button @click="popupDeliverySelect = true" type="button" class="btn--small">변경</button>

      <PopupDeliverySelect :subMyAddressList="props.myAddressList" v-show="popupDeliverySelect" @closePop="closePop" />

    </div>
    <div class="pay-delivery-address--txt">
      {{ defaultAddress.formattedAddress }} <br>
      휴대폰 : {{ defaultAddress.cellphone }} <br>
      배송메시지 :
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>
