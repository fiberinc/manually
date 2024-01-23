import {
	registerWebhooksForAccounts,
	startShopifyWebhookListener,
} from './webhooks';

const WEBHOOK_HOST = 'http://felipe-link.ngrok.app';
const WEBHOOK_PORT = '5000';

async function main() {
	console.log('Registering webhooks for all Shopify accounts.');
	await registerWebhooksForAccounts(WEBHOOK_HOST);

	console.log('Will start webhook listener.');
	await Promise.all([
		startShopifyWebhookListener(WEBHOOK_PORT),
		// TODO In reality, you will need to implement this as a precaution against
		// missed webhooks. See the README.md to read about complexities of polling.
		//
		// startPollingShopifyShops(10_000),
	]);
}

main().catch((e) => {
	console.warn('Script failed with error', e);
});
