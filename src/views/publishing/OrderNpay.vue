<script setup>
import { ref } from 'vue'
import { Navigation, Pagination } from 'swiper/modules'
import OrderNpayHeader from '@/views/publishing/orderNpay/OrderNpayHeader.vue'
import PopupDeliverySelect from '@/views/publishing/orderNpay/OrderNpayDeliveryPopup.vue'
import BaseTooltip from '@/views/publishing/orderNpay/BaseTooltipOrderNpay.vue'
import OrderNpayAmountTermsPopup from '@/views/publishing/orderNpay/OrderNpayAmountTermsPopup.vue'
import OrderNpayAmountTermsPopup3 from '@/views/publishing/orderNpay/OrderNpayAmountTermsPopup3.vue'
import OrderNpayAmountTermsPopup4 from '@/views/publishing/orderNpay/OrderNpayAmountTermsPopup4.vue'
import OrderNpayAmountTermsPopup2 from '@/views/publishing/orderNpay/OrderNpayAmountTermsPopup2.vue'
import PopupCashReceipt from '@/views/publishing/orderNpay/OrderNpayCashReceiptPopup.vue'
import router from '@/router'

const payMethod = ref('') /* 결제 방식 선택 변수 apayAuto: apay자동이체, apayCard: apay카드, basicAuto: 일반 자동이체, basicCard: 일반 카드 */
const popupDeliverySelect = ref(false) /* 팝업 열고 닫기 */
const toggleOrderProducts = ref(true)
const productDatas = ref(
  {
    name: '리포트 출력',
    imgUrl: 'https://mpn.dev.amway.co.kr/static/images/thumbs/missing.jpg',
    quantity: 1,
    price: 22000
  }
)
const togglePayAmount = ref(true) /* 결제금액 내역 토글 */
const tooltipPrice = ref(false) /* 결제금액 툴팁 토글 */
const checkboxOrderProductName = ref(null) /* 제품정보 동의 */
const checkboxPersonalInfoReceive = ref(null) /* 개인정보 동의 */
const checkboxTossPersonalInfo = ref(null) /* 개인정보 동의 */
const checkboxTossElecTransfer = ref(null) /* 개인정보 동의 */
const checkboxTossThirdInfo = ref(null) /* 개인정보 동의 */
const toggleTermsAgree = ref(false) /* 결제 동의 토글 */
const checkboxOrderConfirmAgree = ref(null) /* 주문 및 결제 동의 */
const popupPerInfCorUseAgr = ref(false) /* 개인정보 수집 및 이용에 대한 동의 팝업 토글 */
const popupTossPersonalInfo = ref(false) /* TOSS 개인정보 수집 이용 동의 팝업 토글 */
const popupTossElecTransfer = ref(false) /* 전자금융거래 기본약관(이용자용) 팝업 토글 */
const popupTossThirdInfo = ref(false) /* 개인정보 제3자 제공 동의 팝업 토글 */
const tooltipInsuInfo = ref(false) /* 소비자피해보상보험 가입 안내 보기 툴팁 토글 */
const togglePayMethod = ref(true) /* 결제수단 토글 */
const tooltipSimplePay = ref(false)
const tooltipPayUserSelect = ref(false)
const payUserDatas = ref([
  {
    name: '홍길동',
    autoInfo: [ /* 임시 데이터임 수정 필요 to 개발 */
      {
        name: '농협은행',
        bankCode: 'b01',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '우리은행',
        bankCode: 'b02',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '신한은행',
        bankCode: 'b03',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: 'KB국민은행',
        bankCode: 'b04',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '하나은행',
        bankCode: 'b05',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '씨티은행',
        bankCode: 'b06',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '전북은행',
        bankCode: 'b07',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '산업은행',
        bankCode: 'b08',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '새마을금고',
        bankCode: 'b09',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '수협',
        bankCode: 'b10',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '신협',
        bankCode: 'b11',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '우체국',
        bankCode: 'b12',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '케이뱅크',
        bankCode: 'b13',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '카카오뱅크',
        bankCode: 'b14',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '저축은행',
        bankCode: 'b15',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '부산은행',
        bankCode: 'b16',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '기업은행',
        bankCode: 'b17',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: 'SC제일은행',
        bankCode: 'b18',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '대구은행',
        bankCode: 'b19',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '산림조합',
        bankCode: 'b20',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '토스뱅크',
        bankCode: 'b21',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      }
    ],
    cardInfo: [
      {
        name: 'NH채움카드',
        bankCode: 'c01',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '우리카드',
        bankCode: 'c02',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '신한카드',
        bankCode: 'c03',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: 'KB국민카드',
        bankCode: 'c04',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '하나카드',
        bankCode: 'c05',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '씨티카드',
        bankCode: 'c06',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '전북 & 광주카드',
        bankCode: 'c07',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: 'MG새마을??',
        bankCode: 'c09',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '수협카드',
        bankCode: 'c10',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '신협카드',
        bankCode: 'c11',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: 'BC카드',
        bankCode: 'c22',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '현대카드',
        bankCode: 'c23',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '롯데카드',
        bankCode: 'c24',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      },
      {
        name: '삼성카드',
        bankCode: 'c25',
        engName: 'BYEONG HEON LEE',
        number: '110234567890'
      }
    ]
  },
  {
    name: '이순신',
    autoInfo: [ /* 임시 데이터임 수정 필요 to 개발 */
      {
        name: '농협은행',
        bankCode: 'b01',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '우리은행',
        bankCode: 'b02',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '신한은행',
        bankCode: 'b03',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: 'KB국민은행',
        bankCode: 'b04',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '하나은행',
        bankCode: 'b05',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '씨티은행',
        bankCode: 'b06',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '전북은행',
        bankCode: 'b07',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '산업은행',
        bankCode: 'b08',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '새마을금고',
        bankCode: 'b09',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '수협',
        bankCode: 'b10',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '신협',
        bankCode: 'b11',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '우체국',
        bankCode: 'b12',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '케이뱅크',
        bankCode: 'b13',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '카카오뱅크',
        bankCode: 'b14',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '저축은행',
        bankCode: 'b15',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '부산은행',
        bankCode: 'b16',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '기업은행',
        bankCode: 'b17',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: 'SC제일은행',
        bankCode: 'b18',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '대구은행',
        bankCode: 'b19',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '산림조합',
        bankCode: 'b20',
        engName: 'BYEONG HEON',
        number: '110234567890'
      },
      {
        name: '토스뱅크',
        bankCode: 'b21',
        engName: 'BYEONG HEON',
        number: '110234567890'
      }
    ],
    cardInfo: [
    ]
  }
])
const userSelect = ref(0) /* 사업자 선택 */
const modules = [Navigation, Pagination]
const toggleAutoTransferInfo = ref(false) /* 자동이체 설명 토글 */
const popupCashReceipt = ref(false)
const toggleReturnAgree = ref(false) /* 반품 불가 동의서 */
const checkReturn = ref(false) /* 반품 불가 동의 여부 */
const refCheckReturn = ref(null) /* 반품 불가 동의 체크박스 */

