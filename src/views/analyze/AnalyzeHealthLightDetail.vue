<script setup>
import BasePopupFull from '@/views/publishing/BasePopupFull.vue'
import BaseTooltip from '@/components/BaseTooltip.vue'

import { useStore } from 'vuex'
import { ref, inject, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useClusterData } from '@/assets/js/chart/graphData'
import * as analysisApi from '@/apis/analysis'
import * as checkupApi from '@/apis/checkup'
import ResultElementGridAnimation from '@/views/analyze/components/ResultElementGridAnimation.vue'
import GraphChart from '@/views/analyze/components/graphChart.vue'
import { HEALTH_DANGER_FACTOR_DESC } from '@/utils/textCollection.js'
import HealthNetwork from '@/assets/js/chart/HealthNetwork.js'

const { cluster_data : clusterData,
  cluster_name_left : clusterNameLeft,
  cluster_name_right : clusterNameRight } = useClusterData() || { cluster_data: [], cluster_name_left: [], cluster_name_right: [] }

// const { cluster_data : clusterData,
//   cluster_name_left : clusterNameLeft,
//   cluster_name_right : clusterNameRight } = useClusterData()

const store = useStore()
const { t } = useI18n()
const pdfScale = ref(4)

// 탭 상태 관리
const isNetworkTab = ref(true) // true: 인체생리네트워크, false: 건강영역별 원료가이드

// param
const detailId = ref(store.getters['analyze/getHealthLightParams'].detailId)
const sendData = store.getters['analyze/getAnalysisSendData']
// ref var
const article = ref(null) /* 240102 전체 싸고 있는 div */
const graphChartRef = ref(null) /* GraphChart 컴포넌트 참조 */

// UI var
const isZoomMode = ref(false)
const isExpand = ref(false) /* 240102 모바일에서 확대보기 오프너, 작업 중 */
const oldStyleOpt = ref('')



// 애니메이션 데이터
const animation_datas = ref({})
const network_datas = ref(null)
const showAnimation = ref(false)
const showZoomMode = ref(false)

// 실제 데이터
const analyzeData = ref({
  hqData: {}
})

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
 * 특정 클러스터에 복약 중인 약물이 있는지 체크
 * @param {number} clusterIndex - 클러스터 인덱스
 * @returns {boolean}
 */
function hasMedicationForCluster(clusterIndex) {
  const medicationKeys = clusterMedicationMapping[clusterIndex] || []
  return medicationKeys.some(key => {
    const mapping = medicationMapping.find(m => m.key === key)
    return mapping && medicationList.value.includes(mapping.label)
  })
}

// 임시복약설문 데이터
const temporaryMedicationData = ref(null)
const isLoadingMedication = ref(false)
const medicationList = ref([])

// 클러스터 인덱스와 복약 키 매핑
const clusterMedicationMapping = {
  // cluster_left_list 매핑
  22: ['drugSleep'],           // 수면 건강
  6: ['drugEye'],              // 눈 건강  
  23: ['drugNose'],            // 코 과민반응
  8: ['drugImmune'],           // 면역 기능
  7: ['drugAtopy'],            // 과민 피부 상태 개선
  0: ['drugLiver'],            // 간 건강
  17: [],                      // 항산화 (복약 없음)
  24: [],                      // 영양균형 (복약 없음)
  16: [],                      // 피부 건강 (복약 없음)
  11: ['drugStomach'],         // 위 건강
  12: ['drugIntestine'],       // 장 건강
  2: ['drugBJ'],               // 관절/뼈 건강
  
  // cluster_right_list 매핑
  4: ['drugMemory'],           // 기억력 개선
  5: ['drugTension'],          // 긴장완화
  21: ['drugBF'],              // 혈행 개선
  19: ['drugBP'],              // 혈압 조절
  20: ['drugTG', 'drugTC'],    // 혈중 지질 개선
  14: ['drugBodyfat'],         // 체지방 조절
  18: ['drugGLU'],             // 혈당 조절
  10: [],                      // 운동수행능력/지구력 향상 (복약 없음)
  15: ['drugTired'],           // 피로 개선
  3: ['drugMuscle'],           // 근육(근력)
  13: ['drugMen'],             // 전립선 건강
  1: ['drugSexHor']            // 갱년기 여성건강
}

// 복약 키와 다국어 라벨 매핑 (전역으로 이동)
const medicationMapping = [
  { key: 'drugGLU', label: t('CheckupMedication.text7') },
  { key: 'drugTG', label: t('CheckupMedication.text8') },
  { key: 'drugTC', label: t('CheckupMedication.text9') },
  { key: 'drugBP', label: t('CheckupMedication.text10') },
  { key: 'drugBF', label: t('CheckupMedication.text11') },
  { key: 'drugBodyfat', label: t('CheckupMedication.text12') },
  { key: 'drugBJ', label: t('CheckupMedication.text14') },
  { key: 'drugStomach', label: t('CheckupMedication.text15') },
  { key: 'drugIntestine', label: t('CheckupMedication.text16') },
  { key: 'drugLiver', label: t('CheckupMedication.text17') },
  { key: 'drugEye', label: t('CheckupMedication.text18') },
  { key: 'drugMuscle', label: t('CheckupMedication.text19') },
  { key: 'drugMemory', label: t('CheckupMedication.text20') },
  { key: 'drugTired', label: t('CheckupMedication.text21') },
  { key: 'drugSleep', label: t('CheckupMedication.text23') },
  { key: 'drugTension', label: t('CheckupMedication.text24') },
  { key: 'drugNose', label: t('CheckupMedication.text25') },
  { key: 'drugAtopy', label: t('CheckupMedication.text26') },
  { key: 'drugImmune', label: t('CheckupMedication.text28') },
  { key: 'drugMen', label: t('CheckupMedication.text29') },
  { key: 'drugSexHor', label: t('CheckupMedication.text33') }
]

