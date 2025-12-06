<!-- pages/message-board.vue 或任意页面 -->
<script setup lang="ts">
/* ===================== 1. 头部 SEO & 布局 ===================== */
useSeoMeta({
	title: '留言板',
	description: '在这里留下你的想法和建议',
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'poetry'])

/* ===================== 2. 初始化 Twikoo ===================== */
const appConfig = useAppConfig()

onMounted(async () => {
	// 2-1 初始化评论区
	window.twikoo?.init({
		envId: appConfig.twikoo?.envId, // 腾讯云环境 id
		el: '#twikoo',
	})

	// 2-2 拉取评论总数并回填
	if (window.twikoo) {
		const res = await window.twikoo.getCommentsCount({
			envId: appConfig.twikoo?.envId,
			urls: [window.location.pathname], // 统计当前页面
		})
		// 官方返回 { total: number }[]
		const total = res[0]?.total || 0
		const countDom = document.querySelector('.twikoo-comment-count') as HTMLElement
		if (countDom)
			countDom.textContent = String(total)
	}
})
</script>

<template>
<header class="f-header">
	<h3 class="f-title">
		留言板
	</h3>
	<p class="f-desc">
		在这里留下你的建议或者想和我说的话
	</p>
</header>

<div class="messages-content">
	<!-- 欢迎卡片 -->
	<div class="welcome-card card">
		<div class="welcome-icon">
			<Icon name="ph:hand-waving" />
		</div>
		<div class="welcome-text">
			<h3>
				这里已经存在 <span class="twikoo-comment-count">...</span> 条留言
			</h3>
			<p>这里是大家交流想法、分享心得的地方。你可以：</p>
			<ul>
				<li><Icon name="ph:chat-bold" /> 留下对网站的建议和反馈</li>
				<li><Icon name="ph:lightbulb-bold" /> 分享有趣的想法和见解</li>
				<li><Icon name="ph:users-bold" /> 与其他访客进行友好交流</li>
				<li><Icon name="ph:question-bold" /> 提出你的疑问和问题</li>
			</ul>
		</div>
	</div>

	<!-- 提示 -->
	<p class="notice">
		<Icon name="ph:info-bold" />
		请文明留言，共同维护良好的交流环境
	</p>

	<!-- Twikoo 评论区 -->
	<section class="z-comment">
		<h3 class="text-creative">
			评论区
		</h3>
		<div id="twikoo">
			<p>评论加载中...</p>
		</div>
	</section>
</div>
</template>

<style scoped lang="scss">
.messages-content {
  display: flex;
  flex-direction: column;
}
.z-comment {
  margin: 3rem 1rem;
  > h3 {
    margin-top: 3rem;
    font-size: 1.25rem;
  }
}

/* ===== 以下是你原来 Twikoo 的深度样式，完全保留 ===== */
:deep(#twikoo) {
  margin: 2em 0;
  .tk-admin-container {
    position: fixed;
    z-index: calc(var(--z-index-popover) + 1);
  }
  .tk-input {
    font-family: var(--font-monospace);
  }
  .tk-time {
    color: var(--c-text-3);
  }
  .tk-main {
    margin-top: -0.1rem;
  }
  .tk-content {
    margin-top: 0.1rem;
  }
  .tk-comments-title,
  .tk-nick > strong {
    font-family: var(--font-creative);
  }
  .tk-owo-emotion {
    width: auto;
    height: 1.4em;
    vertical-align: text-bottom;
  }
  .tk-extras,
  .tk-footer {
    font-size: 0.7rem;
    color: var(--c-text-3);
  }
  .tk-replies:not(.tk-replies-expand) {
    mask-image: linear-gradient(#fff 50%, transparent);
  }
  .tk-expand {
    border-radius: 0.5rem;
    transition: background-color 0.1s;
  }
}

:deep(:where(.tk-preview-container, .tk-content)) {
  pre {
    overflow: auto;
    border-radius: 0.5rem;
    font-size: 0.8125rem;
  }
  p {
    margin: 0.2em 0;
  }
  img {
    border-radius: 0.5em;
  }
  menu,
  ol,
  ul {
    margin: 0.5em 0;
    padding-inline-start: 1.5em;
    font-size: 0.9rem;
    list-style: revert;
    > li {
      margin: 0.2em 0;
      &::marker {
        color: var(--c-primary);
      }
    }
  }
  blockquote {
    margin: 0.5em 0;
    padding: 0.2em 0.5em;
    border-inline-start: 4px solid var(--c-border);
    border-radius: 4px;
    background-color: var(--c-bg-2);
    font-size: 0.9rem;
  }
}
</style>
