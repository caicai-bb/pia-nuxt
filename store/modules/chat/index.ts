import { defineStore } from 'pinia'
import { defaultState, getLocalState, setLocalState } from './helper'
// import { mlog } from '@/api'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(),

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },

    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number | string) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    setUsingContext(context: boolean) {
      this.usingContext = context
      this.recordState()
    },

    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      // 加入历史会话
      this.history.unshift(history)
      this.chat.unshift({ uuid: history.uuid, data: chatData })
      // this.history.push(history)
      // this.chat.push({ uuid: history.uuid, data: chatData })
      // 设置默认会话
      // this.active = history.uuid
      this.reloadRoute(history.uuid)
    },
    addHistoryForPush(history: Chat.History, chatData: Chat.Chat[] = []) {
      // 加入历史会话
      // this.history.unshift(history)
      // this.chat.unshift({ uuid: history.uuid, data: chatData })
      this.history.push(history)
      this.chat.push({ uuid: history.uuid, data: chatData })
      // 设置默认会话
      // this.active = history.uuid
      this.reloadRoute(history.uuid)
    },

    updateHistory(uuid: number | string, edit: Partial<Chat.History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.recordState()
      }
    },

    async deleteHistoryById(uuid: number | string) {
      if (this.history.length > 0) {
        const hisToryIndex = this.history.findIndex(item => item.uuid === uuid)
        this.history.splice(hisToryIndex, 1)
        if (this.history.length > 0)
          this.active = this.history[0].uuid

        return await this.reloadRoute()
      }
    },
    async deleteHistory(index: number) {
      this.history.splice(index, 1)
      this.chat.splice(index, 1)

      if (this.history.length === 0) {
        this.active = null
        this.reloadRoute()
        return
      }

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
        return
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          this.active = uuid
          this.reloadRoute(uuid)
        }
      }

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
      }
    },

    async setActive(uuid: number | string) {
      this.active = uuid
      return await this.reloadRoute(uuid)
    },

    getChatByUuidAndIndex(uuid: number | string, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    addChat(uuid: number | string, chat: Chat.Chat) {
      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        // if (this.history[index].title === 'New Chat')
        //   this.history[index].title = chat.text
        this.recordState()
      }
      else {
        this.chat.push({ uuid, data: [chat] })
      }
    },
    addChatDall(uuid: number | string, chat: Chat.Chat) {
      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.unshift(chat)
        // if (this.history[index].title === 'New Chat')
        //   this.history[index].title = chat.text
        this.recordState()
      }
      else {
        this.chat.push({ uuid, data: [chat] })
      }
    },
    addChatByUuid(uuid: number | string, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now()
          this.history.push({ uuid, title: chat.text, isEdit: false, conversationId: chat?.conversationId ?? '' })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          // if (this.history[0].title === 'New Chat')
          //   this.history[0].title = chat.text
          this.recordState()
        }
      }
      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        // if (this.history[index].title === 'New Chat')
        //   this.history[index].title = chat.text
        this.recordState()
      }
      else {
        this.chat.push({ uuid, data: [chat] })
      }
    },

    updateChatByUuid(uuid: number | string, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        this.recordState()
      }
    },
    upChatUuid(uuid: number | string, newUuid: number | string) {
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].uuid = newUuid
        this.recordState()
      }
    },
    updateChatSomeByUuid(uuid: number | string, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    deleteChatByUuid(uuid: number | string, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1)
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1)
        this.recordState()
      }
    },

    clearChatByUuid(uuid: number | string) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = []
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.recordState()
      }

      // 清空标题
      // const i2 = this.history.findIndex(v => v.uuid === uuid)
      // if (i2 !== -1) {
      //   this.history[i2].title = 'New Chat'
      //   this.recordState()
      // }
      // end 清空标题
    },
    setSuggestion(sug: Array<T>) {
      this.suggestion = sug
    },
    getSuggestion() {
      return this.suggestion
    },
    clearChat() {
      this.chat = []
      this.recordState()
    },
    clearHistory() {
      this.$state = { ...defaultState() }
      this.recordState()
    },

    async reloadRoute(uuid?: number | string) {
      this.recordState()
      // mlog('toMyuid19', 'reloadRoute')
      // await sleep(1000)
      // 刷新路由附带当前聊天uuid
      // await router.push({ name: homeStore.myData.local == 'draw' ? 'draw' : 'Chat', params: { uuid } })
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
