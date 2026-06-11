import { scrollToElement } from '@/assets/js/common'

/**
 * 설문 페이지에서 조건부 스크롤 기능을 제공하는 composable
 * @param {Object} scrollConfig - 스크롤 설정 객체
 * @param {string} scrollConfig.containerSelector - 질문 컨테이너 선택자 (예: '.CheckupPhysicalActivity--for-wrap')
 * @param {number} scrollConfig.pcMargin - PC 여백 (기본값: 130)
 * @param {number} scrollConfig.mobileMargin - 모바일 여백 (기본값: 50)
 * @param {number} scrollConfig.delay - 딜레이 시간 (기본값: 100ms)
 */
export function useConditionalScroll(scrollConfig = {}) {
  const {
    containerSelector = '',
    pcMargin = 130,
    mobileMargin = 50,
    delay = 100
  } = scrollConfig

  /**
   * 질문 번호로 스크롤
   * @param {number} questionNumber - 스크롤할 질문 번호 (1부터 시작)
   */
  const scrollToQuestion = (questionNumber) => {
    if (!containerSelector) {
      console.warn('useConditionalScroll: containerSelector is required')
      return
    }
    
    const selector = `${containerSelector}:nth-child(${questionNumber})`
    scrollToElement(selector, pcMargin, mobileMargin)
  }

  /**
   * Select 변경 시 조건부 스크롤을 처리하는 핸들러
   * @param {*} value - 선택된 값
   * @param {string} questionKey - 질문 키
   * @param {number} index - 질문 인덱스
   * @param {Function} beforeScroll - 스크롤 전 실행할 함수 (예: disableAction)
   * @param {Object} scrollRules - 스크롤 규칙 객체
   */
  const handleSelectChange = (value, questionKey, index, beforeScroll, scrollRules = {}) => {
    // 사전 실행 함수 호출 (예: disableAction)
    if (beforeScroll && typeof beforeScroll === 'function') {
      beforeScroll()
    }
    
    // 스크롤 로직
    setTimeout(() => {
      const rule = scrollRules[questionKey]
      if (rule && rule.index === index) {
        if (value === 0 && rule.disableTarget) {
          // disableAction인 경우
          scrollToQuestion(rule.disableTarget)
        } else if (value !== 0 && rule.enableTarget) {
          // disableAction이 아닌 경우
          scrollToQuestion(rule.enableTarget)
        }
      }
    }, delay)
  }

  return {
    scrollToQuestion,
    handleSelectChange
  }
}

/**
 * 신체활동 페이지 전용 스크롤 규칙
 */
export const physicalActivityScrollRules = {
  activInts: {
    index: 0,
    disableTarget: 3, // 3번 질문 (중간 강도)
    enableTarget: 2   // 2번 질문 (시간 입력)
  },
  activMod: {
    index: 2,
    disableTarget: 5, // 5번 질문 (걷기)
    enableTarget: 4   // 4번 질문 (시간 입력)
  },
  activWalk: {
    index: 4,
    disableTarget: null, // 마지막이므로 스크롤 안함
    enableTarget: 6      // 6번 질문 (시간 입력)
  }
}
