<script setup>
import { go } from '@/assets/js/common'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useBodyCompositionAPI } from '@/composables/useBodyCompositionAPI'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const store = useStore()
const isPc = ref(false)
const data = reactive({ target: [] })
const totalCount = ref(0)
const { getBodyCompositionData } = useBodyCompositionAPI()

/**
 * connectType에 따라 적절한 텍스트를 반환하는 함수입니다.
 *
 * @function getConnectTypeText
 * @param {string} connectType - 연결 타입 (INBODY, BODYKEY, CUSTOM)
 * @returns {string} 표시할 텍스트
 */
const getConnectTypeText = (connectType) => {
  switch (connectType) {
    case 'INBODY':
      return 'myWellnessLAB'
    case 'BODYKEY':
      return t('MyPageBodyCompositionDataRecord.bodyKey')
    case 'CUSTOM':
      return t('MyPageBodyCompositionDataRecord.directInput')
    default:
      return connectType || ''
  }
}

/**
 * connectType에 따라 적절한 배경색을 반환하는 함수입니다.
 *
 * @function getConnectTypeColor
 * @param {string} connectType - 연결 타입 (INBODY, BODYKEY, CUSTOM)
 * @returns {string} 배경색 코드
 */
const getConnectTypeColor = (connectType) => {
  switch (connectType) {
    case 'INBODY':
      return '#d9f0ed'
    case 'BODYKEY':
      return '#d8ffe0'
    case 'CUSTOM':
      return '#e6e6ff'
    default:
      return '#f0f0f0'
  }
}

/**
 * connectType에 따라 적절한 폰트 색상을 반환하는 함수입니다.
 *
 * @function getConnectTypeTextColor
 * @param {string} connectType - 연결 타입 (INBODY, BODYKEY, CUSTOM)
 * @returns {string} 폰트 색상 코드
 */
const getConnectTypeTextColor = (connectType) => {
  switch (connectType) {
    case 'INBODY':
      return '#1db196'
    case 'BODYKEY':
      return '#01865f'
    case 'CUSTOM':
      return '#5353cb'
    default:
      return '#000000'
  }
}

/**
 * 날짜 문자열에서 날짜 부분만 반환하는 함수입니다.
 * ISO 형식("2025-12-10T10:56:19")과 기존 형식("2025.12.10 오후 05:32") 모두 처리
 *
 * @function formatDateOnly
 * @param {string} dateString - 날짜 문자열 (예: "2024.01.15 오후 14:30" 또는 "2025-12-10T10:56:19")
 * @returns {string} 날짜만 포함된 문자열 (예: "2024.01.15" 또는 "2025.12.10")
 */
const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  
  // ISO 형식: "2025-12-10T10:56:19" 또는 "2025-12-10T10:56:19.000Z"
  const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    return `${isoMatch[1]}.${isoMatch[2]}.${isoMatch[3]}`
  }
  
  // 기존 형식: "2025.12.10 오후 05:32"
  const dateMatch = dateString.match(/^([\d.]+)/)
  return dateMatch ? dateMatch[1] : ''
}

/**
 * 날짜 문자열에서 시간 부분만 반환하는 함수입니다.
 * ISO 형식("2025-12-10T10:56:19")과 기존 형식("2025.12.10 오후 05:32") 모두 처리
 *
 * @function formatTimeOnly
 * @param {string} dateString - 날짜 문자열 (예: "2024.01.15 오후 14:30" 또는 "2025-12-10T10:56:19")
 * @returns {string} 시간만 포함된 문자열 (예: "오후 14:30")
 */
const formatTimeOnly = (dateString) => {
  if (!dateString) return ''
  
  // ISO 형식: "2025-12-10T10:56:19" 또는 "2025-12-10T10:56:19.000Z"
  const isoTimeMatch = dateString.match(/T(\d{2}):(\d{2}):(\d{2})/)
  if (isoTimeMatch) {
    let hour = parseInt(isoTimeMatch[1])
    const minute = isoTimeMatch[2]
    
    // 24시간 형식을 12시간 형식으로 변환
    const period = hour >= 12 ? t('MyPageBodyCompositionDataRecord.pm') : t('MyPageBodyCompositionDataRecord.am')
    if (hour > 12) {
      hour -= 12
    } else if (hour === 0) {
      hour = 12
    }
    
    const formattedHour = hour.toString().padStart(2, '0')
    return `${period} ${formattedHour}:${minute}`
  }
  
  // 기존 형식: "2025.12.10 오후 05:32"
  // 한글 "오전/오후" 또는 영문 "AM/PM" 처리
  const koreanTimeMatch = dateString.match(/(오전|오후)\s+(\d{1,2}):(\d{2})/)
  const englishTimeMatch = dateString.match(/(AM|PM)\s+(\d{1,2}):(\d{2})/)
  
  let timeMatch = koreanTimeMatch || englishTimeMatch
  if (!timeMatch) {
    return ''
  }
  
  const period = timeMatch[1] // 오전/오후 또는 AM/PM
  let hour = parseInt(timeMatch[2]) // 시간
  const minute = timeMatch[3] // 분
  
  // AM/PM을 오전/오후로 변환 (한글인 경우 그대로 사용)
  let periodText = period
  if (period === 'AM') {
    periodText = t('MyPageBodyCompositionDataRecord.am')
  } else if (period === 'PM') {
    periodText = t('MyPageBodyCompositionDataRecord.pm')
  }
  
  // 12시간 형식으로 변환 (PM/오후인 경우 12를 더하되, 12시는 그대로 유지)
  if ((period === 'PM' || period === '오후') && hour !== 12) {
    hour += 12
  } else if ((period === 'AM' || period === '오전') && hour === 12) {
    hour = 0
  }
  
  // 2자리 형식으로 포맷팅
  const formattedHour = hour.toString().padStart(2, '0')
  
  return `${periodText} ${formattedHour}:${minute}`
}

