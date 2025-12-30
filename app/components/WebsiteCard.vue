<template>
<div class="website-card">
	<a :href="url" target="_blank" rel="noopener noreferrer" class="card-link">
		<div class="card-header">
			<div class="site-icon">
				<Icon name="ph:globe" class="icon" />
			</div>
			<div class="site-info">
				<h3 class="site-title">{{ title }}</h3>
				<div class="site-url">{{ getDomain(url) }}</div>
			</div>
			<Icon name="ph:arrow-square-out-bold" class="arrow-icon" />
		</div>
		<div v-if="description" class="card-description">
			{{ description }}
		</div>
	</a>
</div>
</template>

<script setup lang="ts">
interface Props {
	title: string
	url: string
	description?: string
}

const props = defineProps<Props>()

// 获取域名
function getDomain(url: string) {
	try {
		const urlObj = new URL(url)
		return urlObj.hostname
	} catch (error) {
		return url
	}
}
</script>

<style lang="scss" scoped>
.website-card {
	margin: 1rem 0;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	background-color: var(--c-bg-1);
	border: 1px solid var(--c-bg-soft);
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.card-link {
		display: block;
		text-decoration: none;
		color: inherit;
		padding: 1rem;

		.card-header {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 8px;

			.site-icon {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				background-color: var(--c-primary-soft);
				display: flex;
				align-items: center;
				justify-content: center;

				.icon {
					font-size: 20px;
					color: var(--c-primary);
				}
			}

			.site-info {
				flex: 1;

				.site-title {
					margin: 0;
					font-size: 1.1rem;
					font-weight: 600;
					color: var(--c-text-1);
				}

				.site-url {
					font-size: 0.85rem;
					color: var(--c-text-3);
					margin-top: 2px;
				}
			}

			.arrow-icon {
				font-size: 20px;
				color: var(--c-text-3);
				transition: transform 0.2s ease;
			}
		}

		.card-description {
			color: var(--c-text-2);
			font-size: 0.9rem;
			line-height: 1.4;
		}

		&:hover .arrow-icon {
			transform: translateX(2px);
		}
	}
}
</style>