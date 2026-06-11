<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AnalyzeDietDetailGuide from '@/views/analyze/AnalyzeDietDetailGuide.vue'
import { useI18n } from 'vue-i18n'
import { mwlRound, getScoreStatus } from '@/assets/js/common'

const { t } = useI18n()
const store = useStore()
const router = useRouter()

const popup = ref(false)
const dietGuidePopup = ref(false)
const ageArea = ref('')

const detail = computed(() => {
  return store.getters['analyze/getInhibitionAnalysisDetail']
})

const sendData = computed(() => {
  return detail.value
})

const compId = computed(() => {
  return detail.value?.compId || ''
})
const ages = computed(() => {
  return sendData.value?.hqMusBal?.ages || 0
})

const score = computed(() => {
  return mwlRound(sendData.value?.dqData?.RFS_score || 0 , 0)
})

// dqStatus 데이터를 기반으로 한 식품군별 상태 computed
const dietStatusList = computed(() => {
  const dqStatus = sendData.value?.dqStatus || {}
  
  
  const result = [
    { key: 'Multigrain', label: t('AnalyzeDietDetail.text4'), status: dqStatus.Multigrain },
    { key: 'Legumes', label: t('AnalyzeDietDetail.text7'), status: dqStatus.Legumes },
    { key: 'Vegetable', label: t('AnalyzeDietDetail.text9'), status: dqStatus.Vegetable },
    { key: 'Seafood', label: t('AnalyzeDietDetail.text8'), status: dqStatus.Seafood },
    { key: 'DairyProducts', label: t('AnalyzeDietDetail.text11'), status: dqStatus.Dairyproducts },
    { key: 'Nuts', label: t('AnalyzeDietDetail.text5'), status: dqStatus.Nuts },
    { key: 'Tea', label: t('AnalyzeDietDetail.text6'), status: dqStatus.Tea },
    { key: 'Fruit', label: t('AnalyzeDietDetail.text10'), status: dqStatus.Fruit }
  ]
  
  
  return result
})

// Regularmeal 상태 computed
const regularMealStatus = computed(() => {
  const dqStatus = sendData.value?.dqStatus || {}
  return dqStatus.Regularmeal || 0
})

const color = computed(() => {
  switch (getScoreStatus(score.value, 'rfs')) {
    case 1:
      return '#5ab651'
    case 2:
      return '#f8b500'
    case 3:
      return '#e95371'
    default:
      return ''
  }
})

/**
 * 팝업 열기
 */
function popupOpen () {
  popup.value = true
}

/**
 * 팝업 닫기
 */
function popupClose () {
  popup.value = false
}

/**
 * 맞춤 식사 가이드 팝업 열기
 */
function openDietGuidePopup () {
  dietGuidePopup.value = true
}

/**
 * 맞춤 식사 가이드 팝업 닫기
 */
function closeDietGuidePopup () {
  dietGuidePopup.value = false
}

/**
 * 뒤로가기
 */
function goBack () {
  router.go(-1)
}
</script>

<template>
  <div class="AnalyzePagesDetail AnalyzeDietDetail">
    <div class="AnalyzePagesDetail--my">
      <h2 class="AnalyzePagesDetail--tit">{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text1') }}</h2>
      <div class="AnalyzePagesDetail--index-wrap">
        <!-- 식사 점수 나오게, 색상 적용 되도록 개발 요망 -->
        <strong class="AnalyzePagesDetail--index" :style="{color: color}">{{ score }}</strong>
        {{ t('Common.score') }}
      </div>
      <div class="AnalyzePagesDetail--btn-wrap">
        <button
          @click="openDietGuidePopup"
          type="button"
          class="AnalyzePagesDetail--btn">{{ $t('AnalyzeDetail.text40') }}</button>
      </div>
    </div>

    <div class="AnalyzePagesDetail--graph-wrap">

      <!-- 나의 식사 습관 상세 판정 -->
      <div class="AnalyzePagesDetail--my-diet-wrap">
        <h2 class="AnalyzePagesDetail--section-tit">
          {{ $t('AnalyzeDietDetail.text1') }}
        </h2>
        <p class="AnalyzePagesDetail--section-tit-sub">
          {{ $t('AnalyzeDietDetail.text2') }}
        </p>

        <div class="AnalyzePagesDetail--my-diet-graph">
          
          <div class="legend-wrap">
            <span class="legend-purple">{{ $t('AnalyzeDietDetail.text25') }}</span>
            <span class="legend-green">{{ $t('AnalyzeDietDetail.text26') }}</span>
          </div>

          <div ref="bar" class="bar--wrap">
            <div class="bar--bg type7">
              <!-- 나의 위치 -->
              <div
                class="bar--position green"
                :style="`left: ${score}%;`">
                <img
                  src="/img/ico_me.svg"
                  class="bar--me"
                  alt="" />
              </div>
              <!-- 한국인 평균 -->
              <div
                class="bar--position purple"
                style="left: 49%;">
                <span class="bar--num">49
                  <span class="bar--name">{{ $t('AnalyzeDietDetail.text25') }}</span>
                </span>
              </div>
              <!-- 건강한 식사점수 -->
              <div
                class="bar--position transparent"
                style="left: 64%;">
                <span class="bar--num">64
                  <span class="bar--name">{{ $t('AnalyzeDietDetail.text27') }}</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        <div class="AnalyzePagesDetail--table">
          <div class="legend-wrap">
            <span class="legend-red">{{ $t('AnalyzeDietDetail.text14') }}</span>
          </div>

          <table>
            <colgroup>
              <col width="70%">
              <col width="30%">
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('AnalyzeDietDetail.text3') }}</th>
                <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text21') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dietStatusList" :key="item.key">
                <td>{{ item.label }}</td>
                <!-- 판정 결과 나오도록, class '부족'일 땐 red, '양호'일 땐 green 적용되도록 개발 요망 -->
                <td :class="item.status === 1 ? 'green' : item.status === 3 ? 'red' : ''">
                  {{ item.status === 1 ? $t('AnalyzeScorecomAnalyzeIndexDetail.text18'): 
                     item.status === 3 ? $t('AnalyzeScorecomAnalyzeIndexDetail.text17') : 
                     "" }}
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <colgroup>
              <col width="70%">
              <col width="30%">
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('AnalyzeDietDetail.text12') }}</th>
                <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text21') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $t('AnalyzeDietDetail.text13') }}</td>
                <td :class="regularMealStatus === 1 ? 'green' : regularMealStatus === 3 ? 'red' : ''">
                  {{ regularMealStatus === 1 ? $t('AnalyzeScorecomAnalyzeIndexDetail.text18') : 
                     regularMealStatus === 3 ? $t('AnalyzeScorecomAnalyzeIndexDetail.text17') : 
                     $t('AnalyzeScorecomAnalyzeIndexDetail.text19') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AnalyzeDietDetailGuide 
      class="AnalyzeDietDetailGuide"
      :isOpen="dietGuidePopup"
      @close="closeDietGuidePopup" />
  </div>

  <!-- S : 20260319 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
  <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
  <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
    <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
    <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

    <!-- to 개발 | 복약정보가 있을 경우 -->
    <p class="AnalyzeDetail--medicationPopup-detail">
      <span>{{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}</span> {{ $t('AnalyzeDetail.text48') }}
    </p>
  </div>
  <!-- E : 20260319 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
</template>