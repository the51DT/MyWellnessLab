<script setup>
import { Navigation, Pagination } from 'swiper/modules'
import { getCurrentInstance, onMounted, ref } from 'vue'
import BaseTooltip from '@/views/publishing/orderNpay/BaseTooltipOrderNpay.vue'
import OrderNpayCashReceipt from '@/views/publishing/orderNpay/OrderNpayCashReceipt.vue'
import OrderNpayApply from '@/views/publishing/orderNpay/OrderNpayApply.vue'

const props = defineProps({
  payMethod: String
})

const tooltipSimplePay = ref(false)
const tooltipPayUserSelect = ref(false)
const payUserDatas = ref([
  {
    name: '홍길동',
    autoInfo: [ /* 임시 데이터임 수정 필요 to 개발 */
      { name: '농협은행', bankCode: 'b01', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '우리은행', bankCode: 'b02', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '신한은행', bankCode: 'b03', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: 'KB국민은행', bankCode: 'b04', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '하나은행', bankCode: 'b05', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '씨티은행', bankCode: 'b06', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '전북은행', bankCode: 'b07', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '산업은행', bankCode: 'b08', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '새마을금고', bankCode: 'b09', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '수협', bankCode: 'b10', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '신협', bankCode: 'b11', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '우체국', bankCode: 'b12', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '케이뱅크', bankCode: 'b13', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '카카오뱅크', bankCode: 'b14', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '저축은행', bankCode: 'b15', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '부산은행', bankCode: 'b16', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '기업은행', bankCode: 'b17', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: 'SC제일은행', bankCode: 'b18', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '대구은행', bankCode: 'b19', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '산림조합', bankCode: 'b20', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '토스뱅크', bankCode: 'b21', engName: 'BYEONG HEON LEE', number: '110234567890' }
    ],
    cardInfo: [
      { name: 'NH채움카드', bankCode: 'c01', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '우리카드', bankCode: 'c02', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '신한카드', bankCode: 'c03', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: 'KB국민카드', bankCode: 'c04', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '하나카드', bankCode: 'c05', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '씨티카드', bankCode: 'c06', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '전북 & 광주카드', bankCode: 'c07', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: 'MG새마을??', bankCode: 'c09', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '수협카드', bankCode: 'c10', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '신협카드', bankCode: 'c11', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: 'BC카드', bankCode: 'c22', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '현대카드', bankCode: 'c23', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '롯데카드', bankCode: 'c24', engName: 'BYEONG HEON LEE', number: '110234567890' },
      { name: '삼성카드', bankCode: 'c25', engName: 'BYEONG HEON LEE', number: '110234567890' }
    ]
  },
  {
    name: '이순신',
    autoInfo: [ /* 임시 데이터임 수정 필요 to 개발 */
      { name: '농협은행', bankCode: 'b01', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '우리은행', bankCode: 'b02', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '신한은행', bankCode: 'b03', engName: 'BYEONG HEON', number: '110234567890' },
      { name: 'KB국민은행', bankCode: 'b04', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '하나은행', bankCode: 'b05', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '씨티은행', bankCode: 'b06', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '전북은행', bankCode: 'b07', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '산업은행', bankCode: 'b08', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '새마을금고', bankCode: 'b09', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '수협', bankCode: 'b10', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '신협', bankCode: 'b11', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '우체국', bankCode: 'b12', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '케이뱅크', bankCode: 'b13', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '카카오뱅크', bankCode: 'b14', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '저축은행', bankCode: 'b15', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '부산은행', bankCode: 'b16', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '기업은행', bankCode: 'b17', engName: 'BYEONG HEON', number: '110234567890' },
      { name: 'SC제일은행', bankCode: 'b18', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '대구은행', bankCode: 'b19', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '산림조합', bankCode: 'b20', engName: 'BYEONG HEON', number: '110234567890' },
      { name: '토스뱅크', bankCode: 'b21', engName: 'BYEONG HEON', number: '110234567890' }
    ],
    cardInfo: [
    ]
  }
])

const userSelect = ref(0) /* 사업자 선택 */
const modules = [Navigation, Pagination]
const toggleAutoTransferInfo = ref(false) /* 자동이체 설명 토글 */
const togglePayMethod = ref(true) /* 결제수단 토글 */

