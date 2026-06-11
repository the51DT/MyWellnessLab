export default {
  namespaced: true,
  state: () => ({
    detail: null,
    inhibitionAnalysisDetail: null,
    analysisSendData: null,
    healthLightParams: undefined,
    currentSection: undefined
  }),
  mutations: {
    SET_DETAIL (state, value) {
      state.detail = value
    },
    SET_INHIBITION_ANALYZSIS_DETAIL (state, value) {
      state.inhibitionAnalysisDetail = value
    },

    SET_ANALYSIS_SEND_DATA (state, value) {
      state.analysisSendData = value
    },
    SET_HEALTH_LIGHT_PARAMS (state, value) {
      state.healthLightParams = value
    },
    SET_CURRENT_SECTION (state, value) {
      state.currentSection = value
    }
  },
  actions: {
    setDetail ({ commit }, value) {
      commit('SET_DETAIL', value)
    },
    setInhibitionAnalysisDetail ({ commit }, value) {
      commit('SET_INHIBITION_ANALYZSIS_DETAIL', value)
    },

    setAnalysisSendData ({ commit }, value) {
      commit('SET_ANALYSIS_SEND_DATA', value)
    },
    setHealthLightParams ({ commit }, value) {
      commit('SET_HEALTH_LIGHT_PARAMS', value)
    },
    setCurrentSection ({ commit }, value) {
      commit('SET_CURRENT_SECTION', value)
    }
  },
  getters: {
    getDetail (state) {
      return state.detail
    },
    getInhibitionAnalysisDetail (state) {
      return state.inhibitionAnalysisDetail
    },

    getAnalysisSendData (state) {
      return state.analysisSendData
    },
    getHealthLightParams (state) {
      return state.healthLightParams
    },
    getCurrentSection (state) {
      return state.currentSection
    }

  }
}
