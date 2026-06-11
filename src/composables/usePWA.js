import { ref, readonly } from 'vue'
import { useStore } from 'vuex'

// PWA 관련 상태
const isPwaInstallable = ref(false)
const deferredPrompt = ref(null)
const isServiceWorkerRegistered = ref(false)

// 안드로이드 디바이스 여부 확인
const isAndroidDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return /android/i.test(userAgent)
}


// PWA 설치 여부 확인 (Android 전용)
const isPwaInstalled = () => {
  // Android에서 PWA로 실행 중인지 확인
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  
  // 현재 도메인이 우리 도메인인지 확인
  const currentDomain = window.location.hostname
  const isOurDomain = currentDomain.includes('mywellnesslab') || currentDomain.includes('localhost')
  
  return isStandalone && isOurDomain
}

// 쿠키 읽기 헬퍼 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// PWA 설치 가능 여부 체크
const checkPwaInstallability = () => {
  const noAddHomeValue = getCookie('noAddHome')
  const isAndroid = isAndroidDevice()
  const isInstalled = isPwaInstalled()
  
  const wasInstallable = isPwaInstallable.value
  
  if (!isAndroid || isInstalled || noAddHomeValue) {
    isPwaInstallable.value = false
  } else {
    isPwaInstallable.value = true
  }
  
  // 상태가 변경되었을 때만 이벤트 발생 (무한 루프 방지)
  if (wasInstallable !== isPwaInstallable.value) {
    window.dispatchEvent(new CustomEvent('pwa-installability-changed', {
      detail: { isInstallable: isPwaInstallable.value }
    }))
  }
  
  return isPwaInstallable.value
}

// PWA 설치 프롬프트 표시
const showInstallPrompt = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        // 즉시 배너 숨기기
        isPwaInstallable.value = false
        
        // 설치 성공 시에도 하루 동안 안 보이게 쿠키 설정
        const expires = new Date()
        expires.setDate(expires.getDate() + 1)
        document.cookie = `noAddHome=Y; expires=${expires.toUTCString()}; path=/`
        
        // 상태 변경 이벤트 발생 (UI에 즉시 반영)
        window.dispatchEvent(new CustomEvent('pwa-installability-changed', {
          detail: { isInstallable: false }
        }))
      }
      deferredPrompt.value = null
    })
  }
}


// beforeinstallprompt 이벤트 리스너 설정
let beforeInstallPromptListenerAdded = false

const setupBeforeInstallPrompt = () => {
  if (beforeInstallPromptListenerAdded) {
    return
  }
  
  beforeInstallPromptListenerAdded = true
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // 도메인 체크
    const currentDomain = window.location.hostname
    const isOurDomain = currentDomain.includes('mywellnesslab') || currentDomain.includes('localhost')
    
    if (!isOurDomain) {
      return
    }
    
    // 항상 이벤트 차단 (자동 실행 방지)
    e.preventDefault()
    
    if (isPwaInstalled()) {
      return
    }

    // 이벤트 저장 (수동 설치용)
    deferredPrompt.value = e
    
    // 안드로이드이고 쿠키에 값이 없을 때만 설치 가능 상태로 설정
    checkPwaInstallability()
  })
}

// Service Worker 등록 (PWA 설치용, 캐싱 없음)
const registerServiceWorker = () => {
  // Service Worker 등록 (PWA 설치용, 캐싱 없음)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        isServiceWorkerRegistered.value = true
        
        // Service Worker가 활성화된 후 beforeinstallprompt 설정
        if (registration.active) {
          setupBeforeInstallPrompt()
        } else if (registration.installing) {
          registration.installing.addEventListener('statechange', () => {
            if (registration.installing.state === 'activated') {
              setupBeforeInstallPrompt()
            }
          })
        } else {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  setupBeforeInstallPrompt()
                }
              })
            }
          })
        }
      })
      .catch((error) => {
        // Service Worker 등록 실패해도 beforeinstallprompt는 설정해보기
        setupBeforeInstallPrompt()
      })
  } else {
    // Service Worker를 지원하지 않아도 beforeinstallprompt는 설정해보기
    setupBeforeInstallPrompt()
  }
}

// Service Worker 해제 (로그아웃 시)
const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
      })
      isServiceWorkerRegistered.value = false
    })
  }
}


// PWA 초기화 (캐싱 없음)
const initPWA = () => {
  // 리다이렉트 후 PWA 상태 강제 체크
  const checkRedirectPwaState = () => {
    const currentDomain = window.location.hostname
    const isOurDomain = currentDomain.includes('mywellnesslab') || currentDomain.includes('localhost')
    
    if (!isOurDomain) {
      return
    }
    
    // PWA 설치 상태 강제 체크
    const isInstalled = isPwaInstalled()
    
    // PWA가 설치되어 있으면 즉시 상태 업데이트
    if (isInstalled) {
      isPwaInstallable.value = false
      
      // 상태 변경 이벤트 발생
      window.dispatchEvent(new CustomEvent('pwa-installability-changed', {
        detail: { isInstallable: false }
      }))
    }
  }
  
  // 즉시 체크
  checkRedirectPwaState()
  
  // Service Worker는 로그인 상태와 관계없이 먼저 등록 (beforeinstallprompt 이벤트를 위해)
  if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
    registerServiceWorker()
  }
  
}

// PWA Composable
export function usePWA() {
  return {
    // 상태
    isPwaInstallable: readonly(isPwaInstallable),
    
    // 메서드
    showInstallPrompt,
    checkPwaInstallability,
    initPWA,
    isAndroidDevice,
    isPwaInstalled
  }
}

// 전역 PWA 초기화 (App.vue에서 사용)
export function initGlobalPWA() {
  initPWA()
  
  // 전역으로 PWA 관련 함수들 노출
  window.pwaUtils = {
    showInstallPrompt,
    isPwaInstallable: () => isPwaInstallable.value,
    checkPwaInstallability
  }
}

// 개별 함수들도 export (AddBtnHome.vue에서 사용)
export { isAndroidDevice, isPwaInstalled, getCookie, showInstallPrompt, checkPwaInstallability }