// 건강 영역별 원료 가이드 데이터
const healthGuideData = computed(() => {
  const clusterList = analyzeData.value.clusterList || []
  const sendDataClusterList = sendData.clusterList || []
  console.log(sendDataClusterList)
  
  // Cluster_ID와 다국어 키 매핑
  const clusterMapping = {
    'CL_023': 'sleep_health',
    'CL_007': 'eye_health', 
    'CL_024': 'nose_sensitivity',
    'CL_009': 'immune_function',
    'CL_008': 'sensitive_skin_improvement',
    'CL_001': 'liver_health',
    'CL_018': 'antioxidant',
    'CL_025': 'nutrition_balance',
    'CL_017': 'skin_health',
    'CL_012': 'stomach_health',
    'CL_013': 'intestinal_health',
    'CL_003': 'joint_bone_health',
    'CL_005': 'memory_improvement',
    'CL_006': 'tension_relief',
    'CL_022': 'blood_circulation',
    'CL_020': 'blood_pressure_control',
    'CL_021': 'blood_lipid_improvement',
    'CL_015': 'body_fat_control',
    'CL_019': 'blood_sugar_control',
    'CL_011': 'exercise_performance_endurance',
    'CL_016': 'fatigue_improvement',
    'CL_004': 'muscle_strength',
    'CL_014': 'prostate_health',
    'CL_002': 'menopause_women_health'
  }
  
  // sendData.clusterList를 사용하여 상태 설정 (AnalyzeHealthLight.vue와 동일하게)
  const getStatusFromClusterList = (clusterId) => {
    // Cluster_ID로 해당 클러스터 찾기
    const cluster = sendDataClusterList.find(item => item.Cluster_ID === clusterId)
    if (!cluster) {
      return { interest: false, status: 'normal' }
    }
    
    const clusterState = cluster.Cluster_State
    console.log(cluster)
    // AnalyzeHealthLight.vue의 로직과 동일하게 상태 판단
    if (clusterState >= 40) {
      // 40이상일 경우 관심종목이지만 주의/위험인 경우
      const actualState = clusterState - 40
      if (actualState === 2) return { interest: true, status: 'warn' }
      if (actualState === 3) return { interest: true, status: 'danger' }
      return { interest: true, status: 'normal' }
    }
    
    switch (clusterState) {
      case 2:
        return { interest: false, status: 'warn' }  // 주의
      case 3:
        return { interest: false, status: 'danger' } // 위험
      case 4:
        return { interest: false, status: 'interest' } // 관심 (정상으로 표시)
      default:
        return { interest: false, status: 'normal' } // 0, 1: 정상
    }
  }
  
  // Cluster_ID와 원료 정보 매핑
  const clusterItemsMapping = {
    'CL_023': '미강주정추출물, L-테아닌',
    'CL_007': '루테인지아잔틴추출복합물, 마리골드꽃추출물, 토마토추출물, 두나리엘라추출물, 베타카로틴, 비타민A, EPA 및 DHA 함유 유지, 빌베리추출물',
    'CL_024': '피카오프레토 분말 등 복합물',
    'CL_009': '프로바이오틱스, 아연, 비타민C, 비타민D, 두나리엘라추출물, 베타카로틴, 비타민A, 마늘분말, 비타민E, 셀레늄, 케르세틴, 로즈마리추출물혼합물, 강황추출물혼합물, 블랙엘더베리추출물',
    'CL_008': '감마리놀렌산 함유 유지, 보라지종자유, 달맞이꽃종자유',
    'CL_001': '밀크씨슬추출물, 유산균발효다시마추출물',
    'CL_018': '아세로라농축물, 비타민C, 코엔자임Q10, 비타민E, 셀레늄, 아연, 몰리브덴, 망간, 구리, 케르세틴, 강황추출물혼합물, 로즈마리추출물혼합물, 두나리엘라추출물, 베타카로틴, 비타민A, 토마토추출물',
    'CL_025': '비타민B1, 비타민B2, 나이아신, 판토텐산, 비타민B6, 비오틴, 엽산, 비타민B12, 요오드, 크롬',
    'CL_017': '밀배유추출물, 비타민C, 히알루론산, 비오틴, 두나리엘라추출물, 베타카로틴, 비타민A',
    'CL_012': '인동덩굴꽃봉오리추출물',
    'CL_013': '프로바이오틱스, 이눌린, 난소화성말토덱스트린, 구아검, 귀리식이섬유, 식이섬유',
    'CL_003': '글루코사민, MSM, 보스웰리아, 칼슘, 마그네슘, 비타민D, 비타민K, 오미자추출물, 망간',
    'CL_005': '은행잎 추출물, EPA 및 DHA 함유 유지, 유산균발효다시마추출물',
    'CL_006': 'L-테아닌',
    'CL_022': 'EPA 및 DHA 함유 유지, 감마리놀렌산 함유 유지, 보라지종자유, 달맞이꽃종자유, 은행잎 추출물, 비타민K',
    'CL_020': '코엔자임Q10, 마늘분말, 케르세틴',
    'CL_021': 'EPA 및 DHA 함유 유지, 감마리놀렌산 함유 유지, 키토산, 귀리식이섬유, 마늘분말',
    'CL_015': '가르시니아캄보지아 추출물, 공액리놀레산(씨엘에이), L. curvatus HY7601와 L. plantarum KY1032의 프로바이오틱스 복합물, 자몽추출물 등 복합물, 강낭콩추출물, 키토산, 식이섬유, L-카르니틴',
    'CL_019': '바나바잎추출물, 크롬, 비타민B6, 귀리식이섬유, 계피가지추출물',
    'CL_011': '옥타코사놀',
    'CL_016': '밀크씨슬추출물, 비타민B1, 비타민B2, 나이아신, 판토텐산, 비타민B6, 비오틴, 엽산, 비타민B12, 옥타코사놀, 비타민C, 코엔자임Q10',
    'CL_004': '단백질, 오미자추출물, 칼슘, 마그네슘, 비타민D, 철',
    'CL_014': '쏘팔메토열매/네틀루트추출물, 호박씨유',
    'CL_002': '루바브뿌리추출물'
  }

  const result = Object.keys(clusterMapping).map(clusterId => {
    const i18nKey = clusterMapping[clusterId]
    const statusInfo = getStatusFromClusterList(clusterId)
    return {
      clusterId,
      category: t(`GraphData.${i18nKey}`),
      interest: statusInfo.interest,
      status: statusInfo.status,
      items: t(`HealthGuideItems.${i18nKey}`)
    }
  })
  
  // interest가 true이거나 status가 'normal'이 아닌 항목만 필터링하고 높은 순으로 정렬
  const filteredResult = result
    .filter(item => item.interest || item.status !== 'normal')
    .sort((a, b) => {
      // status 우선순위: danger > warn > normal
      const statusOrder = { 'danger': 3, 'warn': 2, 'interest': 0 }
      return statusOrder[b.status] - statusOrder[a.status]
    })
  
  return filteredResult
})