function payMethodFunc (val) {
  payMethod.value = val
}
function closePopDelivery () { /* 231228 닫기 추가 */
  popupDeliverySelect.value = false
}
function closePopCashReceipt () { /* 231228 닫기 추가 */
  popupCashReceipt.value = false
}
function closePopPerInfCorUseAgr () { /* 231228 닫기 추가 */
  popupPerInfCorUseAgr.value = false
}
function closePopTossPersonalInfo () { /* 231228 닫기 추가 */
  popupTossPersonalInfo.value = false
}
function closePopTossElecTransfer () { /* 231228 닫기 추가 */
  popupTossElecTransfer.value = false
}
function closePopTossThirdInfo () { /* 231228 닫기 추가 */
  popupTossThirdInfo.value = false
}

function checkboxOrderConfirmAgreeSelect (event) {
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
function checkboxOrderConfirmAgreeEmit () {
  checkboxOrderProductName.value.checked &&
    checkboxPersonalInfoReceive.value.checked &&
    checkboxTossPersonalInfo.value.checked &&
    checkboxTossElecTransfer.value.checked &&
    checkboxTossThirdInfo.value.checked
    ? checkboxOrderConfirmAgree.value.checked = true
    : checkboxOrderConfirmAgree.value.checked = false
}
function goInsu () {
  window.open('https://www.macco.or.kr/ko/info/selectMemCompanyList.do', '_blank') /* 이렇게 직접 연결해도 되는지? to 개발 */
}
function payUserSelection (val) {
  document.querySelector('.pay-method--name').children[val].firstElementChild.setAttribute('checked', true)
  userSelect.value = val
}
function funcPayMethod (val) {
  // instance.emit('payMethod', val);
  payMethod.value = val
}
function payment () {
  router.push('/order-pay-detail')
}

</script>

<template>
  <div class="orderNpay">
    <order-npay-header> <!--페이지 제목-->
      <template v-slot:title>
        리포트 주문/결제
      </template>
    </order-npay-header>
    <div class="responsive-div">
      <div>
        <!--        <OrderNpayDelivery/> &lt;!&ndash;배송지&ndash;&gt;-->

        <section class="pay-delivery-address"> <!--배송지-->
          <div class="pay-delivery-address--header">
            <h2 class="pay-tit">우리 집 <span class="label--normal pay-delivery-address--label">기본배송지</span></h2>
            <button @click="popupDeliverySelect = true" type="button" class="btn--small">변경</button>

            <PopupDeliverySelect v-show="popupDeliverySelect" @closePop="closePopDelivery" /> <!--231228 닫기 추가-->

          </div>
          <div class="pay-delivery-address--txt">
            서울 강남구 영동대로 517 아셈타워 1104F (삼성동) <br />
            휴대폰 : 010-3333-9999 <br />
            배송메시지 : 집앞에 부탁해요
          </div>
        </section>

        <!--        <OrderNpayPay @payMethod="payMethodFunc" :payMethod="payMethod"/> &lt;!&ndash;결제 수단&ndash;&gt;-->

        <section class="pay-method"> <!--결제수단-->
          <header class="pay-method--header" :class="!togglePayMethod ? '' : 'active'">
            <h2 class="pay-tit">
              결제수단
            </h2>
            <button @click="togglePayMethod = !togglePayMethod" type="button" class="btn--up-down">
              <span v-if="togglePayMethod"><img
                src="/img/ic_arrow_down_black.svg"
                alt=""
                style="transform: rotate(180deg);" /></span>
              <span v-if="!togglePayMethod"><img src="/img/ic_arrow_down_black.svg" alt="" /></span>
            </button>
          </header>
          <div v-show="togglePayMethod"> <!--결제수단 내용 들-->

            <div
              class="pay-method--pay simple-pay"
              :class="payMethod === 'basicAuto' ? 'disSelect' : payMethod === 'basicCard' ? 'disSelect' : ''"> <!--심플페이-->

              <div class="tooltip"> <!--툴팁의 위치를 잡기위해 한번 더 싸줌-->
                <span class="pay-tit2">
                  <img
                    src="/img/a-pay.png"
                    alt=""
                    srcset=""
                    class="a-pay" /> 간편결제
                </span>
                <button
                  @click="tooltipSimplePay = !tooltipSimplePay"
                  class="btn--tooltip"
                  type="button"
                  title="도움말" />

                <base-tooltip v-if="tooltipSimplePay">
                  <template v-slot:contents>
                    A-Pay는 신용카드 및 은행 계좌를 1회 등록 후 결제 비밀번호 입력 만으로 결제할 수 있는 간편결제 서비스입니다.
                  </template>
                </base-tooltip>

              </div>

              <div class="pay-method--banner">
                A Pay 자동이체로 쉽고 빠르게 결제하고 <strong>PV Up 혜택</strong>도 받아보세요 >
              </div>

              <div class="tooltip pay-method--user-select"> <!--툴팁의 위치를 잡기위해 한번 더 싸줌-->
                <span class="pay-tit2">
                  결제하실 사업자 선택
                </span>
                <button
                  @click="tooltipPayUserSelect = !tooltipPayUserSelect"
                  class="btn--tooltip"
                  type="button"
                  title="도움말" />

                <base-tooltip v-if="tooltipPayUserSelect">
                  <template v-slot:contents>
                    결제 시 기본으로 설정할 사업자 선택은 마이페이지내 ʻA Pay 결제수단 관리’에서 변경이 가능합니다.
                  </template>
                </base-tooltip>

              </div>

              <div class="pay-method--name">
                <label v-for="(item, index) in payUserDatas" :for="'payUser' + index">
                  <input
                    @change="payUserSelection(index)"
                    :id="'payUser' + index"
                    type="radio"
                    name="payUserSelect" />
                  <span>
                    {{ item.name }}
                  </span>
                </label>
              </div>

              <hr class="space--top-small" />

              <div class="space--top-default"> <!--a pay 선택-->

                <div class="align--horiz full">
                  <button
                    @click="funcPayMethod('apayAuto')"
                    type="button"
                    class="btn--big"
                    :class="payMethod === 'apayAuto' ? 'active' : ''">A Pay 자동이체</button>
                  <button
                    @click="funcPayMethod('apayCard')"
                    type="button"
                    class="btn--big"
                    :class="payMethod === 'apayCard' ? 'active' : ''">A Pay 카드 결제</button>
                </div>

                <div v-show="payMethod === 'apayAuto'"> <!--a pay 자동이체-->
                  <swiper
                    :slides-per-view="1.2"
                    :centered-slides="true"
                    :space-between="15"
                    :pagination="{
                      clickable: true,
                    }"
                    :breakpoints="{
                      '0': {
                        slidesPerView: 1.2,
                      },
                      '758': {
                        slidesPerView: 3,
                      },
                    }"
                    :modules="modules"
                    class="pay-method--swiper"
                    :class="payUserDatas[userSelect].autoInfo.length === 0 ? 'blank' : ''">
                    <swiper-slide v-for="item in payUserDatas[userSelect].autoInfo" :class="item.bankCode">
                      <div class="pay-method--icon" :class="item.bankCode" />
                      <div class="pay-method--desc">
                        <div class="pay-method--card-txt">
                          {{ item.name }} <br />
                          {{ item.engName }}
                        </div>
                        {{ item.number }}
                      </div>
                    </swiper-slide>
                  </swiper>

                  <!--                  <OrderNpayCashReceipt/>-->

                  <div> <!--현금영수증-->
                    <strong>
                      현금영수증
                    </strong>
                    <button @click="popupCashReceipt = true" class="btn--big2" type="button">현금영수증 신청</button>

                    <PopupCashReceipt v-if="popupCashReceipt" @closePop="closePopCashReceipt" /> <!--231228 닫기 추가-->

                  </div>

                  <!--                  <OrderNpayApply v-if="payUserDatas[userSelect].autoInfo.length === 0"/>-->

                  <div v-if="payUserDatas[userSelect].autoInfo.length === 0" class="pay-method--blank">
                    <div>
                      등록된 A Pay 계좌/카드가 없습니다 <br />
                      암웨이 홈페이지에서 등록 후 사용해주세요.
                    </div>
                  </div>

                </div>

                <div v-show="payMethod === 'apayCard'"> <!--a pay 카드-->

                  <swiper
                    :slides-per-view="1.2"
                    :centered-slides="true"
                    :space-between="15"
                    :pagination="{
                      clickable: true,
                    }"
                    :breakpoints="{
                      '0': {
                        slidesPerView: 1.2,
                      },
                      '758': {
                        slidesPerView: 3,
                      },
                    }"
                    :modules="modules"
                    class="pay-method--swiper"
                    :class="payUserDatas[userSelect].cardInfo.length === 0 ? 'blank' : ''">
                    <swiper-slide v-for="item in payUserDatas[userSelect].cardInfo" :class="item.bankCode">
                      <div class="pay-method--icon" :class="item.bankCode" />
                      <div class="pay-method--desc">
                        <div class="pay-method--card-txt">
                          {{ item.name }} <br />
                          {{ item.engName }}
                        </div>
                        {{ item.number }}
                      </div>
                    </swiper-slide>
                  </swiper>

                  <!--                  <OrderNpayApply v-if="payUserDatas[userSelect].cardInfo.length === 0"/>-->

                  <div v-if="payUserDatas[userSelect].cardInfo.length === 0" class="pay-method--blank">
                    <div>
                      등록된 A Pay 계좌/카드가 없습니다 <br />
                      암웨이 홈페이지에서 등록 후 사용해주세요.
                    </div>
                  </div>

                  <select name="onpInstall" class="pay-method--apay-install">
                    <option value="">일시불</option>
                    <option value="">2개월</option>
                  </select>

                </div>

              </div>
            </div>

            <div
              class="pay-method--pay normal"
              :class="payMethod === 'basicAuto' ? 'select' : payMethod === 'basicCard' ? 'select' : ''">
              <!--다른 결제수단 (자동이체, 신용카드)-->
              <h3 @click="funcPayMethod('basicAuto')">
                다른 결제수단 <span class="pay-method--other-tit">(자동이체, 신용카드)</span>
              </h3>

              <div v-show="payMethod === 'basicAuto' || payMethod === 'basicCard'" class="pay-method--other-method">
                <div class="align--horiz full">
                  <button
                    @click="funcPayMethod('basicAuto')"
                    class="btn--big"
                    :class="payMethod === 'basicAuto' ? 'active' : ''"
                    type="button">자동이체</button>
                  <button
                    @click="funcPayMethod('basicCard')"
                    class="btn--big"
                    :class="payMethod === 'basicCard' ? 'active' : ''"
                    type="button">신용카드</button>
                </div>

                <div v-show="payMethod === 'basicAuto'" class="space--top-default"> <!--일반 자동이체-->
                  <div class="align--horiz input">
                    <label for="autoTransPw" style="width: 19rem;">
                      <strong>자동이체 비밀번호</strong>
                    </label>
                    <input
                      type="password"
                      name=""
                      id="autoTransPw"
                      placeholder="자동이체 비밀번호 6자리" />
                  </div>
                  <p class="pay-method--basicAuto--desc">
                    * 자동이체는 계좌 등록 후 사용이 가능합니다.
                  </p>
                  <div>
                    <div class="align--right">
                      <button @click="toggleAutoTransferInfo = !toggleAutoTransferInfo" type="button" class="btn--txt">
                        자동이체안내
                        <span v-if="!toggleAutoTransferInfo">∨</span>
                        <span v-else-if="toggleAutoTransferInfo">∧</span>
                      </button>
                    </div>
                    <hr />
                    <div v-if="toggleAutoTransferInfo" class="pay-method--basicAuto--info">
                      <ul>
                        <li>자동이체는 마이페이지에서 계좌 등록 후 사용이 가능합니다.</li>
                        <li>자동이체 결제 후 주문 취소하실 경우 환불시점은 영업일 기준 익일 오후 5시입니다.</li>
                        <li><strong class="txt--red">자동이체 가능 은행</strong> : 국민, 신한, 우리, SC제일, KEB하나, 농협, 기업, 씨티, 우체국, 유안타증권
                        </li>
                        <li><strong>거래가능시간</strong>
                          <ul>
                            <li>한도금액을 초과하는 주문 시에는 주문을 나누어 주십시오.</li>
                            <li>자동이체는 은행에 따라 새벽시간(00시 ~ 00시 30분)에 거래가 불안정할 수 있습니다.</li>
                            <li class="txt--red">
                              또한, 월말에는 거래가능시간이라도 은행에 따라 은행영업시간(오후 4시) 이후에 거래가 되지 않을 수 있으니
                              자동이체 이외의 타 결제수단을 이용하시기 바랍니다.
                            </li>
                          </ul>
                        </li>
                        <li>SC제일은행, 농협, 우리은행, KEB하나은행, 신한은행, 기업은행, 씨티은행, 우체국 : 한도 없음</li>
                        <li>유안타증권 : 1일 1,000만원 한도</li>
                        <li>KEB하나은행 : 1거래당 1,000만원 한도</li>
                        <li>국민은행 : 1거래당 600만원 한도</li>
                        <li>자동이체계좌는 공동사업자1(공동사업자1 &amp; 공동사업자2 인 경우 공동사업자1)의 주민등록번호로 개설된 계좌만 가능합니다.</li>
                      </ul>
                    </div>
                  </div>

                  <!--                  <OrderNpayCashReceipt class="space&#45;&#45;top-default"/>-->

                  <div class="align--between space--top-default"> <!--현금영수증-->
                    <div class="cashApply--tit">
                      <span>{{ aPayCashSelectYN ? (aPayCashSelectType === '1' ? '휴대폰번호' : '현금영수증 카드번호'):'' }}</span>
                      <span class="cashApply--num">{{ aPayCashSelectTypeValue }}</span>
                    </div>
                    <div class="cashApply--btn">
                      <button @click="popupCashReceipt = true" class="cashApply btn--big2" type="button">현금영수증 신청</button>
                    </div>

                    <PopupCashReceipt v-if="popupCashReceipt" @closePop="closePopCashReceipt" /> <!--231228 닫기 추가-->

                  </div>

                </div>

                <div v-show="payMethod === 'basicCard'" class="space--top-default"> <!--신용카드-->
                  <h4>신용/체크카드</h4>
                  <div class="responsive--half">
                    <select name="onpCardSelect" class="w--wide space--top-small responsive--half">
                      <option value="">현대카드</option>
                      <option value="">신한카드</option>
                    </select>
                    <select name="onpCardSelect2" class="w--wide space--top-small responsive--half">
                      <option value="">일시불</option>
                      <option value="">2개월</option>
                    </select>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpCardNum" style="width: 13rem;">
                        <span>카드번호</span>
                      </label>
                      <div class="align--horiz ea4">
                        <input
                          type="text"
                          name="onpCardNum1"
                          id="onpCardNum"
                          maxlength="4" />
                        <input type="text" name="onpCardNum2" maxlength="4" />
                        <input type="text" name="onpCardNum3" maxlength="4" />
                        <input type="text" name="onpCardNum4" maxlength="4" />
                      </div>
                    </div>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpExpPeri" style="width: 13rem;">
                        <span>유효기간</span>
                      </label>
                      <div class="align--horiz ea2">
                        <input
                          type="text"
                          name="onpExpPeri1"
                          id="onpExpPeri"
                          placeholder="월(MM)"
                          maxlength="2" />
                        <input
                          type="text"
                          name="onpExpPeri2"
                          placeholder="연(YY)"
                          maxlength="2" />
                      </div>
                    </div>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpCardPw" style="width: 13rem;">
                        <span>카드비밀번호</span>
                      </label>
                      <input
                        type="text"
                        id="onpCardPw"
                        placeholder="비밀번호 앞 2자리"
                        maxlength="2" />
                    </div>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpBirth" style="width: 13rem;">
                        <span>생년월일</span>
                      </label>
                      <input
                        type="text"
                        id="onpBirth"
                        placeholder="주민번호 앞 6자리"
                        maxlength="6" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        <!--        <OrderNpayProduct/> &lt;!&ndash;제품&ndash;&gt;-->

        <section class="group orderProduct"> <!--주문제품-->
          <header class="group--header align--horiz" :class="!toggleOrderProducts ? '' : 'active'">
            <h2 class="group--tit">주문제품</h2>
            <div>
              <strong class="txt--small2">주문명</strong>
              <button @click="toggleOrderProducts = !toggleOrderProducts" type="button" class="btn--up-down">
                <span v-if="toggleOrderProducts"><img
                  src="/img/ic_arrow_down_black.svg"
                  alt=""
                  style="transform: rotate(180deg);" /></span>
                <span v-if="!toggleOrderProducts"><img src="/img/ic_arrow_down_black.svg" alt="" /></span>
              </button>
            </div>
          </header>

          <div v-if="toggleOrderProducts"> <!--제품-->

            <div class="align--horiz">
              <div class="orderProduct--img">
                <img :src="productDatas.imgUrl" :alt="productDatas.name" srcset="" />
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

      </div>
      <div>
        <!--        <OrderNpayAmount :payMethod="payMethod"/> &lt;!&ndash;결제 금액, 약관동의&ndash;&gt;-->

        <div class="space--top-small2 responsive">

          <!--          <OrderNpayAmoutPrice/>-->

          <section class="group"> <!--결제금액-->
            <header class="group--header align--horiz" :class="!togglePayAmount ? '' : 'active'">
              <div class="tooltip">
                <h2 class="group--tit">
                  결제금액 <button
                    @click="tooltipPrice = !tooltipPrice"
                    class="btn--tooltip"
                    type="button"
                    title="도움말" />

                  <base-tooltip v-if="tooltipPrice">
                    <template v-slot:contents>
                      <div style="width: 20rem;">리포트 출력</div>
                      10000원
                    </template>
                  </base-tooltip>
                </h2>
              </div>
              <button @click="togglePayAmount = !togglePayAmount" type="button" class="btn--up-down">
                <span v-if="togglePayAmount"><img
                  src="/img/ic_arrow_down_black.svg"
                  alt=""
                  style="transform: rotate(180deg);" /></span>
                <span v-if="!togglePayAmount"><img src="/img/ic_arrow_down_black.svg" alt="" /></span>
              </button>
            </header>

            <div v-if="togglePayAmount" class="pay-amount">
              <dl class="pay-amount--item space--top-small">
                <dt>주문금액</dt>
                <dd>12,000원</dd>
              </dl>
              <dl class="pay-amount--item space--top-small">
                <dt>총 결제금액</dt>
                <dd><strong class="txt--big2">12,000원</strong></dd>
              </dl>
            </div>
          </section>

          <!--          <OrderNpayPromotion/>-->

          <!--          <div class="promotion">-->
          <!--            <em class="promotion&#45;&#45;name">Promotion</em>-->
          <!--            <h2 class="promotion&#45;&#45;tit">A Pay 자동이체 10% PV UP 프로모션</h2>-->
          <!--            <p class="promotion&#45;&#45;txt">A Pay 자동이체로 결제 시 10% PV UP 증정</p>-->
          <!--          </div>-->

          <!--          <OrderNpayAmountTerms :payMethod="props.payMethod"/>-->

          <section class="termsAgree"> <!--약관 동의-->
            <ul class="termsAgree--ul">
              <li>
                <div class="align--horiz termsAgree--first">
                  <label for="orderConfirmAgree">
                    <input
                      @change="checkboxOrderConfirmAgreeSelect"
                      ref="checkboxOrderConfirmAgree"
                      type="checkbox"
                      id="orderConfirmAgree" />
                    <strong class="tit--small2">주문내용 확인 및 결제 진행 동의</strong>
                  </label>
                  <button @click="toggleTermsAgree = !toggleTermsAgree" type="button" class="btn--txt">
                    약관보기
                    <span v-if="toggleTermsAgree"><img
                      src="/img/ic_arrow_down_black.svg"
                      alt=""
                      style="filter: invert(37%) sepia(78%) saturate(2022%) hue-rotate(214deg) brightness(105%) contrast(91%); transform: rotate(180deg)" /></span>
                    <span v-if="!toggleTermsAgree"><img
                      src="/img/ic_arrow_down_black.svg"
                      alt=""
                      style="filter: invert(37%) sepia(78%) saturate(2022%) hue-rotate(214deg) brightness(105%) contrast(91%);" /></span>
                  </button>
                </div>
                <ul v-show="toggleTermsAgree" class="termsAgree--ul--ul">
                  <li>
                    <label for="orderProductName" class="align--horiz left">
                      <input
                        @click="checkboxOrderConfirmAgreeEmit"
                        ref="checkboxOrderProductName"
                        type="checkbox"
                        id="orderProductName"
                        style="width: 3rem;" />
                      <span class="txt--small3" style="width: calc( 100% - 4rem )">주문하실 상품의 상품명, 가격, 배송정보를 확인하였으며, 이에
                        동의(전자상거래법 제8조 제2항)</span>
                    </label>
                  </li>
                  <li class="align--horiz">
                    <label for="personalInfoReceive" class="align--horiz left" style="width: 70%;">
                      <input
                        @click="checkboxOrderConfirmAgreeEmit"
                        ref="checkboxPersonalInfoReceive"
                        type="checkbox"
                        id="personalInfoReceive"
                        style="width: 3rem;" />
                      <span class="txt--small3" style="width: calc( 100% - 4rem )">개인정보 수집 및 이용에 대한 동의</span>
                    </label>
                    <button @click="popupPerInfCorUseAgr = true" type="button" class="btn--txt"><span
                      class="txt--underline">자세히 보기</span></button>

                    <OrderNpayAmountTermsPopup v-if="popupPerInfCorUseAgr" @closePop="closePopPerInfCorUseAgr" />
                    <!--231228 닫기 추가-->

                  </li>
                </ul>
              </li>
            </ul>

            <hr />

            <ul v-show="payMethod === 'apayAuto' || payMethod === 'apayCard'" class="termsAgree--ul">
              <li class="align--horiz">
                <label for="tossPersonalInfo">
                  <input
                    @click="checkboxOrderConfirmAgreeEmit"
                    ref="checkboxTossPersonalInfo"
                    type="checkbox"
                    id="tossPersonalInfo" />
                  <span class="tit--small2">TOSS 개인정보 수집 이용 동의</span>
                </label>
                <button @click="popupTossPersonalInfo = true" type="button" class="btn--txt"><span
                  class="txt--underline">자세히 보기</span></button>

                <OrderNpayAmountTermsPopup2 v-if="popupTossPersonalInfo" @closePop="closePopTossPersonalInfo" />
                <!--231228 닫기 추가-->

              </li>
              <li class="align--horiz">
                <label for="tossElecTransfer">
                  <input
                    @click="checkboxOrderConfirmAgreeEmit"
                    ref="checkboxTossElecTransfer"
                    type="checkbox"
                    id="tossElecTransfer" />
                  <span class="tit--small2">TOSS 전자금융거래 기본약관</span>
                </label>
                <button @click="popupTossElecTransfer = true" type="button" class="btn--txt"><span
                  class="txt--underline">자세히 보기</span></button>

                <OrderNpayAmountTermsPopup3 v-if="popupTossElecTransfer" @closePop="closePopTossElecTransfer" />
                <!--231228 닫기 추가-->

              </li>
              <li class="align--horiz">
                <label for="tossThirdInfo">
                  <input
                    @click="checkboxOrderConfirmAgreeEmit"
                    ref="checkboxTossThirdInfo"
                    type="checkbox"
                    id="tossThirdInfo" />
                  <span class="tit--small2">TOSS 개인정보 제3자 제공 동의</span>
                </label>
                <button @click="popupTossThirdInfo = true" type="button" class="btn--txt"><span class="txt--underline">자세히
                  보기</span></button>

                <OrderNpayAmountTermsPopup4 v-if="popupTossThirdInfo" @closePop="closePopTossThirdInfo" />
                <!--231228 닫기 추가-->

              </li>
            </ul>

            <div class="space--top-small">
              <div class="align--horiz termsAgree--first">
                <label>
                  <input
                    v-model="checkReturn"
                    ref="refCheckReturn"
                    type="checkbox" />
                  <strong class="tit--small2 align--vertical2">반품 불가 동의서</strong>
                </label>
                <button @click="toggleReturnAgree = !toggleReturnAgree" type="button" class="btn--txt">
                  보기
                  <span v-if="toggleReturnAgree"><img
                    src="/img/ic_arrow_down_black.svg"
                    alt=""
                    style="filter: invert(37%) sepia(78%) saturate(2022%) hue-rotate(214deg) brightness(105%) contrast(91%); transform: rotate(180deg)" /></span>
                  <span v-if="!toggleReturnAgree"><img
                    src="/img/ic_arrow_down_black.svg"
                    alt=""
                    style="filter: invert(37%) sepia(78%) saturate(2022%) hue-rotate(214deg) brightness(105%) contrast(91%);" /></span>
                </button>
              </div>
              <ul v-show="toggleReturnAgree" class="termsAgree--ul--ul">
                <li class="txt--small space--padding-right">
                  마이웰니스 랩 바이 뉴트리라이트의 웰니스 분석 리포트 인쇄/배송 서비스는 각 개인의 웰니스 결과를 개인 맞춤으로 분석 및 제작합니다.<br />이에 따라 서비스 신청 및 결제 후 반품이 불가합니다.<br />서비스를 이용하려면 반드시 동의가 필요하며, 동의하지 않을 경우 서비스 제공이 어렵습니다.<br />동의하시겠습니까?
                </li>
              </ul>
            </div>

            <div class="align--right space--top-small">
              <div class="tooltip">
                <span class="txt--small3">소비자피해보상보험 가입 안내 보기</span>
                <button
                  @click="tooltipInsuInfo = !tooltipInsuInfo"
                  class="btn--tooltip"
                  type="button"
                  title="도움말" />

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

          </section>

        </div>

        <!--        <OrderNpayBtn/> &lt;!&ndash;결제버튼&ndash;&gt;-->

        <div class="price-pay-btn">
          <button @click="payment" type="button" class="btn--big2 space--top-default txt--default">
            <span class="txt--small4 txt--blue">총</span> 12,000
            <span class="txt--small4 txt--blue">원</span> 결제하기
          </button>
        </div>

      </div>
    </div>

  </div></template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
