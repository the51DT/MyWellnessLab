<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import BasePopupTit from '@/components/BasePopupTit.vue'
import AnalyzeBar from '@/views/analyze/components/AnalyzeBar.vue'
import { bodyScroll } from '@/assets/js/common'
import { useCommonForm } from '@/utils/commonForm'

const { AGING_SPEED_FORM } = useCommonForm()
const props = defineProps({
  majorHealthRiskList: {
    type: Array,
    default: () => []
  },
  selectedIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'prev', 'next'])

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

const detail = computed(() => {
  const data = props.majorHealthRiskList[props.selectedIndex]
  let description = data.description
  if (Array.isArray(description)) {
    const sex = data.sex
    description = description[sex]
  }

  if (data.key === 'CREA') {
    if (data.value < 0.6) {
      description = data.description_row
    } else if (data.value > 1.06) {
      description = data.description_high
    }
  }
  // 간단하게 문자열을 배열로 분리 (마침표 기준)
  const descriptionArray = description ? description.split('\n').filter(item => item.trim()) : []

  return {
    ...data,
    description,
    descriptionArray: descriptionArray.length > 1 ? descriptionArray : null
  }
})

const barDetail = computed(() => {
  const { key, value: data, sex, status } = detail.value
  if (key === 'CK_MH_stress') {
    let my = 0
    if (data === 0 || data === 1) {
      my = 16.5  // 0-33% 구간의 가운데 (거의 없다, 보통 - 정상/좋음)
    } else if (data === 2) {
      my = 49.5  // 33-66% 구간의 가운데 (관리 - 주의)
    } else if (data === 3) {
      my = 83    // 66-100% 구간의 가운데 (많다 - 위험)
    }

    return {
      average: null,
      my: my,
      class: 'type6'
    }
  }

  if (key === 'CK_water_amt') {
    let my = 0
    if (data === 2 || data === 3) {
      my = 16.5  // 0-33% 구간의 가운데 (빨간)
    } else if (data === 1) {
      my = 83    // 66-100% 구간의 가운데 (초록)
    }

    return {
      average: null,
      my: my,
      class: 'type5 reverse'
    }
  }

  if (key === 'CK_smok') {
    let my = 0
    if (data === 1) {
      my = 16.5  // 0-33% 구간의 가운데 (초록색)
    } else if (data === 2) {
      my = 49.5  // 33-66% 구간의 가운데 (노란색)
    } else if (data === 3) {
      my = 83    // 66-100% 구간의 가운데 (빨간색)
    }

    return {
      average: null,
      my: my,
      class: 'type6'
    }
  }

  

  let target = AGING_SPEED_FORM[key]
  let value = data
  let average = 50
  
  // 특정 키에 대한 target 변경 (target 체크 전에 실행)
  if (key === 'CK_drink') {
    target = AGING_SPEED_FORM.drink_amt
  } else if (key === 'CK_sleep_time') {
    target = AGING_SPEED_FORM.sleep_time
  } else if (key === 'CK_MET') {
    target = AGING_SPEED_FORM.MET
  }
  
  // RFS_score 특수 처리: type7로 간단한 퍼센트 변환
  if (key === 'RFS_score') {
    // 0-100 범위에서 점수를 그대로 퍼센트로 사용
    value = Math.min(Math.max(data, 0), 100) // 0-100 범위로 제한
  }
  
  
  
  
  // target이 존재하지 않는 경우 기본값 반환
  if (!target) {
    return {
      average: 50,
      my: 0,
      class: 'type1'
    }
  }

  // RFS_score 특수 처리: type7인 경우 간단한 퍼센트 계산
  if (key === 'RFS_score' && target.barType && target.barType.class === 'type7') {
    return {
      average: 49, // 평균값을 49%에 고정
      my: value,    // 점수를 그대로 퍼센트로 사용
      class: 'type7'
    }
  }

  // AnalyzeAgingSpeedPop과 동일한 로직 적용 - 모든 타입에 대해 getPos 함수 사용
  if (target.barType && target.barType.class) {
    // 성별에 따른 값 선택 (detail.value에서 가져온 sex 사용)
    const userSex = sex || 0 // 0: 남자, 1: 여자
    
    // 새로운 데이터 구조 사용 (성별 고려)
    const calcData = {
      type: target.type,
      normal_range_min: Array.isArray(target.normal_range_min) ? target.normal_range_min[userSex] : target.normal_range_min,
      normal_range_max: Array.isArray(target.normal_range_max) ? target.normal_range_max[userSex] : target.normal_range_max,
      normal_range_ratio: target.normal_range_ratio,
      warning_range_min: Array.isArray(target.warning_range_min) ? target.warning_range_min[userSex] : target.warning_range_min,
      warning_range_max: Array.isArray(target.warning_range_max) ? target.warning_range_max[userSex] : target.warning_range_max,
      warning_range_ratio: target.warning_range_ratio,
      danger_range_min: Array.isArray(target.danger_range_min) ? target.danger_range_min[userSex] : target.danger_range_min,
      danger_range_max: Array.isArray(target.danger_range_max) ? target.danger_range_max[userSex] : target.danger_range_max,
      danger_range_ratio: target.danger_range_ratio,
      danger_1_range_min: Array.isArray(target.danger_1_range_min) ? target.danger_1_range_min[userSex] : target.danger_1_range_min,
      danger_1_range_max: Array.isArray(target.danger_1_range_max) ? target.danger_1_range_max[userSex] : target.danger_1_range_max,
      danger_1_range_ratio: target.danger_1_range_ratio,
      danger_2_range_min: Array.isArray(target.danger_2_range_min) ? target.danger_2_range_min[userSex] : target.danger_2_range_min,
      danger_2_range_max: Array.isArray(target.danger_2_range_max) ? target.danger_2_range_max[userSex] : target.danger_2_range_max,
      danger_2_range_ratio: target.danger_2_range_ratio,
      range_min: target.range_min,
      range_max: target.range_max
    }

    // 새로운 getPos 함수에 맞는 데이터 구조 생성
    const posData = {
      value: value,
      status: status || 0,
      type: calcData.type,
      range_min: calcData.range_min,
      range_max: calcData.range_max,
      normal_range_min: calcData.normal_range_min,
      normal_range_max: calcData.normal_range_max,
      normal_range_ratio: calcData.normal_range_ratio,
      warning_range_min: calcData.warning_range_min,
      warning_range_max: calcData.warning_range_max,
      warning_range_ratio: calcData.warning_range_ratio,
      danger_range_min: calcData.danger_range_min,
      danger_range_max: calcData.danger_range_max,
      danger_range_ratio: calcData.danger_range_ratio,
      danger_1_range_min: calcData.danger_1_range_min,
      danger_1_range_max: calcData.danger_1_range_max,
      danger_1_range_ratio: calcData.danger_1_range_ratio,
      danger_2_range_min: calcData.danger_2_range_min,
      danger_2_range_max: calcData.danger_2_range_max,
      danger_2_range_ratio: calcData.danger_2_range_ratio
    }

    // 내 수치 위치 계산
    const my = parseFloat(getPos(posData)) // % 기호 제거하고 숫자로 변환
    
    // 평균값 위치 계산 - BMI는 90%, 나머지는 50% 고정
    const averageMy = key === 'BMI' ? 90 : 50
    
    return {
      average: averageMy,
      my: my,
      class: target.barType.class
    }
  }

  // 기본값 반환 (target이 없는 경우)
  return {
    average: 50,
    my: 0,
    class: 'type1'
  }
})

