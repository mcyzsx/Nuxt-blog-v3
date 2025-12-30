<script setup lang="ts">
import type { TalkItem } from '../types/talk'
import { toDate } from 'date-fns-tz'
import { onMounted, ref } from 'vue'
import { fetchTalks } from '../talks'
import WebsiteCard from '../components/WebsiteCard.vue'
import MusicPlayer from '../components/moment/MusicPlayer.vue'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'blog-log', 'comm-group'])

const title = '说说'
const description = '记录生活点滴，一些想法。'
const image = 'https://bing.kemeow.top/picture/2025-12-30.webp'
useSeoMeta({ title, description, ogImage: image })

const { author } = useAppConfig()

const recentTalks = ref<TalkItem[]>([])
const isLoading = ref(true)
const loadError = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)

async function loadTalks(showLoading = true) {
	if (showLoading) {
		isLoading.value = true
		loadError.value = false
	}

	try {
		const talks = await fetchTalks()
		const sortedTalks = [...talks]
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 30)

		recentTalks.value = sortedTalks
		hasMore.value = sortedTalks.length >= 30
	}
	catch (error) {
		console.error('获取说说数据失败:', error)
		loadError.value = true
	}
	finally {
		if (showLoading) {
			isLoading.value = false
		}
	}
}

onMounted(async () => {
	loadTalks()
})

function replyTalk(content?: string): void {
	const input = document.querySelector('#twikoo .tk-input textarea')
	if (!(input instanceof HTMLTextAreaElement))
		return

	if (content?.trim()) {
		const quotes = content.split('\n').map(str => `> ${str}`)
		input.value = `${quotes}\n\n`
	}
	else {
		input.value = ''
	}
	input.dispatchEvent(new InputEvent('input'))

	const length = input.value.length
	input.setSelectionRange(length, length)
	input.focus()
}

function getEssayDate(date?: string | Date) {
	if (!date) {
		return ''
	}

	const appConfig = useAppConfig()
	return toDate(date, { timeZone: appConfig.timezone })
		.toLocaleString(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		})
		.replace(/\//g, '-')
}

// 渲染 Markdown 文本
function renderMarkdown(text?: string) {
	if (!text) return ''
	
	try {
		// 简单的 Markdown 渲染器
		let html = text
		
		// 首先转义 HTML 字符，防止 XSS
		html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
		
		// 渲染粗体 **text** -> <strong>text</strong>
		html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		
		// 渲染斜体 *text* -> <em>text</em>
		html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
		
		// 渲染代码块 `code` -> <code>code</code>
		html = html.replace(/`(.+?)`/g, '<code>$1</code>')
		
		// 渲染链接 [text](url) -> <a href="url">text</a>
		html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
		
		// 渲染图片 ![alt](url) -> <img src="url" alt="alt">
		html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px;" />')
		
		// 处理列表和块级引用
		const lines = html.split('\n')
		let inBlockquote = false
		let blockquoteContent = []
		let inUnorderedList = false
		let unorderedListItems = []
		const processedLines = []
		
		for (const line of lines) {
			// 处理块级引用 > text -> <blockquote>text</blockquote>
			if (line.startsWith('> ')) {
				if (!inBlockquote) {
					inBlockquote = true
					blockquoteContent = []
				}
				blockquoteContent.push(line.substring(2))
			} else {
				if (inBlockquote) {
					processedLines.push(`<blockquote style="border-left: 3px solid var(--c-primary-soft); padding-left: 1rem; margin: 1rem 0; color: var(--c-text-3);">${blockquoteContent.join('<br>')}</blockquote>`)
					blockquoteContent = []
					inBlockquote = false
				}
				
				// 处理无序列表 - 开头的行
				if (line.match(/^[\s]*-[\s]+/)) {
					if (!inUnorderedList) {
						inUnorderedList = true
						unorderedListItems = []
					}
					// 提取列表项内容（去掉开头的 - 和空格）
					const listItemContent = line.replace(/^[\s]*-[\s]+/, '')
					// 使用更明显的列表样式，包括项目符号和更强的颜色
					unorderedListItems.push(`<li style="color: var(--c-text-1); margin: 0.3rem 0; list-style-type: disc;">${listItemContent}</li>`)
				} else {
					if (inUnorderedList) {
						// 使用更明显的列表容器样式
						processedLines.push(`<ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: var(--c-text-1); background-color: var(--c-bg-soft); border-radius: 4px; padding: 0.5rem 0.5rem 0.5rem 1.5rem;">${unorderedListItems.join('')}</ul>`)
						unorderedListItems = []
						inUnorderedList = false
					}
					processedLines.push(line)
				}
			}
		}
		
		// 处理可能遗留在文档末尾的块级引用和列表
		if (inBlockquote) {
			processedLines.push(`<blockquote style="border-left: 3px solid var(--c-primary-soft); padding-left: 1rem; margin: 1rem 0; color: var(--c-text-3);">${blockquoteContent.join('<br>')}</blockquote>`)
		}
		
		if (inUnorderedList) {
			// 使用更明显的列表容器样式
			processedLines.push(`<ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: var(--c-text-1); background-color: var(--c-bg-soft); border-radius: 4px; padding: 0.5rem 0.5rem 0.5rem 1.5rem;">${unorderedListItems.join('')}</ul>`)
		}
		
		html = processedLines.join('\n')
		
		// 处理换行
		html = html.replace(/\n/g, '<br>')
		
		return html
	} catch (error) {
		console.error('Markdown 渲染错误:', error)
		// 如果渲染失败，返回原始文本（转义 HTML 防止 XSS）
		return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
	}
}
</script>

