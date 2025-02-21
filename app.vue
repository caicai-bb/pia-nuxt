<template>
  <div>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <NConfigProvider
      class="h-full"
      :theme="theme"
      :theme-overrides="themeOverrides"
      :locale="language"
    >
    <NMessageProvider>

    <NuxtPage />
    </NMessageProvider>
    </NConfigProvider>
  </div>
</template>
<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
// import { useAppStore } from '@/store'
const { language } = useLanguage()
const { theme, themeOverrides } = useTheme()

// debugger
// useAppStore().setBase({
//   baseApi: useRuntimeConfig().public.baseConfig.VITE_GLOB_API_URL,
//   baseUrl: useRuntimeConfig().public.baseConfig?.VITE_APP_API_BASE_URL,
// })
  // baseURL: useRuntimeConfig().public.baseConfig.VITE_GLOB_API_URL,
</script>
