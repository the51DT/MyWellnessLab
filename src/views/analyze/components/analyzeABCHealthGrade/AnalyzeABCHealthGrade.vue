<script setup>
import { useRouter } from 'vue-router'

import BaseTooltip from '@/components/BaseTooltip.vue'
import { go } from '@/assets/js/common'

import AnalyzeABCHealthGradeDetailPopup from './AnalyzeABCHealthGradeDetailPopup.vue'

import { ref, defineProps, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()

const props = defineProps({
  sendData: Object
})

const popup = ref(null)

const isGrade = computed(() => {
  let rtnVal = ''
  if (props.sendData.hqData.Health_Type !== undefined) {
    rtnVal = props.sendData.hqData.Health_Type
  }

  return rtnVal
})

const chartData = ref({
  '': {
    grade: '-',
    txt: ''
  },
  A: {
    grade: 'A',
    txt: t('AnalyzeABCHealthGrade.text1')
  },
  B: {
    grade: 'B',
    txt: t('AnalyzeABCHealthGrade.text2')
  },
  C: {
    grade: 'C',
    txt: t('AnalyzeABCHealthGrade.text3')
  }
})// API를 통해 가져올 데이터

const isPop = ref(false)
const tooltip = ref(false) /* 툴팁 오프너 */
const tooltipEdge = ref(false)

function tooltipClose () { /* 툴팁 닫기 */
  tooltip.value = false
}

function openTooltip ($event) { /* 툴팁 열기 */
  tooltip.value = true
  tooltipEdge.value = $event.x
}

function openPop (idx) {
  isPop.value = true
}

function popupClose () {
  isPop.value = false
}
</script>

<template>
  <div class="AnalyzeABCHealthGrade">
    <div class="tooltip AnalyzeABCHealthGrade--tooltip">
      <h2 class="tooltip--tit AnalyzeABCHealthGrade--tip-tit">{{ $t('AnalyzeABCHealthGrade.text4') }}</h2>
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeABCHealthGrade--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeABCHealthGrade--tip-dom">
        <template v-slot:contents>
          <p class="AnalyzeMajorHealthRisk--tip-txt">{{ $t('AnalyzeABCHealthGrade.text6') }}</p>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box">
      <p class="AnalyzeABCHealthGrade--info">
        {{ $t('AnalyzeABCHealthGrade.text7') }} <strong>{{chartData[isGrade].grade}}{{ $t('AnalyzeABCHealthGrade.text8') }}</strong>{{ $t('AnalyzeABCHealthGrade.text9') }}
      </p>

      <div class="AnalyzeABCHealthGrade--grade">
        <div class="AnalyzeABCHealthGrade--grade-wrap" :class="chartData[isGrade].grade === 'A' ? 'a' : chartData[isGrade].grade === 'B' ? 'b' : chartData[isGrade].grade === 'C' ? 'c' : ''">
          <div class="AnalyzeABCHealthGrade--grade-alpa">{{chartData[isGrade].grade}}</div>
          <div class="AnalyzeABCHealthGrade--grade-unit">{{ $t('AnalyzeABCHealthGrade.text8') }}</div>

        </div>
      </div>
      <div class="AnalyzeABCHealthGrade--description">
        ({{ $t('AnalyzeABCHealthGrade.text10') }})
      </div>
      <div class="AnalyzeABCHealthGrade--desc">
        <p class="AnalyzeABCHealthGrade--desc-txt">{{ chartData[isGrade].txt }}</p>
      </div>

      <div class="AnalyzeABCHealthGrade--btn-wrap">
        <button @click="openPop" type="button" class="AnalyzeABCHealthGrade--btn">{{ $t('Common.detail') }}</button>
      </div>

    </div>

    <div class="AnalyzeABCHealthGrade--desc2">
      <p class="AnalyzeABCHealthGrade--desc2-txt">{{ $t('AnalyzeABCHealthGrade.text12') }}<br />{{ $t('AnalyzeABCHealthGrade.text13') }}</p>
    </div>

    <AnalyzeABCHealthGradeDetailPopup
      v-if="isPop"
      :sendData="props.sendData"
      @popupClose="popupClose"
      ref="popup"
      class="--popup" />

  </div>
</template>

<style scoped>

</style>
