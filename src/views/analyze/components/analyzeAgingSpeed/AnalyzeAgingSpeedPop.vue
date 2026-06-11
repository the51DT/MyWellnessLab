<script setup>

import BasePopupTit from '@/components/BasePopupTit.vue'
import { ref, getCurrentInstance, defineProps, computed } from 'vue'
import AnalyzeAgingSpeedPopGraph from './AnalyzeAgingSpeedPopGraph.vue'
import { useCommonForm } from '@/utils/commonForm'
import _ from 'lodash'

const { AGING_SPEED_FORM }= useCommonForm()
const props = defineProps({
  openPop: { /* 231208 팝업 여는 프롭 */
    type: Boolean,
    default: false
  },
  sendData: Object
})
const instance = getCurrentInstance()
const isDangerReason = ref(true) /* 위험 요인 탭 버튼 */

// 데이터 범위 제한 함수
const getData = (data) => {
  let dataValue = data.value
  if (dataValue < data.range_min) {
    dataValue = data.range_min
  }
  if (dataValue > data.range_max) {
    dataValue = data.range_max
  }
  return dataValue
}

// 위치 계산 함수
const getPos = (data) => {
  let dataValue = getData(data);

  if (data.range_min == dataValue) {
    return 0 + "%";
  } else if (data.range_max == dataValue) {
    return 100 + "%";
  } else {
    let pos;

    const status = data.status;

    switch (status) {
      case 1:
        pos = calculateNormal(data, dataValue);
        break;
      case 2:
        pos = calculateWarn(data, dataValue);
        break;
      case 3:
        pos = calculateDanger(data, dataValue);
        break;
    }

    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;

    return pos + "%";
  }
}

// Normal 구간 계산
const calculateNormal = (data, value) => {
  let rate

  switch (data.type) {
    case 'nwd':
      var percentInC = (value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)
      rate = percentInC * (1 - data.warning_range_ratio)
      break
    case 'dwn':
      // dwn 타입: 정상 구간은 normal_range_min ~ normal_range_max 구간을
      // normal_range_ratio ~ 1 사이로 선형 매핑
      var percentInC = (value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)
      rate = data.normal_range_ratio + percentInC * (1 - data.normal_range_ratio)
      break
    case 'dnd':
      // dnd 타입에서는 normal 구간이 중간에 있음
      var percentInC = (value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)
      rate = data.normal_range_ratio + percentInC * (data.danger_2_range_ratio - data.normal_range_ratio)
      break
    case 'nd':
      var percentInc = (value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)
      rate = percentInc * (1 - data.danger_range_ratio)
      break
    case 'dn':
      var percentInc = (value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)
      rate = data.normal_range_ratio + percentInc * (1 - data.normal_range_ratio)
      break
    default:
      rate = (((value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)) + data.normal_range_ratio) * 10
      break
  }

  return rate * 100
}

// Warning 구간 계산
const calculateWarn = (data, value) => {
  let rate
  switch (data.type) {
    case 'nwd':
      var percentInC = (value - data.warning_range_min) / (data.warning_range_max - data.warning_range_min)
      rate = data.warning_range_ratio + percentInC * (data.danger_range_ratio - data.warning_range_ratio)
      break
    case 'dwn':
      var percentInC = (value - data.warning_range_min) / (data.warning_range_max - data.warning_range_min)
      rate = data.warning_range_ratio + percentInC * (data.normal_range_ratio - data.warning_range_ratio)
      break
    case 'dnd':
      rate = 0
      break
    case 'nd':
      rate = 0
      break
    case 'dn':
      rate = 0
      break
    default:
      var percentInC = (value - data.warning_range_min) / (data.warning_range_max - data.warning_range_min)
      rate = data.warning_range_ratio + percentInC * (data.danger_range_ratio - data.warning_range_ratio)
      break
  }
  return rate * 100
}

