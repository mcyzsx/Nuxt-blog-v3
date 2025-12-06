<script setup lang="ts">
import { about } from '../../about'
</script>

<!-- 模板层保持你原来的代码 -->
<template>
<div
	v-for="(technologyItem, index) in about"
	:key="index"
	class="author-content-item like-technology"
>
	<div
		v-for="technology in technologyItem.technology"
		:key="technology.tip"
	>
		<div class="card-content">
			<div class="author-content-item-tips">
				{{ technology.tip }}
			</div>
			<span class="author-content-item-title">
				{{ technology.title }}
			</span>
			<div class="content-bottom">
				<div class="tips">
					{{ technology.bottomTip }}
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
/* ==========  关键改动开始  ========== */
.author-content-item.like-technology {
  /* 1. 尺寸与 game 卡片完全一致 */
  width: 59%;          /* 与 .game 保持一致 */
  min-height: 300px;   /* 与 .game 保持一致 */

  /* 2. 背景图重新适配：居中 + 覆盖 + 固定 */
  background: url("https://sourceimage.s3.bitiful.net/img/default_cover_25.avif")
              no-repeat
              center / cover;   /* center 保证主体居中，cover 保证铺满 */
}
/* ==========  关键改动结束  ========== */

/* 以下原有的样式保留，仅去掉和尺寸冲突的那一段 */
.author-content-item {
  .author-content-item-tips {
    opacity: .8;
    font-size: .6rem;
    margin-bottom: .5rem;
  }
  .card-content {
    .author-content-item-title {
      margin-bottom: .5rem;
    }
  }
  .author-content-item-title {
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
  }
  .content-bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    min-height: 40px;
    .tips {
      max-width: calc(100% - 6rem);
      line-height: 1.2;
    }
  }
}
</style>