const MHN_CL = ref(null)
const MHN_NL = ref(null)
const MHN_EL = ref(null)
const MHN_NCL = ref(null)

const linkList = ref(null)
const isPop = ref(false) /* 231211 모바일에서 확대보기 오프너 */

/**
 * 애니메이션 데이터 설정
 */
function setAnimationData() {
  // 실제 데이터가 있으면 그것을 사용하고, 없으면 예시 데이터 사용
  const healthData = analyzeData.value.hqData || {}
  
  // HEALTH_DANGER_FACTOR_DESC의 각 항목에 대해 상태 설정
  HEALTH_DANGER_FACTOR_DESC.forEach(factor => {
    const code = factor.code
    let status = 1 // 기본값: 정상
    
    // 실제 데이터에서 해당 항목의 상태를 가져오거나 랜덤하게 설정
    if (healthData[code] && healthData[code].status) {
      status = healthData[code].status
    } else {
      // 예시 데이터: 일부는 위험/주의 상태로 설정
      const random = Math.random()
      if (random < 0.3) {
        status = 3 // 위험
      } else if (random < 0.6) {
        status = 2 // 주의
      } else {
        status = 1 // 정상
      }
    }
    
    animation_datas.value[code] = { status }
  })
}

/**
 * 애니메이션 종료 처리
 */
function showAnimationEnd() {
  showAnimation.value = false
  // 애니메이션 종료 후 필요한 처리를 여기에 추가
}

/**
 * 네트워크 데이터 설정
 */
function setNetworkData() {
  // HealthNetwork 인스턴스 생성
  const healthNetwork = new HealthNetwork();
  
  // index와 Cluster_ID 매핑
  const clusterIdMapping = {
    22: 'CL_023', // 수면 건강
    6: 'CL_007',  // 눈 건강
    23: 'CL_024', // 코 과민반응
    8: 'CL_009',  // 면역 기능
    7: 'CL_008',  // 과민 피부 상태 개선
    0: 'CL_001',  // 간 건강
    17: 'CL_018', // 항산화
    24: 'CL_025', // 영양균형
    16: 'CL_017', // 피부 건강
    11: 'CL_012', // 위 건강
    12: 'CL_013', // 장 건강
    2: 'CL_003',  // 관절/뼈 건강
    4: 'CL_005',  // 기억력 개선
    5: 'CL_006',  // 긴장완화
    21: 'CL_022', // 혈행 개선
    19: 'CL_020', // 혈압 조절
    20: 'CL_021', // 혈중 지질 개선
    14: 'CL_015', // 체지방 조절
    18: 'CL_019', // 혈당 조절
    10: 'CL_011', // 운동수행능력/지구력 향상
    15: 'CL_016', // 피로 개선
    3: 'CL_004',  // 근육(근력)
    13: 'CL_014', // 전립선 건강
    1: 'CL_002'   // 갱년기 여성건강
  };
  
  // 왼쪽 리스트에 복약 정보와 Cluster_ID 추가
  const leftListWithMedication = healthNetwork.cluster_left_list.map(item => ({
    ...item,
    hasMedication: hasMedicationForCluster(item.index),
    Cluster_ID: clusterIdMapping[item.index]
  }))
  
  // 오른쪽 리스트에 복약 정보와 Cluster_ID 추가  
  const rightListWithMedication = healthNetwork.cluster_right_list.map(item => ({
    ...item,
    hasMedication: hasMedicationForCluster(item.index),
    Cluster_ID: clusterIdMapping[item.index]
  }))
  
  network_datas.value = {
    clusterList: sendData.clusterList,
    nodeList: sendData.nodeList,
    edgeList: sendData.edgeList,
    ncList: sendData.ncList,
    cluster_left_list: leftListWithMedication,
    cluster_right_list: rightListWithMedication
  }
}

/**
 * 애니메이션 후 처리
 */
function afterEnter() {
  showAnimation.value = false
}

/**
 * 줌 모드 플래그 설정
 */
function showZoomModeFlag(flag) {
  showZoomMode.value = flag
}

/**
 * 분석 결과 상세 조회
 * @param {*} basicsId
 */
async function getDetailAnalyzeData (basicsId) {
  await analysisApi.getAnalysisHeathLightDetail(basicsId).then(res => {
    analyzeData.value = res.data.logmeCompleteAnalysisDetail
    MHN_CL.value = analyzeData.value.clusterList
    MHN_NL.value = analyzeData.value.nodeList
    MHN_EL.value = analyzeData.value.edgeList
    MHN_NCL.value = analyzeData.value.ncList
    
    // 애니메이션 데이터 설정
    setAnimationData()
    // 네트워크 데이터 설정
    setNetworkData()
  }).catch(error => {
    console.log(error)
  })
}

/**
 * 복약데이터 조회
 */
async function getDrugTemporary() {
  isLoadingMedication.value = true
  try {
    const response = await checkupApi.getDrugTemporary(sendData.basics.id, 'DONE')
    temporaryMedicationData.value = response.data
    const drugData = response.data.drug
    console.log(drugData)
    // 복용중인 약물이 있는 항목들을 찾아서 label명으로 변환
    if (drugData) {
      medicationList.value = []
      
      medicationMapping.forEach(item => {
        if (drugData[item.key] === 1) {
          medicationList.value.push(item.label)
        }
      })
    }
    
  } catch (error) {
    console.error('임시복약설문조회 실패:', error)
    temporaryMedicationData.value = null
  } finally {
    isLoadingMedication.value = false
  }
}

/**
 * MhnElList 세팅
 */
function setMhnElList () {
  const convertedList = []

  MHN_EL.value.forEach((el) => {
    convertedList.push(el)
  })

  convertedList.forEach((el, index) => {
    el.index = index
  })

  linkList.value = convertedList
}

/**
 * MhnNclList 세팅
 */
function setMhnNclList () {
  MHN_NCL.value = MHN_NCL.value.filter(
    (val, idx) => {
      return (
        MHN_NCL.value.findIndex((item) => item.Node_ID === val.Node_ID) === idx
      )
    }
  )
}

/**
 * MhnNlList 세팅
 */
