import { toRaw } from '@vue/reactivity'
import axios from 'axios'
import type { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { mlog, myTrim } from './mjapi'
import { fetchSSE } from './sse/fetchsse'
import { localGet, localSaveAny } from './mjsave'
import { chatSetting } from './chat'
import { ideoSubmit } from './ideo'
import * as http from './home/index'
import { isNumber, isObject } from '@/utils/is'
import { t } from '@/locales'
import { gptConfigStore, gptServerStore, homeStore, useAuthStore, useChatStore } from '@/store'
// import {encode,  encodeChat}  from "gpt-tokenizer"
// import {encode,  encodeChat} from "gpt-tokenizer/cjs/encoding/cl100k_base.js";
// import { get_encoding } from '@dqbd/tiktoken'
// import FormData from 'form-data';

export const KnowledgeCutOffDate: Record<string, string> = {
  'default': '2021-09',
  'gpt-4-1106-preview': '2023-04',
  'gpt-4-0125-preview': '2023-12',
  'gpt-4-vision-preview': '2023-04',
  'gpt-4-turbo-2024-04-09': '2023-12',
  'gpt-4o-2024-05-13': '2023-10',
  'o1-preview-2024-09-12': '2023-10',
  'o1-preview': '2023-10',
  'o1-mini': '2023-10',
  'o1-mini-2024-09-12': '2023-10',
  'gpt-4o': '2023-10',
  'gpt-4o-mini': '2023-10',
  'gpt-4o-mini-2024-07-18': '2023-10',
  'gpt-4o-2024-08-06': '2023-10', // chatgpt-4o-latest
  'chatgpt-4o-latest': '2023-10',
  'gpt-4o-2024-11-20': '2023-10',
  'gpt-4-turbo': '2023-12',
  'gpt-4-turbo-preview': '2023-12',
  'claude-3-opus-20240229': '2023-08',
  'claude-3-sonnet-20240229': '2023-08',
  'claude-3-haiku-20240307': '2023-08',
  'claude-3-5-sonnet-20240620': '2024-04',
  'claude-3-5-sonnet-20241022': '2024-04',
  'gemini-pro': '2023-12',
  'gemini-pro-vision': '2023-12',
  'gemini-pro-1.5': '2024-04',
}

const getUrl = (url: string) => {
  if (url.indexOf('http') == 0)
    return url
  if (url.indexOf('/ai-api') == 0)
    return import.meta.env.VITE_GLOB_API_URL + url
  if (gptServerStore.myData.OPENAI_API_BASE_URL)
    return `${gptServerStore.myData.OPENAI_API_BASE_URL}${url}`

  return `/openapi${url}`
  // return url
}
export const gptGetUrl = getUrl
export const gptFetch = (url: string, data?: any, opt2?: any) => {
  mlog('gptFetch', url)
  let headers = { 'Content-Type': 'application/json' }
  if (opt2 && opt2.headers)
    headers = opt2.headers

  headers = { ...headers, ...getHeaderAuthorization() }
  return new Promise<any>((resolve, reject) => {
    const opt: RequestInit = { method: 'GET' }
    opt.headers = headers
    opt.signal = data?.signal
    if (opt2?.upFile) {
      opt.method = 'POST'
      opt.body = data as FormData
    }
    else if (data) {
      opt.body = JSON.stringify(data)
      opt.method = 'POST'
    }
    fetch(getUrl(url), opt)
      .then(d => d.json().then(d => resolve(d))
        .catch(e => reject(e)))
      .catch(e => reject(e))
  })
}

export const regCookie = async (n: string) => {
  if (n == '')
    return
    // mlog('regCookie:', n)
  const headers = { 'Content-Type': 'application/json', 'x-vtoken': n }
  // headers={...headers,...getHeaderAuthorization()}
  const opt: RequestInit = { method: 'GET' }
  opt.headers = headers
  const ck = await new Promise<any>((resolve, reject) => {
    fetch('/api/reg', opt)
      .then(d => d.json().then(d => resolve(d))
        .catch(e => reject(e)))
      .catch(e => reject(e))
  })
  homeStore.setMyData({ ctoken: ck.ctoken })

  mlog('regCookie:', ck, n)
}
// 前端直传 cloudflare r2
function uploadR2(file: File) {
  return new Promise<any>((resolve, reject) => {
    // 预签名
    axios.post(gptGetUrl('/pre_signed'), { file_name: file.name, content_type: file.type }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.data.status == 'Success') {
        const signedUrl = response.data.data.up
        // 上传
        fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        }).then((res2) => {
          if (res2.ok) {
            console.log('Upload successful!', response.data.data.url)
            return resolve({ url: response.data.data.url })
          }
          else {
            return reject(res2)
          }
        }).catch((error) => {
          return reject(error)
        })
      }
      else {
        return reject(response.data)
      }
    },
    ).catch(error => reject(error))
  })
}

