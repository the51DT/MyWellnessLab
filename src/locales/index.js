// locales/index.js
import { createI18n } from 'vue-i18n'
import ko from './ko.json'
import en from './en.json'

export const messages = { ko, en }

// 지원하는 언어 목록
export const supportedLocales = ['ko', 'en']

// 사용자 언어 감지 함수
export const detectUserLocale = () => {
  // 저장된 언어가 있으면 우선 사용
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale
  }
  
  // 브라우저 언어 감지
  const browserLocale = navigator.language.toLowerCase()
  // 정확히 매칭되는 언어 찾기
  if (supportedLocales.includes(browserLocale)) {
    return browserLocale
  }
  
  // 언어 코드만 매칭 (예: 'ko-KR' -> 'ko')
  const languageCode = browserLocale.split('-')[0]
  if (supportedLocales.includes(languageCode)) {
    return languageCode
  }
  
  // 기본값 반환
  return 'ko'
}

export const i18n = createI18n({
  legacy: false, 
  locale: detectUserLocale(),
  fallbackLocale: 'en',
  messages,
  missingWarn: false,  // 번역 키가 없을 때 경고 로그 억제
  fallbackWarn: false   // fallback 로케일 사용 시 경고 로그 억제
})

export default i18n