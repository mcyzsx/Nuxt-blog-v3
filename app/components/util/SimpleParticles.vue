<template>
  <div class="particles" ref="particlesRef">
    <!-- 金色粒子 -->
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    <div class="particle gold"></div>
    
    <!-- 蓝色粒子 -->
    <div class="particle blue"></div>
    <div class="particle blue"></div>
    <div class="particle blue"></div>
    <div class="particle blue"></div>
    <div class="particle blue"></div>
    
    <!-- 白色粒子 -->
    <div class="particle white"></div>
    <div class="particle white"></div>
    <div class="particle white"></div>
    <div class="particle white"></div>
    <div class="particle white"></div>
    
    <!-- 星星粒子 -->
    <div class="particle star gold-star"></div>
    <div class="particle star blue-star"></div>
    <div class="particle star gold-star"></div>
    <div class="particle star white-star"></div>
    <div class="particle star gold-star"></div>
  </div>
</template>

<script setup>
onMounted(() => {
  console.log('SimpleParticles component mounted');
  
  // 检测深色模式变化
  const updateParticleColors = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
      if (isDark) {
        particle.style.opacity = '1';
      } else {
        particle.style.opacity = '0.7';
      }
    });
  };
  
  // 初始检查
  updateParticleColors();
  
  // 监听主题变化
  const observer = new MutationObserver(updateParticleColors);
  observer.observe(document.documentElement, { attributes: true });
  
  // 清理
  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<style scoped>
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float linear infinite;
}

/* 金色粒子 */
.gold {
  background-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  width: 8px;
  height: 8px;
}

/* 蓝色粒子 */
.blue {
  background-color: rgba(66, 133, 244, 0.7);
  box-shadow: 0 0 15px rgba(66, 133, 244, 0.5);
  width: 6px;
  height: 6px;
}

/* 白色粒子 */
.white {
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  width: 5px;
  height: 5px;
}

/* 星星粒子 */
.star {
  width: 0;
  height: 0;
  background: transparent;
  position: relative;
}

.star:before, .star:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

/* 金色星星 */
.gold-star:before {
  border-bottom-color: rgba(255, 215, 0, 0.9);
  transform: rotate(35deg);
}

.gold-star:after {
  border-bottom-color: rgba(255, 215, 0, 0.9);
  transform: rotate(-35deg);
}

/* 蓝色星星 */
.blue-star:before {
  border-bottom-color: rgba(66, 133, 244, 0.9);
  transform: rotate(35deg);
}

.blue-star:after {
  border-bottom-color: rgba(66, 133, 244, 0.9);
  transform: rotate(-35deg);
}

/* 白色星星 */
.white-star:before {
  border-bottom-color: rgba(255, 255, 255, 0.9);
  transform: rotate(35deg);
}

.white-star:after {
  border-bottom-color: rgba(255, 255, 255, 0.9);
  transform: rotate(-35deg);
}

/* 粒子位置和动画 */
.particle:nth-child(1) { left: 5%; animation-duration: 12s; animation-delay: 0s; }
.particle:nth-child(2) { left: 15%; animation-duration: 15s; animation-delay: 1s; }
.particle:nth-child(3) { left: 25%; animation-duration: 10s; animation-delay: 2s; }
.particle:nth-child(4) { left: 35%; animation-duration: 13s; animation-delay: 3s; }
.particle:nth-child(5) { left: 45%; animation-duration: 11s; animation-delay: 4s; }
.particle:nth-child(6) { left: 55%; animation-duration: 14s; animation-delay: 5s; }
.particle:nth-child(7) { left: 65%; animation-duration: 9s; animation-delay: 6s; }
.particle:nth-child(8) { left: 75%; animation-duration: 16s; animation-delay: 7s; }
.particle:nth-child(9) { left: 10%; animation-duration: 8s; animation-delay: 1.5s; }
.particle:nth-child(10) { left: 20%; animation-duration: 11s; animation-delay: 2.5s; }
.particle:nth-child(11) { left: 30%; animation-duration: 14s; animation-delay: 3.5s; }
.particle:nth-child(12) { left: 40%; animation-duration: 9s; animation-delay: 4.5s; }
.particle:nth-child(13) { left: 50%; animation-duration: 12s; animation-delay: 5.5s; }
.particle:nth-child(14) { left: 60%; animation-duration: 10s; animation-delay: 6.5s; }
.particle:nth-child(15) { left: 70%; animation-duration: 13s; animation-delay: 7.5s; }
.particle:nth-child(16) { left: 80%; animation-duration: 15s; animation-delay: 8.5s; }
.particle:nth-child(17) { left: 90%; animation-duration: 11s; animation-delay: 9.5s; }
.particle:nth-child(18) { left: 12%; animation-duration: 17s; animation-delay: 0.5s; }
.particle:nth-child(19) { left: 22%; animation-duration: 10s; animation-delay: 1s; }
.particle:nth-child(20) { left: 32%; animation-duration: 13s; animation-delay: 2s; }
.particle:nth-child(21) { left: 42%; animation-duration: 8s; animation-delay: 3s; }
.particle:nth-child(22) { left: 52%; animation-duration: 11s; animation-delay: 4s; }
.particle:nth-child(23) { left: 62%; animation-duration: 14s; animation-delay: 5s; }
.particle:nth-child(24) { left: 72%; animation-duration: 9s; animation-delay: 6s; }
.particle:nth-child(25) { left: 82%; animation-duration: 12s; animation-delay: 7s; }

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

/* 添加闪烁效果 */
@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 星星添加闪烁动画 */
.star {
  animation: float linear infinite, twinkle ease-in-out infinite alternate;
}
</style>