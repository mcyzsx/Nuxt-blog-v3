<script setup lang="ts">
// 添加加载状态
const isLoading = ref(true)
const playerReady = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  if (!import.meta.client) return

  // 等待NeteaseMiniPlayer脚本加载完成
  const checkPlayer = () => {
    if ((window as any).NeteaseMiniPlayer) {
      try {
        (window as any).NeteaseMiniPlayer.init?.()
        playerReady.value = true
        isLoading.value = false
        console.log('网易云音乐播放器初始化成功')
      } catch (err) {
        error.value = '播放器初始化失败'
        isLoading.value = false
        console.error('网易云音乐播放器初始化失败:', err)
      }
    } else {
      // 如果还没加载，延迟重试
      setTimeout(checkPlayer, 500)
    }
  }

  // 设置超时，避免无限等待
  const timeout = setTimeout(() => {
    if (isLoading.value) {
      error.value = '播放器加载超时，请刷新页面重试'
      isLoading.value = false
      console.warn('网易云音乐播放器加载超时')
    }
  }, 10000) // 10秒超时

  // 开始检查
  checkPlayer()

  // 清理函数
  onUnmounted(() => {
    clearTimeout(timeout)
  })
})
</script>

<template>
  <div class="author-content-item music-player">
    <div class="music-player-inner">
      <!-- 加载中状态 -->
      <div v-if="isLoading" class="player-loading">
        <div class="loading-spinner"></div>
        <p>音乐播放器加载中...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="player-error">
        <p class="error-message">{{ error }}</p>
        <button @click="window.location.reload()" class="retry-button">刷新页面</button>
      </div>
      
      <!-- 正常播放器 -->
      <div
        v-else
        class="netease-mini-player"
        data-playlist-id="13681647281"
        data-theme="auto"
        data-position="static"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.author-content-item.music-player {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: visible;
  z-index: 5;
}

.music-player-inner {
  display: flex;
  justify-content: center;
  min-height: 120px; // 为加载状态预留空间
  align-items: center;
}

// 加载状态样式
.player-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: var(--c-text-2);
  
  p {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--c-border-soft);
  border-top: 3px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

// 错误状态样式
.player-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: var(--c-text-2);
  text-align: center;
  
  .error-message {
    margin-bottom: 1rem;
    color: var(--c-error, #ff6b6b);
  }
  
  .retry-button {
    padding: 0.5rem 1rem;
    background: var(--c-primary-soft);
    color: var(--c-primary);
    border: 1px solid var(--c-primary);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: var(--c-primary);
      color: white;
    }
  }
}

// 播放器样式
:deep(.netease-mini-player) {
  position: relative !important;
  bottom: auto !important;
  right: auto !important;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
