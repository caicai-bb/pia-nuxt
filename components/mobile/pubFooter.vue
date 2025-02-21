<script setup lang='ts'>
import { computed, defineAsyncComponent, nextTick, ref, defineProps, defineExpose } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import {
  NAvatar, NConfigProvider, NDrawer, NDrawerContent,
  NEllipsis,
  NFlex,
} from 'naive-ui'

import { useAuthStore, useUserStore } from '@/store'

const router = useRouter()
import * as http from '@/api/home'
import { copyToClip } from '@/utils/copy'
const props = defineProps({
  isActive: {
    type: String,
    required: true,
    default: 'Home',
  },
  content: {
    type: String,
    default: 'index',
  },
  navLiClick: {
    type: Function,
  },
})
// const CopySuccess = defineAsyncComponent(() => import('../copySuccess.vue'))
const userStore = useUserStore()
const authStore = useAuthStore()
// const Login = defineAsyncComponent(() => import('@/components/common/login/index.vue'))
const invitationUrl = ref('')
const isCopy = ref(false)
const isLogin = ref(false)
const showLoginBtn = computed(() => {
  return (userStore.$state?.userInfo?.name ?? '未登录') == '未登录'
})

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  return {
    common: {
      primaryColor: '#979799',
      primaryColorHover: '#979799',
      primaryColorPressed: '#979799',
      modalColor: '#000000',
      baseColor: '#979799',
      color: '#333333',
      borderRadius: '2px',
      boxShadow1: 'none',
    },
    Input: {
      color: '#fff',
      colorFocus: '#fff',
      borderRadius: '15px',
      placeholderColor: '#d3d3d3',
      border: 'none',
      borderHover: 'none',
      borderFocus: 'none',
      boxShadowFocus: 'none',
    },
    Drawer: {
      closeIconColor: '#fe5997',
      headerBorderBottom: 'none',
    },
  }
})

const userF = computed(() => userStore.$state.userInfo?.name?.[0])
const balance = computed(() => (userStore.$state.userInfo?.subscriptionBalance ?? 0) + (userStore.$state.userInfo?.exchangeBalance ?? 0))
const pointsAccountBalance = computed(() => userStore.userInfo?.balance ?? 0)

const userShow = ref(false)

function toRouter(path: string) {
  router.push(`/${path}`)
}
function userClick() {
  if (showLoginBtn.value)
    toLogin()
  else
    userShow.value = true
}
function toLogin() {
  isLogin.value = true
}
function signOut() {
  userShow.value = false
  // 刷新token
  authStore.removeToken()
  userStore.updateUserInfo({ avatar: '', name: '未登录' })
  // 清空积分和token
  // 获取订阅状态
  userStore.updateUserInfo(
    {
      subscriptionPlan: {
        status: 0,
        startDate: 0,
        endDate: 0,
        firstSubscriptionStatus: 0,
      },
    })
  // 刷新积分
  userStore.updateUserInfo({ balance: 0 })
  userStore.updateUserInfo(
    {
      subscriptionBalance: 0,
      exchangeBalance: 0,
    })
  window.location.reload()
}
// 分享连接获取
function getInvitationCodeUrl() {
  http.getInvitationCodeUrl().then((res: any) => {
    invitationUrl.value = res.text
    copyUrl()
  }).catch((e) => {

  })
}
// 复制分享连接
function copyUrl() {
  if (invitationUrl.value != '') {
    userShow.value = false
    nextTick(() => {
      copyToClip(invitationUrl.value).then(() => {
        isCopy.value = true
      })
    })
  }
}
defineExpose({
  isLogin,
})
</script>