.other--pay {
  cursor: pointer;
}

.pay-method--other-method {

  input[type=text],
  input[type=password],
  input[type=number] {
    padding-left: 1rem;
  }
}
.pay-method--swiper{
  :deep(.swiper-pagination){
    position: initial;
    margin-top: 5px;
  }
}
.orderNpayAuto{
  $size: 19rem;
  @media (max-width: 1000px) {
    $size: 11rem;
  }
  & > label{
    width: $size;
  }
  & > input{
    width: calc(100% - $size) !important;
  }
}
.cashApply{
  padding-right: 20px;
  padding-left: 20px;
  @media (max-width: 1000px) {
    width: 100%;
    margin-top: 10px;
  }
}
.cashApply--tit{
  padding-top: 8px;
  color: #567bf3;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
    width: 100%;
  }
}
.cashApply--num{
  margin-left: 30px;
}
.cashApply--btn {
  @media (max-width: 1000px) {
    width: 100%;
  }
}
.pay-method--swiper .swiper-slide{
  &.농협{
    background-color: #0066b3;
    .pay-method--icon{
      background-image: url("/img/icon_card-01.png");
    }
  }
  &.우리{
    background-color: #0067ac;
    .pay-method--icon{
      background-image: url("/img/icon_card-02.png");
    }
  }
  &.신한{
    background-color: #10226a;
    .pay-method--icon{
      background-image: url("/img/icon_card-03.png");
    }
  }
  &.국민{
    background-color: #645b4c;
    .pay-method--icon{
      background-image: url("/img/icon_card-04.png");
    }
  }
  &.하나{
    background-color: #009490;
    .pay-method--icon{
      background-image: url("/img/icon_card-05.png");
    }
  }
  &.씨티{
    background-color: #004087;
    .pay-method--icon{
      background-image: url("/img/icon_card-06.png");
    }
  }
  &.전북{
    background-color: #002d6b;
    .pay-method--icon{
      background-image: url("/img/icon_card-07.png");
    }
  }
  &.산업{
    background-color: #013580;
    .pay-method--icon{
      background-image: url("/img/icon_card-08.png");
    }
  }
  &.새마을{
    background-color: #07376a;
    .pay-method--icon{
      background-image: url("/img/icon_card-09.png");
    }
  }
  &.수협{
    background-color: #70c7eb;
    .pay-method--icon{
      background-image: url("/img/icon_card-10.png");
    }
  }
  &.신협{
    background-color: #59cad1;
    .pay-method--icon{
      background-image: url("/img/icon_card-11.png");
    }
  }
  &.우체국{
    background-color: #d93128;
    .pay-method--icon{
      background-image: url("/img/icon_card-12.png");
    }
  }
  &.케이{
    background-color: #26323d;
    .pay-method--icon{
      background-image: url("/img/icon_card-13.png");
    }
  }
  &.카카오뱅크{
    background-color: #ffe300;
    .pay-method--icon{
      background-image: url("/img/icon_card-14.png");
    }
  }
  &.저축{
    background-color: #acd663;
    .pay-method--icon{
      background-image: url("/img/icon_card-15.png");
    }
  }
  &.경남{
    background-color: #b7a997;
    .pay-method--icon{
      background-image: url("/img/icon_card-16.png");
    }
  }
  &.부산{
    background-color: #b7a997;
    .pay-method--icon{
      background-image: url("/img/icon_card-16.png");
    }
  }
  &.기업{
    background-color: #014c9d;
    .pay-method--icon{
      background-image: url("/img/icon_card-17.png");
    }
  }
  &.SC제일{
    background-color: #525355;
    .pay-method--icon{
      background-image: url("/img/icon_card-18.png");
    }
  }
  &.대구{
    background-color: #5cafe5;
    .pay-method--icon{
      background-image: url("/img/icon_card-19.png");
    }
  }
  &.산림{
    background-color: #218679;
    .pay-method--icon{
      background-image: url("/img/icon_card-20.png");
    }
  }
  &.토스{
    background-color: #0064ff;
    .pay-method--icon{
      background-image: url("/img/icon_card-21.png");
    }
  }
  &.BC{
    background-color: #e83e45;
    .pay-method--icon{
      background-image: url("/img/icon_card-22.png");
    }
  }
  &.현대{
    background-color: #000000;
    .pay-method--icon{
      background-image: url("/img/icon_card-23.png");
    }
  }
  &.롯데{
    background-color: #3d3934;
    .pay-method--icon{
      background-image: url("/img/icon_card-24.png");
    }
  }
  &.삼성{
    background-color: #0c4da1;
    .pay-method--icon{
      background-image: url("/img/icon_card-25.png");
    }
  }
}
</style>
