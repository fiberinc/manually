import { createAdminRestApiClient } from '@shopify/admin-api-client';
import chalk from 'chalk';
import { prisma } from './db/prisma';
import { ShopifyShopStruct } from './schemas';
import { SHOPIFY_API_VERSION, getArgvOrThrow } from './utils';

async function getShopifyShopId(
	myShopifyDomain: string,
	accessToken: string
): Promise<string> {
	const client = createAdminRestApiClient({
		storeDomain: myShopifyDomain,
		apiVersion: SHOPIFY_API_VERSION,
		accessToken: accessToken,
	});

	let res: Response;
	try {
		res = await client.get('shop.json');
	} catch (e) {
		throw Error('Shopify failed');
	}

	if (!res.ok) {
		throw Error(
			`Failed to get Shop information from Shopify. ${
				res.statusText
			} ${await res.text()}`
		);
	}

	const json: any = await res.json();

	let parsed;
	try {
		parsed = ShopifyShopStruct.parse(json.shop);
	} catch (e) {
		throw Error(`Got unexpected response from Shopify: ${json}`);
	}

	return String(parsed.id);
}

async function main() {
	const myShopifyDomain = getArgvOrThrow('myShopifyDomain');
	const accessToken = getArgvOrThrow('accessToken');

	// First, get ID of this Shopify store.
	console.log(chalk.bold(`Input args`));
	console.table({
		myShopifyDomain: myShopifyDomain,
		accessToken,
	});

	console.log();

	console.log(`Fetching shop information...`);
	let shopId;
	try {
		shopId = await getShopifyShopId(myShopifyDomain, accessToken);
	} catch (e: any) {
		throw Error(`Failed to get Shopify store info: ${e.message}`);
	}
	console.log(`ID for shop is ${chalk.green(shopId)}`);

	console.log();

	console.log('Will create Shopify account...');
	// Then, add new account to database.
	const existingAccount = await prisma.shopifyAccount.findFirst({
		where: {
			shopId,
		},
	});
	if (existingAccount) {
		console.warn(
			chalk.yellow(
				`Account already existed with myShopify domain ${shopId}. Will override.`
			)
		);
		await prisma.shopifyAccount.delete({
			where: {
				myShopifyDomain,
			},
		});
	}

	const account = await prisma.shopifyAccount.create({
		data: {
			myShopifyDomain,
			shopId,
			accessToken,
		},
	});
	console.log('Created Shopify account', account);

	console.log();

	console.log('To backfill, run:');
	console.log(
		chalk.blue(`>`),
		chalk.green(
			`npx ts-node backfill --myShopifyDomain ${account.myShopifyDomain}`
		)
	);
}

void main();
