<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import * as couponApi from '@/apis/coupon'
import * as checkupApi from '@/apis/checkup'
import * as logmeApi from '@/apis/logme'

import { format } from 'date-fns'
import { dateConvert } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const router = useRouter()

const analysisType = store.getters['checkup/getAnalysisType']

const commonInfo = ref(null)
const couponList = ref([])
const selectedCoupon = ref(null)
const isDataLoading = ref(true) // 데이터 로딩 상태 추가

const popupExit = ref(false)
const isPc = computed(() => store.getters.getIsPc)
const currentPage = ref(1)
const totalPage = ref(0)
const observerAnchor = ref()
const listItemCount = ref(10)

const isOneTime = computed(() => {
  return analysisType === 'onetime'
})

const totalCouponCount = computed(() => {
  return couponList.value.length
})

const isEmptyCouponList = computed(() => {
  return list.value.length <= 0
})

const isShowMoreBtn = computed(() => {
  return currentPage.value < totalPage.value && isPc.value
})

const list = computed(() => {
  const endIndex = currentPage.value * listItemCount.value

  return couponList.value.slice(0, endIndex)
})

const isSubmitDisabled = computed(() => {
  return !couponList.value.length || !selectedCoupon.value || isPopLoad.value || isBodyCompositionInfoPopup.value || isConfirmAnalysisPopup.value
})

const exit = () => { // go Home
  // router.push('/dev-home');
  // 일회성인 경우  popupExit true
  // 이외 공통정보 저장
  router.push('/')
}

const isPopLoad = ref(false) /* 240125 분석결과보기 버튼 클릭 후 분석 중이라는 스피너 오프너 */
// const isErrorPopup = ref(false) /* 웰니스 분석 실패 시 에러 팝업 */
const isBodyCompositionInfoPopup = ref(false) /* 체성분 데이터 없을 때 안내 팝업 */
const isConfirmAnalysisPopup = ref(false) /* 분석 결과 확인 팝업 */

const getCouponList = async () => {
  try {
    const params = {
      pageNo: 0,
      perPageNum: 1000
    }

    const response = await couponApi.getCouponList(params)

    couponList.value = response.data.coupons
    totalPage.value = Math.ceil(response.data.coupons.length / listItemCount.value)
  } catch (e) {
    console.error(e)
  }
}

const getCommonInfo = async () => {
  const response = await checkupApi.getCommonInfo(analysisType)

  commonInfo.value = response.data.commonInfo
}

const getDateStr = (date) => {
  return format(new Date(dateConvert(date, '-')), 'yy.M.dd')
}

const getDateStr2 = (date) => {
  return format(new Date(dateConvert(date, '-')), 'M월 dd일')
}

// 체성분 데이터 유무 확인
const checkBodyCompositionData = async () => {
  try {
    const basicsId = commonInfo.value.basicsId
    if (!basicsId) {
      console.warn('basicsId가 없습니다')
      return false
    }
    
    const response = await checkupApi.getInbodyDone(basicsId)
    // 체성분 데이터가 있으면 true, 없으면 false 반환
    return response && response.data.inbody
  } catch (e) {
    console.error('체성분 데이터 조회 실패:', e)
    // 에러 발생 시 체성분 데이터가 없는 것으로 간주
    return false
  }
}

const handleSubmit = async () => {
  // 먼저 확인 팝업을 표시
  isConfirmAnalysisPopup.value = true
}