function setMhnNlList () {
  const rateX = getRateX()
  const rateY = getRateY()

  MHN_NL.value = MHN_NL.value.filter(
    (val, idx) => {
      return (
        MHN_NL.value.findIndex((item) => item.Node_ID === val.Node_ID) === idx
      )
    }
  )

  MHN_NL.value.forEach((el) => {
    el.clusterInfo = {}
    MHN_NCL.value.forEach((el2, idx) => {
      if (el.Node_ID === el2.Node_ID) {
        // el2의 모든 속성을 clusterInfo에 복사
        Object.keys(el2).forEach(key => {
          el.clusterInfo[key] = el2[key]
        })
        el.clusterIndex = idx
      }
    })
  })

  MHN_NL.value.forEach((el, idx) => {
    // Node_Name을 i18n 키로 변환하여 사용 (Node_ID는 문자열)
    const nodeNameKey = `NodeName.${el.Node_ID}`;
    let translatedName;
    try {
      translatedName = t(nodeNameKey);
    } catch (e) {
      translatedName = nodeNameKey;
    }
    
    // 번역이 키와 동일하면 (번역이 없는 경우) 원본 사용
    el.name = translatedName === nodeNameKey ? el.Node_Name : translatedName;
    el.id = el.Node_ID
    el.x = (el.X * rateX) / rateY
    el.y = el.Y
    el.index = idx

    switch (el.Node_State) {
      case 0:
      case 1:
        // 정상 노드 색상
        el.itemStyle = {
          animation: true,
          opacity: 0.3,
          color: '#717171'
        }

        break
      case 2:
        // 주의 노드 색상
        el.itemStyle = {
          animation: true,
          opacity: 1,
          color: '#FDC840'
        }
        break
      case 3:
        // 위험 노드 색상
        el.itemStyle = {
          animation: true,
          opacity: 1,
          color: '#C2373F'
        }

        break
      case 4:
        break
    }
  })
}

/**
 * MhnClList 세팅
 */
function setMhnClList () {
  if (!MHN_CL.value || !Array.isArray(MHN_CL.value)) {
    return
  }
  
  MHN_CL.value.forEach((element, index) => {
    if (!element || !MHN_NL.value) return
    
    element.nodes = MHN_NL.value.filter(
      (item) => item.clusterInfo && item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    )

    element.nodes.forEach((elem) => {
      // clusterData가 존재하고 index가 범위 내에 있는지 확인
      try {
        elem.symbol = clusterData && Array.isArray(clusterData) && clusterData[index] && clusterData[index].symbol ? clusterData[index].symbol : 'circle'
      } catch (error) {
        elem.symbol = 'circle'
      }
      if (elem.Node_Category.includes('Core')) {
        elem.symbol = 'circle'
      }
    })
  })
  MHN_CL.value = MHN_CL.value.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace('CL_', '')) -
      Number(b.Cluster_ID.replace('CL_', ''))
    )
  })
}

/**
 * clusterState 계산
 */
// function countClusterState () {
//   dangerCount.value = 0
//   warnCount.value = 0
//   interCount.value = 0

//   MHN_CL.value.forEach((el, index) => {
//     let includeSex = true
//     clusterNameLeft.forEach((el2) => {
//       if (el2.index === index) {
//         if (el2.sex && el2.sex !== sendData.basics.sex) {
//           includeSex = false
//         }
//       }
//     })

//     clusterNameRight.forEach((el2) => {
//       if (el2.index === index) {
//         if (el2.sex && el2.sex !== sendData.basics.sex) {
//           includeSex = false
//         }
//       }
//     })

//     if (includeSex) {
//       switch (el.Cluster_State) {
//         case 0:
//         case 1:
//           break
//         case 2:
//           warnCount.value++
//           break
//         case 3:
//           dangerCount.value++
//           break
//         case 4:
//           interCount.value++
//           break
//       }

//       // 관심이랑 다른 상태 겹쳤을때
//       if (el.Cluster_State > 40) {
//         switch (el.Cluster_State - 40) {
//           case 0:
//           case 1:
//             break
//           case 2:
//             warnCount.value++
//             break
//           case 3:
//             dangerCount.value++
//             break
//           case 4:
//             // this.interCount++;
//             break
//         }
//         interCount.value++
//       }
//     }
//   })
// }

const digit = ref(120) /* 240102 공통적으로 나오는 180을 변수로 뺌 */

/**
 * x rate 계산
 * @returns {number}
 */
function getRateX () {
  const targetWidth = article.value.clientWidth
  const baseWidth = 175

  // let rateX = (targetWidth - 180) / baseWidth;
  const rateX = (targetWidth - digit.value) / baseWidth /* 240102 180을 변수로 변경 */
  return rateX * resolution.value
}

/**
 * 차트 높이 계산
 * @returns {number}
 */
function getHeight () {
  const headerHeight = 55 + 30
  const recommendListHeight = 0 // 85;
  // const agileHeight = 25;
  const agileHeight = 80 /* 240102 차트가 그려질 때 윈도우 높이를 체크해서 비례해서 커지길래 그보다 작게 하기 위해 값을 높였음 */
  const windowHeight = document.documentElement.offsetHeight // window.innerHeight
  const height = windowHeight - recommendListHeight - headerHeight - agileHeight

  return height
}

/**
 * y rate 계산
 * @returns {number}
 */
function getRateY () {
  const baseHeight = 732

  const rateY = getHeight() / baseHeight

  return rateY * resolution.value
}

/**
 * 차트 데이터 세팅
 * @param {*} needUpdateData
 */
