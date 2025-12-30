export interface TalkItem {
	id?: number
	text?: string
	date: string
	images?: string[]
	video?: {
		type?: 'raw' | 'bilibili' | 'bilibili-nano' | 'youtube' | 'douyin' | 'douyin-wide' | 'tiktok'
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
	location?: string
}
