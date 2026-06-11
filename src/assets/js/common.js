import router from '@/router'

/**
 * 특정 요소로 부드럽게 스크롤하는 공통 함수
 * @param {string} selector - 스크롤할 대상 요소의 CSS 선택자
 * @param {number} pcMargin - PC에서의 상단 여백 (기본값: 130)
 * @param {number} mobileMargin - 모바일에서의 상단 여백 (기본값: 50)
 */
export function scrollToElement(selector, pcMargin = 130, mobileMargin = 50) {
  const isPc = funcIsPc()
  const targetElement = document.querySelector(selector)
  
  if (!targetElement) return
  
  const topMargin = isPc ? pcMargin : mobileMargin
  
  window.scrollBy({
    top: targetElement.getBoundingClientRect().top - topMargin,
    behavior: 'smooth'
  })
}

/**
 * 이 함수는 웰니스 분석 시 질문에 대한 답변을 한 후 답변을 달지 않은 맨 첫번째 항목으로 이동하도록 처리
 * @param {object} event - 클릭한 대상
 * @param {string} tg - 클릭한 대상의 부모 dom
 * @param {object} data - 답변 데이터 객체
 * @param {string} name - 답변 데이터 접두어
 */
export function nextStep (event, tg, data, name) {
  const isPc = funcIsPc()
  let topMargin = 0
  let tgQ = null
  const thisQ = event.target.closest(tg)
  const parent = thisQ.parentNode
  const first = parent.firstElementChild
  const last = parent.lastElementChild

  let lengthMinus = 4
  if (name === 'smcq') {
    lengthMinus = 2
  }
  const length = Object.keys(data).length - lengthMinus

  let noCheck = -1
  if (name === 'esq' || name === 'nt') {
    noCheck = null
  }

  for (let i = 1; i < length; i++) {
    if (i < 10) {
      if (data[name + 0 + i] === noCheck) {
        tgQ = parent.children[i - 1]
        break
      }
    } else {
      if (data[name + i] === noCheck) {
        tgQ = parent.children[i - 1]
        break
      }
    }
  }

  if (tgQ === null) {
    tgQ = last
  }

  if (isPc) {
    topMargin = 60
  } else {
    topMargin = 20
  }
  if (tgQ === first) {
    topMargin = topMargin + 60
    if (isPc) {
      topMargin = topMargin - 10
    }
  }

  window.scrollBy({
    top: tgQ.getBoundingClientRect().top - topMargin,
    behavior: 'smooth'
  })
}

/**
 * 이 함수는 웰니스 분석 시 질문에 대한 답변을 한 후 답변을 달지 않은 맨 첫번째 항목으로 이동하도록 처리, class 네임을 활용한 버전
 * @param {*} tg - 문항리스트를 얻기 위한 dom class
 * @param {*} data - 답변 데이터 객체
 * @param {*} name - 답변 데이터 접두어
 */
export function nextStep2 (tg, data, name) {
  const isPc = window.innerWidth > 1200
  let topMargin = isPc ? 50 : 0
  let tgQ = null
  const parent = document.querySelectorAll(tg)
  const first = parent[0]
  const last = parent[parent.length - 1]

  let noCheck = -1
  if (name === 'esq' || name === 'nt') {
    noCheck = null
  }
  for (let i = 0; i < parent.length; i++) {
    if (i < 9) {
      if (data[name + 0 + (i + 1)] === noCheck) {
        tgQ = parent[i]
        break
      }
    } else {
      if (data[name + (i + 1)] === noCheck) {
        tgQ = parent[i]
        break
      }
    }
  }

  if (tgQ === first) {
    topMargin = topMargin + 70
    if (isPc) {
      topMargin = topMargin - 20
    }
  }
  if (name === 'womac') {
    if (tgQ === first) {
      topMargin = topMargin + 10
      if (isPc) {
        topMargin = topMargin + 10
      }
    }
    else if (tgQ === parent[5] || tgQ === parent[7]) {
      topMargin = topMargin + 80
      if (isPc) {
        topMargin = topMargin - 10
      }
    }
    else {
      topMargin = topMargin + 20
      if (isPc) {
        topMargin = topMargin - 25
      }
    }
  }

  if (tgQ === null || tgQ === undefined) {
    tgQ = last
  }

  window.scrollBy({
    top: tgQ.getBoundingClientRect().top - topMargin,
    behavior: 'smooth'
  })
}