export const GptUploader = (_url: string, FormData: FormData) => {
  // R2上传
  const upLoaderR2 = () => {
    const file = FormData.get('file') as File
    return uploadR2(file)
  }

  // 执行上传
  const uploadNomalDo = (url: string, headers: any) => {
    return new Promise<any>((resolve, reject) => {
      axios.post(url, FormData, {
        headers,
      }).then(response => resolve(response.data),
      ).catch(error => reject(error))
    })
  }

  // 除R2外默认流程
  const uploadNomal = (url: string) => {
    url = gptServerStore.myData.UPLOADER_URL ? gptServerStore.myData.UPLOADER_URL : gptGetUrl(url)
    let headers = { 'Content-Type': 'multipart/form-data' }
    if (gptServerStore.myData.OPENAI_API_BASE_URL && url.includes(gptServerStore.myData.OPENAI_API_BASE_URL)) {
      headers = { ...headers, ...getHeaderAuthorization() }
    }
    else {
      const authStore = useAuthStore()
      if (authStore.token) {
        const header2 = { 'x-ptoken': authStore.token }
        headers = { ...headers, ...header2 }
      }
    }
    if (homeStore.myData.vtoken) {
      const vtokenh = { 'x-vtoken': homeStore.myData.vtoken }
      headers = { ...headers, ...vtokenh }
    }
    return uploadNomalDo(url, headers)
  }

  // 处理上传流程
  const uploadType = ((homeStore.myData.session.uploadType ?? '') as string).toLocaleLowerCase()
  let headers = { 'Content-Type': 'multipart/form-data' }

  // R2
  if (uploadType == 'r2') {
    return upLoaderR2()
    // 容器
  }
  else if (uploadType == 'container') {
    const authStore = useAuthStore()
    if (authStore.token) {
      const header2 = { 'x-ptoken': authStore.token }
      headers = { ...headers, ...header2 }
    }
    const url = `/openapi${_url}`
    return uploadNomalDo(url, headers)

    // 前端API
  }
  else if (uploadType == 'api') {
    headers = { ...headers, ...getHeaderAuthorization() }
    const url = `${gptServerStore.myData.OPENAI_API_BASE_URL}${_url}`
    return uploadNomalDo(url, headers)

    // 自定义链接
  }
  else if (uploadType == 'myurl') {
    return uploadNomalDo(_url, headers)
  }

  // 默认上传流程
  if (homeStore.myData.session.isUploadR2)
    return upLoaderR2()

  return uploadNomal(_url)
}

export const whisperUpload = (FormData: FormData) => {
  const url = gptGetUrl('/v1/audio/transcriptions')
  let headers = { 'Content-Type': 'multipart/form-data' }
  headers = { ...headers, ...getHeaderAuthorization() }
  return new Promise<any>((resolve, reject) => {
    axios.post(url, FormData, {
      headers,
    }).then(response => resolve(response.data),
    ).catch(error => reject(error))
  })
}

