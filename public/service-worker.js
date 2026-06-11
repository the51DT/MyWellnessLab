/**
 * Service Worker for PWA
 * PWA 기능은 유지하되 캐싱은 하지 않습니다.
 * 오프라인 기능 없이 앱 설치 및 실행만 지원합니다.
 */

// Service Worker 설치 이벤트 (캐싱 없음)
self.addEventListener('install', (event) => {
  console.log('Service Worker 설치 중... (캐싱 비활성화)')
  
  // 즉시 활성화
  self.skipWaiting()
})

// Service Worker 활성화 이벤트 (캐싱 없음)
self.addEventListener('activate', (event) => {
  console.log('Service Worker 활성화 중... (캐싱 비활성화)')
  
  // 모든 클라이언트 즉시 제어
  event.waitUntil(self.clients.claim())
})

// 네트워크 요청 가로채기 (캐싱 없이 통과만)
self.addEventListener('fetch', (event) => {
  // 모든 요청을 그대로 통과시킴 (캐싱 없음)
  // PWA 기능만 유지하고 네트워크 요청은 원본 그대로 처리
  return
})