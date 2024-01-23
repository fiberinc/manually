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

# What's missing?

In a real-life scenario, you will have to deal with all the following questions
before pushing this code to production.

### Local development

How do you



To run tests that talk to the Shopify API, you will need Shopify shops for testing...

- How do you receive webhooks for local development? (hint: ngrok)

- How do you populate test shops

To run tests that talk to the Shopify API, you will need Shopify shops for testing...

- How do you populate shops for reliable testing?

- How will engineers obtain tokens for test shops? (hint: They may have to host the Shopify OAuth redirection _locally_ using ngrok or alternatives.)

- Will engineers share the same shops for testing?

  - If so, how do you avoid transient errors like 429s? What if those break CI/CD?

  - If not, how do you guide engineers to create new shops and obtain new access tokens?

- How do keep test shops filled with data over time?


### Testing

- How do you unit test this code?

To run tests that talk to the Shopify API, you will need Shopify shops for testing...

- How do you populate shops for reliable testing?


### Deployment

- The first import functionality may easily take several hours.

- How do you deploy the "first import" func? What if it takes several hours to complete?

### Webhooks

- How do you implement idempotency, so that you don't try?

### Recovery

-
- How do you ensure availability? ([Shopify removes webhooks when](https://help.shopify.com/en/manual/orders/notifications/webhooks))

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

- How to test this locally?
  - How to receive webhooks for local development? (hint: ngrok)
- What if the first import takes several hours to complete?
  - What if new Shopify orders arrive for a store while importing? Will they show up?
  - How to host long-running code?
  - What happens if the Shopify API misbehaves?
  - How do you retry without duplicating effort?



- How to scale webhook listeners?
  - How to recover from ?

You will eventually have to package and deploy this code into your cloud.

Reading 10,000 orders from a Shopify store will take you 5-10 minutes. For
clients of any decent size, you will need not only long-running processes but a
sophisticated system for saving state when things inevitably go wrong.

[Fiber](https://fiber.dev) handles all of this logic and more for you.
