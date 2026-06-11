import baseHttp from '@/utils/http/base'

// 임시저장 공통정보 조회
export const getCommonInfo = (analysisType) => {
  const type = analysisType || 'normal'
  return baseHttp.get(`/v1/api/user/survey/common-info/temporary/${type}`)
}
// 임시저장 설문 전체삭제
export const deleteCheckup = (id) => {
  return baseHttp.delete(`/v1/api/user/survey/common-info/temporary/${id}`)
}
// 건강보험공단 검진데이터 조회
export const getNhisInfo = (id) => {
  return baseHttp.get(`/v1/api/user/survey/common-info/temporary/${id}/nhis-data`)
}

// 임시저장 기본검사 조회
export const getBasicsTemporary = (id) => {
  return baseHttp.get(`/v1/api/user/survey/basics/temporary/${id}`)
}
// 임시저장 기본검사 등록
export const setBasicsTemporary = (analysisType, thirdPartyAgree, data) => {
  return baseHttp.post(`/v1/api/user/survey/basics/temporary/${analysisType}/third-party-agree/${thirdPartyAgree}`, data)
}
// 임시저장 기본검사 수정
export const updateBasicsTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/basics/temporary', data)
}

// 임시저장 혈액검사 조회
export const getBloodTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/blood/temporary/${basicsId}`)
}
// 임시저장 혈액검사 등록
export const setBloodTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/blood/temporary', data)
}
// 임시저장 혈액검사 수정
export const updateBloodTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/blood/temporary', data)
}

// 임시저장 관심 건강분야 검사 조회
export const getInterestHealthTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/health-interest/temporary/${basicsId}`)
}
// 임시저장 관심 건강분야 검사 등록
export const setInterestHealthTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/health-interest/temporary', data)
}
// 임시저장 관심 건강분야 검사 수정
export const updateInterestHealthTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/health-interest/temporary', data)
}

// 임시저장 기억 검사 조회
export const getMemoryTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/memory/temporary/${basicsId}`)
}
// 임시저장 기억 검사 등록
export const setMemoryTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/memory/temporary', data)
}
// 임시저장 기억 검사 수정
export const updateMemoryTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/memory/temporary', data)
}

// 임시저장 눈 검사 조회
export const getEyeTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/eye/temporary/${basicsId}`)
}
// 임시저장 눈 검사 등록
export const setEyeTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/eye/temporary', data)
}
// 임시저장 눈 검사 수정
export const updateEyeTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/eye/temporary', data)
}

// 임시저장 코 과민반응 검사 조회
export const getNoseTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/nose-hypersensitivity/temporary/${basicsId}`)
}
// 임시저장 코 과민반응 검사 등록
export const setNoseTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/nose-hypersensitivity/temporary', data)
}
// 임시저장 코 과민반응 검사 수정
export const updateNoseTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/nose-hypersensitivity/temporary', data)
}

// 임시저장 위 검사 조회
export const getStomachTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/stomach/temporary/${basicsId}`)
}
// 임시저장 위 검사 등록
export const setStomachTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/stomach/temporary', data)
}
// 임시저장 위 검사 수정
export const updateStomachTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/stomach/temporary', data)
}

// 임서저장 장 검사 조회
export const getIntestineTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/intestine/temporary/${basicsId}`)
}
// 임서저장 장 검사 등록
export const setIntestineTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/intestine/temporary', data)
}
// 임서저장 장 검사 수정
export const updateIntestineTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/intestine/temporary', data)
}

// 임시저장 관절, 뼈 검사 조회
export const getJoinAndBoneTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/joint-bone/temporary/${basicsId}`)
}
// 임시저장 관절, 뼈 검사 등록
export const setJoinAndBoneTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/joint-bone/temporary', data)
}
// 임시저장 관절, 뼈 검사 수정
export const updateJoinAndBoneTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/joint-bone/temporary', data)
}

