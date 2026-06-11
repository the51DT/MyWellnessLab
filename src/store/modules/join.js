export default {
  state: () => ({
    joinInfo: {
      accountTypeCode: '',
      customerId: '',
      dateOfBirth: '',
      defaultAddress: {},
      email: '',
      gender: '',
      id: 0,
      levelCode: '',
      levelName: '',
      mobileArea: '',
      mobileNumber: '',
      name: '',
      pinCode: '',
      termsAgree: [],
      uid: ''
    },
    isPhoneCertification: false,
    isShowJoinAlert: false
  }),
  mutations: {
    SET_JOIN_INFO (state, value) {
      state.joinInfo = value
    },
    INIT_JOIN_INFO (state) {
      state.joinInfo = {
        accountTypeCode: '',
        customerId: '',
        dateOfBirth: '',
        defaultAddress: {},
        email: '',
        gender: '',
        id: 0,
        levelCode: '',
        levelName: '',
        mobileArea: '',
        mobileNumber: '',
        name: '',
        pinCode: '',
        termsAgree: [],
        uid: ''
      }
      state.isPhoneCertification = false
    },
    CHANGE_PHONE_CERTIFICATION (state, value) {
      state.isPhoneCertification = value
    },
    SET_IS_SHOW_JOIN_ALERT (state, value) {
      state.isShowJoinAlert = value
    }
  },
  actions: {
    setJoinInfo ({ commit, state }, value) {
      commit('SET_JOIN_INFO', {
        ...state.joinInfo,
        ...value
      })
    },
    initJoinInfo ({ commit }) {
      commit('INIT_JOIN_INFO')
    },
    changePhoneCertification ({ commit }, value) {
      commit('CHANGE_PHONE_CERTIFICATION', value)
    },
    setIsShowJoinAlert ({ commit }, value) {
      commit('SET_IS_SHOW_JOIN_ALERT', value)
    }
  },
  getters: {
    getJoinInfo (state) {
      return state.joinInfo
    },
    getIsPhoneCertification (state) {
      return state.isPhoneCertification
    },
    getIsShowJoinAlert (state) {
      return state.isShowJoinAlert
    }
  }
}
