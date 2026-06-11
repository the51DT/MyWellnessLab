import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { USER_TYPE } from '@/utils/commonCode'
import * as loginApi from '@/apis/login'
import * as joinApi from '@/apis/join'
import _ from 'lodash'

export const useAccessControl = () => {
  const store = useStore()
  const router = useRouter()

  const isLogin = store.getters.isLogin

  /**
   * 회원 uid 가져오기
   * @returns {string}
   */
  const getCustomerUid = async () => {
    try {
      const response = await loginApi.getAmwayAuthorize()
      const isAuthorized = response?.header?.status === 'SUCCESS' && response?.customerUid

      if (isAuthorized) {
        localStorage.setItem('ishybrissso', 'true')
        return decodeURIComponent(window.atob(response.customerUid))
      }

      localStorage.removeItem('ishybrissso')

      return null
    } catch (e) {
      const status = e?.response?.status

      if (status === 400) {
        try {
          const accessControlType = await store.dispatch('getAccessControlType')

          const refreshedUid = store.getters.getCustomerUid
          if (refreshedUid) {
            return refreshedUid
          }

          if (accessControlType !== undefined) {
            localStorage.removeItem('ishybrissso')
            return null
          }
        } catch (retryError) {
          console.error('authorizeEvent 재시도 실패', retryError)
          localStorage.removeItem('ishybrissso')
          return null
        }

        localStorage.removeItem('ishybrissso')
        return null
      }

      console.error(e)
      return null
    }
  }

  /**
   * hybris 토큰 가져오기
   * @returns {string}
   */
  const getHybrisToken = async () => {
    try {
      const response = await loginApi.getHybrisToken()

      const data = response.data
      return `${data.token_type} ${data.access_token}`
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 프로필 불러오기
   * @param {*} customerId
   * @returns {List}
   */
  const getProfileList = async (customerUid) => {
    try {
      const params = { fields: 'LOGME' }
      const response = await loginApi.getAmwayProfileList(customerUid, params)

      return response.customers || []
    } catch (e) {
      console.error(e)
      console.error(e)
    }
  }

  /**
   * 회원가입 여부
   * @param {*} customerId
   * @returns {boolean}
   */
  const shouldJoin = async (customerId) => {
    try {
      const response = await joinApi.getJoinStatus(customerId)

      return response.data.userCheck === 0
    } catch (e) {
      console.error(e)
    }
  }

  // 회원 프로필이 1개일때 화면 이동 제어
  const handleSingleProfile = async (profileList) => {
    try {
      const profile = profileList[0]
      const customerId = profile.customerId

      store.dispatch('setUser', {
        ...profile
      })

      if (customerId && await shouldJoin(customerId)) {
        store.dispatch('setIsShowJoinAlert', true)
        store.dispatch('setJoinInfo', profile)

        return
      }

      router.replace({ name: 'LoginPin' })
    } catch (e) {
      console.error(e)
    }
  }

  // 회원 프로필이 2개 이상일때 화면 이동 제어
  const handleMultiProfile = () => {
    router.replace({ name: 'LoginProfile' })
  }

  // 실행 함수
  const run = async () => {
    try {
      const customerUid = await getCustomerUid()
      const hasHybrisToken = !_.isEmpty(store.getters.getHybrisToken)

      if (!customerUid) {
        if (!isLogin) {
          store.dispatch('setProfileList', [])
        }
        return
      }

      if (!isLogin || !hasHybrisToken) {
        const hybrisToken = await getHybrisToken()
        if (hybrisToken) {
          store.dispatch('setHybrisToken', hybrisToken)
        }
      }

      const profileList = await getProfileList(customerUid)
      const isABO = profileList.some((profile) => profile.accountTypeCode === USER_TYPE.ABO)

      store.dispatch('setProfileList', profileList)

      if (isLogin) {
        return
      }

      if (isABO && profileList.length > 1) {
        handleMultiProfile()
      } else if (profileList.length > 0) {
        await handleSingleProfile(profileList)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return run
}
