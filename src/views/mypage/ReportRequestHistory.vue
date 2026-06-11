<script setup>
import { onBeforeMount, ref } from 'vue'
import { dateConvert } from '@/assets/js/common'
import router from '@/router'
import * as orderApi from '@/apis/order'
import * as mypageApi from '@/apis/mypage'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const prefix = 'MyPageReportPrintRecord'
const isPc = ref(false)
const data = ref({
  content: {
    reportHistoryList: []
  }
})
const requestParam = ref({
  pageNo: 1,
  perPageNum: 10
})
const totalCount = ref(0)

/**
 * 페이지네이션(pagination)에 사용되어 특정 페이지의 데이터를 가져오는 역할을 합니다.
 * 첫 페이지의 경우 전체 데이터를 교체하고, 그 이후 페이지의 경우 현재 데이터에 더합니다.
 * 추가로 총 결과 개수를 업데이트하며, 이는 페이징 처리에 필요한 정보입니다.
 * @returns {Promise<void>}
 */
const getList = async () => {
  try {
    const response = await mypageApi.getReportHistoryDataList(requestParam.value)

    if (response.data) {
      if (requestParam.value.pageNo === 1) {
        data.value = response.data.content.reportHistoryList
      } else {
        for (const value of response.data.content.reportHistoryList) {
          data.value.push(value)
        }
      }

      totalCount.value = response.data.totalCount
    }
  } catch (e) {
    console.error(e)
  }
}

/* 페이징 버튼 액션 */
const more = () => {
  requestParam.value.pageNo++
  getList()
}

const winWidth = () => {
  isPc.value = window.innerWidth > 920
}

/**
 * 제공된 항목의 속성에 근거하여 영역(인터페이스의 특정 부분, 버튼 등)을 표시할지 여부를 결정합니다.
 *
 * @param {Object} item - 결정을 내리기 위해 필요한 정보가 담긴 객체.
 * 'requestDate', 'paymentCancel', 및 'paymentNo'를 포함합니다.
 */
const areaShow = (item) => {
  const currentDate = new Date(dateConvert(item.requestDate, '-'))
  const addOneMonthDate = new Date(new Date(currentDate.getTime()).setDate(currentDate.getDate() + 30))
  const today = new Date()

  if (today > addOneMonthDate) {
    // 인쇄신청일로부터 30일이 지나면 비활성화
    return false
  } else if (item.paymentCancel !== 0 && item.paymentNo === null) {
    return false
  } else if (item.paymentCancel === 0 && item.paymentNo !== null) {
    if (!(item.paymentNo.indexOf('PR-') !== -1) && !(item.paymentNo.indexOf('PE-') !== -1)) {
      return true
    }
  } else {
    return false
  }
}

function ready (orderCode, transactionCode) {
  router.push('/order/detail/' + orderCode + '/' + transactionCode)
}

/**
 *  트랜잭션 코드와 acode를 사용하여 배송 정보를 갖고오고 상태를 체크하는 함수
 *
 * @param {string} transactionCode - 주문에 대한 트랜잭션 코드
 * @param {string} acode - 배송 대역폭을 체크하는 코드
 *
 * 이 함수는 주문 API의 getDeliveryInfo 메소드를 호출하여
 * 트랜잭션 코드와 acode를 사용해서 배송 정보를 가져옵니다.
 *
 * 만약 반환된 데이터의 resultDto가 null이 아니라면,
 * report_state를 체크하여
 * 만약 그 값이 0 또는 1 이라면 "현재 배송 준비중입니다." 라는 알림을 보여줍니다.
 *
 * 그렇지 않다면, 즉 report_state가 0 또는 1 이 아니라면,
 * moveDelivery 함수를 호출하여 delivery_no 정보를 통해 배송 상태 페이지로 이동합니다.
 *
 */
async function logmeDeliveryinfo (transactionCode, acode) {
  try {
    const response = await orderApi.getDeliveryInfo(transactionCode, acode)

    if (response.data.resultDto !== null) {
      const stateCode = response.data.resultDto.report_state

      if ([0, 1].includes(stateCode)) {
        alert(t('ReportRequestHistory.text8'))
      } else {
        moveDelivery(response.data.resultDto.delivery_no)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

// 택배사이동
const moveDelivery = (deliveryNo) => {
  alert(t('ReportRequestHistory.text9') + deliveryNo)
}

onBeforeMount(() => {
  getList()

  window.addEventListener('scroll', () => { /* 아래 스크롤하면 페이징 늘어나도록 */
    if (!isPc.value) {
      if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
        more()
      }
    }
  })

  winWidth()

  window.addEventListener('resize', () => {
    winWidth()
  })
})
</script>

<template>
  <div :class="prefix + '--wrap'">
    <ul v-if="data.length > 0" class="bull--no">
      <li v-for="item in data" class="MyPageCheckupDataRecord--li">
        <div :class="prefix + '--group'">
          <div class="MyPageCheckupDataRecord--txt">
            <dl class="align--dl">
              <dt class="MyPageCheckupDataRecord--dt" :class="prefix">{{ $t('ReportRequestHistory.text1') }}</dt>
              <dd class="MyPageCheckupDataRecord--dd" :class="prefix">{{ item.requestDate }}</dd>
              <dt class="MyPageCheckupDataRecord--dt" :class="prefix">{{ $t('ReportRequestHistory.text2') }}</dt>
              <dd class="MyPageCheckupDataRecord--dd" :class="prefix">{{ item.analysedDate }}</dd>
            </dl>
          </div>
          <div v-if="areaShow(item)" class="MyPageCheckupDataRecord--arrow-wrap">
            <button
              v-if="false"
              @click="logmeDeliveryinfo(item.transactionCode, item.acode)"
              :disabled="!areaShow(item)"
              type="button"
              :class="prefix + '--btn'">{{ $t('ReportRequestHistory.text3') }}</button>
          </div>
          <span v-if="!areaShow(item)" class="txt--red">{{item.paymentCancel === 1? $t('ReportRequestHistory.text4'):((item.paymentCancel === 2)?$t('ReportRequestHistory.text5'):'')}}</span>

          <div class="MyPageCheckupDataRecord--go">
            <button
              v-if="areaShow(item)"
              @click="ready(item.paymentNo, item.transactionCode)"
              :disabled="!areaShow(item)"
              type="button"
              :aria-label="$t('ReportRequestHistory.text6')"
              class="MyPageCheckupDataRecord--go-order" />
          </div>

        </div>
      </li>
    </ul>
    <div v-else class="MyPageReportPrintRecord--no-data">
      {{ $t('ReportRequestHistory.text7') }}
    </div>
    <div v-if="(data.length < totalCount) && isPc" class="txt--center MyPageCheckupDataRecord--btn">
      <button @click="more" type="button" class="btn--txt3">{{ $t('Common.more') }}</button>
    </div>
  </div>
</template>

<style lang="scss"></style>
