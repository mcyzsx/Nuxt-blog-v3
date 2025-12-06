// types/twikoo.d.ts
export interface TwikooCountItem {
	url: string
	count: number
	total: number
}

export interface TwikooInstance {
	init: (options: {
		envId: string
		el?: string | HTMLElement
		region?: string
		path?: string
		lang?: string
		/** 1.6.0+ 支持 */
		onCommentLoaded?: () => void
	}) => void
	version: string

	/* ===== 以下是我们需要用到但官方没给类型的 API ===== */
	getCommentsCount: (opts: {
		envId: string
		urls?: string[]
		region?: string
	}) => Promise<TwikooCountItem[]>
}

declare global {
	interface Window {
		twikoo?: TwikooInstance
	}
}
