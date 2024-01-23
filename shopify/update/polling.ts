import { createAdminRestApiClient } from '@shopify/admin-api-client';
import { SHOPIFY_API_VERSION } from '../utils';
import { ShopifyCredential } from '../types';
import { ShopifyAccount } from '@prisma/client';

export function pollLatestUpdatesForAccount(acct: ShopifyCredential) {
	//
	const account = acct;
}

export async function getLatestOrdersFromAccount(account: ShopifyAccount) {
	const client = createAdminRestApiClient({
		storeDomain: account.myShopifyDomain,
		apiVersion: SHOPIFY_API_VERSION,
		accessToken: account.accessToken!,
	});

	const res = await client.get('/orders.json', {
		searchParams: {
			updated_min_at: new Date().toISOString(),
		},
	});

	const json = await res.json();
}

export async function startPollingShopifyShop(
	account: ShopifyAccount,
	sleepMs: number
) {
	for (;;) {
		console.log(`Will sleep ${(sleepMs / 1000).toFixed()}s`);
		await sleep(sleepMs);
	}
}

async function sleep(ms: number) {
	await new Promise((accept) => setTimeout(accept, ms));
}