<template>
<ZPageBanner :title :description :image />

<div class="talk-list">
	<!-- 加载状态 -->
	<template v-if="isLoading">
		<div class="loading-state">
			<div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton">
				<div class="skeleton-meta">
					<div class="skeleton-avatar" />
					<div class="skeleton-info">
						<div class="skeleton-nick" />
						<div class="skeleton-date" />
					</div>
				</div>
				<div class="skeleton-content">
					<div class="skeleton-text" />
					<div class="skeleton-text" />
					<div class="skeleton-text" />
				</div>
				<div class="skeleton-bottom">
					<div class="skeleton-tags" />
				</div>
			</div>
		</div>
	</template>

	<!-- 错误状态 -->
	<template v-else-if="loadError">
		<div class="error-state">
			<div class="error-content">
				<Icon name="ph:alert-circle-bold" class="error-icon" />
				<h3>加载失败</h3>
				<p>获取说说数据时出现错误，请稍后重试</p>
				<button class="retry-btn" @click="() => loadTalks()">
					<Icon name="ph:refresh-bold" />
					重试
				</button>
			</div>
		</div>
	</template>

	<!-- 内容状态 -->
	<template v-else>
		<!-- 空状态 -->
		<div v-if="recentTalks.length === 0" class="empty-state">
			<Icon name="ph:chat-circle-bold" class="empty-icon" />
			<p>暂无说说内容</p>
		</div>

		<!-- 内容列表 -->
		<transition-group v-else name="talk-fade" tag="div">
			<div v-for="talk in recentTalks" :key="talk.id || talk.date" class="talk-item">
				<div class="talk-meta">
					<NuxtImg class="avatar" :src="author.avatar" :alt="author.name" />
					<div class="info">
						<div class="nick">
							{{ author.name }}
							<Icon class="verified" name="i-material-symbols:verified" />
						</div>
						<div class="date">
							{{ getEssayDate(talk.date) }}
						</div>
					</div>
				</div>

				<div class="talk-content">
					<div v-if="talk.text" class="text" v-html="renderMarkdown(talk.text)" />
					<WebsiteCard v-if="talk.website" :title="talk.website.title" :url="talk.website.url" :description="talk.website.description" />
					<MusicPlayer v-if="talk.music" :list="[talk.music]" />
					<div v-if="talk.images" class="images">
						<Pic v-for="(image, index) in talk.images" :key="index" class="image" :src="image" />
					</div>
					<VideoEmbed v-if="talk.video" class="video" v-bind="talk.video" height="" />
				</div>

				<div class="talk-bottom">
					<div class="tags">
						<span v-for="tag in talk.tags" :key="tag" class="tag">
							<Icon name="ph:tag-bold" />
							<span>{{ tag }}</span>
						</span>
						<a
							v-if="talk.location"
							v-tip="`搜索: ${talk.location}`"
							class="location"
							:href="`https://bing.com/maps?q=${encodeURIComponent(talk.location)}`"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon name="ph:map-pin-bold" />
							<span>{{ talk.location }}</span>
						</a>
					</div>
					<button v-tip="'评论'" class="comment-btn" @click="replyTalk(talk.text)">
						<Icon name="ph:chats-bold" />
					</button>
				</div>
			</div>
		</transition-group>

		<div class="talk-footer">
			<p>仅显示最近 30 条记录</p>
		</div>
	</template>
