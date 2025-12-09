<!-- Social.vue -->
<script setup lang="ts">
// 从 about.ts 里取社交数据
import { about } from '../../about'
// 取第一条数据的 social 数组
const socialList = about[0]?.social ?? []
</script>

<template>
<div class="author-content-item social">
	<div class="author-content-item-tips">
		社交
	</div>

	<div class="social-links">
		<a
			v-for="s in socialList"
			:key="s.name"
			:href="s.href"
			target="_blank"
			rel="noopener"
			class="social-link"
		>
			<span :class="s.class" class="social-icon" />
			<span class="social-name">{{ s.name }}</span>
		</a>
	</div>
</div>
</template>

<style lang="scss" scoped>
/* ========= 与「技能」模块统一的视觉方案 ========= */
.author-content-item.social {
  /* 1. 去掉卡片背景/边框，完全透明 */
  background: transparent;
  border: none;
  padding: 0; /* 外层间距由父级统一控制，这里清零 */
}

.author-content-item-tips {
  opacity: 0.8;
  font-size: 12px;
  margin-bottom: 0.5rem;
}

/* 链接包裹层 */
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* 与 skill 卡片保持一致 */
}

/* 单个按钮 */
.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--c-text-1); /* 文字颜色继承自主题 */
  text-decoration: none;
  border-radius: 1rem;

  /* 关键：与 skill 完全相同的背景/边框逻辑 */
  background-color: color-mix(in srgb, currentColor 5%, transparent);
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
}

/* 悬浮态 */
.social-link:hover {
  background-color: color-mix(in srgb, currentColor 10%, transparent);
  border-color: color-mix(in srgb, currentColor 25%, transparent);
  transform: translateY(-2px);
}

/* 图标 */
.social-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 暗黑模式仅需微调对比度（继承 currentColor 已足够） */
:deep(.dark-mode) .social-link {
  /* 如有特殊需求可再覆盖，这里留空即可 */
}

/* ========= 响应式保持与之前一致 ========= */
@media (max-width: 768px) {
  .social-link {
    padding: 0.4rem 0.9rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .social-links {
    flex-direction: column;
  }
  .social-link {
    justify-content: flex-start;
  }
}
</style>
