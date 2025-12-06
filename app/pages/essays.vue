<script setup lang="ts">
/* ================== 类型 ================== */
import GithubRepo from '~/components/moment/GithubRepo.vue'
import MusicPlayer from '~/components/moment/MusicPlayer.vue'
import WebsiteCard from '~/components/moment/WebsiteCard.vue'

interface MomentItem {
	id: number | string
	content: string
	author: { name: string, avatar: string, badges?: string[] }
	images?: string[]
	location?: string | null
	createdAt: string
	layout?: string
	private?: boolean
	extension?: string | null
	extensionType?: string | null
	tags?: string[]
	favCount?: number
}

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log', 'latest-comments', 'comm-group', 'poetry']) // 你的文章类型声明路径

/* ================== 配置 ================== */
const defaultAuthor = {
	name: '钟神秀',
	avatar: 'https://gravatar.mcyzsx.top/avatar/me',
	badges: ['站长'],
}
const API_URL = 'https://echo.051531.xyz/api/echo/page'

/* ================== 分页 & 数据 ================== */
const currentPage = ref(1)
const pageSize = 5
const totalItems = ref(0)
const moments = ref<MomentItem[]>([])
const loading = ref(true)
const error = ref(false)
const progress = ref(0)

/* ================== 数据获取 ================== */
function formatApiData(raw: any): MomentItem[] {
	return raw.data.items.map((it: any) => ({
		id: it.id,
		content: it.content,
		author: defaultAuthor,
		images: it.images?.map((i: any) => i.image_url) || [],
		location: null,
		createdAt: it.created_at,
		layout: it.layout || 'grid',
		private: it.private || false,
		extension: it.extension || null,
		extensionType: it.extension_type || null,
		tags: it.tags?.map((t: any) => t.name) || [],
		favCount: it.fav_count || 0,
	}))
}

async function fetchMoments() {
	loading.value = true
	error.value = false
	progress.value = 30
	try {
		const res: any = await $fetch(API_URL, { params: { page: currentPage.value - 1, size: pageSize } })
		progress.value = 70
		if (res.code === 1 && res.data) {
			moments.value = formatApiData(res)
			totalItems.value = res.data.total
		}
		else {
			moments.value = []
			totalItems.value = 0
		}
	}
	catch (e) {
		console.error('获取 Moments 失败:', e)
		error.value = true
	}
	finally {
		progress.value = 100
		loading.value = false
	}
}

onMounted(fetchMoments)
watch(currentPage, fetchMoments)

