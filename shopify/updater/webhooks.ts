// README this is a work in progress.

import { createAdminRestApiClient } from '@shopify/admin-api-client';
import chalk from 'chalk';
import express, { Response } from 'express';
import { prisma } from '../db/prisma';
import { ShopifyCredential } from '../types';
import { SHOPIFY_API_VERSION } from '../utils';

const PORT = '4040';

export async function registerWebhooksForAccounts(webhookHost: string) {
	const accounts = await prisma.shopifyAccount.findMany({
		where: {},
	});

	for (const account of accounts) {
		if (account.hasRegisteredWebhooks) {
			console.log(
				chalk.dim`Webhooks already registered for ${account.myShopifyDomain}`
			);
		}
		await registerWebhooksForAccount(account);
	}
}

async function registerWebhook(
	acct: ShopifyCredential,
	topic: string,
	path: string
) {
	const client = createAdminRestApiClient({
		storeDomain: acct.myShopifyDomain,
		apiVersion: SHOPIFY_API_VERSION,
		accessToken: acct.accessToken,
	});

	const res = await client.post('/webhooks.json', {
		data: {
			topic,
			href: THIS_ENDPOINT + '/' + path,
		},
	});

	if (!res.ok) {
		throw Error('Failed to register webhooks for account');
	}
}

export async function registerWebhooksForAccount(acct: ShopifyCredential) {
	await registerWebhook(acct, 'order/create', '/webhooks/orders/create');
	await registerWebhook(acct, 'order/update', '/webhooks/orders/update');
	await registerWebhook(acct, 'order/delete', '/webhooks/orders/delete');
	await registerWebhook(acct, 'customer/create', '/webhooks/customers/create');
	await registerWebhook(acct, 'customer/update', '/webhooks/customers/update');
	await registerWebhook(acct, 'customer/delete', '/webhooks/customers/delete');
	await registerWebhook(acct, 'product/create', '/webhooks/products/create');
	await registerWebhook(acct, 'product/update', '/webhooks/products/update');
	await registerWebhook(acct, 'product/delete', '/webhooks/products/delete');
}

export async function startShopifyWebhookListener(webhookHost: string) {
	const app = express();

	async function orderUpdateHandler(req: Express.Request, res: Response) {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyCustomer.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	}

	app.post('/webhooks/order/create', async (req, res) => {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyOrder.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	});

	app.post('/webhooks/order/update', orderUpdateHandler);

	app.post('/webhooks/order/delete', async (req, res) => {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyOrder.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	});

	// CUSTOMER
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//

	async function customerUpdateHandler(req: Express.Request, res: Response) {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyCustomer.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	}

	app.post('/webhooks/customer/create', async (req, res) => {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyCustomer.create({
			data: {
				account_id: self.shopifyAccountId,
				...(null as any),
			},
		});
	});

	app.post('/webhooks/customer/update', customerUpdateHandler);
	app.post('/webhooks/customer/enable', customerUpdateHandler);
	app.post('/webhooks/customer/disable', customerUpdateHandler);

	app.post('/webhooks/customer/delete', async (req, res) => {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyCustomer.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	});

	// PRODUCT
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//

	app.post('/webhooks/product/create', async (req, res) => {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		const body = JSON.parse(req.body);

		await prisma.shopifyProduct.create({
			where: {
				account_id: self.shopifyAccountId,
			},
			data: {
				id: body.id,
				// deleted_at: true,
			},
		});
	});

	async function productUpdateHandler(req: Express.Request, res: Response) {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyProduct.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	}

	app.post('/webhooks/products/cancelled', productUpdateHandler);

	app.post('/webhooks/products/create', productUpdateHandler);

	app.post('/webhooks/products/fulfilled', productUpdateHandler);

	app.post('/webhooks/products/paid', productUpdateHandler);

	app.post('/webhooks/products/partially_fulfilled', productUpdateHandler);

	app.post('/webhooks/products/update', productUpdateHandler);

	app.post('/webhooks/products/delete', async (req, res) => {
		let self;
		try {
			self = await getShopifyAccountFromRequest(req);
		} catch (e) {
			res.status(401);
			return;
		}

		await prisma.shopifyProduct.deleteMany({
			where: {
				account_id: self.shopifyAccountId,
			},
		});
	});

	await new Promise<void>((accept) => {
		app.listen(PORT, () => {
			console.log(`[server]: Server is running at http://localhost:${PORT}`);
			accept();
		});
	});

	return app;
}

async function getShopifyAccountFromRequest(
	req: Express.Request
): Promise<{ shopifyAccountId: string }> {
	const self = await prisma.account.findUnique({
		where: {
			id: '123',
		},
	});

	return { shopifyAccountId: '' };
}
