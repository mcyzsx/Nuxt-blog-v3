<!-- about.vue -->
<template>
  <!-- 外链样式 -->
  <link href="/assets/css/about.css" rel="stylesheet">

  <div id="about-page" style="margin-top:1rem;margin-left:1rem;margin-right:1rem;">
    <!-- 顶部作者信息 -->
    <Author />

    <div class="author-page-content">
      <!-- 第 1 行：打招呼 -->
      <div class="author-content">
        <MyInfoAndSayHello />
      </div>

      <!-- 第 2 行：站点提示 + 格言 -->
      <div class="author-content">
        <Aboutsitetips />
        <Maxim />
      </div>

      <!-- 第 3 行：技能 -->
      <div class="author-content">
        <Skillinfo />
      </div>

      <!-- 第 4 行：音乐播放器 -->
      <div class="author-content">
        <AboutMusicPlayer />
      </div>

      <!-- 第 5 行：社交卡片（已重构） -->
      <div class="author-content">
        <div class="author-content-item social">
          <h3 class="author-title">联系我</h3>
          <div class="social-list">
            <ZButton
              v-tip="'邮箱'"
              class="social-link"
              icon="ph:envelope-simple-bold"
              to="mailto:me@mcyzsx.top"
              aria-label="发送邮件到 me@mcyzsx.top"
            />
            <ZButton
              v-tip="'QQ'"
              class="social-link"
              icon="ri:qq-line"
              to="https://qm.qq.com/q/Ha1GZQtMgE"
              aria-label="QQ 联系方式"
            />
            <ZButton
              v-tip="'哔哩哔哩'"
              class="social-link"
              icon="ri:bilibili-fill"
              to="https://space.bilibili.com/3546643173477234"
              aria-label="哔哩哔哩主页"
            />
            <ZButton
              v-tip="'Telegram'"
              class="social-link"
              icon="ph:telegram-logo-bold"
              to="https://t.me/KemiaoJun"
              aria-label="Telegram 联系方式"
            />
            <ZButton
              v-tip="'网易云'"
              class="social-link"
              icon="ri:netease-cloud-music-line"
              to="https://music.163.com/#/playlist?id=13681647281"
              aria-label="网易云音乐播放列表"
            />
            <ZButton
              v-tip="'X'"
              class="social-link"
              icon="ph:x-logo-bold"
              to="https://x.com/kemiao"
              aria-label="X (Twitter) 主页"
            />
          </div>
        </div>
      </div>

      <!-- 第 6 行：技术 + 游戏 -->
      <div class="author-content row">
        <Technology />
        <Game />
      </div>

      <!-- 第 7 行：站点统计 -->
      <div class="author-content">
        <Umami />
      </div>

      <!-- 第 8 行：单曲 -->
      <div class="author-content">
        <Single />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ----------------- 组件引用 ----------------- */
import Aboutsitetips from '~/components/about/aboutsitetips.vue'
import Author from '~/components/about/author.vue'
import Game from '~/components/about/game.vue'
import Maxim from '~/components/about/maxim.vue'
import MyInfoAndSayHello from '~/components/about/myInfoAndSayHello.vue'
import AboutMusicPlayer from '~/components/about/musicPlayer.vue'
import Umami from '~/components/about/umami.vue'
import Single from '~/components/about/single.vue'
import Skillinfo from '~/components/about/skillinfo.vue'
import Technology from '~/components/about/technology.vue'

/* ----------------- 布局 store ----------------- */
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'weather', 'blog-tech', 'latest-comments', 'comm-group', 'poetry'])

/* ----------------- 客户端脚本 ----------------- */
onMounted(async () => {
  if (process.client) {
    // 直接内联实现关于页面的功能，避免外部脚本加载问题
    const initAboutPage = () => {
      try {
        // 滚动显示效果
        let pursuitInterval: NodeJS.Timeout | null = null
        
        const startScrollEffect = () => {
          const show = document.querySelector('span[data-show]')
          const next = show?.nextElementSibling || document.querySelector('.first-tips')
          const up = document.querySelector('span[data-up]')
          
          if (up) {
            up.removeAttribute('data-up')
          }
          
          if (show) {
            show.removeAttribute('data-show')
            show.setAttribute('data-up', '')
          }
          
          if (next) {
            next.setAttribute('data-show', '')
          }
        }
        
        // 启动滚动效果
        pursuitInterval = setInterval(startScrollEffect, 2000)
        
        // 清理函数
        return () => {
          if (pursuitInterval) {
            clearInterval(pursuitInterval)
            pursuitInterval = null
          }
        }
      } catch (error) {
        console.error('关于页面功能初始化失败:', error)
      }
    }
    
    // 初始化功能
    const cleanup = initAboutPage()
    
    // 组件卸载时清理
    onUnmounted(() => {
      cleanup?.()
    })
    
    console.log('关于页面功能初始化成功')
  }
})
</script>

<style lang="scss" scoped>
/* ===== 社交卡片 ===== */
.author-content-item.social {
  width: 100%;
  text-align: center;
}

.social-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--c-bg-1);
  border: 1px solid var(--c-border);
  color: var(--c-text-1);
  font-size: 1.5rem;
  transition: all .25s ease;
  box-shadow: var(--heo-shadow-border);

  &:hover {
    background: var(--c-bg-soft);
    color: var(--c-primary, var(--c-text));
    transform: translateY(-2px);
  }
}

/* 移动端微调 */
@media screen and (max-width: 768px) {
  .social-list {
    gap: 0.75rem;
  }
  
  .social-link {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
  }
}
</style>