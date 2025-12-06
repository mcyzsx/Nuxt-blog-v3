import process from 'node:process'

// server/api/github-repo.get.ts
import { defineEventHandler, getQuery, setHeaders } from 'h3'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

export default defineEventHandler(async (event) => {
	const { repo } = getQuery(event)
	if (!repo || typeof repo !== 'string') {
		throw createError({ statusCode: 400, statusMessage: 'Missing repo parameter' })
	}

	// 去掉可能多余的前缀，只保留 owner/name
	const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')

	// 缓存 5 分钟（300 秒）
	setHeaders(event, {
		'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
	})

	try {
		const res = await $fetch<Record<string, any>>(
			`https://api.github.com/repos/${cleanRepo}`,
			{
				headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
			},
		)

		// 只返回需要展示的字段
		return {
			name: res.full_name,
			description: res.description,
			url: res.html_url,
			stars: res.stargazers_count,
		}
	}
	catch (err: any) {
		// GitHub 返回 404 / 403 等，直接透传
		throw createError({
			statusCode: err.response?.status || 500,
			statusMessage: err.response?.statusText || 'GitHub API Error',
		})
	}
})
