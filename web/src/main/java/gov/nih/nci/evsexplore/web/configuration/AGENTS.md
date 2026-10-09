# Configuration Context

## Scope

This package owns Spring MVC configuration for static resource delivery and browser-route fallback.

## Static Resource Handling

`StaticResourcesConfiguration` registers explicit handlers for common static file extensions and serves them from Spring Boot's default static locations with a short cache duration.

## SPA Route Forwarding

Client-side Angular routes are forwarded to `index.html` when they do not represent static files or API routes. The explicit `/concept/**` forwarding exists because concept routes may contain dots.

## Cache Behavior

Static resources are served with a 30-second max-age cache control. Keep cache changes coordinated with Angular hashed build assets and deployment expectations.

## Entry Points

- `StaticResourcesConfiguration.java`
