<script setup lang="ts">
import { computed } from 'vue'
// 导入外部数据
import { creativityData } from '../../creativity'
</script>

<template>
<div v-for="(creativity, index) in creativityData" :key="index" class="author-content-item creativityMain">
	<div class="author-content-item-tips">
		技能
	</div>
	<div class="author-content-item-list">
		<div v-for="item in creativity.creativity_list" :key="item.name" class="cardInfo">
			<div class="creativityIcon" :style="{ background: item.color }">
				<NuxtImg :src="item.icon" />
			</div>
			<div class="creativityTitle">
				{{ item.name }}
			</div>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.creativityMain {
  .author-content-item-tips {
    opacity: 0.8;
    font-size: 12px;
    margin-bottom: 0.5rem;
  }
  .author-content-item-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    .cardInfo {
      align-items: center;
      color: inherit;
      display: flex;
      line-height: 1.3;
      border-radius: 1rem;
      // gap: 0.5rem;
      padding: 0.45rem 1rem;
      text-decoration: none;
      transition: 0.2s;
      border-color: color-mix(in srgb, currentcolor 10%, transparent);
      background-color: color-mix(in srgb, currentcolor 5%, transparent);
      color: color-mix(in srgb, currentcolor 80%, transparent);
      flex-grow: 0; /* 确保卡片不会过度增长 */
      flex-shrink: 0; /* 确保卡片不会被压缩 */
      min-width: fit-content; /* 确保卡片宽度适应内容 */

      .creativityIcon {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        user-select: none;
        flex-shrink: 0; /* 确保图标不会被压缩 */

        img {
          width: 18px;
          height: 18px;
        }
      }
      
      .creativityTitle {
        white-space: nowrap; /* 防止标题换行 */
        overflow: visible; /* 确保文字完全可见 */
        color: var(--c-text-1); /* 确保文字颜色清晰可见 */
      }
    }
  }
}

/* 平板端样式优化 */
@media (max-width: 1024px) {
  .creativityMain {
    .author-content-item-list {
      .cardInfo {
        padding: 0.4rem 1rem;
        min-width: fit-content;
        max-width: none;
        width: auto;
        display: inline-flex;
        overflow: visible;
        
        .creativityIcon {
          width: 28px;
          height: 28px;
          margin-right: 8px;
          flex-shrink: 0;
          
          img {
            width: 16px;
            height: 16px;
          }
        }
        
        .creativityTitle {
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: visible;
          color: var(--c-text-1);
        }
      }
    }
  }
}

/* 特定平板尺寸优化 */
@media (min-width: 768px) and (max-width: 1024px) {
  .creativityMain {
    .author-content-item-list {
      width: 100%;
      justify-content: flex-start;
      .cardInfo {
        padding: 0.4rem 1.2rem;
        width: auto;
        flex: 0 0 auto;
        
        .creativityIcon {
          width: 28px;
          height: 28px;
          margin-right: 10px;
        }
        
        .creativityTitle {
          font-size: 0.95rem;
          color: var(--c-text-1);
        }
      }
    }
  }
}

/* 手机端样式优化 */
@media (max-width: 768px) {
  .creativityMain {
    .author-content-item-list {
      gap: 4px;
      .cardInfo {
        padding: 0.35rem 0.7rem;
        
        .creativityIcon {
          width: 26px;
          height: 26px;
          margin-right: 5px;
          
          img {
            width: 14px;
            height: 14px;
          }
        }
        
        .creativityTitle {
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>
