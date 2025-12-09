<script setup lang="ts">
import { genPageArr } from '@//utils'

const props = defineProps<{
	totalPages: number
	expandPages?: number
	sticky?: boolean
}>()

const page = defineModel<number>({ required: true })
const pageArr = computed(() => genPageArr(page.value, props.totalPages, props.expandPages ?? 2))

const layoutStore = useLayoutStore()
const anchorEl = useTemplateRef('pagination-anchor')
const expand = useElementVisibility(anchorEl)

onMounted(() => layoutStore.setTranslate('pagination', '0, -2em'))
onUnmounted(() => layoutStore.setTranslate('pagination', ''))

/* 平滑滚动到顶部 */
function toTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
<nav
	class="pagination"
	:class="{ sticky, expand }"
	:aria-label="`第${page}页，共${totalPages}页`"
	:style="{ '--collapsed-width': `${pageArr.length * 2 + 6}em` }"
>
	<!-- 上一页 -->
	<ZButton
		:disabled="page <= 1"
		class="pagination-button rtl-flip"
		icon="ph:arrow-fat-left-duotone"
		aria-label="上一页"
		@click="page--; toTop()"
	/>

	<!-- 数字页码 -->
	<template v-for="i in pageArr" :key="i">
		<button
			v-if="Number.isFinite(i)"
			class="pagination-num"
			:class="{ active: i === page }"
			:aria-label="`第${i}页`"
			@click="page = i; toTop()"
			v-text="i"
		/>
		<button v-else disabled class="pagination-num">
			…
		</button>
	</template>

	<!-- 下一页 -->
	<ZButton
		:disabled="page >= totalPages"
		class="pagination-button rtl-flip"
		icon="ph:arrow-fat-right-duotone"
		aria-label="下一页"
		@click="page++; toTop()"
	/>
</nav>
<div ref="pagination-anchor" />
</template>

<style lang="scss" scoped>
.pagination{
  display:flex;overflow:hidden;max-width:100vw;margin:1rem auto;border:1px solid var(--c-border);border-radius:.5rem;box-shadow:0 .1em .2em var(--ld-shadow);background:var(--ld-bg-card);transition:max-width .2s var(--max-bezier-to-full);font-variant-numeric:tabular-nums;
  &.sticky{position:sticky;bottom:min(2em,5%);
    &:not(.expand){max-width:var(--collapsed-width);transition-timing-function:var(--max-bezier-to-collapse)}}
  .pagination-button{border:none;border-radius:0;box-shadow:none;&:first-child{margin-inline-end:auto}&:last-child{margin-inline-start:auto}}
  .pagination-num{width:3em;transition:background-color .2s;&:hover{background:var(--c-border)}&:disabled{pointer-events:none}&.active{background:var(--c-primary-soft);color:var(--c-primary)}}
}
</style>
