export const isEmpty = (data) => {
  return data === null || data === undefined || data.length === 0
}
export const changeOnlyNumber = (data) => {
  if (isEmpty(data)) {
    return data
  }

  let strData = String(data)

  if (strData.lastIndexOf('-') === 0) {
    strData = '0'
  }

  strData = strData.replaceAll(/[^0-9]/g, '')
  return Number(strData)
}

export const changeOnlyNumberAndMinus = (data) => {
  if (isEmpty(data)) {
    return data
  }

  let strData = String(data)
  strData = strData.replaceAll(/[^0-9\-]/g, '')

  if (strData.lastIndexOf('-') === 0) {
    return strData
  } else if (isNaN(Number(strData))) {
    return Number(0)
  } else {
    return Number(strData)
  }
}

export const changeOnlyDecimal = (data) => {
  if (isEmpty(data)) {
    return data
  }

  let strData = String(data)
  
  // 소수점이 여러 개 있는 경우 처리
  const parts = strData.split('.')
  if (parts.length > 2) {
    strData = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // 숫자와 소수점만 허용
  strData = strData.replace(/[^0-9.]/g, '')
  
  // 소수점이 하나만 있는지 확인
  const dotCount = (strData.match(/\./g) || []).length
  if (dotCount > 1) {
    const firstDotIndex = strData.indexOf('.')
    const lastDotIndex = strData.lastIndexOf('.')
    strData = strData.substring(0, firstDotIndex) + '.' + strData.substring(firstDotIndex + 1, lastDotIndex) + strData.substring(lastDotIndex + 1)
  }

  return strData
}
