declare namespace Chat {

	interface Chat {
		dateTime: string
		text: string
		inversion?: boolean
		error?: boolean
		loading?: boolean
		conversationOptions?: ConversationRequest | null
		requestOptions: { prompt: string; options?: ConversationRequest | null }
		model?:string //模型
		mjID?:string //MJ的ID
		opt?:{
			progress?:string,seed?:number, imageUrl?:string
			, status?:string, images?:string[]
			,promptEn?:string,buttons?:any[]
			,action?:string
			,duration?:number
			,lkey?:string
			size?: string,
			model?: string,
			prompt?: string,
			creatTime?: number,
			taskStatus?: string,
		} //
		uuid?:number | string
		index?:number
		myid?:string //唯一随机
		logo?:string
		// conversationId?:string // 会话 ID，需要基于之前的聊天记录继续对话，必须传之前消息的 conversation_id，客户端第一次调用不需要传入，第二次从服务端返回的 response 中获取
		
		//progress?:string
		agentId?: number
		completionPrice?: number
		completionPriceUnit?: number
		completionTokens?: number
		completionUnitPrice?: number
		conversationId?: string
		createAt?: number
		currency?: number
		difyConversationId?: string
		file?: string
		id?: string
		message?: string
		messageId?: string
		promptPrice?: number
		promptPriceUnit?: number
		promptTokens?: number
		promptUnitPrice?: number
		role?: string
		totalPrice?: number
		totalTokens?: number
	}

	interface History {
		title: string
		isEdit: boolean
		uuid: number | string
		conversationId: string
		imageUrl?:string
		size?: string,
		model?: string,
		prompt?: string,
		creatTime?: number,
		firstFrameImage?: string, // 第一帧图片minimax用
		progress?: string | number, // 进度
		subjectReference?: Array, // 主体参考
	}
	interface HistoryAgent {
		agentType: string
		bgPic: string | null
		desc: string
		i18nConfig: string | null
		icon: string
		id: string
		name: string
		productNo: string
		prompt: string | null
		promptType: string | null
		schemeUrl: string | null
		uuid: string | number
	}

	interface ChatState {
		active: number | string
		usingContext: boolean;
		history: History[]
		chat: { uuid: number | string; data: Chat[] }[]
		suggestion: Array
	}

	interface ConversationRequest {
		conversationId?: string
		parentMessageId?: string
	}

	interface ConversationResponse {
		conversationId: string
		detail: {
			choices: { finish_reason: string; index: number; logprobs: any; text: string }[]
			created: number
			id: string
			model: string
			object: string
			usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number }
		}
		id: string
		parentMessageId: string
		role: string
		text: string
	}
}