// Danger 구간 계산
const calculateDanger = (data, value) => {
  let rate
  switch (data.type) {
    case 'nwd':
      var percentInC = (value - data.danger_range_min) / (data.danger_range_max - data.danger_range_min)
      rate = data.danger_range_ratio + percentInC * (1 - data.danger_range_ratio)
      break
    case 'dwn':
      var percentInC = (value - data.danger_range_min) / (data.danger_range_max - data.danger_range_min)
      // dwn 타입: 낮을수록 위험. 위험 구간은 0 ~ normal_range_ratio 사이로 매핑
      rate = percentInC * (data.normal_range_ratio - data.warning_range_ratio)
      break
    case 'dnd':
      if (value >= data.danger_1_range_min && value <= data.danger_1_range_max) {
        // 첫 번째 위험 구간 (낮은 값) - 0% ~ 10%
        var percentInC = (value - data.danger_1_range_min) / (data.danger_1_range_max - data.danger_1_range_min)
        rate = percentInC * data.normal_range_ratio
      } else if (value >= data.danger_2_range_min && value <= data.danger_2_range_max) {
        // 두 번째 위험 구간 (높은 값) - 90% ~ 100%
        var percentInC = (value - data.danger_2_range_min) / (data.danger_2_range_max - data.danger_2_range_min)
        rate = data.danger_2_range_ratio + percentInC * (1 - data.danger_2_range_ratio)
      } else {
        // 정상 구간 (중간 값) - 10% ~ 90%
        var percentInC = (value - data.normal_range_min) / (data.normal_range_max - data.normal_range_min)
        rate = data.normal_range_ratio + percentInC * (data.danger_2_range_ratio - data.normal_range_ratio)
      }
      break
    case 'nd':
      var percentInc = (value - data.danger_range_min) / (data.danger_range_max - data.danger_range_min)
      rate = data.danger_range_ratio + percentInc * (1 - data.danger_range_ratio)
      break
    case 'dn':
      var percentInc = (value - data.danger_range_min) / (data.danger_range_max - data.danger_range_min)
      rate = percentInc * (1 - data.normal_range_ratio)
      break
    default:
      var percentInC = (value - data.danger_range_min) / (data.danger_range_max - data.danger_range_min)
      rate = data.danger_range_ratio + percentInC * (1 - data.danger_range_ratio)
      break
  }
  return rate * 100
}


