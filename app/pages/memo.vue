<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { marked } from 'marked'
import { onMounted, ref } from 'vue'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

// 设置侧边栏组件
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'poetry'])

// 自定义用户信息
const customUser = {
	username: 'zsx',
	nickname: '钟神秀',
	avatarUrl: 'https://gravatar.mcyzsx.top/avatar/me',
	slogan: '造化钟神秀，阴阳割昏晓',
}

// API配置
const API_CONFIG = {
	MEMOS_API: 'https://memos.mcyzsx.top/api/v1/memo',
	PAGE_SIZE: 30,
}

// 状态管理
const memos = ref<Array<any>>([])
const loading = ref(true)
const error = ref(false)
const progress = ref(0)
const pageSize = ref(API_CONFIG.PAGE_SIZE)

// 基本的HTML清理函数（白名单方式）
function sanitizeHtml(html: string): string {
	// 允许的HTML标签和属性
	const allowedTags = [
		'p',
		'br',
		'strong',
		'em',
		'u',
		'strike',
		'del',
		'ins',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'ul',
		'ol',
		'li',
		'blockquote',
		'code',
		'pre',
		'a',
		'img',
		'iframe',
		'table',
		'thead',
		'tbody',
		'tr',
		'th',
		'td',
	]

	const allowedAttributes = {
		a: ['href', 'title', 'target'],
		img: ['src', 'alt', 'title', 'width', 'height'],
		iframe: ['src', 'frameborder', 'width', 'height', 'allowfullscreen'],
	}

	// 创建一个临时DOM元素来解析HTML
	const div = document.createElement('div')
	div.innerHTML = html

	// 清理函数
	const cleanNode = (node: Element): void => {
		// 检查标签是否在允许列表中
		if (node.nodeType === Node.ELEMENT_NODE) {
			const tagName = node.tagName.toLowerCase()

			if (!allowedTags.includes(tagName)) {
				// 如果不允许，替换为其文本内容
				const textNode = document.createTextNode(node.textContent || '')
				node.parentNode?.replaceChild(textNode, node)
				return
			}

			// 清理不允许的属性
			const allowedAttrs = allowedAttributes[tagName as keyof typeof allowedAttributes] || []
			for (let i = node.attributes.length - 1; i >= 0; i--) {
				const attr = node.attributes[i]
				if (!allowedAttrs.includes(attr.name)) {
					node.removeAttribute(attr.name)
				}
			}

			// 特殊处理：为target="_blank"的链接添加rel="noopener noreferrer"
			if (tagName === 'a' && node.getAttribute('target') === '_blank') {
				node.setAttribute('rel', 'noopener noreferrer')
			}

			// 递归处理子节点
			const children = Array.from(node.children)
			children.forEach(child => cleanNode(child))
		}
	}

	// 清理所有子节点
	Array.from(div.children).forEach(child => cleanNode(child as Element))

	return div.innerHTML
}

// 渲染Markdown内容
function renderMarkdown(content: string): string {
	try {
		// 配置marked选项，禁用一些危险的HTML
		const html = marked(content, {
			gfm: true,
			breaks: true,
			smartLists: true,
			smartypants: true,
		})

		return html
	}
	catch (error) {
		console.error('Markdown渲染失败:', error)
		return content // 如果渲染失败，返回原始内容
	}
}

