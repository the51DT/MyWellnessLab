<script setup>
import BasePopupTit from '@/components/BasePopupTit.vue'
import { ref, defineProps, defineEmits, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n' 
import AnalyzeAgingSpeed from '@/views/analyze/components/analyzeAgingSpeed'
import { bodyScroll, getScoreColor, getStatusColor, mwlRound, getScoreStatus, getColor } from '@/assets/js/common'
import html2canvas from 'html2canvas'
import * as echarts from 'echarts'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  analysisData: {
    type: Object,
    default: null
  }
})

const store = useStore()
const user = store.getters.getUser
const { t } = useI18n()

const emit = defineEmits(['close'])

const closePopup = () => {
  showPreview.value = false
  previewImageData.value = ''
  emit('close')
}

// AOS/IOS 백버튼 처리 함수
const handleBackButton = (event) => {
  if (props.isOpen) {
    // 팝업이 열려있을 때 백버튼을 누르면 팝업 닫기
    closePopup()
    // 기본 뒤로가기 동작 방지
    if (event) {
      event.preventDefault()
    }
    return false
  }
}

// 백버튼 이벤트 리스너 추가
const addBackButtonListener = () => {
  if (typeof window !== 'undefined') {
    // AOS/IOS에서 백버튼 처리를 위해 history state 추가
    window.history.pushState({ popup: 'analysisShare' }, '', window.location.href)
    window.addEventListener('popstate', handleBackButton)
  }
}

// 백버튼 이벤트 리스너 제거
const removeBackButtonListener = () => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', handleBackButton)
  }
}

const getClassByStatus = (status) => {
  if (status !== null && status !== undefined) {
    switch (status) {
      case 1: return 'good'
      case 2: return 'caution'
      case 3: return 'danger'
      default: return ''
    }
  }
  return ''
}

const getClassByScore = (score, type) => {
  const status = getScoreStatus(score, type)
  
  switch (status) {
    case 1: 
      return 'good'
    case 2: 
      return 'caution'
    case 3:
      return 'danger'
    default:
      return ''
  }
}

const fullContentRef = ref(null)
const agingSectionRef = ref(null)
const showPreview = ref(false)
const previewImageData = ref('')
const previewFilename = ref('')
const currentCaptureType = ref('')

// isOpen 상태 변화에 따라 스크롤 제어 및 백버튼 처리
watch(() => props.isOpen, (newVal) => {
  bodyScroll(!newVal)
  if (newVal) {
    showPreview.value = false
    previewImageData.value = ''
    // 팝업이 열릴 때 백버튼 이벤트 리스너 추가
    addBackButtonListener()
  } else {
    // 팝업이 닫힐 때 백버튼 이벤트 리스너 제거
    removeBackButtonListener()
  }
})


// 공통 이미지 생성 함수
const generateImage = async (type, filename) => {
  try {
    let targetElement = fullContentRef.value
    
    if (type === 'aging' && agingSectionRef.value) {
      targetElement = agingSectionRef.value
    }
    
    if (targetElement && props.analysisData) {
      // 캡처 전에 차트 요소들의 스타일을 임시로 조정
      const chartElements = targetElement.querySelectorAll('.echart')
      const originalStyles = []
      const chartInstances = []
      
      chartElements.forEach((element, index) => {
        // echart div의 원래 스타일 저장
        const echartDiv = element.querySelector('div')
        /* if (echartDiv) {
          originalStyles[index] = {
            overflow: echartDiv.style.overflow
          }
          
          // 캡처 시 overflow만 visible로 설정
          echartDiv.style.overflow = 'visible'
        } */
        
        /* // ECharts 인스턴스 찾기 및 pointer 길이 조정
        const chartInstance = echarts.getInstanceByDom(element)
        if (chartInstance) {
          chartInstances[index] = chartInstance
          const option = chartInstance.getOption()
          
          // pointer 길이를 원래 값에서 살짝 낮춤 (5% 감소)
          if (option.series && option.series[0] && option.series[0].pointer) {
            const currentLength = option.series[0].pointer.length
            // 현재 길이에서 5% 감소 (예: 118% → 112%, 85% → 81%)
            const newLength = parseFloat(currentLength) * 1.0
            option.series[0].pointer.length = newLength + '%'
            chartInstance.setOption(option)
          }
        } */
      })
      
      const canvas = await html2canvas(targetElement, {
        backgroundColor: '#ffffff',
        scale: 3,  // Safari에서는 scale 1로, 다른 브라우저는 2로
        useCORS: false,  // Safari에서는 true, 다른 브라우저는 false
        allowTaint: false,  // Safari에서는 true, 다른 브라우저는 false
        logging: false,
        foreignObjectRendering: false,
        removeContainer: false,
        ignoreElements: (element) => {
          if (element.tagName === 'IMG' && element.src) {
            try {
              const url = new URL(element.src)
              return url.origin !== window.location.origin
            } catch {
              return true
            }
          }
          return false
        }
      })
      
      // 원래 스타일 복원
      /* chartElements.forEach((element, index) => {
        if (originalStyles[index] && originalStyles[index].overflow !== undefined) {
          const echartDiv = element.querySelector('div')
          if (echartDiv) {
            echartDiv.style.overflow = originalStyles[index].overflow
          }
        }
      }) */
      
      // ECharts pointer 길이를 원래 값으로 복원
      /* chartInstances.forEach((chartInstance, index) => {
        if (chartInstance) {
          const option = chartInstance.getOption()
          
          // pointer 길이를 원래 값으로 복원
          if (option.series && option.series[0] && option.series[0].pointer) {
            // 원래 길이로 복원 (isMain 여부에 따라)
            const isMain = chartInstance.getDom().closest('.AnalysisSummary--speed') !== null
            option.series[0].pointer.length = isMain ? '118%' : '85%'
            chartInstance.setOption(option)
          }
        }
      }) */
      
      // 미리보기용 이미지 데이터 저장
      previewImageData.value = canvas.toDataURL()
      previewFilename.value = `${filename}_${props.analysisData.analysedDate.substring(0, 10)}.png`
      showPreview.value = true
    }
  } catch (error) {
    console.error(`${filename} 이미지 생성 실패:`, error)
  } finally {
    currentCaptureType.value = ''
  }
}

