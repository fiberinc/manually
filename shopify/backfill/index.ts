import {
	AdminRestApiClient,
	createAdminRestApiClient,
} from '@shopify/admin-api-client';
import chalk from 'chalk';
import parseLinkHeader from 'parse-link-header';
import { SHOPIFY_API_VERSION } from '..';
import {
	BackfilledData,
	Customer,
	Order,
	Product,
	ShopifyCredential,
} from '../types';
import { fmtSince } from '../utils';
import { ShopifyOrderStruct } from '../schemas';

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

	let pageInfo = null;
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
			chalk.dim('elapsed:') + fmtSince(start)
		);
		const res = await client.get(path, {
			searchParams,
		});

		if (!res.ok) {
			console.log(await res.text());
			throw Error('Call failed');
		}

		const json = await res.json();
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
		pageInfo = parsed!.next!.page_info;
	}

	console.log(chalk.dim(`Returning ${result.length} items.`));

	return result;
}

export async function backfillAccountOrders(
	acct: ShopifyCredential
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
	for (const row in all) {
		ShopifyOrderStruct.parse(row);
	}

	return all;
}

export async function backfillAccountProducts(
	acct: ShopifyCredential
): Promise<Product[]> {
	return [];

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
	return json.products;
}

export async function backfillAccountCustomers(
	acct: ShopifyCredential
): Promise<Customer[]> {
	return [];

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
	return json.customers;
}

export async function backfillAccount(
	acct: ShopifyCredential
): Promise<BackfilledData> {
	const startTs = Date.now();
	console.log(chalk.bold.greenBright('Backfill Orders'));
	const orders = await backfillAccountOrders(acct);
	console.log(chalk.dim(`Backfill orders done (${fmtSince(startTs)})\n`));

	console.log(chalk.bold.greenBright('Backfill Customers'));
	const customers = await backfillAccountCustomers(acct);
	console.log(chalk.dim(`Backfill customers done (${fmtSince(startTs)})\n`));

	console.log(chalk.bold.greenBright('Backfill Products'));
	const products = await backfillAccountProducts(acct);
	console.log(chalk.dim(`Backfill products done (${fmtSince(startTs)})\n`));

	const result: BackfilledData = {
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
