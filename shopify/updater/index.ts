import { startPollingShopifyShops } from './polling';
import {
	registerWebhooksForAccounts,
	startShopifyWebhookListener,
} from './webhooks';

const WEBHOOK_HOST = 'http://felipe-link.ngrok.app';
const WEBHOOK_PORT = '5000';

async function main() {
	console.log('Registering webhooks for all Shopify accounts.');
	await registerWebhooksForAccounts(WEBHOOK_HOST);

	console.log('Will start webhook listener & polling jobs.');
	await Promise.all([
		startShopifyWebhookListener(WEBHOOK_PORT),
		// Look for new data every 10 seconds.
		startPollingShopifyShops(10_000),
	]);
}

main().catch((e) => {
	console.warn('Script failed with error', e);
});
