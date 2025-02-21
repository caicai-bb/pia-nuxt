import { ss } from '@/utils/storage'
// import { homeStore } from '@/store'
const LOCAL_NAME = 'userStorage'
const LOCAL_KEY = 'invitationCodeStorage'
// const backgroundImage = homeStore.myData.session.backgroundImage ?? 'https://t.alcy.cc/fj/'

export interface UserInfo {
  avatar: string
  name: string
  backgroundImage: string
  description: string
  birthday: string
  city: string
  country: string
  email: string
  ico: string
  id: string
  nickName: string
  province: string
  realName: string
  sex: Number
  signature: string
  invitationCode: string // 邀请码6位页面显示用
  c: string // 邀请码
  subscriptionBalance: number // 订阅账户余额
  exchangeBalance: number // 兑换账户余额
  balance: number // 账户积分
  subscribeCode: boolean // 账户积分
  subscriptionPlan: { // 订阅状态
    status: number // 订阅状态：0无效，1有效
    startDate: number // 开始日期， 仅当 status = 1时有值
    endDate: number // 结束日期， 仅当 status = 1时有值
    firstSubscriptionStatus: number // 是否首次订阅用户：0否，1是
  }
}

export interface UserState {
  userInfo: UserInfo
}
// export interface UserCodeState {
//   userCodeInfo: string
// }

export function defaultSetting(): UserState {
  return {
    userInfo: {
      // avatar: 'https://raw.githubusercontent.com/Dooy/chatgpt-web-midjourney-proxy/main/src/assets/avatar.jpg',
      // name: t('mjset.sysname'), // 'AI绘图',
      // description: '',
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
export function getLocalStateByKey(): string {
  return ss.get(LOCAL_KEY)
}
export function setLocalStateByKey(setting: string): void {
  ss.set(LOCAL_KEY, setting)
}
