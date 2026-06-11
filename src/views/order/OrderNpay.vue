<script setup>
import { inject, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import BasePopup from '@/components/BasePopup.vue'
import { Navigation, Pagination } from 'swiper/modules'
import OrderNpayHeader from '@/views/order/OrderNpayHeader.vue'
import PopupDeliverySelect from '@/views/order/OrderNpayDeliveryPopup.vue'
import BaseTooltip from '@/views/order/BaseTooltipOrderNpay.vue'
import OrderNpayAmountTermsPopup from '@/views/order/OrderNpayAmountTermsPopup.vue'
import OrderNpayAmountTermsPopup3 from '@/views/order/OrderNpayAmountTermsPopup3.vue'
import OrderNpayAmountTermsPopup4 from '@/views/order/OrderNpayAmountTermsPopup4.vue'
import OrderNpayAmountTermsPopup2 from '@/views/order/OrderNpayAmountTermsPopup2.vue'
import PopupCashReceipt from '@/views/order/OrderNpayCashReceiptPopup.vue'
import { ReportGenerator, ReportGeneratorLoading } from '@/views/analyze/detail/reportGenerator'
import router from '@/router'
import CryptoJS from 'crypto-js'
import SpinnerCircle from '@/components/etc/SpinnerCircle.vue'
import { goNextInput } from '@/assets/js/common'

const store = useStore()

const analysisId = store.getters['checkup/getResultId']

const axios = inject('$axios')
const token = store.getters.getToken
const cartCode = ref('')
const isFalseOrderPopup = ref(false)
let isFalseOrderMsg

const userData = store.getters.getUser
const defaultAddress = reactive({
  id: '',
  name: '',
  address: '',
  phone: '',
  message: '',
  defaultAddress: false,
  zip: ''
})
const defaultPayment = reactive({
  customerId: '',
  methodKey: '',
  storeId: '',
  installmentPlan: ''
})
const totalPrice = ref(0)
const totalPriceShow = ref('')

const cart_creation_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/cart-creation'
const apay_info_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/apay-info'
const delivery_address_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/delivery-address'
const cart_entries_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/cart-entries'
const order_pcap_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/order-pcap'
const debit_pwd_chk_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/debit-pwd-chk'
const cash_receipt_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/cash-receipt'
const order_fail_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/order-fail'
const save_logme_send_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/logme/print-delivery/'

// TODO LYH Start 근시일 중 정리 예정
const header = {
  Authorization: token
}
// TODO END

// process flow
// 1. 카트 생성
// 2. 상품 카트에 추가
// 3. 배송지 조회 [배송지 추가 / 배송지 검색 / 배송지 설정]
// 4. 결제방식 조회 [apay 자동이체 / apay 자동이체 현금영수증 / apay 카드결제 / apay 카드결제 할부정보 / 다른결제수단 자동이체 / 다른결제수단 자동이체 현금영수증 신청 / 다른결제수단 신용카드]
// 5. 배송지 카트추가 / 결제 설정 포함하여 결제요청처리

// 결제버튼 클릭하면
// 1. PDF 생성
// 2. 생성 완료 callback [finish] 실행
// 3. s3 업로드
// 4. 로그미 API 호출
// 5. 결제 function 호출

// 데이터 세팅
const dataSetting = () => {
  // 카트설정
  axios.post(cart_creation_api, {}, { headers: header })
    .then(res => {
      cartCode.value = res.data.data.code
      // 상품 목록 추가
      axios.post(cart_entries_api, { cartId: cartCode.value }, { headers: header })
        .then(res2 => {
          totalPrice.value = res2.data.data.cartModifications[0].entry.product.price.value
          totalPriceShow.value = res2.data.data.cartModifications[0].entry.product.price.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        })
        .catch(error2 => {
          console.log(error2)
        })
    })
    .catch(error => {
      console.log(error)
    })
}

function choiceAddressSet (id, name, address, phone, message, dfa, zip) {
  defaultAddress.id = id
  defaultAddress.name = name
  defaultAddress.address = address
  defaultAddress.phone = phone
  defaultAddress.message = message
  defaultAddress.defaultAddress = dfa
  defaultAddress.zip = zip
}

const payMethod = ref('') /* 결제 방식 선택 변수 apayAuto: apay자동이체, apayCard: apay카드, basicAuto: 일반 자동이체, basicCard: 일반 카드 */
const popupDeliverySelect = ref(false) /* 팝업 열고 닫기 */
const toggleOrderProducts = ref(true)
const productDatas = ref(
  {
    name: '마이웰니스랩리포트인쇄',
    imgUrl: 'https://mpn.dev.amway.co.kr/static/images/thumbs/missing.jpg',
    quantity: 1,
    price: totalPrice.value
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
const payUserNewDatas = ref(
  {
    accounts: {
      defaultPay: [{}],
      storeId: '',
      masterParty: [{}],
      subParty: [{}]
    },
    customerInfo: {},
    cards: {
      defaultPay: [{}],
      storeId: '',
      masterParty: [{}],
      subParty: [{}]
    }
  }
)
const selectedValues = ref('0')
const userSelect = ref(0) /* 사업자 선택 */
const modules = [Navigation, Pagination]
const toggleAutoTransferInfo = ref(false) /* 자동이체 설명 토글 */
const popupApayCashReceipt = ref(false)
const popupCashReceipt = ref(false)
const cardCompanyCode = ref('C04')
const installmentPlan = ref('0')
const cardNumber1 = ref('')
const cardNumber2 = ref('')
const cardNumber3 = ref('')
const cardNumber4 = ref('')
const validToYear = ref('')
const validToMonth = ref('')
const cardAuthNumber = ref('')
const cardPassword = ref('')
const orderCode = ref('')
const debitPwd = ref('')

const reportData = ref(null)
const spinerTxt = ref('결제 진행중 입니다.')
const showSpinner = ref(false)

const aPayCashSelectYN = ref(false)
const aPayCashSelectType = ref('')
const aPayCashSelectTypeValue = ref('')
const cashSelectYN = ref(false)
const cashSelectType = ref('')
const cashSelectTypeValue = ref('')

/* 240117 신용카드 정보 입력 시 자동으로 input focus를 넘기기위한 dom 이름 지정 */
const onpExpPeri1 = ref(null)
const onpCardPw = ref(null)
const onpBirth = ref(null)

const generateLoading = ref(false)
const reportGeneratorRef = ref()
const progress = ref(0)

const transactionCode = ref('')
const reportCode = ref('')

function finish (pdf) { // 리포트 파일 생성 완료 콜백
  generateLoading.value = false
  showSpinner.value = true

  const date = reportData.value.analyzeData.analysedDate.substr(0, 10)
  const pdfTitle = `마이웰니스 랩 리포트_${userData.name}_${date}.pdf`
  const file = new File([pdf], pdfTitle, { type: 'application/pdf' })

  // const bucketName = 'mywellnesslab-admin.dev.amway.co.kr'
  const bucketName = 'mywellnesslab.dev.amway.co.kr'
  const bucketRegion = 'ap-northeast-2'
  const IdentityPoolId = 'ap-northeast-2:236c9434-f880-4dd1-9cb1-a7500dbec862'

  const s3Client = new S3Client({
    region: bucketRegion,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: bucketRegion }, // Configure the underlying CognitoIdentityClient.
      identityPoolId: IdentityPoolId
    })
  })

  const timestamp = Date.now()
  const fileName = file.name.split('.')
  const modifyFileName = fileName[0] + '_' + timestamp + '.' + fileName[1]

  const fileKey = ''

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: 'logme-pdf-share/' + modifyFileName,
    Body: file
  })

  s3Client.send(command)
    .then((result) => {
      // encode
      fileMd5(file)
        .then((hex) => {
          const key = CryptoJS.enc.Utf8.parse(hex) // hex로 변환
          const base64 = CryptoJS.enc.Base64.stringify(key) // hex를 원래 포멧으로 변환

          transactionCode.value = reportData.value.surveyData.commonInfo.scode + '_' + timestamp
          reportCode.value = reportData.value.surveyData.commonInfo.acode

          // 로그미 api서버 전달
          const paramData = {
            transaction_code: transactionCode.value,
            r_count: 1,
            reportData: [
              {
                deliveryInfo: {
                  address_1: defaultAddress.address,
                  address_2: '',
                  name: defaultAddress.name,
                  phone_num: defaultAddress.phone,
                  postal_code: defaultAddress.zip
                },
                no: 1,
                reportFile: {
                  file_hash: base64,
                  file_name: modifyFileName,
                  file_path: 'logme-pdf-share/' + modifyFileName
                },
                report_code: reportCode.value
              }
            ]
          }

          axios.post(save_logme_send_api + analysisId, paramData, { headers: header })
            .then(res => {
              if (payMethod.value === 'basicAuto') {
                // debit_pwd_chk_api
                axios.post(debit_pwd_chk_api, { password: debitPwd.value }, { headers: header })
                  .then(res2 => {
                    if (res2.data.data.code === 'success') {
                      // pass
                      payment(res.data.data.reportHistoryDetail.id)
                    } else {
                      showSpinner.value = false
                      isFalseOrderPopup.value = true
                      isFalseOrderMsg = res2.data.data.returnMessage

                      axios.post(order_fail_api, {
                        transaction_code: transactionCode.value,
                        report_code: reportCode.value
                      }, { headers: header })
                        .then(res3 => {
                        }).catch(error3 => {
                          console.log(error3)
                        })

                      return false
                    }
                  }).catch(error2 => {
                    console.log(error2)
                  })
              } else {
                payment(res.data.data.reportHistoryDetail.id)
              }
            }).catch(error => {
              console.log(error)
              showSpinner.value = false
              isFalseOrderPopup.value = true
              isFalseOrderMsg = error.response.data.message
              return false
            })
        })
    }).catch((err) =>
      console.log(err)
    )
}

