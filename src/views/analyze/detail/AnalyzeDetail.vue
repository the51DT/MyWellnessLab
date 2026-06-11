<script setup>
import { ref, computed, onBeforeMount, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseTooltip from '@/components/BaseTooltip.vue'
import BasePopup from '@/components/BasePopup.vue'
import BaseToast from '@/components/BaseToast.vue'
import AnalyzeCheckupData from '@/views/analyze/components/AnalyzeCheckupData.vue'
import AnalyzeHealthLocation from '@/views/analyze/components/AnalyzeHealthLocation.vue'
import AnalyzeAgingSpeed from '@/views/analyze/components/analyzeAgingSpeed'
import AnalyzeScorecomAnalyzeIndex from '@/views/analyze/components/AnalyzeScorecomAnalyzeIndex.vue'
import AnalyzeHealthLight from '@/views/analyze/components/AnalyzeHealthLight.vue'
import AnalyzeDietDetailGuide from '@/views/analyze/AnalyzeDietDetailGuide.vue'
import AnalyzeExerciseDetailGuide from '@/views/analyze/AnalyzeExerciseDetailGuide.vue' 
import AnalyzeSleepDetailGuide from '@/views/analyze/AnalyzeSleepDetailGuide.vue'
import BodyCompositionPopup from '@/components/BodyCompositionPopup.vue'
//import AnalyzeMajorHealthRisk from '@/views/analyze/components/analyzeMajorHealthRisk'
//import AnalyzeABCHealthGrade from '@/views/analyze/components/analyzeABCHealthGrade'
// import { ReportGenerator, ReportGeneratorLoading } from './reportGenerator'
import ResultDocument from '@/apps/report/healthReport/ResultDocument.vue'
import BtnTop from '@/views/publishing/BtnTop.vue'
import { REPORT_OEPN_TYPE } from '@/utils/commonCode'
import { mwlRoundAgingRate, getCurrentDateFormatted } from '@/assets/js/common'
import { SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

import * as analysisApi from '@/apis/analysis'
import * as reportApi from '@/apis/report'
// import * as logmeApi from '@/apis/logme'
import baseHttp from '@/utils/http/base'
import { useBodyComposition } from '@/composables/useBodyComposition'
import jsPDF from 'jspdf'

const { t } = useI18n()
const store = useStore()
const router = useRouter()

// useBodyComposition composable 사용
const {
  openPopBodyComposition,
  showBodyKeyLogin,
  showBodyKeyResult,
  showBodyKeyDetail,
  showResultPopup,
  resultMessage,
  resultType,
  bodyKeyDataList,
  bodyCompositionDataList,
  isLoading,
  selectedBodyKeyData,
  selectedDataType,
  formatDatetime,
  handleBodyKeyLogin,
  selectBodyKeyData,
  selectExistingBodyComposition,
  confirmBodyKeyData,
  analyzeSelectedBodyKeyData,
  closeBodyKeyDetail,
  handleDirectInput,
  openBodyCompositionPopup,
  closeResultPopup
} = useBodyComposition()

// 로그인 실패 상태 관리
const bodyKeyLoginFailed = ref(false)

// 바디키 로그인 처리 함수 래핑
const handleBodyKeyLoginWrapper = async (loginData) => {
  bodyKeyLoginFailed.value = false // 로그인 시도 시 실패 상태 초기화
  
  const result = await handleBodyKeyLogin(loginData)
  
  if (!result.success) {
    bodyKeyLoginFailed.value = true
    console.error('바디키 로그인 실패:', result.error)
  }
}

const tooltip = ref(false) /* 툴팁 오프너 */
const tooltipEdge = ref(0) /* 툴팁 꼬다리 위치 */
const modules = ref([Navigation, Pagination])

// 현재 활성화된 메뉴 인덱스 저장
const activeMenuIndex = ref(0)

// 가이드 팝업 상태 관리
const dietGuidePopup = ref(false)
const exerciseGuidePopup = ref(false)
const sleepGuidePopup = ref(false)
const showNoDataPopup = ref(false) // 체성분 데이터 없음 팝업

// PDF 로딩 상태 관리
const showErrorPopup = ref(false) // 에러 팝업
const errorPopupMessage = ref('') // 에러 메시지
const successToastMessage = ref('') // 성공 토스트 메시지
const isPdfLoadingPopup = ref(false) // PDF 로딩 팝업
const isMakePdfOnFrontPopup = ref(false) // 프론트에서 PDF 생성중 팝업
const completePdfPageCount = ref(0) // PDF 생성 완료 페이지 수
const showShareOptionsPopup = ref(false) // 공유 방법 선택 팝업
const currentPdfBlob = ref(null) // 현재 PDF Blob
const currentFileName = ref('') // 현재 파일명
const totalPage = ref(39) // PDF 총 페이지 수
const isDoneBackgroundGenerate = ref(false) // 백그라운드 PDF 생성 완료 여부
const isOneTimePdfLoading = ref(false) // 일회성 PDF 생성 대기 로딩 팝업
const isOneTimeDownloadPopup = ref(false) // 일회성 PDF 다운로드 확인 팝업
const oneTimePdfData = ref(null) // 일회성 PDF 데이터 저장

// 에러 팝업 표시 함수
const showError = (message) => {
  console.error('[PDF Error]:', message)  // console에 에러 출력
  errorPopupMessage.value = message
  showErrorPopup.value = true
}

// 에러 팝업 닫기 함수
const closeErrorPopup = () => {
  showErrorPopup.value = false
  errorPopupMessage.value = ''
}

// 성공 토스트 표시 함수
const showSuccess = (message) => {
  console.log('[Success]:', message)
  successToastMessage.value = message
  
  // 3초 후 자동으로 닫기
  setTimeout(() => {
    successToastMessage.value = ''
  }, 3000)
}

const checkupResultId = store.getters['checkup/getResultId']
const analysisType = store.getters['checkup/getAnalysisType']
const checkDate = store.getters['checkup/getCheckDate']
const user = store.getters.getUser

const menu = ref([t('AnalyzeDetail.text2'), t('AnalyzeDetail.text1'), t('AnalyzeDetail.text5'), t('AnalyzeHealthLightPopup.text1')])

const scrollContainer = ref(false)
// const echartAgingInhibitionAnalyze = ref(null) // 노화억제
// const echartChronicDiseaseControlAnalyze = ref(null) // 만성질환

const analyzeData = ref(null)
const surveyData = ref(null)
const examinationData = ref(null)

const sendData = ref({
  name: '',
  analyzeAge: 0,
  hqData: {},
  commonInfo: {}
})

const isDragging = ref(false)
const startX = ref(0)
const startScroll = ref(0)

const isPc = ref(false)
const stickyTop = ref(110)

// 프로그래매틱 스크롤 중인지 추적하는 플래그
const isProgrammaticScroll = ref(false)

const reportFileHistoryParam = ref({
  analysisId: checkupResultId,
  downloadType: 0,
  historyType: 1
})

/**
 * 상단 메뉴 드래그 관련
 * @param {*} event
 */
function dragStart (event) {
  isDragging.value = true
  startX.value = event.clientX
  startScroll.value = scrollContainer.value.scrollLeft
};

/**
 * 드래그 이벤트 감지
 * @param {*} event
 */
function drag (event) {
  if (!isDragging.value) return
  const x = event.clientX
  const delta = (startX.value - x)
  scrollContainer.value.scrollLeft = startScroll.value + delta
};

/**
 * isDragging 값 false로 변경
 */
function dragEnd () {
  isDragging.value = false
};

/**
 * 브라우저 가로 사이즈 체크
 */
function winWidth () {
  isPc.value = window.innerWidth > 960
}

/**
 * 식사 가이드 팝업 열기
 */
function openDietGuide () {
  // 현재 섹션을 g3(건강신호등)로 설정
  store.dispatch('analyze/setCurrentSection', 3)
  activeMenuIndex.value = 3
  
  // store에 inhibitionAnalysisDetail 데이터 설정
  if (analyzeData.value) {
    store.dispatch('analyze/setInhibitionAnalysisDetail', {
      compId: 'AnalyzeDietIndex',
      ...analyzeData.value,
      ...sendData.value
    })
  }
  
  dietGuidePopup.value = true
}

/**
 * 식사 가이드 팝업 닫기
 */
function closeDietGuide () {
  dietGuidePopup.value = false
  // 팝업 닫힌 후 원래 위치로 스크롤
  nextTick(() => {
    scrollToActiveSection()
  })
}

/**
 * 운동 가이드 팝업 열기
 */
function openExerciseGuide () {
  // 현재 섹션을 g3(건강신호등)로 설정
  store.dispatch('analyze/setCurrentSection', 3)
  activeMenuIndex.value = 3
  
  // store에 inhibitionAnalysisDetail 데이터 설정
  if (analyzeData.value) {
    store.dispatch('analyze/setInhibitionAnalysisDetail', {
      compId: 'AnalyzeExerciseIndex',
      ...analyzeData.value,
      ...sendData.value
    })
  }
  
  exerciseGuidePopup.value = true
}

/**
 * 체성분 데이터 없음 팝업 표시
 */
function handleShowNoDataPopup () {
  showNoDataPopup.value = true
}

/**
 * 운동 가이드 팝업 닫기
 */
function closeExerciseGuide () {
  exerciseGuidePopup.value = false
  // 팝업 닫힌 후 원래 위치로 스크롤
  nextTick(() => {
    scrollToActiveSection()
  })
}

/**
 * 수면 가이드 팝업 열기
 */
function openSleepGuide () {
  // 현재 섹션을 g3(건강신호등)로 설정
  store.dispatch('analyze/setCurrentSection', 3)
  activeMenuIndex.value = 3
  
  // store에 inhibitionAnalysisDetail 데이터 설정
  if (analyzeData.value) {
    store.dispatch('analyze/setInhibitionAnalysisDetail', {
      compId: 'AnalyzeSleepIndex',
      ...analyzeData.value,
      ...sendData.value
    })
  }
  
  sleepGuidePopup.value = true
}

/**
 * 수면 가이드 팝업 닫기
 */
function closeSleepGuide () {
  sleepGuidePopup.value = false
  // 팝업 닫힌 후 원래 위치로 스크롤
  nextTick(() => {
    scrollToActiveSection()
  })
}

/**
 * 활성화된 섹션으로 스크롤
 */
function scrollToActiveSection () {
  const target = document.getElementById('g' + activeMenuIndex.value)
  if (target) {
    scrollToSection(activeMenuIndex.value)
  }
}

/**
 * 특정 섹션으로 스크롤
 */
function scrollToSection (sectionIndex) {
  const target = document.getElementById('g' + sectionIndex)
  
  if (target) {
    if (isPc.value) {
      stickyTop.value = 150
    } else {
      stickyTop.value = 110
    }
    
    const scrollTop = target.offsetTop - stickyTop.value
    
    // 프로그래매틱 스크롤 시작 - 스크롤 이벤트 감지 중단
    isProgrammaticScroll.value = true
    
    // 메뉴를 즉시 active로 설정
    activeMenuIndex.value = sectionIndex
    store.dispatch('analyze/setCurrentSection', sectionIndex)
    
    // 메뉴 버튼 활성화 상태도 업데이트
    const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.remove('active')
    }
    if (btns[sectionIndex]) {
      btns[sectionIndex].classList.add('active')
    }
    
    window.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
    
    // 스크롤 완료 후 플래그 해제
    setTimeout(() => {
      isProgrammaticScroll.value = false
    }, 800)
  } else {
    // DOM이 아직 렌더링되지 않았을 수 있으므로 약간의 지연 후 재시도
    setTimeout(() => {
      const retryTarget = document.getElementById('g' + sectionIndex)
      
      if (retryTarget) {
        scrollToSection(sectionIndex)
      } else {
        // 마지막 대안: CSS 클래스로 요소 찾기
        const fallbackTarget = document.querySelector('.AnalyzeDetail--HealthLight')
        if (fallbackTarget && sectionIndex === 3) {
          if (isPc.value) {
            stickyTop.value = 150
          } else {
            stickyTop.value = 110
          }
          
          const scrollTop = fallbackTarget.offsetTop - stickyTop.value
          
          // 프로그래매틱 스크롤 시작
          isProgrammaticScroll.value = true
          
          // 메뉴를 즉시 active로 설정
          activeMenuIndex.value = sectionIndex
          store.dispatch('analyze/setCurrentSection', sectionIndex)
          
          // 메뉴 버튼 활성화 상태도 업데이트
          const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
          for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active')
          }
          if (btns[sectionIndex]) {
            btns[sectionIndex].classList.add('active')
          }
          
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          })
          
          // 스크롤 완료 후 플래그 해제
          setTimeout(() => {
            isProgrammaticScroll.value = false
          }, 800)
        }
      }
    }, 200)
  }
}

