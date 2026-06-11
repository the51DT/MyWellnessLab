<script setup>
import {ref} from "vue";

const toggleOrderProducts = ref(true);
const productDatas = ref(
  {name: "리포트 출력", imgUrl: "https://mpn.dev.amway.co.kr/static/images/thumbs/missing.jpg", quantity: 1, price: 22000},
)
</script>

<template>
  <section class="group orderProduct"> <!--주문제품-->
    <header class="group--header align--horiz" :class="!toggleOrderProducts ? '' : 'active'">
      <h2 class="group--tit">주문제품</h2>
      <div>
        <strong class="txt--small2">주문명</strong>
        <button @click="toggleOrderProducts = !toggleOrderProducts" type="button" class="btn--up-down">
          <span v-if="toggleOrderProducts">∧</span>
          <span v-if="!toggleOrderProducts">∨</span>
        </button>
      </div>
    </header>

    <div v-if="toggleOrderProducts"> <!--제품-->

      <div class="align--horiz">
        <div class="orderProduct--img">
          <img :src="productDatas.imgUrl" :alt="productDatas.name" srcset="">
        </div>
        <div class="orderProduct--txt align--vertical--center">
          <div>
            <h5 class="tit--small">{{ productDatas.name }}</h5>
            <dl class="orderProduct--dl">
              <dt>수량</dt>
              <dd><strong>1</strong></dd>
              <dt>단가</dt>
              <dd class="orderProduct--price1">{{ productDatas.price }}원</dd>
              <dt>소계</dt>
              <dd class="orderProduct--priceT"><strong>{{ productDatas.price }}</strong>원</dd>
            </dl>
          </div>
        </div>
      </div>

    </div>

  </section>
  <div class="orderProduct--desc space--bottom-default">
    <span>ㆍ</span>
    <span>더블엑스 주문 수량은 [골드, 실버, 그린 각 1정 씩 포함된 한 세트]의 주문 수량입니다.</span>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>