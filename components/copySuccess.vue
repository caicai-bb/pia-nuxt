<script setup lang='ts'>
import { computed, ref, defineProps,
  defineEmits } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NModal, useMessage } from 'naive-ui'

import { useAuthStore, useCodeStore, useUserStore } from '@/store'
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
// const userCodeStore = useCodeStore()
// const ms = useMessage()
interface Props {
  visible: boolean
  invitationUrl: string
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}
// const themeOverrides: GlobalThemeOverrides = {
//   common: {
//     primaryColor: '#fe5997',
//     primaryColorHover: '#eb4e8a',
//     primaryColorPressed: '#fe5997',
//   },
//   Button: {
//     textColor: '#fff',
//   },
// }
// const userStore = useUserStore()
// const authStore = useAuthStore()

// const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
const show1 = computed({
  get() {
    return props.invitationUrl
  },

})
const isShow = ref(true)
</script>

<template>
  <div class="ccssd">
    <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
      <div class="c-r-a">
        <div class="c-r-a-icon">
          <common-svgIcon icon="mdi:checkbox-marked-circle-outline" />
        </div>
        <div class="c-r-a-text">
          Link copied to clipboard! Send it to everyone！
        </div>
        <div class="c-r-a-text c-r-a-w">
          {{ show1 }}
        </div>
      </div>
    </NModal>
  </div>
</template>

<style scoped>
.c-r-a-icon{
  text-align: center;
  font-size: 150px;
  color: #fe5997;
  width: 150px;
  margin: 0 auto;
}
.c-r-a-text{
  font-size: 26px;
  margin: 20px 0;
  color: #fff;
  text-align: center;
}
.c-r-a-w{
  font-size: 16px;
}
</style>
