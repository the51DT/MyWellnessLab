<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AnalyzeMuscleBalanceDetailPopup from '@/views/analyze/components/AnalyzeMuscleBalanceDetailPopup.vue'
import MyPageBodyCompositionDataRecord from '@/views/mypage/MyPageBodyCompositionDataRecord.vue'
import { useI18n } from 'vue-i18n'
import { mwlRound, getScoreStatus, getScoreColor, getStatusColor, getColor } from '@/assets/js/common'
import BtnBottom from '@/components/BtnBottom.vue'
import BasePopupTit from '@/components/BasePopupTit.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const user = store.getters.getUser
const popup = ref(false)
const historyPopup = ref(false)
const activeFab = ref(true)

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
  return mwlRound(sendData.value?.hqMusBal?.score || 0, 0)
})
const rank = computed(() => {
  return sendData.value?.hqMusBal?.percent || 0 
})

const meanScore = computed(() => {
  // 평균 점수 계산 (임시로 50%로 설정)
  return mwlRound(sendData.value?.hqMusBal?.t_mean || 0, 0)
})

const ageArea = computed(() => {
  let age = parseInt(sendData.value?.analyzeAge / 10) * 10
  if (age < 20) age = 20
  if (age > 80) age = 80
  if (isNaN(age)) age = 20

  return age
})

const gender = computed(() => {
  return sendData.value?.basics?.sex === 1 ? t('Common.male') : t('Common.female')
})



// 근육 밸런스 점수에 따른 색상 계산
const color = computed(() => {
  const muscleBalanceScore = sendData.value?.hqMusBal?.status
  if (muscleBalanceScore !== null && muscleBalanceScore !== undefined) {
    return getColor(muscleBalanceScore)
  }
  return getColor(0) // 기본값은 관리 (노란색)
})

// 근육량 상태 (bb_status)
const muscleStatus = computed(() => {
  return sendData.value?.hqMusMass?.bodypartData?.bb_status || 1
})

// 체지방 상태 (bf_percent_status)
const fatStatus = computed(() => {
  return sendData.value?.hqMusMass?.fatData?.bf_percent_status || 1
})
// 근육량 종합 상태 (status) - computed property로 분리
const muscleOverallStatus = computed(() => {
  return sendData.value?.hqMusMass?.status || 1
})
// 근육량 부위별 상태 클래스 반환
function getMuscleStatusClass(status) {
  if (status === 1) return 'green';    // 정상
  if (status === 2) return 'yellow';   // 주의
  if (status === 3) return 'red';      // 부족/불균형
  return '';                       // 기본값
}
const isOnceTime = computed(() => {
  return sendData.value.commonInfo.analysisType === 'onetime'
})
// 근육량 부위별 상태 텍스트 반환
function getMuscleStatusText(status) {
  if (status === 1) return t('AnalyzeScorecomAnalyzeIndexDetail.text18'); // 충족
  if (status === 2) return t('AnalyzeScorecomAnalyzeIndexDetail.text19'); // 주의
  if (status === 3) return t('AnalyzeScorecomAnalyzeIndexDetail.text17'); // 부족
  return '-';
}
// 상태값에 따른 텍스트 반환
function getStatusText (status, type = 'muscle') {
  if (type === 'fat') {
    // 체지방: 표준이상, 표준, 표준이하
    switch (status) {
      case 1:
        return t('AnalyzeMuscleBalanceDetail.standard')
      case 2:
        return t('AnalyzeMuscleBalanceDetail.somewhatHigh')
      case 3:
        return t('AnalyzeMuscleBalanceDetail.high')
      default:
        return ''
    }
  } else {
    // 근육량: 평균이상, 평균, 평균미만
    switch (status) {
      case 1:
        return t('AnalyzeMuscleBalanceDetail.aboveAverage')
      case 2:
        return t('AnalyzeMuscleBalanceDetail.average')
      case 3:
        return t('AnalyzeMuscleBalanceDetail.belowAverage')
      default:
        return t('AnalyzeMuscleBalanceDetail.average')
    }
  }
}

// 근육량 평균값 (t_mean) - 정오각형 기준선용
const muscleMean = computed(() => {
  return mwlRound(sendData.value?.hqMusMass?.t_mean || 50, 0)
})