async function prepareData (needUpdateData = true) {
  // const rateX = getRateX()
  // const rateY = getRateY()

  setMhnNclList()
  setMhnNlList()
  setMhnClList()

  const convertedLinks = []

  MHN_EL.value.forEach((el) => {
    el.id = el.Edge_ID
    el.source = el.S_Node_ID
    el.target = el.E_Node_ID

    convertedLinks.push({
      ...el,
      lineStyle: {
        color: '#000000',
        width: 0.5
      }
    })
  })

  linkList.value = convertedLinks

  MHN_CL.value = MHN_CL.value.filter((val, idx) => {
    return (
      MHN_CL.value.findIndex(
        (item) => item.Cluster_ID === val.Cluster_ID
      ) === idx
    ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
  })

  MHN_CL.value.forEach((element, index) => {
    if (!element || !MHN_NL.value) return
    
    element.nodes = MHN_NL.value.filter(
      (item) => item.clusterInfo && item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    )

    const textOption = {
      textBorderWidth: 0,
      textBorderColor: 'transparent',
      fontFamily: 'Pretendard',
      width: 105,
      // 폰트 크기 이슈가 있어서 수정
      overflow: isMobile() ? 'break' : 'nowrap'
    }

    element.nodes.forEach((elem) => {
      // clusterData가 존재하고 index가 범위 내에 있는지 확인
      try {
        elem.symbol = clusterData && Array.isArray(clusterData) && clusterData[index] && clusterData[index].symbol ? clusterData[index].symbol : 'circle'
      } catch (error) {
        elem.symbol = 'circle'
      }
      // console.log(toRaw(elem))
      if (elem.Node_Category.includes('Core')) {
        elem.symbol = 'circle'
        elem.symbolSize = 18
      }
      elem.label = { show: false }

      const fontLarge = 16 * resolution.value /* pc 폰트 */
      const fontSmall = 12 * resolution.value /* mo 폰트 */
      // 노드명 폰트 사이즈 모바일/PC에 따라 조절. 특정 항목만 보이도록 설정
      // console.log(element.Cluster_state + ' / ' + isMobile());

      if (
        elem.Node_Category.includes('Core') ||
          elem.Node_Category.includes('Core-life')
      ) {
        if (element.Cluster_State > 1) {
          if (isMobile() === false) {
            elem.label = {
              show: true,
              fontSize: fontLarge,
              ...textOption
            }
          } else {
            elem.label = {
              show: true,
              fontSize: fontSmall,
              ...textOption
            }
          }
        } else {
          if (isMobile() === false) {
            elem.label = {
              show: true,
              fontSize: fontLarge,
              ...textOption
            }
          } else {
            elem.label = {
              show: true,
              fontSize: fontSmall,
              ...textOption
            }
          }
        }
      } else {
        if (isMobile() === false) {
          elem.label = {
            show: true,
            fontSize: fontSmall,
            ...textOption
          }
        }
      }
    })

    MHN_CL.value = MHN_CL.value.sort((a, b) => {
      return (
        Number(a.Cluster_ID.replace('CL_', '')) -
          Number(b.Cluster_ID.replace('CL_', ''))
      )
    })
  })
}



/**
 * clusterData 세팅
 */
function getClusterData () {
  const optionData = []

  const selectIndex = []

  const rateX = getRateX()
  const rateY = getRateY()

  const scale = 0.2115 * defScale.value * rateY

  const offset = 3 * scale
  let offsetX = -126 * rateX
  let offsetY = 43.5 * rateY
  let clusterCount = 0

  const radius = 50 * scale

  MHN_CL.value.forEach((element, index) => {
    let points = []

    // 클러스터에 해당하는 노드 위치값 추출
    element.nodes.forEach((el) => {
      points.push([el.x * scale, el.y * scale])
      selectIndex.push(el.index)
    })

    if (points.length === 0) {
      optionData.push({
        type: 'polygon',
        shape: {
          points,
          smooth: 1
        },
        left: x.value, // points[0][0],
        top: y.value, // points[0][1],

        focus: 'none',
        silent: true,
        style: {
          fill: 'green',
          opacity: 0.1,
          lineWidth: 8
        }
      })

      return
    }
    while (points.length <= 2) {
      points.push([points[0][0] + offset, points[0][1] - offset])
      points.push([points[0][0] - offset, points[0][1] - offset])
      points.push([points[0][0] + offset, points[0][1] + offset])
      points.push([points[0][0] - offset, points[0][1] + offset])

      points.push([points[1][0] + offset, points[1][1] - offset])
      points.push([points[1][0] - offset, points[1][1] - offset])
      points.push([points[1][0] + offset, points[1][1] + offset])
      points.push([points[1][0] - offset, points[1][1] + offset])
    }

    let left = 0
    let top = 0
    let right = 0
    let bottom = 0

    points.forEach((elem, index) => {
      if (index === 0) {
        left = elem[0]
        top = elem[1]
        right = elem[0]
        bottom = elem[1]
      } else {
        if (left > elem[0]) left = elem[0]
        if (top > elem[1]) top = elem[1]
        if (right < elem[0]) right = elem[0]
        if (bottom < elem[1]) bottom = elem[1]
      }
    })

    // 일정범위 넘어가는 포인트들은 각각의 그룹으로 분리
    const clusters = clustering(points, 160 * rateY)

    clusters.forEach((clElement) => {
      // convexHull알고리즘으로 포인트 추출
      points = convexHull(clElement)

      while (points.length <= 2) {
        points.push([
          points[0][0] + offset * rateX,
          points[0][1] - offset * rateY
        ])
        points.push([
          points[0][0] - offset * rateX,
          points[0][1] - offset * rateY
        ])
        points.push([
          points[0][0] + offset * rateX,
          points[0][1] + offset * rateY
        ])
        points.push([points[0][0] - offset, points[0][1] + offset * rateY])

        points.push([
          points[1][0] + offset * rateX,
          points[1][1] - offset * rateY
        ])
        points.push([
          points[1][0] - offset * rateX,
          points[1][1] - offset * rateY
        ])
        points.push([
          points[1][0] + offset * rateX,
          points[1][1] + offset * rateY
        ])
        points.push([
          points[1][0] - offset * rateX,
          points[1][1] + offset * rateY
        ])
      }

      // 중심값 계산
      const centerPoints = centroid(points)

      offsetX = -126 * rateX
      offsetY = 43.5 * rateY

      // 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌
      if (index + 1 === 3) {
        points.push([centerPoints[0], top - radius * 0.1])
      }
      if (index + 1 === 7 && clElement.length > 2) {
        offsetY = 50 * rateY
      }
      if (index + 1 === 8) {
        points.push([left, centerPoints[1] + radius * rateY * 0.5])
        points.push([right, centerPoints[1] + radius * rateY])
        offsetY = 35 * rateY
      }
      if (index + 1 === 9 && clElement.length > 2) {
        offsetY = 37 * rateY
      }

      if (index + 1 === 11 && clElement.length > 2) {
        points.push([centerPoints[0], bottom + radius * 7 * rateY])
      }

      if (index + 1 === 12) {
        points.push([centerPoints[0], top - radius * 0.1])
        points.push([left, top + radius * 2])
      }
      if (index + 1 === 13 && clElement.length > 2) {
        points.push([
          left - radius * 0.5,
          centerPoints[1] - radius * rateY
        ])
        points.push([
          left - radius * 0.5,
          centerPoints[1] + radius * rateY * 0.25
        ])
      }
      if (index + 1 === 14) {
        points.push([centerPoints[0], top - radius * 0.1])
      }
      if (index + 1 === 16 && clElement.length > 2) {
        points.push([
          centerPoints[0],
          centerPoints[1] - radius * 1.7 * rateY
        ])
      }
      if (index + 1 === 19 && clElement.length > 2) {
        offsetX = -129 * rateX
      }
      if (index + 1 === 21) {
        points.push([centerPoints[0], top - radius * 0.5])
        points.push([left - radius * 0.5, centerPoints[1]])
      }
      if (index + 1 === 22) {
        points.push([centerPoints[0], top - radius * 0.1])
      }

      points.forEach((elem, index) => {
        const vector = getVector(elem, centerPoints)
        elem[0] += vector[0] * radius
        elem[1] += vector[1] * radius
      })

      // 각 포지션 radius값만큼 넓힌후 재계산
      points = convexHull(points)
      points.forEach((elem, index) => {
        if (index === 0) {
          left = elem[0]
          top = elem[1]
          right = elem[0]
          bottom = elem[1]
        } else {
          if (left > elem[0]) left = elem[0]
          if (top > elem[1]) top = elem[1]
          if (right < elem[0]) right = elem[0]
          if (bottom < elem[1]) bottom = elem[1]
        }
      })

      let color = 'green'

      let existInterestBorder = false

      if (element.Cluster_State >= 40) {
        existInterestBorder = true
      }

      let includeSex = true
      clusterNameLeft.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== sendData.basics.sex) { includeSex = false }
        }
      })
      clusterNameRight.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== sendData.basics.sex) { includeSex = false }
        }
      })

      // 해당 성별에서 보여야하는 리스트인지 판단 후 맞는 경우 상태값에 따라 배경색 설정
      if (includeSex) {
        switch (element.Cluster_State) {
          case 0:
            color = '#7171711A'
            break
          case 1:
            color = '#7171711A'

            break
          case 2:
            color = '#F8B50026' /* 주의 */
            break
          case 3:
            color = '#E953714D' /* 위험 */
            break
          case 4:
            color = '#00AFEC66' /* 관심 */
            break
          default:
            break
        }

        switch (element.Cluster_State - 40) {
          case 0:
            color = '#7171711A'
            break
          case 1:
            color = '#7171711A'

            break
          case 2:
            color = '#F8B50026'
            break
          case 3:
            color = '#E953714D'
            break
          case 4:
            color = '#00AFEC66'
            break
          default:
            break
        }
      } else {
        color = '#7171711A'
      }

      // 클러스터 하나씩 켜지는 애니메이션
      let keyframeAnimation = []

      if (init.value <= 1) {
        keyframeAnimation = [
          {
            delay: 100 + 100 * parseInt(clusterCount++ / 3),
            duration: 1.25,
            loop: false,
            keyframes: [
              {
                percent: 0,
                style: { opacity: 0 }
              },
              {
                percent: 1,
                style: {
                  opacity:
                      element.Cluster_State === 0 ||
                      element.Cluster_State === 1
                        ? 0.1
                        : 0.5
                }
              }
            ]
          }
        ]
      }

      optionData.push({
        type: 'polygon',
        shape: {
          points,
          smooth: 0.5
        },
        keyframeAnimation,
        left: x.value + left + offsetX, // points[0][0],
        top: y.value + top + offsetY, // points[0][1],
        focus: 'none',
        silent: true,

        style: {
          fill: color, // "green",
          opacity: 1,
          lineWidth: 3 * pdfScale.value,
          stroke: existInterestBorder ? '#55C3F1' : 'transparent'
        }
      })
    })
  })

  return optionData
}

