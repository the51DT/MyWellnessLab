<script setup>
import { inject, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import OrderNpayHeader from '@/views/order/OrderNpayHeader.vue'
import { format } from 'date-fns'
import * as orderApi from '@/apis/order'
import { dateConvert } from '@/assets/js/common'

const store = useStore()
const route = useRoute()
const router = useRouter()
const axios = inject('$axios')
const token = store.getters.getToken
const api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/order-detail'
const remove_api = import.meta.env.VITE_GLOB_BASE_API_URL + '/v1/api/user/order/order-remove'

// TODO LYH Start 근시일 중 정리 예정
const header = {
  Authorization: token
}
// TODO END

const data = ref({
  orders: [
    {
      affiliateOrderNumber: '800643200',
      appliedOrderPromotions: [],
      appliedProductPromotions: [],
      calculated: true,
      channel: {
        code: 'MPN'
      },
      code: '180-800643200',
      deliveryAddress: {
        cellphone: '01033333333',
        defaultAddress: false,
        firstName: 'BRENIN',
        id: '9007315582999',
        line1: '영동대로',
        name: '테스트333',
        postalCode: '06078',
        town: '삼성동'
      },
      deliveryCost: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      deliveryMode: {
        code: 'pickup',
        name: '픽업주문'
      },
      deliveryPointOfService: {
        displayName: '분당',
        name: 'bundang'
      },
      deliveryTax: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      entries: [
        {
          aboBasePrice: 0.0,
          deliveryPointOfService: {
            displayName: '분당',
            name: 'bundang'
          },
          displayEntryNumber: 0,
          entryNumber: 0,
          giveAway: false,
          isKitProductOrderEntry: false,
          originalPrice: {
            currencyIso: 'KRW',
            formattedValue: ' 5,000',
            priceType: 'BUY',
            value: 5000.0
          },
          originalTax: {
            currencyIso: 'KRW',
            formattedValue: ' 0',
            priceType: 'BUY',
            value: 0.0
          },
          proRatedPrice: 0.0,
          product: {
            code: '322048K',
            healthFood: false,
            name: '마이웰니스랩리포트인쇄',
            price: {
              amwayValue: {
                baseBusinessVolume: 0.0,
                basePointValue: 0.0,
                businessVolume: 0.0,
                groupBusinessVolume: 0.0,
                groupPointValue: 0.0,
                personalBusinessVolume: 0.0,
                personalPointValue: 0.0,
                pointValue: 0.0,
                volumeabo: 0.0
              },
              currencyIso: 'KRW',
              value: 5000.0
            },
            purchasable: true,
            tax: 0.0,
            url: '/c/p/322048K'
          },
          quantity: 1,
          retailBasePrice: 0.0,
          serialNumbersCodes: [],
          totalPrice: {
            amwayValue: {
              baseBusinessVolume: 0.0,
              basePointValue: 0.0,
              businessVolume: 0.0,
              groupBusinessVolume: 0.0,
              groupPointValue: 0.0,
              personalBusinessVolume: 0.0,
              personalPointValue: 0.0,
              pointValue: 0.0,
              volumeabo: 0.0
            },
            currencyIso: 'KRW',
            value: 5000.0
          },
          updateable: true,
          value: {
            baseBusinessVolume: 0.0,
            basePointValue: 0.0,
            businessVolume: 0.0,
            groupBusinessVolume: 0.0,
            groupPointValue: 0.0,
            personalBusinessVolume: 0.0,
            personalPointValue: 0.0,
            pointValue: 0.0,
            volumeabo: 0.0
          }
        }
      ],
      guid: '10c3d22c-4e73-4bbc-8ebe-68f50f65440c',
      isGroupCombinationOrder: false,
      kitEntries: [],
      net: true,
      orderDiscounts: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      orderTaxDiscount: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      orderType: {
        code: 'MPN',
        label: '마이팩 주문'
      },
      paymentDetails: {
        balanceAmount: 0.0,
        paymentInfos: [
          {
            amount: 5000.0,
            currency: {
              active: true,
              isocode: 'KRW',
              name: '원',
              symbol: '₩'
            },
            date: '2024-01-11T02:25:53+0000',
            paymentInfoLine1: '54802045****888*',
            paymentInfoLine3: '0',
            paymentInfoLine4: '57777789',
            paymentInfoLine5: '삼성카드',
            paymentMode: {
              allowOverpay: false,
              amount: 0.0,
              code: 'amwaypaycard',
              name: 'A Pay 카드 결제',
              repeatableCount: 0,
              usedCount: 0
            },
            paymentStatusCode: 'PAID',
            status: 'CAPTURE',
            transactionCode: '406464000'
          }
        ],
        paymentStatusCode: 'PAID',
        totalPaidAmount: 5000.0
      },
      productDiscounts: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      productTaxDiscount: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      savings: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.00
      },
      site: 'amwaykorea',
      store: 'amwaykorea',
      subTotal: {
        amwayValue: {
          baseBusinessVolume: 0.0,
          basePointValue: 0.0,
          businessVolume: 0.0,
          groupBusinessVolume: 3324730.0,
          groupPointValue: 2010700.0,
          personalBusinessVolume: 1730030.0,
          personalPointValue: 1081900.0,
          pointValue: 0.0,
          volumeabo: 0.0
        },
        currencyIso: 'KRW',
        formattedValue: ' 5,000',
        priceType: 'BUY',
        value: 5000.0
      },
      totalDiscountWithTax: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.00
      },
      totalDiscounts: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      totalItems: 1,
      totalPrice: {
        amwayValue: {
          baseBusinessVolume: 0.0,
          basePointValue: 0.0,
          businessVolume: 0.0,
          groupBusinessVolume: 3324730.0,
          groupPointValue: 2010700.0,
          personalBusinessVolume: 1730030.0,
          personalPointValue: 1081900.0,
          pointValue: 0.0,
          volumeabo: 0.0
        },
        currencyIso: 'KRW',
        formattedValue: ' 5,000',
        priceType: 'BUY',
        value: 5000.0
      },
      totalPriceWithTax: {
        amwayValue: {
          baseBusinessVolume: 0.0,
          basePointValue: 0.0,
          businessVolume: 0.0,
          groupBusinessVolume: 3324730.0,
          groupPointValue: 2010700.0,
          personalBusinessVolume: 1730030.0,
          personalPointValue: 1081900.0,
          pointValue: 0.0,
          volumeabo: 0.0
        },
        currencyIso: 'KRW',
        formattedValue: ' 5,000',
        priceType: 'BUY',
        value: 5000.0
      },
      totalTax: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.0
      },
      totalTaxDiscount: {
        currencyIso: 'KRW',
        formattedValue: ' 0',
        priceType: 'BUY',
        value: 0.00
      },
      totalWeight: 0.0,
      user: {
        name: 'BRENIN',
        uid: '7480001'
      },
      value: {
        baseBusinessVolume: 0.0,
        basePointValue: 0.0,
        businessVolume: 0.0,
        groupBusinessVolume: 3324730.0,
        groupPointValue: 2010700.0,
        personalBusinessVolume: 1730030.0,
        personalPointValue: 1081900.0,
        pointValue: 0.0,
        volumeabo: 0.0
      },
      volumeABOAccount: {
        accountType: 'AMWAY BUSINESS OWNER',
        accountTypeCode: 'AMWAYBUSINESSNATURE_1',
        entryDate: '2012-05-31T15:00:00+0000',
        name: 'LASHON RONA H RANDAL',
        nameWithParties: 'BRENIN&RANDAL',
        qualificationLevel: {
          code: 'QualificationLevelTypeEnum_009'
        },
        saleTypeCode: 'A',
        status: 'ACTIVE',
        uid: '7480001'
      },
      warehouse: '01',
      cancellable: false,
      consignments: [
        {
          code: '501094972',
          deliveryPointOfService: {
            address: {
              defaultAddress: false,
              id: '8803728031767',
              line1: '구미동',
              line2: '159',
              name: '',
              phone: '031-786-1190',
              postalCode: '13636',
              town: '경기도 성남시 분당구'
            },
            displayName: '분당',
            geoPoint: {
              latitude: 37.339977,
              longitude: 127.106794
            },
            name: 'bundang'
          },
          entries: [
            {
              orderEntry: {
                aboBasePrice: 0.0,
                deliveryPointOfService: {
                  displayName: '분당',
                  name: 'bundang'
                },
                entryNumber: 0,
                giveAway: false,
                isKitProductOrderEntry: false,
                originalPrice: {
                  currencyIso: 'KRW',
                  formattedValue: ' 5,000',
                  priceType: 'BUY',
                  value: 5000.0
                },
                originalTax: {
                  currencyIso: 'KRW',
                  formattedValue: ' 0',
                  priceType: 'BUY',
                  value: 0.0
                },
                proRatedPrice: 0.0,
                product: {
                  code: '322048K',
                  healthFood: false,
                  name: '마이웰니스랩리포트인쇄',
                  price: {
                    amwayValue: {
                      baseBusinessVolume: 0.0,
                      basePointValue: 0.0,
                      businessVolume: 0.0,
                      groupBusinessVolume: 0.0,
                      groupPointValue: 0.0,
                      personalBusinessVolume: 0.0,
                      personalPointValue: 0.0,
                      pointValue: 0.0,
                      volumeabo: 0.0
                    },
                    currencyIso: 'KRW',
                    value: 5000.0
                  },
                  purchasable: true,
                  tax: 0.0,
                  url: '/c/p/322048K'
                },
                quantity: 1,
                retailBasePrice: 0.0,
                serialNumbersCodes: [],
                totalPrice: {
                  currencyIso: 'KRW',
                  value: 5000.0
                },
                updateable: true,
                value: {
                  baseBusinessVolume: 0.0,
                  basePointValue: 0.0,
                  businessVolume: 0.0,
                  groupBusinessVolume: 0.0,
                  groupPointValue: 0.0,
                  personalBusinessVolume: 0.0,
                  personalPointValue: 0.0,
                  pointValue: 0.0,
                  volumeabo: 0.0
                }
              },
              quantity: 1,
              shippedQuantity: 1
            }
          ],
          isBackOrder: false,
          shippingAddress: {
            cellphone: '01033333333',
            defaultAddress: false,
            firstName: 'BRENIN',
            id: '9007315582999',
            line1: '영동대로',
            name: '테스트333',
            postalCode: '06078',
            town: '삼성동'
          },
          status: 'READY_FOR_PICKUP'
        }
      ],
      created: '2024-01-11T02:25:52+0000',
      deductionNumber: '50238638',
      guestCustomer: false,
      promotionResultActions: [],
      receiptInfo: {
        printInvoicePrice: true,
        printInvoicePvBv: true,
        receiptNumber: ''
      },
      status: 'READY',
      statusDisplay: 'pickupReady',
      totalUnitCount: 1,
      unconsignedEntries: [],
      weight: 0.39
    }
  ]
})
const tab = ref(0)
const formatDate = (date) => {
  return dateConvert(date, '.')
}

