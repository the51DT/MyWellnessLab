import axios from 'axios'
import store from '@/store'
import message from '@/components/message'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    if (store.getters.getToken) {
      config.headers.Authorization = store.getters.getToken
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return { data: null }
    }

    return response.data
  },
  async (error) => {
    const status = error.response.status

    if (!error.config.noMessage) {

      if (status !== 401) {
        // 건강분석 결과 조회 API의 400 에러는 팝업을 띄우지 않음
        const isHealthAnalysisAPI = error.config.url?.includes('/v1/api/user/analysis/complete/my-simple')
        const isBodyKeyAPI = error.config.url?.includes('/v1/api/user/inbodyapi/get-data')
        const isPdfDownloadAPI = error.config.url?.includes('/v1/api/user/pdf/download/')

        if (isBodyKeyAPI) {
          return Promise.reject(error)
        }

        // PDF 다운로드 API의 409 에러는 팝업을 띄우지 않음 (PDF 생성 중)
        if (!(status === 400 && isHealthAnalysisAPI) && !(isPdfDownloadAPI)) {
          let errorMessage = '일시적인 오류로 서버와 연결이 끊겼습니다.\n잠시 후 다시 시도해 주세요.'

          if (error.response.data?.message) {
            errorMessage = error.response.data.message
          }

          await message.alert(errorMessage)
        }
      }
    }

    return Promise.reject(error)
  }
)

export default instance