export const subGPT = async (data: any, chat: Chat.Chat) => {
  let d: any
  const action = data.action
  // chat.myid=  `${Date.now()}`;
  if (action == 'gpt.dall-e-3' && data.data && data.data.model && data.data.model.includes('ideogram')) { // ideogram
    mlog('ddlog 数据 ', data.data)
    try {
      const d = await ideoSubmit(data.data)
      mlog('ddlog 数据返回 ', d)
      const rz = d[0]
      chat.text = rz.prompt// rz.p??`success`;
      chat.opt = { imageUrl: rz.url }
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    }
    catch (e) {
      // chat.text='失败！'+"\n```json\n"+JSON.stringify(d, null, 2)+"\n```\n";
      chat.text = '失败！' + `\n\`\`\`json\n${e}\n\`\`\`\n`
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    }
  }
  else if (action == 'gpt.dall-e-3') { // 执行变化
    // chat.model= 'dall-e-3';
    const dt = { ...data.data, signal: data?.signal, device: { osPlatform: 'web' }, productNo: 'pia' }
    const dd = await gptFetch('/ai-api/ai/images/generations', dt)
    try {
      if (dd.code === 409) {
        // token不够去兑换
        chat.text = dd.message
        chat.loading = false
        setTimeout(() => {
          homeStore.setMyData({ act: 'updateChat', actData: chat })
          homeStore.setMyData({ toRedeem: true })
        }, 1500)
        return
      }
      else if (dd.code === 0) {
        chat.text = dd.message
        chat.loading = false
        homeStore.setMyData({ act: 'updateChat', actData: chat })
      }
      else {
        const d = dd.result
        const rz: any = d.data[0]
        chat.text = rz.revised_prompt ?? data.data.prompt ?? ''
        if (data?.data?.model && (data.data.model === 'flux' || data.data.model === 'flux-dev' || data.data.model === 'flux-pro')) {
          const ct = Date.now()
          chat.opt = {
            size: data.data.size,
            model: data.data.model,
            prompt: data.data.prompt,
            imageUrl: rz.url,
            creatTime: ct,
          }
          const his: Chat.History = {
            size: data.data.size,
            model: data.data.model,
            prompt: data.data.prompt,
            imageUrl: rz.url,
            uuid: dd.traceId,
            title: '',
            conversationId: '',
            isEdit: false,
            creatTime: ct,
          }
          useChatStore().addHistory(his, [chat])
          useChatStore().setActive(dd.traceId)
        }
        else {
          chat.opt = { imageUrl: rz.url }
        }
        chat.loading = false
        homeStore.setMyData({ act: 'updateChat', actData: chat })
        http.getUserTokenAccount()
      }
    }
    catch (e) {
      // chat.text='失败！'+"\n```json\n"+JSON.stringify(d, null, 2)+"\n```\n";
      chat.text = 'error！' + `\n\`\`\`json\n${d ? JSON.stringify(d, null, 2) : e}\n\`\`\`\n`
      chat.loading = false
      homeStore.setMyData({ act: 'updateChat', actData: chat })
    }
  }
}

export const isDallImageModel = (model: string | undefined) => {
  if (!model)
    return false
  if (model.includes('flux'))
    return true
  if (model.includes('Flux'))
    return true
  if (model.includes('ideogram'))
    return true
  if (model.includes('ideogram'))
    return true
  // if (model.includes('Midjourney'))
  //   return true
  if (model.includes('Dall') && model.includes('E-3'))
    return true
  return ['dall-e-2', 'dall-e-3', 'ideogram'].includes(model)
}

