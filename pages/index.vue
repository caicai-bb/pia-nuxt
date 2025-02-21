<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  NCarousel,
  NFlex, NGi, NGrid,
} from 'naive-ui'
import { useAppStore, useCodeStore, useUserStore, homeStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'


// import { router } from '@/router'
// const Nav = defineAsyncComponent(() => import('./common/layout.vue'))
// const NavMobile = defineAsyncComponent(() => import('./common/mobile/layoutMobile.vue'))
// const FooterMobile = defineAsyncComponent(() => import('./common/mobile/layoutFooterMobile.vue'))
// const HomeFoot = defineAsyncComponent(() => import('./common/homeFoot.vue'))
// homeStore.setMyData({session: {
  //       menuDisable: 'gallery',
  //       theme: 'dark'
  //     },})
  const appStore = useAppStore()
  const userStore = useUserStore()
  const codeStore = useCodeStore()

  appStore.setBase({
    baseApi: useRuntimeConfig().public.baseConfig.VITE_GLOB_API_URL,
    baseUrl: useRuntimeConfig().public.baseConfig?.VITE_APP_API_BASE_URL,
  })
  // appStore.setTheme('dark')
const { isMobile } = useBasicLayout()
const d1class = ref(true)
const d2class = ref(true)
const homeNav = ref(null)
const showLoginBtn = computed(() => {
  return (userStore.$state?.userInfo?.name ?? '未登录') == '未登录'
})
// const chatStore = useChatStore()
// const dialog = useDialog()
// const show = ref(false)
const collapsed = computed(() => appStore.siderCollapsed)

const router = useRouter()
const toRouter = (path: string) => {
  router.push(`/${path}`)
}
const toLogin = () => {
  if (homeNav.value)
    homeNav.value.isLogin = true
}
onMounted(() => {
  const c = router.currentRoute.value.query?.c
  if (c)
    codeStore.setInvitationCode(c)
})
onUnmounted(() => {

})
watch(
  isMobile,
  (val: boolean) => {
    appStore.setSiderCollapsed(val)

  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <div>
    <h1 class="w-0 h-0 opacity-0">
      THE AI THAT KNOWS YOU BEST
    </h1>
    <div v-if="!isMobile" class="h-d w-full h-full dark:bg-[#101029] bg-[#101029]">
      <div ref="scrollWrapperRef" class="h-d1 text-[#252525] dark:text-white dark:bg-[#101029] bg-[#ffffff]">
        <pub-header-nav
          ref="homeNav"
          is-active="home"
        />
        <div class="h-d1-1">
          <NGrid :cols="24">
            <NGi span="12">
              <div class="text-[#000000] dark:text-neutral-100 logo-bg" />
            </NGi>
            <NGi span="12">
              <div class="logo-text">
                <div :class="{ 'kyb1-move': d1class }" class="text-[#252525] dark:text-white">
                  <span>THE</span>
                  <span>AI</span>
                  <span>THAT</span>
                </div>
                <div :class="{ 'kyb-move': d1class }">
                  <span class="text-[#16fdec]">
                    KNOWS
                  </span>
                  <a class="text-[#245cfe]">Y</a>
                  <a class="text-[#fe5997]">O</a>
                  <a class="text-[#16fdec]">U</a>
                  {{ ' ' }}
                  <text class="text-[#fe5997]">
                    BEST
                  </text>
                </div>
              </div>
            </NGi>
          </NGrid>
        </div>
        <div class="h-d1-2">
          <div class="d2til ">
            <h2 class="text-white inline-block">
              Understanding
            </h2>
            <span>{{ ' ' }}</span>
            <span class="text-[#fe5997]">P</span>
            <span class="text-[#16fdec]">I</span>
            <span class="text-[#245cfe]">A</span>
          </div>
          <div id="d2con" class="d2con" :class="{ d2conFrames: d2class }">
            <h6>PIA(Personal Intelligence Assistant)leverages the power of generative AI driven by large language models (LLMs) to enable AI agents to make decisions and complete tasks autonomously with minimal human intervention. PIA envisions a network of vertical and personalized AI agents that can transform various industries and professions, turbo-charge human’s creative potential and productivity, and make artificial intelligence friends instead of foes to humanity.</h6>
          </div>
        </div>
        <div class="h-d1-3">
          <div class="d3til ">
            <h2>Innovative solutions</h2>
          </div>
          <div class="d4til">
            <h2 class="text-[#16fdec]">
              for Personal
            </h2>
          </div>
        </div>
        <div class="h-d1-4">
          <NGrid x-gap="30" :y-gap="30" :cols="24">
            <NGi span="12" class="divngi">
              <div class="text-[#000000] dark:text-neutral-100 divblcon">
                <div class="d41 ">
                  <h3>Real-time AI Image Generator</h3>
                </div>
                <div class="d41con">
                  <h4>A Real-time AI Image Generator instantly creates high-quality images from text or sketches, offering fast, customizable visuals for creative professionals.</h4>
                </div>
                <div class="img-btn">
                  <a class="sign sign-img-btn" @click="toRouter('pia?m=4')">
                    {{ $t('home.try-it-now') }}
                  </a>
                </div>
                <div class="d41img">
                  <NCarousel trigger="hover" autoplay :slides-per-view="3" :loop="true" :space-between="20" defaultValue="">
                    <img
                      class="carousel-img"
                      src="https://image.piax.org/images/01.png"
                      alt="Real-time AI Image Generator"
                    >
                    <img
                      class="carousel-img"
                      src="https://image.piax.org/images/02.png"
                      alt="Real-time AI Image Generator"
                    >
                    <img
                      class="carousel-img"
                      src="https://image.piax.org/images/03.png"
                      alt="Real-time AI Image Generator"
                    >
                    <img
                      class="carousel-img"
                      src="https://image.piax.org/images/04.png"
                      alt="Real-time AI Image Generator"
                    >
                    <img
                      class="carousel-img"
                      alt="Real-time AI Image Generator"
                      src="https://image.piax.org/images/05.jpeg"
                    >
                    <img
                      class="carousel-img"
                      src="https://image.piax.org/images/06.png"
                      alt="Real-time AI Image Generator"
                    >
                  </NCarousel>
                </div>
              </div>
            </NGi>

            <NGi span="12" class="divngi">
              <div class="text-[#000000] dark:text-neutral-100 divblcon">
                <div class="d41 ">
                  <h3>Be a Copywriter on any topic</h3>
                </div>
                <div class="d41con">
                  <h4>A copywriter writes engaging content on any topic to persuade people to take action, like buying something or learning more. It requires creativity and research.</h4>
                </div>
                <div class="img-btn">
                  <a class="sign sign-img-btn" @click="toRouter('pia?m=6')">
                    {{ $t('home.try-it-now') }}
                  </a>
                </div>
                <div class="d41img">
                  <NCarousel trigger="hover" autoplay :space-between="20">
                    <img
                      class="carousel-img"
                      src="https://image.piax.org/images/chat.jpg"
                      alt="Real-time AI Image Generator"
                    >
                  </NCarousel>
                </div>
              </div>
            </NGi>
          </NGrid>
        </div>
        <div class="h-d1-5">
          <div class="d2til ">
            <span class="text-white">Join the</span>
            <span>{{ ' ' }}</span>
            <span class="text-[#fe5997]">P</span>
            <span class="text-[#16fdec]">I</span>
            <span class="text-[#245cfe]">A</span>
            <span class="text-white"> Community</span>
          </div>
          <div class="div-jtpc">
            <div class="div-jtpc-t">
              <h5 class="text-white inline-block">
                Earn points today and get ready for the upcoming
              </h5>
              <span>{{ ' ' }}</span>
              <h5 class="text-[#16fdec] inline-block">
                rewards/airdrop
              </h5>
              <div>
                <div v-if="showLoginBtn" class="sign sign-kx" @click="toLogin">
                  {{ `${$t('home.Register')} & ${$t('home.SignIn')}` }}
                </div>
                <a class="sign" @click="toRouter('rewards')">
                  {{ `${$t('home.quest')} & ${$t('home.rewards')}` }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- <div style="height:200px;background:#000;" /> -->
        <pub-footer />
      </div>
    </div>
    <template v-if="isMobile">
      <div class="fixed inset-0 z-40 w-full h-full dark:bg-[#101029] bg-[#101029]">
        <mobile-pub-header-nav
          ref="homeNav"
          is-active="home"
        />
        <div class="w-full h-full text-white pt-[4.25rem] pb-12 ">
          <div class="w-full h-full overflow-y-auto flex flex-col">
            <div class="flex-1">
              <div class="logo-text-mobile mt-0 mx-1">
                <NFlex vertical align="center" :size="15" class="text-[#252525] dark:text-white text-4xl font-black pt-2  bg-gradient-to-b from-[#06060f] to-[#101029]">
                  <span>THE</span>
                  <span>AI</span>
                  <span>THAT</span>
                  <span class="text-[#16fdec]">KNOWS</span>
                  <span>
                    <text class="text-[#245cfe]">Y</text>
                    <text class="text-[#fe5997]">O</text>
                    <text class="text-[#16fdec]">U</text>
                    {{ ' ' }}
                    <text class="text-[#fe5997]">BEST</text>
                  </span>
                </NFlex>
                <NFlex vertical align="center" :size="15">
                  <div class=" mt-9  px-2">
                    <div class="border border-[#7d325d] border-solid rounded-2xl bg-[#161532] h-9 leading-9 text-center text-xl">
                      <span class="text-white">Understanding</span>
                      <span>{{ ' ' }}</span>
                      <span class="text-[#fe5997]">P</span>
                      <span class="text-[#16fdec]">I</span>
                      <span class="text-[#245cfe]">A</span>
                    </div>
                    <div class="text-xs leading-5 mt-5 px-1 text-[#D7D7D7]">
                      PIA(Personal Intelligence Assistant)leverages the power of generative AI driven by large language models (LLMs) to enable AI agents to make decisions and complete tasks autonomously with minimal human intervention. PIA envisions a network of vertical and personalized AI agents that can transform various industries and professions, turbo-charge human’s creative potential and productivity, and make artificial intelligence friends instead of foes to humanity.
                    </div>
                  </div>
                </NFlex>
                <div class=" mt-9 text-center text-2xl font-bold">
                  <div class=" ">
                    <span>Innovative solutions</span>
                  </div>
                  <div class=" mt-6">
                    <span class="text-[#16fdec]">for Personal</span>
                  </div>
                </div>
                <div class=" px-3 mt-6">
                  <NGrid x-gap="30" :y-gap="30" :cols="1">
                    <NGi span="1" class="">
                      <div class="text-[#000000] dark:text-neutral-100 border border-[#642a51] border-solid rounded-2xl bg-[#171634d1]">
                        <div class="px-4 text-center text-xl text-white mt-5 font-bold">
                          <span>Real-time AI Image Generator</span>
                        </div>
                        <div class=" text-[#D7D7D7] text-xs px-4 mt-5 leading-5">
                          A Real-time AI Image Generator instantly creates high-quality images from text or sketches, offering fast, customizable visuals for creative professionals.
                        </div>
                        <div class=" px-4 mt-4">
                          <a class=" px-7 rounded-2xl bg-[#fe5997] text-sm inline-block py-1" @click="toRouter('pia?m=4')">
                            {{ $t('home.try-it-now') }}
                          </a>
                        </div>
                        <div class=" mt-4 h-56 pb-5 px-2">
                          <NCarousel trigger="hover" autoplay :slides-per-view="3" :loop="true" :space-between="20">
                            <img
                              class="w-full h-full object-cover"
                              src="https://image.piax.org/images/01.png"
                            >
                            <img
                              class="w-full h-full object-cover"
                              src="https://image.piax.org/images/02.png"
                            >
                            <img
                              class="w-full h-full object-cover"
                              src="https://image.piax.org/images/03.png"
                            >
                            <img
                              class="w-full h-full object-cover"
                              src="https://image.piax.org/images/04.png"
                            >
                            <img
                              class="w-full h-full object-cover"
                              src="https://image.piax.org/images/05.jpeg"
                            >
                            <img
                              class="w-full h-full object-cover"
                              src="https://image.piax.org/images/06.png"
                            >
                          </NCarousel>
                        </div>
                      </div>
                    </NGi>
                    <NGi span="1" class="">
                      <div class="text-[#000000] dark:text-neutral-100 border border-[#642a51] border-solid rounded-2xl bg-[#171634d1]">
                        <div class="px-4 text-center text-xl text-white mt-5 font-bold">
                          <span>Be a Copywriter on any topic</span>
                        </div>
                        <div class=" text-[#D7D7D7] text-xs px-4 mt-5 leading-5">
                          A copywriter writes engaging content on any topic to persuade people to take action, like buying something or learning more. It requires creativity and research.
                        </div>
                        <div class=" px-4 mt-4">
                          <a class=" px-7 rounded-2xl bg-[#fe5997] text-sm inline-block py-1" @click="toRouter('pia?m=6')">
                            {{ $t('home.try-it-now') }}
                          </a>
                        </div>
                        <div class=" mt-4 h-56 pb-5 px-2">
                          <!-- <NCarousel trigger="hover" autoplay :space-between="20"> -->
                          <img
                            class="w-full h-full object-cover"
                            src="https://image.piax.org/images/chat.jpg"
                          >
                        <!-- </NCarousel> -->
                        </div>
                      </div>
                    </NGi>
                  </NGrid>
                </div>
                <div class=" mt-5 px-2">
                  <div class=" border border-[#2c2c31] border-solid rounded-2xl bg-[#161532] h-9 leading-9 text-center text-xl">
                    <span class="text-white">Join the</span>
                    <span>{{ ' ' }}</span>
                    <span class="text-[#fe5997]">P</span>
                    <span class="text-[#16fdec]">I</span>
                    <span class="text-[#245cfe]">A</span>
                    <span class="text-white"> Community</span>
                  </div>
                  <div class=" relative mt-5 mb-5 h-52 bg-join1-mob bg-center bg-no-repeat bg-cover bg-amt">
                    <div class=" w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm px-2">
                      <span class="text-white">Earn points today and get ready for the upcoming</span>
                      <span>{{ ' ' }}</span>
                      <span class="text-[#16fdec]">rewards/airdrop</span>
                      <div class="mt-5">
                        <div
                          v-if="showLoginBtn"
                          class="bg-[#171634d1] border border-[#fe5997] border-solid px-4 rounded-2xl inline-block text-xs py-1"
                          @click="toLogin"
                        >
                          {{ `${$t('home.Register')} & ${$t('home.SignIn')}` }}
                        </div>
                        <div class="mt-5">
                          <a class="bg-[#fe5997] px-4 rounded-2xl inline-block text-xs py-1" @click="toRouter('rewards')">
                            {{ `${$t('home.quest')} & ${$t('home.rewards')}` }}
                          </a>
                        </div>
                      </div>
                    </div>
                  <!-- <div :class="{ 'kyb1-move': d1class }" class="text-[#252525] dark:text-white text-4xl" />
              <div :class="{ 'kyb-move': d1class }" /> -->
                  </div>
                </div>
                <pub-footer />
              </div>
            </div>
            <mobile-pub-footer
              ref="homeNav"
              is-active="home"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
  <!-- <PromptStore v-model:visible="show" /> -->
</template>

<style scoped>
.h-d1{
  /* width: 1920px; */
  min-width: 1365px;
  margin: 0 auto;
  /* height: 3540px; */
  padding-top: 20px;
  background: linear-gradient( rgba(0, 0, 0, 1) 0,rgba(0, 0, 0, 1) 855px,
    rgba(16,16,41, 1) 855px,rgba(16,16,41, 1) 100%);
}
.h-d1-1{
  margin: 40px auto;
  width: 1360px;
}
.logo-bg:before {
  /* content: "";
  position: absolute;
  z-index: 100;
  top: 0;
  width: 200vw;
  height: 50px;
  background: linear-gradient( rgba(255, 255, 255, 0) 0%,rgba(255, 255, 255, 0.5) 50%,rgba(255, 255, 255, 0) 100%);
  transform: rotate(45deg);
  animation: scan-light 50s ease-in infinite; */
}
@keyframes scan-light {
  0% {
    right: -100vw;
  }
  2% {
    right: 40vw;
  }
  100%{
    right: 40vw;
  }
}
.logo-bg{
  border-radius: 50%;
  width: 680px;
  height: 680px;
  background: url('@/assets/images/pailogo.png') center center no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  /* animation: zhuan 50s linear infinite; */
}
@keyframes zhuan {
  from {
    transform: rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
 }
@keyframes fzhuan {
  from {
    transform: rotate(360deg);
  }
  to {
    transform:rotate(0deg);
  }
 }
@keyframes mover {
  0% {
    transform: translate(6.5px,0);
  }
  10%{

    transform: translate(-20px, 0);
  }
  100% {
    transform: translate(-20px, 0);
  }
 }
.text-p{
  position: relative;
  font-size: 1px;
  font-weight: 600;
  top: 245px;
  left: 260px;
  width: 80px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  animation: fzhuan 50s linear infinite;
}
.text-p::after{
  content: 'P';
}
.logo-text span{
  display: block;
  font-weight: 900;
}
.logo-text{
  margin-left: 135px;
  margin-top: 40px;
  font-family: Arial Black,Arial;
  font-size: 85px;
  line-height: 120px;
}

.kyb-move{
  position: relative;
  animation: show 1.5s ease-in 1;
  -webkit-animation: show 1.5s ease-in 1;
}
.kyb1-move{
  position: relative;
  /* 动画 */
  /* animation: float 1.5s ease-in 1; */
}
/* knows you best特效：从上到下 */
@keyframes show {
  from {
   opacity: 0;

  }
  to {
   opacity: 1;
  }
 }
@-webkit-keyframes show {
  from {
   opacity: 0;

  }
  to {
   opacity: 1;
  }
 }
 @keyframes float {
  0% {
    transform: translate(3px, 0);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    transform:scale(1,1);
    opacity: 1;
  }
}

/* 第二页 */
.h-d1-2{
  width: 1365px;
  margin: 110px auto 0;
}
.d2til{
  padding: 15px;
  border: 1px #fe5997 solid;
  border-radius: 20px;
  height: 70px;
  text-align: center;
  line-height: 40px;
  font-size: 40px;
  background: #171634d1;
}
.d2con{
  margin: 0 auto;
  width: 1365px;
  padding: 0 10px;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  color: #D3D3D4;
  margin-top: 30px;
}
.d2conFrames{
  animation: lefttoright 1.5s ease-in 1;

}
@keyframes lefttoright {
  0% {
    transform: translate(3px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
.h-d1-3{
  margin-top: 75px;
}
.d3til{
  height: 82px;
  text-align: center;
  line-height: 40px;
  font-size: 45px;
  font-weight: bold;
}
.d4til{
  margin: 0 auto;
  width: 1365px;
  text-align: center;
  line-height: 40px;
  font-size: 45px;
  font-weight: bold;
}
.h-d1-4{
  width: 1365px;
  margin: 0 auto;
  margin-top: 75px;
}
.divblcon{
  border: 1px #fe5997 solid;
  border-radius: 20px;
  width: 668px;
  height: 700px;
  background: #171634d1;
}
.d41{
  height: 40px;
  text-align: center;
  margin-top: 70px;
  margin-left: 84px;
  line-height: 40px;
  font-size: 35px;
  font-weight: bold;
  text-align: left;
}
.d41con{
  margin-top: 25px;
  width: 500px;
  margin-left: 84px;
  font-size: 18px;
  line-height: 22px;
  color: #D3D3D4;
}

.d41img{
  margin-top: 50px;
  width: 90%;
  height: 300px;
  margin-left: 5%;

}
.h-d1-5{
  margin: 75px auto 70px;
  width: 1365px;
}
.div-jtpc{
  margin-top: 25px;
  width: 1365px;
  height: 330px;
  background: url('@/assets/images/join1.jpg') center center no-repeat;
  animation: bgsize 20s ease-in-out infinite;
  animation-direction: alternate;
}
.bg-amt{
  animation: bgsize 20s ease-in-out infinite;
  animation-direction: alternate;
}
@keyframes bgsize {
  0% {
    background-size: 100% 100%;
  }
  100% {
    background-size: 150% 150%;
  }
}
.div-jtpc-t{
  width: 1200px;
  position: relative;
  left: 40px;
  top: 100px;
}
.sign:hover{
  background: #eb4e8a;
}
.sign{
  width: 190px;
  height: 40px;
  margin-top: 55px;
  background: #fe5997;
  color: aliceblue;
  line-height: 40px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
}
.sign-kx{
  margin-right: 30px;
  background: #171634d1;
  border: #fe5997 1px solid;
}
.sign-img-btn{
  margin-top: 0;
}
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-btn{
  margin-left: 84px;
  margin-top: 30px;
  height: 40px;
}
</style>
