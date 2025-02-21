<script setup lang='ts'>
import { computed, onMounted, onUnmounted, reactive, ref, defineProps,
  defineEmits } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NButton, NConfigProvider, NGi, NGrid, NInput, NInputGroup, useMessage } from 'naive-ui'
// import InputCodePage from './inputCode.vue'
const router = useRouter()
import { useAuthStore, useCodeStore, useUserStore } from '@/store'
import { emailLogin, googleLogin, sendEmailVerifyCode } from '@/api/login'

import { useBasicLayout } from '@/hooks/useBasicLayout'
import * as http from '@/api/home'
// import { GoogleLogin } from 'vue3-google-oauth2';
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()
const userCodeStore = useCodeStore()
const ms = useMessage()
interface Props {
  visible: boolean
  loginTrue: Function
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#fe5997',
    primaryColorHover: '#eb4e8a',
    primaryColorPressed: '#fe5997',
    baseColor: '#ffffff',
  },
  Button: {
    textColor: '#ffffff',
    fontWeight: '700',
    fontSizeMedium: '18px',
    heightMedium: '45px',
  },
  Input: {
    fontSizeMedium: '18px',
    boxShadowFocus: 'none',
  },
}
const userStore = useUserStore()
const authStore = useAuthStore()

const timecount = ref(0)
const inputCode = ref(false)
const isShow = ref(false)
const email = ref('')
const emailCode = ref('')
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const getUserTokenAccount = () => {
  http.getUserTokenAccount()
  http.myPointsAccount().then((res: any) => {
    userStore.updateUserInfo({ balance: res?.pointsAccount?.balance ?? 0 })
    props.loginTrue()
  }).catch()
}
const onLoginSuccess = (res: any) => {
  const userinfo = { ...res.user, name: res.user.email, invitationCode: res?.invitationCode, avatar: res.user.ico }
  userStore.updateUserInfo(userinfo)
  authStore.setToken(res.token)
  show.value = false
  getUserTokenAccount()
}
const callback = (response: any) => {
  const ru = window.location.href
  const redirectUri = ru.includes('https://piax.org')
    ? 'https://piax.org'
    : ru.includes('https://www.piax.org')
      ? 'https://www.piax.org'
      : 'https://piax.org'
  if (response?.access_token) {
    const par = { c: userCodeStore.getInvitationCode(), idToken: response.access_token, redirectUri, channel: 'PIA', device: { osPlatform: 'web' } }
    googleLogin(par).then((res) => {
      if (res.code != 1) {
        ms.destroyAll()
        ms.warning(res.message)
      }
      else {
        onLoginSuccess(res)
      }
    }).catch((e) => {

    })
  }
  else if (response?.credential) {
    const par = reactive(
      { c: userCodeStore.getInvitationCode(), idToken: response.credential, redirectUri, channel: 'pia', device: { osPlatform: 'web' } },
    )
    googleLogin(par).then((res) => {
      if (res.code != 1) {
        ms.destroyAll()
        ms.warning(res.message)
      }
      else {
        onLoginSuccess(res)
      }
    }).catch((e) => {

    })
  }
  else if (response?.code) {
    const par = reactive(
      { c: userCodeStore.getInvitationCode(), code: response.code, redirectUri, channel: 'pia', device: { osPlatform: 'web' } },
    )
    googleLogin(par).then((res) => {
      if (res.code != 1) {
        ms.destroyAll()
        ms.warning(res.message)
      }
      else {
        onLoginSuccess(res)
      }
    }).catch((e) => {

    })
  }
}
let timerId: string | number | NodeJS.Timeout | undefined
const startCountdown = () => {
  timerId = setInterval(() => {
    if (timecount.value > 0)
      timecount.value--
    else
      clearInterval(timerId)
  }, 1000)
}
const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/g
const sendMail = () => {
  if (email.value != '') {
    if (!pattern.test(email.value)) {
      ms.destroyAll()
      ms.warning('Mailbox format is not correct')
      return
    }
    const param = {
      options: { email: email.value, channel: 'pia', device: { osPlatform: 'web' } },
    }
    sendEmailVerifyCode(param).then((res) => {
      if (res.code != 1) {
        ms.destroyAll()
        ms.warning(res.message)
      }
      else if (res?.code === 1) {
        timecount.value = 60
        startCountdown()
        inputCode.value = true
      }
    }, (e) => {
    })
  }
  else {
    ms.destroyAll()
    ms.warning('Enter your Email')
  }
}
const goBack = () => {
  inputCode.value = false
}

