<script setup>
import { ref } from 'vue'
import OrderNpayAmountTermsPopup from '@/views/order/OrderNpayAmountTermsPopup.vue'
import OrderNpayAmountTermsPopup2 from '@/views/order/OrderNpayAmountTermsPopup2.vue'
import OrderNpayAmountTermsPopup3 from '@/views/order/OrderNpayAmountTermsPopup3.vue'
import OrderNpayAmountTermsPopup4 from '@/views/order/OrderNpayAmountTermsPopup4.vue'
import BaseTooltip from '@/views/order/BaseTooltipOrderNpay.vue'

const props = defineProps({
  payMethod: String /* 결제수단 부모한테 받기 */
})

const toggleTermsAgree = ref(false) /* 결제 동의 토글 */
const checkboxOrderConfirmAgree = ref(null) /* 주문 및 결제 동의 */
const checkboxOrderProductName = ref(null) /* 제품정보 동의 */
const checkboxPersonalInfoReceive = ref(null) /* 개인정보 동의 */
const checkboxTossPersonalInfo = ref(null) /* 개인정보 동의 */
const checkboxTossElecTransfer = ref(null) /* 개인정보 동의 */
const checkboxTossThirdInfo = ref(null) /* 개인정보 동의 */
const popupPerInfCorUseAgr = ref(false) /* 개인정보 수집 및 이용에 대한 동의 팝업 토글 */
const popupTossPersonalInfo = ref(false) /* TOSS 개인정보 수집 이용 동의 팝업 토글 */
const popupTossElecTransfer = ref(false) /* 전자금융거래 기본약관(이용자용) 팝업 토글 */
const popupTossThirdInfo = ref(false) /* 개인정보 제3자 제공 동의 팝업 토글 */
const tooltipInsuInfo = ref(false) /* 소비자피해보상보험 가입 안내 보기 툴팁 토글 */

function checkboxOrderConfirmAgreeSelect(event) {
  if (event.target.checked) {
    checkboxOrderProductName.value.checked = true
    checkboxPersonalInfoReceive.value.checked = true
    checkboxTossPersonalInfo.value.checked = true
    checkboxTossElecTransfer.value.checked = true
    checkboxTossThirdInfo.value.checked = true
  } else {
    checkboxOrderProductName.value.checked = false
    checkboxPersonalInfoReceive.value.checked = false
    checkboxTossPersonalInfo.value.checked = false
    checkboxTossElecTransfer.value.checked = false
    checkboxTossThirdInfo.value.checked = false
  }
}

function checkboxOrderConfirmAgreeEmit() {
  checkboxOrderProductName.value.checked &&
    checkboxPersonalInfoReceive.value.checked &&
    checkboxTossPersonalInfo.value.checked &&
    checkboxTossElecTransfer.value.checked &&
    checkboxTossThirdInfo.value.checked
    ? checkboxOrderConfirmAgree.value.checked = true
    : checkboxOrderConfirmAgree.value.checked = false
}

function closePop(num) {
  switch (num) {
    case 1:
      popupPerInfCorUseAgr.value = false
      break
    case 2:
      popupTossPersonalInfo.value = false
      break
    case 3:
      popupTossElecTransfer.value = false
      break
    case 4:
      popupTossThirdInfo.value = false
      break
  }
}

function goInsu() {
  window.open('https://www.macco.or.kr/ko/info/selectMemCompanyList.do', '_blank') /* 이렇게 직접 연결해도 되는지? to 개발 */
}
</script>