/**
 * 상단의 네이게이션을 클릭시 페이지의 해당 항목으로 스크롤
 * @param {*} event
 * @param {*} tg
 */
function move (event, tg) {
  // 메뉴 인덱스에 1을 더해서 실제 섹션 ID와 맞춤
  const target = document.getElementById('g' + (tg + 1))
  
  // target이 존재하지 않으면 함수 종료
  if (!target) {
    console.warn(`Target element g${tg + 1} not found`)
    return
  }
  
  if (isPc.value) {
    stickyTop.value = 200
  } else {
    stickyTop.value = 120
  }
  
  // 프로그래매틱 스크롤 시작 - 스크롤 이벤트 감지 중단
  isProgrammaticScroll.value = true
  
  // 클릭한 메뉴를 즉시 active로 설정
  activeMenuIndex.value = tg
  store.dispatch('analyze/setCurrentSection', tg)
  
  // 메뉴 버튼 활성화 상태도 즉시 업데이트
  const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active')
  }
  if (btns[tg]) {
    btns[tg].classList.add('active')
  }
  
  // scrollTo를 사용하여 절대 위치로 이동
  const scrollTop = target.offsetTop - stickyTop.value
  
  window.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
  
  // 스크롤 완료 후 플래그 해제 (smooth 애니메이션 시간 고려)
  setTimeout(() => {
    isProgrammaticScroll.value = false
  }, 800) // smooth scroll 완료 시간
};

/**
 * 분석데이터를 변수와 스토어에 저장한다.
 * @param {*} data
 */
const setData = (data) => {
  const analysis = {
    ...data.logmeCompleteAnalysisDetail,
    hqData: {
      ...data.logmeCompleteAnalysisDetail.hqData,
      OXI: Math.round(data.logmeCompleteAnalysisDetail.hqOxi?.score),
      MET: Math.round(data.logmeCompleteAnalysisDetail.hqMet?.score),
      AgingRate: mwlRoundAgingRate(data.logmeCompleteAnalysisDetail.hqAr?.aging_rate)
    }
  }
  const survey = data.survey

  analyzeData.value = analysis
  surveyData.value = {
    ...survey,
    basics: {
      ...survey.basics
    }
  }

  if (isOneTime.value) {
    surveyData.value.basics.checkDate = survey.basics.checkDate
  }

  const detail = {
    ...sendData.value,
    ...analysis,
    name: isOneTime.value ? analysis.name : user.name,
    analyzeAge: analysis.age,
    commonInfo: surveyData.value.commonInfo,
    basics: {
      ...surveyData.value.basics,
      age: data.logmeCompleteAnalysisDetail.age,
      sex: data.logmeCompleteAnalysisDetail.sex
    },
    // hqAr 추가
    hqAr: data.logmeCompleteAnalysisDetail?.hqAr || null,
    // PDF Job ID 및 Download URL 추가
    pdfJobId: data.pdfResultDto?.jobId || null,
    pdfDownloadUrl: data.pdfResultDto?.downlaodUrl || null
  }
  sendData.value = detail
  console.log(sendData)
  store.dispatch('analyze/setDetail', detail)
}

/**
 * 분석결과를 삭제한다.
 */
const deleteAnalyzeCompleteData = async () => {
  await analysisApi.deleteAnalysisCompleteDetail(checkupResultId)

  toastMsg.value = t('AnalyzeDetail.analysisDataDeleted')

  setTimeout(() => {
    toastMsg.value = ''
    router.push('/')
  }, 2000)
}

// [2024-01-16] 신규 코드 아래에 작성, 위에 코드는 리펙토링 예정 (김현수)
const isOneTimeDonwloadPopup = ref(false)
const isSharePopup = ref(false)
const isViewerPopup = ref(false)
// const reportGeneratorRef = ref(false)
const resultDocumentRef = ref()
const isGenerating = ref(false)
const isClickPdfDownload = ref(false)
const isClickPdfShare = ref(false)
// const generateLoading = ref(false)
const progress = ref(0)
const pdf = ref(null)
const toastMsg = ref('')
// const reportOpenType = ref(null)

// const enablePdfViewer = computed(() => {
//   return navigator.pdfViewerEnabled
// })

const isOneTime = computed(() => {
  return analysisType === 'onetime'
})

// const fileName = computed(() => {
//   const date = analyzeData.value.analysedDate.substr(0, 10)
//   const name = isOneTime.value ? analyzeData.value.name : user.name

//   return `마이웰니스 랩 리포트_${name}_${date}.pdf`
// })

const isIos = computed(() => {
  const userAgent = navigator.userAgent || window.opera

  return /iPad|iPhone|iPod/.test(userAgent)
})

const isIosChrome = computed(() => {
  const userAgent = navigator.userAgent || window.opera

  return /CriOS/.test(userAgent)
})

// watch(
//   () => reportGeneratorRef,
//   (value) => {
//     if (value) {
//       generatePdf()
//     }
//   },
//   { deep: true }
// )

watch(
  () => resultDocumentRef,
  (value) => {
    if (value) {
      if(analyzeData.value.jobId == null) {
        generatePdf();
      }
    }
  },
  { deep: true }
)

watch(
  () => pdf,
  (value) => {
    if (value) {
      isGenerating.value = false
    }
  },
  { deep: true }
)

/**
 * 일회성 다운로드 팝업 종료
 */
const closeOneTimeDonwloadPopup = () => {
  isOneTimeDonwloadPopup.value = false
}

/**
 * 체성분 팝업 열기
 */
const handleOpenBodyCompositionPopup = (data) => {
  openBodyCompositionPopup(data.analysisId, data.basicsId)
}

