<script setup>
import BaseTooltip from '@/views/order/BaseTooltipOrderNpay.vue'
import BasePopup from '@/views/order/BasePopupOrder.vue'
import { getCurrentInstance, inject, onMounted, ref } from 'vue'
import OrderNpayDeliveryPopupNew from '@/views/order/OrderNpayDeliveryPopupNew.vue'
import { useStore } from 'vuex' /* 231217 추가 */

const store = useStore()
const axios = inject('$axios')
const token = store.getters.getToken
const instance = getCurrentInstance()

const address_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/address-list'
// const address_search_api = import.meta.env.VITE_GLOB_BASE_API_URL + "/v1/api/user/order/address-search";

// TODO LYH Start 근시일 중 정리 예정
const header = {
  Authorization: token
}
// TODO END

const emit = defineEmits(['closePop']) /* 231217 추가 */
const toggleDelivery = ref(false) /* 배송지 검색, 검색 인풋 영역 토글 */
const tooltipDeliveryMsg = ref([])
const addressValue = ref('')
const isNewAddress = ref(false) /* 231217 새 배송지 팝업 오프너 */
const searchAddressWord = ref('')

const datas = ref([{}])

// 주소목록조회
const defaultAddressSetting = () => {
  axios.get(address_api, { headers: header })
    .then(res => {
      datas.value = res.data.data.addresses
      datas.value.forEach((target) => {
        if (target.defaultAddress) {
          addressValue.value = target.id
        }
      })

      defaultAddressEmit()
    })
    .catch(error => {
      console.log(error)
    })
}

function deliveryMsg(event) {
  document.querySelectorAll('.delivery--select').forEach((e) => {
    e.classList.remove('choices')
  })
  document.querySelectorAll('.delivery--sub-msg').forEach((e) => {
    e.classList.remove('choice')
  })

  event.target.classList.add('choices')

  if (event.target.value === '1') {
    event.target.nextSibling.removeAttribute('disabled')
    event.target.nextSibling.classList.add('choice')
  } else {
    event.target.nextSibling.setAttribute('disabled', 'true')
    event.target.nextSibling.classList.remove('choice')
  }
}

function addressSelect(event) {
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
function close() {
  emit('closePop') /* 231217 형식 변경 */
}
async function popupClose() { /* 231217 추가 */
  await defaultAddressSetting()
  isNewAddress.value = false
}

function defaultAddressEmit() {
  let addressName = ''
  let addressFormattedAddress = ''
  let addressCellphone = ''
  const addressDeliveryMessage = ''
  let addressDefaultAddress = false
  let addressPostalCode = ''

  datas.value.forEach((d) => {
    if (d.id == addressValue.value) {
      addressName = d.name
      addressFormattedAddress = d.formattedAddress
      addressCellphone = d.cellphone
      addressDefaultAddress = d.defaultAddress
      addressPostalCode = d.postalCode
    }
  })

  instance.emit('choiceAddressSet', addressValue.value, addressName, addressFormattedAddress, addressCellphone, addressDeliveryMessage, addressDefaultAddress, addressPostalCode)
}

function addressChoice() {
  let addressName = ''
  let addressFormattedAddress = ''
  let addressCellphone = ''
  let addressDeliveryMessage = ''
  let addressDefaultAddress = false
  let addressPostalCode = ''

  datas.value.forEach((d) => {
    if (d.id === addressValue.value) {
      addressName = d.name
      addressFormattedAddress = d.formattedAddress
      addressCellphone = d.cellphone
      addressDefaultAddress = d.defaultAddress
      addressPostalCode = d.postalCode
    }
  })

  if (document.querySelector('.choices option:checked') !== null) {
    if (document.querySelector('.choices option:checked').text === '직접 입력') {
      addressDeliveryMessage = document.querySelector('.choice').value
    } else {
      addressDeliveryMessage = document.querySelector('.choices option:checked').text
    }
  }
  instance.emit('choiceAddressSet', addressValue.value, addressName, addressFormattedAddress, addressCellphone, addressDeliveryMessage, addressDefaultAddress, addressPostalCode)
  close()
}

function searchAddressTarget() {
  const searchList = new Array()
  datas.value.forEach((target) => {
    if (target.formattedAddress.indexOf(searchAddressWord.value) !== -1 || target.name.indexOf(searchAddressWord.value) !== -1) {
      searchList.push(target)
    }
  })
  datas.value = searchList
  addressValue.value = searchList[0].id
}

function addressSearchClose() {
  toggleDelivery.value = false
  defaultAddressSetting()
}

onMounted(() => {
  defaultAddressSetting()
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
        <div>

          <div class="delivery--btn-wrap"> <!--231217 버튼 2개임-->
            <button @click="isNewAddress = true" type="button" class="delivery--add">배송지 추가</button>
            <button @click="toggleDelivery = true" type="button" class="delivery--big-btn">배송지 검색</button>
          </div>

          <div v-if="toggleDelivery" class="delivery">
            <input type="text" v-model="searchAddressWord" placeholder="주소, 받는 분 입력" class="delivery--input">
            <div class="delivery--search">
              <button type="button" @click="searchAddressTarget" class="btn--search" title="검색"></button>
            </div>
            <div class="delivery--search-cancel">
              <button @click="addressSearchClose" type="button" class="btn--small">검색취소</button>
            </div>
          </div>

          <div> <!--검색 결과-->
            <ul class="delivery--list">

              <li v-for="(item, index) in datas" class="address-li">
                <label :for="'address' + index">
                  <input v-model="addressValue" @change="addressSelect" type="radio" :value="item.id"
                    name="deliverySelect" :id="'address' + index">
                  <strong>{{ item.name }}</strong> <span v-if="item.defaultAddress" class="label--normal">기본배송지</span>
                </label>
                <p class="delivery--txt">
                  {{ item.formattedAddress }}
                </p>
                <p class="delivery--txt">
                  휴대폰 : {{ item.cellphone }}
                </p>

                <div class="delivery--msg"> <!--배송 관련-->

                  <div class="tooltip"> <!--툴팁의 위치를 잡기위해 한번 더 싸줌-->
                    배송메시지
                    <button @click="tooltipDeliveryMsg[index] = !tooltipDeliveryMsg[index]" class="btn--tooltip"
                      type="button" title="도움말"></button>

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
                  <input type="text" name="delivery--sub-msg" class="delivery--sub-msg" disabled>
                </div>

              </li>

            </ul>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup--foot two">
          <button @click="close" type="button" class="btn--pop-bottom white">취소</button>
          <button @click="addressChoice" type="button" class="btn--pop-bottom navy">선택</button>
        </div>
      </template>
    </base-popup>

    <OrderNpayDeliveryPopupNew :isNewAddress="isNewAddress" @popupClose="popupClose" /> <!--231217 추가-->

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css/ordernpay";
</style>