// 오각형 그래프 좌표 계산 함수 (기준선용 - t_mean 기반 동적 크기)
function calculatePentagonPoints() {
  // 부위별 고정 기준값 설정
  const centerValue = 90      // 몸통 90%
  const leftArmValue = 80     // 왼팔 80%
  const rightArmValue = 80    // 오른팔 80%
  const leftLegValue = 90     // 왼다리 90%
  const rightLegValue = 90    // 오른다리 90%
  
  // 각 부위별로 percent 값에 따라 반지름 계산
  const centerRadius = (centerValue / 100) * 50      // 몸통 반지름
  const leftArmRadius = (leftArmValue / 100) * 50    // 왼팔 반지름
  const rightArmRadius = (rightArmValue / 100) * 50  // 오른팔 반지름
  const leftLegRadius = (leftLegValue / 100) * 50    // 왼다리 반지름
  const rightLegRadius = (rightLegValue / 100) * 50  // 오른다리 반지름
  
  // 각 꼭지점별로 해당 부위의 반지름 사용
  const centerPoint = `${50},${(50 - centerRadius).toFixed(0)}`                    // 상단 (몸통)
  const rightArmPoint = `${(50 + rightArmRadius * Math.cos(72 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + rightArmRadius * Math.sin(72 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`  // 우측 상단 (오른팔)
  const rightLegPoint = `${(50 + rightLegRadius * Math.cos(144 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + rightLegRadius * Math.sin(144 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`   // 우측 하단 (오른다리)
  const leftLegPoint = `${(50 + leftLegRadius * Math.cos(216 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + leftLegRadius * Math.sin(216 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`     // 좌측 하단 (왼다리)
  const leftArmPoint = `${(50 + leftArmRadius * Math.cos(288 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + leftArmRadius * Math.sin(288 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`   // 좌측 상단 (왼팔)
  
  return `${centerPoint} ${rightArmPoint} ${rightLegPoint} ${leftLegPoint} ${leftArmPoint}`
}

