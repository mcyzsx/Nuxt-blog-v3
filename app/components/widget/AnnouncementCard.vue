<script setup lang="ts">
const appConfig = useAppConfig()
const message = appConfig.announcement?.enabled ? appConfig.announcement.message : ''
</script>

<template>
<ZWidget v-if="message" card title="公告">
	<div class="announcement-content">
		<!-- 动态喇叭图标 -->
		<div class="speaker-icon">
			<span class="speaker-emoji">📢</span>
		</div>

		<!-- 公告文字内容 -->
		<div class="announcement-text">
			{{ message }}
		</div>
	</div>
</ZWidget>
</template>

<style lang="scss" scoped>
.announcement-content {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.75rem;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  max-width: fit-content;
  margin: 0 auto;
  border-radius: 0.75rem;
  background: rgba(var(--c-bg-soft-rgb), 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--c-border-rgb), 0.12);
}

.announcement-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--c-primary-rgb), 0.08) 0%,
    rgba(var(--c-primary-rgb), 0.04) 50%,
    rgba(var(--c-primary-rgb), 0.06) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
  border-radius: inherit;
}

@keyframes subtleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.01);
  }
}

.speaker-icon {
  flex-shrink: 0;
  z-index: 1;
  position: relative;

  .speaker-emoji {
    font-size: 1.5rem;
    display: inline-block;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter:
      drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))
      drop-shadow(0 0 6px rgba(var(--c-primary-rgb), 0.25));
    animation: iconFloat 3s ease-in-out infinite;
  }
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
    filter:
      drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))
      drop-shadow(0 0 6px rgba(var(--c-primary-rgb), 0.25));
  }
  33% {
    transform: translateY(-3px) scale(1.05) rotate(3deg);
    filter:
      drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))
      drop-shadow(0 0 10px rgba(var(--c-primary-rgb), 0.4));
  }
  66% {
    transform: translateY(2px) scale(0.95) rotate(-2deg);
    filter:
      drop-shadow(0 3px 6px rgba(0, 0, 0, 0.18))
      drop-shadow(0 0 8px rgba(var(--c-primary-rgb), 0.3));
  }
}

.announcement-content:hover .speaker-icon .speaker-emoji {
  transform: scale(1.25);
  filter:
    drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))
    drop-shadow(0 0 16px rgba(var(--c-primary-rgb), 0.5));
  animation: iconPulse 1.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1.25) rotate(5deg);
    filter:
      drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))
      drop-shadow(0 0 16px rgba(var(--c-primary-rgb), 0.5));
  }
  50% {
    transform: scale(1.3) rotate(7deg);
    filter:
      drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))
      drop-shadow(0 0 20px rgba(var(--c-primary-rgb), 0.7));
  }
}

.announcement-text {
  flex: 1;
  text-align: center;
  font-weight: 550;
  color: var(--c-text-1);
  font-size: 0.925rem;
  line-height: 1.6;
  transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  cursor: default;
  z-index: 1;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  position: relative;
  padding: 0.625rem 0;
  font-family: var(--font-creative);
  animation: textPulse 3s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% {
    color: var(--c-text-1);
    transform: scale(1);
    text-shadow:
      0 1px 2px rgba(0, 0, 0, 0.08),
      0 0 4px rgba(var(--c-primary-rgb), 0.1);
  }
  50% {
    color: var(--c-primary);
    transform: scale(1.02);
    text-shadow:
      0 2px 6px rgba(0, 0, 0, 0.12),
      0 0 12px rgba(var(--c-primary-rgb), 0.3),
      0 0 18px rgba(var(--c-primary-rgb), 0.2);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow:
      0 1px 2px rgba(0, 0, 0, 0.1),
      0 0 4px rgba(var(--c-primary-rgb), 0.1);
    transform: translateY(0);
  }
  50% {
    text-shadow:
      0 2px 6px rgba(0, 0, 0, 0.15),
      0 0 12px rgba(var(--c-primary-rgb), 0.3),
      0 0 18px rgba(var(--c-primary-rgb), 0.2);
    transform: translateY(-1px);
  }
}

.announcement-text::before {
  display: none;
}

.announcement-content {
  animation:
    slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards,
    contentFloat 6s ease-in-out infinite 0.6s;
}

@keyframes contentFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(12px);
  }
  50% {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(16px);
  }
}

.announcement-content:hover {
  transform: translateY(-2px);
}

.announcement-content:hover::before {
  opacity: 0;
}

.announcement-content:hover .announcement-text {
  color: var(--c-primary);
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.15),
    0 0 12px rgba(var(--c-primary-rgb), 0.3),
    0 0 20px rgba(var(--c-primary-rgb), 0.2);
  animation: textHighlight 2s ease-in-out;
}

@keyframes textHighlight {
  0%, 100% {
    color: var(--c-primary);
    text-shadow:
      0 1px 3px rgba(0, 0, 0, 0.15),
      0 0 12px rgba(var(--c-primary-rgb), 0.3),
      0 0 20px rgba(var(--c-primary-rgb), 0.2);
  }
  50% {
    color: var(--c-primary-dark);
    text-shadow:
      0 1px 4px rgba(0, 0, 0, 0.18),
      0 0 16px rgba(var(--c-primary-rgb), 0.4),
      0 0 24px rgba(var(--c-primary-rgb), 0.3);
  }
}

.announcement-content:hover .announcement-text {
  animation: textHighlight 1.5s ease-in-out forwards;
}

@keyframes textHighlight {
  0% {
    color: var(--c-text-1);
    transform: scale(1);
    text-shadow:
      0 1px 2px rgba(0, 0, 0, 0.08),
      0 0 4px rgba(var(--c-primary-rgb), 0.1);
  }
  100% {
    color: var(--c-primary);
    transform: scale(1.05);
    text-shadow:
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 0 20px rgba(var(--c-primary-rgb), 0.4),
      0 0 30px rgba(var(--c-primary-rgb), 0.3);
  }
}

.announcement-content:hover .announcement-text {
  color: var(--c-primary);
  text-shadow:
    0 0 12px rgba(var(--c-primary-rgb), 0.4),
    0 0 20px rgba(var(--c-primary-rgb), 0.2),
    0 1px 2px rgba(0, 0, 0, 0.15);
  transform: translateY(-0.5px);
}

.announcement-content:hover .announcement-text::before {
  width: 80%;
}

/* 入场动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* 退出动画 */
@keyframes slideOutDown {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(8px);
  }
}

.announcement-content {
  animation:
    slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards,
    subtleFloat 6s ease-in-out infinite 0.6s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .announcement-content {
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    border-radius: 0.375rem;
    max-width: 90%;
    backdrop-filter: blur(16px);
  }

  .speaker-icon svg {
    width: 20px;
    height: 20px;
  }

  .announcement-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

@media (max-width: 480px) {
  .announcement-content {
    padding: 0.625rem 1rem;
    gap: 0.625rem;
    border-radius: 0.25rem;
    max-width: 95%;
    backdrop-filter: blur(12px);
  }

  .speaker-icon svg {
    width: 18px;
    height: 18px;
  }

  .announcement-text {
    font-size: 0.85rem;
    line-height: 1.3;
  }

  .announcement-text::before {
    bottom: 0.125rem;
    height: 1.5px;
  }
}

/* 减少动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .announcement-content,
  .announcement-content:hover,
  .speaker-icon svg,
  .announcement-text,
  .announcement-text::before {
    transition: none;
    animation: none;
  }

  .announcement-content:hover {
    transform: none;
  }
}
</style>