// 분석 결과 확인 팝업에서 확인 버튼 클릭 시 실행되는 함수
const confirmAnalysis = async () => {
  try {
    // 확인 팝업 닫기
    isConfirmAnalysisPopup.value = false
    
    const commonId = commonInfo.value.id
    const params = {
      couponCode: selectedCoupon.value.couponCode,
      couponId: selectedCoupon.value.couponId,
      description: selectedCoupon.value.description
    }
    isPopLoad.value = true

    const timePromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },
      3000)
    })

    const resPromise = logmeApi.setCheckup(commonId, params)
    const [_, res] = await Promise.all([timePromise, resPromise])
    const id = res.data.logmeCompleteAnalysisDetail.id

    store.dispatch('checkup/init')
    store.dispatch('checkup/setResultId', id)
    
    // 체성분 데이터 확인
    const hasBodyCompositionData = await checkBodyCompositionData()
    if (!hasBodyCompositionData && !isOneTime.value) {
      // 체성분 데이터가 없고 일회성이 아닌 경우에만 안내 팝업 표시
      isBodyCompositionInfoPopup.value = true
    } else {
      // 체성분 데이터가 있거나 일회성인 경우 바로 분석 결과 페이지로 이동
      await router.push({ name: 'AnalyzeDetail' })
    }
  } catch (e) {
    console.error('웰니스 분석 제출 실패:', e)
  } finally {
    isPopLoad.value = false
  }
}

// 분석 결과 확인 팝업에서 취소 버튼 클릭 시 실행되는 함수
const cancelAnalysis = () => {
  isConfirmAnalysisPopup.value = false
}

const handleMore = () => {
  currentPage.value += 1
}

// 체성분 안내 팝업에서 확인 버튼 클릭 시
const handleBodyCompositionInfoConfirm = async () => {
  // 라우팅 먼저 실행하고 성공하면 팝업 닫기
  await router.push({ name: 'AnalyzeDetail' })
  isBodyCompositionInfoPopup.value = false
}

onBeforeMount(async () => {
  try {
    isDataLoading.value = true // 로딩 시작
    await getCouponList()
    await getCommonInfo()
  } catch (e) {
    console.error(e)
  } finally {
    isDataLoading.value = false // 로딩 완료
  }

  // 스크롤 페이징 적용
  const observer = new IntersectionObserver(async ([entrie]) => {
    if (entrie.isIntersecting) {
      if (currentPage.value >= totalPage.value) {
        return
      }

      handleMore()
    }
  }, { threshold: 0.7 })

  if (!isPc.value) {
    observer.observe(observerAnchor.value)
  }
})
</script>

