# Controllers Context

## Scope

This package owns inbound API proxy handling for requests under `api/v1/**`.

## Request Flow

`EVSController` receives matching requests and delegates to `ProxyService`. `ProxyService` builds the EVSRESTAPI URI from `WebProperties.evsApibasePath`, the servlet path, and the original query string.

## Proxy Pattern

The proxy preserves request body, HTTP method, and incoming headers while removing hop-by-hop size/transfer headers that can cause downstream gateway problems. It uses a new `RestTemplate` with a buffering request factory for each proxied request.

## Header and Body Handling

`content-length` and `transfer-encoding` are intentionally skipped when copying headers. Responses are returned with fresh `HttpHeaders` to avoid gateway errors in deployed environments.

## Error Handling

`HttpStatusCodeException` from the downstream API is converted into a response with the downstream status and body. Unexpected controller-level exceptions are logged and rethrown.

## Entry Points

- `EVSController.java`
- `ProxyService.java`
