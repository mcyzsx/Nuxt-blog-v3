interface UsePaginationOptions {
	initialPage?: number
	perPage?: number
	bindQuery?: string
}

export default function usePagination<T>(list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
	const appConfig = useAppConfig()
	const {
		initialPage = 1,
		perPage = appConfig.pagination.perPage || 10,
		bindQuery,
	} = options || {}

	const totalPages = computed(() => Math.ceil(toValue(list).length / perPage) || initialPage)

	function transformPage(val: string) {
		const page = Number(val)
		return page >= 1 && page <= totalPages.value ? page : initialPage
	}

	// 仅从无查询参数增加 query 时 push 一次
	const mode = computed({
		get: () => bindQuery && useRoute().query[bindQuery] ? 'replace' : 'push',
		set() { },
	})

	const page = bindQuery
		? useRouteQuery(bindQuery, initialPage.toString(), { transform: transformPage, mode })
		: ref(initialPage)

	const listPaged = computed(() => {
		const start = (page.value - 1) * perPage
		return toValue(list).slice(start, start + perPage)
	})

	// 不应在此处 watch list

	return {
		totalPages,
		page,
		listPaged,
	}
}

