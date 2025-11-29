<script setup>
const showPlayer = ref(false)

onMounted(() => {
	// 确保在客户端显示播放器
	showPlayer.value = true

	// 延迟初始化，确保脚本加载完成
	setTimeout(() => {
		if (window.NeteaseMiniPlayer) {
			window.NeteaseMiniPlayer.init?.()
		}
	}, 500)
})
</script>

<template>
<NuxtLoadingIndicator />
<SkipToContent />
<ZSidebar />
<div id="content">
	<main id="main-content">
		<NuxtPage />
		<ZFooter />
	</main>
	<ZAside />
</div>
<ZPanel />
<ZPopover />

<!-- 音乐播放器 - 使用原生HTML确保正确初始化 -->
<ClientOnly>
	<div
		v-if="showPlayer"
		class="netease-mini-player"
		data-playlist-id="13681647281"
		data-theme="auto"
		data-position="bottom-right"
		data-default-minimized="true"
		data-lyric="true"
		data-autoplay="false"
	/>
</ClientOnly>
</template>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
// Nuxt 根元素 id
#z-root {
  display: flex;
  justify-content: center;
  gap: 1rem;
  min-width: 0;
}

// 合并处理 #z-sidebar, #z-aside
aside {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  width: 280px;
  height: 100vh;
  height: 100dvh;
  scrollbar-width: thin;

  @media (max-width: $breakpoint-widescreen) {
    flex-shrink: 0.2;
  }
}

#content {
  display: flex;
  gap: 1rem;

  width: $breakpoint-widescreen;
  min-width: 0;

  > main {
    flex-grow: 1;
    min-width: 0;
  }
}

// 音乐播放器样式调整
.netease-mini-player {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 9999;
}
</style>