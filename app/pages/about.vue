<script setup lang="ts">
import Aboutsitetips from '~/components/about/aboutsitetips.vue'
import Author from '~/components/about/author.vue'
import Game from '~/components/about/game.vue'
import Maxim from '~/components/about/maxim.vue'
import MyInfoAndSayHello from '~/components/about/myInfoAndSayHello.vue'
import Single from '~/components/about/single.vue'
import Skillinfo from '~/components/about/skillinfo.vue'
import Social from '~/components/about/social.vue'
import Technology from '~/components/about/technology.vue'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'weather', 'blog-tech', 'latest-comments', 'comm-group', 'poetry'])

/* ---------- 浏览器端再加载 ---------- */
onMounted(async () => {
	if (process.client) { // ✅ 守卫
		function loadScript(url: string, callback?: () => void) {
			return new Promise<void>((resolve, reject) => {
				if (document.querySelector(`script[src="${url}"]`)) {
					console.log('JS脚本已加载')
					resolve()
					return
				}
				const script = document.createElement('script')
				script.src = url
				script.type = 'text/javascript'
				script.async = true
				script.onload = () => {
					console.log('脚本加载完成')
					callback?.()
					resolve()
				}
				script.onerror = reject
				document.head.appendChild(script)
			})
		}

		loadScript('/js/about.js')
			.then(() => console.log('友链顶部重要JS加载完毕'))
			.catch(err => console.error('友链顶部重要JS加载失败', err))
	}
})
</script>

<template>
<link href="/assets/css/about.css" rel="stylesheet"></link>
<div id="about-page" style="margin-top: 1rem;margin-left: 1rem;margin-right: 1rem;">
	<Author />
	<div class="author-page-content">
		<div class="author-content">
			<MyInfoAndSayHello />
		</div>
		<div class="author-content">
			<Aboutsitetips />
			<Maxim />
		</div>
		<div class="author-content">
			<!-- 来自于主流HEO主题的衍生版本 -->
			<Skillinfo />
			<!-- 来自于柳神的关于页面版本 -->
			<Social />
		</div>
		<div class="author-content row">
			<Technology />
			<Game />
		</div>
		<div class="author-content">
			<Single />
		</div>
	</div>
</div>
</template>
