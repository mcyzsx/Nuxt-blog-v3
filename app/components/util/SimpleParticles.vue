<template>
  <div class="particles" ref="particlesRef">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </div>
</template>

<script setup>
onMounted(() => {
  console.log('SimpleParticles component mounted');
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
  z-index: 100;
  overflow: hidden;
}

.particle {
  position: absolute;
  background-color: rgba(255, 215, 0, 0.8);
  border-radius: 50%;
  animation: float linear infinite;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  width: 10px;
  height: 10px;
}

.particle:nth-child(1) {
  left: 10%;
  animation-duration: 8s;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  left: 30%;
  animation-duration: 12s;
  animation-delay: 1s;
}

.particle:nth-child(3) {
  left: 50%;
  animation-duration: 10s;
  animation-delay: 2s;
}

.particle:nth-child(4) {
  left: 70%;
  animation-duration: 15s;
  animation-delay: 3s;
}

.particle:nth-child(5) {
  left: 90%;
  animation-duration: 11s;
  animation-delay: 4s;
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}
</style>