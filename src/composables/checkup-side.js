import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { nextTick } from 'vue'

/**
 * checkup-side 플로우의 뒤로가기 처리를 위한 composable
 */
export const useCheckupSideNavigation = () => {
  const router = useRouter()
  const route = useRoute()
  const store = useStore()

  // 라우터별 이전 페이지 매핑
  const routeMapping = {
    '/checkup-side/date': 'CheckupSideTerms',
    '/checkup-side/terms': 'CheckupSideSelect',
    '/checkup-side/select': 'CheckupGuide',
    '/checkup-side/guide': 'Home'
  }

  /**
   * checkup-side 플로우에서 뒤로가기 처리
   * 매핑된 이전 페이지가 있으면 해당 페이지로, 없으면 기본 뒤로가기
   */
  const handleBack = async () => {
    let analysisType

    try {
      console.log('handleBack started')

      // VuexPersistence가 완전히 로드될 때까지 잠깐 기다림
      await nextTick()
      console.log('nextTick completed')

      // analysisType을 함수 호출 시점에 동적으로 가져옴
      analysisType = store.getters['checkup/getAnalysisType']
      console.log('store.getters completed')

      // 디버깅: 현재 라우트 정보 출력
      console.log('Current route path:', route.path)
      console.log('Current route name:', route.name)
      console.log('Analysis type:', analysisType)
    } catch (error) {
      console.error('Error in handleBack:', error)
      return
    }

    // analysisType이 아직 로드되지 않은 경우 추가 대기
    if (!analysisType && route.path === '/checkup-side/terms') {
      // sessionStorage에서 직접 확인
      const persistedState = sessionStorage.getItem('vuex')
      if (persistedState) {
        try {
          const parsed = JSON.parse(persistedState)
          const storedAnalysisType = parsed.checkup?.analysisType
          console.log('Stored analysis type from sessionStorage:', storedAnalysisType)

          if (storedAnalysisType === 'onetime') {
            console.log('One-time analysis detected from sessionStorage, navigating to Home')
            router.push({ name: 'Home' })
            return
          }
        } catch (e) {
          console.error('Failed to parse sessionStorage:', e)
        }
      }
    }
    
    // 일회성 분석이고 terms 페이지인 경우 Home으로 이동
    if (analysisType === 'onetime' && route.path === '/checkup-side/terms') {
      console.log('One-time analysis on terms page, navigating to Home')
      router.push({ name: 'Home' })
      return
    }
    
    console.log('Route mapping for current path:', routeMapping[route.path])
    
    // 현재 경로에 대한 이전 페이지가 정의되어 있는지 확인
    if (routeMapping[route.path]) {
      console.log('Navigating to:', routeMapping[route.path])
      router.push({ name: routeMapping[route.path] })
      return
    }

    // 매핑되지 않은 경우 기본 뒤로가기
    console.log('No mapping found, using router.back()')
    router.back()
  }

  return {
    handleBack
  }
}
