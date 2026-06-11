export default {
  state: () => ({
    isPc: false,
    toastMessage: ''
  }),
  mutations: {
    SET_IS_PC (state, value) {
      state.isPc = value
    },
    SET_TOAST_MESSAGE (state, value) {
      state.toastMessage = value
    }
  },
  actions: {
    setIsPc ({ commit }, value) {
      commit('SET_IS_PC', value)
    },
    showToast ({ commit }, value) {
      commit('SET_TOAST_MESSAGE', value)

      setTimeout(() => {
        commit('SET_TOAST_MESSAGE', '')
      }, 2000)
    }
  },
  getters: {
    isLogin (state, getters, rooteState) {
      return !!rooteState.user.token
    },
    getIsPc (state) {
      return state.isPc
    },
    isShowToast (state) {
      return !!state.toastMessage
    },
    getToastMessage (state) {
      return state.toastMessage
    }
  }
}
