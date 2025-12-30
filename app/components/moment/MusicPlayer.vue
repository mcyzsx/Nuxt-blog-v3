<script setup lang="ts">
import type { MomentItem } from '~/types/moments'

/* stylelint-disable-next-line @stylistic/linebreaks */
type Music = NonNullable<MomentItem['music']>[number]

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const props = defineProps<{
	list: Music[]
}>()

// 添加唯一标识符，确保每个播放器都有唯一ID
const playerId = computed(() => `player-${Math.random().toString(36).substr(2, 9)}`)

// 监听主题变化，动态更新播放器主题色
watch(isDark, () => {
  // 在主题变化时，强制重新渲染播放器
  const metingElements = document.querySelectorAll('.moment-music meting-js')
  metingElements.forEach(element => {
    const parent = element.parentElement
    if (parent) {
      // 临时移除元素
      const clone = element.cloneNode(true) as Element
      element.remove()
      // 重新添加元素以触发重新渲染
      parent.appendChild(clone)
    }
  })
})
</script>

<template>
<!-- 一个 moment 可能有多首歌，循环渲染 -->
<div v-for="(item, idx) in list" :key="`${playerId}-${idx}`" class="moment-music">
	<meting-js
		:id="String(item.id)"
		:server="item.server"
		:type="item.type"
		:autoplay="!!item.autoplay"
		:theme="item.theme || 'var(--c-primary)'"
		:mode="item.mode || 'mini'"
		:name="item.name || undefined"
		:cover="item.cover || undefined"
	/>
</div>
</template>

<style scoped>
/* 让播放器宽度自适应，下方留一点间距 */
.moment-music {
  width: 100%;
  margin: 12px 0;
}
</style>

<style>
/* 浅色模式 - 使用博客的CSS变量保持一致性 */
.moment-music .aplayer {
  background: var(--c-bg);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid var(--c-border);
}

/* 播放器文本颜色 */
.moment-music .aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: var(--c-text-1);
}

.moment-music .aplayer .aplayer-info .aplayer-music .aplayer-author {
  color: var(--c-text-3);
}

/* 播放器控制栏 */
.moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-time {
  color: var(--c-text-3);
}

.moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon path {
  fill: var(--c-text-3);
}

.moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon:hover path {
  fill: var(--c-text-1);
}

/* 进度条 */
.moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
  background: var(--c-bg-soft);
}

.moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
  background: var(--c-text-3);
}

/* 音量条 */
.moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar {
  background: var(--c-text-3);
}

/* 歌词样式 */
.moment-music .aplayer .aplayer-lrc p {
  color: var(--c-text-3);
}

.moment-music .aplayer .aplayer-lrc p.aplayer-lrc-current {
  color: var(--c-text-1);
}

/* 修复歌词遮罩在深色模式下的问题 */
.moment-music .aplayer .aplayer-lrc:before {
  background: linear-gradient(180deg, var(--c-bg) 0%, hsla(var(--hue-theme, 220deg), 100%, 100%, 0));
}

.moment-music .aplayer .aplayer-lrc:after {
  background: linear-gradient(180deg, hsla(var(--hue-theme, 220deg), 100%, 100%, 0) 0%, var(--c-bg) 100%);
}

/* 深色模式下的歌词遮罩 */
.dark .moment-music .aplayer .aplayer-lrc:before {
  background: linear-gradient(180deg, var(--c-bg-1) 0%, hsla(var(--hue-theme, 220deg), 0%, 10%, 0));
}

.dark .moment-music .aplayer .aplayer-lrc:after {
  background: linear-gradient(180deg, hsla(var(--hue-theme, 220deg), 0%, 10%, 0) 0%, var(--c-bg-1) 100%);
}

/* 固定播放器的歌词文字阴影 */
.dark .moment-music .aplayer.aplayer-fixed .aplayer-lrc {
  text-shadow: -1px -1px 0 var(--c-bg-1);
}

/* 列表样式 */
.moment-music .aplayer .aplayer-list ol li {
  border-top: 1px solid var(--c-border);
  color: var(--c-text-2);
}

.moment-music .aplayer .aplayer-list ol li:hover {
  background: var(--c-bg-2);
}

.moment-music .aplayer .aplayer-list ol li.aplayer-list-light {
  background: var(--c-bg-2);
}

.moment-music .aplayer .aplayer-list ol li .aplayer-list-index {
  color: var(--c-text-3);
}

.moment-music .aplayer .aplayer-list ol li .aplayer-list-author {
  color: var(--c-text-3);
}

/* 深色模式特定样式 */
.dark .moment-music .aplayer {
  background: var(--c-bg-1);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.3);
}

.dark .moment-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
  background: var(--c-text-2);
}

/* 播放器背景色和文字颜色在深色模式下调整 */
.dark .moment-music .aplayer.aplayer-fixed .aplayer-body {
  background: var(--c-bg-1);
}

.dark .moment-music .aplayer.aplayer-fixed .aplayer-lrc {
  color: var(--c-text-2);
}

.dark .moment-music .aplayer .aplayer-list ol::-webkit-scrollbar-thumb {
  background-color: var(--c-text-3);
}

.dark .moment-music .aplayer .aplayer-list ol::-webkit-scrollbar-thumb:hover {
  background-color: var(--c-text-2);
}

.dark .moment-music .aplayer .aplayer-miniswitcher {
  background: var(--c-bg-2);
}

.dark .moment-music .aplayer .aplayer-miniswitcher .aplayer-icon path {
  fill: var(--c-text-3);
}

.dark .moment-music .aplayer .aplayer-miniswitcher .aplayer-icon:hover path {
  fill: var(--c-text-1);
}
</style>