# Filters Context

## Scope

This package owns servlet filters that run before MVC controller handling.

## Request Mutation Pattern

`UiHeaderPreFilter` wraps the incoming `HttpServletRequest` in a mutable request wrapper so application code can add a synthetic header while retaining original request headers.

## License Header Injection

The filter injects `X-EVSRESTAPI-License-Key` with the configured UI license from `WebProperties`. This happens at highest precedence so the proxied request includes the license header before controller forwarding.

## Servlet Filter Ordering

The filter is annotated with `@Order(Ordered.HIGHEST_PRECEDENCE)`. Keep any additional filters explicit about ordering when they affect proxied headers or request visibility.

## Entry Points

- `UiHeaderPreFilter.java`
