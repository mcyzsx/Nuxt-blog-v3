<!-- Social.vue -->
<script setup lang="ts">
// 从 about.ts 里取社交数据
import { about } from '../../about'
// 取第一条数据的 social 数组
const socialList = about[0].social
</script>

<template>
<div class="author-content-item social">
	<div class="card-content p-5 rounded-xl border shadow bg-base-100 dark:bg-base-200">
		<div class="text-xs opacity-60 mb-2">
			社交
		</div>
		<div class="flex flex-wrap gap-3 mt-2">
			<a
				v-for="s in socialList"
				:key="s.name"
				:href="s.href"
				target="_blank"
				rel="noopener"
				class="btn btn-outline btn-sm gap-2"
			>
				<!-- 图标 -->
				<span :class="s.class" class="w-4 h-4" />
				{{ s.name }}
			</a>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
/* 按需保留或覆盖 */
</style>
