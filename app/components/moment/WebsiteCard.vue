<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	jsonStr: string // 原始 JSON 字符串
}
const props = defineProps<Props>()

// 解析 JSON
const data = computed(() => {
	try {
		return JSON.parse(props.jsonStr) as { title?: string, site?: string }
	}
	catch {
		return { title: '', site: '' }
	}
})

// 提取 host
const cleanHost = computed(() => {
	try {
		return new URL(data.value.site || '').host
	}
	catch {
		return ''
	}
})
</script>

<template>
<a
	:href="data.site"
	target="_blank"
	rel="noopener noreferrer"
	class="web-card gradient-card"
>
	<div class="web-icon">
		<Icon name="material-symbols:language" />
	</div>
	<div class="web-content">
		<div class="web-title">{{ data.title || '网页链接' }}</div>
		<div class="web-link">{{ cleanHost }}</div>
	</div>
	<Icon name="ph:arrow-up-right" class="web-arrow" />
</a>
</template>

<style scoped>
.web-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
}
.web-card:hover {
  transform: translateY(-2px);
}
.web-icon {
  font-size: 24px;
  color: var(--c-primary);
}
.web-content {
  flex: 1;
  min-width: 0;
}
.web-title {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.web-link {
  font-size: 0.8rem;
  color: var(--c-text-2);
  margin-top: 2px;
}
.web-arrow {
  font-size: 16px;
  color: var(--c-text-3);
}
</style>