// 근육밸런스 차트 새로고침 트리거
const muscleBalanceRefreshTrigger = ref(0)
// 근육밸런스 컴포넌트 강제 리렌더링을 위한 키
const muscleBalanceKey = ref(0)

/**
 * 체성분 분석 처리 및 새로고침
 */
 const handleAnalyzeSelectedBodyKeyData = async () => {
  try {
    const result = await analyzeSelectedBodyKeyData()
    if (result && result.success) {
      window.location.reload();
      // 성공 시 새로고침
      // openPopBodyComposition.value = false
      // showBodyKeyDetail.value = false
      // const updatedData = await getAnalysisCompleteDetail(checkupResultId)
      // setData(updatedData)  // 🔥 수정: updatedData를 직접 전달
      
      // // 근육밸런스 차트 새로고침 트리거 (약간 지연)
      // setTimeout(() => {
      //   muscleBalanceRefreshTrigger.value += 1
      //   muscleBalanceKey.value += 1  // 컴포넌트 자체도 새로 렌더링
      // }, 500)
    }
  } catch (error) {
    console.error('체성분 분석 처리 중 오류:', error)
  }
}

/**
 * 일회성 다운로드 승인
 */
const confirmOneTimeDonwload = () => {
  clickReportOpen(REPORT_OEPN_TYPE.DOWNLOAD_VIEW)
  closeOneTimeDonwloadPopup()
}

/**
 * 리포트 생성
 */
const generatePdf = () => {
  isGenerating.value = true
  
  // reportGeneratorRef.value.generate()
  resultDocumentRef.value.generate()
}

/**
 * PDF 다운로드 재시도 로직
 * @param {string} checkupResultId 
 * @param {string} type 
 */
const retryPdfDownload = async (checkupResultId, type, retryCount = 0, maxRetries = 10) => {
  return new Promise((resolve) => {
    // 로딩 팝업은 이미 표시된 상태이므로 그대로 유지
    
    // 5초 후 재시도 실행
    setTimeout(async () => {
      try {
        let retryResult
        if (type === REPORT_OEPN_TYPE.DOWNLOAD_VIEW) {
          retryResult = await downloadPdfByAnalysisId(checkupResultId)
        } else if (type === REPORT_OEPN_TYPE.KAKAO) {
          // 카카오 공유용 PDF 다운로드 재시도
          retryResult = await downloadPdfForShare(checkupResultId)
        }
        
        if (retryResult.success) {
          // 성공 시에만 로딩 팝업 숨기기
          isPdfLoadingPopup.value = false
          
          resolve(retryResult)
        } else if (retryCount < maxRetries) {
          // 최대 재시도 횟수 내에서 실패 시 다시 재시도 (로딩 팝업 유지)
          console.log(`PDF 재시도 실패 (${retryCount + 1}/${maxRetries}), 다시 시도합니다...`)
          const nextRetryResult = await retryPdfDownload(checkupResultId, type, retryCount + 1, maxRetries)
          resolve(nextRetryResult)
        } else {
          // 최대 재시도 횟수 초과 시 에러 처리
          console.error('PDF 재시도 최대 횟수 초과')
          isPdfLoadingPopup.value = false
          showError(t('PdfError.processing'))
          resolve({ success: false })
        }
      } catch (error) {
        console.error('PDF 재시도 오류:', error)
        if (retryCount < maxRetries) {
          // 최대 재시도 횟수 내에서 에러 발생 시 다시 재시도 (로딩 팝업 유지)
          try {
            const nextRetryResult = await retryPdfDownload(checkupResultId, type, retryCount + 1, maxRetries)
            resolve(nextRetryResult)
          } catch (retryError) {
            console.error('PDF 재시도 최종 실패:', retryError)
            isPdfLoadingPopup.value = false
            showError(t('PdfError.processing'))
            resolve({ success: false })
          }
        } else {
          // 최대 재시도 횟수 초과 시 에러 처리
          console.error('PDF 재시도 최대 횟수 초과')
          isPdfLoadingPopup.value = false
          showError(t('PdfError.processing'))
          resolve({ success: false })
        }
      }
    }, 5000) // 5초 후 재시도
  })
}

/**
 * 리포트 다운로드 및 보기
 * @param {*} type
 */
const clickReportOpen = async (type) => {
  try {
    // 바로 API 호출 실행
    if (type === REPORT_OEPN_TYPE.DOWNLOAD_VIEW) { 
      if(isGenerating.value) {  // 프론트에서 PDF 생성중
        isMakePdfOnFrontPopup.value = true;
        isClickPdfDownload.value = true;
      } else {             // 백엔드에서 이미 PDF 생성완료됨.
        // 로딩 팝업 표시
        isPdfLoadingPopup.value = true;

        // 프론트 생성 PDF 파일명 수정
        if(pdf.value) {
          const date = analyzeData.value.analysedDate.substr(2, 10)
          const name = isOneTime.value ? analyzeData.value.name : user.name
          let fileName = '마이웰니스랩 리포트_' + name + '_' + date + '.pdf'

          await pdfDownload(pdf.value, fileName, checkupResultId);
          isPdfLoadingPopup.value = false;
          return;
        }

        // 다운로드 실행
        const result = await downloadPdfByAnalysisId(checkupResultId);

        if (!result.success) {
          await retryPdfDownload(checkupResultId, type)
          return
        }

        // 성공 시 로딩 팝업 숨기기
        isPdfLoadingPopup.value = false
      }
    } else if (type === REPORT_OEPN_TYPE.KAKAO) {
      // 공유하기 - PDF 파일이 없으면 먼저 다운로드
      if (!currentPdfBlob.value) {
        isPdfLoadingPopup.value = true
        const result = await downloadPdfForShare(checkupResultId)
        
        if (!result.success) {
          const retryResult = await retryPdfDownload(checkupResultId, type)
          if (!retryResult.success) {
            isPdfLoadingPopup.value = false
            return
          }
        }
        
        isPdfLoadingPopup.value = false
      }
      
      // PDF 파일 준비 완료 후 공유하기 (Web Share API 우선, 카카오톡 대체)
      await shareReport()
    }

  } catch (error) {
    console.error('PDF 처리 오류:', error)
    isPdfLoadingPopup.value = false
    showError(t('PdfError.processingError'))
  }
}

/**
 * 리포트 주문/결제 페이지로 이동
 */
const movePrintRequestPage = () => {
  store.dispatch('order/setAccessible', true)
  router.push({ name: 'OrderNpay' })
}

/**
 * 분석 결과 이력 페이지로 이동
 */
const moveReportHistoryListPage = () => {
  store.dispatch('analyze/setCurrentSection', 5) 
  router.push({ name: 'AnalyzeList' })
}

const isPopDeleteReport = ref(false)
const isDeleteReport = ref(null)

/**
 * 리포트 삭제 미로미스
 */
const deleteReportPromise = () => {
  isPopDeleteReport.value = true
  return new Promise((resolve) => {
    watch(isDeleteReport, () => {
      if (isDeleteReport.value) {
        resolve(true)
      }
    })
  })
}

/**
 * 리포트 삭제
 */
const deleteReport = async () => {
  // const isConfirm = confirm('리포트 삭제 시, \n분석 결과 재 확인, 공유하기, 재 다운로드 및 인쇄신청이 불가합니다\n\n그래도 삭제하시겠습니까?')
  const isConfirm = await deleteReportPromise()

  if (isConfirm) {
    deleteAnalyzeCompleteData()
  }
}

/**
 * 리포트 분석 보기
 */
const openReportPopup = () => {
  // const blob = new Blob([pdf.value], { type: 'application/pdf' })
  // const url = window.URL.createObjectURL(blob)
  // window.open(url, '_blank')
}

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
 * pc, mobile 인지 파악하여 리포트 다운로드 후 리포트 오픈
 */
const handleReportOpenByType = async () => {
  // if (reportOpenType.value === REPORT_OEPN_TYPE.KAKAO) {
  //   const file = new File([pdf.value], fileName.value, { type: 'application/pdf' })
  //   const files = [file]

  //   if (navigator.canShare({ files })) {
  //     await navigator.share({ files })
  //   }

  //   isSharePopup.value = false
  // } else if (reportOpenType.value === REPORT_OEPN_TYPE.DOWNLOAD_VIEW) {
  //   if (enablePdfViewer.value) {
  //     const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  //     if (!isMobile && window.navigator.msSaveOrOpenBlob) {
  //       window.navigator.msSaveOrOpenBlob(pdf.value, fileName.value)
  //       return
  //     }

  //     const blob = new Blob([pdf.value])
  //     const url = window.URL.createObjectURL(blob)
  //     const a = document.createElement('a')
  //     a.href = url

  //     if (isMobile) {
  //       a.setAttribute('download', fileName.value)
  //       } else {
  //         a.download = fileName.value
  //       }

  //       document.body.appendChild(a)
  //       a.click()
  //       URL.revokeObjectURL(url)
  //       document.body.removeChild(a)
  //     }

  //     isViewerPopup.value = false
  //     openReportPopup()
  //     createReportFileHistory(reportOpenType.value)
  //   }

  //   reportOpenType.value = null
}

/**
 * 리포트 생성 퍼센트 반환
 * @param {*} index - 인덱스
 */
