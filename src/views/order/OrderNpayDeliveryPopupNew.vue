<script setup>
import BasePopup from '@/views/order/BasePopupOrder.vue'
import {getCurrentInstance, inject, onMounted, ref} from 'vue'
import { useStore } from 'vuex'

const address_search_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/address-search'
const address_add_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/address-add'

const store = useStore()
const axios = inject('$axios')
const token = store.getters.getToken
const prefix = 'newAddress' /* 231217 클래스 접두어 */
const props = defineProps({ /* 231217 오프너 프랩스 받음 */
  isNewAddress: Boolean
})
const instance = getCurrentInstance()
const isPopAddress = ref(false) /* 240103 주소검색 팝업 오프너 */
const accountTypeCode = ref('')

const zipcode = ref('')
const address1 = ref('')
const address2 = ref('')
const addressName = ref('')
const addressCellPhone = ref('')
const defaultAddressYN = ref(false)
const checkYN = ref('N')

const searchAddressWord = ref('')
const searchAddressList = ref('')
const addressType = ref('')
const choiceAddressAll = ref({})
const choiceAddress1 = ref('')
const choiceAddress2 = ref('')
const choiceAddress3 = ref('')

// TODO LYH Start 근시일 중 정리 예정
const header = {
  Authorization: token
}
// TODO END

