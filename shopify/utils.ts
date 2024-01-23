export function fmtSince(ts: number) {
	return `${((Date.now() - ts) / 1000).toFixed(1)}s`;
}