const handleGenerateProgress = async (index) => {
  progress.value = (index / totalPage.value) * 100
  completePdfPageCount.value = index + 1;
  
  if(progress.value == 100) {
    isPdfLoadingPopup.value = false
    isMakePdfOnFrontPopup.value = false;
  } else {
    // 3페이지마다 백엔드에 PDF 다운로드 시도
    if(
      !isDoneBackgroundGenerate.value && 
      isClickPdfDownload.value == true &&
      index % 3 === 0
    ) {
      const result = await downloadPdfByAnalysisId(checkupResultId);
      if (result.success) {
        isPdfLoadingPopup.value = false
        isMakePdfOnFrontPopup.value = false;
        isDoneBackgroundGenerate.value = true;
      }
    }
  }
}

/**
 * 프론트에서 리포트 생성 완료시 callback 함수
 * @param {*} value
 */
const completeGenerateReport = async (value) => {
  // 리포트 생성 완료시 로딩 팝업 종료
  isMakePdfOnFrontPopup.value = false;
  pdf.value = value;

  if(isClickPdfShare.value == true) {
    // PDF를 Blob으로 변환하여 공유
    const pdfBlob = pdf.value.output('blob')
    const date = analyzeData.value.analysedDate.substr(0, 10)
    const name = isOneTime.value ? analyzeData.value.name : user.name
    const fileName = '마이웰니스랩 리포트_' + name + '_' + date + '.pdf'
    
    currentPdfBlob.value = pdfBlob
    currentFileName.value = fileName
    isPdfLoadingPopup.value = false
    showShareOptionsPopup.value = true
    isClickPdfShare.value = false
  } else if(isClickPdfDownload.value == true) {
    if(!isDoneBackgroundGenerate.value) { // 백그라운드 생성이 완료되지 않은 경우 프론트에서 생성된 PDF 다운로드
      const date = analyzeData.value.analysedDate.substr(2, 10)
      const name = isOneTime.value ? analyzeData.value.name : user.name
      let fileName = '마이웰니스랩 리포트_' + name + '_' + date + '.pdf'
      await pdfDownload(pdf.value, fileName, checkupResultId);  
      await createReportFileHistory(0);   // 다운로드 이력 추가
    }
  }
}

/**
 * 리포트 파일 이력 등록
 * @param {*} value - 다운로드 타입(0: 프론트, 1: 백엔드)
 */
const createReportFileHistory = async (value) => {
  try {
    reportFileHistoryParam.value.downloadType = value;

    // 0:파일보기, 1:파일 다운로드
    await reportApi.createReportFileHistory(reportFileHistoryParam.value);
  } catch (e) {
    console.error('e', e)
  }
}

/**
 * 분석 결과 상세 조회
 * @param {*} id  - 분석 id
 */
const getAnalysisCompleteDetail = async (id) => {
  const response = await analysisApi.getAnalysisCompleteDetail(id)
  return response.data
}

/**
 * 분석 완료 상세조회 - 검진 데이터 이력
 */
const getAnalysisHistoryList = async () => {
  const response = await analysisApi.getAnalysisCompleteExaminationDetail()
  return response.data
}

/**
 * PDF 다운로드 API 호출 (공유용 - Blob만 저장)
 */
const downloadPdfForShare = async (checkupResultId) => {
  try {
    // 직접 axios로 호출하여 responseType 설정
    const response = await baseHttp.get(`/v1/api/user/pdf/download/${checkupResultId}`, {
      responseType: 'arraybuffer'
    })
    
    // response.data가 undefined인 경우 response 자체를 사용
    const pdfData = response.data || response
    
    // PDF 바이너리 데이터를 Blob으로 변환
    const blob = new Blob([pdfData], { type: 'application/pdf' })
    
    // 파일명 생성
    const date = analyzeData.value.analysedDate.substr(0, 10)
    const name = isOneTime.value ? analyzeData.value.name : user.name
    const fileName = '마이웰니스랩 리포트_' + name + '_' + date + '.pdf'
    
    // Blob과 파일명 저장
    currentPdfBlob.value = blob
    currentFileName.value = fileName
    
    return { success: true }
  } catch (error) {
    console.error('PDF 다운로드 오류 (공유용):', error)
    return { success: false, error: error.message }
  }
}

/**
 * 리포트 공유하기 (Web Share API만 사용)
 */
const shareReport = async () => {
  try {
    console.log('🔄 공유 시작: Web Share API')
    
    // PDF가 없으면 먼저 다운로드 시도
    if (!currentPdfBlob.value) {
      console.log('📥 PDF가 없어 다운로드 시도')
      isPdfLoadingPopup.value = true
      
      const result = await downloadPdfForShare(checkupResultId)
      isPdfLoadingPopup.value = false
      
      if (!result.success) {
        console.error('❌ PDF 다운로드 실패:', result.error)
        showError(t('PdfError.downloadFailed'))
        return
      }
      
      // 다운로드 후에도 PDF가 없으면 에러
      if (!currentPdfBlob.value) {
        console.error('❌ PDF 다운로드 성공했으나 Blob이 없음')
        showError(t('PdfError.processing'))
        return
      }
      
      console.log('✅ PDF 다운로드 완료')
    }
    
    await shareWithWebShareAPI()
  } catch (error) {
    console.error('❌ 공유 오류:', error.message)
    
    // 삼성 브라우저 미지원 에러는 이미 하위에서 처리됨
    if (error.message === 'SAMSUNG_NOT_SUPPORTED') {
      return
    }
    
    // 사용자가 취소한 경우는 아무 작업도 하지 않음 (정상 동작)
    const isUserCancelled = error?.name === 'AbortError' || 
                            error?.code === 20 ||
                            error?.message?.includes('cancel') ||
                            error?.message?.includes('abort')
    
    if (isUserCancelled) {
      console.log('👤 사용자가 공유를 취소했습니다.')
      return
    }
    
    // Web Share API 미지원 또는 기타 에러
    console.error('⚠️ 공유 실패')
    console.error('   브라우저:', navigator.userAgent)
    console.error('   에러:', error)
    showError('공유 기능을 사용할 수 없습니다.')
  }
}

/**
 * Web Share API를 사용한 공유 (우선순위 1)
 */
const shareWithWebShareAPI = async () => {
  // Web Share API 지원 확인
  if (!navigator.share) {
    throw new Error('Web Share API를 지원하지 않습니다.')
  }

  // PDF 파일이 있으면 파일 공유, 없으면 URL 공유
  if (currentPdfBlob.value) {
    await sharePdfFile()
  } else {
    const shareData = await prepareWebShareData()
    await navigator.share(shareData)
    showSuccess(t('AnalyzeDetail.shareSuccess'))
  }
}

/**
 * PDF 파일을 Web Share API로 공유
 */
const sharePdfFile = async () => {
  try {
    if (!currentPdfBlob.value) {
      throw new Error('PDF 파일이 없습니다.')
    }

    // File 객체 생성
    const userAgent = navigator.userAgent
    const isSamsungBrowser = userAgent.includes('SamsungBrowser')
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const sharedFileName = isSamsungBrowser
      ? `MWL_Report_${analyzeData.value.analysedDate.substr(0, 10)}.pdf`
      : currentFileName.value
    const sharedMimeType = isSamsungBrowser ? 'application/octet-stream' : 'application/pdf'

    const pdfFile = new File([currentPdfBlob.value], sharedFileName, {
      type: sharedMimeType,
      lastModified: Date.now()
    })

    // iOS에서는 파일만 전달 (title, text 제외)
    // title, text가 포함되면 URL 공유가 우선될 수 있음
    const shareData = (isIOS || isSamsungBrowser)
      ? { files: [pdfFile] }
      : {
          title: t('AnalyzeDetail.shareTitle'),
          text: t('AnalyzeDetail.shareDescription', {
            userName: isOneTime.value ? analyzeData.value.name : user.name,
            analysisDate: analyzeData.value.analysedDate.substr(0, 10)
          }),
          files: [pdfFile]
        }

    // 브라우저 확인
    const canShareFnExists = typeof navigator.canShare === 'function'
    const canShareFiles = canShareFnExists && navigator.canShare(shareData)
    
    console.log('📤 파일 공유 시도')
    console.log('   - User Agent:', userAgent)
    console.log('   - iOS:', isIOS)
    console.log('   - 삼성 브라우저:', isSamsungBrowser)
    console.log('   - canShare 지원:', canShareFnExists)
    console.log('   - canShare(files) 결과:', canShareFiles)
    console.log('   - 파일명:', sharedFileName)
    console.log('   - 파일 타입:', pdfFile.type)
    console.log('   - 파일 크기(byte):', pdfFile.size)
    console.log('   - shareData keys:', Object.keys(shareData))
    
    // canShare가 false여도 다른 브라우저에서는 시도
    if (!canShareFiles) {
      console.warn('⚠️ canShare()가 false를 반환했지만 공유를 시도합니다.')
    }

    // Web Share API로 파일 공유 시도
    await navigator.share(shareData)

    showSuccess(t('AnalyzeDetail.shareSuccess'))
    console.log('✅ 파일 공유 성공 (Quick Share 또는 다른 앱 사용)')
    
  } catch (error) {
    console.error('❌ PDF 파일 공유 오류:', error)
    
    // 사용자가 공유를 취소한 경우 (정상 동작)
    // AbortError는 name 또는 code(20)로 체크
    const isUserCancelled = error?.name === 'AbortError' || 
                            error?.code === 20 ||
                            error?.message?.includes('cancel') ||
                            error?.message?.includes('abort')
    
    if (isUserCancelled) {
      console.log('👤 사용자가 공유를 취소했습니다.')
      // 사용자 취소는 에러가 아니므로 조용히 종료 (throw 하지 않음)
      return
    }
    
    // NotAllowedError: PDF 다운로드 시간으로 인한 사용자 제스처 컨텍스트 상실
    // 또는 삼성 브라우저의 파일 공유 제한
    // → 조용히 다운로드로 전환 (에러 메시지 표시 안 함)
    // 참고: await를 제거해도 이 문제는 해결되지 않음 (호출 시점이 동일하므로)
    if (error.name === 'NotAllowedError') {
      const userAgent = navigator.userAgent
      const isSamsungBrowser = userAgent.includes('SamsungBrowser')
      
      if (isSamsungBrowser) {
        console.warn('⚠️ 삼성 브라우저에서 NotAllowedError 발생 - 파일 공유 제한')
        console.warn('   → 삼성 브라우저는 canShare()가 true여도 실제 파일 공유가 제한될 수 있습니다')
        console.warn('   → 리포트 파일 다운로드로 자동 전환')
      } else {
        console.warn('⚠️ NotAllowedError 발생 - PDF 다운로드 시간으로 인한 제약')
        console.warn('   → 리포트 파일 다운로드로 자동 전환')
      }
      
      const { success } = await downloadPdfByAnalysisId(checkupResultId)
      if (!success) {
        showError(t('PdfError.processing'))
      }
      return
    }
    
    // NotSupportedError, TypeError 등: 진짜로 파일 공유가 안 되는 경우
    if (error.name === 'NotSupportedError' || error.name === 'TypeError') {
      console.warn('파일 공유 미지원: 리포트 파일 다운로드 전환')
      showError(t('AnalyzeDetail.samsungBrowserNotSupported'))
      const { success } = await downloadPdfByAnalysisId(checkupResultId)
      if (!success) {
        showError(t('PdfError.processing'))
      }
      return
    }
    
    // 기타 알 수 없는 에러
    console.warn('공유 실패: 리포트 파일 다운로드 전환')
    console.warn(`에러 타입: ${error?.name}, 메시지: ${error?.message}`)
    showError(t('AnalyzeDetail.shareFailedDownload'))
    const { success } = await downloadPdfByAnalysisId(checkupResultId)
    if (!success) {
      showError(t('PdfError.processing'))
    }
  }
}

