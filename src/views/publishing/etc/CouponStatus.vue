<script>

export default {
  name: 'CouponStatus',
  data () {
    return {
      coupon: [ /* 소지한 쿠폰 */
        {
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
          title: '마이웰니스 랩 건강 분석 쿠폰',
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
      ],
      paging: 10, /* 231214 한번에 페이징 개수 */
      isPc: false /* 231214 가로가 920이상인지? */
    }
  },
  methods: {
    more () { /* 페이징 버튼 액션 */ /* 231214 */
      this.paging += 10
    },
    winWidth () {
      this.isPc = window.innerWidth > 920
    }
  },
  mounted () {
    window.addEventListener('scroll', () => { /* 아래 스크롤하면 페이징 늘어나도록 */
      if (!this.isPc) {
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
          this.more()
        }
      }
    })
    this.winWidth()
    window.addEventListener('resize', () => {
      this.winWidth()
    })
  }
}
</script>

<template>
  <section class="CouponStatus">

    <div v-if="coupon.length" class="CouponStatus--info-wrap">
      <p class="CouponStatus--info">
        <strong>건강설문 및 건강 분석 결과 확인을 위해서는</strong>
        웰니스 쿠폰이 필요합니다
      </p>
    </div>

    <div v-if="coupon.length" class="CouponStatus--total">보유쿠폰
      <span class="CouponStatus--total-digit">총
        <strong class="CouponStatus--t-digit">{{coupon.length}}</strong>개
      </span>
    </div>

    <div class="CouponStatus--list">

      <div v-if="coupon.length">
        <div v-for="(item, index) in coupon.slice(0, paging)" :key="index" class="CouponStatus--list-for">
          <div class="align--between CouponStatus--coupon">
            <div class="CouponStatus--coupon-txt">
              <div class="CouponStatus--c-wrap">
                <strong class="CouponStatus--coupon-tit">{{ item.title }}</strong>
                <span class="CouponStatus--coupon-limit">사용 기한 :
                  <span class="CouponStatus--coupon-date">{{ item.limit }}</span>
                </span>
              </div>
            </div>
            <div class="CouponStatus--coupon-quan">
              <span class="CouponStatus--coupon-quan-in">
                <span class="CouponStatus--coupon-quan-digit">{{ item.quantity }}<span class="CouponStatus--jang">장</span></span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="coupon.length > paging && isPc" class="txt--center MyPageCheckupDataRecord--btn">
          <button @click="more" type="button" class="btn--txt3">더보기</button>
        </div>
      </div>

      <div v-else class="CouponStatus--coupon-no">
        <div class="CouponStatus--coupon-no-img">
          <img src="/img/img_no_coupon.svg" alt="" />
        </div>
        <p class="CouponStatus--coupon-no-txt">보유중인 쿠폰이 없습니다</p>
        <p class="CouponStatus--coupon-no-txt2">암웨이 홈페이지(amway.co.kr)로 이동하여
          쿠폰을 구매 해주세요</p>
        <div class="CouponStatus--btn-wrap">
          <button type="button" class="CouponStatus--btn">암웨이 홈페이지 이동</button>
        </div>
      </div>

    </div>

  </section>

</template>

<style lang="scss">

</style>
