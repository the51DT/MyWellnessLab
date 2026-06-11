<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import * as api from '@/apis/coupon'
import { dateConvert } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'
import {format} from "date-fns";

const { t, locale } = useI18n()
const store = useStore()

const isLoading = ref(false)
const observerAnchor = ref()
const searchParam = ref({
  pageNo: 0,
  perPageNum: 500
})
const currentPage = ref(1)
const totalPage = ref(0)
const savedList = ref([])

/**
 * savedList 배열의 첫 번째 요소부터 현재 페이지 번호에 10을 곱한 인덱스까지의 요소들을 추출하여
 * 새로운 배열 list를 만드는 계산형 속성입니다.
 * 페이지네이션 구현
 * @type {ComputedRef<never[]>}
 */
const list = computed(() => {
  const endIndex = currentPage.value * 10

  return savedList.value.slice(0, endIndex)
})

// 쿠폰 종류 수
const totalCount = computed(() => {
  return savedList.value.length
})

// pc인지 판별
const isPc = computed(() => store.getters.getIsPc)

// 쿠폰이 있는지? 확인
const isEmptyCouponList = computed(() => {
  return list.value.length <= 0
})

const isShowMoreBtn = computed(() => {
  return currentPage.value < totalPage.value && isPc.value
})

const moveAmway = () => {
  window.location.href = import.meta.env.VITE_AMWAY_URL
}

/**
 * 서버로부터 쿠폰 리스트를 비동기적으로 가져옵니다.
 * 이 함수는 Promise를 반환하며, 프로세스가 에러없이 완료되면 void를 반환합니다.
 * 이 함수는 api.getCouponList를 호출하여 서버로부터 쿠폰리스트를 받아오고,
 * response.data에 저장된 값을 사용하여 쿠폰의 totalCount, totalPage, savedList 값을 설정합니다.
 * @returns {Promise<void>}
 */
const getCouponList = async () => {
  try {
    isLoading.value = true

    const response = await api.getCouponList(searchParam.value)

    // [todo] 테스트 데이터
    // const tempList = []
    // for(let i = 0; i < 500; i++) {
    //   tempList.push(...response.data.coupons)
    // }
    // totalPage.value = Math.ceil(tempList.length / 10)
    // savedList.value = tempList

    totalPage.value = Math.ceil(response.data.coupons.length / 10)
    savedList.value = response.data.coupons
  } catch (e) {
    console.error('e', e)
  } finally {
    isLoading.value = false
  }
}

const handleMore = () => {
  currentPage.value += 1
}

const getDateStr = (date) => {
  return format(new Date(dateConvert(date, '-')), 'yy.M.dd')
}

const getDateStr2 = (date) => {
  return format(new Date(dateConvert(date, '-')), 'M월 dd일')
}

onMounted(async () => {
  await getCouponList()

  // 페이징
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
  <section v-if="!isLoading" ref="container" class="CouponStatus">
    <!-- 2025.08.19 삭제 -->
    <!-- <div v-if="!isEmptyCouponList" class="CouponStatus--info-wrap">
      <p class="CouponStatus--info" v-html="$t('CouponList.text1')">
      </p>
    </div> -->

    <div v-if="!isEmptyCouponList" class="CouponStatus--total">{{ $t('CouponList.text3')}}
      <span class="CouponStatus--total-digit">{{ $t('CouponList.text4')}}
        <strong class="CouponStatus--t-digit">{{Number(totalCount).toLocaleString()}}</strong>{{ $t('CouponList.text5')}}
      </span>
    </div>

    <div class="CouponStatus--list">
      <div v-if="!isEmptyCouponList">
        <div v-for="(item, index) in list" :key="index" class="CouponStatus--list-for">
          <div class="align--between CouponStatus--coupon">
            <div class="CouponStatus--coupon-txt">
              <div class="CouponStatus--c-wrap">
                <!-- 개발 필요 : 구매 / 양수 / 프로모션 등 분류 표시 -->
                <span class="CouponStatus--coupon-type">{{ item.reason?.label || "프로모션" }}</span>

                <strong class="CouponStatus--coupon-tit">{{ item.name }}</strong>
                <strong v-if="item.creationTime" class="CouponStatus--coupon-tit">{{item.reason?.label == "구매" ? "주문일" : "양수일" }} : {{ getDateStr2(item.creationTime) }}</strong>
                <span class="CouponStatus--coupon-limit">{{ $t('CouponList.text6')}}
                  
                    <span class="CouponStatus--coupon-date">
                    {{ getDateStr(item.startDate) }} ~ {{ getDateStr(item.endDate) }}
                    </span>
                </span>

                <!-- 개발 필요 : 안내 문구 표시 -->
                <p class="CouponStatus--coupon-desc">{{ item.description }}</p>
              </div>
            </div>
            <div class="CouponStatus--coupon-quan">
              <span class="CouponStatus--coupon-quan-in">
                <span class="CouponStatus--coupon-quan-digit">{{Number(item.availableRedemptions).toLocaleString()}}<span class="CouponStatus--jang">{{ $t('CouponList.text7')}}</span></span>
              </span>
            </div>
          </div>
        </div>

        <div v-if="isShowMoreBtn" class="txt--center MyPageCheckupDataRecord--btn">
          <button type="button" class="btn--txt3" @click="handleMore">{{ $t('Common.more')}}</button>
        </div>
      </div>

      <div ref="observerAnchor" />

      <div v-if="isEmptyCouponList" class="CouponStatus--coupon-no">
        <div class="CouponStatus--coupon-no-img">
          <img src="/img/img_no_coupon.svg" alt="" />
        </div>

        <p class="CouponStatus--coupon-no-txt">{{ $t('CouponList.text9')}}</p>
        <p class="CouponStatus--coupon-no-txt2">{{ $t('CouponList.text10')}}</p>
        <div class="CouponStatus--btn-wrap">
          <button type="button" class="CouponStatus--btn" @click="moveAmway">{{ $t('CouponList.text11')}}</button>
        </div>
      </div>

    </div>
  </section>
</template>
