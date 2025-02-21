import { get, post } from '~/api/request'

// 推荐anget列表
export function recommendAgent() {
  return get<T>({
    url: '/ai-api/ai/recommend/agent',
  })
}
// 历史会话列表
export function getHistoryByAgentId<T = any>(options?: { agentId?: string | number;device: object; page?: number; size?: number }) {
  return post<T>({
    url: '/ai-api/ai/agent/conversation',
    data: { ...options },
  })
}
// 历史会话内容
export function getMessageByConversation<T = any>(options?: { conversationId?: string;device: object }) {
  return post<T>({
    url: '/ai-api/ai/agent/conversation/message',
    data: { ...options },
  })
}
// 修改会话title|name
export function conversationUpdate<T = any>(options?: { conversationId?: string | number;device: object; name: string }) {
  return post<T>({
    url: '/ai-api/ai/agent/conversation/update',
    data: { ...options },
  })
}
// 删除会话
export function conversationDelete<T = any>(options?: { conversationId?: string | number;device: object }) {
  return post<T>({
    url: '/ai-api/ai/agent/conversation/delete',
    data: { ...options },
  })
}
// 获取dalle任务列表
export function getHistoryByModels<T = any>(options?: { models?: any;device: object; page?: number; size?: number }) {
  return post<T>({
    url: '/ai-api/ai/task/list',
    data: { ...options },
  })
}
// 删除生成图片历史 dell flux midjourney共用
export function deleteTask<T = any>(options?: { taskId?: string | number;device: object }) {
  return post<T>({
    url: '/ai-api/ai/animation/task/delete',
    data: { ...options },
  })
}
// 获取midjourney任务列表
export function getHistoryTaskList<T = any>(options?: { device: object; page?: number; size?: number }) {
  return post<T>({
    url: '/ai-api/ai/zeakai/mj/task/list',
    data: { ...options },
  })
}
// 获取minimax任务列表
export function getHistoryMinimaxTaskList<T = any>(options?: { device: object; page?: number; size?: number }) {
  return post<T>({
    url: '/ai-api/minimax/video/taskList',
    data: { ...options },
  })
}
