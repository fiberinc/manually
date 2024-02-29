# Manual Shopify Integration

This folder contains sample code for pulling `Orders`, `Products` and `Customer` rows from
third-party Shopify stores.

> [!TIP]
>
> Want to skip six months of sweat & tears?
> [Check out Fiber &rarr;](https://fiber.dev)

[Scroll down to see what this project is missing &darr;](#whats-missing)

<br />

## Setup

Install dependencies:

`yarn`

Migrate your database with Prisma:

`yarn prisma migrate dev`

Run unit tests:

`yarn test`

## Usage

Register a new Shopify account:

`npx ts-node create-account.ts --myShopifyDomain EXAMPLE.myshopify.com
--accessToken ACCESS_TOKEN`

> [!NOTE]
> Need help getting the access token for a Shopify store? Check out
> [Handshake](https://github.com/fiberinc/handshake): a Next.js boilerplate
> app that handles OAuth with 200+ APIs, including Shopify.

Load historical data from that account:

`npx ts-node first-pull/index.ts --myShopifyDomain EXAMPLE.myshopify.com`

Run webhook listener to keep data fresh:

`npx ts-node updater/index.ts`

<br />

# What's missing?

In a real project, you will have to deal with the following questions before
pushing this code to production.

### Testing

- How do we unit test this code?

- To run tests that talk to the Shopify API, we will need dummy Shopify stores
  for testing.

  - How do we reliably populate test stores?

  - How do we keep test stores fresh with data over time?

  - How do we obtain credentials for test shops? (Hint: You may have to host the
    Shopify OAuth redirection locally using ngrok. Yikes.)

- Will engineers share test stores?

  - If yes, how do we avoid transient errors like 429s? What if those break CI?

  - If no, how do we guide engineers to create new shops, Shopify apps, and then
    obtain credentials?

- How do we test resources only available to Shopify Plus customers? Or
  resources that can't be created via the API (eg. refunds)?

- How do we use webhook listeners locally? (Hint: ngrok)

- How do we test webhook listeners in your CI pipeline?

### Deployment

- The first data import for a mid-sized store may take several hours to
  complete, while other resources like
  [`OrderTransaction`](https://shopify.dev/docs/api/admin-rest/2023-07/resources/transaction)
  may take days to load. **How do we deploy the "first import" service?**

  - How do we recover from ephemeral errors during a long-running import?

  - What happens when a new order arrives during an import? Will it get imported
    too?

- **Shopify webhooks** are the only method for keeping your data fresh in
  real-time. But if a webhook fails to deliver (eg. because your server is
  overwhlemed), you end up losing data.

  - How do we deploy and scale webhook listeners for maximum availability?

  - How do we avoid data loss during downtime? How do we recover from bugs in
    the listener?

- Listeners must respond with a 200 status within 5 seconds, otherwise the
  delivery is considered failed.

  - How do we guarantee response within the 5 second timeout? (Hint: Kafka,
    PubSub)

- When a webhook delivery fails, Shopify retries it up to [19 times in 48
  hours](https://shopify.dev/docs/apps/webhooks/configuration/https#retry-frequency).
  This is meant to help avoid data loss, but can easily cause a dangerous feedback
  loop of webhook delivery, with the number of requests growing over time. This is
  a DoS-like outage that is hard to recover from.

  - How do we avoid a DoS outage?

  - How do we **isolate** the rest of our infrastructure from issues with the
    Shopify logic?

- On the other hand, Shopify delivers webhooks "at-least-once", so requests are often duplicated. This is a common source of bugs in webhooks handlers.

  - How do we implement idempotency at scale, to prevent updating? (hint: You may have to create a table of ShopifyWebhooks to store each webhook that has been received.)

- Shopify removes webhooks when delivery fails several times.

  - How do we check that a webhook hasn't been removed? When do we apply that
    logic?

> [!WARNING]
>
> **Webhooks are not enough.** You will soon need to continuously poll the API
> to read the latest data from each customer. This is the hardest part about
> building a reliable integration pipeline: figuring out how to paginate each
> endpoint to generate a lossless Change Data Capture stream.

### Maintenance

Work on third-party integrations is never truly over because APIs change and product requirements also change.

- How do we handle errors from [access tokens suddenly missing a required scope](https://shopify.dev/docs/apps/store/data-protection/protected-customer-data)?

- When data requirements change, how do we load an extra endpoint from Shopify?

  - How long for an engineer to extend and test the code?

  - How do we backfill this new data for existing customers?

- If Shopify adds a new field to a resource type, how do we import it?

- What happens if a customer uninstalls the app?

  - How do we prevent bugs from trying to load their data?

  - How do we delete all their data?

  - What if they uninstall and install again? How do we prevent bugs?

### Compliance

- How do we [rotate access
  tokens](https://shopify.dev/docs/apps/auth/oauth/rotate-revoke-client-credentials)
  frequently to keep our customers' businesses safe?

- How do we treat customers' access tokens as securely as passwords?

- How do we comply with GDPR?

<br />

# The solution

Feeling a bit like this?

<img
src="https://media2.giphy.com/media/6AaB96ZVrUN0I/200.gif?cid=5a38a5a2cvtd186ebfqw6h0fwqzxdspmxjw63cc2tp6cqyb2&ep=v1_gifs_search&rid=200.gif&ct=g"
width="300"/>

**Fiber** handles the real-time sync of data from thousands of Shopify stores into your database.

[Check us out at fiber.dev &rarr;](https://fiber.dev)

<img
src="https://media0.giphy.com/media/3osxYamKD88c6pXdfO/giphy.gif?cid=5a38a5a2imendkpac5mx275yetn0fllilo25hvdkld20x0dp&ep=v1_gifs_search&rid=giphy.gif&ct=g"
width="300" />
