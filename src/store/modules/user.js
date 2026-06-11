import { getAmwayAuthorize } from '@/apis/login'
import { ACCESS_CONTROL_TYPE } from '@/utils/commonCode'

// refreshAmwaySession 함수 import
const refreshAmwaySession = async () => {
  return new Promise((resolve, reject) => {
    const amwayUrl = import.meta.env.VITE_AMWAY_URL
    const keepSessionUrl = `${amwayUrl}/account/keepSession?SiteId=LOGME`

    // 숨겨진 iframe 생성
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.width = '200px'
    iframe.style.height = '50px'
    iframe.src = keepSessionUrl

    // iframe 로드 완료 시 resolve
    iframe.onload = () => {
      document.body.removeChild(iframe)
      resolve()
    }

    // iframe 에러 시 reject
    iframe.onerror = () => {
      document.body.removeChild(iframe)
      reject(new Error('세션 갱신 실패'))
    }

    // iframe을 DOM에 추가하여 로드 시작
    document.body.appendChild(iframe)

    // 타임아웃 설정 (5초)
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
        reject(new Error('세션 갱신 타임아웃'))
      }
    }, 5000)
  })
}

export default {
  state: () => ({
    profileList: [],
    user: {},
    username: '',
    customerUid: null,
    token: '',
    hybrisToken: '',
    pin: ''
  }),
  mutations: {
    INIT_USER (state) {
      state.profileList = []
      state.user = {}
      state.username = ''
      state.customerUid = null
      state.token = ''
      state.hybrisToken = ''
      state.pin = ''
    },
    SET_PROFILE_LIST (state, user) {
      state.profileList = user
    },
    setUser (state, user) {
      state.user = user
    },
    SET_USER_NAME (state, value) {
      state.username = value
    },
    SET_TOKEN (state, value) {
      state.token = value
    },
    SET_CUSTOMER_UID (state, value) {
      state.customerUid = value
    },
    SET_HYBRIS_TOKEN (state, value) {
      state.hybrisToken = value
    },
    SET_PIN (state, value) {
      state.pin = value
    },
    INIT (state) {
      state.profileList = []
      state.user = {}
      state.username = ''
      state.customerUid = null
      state.token = ''
      state.hybrisToken = ''
      state.pin = ''
    }
  },
  actions: {
    initUser ({ commit }) {
      commit('INIT_USER')
    },
    setProfileList ({ commit }, value) {
      commit('SET_PROFILE_LIST', value)
    },
    setUser ({ commit }, value) {
      commit('setUser', value)
    },
    setUsername ({ commit }, value) {
      commit('SET_USER_NAME', value)
    },
    setToken ({ commit }, value) {
      commit('SET_TOKEN', value)
    },
    setHybrisToken ({ commit }, value) {
      commit('SET_HYBRIS_TOKEN', value)
    },
    setCustomerUid ({ commit }, value) {
      commit('SET_CUSTOMER_UID', value)
    },
    setPin ({ commit }, value) {
      commit('SET_PIN', value)
    },
    async getAccessControlType ({ state, dispatch }) {
      try {
        const result = await getAmwayAuthorize()
        
        const isAuthorize = result?.header?.status === 'SUCCESS' && !!result?.customerUid
        
        let customerUid = null

        if (isAuthorize) {
          customerUid = decodeURIComponent(window.atob(result.customerUid))
          localStorage.setItem('ishybrissso', 'true')
        } else {
          localStorage.removeItem('ishybrissso')
        }

        if (state.customerUid && state.customerUid !== customerUid) {
          return ACCESS_CONTROL_TYPE.RELOAD
        }

        dispatch('setCustomerUid', customerUid)

        if (isAuthorize) {
          return ACCESS_CONTROL_TYPE.ENTRY
        } else {
          return ACCESS_CONTROL_TYPE.NO_ENTRY
        }
      } catch (error) {
        const status = error.response?.status
        console.log(error)
        
        // 404 에러인 경우 (API 엔드포인트가 존재하지 않음) NO_ENTRY 반환
        if (status === 404) {
          localStorage.removeItem('ishybrissso')
          dispatch('setCustomerUid', null)
          return ACCESS_CONTROL_TYPE.NO_ENTRY
        }
        
        // 400 에러인 경우 세션 갱신 시도
        if (status === 400) {
          try {
            await refreshAmwaySession()
            // 세션 갱신 후 다시 시도
            const result = await getAmwayAuthorize()
            const isAuthorize = result?.header?.status === 'SUCCESS' && !!result?.customerUid
            let customerUid = null

            if (isAuthorize) {
              customerUid = decodeURIComponent(window.atob(result.customerUid))
              localStorage.setItem('ishybrissso', 'true')
            } else {
              localStorage.removeItem('ishybrissso')
            }

            dispatch('setCustomerUid', customerUid)

            if (isAuthorize) {
              return ACCESS_CONTROL_TYPE.ENTRY
            } else {
              return ACCESS_CONTROL_TYPE.NO_ENTRY
            }
          } catch (refreshError) {
            console.error('세션 갱신 실패:', refreshError)
            return ACCESS_CONTROL_TYPE.NO_ENTRY
          }
        }
        
        // 400, 404가 아닌 경우 (네트워크 에러, 서버 에러 등)
        // 로그인되지 않은 상태에서만 호출되므로 NO_ENTRY로 처리하여 무한 루프 방지
        console.warn('getAmwayAuthorize 에러 (status:', status, '):', error.message || error)
        localStorage.removeItem('ishybrissso')
        dispatch('setCustomerUid', null)
        return ACCESS_CONTROL_TYPE.NO_ENTRY
      }
    },
    doLogout ({ commit }) {
      commit('INIT')
    }
  },
  getters: {
    getProfileList (state) {
      return state.profileList
    },
    getUser (state) {
      return state.user
    },
    getUsername (state) {
      return state.username
    },
    getCustomerUid (state) {
      return state.customerUid
    },
    getToken (state) {
      return state.token
    },
    getHybrisToken (state) {
      return state.hybrisToken
    },
    getPin (state) {
      return state.pin
    }
  }
}
