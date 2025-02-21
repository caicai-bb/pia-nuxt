import { defineStore } from 'pinia'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, getLocalStateByKey, setLocalState, setLocalStateByKey } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
    // getInvitationCode() {
    //   return getLocalStateByKey()
    // },
    // setInvitationCode(code) {
    //   setLocalStateByKey(code)
    // },
  },
})
export const useCodeStore = defineStore('userCode-store', {
  state: (): any => getLocalStateByKey(),
  actions: {
    getInvitationCode() {
      return getLocalStateByKey()
    },
    setInvitationCode(code: string) {
      setLocalStateByKey(code)
    },
  },
})
