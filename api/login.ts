import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '~/api/request'

export function googleLogin<T = any>(options?: { idToken?: string; channel?: string }) {
  return post<T>({
    url: '/user-api/user/googleLogin',
    data: { ...options },
  })
}
// export function sendEmailVerifyCode<T = any>(options?: { email?: string; channel?: string }) {
export function sendEmailVerifyCode<T = any>(params: {
  prompt: string
  options?: { email?: string; channel?: string }
  signal?: GenericAbortSignal
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void }) {
  return post<T>({
    url: '/user-api/user/sendEmailVerifyCode',
    data: { ...params.options },
    // onDownloadProgress: params.onDownloadProgress,
  })
}
export function emailLogin<T = any>(options?: { email?: string; channel?: string }) {
  return post<T>({
    url: '/user-api/user/emailLogin',
    data: { ...options },
  })
}
