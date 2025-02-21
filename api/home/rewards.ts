import { post } from '~/api/request'
// 积分账户
export function myPointsAccount() {
  return post<T>({
    url: '/points-api/points/account/myPointsAccount',
  })
}
// 任务列表
export function pointsTaskList<T = any>(options?: { email?: string; channel?: string }) {
  return post<T>({
    url: '/points-api/points/account/pointsTaskList',
    data: { ...options },
  })
}
// 积分列表
export function myPointsAccountFlow<T = any>(options?: { accountId?: string; page?: Number; size?: Number }) {
  return post<T>({
    url: '/points-api/points/account/myPointsAccountFlow',
    data: { ...options },
  })
}
// 邀请链接
export function getInvitationCodeUrl() {
  return post<T>({
    url: '/user-api/user/getInvitationCodeUrl',
  })
}
// 获取sku列表
export function getProductSkuList<T = any>(options?: { device: object; productNo: string }) {
  return post<T>({
    url: '/trade-api/trade/product/skuList',
    data: { ...options },
  })
}
// 创建订单
export function createSKUOrder<T = any>(options?: { device: object; productNo: string }) {
  return post<T>({
    url: '/trade-api/trade/order/createSKUOrder',
    data: { ...options },
  })
}
// 提交订单去付款
export function checkoutSession<T = any>(options?: { device: object; productNo: string }) {
  return post<T>({
    url: '/trade-api/trade/order/stripe/checkoutSession',
    data: { ...options },
  })
}
