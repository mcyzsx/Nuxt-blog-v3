<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface HistoryItem {
	title: string
	year: string
	description: string
	event_type: 'birth' | 'death' | 'event'
	link?: string
}

const list = ref<HistoryItem[]>([])
const loading = ref(true)

const typeIcon = {
	birth: '👶',
	death: '👼',
	event: '📰',
}

onMounted(async () => {
	try {
		const res = await fetch('https://60s.kemeow.top/v2/today-in-history')
		const json = await res.json()
		list.value = (json.data?.items || []).slice(0, 6) // 取前 6 条
	}
	catch (e) {
		console.error('获取历史上的今天失败', e)
	}
	finally {
		loading.value = false
	}
})
</script>

<template>
<BlogWidget card title="历史上的今天">
	<div v-if="loading" class="history-loading">
		加载中…
	</div>

	<ul v-else class="history-list">
		<li v-for="(item, idx) in list" :key="idx" class="history-item">
			<span class="history-icon" :title="item.event_type">{{ typeIcon[item.event_type] }}</span>
			<div class="history-main">
				<div class="history-title">
					<span class="history-year">{{ item.year }} 年</span>
					<span class="history-text">{{ item.title }}</span>
				</div>
				<p class="history-desc">
					{{ item.description }}
				</p>
				<a
					v-if="item.link"
					class="history-link"
					:href="item.link"
					target="_blank"
					rel="noopener"
				>查看详情 →</a>
			</div>
		</li>
	</ul>
</BlogWidget>
</template>

<style lang="scss" scoped>
.history-loading {
	padding: 2rem 0;
	font-size: 0.9rem;
	text-align: center;
	color: var(--c-text-2);
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.history-item {
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	border: 1px solid rgb(var(--c-border-rgb), 0.12);
	border-radius: 0.6rem;
	background: rgb(var(--c-bg-soft-rgb), 0.7);
	backdrop-filter: blur(12px);
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

	&:hover {
		box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
		transform: translateY(-2px);
	}
}

.history-icon {
	flex-shrink: 0;
	margin-top: 2px;
	font-size: 1.3rem;
	line-height: 1;
}

.history-main {
	flex: 1;
	min-width: 0;
}

.history-title {
	display: flex;
	align-items: baseline;
	gap: 0.5rem;
	margin-bottom: 0.25rem;
	font-weight: 600;
	color: var(--c-text-1);
}

.history-year {
	font-size: 0.85rem;
	white-space: nowrap;
	color: var(--c-primary);
}

.history-text {
	font-size: 0.95rem;
	line-height: 1.4;
}

.history-desc {
	display: -webkit-box;
	overflow: hidden;
	margin: 0.25rem 0 0.4rem;
	font-size: 0.85rem;
	-webkit-line-clamp: 2;
	line-height: 1.5;
	color: var(--c-text-2);
	-webkit-box-orient: vertical;
}

.history-link {
	font-size: 0.8rem;
	text-decoration: underline;
	color: var(--c-primary);
	transition: opacity 0.2s;
	text-underline-offset: 2px;

	&:hover {
		opacity: 0.8;
	}
}

@media (max-width: 768px) {
	.history-item {
		padding: 0.6rem 0.8rem;
	}

	.history-year {
		font-size: 0.8rem;
	}

	.history-text {
		font-size: 0.9rem;
	}

	.history-desc {
		font-size: 0.8rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.history-item,
	.history-item:hover {
		transform: none !important;
		transition: none !important;
	}
}
</style>
