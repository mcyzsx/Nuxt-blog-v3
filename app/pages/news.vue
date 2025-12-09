<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { marked } from 'marked'
import { onMounted, ref } from 'vue'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'poetry'])

/* 自定义播音员 */
const customUser = {
	nickname: '60S 看世界',
	avatarUrl: 'https://gravatar.mcyzsx.top/avatar/me',
	slogan: '每天 60 秒，读懂世界',
}

/* 状态 */
const newsList = ref<string[]>([])
const newsDate = ref<string>('')
const loading = ref(true)
const error = ref(false)
const progress = ref(0)

/* 获取新闻 */
async function fetchNews() {
	try {
		loading.value = true
		error.value = false
		progress.value = 30

		const res = await fetch('https://60s.kemeow.top/v2/60s?encoding=markdown')
		if (!res.ok)
			throw new Error('网络错误')

		progress.value = 70
		const text = await res.text()

		/* 提取日期 */
		const dateMatch = text.match(/^> (.+?)（/m)
		if (dateMatch)
			newsDate.value = dateMatch[1]

		/* 提取序号新闻 */
		const lines = text.split('\n').filter(line => /^\d+\./.test(line))
		newsList.value = lines.map(line => line.replace(/^\d+\.\s*/, ''))

		progress.value = 100
	}
	catch (e) {
		console.error(e)
		error.value = true
	}
	finally {
		loading.value = false
	}
}

/* 渲染 & 净化 */
function renderMarkdown(content: string) {
	return marked(content, { gfm: true, breaks: true })
}

function sanitizeHtml(html: string) {
	const allowed = ['p', 'br', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li']
	const div = document.createElement('div')
	div.innerHTML = html
	const clean = (el: Element) => {
		if (!allowed.includes(el.tagName.toLowerCase())) {
			const text = document.createTextNode(el.textContent || '')
			el.parentNode?.replaceChild(text, el)
		}
		else {
			Array.from(el.children).forEach(clean)
		}
	}
	Array.from(div.children).forEach(clean)
	return div.innerHTML
}

onMounted(() => fetchNews())
</script>

<template>
<div class="page-news">
	<div class="talk-container">
		<Transition name="fade" mode="out-in">
			<!-- 加载中 -->
			<div v-if="loading" class="steam-loading-container">
				<div class="steam-loading-header">
					加载新闻中...
				</div>
				<div class="steam-progress-bar">
					<div class="steam-progress" :style="{ width: `${progress}%` }" />
				</div>
				<p class="steam-loading-subtext">
					正在获取今日新闻...
				</p>
			</div>

			<!-- 错误 -->
			<div v-else-if="error" class="error-container">
				<Icon name="line-md:alert" class="error-icon" />
				<p>新闻加载失败，请刷新页面重试</p>
			</div>

			<!-- 正文 -->
			<div v-else class="talk-main">
				<!-- 用户资料 -->
				<div class="profile">
					<div class="header">
						<img
							class="avatar"
							:src="customUser.avatarUrl"
							:alt="customUser.nickname"
						>
						<div class="info">
							<div class="row">
								<h2 class="username">
									{{ customUser.nickname }}
									<Icon name="material-symbols:verified" class="verified" />
								</h2>
							</div>
							<div class="row">
								<span class="bio">{{ customUser.slogan }}</span>
							</div>
							<span v-if="newsDate" class="bio">
								新闻日期：{{ newsDate }}
							</span>
						</div>
					</div>
				</div>

				<!-- 统计卡片 -->
				<div class="overview">
					<div class="stat-card">
						<Icon name="material-symbols:article" class="stat-icon" />
						<div class="stat-info">
							<div class="stat-label">
								今日新闻
							</div>
							<div class="stat-value">
								{{ newsList.length }}
							</div>
						</div>
					</div>
				</div>

				<!-- 新闻列表 -->
				<div class="talks-list">
					<div
						v-for="(item, index) in newsList"
						:key="index"
						class="talk-item"
						:style="{ '--delay': `${index * 0.1}s` }"
					>
						<div class="talk-content">
							<div
								class="memo-content"
								v-html="sanitizeHtml(renderMarkdown(item))"
							/>
						</div>
					</div>

					<!-- 底部提示 -->
					<div class="talks-footer">
						<p>仅显示今日新闻</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</div>
</template>

<style lang="scss" scoped>
/* 完全复用 memo.vue 的样式，仅替换选择器前缀 */
.page-news {
  margin: 1rem;
  animation: float-in 0.2s backwards;

  .talk-container {
    .talk-main {
      display: flex;
      flex-direction: column;
    }

    /* Steam 加载 */
    .steam-loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      color: #333;
      gap: 16px;

      .steam-loading-header {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--c-text);
      }

      .steam-progress-bar {
        width: 80%;
        height: 5px;
        background-color: var(--c-text);
        border-radius: 5px;
        overflow: hidden;

        .steam-progress {
          height: 100%;
          background-color: var(--c-primary);
          transition: width 0.3s ease;
        }
      }

      .steam-loading-subtext {
        font-size: 0.9rem;
        color: #666;
      }
    }
  }

  /* 用户资料 */
  .profile {
    background: var(--ld-bg-card);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    margin-bottom: 1rem;
    display: flex;
    gap: 0.5rem;
    animation: float-in 0.3s backwards;
    transition: border-color 0.3s;

    .header {
      align-items: flex-start;
      display: flex;
      gap: 1em;

      .avatar {
        flex-shrink: 0;
        height: 100px;
        object-fit: cover;
        width: 100px;
        border: 2px solid var(--c-primary);
        border-radius: 50%;
      }

      .info {
        min-width: 0;
        flex: 1 1 0%;

        .row {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 0.5em;
          gap: 0.75em;

          .username {
            color: var(--c-text);
            font-size: 1.25em;
            font-weight: 600;
            word-break: break-word;
            margin: 0;
          }
        }
      }
    }
  }

  /* 统计卡片 */
  .overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;

    .stat-card {
      background: var(--ld-bg-card);
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 0 0 1px var(--c-bg-soft);
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
      animation: float-in 0.3s backwards;
      transition: border-color 0.3s;
      align-items: center;

      .stat-icon {
        font-size: 1.8rem;
        color: var(--c-primary);
      }

      .stat-info {
        .stat-label {
          font-size: 0.9rem;
          color: var(--c-text-2);
        }

        .stat-value {
          font-size: 1.4rem;
          font-weight: bold;
          color: var(--c-text);
        }
      }
    }
  }

  /* 新闻条目 */
  .talk-item {
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    animation: float-in 0.3s backwards;
    animation-delay: var(--delay);
  }

  .talk-content {
    line-height: 1.6;
    color: var(--c-text-2);

    .memo-content {
      :deep(p) {
        margin: 0.5em 0;
      }
    }
  }

  .talks-footer {
    text-align: center;
    padding: 2rem 0;
    color: var(--c-text-3);
    font-size: 0.9rem;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: var(--c-text-2);
    gap: 12px;

    .error-icon {
      font-size: 4rem;
      color: var(--c-danger);
    }
  }
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
