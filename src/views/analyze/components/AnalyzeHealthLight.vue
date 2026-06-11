<script setup>
import { useRouter } from 'vue-router'
import BaseTooltip from '@/components/BaseTooltip.vue'
import AnalyzeHealthLightPopup from '@/views/analyze/components/AnalyzeHealthLightPopup.vue'

import { ref, defineProps, computed, watch, onBeforeMount, onMounted, toRaw } from 'vue'
import { useClusterData } from '@/assets/js/chart/graphData'
import { useStore } from 'vuex'
import { useCommonForm } from '@/utils/commonForm'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

const {  cluster_name_left,
  cluster_name_right} = useClusterData()

const { MAJOR_HEALTH_RIST_FORM } = useCommonForm()

const { t } = useI18n()

const router = useRouter()
const store = useStore()

// props
const props = defineProps({
  detailId: Number,
  clusterList: {
    Cluster_ID: String,
    Cluster_NAME: String,
    Cluster_State: String
  },
  sendData: Object,
  isOneTime: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  currentSection: {
    type: Number,
    default: undefined
  },

})

const popup = ref(false)

const dangerList = ref([])
const cautionList = ref([])
const interestList = ref([])

const tooltip = ref(false) /* 툴팁 오프너 */
const tooltipEdge = ref(0) /* 툴팁 꼬다리 위치 */

/**
 * 툴팁 닫기
 */
function tooltipClose () {
  tooltip.value = false
}

/**
 * 툴팁 열기
 * @param {*} $event
 */
function openTooltip ($event) {
  tooltip.value = true
  tooltipEdge.value = $event.x
}

/**
 * 자세히 보기 이동
 */
function detailView () {
  // 현재 섹션 정보를 store에 저장
  const sectionToSave = safeCurrentSection.value
  store.dispatch('analyze/setCurrentSection', sectionToSave)
  
  store.dispatch('analyze/setAnalysisSendData', props.sendData)
  store.dispatch('analyze/setHealthLightParams', { detailId: props.detailId })
  router.push({
    path: '/analyze/health-light'
  })
}

/**
 * 팝업 오픈
 */
function popupOpen () {
  popup.value = true
}

/**
 * 팝업 종료
 */
function popupClose () {
  popup.value = false
}

/**
 * 주요 건강 위험 컴포넌트 열기
 */
function openMajorHealthRisk () {
  // 현재 섹션 정보를 store에 저장
  const sectionToSave = safeCurrentSection.value
  store.dispatch('analyze/setCurrentSection', sectionToSave)
  
  store.dispatch('analyze/setHealthLightParams', { detailId: props.detailId })
  router.push({
    path: '/analyze/major-health-risk'
  })
}

// currentSection prop을 안전하게 처리하는 computed 속성
const safeCurrentSection = computed(() => {
  const section = props.currentSection
  
  if (section === undefined || section === null) {
    return 3
  }
  
  // 문자열인 경우 숫자로 변환
  const numSection = Number(section)
  return isNaN(numSection) ? 3 : numSection
})

// majorHealthRiskList를 생성하는 computed 속성
const majorHealthRiskList = computed(() => {
  const result = []
  const data = props.sendData?.hriData || {}
  const status = props.sendData?.hriStatus || {}

  for (const key in MAJOR_HEALTH_RIST_FORM) {
    let currentStatus = status[key]
    let value = data[key]
    
    // RFS_score는 특수 처리: status는 RFS에서, value는 RFS_score에서
    if (key === 'RFS_score') {
      currentStatus = status['RFS']
      value = data['RFS_score']
    }
    
    if (currentStatus >= 2) {
      let valueText = value

      if (key === 'CK_drink') {
        value = data.drink_amt
      } else if (key === 'CK_sleep_time') {
        value = data.sleep_time
      } else if (key === 'CK_MH_stress' || key === 'CK_water_amt' || key === 'CK_smok') {
        value = status[key]
      } else if (!isNaN(valueText) && !Number.isInteger(valueText)) {
        valueText = valueText.toFixed(2)
      }

      const item = {
        key,
        value,
        valueText,
        status: currentStatus,
        statusColorClass: getStatusColorClass(currentStatus),
        sex: props.sendData?.basics?.sex ? props.sendData.basics.sex - 1 : 0, // 0: 남자, 1: 여자
        ...MAJOR_HEALTH_RIST_FORM[key],
        index: Object.keys(MAJOR_HEALTH_RIST_FORM).indexOf(key)
      }
      result.push(item)
    }
  }
  const res = _.orderBy(result, ['status', 'index'], ['desc', 'asc'])
  return res
})