interface subModelType {
  message: any[]
  onMessage: (d: { text: string; isFinish: boolean; isAll?: boolean }) => void
  onError?: (d?: any) => void
  signal?: AbortSignal
  model?: string
  uuid?: string | number
}
function getHeaderAuthorization() {
  let headers = {}
  if (homeStore.myData.vtoken) {
    const vtokenh = { 'x-vtoken': homeStore.myData.vtoken, 'x-ctoken': homeStore.myData.ctoken }
    headers = { ...headers, ...vtokenh }
  }
  if (!gptServerStore.myData.OPENAI_API_KEY) {
    const authStore = useAuthStore()
    if (authStore.token) {
      const bmi = { 'x-ptoken': authStore.token }
      const piaToken = { Authorization: authStore.token }
      headers = { ...headers, ...bmi, ...piaToken }
      return headers
    }
    return headers
  }
  const bmi = {
    Authorization: `Bearer ${gptServerStore.myData.OPENAI_API_KEY}`,
  }
  headers = { ...headers, ...bmi }
  return headers
}

export const getSystemMessage = (uuid?: number) => {
  // KnowledgeCutOffDate
  let sysTem = gptConfigStore.myData.systemMessage
  if (uuid) {
    const chatS = new chatSetting(uuid)
    sysTem = chatS.getGptConfig().systemMessage
  }
  if (sysTem)
    return sysTem
  const model = gptConfigStore.myData.model ? gptConfigStore.myData.model : 'gpt-3.5-turbo'
  let producer = 'You are ChatGPT, a large language model trained by OpenAI.'
  if (model.includes('claude'))
    producer = 'You are Claude, a large language model trained by Anthropic.'
  if (model.includes('gemini'))
    producer = 'You are Gemini, a large language model trained by Google.'
    // 用户自定义系统
  if (homeStore.myData.session.systemMessage)
    producer = homeStore.myData.session.systemMessage

  let DEFAULT_SYSTEM_TEMPLATE = `${producer}`

  if (KnowledgeCutOffDate[model] || model.includes('gpt-')) {
    DEFAULT_SYSTEM_TEMPLATE += `
Knowledge cutoff: ${KnowledgeCutOffDate[model] ?? KnowledgeCutOffDate.default}`
  }
  DEFAULT_SYSTEM_TEMPLATE += `
Current model: ${model}
Current time: ${new Date().toLocaleString()}
Latex inline: $x^2$
Latex block: $$e=mc^2$$`
  return DEFAULT_SYSTEM_TEMPLATE
}

