export default {
  namespaced: true,
  state: () => ({
    accessible: null
  }),
  mutations: {
    SET_ACCESSIBLE (state, value) {
      state.accessible = value
    }
  },
  actions: {
    setAccessible ({ commit }, value) {
      commit('SET_ACCESSIBLE', value)
    }
  },
  getters: {
    getAccessible (state) {
      return state.accessible
    }
  }
}