export function go (url) { /* 링크 */
  router.push(url)
}

/* 관심 건강분야 추가설문 다음 페이지  */
export const orderedIdx = {
  '': {
    orderIdx: 0,
    path: '/checkup/life',
    pathName: 'CheckupEq5d'
  },
  hthMemory: {
    orderIdx: 1,
    path: '/checkup/memory',
    pathName: 'CheckupMemory'
  },
  hthEye: {
    orderIdx: 2,
    path: '/checkup/eye',
    pathName: 'CheckupEye'
  },
  hthNose: {
    orderIdx: 3,
    path: '/checkup/nose',
    pathName: 'CheckupNoseHypersensitivity'
  },
  hthStomach: {
    orderIdx: 4,
    path: '/checkup/stomach',
    pathName: 'CheckupStomach'
  },
  hthIntestine: {
    orderIdx: 5,
    path: '/checkup/intestine',
    pathName: 'CheckupIntestine'
  },
  hthBj: {
    orderIdx: 6,
    path: '/checkup/joint-bone',
    pathName: 'CheckupJointAndBone'
  },
  hthImmune: {
    orderIdx: 7,
    path: '/checkup/immunity',
    pathName: 'CheckupImmunity'
  },
  hthMen: {
    orderIdx: 8,
    path: '/checkup/prostate',
    pathName: 'CheckupProstate'
  },
  hthSexHor: {
    orderIdx: 9,
    path: '/checkup/menopause',
    pathName: 'CheckupMenopause'
  },
  menstrual: {
    orderIdx: 10,
    path: '/checkup/menstrual',
    pathName: 'CheckupMenstrual'
  }
}

/**
 * 주어진 객체, 분석 유형, 매개변수를 바탕으로 다음 페이지에 대한 경로를 찾아서 반환합니다.
 * obj: 페이지 경로 순서를 결정하는데 사용되는 객체입니다.
 * analysisType: 분석 유형을 나타내는 매개변수입니다.
 * param: pathIdx와 sex를 포함한 매개변수 객체로, 페이지 전환에 대한 추가적인 정보를 제공합니다.
 * 반환 값: 결정된 경로명과 상태 정보를 담은 객체를 반환합니다.
 */
export function findNextPage (obj, analysisType, param) {
  const tmpObj = {}
  let nextPath
  let pathIdx = (param.pathIdx == undefined ? -1 : param.pathIdx)

  for (const k in obj) {
    if (orderedIdx[obj[k]]) {
      tmpObj[orderedIdx[obj[k]].orderIdx] = orderedIdx[obj[k]].pathName
    }
  }

  nextPath = tmpObj[Object.keys(tmpObj)[++pathIdx]]

  if (pathIdx >= obj.length) { // 선택항목 모두 진행했을 경우
    if (history.state.current.indexOf('mens') < 0 && param.sex == 2) { // 여성일 경우 관심분야 다음 단계에서 월경 -> 삶의 질로 진행
      nextPath = 'CheckupMenstrual'
    } else {
      nextPath = orderedIdx[''].pathName
    }
  }

  if (nextPath === undefined) {
    nextPath = 'CheckupEq5d'
    if (history.state.current.indexOf('mens') < 0 && param.sex == 2) {
      nextPath = 'CheckupMenstrual'
    }
  }

  const rtnParam = {
    name: nextPath,
    state: {
      analysisType,
      interestParam: Object.assign(param, { pathIdx }),
      interestObj: obj
    }
  }
  return rtnParam
}

