<script setup lang="ts">
import { toZonedTime } from 'date-fns-tz'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
// 将服务器时区转换为博客指定时区
const buildTime = toZonedTime(runtimeConfig.public.buildTime, appConfig.timezone)

const totalWords = ref(appConfig.stats.wordCount)
const yearlyTip = ref('')

const blogStats = computed(() => [{
	label: '运营时长',
	value: timeElapse(appConfig.timeEstablished),
	tip: `博客于${appConfig.timeEstablished}上线`,
	icon: 'ph:calendar-bold',
	color: 'var(--c-primary)',
}, {
	label: '上次更新',
	value: timeElapse(buildTime),
	tip: `构建于${getLocaleDatetime(buildTime)}`,
	icon: 'ph:clock-bold',
	color: 'var(--c-accent)',
}, {
	label: '总字数',
	value: totalWords,
	tip: yearlyTip,
	icon: 'ph:file-text-bold',
	color: 'var(--c-success)',
}])

onMounted(async () => {
	const stats = await $fetch('/api/stats')
	totalWords.value = formatNumber(stats.total.words)
	yearlyTip.value = Object.entries(stats.annual).reverse().map(([year, item]) =>
		`${year}年：${item.posts}篇，${formatNumber(item.words)}字`,
	).join('\n')
})
</script>

<template>
<BlogWidget title="博客统计">
	<div class="blog-stats">
		<div v-for="(stat, index) in blogStats" :key="index" class="stat-item">
			<div class="stat-icon">
				<Icon :name="stat.icon" :style="{ color: stat.color }" />
			</div>
			<div class="stat-content">
				<div class="stat-value">
					{{ stat.value }}
				</div>
				<div class="stat-label">
					{{ stat.label }}
				</div>
			</div>
		</div>
	</div>
</BlogWidget>
</template>

<style lang="scss" scoped>
.blog-stats {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	position: relative;
	padding: 0.75rem;
	border: 1px solid var(--c-border);
	border-radius: 12px;
	background: linear-gradient(135deg, rgb(var(--c-bg-soft-rgb), 0.8) 0%, rgb(var(--c-bg-card-rgb), 0.9) 100%);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
		background: linear-gradient(135deg, rgb(var(--c-primary-rgb), 0.1) 0%, rgb(var(--c-bg-card-rgb), 0.95) 100%);
		transform: translateY(-2px);
	}
}

.stat-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	border: 1px solid var(--c-border);
	border-radius: 10px;
	background: linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg-card) 100%);

	:deep(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
}

.stat-content {
	flex: 1;
	min-width: 0;
}

.stat-value {
	margin-bottom: 0.25rem;
	font-size: 1.1rem;
	font-weight: 500;
	line-height: 1.2;
	color: var(--c-text);
}

.stat-label {
	font-size: 0.85rem;
	font-weight: 400;
	color: var(--c-text-2);
}

.stat-tooltip {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	background: rgb(var(--c-text-2-rgb), 0.1);
	color: var(--c-text-2);
	transition: all 0.2s ease;
	cursor: help;

	&:hover {
		background: rgb(var(--c-primary-rgb), 0.1);
		color: var(--c-primary);
	}

	:deep(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	.stat-item {
		gap: 0.625rem;
		padding: 0.625rem;
	}

	.stat-icon {
		width: 2.25rem;
		height: 2.25rem;

		:deep(svg) {
			width: 1.125rem;
			height: 1.125rem;
		}
	}

	.stat-value {
		font-size: 1rem;
	}

	.stat-label {
		font-size: 0.8rem;
	}
}
</style>
