<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/* 퍼블 확인용 데이터 없을 때 받을 값 */
const route = useRoute()
const noHistory = computed(() => {
  return route.meta.noHistory === true
})

const coupon = [ /* 소지한 쿠폰 */
  {
    label:'구매', 
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    description: '마이웰니스 랩 분석권(구매) 쿠폰 안내 문구입니다.',
    quantity: 8
  },
  {
    label:'양수', 
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  },
  {
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    quantity: 8
  },
  {
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  },
  {
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    quantity: 8
  },
  {
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  },
  {
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    quantity: 8
  },
  {
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  },
  {
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    quantity: 8
  },
  {
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  },
  {
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    quantity: 8
  },
  {
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  },
  {
    title: '마이웰니스 랩 건강 분석권',
    limit: '~ 2023.09.12',
    quantity: 8
  },
  {
    title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
    limit: '~ 2023.12.31',
    quantity: 2
  },
  {
    title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
    limit: '~ 2024.12.31',
    quantity: 4
  }
]

</script>

<template>
  <section class="CouponStatus MyCouponStatus">
    <div v-if="noHistory" class="AnalyzeList--no-data"> <!-- v-if 퍼블 확인용 -->
      <span>분석권 사용 이력이 없습니다</span>
    </div>

    <div v-else class="CouponStatus--list">
      <div v-if="coupon.length">
        <div v-for="(item, index) in coupon" :key="index" class="CouponStatus--list-for">
          <div class="align--between CouponStatus--coupon">
            <div class="CouponStatus--coupon-txt">
              <div class="CouponStatus--c-wrap">
                <span class="CouponStatus--coupon-type">{{ item.label || "프로모션" }}</span>
                <strong class="CouponStatus--coupon-tit">{{ item.title }}</strong>
                <span class="CouponStatus--coupon-limit">사용기한
                  <span class="CouponStatus--coupon-date">{{ item.limit }}</span>
                </span>
                <p v-if="item.description" class="CouponStatus--coupon-desc">{{ item.description }}</p>
              </div>
            </div>
            <div class="CouponStatus--coupon-quan">
              <span class="CouponStatus--coupon-quan-in">
                <span class="CouponStatus--coupon-quan-digit">{{ item.quantity }}<span class="CouponStatus--jang">장</span></span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>

<style lang="scss"></style>
