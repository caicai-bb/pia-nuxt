import { post } from '~/api/request'
import { useAuthStore, useUserStore } from '@/store'
// 获取token账户
const params = {
  device: {
    osPlatform: 'web',
  },
  productNo: 'pia',
}
// 积分账户
export function myPointsAccountPub() {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  return post<T>({
    url: '/points-api/points/account/myPointsAccount',
  }).then((res: any) => {
    userStore.updateUserInfo({ balance: res?.pointsAccount?.balance ?? 0 })
    if (res.code === 406) {
      userStore.updateUserInfo({ balance: 0 })
      authStore.removeToken()
      userStore.updateUserInfo({ avatar: '', name: '未登录' })
    }
  }).catch((e) => {
    userStore.updateUserInfo({ balance: 0 })
    if (e.code === 406) {
      authStore.removeToken()
      userStore.updateUserInfo({ avatar: '', name: '未登录' })
    }
  })
}
export function getUserSubscriptionStatus() {
  const userStore = useUserStore()
  return post<T>({
    url: '/trade-api/trade/subscription/getUserSubscriptionStatus',
    data: { ...params },
  }).then((res) => {
    userStore.updateUserInfo(
      {
        subscriptionPlan: res?.subscriptionPlan ?? null,
      })
  }).catch(() => {
    userStore.updateUserInfo(
      {
        subscriptionPlan: {
          status: 0,
          startDate: 0,
          endDate: 0,
          firstSubscriptionStatus: 0,
        },
      })
  })
}
// 获取账户订阅状态
export function getUserTokenAccount() {
  const userStore = useUserStore()
  return post<T>({
    url: '/trade-api/trade/token/getUserTokenAccount',
  }).then((res) => {
    userStore.updateUserInfo(
      {
        subscriptionBalance: res?.tradeTokenBean?.subscriptionBalance ?? 0,
        exchangeBalance: res?.tradeTokenBean?.exchangeBalance ?? 0,
      })
  }).catch(() => {
    userStore.updateUserInfo(
      {
        subscriptionBalance: 0,
        exchangeBalance: 0,
      })
  })
}
// 积分兑换token
export function exchangeToken<T = any>(param?: { points: number; device: { osPlatform: string } }) {
  return post<T>({
    url: '/trade-api/trade/token/exchangeToken',
    data: { ...param },
  })
}
