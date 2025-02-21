<script setup lang='ts'>
import { computed, reactive, ref, defineProps } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import {
  NConfigProvider, NDrawer, NDrawerContent,
  NFlex,
} from 'naive-ui'

const router = useRouter()
const props = defineProps({
  isActive: {
    type: String,
    required: true,
    default: 'Home',
  },
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

const rouShow = ref(false)
const setRouShow = (flag: boolean) => {
  rouShow.value = flag
}

const navList = reactive([
  'home', 'rewards', 'pia',
])
function toRouter(path: string) {
  router.push(`/${path}`)
}

// defineExpose({

// })
</script>

<template>
  <div class="nv w-full fixed left-0 top-0  z-2 px-2 pt-2">
    <div class="w-full h-full h-12 rounded-2xl border border-[#2c2c31] border-solid bg-[#171634d1] px-5">
      <NFlex justify="space-between">
        <a class="h-full text-xl font-bold leading-[3rem]" @click="toRouter('')">
          <span class="text-[#fe5997]">P</span>
          <span class="text-[#16fdec]">I</span>
          <span class="text-[#245cfe]">A</span>
        </a>
        <span class="w-[2rem] h-[2rem] bg-tdesign--view-list bg-center bg-no-repeat bg-cover mt-2" @click="setRouShow(true)" />
      </NFlex>
    </div>
    <div class=" mt-2 border-b border-b-[#501f38] border-solid" />
    <NConfigProvider
      :theme-overrides="themeOverrides"
    >
      <NDrawer v-model:show="rouShow" width="80%" placement="right">
        <NDrawerContent title="" closable>
          <NFlex vertical align="stretch" :size="30" class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <template v-for="item in navList" :key="`${item}nva`">
              <a
                class="text-neutral-900 dark:text-neutral-100 text-xl font-bold "
                :class="[isActive == item ? 'text-pick' : '']"
                @click="toRouter(item)"
              >
                {{ $t(`home.${item}`) }}
              </a>
            </template>
          </NFlex>
        </NDrawerContent>
      </NDrawer>
    </NConfigProvider>
  </div>
</template>

<style scoped>
.text-pick{
  color: #fe5997!important;
}
</style>
