<script>

import BasePopup from '../BasePopup.vue'
import router from '@/router'

export default {
  name: 'CheckupComplete',
  components: {
    BasePopup
  },
  data () {
    return {
      coupon: [ /* 소지한 쿠폰 */
        {
          title: '마이웰니스 랩 건강 분석 쿠폰',
          value: 0,
          limit: '~ 2023.09.12',
          quantity: 8
        },
        {
          title: '마이웰니스 랩 건강 분석 2023 프로모션 쿠폰',
          value: 1,
          limit: '~ 2023.12.31',
          quantity: 2
        },
        {
          title: '마이웰니스 랩 건강 분석 2024 프로모션 쿠폰',
          value: 2,
          limit: '~ 2024.12.31',
          quantity: 4
        }
      ],
      selectedCoupon: '', /* 선택된 쿠폰 */
      isDirect: true, /* 직접입력일 경우 */
      popupExit: false, /* 나가기 클릭 시 나오는 팝업 오프너 */
      isPopLoad: false /* 240125 분석결과보기 버튼 클릭 후 분석 중이라는 스피너 오프너 */
    }
  },
  methods: {
    exit () {
      // 홈으로 이동 처리 요망
    },
    showAnalyze () {
      if (1 /* 전송및 수신 실패시, 조건 수정 요망 */) {
        alert('웰니스 분석에 실패하였습니다.\n잠시 후 다시 이용해주세요.')
      } else if (0 /* 쿠폰 사용불가 시, 조건 수정 요망 */) {
        alert('해당 쿠폰을 사용할 수 없습니다.')
      } else {
        this.isPopLoad = true
        setTimeout(() => {
          router.push({
            name: 'AnalyzeDetail'
          })
        }, 3000)
      }
    }
  }
}
</script>

<template>
  <div>
    <section class="CheckupComplete">

      <div class="CheckupComplete--info-wrap">
        <p class="CheckupComplete--info">
          건강설문이 완료되었어요
        </p>
        <p class="CheckupComplete--info-desc txt--desc">
          보유 중인 웰니스 분석권을 선택하여
          웰니스 분석 결과를 확인해주세요
        </p>
      </div>

      <div class="CheckupComplete--total txt--desc3">사용 가능 쿠폰:
        <strong class="CheckupComplete--t-digit">총 {{ coupon.length }}개</strong>
      </div>

      <div class="CheckupComplete--list">

        <div
          v-if="coupon.length"
          v-for="(item, index) in coupon"
          :key="index"
          class="CheckupComplete--list-for"
          :class="selectedCoupon === index ? 'active' : ''">
          <label
            :for="'cc' + index"
            class="align--between CheckupComplete--coupon"
            :class="selectedCoupon === index ? 'active' : ''">
            <span class="CheckupComplete--coupon-radio-wrap">
              <span class="CheckupComplete--coupon--radio">
                <input
                  v-model="selectedCoupon"
                  :value="item.value"
                  type="radio"
                  name="cc"
                  :id="'cc' + index"
                  class="CheckupComplete--coupon-radio" />
                <span class="radio--icon" />
              </span>
            </span>
            <span class="CheckupComplete--coupon-txt">
              <span>
                <strong class="CheckupComplete--coupon-tit">{{ item.title }}</strong>
                <span class="CheckupComplete--coupon-limit">사용 기한 :
                  <span class="CheckupComplete--coupon-date">{{ item.limit }}</span>
                </span>
              </span>
            </span>
            <span class="CheckupComplete--coupon-quan">
              <span class="CheckupComplete--coupon-quan-digit">{{ item.quantity }}<span class="txt--green">장</span>
              </span>
            </span>
          </label>
        </div>

        <div v-else class="CheckupComplete--coupon-no">
          <p class="CheckupComplete--coupon-no-txt">지금은 사용 가능 쿠폰이 없어, 건강분석 결과를 확인할 수 없습니다</p>
        </div>

      </div>

    </section>
    <div class="btn--bottom CheckupComplete--btn-div">
      <div class="CheckupComplete--btn-wrap">
        <button
          v-if="!isDirect"
          @click="exit"
          type="button"
          class="CheckupComplete--finish-btn">다음에 결과 보기</button>
        <button
          v-else
          @click="popupExit = true"
          type="button"
          class="CheckupComplete--finish-btn">나가기</button>
        <button
          @click="showAnalyze"
          :disabled="!coupon.length"
          type="button"
          class="CheckupComplete--btn">분석
          결과 보기</button>
      </div>
    </div>

    <base-popup v-if="popupExit" class="CheckupComplete--exit">
      <template v-slot:contents>
        <p class="CheckupComplete--exit-txt">현재 화면에서 나갈 경우
          진행중인 건강설문이 삭제됩니다</p>
        <p class="CheckupComplete--exit-desc">그래도 나가시겠습니까?</p>
        <div class="align--between CheckupComplete--exit-btn">
          <div class="CheckupComplete--exit-btn-wrap">
            <button type="button" class="CheckupComplete--exit-cancel">취소</button>
          </div>
          <div class="CheckupComplete--exit-btn-wrap-right">
            <button type="button" class="CheckupComplete--exit-exit">나가기</button>
          </div>
        </div>
      </template>
    </base-popup>

    <!--    240123 기획서 75페이지 개발 필요, v-if 값 수정바랍니다-->
    <base-popup v-if="isPopLoad" class="openPopContinue">
      <template v-slot:contents>
        <p>지금 분석 중입니다</p>
        <p class="color--gray space--top-small">잠시만 기다려 주세요</p>
        <div class="text-center">
          <div class="lds-ellipsis"><div /><div /><div /><div /></div>
        </div>
      </template>
    </base-popup>

  </div>
</template>

<style lang="scss" scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
  background-color: #7ED47C;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6746F;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6AE5A;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
  background-color: #7ED47C;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
