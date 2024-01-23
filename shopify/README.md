# Dummy Shopify ETL

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

## Testing concerns

How do you unit test this code?

To run tests that talk to the Shopify API, you will need Shopify stores for testing...

- How do you populate stores for reliable testing?

- How do keep test stores filled with data over time?

- How do you obtain tokens for test shops? (hint: You may have to host the Shopify OAuth redirection locally using ngrok.)

Will engineers share test stores?

  - If yes, how do you avoid transient errors like 429s? What if those break CI?

  - If no, how do you guide engineers to create new shops, Shopify apps, and then obtain access tokens?

How do you test resources only available to Shopify Plus customers or which can't be created via the API?

How do you use webhook listeners locally? (hint: ngrok)

## Deployment concerns

The first data import for a mid-sized store may take several hours to complete, while certain resources like `OrderTransaction` may easily take days to load.

- How do you deploy the "first import" service to be long-running?

> [!TIP]
> It may take multiple days to import other resources like the most recent OrderTransactions for a store.

- How do you recover from ephemeral errors during a long-running import service?

- What happens when new orders/customers/etc come in while you are doing the first import? How do you load those?

Webhooks are the only method for keeping your database up-to-date _in real-time_.


- How do you scale the webhook listeners?

- How do you avoid data loss when webhooks go down momentarily?

When delivery of a webhook fails, Shopify retries it up to [19 times in 48 hours](https://shopify.dev/docs/apps/webhooks/configuration/https#retry-frequency).

- How do you avoid a spyraling DoS?

Shopify webhooks have at-least-once" delivery, so you will frequently receive duplicate requests.

- How do you implement idempotency at scale, to prevent updating? (hint: You will have to save the IDs of each webhook you've processed.)

Shopify removes webhooks when delivery fails several times.

- How do you check that a webhook hasn't been remove? When do you apply that logic?


> [!WARNING]
> **Tip:** The truth is webhooks not enough. You will need to continue polling the API for the latest data from each of your customers' stores.
> This is perhaps the hardest aspect of building a reliable ETL.

### Recovery

-
- How do you ensure availability? ()

### Maintenance

- What

- What happens when OAuth tokens expire?
  - How do you
  - How do you 



- If requirements change, how do you load an extra endpoint from Shopify (eg. transactions)?
  - How long for an engineer to extend and test the code?
  - How do you backfill for all customers?
- What if the new resource doesn't share (eg. 

- How do you 


- What if the first import takes several hours to complete?
  - What if new Shopify orders arrive for a store while importing? Will they show up?

  - What happens if the Shopify API misbehaves?
  - How do you retry without duplicating effort?



- How to scale webhook listeners?
  - How to recover from ?

You will eventually have to package and deploy this code into your cloud.

Reading 10,000 orders from a Shopify store will take you 5-10 minutes. For
clients of any decent size, you will need not only long-running processes but a
sophisticated system for saving state when things inevitably go wrong.

[Fiber](https://fiber.dev) handles all of this logic and more for you.
