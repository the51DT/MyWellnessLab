<script setup>
import { onBeforeMount, onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import AnalyzeAgingSpeed from '@/views/analyze/components/analyzeAgingSpeed'
import { SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import * as couponApi from '@/apis/coupon'
import * as checkupApi from '@/apis/checkup'
import * as analysisApi from '@/apis/analysis'
import { useMoveStep } from '@/composables/checkup'
import { dateConvert } from '@/assets/js/common'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const store = useStore()
const router = useRouter()
const moveStep = useMoveStep()

const user = store.getters.getUser
const isLogin = store.getters.isLogin

const fabObserverAnchor = ref(null)
const activeFab = ref(false)
const isBottomFab = ref(false)
const myAnalysisCompleteList = ref([])
const modules = ref([Navigation, Pagination])
//const motivationMessage = ref('분석결과를 확인하고 생활습관을 건강하게 만들어보세요!')
const motivationMessage = ref(t('Home.text1'))

const isEmptyAnalysisComplete = computed(() => {
  return myAnalysisCompleteList.value.length > 0
})

const getColor = (status) => {
  switch (status) {
    case 1:
      return '#7ED47C'
    case 2:
      return '#F6AE5A'
    case 3:
      return '#F6747F'
    default:
      return ''
  }
}

const getAgingColor = (item) => {
  const statusAge = item.hqData.OXI_StatusAge
  return getColor(statusAge)
}

const getDiseaseColor = (item) => {
  const statusAge = item.hqData.MET_StatusAge
  return getColor(statusAge)
}

const hasCoupon = async () => {
  const params = {
    pageNo: 0,
    perPageNum: 500
  }

  const response = await couponApi.getCouponList(params)

  return response.data.coupons && response.data.coupons.length > 0
}

const deleteCheckup = async (id) => {
  await checkupApi.deleteCheckup(id)
}

const openPopNoCoupon = ref(false) /* 240118 쿠폰을 사야한다는 팝업 오프너 */
const openPopContinue = ref(false) /* 240119 기존에 하다 말았던 설문을 이어받아서 하겠냐는 팝업 오프너 */
const isContinue = ref(null) /* 240118 하다 말았던 설문을 이어하려면 true, 새로 하려면 false */

const confirmContinue = () => { /* 240119 설문을 이어갈지 말지 판단하는 함수 */
  openPopContinue.value = true

  return new Promise((resolve) => {
    watch(isContinue, (newVal) => {
      newVal ? resolve(true) : resolve(false)
    })
  })
}

const getNhisInfo = async (id) => {
  try {
    const response = await checkupApi.getNhisInfo(id)

    return response.data?.value
  } catch (e) {
    console.error(e)
  }
}

const moveCheckUpPage = async () => {
  try {
    if (!await hasCoupon()) {
      openPopNoCoupon.value = true
      return
    }

    const checkupCommonInfo = await getCommonInfo('normal')

    if (checkupCommonInfo) {
      if (await confirmContinue()) {
        const nhisInfo = await getNhisInfo(checkupCommonInfo.id)

        if (nhisInfo) {
          const data = {
            checkDate: dateConvert(nhisInfo.resCheckupYear.concat(nhisInfo.resCheckupDate), '.'),
            ht: nhisInfo.resHeight,
            wt: nhisInfo.resWeight,
            wc: nhisInfo.resWaist,
            bmi: nhisInfo.resBMI,
            sbp: nhisInfo.resBloodPressure.split('/')[0],
            dbp: nhisInfo.resBloodPressure.split('/')[1],
            glu: nhisInfo.resFastingBloodSuger,
            tc: nhisInfo.resTotalCholesterol,
            ldl: nhisInfo.resLDLCholesterol,
            hdl: nhisInfo.resHDLCholesterol,
            tg: nhisInfo.resTriglyceride,
            got: nhisInfo.resAST,
            gpt: nhisInfo.resALT,
            crea: nhisInfo.resSerumCreatinine,
            hb: nhisInfo.resHemoglobin
          }

          store.dispatch('checkup/setNhisData', data)
          store.dispatch('checkup/setHealthDataType', 'formal')
        } else {
          store.dispatch('checkup/setHealthDataType', 'direct')
        }
        store.dispatch('checkup/setBasicsId', checkupCommonInfo.basicsId)

        moveStep(checkupCommonInfo)
      } else {
        await deleteCheckup(checkupCommonInfo.id)
        router.push({ name: 'CheckupSideSelect' })
      }
    } else {
      router.push({ name: 'CheckupSideSelect' })
    }
  } catch (e) {
    console.error(e)
  }
}

const openPopOneTime = ref(false) /* 240119 일회성을 하겠냐?는 팝업 오프너 */
const isOneTime = ref(false) /* 240119 일회성을 할거면 true, 안할거면 false */

const confirmOneTime = () => { /* 240119 일회성할지 말지 판단하는 함수 */
  openPopOneTime.value = true
  return new Promise((resolve) => {
    watch(isOneTime, (newVal) => {
      if (newVal) {
        resolve(true)
      }
    })
  })
}

const moveOneTimeAnalysis = async () => {
  if (!await hasCoupon()) {
    // alert('사용가능한 마이웰니스 랩 쿠폰이 없어\n건강분석을 시작할 수 없습니다')
    openPopNoCoupon.value = true
    return
  }

  if (await confirmOneTime()) {
    store.dispatch('checkup/setAnalysisType', 'onetime')
    store.dispatch('checkup/setHealthDataType', 'direct')

    router.push({ name: 'CheckupSideTerms' })
  }
  return false
}

const moveDetailPage = (id) => {
  router.push({ path: '/analyze/detail' })
  store.dispatch('checkup/setAnalysisType', 'normal')
  store.dispatch('checkup/setResultId', id)
}

const getCommonInfo = async (analysisType) => {
  try {
    const response = await checkupApi.getCommonInfo(analysisType)

    return response.data?.commonInfo
  } catch (e) {
    console.error(e)
  }
}

const getMyAnalysisCompleteDetail = async () => {
  try {
    const response = await analysisApi.getMyAnalysisCompleteDetail()

    const data = response.data?.logmeCompleteAnalysisMySimple || []

    if (data && data.length > 0) {
      myAnalysisCompleteList.value = data.map((item) => {
        return {
          ...item,
          hcrReference: [],
          hqData: {
            ...item.hqData,
            OXI: Math.round(item.hqData.OXI),
            MET: Math.round(item.hqData.MET),
            AgingRate: item.hqData.AgingRate.toFixed(2)
          }
        }
      })

      // 현재 일자
      const today = new Date()
      // 첫 번째 분석 일자
      const aDate = new Date(dateConvert(myAnalysisCompleteList.value[0].analysedDate, '-'))
      // 분석일에서 6개월 더한 일자
      const addSixMonth = new Date(new Date(aDate).setMonth(aDate.getMonth() + 6))
      // 분석일에서 12개월 더한 일자
      const addOneYear = new Date(new Date(aDate).setMonth(aDate.getMonth() + 12))

      if (today >= addSixMonth && today < addOneYear) {
        // 6개월 경과시
        motivationMessage.value = ref(t('Home.text2'))//'건강한 생활습관을 꾸준히 관리해주세요'
      } else if (today >= addOneYear) {
        // 12개월 경과시
         motivationMessage.value = ref(t('Home.text3')) //'새로운 웰니스 분석을 통해 변화되는 결과를 확인해보세요'
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const handleNewCheckup = () => {
  isContinue.value = false
  openPopContinue.value = false
}

const handleContinuCheckup = () => {
  isContinue.value = true
  openPopContinue.value = false
}

const initAnalysisData = () => {
  store.dispatch('checkup/init')
  store.dispatch('checkup/setAnalysisType', '')
  store.dispatch('checkup/setCheckDate', '')
}

onBeforeMount(async () => {
  try {
    initAnalysisData()

    await getMyAnalysisCompleteDetail()
  } catch (e) {
    console.error(e)
  }
})

onMounted(() => {
  const observer = new IntersectionObserver(async ([entrie]) => {
    activeFab.value = entrie.isIntersecting
    isBottomFab.value = entrie.intersectionRatio === 1
  }, {
    rootMargin: '0px 0px -100px 0px',
    threshold: [0.2, 1]
  })

  observer.observe(fabObserverAnchor.value)
})
</script>

<template>
  <section class="home">
    <p v-if="isLogin" class="home--hi" v-html="$t('Home.text4', { name: user.name })">
    </p>

    <div class="home--msg" :class="isEmptyAnalysisComplete ? 'login-after' : ''">
      <div class="home--balloon">
        <span v-if="!isEmptyAnalysisComplete">{{ $t('Home.text5') }} </span>
        <span v-else class="home--greeting">{{motivationMessage}}
          <span class="home--doctor-s" />
        </span>
      </div>
    </div>

    <div class="home--start-wrap">
      <div class="home--my-result">
        <h2 v-if="isEmptyAnalysisComplete" class="home--my-result--tit">{{ $t('Home.text6') }} </h2>
        <swiper
          :centered-slides="true"
          :space-between="8"
          :pagination="{
            clickable: true
          }"
          :navigation="true"
          :breakpoints="{
            '0': {
              slidesPerView: 1.2,
            },
            '700': {
              slidesPerView: 2,
            },
            '1000': {
              slidesPerView: 3,
            },
          }"
          :modules="modules"
          class="pay-method--swiper">
          <swiper-slide v-for="(item, index) in myAnalysisCompleteList" :key="index">
            <div class="home-swiper">
              <p class="home--date">{{ $t('Home.text7') }} : {{ item.analysedDate.substring(0, 10) }}</p>
              <button @click="moveDetailPage(item.id)" type="button" class="home--view-result">{{ $t('Common.detail') }}</button>
              <div class="home--aging">
                <h3 class="home--aging-tit">{{ $t('Home.text9') }} </h3>
                <div>
                  <AnalyzeAgingSpeed :id="`g_` + item.id" :isMain="true" :sendData="item" />
                </div>
              </div>
              <div class="home--index">

                <div>
                  <h4 class="home--index-tit">{{ $t('Home.text10') }} <br />{{ $t('Home.text12') }} </h4>
                  <div class="home--index-digit">
                    <strong :style="{color: getDiseaseColor(item)}">{{ item.hqData.MET }}</strong>{{ $t('Common.score') }} 
                  </div>
                </div>

                <div>
                  <h4 class="home--index-tit">{{ $t('Home.text11') }}<br />{{ $t('Home.text12') }}</h4>
                  <div class="home--index-digit">
                    <strong :style="{color: getAgingColor(item)}">{{ item.hqData.OXI }}</strong>{{ $t('Common.score') }}
                  </div>
                </div>

              </div>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div
              class="home-swiper blank"
              :class="myAnalysisCompleteList.length === 0 ? 'small' : ''">
              <a @click="moveCheckUpPage" href="javascript:void(0)" class="home--start">
                <p class="home--txt">
                  <span v-if="myAnalysisCompleteList.length > 0">{{ $t('Home.text13') }}</span>
                  <span v-else>{{ $t('Home.text13') }}</span>
                </p>
                <p class="home--tit">
                  <span>{{ $t('Home.text14') }}<br />
                    <!--                    <span v-if="myAnalysisCompleteList.length > 0">다시</span>-->
                    <!--                    <span v-else>시작</span>-->
                    {{ $t('Home.text16') }}
                  </span>
                </p>
              </a>
              <div class="home--doctor" /> <!--의사 이미지-->
              <div class="home--plus" />
            </div>
          </swiper-slide>
        </swiper>
      </div>

    </div>

    <div class="home--instant">
      <a href="javascript:void(0)" @click="moveOneTimeAnalysis" class="home--instant-btn">{{ $t('Home.text17') }}</a>
    </div>

    <div ref="fabObserverAnchor" class="home--visual">
      <img src="/img/img_home.png?231213" alt="" />
    </div> <!--비주얼 이미지-->

    <div class="btn--re-checkup" :class="[activeFab ? 'active' : '', isBottomFab ? 'bottom' : '']" @click="moveCheckUpPage">
      <span>{{ $t('Home.text14') }}<br />{{ $t('Home.text16') }}</span>
    </div>

    <base-popup v-if="openPopNoCoupon" class="openPopContinue">
      <template v-slot:contents>
        <p>{{ $t('Home.text18') }}</p>
        <p class="color--gray space--top-small">※ {{ $t('Home.text19') }}</p>
        <div class="txt--center">
          <button @click="openPopNoCoupon = false" class="btn-pop--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="openPopContinue" class="openPopContinue">
      <template v-slot:contents>
        <p>{{ $t('Home.text25') }}</p>
        <p>{{ $t('Home.text26') }}</p>
        <div class="txt--center">
          <button @click="handleNewCheckup" class="btn-pop--gray" type="button">{{ $t('Home.text20') }}</button>
          <button @click="handleContinuCheckup" class="btn-pop--green" type="button">{{ $t('Home.text21') }}</button>
        </div>
        <div class="openPopContinue--close">
          <button
            @click="openPopContinue = false"
            type="button"
            aria-label="닫기"
            class="popup--close" />
        </div>
      </template>
    </base-popup>

    <base-popup v-if="openPopOneTime" class="openPopContinue">
      <template v-slot:contents>
        <p>{{ $t('Home.text23') }}</p>
        <p>{{ $t('Home.text24') }}</p>
        <div class="txt--center">
          <button @click="[openPopOneTime = false]" class="btn-pop--gray" type="button">{{ $t('Common.cancle') }}</button>
          <button @click="[isOneTime = true, openPopOneTime = false]" class="btn-pop--green" type="button">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>
  </section>
</template>

<style lang="scss" scoped>
:deep(.swiper-button-next){
  top: var(--swiper-navigation-top-offset, 44%);
  @media (max-width: 1000px) {
    display: none;
  }
}
:deep(.swiper-button-prev) {
  @media (max-width: 1000px) {
    display: none;
  }
}
:deep(.swiper-button-next:after, .swiper-rtl .swiper-button-prev:after){
  content: "";
  display: block;
  width: 40px;
  height: 40px;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 60%;
}
:deep(.swiper-button-prev, .swiper-button-next){
  top: var(--swiper-navigation-top-offset, 44%);
}
:deep(.swiper-button-next, .swiper-rtl .swiper-button-prev) {
  right: auto;
  left: 50%;
  margin-left: 17%;
}
:deep(.swiper-button-prev, .swiper-rtl .swiper-button-next) {
  left: auto;
  right: 50%;
  margin-right: 18.7%;
}
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  content: "";
  display: block;
  width: 40px;
  height: 40px;
  background: url("/img/home_slide.svg") no-repeat center;
  background-size: 60%;
  transform: rotate(180deg);
}
:deep(.swiper-button-prev.swiper-button-disabled){
  display: none;
}
:deep(.swiper-button-next.swiper-button-disabled){
  display: none;
}
</style>
