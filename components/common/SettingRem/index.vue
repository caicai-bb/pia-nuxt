<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import About from './About.vue'
import aiModel from '@/views/mj/aiModel.vue'
import aiSetServer from '@/views/mj/aiSetServer.vue'
import { useAuthStore } from '@/store'
import { SvgIcon } from '@/components/common'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const authStore = useAuthStore()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

const active = ref('General')

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})
</script>

<template>
  <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px">
    <div>
      <General />
      <NTabs v-if="false" v-model:value="active" type="line" animated>
        <!-- <NTabPane name="General" tab="General">
          <template #tab>
            <SvgIcon class="text-l" icon="ri:file-user-line" />
            <span class="ml-2">{{ $t('setting.general') }}</span>
          </template>
          <div class="min-h-[100px]"> -->
        <!-- <General /> -->
        <!-- </div>
        </NTabPane> -->
        <NTabPane v-if="false" name="Advanced" tab="Advanced">
          <template #tab>
            <SvgIcon class="text-l" icon="ri:equalizer-line" />
            <!-- <span class="ml-2">{{ $t('setting.advanced') }}</span> -->
            <span class="ml-2">{{ $t('mjset.model') }}</span>
          </template>
          <div class="min-h-[100px]">
            <!-- <Advanced /> -->
            <aiModel />
          </div>
        </NTabPane>

        <NTabPane v-if="false" name="server" tab="server">
          <template #tab>
            <SvgIcon class="text-l" icon="mingcute:server-line" />
            <span class="ml-2">{{ $t('mjset.server') }}</span>
          </template>
          <aiSetServer />
        </NTabPane>
        <NTabPane v-if="false" name="Config" tab="Config">
          <template #tab>
            <SvgIcon class="text-l" icon="ri:list-settings-line" />
            <!-- <span class="ml-2">{{ $t('setting.config') }}</span> -->
            <span class="ml-2">{{ $t('mjset.about') }}</span>
          </template>
          <About />
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>