/**
 * 이 함수는 'YYYYMMDD' 형식으로 오늘의 날짜를 반환합니다.
 * 생성된 Date 객체에서 현재 전체 연도, 월, 일을 가져와서 날짜 문자열을 구성합니다.
 * 월과 일은 항상 두 자리 수가 되도록 형식화되어 있습니다.
 * 10보다 작은 월과 일 값에는 두 자리 문자열이 되도록 '0'이 앞에 추가됩니다.
 * 마지막으로, 연도, 월, 일 문자열이 구분자 없이 연결되어 최종 형식을 만듭니다.
 */
export function getCurDate () {
  const curDate = new Date()

  const fullYear = curDate.getFullYear()
  let month = curDate.getMonth() + 1
  month = (month < 10) ? '0' + month : month
  const date = (curDate.getDate() < 10) ? '0' + curDate.getDate() : curDate.getDate()

  return fullYear + '' + month + '' + date
}

/**
 * 주어진 날짜를 적절한 형식으로 변환하는 역할을 합니다.
 * 날짜를 yyyy.mm.dd 형식으로 변환합니다. argSeparator가 주어진 경우에는 이를 구분자로 사용합니다.
 * 이 함수는 다음과 같은 몇 가지 방식으로 날짜를 변환합니다:
 *  - 8자리의 값을 yyyy[구분자]mm[구분자]dd 형태로 변환합니다
 *  - 10자리의 값을 yyyy[구분자]mm[구분자]dd 형태로 변환합니다
 *  - 10자리보다 긴 값을 처리하기 위해 먼저 10자리로 자릅니다. 그런 다음 yyyy[구분자]mm[구분자]dd 형태로 변환합니다.
 *
 * 만약 알맞지 않은 길이의 값을 받는다면, 원래 값을 반환합니다.
 */
// String Format ex) 'YYYYMMDD', 'YYYY.MM.DD' ...
export function dateConvert (val, argSeparator) {
  let separator = '.'

  // 구분자 인자값이 있으면 셋팅
  if (argSeparator) separator = argSeparator

  if (val.length === 8) {
    return (val.substring(0, 4).concat(separator)) + (val.substring(4, 6).concat(separator)) + val.substring(6)
  } else if (val.length === 10) {
    return (val.substring(0, 4).concat(separator)) + (val.substring(5, 7).concat(separator)) + val.substring(8)
  } else if (val.length > 10) {
    const subStr = val.substring(0, 10)
    return (subStr.substring(0, 4).concat(separator)) + (subStr.substring(5, 7).concat(separator)) + subStr.substring(8)
  }

  return val
}

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환 (Safari 완전 호환)
 * @returns {string} YYYY-MM-DD 형식의 현재 날짜
 */
