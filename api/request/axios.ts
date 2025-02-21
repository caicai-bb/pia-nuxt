import axios, { type AxiosResponse } from 'axios'
import { useAuthStore, useAppStore } from '@/store'
import { computed } from 'vue'

// import { useRuntimeConfig } from '#app'
// const ba = computed(() => useAppStore()?.base?.baseApi)
// debugger
const service = axios.create({
  // baseURL: ba.value,
  // baseURL: useRuntimeConfig().public.baseConfig.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token

    if (token)
      config.headers.Authorization = token

    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
