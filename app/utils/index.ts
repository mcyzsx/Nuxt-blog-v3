// utils/index.ts
export function genPageArr(
	current: number,
	total: number,
	expand = 2,
): number[] {
	const arr: number[] = []
	const left = Math.max(1, current - expand)
	const right = Math.min(total, current + expand)

	for (let i = left; i <= right; i++) arr.push(i)

	if (left > 1)
		arr.unshift(1, Infinity) // 左侧省略
	if (right < total)
		arr.push(Infinity, total) // 右侧省略

	return [...new Set(arr)]
}
