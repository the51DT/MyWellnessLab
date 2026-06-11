<script setup>
import BaseTooltip from '@/views/publishing/orderNpay/BaseTooltipOrderNpay.vue'
import BasePopup from '@/views/publishing/orderNpay/BasePopupOrder.vue'
import { onMounted, ref } from 'vue'
import OrderNpayDeliveryPopupNew from '@/views/publishing/orderNpay/OrderNpayDeliveryPopupNew.vue' /* 231217 추가 */

const emit = defineEmits(['closePop']) /* 231217 추가 */
const toggleDelivery = ref(false) /* 배송지 검색, 검색 인풋 영역 토글 */
const tooltipDeliveryMsg = ref([])
const addressValue = ref('address0')

const datas = ref([
  {
    name: '우리집',
    default: true,
    address: '[01234]서울 강남구 영동대로 517 아셈타워 1104F (삼성동)',
    phone: '01012345678'
  },
  {
    name: '처가댁',
    default: false,
    address: '[01234]서울 강남구 영동대로 517 아셈타워 1104F (삼성동)',
    phone: '01012345678'
  },
  {
    name: '회사',
    default: false,
    address: '[01234]서울 강남구 영동대로 517 아셈타워 1104F (삼성동)',
    phone: '01012345678'
  }
]
)
const isNewAddress = ref(false) /* 231217 새 배송지 팝업 오프너 */

function deliveryMsg (event) {
  if (event.target.value === '1') {
    event.target.nextSibling.removeAttribute('disabled')
  } else {
    event.target.nextSibling.setAttribute('disabled', 'true')
  }
}

function addressSelect (event) {
  if (event) {
    const tg = event.target
    const tgs = tg.closest('.delivery--list').getElementsByClassName('address-li')
    for (let i = 0; i < tgs.length; i++) {
      tgs[i].classList.remove('active')
    }
    if (tg.value === addressValue.value) {
      tg.closest('.address-li').classList.add('active')
    }
  } else {
    document.querySelectorAll('.address-li')[0].classList.add('active') /* 기본 배송지 선택 상태로 */
  }
}

// const instance = getCurrentInstance(); 231217 일단 가림
function close () {
  emit('closePop') /* 231217 형식 변경 */
}
function popupClose () { /* 231217 추가 */
  isNewAddress.value = false
}

onMounted(() => {
  addressSelect()
})

</script>

<template>
  <div> <!--231217 추가-->
    <base-popup>
      <template v-slot:title>
        배송지 선택
      </template>
      <template v-slot:contents>
        <div class="popup--contents-pad--default">

          <div class="delivery--btn-wrap"> <!--231217 버튼 2개임-->
            <button @click="isNewAddress = true" type="button" class="delivery--add">배송지 추가</button>
            <button @click="toggleDelivery = true" type="button" class="delivery--big-btn">배송지 검색</button>
          </div>

          <div v-if="toggleDelivery" class="delivery">
            <input
              type="text"
              name=""
              id=""
              placeholder="받는 분 주소 입력"
              class="delivery--input" />
            <div class="delivery--search">
              <button type="button" class="btn--search" title="검색" />
            </div>
            <div class="delivery--search-cancel">
              <button @click="toggleDelivery = false" type="button" class="btn--small">검색취소</button>
              <!--검색취소를 누르면 검색결과도 초기화 to 개발-->
            </div>
          </div>

          <div> <!--검색 결과-->
            <ul class="delivery--list">

              <li v-for="(item, index) in datas" class="address-li">
                <label :for="'address' + index">
                  <input
                    v-model="addressValue"
                    @change="addressSelect"
                    type="radio"
                    :value="'address' + index"
                    name="deliverySelect"
                    :id="'address' + index" />
                  <strong>{{ item.name }}</strong> <span v-if="item.default" class="label--normal">기본배송지</span>
                </label>
                <p class="delivery--txt">
                  {{ item.address }}
                </p>
                <p class="delivery--txt">
                  휴대폰 : {{ item.phone }}
                </p>

                <div class="delivery--msg"> <!--배송 관련-->

                  <div class="tooltip"> <!--툴팁의 위치를 잡기위해 한번 더 싸줌-->
                    배송메시지
                    <button
                      @click="tooltipDeliveryMsg[index] = !tooltipDeliveryMsg[index]"
                      class="btn--tooltip"
                      type="button"
                      title="도움말" />

                    <base-tooltip v-if="tooltipDeliveryMsg[index]">
                      <template v-slot:contents>
                        <ul>
                          <li>택배기사님께 전달하는 메시지는 배송 시 참고하는 내용으로 배송상황 및 요청내용에 따라 반영되지 않을 수 있습니다.</li>
                          <li>배송일 및 배송시각은 지정하셔도 반영되지 않습니다.</li>
                        </ul>
                      </template>
                    </base-tooltip>

                  </div>

                  <select class="delivery--select" @change="deliveryMsg" name="deliveryMsg">
                    <option disabled selected>배송메시지를 선택해 주세요</option>
                    <option value="1">직접 입력</option>
                    <option value="2">문 앞</option>
                    <option value="3">부재 시 문 앞</option>
                    <option value="4">부재 시 경비실</option>
                  </select>
                  <input
                    type="text"
                    name="delivery--sub-msg"
                    class="delivery--sub-msg"
                    disabled />
                </div>

              </li>

            </ul>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup--foot two">
          <button @click="close" type="button" class="btn--pop-bottom white">취소</button>
          <button type="button" class="btn--pop-bottom navy">선택</button>
        </div>
      </template>
    </base-popup>

    <OrderNpayDeliveryPopupNew :isNewAddress="isNewAddress" @popupClose="popupClose" /> <!--231217 추가-->

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css/ordernpay";
</style>
