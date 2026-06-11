<script setup>
import { ref } from 'vue'
import AnalyzeBar from '@/views/analyze/components/AnalyzeBar.vue'
import { useCommonForm } from '@/utils/commonForm'

const { AGING_SPEED_TOOLTIP_FORM, AGING_SPEED_FORM } = useCommonForm()
const props = defineProps({ 
  data: Array,
  sendData: Object 
})
const activeTooltip = ref(null)
const tooltipEdge = ref(0)

function tooltipClose() {
  activeTooltip.value = null
}

function openTooltip(event, item) {
  const button = event.target
  const buttonRect = button.getBoundingClientRect()
  const containerRect = button.closest('.AnalyzeAgingSpeedPop--unit').getBoundingClientRect()
  const relativeX = buttonRect.left + (buttonRect.width / 2) - containerRect.left - 10
  
  let description = AGING_SPEED_TOOLTIP_FORM[item.label]
  
  // 혈색소의 경우 성별에 따라 다른 설명 사용
  if (Array.isArray(description)) {
    const sex = props.sendData?.basics?.sex ? props.sendData.basics.sex - 1 : 0 // 0: 남자, 1: 여자
    description = description[sex]
  }
  
  if (description) {
    // MajorHealthRiskPopup과 동일한 로직: \n으로 분리하여 배열로 만들기
    const descriptionArray = description.split ? description.split('\n').filter(item => item.trim()) : [description]
    
    activeTooltip.value = { content: descriptionArray, index: item.index }
    tooltipEdge.value = relativeX
  }
}

function hasTooltip(item) {
  return !!AGING_SPEED_TOOLTIP_FORM[item.label]
}

// 나의 값 가져오기
function getMyValue(item) {
  if (!props.sendData?.ariData) return null
  
  // item.label에서 키를 찾기 위해 AGING_SPEED_FORM에서 매칭
  for (const [key, formData] of Object.entries(AGING_SPEED_FORM)) {
    if (formData.label === item.label) {
        const value = props.sendData.ariData[key]
        if (value !== undefined && value !== null) {
          const fixed = Number(value).toFixed(1)
          // .0으로 끝나면 정수로 표시
          return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed
        }
      break
    }
  }
  return null
}

// 단위 가져오기
function getUnit(item) {
  if (!props.sendData?.ariData) return ''
  
  // item.label에서 키를 찾기 위해 AGING_SPEED_FORM에서 매칭
  for (const [key, formData] of Object.entries(AGING_SPEED_FORM)) {
    if (formData.label === item.label) {
      // AGING_SPEED_FORM에서 직접 단위 정보 가져오기
      if (formData.unit) {
        return formData.unit
      }
      break
    }
  }
  return ''
}
</script>

<template>
  <div class="analyze-box">

    <div class="legend-wrap">
      <span class="legend-purple">{{ $t('AnalyzeAgingSpeedPopGraph.text1') }}</span>
      <span class="legend-green">{{ $t('AnalyzeAgingSpeedPopGraph.text2') }}</span>
    </div>
    
    <div class="AnalyzeAgingSpeedPop--graph-wrap">

      <div v-for="(item, index) in (props.data || [])" :key="index" class="AnalyzeAgingSpeedPop--unit">
        <div class="tooltip AnalyzeAgingSpeedPop--tooltip">
          <h2 class="tooltip--tit AnalyzeAgingSpeedPop--tit">{{item.label}}</h2>
          <button
            v-if="hasTooltip(item)"
            @click="openTooltip($event, {...item, index})"
            class="btn--tooltip AnalyzeAgingSpeedPop--tip-btn"
            type="button"
            title="도움말" />

          <!-- 커스텀 툴팁 -->
          <div v-if="activeTooltip && activeTooltip.index === index" class="tooltip--wrap AnalyzeAgingSpeedPop--tip-dom">
            <div class="tooltip--contents">
              <div class="tooltip--edge" :style="{ left: tooltipEdge + 'px' }" />
              <ul>
                <li v-for="(content, contentIndex) in activeTooltip.content" :key="contentIndex">{{ content }}</li>
              </ul>
            </div>
            <div class="tooltip--close">
              <button @click="tooltipClose" type="button" aria-label="닫기" />
            </div>
          </div>
        </div>

        <!-- 2025.10.16 나의 값 추가, 값, 단위 개발 요망 -->
        <div v-if="item.type !== 'no-data' && getMyValue(item) !== null" class="AnalyzeAgingSpeedPop--my">
            ({{ $t('AnalyzeMajorHealthRiskPopup.text6') }}
            {{ item.label.replace(/\s*\([^)]*\)\s*/g, '').trim() }}:
            {{ getMyValue(item) }} {{ getUnit(item) }})
        </div>

        <!-- 데이터가 있는 경우 차트 표시 -->
        <AnalyzeBar v-if="item.type !== 'no-data'" :value="item" />
        
        <!-- 데이터가 없는 경우 메시지 표시 -->
        <div v-else class="AnalyzeAgingSpeedPop--no-data">
          {{ $t('AnalyzeAgingSpeedPopGraph.text3') }}
        </div>
      </div>
    </div>
  </div>

  <!-- S : 20260323 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
  <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
  <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
    <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
    <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

    <!-- to 개발 | 복약정보가 있을 경우 -->
    <p class="AnalyzeDetail--medicationPopup-detail">
      <span>{{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}</span> {{ $t('AnalyzeDetail.text48') }}
    </p>
  </div>
  <!-- E : 20260323 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
</template>