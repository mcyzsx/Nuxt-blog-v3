<script setup>
const props = defineProps({
	playlistId: String,
	songId: String,
	theme: {
		type: String,
		default: 'auto',
	},
	position: {
		type: String,
		default: 'static',
	},
	minimized: {
		type: Boolean,
		default: false,
	},
	lyric: {
		type: Boolean,
		default: true,
	},
})

onMounted(() => {
	if (process.client && window.NeteaseMiniPlayer) {
		window.NeteaseMiniPlayer.init()
	}
})
</script>

<template>
<div
	class="netease-mini-player my-4"
	:data-playlist-id="playlistId"
	:data-song-id="songId"
	:data-theme="theme"
	:data-position="position"
	:data-default-minimized="minimized"
	:data-lyric="lyric"
/>
</template>
