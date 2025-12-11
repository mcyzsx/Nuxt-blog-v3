<template>
  <div class="test-page">
    <h1>音乐播放器测试页面</h1>
    
    <div class="player-container">
      <h2>直接使用播放器</h2>
      <div 
        class="netease-mini-player" 
        data-playlist-id="13681647281"
        data-theme="auto"
        data-position="static"
        data-embed="true"
      ></div>
    </div>
    
    <div class="player-container">
      <h2>使用组件</h2>
      <AboutMusicPlayer />
    </div>
  </div>
</template>

<script setup>
import AboutMusicPlayer from '~/components/about/musicPlayer.vue'

onMounted(() => {
  if (import.meta.client) {
    // 确保CSS加载
    const linkElement = document.querySelector('link[href="/css/netease-mini-player-v2.css"]')
    if (!linkElement) {
      const cssLink = document.createElement('link')
      cssLink.rel = 'stylesheet'
      cssLink.href = '/css/netease-mini-player-v2.css'
      document.head.appendChild(cssLink)
      console.log('已动态加载CSS文件')
    } else {
      console.log('CSS文件已存在')
    }
    
    // 确保脚本加载
    if (!window.NeteaseMiniPlayer) {
      const script = document.createElement('script')
      script.src = '/js/netease-mini-player-v2.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        console.log('脚本加载完成，初始化播放器...')
        setTimeout(() => {
          if (window.NeteaseMiniPlayer) {
            window.NeteaseMiniPlayer.init()
            console.log('播放器初始化完成')
          } else {
            console.error('脚本加载后无法找到NeteaseMiniPlayer')
          }
        }, 1000)
      }
      
      document.head.appendChild(script)
    } else {
      console.log('脚本已加载，初始化播放器...')
      setTimeout(() => {
        if (window.NeteaseMiniPlayer) {
          window.NeteaseMiniPlayer.init()
          console.log('播放器初始化完成')
        }
      }, 1000)
    }
  }
})
</script>

<style>
.test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.player-container {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

/* 播放器样式 */
.netease-mini-player {
  margin: 0 auto;
  position: relative !important;
  bottom: auto !important;
  right: auto !important;
  min-height: 120px;
  width: 400px;
  max-width: 100%;
}
</style>