<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed, onMounted, ref } from 'vue'
import VideoPlayer from '@/components/moment/VideoPlayer.vue'
import PartialPagination from '@/components/bilibili/BilibiliPagination.vue'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'poetry'])

/* 1. 用户资料（B 站默认头像） */
const customUser = {
	username: 'bilibili-hot',
	nickname: 'B站热门',
	avatarUrl: 'https://static.hdslb.com/images/member/noface.gif',
	slogan: '热门视频，精彩不断',
}

/* 2. 数据状态 */
const API_CONFIG = {
	API_URL:
    'https://api.nsmao.net/api/hot/query?key=mU4BGUplQqbybQUSN7RCCnbL4a&title=%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9',
	PAGE_SIZE: 8,
}

const videos = ref<any[]>([])
const loading = ref(true)
const error = ref(false)
const progress = ref(0)
const currentPage = ref(1)
const pageSize = ref(API_CONFIG.PAGE_SIZE)

/* 3. 计算属性 */
const totalPages = computed(() => Math.ceil(videos.value.length / pageSize.value))
const totalHot = computed(() => videos.value.reduce((s, v) => s + (v.hot ?? 0), 0))
const paginatedVideos = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value
	return videos.value.slice(start, start + pageSize.value)
})

/* 4. 工具函数 */
function formatHot(n: number) {
	return n >= 10_000 ? `${(n / 10_000).toFixed(1)}万` : String(n)
}

