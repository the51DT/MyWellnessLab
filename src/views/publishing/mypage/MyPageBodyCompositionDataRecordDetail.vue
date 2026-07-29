<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/BaseInput.vue'

const { t } = useI18n()

const detailData = ref({
  connectType: 'INBODY',
  surveyDate: '2025-02-05T19:25:00',
  ht: 170,
  wt: 60,
  wbtBfMass: 22,
  wbtBfPercent: 31,
  wbtSmMass: 30,
  ramMass: 7,
  ramPercent: 55,
  lamMass: 7,
  lamPercent: 56,
  trkMass: 20,
  trkPercent: 70,
  rlmMass: 8,
  rlmPercent: 60,
  llmMass: 8,
  llmPercent: 59,
})

/**
 * connectType에 따라 적절한 텍스트를 반환하는 함수입니다.
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
 * connectType에 따라 적절한 클래스를 반환하는 함수입니다.
 */
const getConnectTypeClass = (connectType) => {
  switch (connectType) {
    case 'CUSTOM':
      return 'biolet'
    case 'BODYKEY':
      return 'tag-bodykey'
    case 'INBODY':
    default:
      return ''
  }
}

/**
 * 날짜 문자열에서 날짜 부분만 반환하는 함수입니다.
 * ISO 형식("2025-12-10T10:56:19")과 기존 형식("2025.12.10 오후 05:32") 모두 처리
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
  const timeMatch = dateString.match(/(AM|PM|오전|오후)\s+(\d{1,2}):(\d{2})/)
  if (!timeMatch) return ''
  
  const period = timeMatch[1] // AM, PM, 오전, 오후
  let hour = parseInt(timeMatch[2]) // 시간
  const minute = timeMatch[3] // 분
  
  // AM/PM을 오전/오후로 변환
  let periodText = period
  if (period === 'AM') {
    periodText = t('MyPageBodyCompositionDataRecord.am')
  } else if (period === 'PM') {
    periodText = t('MyPageBodyCompositionDataRecord.pm')
  }
  
  // 12시간 형식으로 변환 (PM인 경우 12를 더하되, 12시는 그대로 유지)
  if ((period === 'PM' || period === '오후') && hour !== 12) {
    hour += 12
  } else if ((period === 'AM' || period === '오전') && hour === 12) {
    hour = 0
  }
  
  // 2자리 형식으로 포맷팅
  const formattedHour = hour.toString().padStart(2, '0')
  
  return `${periodText} ${formattedHour}:${minute}`
}

// 체성분 데이터 필드 정의
// 202606 순서변경
const bodyCompositionFields = computed(() => [
  { key: 'ht', textKey: 'BodyCompositionPop.text18', suffix: 'cm' },
  { key: 'wt', textKey: 'BodyCompositionPop.text19', suffix: 'kg' },
  { key: 'wbtBfMass', textKey: 'BodyCompositionPop.text20', suffix: 'kg' },
  { key: 'wbtBfPercent', textKey: 'BodyCompositionPop.text21', suffix: '%' },
  { key: 'wbtSmMass', textKey: 'BodyCompositionPop.text22', suffix: 'kg' },
  { key: 'ramMass', textKey: 'BodyCompositionPop.text23', suffix: 'kg' },
  { key: 'ramPercent', textKey: 'BodyCompositionPop.text24', suffix: '%' },
  { key: 'rlmMass', textKey: 'BodyCompositionPop.text25', suffix: 'kg' },
  { key: 'rlmPercent', textKey: 'BodyCompositionPop.text26', suffix: '%' },
  { key: 'lamMass', textKey: 'BodyCompositionPop.text27', suffix: 'kg' },
  { key: 'lamPercent', textKey: 'BodyCompositionPop.text28', suffix: '%' },
  { key: 'llmMass', textKey: 'BodyCompositionPop.text29', suffix: 'kg' },
  { key: 'llmPercent', textKey: 'BodyCompositionPop.text30', suffix: '%' },
  { key: 'trkMass', textKey: 'BodyCompositionPop.text31', suffix: 'kg' },
  { key: 'trkPercent', textKey: 'BodyCompositionPop.text32', suffix: '%' },
])
</script>

<template>
  <div class="MyPageBodyCompositionDataRecordDetail">
    <div class="MyPageBodyCompositionDataRecordDetail--data">
      <div class="MyPageBodyCompositionDataRecordDetail--top">
        <div class="tag-wrap">
          <span
            class="tag"
            :class="getConnectTypeClass(detailData.connectType)"
          >
            {{ getConnectTypeText(detailData.connectType) }}
          </span>
        </div>
        <dl class="MyPageBodyCompositionDataRecordDetail--dl">
          <dt></dt>
          <dt>{{ $t('BodyCompositionPop.text17') }}</dt>
          <dd>
            {{ formatDateOnly(detailData.surveyDate) }}
            <span>{{ formatTimeOnly(detailData.surveyDate) }}</span>
          </dd>
        </dl>
      </div>

      <!-- 202606 라인 삭제 & 버튼 추가 -->
      <div class="MyPageBodyCompositionDataRecordDetail--btn-wrap">
        <button type="button" class="MyPageBodyCompositionDataRecordDetail--btn">이 검진 데이터로 분석 시작하기</button>
      </div>

      <div class="MyPageBodyCompositionDataRecordDetail--input-list">
        <BaseInput
          v-for="field in bodyCompositionFields"
          :key="field.key"
          :value="detailData[field.key]"
          :disabled="false"
          :suf="field.suffix"
          :placeholder="`-`"
          class="MyPageBodyCompositionDataRecordDetail--input"
        >
          <template v-slot:itemName>
            {{ $t(field.textKey) }}
          </template>
        </BaseInput>
      </div>
    </div>
  </div>
</template>