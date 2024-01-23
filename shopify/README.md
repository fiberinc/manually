# Manual Shopify Integration

Code for pulling data from Shopify by interacting directly with their API.
Reads from `Order`, `Product` and `Customer` endpoints.

> [!CAUTION]
> This is a toy project. The patterns here will not scale in production.

## Setup

Install dependencies:

`yarn`

Migrate your database with Prisma:

`yarn prisma migrate dev`

## How it works

Register a new Shopify account:

`bun run create-account.ts --myShopifyDomain EXAMPLE.myshopify.com --accessToken ACCESS_TOKEN`

Backfill that account with historical data:

`bun run backfill.ts --myShopifyDomain EXAMPLE.myshopify.com`

Run poller and webhook listener to keep data fresh:

`yarn run updater.ts --myShopifyDomain EXAMPLE.myshopify.com`

# Why is a Shopify integration hard?

Reading 10,000 orders from a Shopify store will take you 5-10 minutes. For
clients of any decent size, you will need not only long-running processes but a
sophisticated system for saving state when things inevitably go wrong.

Or... just use Fiber 🛜