export function getCurrentDateFormatted() {
  try {
    const now = new Date()
    
    // Safari에서도 안전한 방법으로 날짜 정보 추출
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // 월은 0부터 시작하므로 +1
    const day = now.getDate()
    
    // padStart가 지원되지 않는 구형 브라우저를 위한 fallback
    const monthStr = month < 10 ? '0' + month : String(month)
    const dayStr = day < 10 ? '0' + day : String(day)
    
    return `${year}-${monthStr}-${dayStr}`
  } catch (error) {
    console.warn('날짜 생성 중 오류 발생:', error)
    // 에러 발생 시 현재 시간을 기반으로 한 fallback
    const fallbackDate = new Date()
    const year = fallbackDate.getFullYear()
    const month = String(fallbackDate.getMonth() + 1).padStart(2, '0')
    const day = String(fallbackDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

/**
 * Date 를 yyyyMMdd 형식으로 변경
 * @param {*} dateString 
 * @returns 
 */
export function formatDateToYyyyMMdd(dateString) {
  // Safari 호환성을 위해 안전한 날짜 파싱
  let date
  
  if (!dateString) {
    return ''
  }
  
  // YYYY-MM-DD 형식인지 확인
  const dashMatch = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dashMatch) {
    const year = parseInt(dashMatch[1], 10)
    const month = parseInt(dashMatch[2], 10)
    const day = parseInt(dashMatch[3], 10)
    date = new Date(year, month - 1, day) // 월은 0부터 시작
  } else {
    // 기타 형식은 기존 방식으로 시도
    date = new Date(dateString)
  }
  
  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString)
    return ''
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * 사용자의 나이를 계산하는 함수입니다.
 * 사용자의 생일 값을 입력 받아서 기준 날짜와 비교한 후 나이를 반환합니다.
 * @param {string} val - dash(-)를 포함하거나 포함하지 않는 생년월일 문자열입니다.
 * @param {string} checkDate - 기준 날짜 (검진일). 생략시 오늘 날짜를 사용합니다.
 * @returns {number} 계산된 나이를 반환합니다.
 */
export function calcAge (val, checkDate = null) {
  // Safari 호환성을 위해 날짜 형식을 정규화
  let dateStr = val
  if (val.indexOf('-') < 0) {
    dateStr = dateConvert(val, '-')
  }
  
  // Safari에서 안전한 날짜 파싱을 위해 YYYY-MM-DD 형식으로 변환
  const dateParts = dateStr.split('-')
  if (dateParts.length === 3) {
    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1 // 월은 0부터 시작
    const day = parseInt(dateParts[2], 10)
    const m = new Date(year, month, day)
    
    // checkDate 처리
    let d
    if (checkDate) {
      // checkDate도 안전하게 파싱
      const checkDateStr = checkDate.replace(/\./g, '-')
      const checkParts = checkDateStr.split('-')
      if (checkParts.length === 3) {
        const checkYear = parseInt(checkParts[0], 10)
        const checkMonth = parseInt(checkParts[1], 10) - 1
        const checkDay = parseInt(checkParts[2], 10)
        d = new Date(checkYear, checkMonth, checkDay)
      } else {
        d = new Date(checkDate)
      }
    } else {
      d = new Date()
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(m.getTime()) || isNaN(d.getTime())) {
      return 0
    }

    let age = d.getFullYear() - m.getFullYear()

    if (d.getMonth() < m.getMonth()) {
      age--
    } else if (d.getMonth() === m.getMonth() && d.getDate() < m.getDate()) {
      age--
    }

    return age
  }
  
  // 기존 방식으로 fallback
  const m = new Date(dateStr)
  const d = checkDate ? new Date(checkDate) : new Date()
  
  if (isNaN(m.getTime()) || isNaN(d.getTime())) {
    return 0
  }

  let age = d.getFullYear() - m.getFullYear()

  if (d.getMonth() < m.getMonth()) {
    age--
  } else if (d.getMonth() === m.getMonth() && d.getDate() < m.getDate()) {
    age--
  }

  return age
}

/**
 * DOM 요소의 포커스를 관리하는 함수입니다.
 *
 * @param {Object} event - 이벤트 객체입니다.
 * @param {boolean} val - 포커스를 활성화 또는 비활성화하는 데 사용되는 boolean 값입니다.
 */
export function focusDom (event, val) {
  event.target.style.outline = 'none'
  if (val) {
    event.target.parentNode.classList.add('active')
  } else {
    event.target.parentNode.classList.remove('active')
  }
}

export function continueParam (tempAnalysisData, userData) {
  const param = {
    name: userData.name,
    checkDate: tempAnalysisData.commonInfo.analysedDate.substring(0, 10),
    birthDate: userData.dateOfBirth.substring(0, 10),
    age: calcAge(userData.dateOfBirth.substring(0, 10)),
    sex: tempAnalysisData.basics.sex,
    basicsId: tempAnalysisData.basics.id
  }

  const commonInfo = tempAnalysisData.commonInfo

  let stateParam = {
    analysisType: tempAnalysisData.commonInfo.analysisType,
    healthDataType: tempAnalysisData.basics.healthDataType,
    basicsId: tempAnalysisData.basics.id,
    checkDate: tempAnalysisData.commonInfo.analysedDate
  }
  let pathName = ''

  switch (tempAnalysisData.commonInfo.step) {
    case 1:
      pathName = 'CheckupBasics'
      stateParam.analysesData = param
      break
    case 2:
      pathName = 'CheckupBlood'
      stateParam.basicData = param
      break
    case 3:
      stateParam.basicData = param

      /* interestObj :(2) ['hthMemory', 'hthNose']
                        interestParam :  {basicsId: 68, checkDate: '2023-12-03', sex: 2, pathIdx: 1} */
      pathName = 'CheckupInterestHealth'

      // 하위단계 진행 중일 때
      if (commonInfo.lowerStepList.length > 0) {
        const selectedArr = [] // 선택항목 배열
        const continuedArr = [] // 현재진행 중인(true) 인 항목 골라내기
        let pathIdx = 0

        for (const idx in commonInfo.lowerStepList) { // 선택항목 배열 추출 (interestObj)
          selectedArr.push(Object.keys(commonInfo.lowerStepList[idx])[0])
        }

        let tmpObj
        for (const idx in commonInfo.lowerStepList) { // 하위 항목/단계 추출(interestParam.pathIdx, pathName)
          tmpObj = commonInfo.lowerStepList[idx]
          if (tmpObj[Object.keys(commonInfo.lowerStepList[idx])[0]]) {
            pathIdx = idx
            pathName = orderedIdx[Object.keys(commonInfo.lowerStepList[idx])[0]].pathName
          }
        }

        if (pathName != 'CheckupInterestHealth') {
          stateParam = {
            analysisType: tempAnalysisData.commonInfo.analysisType,
            healthDataType: tempAnalysisData.basics.healthDataType,
            interestObj: selectedArr,
            interestParam: {
              basicsId: tempAnalysisData.basics.id,
              checkDate: tempAnalysisData.basics.checkDate,
              sex: tempAnalysisData.basics.sex,
              pathIdx: 1
            }
          }
        }
      }

      break
    case 4:
      pathName = 'CheckupEq5d'
      stateParam = {
        analysisType: tempAnalysisData.commonInfo.analysisType,
        healthDataType: tempAnalysisData.basics.healthDataType,
        interestParam: stateParam
      }
      break
    case 5:
      pathName = 'CheckupPhysicalActivity'
      break
    case 6:
      pathName = 'CheckupDrinkSmokeSleep'
      break
    case 7:
      pathName = 'CheckupComplete'
      break
  }

  const routerObj = {
    name: pathName,
    state: stateParam
  }
  console.log('##############', routerObj)
  return routerObj
}

// 231228 pc사이즈인지 파악하는 함수
/* 브라우저 가로 사이즈 체크, pc면 true, 모바일은 false */
export function funcIsPc () {
  return window.innerWidth > 960
}

/* 240102 팝업 등이 열렸을 때 바디 스크롤 멈추는 용도, true: 스크롤 가능, false: 스크롤 안됨 */
// 중첩 팝업을 위한 카운터
let popupCounter = 0

export function bodyScroll (bool) {
  if (bool) {
    // 스크롤 활성화 (팝업 닫기)
    popupCounter = Math.max(0, popupCounter - 1)
    if (popupCounter === 0) {
      document.body.classList.remove('no-scroll')
    }
  } else {
    // 스크롤 비활성화 (팝업 열기)
    popupCounter++
    document.body.classList.add('no-scroll')
  }
}

/* 240117 num 만큼 input 자리수가 차면 바로 다음 input으로 넘기고 만약 부모의 input으로 넘겨야 하는 경우엔 마지막 ref를 찾아 옮기는 함수 */
export function goNextInput ($event, num, nextDom) {
  if ($event.target.value.length >= num) {
    if (nextDom) {
      nextDom.focus()
    } else {
      $event.target.nextElementSibling.focus()
    }
  }
}

/**
 * 6자리의 생년월일을 받아 8자리의 생년월일을 만든다
 *
 * @param {*} data - 생년월일 예)100101
 * @returns {String} - 생년월일 예)2010-01-01
 */
export function makeBirthDay (data) {
  // 정규식 패턴
  const regexPattern = /^(\d{2})(\d{2})(\d{2})$/

  // 정규식을 사용하여 생년월일 추출
  const matchResult = data.match(regexPattern)

  // 생년월일 값 추출
  if (matchResult) {
    let year = parseInt(matchResult[1]) // 19를 추가하여 연도 생성
    const month = matchResult[2]
    const day = matchResult[3]

    // 현재 연도 가져오기
    const currentYear = new Date().getFullYear()
    // 2000년 이후 출생한 경우
    if (year <= currentYear % 100) {
      year += Math.floor(currentYear / 100) * 100 // 2000년대로 처리
    } else {
      // 1900년대로 처리
      year += Math.floor((currentYear - 100) / 100) * 100
    }

    // 결과를 콘솔에 출력
    // console.log(`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`
  } else {
    // console.log('유효한 형식의 숫자가 아닙니다.', data)
    return '19' + data
  }
}

/**
 * 데이터를 받아서 날짜 데이터 형식인지 판별
 * Safari/iOS 브라우저 호환성을 위해 날짜 형식을 정규화하여 처리
 *
 * @param {*} dateString - 날짜데이터
 * @returns {boolean}
 */
export function isValidDate(dateString) {
  if (typeof dateString !== 'string') return false

  const s = dateString.trim()
  // 구분자 통일: ., -, / 모두 허용
  const m = /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/.exec(s)
  if (!m) return false

  const year  = parseInt(m[1], 10)
  const month = parseInt(m[2], 10)
  const day   = parseInt(m[3], 10)

  if (year < 1900 || year > 2100) return false
  if (month < 1 || month > 12)    return false
  if (day < 1 || day > 31)        return false

  // 로컬 타임존 기준으로 생성 (UTC 파싱 이슈 회피)
  const d = new Date(year, month - 1, day)

  // 오버플로(2/30 -> 3/1 등) 방지용 정합성 체크
  return d.getFullYear() === year &&
         d.getMonth() === month - 1 &&
         d.getDate() === day
}

/**
 * 숫자데이터와 리턴한 소수점 자리수를 받아서 반올림후 리턴. 마지막 자리가 0이라면 삭제한다
 *
 * @param {*} number - 원본 숫자데이터 예)0.90123
 * @param {*} decimals - 리턴할 소수점 자리수 예)2
 * @returns {Number} - 예)0.9
 */
export function mwlRound (number, decimals = 2) {
  const roundedValue = Number(Math.round(number + 'e' + decimals) + 'e-' + decimals)
  const formattedValue = roundedValue % 1 === 0 ? Math.floor(roundedValue) : roundedValue.toFixed(decimals).replace(/\.?0+$/, '')
  return formattedValue.toString()
}

/**
 * 노화속도 표시용 반올림 함수
 * - 항상 소수점 둘째자리까지 표시
 * - 둘째자리로 반올림하여 표시
 * @param {number} number - 반올림할 숫자
 * @returns {string} - 포맷된 문자열 (항상 소수점 둘째자리까지)
 */
export function mwlRoundAgingRate (number) {
  if (number === null || number === undefined || isNaN(number)) {
    return '0.00'
  }
  
  const num = Number(number)
  
  // 둘째자리로 반올림하고 항상 둘째자리까지 표시
  const rounded = Math.round(num * 100) / 100
  
  return rounded.toFixed(2)  // 항상 1.00, 1.24 형태
}

/**
 * 상태값에 따른 색상을 반환하는 함수
 * @param {number} status - 상태값 (1: 좋음, 2: 관리, 3: 주의)
 * @returns {string} 색상 코드
 */
export function getColor (status) {
  switch (status) {
    case 1:
      return '#5ab651' // 좋음
    case 2:
      return '#f8b500' // 관리
    case 3:
      return '#e95371' // 주의
    default:
      return '#ccc'
  }
}

/**
 * 분석 결과 점수에 따른 상태를 반환하는 함수
 * @param {number} score - 점수
 * @param {string} type - 분석 타입 ('rfs', 'sh', 'musMass')
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의, 0: 기본값)
 */
export function getScoreStatus (score, type) {
  if (score === null || score === undefined) return 0
  
  switch (type) {
    case 'rfs': // 식사 관련 - 새로운 기준치
      if (score >= 64) return 1 // 좋음 (초록)
      if (score >= 49 && score < 64) return 2 // 관리 (노랑)
      if (score < 49) return 3 // 주의 (빨강)
      return 2 // 기본값은 관리
      
    case 'sh': // 수면 관련 - 새로운 기준치
      if (score >= 72) return 1 // 좋음 (초록)
      if (score < 72) return 3 // 주의 (빨강)
      return 0
      
    case 'musMass': // 운동 관련 - 새로운 기준치
      if (score >= 600) return 1 // 좋음 (초록)
      if (score >= 150 && score < 600) return 2 // 관리 (노랑)
      if (score < 150) return 3 // 주의 (빨강)
      return 0
      
    default:
      return 0
  }
}

/**
 * 분석 결과 점수에 따른 색상을 반환하는 함수
 * @param {number} score - 점수
 * @param {string} type - 분석 타입 ('rfs', 'sh', 'musMass')
 * @returns {string} 색상 코드
 */
export function getScoreColor (score, type) {
  const status = getScoreStatus(score, type)
  return getColor(status)
}

/**
 * 노화 억제 분석지수 상태 판정
 * @param {number} status - 노화 억제 분석지수 상태 (1: 좋음, 2: 관리, 3: 주의)
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의)
 */
export function getAgingInhibitionStatus(status) {
  if (status === null || status === undefined) return 2
  
  // status가 유효한 값(1, 2, 3)인지 확인
  if ([1, 2, 3].includes(status)) {
    return status
  }
  
  // 기본값: 관리
  return 2
}

/**
 * 만성질환 억제 분석지수 상태 판정
 * @param {number} status - 만성질환 억제 분석지수 상태 (1: 좋음, 2: 관리, 3: 주의)
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의)
 */
export function getDiseaseInhibitionStatus(status) {
  if (status === null || status === undefined) return 2
  
  // status가 유효한 값(1, 2, 3)인지 확인
  if ([1, 2, 3].includes(status)) {
    return status
  }
  
  // 기본값: 관리
  return 2
}

/**
 * 근육밸런스 분석지수 상태 판정
 * @param {number} status - 근육밸런스 분석지수 상태 (1: 좋음, 2: 관리, 3: 주의)
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의)
 */
export function getMuscleBalanceStatus(status) {
  if (status === null || status === undefined) return 2
  
  // status가 유효한 값(1, 2, 3)인지 확인
  if ([1, 2, 3].includes(status)) {
    return status
  }
  
  // 기본값: 관리
  return 2
}

/**
 * 아이템의 특정 키에 대한 상태 색상을 반환하는 함수
 * @param {object} item - 분석 결과 아이템
 * @param {string} key - 상태를 확인할 키
 * @returns {string} 색상 코드
 */
export function getStatusColor (item, key) {
  const status = item[key]?.status ?? null
  return getColor(status)
}

/**
 * 노화 속도에 따른 상태 판정
 * @param {number} agingRate - 노화 속도 (예: 0.8, 1.0, 1.2)
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의)
 */
export function getAgingRateStatus(agingRate) {
  if (agingRate === null || agingRate === undefined) return 2
  
  // 새로운 기준치: status = 1, 2, 3
  // 실제 status 값이 이미 계산되어 있다면 그 값을 사용
  if (typeof agingRate === 'object' && agingRate.status) {
    return agingRate.status
  }
  
  // 기존 로직 유지 (호환성)
  if (agingRate <= 0.9) return 1      // 좋음
  if (agingRate > 0.9 && agingRate < 1.1) return 2  // 관리
  if (agingRate >= 1.1) return 3      // 주의
  
  return 2 // 기본값은 관리
}

/**
 * 노화속도 영향을 준 요인 상태 판정
 * @param {object} ariStatus - 노화속도 영향 요인 상태 객체
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의)
 */
export function getAriStatusStatus(ariStatus) {
  if (!ariStatus || typeof ariStatus !== 'object') return 2
  
  // 실제 status 값이 이미 계산되어 있다면 그 값을 사용
  if (ariStatus.status !== undefined) {
    return ariStatus.status
  }
  
  // 기본값
  return 2
}

/**
 * 인체생리네트워크 영향을 준 요인 상태 판정
 * @param {object} hriStatus - 인체생리네트워크 영향 요인 상태 객체
 * @returns {number} 상태 (1: 좋음, 2: 관리, 3: 주의)
 */
export function getHriStatusStatus(hriStatus) {
  if (!hriStatus || typeof hriStatus !== 'object') return 2
  
  // 실제 status 값이 이미 계산되어 있다면 그 값을 사용
  if (hriStatus.status !== undefined) {
    return hriStatus.status
  }
  
  // 기본값
  return 2
}

/**
 * Datetimes 형식을 읽기 쉬운 날짜로 변환하는 함수
 * @param {string} datetimes - "20240207110856" 형식의 날짜 문자열
 * @returns {string} "2024-02-07 11:08" 형식으로 변환된 문자열
 */
export function formatDatetime (datetimes) {
  if (!datetimes) return '날짜 없음'
  
  try {
    // "20240207110856" 형식을 "2024-02-07 11:08" 형식으로 변환
    const year = datetimes.substring(0, 4)
    const month = datetimes.substring(4, 6)
    const day = datetimes.substring(6, 8)
    const hour = datetimes.substring(8, 10)
    const minute = datetimes.substring(10, 12)
    
    return `${year}-${month}-${day} ${hour}:${minute}`
  } catch (error) {
    return datetimes
  }
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
 * @returns {string} 오늘 날짜 문자열 (예: "2024-01-15")
 */
export function getTodayDateString () {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 숫자 필드들의 유효성을 검증하는 함수
 * @param {object} data - 검증할 데이터 객체
 * @param {array} fields - 검증할 필드명 배열
 * @returns {array} 유효하지 않은 필드명 배열
 */
export function validateNumericFields (data, fields) {
  return fields.filter(field => {
    const value = data[field]
    return value && isNaN(parseFloat(value))
  })
}

/**
 * iOS Safari vh 문제 해결을 위한 동적 --vh 변수 설정
 * 
 * iOS Safari에서 100vh가 실제 보이는 뷰포트 높이와 다른 문제를 해결합니다.
 * - iOS 15+ Safari: 주소창/툴바 영역 포함으로 인한 뷰포트 높이 불일치 해결
 * - visualViewport API 지원 브라우저: 정확한 보이는 영역 높이 사용
 * - 구형 브라우저: window.innerHeight fallback 사용
 * - 화면 회전 및 뷰포트 변경 시 자동 업데이트
 */
export function applyVHFallback() {
  try {
    // visualViewport API 지원 확인 (iOS Safari 13+, Chrome 61+)
    const vh = window.visualViewport?.height ?? window.innerHeight
    
    // --vh CSS 변수를 1vh 단위로 설정 (100vh = var(--vh) * 100)
    const vhUnit = vh * 0.01
    document.documentElement.style.setProperty('--vh', `${vhUnit}px`)
    
    // 디버그 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[VH Fallback] Updated --vh to ${vhUnit}px (total viewport: ${vh}px)`)
    }
  } catch (error) {
    // 에러 발생 시 기본값 설정
    console.warn('[VH Fallback] Error applying vh fallback:', error)
    document.documentElement.style.setProperty('--vh', '1vh')
  }
}

/**
 * VH 폴백 초기화 및 이벤트 리스너 등록
 * 앱 시작 시 한 번만 호출하여 전역적으로 vh 문제를 해결합니다.
 */
export function initVHFallback() {
  // 초기 실행
  applyVHFallback()
  
  // visualViewport API 지원 브라우저에서 뷰포트 변경 감지
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyVHFallback)
  }
  
  // 화면 회전 감지 (모든 브라우저 호환)
  window.addEventListener('orientationchange', () => {
    // orientationchange 이벤트는 실제 뷰포트 변경보다 빠를 수 있으므로 지연 실행
    setTimeout(applyVHFallback, 100)
  })
  
  // 윈도우 리사이즈 감지 (fallback)
  window.addEventListener('resize', applyVHFallback)
  
  // 페이지 포커스 시 재계산 (앱 전환 후 복귀 시)
  window.addEventListener('focus', applyVHFallback)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[VH Fallback] Initialized with event listeners')
  }
}


