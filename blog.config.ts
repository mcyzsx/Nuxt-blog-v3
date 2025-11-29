import type { FeedEntry } from './app/types/feed'

const basicConfig = {
	title: 'ZSXの小站',
	subtitle: '造化钟神秀，阴阳割昏晓。',
	// 长 description 利好于 SEO
	description: '钟神秀的个人博客，我在这里分享我的生活日常、踩坑记录和资源分享。',
	headerConfig: {
		defaultTag: '资源分享者',
		hoverTag: '摸鱼大人',
		hoverSubtitle: '每一段旅行都有终点~',
	},
	author: {
		name: '钟神秀',
		avatar: '/image/avatar.webp',
		email: 'me@mcyzsx.top',
		homepage: 'https://www.mcyzsx.top/',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: '/image/avatar.webp',
	language: 'zh-CN',
	timeEstablished: '2025-11-28',
	timezone: 'Asia/Shanghai',
	url: 'https://blog.mcyzsx.top/',
	defaultCategory: '未分类',
}

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	announcement: {
		enabled: true,
		message: '欢迎来到我的博客！<br>如果网站有什么问题，优先<kbd>CTRL</kbd>+<kbd>F5</kbd>刷新一下~',
	},

	article: {
		categories: {
			[basicConfig.defaultCategory]: { icon: 'ph:folder-dotted-bold' },
			经验分享: { icon: 'ph:mouse-bold', color: '#3af' },
			杂谈: { icon: 'ph:chat-bold', color: '#3ba' },
			生活: { icon: 'ph:shooting-star-bold', color: '#f77' },
			资源分享: { icon: 'mdi:web', color: '#24d' },
			// 代码: { icon: 'ph:code-bold', color: '#77f' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 文章版式，首个为默认版式 */
		types: {
			tech: {},
			story: {},
		},
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: ['/preview', '/previews/*'],
	},

	/** 博客 Atom 订阅源 */
	feed: {
		/** 订阅源最大文章数量 */
		limit: 50,
		/** 订阅源是否启用XSLT样式 */
		enableStyle: true,
	},

	/** 向 <head> 中添加脚本 */
	scripts: [
		// 自己部署的 Umami 统计服务
		// { 'src': 'https://zhi.zhilu.cyou/zhi.js', 'data-website-id': 'a1997c81-a42b-46f6-8d1d-8fbd67a8ef41', 'defer': true },
		// 自己网站的 Cloudflare Insights 统计服务
		// { 'src': 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "97a4fe32ed8240ac8284e9bffaf03962"}', 'defer': true },
		// Twikoo 评论系统
		{ src: 'https://lib.baomitu.com/twikoo/1.6.44/twikoo.min.js', defer: true },
		{
			src: '/js/netease-mini-player-v2.js',
			defer: true,
		},
	],
	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: 'https://twikoo.zhilu.cyou/',
		preload: 'https://twikoo.zhilu.cyou/',
	},
}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: '友人帐',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'Vercel'],
	date: blogConfig.timeEstablished,
	comment: '这是我自己',
}

export default blogConfig
