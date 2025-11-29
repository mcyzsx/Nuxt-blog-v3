<script setup lang="ts">
import { getTagIcon } from '~/composables/useArticle'

const props = defineProps<{
	tags?: (string | undefined)[]
}>()

const tag = defineModel<string>('tag')

function selectTag(selectedTag?: string) {
	tag.value = selectedTag
}
</script>

<template>
<div class="tag-toggle">
	<ZDropdown trigger="focusin">
		<button :disabled="!tags">
			<Icon :name="getTagIcon(tag)" />
			<span class="tag-text">{{ tag ?? '全部标签' }}</span>
		</button>
		<template #content="{ hide }">
			<button :class="{ active: !tag }" @click="hide(), selectTag(undefined)">
				<Icon :name="getTagIcon()" />
				<span>全部标签</span>
			</button>
			<button v-for="item in tags" :key="item" :class="{ active: item === tag }" @click="hide(), selectTag(item)">
				<Icon :name="getTagIcon(item)" />
				<span>{{ item }}</span>
			</button>
		</template>
	</ZDropdown>
</div>
</template>

<style lang="scss" scoped>
.tag-toggle {
	display: inline-flex;

	button {
		color: var(--c-text-2);
		transition: color 0.2s;

		&:hover {
			color: var(--c-primary);
		}
	}
}

.iconify + span {
	margin-left: 0.1em;
}
</style>