<template>
  <div class="nv w-full fixed left-0 bottom-0 h-12 z-2 ">
    <div class="w-full h-full border border-[#2c2c31] border-solid bg-[#171634d1] px-11">
      <NFlex justify="space-between">
        <a v-if="isActive !== 'pia'" class="w-[1.75rem] h-[1.75rem] bg-fot-tk bg-center bg-no-repeat bg-cover mt-2" :class="isActive === 'rewards' ? 'bg-fot-tk-avt' : ''" @click="toRouter('rewards')" />
        <a v-if="isActive !== 'pia'" class="w-[1.75rem] h-[1.75rem] bg-fot-ai bg-center bg-no-repeat bg-cover mt-2" @click="toRouter('pia')" />
        <!-- <a v-if="isActive === 'pia'" class="w-[1.75rem] h-[1.75rem] bg-ai-pf bg-center bg-no-repeat bg-cover mt-2" :class="content === 'index' ? 'bg-ai-pf-avt' : ''" @click="navLiClick({ value: 'carbon--ai-recommend' })" /> -->
        <a v-if="isActive === 'pia'" class="w-[1.75rem] h-[1.75rem] bg-ai-pf bg-center bg-no-repeat bg-cover mt-2" :class="content === 'explore' ? 'bg-ai-pf-avt' : ''" @click="navLiClick({ value: 'explore' })" />
        <a v-if="isActive === 'pia'" class="w-[1.75rem] h-[1.75rem] bg-ai-his bg-center bg-no-repeat bg-cover mt-2" :class="content === 'history' ? 'bg-ai-his-avt' : ''" @click="navLiClick({ value: 'solar--history-bold' })" />
        <a class="w-[1.75rem] h-[1.75rem] bg-fot-m bg-center bg-no-repeat bg-cover mt-2" @click="userClick" />
      </NFlex>
    </div>
    <NConfigProvider
      class="h-full"
      :theme-overrides="themeOverrides"
    >
      <NDrawer v-model:show="userShow" width="80%" placement="right">
        <NDrawerContent title="" closable>
          <div class="border border-[#2c2c31] border-solid rounded-3xl p-5 bg-[#13122b]">
            <NFlex vertical align="stretch" :size="30" class=" text-white">
              <span class="flex flex-row w-full">
                <span class="inline-block w-10 h-10">
                  <NAvatar v-if="!userStore.$state.userInfo?.ico" round :size="40">
                    {{ userStore.$state.userInfo?.ico ? '' : (userF?.toUpperCase() ?? '') }}
                  </NAvatar>
                </span>
                <NEllipsis class="flex-1 inline-block h-10 leading-[2.5rem] pl-4 text-lg">
                  {{ userStore.$state?.userInfo?.name ?? '未登录' }}
                </NEllipsis>
              </span>
              <div class="flex flex-row">
                <span class="inline-block w-10 h-10 bg-pia-tk bg-center bg-no-repeat bg-cover" />
                <NEllipsis class="flex-1 inline-block h-10 leading-[2.5rem] pl-4 text-lg">
                  {{ balance }}
                </NEllipsis>
              </div>
              <div class="flex flex-row">
                <span class="inline-block w-10 h-10 bg-pia-data bg-center bg-no-repeat bg-cover" />
                <NEllipsis class="flex-1 inline-block h-10 leading-[2.5rem] pl-4 text-lg">
                  {{ pointsAccountBalance }}
                </NEllipsis>
              </div>
              <a class="flex flex-row" @click="getInvitationCodeUrl">
                <span class="inline-block w-10 h-10 bg-pia-ste bg-center bg-no-repeat bg-cover" />
                <NEllipsis class="flex-1 inline-block h-10 leading-[2.5rem] pl-4 text-lg">
                  Share to earn
                </NEllipsis>
              </a>
              <a class="flex flex-row" @click="signOut">
                <span class="inline-block w-10 h-10 bg-pia-lgt bg-center bg-no-repeat bg-cover" />
                <NEllipsis class="flex-1 inline-block h-10 leading-[2.5rem] pl-4 text-lg">
                  Logout
                </NEllipsis>
              </a>
              <div class="mt-10">
                <a class=" block h-9 text-center py-1 border border-[#2c2c31] border-solid bg-gradient-to-r from-[#07050c] to-[#dd3488] rounded-lg" @click="toRouter('subscribe')">
                  <span class="inline-block w-7 h-7 bg-pia-up-pl bg-center bg-no-repeat bg-cover" />
                  <span class="inline-block align-top text-sm leading-7 ml-2">Upgrade Plan</span>
                </a>
                <a class="block h-9 text-center py-1 mt-3 border border-[#2c2c31] border-solid rounded-lg" @click="toRouter('redeem')">
                  <span class="inline-block w-7 h-7 bg-pia-data bg-center bg-no-repeat bg-cover" />
                  <span class="inline-block align-top text-sm leading-7 ml-2">Redeem points</span>
                </a>
              </div>
            </NFlex>
          </div>
        </NDrawerContent>
      </NDrawer>
    </NConfigProvider>
    <common-login v-if="isLogin" v-model:visible="isLogin" />
    <CopySuccess v-if="isCopy" v-model:visible="isCopy" :invitation-url="invitationUrl" />
  </div>
</template>

<style scoped>
.text-pick{
  color: #fe5997!important;
}
</style>
