import html2canvas from 'html2canvas'

/**
 * 노화속도요인 항목
 */
export const nameObj = {
  WC: {
    name: '허리둘레',
    idx: 1
  },
  BMI: {
    name: '체질량지수',
    idx: 2
  },
  SBP: {
    name: '수축기 혈압',
    idx: 3
  },
  DBP: {
    name: '이완기 혈압',
    idx: 4
  },
  GLU: {
    name: '공복혈당',
    idx: 5
  },
  TC: {
    name: '총 콜레스테롤',
    idx: 6
  },
  LDL: {
    name: '저밀도 콜레스테롤',
    idx: 7
  },
  HDL: {
    name: '고밀도 콜레스테롤',
    idx: 8
  },
  TG: {
    name: '중성지방',
    idx: 9
  },
  GOT: {
    name: '아스파테이트 아미노전이효소',
    idx: 10
  },
  GPT: {
    name: '알라닌 아미노 전이효소',
    idx: 11
  },
  HB: {
    name: '혈색소',
    idx: 12
  },
  CREA: {
    name: '혈청크레아티닌',
    idx: 13
  },
  smok_dur: {
    name: '흡연기간',
    idx: 14
  },
  pack_year: {
    name: '담배 소비량',
    idx: 15
  },
  sleep_time: {
    name: '수면시간',
    idx: 16
  },
  MET: {
    name: '활동량',
    idx: 17
  },
  drink_amt: {
    name: '음주량',
    idx: 18
  },
  EQ5D: {
    name: '삶의 질',
    idx: 19
  }
}

/**
 * 노화 속도 용인 바 차트 타입 리턴
 * @param {*} key - 노화 속도 요인 키
 * @returns {string} - normal or normal-reverse or reverse or ''
 */
export const getBarType = (key) => {
  switch (key) {
    case 'SBP':
    case 'DBP':
    case 'GLU':
    case 'TG':
    case 'TC':
    case 'LDL':
    case 'GOT':
    case 'GPT':
    case 'WC':
    case 'drink_amt':
    case 'smok_dur':
      return 'normal'
    case 'MET':
    case 'HDL':
      return 'normal-reverse'
    case 'EQ5D':
    case 'sleep_time':
      return 'half'
    case 'pack_year':
      return 'half2'
    case 'BMI':
    case 'HB':
    case 'CREA':
      return 'reverse'
    default:
      return ''
  }
}

/**
 * 분석결과 리포트 팝업 열기
 */
export const exportToPDF = async () => {
  window.open('/analyze/report', '_blank')
}
/**
 * 요소를 받아서 이미지로 리턴
 * @param {*} el - element
 * @param {number} renderPage - page number
 * @param {Function} callback
 * @returns {HTMLImageElement} - 이미지
 */
export const convertToPDF = async (el, renderPage, callback) => {
  let pixelRatio = window.devicePixelRatio * 2

  if (/iPhone|iPod/i.test(navigator.userAgent)) {
    pixelRatio = window.devicePixelRatio
  }

  if (window.devicePixelRatio < 2) {
    pixelRatio = 4
  }

  const canvasOptions = {
    allowTaint: true,
    useCORS: true,
    scale: pixelRatio,
    letterRendering: true,
    logging: false,
    skipAutoScale: true,
    skipFonts: false,
    removeContainer: true,
    foreignObjectRendering: false
  }

  return await html2canvas(el, canvasOptions).then(async (canvas) => {
    const imgData = canvas.toDataURL('image/jpeg')

    // pdf 저장 후 캔버스 초기화
    canvas.width = 0
    canvas.height = 0
    canvas.remove()
    canvas = null

    callback(renderPage + 1)

    return imgData
  })
    .catch((error) => {
      console.log('canvas error!!', error)
    })
}
