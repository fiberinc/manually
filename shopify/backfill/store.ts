// In actual production we'd want an proper data store like a database. Would
// need to figure out the appropriate schema, do a migration,

import { writeFileSync } from 'fs';
import { BackfilledData, ShopifyCredential } from '../types';

export async function saveAccountData(
	acct: ShopifyCredential,
	data: BackfilledData
) {
	// for (const row of data.orders) {
	// 	await prisma.shopifyOrder.create({
	// 		data: {
	// 			...(row as any),
	// 			account_id: acct.myShopifyDomain,
	// 		},
	// 	});
	// }

	// for (const row of data.customers) {
	// 	await prisma.shopifyCustomer.create({
	// 		data: {
	// 			...(row as any),
	// 			account_id: acct.myShopifyDomain,
	// 		},
	// 	});
	// }

	// for (const row of data.products) {
	// 	await prisma.shopifyProduct.create({
	// 		data: {
	// 			...(row as any),
	// 			account_id: acct.myShopifyDomain,
	// 		},
	// 	});
	// }

	const filepath = `${__dirname}/saved/${acct.myShopifyDomain.replace(
		'.myshopify.com',
		''
	)}.json`;

	writeFileSync(filepath, JSON.stringify(data, null, 2));
	console.log('Saved to:', filepath);
}