/**
 * cluster 상태값 계산
 * @param {*} clusterIndex
 * @returns {number}
 */
function getClusterStatus (clusterIndex) {
  if (MHN_CL.value) {
    const state = MHN_CL.value[clusterIndex].Cluster_State
    if (state >= 40) {
      // 40이상이면 관심이면서 주의/위험
      return state - 40
    }
    return state
  }
  return 0
}

/**
 * 차트 옵션을 생성한다.
 * @param {*} zoom
 * @returns {object}
 */
function getOption (zoom = 1) {
  // zoom = 1.1;
  const targetNames = ['아스파테이트 아미노 전이효소', '수면-각성 프로파일', '혈관 내피세포 활성', '면역력 자가진단', '혈청 크레아티닌', '수분 섭취량', '혈당 조절 관련 호르몬/단백질', '노화억제 분석지수', '콜레스테롤 합성', '콜레스테롤 배설', '에너지 대사 조절', '간담도성 손상지표', '알라닌 아미노 전이효소', '혈청 크레아티닌', '근육 단백질 합성 증가']
  const convexHullData = getClusterData()
  // console.log("convexHullData", convexHullData);
  const option = {
    tooltip: {},
    // dataZoom: {
    //   start: 80,
    //   type: "inside",
    // },
    legend: [],
    xAxis: { show: false },
    yAxis: { show: false },
    animation: false,
    graphic: {
      elements: convexHullData // 네트워크 영역 데이터. convexHull 알고리즘 사용
    },
    series: [
      {
        itemStyle: {
          // opacity: 0.75,
          color: '#59C370'
        },
        silent: true,

        type: 'graph',
        // layout: "none",
        data: MHN_NL.value.map(e => {
          if (targetNames.includes(e.Node_Name)) {
            let targetIndex = e.Node_Name.indexOf(' ')
            const splittedString = e.Node_Name.split(' ')

            if (splittedString.length > 2 && splittedString[0].length < 5) {
              targetIndex = e.Node_Name.indexOf(' ', targetIndex + 1)
            }

            const newString = e.Node_Name.substring(0, targetIndex + 1) + '\n' + e.Node_Name.substring(targetIndex + 1)
            e.name = newString
          }
          return e
        }), // 노드 리스트 세팅
        links: linkList.value, // 연결 정보 데이터 세팅

        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          opacity: 1,
          fontFamily: 'Pretendard'
          // fontSize: 10,
        },
        labelLayout: {
          hideOverlap: false
        },
        zoom,
        scaleLimit: {
          min: scaleMin.value,
          max: scaleMax.value
        },
        blur: {
          itemStyle: {
            opacity: 1
          },
          label: {
            opacity: 1
          }
        },
        lineStyle: {
          color: 'source',
          opacity: 0.25
          // curveness: 0.3,
        },
        select: {
          animation: false,
          lineStyle: {
            // color: "#fc4a6a",
            color: 'red',
            opacity: 1,
            width: 2
          },
          itemStyle: {
            opacity: 1,
            color: '#fc4a6a'
          },
          label: {
            show: true,
            opacity: 1,
            fontWeight: 'bold'
          }
        },
        selectedMode: 'multiple',

        emphasis: {
          animation: false,

          disabled: false,
          focus: 'adjacency',
          // scale: true,
          itemStyle: {
            opacity: 0.6,
            z: 100,
            color: '#C2373F'
          },
          lineStyle: {
            width: 10,
            color: '#ff0000',
            opacity: 1
          },

          label: {
            position: ['0%', '120%'], // "right",
            // offset: [0, 15],
            align: 'center',
            show: true,
            opacity: 1,
            // fontSize: this.isZoomMode ? 6 : 10,
            fontWeight: 'bold',
            fontFamily: 'Pretendard'
          }
        }
      }
    ]
  }

  return option
}