/**
 * API를 통해 체성분 데이터 목록을 가져오는 함수입니다.
 *
 * @async
 * @function getList
 *
 * useBodyCompositionAPI의 getBodyCompositionData를 사용하여 체성분 데이터 목록을 가져옵니다.
 * 응답 데이터가 존재하면 체성분 데이터를 설정하고,
 * 예외 발생 시 콘솔에 로그를 출력합니다.
 */
const getList = async () => {
  try {
    // 배열로 전달하는 것이 더 명확하고 안전함
    const types = ['INBODY', 'CUSTOM','BODYKEY']
    const response = await getBodyCompositionData(types)

    if (response && Array.isArray(response)) {
      data.target = response
      totalCount.value = response.length
    }
  } catch (e) {
    console.error(e)
  }
}

// 페이징 버튼 액션 (체성분 데이터는 페이징이 없으므로 제거)
// const more = () => {
//   requestParam.value.pageNo++
//   getList()
// }

/**
 * 상세 페이지로 이동하는 함수입니다.
 * item 객체를 Vuex store에 저장하여 상세 페이지에서 사용할 수 있도록 합니다.
 *
 * @function goToDetail
 * @param {Object} item - 전달할 아이템 객체
 */
const goToDetail = (item) => {
  
  // Vuex store에 item 저장
  store.dispatch('bodyComposition/setSelectedItem', item)
  
  // 저장 확인
  const savedItem = store.getters['bodyComposition/getSelectedItem']
  
  router.push({
    name: 'MyPageBodyCompositionDetail'
  })
}

// pc인지 확인
const winWidth = () => {
  isPc.value = window.innerWidth > 920
}

onMounted(() => {
  getList()

  winWidth()

  window.addEventListener('resize', () => {
    winWidth()
  })
})
</script>

<template>
  <div class="MyPageBodyCompositionDataRecord">
    <ul class="bull--no">
      <li v-for="item in data.target" class="MyPageBodyCompositionDataRecord--li">
        <a
          @click="goToDetail(item)"
          href="javascript: void(0);"
          class="align--between">
          <div class="MyPageBodyCompositionDataRecord--txt">
            <div class="tag-wrap">
              <span
               class="tag"
               :style="{ backgroundColor: getConnectTypeColor(item.connectType), color: getConnectTypeTextColor(item.connectType) }">{{ getConnectTypeText(item.connectType) }}</span>
            </div>
            <dl class="MyPageBodyCompositionDataRecord--dl">
               <dt class="MyPageBodyCompositionDataRecord--dt">{{ $t('MyPageBodyCompositionDataRecord.measurementDate') }} : </dt>
               <dd class="MyPageBodyCompositionDataRecord--dd" style="margin-left: 0.5rem;">
                 {{ formatDateOnly(item.surveyDate) }}
                 <span class="MyPageBodyCompositionDataRecord--dt" style="margin-left: 0.5rem;">{{ formatTimeOnly(item.surveyDate) }}</span>
               </dd>
             </dl>
          </div>
          <div class="MyPageBodyCompositionDataRecord--arrow-wrap">
            <div class="MyPageBodyCompositionDataRecord--arrow" />
          </div>
        </a>
      </li>
    </ul>

    <div v-if="totalCount === 0" class="AnalyzeList--no-data">
      <span>{{ $t('MyPageBodyCompositionDataRecord.noDataMessage') }}</span>
    </div>
    <!-- 체성분 데이터는 페이징이 없으므로 더보기 버튼 제거 -->
    <!-- <div v-else-if="isPc && (data.target.length < totalCount)" class="txt--center MyPageBodyCompositionDataRecord--btn">
      <button @click="more" type="button" class="btn--txt3">{{ $t('Common.more') }}</button>
    </div> -->
  </div>
</template>

<style lang="scss"></style> 