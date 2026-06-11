<script setup>
import BasePopup from '@/views/publishing/orderNpay/BasePopupOrder.vue'
import { getCurrentInstance, ref } from 'vue'

const isInput = ref(false)

const instance = getCurrentInstance()
function close () {
  instance.emit('closePop')
}

</script>

<template>
  <base-popup>
    <template v-slot:title>
      현금영수증 신청
    </template>
    <template v-slot:contents>
      <div class="popup--contents-pad--rl15">
        <label for="no" class="popup-cash-receipt--radio">
          <input
            @change="isInput = false"
            type="radio"
            name="cashReceipt"
            id="no"
            checked />
          신청안함
        </label>
        <label for="cash" class="popup-cash-receipt--radio">
          <input
            @change="isInput = true"
            type="radio"
            name="cashReceipt"
            id="cash" />
          현금영수증
        </label>
        <div v-if="isInput" class="popup-cash-receipt--bg-gray">
          <h2 class="popup-cash-receipt--tit">개인 소득공제용</h2>
          <select name="" id="" class="popup-cash-receipt--select">
            <option value="" selected disabled>현금영수증 발행 선택</option>
            <option value="">휴대폰 번호</option>
            <option value="">현금영수증 카드번호</option>
          </select>
          <input
            type="text"
            name=""
            id=""
            class="popup-cash-receipt--input" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="popup--foot two">
        <button @click="close" type="button" class="btn--pop-bottom white">취소</button>
        <button type="button" class="btn--pop-bottom navy">선택</button>
      </div>
    </template>
  </base-popup>
</template>

<style scoped lang="scss">
@use "@/assets/css/ordernpay";
</style>
