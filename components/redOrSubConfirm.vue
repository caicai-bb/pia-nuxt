<script setup lang='ts'>
import { computed, defineProps,
  defineEmits } from 'vue'
import { NModal } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useUserStore } from '@/store'
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const { isMobile } = useBasicLayout()
interface Props {
  visible: boolean
  textList: Array<T>
  confirm: Function
}
interface Emit {
  (e: 'update:visible', visible: boolean): void
}
const userStore = useUserStore()
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
  <div class="ccssd">
    <NModal v-model:show="show" :auto-focus="false" preset="card" style="width: 95%; max-width: 720px">
      <div class="c-r-a">
        <div class="c-r-a-icon" />

        <div :class="[isMobile ? 'mt-4' : 'c-r-a-w']">
          <div :class="[isMobile ? ' text-xl font-semibold text-left px-4 text-white' : 'c-r-a-text']">
            Your current remaining points are {{ userStore.userInfo?.balance ?? 0 }}, you can redeem or continue to subscribe
          </div>
        </div>
        <div :class="[isMobile ? 'mb-4 text-right' : 'c-r-a-btn']">
          <div
            :class="[isMobile ? 'border border-[#fe5997] border-solid rounded-2xl px-4 mt-4 py-1 text-center text-lg inline-block mr-4'
              : 'crabtn-div crd-back']" @click="confirm('Redeem')"
          >
            Redeem
          </div>
          <div
            :class="[isMobile ? 'bg-[#fe5997] rounded-2xl px-4 py-1 mt-4 text-center text-lg inline-block mr-4'
              : 'crabtn-div crd-confirm']" @click="confirm('Subscribe')"
          >
            Subscribe
          </div>
        </div>
      </div>
    </NModal>
  </div>
</template>

<style scoped>
.c-r-a-icon{
  text-align: center;
  font-size: 150px;
  background: url('https://image.piax.org/images/icon/alert.png')center center no-repeat;
  background-size: 100% 100%;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}
.c-r-a-text{
  font-size: 24px;
  font-weight: 650;
  text-align: left;
  padding-left: 25px;
  line-height: 30px;
  color: #fff;
}
.c-r-a-w{
  margin-top: 40px;
}
.c-r-a-btn{
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: right;
}
.crabtn-div{
  width: 140px;
  height: 45px;
  line-height: 45px;
  display: inline-block;
  vertical-align: middle;
  color: #fff;
  font-size: 18px;text-align: center;
  cursor: pointer;
}
.crd-back{
  border: 1px #fe5997 solid;
  border-radius: 15px;
  margin-right: 20px;
}
.crd-back:hover{
  border-color: #eb4e8a;
}
.crd-confirm{
  background:#fe5997;
  border-radius: 15px;
}
.crd-confirm:hover{
  background: #eb4e8a;
}
</style>
