import * as checkupApi from '@/apis/checkup'

export default {
  namespaced: true,
  state: () => ({
    nhisData: {
      name: '', // 성명
      birthDate: '', // 생년월일
      age: 0, // 연령
      checkDate: '', // 검진일
      ht: '', // 신장
      wt: '', // 체중
      wc: '', // 허리둘레
      bmi: '', // 체질량지수
      sbp: '', // 수축기혈압
      dbp: '', // 이완기혈압
      glu: '', // 공복혈당
      tc: '', // 총 콜레스테롤
      ldl: '', // 저밀도 콜레스테롤
      hdl: '', // 고밀도 콜레스테롤
      tg: '', // 중성지방
      got: '', // 간 아스파테이크 전이효소
      gpt: '', // 간 알라닌 전이효소
      crea: '', // 혈청크레아틴
      hb: '' // 혈색소
    },
    healthDataType: '',
    analysisType: '',
    basicsId: null,
    checkDate: '',
    resultId: null,
    termsCheck: {
      required: false,
      nonRequired: false
    },
    healthInterest: null,
    bodyKeyDataList: [], // 바디키 데이터 리스트
    selectedBodyKeyData: null, // 선택된 바디키 데이터
  }),
  mutations: {
    SET_NHIS_DATA (state, value) {
      state.nhisData = value
    },
    SET_HEALTH_DATA_TYPE (state, value) {
      state.healthDataType = value
    },
    SET_ANALYSIS_TYPE (state, value) {
      state.analysisType = value
    },
    SET_BASICS_ID (state, value) {
      state.basicsId = value
    },
    SET_CHECK_DATE (state, value) {
      state.checkDate = value
    },
    SET_RESULT_ID (state, value) {
      state.resultId = value
    },
    SET_BODY_KEY_DATA_LIST (state, value) {
      state.bodyKeyDataList = value
    },
    SET_SELECTED_BODY_KEY_DATA (state, value) {
      state.selectedBodyKeyData = value
    },
    INIT (state) {
      state.nhisData = {
        name: '', // 성명
        birthDate: '', // 생년월일
        age: null, // 연령
        checkDate: '', // 검진일
        ht: '', // 신장
        wt: '', // 체중
        wc: '', // 허리둘레
        bmi: '', // 체질량지수
        sbp: '', // 수축기혈압
        dbp: '', // 이완기혈압
        glu: '', // 공복혈당
        tc: '', // 총 콜레스테롤
        ldl: '', // 저밀도 콜레스테롤
        hdl: '', // 고밀도 콜레스테롤
        tg: '', // 중성지방
        got: '', // 간 아스파테이크 전이효소
        gpt: '', // 간 알라닌 전이효소
        crea: '', // 혈청크레아틴
        hb: '' // 혈색소
      }
      state.healthDataType = ''
      state.basicsId = null
      state.resultId = null
      state.bodyKeyDataList = []
      state.selectedBodyKeyData = null
    },
    SET_TERMS_CHECK (state, value) {
      state.termsCheck = value
    },
    SET_HEALTH_INTEREST (state, value) {
      state.healthInterest = value
    }
  },
  actions: {
    setNhisData ({ commit }, value) {
      commit('SET_NHIS_DATA', value)
    },
    setHealthDataType ({ commit }, value) {
      commit('SET_HEALTH_DATA_TYPE', value)
    },
    setAnalysisType ({ commit }, value) {
      commit('SET_ANALYSIS_TYPE', value)
    },
    setBasicsId ({ commit }, value) {
      commit('SET_BASICS_ID', value)
    },
    setCheckDate ({ commit }, value) {
      commit('SET_CHECK_DATE', value)
    },
    setResultId ({ commit }, value) {
      commit('SET_RESULT_ID', value)
    },
    setBodyKeyDataList ({ commit }, value) {
      commit('SET_BODY_KEY_DATA_LIST', value)
    },
    setSelectedBodyKeyData ({ commit }, value) {
      commit('SET_SELECTED_BODY_KEY_DATA', value)
    },
    init ({ commit }) {
      commit('INIT')
    },
    setTermsCheck ({ commit }, value) {
      commit('SET_TERMS_CHECK', value)
    },
    // ✅ healthInterest를 API로 불러오는 action
    async fetchHealthInterest({ commit, state }, basicsId) {
      try {
        const response = await checkupApi.getInterestHealthTemporary(basicsId)
        commit('SET_HEALTH_INTEREST', response.data.healthInterest)
        return response.data.healthInterest
      } catch (e) {
        console.error('Failed to fetch healthInterest', e)
        return null
      }
    }
  },
  getters: {
    getNhisData (state) {
      return state.nhisData
    },
    getHealthDataType (state) {
      return state.healthDataType
    },
    getAnalysisType (state) {
      return state.analysisType
    },
    getBasicsId (state) {
      return state.basicsId
    },
    getCheckDate (state) {
      return state.checkDate
    },
    getResultId (state) {
      return state.resultId
    },
    getTermsCheck (state) {
      return state.termsCheck
    },
    getHealthInterest (state) {
      return state.healthInterest
    },
    getSelectedBodyKeyData (state) {
      return state.selectedBodyKeyData
    },
    getBodyKeyDataList (state) {
      return state.bodyKeyDataList
    }
  }
}