/**
 * 차트 x, y position을 업데이트한다.
 * @param {*} dx
 * @param {*} dy
 */
function updatePos (dx, dy) {
  x.value += dx
  y.value += dy
}

/**
 * 확대 화면 취소
 */
function resetZoom () {
  isZoomMode.value = false
  isExpand.value = false
  
  // body 스크롤 복원
  document.body.style.overflow = ''
  
  // graphChart 컴포넌트의 resetZoom 호출 (라벨 숨김 포함)
  if (graphChartRef.value && graphChartRef.value.resetZoom) {
    graphChartRef.value.resetZoom();
  }
  
  const chartWrap = graphChartRef.value ? graphChartRef.value.$el.querySelector('.chart-wrap') : null
  
  if (chartWrap && oldStyleOpt.value) {
    chartWrap.style.cssText = oldStyleOpt.value
  }
}

/**
 * 차트를 리사이즈한다.
 */


/**
 * 팝업을 오픈한다.
 * @param {*} val
 */
function openPop (val) {
  isPop.value = val
}



/**
 * 확대보기 작업 중
 */
function expandMap () {
  const chartWrap = graphChartRef.value ? graphChartRef.value.$el.querySelector('.chart-wrap') : null
  
  if (!isZoomMode.value) {
    // 확대 시: 원래 스타일을 먼저 저장 (확대하기 전에!)
    if (chartWrap && !oldStyleOpt.value) {
      oldStyleOpt.value = chartWrap.style.cssText
    }
    
    // 상태 변경
    isExpand.value = true
    isZoomMode.value = true
    
    // body 스크롤 막기
    document.body.style.overflow = 'hidden'
    
    // graphChart 컴포넌트의 resolution과 isZoomMode 설정
    if (graphChartRef.value && graphChartRef.value.setResolution) {
      setTimeout(() => {
        console.log('expandMap에서 setResolution(3) 호출');
        graphChartRef.value.setResolution(3);
      }, 100);
    }
    
    if (chartWrap) {
      const newStyle = 
        'position: absolute;' +
        'top: 50%;' +
        'left: 60%;' +
        'transform: translate(-50%, -50%) scale(1.3);' +
        'transform-origin: center center;' +
        'z-index: 10;' +
        'width: calc(100% + 300px);' +
        'height: calc(100% + 150px);' +
        'max-width: 95vw;' +
        'max-height: 95vh;'
      
      chartWrap.style.cssText = newStyle
    }
    
  } else {
    // 축소 시: 원래 스타일로 복원
    isPop.value = false
    // body 스크롤 복원
    document.body.style.overflow = ''
    resetZoom()
  }
}
/**
 * PinchZoom
 * @param {*} event
 */
function listener (event) {
  if (event.touches.length > 1) { event.preventDefault() } // 터치 두 개 이상 동시 터치 방지
}

/**
 * 탭 전환 함수
 * @param {boolean} val - true: 인체생리네트워크, false: 건강영역별 원료가이드
 */
function switchTab (val) {
  isNetworkTab.value = val
}

onMounted(async () => {
  // body 스크롤 초기화 (혹시 이전에 막혀있던 경우 복원)
  document.body.style.overflow = ''
  
  await getDetailAnalyzeData(detailId.value)
  
  // 임시복약설문조회 API 호출
  await getDrugTemporary()

  // 애니메이션 데이터가 설정되지 않았다면 기본값으로 설정
  if (Object.keys(animation_datas.value).length === 0) {
    setAnimationData()
  }

  // 네트워크 데이터 설정 (복약 정보 포함) - 복약 데이터 로드 후 호출
  setNetworkData()

  setMhnElList()
  setMhnClList()
  // countClusterState()

  document.addEventListener('touchmove', listener, { passive: false })
})

onBeforeUnmount(() => {
  // 페이지 떠날 때 body 스크롤 복원
  document.body.style.overflow = ''
  document.removeEventListener('touchmove', listener)
})

</script>