// 상태에 따른 색상 클래스를 반환하는 함수
const getStatusColorClass = (status) => {
  return {
    caution: status === 2,
    danger: status === 3
  }
}

// majorHealthRiskList의 label들을 콤마로 구분해서 반환하는 computed 속성
const majorHealthRiskLabels = computed(() => {
  const labels = majorHealthRiskList.value
    .map(item => item.label)
    .filter(Boolean)
    .join(', ')
  
  return labels
})

// Cluster_NAME을 i18n으로 변환하는 함수
const translateClusterName = (cluster) => {
  if (!cluster || !cluster.Cluster_ID) return ''
  
  const clusterNameKey = `ClusterName.${cluster.Cluster_ID}`;
  const translatedName = t(clusterNameKey);
  
  // 번역이 키와 동일하면 (번역이 없는 경우) 원본 사용
  return translatedName === clusterNameKey ? cluster.Cluster_NAME : translatedName;
}

onMounted(() => {
  const tmpCautionList = []
  const tmpDangerList = []
  const tmpInterestList = []
  props.clusterList.forEach((item, index) => {
    let includeSex = true

    cluster_name_left.forEach((element) => {
      if (element.index === index) {
        if (element.sex && element.sex !== props.sendData.basics.sex) {
          includeSex = false
        }
      }
    })

    cluster_name_right.forEach((element) => {
      if (element.index === index) {
        if (element.sex && element.sex !== props.sendData.basics.sex) {
          includeSex = false
        }
      }
    })

    // 해당 성별에 표시해야 하는 항목인지 여부 체크 후 분류
    if (includeSex) {
      if (item.Cluster_State >= 40) {
        // 40이상일 경우 관심종목이지만 주의/위험인 경우
        tmpInterestList.push(item)
      }

      switch (item.Cluster_State) {
        case 2: case 42:
          // 2:주의, 42:관심&주의
          tmpCautionList.push(item)
          break
        case 3: case 43:
          // 3:위험, 43:관심&위험
          tmpDangerList.push(item)
          break
        case 4:
          // 4: 관심
          tmpInterestList.push(item)
          break
      }
    }
  })

  cautionList.value = tmpCautionList
  dangerList.value = tmpDangerList
  interestList.value = tmpInterestList
})
</script>

