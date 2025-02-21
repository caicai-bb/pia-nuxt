// import { useChat } from '@/views/chat/hooks/useChat'

import * as http from './home/index'
import { mjFetch } from './mjapi'
import { homeStore, useChatStore } from '@/store'

export const minimaxCallback = (chat: Chat.History) => {
  let cnt = 0
  const check = async () => {
    cnt++
    // const his = useChatStore().getChatHistoryByCurrentActive()
    const his = useChatStore().history.find((item: Chat.History) => item.uuid === chat.uuid)
    if (his) {
      if (his.progress && +his.progress <= 99) {
        const randomNum = Math.random() * 0.05 + 0.05
        const pro = (100 - (+his.progress)) * randomNum + his.progress
        useChatStore().updateHistory(chat.uuid, { progress: pro })
      }
    }
    // if (!chat.mjID) {
    //   chat.text += '\nThere was an error there, please try again'
    //   chat.loading = false
    //   homeStore.setMyData({ act: 'updateTask', actData: chat })
    //   return
    // }
    const params = {
      device: {
        osPlatform: 'web',
      },
      taskId: chat.uuid,
    }
    const ts = await mjFetch('/ai-api/ai/task/get', params)
    let opt = ts?.task?.output ? JSON.parse(ts?.task.output) : {}
    // 生成失败
    if (opt.status === 'Fail')
      return
    opt = { ...opt, taskStatus: ts.task.status }

    if (ts?.task?.status === 'success')
      useChatStore().updateHistory(chat.uuid, { imageUrl: ts?.task?.outputFileUrl })

    if (!['FAILURE', 'SUCCESS', 'success', 'failed'].includes(ts?.task?.status) && cnt < 100)
      setTimeout(() => check(), 5000)
    else
      http.getUserTokenAccount()
  }
  check()
}
const backOpt = (d: any) => {
  minimaxCallback(d)
}
export const minimaxGen = async (data: any) => {
  let d: any

  try {
    const bdata = {
      agentId: homeStore.myData.agentId,
      device: {
        osPlatform: 'web',
      },
      productNo: 'pia',
      ...data,
    }
    d = await mjFetch('/ai-api/minimax/video/gen', bdata)

    if (d.code == 409) { // token不足 去兑换
      http.getUserTokenAccount()

      homeStore.setMyData({ toRedeem: true })
    }

    else if (d.code == 1) {
      const ct = Date.now()
      const his: Chat.History = {
        uuid: d.taskId,
        title: '',
        conversationId: '',
        isEdit: false,
        creatTime: ct,
        ...data,
        progress: 5,
      }
      useChatStore().addHistory(his, [])
      useChatStore().setActive(d.taskId)
      backOpt(his)
    }
    else if (d.code == 0) {

    }
    else {

    }
  }
  catch (e: any) {
    http.getUserTokenAccount()
  }
}
