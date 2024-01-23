<br />

<p align="center">
  <img src="https://media1.giphy.com/media/QQQoLTqkm7v3y/200.gif?cid=5a38a5a2jlhm7z1saq77j4g3odd7ba9cwq1y1okpe8ttmau8&ep=v1_gifs_search&rid=200.gif&ct=g" width="300"/>

  <h3 style="size: 20px" align="center">Manual Integrations</h1>

  <p align="center">
    Sample code for <em>manually</em> pulling data from popular third-party APIs.
  </p>

  <p align="center">
    Don't want to waste months on this? <a href="https://fiber.dev?rel=github">Check out Fiber &rarr;</a>
  </p>

  <p align="center" style="align: center;">
    <img src="https://img.shields.io/badge/TypeScript-blue" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MIT-License" alt="asdf" />
  </p>
</p>

## Directory

- [Shopify](shopify) \
  Pull _orders_, _customers_ and _products_ from Shopify stores.
- [Stripe](stripe) \
  Pull _transactions_ and _charges_ from Stripe accounts. <em color="blue">(coming soon)</em>

## Use Fiber instead

Fiber gives you a complete solution from day zero. Replace all this code with a simple call to our API:

```http
POST https://api.fiber.dev/sources/:source_name/accounts
Content-Type: application/json
Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)

{
  "credentials": CREDENTIALS
}
```

Learn more at [wiki.fiber.dev](https://wiki.fiber.dev).

## License

MIT