/**
 * Web Share API용 데이터 준비
 */
const prepareWebShareData = async () => {
  const userName = isOneTime.value ? analyzeData.value.name : user.name
  const analysisDate = analyzeData.value.analysedDate.substr(0, 10)
  const reportUrl = `${window.location.origin}/analyze/detail/${checkupResultId}`
  
  return {
    title: t('AnalyzeDetail.shareTitle'),
    text: t('AnalyzeDetail.shareDescription', { userName, analysisDate }),
    url: reportUrl
  }
}

/**
 * 분석 번호를 클립보드에 복사
 */
const copyAnalysisNumber = async () => {
  try {
    const analysisNumber = surveyData.value?.commonInfo?.aCode || checkupResultId
    await navigator.clipboard.writeText(analysisNumber)
    showSuccess(t('AnalyzeDetail.analysisNumberCopied'))
  } catch (error) {
    console.error('클립보드 복사 오류:', error)
    showError(t('AnalyzeDetail.shareLinkCopyFailed'))
  }
}

/**
 * PDF 다운로드 API 호출
 */
const downloadPdfByAnalysisId = async (checkupResultId) => {
  try {
    // 직접 axios로 호출하여 responseType 설정
    const response = await baseHttp.get(`/v1/api/user/pdf/download/${checkupResultId}`, {
      responseType: 'arraybuffer'
    })
    
    // response.data가 undefined인 경우 response 자체를 사용
    const pdfData = response.data || response

    // 파일명 생성
    const date = analyzeData.value.analysedDate.substr(0, 10)
    const name = isOneTime.value ? analyzeData.value.name : user.name
    const fileName = '마이웰니스랩 리포트_' + name + '_' + date + '.pdf'

    await pdfDownload(pdfData, fileName, checkupResultId);
    await createReportFileHistory(1);   // 다운로드 이력 추가
    
    // 백엔드에서 PDF 생성 완료시 프론트 데이터 null
    if(!pdfData) pdf.value = null;
    
    return { success: true }
  } catch (error) {
    // 2025.09.29 - 백엔드에서 PDF를 아직 생성하지 못한 경우, 프론트에서 생성하기로 함.
    /*
    console.error('PDF 다운로드 오류:', error)
    
    // 409 에러 (PDF 생성 중)인 경우 재시도하도록 false 반환
    if (error.response?.status === 409) {
      console.log('PDF가 아직 생성 중입니다. 재시도합니다.')
      return { success: false, error: 'PDF 생성 중입니다. 잠시 후 다시 시도해주세요.' }
    }
    */
    // 다른 에러는 throw하지 않고 return
    return { success: false, error: error.message }    
  }
}

/**
 * 일회성 PDF 다운로드 재시도 함수
 */