/* 5. 数据获取 */
async function fetchVideos() {
	try {
		loading.value = true
		error.value = false
		progress.value = 30

		const res = await fetch(API_CONFIG.API_URL, { headers: { Accept: 'application/json' } })
		if (!res.ok)
			throw new Error(`${res.status}`)
		progress.value = 70

		const { data } = await res.json()
		videos.value = Array.isArray(data) ? data : []
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

onMounted(fetchVideos)
</script>

<template>
<div class="page-video">
	<div class="video-container">
		<Transition name="fade" mode="out-in">
			<!-- 加载中 -->
			<div v-if="loading" class="steam-loading-container">
				<div class="steam-loading-header">
					加载视频中...
				</div>
				<div class="steam-progress-bar">
					<div class="steam-progress" :style="{ width: `${progress}%` }" />
				</div>
				<p class="steam-loading-subtext">
					正在获取B站热门视频...
				</p>
			</div>

			<!-- 错误 -->
			<div v-else-if="error" class="error-container">
				<Icon name="line-md:alert" class="error-icon" />
				<p>加载失败，请刷新页面重试</p>
			</div>

			<!-- 主体 -->
			<div v-else class="video-main">
				<!-- 用户资料 -->
				<div class="profile">
					<div class="header">
						<img
							class="avatar"
							src="https://gravatar.mcyzsx.top/avatar/me"
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
							<span v-if="videos.length" class="bio">
								更新时间：{{
									dayjs(videos[0].timestamp)
										.locale('zh-cn')
										.fromNow()
										.replaceAll(/\s+/g, '')
								}}
							</span>
						</div>
					</div>
				</div>

				<!-- 统计卡片 -->
				<div class="overview">
					<div class="stat-card">
						<Icon name="material-symbols:video-library" class="stat-icon" />
						<div class="stat-info">
							<div class="stat-label">
								总视频数
							</div>
							<div class="stat-value">
								{{ videos.length }}
							</div>
						</div>
					</div>
					<div class="stat-card">
						<Icon name="material-symbols:local-fire-department" class="stat-icon" />
						<div class="stat-info">
							<div class="stat-label">
								总热度
							</div>
							<div class="stat-value">
								{{ formatHot(totalHot) }}
							</div>
						</div>
					</div>
				</div>

				<!-- 视频列表 -->
				<div class="video-list">
					<div
						v-for="(video, index) in paginatedVideos"
						:key="video.id"
						class="video-item"
						:style="{ '--delay': `${index * 0.1}s` }"
					>
						<div class="video-meta">
							<img
								class="avatar"
								:src="customUser.avatarUrl"
								:alt="customUser.nickname"
							>
							<div class="info">
								<div class="video-author">
									{{ video.author }}
									<Icon
										name="material-symbols:verified"
										class="verified"
									/>
								</div>
								<div class="video-date">
									{{
										dayjs(video.timestamp)
											.locale('zh-cn')
											.fromNow()
											.replaceAll(/\s+/g, '')
									}}
								</div>
							</div>
						</div>

						<div class="video-content">
							<h3 class="video-title">
								{{ video.title }}
							</h3>
							<p class="video-desc">
								{{ video.desc }}
							</p>

							<!-- 播放器 -->
							<div class="video-player-wrapper">
								<VideoPlayer
									:id="video.id"
									type="bilibili"
									:poster="video.cover"
									:autoplay="false"
								/>
							</div>

							<div class="video-stats">
								<span class="stat-item">
									<Icon name="material-symbols:local-fire-department" />
									{{ formatHot(video.hot) }}
								</span>
								<a
									:href="video.url"
									target="_blank"
									rel="noopener noreferrer"
									class="play-link"
								>
									<Icon name="material-symbols:open-in-new" />
									在新标签页播放
								</a>
							</div>
						</div>
					</div>

					<!-- 分页 -->
					<PartialPagination
						v-model="currentPage"
						:total-pages="totalPages"
						:expand-pages="2"
						sticky
					/>

					<!-- 底部提示 -->
					<div class="video-footer">
						<p>仅显示最近 {{ pageSize }} 条热门视频</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</div>
</template>

<style lang="scss" scoped>
.page-video{margin:1rem;animation:float-in .2s backwards}
.video-container .video-main{display:flex;flex-direction:column}

/* 加载动画 */
.steam-loading-container{display:flex;flex-direction:column;align-items:center;justify-content:center;height:400px;gap:16px;
  .steam-loading-header{font-size:1.2rem;font-weight:bold;color:var(--c-text)}
  .steam-progress-bar{width:80%;height:5px;background:var(--c-text);border-radius:5px;overflow:hidden;
    .steam-progress{height:100%;background:var(--c-primary);transition:width .3s ease}}
  .steam-loading-subtext{font-size:.9rem;color:#666}}

/* 用户资料 */
.profile{background:var(--ld-bg-card);border-radius:8px;padding:1rem;box-shadow:0 0 0 1px var(--c-bg-soft);margin-bottom:1rem;animation:float-in .3s backwards;
  .header{display:flex;gap:1em;
    .avatar{width:100px;height:100px;border-radius:50%;border:2px solid var(--c-primary);object-fit:cover;flex-shrink:0}
    .info{flex:1;min-width:0;
      .row{display:flex;align-items:center;flex-wrap:wrap;gap:.75em;margin-bottom:.5em;
        .username{font-size:1.25em;font-weight:600;margin:0}}}}
      }

/* 统计卡片 */
.overview{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;
  .stat-card{background:var(--ld-bg-card);border-radius:8px;padding:1rem;box-shadow:0 0 0 1px var(--c-bg-soft);display:flex;align-items:center;gap:.5rem;animation:float-in .3s backwards;
    .stat-icon{font-size:1.8rem;color:var(--c-primary)}
    .stat-label{font-size:.9rem;color:var(--c-text-2)}
    .stat-value{font-size:1.4rem;font-weight:bold;color:var(--c-text)}}}

/* 视频列表 */
.video-list{
  .video-item{background:var(--ld-bg-card);border-radius:8px;padding:1rem;box-shadow:0 0 0 1px var(--c-bg-soft);margin-bottom:1rem;display:flex;flex-direction:column;gap:.5rem;animation:float-in .3s backwards;animation-delay:var(--delay);
    .video-meta{display:flex;align-items:center;gap:10px;
      .avatar{width:3em;border-radius:2em;box-shadow:2px 4px 1rem var(--ld-shadow)}
      .video-author{display:flex;align-items:center;gap:5px;.verified{color:var(--c-primary);font-size:16px}}
      .video-date{font-size:.8rem;color:var(--c-text-3);font-family:var(--font-monospace)}}
    .video-content{line-height:1.6;display:flex;flex-direction:column;gap:.5rem;color:var(--c-text-2);
      .video-title{font-size:1.1rem;font-weight:bold;color:var(--c-text);margin:0}
      .video-desc{font-size:.9rem;color:var(--c-text-2);margin:0}
      .video-player-wrapper{margin:1rem 0}
      .video-stats{display:flex;justify-content:space-between;align-items:center;font-size:.9rem;
        .stat-item{display:flex;align-items:center;gap:4px;color:var(--c-text-3)}
        .play-link{display:flex;align-items:center;gap:4px;color:var(--c-primary);text-decoration:none;transition:opacity .2s;&:hover{opacity:.8}}}}}
      }

/* 底部提示 */
.video-footer{text-align:center;padding:2rem 0;color:var(--c-text-3);font-size:.9rem}

@keyframes float-in{0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}
</style>