export const isNewModel = (model: string) => {
  return model.startsWith('o1-')
}
export const subModel = async (opt: subModelType) => {
  //
  let model = opt.model ?? (gptConfigStore.myData.model ? gptConfigStore.myData.model : 'gpt-3.5-turbo')
  let max_tokens = gptConfigStore.myData.max_tokens
  let temperature = 0.5
  let top_p = 1
  let presence_penalty = 0; let frequency_penalty = 0
  if (opt.uuid) {
    const chatSet = new chatSetting(opt.uuid)
    const gStore = chatSet.getGptConfig()
    temperature = gStore.temperature ?? temperature
    top_p = gStore.top_p ?? top_p
    presence_penalty = gStore.presence_penalty ?? presence_penalty
    frequency_penalty = gStore.frequency_penalty ?? frequency_penalty
    max_tokens = gStore.max_tokens
  }
  if (model == 'gpt-4-vision-preview' && max_tokens > 2048)
    max_tokens = 2048

  // gptServerStore.myData.GPTS_GX
  if (gptServerStore.myData.GPTS_GX)
    model = model.replace('gpt-4-gizmo-', '')

  // 如果有会话id传
  const chat1 = useChatStore().getChatByUuid(opt.uuid)
  let conid = ''
  toRaw(chat1).forEach((ct) => {
    if (ct.conversationOptions && ct.conversationOptions.conversationId && typeof ct.conversationOptions.conversationId !== 'number')
      conid = ct.conversationOptions.conversationId
  })

  const body: any = {
    // max_tokens,
    // model,
    // temperature,
    // top_p,
    // presence_penalty,
    // frequency_penalty,
    // messages: opt.message,

    // response_mode: 'streaming',
    // user: 'abc-123',
    agentId: homeStore.myData?.agentId,
    query: opt?.message[opt.message.length - 1].content,
    files: opt?.message[opt.message.length - 1].files,
    stream: true,
    conversationId: conid,
    device: {
      OSPlatform: 'web',
    },
  }
  // if (isNewModel(model)) {
  //   body = {
  //     max_completion_tokens: max_tokens,
  //     model,
  //     // temperature,
  //     top_p,
  //     presence_penalty,
  //     frequency_penalty,
  //     messages: opt.message,
  //     stream: false,
  //   }
  // }
  if (body.stream) {
    let headers = {
      'Content-Type': 'application/json',
      // ,'Authorization': 'Bearer ' +gptServerStore.myData.OPENAI_API_KEY
      'Accept': 'text/event-stream ',
    }
    headers = {
      ...headers,
      ...getHeaderAuthorization(),
      // Authorization: 'Bearer app-pBlUnOzT7bOybHB6KldFOAQW',
    }

    try {
      await fetchSSE(gptGetUrl('/ai-api/ai/agent/chatStream'), {
        method: 'POST',
        headers,
        signal: opt.signal,
        onMessage: async (data: string) => {
          mlog('🐞测试', data)
          const obj = JSON.parse(data)
          if (obj?.event == 'message_end') {
            // 刷新token
            http.getUserTokenAccount()
            opt.onMessage({ text: '', isFinish: true })
            if (!conid)
              useChatStore().updateChatSomeByUuid(opt.uuid, 0, { conversationOptions: { conversationId: obj.conversation_id } })
          }
          else if (obj?.event == 'message') {
            opt.onMessage({ text: obj?.answer ?? '', isFinish: false })
            // opt.onMessage({ text: obj.choices[0].delta?.content ?? '', isFinish: obj.choices[0].finish_reason != null })
          }
          else if (obj?.event == 'error') {
            if (obj?.code === 409) {
              // token不够去兑换
              http.getUserTokenAccount()
              opt.onMessage({ text: obj?.answer, isFinish: true })
              homeStore.setMyData({ toRedeem: true })
            }
            else if (obj?.code === 500) {
              opt.onMessage({ text: obj?.answer, isFinish: true })
            }
            else {
              opt.onMessage({ text: obj?.answer, isFinish: true })
            }
            // opt.onError && opt.onError(obj?.answer ?? '')
          }
        },
        onError(e) {
          mlog('❌未错误', e)
          opt.onError && opt.onError(e)
        },
        body: JSON.stringify(body),
      })
    }
    catch (error) {
      mlog('❌未错误2', error)
      opt.onError && opt.onError(error)
    }
  }
  else {
    try {
      mlog('🐞非流输出', body)
      opt.onMessage({ text: t('mj.thinking'), isFinish: false })
      const obj: any = await gptFetch('/v1/chat/completions2', body)
      opt.onMessage({ text: obj.choices[0].message.content ?? '', isFinish: true, isAll: true })
    }
    catch (error) {
      mlog('❌未错误2', error)
      opt.onError && opt.onError(error)
    }
  }
}

export const getInitChat = (txt: string, uuid?: number | string) => {
  const promptMsg: Chat.Chat = {
    dateTime: new Date().toLocaleString(),
    text: txt,
    inversion: true,
    error: false,
    conversationOptions: uuid ? { conversationId: uuid } : null,
    requestOptions: { prompt: txt, options: null },
  }
  return promptMsg
}

export interface ttsType {
  model: string
  input: string
  voice?: string

}
export const subTTS = async (tts: ttsType) => {
  if (!tts.voice)
    tts.voice = 'alloy'
  const url = getUrl('/v1/audio/speech')
  let headers = {
    'Content-Type': 'application/json',
  }
  headers = {
    ...headers,
    ...getHeaderAuthorization(),
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(tts),
  })

  if (!response.ok)
    throw new Error(`API request failed with status ${response.status}`)

  const audioData = await response.arrayBuffer()
  const contentType = response.headers.get('Content-Type')
  const blob = new Blob([audioData], { type: contentType ?? 'audio/mpeg' })
  mlog('blob', blob)
  const saveID = await localSaveAny(blob)
  const pp = await bolbObj(blob)
  return { blob, saveID, ...pp }
}