function payUserSelection(val) {
  document.querySelector('.pay-method--name').children[val].firstElementChild.setAttribute('checked', true)
  userSelect.value = val
}

const instance = getCurrentInstance()
function payMethod(val) {
  instance.emit('payMethod', val)
}

onMounted(() => {
  payUserSelection(0)
})

</script>

<template>
  <section class="pay-method"> <!--결제수단-->
    <header class="pay-method--header" :class="!togglePayMethod ? '' : 'active'">
      <h2 class="pay-tit">
        결제수단
      </h2>
      <button @click="togglePayMethod = !togglePayMethod" type="button" class="btn--up-down">
        <span v-if="togglePayMethod">∧</span>
        <span v-if="!togglePayMethod">∨</span>
      </button>
    </header>
    <div v-show="togglePayMethod"> <!--결제수단 내용 들-->

      <div class="pay-method--pay simple-pay"
        :class="props.payMethod === 'basicAuto' ? 'disSelect' : props.payMethod === 'basicCard' ? 'disSelect' : ''">
        <!--심플페이-->

        <div class="tooltip"> <!--툴팁의 위치를 잡기위해 한번 더 싸줌-->
          <span class="pay-tit2">
            <img src="/img/a-pay.png" alt="" srcset="" class="a-pay"> 간편결제
          </span>
          <button @click="tooltipSimplePay = !tooltipSimplePay" class="btn--tooltip" type="button" title="도움말"></button>

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
          <button @click="tooltipPayUserSelect = !tooltipPayUserSelect" class="btn--tooltip" type="button"
            title="도움말"></button>

          <base-tooltip v-if="tooltipPayUserSelect">
            <template v-slot:contents>
              결제 시 기본으로 설정할 사업자 선택은 마이페이지내 ʻA Pay 결제수단 관리’에서 변경이 가능합니다.
            </template>
          </base-tooltip>

        </div>

        <div class="pay-method--name">
          <label v-for="(item, index) in payUserDatas" :for="'payUser' + index">
            <input @change="payUserSelection(index)" :id="'payUser' + index" type="radio" name="payUserSelect">
            <span>
              {{ item.name }}
            </span>
          </label>
        </div>

        <hr class="space--top-small">

        <div class="space--top-default"> <!--a pay 선택-->

          <div class="align--horiz full">
            <button @click="payMethod('apayAuto')" type="button" class="btn--big"
              :class="props.payMethod === 'apayAuto' ? 'active' : ''">A Pay 자동이체</button>
            <button @click="payMethod('apayCard')" type="button" class="btn--big"
              :class="props.payMethod === 'apayCard' ? 'active' : ''">A Pay 카드 결제</button>
          </div>

          <div v-show="props.payMethod === 'apayAuto'"> <!--a pay 자동이체-->
            <swiper :slides-per-view="1.2" :centered-slides="true" :space-between="15" :pagination="{
              clickable: true,
            }" :breakpoints="{
  '0': {
    slidesPerView: 1.2,
  },
  '758': {
    slidesPerView: 3,
  },
}" :modules="modules" class="pay-method--swiper"
              :class="payUserDatas[userSelect].autoInfo.length === 0 ? 'blank' : ''">
              <swiper-slide v-for="item in payUserDatas[userSelect].autoInfo" :class="item.bankCode">
                <div class="pay-method--icon" :class="item.bankCode"></div>
                <div class="pay-method--desc">
                  <div class="pay-method--card-txt">
                    {{ item.name }} <br>
                    {{ item.engName }}
                  </div>
                  {{ item.number }}
                </div>
              </swiper-slide>
            </swiper>

            <OrderNpayCashReceipt />

            <OrderNpayApply v-if="payUserDatas[userSelect].autoInfo.length === 0" />

          </div>

          <div v-show="props.payMethod === 'apayCard'"> <!--a pay 카드-->

            <swiper :slides-per-view="1.2" :centered-slides="true" :space-between="15" :pagination="{
              clickable: true,
            }" :breakpoints="{
  '0': {
    slidesPerView: 1.2,
  },
  '758': {
    slidesPerView: 3,
  },
}" :modules="modules" class="pay-method--swiper"
              :class="payUserDatas[userSelect].cardInfo.length === 0 ? 'blank' : ''">
              <swiper-slide v-for="item in payUserDatas[userSelect].cardInfo" :class="item.bankCode">
                <div class="pay-method--icon" :class="item.bankCode"></div>
                <div class="pay-method--desc">
                  <div class="pay-method--card-txt">
                    {{ item.name }} <br>
                    {{ item.engName }}
                  </div>
                  {{ item.number }}
                </div>
              </swiper-slide>
            </swiper>

            <OrderNpayApply v-if="payUserDatas[userSelect].cardInfo.length === 0" />

            <select name="onpInstall" class="pay-method--apay-install">
              <option value="">일시불</option>
              <option value="">2개월</option>
            </select>

          </div>

        </div>
      </div>

      <div class="pay-method--pay normal"
        :class="props.payMethod === 'basicAuto' ? 'select' : props.payMethod === 'basicCard' ? 'select' : ''">
        <!--다른 결제수단 (자동이체, 신용카드)-->
        <h3 @click="payMethod('basicAuto')">
          다른 결제수단 <span class="pay-method--other-tit">(자동이체, 신용카드)</span>
        </h3>

        <div v-show="props.payMethod === 'basicAuto' || props.payMethod === 'basicCard'" class="pay-method--other-method">
          <div class="align--horiz full">
            <button @click="payMethod('basicAuto')" class="btn--big"
              :class="props.payMethod === 'basicAuto' ? 'active' : ''" type="button">자동이체</button>
            <button @click="payMethod('basicCard')" class="btn--big"
              :class="props.payMethod === 'basicCard' ? 'active' : ''" type="button">신용카드</button>
          </div>

          <div v-show="props.payMethod === 'basicAuto'" class="space--top-default"> <!--일반 자동이체-->
            <div class="align--horiz input">
              <label for="autoTransPw" style="width: 19rem;">
                <strong>자동이체 비밀번호</strong>
              </label>
              <input type="password" name="" id="autoTransPw" placeholder="자동이체 비밀번호 6자리">
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
              <hr>
              <div v-if="toggleAutoTransferInfo" class="pay-method--basicAuto--info">
                <ul>
                  <li>자동이체는 마이페이지에서 계좌 등록 후 사용이 가능합니다.</li>
                  <li>자동이체 결제 후 주문 취소하실 경우 환불시점은 영업일 기준 익일 오후 5시입니다.</li>
                  <li><strong class="txt--red">자동이체 가능 은행</strong> : 국민, 신한, 우리, SC제일, KEB하나, 농협, 기업, 씨티, 우체국, 유안타증권</li>
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

            <OrderNpayCashReceipt class="space--top-default" />

          </div>

          <div v-show="props.payMethod === 'basicCard'" class="space--top-default"> <!--신용카드-->
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
                  <input type="text" name="onpCardNum1" id="onpCardNum" maxlength="4">
                  <input type="text" name="onpCardNum2" maxlength="4">
                  <input type="text" name="onpCardNum3" maxlength="4">
                  <input type="text" name="onpCardNum4" maxlength="4">
                </div>
              </div>
              <div class="align--horiz input space--top-small responsive--half">
                <label for="onpExpPeri" style="width: 13rem;">
                  <span>유효기간</span>
                </label>
                <div class="align--horiz ea2">
                  <input type="text" name="onpExpPeri1" id="onpExpPeri" placeholder="월(MM)" maxlength="2">
                  <input type="text" name="onpExpPeri2" placeholder="연(YY)" maxlength="2">
                </div>
              </div>
              <div class="align--horiz input space--top-small responsive--half">
                <label for="onpCardPw" style="width: 13rem;">
                  <span>카드비밀번호</span>
                </label>
                <input type="text" id="onpCardPw" placeholder="비밀번호 앞 2자리" maxlength="2">
              </div>
              <div class="align--horiz input space--top-small responsive--half">
                <label for="onpBirth" style="width: 13rem;">
                  <span>생년월일</span>
                </label>
                <input type="text" id="onpBirth" placeholder="주민번호 앞 6자리" maxlength="6">
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped></style>
