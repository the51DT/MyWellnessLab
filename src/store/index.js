import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

// modules
import checkup from './modules/checkup'
import analyze from './modules/analyze'
import join from './modules/join'
import system from './modules/system'
import user from './modules/user'
import order from './modules/order'
import bodyComposition from './modules/bodyComposition'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  modules: ['checkup', 'analyze', 'system', 'user', 'join', 'order', 'bodyComposition']
})

export default createStore({
  plugins: [vuexLocal.plugin],
  modules: {
    checkup,
    analyze,
    join,
    system,
    user,
    order,
    bodyComposition
  }
})
