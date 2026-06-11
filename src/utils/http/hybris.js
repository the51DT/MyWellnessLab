import axios from 'axios'
import store from '@/store'

// const getDatadome = () => {
//   let datadome = '';

//   switch (import.meta.env.MODE) {
//     case 'production':
//       datadome = 'prod';
//       break;

//     default:
//       datadome = 'uat';
//   }

//   return datadome;
// }

const instance = axios.create({
  baseURL: import.meta.env.VITE_HYBRIS_API_URL,
  // headers: {
  //   "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Amway_datadome=${getDatadome()}`
  // }
})

instance.interceptors.request.use(
  (config) => {
    if(store.getters.getHybrisToken) {
      config.headers.Authorization = store.getters.getHybrisToken
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // [todo] InvalidTokenError -> 토큰 재발행

    return Promise.reject(error)
  }
)

export default instance