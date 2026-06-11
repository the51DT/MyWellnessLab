<script setup>
import MyPageBodyCompositionDataRecordDetail from '@/views/mypage/MyPageBodyCompositionDataRecordDetail.vue'
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import AnalyzeCheckupDataRecordChart from './AnalyzeCheckupDataRecordChart.vue'
import { funcIsPc } from '@/assets/js/common'
import { useCommonForm } from '@/utils/commonForm'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as checkupApi from '@/apis/checkup'

const { EXAMINATION_FORM } = useCommonForm()
const router = useRouter()
const store = useStore()

const props = defineProps({
  sendData: Object
})

const instance = getCurrentInstance()

const sendData = computed(() => props.sendData || store.getters['analyze/getAnalysisSendData'])

// use sendData.hcrData, sendData.hcrReference
const hcrData = computed(() => { // 240109 hcrData -> examinationData 로 변경
  let arr = []
  if (sendData.value && sendData.value.examinationData !== undefined) {
    arr = sendData.value.examinationData
  }
  console.log("hcrData")
  console.log(arr)
  return arr
})

const hcrRefData = computed(() => {
  let arr = []
  if (sendData.value && sendData.value.hcrReference !== undefined) {
    arr = sendData.value.hcrReference
  }
  console.log("hcrRefData")
  console.log(arr)
  return arr
})
// 성별에 따른 기준치 선택 함수
const getGenderSpecificValue = (value, gender) => {
  if (Array.isArray(value)) {
    // [남성, 여성] 순서, 1=남성, 2=여성
    return gender === 1 ? value[0] : value[1]
  }
  return value
}
// 항목별로 정리된 데이터 생성
const dataList = computed(() => {
  const arr = []
  let valueArr = []
  let dateArr = []

  // 순서를 보장하는 폼
  for (const key in EXAMINATION_FORM) {
    // hcrRefData에서 해당 항목 찾기 (기존 로직 유지)
    let refItem = null
    for (const item of hcrRefData.value) {
      const variable = item.variable.replace('HE_', '').toUpperCase()
      if (variable === key) {
        refItem = item
        break
      }
    }

    // 데이터가 있는 경우에만 차트 생성
    if (hcrData.value && hcrData.value.length > 0) {
      valueArr = []
      dateArr = []

      hcrData.value.forEach((item) => {
        const value = item[key.toLowerCase()]
        // 빈 값이 아닌 경우만 추가
        if (value && value !== "" && value !== null && value !== undefined) {
          valueArr.push(value)
          dateArr.push(item.checkDate)
        }
      })

      // 최신이 오른쪽에 오도록 데이터 순서 뒤집기
      valueArr.reverse()
      dateArr.reverse()

      // 데이터가 있는 경우에만 추가
      if (valueArr.length > 0) {
        const chartData = {
          name: EXAMINATION_FORM[key].label,
          unit: EXAMINATION_FORM[key].unit,
          tempData: valueArr.join(', '),
          valueList: valueArr,
          dateList: dateArr,
          variable: key,
          // EXAMINATION_FORM에서 기준치 가져오기
          range_min: EXAMINATION_FORM[key].range_min,
          range_max: EXAMINATION_FORM[key].range_max,
          normal_range_min: EXAMINATION_FORM[key].normal_range_min,
          normal_range_max: EXAMINATION_FORM[key].normal_range_max,
          warning_range_min: EXAMINATION_FORM[key].warning_range_min,
          warning_range_max: EXAMINATION_FORM[key].warning_range_max,
          danger_range_min: EXAMINATION_FORM[key].danger_range_min,
          danger_range_max: EXAMINATION_FORM[key].danger_range_max,
          normal_inequlity_min: EXAMINATION_FORM[key].normal_inequlity_min,
          normal_inequlity_max: EXAMINATION_FORM[key].normal_inequlity_max,
          warning_inequlit_min: EXAMINATION_FORM[key].warning_inequlit_min,
          warning_inequlit_max: EXAMINATION_FORM[key].warning_inequlit_max,
          danger_inequlit_min: EXAMINATION_FORM[key].danger_inequlit_min,
          danger_inequlit_max: EXAMINATION_FORM[key].danger_inequlit_max
        }

        // WC 또는 HB 항목일 때 성별별 기준치 적용
        if ((key === 'WC' || key === 'HB') && sendData.value?.sex) {
          const gender = sendData.value.sex // 1=남성, 2=여성
          chartData.range_min = getGenderSpecificValue(chartData.range_min, gender)
          chartData.range_max = getGenderSpecificValue(chartData.range_max, gender)
          chartData.normal_range_min = getGenderSpecificValue(chartData.normal_range_min, gender)
          chartData.normal_range_max = getGenderSpecificValue(chartData.normal_range_max, gender)
          chartData.warning_range_min = getGenderSpecificValue(chartData.warning_range_min, gender)
          chartData.warning_range_max = getGenderSpecificValue(chartData.warning_range_max, gender)
          chartData.danger_range_min = getGenderSpecificValue(chartData.danger_range_min, gender)
          chartData.danger_range_max = getGenderSpecificValue(chartData.danger_range_max, gender)
        }

        arr.push(chartData)
      }
    }
  }

  return arr
})

