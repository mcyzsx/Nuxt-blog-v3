<script setup lang="ts">
// 添加加载状态
const isLoading = ref(true)
const playerReady = ref(false)
const error = ref<string | null>(null)
const playerElement = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!import.meta.client) return

  try {
    // 先等待DOM完全渲染
    await nextTick()
    
    // 等待一小段时间确保元素已渲染到页面
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('开始加载音乐播放器...')
    
    // 使用更简单的初始化方式
    // 确保脚本已加载
    await ensureScriptLoaded()
    
    // 添加更多调试信息
    console.log('脚本加载完成，开始初始化播放器...')
    console.log('播放器元素:', playerElement.value)
    console.log('NeteaseMiniPlayer 对象:', (window as any).NeteaseMiniPlayer)
    
    // 直接初始化
    if (playerElement.value && (window as any).NeteaseMiniPlayer) {
      try {
        console.log('调用 initPlayer 方法...')
        (window as any).NeteaseMiniPlayer.initPlayer(playerElement.value)
        
        // 等待一下看看播放器是否正确初始化
        setTimeout(() => {
          // 检查播放器元素是否有内容
          if (playerElement.value && playerElement.value.children.length > 0) {
            playerReady.value = true
            isLoading.value = false
            console.log('网易云音乐播放器初始化成功')
          } else {
            // 尝试全局初始化作为备用
            console.log('尝试备用初始化方法...')
            try {
              (window as any).NeteaseMiniPlayer.init()
              setTimeout(() => {
                if (playerElement.value && playerElement.value.children.length > 0) {
                  playerReady.value = true
                  isLoading.value = false
                  console.log('网易云音乐播放器备用初始化成功')
                } else {
                  error.value = '播放器初始化后未能正确显示，请检查控制台错误'
                  isLoading.value = false
                }
              }, 2000)
            } catch (backupErr) {
              console.error('备用初始化方法也失败:', backupErr)
              error.value = '播放器初始化失败：' + backupErr.message
              isLoading.value = false
            }
          }
        }, 3000)
      } catch (err) {
        console.error('网易云音乐播放器初始化失败:', err)
        error.value = '播放器初始化失败：' + err.message
        isLoading.value = false
      }
    } else {
      // 如果元素或脚本不可用
      const errorMsg = playerElement.value 
        ? '网易云音乐播放器脚本不可用，请刷新页面重试' 
        : '播放器元素未正确渲染，请刷新页面重试'
      console.error(errorMsg)
      error.value = errorMsg
      isLoading.value = false
    }
  } catch (err) {
    console.error('播放器加载过程中出错:', err)
    error.value = '播放器加载出错：' + err.message
    isLoading.value = false
  }
})

// 刷新页面函数
const reloadPage = () => {
  if (import.meta.client) {
    window.location.reload()
  }
}

// 强制重新初始化播放器
const forceReinit = () => {
  console.log('用户请求强制重新初始化播放器...')
  isLoading.value = true
  error.value = null
  
  // 重置状态
  playerReady.value = false
  
  // 延迟一下再初始化
  setTimeout(async () => {
    try {
      // 确保脚本已加载
      await ensureScriptLoaded()
      
      // 等待DOM完全渲染
      await nextTick()
      
      // 等待一小段时间确保元素已渲染到页面
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 直接初始化
      if (playerElement.value && (window as any).NeteaseMiniPlayer) {
        try {
          console.log('强制调用 initPlayer 方法...')
          (window as any).NeteaseMiniPlayer.initPlayer(playerElement.value)
          
          // 等待一下看看播放器是否正确初始化
          setTimeout(() => {
            // 检查播放器元素是否有内容
            if (playerElement.value && playerElement.value.children.length > 0) {
              playerReady.value = true
              isLoading.value = false
              console.log('网易云音乐播放器强制初始化成功')
            } else {
              error.value = '播放器初始化后未能正确显示，请尝试刷新页面'
              isLoading.value = false
            }
          }, 3000)
        } catch (err) {
          console.error('网易云音乐播放器强制初始化失败:', err)
          error.value = '播放器初始化失败：' + err.message
          isLoading.value = false
        }
      } else {
        const errorMsg = '播放器初始化失败，请刷新页面重试'
        console.error(errorMsg)
        error.value = errorMsg
        isLoading.value = false
      }
    } catch (err) {
      console.error('强制初始化过程中出错:', err)
      error.value = '播放器初始化出错：' + err.message
      isLoading.value = false
    }
  }, 500)
}

