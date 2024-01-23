# Building a Shopify integration _manually_ 🥶

Code for pulling data from [Shopify](https://dev.shopify.com) by interacting directly with their API.

Reads data from `Order`, `Product` and `Customer` endpoints for the accounts you register.

> [!CAUTION]
> This is a toy project. The patterns here will not scale in production. Look
> for `TODO` and `FIXME` tags that explain the missing gaps in this solution.
> They're substantial.

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

# What's missing? 👨🏻‍🚒

In a real project, you will have to deal with the following questions before pushing this code to production.

### Testing concerns

- How do you unit test this code?

To run tests that talk to the Shopify API, you will need Shopify stores for testing...

- How do you populate stores for reliable testing?

- How do keep test stores filled with data over time?

- How do you obtain credentials for test shops? (hint: You may have to host the Shopify OAuth redirection locally using ngrok.)

- Will engineers share test stores?

  - If yes, how do you avoid transient errors like 429s? What if those break CI?

  - If no, how do you guide engineers to create new shops, Shopify apps, and then obtain credentials?

- How do you test resources only available to Shopify Plus customers? Or resources that can't be created via the API (eg. refunds)?

- How do you use webhook listeners locally? (hint: ngrok)

- How do you test webhook listeners in your CI pipeline?

### Deployment concerns

The first data import for a mid-sized store may take several hours to complete,
while other resources like [`OrderTransaction`](https://shopify.dev/docs/api/admin-rest/2023-07/resources/transaction)
may take days to load.

- How do you deploy the "first import" service?

- How do you recover from ephemeral errors during a long-running import?

- What happens when a new order arrives during an import? Will it get imported too?

**Shopify webhooks** are the only method for keeping your data fresh in real-time. But if a webhook
fails to deliver (eg. because your server is overwhlemed), you end up losing data.

- How do you deploy and scale webhook listeners for maximum availability?

- How do you avoid data loss during downtime? How do you recover from bugs in the listener?

Listeners must respond with a 200 status within 5 seconds, otherwise the delivery is considered failed.

- How do guarantee response within the 5 second timeout?

When a webhook delivery fails, Shopify retries it up to
[19 times in 48 hours](https://shopify.dev/docs/apps/webhooks/configuration/https#retry-frequency).
This is meant to help avoid data loss, but can easily cause a dangerous _feedback loop_
of webhook delivery, causing a DoS-like outage that is hard to recover from.

- How do you avoid a DoS outage?

- How do you isolate the rest of your infrastructure from issues with your Shopify integration?

On the other hand, Shopify delivers webhooks "at-least-once" requests are often duplicated.
This can cause?

- How do you implement idempotency at scale, to prevent updating? (hint: You will have to save the IDs of each webhook you've processed.)

Shopify removes webhooks when delivery fails several times.

- How do you check that a webhook hasn't been removed? When do you apply that logic?

> [!WARNING]
> **Tip:** The truth is webhooks not enough. You will need to continue polling the API for the latest data from each of your customers' stores.
> This is perhaps the hardest aspect of building a reliable ETL.

### Maintenance

- If requirements change, how do you load an extra endpoint from Shopify (eg. transactions)?
  - How long for an engineer to extend and test the code?
  - How do you backfill this new data for existing customers?

- What happens if a customer uninstalls your app?
  - How do you delete all their data?
  - What if they uninstall and install again? How do you prevent bugs?

- How do you [rotate access tokens](https://shopify.dev/docs/apps/auth/oauth/rotate-revoke-client-credentials) frequently to keep your customers businesses secure?

<br />

## Just use Fiber

Check us out at [Fiber](https://fiber.dev).
