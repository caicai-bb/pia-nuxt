import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store/helper'
import { fetchSession } from '@/api'
import { gptConfigStore, homeStore } from '@/store/homeStore'

// import { useAppStore } from '@/store'
// const appStore = useAppStore()
interface SessionResponse {
  theme?: string
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        // const { data } = await fetchSession<SessionResponse>()
        // this.session = { ...data }
        
        // homeStore.setMyData({session: data });
        const data = { status: 'Success', message: '', data: { isHideServer: false, isUpload: false, auth: true, model: 'ChatGPTAPI', amodel: 'gpt-4', isApiGallery: false, cmodels: '', baiduId: '', googleId: '', notify: '', disableGpt4: '', isWsrv: '', uploadImgSize: '1', gptUrl: '', theme: 'dark', isCloseMdPreview: false } }

        // if(appStore.$state.theme=='auto' ){
        //     appStore.setTheme(  data.theme && data.theme=='light' ?'light':'dark')
        // }
        if( process.client){

          let str = window.localStorage.getItem('gptConfigStore');
          if( ! str ) setTimeout( ()=>  gptConfigStore.setInit() , 500); 
        }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