// 노화속도 이미지 생성 및 미리보기
const generateAgingSpeedImage = () => {
  generateImage('aging', t('AnalysisSharePopup.agingSpeedAnalysis'))
}

// 전체 이미지 생성 및 미리보기
const generateFullImage = () => {
  generateImage('full', t('AnalysisSharePopup.fullAnalysisResult'))
}

// 미리보기에서 다운로드
const downloadFromPreview = () => {
  if (previewImageData.value) {
    const link = document.createElement('a')
    link.download = previewFilename.value
    link.href = previewImageData.value
    link.click()
  }
}

// 미리보기 닫기
const closePreview = () => {
  showPreview.value = false
  previewImageData.value = ''
  previewFilename.value = ''
}

// 미리보기 팝업이 열리면서 자동 다운로드
watch(() => showPreview.value, (newVal) => {
  if (newVal && previewImageData.value) {
    // 잠시 후 자동 다운로드 실행
    setTimeout(() => {
      downloadFromPreview()
    }, 500)
  }
})

// 컴포넌트 마운트 시 초기 설정
onMounted(() => {
  // 초기 마운트 시에는 isOpen이 true일 때만 리스너 추가
  if (props.isOpen) {
    addBackButtonListener()
  }
})

// 컴포넌트 언마운트 시 정리
onBeforeUnmount(() => {
  removeBackButtonListener()
})
</script>