// 뒤로가기 (라우터 페이지용)
function goBack() {
  router.back()
}

async function switchTab(tab) {
  activeTab.value = tab
  
  // 체성분 데이터 탭을 클릭했을 때 데이터 설정
  if (tab === 'bodyComposition') {
    try {
      // basicsId 가져오기
      const basicsId = sendData.value?.basics?.id
      
      if (!basicsId) {
        console.warn('basicsId가 없습니다')
        bodyCompositionData.value = null
        return
      }
      
      // tb_formal_inbody에서 체성분 데이터 조회
      const response = await checkupApi.getInbodyDone(basicsId)
      
      if (response?.data?.inbody) {
        const inbodyData = response.data.inbody
        console.log(inbodyData)
        // 데이터 가공 (tb_formal_inbody 형식에 맞게 매핑)
        const processedData = {
          // 기본 정보
          ht: Number((inbodyData.ht || 0).toFixed(1)),           // 키 (cm)
          wt: Number((inbodyData.wt || 0).toFixed(1)),           // 몸무게 (kg)
          
          // 체지방 관련
          wbtBfMass: Number((inbodyData.wbtBfMass || 0).toFixed(1)),        // 체지방량 (kg)
          wbtBfPercent: Number((inbodyData.wbtBfPercent || 0).toFixed(2)),  // 체지방률 (%)
          
          // 근육량 관련
          wbtSmMass: Number((inbodyData.wbtSmMass || 0).toFixed(1)),  // 전체 근육량
          ramMass: Number((inbodyData.ramMass || 0).toFixed(1)),      // 우측 팔 근육량
          ramPercent: Number((inbodyData.ramPercent || 0).toFixed(2)),  // 우측 팔 근육량 비율
          rlmMass: Number((inbodyData.rlmMass || 0).toFixed(1)),      // 우측 다리 근육량
          rlmPercent: Number((inbodyData.rlmPercent || 0).toFixed(2)),  // 우측 다리 근육량 비율
          lamMass: Number((inbodyData.lamMass || 0).toFixed(1)),      // 좌측 팔 근육량
          lamPercent: Number((inbodyData.lamPercent || 0).toFixed(2)),  // 좌측 팔 근육량 비율
          llmMass: Number((inbodyData.llmMass || 0).toFixed(1)),      // 좌측 다리 근육량
          llmPercent: Number((inbodyData.llmPercent || 0).toFixed(2)),  // 좌측 다리 근육량 비율
          trkMass: Number((inbodyData.trkMass || 0).toFixed(1)),      // 몸통 근육량
          trkPercent: Number((inbodyData.trkPercent || 0).toFixed(2)),  // 몸통 근육량 비율
          
          // 추가 정보
          connectType: inbodyData.connectType || 'CUSTOM',  // 연결 타입
          surveyDate: inbodyData.surveyDate || '',  // 측정일
        }

        bodyCompositionData.value = processedData
      } else {
        // 데이터가 없으면 null로 설정하여 no-data 메시지가 표시되도록 함
        bodyCompositionData.value = null
      }
    } catch (error) {
      console.error('체성분 데이터 조회 실패:', error)
      bodyCompositionData.value = null
    }
  } 
}

