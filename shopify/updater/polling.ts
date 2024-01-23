import { createAdminRestApiClient } from '@shopify/admin-api-client';
import { SHOPIFY_API_VERSION } from '..';
import { ShopifyCredential } from '../types';
import { Account } from '@prisma/client';

export function pollLatestUpdatesForAccount(acct: ShopifyCredential) {
	//
	const account = acct;
}

export async function getLatestOrdersFromAccount(account: Account) {
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
