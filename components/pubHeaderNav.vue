<script setup lang='ts'>
import { computed, defineAsyncComponent, reactive, ref, watch, defineProps, defineExpose } from 'vue'
import { NAvatar, NEllipsis, NGi, NGrid, NPopover } from 'naive-ui'
// import List from './List.vue'
// import Footer from './Footer.vue'

import { useAppStore, useAuthStore, useChatStore, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

// import { SvgIcon } from '@/components/common'
import * as http from '@/api/home'
import { copyToClip } from '@/utils/copy'
const props = defineProps({
  isActive: {
    type: String,
    required: true,
    default: 'Home',
  },
})
// const CopySuccess = defineAsyncComponent(() => import('./copySuccess.vue'))

const userStore = useUserStore()
const authStore = useAuthStore()
// const Setting = defineAsyncComponent(() => import('@/components/common/SettingRem/index.vue'))
// const Login = defineAsyncComponent(() => import('@/components/common/login/index.vue'))
const invitationUrl = ref('')
const isCopy = ref(false)
const isLogin = ref(false)
const showLoginBtn = computed(() => {
  return (userStore.$state?.userInfo?.name ?? '未登录') == '未登录'
})
const appStore = useAppStore()
const settingShow = ref(false)
const { isMobile } = useBasicLayout()
appStore.setBase({
    baseApi: useRuntimeConfig().public.baseConfig.VITE_GLOB_API_URL,
    baseUrl: useRuntimeConfig().public.baseConfig?.VITE_APP_API_BASE_URL,
  })
const userF = computed(() => userStore.$state.userInfo?.name?.[0])
const balance = computed(() => (userStore.$state.userInfo?.subscriptionBalance ?? 0) + (userStore.$state.userInfo?.exchangeBalance ?? 0))
const pointsAccountBalance = computed(() => userStore.userInfo?.balance ?? 0)
const chatStore = useChatStore()
const collapsed = computed(() => appStore.siderCollapsed)
const show = ref(false)
const value = ref('')
const options = ref([{
  label: 'signOut',
  value: 'signOut',
}])

// const dialog = useDialog()
// const isaction = ref('Home')
// 'questf','resources',
const navList = reactive([
  'home', 'rewards', 'pia',
])
const router = useRouter()
function toRouter(path: string) {
  router.push(`/${path}`)
}
function toLogin() {
  isLogin.value = true
}
// function toLogin(item: string) {
//   isLogin.value = true
// }
function signOut() {
  // isLogin.value = false
  authStore.removeToken()
  userStore.updateUserInfo({ avatar: '', name: '未登录' })
  window.location.reload()
}
const navatarClick = (value, options) => {
  if (value === 'signOut')
    signOut()
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
    copyToClip(invitationUrl.value).then(() => {
      isCopy.value = true
      // ms.success('复制成功')
    })
  }
}
// const getMobileClass = computed<CSSProperties>(() => {
//   if (isMobile.value) {
//     return {
//       position: 'fixed',
//       zIndex: 50,
//       height: '100%',
//     }
//   }
//   return {}
// })

// const mobileSafeArea = computed(() => {
//   if (isMobile.value) {
//     return {
//       paddingBottom: 'env(safe-area-inset-bottom)',
//     }
//   }
//   return {}
// })
const numberTokw = (num: number) => {
  return num
  // if (num < 1000)
  //   return num
  // let cfg = [100, 'k']
  // if (num >= 10000)
  //   cfg = [1000, 'w']
  // return Math.floor(num / cfg[0]) / 10 + cfg[1]
}
// watch(
//   isMobile,
//   (val) => {
    // appStore.setSiderCollapsed(val)
//   },
//   {
//     immediate: true,
//     flush: 'post',
//   },
// )
defineExpose({
  isLogin,
})
</script>