export const bolbObj = (blob: Blob) => {
  return new Promise<{ player: HTMLAudioElement; duration: number }>((resolve, reject) => {
    const player = new window.Audio()
    player.src = URL.createObjectURL(blob)

    player.addEventListener('loadedmetadata', () => {
      mlog('时长', player.duration)
      resolve({ player, duration: player.duration })
    })
    player.addEventListener('error', (e) => {
      reject(e)
    })
    player.load()
  })
}

function formatDate(): string[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
  return [formattedFirstDay, formattedLastDay]
}

//

export const gptUsage = async () => {
  // fetch(getUrl(url),  opt )
  //     .then(d=>d.json().then(d=> resolve(d))
  //     .catch(e=>reject(e)))
  //     .catch(e=>reject(e))
  const [startDate, endDate] = formatDate()
  const urlUsage = `/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`
  const usageData = await gptFetch(urlUsage)
  const billData = await gptFetch('/v1/dashboard/billing/subscription')

  const usage = Math.round(usageData.total_usage) / 100
  mlog('gpt', usage, billData)
  // remaining = subscriptionData.system_hard_limit_usd - totalUsage;
  return { usage, remaining: Math.round((billData.hard_limit ?? billData.hard_limit_usd * 100) - usageData.total_usage) / 100, hard_limit_usd: billData.hard_limit_usd }
}

export const openaiSetting = (q: any, ms: MessageApiInjection) => {
  // mlog()
  mlog('setting', q)
  if (q.settings) {
    mlog('q.setting', q.settings)
    try {
      const obj = JSON.parse(q.settings)
      const url = obj.url ?? undefined
      const key = obj.key ?? undefined
      // let setQ= { }
      gptServerStore.setMyData({
        OPENAI_API_BASE_URL: url,
        MJ_SERVER: url,
        SUNO_SERVER: url,
        LUMA_SERVER: url,
        RUNWAY_SERVER: url,
        VIGGLE_SERVER: url,
        IDEO_SERVER: url,
        KLING_SERVER: url,
        PIKA_SERVER: url,
        UDIO_SERVER: url,

        OPENAI_API_KEY: key,
        MJ_API_SECRET: key,
        SUNO_KEY: key,
        LUMA_KEY: key,
        RUNWAY_KEY: key,
        VIGGLE_KEY: key,
        IDEO_KEY: key,
        KLING_KEY: key,
        PIKA_KEY: key,
        UDIO_KEY: key,
      })
      blurClean()
      gptServerStore.setMyData(gptServerStore.myData)
      ms.success('设置服务端成功！')
    }
    catch (error) {

    }
  }
  else if (isObject(q)) {
    mlog('setting2', q)
    gptServerStore.setMyData(q)
    // gptServerStore.setMyData( gptServerStore.myData );
    blurClean()
    gptServerStore.setMyData(gptServerStore.myData)
  }
}
export const blurClean = () => {
  mlog('blurClean')
  gptServerStore.myData.OPENAI_API_BASE_URL = myTrim(myTrim(gptServerStore.myData.OPENAI_API_BASE_URL.trim(), '/'), '\\')
  gptServerStore.myData.OPENAI_API_KEY = gptServerStore.myData.OPENAI_API_KEY.trim()
  gptServerStore.myData.MJ_SERVER = myTrim(myTrim(gptServerStore.myData.MJ_SERVER.trim(), '/'), '\\')
  gptServerStore.myData.MJ_API_SECRET = gptServerStore.myData.MJ_API_SECRET.trim()
  gptServerStore.myData.UPLOADER_URL = myTrim(myTrim(gptServerStore.myData.UPLOADER_URL.trim(), '/'), '\\')
}