// 임서저장 면역 검사 조회
export const getImmunityTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/immunity/temporary/${basicsId}`)
}
// 임서저장 면역 검사 등록
export const setImmunityTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/immunity/temporary', data)
}
// 임서저장 면역 검사 수정
export const updateImmunityTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/immunity/temporary', data)
}

// 임시저장 갱년기 검사 조회
export const getMenopauseTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/menopause/temporary/${basicsId}`)
}
// 임시저장 갱년기 검사 등록
export const setMenopauseTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/menopause/temporary', data)
}
// 임시저장 갱년기 검사 수정
export const updateMenopauseTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/menopause/temporary', data)
}

// 임시저장 전립선 검사 조회
export const getProstateTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/prostate/temporary/${basicsId}`)
}
// 임시저장 전립선 검사 등록
export const setProstateTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/prostate/temporary', data)
}
// 임시저장 전립선 검사 수정
export const updateProstateTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/prostate/temporary', data)
}

// 임시저장 월경 검사 조회
export const getMenstrualTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/menstrual/temporary/${basicsId}`)
}
// 임시저장 월경 검사 등록
export const setMenstrualTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/menstrual/temporary', data)
}
// 임시저장 월경 검사 수정
export const updateMenstrualTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/menstrual/temporary', data)
}

// 임시저장 삶의질 검사 조회
export const getLifeTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/perceived-stress/temporary/${basicsId}`)
}
// 임시저장 삶의질 검사 등록
export const setLifeTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/perceived-stress/temporary', data)
}
// 임시저장 삶의질 검사 수정
export const updateLifeTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/perceived-stress/temporary', data)
}

// 임시저장 운동습관 검사 조회
export const getPhysicalTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/physical-activity/temporary/${basicsId}`)
}
// 임시저장 운동습관 검사 등록
export const setPhysicalTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/physical-activity/temporary', data)
}
// 임시저장 운동습관 검사 수정
export const updatePhysicalTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/physical-activity/temporary', data)
}

// 임시저장 음주,흡연,수면,물섭취 검사 조회
export const getFourPowersTemporary = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/four-powers/temporary/${basicsId}`)
}
// 임시저장 음주,흡연,수면,물섭취 검사 등록
export const setFourPowersTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/four-powers/temporary', data)
}
// 임시저장 음주,흡연,수면,물섭취 검사 수정
export const updateFourPowersTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/four-powers/temporary', data)
}

/**
 * 복약 검사 조회(임시,종료)
 * @param {number} basicsId - 기본검사 일련번호
 * @param {string} stepType - 단계 타입 (TEMP: 임시저장, DONE: 정식), 기본값: TEMP
 * @returns {Promise} 복약 검사 데이터
 */
export const getDrugTemporary = (basicsId, stepType = 'TEMP') => {
  return baseHttp.get(`/v1/api/user/survey/drug/temporary/${basicsId}`, {
    params: { stepType }
  })
}
// 임시저장 복약 검사 등록
export const setDrugTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/drug/temporary', data)
}
// 임시저장 복약 검사 수정
export const updateDrugTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/drug/temporary', data)
}

// 임시저장 식이 검사 조회
export const getDqTemporary  = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/dq/temporary/${basicsId}`)
}
// 임시저장 식이 검사 등록
export const setDqTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/dq/temporary', data)
}
// 임시저장 식이 검사 수정
export const updateDqTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/dq/temporary', data)
}

// 임시저장 수면 검사 조회
export const getShTemporary  = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/sh/temporary/${basicsId}`)
}
// 임시저장 수면 검사 등록
export const setShTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/sh/temporary', data)
}
// 임시저장 수면 검사 수정
export const updateShTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/sh/temporary', data)
}

// 임시저장 체성분 조회
export const getInbodyTemporary  = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/inbody/temporary/${basicsId}`)
}
// 임시저장 체성분 등록
export const setInbodyTemporary = (data) => {
  return baseHttp.post('/v1/api/user/survey/inbody/temporary', data)
}
// 임시저장 체성분 수정
export const updateInbodyTemporary = (data) => {
  return baseHttp.put('/v1/api/user/survey/inbody/temporary', data)
}
// 임시저장 체성분 삭제
export const deleteInbodyTemporary = (id) => {
  return baseHttp.delete(`/v1/api/user/survey/inbody/temporary/${id}`)
}

// 체성분 조회
export const getInbodyDone  = (basicsId) => {
  return baseHttp.get(`/v1/api/user/survey/inbody/done/${basicsId}`)
}