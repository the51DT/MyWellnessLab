// import { IS_SIMPLE_MODE } from "@/api/interceptors";
import { VAR_EXIST_REPORT, VAR_MAX_INPUT_PROGRESS } from '@/assets/js/chart/consts'
const IS_SIMPLE_MODE = false

/**
 * progress 계산
 * @param {*} progress
 * @returns {number}
 */
export const getInputProgress = (progress) => {
  console.log('getInputProgress prev', progress)

  const record = parseInt(progress / 1000)
  progress -= record * 1000

  if (progress >= VAR_EXIST_REPORT) {
    return progress - VAR_EXIST_REPORT
  }

  return progress
}

/**
 * 리포트가 존재하는지 확인
 * @param {*} progress
 * @returns {boolean}
 */
export const existReport = (progress) => {
  const record = parseInt(progress / 1000)
  console.log('existReport', record)
  const calculatedProgress = progress - record * 1000
  console.log('existReport', calculatedProgress, VAR_EXIST_REPORT)
  if (calculatedProgress >= VAR_EXIST_REPORT) return true
  return false
}

/**
 * 지질대사 상태값 조히
 * @param {*} progress
 * @returns {number}
 */
export const getScrapingBloodState = (progress) => {
  // 1 : 지질대사 없고 입력 안한경우
  // 2 : 지질대사 없고 입력한 경우
  // 3 : 지질대사 있는 경우
  console.log('getScrapingBloodState', progress)
  return parseInt(progress / 1000)
}

/**
 * MaxInputProgress
 * @returns {number}
 */
export const getMaxInputProgress = () => {
  let maxInputProgress = VAR_MAX_INPUT_PROGRESS
  if (IS_SIMPLE_MODE) maxInputProgress = maxInputProgress - 3 // 23;
  return maxInputProgress
}

/**
 * InputProgress
 * @param {*} currentProgress
 * @param {*} targetProgress
 * @returns {number}
 */
export const getCalculatedInputProgress = (currentProgress, targetProgress) => {
  const record = parseInt(currentProgress / 1000)

  const target = parseInt(targetProgress / 1000)

  let calculatedProgress = 0

  if (target > 0) {
    targetProgress -= target * 1000
  }
  if (target > 0 && record > 0) {
    calculatedProgress = targetProgress + target * 1000
  } else if (target > 0) {
    calculatedProgress = record * 1000 + targetProgress + target * 1000
  } else {
    calculatedProgress = record * 1000 + targetProgress
  }

  return calculatedProgress
}

/**
 * 리포트가 존재 하는지 체크
 * @param {*} progress
 * @returns {boolean}
 */
export const existReportList = (progress) => {
  if (progress >= VAR_EXIST_REPORT) return true
  return false
}

/**
 * 날짜 형식 반환
 * @param {*} date
 * @returns {string}
 */
export const getCheckDateStr = (date) => {
  console.log('date', date.toString())
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const day = date.getDate()
  return `${year}-${month >= 10 ? month : '0' + month}-${
    day >= 10 ? day : '0' + day
  }`
}

/**
 * date형식을 splitter를 사용해서 조합
 * @param {string} date
 * @param {string} splitter
 * @returns {string}
 */
export const convertDateToYYYYMMDD = (date, splitter) => {
  date = date.replaceAll('-', '')
  const year = date.substr(0, 4)
  const month = date.substr(4, 2)
  const day = date.substr(6, 2)
  return year + splitter + month + splitter + day
}

/**
 * 모바일인지 확인
 * @returns {boolean}
 */
export const isMobile = () => {
  // console.log("ismobile", window.innerWidth);
  if (window.innerWidth < 768) return true
  return false
}

/**
 * 태블릿인지 확인
 * @returns {boolean}
 */
export const isTablet = () => {
  if (window.innerWidth < 1024 && window.innerWidth >= 768) return true
  return false
}
/**
 * 무계중심 구하기
 * @param {Array[number, number]} points
 * @returns {Array[number, number]}
 */
export const centroid = (points) => {
  const centroid = [0, 0]

  for (let i = 0; i < points.length; i++) {
    centroid[0] += points[i][0]
    centroid[1] += points[i][1]
  }

  const totalPoints = points.length
  centroid[0] = centroid[0] / totalPoints
  centroid[1] = centroid[1] / totalPoints

  return centroid
}

/**
 * 백터를 계산한다.
 * @param {Array[number, number]} point1
 * @param {Array[number, number]} point2
 * @returns {Array[number, number]}
 */
export const getVector = (point1, point2) => {
  const x = point1[0] - point2[0]
  const y = point1[1] - point2[1]
  const mag = Math.sqrt(x * x + y * y)
  return [(point1[0] - point2[0]) / mag, (point1[1] - point2[1]) / mag]
}

/**
 * start, end 사이의 랜덤한 수를 반환
 * @param {*} start
 * @param {*} end
 * @returns {number}
 */
export const randomRange = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1) + start)
}

/**
 * value가 최소값과 최대값 사이에 있는지 판별
 * @param {*} value
 * @param {*} min
 * @param {*} max
 * @returns {boolean}
 */
export const isInsideValue = (value, min, max) => {
  console.log('isInsideValue', value, min, max)
  if (value >= min && value <= max) return true
  return false
}

/**
 * 나이계산
 * @param {*} birthDate
 * @param {*} date
 * @returns {number}
 */
export const getAgeFromYear = (birthDate, date) => {
  // this.$store.state.userInfo.birth_date
  console.log('getAgeFromYear birth', birthDate)
  console.log('getAgeFromYear date', date)
  const birth = new Date(birthDate)
  const today = new Date(date.substr(0, 10))
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  console.log('age', age, birth, today, date)
  return age
}

/**
 * 숫자를 세자리 숫자를 기준으로 ',' 붙여 변환한다.
 * @param {number} num
 * @returns {string}
 */
export const numberWithComma = (num) => {
  const regexp = /\B(?=(\d{3})+(?!\d))/g
  return num.toString().replace(regexp, ',')
}

/**
 * 사용자의 디바이스가 aos 인지 ios인지 판별
 * @param {*} platform
 * @returns {boolean}
 */
export const isPlatform = (platform) => {
  const varUA = navigator.userAgent.toLowerCase() // userAgent 값 얻기

  if (varUA.indexOf('android') > -1) {
    // 안드로이드
    return platform === 'android'
  } else if (
    varUA.indexOf('iphone') > -1 ||
    varUA.indexOf('ipad') > -1 ||
    varUA.indexOf('ipod') > -1
  ) {
    // IOS
    return platform === 'ios'
  } else {
    // 아이폰, 안드로이드 외
    return false
  }
}

/**
 * 데이트를 받아서 년월일 형식으로 반환한다.
 * @param {(number|string)} dateStr
 * @returns {string}
 */
export const getDateStr = (dateStr) => {
  const yyyyMMdd = String(dateStr)
  const sYear = yyyyMMdd.substring(0, 4)
  const sMonth = yyyyMMdd.substring(5, 7)
  const sDate = yyyyMMdd.substring(8, 10)

  // var date = new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));

  // return sYear + "-" + sMonth + "-" + sDate;

  // var week = ["일", "월", "화", "수", "목", "금", "토"];
  return sYear + '년 ' + sMonth + '월 ' + sDate + '일'
}

/**
 *
 * delay밀리세컨드 만큼 지연 시킴
 * @param {number} delay
 * @returns {Promise<void>}
 */
export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay))