// 确保脚本加载的函数
const ensureScriptLoaded = async () => {
  console.log('检查脚本是否已加载...')
  
  // 检查脚本是否已经加载
  if ((window as any).NeteaseMiniPlayer) {
    console.log('脚本已加载')
    return Promise.resolve()
  }
  
  // 检查脚本标签是否存在
  const scriptExists = document.querySelector('script[src="/js/netease-mini-player-v2.js"]')
  console.log('脚本标签是否存在:', !!scriptExists)
  
  if (!scriptExists) {
    // 动态加载脚本
    return new Promise<void>((resolve, reject) => {
      console.log('开始动态加载脚本...')
      const script = document.createElement('script')
      script.src = '/js/netease-mini-player-v2.js'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log('脚本加载事件触发')
        // 再等待一小段时间确保脚本完全执行
        setTimeout(() => {
          if ((window as any).NeteaseMiniPlayer) {
            console.log('NeteaseMiniPlayer 对象已可用')
            resolve()
          } else {
            console.error('脚本加载后无法找到NeteaseMiniPlayer')
            reject(new Error('脚本加载后无法找到NeteaseMiniPlayer'))
          }
        }, 1000) // 增加等待时间
      }
      
      script.onerror = (err) => {
        console.error('脚本加载失败:', err)
        reject(new Error('脚本加载失败'))
      }
      
      // 设置超时
      const timeout = setTimeout(() => {
        console.error('脚本加载超时')
        reject(new Error('脚本加载超时'))
      }, 15000) // 增加超时时间
      
      // 添加到DOM
      document.head.appendChild(script)
      
      // 清理函数
      onUnmounted(() => {
        clearTimeout(timeout)
      })
    })
  }
  
  // 脚本存在但还没加载完成
  console.log('等待现有脚本加载完成...')
  return new Promise<void>((resolve, reject) => {
    const checkScript = () => {
      console.log('检查 NeteaseMiniPlayer 是否可用...')
      if ((window as any).NeteaseMiniPlayer) {
        console.log('NeteaseMiniPlayer 现在可用')
        resolve()
      } else {
        console.log('NeteaseMiniPlayer 尚未可用，继续等待...')
        setTimeout(checkScript, 500)
      }
    }
    
    // 设置超时
    const timeout = setTimeout(() => {
      console.error('等待脚本加载超时')
      reject(new Error('等待脚本加载超时'))
    }, 15000) // 增加超时时间
    
    checkScript()
    
    // 清理函数
    onUnmounted(() => {
      clearTimeout(timeout)
    })
  })
}
</script>

<template>
  <div class="author-content-item music-player">
    <div class="music-player-inner">
      <!-- 加载中状态 -->
      <div v-if="isLoading" class="player-loading">
        <div class="loading-spinner"></div>
        <p>音乐播放器加载中...</p>
        <button @click="forceReinit" class="force-button">强制初始化</button>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="player-error">
        <p class="error-message">{{ error }}</p>
        <div class="button-group">
          <button @click="forceReinit" class="retry-button">重新初始化</button>
          <button @click="reloadPage" class="retry-button">刷新页面</button>
        </div>
      </div>
      
      <!-- 正常播放器 -->
      <div
        ref="playerElement"
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
  
  .button-group {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .retry-button, .force-button {
    padding: 0.5rem 1rem;
    background: var(--c-primary-soft);
    color: var(--c-primary);
    border: 1px solid var(--c-primary);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    
    &:hover {
      background: var(--c-primary);
      color: white;
    }
  }
  
  .force-button {
    background: var(--c-bg-soft);
    color: var(--c-text-2);
    border: 1px solid var(--c-border);
    margin-top: 0.5rem;
    
    &:hover {
      background: var(--c-bg-1);
      color: var(--c-text);
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
