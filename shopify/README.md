# Manual Shopify Integration

Code for manually pulling data from Shopify. Supports reading from `Order`, `Product` and
`Customer` objects.

> [!CAUTION]
> This is a toy project not meant for actual use in production.

## Getting started

Install dependencies:

`yarn`

### Setup database to receive data

Migrate your database with Prisma:

`yarn prisma migrate dev`

### Enter credentials for multiple Shopify accounts

TODO

### Add an account

Add a credential to the `.env` file.

`yarn run index.ts`

### Run server to receive real-time updates

`yarn run updater.ts`

---

# Or... just use Fiber 🛜

Reading 10,000 orders from a Shopify store will take you 5-10 minutes. For
clients of any decent size, you will need not only long-running processes but a
sophisticated system for saving state when things inevitably go wrong.

## To-dos

- [x] Load first page from products, orders & customers
- [x] Load all the pages
- [x] Validate the schema of the objects we receive
