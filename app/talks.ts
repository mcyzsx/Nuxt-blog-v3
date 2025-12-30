import type { TalkItem } from './types/talk'

export interface ApiResponse {
	code: number
	msg: string
	data: {
		total: number
		items: ApiTalkItem[]
	}
}

export interface ApiTalkItem {
	id: number
	content: string
	username: string
	layout: string
	private: boolean
	user_id: number
	tags?: {
		id: number
		name: string
		usage_count: number
		created_at: string
	}[]
	images?: {
		id: number
		message_id: number
		image_url: string
		image_source: string
	}[]
	extension?: string
	extension_type?: string
	fav_count: number
	created_at: string
}

export async function fetchTalks(): Promise<TalkItem[]> {
	try {
		const response = await fetch('https://ech0.050815.xyz/api/echo/page')
		const data: ApiResponse = await response.json()

		if (data.code !== 1) {
			throw new Error(data.msg || '获取数据失败')
		}

		return data.data.items.map((item) => {
			const talkItem: TalkItem = {
				id: item.id,
				text: item.content,
				date: item.created_at,
				tags: item.tags?.map(tag => tag.name) || [],
				images: item.images?.map(img => img.image_url) || undefined,
			}

			// 处理视频扩展
			if (item.extension && item.extension_type === 'VIDEO') {
				// 根据extension判断视频类型
				if (item.extension.length === 11) {
					// YouTube视频ID
					talkItem.video = {
						type: 'youtube',
						id: item.extension,
					}
				}
				else {
					// 默认处理
					talkItem.video = {
						type: 'bilibili',
						id: item.extension,
					}
				}
			}

			// 处理网站扩展
			if (item.extension && item.extension_type === 'WEBSITE') {
				try {
					const websiteData = JSON.parse(item.extension)
					talkItem.website = {
						title: websiteData.title,
						url: websiteData.site,
						description: websiteData.description
					}
				} catch (error) {
					console.error('解析网站扩展数据失败:', error)
				}
			}

			// 处理音乐扩展
			if (item.extension && item.extension_type === 'MUSIC') {
				try {
					// extension 是一个URL字符串，不是JSON
					// 解析网易云音乐URL获取ID
					const url = item.extension
					if (url.includes('music.163.com')) {
						const match = url.match(/id=(\d+)/)
						if (match && match[1]) {
							talkItem.music = {
								url: url,
								id: match[1],
								server: 'netease',
								type: 'song'
							}
						}
					} else {
						talkItem.music = {
							url: url
						}
					}
				} catch (error) {
					console.error('解析音乐扩展数据失败:', error)
				}
			}

			return talkItem
		})
	}
	catch (error) {
		console.error('获取说说数据失败:', error)
		return []
	}
}

export default [] satisfies TalkItem[]