const login = () => {
  if (email.value != '') {
    if (emailCode.value != '' && emailCode.value.length === 6) {
      const param = { c: userCodeStore.getInvitationCode(), email: email.value, channel: 'pia', device: { osPlatform: 'web' }, code: emailCode.value }
      emailLogin(param).then((res) => {
        if (res.code != 1) {
          ms.destroyAll()
          ms.warning(res.message)
        }
        else {
          onLoginSuccess(res)
        }
      }).catch((e) => {
      })
    }
    else {
      ms.destroyAll()
      ms.warning('Please enter your verification code first')
    }
  }
  else {
    ms.destroyAll()
    ms.warning('Enter your Email')
  }
}
// const onComplete = (val: any) => {
//   emailCode.value = val.join('')
// }

function toRouter(path: string) {
  // router.push(`/${path}`)
  const routeUrl = router.resolve({ name: path })
  window.open(routeUrl.href, '_blank')
}

const googleLoginFlag = ref(false)
const checkGoogleScript = () => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://accounts.google.com/gsi/client'
  document.body.appendChild(script)
  if (script.readyState) { // IE
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        script.onreadystatechange = null
        googleLoginFlag.value = true
        script.parentNode?.removeChild(script)
      }
    }
  }
  else { // 非IE
    script.onload = function () {
      googleLoginFlag.value = true
      script.parentNode?.removeChild(script)
    }
  }
}

onMounted(() => {
  checkGoogleScript()
})
onUnmounted(() => {
  if (timerId)
    clearInterval(timerId)
})
</script>

