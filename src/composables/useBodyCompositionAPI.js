import * as bodykeyApi from '@/apis/bodykey'
import * as checkupApi from '@/apis/checkup'
import * as logmeApi from '@/apis/logme'
import { formatDatetime, getTodayDateString } from '@/assets/js/common'
import { useI18n } from 'vue-i18n'

// API 호출 Composables
export function useBodyCompositionAPI() {
  const { t } = useI18n()
  // 바디키 데이터를 파싱하여 inbody 형식으로 변환하는 함수
  const parseBodyKeyDataToInbody = (bodyKeyData, basicsId) => {
    // datetimes를 yyyy-MM-dd 형식으로 변환
    const formatDatetimes = (datetimes) => {
      if (!datetimes) return null
      
      try {
        // "20240207110856" 형식을 "2024-02-07" 형식으로 변환
        const year = datetimes.substring(0, 4)
        const month = datetimes.substring(4, 6)
        const day = datetimes.substring(6, 8)
        
        return `${year}-${month}-${day}`
      } catch (error) {
        return null
      }
    }

    const result = {
      inbody: {
        basicsId: basicsId,
        connectType: "BODYKEY",
        surveyDate: formatDatetimes(bodyKeyData.datetimes),
        ht: parseFloat(bodyKeyData.ht) || 0,
        wt: parseFloat(bodyKeyData.wt) || 0,
        wbtBfMass: parseFloat(bodyKeyData.bfm) || 0,
        wbtBfPercent: parseFloat(bodyKeyData.pbf) || 0,
        wbtSmMass: parseFloat(bodyKeyData.smm) || 0,
        ramMass: parseFloat(bodyKeyData.lra) || 0,
        lamMass: parseFloat(bodyKeyData.lla) || 0,
        trkMass: parseFloat(bodyKeyData.lt) || 0,
        rlmMass: parseFloat(bodyKeyData.lrl) || 0,
        llmMass: parseFloat(bodyKeyData.lll) || 0,
        ramPercent: parseFloat(bodyKeyData.pilra) || 0,
        lamPercent: parseFloat(bodyKeyData.pilla) || 0,
        trkPercent: parseFloat(bodyKeyData.pilt) || 0,
        rlmPercent: parseFloat(bodyKeyData.pilrl) || 0,
        llmPercent: parseFloat(bodyKeyData.pilll) || 0
      }
    }
    
    return result
  }

  // 바디키 데이터 저장 (전체 플로우)
  const setBodyKeyCompositionData = async (bodyKeyData, analysisId, basicsId) => {
    try {
      // 1단계: 바디키 데이터 저장 API 호출
      const response = await bodykeyApi.setBodyKeyCompositionData(bodyKeyData)
      
      // 2단계: 바디키 데이터를 파싱하여 setInbodyTemporary 호출
      const inbodyData = parseBodyKeyDataToInbody(bodyKeyData, basicsId)
      
      const inbodyResponse = await checkupApi.setInbodyTemporary(inbodyData)
      
      // 3단계: updateCheckup 호출
      const updateResponse = await logmeApi.updateCheckup(analysisId)
      
      return { success: true, message: t('BodyCompositionAPI.success.bodyKeySaved') }
    } catch (error) {
      throw new Error(t('BodyCompositionAPI.error.bodyKeyProcessingFailed'))
    }
  }

  // 기존 체성분 데이터 저장
  const setExistingBodyCompositionData = async (data, basicsId, analysisId) => {
    // surveyDate를 yyyy-MM-dd 형식으로 변환
    const formatSurveyDate = (dateString) => {
      if (!dateString) return null
      
      const datePart = dateString.split(' ')[0]
      return datePart.replace(/\./g, '-')
    }

    const inbodyData = {
      inbody: {
        basicsId: basicsId,
        connectType: data.connectType,
        surveyDate: formatSurveyDate(data.surveyDate),
        ht: data.ht,
        wt: data.wt,
        wbtBfMass: data.wbtBfMass,
        wbtBfPercent: data.wbtBfPercent,
        wbtSmMass: data.wbtSmMass,
        ramMass: data.ramMass,
        ramPercent: data.ramPercent,
        lamMass: data.lamMass,
        lamPercent: data.lamPercent,
        rlmMass: data.rlmMass,
        rlmPercent: data.rlmPercent,
        llmMass: data.llmMass,
        llmPercent: data.llmPercent,
        trkMass: data.trkMass,
        trkPercent: data.trkPercent
      }
    }
    
    try {
      // 1단계: setInbodyTemporary 호출
      const response = await checkupApi.setInbodyTemporary(inbodyData)
      
      if (response.status === "SUCCESS") {
        // 2단계: updateCheckup 호출
        const updateResponse = await logmeApi.updateCheckup(analysisId)
        
        return { success: true, message: t('BodyCompositionAPI.success.bodyCompositionSaved') }
      } else {
        throw new Error(t('BodyCompositionAPI.error.bodyCompositionSaveFailed'))
      }
    } catch (error) {
      throw new Error(t('BodyCompositionAPI.error.bodyCompositionProcessingFailed'))
    }
  }

  // 직접 입력 데이터 저장
  const setCustomBodyCompositionData = async (data, basicsId, analysisId) => {
    
    // setCustomCompositionData 호출
    const customData = {
      basicsId: basicsId,
      createdDate: data.surveyDate,
      ...data
    }
    
    try {
      const customResponse = await bodykeyApi.setCustomCompositionData(customData)
      
      if (customResponse.status === 'SUCCESS') {
        // setCustomCompositionData 성공 후 setInbodyTemporary 호출
        const inbodyData = {
          inbody: {
            basicsId: basicsId,
            connectType: "CUSTOM",
            surveyDate: data.surveyDate,  // 측정일 추가
            ht: data.ht,
            wt: data.wt,
            wbtBfMass: data.wbtBfMass,
            wbtBfPercent: data.wbtBfPercent,
            wbtSmMass: data.wbtSmMass,
            ramMass: data.ramMass,
            ramPercent: data.ramPercent,
            lamMass: data.lamMass,
            lamPercent: data.lamPercent,
            rlmMass: data.rlmMass,
            rlmPercent: data.rlmPercent,
            llmMass: data.llmMass,
            llmPercent: data.llmPercent,
            trkMass: data.trkMass,
            trkPercent: data.trkPercent
          }
        }
        const inbodyResponse = await checkupApi.setInbodyTemporary(inbodyData)
        
        if (inbodyResponse.status === "SUCCESS") {
          // updateCheckup 호출
          const updateResponse = await logmeApi.updateCheckup(analysisId)
          
          return { success: true, message: t('BodyCompositionAPI.success.bodyCompositionSaved') }
        } else {
          throw new Error(t('BodyCompositionAPI.error.setInbodyTemporaryFailed', { response: JSON.stringify(inbodyResponse) }))
        }
      } else {
        throw new Error(t('BodyCompositionAPI.error.customDataSaveFailed', { response: JSON.stringify(customResponse) }))
      }
    } catch (error) {
      console.error('setCustomBodyCompositionData 에러 상세:', error)
      throw new Error(t('BodyCompositionAPI.error.customDataProcessingFailed', { message: error.message }))
    }
  }

  // 바디키 로그인 및 데이터 조회
  const getBodyKeyData = async (bodyKeyId, bodyKeyPassword) => {
    const response = await bodykeyApi.getBodykeyData({
      BodyKeyID: bodyKeyId,
      BodyKeyPW: bodyKeyPassword
    })
    
    return response.data?.Data || []
  }

  // 기존 체성분 데이터 조회
  const getBodyCompositionData = async (connectTypes) => {
    const response = await bodykeyApi.getBodyCompositionData(connectTypes)
    
    if (response.data && Array.isArray(response.data)) {
      return response.data
    } else {
      return []
    }
  }

  // 특정 체성분 정보 조회
  const getBodyCompositionById = async (id) => {
    try {
      const response = await bodykeyApi.getBodyCompositionById(id)
      return response.data
    } catch (error) {
      console.error('체성분 정보 조회 실패:', error)
      throw new Error(t('BodyCompositionAPI.error.bodyCompositionInfoFailed'))
    }
  }

  return {
    // API 호출 함수들
    setBodyKeyCompositionData,
    setExistingBodyCompositionData,
    setCustomBodyCompositionData,
    getBodyKeyData,
    getBodyCompositionData,
    getBodyCompositionById,
    
    // 유틸리티 함수들
    parseBodyKeyDataToInbody,
    formatDatetime,
    getTodayDateString
  }
} 