<template>
  
  <div id="HealthNetworkPage" class="AnalyzeHealthLightDetail" ref="article">
    <div class="AnalyzeDetailGuide--tab">
      <button
        @click="switchTab(true)"
        type="button"
        class="AnalyzeDetailGuide--tab-btn"
        :class="isNetworkTab ? 'active' : ''">{{ $t('AnalyzeHealthLightDetail.myPhysiologicalNetwork') }}</button>
      <button
        @click="switchTab(false)"
        type="button"
        class="AnalyzeDetailGuide--tab-btn"
        :class="isNetworkTab ? '' : 'active'">{{ $t('AnalyzeHealthLightDetail.healthAreaGuide') }}</button>
    </div>

    <!-- 건강 영역별 원료 가이드 탭 콘텐츠 -->
    <div v-if="!isNetworkTab" class="AnalyzeDetailGuide--con health-guide-list">
      <div class="health-guide-list-con">
        <div class="health-guide-list-con-top"> 
          <div class="nutrilite-logo">
            <img src="/img/logo_nutrilite.svg" :alt="$t('AnalyzeHealthLightDetail.nutriliteLogo')" />
            <span v-html="$t('AnalyzeHealthLightDetail.nutriliteDescription')"></span>
          </div>
          <div class="legend-wrap">
            <span class="legend-red"> {{ $t('Common.warning') }}</span>
            <span class="legend-yellow"> {{ $t('Common.manage') }}</span>
            <span class="legend-blue"> {{ $t('Common.attention') }}</span>
          </div>
        </div>
        <ul class="AnalyzeDetailGuide--con-ul">
          <li v-for="category in healthGuideData" :key="category.category" 
              class="health-guide-category"
              :class="category.status !== 'normal' ? `status-${category.status}` : ''">
            <div class="category-title-wrapper">
              <span v-if="category.status !== 'normal'" 
                    :class="`legend-dot-${category.status}`"></span>
              <span v-if="category.interest" 
                    class="legend-dot-interest"></span>
              <h5 class="category-title">{{ category.category }}</h5>
            </div>
            <p class="category-content">{{ category.items }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 나의 인체 생리 네트워크 탭 콘텐츠 -->
    <div v-if="isNetworkTab" class="AnalyzeHealthLightDetail--div"> <!--데이터 이미지 노출-->
      <div class="AnalyzeHealthLightDetail--m-parent">
        <p class="AnalyzeHealthLightDetail--p">* {{ analyzeData.checkDate }} {{ $t('AnalyzeHealthLightDetail.text1') }}</p>
        
        <p v-if="medicationList && medicationList.length > 0" class="AnalyzeHealthLightDetail--desc">{{ $t('AnalyzeHealthLightDetail.medicationWarning', { medications: medicationList.join(', ') }) }}</p>
        
        <div class="AnalyzeHealthLightDetail--chart-wrap">
          <div class="AnalyzeHealthLightDetail--chart-top">
            <div class="nutrilite-logo">
              <img src="/img/logo_nutrilite.svg" :alt="$t('AnalyzeHealthLightDetail.nutriliteLogo')" />
              <span v-html="$t('AnalyzeHealthLightDetail.nutriliteDescription2')"></span>
            </div>
            <div class="legend-wrap">
              <span class="legend-red"> {{ $t('Common.warning') }}</span>
              <span class="legend-yellow"> {{ $t('Common.manage') }}</span>
              <span class="legend-blue"> {{ $t('Common.attention') }}</span>
              <span class="legend-medic"> {{ $t('CheckupMedication.text6') }}</span>
      
              <button
                @click="openTooltip($event)"
                class="btn--tooltip AnalyzeHealthLightDetail--tip-btn"
                type="button"
                title="도움말" />

              <base-tooltip
                v-if="tooltip"
                :leftLoca="tooltipEdge"
                @tooltipClose="tooltipClose"
                class="AnalyzeHealthLightDetail--tip-dom">
                <template v-slot:contents>
                  <ul class="tooltip--contents">
                    <li>
                      <span class="legend-red"> {{ $t('Common.warning') }}</span>
                      <p>{{ $t('AnalyzeHealthLightDetail.text3') }}</p>
                    </li>
                    <li>
                      <span class="legend-yellow"> {{ $t('Common.manage') }}</span>
                      <p>{{ $t('AnalyzeHealthLightDetail.text4') }}</p>
                    </li>
                    <li>
                      <span class="legend-blue"> {{ $t('Common.attention') }}</span>
                      <p>{{ $t('AnalyzeHealthLightDetail.text5') }}</p>
                    </li>
                    <li>
                      <span class="legend-medic"> {{ $t('CheckupMedication.text6') }}</span>
                      <p>{{ $t('AnalyzeHealthLightDetail.text6') }}</p>
                    </li>
                  </ul>
                </template>
              </base-tooltip>
            </div>
          </div>

          <!-- <div class="chart-wrap" ref="chartwrap">

          </div> -->
          <div class="AnalyzeCheckupDataRecord--map" :class="isExpand ? 'expand' : ''">
            <!-- 애니메이션 연출용 -->
            <ResultElementGridAnimation
              v-if="animation_datas && Object.keys(animation_datas).length > 0"
              :datas="animation_datas"
              @animation-end="showAnimationEnd"
            />
            
            <!-- 건강 위험 판정 -->
            <transition 
              name="fade"
              @after-enter="afterEnter"
            >
                          <!-- 나의 건강 신호등 네트워크 그래프 -->
              <GraphChart
                v-if="!showAnimation && network_datas != null"
                ref="graphChartRef"
                :datas="network_datas"
                :isExpand="isExpand"
                @zoomMode="showZoomModeFlag"
              />
            </transition>
            <div class="AnalyzeHealthLightDetail--expand-wrap" :class="[isZoomMode ? 'hide' : '', isExpand ? 'top' : '']">
              <button
                v-if="!isExpand"
                @click="expandMap"
                type="button"
                :aria-label="$t('Common.expand')"
                class="AnalyzeHealthLightDetail--expand">
                {{ $t('Common.detail') }}
                <img src="/img/ico_expand.svg" :alt="$t('Common.expand')" />
              </button> <!--240103 확대보기 함수 변경-->
            </div>
            <div class="description acdr--txt" v-if="!isExpand">
              {{ $t('AnalyzeHealthLightDetail.text2') }}
            </div>
          </div>
          <div class="zoom-info" :class="isExpand ? 'top' : ''" v-if="isZoomMode" @click="resetZoom()">
            <div class="nutrilite-logo">
              <img src="/img/logo_nutrilite.svg" :alt="$t('AnalyzeHealthLightDetail.nutriliteLogo')" />
              <span v-html="$t('AnalyzeHealthLightDetail.nutriliteDescription2')"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <base-popup-full v-if="isPop">
      <template v-slot:contents>

        <div class="AnalyzeHealthLightDetail--close-wrap">
          <button
            @click="openPop(false)"
            type="button"
            :aria-label="$t('Common.close')"
            class="AnalyzeHealthLightDetail--close" />
        </div>
      </template>
    </base-popup-full>

  </div>
</template>

<style scoped>
.health-guide-category {
  &.status-danger {
    h5, p {
      color: #e95371;
    }
  }
  
  &.status-warn {
    h5, p {
      color: #f8b500;
    }
  }

  
  &.status-interest{
    h5, p{
      color: #00afec;
    }
  }
}
</style>