<template>
  <div class="AnalyzeHealthLight">
    <div class="tooltip AnalyzeHealthLight--tooltip">
      <h2 class="tooltip--tit AnalyzeHealthLight--tip-tit">{{ $t('AnalyzeHealthLightPopup.text1')}}</h2>
      
      <button
        @click="openTooltip($event)"
        class="btn--tooltip AnalyzeHealthLight--tip-btn"
        type="button"
        title="도움말" />

      <base-tooltip
        v-if="tooltip"
        :leftLoca="tooltipEdge"
        @tooltipClose="tooltipClose"
        class="AnalyzeDetail--HumanNetwork--tip-dom">
        <template v-slot:contents>
          <ul class="tooltip--contents">
            <li>{{ $t('AnalyzeHealthLight.physiologicalNetwork1') }}</li>
            <li>{{ $t('AnalyzeHealthLight.physiologicalNetwork2') }}</li>
            <li>{{ $t('AnalyzeHealthLight.physiologicalNetwork3') }}</li>
            <li class="img">
              <img src="/img/human.png" alt="사람 이미지">
            </li>
          </ul>
        </template>
      </base-tooltip>

    </div>

    <div class="analyze-box">
      <!-- <p class="AnalyzeHealthLight--info">
        <strong class="AnalyzeHealthLight--danger">{{ $t('AnalyzeHealthLight.text4')}}</strong> {{ $t('AnalyzeHealthLight.text5')}}
        <strong class="AnalyzeHealthLight--caution">{{ cautionList.length }}{{ $t('AnalyzeHealthLight.text4')}}</strong> {{ $t('AnalyzeHealthLight.text6')}}
        <strong class="AnalyzeHealthLight--interest">{{ interestList.length }}{{ $t('AnalyzeHealthLight.text4')}}</strong> {{ $t('AnalyzeHealthLight.text7')}}
      </p> -->
      
      <div class="analyze-box-bg"></div>

      <div class="AnalyzeHealthLight--light" @click="detailView">
        <div class="AnalyzeHealthLight--light-unit-wrap">
          <div class="AnalyzeHealthLight--light-unit danger">
            <span class="circle-icon danger" />
            {{ $t('Common.warning')}}:
            {{ dangerList.length }}{{ $t('AnalyzeHealthLight.text4')}}
            <p class="AnalyzeHealthLight--light-p">
              <span v-for="item in dangerList" class="AnalyzeHealthLight--light-item" v-bind:key="item">{{ translateClusterName(item)
              }} </span>
              <span v-if="dangerList.length === 0">{{ $t('AnalyzeHealthLight.text8')}}</span>
            </p>
          </div>
          <div class="AnalyzeHealthLight--light-unit caution">
            <span class="circle-icon caution" />
            {{ $t('Common.manage')}}:
            {{ cautionList.length }}{{ $t('AnalyzeHealthLight.text4')}}
            <p class="AnalyzeHealthLight--light-p">
              <span v-for="item in cautionList" class="AnalyzeHealthLight--light-item" v-bind:key="item">{{
                translateClusterName(item) }} </span>
              <span v-if="cautionList.length === 0">{{ $t('AnalyzeHealthLight.text9')}}</span>
            </p>
          </div>
          <div class="AnalyzeHealthLight--light-unit interest">
            <span class="circle-icon interest" />
            {{ $t('Common.attention')}}:
            {{ interestList.length }}{{ $t('AnalyzeHealthLight.text4')}}
            <p class="AnalyzeHealthLight--light-p">
              <span v-for="item in interestList" class="AnalyzeHealthLight--light-item" v-bind:key="item">{{
                translateClusterName(item) }} </span>
              <span v-if="interestList.length === 0">{{ $t('AnalyzeHealthLight.text10')}}</span>
            </p>
          </div>
        </div>

        <div class="AnalyzeHealthLight--light-btn-wrap">
           <button @click="detailView" type="button" class="AnalyzeHealthLight--light-btn">{{ $t('Common.detail')}}</button>
         </div>
      </div>

      <!-- <p class="AnalyzeHealthLight--network">{{ $t('AnalyzeHealthLight.text11')}}</p>
      <div class="AnalyzeHealthLight--more">
        <button
          @click="popupOpen"
          type="button"
          class="AnalyzeHealthLight--more-btn"
          style="min-width: 80px;">{{ $t('Common.more')}}</button>
      </div> -->

      <!-- 영향을 준 요인 -->
      <div class="AnalyzeHealthLight--reason">
        <p class="AnalyzeHealthLight--reason-tit">{{ $t('AnalyzeAgingSpeedPop.text1') }}</p>
        <p class="AnalyzeHealthLight--reason-txt">
           <!-- 영향을 준 요인 개발 요망 -->
           {{ majorHealthRiskLabels }}
        </p>
        <div class="AnalyzeHealthLight--reason--btn-wrap">
          <button @click="openMajorHealthRisk" type="button" 
          class="AnalyzeHealthLight--more-btn">{{ $t('Common.detail') }}</button>
        </div>
      </div>

    </div>

    <AnalyzeHealthLightPopup v-if="popup" @popupClose="popupClose" ref="healthLightPopup" />

  </div>
</template>

<style scoped></style>
