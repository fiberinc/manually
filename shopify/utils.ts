export const SHOPIFY_API_VERSION = '2023-04';

export function fmtSince(ts: number) {
	return `${((Date.now() - ts) / 1000).toFixed(1)}s`;
}

export function getArgvOrThrow(name: string): string {
	const argIndex = process.argv.findIndex((e) => e === `--${name}`);
	if (!argIndex) {
		throw Error(`expected command line to have ${name} value`);
	}
	if (argIndex < 0) {
		throw Error(`Expected --${name} argument.`);
	}
	if (process.argv.length < argIndex + 1) {
		throw Error(`Argument --${name} has no value.`);
	}

	return process.argv[argIndex + 1];
}