const isPoup = ref(false)
const activeTab = ref('checkup') // 'checkup' 또는 'bodyComposition'
const bodyCompositionData = ref(null)

const isPc = ref(false) /* 231228 pc에서 텍스트 줄 바꿈 처리, 추가 */
onMounted(() => { /* 231228 pc에서 텍스트 줄 바꿈 처리, 추가 */
  isPc.value = funcIsPc()
  window.addEventListener('resize', () => {
    isPc.value = funcIsPc()
  })
})
</script>

<template>
  <div class="analyze-checkup-data-record-page">
    <div class="page-content">
      <!-- 탭 UI 추가 -->
      <div class="AnalyzeDetailGuide--tab">
        <button
          @click="switchTab('checkup')"
          type="button"
          class="AnalyzeDetailGuide--tab-btn"
          :class="activeTab === 'checkup' ? 'active' : ''">{{ $t('AnalyzeCheckupDataRecord.checkupData') }}</button>
        <button
          @click="() => {switchTab('bodyComposition'); }"
          type="button"
          class="AnalyzeDetailGuide--tab-btn"
          :class="activeTab === 'bodyComposition' ? 'active' : ''">{{ $t('AnalyzeCheckupDataRecord.bodyCompositionData') }}</button>
      </div>

      <!-- 검진 데이터 탭 내용 -->
      <div v-if="activeTab === 'checkup'" class="AnalyzeCheckupDataRecord">
        <p class="AnalyzeCheckupDataRecord--info">{{ $t('AnalyzeCheckupDataRecord.text2')}}
          <!-- <br v-if="isPc" />  -->
          {{ $t('AnalyzeCheckupDataRecord.text3')}}
          <span>{{ $t('AnalyzeCheckupDataRecord.text4')}}
            <!-- <br v-if="isPc" />  -->
            {{ $t('AnalyzeCheckupDataRecord.text5')}}
            <br v-if="isPc" /> 
            {{ $t('AnalyzeCheckupDataRecord.text6')}}</span>
        </p>

        <div class="analyze-box short">

          <div class="legend-wrap">
            <span class="legend-soft-red">{{ $t('Common.warning')}}</span>
            <span class="legend-soft-yellow">{{ $t('Common.manage')}}</span>
            <span class="legend-soft-green">{{ $t('Common.normal')}}</span>
          </div>

          <div class="AnalyzeCheckupDataRecord--graph-wrap">

            <div v-for="(item) in dataList" class="AnalyzeCheckupDataRecord--graph-unit" v-bind:key="item">
              <h2 class="AnalyzeCheckupDataRecord--graph-tit">{{ item.name }}<!-- 수축기혈압 (mmHg) --></h2>
              <div class="AnalyzeCheckupDataRecord--graph">
                <!-- 그래프 컴퍼넌트 추가 -->
                <AnalyzeCheckupDataRecordChart :chartData="item" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 체성분 데이터 탭 내용 -->
      <div v-if="activeTab === 'bodyComposition'" class="AnalyzeCheckupDataRecord--bodyComposition">
        <div v-if="bodyCompositionData">
          <MyPageBodyCompositionDataRecordDetail :sendData="bodyCompositionData" />
        </div>
        <div v-else class="no-data">
          <div class="analyze-box" v-html="$t('AnalyzeCheckupDataRecord.noBodyCompositionData')">
          </div>
        </div>
      </div>
    </div>
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
.AnalyzeCheckupDataRecord--bodyComposition {
  margin-top: 20px;
}
</style>
