<script setup>
import BasePopup from '@/views/publishing/orderNpay/BasePopupOrder.vue'
import { getCurrentInstance } from 'vue'

const prefix = 'newAddress' /* 231217 클래스 접두어 */
const props = defineProps({ /* 231217 오프너 프랩스 받음 */
  isNewAddress: Boolean
})
const instance = getCurrentInstance()

function popupClose () {
  instance.emit('popupClose')
}
</script>

<template>
  <base-popup v-if="props.isNewAddress">
    <template v-slot:title>
      새 배송지
    </template>
    <template v-slot:contents>
      <div :class="prefix">
        <div>
          <label for="newAddressReceiver">받는 분</label>
          <input type="text" name="" id="newAddressReceiver" />
        </div>
        <div class="newAddress--phone">
          <label for="receiverPhone">받는 분 전화번호</label>
          <div class="newAddress--phone-input">
            <select name="Phone" id="receiverPhone" class="newAddress--010">
              <option value="010">010</option>
            </select>
            <input type="number" name="Phone2" class="newAddress--phone-extra" />
          </div>
        </div>
        <div class="newAddress--address">
          <label for="newAddressAddress">주소</label>
          <div>
            <div class="newAddress--loca-find">
              <input
                type="text"
                name=""
                id="newAddressAddress"
                class="newAddress--loca-input" />
              <button type="button" class="newAddress--loca-btn">주소찾기</button> <!--231217 주소 api 연결 요망-->
            </div>
            <input
              type="text"
              name=""
              id="newAddressAddress2"
              class="newAddress--address2" />
            <input
              type="text"
              name=""
              id="newAddressAddress3"
              class="newAddress--address3" />
          </div>
        </div>
        <label for="newAddressDefault" class="newAddress--default">
          <input type="checkbox" name="" id="newAddressDefault" /> 기본 배송지
        </label>
        <div class="newAddress--agree">
          <p>본인은 정보주체(배송받는 사람)로부터 개인정보가 제3자인 한국 암웨이에 배송 목적으로 제공된다는 사실을 안내하고, 동의를 받으셨습니까?</p>
          <div class="newAddress--agree-radio">
            <label for="agree1" class="newAddress--rlabel">
              <input type="radio" name="agree" id="agree1" />
              <span>예</span>
            </label>
            <label for="agree2" class="newAddress--rlabel r2">
              <input type="radio" name="agree" id="agree2" />
              <span>아니요</span>
            </label>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="popup--foot two">
        <button @click="popupClose" type="button" class="btn--pop-bottom white">취소</button>
        <button type="button" class="btn--pop-bottom navy">확인</button>
      </div>
    </template>
  </base-popup>
</template>

<style scoped lang="scss">
@use "@/assets/css/ordernpay";
</style>
