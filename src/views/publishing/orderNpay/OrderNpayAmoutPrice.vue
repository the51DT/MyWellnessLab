<script setup>
import { ref } from 'vue'
import BaseTooltip from '@/views/publishing/orderNpay/BaseTooltipOrderNpay.vue'

const tooltipPrice = ref(false) /* 결제금액 툴팁 토글 */
const togglePayAmount = ref(true) /* 결제금액 내역 토글 */
</script>

<template>
  <section class="group"> <!--결제금액-->
    <header class="group--header align--horiz" :class="!togglePayAmount ? '' : 'active'">
      <div class="tooltip">
        <h2 class="group--tit">
          결제금액 <button @click="tooltipPrice = !tooltipPrice" class="btn--tooltip" type="button" title="도움말"></button>

          <base-tooltip v-if="tooltipPrice">
            <template v-slot:contents>
              <div style="width: 20rem;">리포트 출력</div>
              10000원
            </template>
          </base-tooltip>
        </h2>
      </div>
      <button @click="togglePayAmount = !togglePayAmount" type="button" class="btn--up-down">
        <span v-if="togglePayAmount">∧</span>
        <span v-if="!togglePayAmount">∨</span>
      </button>
    </header>

    <div v-if="togglePayAmount" class="pay-amount">
      <dl class="pay-amount--item space--top-small">
        <dt>주문금액</dt>
        <dd>12,000원</dd>
        <dt>배송비</dt>
        <dd>3,000원</dd>
        <dt>포장비</dt>
        <dd>0원</dd>
        <dt>할인정보</dt>
        <dd>0원</dd>
      </dl>
      <dl class="pay-amount--item space--top-small">
        <dt>총 결제금액</dt>
        <dd><strong class="txt--big2">12,000원</strong></dd>
      </dl>
      <dl class="pay-amount--item space--top-small">
        <dt>총 PV/BV</dt>
        <dd>6,000 / 6,000</dd>
      </dl>
    </div>
  </section>
</template>

<style scoped></style>
