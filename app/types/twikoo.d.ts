// types/twikoo.d.ts
export { }

declare global {
	interface Window {
		twikoo?: Twikoo & {
			getRecentComments?: (params: {
				envId: string
				pageSize?: number
				[key: string]: any
			}) => Promise<{ total: number }>
			[key: string]: any
		}
		__twikooRenderOK?: boolean // 用于标记 Twikoo 渲染完成
	}
}

interface Twikoo {
	init: (options: {
		envId: string
		el: string
		region?: string
		path?: string
		lang?: string
		onLoad?: () => void // 渲染完成回调
	}) => void
	version: string
}
