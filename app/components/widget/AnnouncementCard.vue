<script setup lang="ts">
// 逻辑完全沿用你原来的
const appConfig = useAppConfig()
const message = appConfig.announcement?.enabled ? appConfig.announcement.message : ''
</script>

<template>
<ZWidget v-if="message" card title="公告">
	<div class="announcement-content">
		<!-- 喇叭图标 -->
		<div class="speaker-icon">
			<span class="speaker-emoji">📢</span>
		</div>

		<!-- 富文本内容 -->
		<div
			class="announcement-text markdown-body"
			v-html="message"
		/>
	</div>
</ZWidget>
</template>

<style lang="scss" scoped>
/*======  结构与动效完全沿用你原来的  ======*/
.announcement-content {
  display: flex;
  align-items: flex-start;   /* 富文本可能多行，顶部对齐 */
  gap: 0.875rem;
  padding: 0.875rem 1.75rem;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  max-width: fit-content;
  margin: 0 auto;
  border-radius: 0.75rem;
  background: rgba(var(--c-bg-soft-rgb), 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--c-border-rgb), 0.12);
}

/* 喇叭图标样式略（你原来已经写好了，直接保留） */
.speaker-icon { /* ... */ }
.speaker-emoji { /* ... */ }

/*====== 富文本 reset ======*/
.markdown-body {
  flex: 1;
  text-align: left;          /* 富文本默认左对齐 */
  font-weight: 550;
  color: var(--c-text-1);
  font-size: 0.925rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
  cursor: default;
  z-index: 1;

  /* 统一继承当前主题色 */
  a {
    color: var(--c-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.2s;
    &:hover { opacity: 0.8; }
  }

  /* 行内代码 */
  code {
    padding: 2px 4px;
    border-radius: 4px;
    background: rgba(var(--c-primary-rgb), 0.08);
    font-size: 0.85em;
    color: var(--c-primary);
  }

  /* 代码块 */
  pre {
    margin: 0.5em 0;
    padding: 0.75em 1em;
    border-radius: 6px;
    background: var(--c-bg-code, #f6f8fa);
    overflow: auto;
    code { background: none; padding: 0; color: inherit; }
  }

  /* 标题 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0.4em 0 0.2em;
    font-weight: 600;
    color: var(--c-text-1);
  }

  /* 列表 */
  ul, ol {
    margin: 0.4em 0 0.4em 1.2em;
  }

  /* 分割线 */
  hr {
    margin: 0.8em 0;
    border: none;
    border-top: 1px solid var(--c-border);
  }

  /* 引用 */
  blockquote {
    margin: 0.5em 0;
    padding-left: 1em;
    border-left: 3px solid var(--c-primary);
    color: var(--c-text-2);
  }
}

/*====== 响应式 & 减少动画偏好  ======*/
@media (max-width: 768px) {
  .announcement-content { padding: 0.75rem 1.25rem; }
  .markdown-body { font-size: 0.9rem; }
}
@media (prefers-reduced-motion: reduce) {
  .announcement-content, .markdown-body * {
    animation: none !important;
    transition: none !important;
  }
}
</style>
