<script setup lang='ts'>
import { computed, defineAsyncComponent, defineProps, defineEmits } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, NModal } from 'naive-ui'
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
// const Login = defineAsyncComponent(() => import('@/components/common/login/login.vue'))
interface Props {
  visible: boolean
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const themeOverrides = computed<GlobalThemeOverrides>(() => {
  return {
    common: {
      primaryColor: '#fe5997',
      primaryColorHover: '#fe5997',
      primaryColorPressed: '#fe5997',
      modalColor: '#101029',
      baseColor: '#fe5997',
    },
  }
})
const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const loginTrue = (path: string) => {
  show.value = false
}
</script>

<template>
  <div class="ccssd">
    <NConfigProvider
      :theme-overrides="themeOverrides"
    >
      <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 730px; min-height:300px;">
        <div class="">
          <common-login-main v-if="show" v-model:visible="show" :login-true="loginTrue" />
        </div>
      </NModal>
    </NConfigProvider>
  </div>
</template>

<style scoped>

</style>