const isFirst = computed(() => {
  return props.selectedIndex === 0
})

const isLast = computed(() => {
  return props.selectedIndex === props.majorHealthRiskList.length - 1
})

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}

const handleClose = () => {
  emit('close')
}

onMounted(() => {
  bodyScroll(false)
})

onUnmounted(() => {
  bodyScroll(true)
})

</script>

<template>
  <base-popup-tit @popupClose="handleClose">
    <template v-slot:title>
      {{ $t('AnalyzeMajorHealthRiskPopup.text1') }}
    </template>
    <template v-slot:contents>
      <div class="AnalyzeMajorHealthRiskPopup">
        <div class="AnalyzeMajorHealthRiskPopup--header">
          <div class="AnalyzeMajorHealthRiskPopup--prev">
            <button
              @click="handlePrev"
              type="button"
              aria-label="이전"
              :class="['AnalyzeMajorHealthRiskPopup--prev-btn', isFirst ? 'first' : '']" />
          </div>
          <div class="AnalyzeMajorHealthRiskPopup--tit">
            <span>{{ detail.label }}</span>
          </div>
          <div class="AnalyzeMajorHealthRiskPopup--next">
            <button
              @click="handleNext"
              type="button"
              aria-label="다음"
              :class="['AnalyzeMajorHealthRiskPopup--next-btn', isLast ? 'last' : '']" />
          </div>
        </div>

        <div class="AnalyzeMajorHealthRiskPopup--con">
          <div class="AnalyzeMajorHealthRiskPopup--con-wrap">
            <div class="legend-wrap">
              <span v-if="detail.key !== 'CK_MH_stress' && detail.key !== 'CK_water_amt' && detail.key !== 'CK_smok'" class="legend-purple">{{ $t('AnalyzeMajorHealthRiskPopup.text4') }}</span>
              <span class="legend-green">{{ $t('AnalyzeMajorHealthRiskPopup.text5')}}</span>
            </div>

            <AnalyzeBar :value="barDetail" />

            <dl class="AnalyzeMajorHealthRiskPopup--index">
              <dt class="AnalyzeMajorHealthRiskPopup--dt t1">{{ $t('AnalyzeMajorHealthRiskPopup.text6') }} {{ detail.label }} <span>{{ detail.unit }}</span></dt>
              <dd class="AnalyzeMajorHealthRiskPopup--dd a1" :class="detail.statusColorClass">
                {{ detail.valueText }}
              </dd>
            </dl>
            <hr class="gray2 AnalyzeMajorHealthRiskPopup--hr" />
            <ul class="AnalyzeMajorHealthRiskPopup--list" v-if="detail.descriptionArray">
              <li 
                v-for="(item, index) in detail.descriptionArray" 
                :key="index" 
                class="AnalyzeMajorHealthRiskPopup--list-item"
              >
                <span>{{ item.trim() }}</span>
              </li>
            </ul>
            <p 
              v-else 
              class="AnalyzeMajorHealthRiskPopup--txt"
            >
              {{ detail.description }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </base-popup-tit>
</template>