/* ================== 排序 & 分页 ================== */
const sortedMoments = computed(() =>
	[...moments.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)
const paginatedMoments = computed(() => sortedMoments.value)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

/* ================== 时间格式化 ================== */
function formatTime(ts: string) {
	return new Date(ts)
		.toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' })
		.replace(/\//g, '-')
		.replace(',', '')
}

/* ================== 图片预览 ================== */
const showPreview = ref(false)
const currentPhoto = ref('')
const currentPhotoIndex = ref(0)
const currentMomentImages = ref<string[]>([])

function openPhotoPreview(img: string, list: string[], idx: number) {
	currentPhoto.value = img
	currentPhotoIndex.value = idx
	currentMomentImages.value = list
	showPreview.value = true
}
function closePhotoPreview() {
	showPreview.value = false
}
function nextPhoto() {
	if (currentMomentImages.value.length <= 1)
		return
	currentPhotoIndex.value = (currentPhotoIndex.value + 1) % currentMomentImages.value.length
	currentPhoto.value = currentMomentImages.value[currentPhotoIndex.value] ?? ''
}
function prevPhoto() {
	if (currentMomentImages.value.length <= 1)
		return
	currentPhotoIndex.value = (currentPhotoIndex.value - 1 + currentMomentImages.value.length) % currentMomentImages.value.length
	currentPhoto.value = currentMomentImages.value[currentPhotoIndex.value] ?? ''
}

/* ================== 音乐解析 ================== */
// 返回 MusicPlayer 需要的「非空」数组
function parseMusic(url: string) {
	const match = url.match(/song\?id=(\d+)/)
	if (!match)
		return [] // 无 id 直接给空数组，MusicPlayer 会跳过渲染

	const id = match[1]
	return [
		{
			id, // 此时一定是 string
			server: 'netease' as const,
			type: 'song' as const,
			autoplay: false,
			mode: 'mini' as const,
			theme: '#1e90ff',
		},
	]
}

/* ================== 键盘事件 ================== */
function onKeydown(e: KeyboardEvent) {
	if (!showPreview.value)
		return
	if (e.key === 'Escape')
		closePhotoPreview()
	else if (e.key === 'ArrowRight')
		nextPhoto()
	else if (e.key === 'ArrowLeft')
		prevPhoto()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
<div class="moments-page">
	<div class="container">
		<!-- 加载动画 -->
		<Transition name="fade" mode="out-in">
			<div v-if="loading" class="steam-loading-container">
				<div class="steam-loading-header">
					加载数据中...
				</div>
				<div class="steam-progress-bar">
					<div class="steam-progress" :style="{ width: `${progress}%` }" />
				</div>
				<p class="steam-loading-subtext">
					正在获取 Ech0 数据...
				</p>
			</div>

			<div v-else-if="error" class="error-container">
				<Icon name="line-md:alert" class="error-icon" />
				<p>加载失败，请刷新页面重试</p>
			</div>

			<!-- 正文 -->
			<div v-else class="moments-grid">
				<article
					v-for="moment in paginatedMoments"
					:key="moment.id"
					class="moment-card"
				>
					<!-- 头部 -->
					<div class="moment-header">
						<NuxtImg
							:src="moment.author.avatar"
							:alt="moment.author.name"
							width="44"
							height="44"
							class="author-avatar"
						/>
						<div class="author-info">
							<div class="author-main">
								<h3 class="author-name">
									{{ moment.author.name }}
								</h3>
								<div v-if="moment.author.badges?.length" class="badges-container">
									<span v-for="badge in moment.author.badges" :key="badge" class="badge">
										{{ badge }}
									</span>
								</div>
							</div>
							<div class="meta-info">
								<time class="moment-time">{{ formatTime(moment.createdAt) }}</time>
							</div>
						</div>
					</div>

					<!-- 内容 -->
					<div class="moment-content">
						<p class="moment-text">
							{{ moment.content }}
						</p>

						<!-- 图片 -->
						<div
							v-if="moment.images && moment.images.length"
							class="moment-images"
							:class="{ single_image: moment.images.length === 1, grid_images: moment.images.length > 1 }"
						>
							<NuxtImg
								v-for="(img, idx) in moment.images"
								:key="idx"
								:src="img"
								class="moment-image"
								:class="{ grid_item: moment.images.length > 1 }"
								loading="lazy"
								@click="openPhotoPreview(img, moment.images, idx)"
							/>
						</div>

						<!-- 扩展卡片 -->
						<div v-if="moment.extension" class="moment-extension">
							<!-- 1. 视频 -->
							<VideoEmbed
								v-if="moment.extensionType === 'VIDEO'"
								:id="moment.extension"
								type="bilibili"
								:ratio="16 / 9"
							/>
							<!-- 2. 音乐 -->
							<MusicPlayer
								v-else-if="moment.extensionType === 'MUSIC'"
								:list="parseMusic(moment.extension)"
							/>
							<!-- 3. GitHub 项目 -->
							<GithubRepo
								v-else-if="moment.extensionType === 'GITHUBPROJ'"
								:repo="moment.extension"
								show-stars
							/>

							<!-- 4. 网站卡片 -->
							<WebsiteCard
								v-else-if="moment.extensionType === 'WEBSITE'"
								:json-str="moment.extension"
							/>
						</div>
					</div>
				</article>

				<!-- 分页 -->
				<div v-if="totalPages > 1" class="pagination">
					<button :disabled="currentPage === 1" class="pagination-btn" @click="currentPage--">
						上一页
					</button>
					<span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
					<button :disabled="currentPage === totalPages" class="pagination-btn" @click="currentPage++">
						下一页
					</button>
				</div>
			</div>
		</Transition>
	</div>

	<!-- 图片预览 -->
	<div v-if="showPreview" class="photo-preview-modal" @click="closePhotoPreview">
		<div class="preview-content" @click.stop>
			<button class="close-btn" @click="closePhotoPreview">
				<Icon name="ph:x-bold" />
			</button>
			<div class="preview-image-container">
				<button v-if="currentMomentImages.length > 1" class="nav-btn prev-btn" @click="prevPhoto">
					<Icon name="ph:caret-left-bold" size="32" />
				</button>
				<NuxtImg :src="currentPhoto" class="preview-image" loading="lazy" />
				<button v-if="currentMomentImages.length > 1" class="nav-btn next-btn" @click="nextPhoto">
					<Icon name="ph:caret-right-bold" size="32" />
				</button>
			</div>
			<div v-if="currentMomentImages.length > 1" class="photo-counter">
				{{ currentPhotoIndex + 1 }} / {{ currentMomentImages.length }}
			</div>
		</div>
	</div>
</div>
</template>

<style scoped>
/* ========== 加载动画 ========== */
.steam-loading-container{
  display:flex;flex-direction:column;align-items:center;justify-content:center;height:400px;color:var(--c-text);gap:16px;
}
.steam-loading-header{font-size:1.2rem;font-weight:bold;}
.steam-progress-bar{width:80%;height:5px;background:var(--c-bg-soft);border-radius:5px;overflow:hidden;}
.steam-progress{height:100%;background:var(--c-primary);transition:width .3s ease;}
.steam-loading-subtext{font-size:.9rem;color:var(--c-text-2);}
.error-container{display:flex;flex-direction:column;align-items:center;justify-content:center;height:400px;gap:12px;}
.error-icon{font-size:4rem;color:var(--c-danger);}

/* ========== 原有样式保持不变 ========== */
.moments-page{min-height:100vh;padding:2rem 0}.container{max-width:700px;margin:0 auto;padding:0 1rem}.moments-grid{display:flex;flex-direction:column;gap:1.5rem}.moment-card{background:var(--ld-bg-card);backdrop-filter:blur(20px);border-radius:12px;padding:1rem;box-shadow:0 4px 20px var(--ld-shadow),0 1px 3px var(--ld-shadow);border:1px solid var(--c-border);transition:all .3s cubic-bezier(.4,0,.2,1)}.moment-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px var(--ld-shadow),0 2px 6px var(--ld-shadow)}.moment-header{display:flex;align-items:flex-start;gap:.875rem;margin-bottom:1rem}.author-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.8);box-shadow:0 2px 8px rgba(0,0,0,.1)}.author-info{flex:1;min-width:0}.author-main{display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem}.author-name{font-size:1.1rem;font-weight:600;color:var(--c-text-1);margin:0}.badges-container{display:flex;align-items:center;gap:.375rem}.badge{font-size:.6875rem;padding:.125rem .375rem;background:transparent;color:#d4af37;border:1px solid #d4af37;border-radius:4px;font-weight:500;letter-spacing:.25px}.meta-info{display:flex;align-items:center;gap:.25rem}.moment-time{font-size:.875rem;color:var(--c-text-3)}.moment-content{margin-top:.5rem}.moment-text{font-size:1rem;line-height:1.5;color:var(--c-text-1);margin:0 0 .5rem 0;word-wrap:break-word}.moment-images{margin-top:.75rem}.single_image .moment-image{width:100%;max-width:600px;height:400px;border-radius:12px;object-fit:cover;cursor:pointer;transition:filter .3s ease}.grid_images{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem}.grid_item{width:100%;height:300px;border-radius:10px;object-fit:cover;cursor:pointer;transition:filter .3s ease}:global(.dark) .moment-image{filter:brightness(.9) contrast(1.05)}.moment-extension{margin-top:.75rem}.music-card,.link-card{display:flex;align-items:center;gap:.5rem;font-size:.9rem;color:var(--c-text-2)}.music-card a,.link-card a{color:var(--c-primary)}.pagination{display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:2rem;padding:1rem}.pagination-btn{padding:.5rem 1rem;border:1px solid var(--c-primary);background:transparent;color:var(--c-primary);border-radius:8px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .2s ease}.pagination-btn:hover:not(:disabled){background:var(--c-primary);color:#fff}.pagination-btn:disabled{opacity:.5;cursor:not-allowed}.page-info{color:var(--c-text-3);font-size:.875rem}

/* 图片预览样式保持原文件 */
.photo-preview-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(10px)}.preview-content{position:relative;max-width:90vw;max-height:90vh;background:var(--ld-bg-card);border-radius:1rem;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}.close-btn{position:absolute;top:-50px;right:0;background:rgba(255,255,255,.12);border:none;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:var(--c-primary);cursor:pointer;backdrop-filter:blur(20px);transition:all .2s ease;z-index:10}.close-btn:hover{background:rgba(255,255,255,.2);transform:scale(1.1)}.preview-image-container{background:#fff;display:flex;align-items:center;justify-content:center;border-radius:8px;padding:20px;width:1000px;height:700px;max-width:90vw;max-height:70vh}.preview-image{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}.nav-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;color:var(--c-primary);cursor:pointer;backdrop-filter:blur(20px);transition:all .2s ease;opacity:.8;z-index:10;box-shadow:0 0 0 2px var(--c-primary),0 4px 12px rgba(0,0,0,.3)}.nav-btn:hover{background:rgba(255,255,255,.2);opacity:1;transform:translateY(-50%) scale(1.1);box-shadow:0 0 0 3px var(--c-primary),0 6px 16px rgba(0,0,0,.4)}.prev-btn{left:20px}.next-btn{right:20px}.photo-counter{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.9);padding:.75rem 2rem;border-radius:2rem;color:var(--c-primary);font-size:1.2rem;font-weight:700;z-index:10;box-shadow:0 0 0 2px var(--c-primary),0 4px 12px rgba(0,0,0,.3);border:2px solid var(--c-primary)}@media (max-width:768px){.close-btn{top:.5rem!important;right:.5rem!important;width:2.5rem!important;height:2.5rem!important}.nav-btn{width:50px!important;height:50px!important}.prev-btn{left:10px!important}.next-btn{right:10px!important}.photo-counter{font-size:1rem!important;padding:.5rem 1rem!important}.preview-image-container{width:90vw!important;height:70vh!important;padding:15px!important}}
</style>
