import { ShopifyAccount } from '@prisma/client';
import {
	AdminRestApiClient,
	createAdminRestApiClient,
} from '@shopify/admin-api-client';
import chalk from 'chalk';
import parseLinkHeader from 'parse-link-header';
import { prisma } from '../db/prisma';
import { ShopifyOrderStruct } from '../schemas';
import { Customer, Order, Product } from '../types';
import { SHOPIFY_API_VERSION, fmtSince, getArgvOrThrow } from '../utils';

export interface HistoricalData {
	orders: Order[];
	products: Product[];
	customers: Customer[];
}

export async function getAllAtShopifyPath<T extends { id: string }>(
	client: AdminRestApiClient,
	path: string,
	bodyKey: string,
	customSearchParams: any = {}
): Promise<T[]> {
	const start = Date.now();

	let result: T[] = [];
	const alreadySeenIds = new Set<string>();

	function concatResult(newRows: T[]) {
		for (const row of newRows) {
			if (alreadySeenIds.has(row.id)) {
				console.warn(chalk.red(`Row with id ${row.id} was already loaded.`));
			}
			alreadySeenIds.add(row.id);
		}
		result = result.concat(newRows);
	}

	let pageInfo: string | null = null;
	for (let i = 0; ; i++) {
		let searchParams;
		if (pageInfo) {
			searchParams = {
				limit: 250,
				page_info: pageInfo ? pageInfo : undefined,
			};
			// When you pass pageInfo, you can't read anything else.
		} else {
			searchParams = {
				limit: 250,
				...customSearchParams,
			};
		}

		console.log(
			`Loading ${path} ${i}... ${pageInfo}`,
			chalk.dim('elapsed: ') + fmtSince(start)
		);
		const res = await client.get(path, {
			searchParams,
		});

		if (!res.ok) {
			console.log(await res.text());
			throw Error('Call failed');
		}

		const json: any = await res.json();
		const rows = json[bodyKey] as T[];

		console.log(`Loaded ${rows.length} rows (prev: ${result.length})`);

		concatResult(rows);

		// Check if we should continue paginating.
		const linkHeader = res.headers.get('link');
		if (!linkHeader) {
			console.log('No link header. Pagination is over.');
			break;
		}

		const parsed = parseLinkHeader(linkHeader);
		if (!parsed?.next) {
			console.log('No next link header. Pagination is over.');
			break;
		}

		// console.log('parsed', parsed);
		pageInfo = parsed!.next!.page_info as string;
	}

	console.log(chalk.dim(`Returning ${result.length} items.`));

	return result;
}

export async function loadHistoricalOrders(
	acct: ShopifyAccount
): Promise<Order[]> {
	const client = createAdminRestApiClient({
		storeDomain: acct.myShopifyDomain,
		apiVersion: SHOPIFY_API_VERSION,
		accessToken: acct.accessToken,
	});

	// GET
	// /admin/api/2023-04/orders.json?status=any

	const all = await getAllAtShopifyPath(client, '/orders.json', 'orders', {
		status: 'any',
	});

	// Validate the schemas.

	const result: Order[] = [];
	for (const row in all) {
		result.push(ShopifyOrderStruct.parse(row));
	}
	return result;
}

export async function loadHistoricalProducts(
	acct: ShopifyAccount
): Promise<Product[]> {
	const client = createAdminRestApiClient({
		storeDomain: acct.myShopifyDomain,
		apiVersion: SHOPIFY_API_VERSION,
		accessToken: acct.accessToken,
	});

	const a = await client.get('/products.json', {
		searchParams: {
			status: 'any',
			limit: 250,
		},
	});

	const json = await a.json();
	// console.log('a', a.status, a.headers, json);
	return (json as any).products;
}

export async function loadHistoricalCustomers(
	acct: ShopifyAccount
): Promise<Customer[]> {
	const client = createAdminRestApiClient({
		storeDomain: acct.myShopifyDomain,
		apiVersion: SHOPIFY_API_VERSION,
		accessToken: acct.accessToken,
	});

	const a = await client.get('/customers.json', {
		searchParams: {
			status: 'any',
			limit: 250,
		},
	});
	const json = await a.json();
	// console.log('a', a.status, a.headers, json);
	return (json as any).customers;
}

export async function loadAccountHistoricalData(
	account: ShopifyAccount
): Promise<HistoricalData> {
	const startTs = Date.now();
	console.log(chalk.bold.greenBright('Loading Orders'));
	const orders = await loadHistoricalOrders(account);

	for (const row of orders) {
		await prisma.shopifyOrder.create({
			data: {
				...(row as any),
				accountId: account.id,
			},
		});
	}

	console.log(chalk.dim(`Loading orders done (${fmtSince(startTs)})\n`));

	console.log(chalk.bold.greenBright('Loading Customers'));
	const customers = await loadHistoricalCustomers(account);

	for (const row of customers) {
		await prisma.shopifyCustomer.create({
			data: {
				...(row as any),
				accountId: account.id,
			},
		});
	}

	console.log(chalk.dim(`Loading customers done (${fmtSince(startTs)})\n`));

	console.log(chalk.bold.greenBright('Loading Products'));
	const products = await loadHistoricalProducts(account);

	for (const row of products) {
		await prisma.shopifyProduct.create({
			data: {
				...(row as any),
				accountId: account.id,
			},
		});
	}
	console.log(chalk.dim(`Loading products done (${fmtSince(startTs)})\n`));

	const result: HistoricalData = {
		orders,
		customers,
		products,
	};

	for (const key in result) {
		// @ts-ignore
		console.log(`- ${key}: ${result[key]?.length}`);
	}

	return result;
}

async function main() {
	const myShopifyDomain = getArgvOrThrow('myShopifyDomain');

	const account = await prisma.shopifyAccount.findFirst({
		where: {
			myShopifyDomain,
		},
	});

	if (!account) {
		throw Error(`No account for shop with domain ${myShopifyDomain}`);
	}

	console.log('Account found', account);
	console.log();

	const start = Date.now();
	console.log(
		chalk.blueBright.bold('Load starting...'),
		chalk.dim(account.myShopifyDomain)
	);
	await loadAccountHistoricalData(account);
	console.log(
		chalk.dim.bold(`Account data loaded in ${fmtSince(start)}`),
		'Will update database.'
	);

	await prisma.shopifyAccount.update({
		where: {
			id: account.id,
		},
		data: {
			firstImportEndedAt: new Date(),
		},
	});

	console.log('Next, keep data up-to-date by running:');
	console.log(
		chalk.green(`>`),
		chalk.greenBright(
			`npx ts-node updater --myShopifyDomain ${account.myShopifyDomain}`
		)
	);
}

main().catch((e) => {
	console.warn('Script failed with error', e);
});