function payMethodFunc (val) {
  payMethod.value = val
}
function closePopDelivery () { /* 231228 닫기 추가 */
  popupDeliverySelect.value = false
}
function closeApayPopCashReceipt () { /* 231228 닫기 추가 */
  popupApayCashReceipt.value = false
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
  const checkMS = userData.primary ? 'MASTER' : 'SUB'
  let checkMethod = ''
  if (val === 'apayAuto' || val === 'basicAuto') {
    checkMethod = 'ACCOUNT'
  } else if (val === 'apayCard' || val === 'basicCard') {
    checkMethod = 'CARD'
  }
  const paramData = {
    method: 'ALL',
    party: checkMS
  }
  axios.post(apay_info_api, paramData, { headers: header })
    .then(res => {
      payUserNewDatas.value = res.data.data
      const subPartyArr = new Array()
      if (payUserNewDatas.value.accounts.subParty === undefined) {
        payUserNewDatas.value.accounts.subParty = subPartyArr
        payUserNewDatas.value.cards.subParty = subPartyArr
      }
      changePayment(0, checkMS)
    })
    .catch(error => {
      console.log(error)
    })
}

function changePayment (index, checkMS) {
  if (payMethod.value === 'apayAuto') {
    if (index === 0) {
      if (checkMS === 'MASTER') {
        if (payUserNewDatas.value.accounts.masterParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.accounts.masterParty[0].customerId
          defaultPayment.methodKey = payUserNewDatas.value.accounts.masterParty[0].methodKey
        }
      } else if (checkMS === 'SUB') {
        if (payUserNewDatas.value.accounts.subParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.accounts.subParty[0].customerId
          defaultPayment.methodKey = payUserNewDatas.value.accounts.subParty[0].methodKey
        }
      }
      defaultPayment.storeId = (payMethod.value === 'apayAuto') ? 'cp_amwaybank' : 'cp_amwaypay'
    } else {
      if (checkMS === 'MASTER') {
        if (payUserNewDatas.value.accounts.masterParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.accounts.masterParty[index.activeIndex].customerId
          defaultPayment.methodKey = payUserNewDatas.value.accounts.masterParty[index.activeIndex].methodKey
        }
      } else if (checkMS === 'SUB') {
        if (payUserNewDatas.value.accounts.subParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.accounts.subParty[index.activeIndex].customerId
          defaultPayment.methodKey = payUserNewDatas.value.accounts.subParty[index.activeIndex].methodKey
        }
      }
      defaultPayment.storeId = (payMethod.value === 'apayAuto') ? 'cp_amwaybank' : 'cp_amwaypay'
    }
  } else if (payMethod.value === 'apayCard') {
    if (index === 0) {
      if (checkMS === 'MASTER') {
        if (payUserNewDatas.value.cards.masterParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.cards.masterParty[0].customerId
          defaultPayment.methodKey = payUserNewDatas.value.cards.masterParty[0].methodKey
        }
      } else if (checkMS === 'SUB') {
        if (payUserNewDatas.value.cards.subParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.cards.subParty[0].customerId
          defaultPayment.methodKey = payUserNewDatas.value.cards.subParty[0].methodKey
        }
      }
      defaultPayment.storeId = (payMethod.value === 'apayAuto') ? 'cp_amwaybank' : 'cp_amwaypay'
    } else {
      if (checkMS === 'MASTER') {
        if (payUserNewDatas.value.cards.masterParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.cards.masterParty[index.activeIndex].customerId
          defaultPayment.methodKey = payUserNewDatas.value.cards.masterParty[index.activeIndex].methodKey
        }
      } else if (checkMS === 'SUB') {
        if (payUserNewDatas.value.cards.subParty.length > 0) {
          defaultPayment.customerId = payUserNewDatas.value.cards.subParty[index.activeIndex].customerId
          defaultPayment.methodKey = payUserNewDatas.value.cards.subParty[index.activeIndex].methodKey
        }
      }
      defaultPayment.storeId = (payMethod.value === 'apayAuto') ? 'cp_amwaybank' : 'cp_amwaypay'
    }
  }
}

