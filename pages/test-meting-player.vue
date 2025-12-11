<template>
  <div class="test-player-page" style="padding: 2rem;">
    <h1 style="margin-bottom: 1.5rem;">音乐播放器测试页面</h1>
    
    <div style="margin-bottom: 2rem;">
      <h2 style="margin-bottom: 1rem;">Meting + APlayer 播放器</h2>
      <AboutMusicPlayer />
    </div>
    
    <div style="margin-bottom: 2rem;">
      <h2 style="margin-bottom: 1rem;">手动创建的播放器</h2>
      <div id="manual-player"></div>
    </div>
    
    <div style="margin-top: 2rem;">
      <p style="color: var(--c-text-2); font-size: 0.9rem;">
        如果播放器无法正常显示，请检查控制台错误信息。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AboutMusicPlayer from '~/components/about/musicPlayer.vue'

// 手动创建一个 Meting 播放器用于对比
onMounted(async () => {
  if (process.client) {
    // 等待DOM渲染
    await nextTick()
    
    try {
      // 加载CSS
      const linkElement = document.querySelector('link[href="/css/APlayer.min.css"]')
      if (!linkElement) {
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = '/css/APlayer.min.css'
        document.head.appendChild(cssLink)
      }
      
      // 加载APlayer
      if (!(window as any).APlayer) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = '/js/APlayer.min.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load APlayer'))
          document.head.appendChild(script)
        })
      }
      
      // 加载Meting
      if (!(window as any).MetingJS) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = '/js/Meting.min.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load MetingJS'))
          document.head.appendChild(script)
        })
      }
      
      // 创建播放器
      const container = document.getElementById('manual-player')
      if (container) {
        new (window as any).MetingJS({
          element: container,
          server: 'netease',
          type: 'playlist',
          id: '13681647281',
          api: 'https://meting.kemiaosw.top/api'
        })
      }
    } catch (err) {
      console.error('手动创建播放器失败:', err)
    }
  }
})
</script>

<style lang="scss" scoped>
.test-player-page {
  min-height: 100vh;
  background: var(--c-bg);
  color: var(--c-text);
}
</style>