<template>
  <section class="termsAgree"> <!--약관 동의-->
    <ul class="termsAgree--ul">
      <li>
        <div class="align--horiz termsAgree--first">
          <label for="orderConfirmAgree">
            <input @change="checkboxOrderConfirmAgreeSelect" ref="checkboxOrderConfirmAgree" type="checkbox"
              id="orderConfirmAgree">
            <strong class="tit--small2">주문내용 확인 및 결제 진행 동의</strong>
          </label>
          <button @click="toggleTermsAgree = !toggleTermsAgree" type="button" class="btn--txt">
            약관보기
            <span v-if="toggleTermsAgree">∧</span>
            <span v-if="!toggleTermsAgree">∨</span>
          </button>
        </div>
        <ul v-show="toggleTermsAgree" class="termsAgree--ul--ul">
          <li>
            <label for="orderProductName" class="align--horiz left">
              <input @click="checkboxOrderConfirmAgreeEmit" ref="checkboxOrderProductName" type="checkbox"
                id="orderProductName" style="width: 3rem;">
              <span class="txt--small3" style="width: calc( 100% - 4rem )">주문하실 상품의 상품명, 가격, 배송정보를 확인하였으며, 이에 동의(전자상거래법
                제8조 제2항)</span>
            </label>
          </li>
          <li class="align--horiz">
            <label for="personalInfoReceive" class="align--horiz left" style="width: 70%;">
              <input @click="checkboxOrderConfirmAgreeEmit" ref="checkboxPersonalInfoReceive" type="checkbox"
                id="personalInfoReceive" style="width: 3rem;">
              <span class="txt--small3" style="width: calc( 100% - 4rem )">개인정보 수집 및 이용에 대한 동의</span>
            </label>
            <button @click="popupPerInfCorUseAgr = true" type="button" class="btn--txt"><span class="txt--underline">자세히
                보기</span></button>

            <OrderNpayAmountTermsPopup v-if="popupPerInfCorUseAgr" @closePop="closePop" />

          </li>
        </ul>
      </li>
    </ul>

    <hr>

    <ul v-show="props.payMethod === 'apayAuto' || props.payMethod === 'apayCard'" class="termsAgree--ul">
      <li class="align--horiz">
        <label for="tossPersonalInfo">
          <input @click="checkboxOrderConfirmAgreeEmit" ref="checkboxTossPersonalInfo" type="checkbox"
            id="tossPersonalInfo">
          <span class="tit--small2">TOSS 개인정보 수집 이용 동의</span>
        </label>
        <button @click="popupTossPersonalInfo = true" type="button" class="btn--txt"><span class="txt--underline">자세히
            보기</span></button>

        <OrderNpayAmountTermsPopup2 v-if="popupTossPersonalInfo" @closePop="closePop" />

      </li>
      <li class="align--horiz">
        <label for="tossElecTransfer">
          <input @click="checkboxOrderConfirmAgreeEmit" ref="checkboxTossElecTransfer" type="checkbox"
            id="tossElecTransfer">
          <span class="tit--small2">TOSS 전자금융거래 기본약관</span>
        </label>
        <button @click="popupTossElecTransfer = true" type="button" class="btn--txt"><span class="txt--underline">자세히
            보기</span></button>

        <OrderNpayAmountTermsPopup3 v-if="popupTossElecTransfer" @closePop="closePop" />

      </li>
      <li class="align--horiz">
        <label for="tossThirdInfo">
          <input @click="checkboxOrderConfirmAgreeEmit" ref="checkboxTossThirdInfo" type="checkbox" id="tossThirdInfo">
          <span class="tit--small2">TOSS 개인정보 제3자 제공 동의</span>
        </label>
        <button @click="popupTossThirdInfo = true" type="button" class="btn--txt"><span class="txt--underline">자세히
            보기</span></button>

        <OrderNpayAmountTermsPopup4 v-if="popupTossThirdInfo" @closePop="closePop" />

      </li>
    </ul>

    <div class="align--right space--top-small">
      <div class="tooltip">
        <span class="txt--small3">소비자피해보상보험 가입 안내 보기</span>
        <button @click="tooltipInsuInfo = !tooltipInsuInfo" class="btn--tooltip" type="button" title="도움말"></button>

        <base-tooltip v-if="tooltipInsuInfo" class="top">
          <template v-slot:contents>
            <div class="txt--left">
              전자상거래등에서의 소비자보호에관한 법률에 따라 직접판매공제조합에 가입하여 고객님의 결제금액에 대해 안전거래를 보장하고 있습니다.
              <div class="txt--right">
                <button @click="goInsu" type="button" class="btn--small">보험가입사실 확인</button>
              </div>
            </div>
          </template>
        </base-tooltip>

      </div>
  </div>

</section></template>

<style lang="scss" scoped>@use "@/assets/css/ordernpay";</style>
