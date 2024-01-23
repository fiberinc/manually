import chalk from 'chalk';
import { prisma } from '../db/prisma';
import { fmtSince, getArgvOrThrow } from '../utils';
import { startPollingShopifyShop } from './polling';

async function main() {
	const myShopifyDomain = getArgvOrThrow('myShopifyDomain');

	const account = await prisma.shopifyAccount.findFirst({
		where: {
			myShopifyDomain,
		},
	});

	if (!account) {
		console.warn(
			chalk.red(`No account for shop with domain ${myShopifyDomain}`)
		);
		process.exit(1);
	}

	console.log('Account found', account);
	console.log();

	if (!account.backfillEndedAt) {
		console.warn(
			chalk.red(`Account has not completed backfill.`),
			`Finish the backfill to guarantee the integrity of the data.`
		);
		process.exit(1);
	}

	await Promise.all([
		startShopifyWebhookListener(account),
		// Look for new data every 10 seconds.
		startPollingShopifyShop(account, 10_000),
	]);

	// const start = Date.now();
	// console.log(
	// 	chalk.blueBright.bold('Account update...'),
	// 	chalk.dim(account.myShopifyDomain)
	// );
	// await backfillAccount(account);
	// console.log(chalk.dim.bold(`Account backfill done in ${fmtSince(start)}`));

	// console.log('To keep data up-to-date, run:');
	// console.log(
	// 	chalk.green(`>`),
	// 	chalk.greenBright(
	// 		`npx ts-node updater --myShopifyDomain ${account.myShopifyDomain}`
	// 	)
	// );
}

main().catch((e) => {
	console.warn('Script failed with error', e);
});