const getData = () => {
  // console.log(history.state.analysisId)
  axios.get(api, {
    headers: header,
    params: { code: route.params.orderCode }
  })
    .then(res => {
      data.value = res.data.data
    })
    .catch(error => {
      console.log(error)
    })
}

async function orderRemove (code) {
  if (confirm('결제 취소를 하시겠습니까?')) {
    try {
      const response = await orderApi.paymentCancel(code, route.params.transactionCode)
      const responseCode = response.info.code

      if (responseCode === '0000') {
        alert('결제 취소가 완료됐습니다.')
        router.back()
      }
    } catch (e) {
      console.error(e)
      if (e.response.data != null && e.response.data.info != null) {
        alert(e.response.data.message)
      }
    }
  }
}

onBeforeMount(() => {
  getData()
})

</script>

<template>
  <div class="orderNpay">
    <order-npay-header> <!--페이지 제목-->
      <template v-slot:title>
        리포트 주문상세
      </template>
    </order-npay-header>
    <div class="space--default">
      <h2 class="pay-tit space--bottom-default">마이웰니스 랩</h2>
      <button
        @click="tab = 0"
        class="btn--tab"
        :class="!tab ? 'active' : ''"
        type="button">주문서</button>
      <button
        @click="tab = 1"
        class="btn--tab"
        :class="tab ? 'active' : ''"
        type="button">주문내역</button>
      <div v-if="!tab" class="space--top-default">
        <dl class="list--dl">
          <dt>주문제품</dt>
          <dd>{{ data.orders[0].entries[0].product.name }}</dd> <!--임시 네이밍-->
          <dt>신청번호</dt>
          <dd>{{ data.orders[0].affiliateOrderNumber }}</dd>
          <dt>신청일</dt>
          <dd>{{ formatDate(data.orders[0].created) }}</dd>
          <dt>상태</dt>
          <dd>{{ data.orders[0].status }}</dd>
          <dt>구성</dt>
          <dd>{{ data.orders[0].entries[0].product.name }}</dd>
          <dt>금액</dt>
          <dd><strong>{{ data.orders[0].entries[0].product.price.value }} 원</strong></dd>
        </dl>
        <h2 class="tit--default space--top-default">제품정보</h2>
        <div class="product-detail">
          <img
            src="https://mpn.dev.amway.co.kr/static/images/thumbs/missing.jpg"
            :alt="data.orders[0].entries[0].product.name" />
          <strong>{{ data.orders[0].entries[0].product.name }}</strong>
        </div>
      </div>

      <div v-else-if="tab">
        <div class="ond-style">
          <strong>{{ data.orders[0].code }}</strong>
          <span>{{ formatDate(data.orders[0].created) }}</span>
        </div>
        <div class="align--between space--top-default">
          <h2 class="tit--default">리포트 결제 완료</h2>
          <div />
        </div>
        <dl class="list--dl">
          <dt>금액</dt>
          <dd>{{ data.orders[0].entries[0].product.price.value }}</dd>
          <dt>배송지주소</dt>
          <dd>{{ data.orders[0].deliveryAddress.formattedAddress }}</dd>
        </dl>
        <div class="space--top-default align--center">
          <button
            v-if="data.orders[0].cancellable === true"
            @click="orderRemove(data.orders[0].code)"
            type="button"
            class="btn--small">결제취소</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";

dt {
  width: 30%;
}

dd {
  width: 70%;
}

@media (min-width: 1400px) {
  dt {
    width: 15%;
  }

  dd {
    width: 35%;
  }
}</style>