function changeInstallmentPlan () {
  defaultPayment.installmentPlan = selectedValues.value
}

function aPayConfirmInfo (inputValue, selectType, isInput) {
  // console.log('confirmInfo : ' + inputValue + ' : ' + selectType)
  aPayCashSelectYN.value = isInput
  aPayCashSelectType.value = selectType
  aPayCashSelectTypeValue.value = inputValue
}

function confirmInfo (inputValue, selectType, isInput) {
  // console.log('confirmInfo : ' + inputValue + ' : ' + selectType)
  cashSelectYN.value = isInput
  cashSelectType.value = selectType
  cashSelectTypeValue.value = inputValue
}

function getAnalysisComplete () {
  axios.get(import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/analysis/complete/' + analysisId, { headers: header })
    .then(res4 => {
      reportData.value = {
        analyzeData: res4.data.data.logmeCompleteAnalysisDetail,
        surveyData: res4.data.data.survey
      }
      reportData.value.analyzeData.hqData.OXI = Math.round(reportData.value.analyzeData.hqData.OXI)
      reportData.value.analyzeData.hqData.MET = Math.round(reportData.value.analyzeData.hqData.MET)
      reportData.value.analyzeData.hqData.AgingRate = reportData.value.analyzeData.hqData.AgingRate.toFixed(2)
    }).catch(error4 => {
      console.log(error4)
    })
}
const toggleReturnAgree = ref(false) /* 반품 불가 동의서 */
const checkReturn = ref(false) /* 반품 불가 동의 여부 */
const refCheckReturn = ref(null) /* 반품 불가 동의 체크박스 */
function directDebitChk () {
  if (defaultAddress.id === '') {
    isFalseOrderPopup.value = true
    isFalseOrderMsg = '주소는(은) 필수 항목입니다. 다시 입력해주세요.'
    return false
  }

  if (payMethod.value === '') {
    isFalseOrderPopup.value = true
    isFalseOrderMsg = '결제방식을 선택해주세요.'
    return false
  }

  if (payMethod.value === 'apayAuto' || payMethod.value === 'apayCard') {
    if (defaultPayment.customerId === '' || defaultPayment.methodKey === '') {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '등록된 A Pay 계좌/카드가 없습니다\n암웨이 홈페이지에서 등록 후 사용해주세요.'
      return false
    }
  }

  if (payMethod.value === 'basicAuto') {
    if (document.getElementById('autoTransPw').value.length < 6) {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '자동이체 비밀번호 6자리를 입력해주세요.'
      return false
    }
  }

  if (payMethod.value === 'basicCard') {
    if ((cardNumber1.value !== '' && cardNumber1.value.length < 4) || cardNumber1.value === '') {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '카드숫자는 4자리를 입력해주세요.'
      document.querySelector('input[name=onpCardNum1]').focus()
      return false
    }
    if ((cardNumber2.value !== '' && cardNumber2.value.length < 4) || cardNumber2.value === '') {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '카드숫자는 4자리를 입력해주세요.'
      document.querySelector('input[name=onpCardNum2]').focus()
      return false
    }
    if ((cardNumber3.value !== '' && cardNumber3.value.length < 4) || cardNumber3.value === '') {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '카드숫자는 4자리를 입력해주세요.'
      document.querySelector('input[name=onpCardNum3]').focus()
      return false
    }
    if ((cardNumber4.value !== '' && cardNumber4.value.length < 4) || cardNumber4.value === '') {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '카드숫자는 4자리를 입력해주세요.'
      document.querySelector('input[name=onpCardNum4]').focus()
      return false
    }
    if ((validToYear.value !== '' && validToYear.value.length < 2) || validToYear.value === '') {
      isFalseOrderPopup.value = true
      isFalseOrderMsg = '카드년도는 2자리를 입력해주세요.'
      document.querySelector('input[name=onpExpPeri2]').focus()
      return false
    }
    if ((validToMonth.value !== '' && validToMonth.value.length < 2) || validToMonth.value === '') {
      isFalseOrderPopup.value = true; isFalseOrderMsg = '카드월은 2자리를 입력해주세요.'
      document.querySelector('input[name=onpExpPeri1]').focus()
      return false
    }
    if ((cardAuthNumber.value !== '' && cardAuthNumber.value.length < 6) || cardAuthNumber.value === '') {
      isFalseOrderPopup.value = true; isFalseOrderMsg = '생년월일은 6자리를 입력해주세요.'
      document.querySelector('#onpBirth').focus()
      return false
    }
    if ((cardPassword.value !== '' && cardPassword.value.length < 2) || cardPassword.value === '') {
      isFalseOrderPopup.value = true; isFalseOrderMsg = '카드비밀번호 2자리를 입력해주세요.'
      document.querySelector('#onpCardPw').focus()
      return false
    }
  }

  if (!checkboxOrderProductName.value.checked) {
    isFalseOrderPopup.value = true; isFalseOrderMsg = '주문내용 확인 및 결제 진행 동의를 확인해주세요.'
    return false
  }
  if (!checkboxPersonalInfoReceive.value.checked) {
    isFalseOrderPopup.value = true; isFalseOrderMsg = '주문내용 확인 및 결제 진행 동의를 확인해주세요.'
    return false
  }
  if (payMethod.value === 'apayAuto' || payMethod.value === 'apayCard' || (payMethod.value === 'basicCard' && cardCompanyCode.value !== 'C04')) {
    if (!checkboxTossPersonalInfo.value.checked) {
      isFalseOrderPopup.value = true; isFalseOrderMsg = '주문내용 확인 및 결제 진행 동의를 확인해주세요.'
      return false
    }
    if (!checkboxTossElecTransfer.value.checked) {
      isFalseOrderPopup.value = true; isFalseOrderMsg = '주문내용 확인 및 결제 진행 동의를 확인해주세요.'
      return false
    }
    if (!checkboxTossThirdInfo.value.checked) {
      isFalseOrderPopup.value = true; isFalseOrderMsg = '주문내용 확인 및 결제 진행 동의를 확인해주세요.'
      return false
    }
  }

  if (!checkReturn.value) {
    isFalseOrderPopup.value = true; isFalseOrderMsg = '반품 불가 동의를 체크해주세요.'
    return
  }

  generateLoading.value = true

  reportGeneratorRef.value.generate()
}
function payment (reportHistoryDetailId) {
  let paramData
  let pmc = ''
  if (payMethod.value === 'apayAuto') {
    pmc = 'amwaypayaccount'
    paramData = {
      cartId: cartCode.value,
      paymentModeCode: pmc,
      orderName: cartCode.value,
      customerKey: defaultPayment.customerId,
      methodKey: defaultPayment.methodKey,
      installmentPlan: selectedValues.value,
      storeId: defaultPayment.storeId,
      totalPrice: totalPrice.value,
      transactionCode: transactionCode.value,
      reportCode: reportCode.value,
      reportHistoryDetailId
    }
  } else if (payMethod.value === 'apayCard') {
    pmc = 'amwaypaycard'
    paramData = {
      cartId: cartCode.value,
      paymentModeCode: pmc,
      orderName: cartCode.value,
      customerKey: defaultPayment.customerId,
      methodKey: defaultPayment.methodKey,
      installmentPlan: selectedValues.value,
      storeId: defaultPayment.storeId,
      totalPrice: totalPrice.value,
      transactionCode: transactionCode.value,
      reportCode: reportCode.value,
      reportHistoryDetailId
    }
  } else if (payMethod.value === 'basicAuto') {
    pmc = 'directdebit'
    paramData = {
      cartId: cartCode.value,
      paymentModeCode: pmc,
      totalPrice: totalPrice.value,
      transactionCode: transactionCode.value,
      reportCode: reportCode.value,
      reportHistoryDetailId
    }
  } else if (payMethod.value === 'basicCard') {
    pmc = 'creditcard'
    paramData = {
      cartId: cartCode.value,
      paymentModeCode: pmc,
      cardCompanyCode: cardCompanyCode.value,
      installmentPlan: installmentPlan.value,
      cardNumber: cardNumber1.value + cardNumber2.value + cardNumber3.value + cardNumber4.value,
      validToYear: validToYear.value,
      validToMonth: validToMonth.value,
      cardAuthNumber: cardAuthNumber.value,
      cardPassword: cardPassword.value,
      totalPrice: totalPrice.value,
      transactionCode: transactionCode.value,
      reportCode: reportCode.value,
      reportHistoryDetailId
    }
  }

  // 배송지 정보 설정
  axios.post(delivery_address_api, {
    cartId: cartCode.value,
    addressId: defaultAddress.id,
    deliveryMessage: defaultAddress.message
  }, { headers: header })
    .then(res1 => {
      if (res1.data.data.code === 'success') {
        // 주문
        axios.post(order_pcap_api, paramData, { headers: header })
          .then(res3 => {
            if (res3.data.data.status === 'PAYMENT_CAPTURED') {
              orderCode.value = res3.data.data.code
              // 현금영수증 처리
              if (payMethod.value === 'apayAuto') {
                if (aPayCashSelectYN.value) {
                  axios.post(cash_receipt_api, {
                    receiptNumberType: aPayCashSelectType.value,
                    receiptIssuanceNumber: aPayCashSelectTypeValue.value,
                    orderCode: orderCode.value
                  }, { headers: header })
                    .then(res4 => {
                      showSpinner.value = false
                      // router.push({ name: 'MyPagePrintList' })
                      router.replace({
                        path: '/order/detail/' + orderCode.value + '/' + transactionCode.value,
                        state: { analysisId }
                      })
                    })
                    .catch(error4 => {
                      console.log(error4)
                    })
                }
              } else if (payMethod.value === 'basicAuto') {
                if (cashSelectYN.value !== '') {
                  axios.post(cash_receipt_api, {
                    receiptNumberType: cashSelectType.value,
                    receiptIssuanceNumber: cashSelectTypeValue.value,
                    orderCode: orderCode.value
                  }, { headers: header })
                    .then(res4 => {
                      showSpinner.value = false
                      // router.push({ name: 'MyPagePrintList' })
                      router.replace({
                        path: '/order/detail/' + orderCode.value + '/' + transactionCode.value,
                        state: { analysisId }
                      })
                    })
                    .catch(error4 => {
                      console.log(error4)
                    })
                }
              }

              showSpinner.value = false
              router.replace({
                path: '/order/detail/' + orderCode.value + '/' + transactionCode.value,
                state: { analysisId }
              })
            } else {
              isFalseOrderPopup.value = true
              isFalseOrderMsg = res3.data.data.paymentDetails.paymentInfos[0].statusDetails
              showSpinner.value = false
            }
          })
          .catch(error3 => {
            console.log(error3)
            showSpinner.value = false
            isFalseOrderPopup.value = true
            isFalseOrderMsg = error3.response.data.message
          })
      }
    })
    .catch(error1 => {
      console.log(error1)
    })
}

function fileMd5 (file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.onloadend = function (e) {
      // console.log('e.target.result :', e.target.result)
      const wordArr = CryptoJS.lib.WordArray.create(e.target.result)
      const hash = CryptoJS.MD5(wordArr).toString()
      // console.log('hash :', hash)
      resolve(hash)
    }
    // 파일 사이즈가 너무 크면 오류 발생하므로 파일을 적당한 크기로 만듦
    const fileSize = file.size
    // 10MB 보다 클 경우 10MB로 설정
    const hashSize = Math.min(fileSize, 1024 * 1024 * 10)
    if (fileSize > hashSize) {
      file = file.slice(0, hashSize)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

const handleGenerateProgress = (index) => {
  const totalPage = 26

  progress.value = (index / totalPage) * 100
}

// const checkBank = (bankCode) => {
//   console.log('bankCode :::::::::::::::: ', bankCode)
//   switch (bankCode) {
//     case '농협':
//       return 'b01'
//     case '우리':
//       return 'b02'
//     case '신한':
//       return 'b03'
//     case '국민':
//       return 'b04'
//     case '하나':
//       return 'b05'
//     case '씨티':
//       return 'b06'
//     case '전북':
//       return 'b07'
//     case '산업':
//       return 'b08'
//     case '새마을':
//       return 'b09'
//     case '수협':
//       return 'b10'
//     case '신협':
//       return 'b11'
//     case '우체국':
//       return 'b12'
//     case '케이':
//       return 'b13'
//     case '카카오뱅크':
//       return 'b14'
//     case '저축':
//       return 'b15'
//     case '경남':
//       return 'b16'
//     case '부산':
//       return 'b16'
//     case '기업':
//       return 'b17'
//     case 'SC제일':
//       return 'b18'
//     case '대구':
//       return 'b19'
//     case '산림':
//       return 'b20'
//     case '토스':
//       return 'b21'
//     case 'BC':
//       return 'c22'
//     case '현대':
//       return 'c23'
//     case '롯데':
//       return 'c24'
//     case '삼성':
//       return 'c25'
//   }
// }
//
// const bankStyle = computed(() => {
//   // v-for="item in userData.primary ? (payUserNewDatas.cards.masterParty) : (payUserNewDatas.cards.subParty)"
//   const myCard = userData.primary ? payUserNewDatas.value.cards.masterParty : payUserNewDatas.value.cards.subParty
//   console.log('userData.primary :::::::::::: ', userData.primary)
//   console.log('myCard :::::::::::: ', myCard)
//   for (let i = 0; i < myCard.length; i++) {
//     checkBank(myCard[i].bankCode)
//     console.log('myCard[i].bankCode :::::::::::: ', myCard[i].bankCode)
//   }
// })

onMounted(async () => {
  await dataSetting()
  await getAnalysisComplete()
})

onBeforeUnmount(() => {
  store.dispatch('order/setAccessible', false)
})

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
            <h2 class="pay-tit">{{ defaultAddress.name }} <span
              class="label--normal pay-delivery-address--label"
              v-if="defaultAddress.defaultAddress">기본배송지</span></h2>
            <button @click="popupDeliverySelect = true" type="button" class="btn--small">변경</button>

            <PopupDeliverySelect
              v-show="popupDeliverySelect"
              @closePop="closePopDelivery"
              @choiceAddressSet="choiceAddressSet" />

          </div>
          <div class="pay-delivery-address--txt">
            {{ defaultAddress.address }} <br />
            휴대폰 : {{ defaultAddress.phone }} <br />
            배송메시지 : {{ defaultAddress.message }}
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
              <div class="tooltip pay-method--user-select"> <!--툴팁의 위치를 잡기위해 한번 더 싸줌-->
                <span class="pay-tit2">결제하실 사업자</span>
              </div>

              <div class="pay-method--name">
                {{ userData.name }}
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
                    @slide-change="changePayment"
                    :slides-per-view="1.2"
                    :centered-slides="true"
                    :space-between="15"
                    :pagination="{
                      clickable: true,
                    }"
                    :breakpoints="{
                      '0': {
                        slidesPerView: 1,
                      },
                      '758': {
                        slidesPerView: 2,
                      },
                      '1010': {
                        slidesPerView: 3,
                      },
                    }"
                    :modules="modules"
                    class="pay-method--swiper"
                    :class="userData.primary ? (payUserNewDatas.accounts.masterParty.length === 0 ? 'blank' : '') : (payUserNewDatas.accounts.subParty.length === 0 ? 'blank' : '')">
                    <swiper-slide
                      v-for="item in userData.primary ? (payUserNewDatas.accounts.masterParty) : (payUserNewDatas.accounts.subParty)"
                      :class="item.bankCode">
                      <div class="pay-method--icon" />
                      <div class="pay-method--desc">
                        <div class="pay-method--card-txt">
                          {{ item.bank }} <br />
                          {{ userData.name }}
                        </div>
                        {{ item.accountNumber }}
                      </div>
                    </swiper-slide>
                  </swiper>

                  <div
                    v-if="userData.primary ? (payUserNewDatas.accounts.masterParty.length === 0) : (payUserNewDatas.accounts.subParty.length === 0)"
                    class="pay-method--blank">
                    <div>
                      등록된 A Pay 계좌/카드가 없습니다 <br />
                      암웨이 홈페이지에서 등록 후 사용해주세요.
                    </div>
                  </div>

                  <!--                  <OrderNpayCashReceipt/>-->

                  <div> <!--현금영수증-->

                    <div class="align--between">
                      <div class="cashApply--tit">
                        <span>{{ aPayCashSelectYN ? (aPayCashSelectType === '1' ? '휴대폰번호' : '현금영수증 카드번호'):'' }}</span>
                        <span class="cashApply--num">{{ aPayCashSelectTypeValue }}</span>
                      </div>
                      <div class="cashApply--btn">
                        <button @click="popupApayCashReceipt = true" class="cashApply btn--big2" type="button">현금영수증 신청</button>
                      </div>
                    </div>

                    <PopupCashReceipt
                      v-if="popupApayCashReceipt"
                      @closePop="closeApayPopCashReceipt"
                      @confirmInfo="aPayConfirmInfo" />

                  </div>

                  <!--                  <OrderNpayApply v-if="payUserDatas[userSelect].autoInfo.length === 0"/>-->

                </div>

                <div v-show="payMethod === 'apayCard'"> <!--a pay 카드-->

                  <swiper
                    @slide-change="changePayment"
                    :slides-per-view="1.2"
                    :centered-slides="true"
                    :space-between="15"
                    :pagination="{
                      clickable: true,
                    }"
                    :breakpoints="{
                      '0': {
                        slidesPerView: 1,
                      },
                      '758': {
                        slidesPerView: 2,
                      },
                      '1010': {
                        slidesPerView: 3,
                      },
                    }"
                    :modules="modules"
                    class="pay-method--swiper"
                    :class="userData.primary ? (payUserNewDatas.cards.masterParty.length === 0 ? 'blank' : '') : (payUserNewDatas.cards.subParty.length === 0 ? 'blank' : '')">
                    <swiper-slide
                      v-for="item in userData.primary ? (payUserNewDatas.cards.masterParty) : (payUserNewDatas.cards.subParty)"
                      :class="item.bankCode">
                      <div class="pay-method--icon" />
                      <div class="pay-method--desc">
                        <div class="pay-method--card-txt">
                          {{ item.cardName }} <br />
                          {{ userData.name }}
                        </div>
                        {{ item.cardNumber }}
                      </div>
                    </swiper-slide>
                  </swiper>

                  <!--                  <OrderNpayApply v-if="payUserDatas[userSelect].cardInfo.length === 0"/>-->

                  <div
                    v-if="userData.primary ? (payUserNewDatas.cards.masterParty.length === 0) : (payUserNewDatas.cards.subParty.length === 0)"
                    class="pay-method--blank">
                    <div>
                      등록된 A Pay 계좌/카드가 없습니다 <br />
                      암웨이 홈페이지에서 등록 후 사용해주세요.
                    </div>
                  </div>

                  <select
                    name="onpInstall"
                    v-model="selectedValues"
                    @change="changeInstallmentPlan"
                    class="pay-method--apay-install">
                    <option value="0">일시불</option>
                    <option value="1">1개월</option>
                    <option value="2">2개월</option>
                    <option value="3">3개월</option>
                    <option value="4">4개월</option>
                    <option value="5">5개월</option>
                    <option value="6">6개월</option>
                    <option value="7">7개월</option>
                    <option value="8">8개월</option>
                    <option value="9">9개월</option>
                    <option value="10">10개월</option>
                    <option value="11">11개월</option>
                    <option value="12">12개월</option>
                  </select>

                </div>

              </div>
            </div>

            <div
              class="pay-method--pay normal"
              :class="payMethod === 'basicAuto' ? 'select' : payMethod === 'basicCard' ? 'select' : ''">
              <!--다른 결제수단 (자동이체, 신용카드)-->
              <h3 @click="funcPayMethod('basicAuto')" class="other--pay">
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
                  <div class="align--horiz input orderNpayAuto">
                    <label for="autoTransPw">
                      <strong>자동이체 비밀번호</strong>
                    </label>
                    <input
                      v-model="debitPwd"
                      type="password"
                      name=""
                      id="autoTransPw"
                      placeholder="자동이체 비밀번호 6자리"
                      maxlength="6"
                      oninput="this.value = this.value.replace(/[^0-9.]/g, '')" />
                  </div>
                  <p class="pay-method--basicAuto--desc">
                    * 자동이체는 계좌 등록 후 사용이 가능합니다.
                  </p>
                  <div>
                    <div class="align--right">

                      <button @click="toggleAutoTransferInfo = !toggleAutoTransferInfo" type="button" class="btn--txt">
                        <span style="display: inline-block; margin-right: .5rem;">자동이체안내</span>
                        <span v-if="!toggleAutoTransferInfo"><img
                          src="/img/ic_arrow_down_black.svg"
                          alt=""
                          style="filter: invert(37%) sepia(78%) saturate(2022%) hue-rotate(214deg) brightness(105%) contrast(91%);" /></span>
                        <span v-else-if="toggleAutoTransferInfo"><img
                          src="/img/ic_arrow_down_black.svg"
                          alt=""
                          style="filter: invert(37%) sepia(78%) saturate(2022%) hue-rotate(214deg) brightness(105%) contrast(91%); transform: rotate(180deg)" /></span>
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

                  <div class="space--top-default"> <!--현금영수증-->
                    <div class="align--between">
                      <div class="cashApply--tit">
                        <span>{{ cashSelectYN ? (cashSelectType === '1' ? '휴대폰번호' : '현금영수증 카드번호'):'' }}</span>
                        <span class="cashApply--num">{{ cashSelectTypeValue }}</span>
                      </div>
                      <div class="cashApply--btn">
                        <button @click="popupCashReceipt = true" class="cashApply btn--big2" type="button">현금영수증 신청</button>
                      </div>
                    </div>

                    <PopupCashReceipt v-if="popupCashReceipt" @closePop="closePopCashReceipt" @confirmInfo="confirmInfo" />

                  </div>

                </div>

                <div v-show="payMethod === 'basicCard'" class="space--top-default"> <!--신용카드-->
                  <h4>신용/체크카드</h4>
                  <div class="responsive--half">
                    <select v-model="cardCompanyCode" name="onpCardSelect" class="w--wide responsive--half">
                      <option value="C04">현대카드</option>
                      <option value="C0B">국민카드</option>
                      <option value="C03">신한카드(구LG카드)</option>
                      <option value="C02">삼성카드</option>
                      <option value="C09">광주카드</option>
                      <option value="C0G">기타카드</option>
                      <option value="C05">롯데카드</option>
                      <option value="C0A">비씨카드</option>
                      <option value="C0C">산업은행</option>
                      <option value="C08">수협카드</option>
                      <option value="C06">신한(제주)카드</option>
                      <option value="C07">씨티(한미)카드</option>
                      <option value="C01">외환카드</option>
                      <option value="C10">전북카드</option>
                      <option value="C11">하나카드</option>
                      <option value="C12">NH농협</option>
                      <option value="C14">우리카드</option>
                    </select>
                    <select v-model="installmentPlan" name="onpCardSelect2" class="w--wide responsive--half">
                      <option value="0">일시불</option>
                      <option value="1">1개월</option>
                      <option value="2">2개월</option>
                      <option value="3">3개월</option>
                      <option value="4">4개월</option>
                      <option value="5">5개월</option>
                      <option value="6">6개월</option>
                      <option value="7">7개월</option>
                      <option value="8">8개월</option>
                      <option value="9">9개월</option>
                      <option value="10">10개월</option>
                      <option value="11">11개월</option>
                      <option value="12">12개월</option>
                    </select>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpCardNum" style="width: 13rem;">
                        <span>카드번호</span>
                      </label>
                      <div class="align--horiz ea4">
                        <input
                          v-model="cardNumber1"
                          @input="goNextInput($event, 4)"
                          type="text"
                          name="onpCardNum1"
                          id="onpCardNum"
                          maxlength="4" />
                        <!--240117 goNextInput: 4자리 채우면 다음 input으로 넘기기, 바로 다음 input dom임에 주의-->
                        <input
                          v-model="cardNumber2"
                          @input="goNextInput($event, 4)"
                          type="text"
                          name="onpCardNum2"
                          maxlength="4" />
                        <input
                          v-model="cardNumber3"
                          @input="goNextInput($event, 4)"
                          type="text"
                          name="onpCardNum3"
                          maxlength="4" />
                        <input
                          v-model="cardNumber4"
                          @input="goNextInput($event, 4, onpExpPeri1)"
                          type="text"
                          name="onpCardNum4"
                          maxlength="4" />
                      </div>
                    </div>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpExpPeri" style="width: 13rem;">
                        <span>유효기간</span>
                      </label>
                      <div class="align--horiz ea2">
                        <input
                          v-model="validToMonth"
                          @input="goNextInput($event, 2)"
                          type="text"
                          name="onpExpPeri1"
                          id="onpExpPeri"
                          placeholder="월(MM)"
                          maxlength="2"
                          ref="onpExpPeri1" />
                        <input
                          v-model="validToYear"
                          @input="goNextInput($event, 2, onpCardPw)"
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
                        @input="goNextInput($event, 2, onpBirth)"
                        v-model="cardPassword"
                        type="password"
                        id="onpCardPw"
                        placeholder="비밀번호 앞 2자리"
                        maxlength="2"
                        ref="onpCardPw" />
                    </div>
                    <div class="align--horiz input space--top-small responsive--half">
                      <label for="onpBirth" style="width: 13rem;">
                        <span>생년월일</span>
                      </label>
                      <input
                        v-model="cardAuthNumber"
                        type="text"
                        id="onpBirth"
                        placeholder="주민번호 앞 6자리"
                        maxlength="6"
                        ref="onpBirth" />
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
                    <dd class="orderProduct--price1">{{ totalPriceShow }}원</dd>
                    <dt>소계</dt>
                    <dd class="orderProduct--priceT"><strong>{{ totalPriceShow }}</strong>원</dd>
                  </dl>
                </div>
              </div>
            </div>

          </div>

        </section>
        <div class="orderProduct--desc space--bottom-default">
          <span>ㆍ</span>
          <span />
        </div>

      </div>
      <div>

        <div class="space--top-small2 responsive">

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
                      <div style="width: 20rem;">마이웰니스랩 리포트 인쇄</div>
                      {{totalPriceShow}}원
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
                <dd>{{totalPriceShow}}원</dd>
              </dl>
              <dl class="pay-amount--item space--top-small">
                <dt>총 결제금액</dt>
                <dd><strong class="txt--big2">{{totalPriceShow}}원</strong></dd>
              </dl>
            </div>
          </section>

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
                    <strong class="tit--small2 align--vertical2">주문내용 확인 및 결제 진행 동의</strong>
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

                  </li>
                </ul>
              </li>
            </ul>

            <hr />

            <ul v-show="payMethod === 'apayAuto' || payMethod === 'apayCard' || (payMethod === 'basicCard' && cardCompanyCode !== 'C04')" class="termsAgree--ul">
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
          <button @click="directDebitChk" type="button" class="btn--big2 space--top-default txt--default">
            <span class="txt--small4 txt--blue">총</span> {{totalPriceShow}}
            <span class="txt--small4 txt--blue">원</span> 결제하기
          </button>
        </div>

      </div>
    </div>

  </div>

  <base-popup v-if="isFalseOrderPopup"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          <p class="order--txt">{{isFalseOrderMsg}}</p>
          <div class="AnalyzeDownload--down-pop--btn-wrap">
            <button type="button" @click="isFalseOrderPopup = false" class="btn-pop--green">닫기</button>
          </div>
        </div>
      </div>
    </template>
  </base-popup>

  <ReportGenerator
    v-if="reportData"
    ref="reportGeneratorRef"
    :analyzeData="reportData.analyzeData"
    :surveyData="reportData.surveyData"
    :hasPdfPassword="false"
    :hidePrivacy="true"
    :user="userData"
    @progress="handleGenerateProgress"
    @complete="finish" />
  <ReportGeneratorLoading v-if="generateLoading" :progress="progress" />
  <SpinnerCircle v-if="showSpinner" :txt="spinerTxt" />
</template>

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