<template>
  <div class="nv">
    <NGrid :cols="24">
      <NGi span="20" style="text-align:left;">
        <template v-for="item in navList" :key="`${item}nva`">
          <a
            class="text-neutral-900 dark:text-neutral-100 nav-div"
            :class="[isActive == item ? 'text-pick' : '']"
            @click="toRouter(item)"
          >
            {{ $t(`home.${item}`) }}
          </a>
        </template>
      </NGi>
      <NGi v-if="showLoginBtn" span="4">
        <div class="sign" @click="toLogin">
          {{ `${$t('home.Register')} & ${$t('home.SignIn')}` }}
        </div>
      </NGi>
      <NGi v-else-if="!showLoginBtn" span="4">
        <div class="sign-tx" @click="settingShow = false">
          <div class="sign-tx-pow">
            <span class="pw-icon">
              <common-svgIcon icon="mingcute:lightning-fill" />
            </span>
            <span>
              {{ numberTokw(balance ?? 0) }}
            </span>
          </div>
          <div class="sign-tx-sl">
            <NPopover trigger="hover" placement="bottom-end">
              <template #trigger>
                <NAvatar v-if="userStore.$state.userInfo?.ico" round :size="50" :src="userStore.$state.userInfo?.ico" />
                <NAvatar v-if="!userStore.$state.userInfo?.ico" round :size="50">
                  {{ userStore.$state.userInfo?.ico ? '' : (userF?.toUpperCase() ?? '') }}
                </NAvatar>
              </template>
              <div class="avatar-pop">
                <div class="avatar-pop-div">
                  <span class="avatar-pop-div-icon">
                    <common-svgIcon icon="radix-icons:avatar" />
                  </span>
                  <span class="avatar-pop-div-text">
                    <NEllipsis style="max-width: 150px">
                      {{ userStore.$state?.userInfo?.name ?? '未登录' }}
                    </NEllipsis>
                  </span>
                </div>
                <div class="avatar-pop-div avatar-pop-div-none">
                  <span class="avatar-pop-div-icon">
                    <common-svgIcon icon="gala:data" />
                  </span>
                  <span class="avatar-pop-div-text apdt-text-num">
                    {{ pointsAccountBalance }}
                  </span>
                  <a class="apdt-btn" @click="toRouter('redeem')">Redeem</a>
                </div>
                <div class="avatar-pop-div" @click="getInvitationCodeUrl">
                  <span class="avatar-pop-div-icon">
                    <common-svgIcon icon="hugeicons:share-04" />
                  </span>
                  <span class="avatar-pop-div-text">
                    Share to earn
                  </span>
                </div>
                <div class="avatar-pop-div">
                  <span class="avatar-pop-div-icon">
                    <common-svgIcon icon="iconoir:log-out" />
                  </span>
                  <span class="avatar-pop-div-text" @click="signOut">
                    Logout
                  </span>
                </div>
              </div>
            </NPopover>
          </div>
        </div>
      </NGi>
    </NGrid>

    <common-login v-if="isLogin" v-model:visible="isLogin" />
    <!-- <Setting v-if="settingShow" v-model:visible="settingShow" />
    <CopySuccess v-if="isCopy" v-model:visible="isCopy" :invitation-url="invitationUrl" /> -->
  </div>

</template>

<style scoped>
.nv{
  width: 100%;
  max-width: 1365px;
  height: 80px;
  padding: 20px;
  /* position: relative; */
  left: 0;
  top: 20px;
  right: 0;
  bottom: 0;
  border: 1px #fe5997 solid;
  border-radius: 20px;
  z-index: 100;
  margin: 0 auto;
  font-size: 18px;
  background: #171634d1;
}
.text-pick{
  color: #fe5997!important;
}
.nav-div:hover{
  color: #fe5997;
}
.nav-div{
  display: inline-block;
  padding: 0 40px;
  line-height: 40px;
  cursor: pointer;
  font-weight: 700;
}
.sign:hover{
  background: #eb4e8a;
}
.sign{
  width: 190px;
  height: 40px;
  padding: 0 10px;
  background: #fe5997;
  color: aliceblue;
  line-height: 40px;
  border-radius: 15px;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
  font-size: 13px;
}
.sign-tx{
  text-align: right;
  position: relative;
  margin-top: -5px;
}
/* .sign-tx :deep(.n-avatar__text){ */
  /* font-size: 35px; */
/* } */
.sign-tx-pow{
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  line-height: 35px;
  color: #fff;
  margin-right: 15px;
  font-size: 16px;
}
.sign-tx-pow span{
  display: inline-block;
  vertical-align: middle;
}
.pw-icon{
  color: #fed928;
  font-size: 24px;
  line-height: 16px;
  margin-right: 5px;
}
.sign-tx-sl{
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
.avatar-pop{
  /* border: 1px #282829 solid; */
  border-radius: 15px;
  /* padding: 20px; */

  /* background: #171634bf; */
}
.avatar-pop-div{
  height: 50px;
  line-height: 50px;
  width: 200px;
  cursor: pointer;
  color: #fff;
}
.avatar-pop-div:hover{
  color: #fe5997;
}
.avatar-pop-div-icon{
  display: inline-block;
  vertical-align: middle;
  font-size: 30px;
}
.avatar-pop-div-text{
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 20px;
}
.avatar-pop-div-none{
  height: 50px;
  line-height: 50px;
  width: 200px;
  cursor: default;
  color: #fff;
}
.apdt-text-num{
  width: 70px;
}
.apdt-btn{
  width: 70px;
  cursor: pointer;
  height: 20px;
  background: #fe5997;
  color: #fff;
  border-radius: 15px;
  font-size: 12px;
  padding: 5px 10px;
}
</style>