const allList = computed(() => {
  const arr = []

  // props.sendData가 없으면 빈 배열 반환
  if (!props.sendData || !props.sendData.ariData) {
    return []
  }

  for (const key in AGING_SPEED_FORM) {
    const target = AGING_SPEED_FORM[key]
    let value = props.sendData.ariData[key]
    
    if (value === undefined) {
      continue
    }

    // 성별에 따른 값 선택
    const sex = props.sendData.basics?.sex ? props.sendData.basics.sex - 1 : 0 // 0: 남자, 1: 여자
    
    // 새로운 데이터 구조 사용 (성별 고려)
    const data = {
      type: target.type,
      normal_range_min: Array.isArray(target.normal_range_min) ? target.normal_range_min[sex] : target.normal_range_min,
      normal_range_max: Array.isArray(target.normal_range_max) ? target.normal_range_max[sex] : target.normal_range_max,
      normal_range_ratio: target.normal_range_ratio,
      warning_range_min: Array.isArray(target.warning_range_min) ? target.warning_range_min[sex] : target.warning_range_min,
      warning_range_max: Array.isArray(target.warning_range_max) ? target.warning_range_max[sex] : target.warning_range_max,
      warning_range_ratio: target.warning_range_ratio,
      danger_range_min: Array.isArray(target.danger_range_min) ? target.danger_range_min[sex] : target.danger_range_min,
      danger_range_max: Array.isArray(target.danger_range_max) ? target.danger_range_max[sex] : target.danger_range_max,
      danger_range_ratio: target.danger_range_ratio,
      danger_1_range_min: Array.isArray(target.danger_1_range_min) ? target.danger_1_range_min[sex] : target.danger_1_range_min,
      danger_1_range_max: Array.isArray(target.danger_1_range_max) ? target.danger_1_range_max[sex] : target.danger_1_range_max,
      danger_1_range_ratio: target.danger_1_range_ratio,
      danger_2_range_min: Array.isArray(target.danger_2_range_min) ? target.danger_2_range_min[sex] : target.danger_2_range_min,
      danger_2_range_max: Array.isArray(target.danger_2_range_max) ? target.danger_2_range_max[sex] : target.danger_2_range_max,
      danger_2_range_ratio: target.danger_2_range_ratio,
      range_min: target.range_min,
      range_max: target.range_max
    }

    const status = props.sendData.ariStatus?.[key] || 0
    
    // 새로운 getPos 함수에 맞는 데이터 구조 생성
    const posData = {
      value: value,
      status: status,
      type: data.type,
      range_min: data.range_min,
      range_max: data.range_max,
      normal_range_min: data.normal_range_min,
      normal_range_max: data.normal_range_max,
      normal_range_ratio: data.normal_range_ratio,
      warning_range_min: data.warning_range_min,
      warning_range_max: data.warning_range_max,
      warning_range_ratio: data.warning_range_ratio,
      danger_range_min: data.danger_range_min,
      danger_range_max: data.danger_range_max,
      danger_range_ratio: data.danger_range_ratio,
      danger_1_range_min: data.danger_1_range_min,
      danger_1_range_max: data.danger_1_range_max,
      danger_1_range_ratio: data.danger_1_range_ratio,
      danger_2_range_min: data.danger_2_range_min,
      danger_2_range_max: data.danger_2_range_max,
      danger_2_range_ratio: data.danger_2_range_ratio
    }
    
    const my = parseFloat(getPos(posData)) // % 기호 제거하고 숫자로 변환
    const average = key === 'BMI' ? 90 : 50 // BMI는 90%, 나머지는 50% 고정

    const detailObj = {
      label: target.label,
      average,
      my,
      class: target.barType.class,
      ariStatus: status,
      index: Object.keys(AGING_SPEED_FORM).indexOf(key)
    }
    arr.push(detailObj)
  }

  const res = _.orderBy(arr, ['ariStatus', 'index'], ['desc', 'asc'])
  return res
})

const dangerList = computed(() => {
  return allList.value.filter((item) => item.ariStatus >= 2)
})

// 체성분 데이터가 없는 항목들을 처리하는 computed 제거

/**
 * 팝업 닫기
 */
function popupClose () {
  instance.emit('popupClose')
}

/**
 * 탭 노출
 * @param {*} val
 */
function tabReason (val) {
  isDangerReason.value = val
}
</script>

<template>
  <base-popup-tit v-if="props.openPop" @popupClose="popupClose" class="AnalyzeAgingSpeed--popup">
    <template v-slot:title>
      {{ $t('AnalyzeAgingSpeedPop.text1') }}
    </template>
    <template v-slot:contents>
      <div class="AnalyzeAgingSpeed--tab">
        <button
          @click="tabReason(true)"
          type="button"
          class="AnalyzeAgingSpeed--tab-btn"
          :class="isDangerReason ? 'active' : ''">{{ $t('AnalyzeAgingSpeedPop.text2') }}</button>
        <button
          @click="tabReason(false)"
          type="button"
          class="AnalyzeAgingSpeed--tab-btn"
          :class="isDangerReason ? '' : 'active'">{{ $t('AnalyzeAgingSpeedPop.text3') }}</button>
      </div>
      <div v-if="isDangerReason" class="AnalyzeAgingSpeed--danger">
        <!-- <AnalyzeAgingSpeedPopGraph :data="allReason" /> -->
        <AnalyzeAgingSpeedPopGraph :data="dangerList" :sendData="sendData" />
      </div>
      <div v-else class="AnalyzeAgingSpeed--all"> <!--전체 요인 그래프-->
        <AnalyzeAgingSpeedPopGraph :data="allList" :sendData="sendData" />
      </div>
    </template>
  </base-popup-tit>
</template>
