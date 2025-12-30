import type { MastodonItem, TransformedMastodonItem } from './types/mastodon'

export async function fetchMastodonPosts(): Promise<TransformedMastodonItem[]> {
	try {
		// 从环境变量或配置中获取参数
		const instance = 'ech0.zhzsx.cn' // 需要替换为实际的实例地址
      const userId = '115732018075313174' // 需要替换为实际的用户ID
		const token = process.env.MASTODON_TOKEN || ''
		const tag = '' // 可选标签过滤
		const shownMax = 30 // 最大显示数量

		if (!instance || !userId) {
			throw new Error('Mastodon instance and userId are required')
		}

		// 构建API URL
		const url = `https://${instance}/api/v1/accounts/${userId}/statuses?tagged=${tag || ''}&exclude_replies=true`

		// 构建请求头
		const headers: HeadersInit = {}
		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}

		const response = await fetch(url, { headers })

		if (!response.ok) {
			throw new Error(`Mastodon API request failed with status: ${response.status}`)
		}

		const data: MastodonItem[] = await response.json()

		// 转换数据格式
		return data.slice(0, shownMax).map((item) => {
			// 处理转发内容
			const targetItem = item.reblog || item
			const isReblog = !!item.reblog
			const isReply = !!targetItem.in_reply_to_id

			// 处理图片
			const images = targetItem.media_attachments
				?.filter(attachment => attachment.type === 'image')
				.map(attachment => attachment.url)

			// 处理视频
			let video
			const videoAttachment = targetItem.media_attachments?.find(attachment => 
				attachment.type === 'video' || attachment.type === 'gifv'
			)
			if (videoAttachment) {
				video = {
					type: 'raw' as const,
					id: videoAttachment.id,
					poster: videoAttachment.preview_url
				}
			}

			// 处理标签
			const tags = targetItem.tags?.map(tag => tag.name)

			// 处理音乐扩展（这里暂时没有音乐扩展，所以先留空）
			let music
			// TODO: 当 Mastodon API 返回音乐扩展时，添加处理逻辑

			// 处理内容中的emoji
			const formatContent = (content: string, emojis?: MastodonItem['emojis']) => {
				if (!emojis) return content
				
				const getEmojiWrapper = (emojisData: MastodonItem['emojis']) => 
					(match: string, p1: string) => {
						if (!emojisData) return match
						const data = emojisData.find(e => e.shortcode === p1)
						return data ? `<img class="emoji" src="${data.static_url}" alt="${p1}"/>` : match
					}
				
				return content.replace(/:(\w+):/g, getEmojiWrapper(emojis))
			}

			return {
				id: targetItem.id,
				text: formatContent(targetItem.content, targetItem.emojis),
				date: targetItem.created_at,
				images: images && images.length > 0 ? images : undefined,
				video: video || undefined,
				music: music || undefined,
				tags: tags,
				isReblog,
				isReply
			} as TransformedMastodonItem
		})
	}
	catch (error) {
		console.error('获取 Mastodon 数据失败:', error)
		return []
	}
}

export default [] satisfies TransformedMastodonItem[]