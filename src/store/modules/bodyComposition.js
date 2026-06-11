export default {
  namespaced: true,
  state: () => ({
    selectedItem: null
  }),
  mutations: {
    SET_SELECTED_ITEM (state, value) {
      state.selectedItem = value
    },
    CLEAR_SELECTED_ITEM (state) {
      state.selectedItem = null
    }
  },
  actions: {
    setSelectedItem ({ commit }, value) {
      commit('SET_SELECTED_ITEM', value)
    },
    clearSelectedItem ({ commit }) {
      commit('CLEAR_SELECTED_ITEM')
    }
  },
  getters: {
    getSelectedItem (state) {
      return state.selectedItem
    }
  }
} 