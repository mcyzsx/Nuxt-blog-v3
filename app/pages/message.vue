<script setup lang="ts">
useSeoMeta({
	title: '留言板',
	description: '在这里留下你的想法和建议',
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group'])

const appConfig = useAppConfig()

onMounted(() => {
	window.twikoo?.init({
		envId: appConfig.twikoo?.envId,
		// twikoo 会把挂载后的元素变为 #twikoo
		el: '#twikoo',
	})
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
	<div class="welcome-card card">
		<div class="welcome-icon">
			<Icon name="ph:hand-waving" />
		</div>
		<div class="welcome-text">
			<h3>欢迎来到留言板</h3>
			<p>这里是大家交流想法、分享心得的地方。你可以：</p>
			<ul>
				<li><Icon name="ph:chat-bold" /> 留下对网站的建议和反馈</li>
				<li><Icon name="ph:lightbulb-bold" /> 分享有趣的想法和见解</li>
				<li><Icon name="ph:users-bold" /> 与其他访客进行友好交流</li>
				<li><Icon name="ph:question-bold" /> 提出你的疑问和问题</li>
			</ul>
		</div>
	</div>
	<p class="notice">
		<Icon name="ph:info-bold" />
		请文明留言，共同维护良好的交流环境
	</p>

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

<style lang="scss" scoped>
.messages-content {
  display: flex;
  flex-direction: column;
}
.z-comment{
  margin: 0 0.5rem !important;
}

.z-comment {
	margin: 3rem 1rem;

	> h3 {
		margin-top: 3rem;
		font-size: 1.25rem;
	}
}

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

	.tk-comments-title, .tk-nick > strong {
		font-family: var(--font-creative);
	}

	.tk-owo-emotion {
		width: auto;
		height: 1.4em;
		vertical-align: text-bottom;
	}

	.tk-extras, .tk-footer {
		font-size: 0.7rem;
		color: var(--c-text-3);
	}

	.tk-replies:not(.tk-replies-expand) {
		mask-image: linear-gradient(#FFF 50%, transparent);
	}

	.tk-expand {
		border-radius: 0.5rem;
		transition: background-color 0.1s;
	}
}

:deep(:where(.tk-preview-container,.tk-content)) {
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

	menu, ol, ul {
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