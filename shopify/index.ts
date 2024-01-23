import chalk from 'chalk';
import dotenv from 'dotenv';
import { backfillAccount } from './backfill';
import { saveAccountData } from './backfill/store';
import { ShopifyCredential } from './types';
import { fmtSince } from './utils';

dotenv.config({
	path: __dirname + '/../.env',
});

export const SHOPIFY_API_VERSION = '2023-04';

async function main() {
	const accounts: ShopifyCredential[] = [
		{
			accessToken: (process.env as any).STORE_PASSION_ACCESS_TOKEN,
			myShopifyDomain: (process.env as any).STORE_PASSION_DOMAIN,
		},
	];

	for (const account of accounts) {
		const start = Date.now();
		console.log(
			chalk.blueBright.bold('Account backfill...'),
			chalk.dim(account.myShopifyDomain)
		);
		const data = await backfillAccount(account);
		console.log(chalk.dim.bold(`Account backfill done in ${fmtSince(start)}`));

		await saveAccountData(account, data);
	}
}

void main();
