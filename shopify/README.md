# Manual Shopify Integration

Sample code for pulling `Orders`, `Products` and `Customer` rows from third-party [Shopify](https://dev.shopify.com) stores.

This is only a toy project meant to demonstrate the complexity of building a reliable integration. Read [What's missing](#whats-missing) below.

> [!NOTE]
> Don't want to sacrifice six months of an engineer's soul on this? 🧙‍♂️ [Check out Fiber &rarr;](https://fiber.dev)

## Setup

Install dependencies:

`yarn`

Migrate your database with Prisma:

`yarn prisma migrate dev`

Run unit tests:

`yarn test`

## Usage

Register a new Shopify account:

`bun run create-account.ts --myShopifyDomain EXAMPLE.myshopify.com --accessToken ACCESS_TOKEN`

Load historical data from that account:

`bun run first-pull/index.ts --myShopifyDomain EXAMPLE.myshopify.com`

Run poller and webhook listener to keep data fresh:

`yarn run updater.ts --myShopifyDomain EXAMPLE.myshopify.com`

<br />

# What's missing?

In a real project, you will have to deal with the following questions before pushing this code to production.

### Testing

- How do we unit test this code?

To run tests that talk to the Shopify API, we will need dummy Shopify stores for testing...

- How do we reliably populate test stores?

- How do we keep test stores filled with data over time?

- How do we obtain credentials for test shops? (hint: You may have to host the Shopify OAuth redirection locally using ngrok.)

- Will engineers share test stores?

  - If yes, how do we avoid transient errors like 429s? What if those break CI?

  - If no, how do we guide engineers to create new shops, Shopify apps, and then obtain credentials?

- How do we test resources only available to Shopify Plus customers? Or resources that can't be created via the API (eg. refunds)?

- How do we use webhook listeners locally? (hint: ngrok)

- How do we test webhook listeners in your CI pipeline?

### Deployment

The first data import for a mid-sized store may take several hours to complete,
while other resources like [`OrderTransaction`](https://shopify.dev/docs/api/admin-rest/2023-07/resources/transaction)
may take days to load.

- How do we deploy the "first import" service?

- How do we recover from ephemeral errors during a long-running import?

- What happens when a new order arrives during an import? Will it get imported too?

**Shopify webhooks** are the only method for keeping your data fresh in real-time. But if a webhook
fails to deliver (eg. because your server is overwhlemed), you end up losing data.

- How do we deploy and scale webhook listeners for maximum availability?

- How do we avoid data loss during downtime? How do we recover from bugs in the listener?

Listeners must respond with a 200 status within 5 seconds, otherwise the delivery is considered failed.

- How do we guarantee response within the 5 second timeout?

When a webhook delivery fails, Shopify retries it up to
[19 times in 48 hours](https://shopify.dev/docs/apps/webhooks/configuration/https#retry-frequency).
This is meant to help avoid data loss, but can easily cause a dangerous _feedback loop_
of webhook delivery, causing a DoS-like outage that is hard to recover from.

- How do we avoid a DoS outage?

- How do we isolate the rest of our infrastructure from issues with the Shopify logic?

On the other hand, Shopify delivers webhooks "at-least-once" requests are often duplicated.
This can cause?

- How do we implement idempotency at scale, to prevent updating? (hint: You may have to save the IDs of each webhook that has been processed.)

Shopify removes webhooks when delivery fails several times.

- How do we check that a webhook hasn't been removed? When do we apply that logic?

> [!WARNING]
> **Tip:** The truth is webhooks not enough. We will need to continue polling the API for the latest data from each of we customers' stores.
> This is perhaps the hardest aspect of building a reliable ETL.

### Maintenance

- If requirements change, how do we load an extra endpoint from Shopify (eg. transactions)?

  - How long for an engineer to extend and test the code?
  - How do we backfill this new data for existing customers?

- What happens if a customer uninstalls the app?

  - How do we delete all their data?
  - What if they uninstall and install again? How do we prevent bugs?

- How do we [rotate access tokens](https://shopify.dev/docs/apps/auth/oauth/rotate-revoke-client-credentials) frequently to keep we customers businesses secure?

<img src="https://media2.giphy.com/media/6AaB96ZVrUN0I/200.gif?cid=5a38a5a2cvtd186ebfqw6h0fwqzxdspmxjw63cc2tp6cqyb2&ep=v1_gifs_search&rid=200.gif&ct=g" width="300"/>


## Just use Fiber

Check us out at [Fiber](https://fiber.dev).

<img src="https://media0.giphy.com/media/3osxYamKD88c6pXdfO/giphy.gif?cid=5a38a5a2imendkpac5mx275yetn0fllilo25hvdkld20x0dp&ep=v1_gifs_search&rid=giphy.gif&ct=g" width="300" />
