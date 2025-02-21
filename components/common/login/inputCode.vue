<script lang="ts" setup>
// vue 3.x setup 模式
import { defineEmits, defineProps, nextTick, onMounted, ref, watch, withDefaults } from 'vue'

interface IProps {
  emailCode: number | any
}

const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits(['update:emailCode'])

const emptyArray = new Array(6).fill('')
const inputElement = ref<any[]>(emptyArray.map(ref))
const inputValue = ref<any[]>(emptyArray.map(() => ''))

onMounted(() => {
  resetValue(props.emailCode)
  nextTick(() => {
    inputEl('Home')?.focus()
  })
})

watch(() => props.emailCode, () => {
  resetValue(props.emailCode)
})

// 设置第N个输入框的值
function setInputValue(index: number, value: null | number) {
  inputValue.value.splice(index, 1, value)
}

// 获取第N个输入框的dom元素
function inputEl(type: 'Home' | 'End' | number): HTMLInputElement {
  const index = type === 'Home' ? 0 : type === 'End' ? inputElement.value.length - 1 : type

  const firstInputRef = inputElement.value[index]
  return firstInputRef.value[0]
}

function resetValue(str: string) {
  if (str?.length === emptyArray?.length)
    inputValue.value = str.split('')

  else
    inputValue.value = emptyArray.map(() => '')
}

function onKeyup(e: any) {
  const index = e.target.dataset.index * 1
  const el = e.target

  if (e.code === 'Backspace') {
    setInputValue(index, null)

    if (el.previousElementSibling)
      el.previousElementSibling.focus()
  }
  else if (e.code === 'Delete') {
    setInputValue(index, null)
    if (el.nextElementSibling)
      el.nextElementSibling.focus()
  }
  else if (e.code === 'Home') {
    inputEl('Home').focus()
  }
  else if (e.code === 'End') {
    inputEl('End').focus()
  }
  else if (e.code === 'ArrowLeft') {
    if (el.previousElementSibling)
      el.previousElementSibling.focus()
  }
  else if (e.code === 'ArrowRight') {
    if (el.nextElementSibling)
      el.nextElementSibling.focus()
  }

  if (inputValue.value.join('').length === emptyArray.length)
    emit('update:emailCode', inputValue.value.join(''))
}

function onPaste(e: any) {
  // 当进行粘贴时
  e.clipboardData.items[0].getAsString((str: string) => resetValue(str))
}

function onInput(e: any) {
  const index = e.target.dataset.index * 1
  const old = inputValue.value[index]
  const el = e.target
  const value = e.data
  if (/^\d$/.test(value)) {
    setInputValue(index, value * 1)
    if (index === emptyArray.length - 1) {
      if (inputValue.value.join('').length === emptyArray.length)
        emit('update:emailCode', inputValue.value.join(''))
    }
    else if (el.nextElementSibling) {
      el.nextElementSibling.focus()
    }
  }
  else {
    if (value) {
      el.value = old
      setInputValue(index, old)
    }
  }
}
</script>

<template>
  <div class="input-box">
    <div
      class="input-content"
    >
      <input
        v-for="(_, index) in inputValue"
        :ref="inputElement[index]"
        :key="index"
        v-model="inputValue[index]"
        :data-index="index"
        type="number"
        max="9"
        min="0"
        maxlength="1"
        @keyup="onKeyup"
        @paste="onPaste"
        @input="onInput"
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.input-box {
  width: 530px;
  height: 80px;
  .input-content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    input {
      color: inherit;
      font-family: inherit;
      border: 0;
      outline: 0;
      // border-bottom: 1px solid #919191;
      border-radius: 10px;
      width: calc(16.66% - 2%);
      height: 100%;
      font-size: 44px;
      text-align: center;
      color: #fff;
      background: #171634d1;
      border: 1px #8e8d9a solid;
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
}
</style>