</div>

<PostComment />
</template>

<style lang="scss" scoped>
.talk-list {
  animation: float-in .2s backwards;
  margin: 1rem;

  .talk-item {
    animation: float-in .3s backwards;
    animation-delay: var(--delay);
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease, transform 0.3s ease;

    .talk-meta {
      align-items: center;
      display: flex;
      gap: 10px;

      .avatar {
        border-radius: 2em;
        box-shadow: 2px 4px 1rem var(--ld-shadow);
        width: 3em;
      }

      .nick {
        align-items: center;
        display: flex;
        gap: 5px;
      }

      .date {
        color: var(--c-text-3);
        font-family: var(--font-monospace);
        font-size: .8rem;
      }

      .verified {
        color: var(--c-primary);
        font-size: 16px;
      }
    }

    .talk-content {
      color: var(--c-text-2);
      display: flex;
      flex-direction: column;
      gap: .5rem;
      line-height: 1.6;

      :deep(a[href]) {
        margin: -.1em -.2em;
        padding: .1em .2em;
        background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% .1em;
        color: var(--c-primary);
        transition: all .2s;

        &:hover {
          border-radius: .3em;
          background-size: 100% 100%;
        }
      }

      .images {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(3, 1fr);
      }

      .image {
        border-radius: 8px;
        overflow: hidden;
        padding-bottom: 100%;
        position: relative;

        :deep(img) {
          height: 100%;
          object-fit: cover;
          position: absolute;
          transition: transform .3s;
          width: 100%;

          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .video {
        border-radius: 8px;
        margin: 0;
      }
    }

    .talk-bottom {
      align-items: center;
      color: var(--c-text-3);
      display: flex;
      justify-content: space-between;

      .tags {
        display: flex;
        font-size: .7rem;
        gap: 4px;
      }

      .tag, .location {
        display: flex;
        padding: 2px 4px;
        border-radius: 4px;
        background-color: var(--c-bg-2);
        align-items: center;
        cursor: pointer;
        transition: all .2s;

        &:hover {
          opacity: .8;
        }
      }

      .tag .i-ph\:tag-bold + * {
        margin-left: .15em;
      }

      .location {
        color: var(--c-primary);
      }
    }
  }

  .talk-footer {
    color: var(--c-text-3);
    font-size: 1rem;
    margin: 2rem 0;
    text-align: center;
  }

  /* 过渡动画 */
  .talk-fade-enter-active,
  .talk-fade-leave-active {
    transition: all 0.3s ease;
  }

  .talk-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .talk-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  /* 加载状态 */
  .loading-state {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
  }

  .skeleton {
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .skeleton-meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .skeleton-avatar {
    width: 3em;
    height: 3em;
    border-radius: 50%;
    background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .skeleton-nick {
    width: 120px;
    height: 18px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .skeleton-date {
    width: 100px;
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .skeleton-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skeleton-text {
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .skeleton-text:nth-child(2) {
    width: 80%;
  }

  .skeleton-text:nth-child(3) {
    width: 60%;
  }

  .skeleton-bottom {
    height: 24px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  /* 错误状态 */
  .error-state {
    text-align: center;
    padding: 3rem 1rem;
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    margin: 1rem 0;
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .error-icon {
    font-size: 3rem;
    color: var(--c-primary);
  }

  .error-state h3 {
    font-size: 1.2rem;
    margin: 0;
    color: var(--c-text-1);
  }

  .error-state p {
    color: var(--c-text-3);
    margin: 0;
  }

  .retry-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background-color: var(--c-primary);
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: var(--c-primary-hover);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  /* 空状态 */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    margin: 1rem 0;
    color: var(--c-text-3);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  /* 加载动画 */
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* 淡入动画 */
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
}
</style>