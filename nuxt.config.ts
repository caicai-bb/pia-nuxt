// https://nuxt.com/docs/api/configuration/nuxt-config

import { loadEnv } from 'vite'

const envScript = process.env.npm_lifecycle_script.split(' ')
const envName = envScript[envScript.length - 1] // 通过启动命令区分环境

const envData = loadEnv(envName, 'env') as unknown as VITE_ENV_CONFIG
console.log(envScript)
console.log(envData)
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss', // 确保这是你的模块数组中的第一个元素，以便正确加载配置文件。
  ],
  runtimeConfig: {
    public: {
      baseConfig: envData,
      // baseApi: process.env.NUXT_PUBLIC_GLOB_API_URL || '',
      // baseUrl: process.env.NUXT_PUBLIC_APP_API_BASE_URL || '',
    }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://192.168.3.200:10200/api', // 目标服务器地址
        changeOrigin: true,
      }
    },
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer',
            // "date-fns"
          ]
        : ['@juggle/resize-observer']
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc']
          : []
    }
  },
  devtools: { enabled: true }
})