<template>
<div>
  <div v-if="!isMobile" class="ccssd">
    <div v-show="!isShow && !inputCode" class="logindiv">
      <NGrid y-gap="20" :cols="4">
        <NGi span="4" style="text-align:center;">
          <div class="log-wel">
            Welcome
          </div>
          <div class="log-welt">
            Use a third-party login or email login
          </div>
        </NGi>
        <NGi v-show="googleLoginFlag" span="4" style="text-align:center;">
          <ClientOnly>

          <!-- <GoogleLogin :callback="callback" prompt auto-login popup-type="TOKEN"> -->
          <GoogleLogin :callback="callback">
            <div class="gl" />
          </GoogleLogin>
          </ClientOnly>
        </NGi>
        <NGi span="4">
          <NConfigProvider :theme-overrides="themeOverrides">
            <div class="emial-div">
              <div class="input-bor input-bor-email">
                <NInputGroup>
                  <NInput v-model:value="email" round placeholder="Enter your Email" @keyup.enter="sendMail" />
                </NInputGroup>
              </div>
              <div class="input-bor">
                <NButton type="primary" round style="width:100%;" @click="sendMail">
                  continue
                </NButton>
              </div>
            </div>
          </NConfigProvider>
        </NGi>
        <NGi span="4">
          <div class="ts-pp">
            By signing up, you agree to the <span class="to-ts-pp" @click="toRouter('terms-of-service')">Terms of Service</span> and <span class="to-ts-pp" @click="toRouter('privacy-poilcy')">Privacy Policy</span> .
          </div>
        </NGi>
        <!-- <NGi v-if="false" span="4">
          <div class="text-neutral-900 logo dark:text-neutral-100 login-icon twicon" />
        </NGi>
        <NGi v-if="false" span="4">
          <div class="text-neutral-900 logo dark:text-neutral-100 login-icon fficon" />
        </NGi>
        <NGi v-if="false" span="4">
          <div class="text-neutral-900 logo dark:text-neutral-100 login-icon qbicon" />
        </NGi> -->
      </NGrid>
    </div>
    <div v-show="inputCode" class="logindiv email-code-div">
      <div class="code-qx" @click="goBack">
        <span class="code-qx-icon">
          <common-svgIcon icon="tabler:arrow-left" />
        </span>
        <span class="code-qx-text">
          back
        </span>
      </div>
      <div class="log-wel">
        Verify email
      </div>
      <div class="log-senmsg ls-o">
        A verification code has been sent to
      </div>
      <div class="log-senmsg">
        {{ email }} .Check your spam folder too!
      </div>
      <div class="email-code">
        <!-- @complete="onComplete" -->
        <CommonLoginInputCode v-model:emailCode="emailCode" />
      </div>
      <div class="res-send">
        <span v-if="timecount > 0">
          {{ timecount > 0 ? `${timecount} s` : 'Resend code' }}
        </span>
        <span v-if="timecount <= 0" class="send-again" @click="sendMail">
          Resend code
        </span>
      </div>
      <div>
        <div class="input-bor div-log-btn">
          <NConfigProvider :theme-overrides="themeOverrides">
            <NButton type="primary" round style="width:100%;" @click="login">
              continue
            </NButton>
          </NConfigProvider>
        </div>
      </div>
      <div class="use-o-t">
        Login by other means
      </div>
      <div class="l-i">
        <NGrid y-gap="20" :cols="4">
          <NGi v-show="googleLoginFlag" span="4" style="text-align:center;">
            <ClientOnly>

            <GoogleLogin :callback="callback">
              <div class="gl" />
            </GoogleLogin>
            </ClientOnly>
          </NGi>
          <!-- <NGi v-if="true" span="1" style="text-align:center;">
              <GoogleLogin :callback="callback" class="gl-ic" />
            </NGi> -->
          <!-- <NGi v-if="true" span="1">
              <div class="text-neutral-900 logo dark:text-neutral-100 login-icon twicon" />
            </NGi> -->
          <!-- <NGi v-if="false" span="4">
              <div class="text-neutral-900 logo dark:text-neutral-100 login-icon fficon" />
            </NGi>
            <NGi v-if="false" span="4">
              <div class="text-neutral-900 logo dark:text-neutral-100 login-icon qbicon" />
            </NGi> -->
        </NGrid>
      </div>
    </div>
  </div>
  <div v-if="isMobile" class="">
    <div class="">
      <div v-show="!isShow && !inputCode" class="h-full  relative">
        <NGrid y-gap="20" :cols="1" class="">
          <!-- <div v-show="!isShow && !inputCode" class="h-full border border-[#2c2c31] border-solid rounded-2xl relative">
        <NGrid y-gap="20" :cols="1" class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 "> -->
          <NGi span="1" style="text-align:center;">
            <div class="log-wel">
              Welcome
            </div>
            <div class="log-welt">
              Use a third-party login or email login
            </div>
          </NGi>
          <NGi v-show="googleLoginFlag" span="1" style="text-align:center;">
            <ClientOnly>

            <GoogleLogin :callback="callback" class="w-full bg-[#161532]">
              <div class="w-full h-[2.875rem] gl-mible relative border border-[#888893] border-solid rounded-[1.125rem] bg-[url('@/assets/images/gogleicon.png')] bg-[1rem_center] bg-no-repeat bg-[length:2rem_2rem]" />
            </GoogleLogin>
            </ClientOnly>
          </NGi>
          <NGi span="1">
            <NConfigProvider :theme-overrides="themeOverrides">
              <div class=" text-lg">
                <div class="input-bor input-bor-email">
                  <NInputGroup>
                    <NInput v-model:value="email" round placeholder="Enter your Email" @keyup.enter="sendMail" />
                  </NInputGroup>
                </div>
                <div class="input-bor">
                  <NButton type="primary" round style="width:100%;" @click="sendMail">
                    continue
                  </NButton>
                </div>
              </div>
            </NConfigProvider>
          </NGi>
          <NGi span="1">
            <div class="text-[#898894]">
              By signing up, you agree to the <span class="to-ts-pp" @click="toRouter('terms-of-service')">Terms of Service</span> and <span class="to-ts-pp" @click="toRouter('privacy-poilcy')">Privacy Policy</span> .
            </div>
          </NGi>
        </NGrid>
      </div>
      <div v-show="inputCode" class="h-full">
        <!-- <div v-show="inputCode" class="h-full border border-[#2c2c31] border-solid rounded-2xl relative"> -->
        <div class="back-btn text-base text-[#fff] font-bold absolute top-5 left-5" @click="goBack">
          <span class="inline-block align-middle">
            <common-svgIcon icon="tabler:arrow-left" />
          </span>
          <span class="inline-block align-middle ml-1">
            back
          </span>
        </div>
        <div class="w-full">
          <!-- <div class="w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 "> -->
          <div class="text-[#fe5997] text-[2rem] font-bold">
            Verify email
          </div>
          <div class="font-bold text-base text-[#fff]">
            A verification code has been sent to
          </div>
          <div class="font-bold text-base text-[#fff]">
            {{ email }} .Check your spam folder too!
          </div>
          <div class="ipcd mt-2">
            <common-login-inputCode v-model:emailCode="emailCode" />
          </div>
          <div class=" text-right text-white my-3">
            <span v-if="timecount > 0">
              {{ timecount > 0 ? `${timecount} s` : 'Resend code' }}
            </span>
            <span v-if="timecount <= 0" class=" font-bold" @click="sendMail">
              Resend code
            </span>
          </div>
          <div>
            <div class="">
              <NConfigProvider :theme-overrides="themeOverrides">
                <NButton type="primary" round style="width:100%;" @click="login">
                  continue
                </NButton>
              </NConfigProvider>
            </div>
          </div>
          <div class="mt-5 text-white text-center text-base">
            Login by other means
          </div>
          <div class=" mt-5">
            <NGrid y-gap="20" :cols="4">
              <NGi v-show="googleLoginFlag" span="4" style="text-align:center;">
                <ClientOnly>

                <GoogleLogin :callback="callback" class="w-full bg-[#161532]">
                  <div class="w-full h-[2.875rem] gl-mible relative border border-[#888893] border-solid rounded-[1.125rem] bg-[url('@/assets/images/gogleicon.png')] bg-[1rem_center] bg-no-repeat bg-[length:2rem_2rem]" />
                </GoogleLogin>
                </ClientOnly>
              </NGi>
            </NGrid>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.puzzlediv{
  width: 500px;
  margin: 0 auto;
  padding-bottom: 20px;
}
.puzzle{
  margin: 0 auto;
}
.logindiv{
  position: relative;
  left: 0;
  padding-bottom: 20px;
}
.logindiv2{
  position: relative;
  top: -200px;
  left: 0;
}
.login-icon{
  cursor: pointer;
  width: 60px;
  height: 60px;
  margin: 0 auto;
}
.ts-pp{
  width: 550px;
  margin: 0 auto;
  color: #898894;
  margin-top: 10px;
}
.to-ts-pp{
  color: #fff;
  cursor: pointer;
}
/* .ggicon{
  background: url('@/assets/images/gogleicon.png')center center no-repeat;
  background-size: 100% 100%;
}
.twicon{
  background: url('@/assets/images/tticon.png')center center no-repeat;
  background-size: 100% 100%;
}
.fficon{
  background: url('@/assets/images/fficon.png')center center no-repeat;
  background-size: 100% 100%;
} */
/* .qbicon{
  background: url('@/assets/images/qbicon.png')center center no-repeat;
  background-size: 100% 100%;
} */
.input-bor{
  margin-top: 30px;
}
.input-bor-email{
  margin-top: 5px;
}
.emial-div{
  width: 550px;
  width: 550px;
  margin: 0 auto;
  font-size: 18px;
}
.log-wel{
  color: #fe5997;
  font-size: 32px;
  font-weight: bold;
  font-weight: 650;
  font-style: normal;
}
.log-welt{
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}
.input-bor :deep(.n-input .n-input__input-el){
  height: 45px;
}
.input-bor :deep(.n-button){
  color: #fff;
  height: 45px;
}
.email-code-div{
  padding:0 60px 20px;
}
.log-senmsg{
  font-weight: 650;
    font-style: normal;
    font-size: 16px;
    color: #FFFFFF;
}
.ls-o{
  margin-top: 10px;
}
.email-code{
  height: 70px;
  margin: 30px 0 20px;
  text-align: center;
  vertical-align: middle;
  line-height: 70px;
}
.res-send{
  text-align: right;
  padding-right: 10px;
}
.send-again{
  cursor: pointer;
}
.div-log-btn{
  margin-top: 20px;
  font-size: 18px;
}
.code-qx{
  cursor: pointer;
  transform: translate(-60px, -40px);
  font-size: 16px;
  font-weight: bold;
  color: #898894;
}
.code-qx:hover{
  color: #fff;
}
.code-qx-icon{
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
}
.code-qx-text{
  display: inline-block;
  vertical-align: middle;
}
.use-o-t{
  margin-top: 35px;
  text-align: center;
  color: #fff;
}
.l-i{
  margin-top: 25px;
}
.ipcd :deep(.input-box){
  width: 100%;
  height: calc((100vw - 72px) / 6 );
}
</style>

<style>
.email-code-div span{
  color: #fff!important;
}
.gl{
  line-height: 48px;
  width: 550px;
  height: 46px;
  text-align:center;
  border: 1px #888893 solid;
  border-radius: 15px;
  background: url('@/assets/images/gogleicon.png') 30px center no-repeat;
  background-size: 30px 30px;
  background-color: #151532;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  margin: 0 auto;
}
.gl::before{
  content: "Sign in with Google";
  color: #d3d3d3;
  font-size: 18px;
  font-weight: 400;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  top: 50%;
}
.gl-mible::before{
  content: "Sign in with Google";
  color: #d3d3d3;
  font-size: 1.125rem;
  font-weight: 400;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  top: 50%;
  white-space: nowrap;
}
</style>