// 获取Memos数据
async function fetchMemos() {
	try {
		loading.value = true
		error.value = false
		progress.value = 30

		const response = await fetch(`${API_CONFIG.MEMOS_API}?limit=${API_CONFIG.PAGE_SIZE}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		progress.value = 70
		const data = await response.json()

		// 确保数据是数组
		if (Array.isArray(data)) {
			memos.value = data
		}
		else {
			console.error('Unexpected data format:', data)
			memos.value = []
		}

		progress.value = 100
	}
	catch (err) {
		console.error('获取Memos失败：', err)
		error.value = true
	}
	finally {
		loading.value = false
	}
}

// 页面加载完成后获取数据
onMounted(() => {
	fetchMemos()
})
</script>

<template>
<div class="page-essay">
	<div class="talk-container">
		<Transition name="fade" mode="out-in">
			<!-- 加载中状态 -->
			<div v-if="loading" class="steam-loading-container">
				<div class="steam-loading-header">
					加载数据中...
				</div>
				<div class="steam-progress-bar">
					<div class="steam-progress" :style="{ width: `${progress}%` }" />
				</div>
				<p class="steam-loading-subtext">
					正在获取Memos数据...
				</p>
			</div>

			<div v-else-if="error" class="error-container">
				<Icon name="line-md:alert" class="error-icon" />
				<p>加载失败，请刷新页面重试</p>
			</div>

			<div v-else class="talk-main">
				<!-- 用户资料区域 - 自定义 -->
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
							<span v-if="memos.length > 0" class="bio">
								更新时间：{{ dayjs(memos[0].createdTs * 1000).locale('zh-cn').fromNow().replaceAll(/\s+/g, '') }}
							</span>
						</div>
					</div>
				</div>

				<!-- 统计卡片区域 -->
				<div class="overview">
					<div class="stat-card">
						<Icon name="material-symbols:post-add" class="stat-icon" />
						<div class="stat-info">
							<div class="stat-label">
								总发布
							</div>
							<div class="stat-value">
								{{ memos.length }}
							</div>
						</div>
					</div>
				</div>

				<div class="talks-list">
					<div
						v-for="(memo, index) in memos"
						:key="memo.id"
						class="talk-item"
						:style="{ '--delay': `${index * 0.1}s` }"
					>
						<div class="talk-meta">
							<img
								class="avatar"
								:src="customUser.avatarUrl"
								:alt="customUser.nickname"
							>
							<div class="info">
								<div class="talk-nick">
									{{ customUser.nickname }}
									<Icon name="material-symbols:verified verified" class="verified" />
								</div>
								<div class="talk-date">
									{{ dayjs(memo.createdTs * 1000).locale('zh-cn').fromNow().replaceAll(/\s+/g, '') }}
								</div>
							</div>
						</div>

						<div class="talk-content">
							<!-- 使用基本的HTML过滤渲染Markdown内容 -->
							<div
								class="memo-content"
								v-html="sanitizeHtml(renderMarkdown(memo.content))"
							/>
						</div>

						<div class="talk-bottom">
							<div class="talk-tags">
								<span v-if="memo.tagList && memo.tagList.length > 0" class="tag">
									🏷️{{ memo.tagList.join(', ') }}
								</span>
							</div>
						</div>
					</div>

					<!-- 底部提示 -->
					<div class="talks-footer">
						<p>仅显示最近 {{ pageSize }} 条记录</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</div>
</template>

<style lang="scss" scoped>
.page-essay {
  margin: 1rem;
  animation: float-in 0.2s backwards;

  .talk-container {
    .talk-main {
      display: flex;
      flex-direction: column;
    }

    /* Steam 风格加载页 */
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
        min-width: 0px;
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
            margin: 0px;
          }
        }
      }
    }
  }

  // 统计卡片区域
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

  .talk-item {
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    animation: float-in 0.3s backwards;
    animation-delay: var(--delay);
  }

  .talk-meta {
    display: flex;
    align-items: center;
    gap: 10px;

    .avatar {
      width: 3em;
      border-radius: 2em;
      box-shadow: 2px 4px 1rem var(--ld-shadow);
    }

    .info {
      .talk-nick {
        display: flex;
        align-items: center;
        gap: 5px;

        .verified {
          color: var(--c-primary);
          font-size: 16px;
        }
      }

      .talk-date {
        font-size: 0.8rem;
        color: var(--c-text-3);
        font-family: var(--font-monospace);
      }
    }
  }

  .talk-content {
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    color: var(--c-text-2);

    // 新增：Memo内容样式
    .memo-content {
      :deep(p) {
        margin: 0.5em 0;
      }

      :deep(iframe) {
        max-width: 100%;
        margin: 1em 0;
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        margin: 1em 0;
        border-radius: 8px;
      }

      :deep(pre) {
        background-color: var(--c-bg-2);
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1em 0;
      }

      :deep(code) {
        background-color: var(--c-bg-2);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: var(--font-mono);
      }

      :deep(blockquote) {
        border-left: 4px solid var(--c-primary);
        padding-left: 1em;
        margin: 1em 0;
        color: var(--c-text-2);
      }
    }
  }

  .talk-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--c-text-3);

    .talk-tags {
      display: flex;
      gap: 4px;
      font-size: .7rem;

      .tag {
        background-color: var(--c-bg-2);
        border-radius: 4px;
        display: flex;
        padding: 2px 4px;
        transition: all .2s;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: var(--c-text-2);
    gap: 12px;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--c-bg-3);
      border-top: 3px solid var(--c-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .error-icon {
      font-size: 4rem;
      color: var(--c-danger);
    }
  }

  .talks-footer {
    text-align: center;
    padding: 2rem 0;
    color: var(--c-text-3);
    font-size: 0.9rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
