<script setup>

import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import { computed, getCurrentInstance, ref } from 'vue'
import AnalyzeAgingSpeedPopGraph from '@/views/publishing/analyze/AnalyzeAgingSpeedPopGraph.vue'

const props = defineProps({
  openPop: { /* 231208 팝업 여는 프롭 */
    type: Boolean,
    default: false
  }
})
const instance = getCurrentInstance()
const isDangerReason = ref(true) /* 위험 요인 탭 버튼 */
const myReason = ref([ /* 231208 나의 위험 요인 임시 데이터 */
  {
    title: '허리둘레',
    value: 10,
    average: 50
  },
  {
    title: '체질량지수',
    value: 20,
    average: 50
  },
  {
    title: '수축기혈압',
    value: 30,
    average: 50
  },
  {
    title: '이완기혈압',
    value: 50,
    average: 50
  },
  {
    title: '공복혈당',
    value: 50,
    average: 50
  },
  {
    title: '총 콜레스테롤',
    value: 60,
    average: 50
  }
])
const allReason = ref([ /* 231208 모든 위험 요인 임시 데이터 */
  {
    title: '허리둘레',
    value: 10,
    average: 50
  },
  {
    title: '체질량지수',
    value: 20,
    average: 50
  },
  {
    title: '수축기혈압',
    value: 30,
    average: 50
  },
  {
    title: '이완기혈압',
    value: 40,
    average: 50
  },
  {
    title: '공복혈당',
    value: 50,
    average: 50
  },
  {
    title: '총 콜레스테롤',
    value: 60,
    average: 50
  },
  {
    title: '저밀도 콜레스테롤',
    value: 60,
    average: 50
  },
  {
    title: '고밀도 콜레스테롤',
    value: 60,
    average: 50
  },
  {
    title: '중성지방',
    value: 60,
    average: 50
  },
  {
    title: '아스파테이트 아미노전이효소(AST/SGOT)',
    value: 60,
    average: 50
  },
  {
    title: '알라닌 아미노전이효소(ALT/SGPT)',
    value: 70,
    average: 50
  },
  {
    title: '혈색소',
    value: 80,
    average: 50
  },
  {
    title: '혈청 크레아티닌',
    value: 90,
    average: 50
  },
  {
    title: '총 흡연기간',
    value: 100,
    average: 50
  },
  {
    title: '담배 소비량',
    value: 110,
    average: 50
  },
  {
    title: '수면시간',
    value: 120,
    average: 50
  },
  {
    title: '활동량',
    value: 120,
    average: 50
  },
  {
    title: '음주량',
    value: 120,
    average: 50
  },
  {
    title: '삶의 질',
    value: 120,
    average: 50
  }
])

function popupClose () { /* 231208 팝업 닫기 */
  instance.emit('popupClose')
}
function tabReason (val) { /* 231208 탭 노출 */
  isDangerReason.value = val
}

const isAllReason = computed(() => { /* 231208 탭 노출 */
  return !isDangerReason.value
})
</script>

<template>
  <base-popup-tit v-if="props.openPop" @popupClose="popupClose" class="AnalyzeAgingSpeed--popup">
    <template v-slot:title>
      노화 속도 요인
    </template>
    <template v-slot:contents>
      <div class="AnalyzeAgingSpeed--tab">
        <button
          @click="tabReason(true)"
          type="button"
          class="AnalyzeAgingSpeed--tab-btn"
          :class="isDangerReason ? 'active' : ''">위험 요인</button>
        <button
          @click="tabReason(false)"
          type="button"
          class="AnalyzeAgingSpeed--tab-btn"
          :class="isDangerReason ? '' : 'active'">전체 요인</button>
      </div>
      <div v-if="isDangerReason" class="AnalyzeAgingSpeed--danger"> <!--위험 요인 그래프-->

        <AnalyzeAgingSpeedPopGraph :data="myReason" />

      </div>
      <div v-if="isAllReason" class="AnalyzeAgingSpeed--all"> <!--전체 요인 그래프-->

        <AnalyzeAgingSpeedPopGraph :data="allReason" />

      </div>
    </template>
  </base-popup-tit>
</template>

<style scoped></style>