<template>
  <base-popup-tit @popupClose="closePopup" v-if="isOpen" class="AnalysisSharePopup">
    <template v-slot:title>
      {{ $t('HomeSummary.text1')}}
    </template>
    <template v-slot:contents>
      <div class="AnalysisSummary AnalysisSummary--bg" ref="fullContentRef">
        <!-- 상단 설명 텍스트 -->
        <div ref="agingSectionRef" class="AnalysisSummary--speed AnalysisSummary--bg">
          <div class="AnalysisSummary--desc">
            <p class="AnalysisSummary--desc-user">
              <span> {{ user.name }}  </span>
              {{ $t('Common.name2')}}
              {{ $t('HomeSummary.text2')}}
            </p>
            <!-- 분석일 -->
            <p class="AnalysisSummary--desc-date">
              {{ $t('Home.text7') }}: {{ analysisData.analysedDate.substring(0, 10) }}
            </p>
          </div>

          <!-- 노화 속도 -->
          <h3 class="home--aging-tit">{{ $t('Home.text9') }}</h3>
          <div class="aging-section-wrapper">
            <div>
              <div class="home--aging">
                <div>
                  <span class="home--aging-circle"></span>
                  <span class="home--aging-09">x 0.9</span>
                  <span class="home--aging-05">x 0.5</span>
                  <span class="home--aging-15">x 1.5 이상</span>
                  <AnalyzeAgingSpeed :id="`g_` + analysisData.id" :isMain="true" :isShare="true" :sendData="analysisData" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="AnalysisSummary--lights">
          <!-- 건강 신호등 -->
          <div class="home--index--top">
            <h3 class="home--index--top-tit">{{ $t('Home.text27') }} </h3>
            <ul class="home--index--legend-wrap">
              <li class="home--index--legend-con is-red">{{ $t('Common.warning') }}</li>
              <li class="home--index--legend-con is-yellow">{{ $t('Common.manage') }}</li>
              <li class="home--index--legend-con is-green">{{ $t('Common.good') }}</li>
            </ul>
          </div>

          <!-- 만성질환 억제 분석지수 -->
          <div class="analyze-box">
            <div class="AnalysisSummary--list" :class="getClassByStatus(analysisData.hqMet?.status)">
              <span class="AnalysisSummary--list-label">
                <span class="circle-icon"></span>
                <span>{{ $t('AnalyzeDetail.text4')}}</span>
              </span>
              <div class="AnalysisSummary--list-num" :style="{color: getColor(analysisData.hqMet?.status)}">
                {{ mwlRound(analysisData.hqMet?.score || 0, 0) }} <span>{{ $t('Common.score')}}</span>
              </div>
            </div>

            <!-- 노화 억제 분석지수 -->
            <div class="AnalysisSummary--list" :class="getClassByStatus(analysisData.hqOxi?.status)">
              <span class="AnalysisSummary--list-label">
                <span class="circle-icon"></span>
                <span>{{ $t('AnalyzeDetail.text3')}}</span>
              </span>
              <span class="AnalysisSummary--list-num" :style="{color: getColor(analysisData.hqOxi?.status)}">
                {{ mwlRound(analysisData.hqOxi?.score || 0, 0) }} <span>{{ $t('Common.score')}}</span>
              </span>
            </div>

              <!-- 근육 밸런스 분석 지수 -->
              <div v-if="analysisData.hqMusBal" class="AnalysisSummary--list" :class="getClassByStatus(analysisData.hqMusBal?.status)">
                <span class="AnalysisSummary--list-label">
                <span class="circle-icon"></span>
                <span>{{ $t('AnalyzeDetail.text38')}}</span>
              </span>
              <span class="AnalysisSummary--list-num" :style="{color: getColor(analysisData.hqMusBal?.status)}">
                {{ mwlRound(analysisData.hqMusBal?.score || 0, 0) }} <span>{{ $t('Common.score')}}</span>
              </span>
            </div>

            <!-- 식사 -->
            <div class="AnalysisSummary--list" :class="getClassByScore(analysisData.dqData?.RFS_score || 0 , 'rfs')">
              <span class="AnalysisSummary--list-label">
                <span class="circle-icon"></span>
                <span>{{ $t('Home.text29')}}</span>
              </span>
              <span class="AnalysisSummary--list-num" :style="{color: getScoreColor(analysisData.dqData?.RFS_score || 0 , 'rfs')}">
                {{ mwlRound(analysisData.dqData?.RFS_score || 0 , 0) }} <span>{{ $t('Common.score')}}</span>
              </span>
            </div>

          <!-- 운동 -->
          <div class="AnalysisSummary--list" :class="getClassByScore(analysisData.metData?.met, 'musMass')">
            <span class="AnalysisSummary--list-label">
              <span class="circle-icon"></span>
              <span>{{ $t('Home.text30')}}</span>
            </span>
            <span class="AnalysisSummary--list-num" :style="{color: getScoreColor(analysisData.metData?.met, 'musMass')}">
              {{ mwlRound(analysisData.metData?.met || 0, 0) }} <span>MET</span>
            </span>
          </div>

            <!-- 수면 -->
            <div class="AnalysisSummary--list" :class="getClassByScore(analysisData.shData?.sh_score, 'sh')">
              <span class="AnalysisSummary--list-label">
                <span class="circle-icon"></span>
                <span>{{ $t('Home.text31')}}</span>
              </span>
              <span class="AnalysisSummary--list-num" :style="{color: getScoreColor(analysisData.shData?.sh_score, 'sh')}">
                {{ mwlRound(analysisData.shData?.sh_score || 0, 0) }} <span>{{ $t('Common.score')}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <section class="AnalysisSummary--download">
        <button type="button" class="AnalysisSummary--download-speed" @click="generateAgingSpeedImage">
          {{ $t('HomeSummary.text3') }}
        </button>
        <button type="button" class="AnalysisSummary--download-all" @click="generateFullImage">
          {{ $t('HomeSummary.text4') }}
        </button>
      </section>
    </template>
  </base-popup-tit>

  <!-- 미리보기 팝업 -->
  <div v-if="showPreview" class="preview-overlay" @click="closePreview">
    <div class="preview-ic-close-wrap">
      <div class="preview-ic-close" @click="closePreview">
        <img src="/img/btn-close.svg" :alt="$t('AnalysisSharePopup.close')">
      </div>
    </div>
    <div class="preview-container" @click.stop>
      <div class="preview-content">
        <img :src="previewImageData" :alt="previewFilename" class="preview-image" />
      </div>
    </div>
  </div>
</template>