<template>
  <div class="CheckupComplete-wrap">
    <!-- 데이터 로딩이 완료된 후에만 실제 콘텐츠 표시 -->
    <template v-if="!isDataLoading">
      <section class="CheckupComplete">

        <div class="CheckupComplete--info-wrap">
          <p class="CheckupComplete--info">
            {{ $t('CheckupComplete.text1')}}
          </p>
          <p class="CheckupComplete--info-desc txt--desc">
            {{ $t('CheckupComplete.text2')}}
          </p>
        </div>

        <div class="CheckupComplete--total txt--desc3">{{ $t('CheckupComplete.text3')}}
          <strong class="CheckupComplete--t-digit">{{ $t('CheckupComplete.text4')}} {{ totalCouponCount }}{{ $t('CheckupComplete.text5')}}</strong>
        </div>

      <div class="CheckupComplete--list">
        <template v-if="!isEmptyCouponList">
          <div
            v-for="(item, index) in list"
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
                    :value="item"
                    type="radio"
                    name="cc"
                    :id="'cc' + index"
                    class="CheckupComplete--coupon-radio" />
                  <span class="radio--icon" />
                </span>
              </span>
              <span class="CheckupComplete--coupon-txt">
                <span>
                  <!-- 개발 필요 : 구매 / 양수 / 프로모션 등 분류 표시 -->
                  <span class="CouponStatus--coupon-type">{{ item.reason?.label || "프로모션" }}</span>

                  <strong class="CouponStatus--coupon-tit">{{ item.name }}</strong>
                  <strong v-if="item.creationTime" class="CouponStatus--coupon-tit">{{item.reason?.label == "구매" ? "주문일" : "양수일" }} : {{ getDateStr2(item.creationTime) }}</strong>
                  <span class="CouponStatus--coupon-limit">{{ $t('CouponList.text6')}}
                    <!-- 개발 필요 : 25. 1. 1 ~ 25. 1. 10 형식으로 표시 -->
                    <span class="CouponStatus--coupon-date">
                    {{ getDateStr(item.startDate) }} ~ {{ getDateStr(item.endDate) }}
                    </span>
                  </span>
                  <!-- 개발 필요 : 안내 문구 표시 -->
                  <p class="CouponStatus--coupon-desc">{{ item.description }}</p>
                </span>
              </span>
              <span class="CheckupComplete--coupon-quan">
                <span class="CheckupComplete--coupon-quan-digit">{{ item.availableRedemptions }}<span
                  class="txt--green">{{ $t('CheckupComplete.text7')}}</span>
                </span>
              </span>
            </label>
          </div>
          <div v-if="isShowMoreBtn" class="txt--center MyPageCheckupDataRecord--btn">
            <button type="button" class="btn--txt3" @click="handleMore">{{ $t('Common.more')}}</button>
          </div>
        </template>

        <div ref="observerAnchor" />

        <div v-if="isEmptyCouponList" class="CheckupComplete--coupon-no">
          <p class="CheckupComplete--coupon-no-txt" v-html="$t('CheckupComplete.text9')"></p>
        </div>
        </div>

      </section>

      <div class="BodyCompositionPop-btn Checkup--btn-wrap scroll-btn-wrap">
        <div v-if="isOneTime" class="btn--bottom btn--bottom-line">
          <button
            @click="popupExit = true"
            type="button">{{ $t('CheckupComplete.text10')}}</button>
        </div>
        <div v-else class="btn--bottom btn--bottom-line">
          <button
            @click="exit"
            type="button">{{ $t('CheckupComplete.text11')}}</button>
        </div>
        <div class="btn--bottom">
          <button
            @click="handleSubmit"
            :disabled="isSubmitDisabled"
            type="button">{{ $t('CheckupComplete.text12')}}</button>
        </div>
      </div>
    </template>

    <base-popup v-if="popupExit" class="CheckupComplete--exit">
      <template v-slot:contents>
        <p class="pop-text-light" v-html="$t('CheckupComplete.text13')">
        </p>
        <p class="pop-text-bold">{{ $t('CheckupComplete.text14')}}</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="popupExit = false" class="pop-btn pop-btn--gray">{{ $t('Common.cancle')}}</button>
          <button type="button" @click="router.push('/')" class="pop-btn pop-btn--green">{{ $t('CheckupComplete.text16')}}</button>
        </div>
      </template>
    </base-popup>

    <!--    240123 기획서 75페이지 개발 필요, v-if 값 수정바랍니다-->
    <base-popup v-if="isPopLoad" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('CheckupComplete.text17')}}</p>
        <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
        <div class="text-center">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </base-popup>

    <!-- 웰니스 분석 실패 에러 팝업 -->
<!--    <base-popup v-if="isErrorPopup" class="CheckupComplete&#45;&#45;error">-->
<!--      <template v-slot:contents>-->
<!--        <p class="pop-text-bold">{{ $t('CheckupComplete.text20')}}</p>-->
<!--        <p class="pop-text-light">{{ $t('CheckupComplete.text21')}}</p>-->
<!--        <div class="pop-btn-wrap">-->
<!--          <button type="button" @click="isErrorPopup = false" class="pop-btn pop-btn&#45;&#45;green">{{ $t('Common.confirm')}}</button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </base-popup>-->

    <!-- 분석 결과 확인 팝업 -->
    <base-popup v-if="isConfirmAnalysisPopup" class="CheckupComplete--confirm-analysis">
      <template v-slot:contents>
        <p class="pop-text-light">{{ $t('CheckupComplete.text23')}}</p>
        <p class="pop-text-bold">{{ $t('CheckupComplete.text24')}}</p>
        <p v-if="!isOneTime" class="pop-text-light red">{{ $t('CheckupComplete.text25')}}</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="cancelAnalysis" class="pop-btn pop-btn--gray">{{ $t('Common.cancle') }}</button>
          <button type="button" @click="confirmAnalysis" class="pop-btn pop-btn--green">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <!-- 체성분 데이터 안내 팝업 -->
    <base-popup v-if="isBodyCompositionInfoPopup" class="CheckupComplete--body-info">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('CheckupComplete.text22')}}</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="handleBodyCompositionInfoConfirm" class="pop-btn pop-btn--green">{{ $t('Common.confirm')}}</button>
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
