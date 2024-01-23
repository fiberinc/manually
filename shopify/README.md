# Manual Shopify Integration

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

Test:

`yarn test`

## Usage

Register a new Shopify account:

`bun run create-account.ts --myShopifyDomain EXAMPLE.myshopify.com --accessToken ACCESS_TOKEN`

Load historical data from that account:

`bun run first-pull/index.ts --myShopifyDomain EXAMPLE.myshopify.com`

Run poller and webhook listener to keep data fresh:

`yarn run updater.ts --myShopifyDomain EXAMPLE.myshopify.com`

<br />

# What's missing

- How to test this locally?
  - How to receive webhooks for local development? (hint: ngrok)
- What if the first import takes several hours to complete?
  - What if new Shopify orders arrive for a store while importing? Will they show up?
  - How to host long-running code?
  - What happens if the Shopify API misbehaves?
  - How do you retry without duplicating effort?
- If requirements change, how do you load an extra resource from Shopify (eg. transactions)?

  - How long for an engineer to extend and test the code?
  - How do you backfill for all customers?

- How do you deploy that may take hours to complete?
- How to scale webhook listeners?
  - How to recover from ?

You will eventually have to package and deploy this code into your cloud.

Reading 10,000 orders from a Shopify store will take you 5-10 minutes. For
clients of any decent size, you will need not only long-running processes but a
sophisticated system for saving state when things inevitably go wrong.

[Fiber](https://fiber.dev) handles all of this logic and more for you.