const downloadOneTimePdfWithRetry = async (id, maxRetries = 10, delayMs = 3000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await baseHttp.get(`/v1/api/user/pdf/download/${id}`, {
        responseType: 'arraybuffer'
      })
      
      // 성공하면 response 반환
      return { success: true, data: response.data || response }
    } catch (error) {
      // 마지막 시도에서도 실패하면 에러 throw
      if (attempt === maxRetries - 1) {
        throw error
      }
      
      // 다음 시도 전에 대기
      console.log(`일회성 PDF 생성 대기 중... (${attempt + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}

/**
 * 일회성 PDF 다운로드 처리
 */
const handleOneTimePdfDownload = async () => {
  try {
    if (!oneTimePdfData.value) {
      console.error('PDF 데이터가 없습니다')
      return
    }

    // 일회성 분석시 프론트 생성 플래그 해제
    isGenerating.value = false;
    
    const date = analyzeData.value.analysedDate.substr(0, 10)
    const name = isOneTime.value ? analyzeData.value.name : user.name
    const fileName = '마이웰니스랩 리포트_' + name + '_' + date + '.pdf'
    
    // PDF 다운로드
    await pdfDownload(oneTimePdfData.value, fileName, checkupResultId)
    
    // 팝업 닫기 및 세션 스토리지에 표시 상태 저장
    isOneTimeDownloadPopup.value = false
    const popupShownKey = `oneTimePdfPopupShown_${checkupResultId}`
    sessionStorage.setItem(popupShownKey, 'true')
    
    showSuccess(t('AnalyzeDetail.downloaded'))
  } catch (error) {
    console.error('일회성 PDF 다운로드 실패:', error)
    showError(t('PdfError.downloadFailed'))
  }
}

/**
 * 일회성 다운로드 팝업 닫기 (다운로드 없이)
 */
const closeOneTimeDownloadPopup = () => {
  isOneTimeDownloadPopup.value = false
  oneTimePdfData.value = null
  
  // 세션 스토리지에 표시 상태 저장 (취소해도 다시 표시하지 않음)
  const popupShownKey = `oneTimePdfPopupShown_${checkupResultId}`
  sessionStorage.setItem(popupShownKey, 'true');

  // 일회성 분석시 프론트 생성 플래그 해제
  isGenerating.value = false;
}

const scrollY = ref(0)

const pdfDownload = async (pdfData, fileName, checkupResultId) => {
  try {
    const userAgent = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isGoogleApp = /GSA/.test(userAgent) // 구글 앱 감지
    const isSafari = /Safari/i.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/i.test(userAgent);
    const isSamsungBrowser = userAgent.includes('SamsungBrowser')
    const isStandaloneDisplayMode = typeof window.matchMedia === 'function'
      ? window.matchMedia('(display-mode: standalone)').matches
      : false
    const isIOSStandalone = isIOS && (isStandaloneDisplayMode || window.navigator?.standalone)
    const baseURL = (baseHttp && baseHttp.defaults && baseHttp.defaults.baseURL) ? baseHttp.defaults.baseURL.replace(/\/$/, '') : ''
    const toPdfBlob = (data) => {
      if (!data) {
        return null
      }

      if (data instanceof Blob) {
        return data
      }

      if (data instanceof ArrayBuffer) {
        return new Blob([data], { type: 'application/pdf' })
      }

      if (ArrayBuffer.isView(data)) {
        return new Blob([data.buffer], { type: 'application/pdf' })
      }

      if (typeof data === 'object' && typeof data.output === 'function') {
        try {
          const output = data.output('blob')
          if (output instanceof Blob) {
            return output
          }
        } catch (err) {
          console.warn('Failed to convert jsPDF output to blob', err)
        }
      }

      return new Blob([data], { type: 'application/pdf' })
    }

    const blob = toPdfBlob(pdfData)

    if (!blob) {
      throw new Error('PDF 데이터가 비어있습니다.')
    }

    // iOS 홈 화면 웹앱 대응
    if (isIOSStandalone) {
      try {
        const file = new File([blob], fileName, { type: 'application/pdf' })
        const canShareFile = typeof navigator.canShare === 'function'
          ? navigator.canShare({ files: [file] })
          : false

        if (!canShareFile || typeof navigator.share !== 'function') {
          showError(t('PdfError.downloadFailed'))
          return
        }

        // iOS에서 파일 공유 시 title, text, url을 제거하고 files만 전달
        // title, text, url이 포함되면 URL 공유가 우선될 수 있음
        const sharePayload = {
          files: [file]
        }

        console.log('iOS standalone PDF share:', { fileName, fileSize: blob.size, fileType: file.type })
        await navigator.share(sharePayload);
        showSuccess(t('AnalyzeDetail.downloadAndShareComplete'))

        return;
      } catch (shareError) {
        // iOS standalone 모드에서 NotAllowedError 에러나는 경우 다운로드로 대체
        if (shareError?.name === 'NotAllowedError' && shareError?.code === 0) {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          showSuccess(t('AnalyzeDetail.downloaded'))
        
          // URL 해제
          setTimeout(() => {
            window.URL.revokeObjectURL(url)
          }, 1000)

          return;
        }
        // 사용자가 공유를 취소한 경우 (정상 동작) 
        else if (shareError?.name === 'AbortError' && shareError?.code === 20) {  
          return
        }
        // 실제 공유 실패인 경우에만 에러 표시
        else {
          console.error('iOS standalone share failed:', shareError)
          console.error('Error details:', {
            name: shareError?.name,
            code: shareError?.code,
            message: shareError?.message
          })
          showError(t('PdfError.downloadFailed'))
          return
        }
      }
    }

    // iOS Safari에서는 백엔드의 attachment 응답으로 강제 다운로드
    if (isIOS && isSafari) {
      const path = `/v1/api/user/pdf/download/${checkupResultId}?disposition=attachment`
      const directUrl = baseURL ? `${baseURL}${path}` : path
      window.location.assign(directUrl)
      return
    } else if (isIOS && isGoogleApp) {
      // iOS 구글앱(GSA) 전용: 서버 리소스를 현재 창에서 직접 열기 (inline 렌더링 기대)
      const path = `/v1/api/user/pdf/download/${checkupResultId}?disposition=inline`
      const directUrl = baseURL ? `${baseURL}${path}` : path
      window.location.assign(directUrl)
    } else if (isSamsungBrowser) {
      // 삼성 브라우저에서는 <a> 태그의 download 속성이 제대로 동작하지 않을 수 있으므로
      // 서버에서 직접 다운로드하도록 처리
      const path = `/v1/api/user/pdf/download/${checkupResultId}?disposition=attachment`
      const directUrl = baseURL ? `${baseURL}${path}` : path
      window.location.assign(directUrl)
      return
    } else {
      // 일반 브라우저에서는 기존 방식 사용
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showSuccess(t('AnalyzeDetail.downloaded'))
    
      // URL 해제
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    }
  } catch (error) {
    console.error('PDF 다운로드 처리 오류:', error)
    showError(t('PdfError.processing'))
  }
}

/**
 * 스크롤 조정 (메뉴 활성화용)
 */
const handleScroll = () => {
  const currentScrollY = window.scrollY
  scrollY.value = currentScrollY
}
/**
 * 스크롤 위치에 따른 메뉴 활성화
 */
 function updateActiveMenuOnScroll() {
  // 프로그래매틱 스크롤 중에는 active 업데이트 하지 않음
  if (isProgrammaticScroll.value) {
    return
  }
  
  const sections = ['g1', 'g2', 'g3', 'g4']
  const menuButtons = document.querySelectorAll('.AnalyzeDetail--menu-btn')
  
  sections.forEach((sectionId, index) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()
      const stickyTopValue = isPc.value ? 200 : 120
      const isVisible = rect.top <= stickyTopValue && rect.bottom >= stickyTopValue
      
      if (isVisible) {
        // 모든 버튼에서 active 제거
        menuButtons.forEach(btn => btn.classList.remove('active'))
        // 현재 섹션에 해당하는 버튼에 active 추가
        if (menuButtons[index]) {
          menuButtons[index].classList.add('active')
        }
        // activeMenuIndex도 업데이트
        activeMenuIndex.value = index
      }
    }
  })
}

/**
 * 마운트 이전 초기값 세팅
 */
onBeforeMount(async () => {
  if (checkupResultId) {
    const analysisCompleteDetail = await getAnalysisCompleteDetail(checkupResultId)
    setData(analysisCompleteDetail)

    let analysisHistoryList = []

    if (isOneTime.value) {
      const ariData = analysisCompleteDetail.logmeCompleteAnalysisDetail.ariData

      analysisHistoryList = [{
        checkDate : analysisCompleteDetail.survey.basics.checkDate,
        healthDataType: 'direct',
        sbp: ariData.SBP?.toFixed(1) || null,
        crea: ariData.CREA?.toFixed(1) || null,
        gpt: ariData.GPT?.toFixed(1) || null,
        wc: ariData.WC?.toFixed(1) || null,
        got: ariData.GOT?.toFixed(1) || null,
        tc: ariData.TC?.toFixed(1) || null,
        glu: ariData.GLU?.toFixed(1) || null,
        hdl: ariData.HDL?.toFixed(1) || null,
        dbp: ariData.DBP?.toFixed(1) || null,
        tg: ariData.TG?.toFixed(1) || null,
        ldl: ariData.LDL?.toFixed(1) || null,
        hb: ariData.HB?.toFixed(1) || null,
        bmi: ariData.BMI?.toFixed(1) || null
      }]
      
      // 일회성 분석인 경우 PDF 생성 대기 및 다운로드 팝업 표시
      // sessionStorage를 사용하여 동일 세션 내에서 한 번만 팝업 표시
      const popupShownKey = `oneTimePdfPopupShown_${checkupResultId}`
      const hasShownPopup = sessionStorage.getItem(popupShownKey)
      
      if (!hasShownPopup) {
        isOneTimePdfLoading.value = true
        try {
          console.log('🔄 일회성 PDF 생성 대기 시작...')
          const result = await downloadOneTimePdfWithRetry(checkupResultId)
          
          if (result.success) {
            console.log('✅ 일회성 PDF 생성 완료')
            oneTimePdfData.value = result.data
            isOneTimePdfLoading.value = false
            isOneTimeDownloadPopup.value = true
          } else {
            console.warn('⚠️ 일회성 PDF 생성 실패')
            isOneTimePdfLoading.value = false
          }
        } catch (error) {
          console.error('❌ 일회성 PDF 생성 오류:', error)
          isOneTimePdfLoading.value = false
        }
      }
    } else {
      analysisHistoryList = await getAnalysisHistoryList()
    }

    examinationData.value = analysisHistoryList
    analyzeData.value.examinationData = analysisHistoryList
    sendData.value.examinationData = analysisHistoryList
    
    // 📥 공유 기능 최적화: 페이지 로드 시 PDF 미리 준비
    // 사용자가 공유 버튼 클릭 시 즉시 공유 가능하도록 백그라운드 다운로드
    if (!isOneTime.value && !currentPdfBlob.value) {
      console.log('🔄 백그라운드에서 PDF 다운로드 시작...')
      downloadPdfForShare(checkupResultId).then(result => {
        if (result.success) {
          console.log('✅ PDF 백그라운드 다운로드 완료 - 공유 준비됨')
        } else {
          console.warn('⚠️ PDF 백그라운드 다운로드 실패:', result.error)
        }
      }).catch(error => {
        console.warn('⚠️ PDF 백그라운드 다운로드 오류:', error)
      })
    }
  }
  window.addEventListener('scroll', handleScroll)
})

/**
 * 마운트 해제시 리스너 해제
 */
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveMenuOnScroll)
  
})

/**
 * 마운트 시 초기값 세팅
 */
 onMounted(() => {
  // 초기 화면 크기 확인
  winWidth()
  
  // resize 이벤트 리스너 추가
  window.addEventListener('resize', winWidth)
  
  // store에서 돌아온 위치 정보 확인
  const returnToSection = store.getters['analyze/getCurrentSection']
  
  // 돌아온 경우에만 스크롤 (Navigation Guard에서 첫 진입 처리를 이미 함)
  if (returnToSection !== undefined && returnToSection !== null) {
    // analyzeData가 로드된 후에 스크롤 시도
    if (analyzeData.value) {
      // 저장된 섹션으로 스크롤
      nextTick(() => {
        setTimeout(() => {
          scrollToSection(returnToSection)
        }, 300)
      })
    } else {
      // analyzeData가 로드되지 않았으면 watch로 대기
      watch(analyzeData, (newValue) => {
        if (newValue) {
          nextTick(() => {
            setTimeout(() => {
              scrollToSection(returnToSection)
            }, 300)
          })
        }
      }, { immediate: true })
    }
  }
  
  // 스크롤 이벤트 리스너 추가
  window.addEventListener('scroll', updateActiveMenuOnScroll);
});
</script>

<template>
  <section v-if="analyzeData" class="container AnalyzeDetail">
    <div class="AnalyzeDetail--menu--cover">
      <div
        ref="scrollContainer"
        class="AnalyzeDetail--menu"
        @mousedown="dragStart"
        @mousemove="drag"
        @mouseup="dragEnd">
        <button
          v-for="(item, index) in menu"
          @click="move($event, index)"
          type="button"
          class="AnalyzeDetail--menu-btn"
          :class="{ 'active': index === activeMenuIndex }"
          v-bind:key="item">
          {{ item }}
        </button>
      </div>
    </div>

    <!--검진 데이터-->
    <AnalyzeCheckupData id="g0" :sendData="sendData" :currentSection="0" />
    
    <!--노화 속도-->
    <AnalyzeAgingSpeed  id="g1" :isMain="false" :sendData="sendData" :currentSection="1" />

    <!--건강 위치-->
    <AnalyzeHealthLocation id="g2" :sendData="sendData" :currentSection="2" />

    <!--건강 신호등-->
    <div class="AnalyzeDetail--HealthLight" id="g3">
      <div class="AnalyzeDetail--HealthLight--tit-wrap">
        <h2 class="tooltip--tit AnalyzeDetail--HealthLight--tit">{{ $t('AnalyzeHealthLight.text1') }} </h2>
        <button
          @click="openTooltip($event)"
          class="btn--tooltip AnalyzeDetail--HealthLight--tip-btn"
          type="button"
          title="도움말" />

        <base-tooltip
          v-if="tooltip"
          :leftLoca="tooltipEdge"
          @tooltipClose="tooltipClose"
          class="AnalyzeDetail--HealthLight--tip-dom">
          <template v-slot:contents>
            <p class="tooltip--contents">
              {{ $t('AnalyzeHealthLight.text3')}}
            </p>
          </template>
        </base-tooltip>
      </div>

      <swiper
        :centered-slides="isPc ? false : true"
        :space-between="isPc ? 0 : 10"
        :pagination="isPc ? false : {
          clickable: true
        }"
        :navigation="isPc ? false : true"
        :breakpoints="isPc ? {} : {
          '0': {
            slidesPerView: 1.15,
          },
          '700': {
            slidesPerView: 1.8,
          },
          '1000': {
            slidesPerView: 2.8,
          },
        }"
        :slides-per-view="isPc ? 6 : 'auto'"
        :modules="isPc ? [] : modules"
        class="AnalyzeDetail--HealthLight--swiper">
        <swiper-slide>
          <!-- 노화 억제 분석 지수 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeAgingInhibitionAnalyzeIndex`"
            :title="t('AnalyzeDetail.text3')"
            :sendData="sendData"
            :currentSection="3"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 만성질환 억제 분석 지수 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeChronicDiseaseControlAnalyzeIndex`"
            :title="t('AnalyzeDetail.text4')"
            :sendData="sendData" 
            :currentSection="3"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 근육 밸런스 분석 지수 -->
          <AnalyzeScorecomAnalyzeIndex
            :key="`muscle-balance-${muscleBalanceKey}`"
            :compId="`AnalyzeMuscleBalanceAnalyzeIndex`"
            :title="t('AnalyzeDetail.text38')"
            :sendData="sendData" 
            :currentSection="3"
            :refreshTrigger="muscleBalanceRefreshTrigger"
            @openBodyCompositionPopup="handleOpenBodyCompositionPopup"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 식사 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeDietIndex`"
            :title="t('Home.text29')"
            :sendData="sendData" 
            :currentSection="3"
            @openDietGuide="openDietGuide"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 운동 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeExerciseIndex`"
            :title="t('Home.text30')"
            :sendData="sendData" 
            :currentSection="3"
            @openExerciseGuide="openExerciseGuide"
            @showNoDataPopup="handleShowNoDataPopup"
            class="swiper-slide-con" />
        </swiper-slide>

        <swiper-slide>
          <!-- 수면 -->
          <AnalyzeScorecomAnalyzeIndex
            :compId="`AnalyzeSleepIndex`"
            :title="t('Home.text31')"
            :sendData="sendData" 
            :currentSection="3"
            @openSleepGuide="openSleepGuide"
            class="swiper-slide-con" />
        </swiper-slide>
      </swiper>
    </div>

    
    <!-- 인체 생리 네트워크 -->
    <AnalyzeHealthLight
      id="g4"
      :key="`health-light-${analyzeData.id}`"
      :clusterList="analyzeData.clusterList"
      :detailId="analyzeData.id"
      :sendData="sendData"
      :currentSection="4" />

    <p class="AnalyzeDetail--desc" v-html="$t('Analyze.text12')" />
    <section class="AnalyzeDownload" id="g5">
      <div class="btn--bottom AnalyzeDownload--btn-div">
        <div class="AnalyzeDownload--down-wrap">
          <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12') }} </p>
        </div>
        <div class="AnalyzeDownload--report-kakao">
          <button @click="clickReportOpen(REPORT_OEPN_TYPE.DOWNLOAD_VIEW)" type="button" class="AnalyzeDownload--view">
           {{ $t('AnalyzeDetail.text10') }}
          </button>
          <button
            v-if="!isOneTime"
            @click="clickReportOpen(REPORT_OEPN_TYPE.KAKAO)"
            type="button"
            class="AnalyzeDownload--kakao">
            {{ $t('AnalyzeDetail.text11') }}
          </button>
          <!-- 비활성화 -->
<!--          <button
            v-if="!isOneTime"
            type="button"
            class="AnalyzeDownload&#45;&#45;kakao dimed">
            {{ $t('AnalyzeDetail.text11') }}
          </button>-->
        </div>
        <button
          v-if="!isOneTime"
          type="button"
          @click="copyAnalysisNumber"
          class="AnalyzeDownload--copy"
          :title="$t('AnalyzeDetail.clickToCopy')">
          <span>{{ $t('AnalyzeDetail.analysisNumber') }}: {{ surveyData?.commonInfo?.aCode || checkupResultId }}</span>
          <img src="@/assets/images/icons/i-copy.png" alt="copy" />
        </button>
      </div>

      <div v-if="!isOneTime" class="AnalyzeDownload--print-wrap">
        <!-- <div class="AnalyzeDownload--print-wrap2">
          <button type="button" class="AnalyzeDownload--print" @click="movePrintRequestPage">
            {{ $t('AnalyzeDetail.text13') }} 
          </button>
        </div> -->
        <div class="AnalyzeDownload--other-wrap">
          <button type="button" class="AnalyzeDownload--other" @click="moveReportHistoryListPage">
            {{ $t('AnalyzeDetail.text14') }}
          </button>
        </div>
        <div class="AnalyzeDownload--delete-wrap">
          <button type="button" class="AnalyzeDownload--delete" @click="deleteReport">
            {{ $t('Common.delete') }} 
          </button>
        </div>
      </div>
    </section>

    <!-- S : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->
    <!-- to 개발 | 복약정보가 없을 경우 미노출, 복약정보가 있을 경우 팝업이 열려있는 상태가 default -->
    <div class="AnalyzeDetail--medicationPopup open"><!-- to 개발 | 복약정보 팝업을 열었을 경우에 open 클래스 추가 -->
      <!-- to 개발 | 복약정보를 닫은 경우(open 클래스 삭제) -->
      <!-- <p class="AnalyzeDetail--medicationPopup-detail">{{ $t('Router.checkup.text21') }} {{ $t('AnalyzeDetail.text47') }}</p> -->

      <!-- to 개발 | 복약정보가 있을 경우 -->
      <p class="AnalyzeDetail--medicationPopup-detail">
        <span>{{ $t('CheckupMedication.text9') }}, {{ $t('CheckupMedication.text10') }}</span> {{ $t('AnalyzeDetail.text48') }}
      </p>
    </div>
    <!-- E : 20260306 ASB-13674 - 마이웰니스랩 과학적 표현 강화 -->

    <BtnTop />
  </section>

  <!-- <ReportGenerator
    v-if="analyzeData && analyzeData.examinationData"
    ref="reportGeneratorRef"
    :analyzeData="analyzeData"
    :surveyData="surveyData"
    :isOneTime="isOneTime"
    :user="user"
    @progress="handleGenerateProgress"
    @complete="completeGenerateReport" /> -->
  <!-- <ReportGeneratorLoading v-if="generateLoading" :progress="progress" /> -->

  <!-- 2025-09-29: 로그미 소스로 변경 -->
  <ResultDocument 
    v-if="analyzeData && analyzeData.examinationData"
    ref="resultDocumentRef"
    :analyzeData="analyzeData"
    :surveyData="surveyData"
    :isOneTime="isOneTime"
    :user="user"
    @progress="handleGenerateProgress"
    @complete="completeGenerateReport"
    />
  
  <base-popup v-if="isSharePopup" class="popup"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          <p class="pop-text-light">{{ $t('AnalyzeDetail.text16') }} </p>
          <p class="pop-text-bold">{{ $t('AnalyzeDetail.text17') }} </p>
          <div class="pop-btn-wrap">
            <button type="button" @click="isSharePopup = false" class="pop-btn pop-btn--gray">{{ $t('Common.close') }} </button>
            <button type="button" @click="handleReportOpenByType" class="pop-btn pop-btn--green">{{ $t('AnalyzeDetail.text19') }} </button>
          </div>
        </div>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="isViewerPopup"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          <p>{{ $t('AnalyzeDetail.text16') }} </p>
          <p>{{ $t('AnalyzeDetail.text20') }} </p>
          <div class="AnalyzeDownload--down-pop--btn-wrap">
            <button type="button" @click="isViewerPopup = false" class="btn-pop--gray">{{ $t('Common.close') }} </button>
            <button type="button" @click="handleReportOpenByType" class="btn-pop--green">{{ $t('AnalyzeDetail.text21') }} </button>
          </div>
        </div>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="false"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>
      <div v-if="isIos" class="AnalyzeDownload--down-pop"> <!--ios-->
        <div class="AnalyzeDownload--down-pop--ios">
          {{ $t('AnalyzeDetail.text22') }} 

          <div v-if="isIosChrome" class="AnalyzeDownload--down-pop--chrome"> <!--크롬-->
            <img src="" alt="" class="AnalyzeDownload--down-pop--chrome-ico" /> {{ $t('AnalyzeDetail.text23') }}  <br />
            {{ $t('AnalyzeDetail.text18') }}  <img src="" alt="" class="AnalyzeDownload--down-pop--chrome-ico2" /> {{ $t('AnalyzeDetail.text16') }} 
          </div>

          <div v-else class="AnalyzeDownload--down-pop--safari"> <!--사파리-->
            <img
              src=""
              alt=""
              srcset=""
              class="AnalyzeDownload--down-pop--safari-ico" /> {{ $t('AnalyzeDetail.text13') }}  <br />
            {{ $t('AnalyzeDetail.text25') }} 
          </div>

        </div>
        <div class="AnalyzeDownload--down-pop--confirm">
          <button @click="iosSafari" type="button">{{ $t('Common.confirm') }} </button>
        </div>
      </div>

      <div v-else class="AnalyzeDownload--down-pop--aos">
        <div class="AnalyzeDownload--down-pop--aos-txt">
          {{ $t('AnalyzeDetail.text28') }}  <br />
          {{ $t('AnalyzeDetail.text29') }} 
          <div class="AnalyzeDownload--down-pop--load">{{ $t('AnalyzeDetail.text30') }} </div>
        </div>
        <div class="AnalyzeDownload--down-pop--cancel-wrap">
          <button @click="downCancel()" type="button" class="AnalyzeDownload--down-pop--cancel">{{ $t('Common.cancle') }} </button>
        </div>
      </div>

    </template>
  </base-popup>

  <base-popup v-if="isPopDeleteReport" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-light">{{ $t('AnalyzeDetail.text32') }} </p>
      <p class="pop-text-bold">{{ $t('AnalyzeDetail.text33') }} </p>
      <div class="pop-btn-wrap">
        <button @click="[isDeleteReport = false, isPopDeleteReport = false]" class="pop-btn pop-btn--gray" type="button">{{ $t('Common.cancle') }} </button>
        <button @click="[isDeleteReport = true, isPopDeleteReport = false]" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }} </button>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="isOneTimeDonwloadPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-light">{{ $t('AnalyzeDetail.text34') }} </p>
      <p class="pop-text-bold">{{ $t('AnalyzeDetail.text35') }} <br />{{ $t('AnalyzeDetail.text36') }} </p>
      <div class="pop-btn-wrap">
        <button @click="closeOneTimeDonwloadPopup" class="pop-btn pop-btn--gray" type="button">{{ $t('Common.cancle') }} </button>
        <button @click="confirmOneTimeDonwload" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }} </button>
      </div>
    </template>
  </base-popup>

  <transition name="toastFade">
    <div v-if="toastMsg !== ''" class="toast">
      {{ toastMsg }}
    </div>
  </transition>

  <!-- 가이드 팝업들 -->
  <AnalyzeDietDetailGuide
    :isOpen="dietGuidePopup"
    @close="closeDietGuide" />

  <AnalyzeExerciseDetailGuide
    :isOpen="exerciseGuidePopup"
    @close="closeExerciseGuide" />

  <AnalyzeSleepDetailGuide
    :isOpen="sleepGuidePopup"
    @close="closeSleepGuide" />

  <!-- 체성분 데이터 없음 팝업 -->
  <BasePopup v-if="showNoDataPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('AnalyzeDetail.noBodyCompositionData') }}</p>
      <div class="base-pop--footer">
        <button @click="showNoDataPopup = false" type="button" class="btn-pop--green">{{ $t('AnalyzeDetail.confirm') }}</button>
      </div>
    </template>
  </BasePopup>

  <!-- 에러 메시지 팝업 -->
  <BasePopup v-if="showErrorPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ errorPopupMessage }}</p>
      <div class="base-pop--footer">
        <button @click="closeErrorPopup" type="button" class="btn-pop--green">{{ $t('AnalyzeDetail.confirm') }}</button>
      </div>
    </template>
  </BasePopup>

  <!-- 성공 메시지 토스트 -->
  <BaseToast :msg="successToastMessage" />

  <!-- 체성분 데이터 선택 팝업 -->
  <BodyCompositionPopup 
    :isOpen="openPopBodyComposition"
    :showBodyKeyLogin="showBodyKeyLogin"
    :showBodyKeyResult="showBodyKeyResult"
    :showBodyKeyDetail="showBodyKeyDetail"
    :showResultPopup="showResultPopup"
    :resultMessage="resultMessage"
    :resultType="resultType"
    :bodyKeyDataList="bodyKeyDataList"
    :bodyCompositionDataList="bodyCompositionDataList"
    :isLoading="isLoading"
    :selectedBodyKeyData="selectedBodyKeyData"
    :selectedDataType="selectedDataType"
    :formatDatetime="formatDatetime"
    :loginFailed="bodyKeyLoginFailed"
    @close="openPopBodyComposition = false"
    @update:selectedBodyKeyData="selectedBodyKeyData = $event"
    @update:showBodyKeyLogin="showBodyKeyLogin = $event"
    @update:showBodyKeyResult="showBodyKeyResult = $event"
    @update:showBodyKeyDetail="showBodyKeyDetail = $event"
    @handleBodyKeyLogin="handleBodyKeyLoginWrapper"
    @selectBodyKeyData="selectBodyKeyData"
    @selectExistingBodyComposition="selectExistingBodyComposition"
    @confirmBodyKeyData="confirmBodyKeyData"
    @analyzeSelectedBodyKeyData="handleAnalyzeSelectedBodyKeyData"
    @closeBodyKeyDetail="closeBodyKeyDetail"
    @handleDirectInput="handleDirectInput"
    @closeResultPopup="closeResultPopup"
    @refreshAnalysisData="() => { getAnalysisCompleteDetail(checkupResultId); setData(analyzeData.value) }"
  />

  <!-- PDF 로딩 팝업 -->
  <base-popup v-if="isPdfLoadingPopup" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('Pdf.processing')}}</p>
      <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
      <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>

  <!-- 최초 Front 에서 PDF 생성중임을 알리는 팝업 -->
  <base-popup v-if="isMakePdfOnFrontPopup" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('Pdf.makeProcessing')}}</p>
      <p class="pop-text-light">{{ completePdfPageCount }} / {{ totalPage }}</p>
      <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>

  <!-- 일회성 PDF 생성 대기 로딩 팝업 -->
  <base-popup v-if="isOneTimePdfLoading" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ $t('CheckupComplete.text17')}}</p>
      <p class="pop-text-light">{{ $t('CheckupComplete.text18')}}</p>
      <div class="text-center">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </base-popup>

  <!-- 일회성 PDF 다운로드 확인 팝업 -->
  <base-popup v-if="isOneTimeDownloadPopup" class="base-pop popup">
    <template v-slot:contents>
      <p class="pop-text-bold" v-html="$t('CheckupComplete.text27')"></p>
      <div class="pop-btn-wrap">
        <button type="button" @click="handleOneTimePdfDownload" class="pop-btn pop-btn--green pop-btn--wide">{{ $t('CheckupComplete.text28') }}</button>
      </div>
      <p class="AnalyzeDownload--down-txt">{{ $t('AnalyzeDetail.text12') }} </p>
      <div class="text-link-wrap">
        <span class="text-link" @click="closeOneTimeDownloadPopup">{{ $t('CheckupComplete.text29') }}</span>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped>
// PDF 로딩 팝업 스타일
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
  background-color: #7ED47C;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6746F;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6AE5A;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
  background-color: #7ED47C;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

// PDF 공유 옵션 팝업 스타일
.share-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.share-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7ED47C;
    background: #f8fff8;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.share-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.share-option-btn span:last-child {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next){
  width: 52px;
  height: 52px;
  top: var(--swiper-navigation-top-offset, 44%);
  @media (min-width: 960px){
    display: none;
  }
}
:deep(.swiper-button-next:after, .swiper-rtl .swiper-button-prev:after),
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  content: "";
  display: block;
  width: 52px;
  height: 52px;
  background: url("/img/btn-arrow.png") no-repeat center;
  background-size: 5.2rem;
}
:deep(.swiper-button-prev:after, .swiper-rtl .swiper-button-next:after){
  transform: rotate(180deg);
}
:deep(.swiper-button-prev.swiper-button-disabled){
  display: none;
}
:deep(.swiper-button-next.swiper-button-disabled){
  display: none;
}

// 일회성 PDF 다운로드 팝업 스타일
.pop-btn--wide {
  width: 100%;
  max-width: none;
}

.text-link-wrap {
  margin-top: 20px;
  text-align: center;
}

.text-link {
  color: #666;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
  
  &:hover {
    color: #333;
  }
  
  &:active {
    opacity: 0.7;
  }
}
</style>
