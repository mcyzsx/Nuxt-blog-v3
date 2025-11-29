<script setup lang="ts">
import type { NavItem } from '~/types/nav'

defineProps<{
	list: NavItem[]
}>()
</script>

<template>
<menu class="icon-nav-menu">
	<UtilLink
		v-for="{ text, icon, url } in list"
		:key="text"
		v-tip="text"
		:to="url"
		:aria-label="text"
		class="icon-nav-link"
	>
		<Icon :name="icon" class="iconify icon-nav-icon" />
		<span class="icon-nav-text">{{ text }}</span>
	</UtilLink>
</menu>
</template>

<style lang="scss" scoped>
/* ---------- 容器 ---------- */
.icon-nav-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

/* ---------- 链接（原 .icon-nav-item） ---------- */
.icon-nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg-card) 100%);
  border: 1px solid var(--c-border);

  &:hover {
    background: rgba(var(--c-primary-rgb), 0.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--c-primary-rgb), 0.1);
  }
  &:active {
    transform: translateY(0);
  }
}

/* ---------- 图标 ---------- */
.icon-nav-icon {
  font-size: 1.4em;
  color: var(--c-text-1);
  transition: color 0.3s ease;

  .icon-nav-link:hover & {
    color: var(--c-primary);
  }
}

/* ---------- 文字（保留结构但始终隐藏） ---------- */
.icon-nav-text {
  display: none;
}

/* ---------- 响应式：移动端 ---------- */
@media (max-width: $breakpoint-mobile) {
  .icon-nav-menu {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .icon-nav-link {
    flex-direction: column;
    gap: 0.5rem;
    min-width: 80px;
    text-align: center;
  }
}

/* ---------- 深色模式 ---------- */
.dark .icon-nav-link {
  background: var(--c-bg-2);
  border-color: var(--c-border-dark);

  &:hover {
    background: var(--c-primary-dark);
    border-color: var(--c-primary);
  }
}
</style>