export const countTokens = async (dataSources: Chat.Chat[], input: string, uuid: number) => {
  const chatSet = new chatSetting(uuid)
  const myStore = chatSet.getGptConfig()
  const rz = { system: 0, input: 0, history: 0, remain: 330, modelTokens: '4k', planOuter: myStore.max_tokens }
  const model = myStore.model
  const max = getModelMax(model)
  let unit = 1024
  if (model == 'gpt-4-1106-preview' || model == 'gpt-4-vision-preview')
    unit = 1000
    // gpt-4-turbo-2024-04-09
  if (model.includes('gpt-4-turbo'))
    unit = 1000
  rz.modelTokens = `${max}k`
  // cl100k_base.encode(input)

  const encode = await encodeAsync()
  rz.input = encode(input).length
  rz.system = encode(getSystemMessage()).length
  const encodeChat = await encodeChatAsync()
  const msg = await getHistoryMessage(dataSources, 1)
  rz.history = msg.length == 0 ? 0 : encodeChat(msg, model.includes('gpt-4') ? 'gpt-4' : 'gpt-3.5-turbo').length
  //
  rz.remain = unit * max - rz.history - rz.planOuter - rz.input - rz.system

  return rz
}
const getModelMax = (model: string) => {
  let max = 4
  model = model.toLowerCase()
  if (model.includes('8k')) {
    return 8
  }
  else if (model.includes('16k') || model == 'gpt-3.5-turbo-1106' || model == 'gpt-3.5-turbo-0125') {
    return 16
  }
  else if (model.includes('32k')) {
    return 32
  }
  else if (model.includes('gpt-4-turbo') || model.includes('gpt-4o') || model.includes('o1-')) {
    return 128
  }
  else if (model.includes('64k')) {
    return 64
  }
  else if (model.includes('128k')
    || model == 'gpt-4-1106-preview'
    || model == 'gpt-4-0125-preview'
    || model == 'gpt-4-vision-preview') {
    return 128
  }
  else if (model.includes('gpt-4')) {
    max = 8
  }
  else if (model.toLowerCase().includes('claude-3')) {
    // options.maxModelTokens = 120*1024;
    // options.maxResponseTokens = 4096
    return 120
  }

  return max
}

export const encodeAsync = async () => {
  const { encode } = await import('gpt-tokenizer')

  return encode// (str).length;
}
export const encodeChatAsync = async () => {
  const { encodeChat } = await import('gpt-tokenizer')

  return encodeChat// (obj,model ).length;
}

export const getHistoryMessage = async (dataSources: Chat.Chat[], loadingCnt = 1, start = 1000) => {
  let i = 0
  const rz: ChatMessage[] = []
  // const loadingCnt= 1;// 1就是没有loading，3 就是有loading
  const istart = (isNumber(start) && start >= 0) ? Math.min(start, dataSources.length - loadingCnt) : dataSources.length - loadingCnt
  mlog('istart', istart, start)
  for (let ii = istart; ii >= 0; ii--) { // let o of dataSources.value
    if (i >= gptConfigStore.myData.talkCount)
      break
    i++

    const o = dataSources[ii]
    // mlog('o',ii ,o);
    let content = o.text
    if (o.inversion && o.opt?.images && o.opt.images.length > 0) {
      // 获取附件信息 比如 图片 文件等
      try {
        const str = await localGet(o.opt.images[0]) as string
        const fileBase64 = JSON.parse(str) as string[]
        const arr = fileBase64.filter((ff: string) => ff.includes('http'))
        if (arr.length > 0)
          content = `${arr.join(' ')} ${content}`
        mlog(t('mjchat.attr'), o.opt.images[0], content)
      }
      catch (ee) {
      }
    }

    // mlog('d',gptConfigStore.myData.talkCount ,i ,o.inversion , o.text);
    rz.push({ content, role: !o.inversion ? 'assistant' : 'user' })
  }
  rz.reverse()
  mlog('rz', rz)
  return rz
}

export const isDisableMenu = (menu: string) => {
  return (homeStore.myData.session && homeStore.myData.session.menuDisable && homeStore.myData.session.menuDisable.includes(menu))
}
