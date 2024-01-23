# Manual Integrations

Code for pulling data from third-party APIs manually.

## Use Fiber instead

Fiber lets you skip all the code. Make a request to our API to start syncing
data from an API immediately.

```http
POST https://api.fiber.dev/sources/:source_name/accounts
Content-Type: application/json
Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)

{
  "credentials": CREDENTIALS
}
```

## License

MIT License
