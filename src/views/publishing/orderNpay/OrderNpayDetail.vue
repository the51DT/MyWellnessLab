<script setup>
import { ref } from 'vue'
import OrderNpayHeader from '@/views/publishing/orderNpay/OrderNpayHeader.vue'

const data = ref({
  name: '리포트출력',
  appNum: '230914010001',
  appDate: '2023-10-02',
  status: '???',
  composition: '???',
  price: 120000,
  pv: 45000,
  bv: 55000,
  imgUrl: 'https://mpn.dev.amway.co.kr/static/images/thumbs/missing.jpg'
})
const tab = ref(0)

</script>

<template>
  <div class="orderNpay">
    <order-npay-header> <!--페이지 제목-->
      <template v-slot:title>
        리포트 주문상세
      </template>
    </order-npay-header>
    <div class="space--default">
      <h2 class="pay-tit space--bottom-default">마이웰니스 랩</h2>
      <button @click="tab = 0" class="btn--tab" :class="!tab ? 'active' : ''" type="button">주문서</button>
      <button @click="tab = 1" class="btn--tab" :class="tab ? 'active' : ''" type="button">주문내역</button>
      <div v-if="!tab" class="space--top-default">
        <dl class="list--dl">
          <dt>주문제품</dt>
          <dd>{{ data.name }}</dd> <!--임시 네이밍-->
          <dt>신청번호</dt>
          <dd>{{ data.appNum }}</dd>
          <dt>신청일</dt>
          <dd>{{ data.appDate }}</dd>
          <dt>상태</dt>
          <dd>{{ data.status }}</dd>
          <dt>구성</dt>
          <dd>{{ data.composition }}</dd>
          <dt>금액</dt>
          <dd><strong>{{ data.price }} 원</strong></dd>
          <dt>PV/BV</dt>
          <dd>{{ data.pv }} / {{ data.bv }}</dd>
        </dl>
        <h2 class="tit--default space--top-default">제품정보</h2>
        <div class="product-detail">
          <img :src="data.imgUrl" :alt="data.name">
          <strong>{{ data.name }}</strong>
        </div>
      </div>

      <div v-else-if="tab">
        <div class="ond-style">
          <strong>180-800506902 (무슨 번호인지 모르겠으니 개발 시 확인 요망)</strong>
          <span>{{ data.appDate }} (신청일이 맞는지 모르겠으니 개발 시 확인 요망)</span>
        </div>
        <div class="align--between space--top-default">
          <h2 class="tit--default">리포트 결제 완료</h2>
          <div>첫주문</div>
        </div>
        <dl class="list--dl">
          <dt>금액</dt>
          <dd>{{ data.price }}</dd>
          <dt>PV/BV</dt>
          <dd>{{ data.pv }} / {{ data.bv }}</dd>
        </dl>
        <div class="space--top-default align--center">
          <button type="button" class="btn--small">결제취소</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css/ordernpay";

dt {
  width: 30%;
}

dd {
  width: 70%;
}

@media (min-width: 1400px) {
  dt {
    width: 15%;
  }

  dd {
    width: 35%;
  }
}</style>