const getUserData = () => {
  if (token !== '') {
    axios.get(import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/mypage/user-info', { headers: { Authorization: token } })
        .then(res => {
          accountTypeCode.value = res.data.data.accountTypeCode
        })
        .catch(error => {
          console.log(error)
        })
  }
}

function initializeData() {
  zipcode.value = ''
  address1.value = ''
  address2.value = ''
  addressName.value = ''
  addressCellPhone.value = ''
  defaultAddressYN.value = false
  checkYN.value = 'N'

  searchAddressWord.value = ''
  searchAddressList.value = ''
  addressType.value = ''
  choiceAddressAll.value = {}
  choiceAddress1.value = ''
  choiceAddress2.value = ''
  choiceAddress3.value = ''

}

function popupClose() {
  initializeData()
  instance.emit('popupClose')
}

function openPopAddress() { /* 240103 주소검색 팝업 열기 */
  isPopAddress.value = true
}
function searchAddress() {
  // 주소검색
  axios.post(address_search_api, { searchText: searchAddressWord.value }, { headers: header })
    .then(res => {
      searchAddressList.value = res.data.data.addressList
    })
    .catch(error => {
      console.log(error)
    })
}
function selectLoadAddress(item) {
  addressType.value = 'STREET'
  choiceAddressAll.value = item
  choiceAddress1.value = item.zipCode
  choiceAddress2.value = item.roadAddressPart1 + ' ' + item.roadAddressPart2
}

function selectJibunAddress(item) {
  addressType.value = 'NUMBER'
  choiceAddressAll.value = item
  choiceAddress1.value = item.zipCode
  choiceAddress2.value = item.jibunAddress
}

function inputPopAddress() {
  zipcode.value = choiceAddress1.value
  address1.value = choiceAddress2.value
  address2.value = choiceAddress3.value
  isPopAddress.value = false
}

function appendAddress() {
  // validation
  if (addressName.value === '') {
    alert('받는분는(은) 필수 항목입니다. 확인 후 다시 입력해주세요.')
    return false
  }
  if (addressCellPhone.value === '') {
    alert('휴대전화번호는(은) 필수 항목입니다. 확인 후 다시 입력해주세요.')
    return false
  }
  if (address1.value === '') {
    alert('[주소를 검색 해 주세요.]')
    return false
  }

  if(accountTypeCode.value === 'AMWAYBUSINESSNATURE_4' && defaultAddressYN.value !== true) {
    alert('기본 배송지 설정은 필수 입니다.')
    return false
  }

  if (checkYN.value === 'N') {
    alert('동의 후 저장 가능합니다.')
    return false
  }

  const param = {
    bdName: choiceAddressAll.value.bdName,
    buildingManNum: choiceAddressAll.value.buildingManNum,
    buldMnnm: choiceAddressAll.value.buldMnnm,
    buldSlno: choiceAddressAll.value.buldSlno,
    cityName: choiceAddressAll.value.cityName,
    dongCode: choiceAddressAll.value.dongCode,
    jibunAddress: choiceAddressAll.value.jibunAddress,
    roadAddress: choiceAddressAll.value.roadAddress,
    roadAddressPart1: choiceAddressAll.value.roadAddressPart1,
    roadAddressPart2: choiceAddressAll.value.roadAddressPart2,
    sectionName: choiceAddressAll.value.sectionName,
    streetName: choiceAddressAll.value.streetName,
    wideName: choiceAddressAll.value.wideName,
    zipCode: choiceAddressAll.value.zipCode,
    userDetail: address2.value,
    name: addressName.value,
    cellphone: document.querySelector('#receiverPhone > option:checked').value + addressCellPhone.value,
    defaultAddress: defaultAddressYN.value,
    addressType: addressType.value
  }
  // 주소추가
  axios.post(address_add_api, param, { headers: header })
    .then(res => {
      // console.log(res);
      popupClose()
    })
    .catch(error => {
      console.log(error)
    })
}

onMounted(() => {
  getUserData()
})

</script>

<template>
  <div>
    <base-popup v-if="props.isNewAddress">
      <template v-slot:title>
        새 배송지
      </template>
      <template v-slot:contents>
        <div :class="prefix">
          <div>
            <label for="newAddressReceiver">받는 분</label>
            <input v-model="addressName" type="text" name="" id="newAddressReceiver">
          </div>
          <div class="newAddress--phone">
            <label for="receiverPhone">받는 분 전화번호</label>
            <div class="newAddress--phone-input">
              <select name="Phone" id="receiverPhone" class="newAddress--010">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
                <option value="0130">0130</option>
              </select>
              <input v-model="addressCellPhone"
                     type="number"
                     name="Phone2"
                     class="newAddress--phone-extra"
                     maxlength="8"
                     placeholder="-를 제외하고 입력해주세요."
                     oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
            </div>
          </div>
          <div class="newAddress--address">
            <label for="newAddressAddress">주소</label>
            <div>
              <div class="newAddress--loca-find">
                <input v-model="zipcode" type="text" name="" id="newAddressAddress" class="newAddress--loca-input"
                  readonly>
                <button @click="openPopAddress" type="button" class="newAddress--loca-btn">주소찾기</button>
                <!--231217 주소 api 연결 요망-->
              </div>
              <input v-model="address1" type="text" name="" id="newAddressAddress2" class="newAddress--address2" readonly>
              <input v-model="address2" type="text" name="" id="newAddressAddress3" class="newAddress--address3" readonly>
            </div>
          </div>
          <label for="newAddressDefault" class="newAddress--default">
            <input type="checkbox" @click="defaultAddressYN = true" name="" id="newAddressDefault"> 기본 배송지
          </label>
          <div class="newAddress--agree">
            <p>본인은 정보주체(배송받는 사람)로부터 개인정보가 제3자인 한국 암웨이에 배송 목적으로 제공된다는 사실을 안내하고, 동의를 받으셨습니까?</p>
            <div class="newAddress--agree-radio">
              <label for="agree1" class="newAddress--rlabel">
                <input type="radio" name="agree" id="agree1" value="Y" v-model="checkYN">
                <span>예</span>
              </label>
              <label for="agree2" class="newAddress--rlabel r2">
                <input type="radio" name="agree" id="agree2" value="N" v-model="checkYN">
                <span>아니요</span>
              </label>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup--foot two">
          <button @click="popupClose" type="button" class="btn--pop-bottom white">취소</button>
          <button @click="appendAddress" type="button" class="btn--pop-bottom navy">확인</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="isPopAddress">
      <template v-slot:title>
        주소찾기
      </template>
      <template v-slot:contents>
        <div class="popAddress--body">
          <div class="popAddress--input">
            <input v-model="searchAddressWord" type="text" name="" id="" @keyup.enter="searchAddress" placeholder="예: 영동대로 517 / 아셈타워 / 삼성동 159-1"
              class="popAddress--input-l">
            <button @click="searchAddress" type="button" class="btn--big2">검색</button>
          </div>
          <ul class="popAddress--txt">
            <li>예) 도로명: 영동대로 517 / 아셈타워 / 삼성동 159-1</li>
            <li>단, 도로명 혹은 동(읍/면/리)만 검색하시는 경우 정확한 검색결과가 나오지 않을 수 있습니다.</li>
          </ul>
          <div class="popAddress--list">
            <p>아래에서 해당되는 주소의 [선택]버튼을 눌러주세요</p>
            <div class="popAddress--tb-wrap">
              <table class="popAddress--table">
                <thead class="popAddress--thead">
                  <tr>
                    <th>우편번호</th>
                    <th colspan="3" style="width: 80%;">주소</th>
                  </tr>
                </thead>
                <tbody class="popAddress--tbody">
                  <template v-for="(item, idx) in searchAddressList" :key="`list-${idx}`">
                    <tr>
                      <td rowspan="2">{{ item.zipCode }}</td>
                      <td class="popAddress--strong">도로</td>
                      <td>{{ item.roadAddressPart1 }} {{ item.roadAddressPart2 }}</td>
                      <td class="popAddress--btn">
                        <button @click="selectLoadAddress(item)" type="button">선택</button>
                      </td>
                    </tr>
                    <tr>
                      <td class="popAddress--strong">지번</td>
                      <td>{{ item.jibunAddress }}</td>
                      <td class="popAddress--btn">
                        <button @click="selectJibunAddress(item)" type="button">선택</button>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <!--            <div class="popAddress&#45;&#45;paging">-->
            <!--              <button type="button" class="popAddress&#45;&#45;page-edge">&laquo;</button>-->
            <!--              <button type="button">&lt;</button>-->
            <!--              <button type="button">1</button>-->
            <!--              <button type="button">2</button>-->
            <!--              <button type="button">3</button>-->
            <!--              <button type="button">&gt;</button>-->
            <!--              <button type="button" class="popAddress&#45;&#45;page-edge">&raquo;</button>-->
            <!--            </div>-->
          </div>
          <div class="popAddress--detail">
            <h4>상세 주소 입력</h4>
            <div class="popAddress--input-d-wrap">
              <input v-model="choiceAddress1" type="text" name="" id="" readonly class="popAddress--input-d">
              <input v-model="choiceAddress2" type="text" name="" id="" readonly class="popAddress--input-d">
              <input v-model="choiceAddress3" type="text" name="" id="" class="popAddress--input-l popAddress--input-d"
                placeholder="상세주소 입력 후 주소입력 버튼을 눌러주세요.">
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="popup--foot two">
          <button @click="inputPopAddress" type="button" class="btn--pop-bottom navy">주소입력</button>
          <button @click="isPopAddress = false" type="button" class="btn--pop-bottom white">취소</button>
        </div>
      </template>
    </base-popup>

  </div>
</template>

<style lang="scss" scoped>@use "@/assets/css/ordernpay";</style>
