export interface MastodonItem {
	id: string
	content: string
	created_at: string
	emojis?: EmojiData[]
	media_attachments?: MediaAttachment[]
	reblog?: MastodonItem
	in_reply_to_id?: string | null
	tags?: MastodonTag[]
}

export interface EmojiData {
	shortcode: string
	static_url: string
	url: string
	visible_in_picker: boolean
}

export interface MediaAttachment {
	id: string
	type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown'
	url: string
	preview_url: string
	remote_url: string | null
	text_url: string | null
	meta: any
	description: string | null
	blurhash: string | null
}

export interface MastodonTag {
	name: string
	url: string
}

export interface TransformedMastodonItem {
	id: string
	text: string
	date: string
	images?: string[]
	video?: {
		type: 'raw' | 'bilibili' | 'bilibili-nano' | 'youtube' | 'douyin' | 'douyin-wide' | 'tiktok'
		id: string
		ratio?: string | number
		poster?: string
	}
	website?: {
		title: string
		url: string
		description?: string
	}
	music?: {
		url: string
		id?: string
		server?: string
		type?: string
		autoplay?: boolean
		theme?: string
		mode?: string
		name?: string
		cover?: string
	}
	tags?: string[]
	isReblog: boolean
	isReply: boolean
}