// 사용자 데이터 오각형 좌표 계산 함수
function calculateUserPentagonPoints() {
  const bodypartData = sendData.value?.hqMusMass?.bodypartData
  
  
  // 각 부위별 percent 값을 100%로 제한
  const centerValue = bodypartData.TRK_percent      // 몸통 (중앙)
  const leftArmValue = bodypartData.LRM_percent    // 왼팔 (좌측 상단)
  const rightArmValue = bodypartData.RRM_percent    // 오른팔 (우측 상단)
  const leftLegValue =  bodypartData.LLG_percent     // 왼다리 (좌측 하단)
  const rightLegValue = bodypartData.RLG_percent    // 오른다리 (우측 하단)
  
  // 각 부위별로 percent 값에 따라 반지름 계산
  const centerRadius = (centerValue / 100) * 50      // 몸통 반지름
  const leftArmRadius = (leftArmValue / 100) * 50    // 왼팔 반지름
  const rightArmRadius = (rightArmValue / 100) * 50  // 오른팔 반지름
  const leftLegRadius = (leftLegValue / 100) * 50    // 왼다리 반지름
  const rightLegRadius = (rightLegValue / 100) * 50  // 오른다리 반지름
  
  // 각 꼭지점별로 해당 부위의 반지름 사용
  const centerPoint = `${50},${(50 - centerRadius).toFixed(0)}`                    // 상단 (몸통)
  const rightArmPoint = `${(50 + rightArmRadius * Math.cos(72 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + rightArmRadius * Math.sin(72 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`  // 우측 상단 (오른팔)
  const rightLegPoint = `${(50 + rightLegRadius * Math.cos(144 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + rightLegRadius * Math.sin(144 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`   // 우측 하단 (오른다리)
  const leftLegPoint = `${(50 + leftLegRadius * Math.cos(216 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + leftLegRadius * Math.sin(216 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`     // 좌측 하단 (왼다리)
  const leftArmPoint = `${(50 + leftArmRadius * Math.cos(288 * Math.PI / 180 - Math.PI / 2)).toFixed(0)},${(50 + leftArmRadius * Math.sin(288 * Math.PI / 180 - Math.PI / 2)).toFixed(0)}`   // 좌측 상단 (왼팔)
  
  return `${centerPoint} ${rightArmPoint} ${rightLegPoint} ${leftLegPoint} ${leftArmPoint}`
}
// 특정 꼭지점의 좌표를 반환하는 함수
function getUserPentagonPoint(index, percentKey) {
  const bodypartData = sendData.value?.hqMusMass?.bodypartData
  if (!bodypartData) return { x: 50, y: 50 }
  
  const percentValue = bodypartData[percentKey]
  const radius = (percentValue / 100) * 50
  
  const angles = [0, 72, 144, 216, 288]
  const angle = (angles[index] * Math.PI) / 180
  
  const x = 50 + radius * Math.cos(angle - Math.PI / 2)
  const y = 50 + radius * Math.sin(angle - Math.PI / 2)
  
  return { x: x.toFixed(0), y: y.toFixed(0) }
}
const formattedDate = computed(() => {
  if (!sendData.value?.surveyDate) return ''
  
  try {
    const dateStr = sendData.value.surveyDate
    
    // 2025.08.25 16:35:32 형식에서 날짜 부분만 추출
    const [datePart] = dateStr.split(' ')
    return datePart // 2025.08.25 그대로 반환
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
})

const formattedTime = computed(() => {
  if (!sendData.value?.surveyDate) return ''
  
  try {
    const dateStr = sendData.value.surveyDate
    
    const [, timePart] = dateStr.split(' ')
    const [hours, minutes] = timePart.split(':').map(Number)
    
    if (hours < 12) {
      return `${t('AnalyzeMuscleBalanceDetail.am')} ${hours}:${String(minutes).padStart(2, '0')}`
    } else if (hours === 12) {
      return `${t('AnalyzeMuscleBalanceDetail.pm')} ${hours}:${String(minutes).padStart(2, '0')}`
    } else {
      return `${t('AnalyzeMuscleBalanceDetail.pm')} ${hours}:${String(minutes).padStart(2, '0')}`
    }
  } catch (error) {
    console.error('Time formatting error:', error)
    return ''
  }
})
const genderImg = computed(() => {
  return sendData.value.basics.sex === 1 ? 'm' : 'f'
})
const violinImg = computed(() => { // 연령대에 해당하는 이미지 명
  let age = 20
  if (!isNaN(ageArea.value)) {
    age = ageArea.value
  }
  return '/img/pdf/res/violin/violin-mus'+ '-' + age + '-' + genderImg.value + '.png' 
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
 * 체성분 측정 이력 팝업 열기
 */
function openHistoryPopup () {
  historyPopup.value = true
}

/**
 * 체성분 측정 이력 팝업 닫기
 */
function closeHistoryPopup () {
  historyPopup.value = false
}

/**
 * 뒤로가기
 */
function goBack () {
  router.go(-1)
}

/**
 * 스크롤 핸들러
 */
const handleScroll = () => {
  if (window.scrollY > 0) {
    activeFab.value = false  // 스크롤되면 버튼 숨김
  } else {
    activeFab.value = true   // 맨 위에 있으면 버튼 표시
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="AnalyzePagesDetail AnalyzeMuscleBalanceDetail">
    <div class="AnalyzePagesDetail--my">
      <h2 class="AnalyzePagesDetail--tit">{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text1') }}</h2>
      <div class="AnalyzePagesDetail--index-wrap">
        <!-- 근육 밸런스 분석 지수 점수 나오게, 색상 적용 되도록 개발 요망 -->
        <strong class="AnalyzePagesDetail--index" :style="{color: color}">{{ score  }}</strong>
        {{ t('Common.score') }}
      </div>
      <div class="AnalyzePagesDetail--btn-wrap">
        <button
          @click="popupOpen"
          v-if="!isOnceTime"
          type="button"
          class="AnalyzePagesDetail--btn">{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text2') }}</button>
      </div>
    </div>

    <div class="AnalyzePagesDetail--graph-wrap">

      <div class="analyze-box">
        <!-- 나의 위치 -->
        <p class="AnalyzePagesDetail--age-wrap">
        <strong class="AnalyzePagesDetail--age">{{ ageArea }}{{ $t('Common.age')}} {{ gender }}</strong>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text3') }}</p>
        <div class="AnalyzePagesDetail--graph"> <!--그래프-->
          <div class="graph-wrap">
            <div class="violin-container">
              <div class="graph-back">
                <div class="legend">
                  <div>
                  <span class="legend--avarage">{{ ageArea + $t('AnalyzeMuscleBalanceDetail.ageGroupAverage') }}</span>
                  <div class="position" />
                  <span>{{ $t('AnalyzeMuscleBalanceDetail.myPosition') }}</span>
                  </div>
                </div>
                <div class="graph-wrap-in" />
              </div>
              <img class="violin" :src="violinImg" alt="" />
              <div class="my-point" :style="{ left: '50%', top: 100 - score + '%', }">
                <img class="my-point-img" src="/img/ico_me.svg" alt="" />
                <div class="my-point-pointer">
                  <div class="point" />
                </div>
                <div class="my-point-score">
                  <span class="my-rank">{{ rank }}{{ $t('AnalyzeMuscleBalanceDetail.rank') }}</span>
                </div>
              </div>
              <img
                class="violin-avg"
                src="/img/violin-avg.svg"
                alt=""
                :style="{top: 100 - meanScore + '%',}" />
              <div class="violin-container--max">100</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 나의 체성분 -->
      <div class="AnalyzePagesDetail--my-body-wrap">
        <!-- <h2 class="AnalyzePagesDetail--section-tit">
          <span class="small-tit">체성분</span>
          <strong>
            근육량:
              <span :style="{color: getColor(muscleStatus)}">{{ getStatusText(muscleStatus) }}</span><br />
             체지방:
             <span :style="{color: getColor(fatStatus)}">{{ getStatusText(fatStatus, 'fat') }}</span>
          </strong>
        </h2> -->
        <h2 class="AnalyzePagesDetail--tit">{{ $t('AnalyzeMuscleBalanceDetail.bodyComposition') }}</h2>
        <div class="AnalyzePagesDetail--btn-wrap">
          <button
            @click="openHistoryPopup"
            v-if="!isOnceTime"
            type="button"
            class="AnalyzePagesDetail--btn">
            {{ $t('AnalyzeScorecomAnalyzeIndexDetail.text5') }}
          </button>
        </div>
        
        <div class="analyze-box">
          <!-- <p class="AnalyzePagesDetail--my-body-desc">
              {{ ageArea }}{{ $t('Common.age')}} {{ gender }} 100명 중 {{ rank }}등이며, 나의 근육량 상세 판정은
                             <span :style="{color: getColor(muscleOverallStatus)}">{{ getStatusText(muscleOverallStatus, 'muscle') }}</span>입니다
          </p> -->
          <div class="AnalyzePagesDetail--my-body">
            
            <!-- 오각형 그래프 그려지는 영역역 -->
            <div class="pentagon-chart">
              <!-- 전체 범위 x 0~100, y 0~100 -->
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

                <!-- 빨간색 기준선 오각형 (t_mean 기반 동적 크기) -->
                <polygon 
                  class="baseline-pentagon"
                  :points="calculatePentagonPoints(muscleMean)"
                />
                
                <!-- 민트색 사용자 데이터 오각형 (bodypartData percent 기반) -->
                <polygon 
                  class="user-data-area"
                  :points="calculateUserPentagonPoints()"
                />
                
                <!-- 사용자 데이터 오각형 포인트 점들 (동적 계산) -->
                <!-- 몸통 -->
                <circle 
                  class="data-point" 
                  :cx="getUserPentagonPoint(0, 'TRK_percent').x" 
                  :cy="getUserPentagonPoint(0, 'TRK_percent').y" 
                  r="2"
                />
                <!-- 오른팔 -->
                <circle 
                  class="data-point" 
                  :cx="getUserPentagonPoint(1, 'RRM_percent').x" 
                  :cy="getUserPentagonPoint(1, 'RRM_percent').y" 
                  r="2"
                />
                <!-- 오른다리 -->
                <circle 
                  class="data-point" 
                  :cx="getUserPentagonPoint(2, 'RLG_percent').x" 
                  :cy="getUserPentagonPoint(2, 'RLG_percent').y"
                  r="2"
                />
                <!-- 왼다리 -->
                <circle 
                  class="data-point" 
                  :cx="getUserPentagonPoint(3, 'LLG_percent').x" 
                  :cy="getUserPentagonPoint(3, 'LLG_percent').y" 
                  r="2"
                />
                <!-- 왼팔 -->
                <circle 
                  class="data-point" 
                  :cx="getUserPentagonPoint(4, 'LRM_percent').x" 
                  :cy="getUserPentagonPoint(4, 'LRM_percent').y" 
                  r="2"
                />

              </svg>
            </div>
            
            <dl class="body">
              <dt>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text10') }}</dt>
                <dd :style="{color: getColor(sendData?.hqMusMass?.bodypartData?.TRK_status)}">
                 {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.TRK_status) }}
               </dd>
            </dl>
            <dl class="left-arm">
              <dt>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text11') }}</dt>
                             <dd :style="{color: getColor(sendData?.hqMusMass?.bodypartData?.LRM_status)}">
                 {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.LRM_status) }}
               </dd>
            </dl>
            <dl class="right-arm">
              <dt>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text12') }}</dt>
                             <dd :style="{color: getColor(sendData?.hqMusMass?.bodypartData?.RRM_status)}">
                 {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.RRM_status) }}
               </dd>
            </dl>
            <dl class="left-leg">
              <dt>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text13') }}</dt>
                             <dd :style="{color: getColor(sendData?.hqMusMass?.bodypartData?.LLG_status)}">
                 {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.LLG_status) }}
               </dd>
            </dl>
            <dl class="right-leg">
              <dt>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text14') }}</dt>
                             <dd :style="{color: getColor(sendData?.hqMusMass?.bodypartData?.RLG_status)}">
                 {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.RLG_status) }}
               </dd>
            </dl>
          </div>
          <div class="AnalyzePagesDetail--my-body-legend">
            <div>
              <span class="legend-avarage">{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text15') }}</span>
              <div class="position" />
              <span v-if="!isOnceTime">
                {{ sendData?.name }}
                {{ $t('Common.name') }}
              </span>
              <span v-else>
                {{ sendData?.name }}
              </span>
            </div>
          </div>

          <!-- 나의 부위별 근육량 -->
          <div class="AnalyzePagesDetail--my-body-table">
            <h2 class="AnalyzePagesDetail--section-tit">
              {{ $t('AnalyzeMuscleBalanceDetail.myMuscleByPart') }}
            </h2>
            
            <div class="tag-wrap">
              <!-- :class="`tag-${item.tagType}`" 적용되도록 개발 요망 -->
              <!-- tagType: 바디키 'bodykey' / 직접입력 'manual' / 'mywellness' -->
              <span class="tag" :class="`tag-${
                sendData?.connectType === 'INBODY' ? 'mywellness' :
                sendData?.connectType === 'CUSTOM' ? 'manual' :
                sendData?.connectType === 'BODYKEY' ? 'bodykey' : 'mywellness'
              }`">
                {{ 
                  sendData?.connectType === 'INBODY' ? t('AnalyzeMuscleBalanceDetail.myWellnessLab') :
                  sendData?.connectType === 'CUSTOM' ? t('AnalyzeMuscleBalanceDetail.directInput') :
                  sendData?.connectType === 'BODYKEY' ? t('AnalyzeMuscleBalanceDetail.bodykeyInput') : t('AnalyzeMuscleBalanceDetail.myWellnessLab')
                }}
              </span>
            </div>
            <p class="AnalyzePagesDetail--date">
              {{ $t('BodyCompositionPop.text17') }}:
              <span class="AnalyzePagesDetail--date-day">{{ formattedDate }}</span>
              <span v-if="sendData?.connectType !== 'CUSTOM'" class="AnalyzePagesDetail--date-time">{{ formattedTime }}</span>
            </p>

            <div class="AnalyzePagesDetail--table">
              <div class="legend-wrap">
                <span class="legend-red">{{ $t('AnalyzeMuscleBalanceDetail.managementRequired') }}</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text20') }}</th>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text21') }}</th>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text26') }}(%)</th>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text25') }}(kg)</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 몸통 근육량 -->
                  <tr>
                    <td>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text10') }}</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.bodypartData?.TRK_status)">
                      {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.TRK_status) }}
                    </td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.TRK_percent?.toFixed(1) || '-' }}</td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.TRK?.toFixed(1) || '-' }}</td>
                  </tr>
                  
                  <!-- 왼팔 근육량 -->
                  <tr>
                    <td>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text11') }}</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.bodypartData?.LRM_status)">
                      {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.LRM_status) }}
                    </td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.LRM_percent?.toFixed(1) || '-' }}</td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.LRM?.toFixed(1) || '-' }}</td>
                  </tr>
                  
                  <!-- 오른팔 근육량 -->
                  <tr>
                    <td>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text12') }}</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.bodypartData?.RRM_status)">
                      {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.RRM_status) }}
                    </td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.RRM_percent?.toFixed(1) || '-' }}</td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.RRM?.toFixed(1) || '-' }}</td>
                  </tr>
                  
                  <!-- 왼다리 근육량 -->
                  <tr>
                    <td>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text13') }}</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.bodypartData?.LLG_status)">
                      {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.LLG_status) }}
                    </td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.LLG_percent?.toFixed(1) || '-' }}</td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.LLG?.toFixed(1) || '-' }}</td>
                  </tr>
                  
                  <!-- 오른다리 근육량 -->
                  <tr>
                    <td>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text14') }}</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.bodypartData?.RLG_status)">
                      {{ getMuscleStatusText(sendData?.hqMusMass?.bodypartData?.RLG_status) }}
                    </td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.RLG_percent?.toFixed(1) || '-' }}</td>
                    <td>{{ sendData?.hqMusMass?.bodypartData?.RLG?.toFixed(1) || '-' }}</td>
                  </tr>
                  
                  <!-- 종합 판정 -->
                  <!-- <tr class="total-judge">
                    <td>종합 판정</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.bodypartData?.bb_status)">
                      {{ getStatusText(muscleStatus) }}
                    </td>
                    <td>{{ ageArea }}{{ $t('Common.age')}} {{ gender }}</td>
                    <td>100명 중 {{ rank }}등</td>
                  </tr> -->
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text22') }}</th>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text21') }}</th>
                    <th>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text23') }}(%)</th>
                    <th>{{ $t('AnalyzeMuscleBalanceDetail.bodyFatMass') }}(kg)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t('AnalyzeScorecomAnalyzeIndexDetail.text23') }}</td>
                    <td :class="getMuscleStatusClass(sendData?.hqMusMass?.fatData?.bf_percent_status)">{{ getStatusText(fatStatus, 'fat') }}</td>
                    <td>{{ sendData?.hqMusMass?.fatData?.bf_percent?.toFixed(1) || '-' }}</td>
                    <td>{{ sendData?.hqMusMass?.fatData?.bf?.toFixed(1) || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AnalyzeMuscleBalanceDetailPopup 
      v-if="popup && detail"
      @popupClose="popupClose"
      class="AnalyzePagesDetail--popup"
      :compId="compId"
      :ageArea="ageArea"
      :sendData="detail" />

    <BasePopupTit v-if="historyPopup" @popupClose="closeHistoryPopup">
      <template #title>
        {{ t('Router.checkup.text23') }}
      </template>
      
      <template #contents>
        <MyPageBodyCompositionDataRecord />
      </template>
    </BasePopupTit>
    
    <BtnBottom :show="activeFab" />
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

<style lang="scss" scoped>
.AnalyzePagesDetail--graph{
  margin-bottom: 4rem;
}

.violin-title {
  width: 100%;

  h3 {
    text-align: left;
    /* top: 0; */
    /* position: absolute; */
    font-size: 12px;
    font-weight: 700;
    color: #000;
    align-self: flex-start;
    margin-bottom: 0px;
    line-height: normal;
  }
}

.violin-container {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  //margin-top: 65px;
  //height: 200px;
  height: 100%;
  width: 100%;

  img {
    position: absolute;
  }

  .indicator {
    position: absolute;
    /* right: -9px - 18px); */
    left: 102px;
    width: 8px;
    height: 200px;
    /* background-color: black; */
    border-top: 1px solid #414042;
    border-bottom: 1px solid #414042;

    text-align: center;

    font-weight: 400;
    font-size: 12px;
    color: #414042;

    .vertical {
      margin: 0 auto;
      width: 1px;
      background-color: #414042;
      height: 100%;
    }

    .max {
      text-align: left;
      position: absolute;
      width: 100px;
      right: -103px;
      top: 0;
      transform: translateY(-50%);
    }

    .mean {
      text-align: left;
      position: absolute;
      width: 100px;
      right: -103px;
      transform: translateY(-75%);
    }

    .min {
      position: absolute;
      text-align: left;
      width: 100px;
      right: -103px;
      bottom: 0;
      //transform: translateY(50%);
    }
  }

  &--max {
    font-size: 1.3rem;
    color: #555;
    position: absolute;
    top: -18px;
    left: 0;
  }
}

.graph-back {
  position: absolute;
  left: 0;
  top: 0;
  /* transform: translateX(calc(50% + 23px)); */

  //height: 236px;
  height: 100%;
  /* width: calc(239px + 23px); */
  width: 100%;
  //@include flex(flex-start, center);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  img {
    //margin-top: 18px;
    width: auto;
    //height: 219px;
    //transform: translateX(-11.5px);
  }

  .legend {
    width: calc(270px + 7px);
    margin-left: -18px;

    font-size: 14px;
    color: #555;
    text-align: left;
    //margin-bottom: 5px;
    //@include flex(space-between, center);
    display: flex;
    //justify-content: space-between;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -4rem;
    @media (min-width: 960px) {
      font-size: 1.5rem;
      bottom: -4.4rem;
    }

    .name {
      margin-left: 0px;
    }

    div {
      display: inline-block;
      vertical-align: -8%;
      //@include flex(center, center);
      //display: flex;
      //justify-content: center;
      //align-items: center;
    }

    span {
      margin: 0;
      margin-left: 5px;
      font-family: 'RixSinHead_Medium', sans-serif;
    }

    .position {
      $size: 1.2rem;
      width: $size;
      height: $size;
      border-radius: $size;
      background-color: #1DB196;
      margin-left: 13px;
    }

    img {
      position: relative;
      width: 19px;
      height: auto;
      margin: 0;
      transform: translateX(0%);
    }

    &--avarage {
      &:before {
        content: "";
        display: inline-block;
        width: 3rem;
        height: 1rem;
        margin-right: .5rem;
        background: url("/img/img_biolet_line.svg") no-repeat left;
      }
    }
  }
}

.violin {
  /* width: 104px;
  height: auto; */
  /* height: 138px; */
  height: 100%;
  width: auto;
  object-fit: contain;
}

.my-point {
  position: absolute;
  top: 0;
  left: 0;

  .my-point-score {
    position: absolute;
    color: #1DB196;
    font-size: 17px;
    width: 100px;
    top: -47px;
    left: 18px;
    text-align: left;

    @media (min-width: 960px) {
      font-size: 2rem;
    }
  }

  .my-point-img {
    position: absolute;
    transform: translate(50%, -17px);
    width: 24px !important;
    height: auto;
    right: 0;
    bottom: 0;
    z-index: 1;
    max-width: 2.4rem;
  }

  .my-point-pointer {
    z-index: 1;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -100%);
    height: 21.65px;
    width: 1px;
    /* background-color: #00b4de; */
    border-right: 1px dashed #00b4de;

    .point {
      position: absolute;

      /* right: -5.68px; */
      z-index: 100;
      transform: translate(-50%, 50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1.3px solid white;
      background-color: #1DB196;
      /* bottom: -5.68px; */
      bottom: 0;
    }
  }
}

.violin-avg {
  position: absolute;
  transform: translateY(-50%);
  //width: 90px;
  height: auto;
}
.my-rank{
  padding: 0 2px;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
  border-radius: 5px;
  z-index: 1;
  position: relative;
}
</style>