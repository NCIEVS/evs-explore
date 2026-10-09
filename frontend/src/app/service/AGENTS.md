# Service Context

## Scope

This directory owns Angular services, interceptors, shared data subjects, notification handling, error handling, and one shared display pipe.

## API Access Pattern

Services call relative `/api/v1/**` URLs. During Angular development those requests are proxied by `proxy.config.json` or `proxy.dev.config.json`; in packaged deployments the Java web module proxies them to EVSRESTAPI.

## Configuration State

`ConfigurationService` is the central owner of selected terminology, source filters, metadata, export sizes, term documentation flags, hierarchy popup flags, and startup configuration loading. Do not duplicate this state in other services.

## Error and Loading Flow

API services wrap failures in `EvsError` where appropriate. `GlobalErrorHandler`, `NotificationService`, `LoaderService`, and `LoadingInterceptor` coordinate app-level feedback and loading state.

## Core Services

- `configuration.service.ts`
- `concept-detail.service.ts`
- `search-term.service.ts`
- `mapset.service.ts`
- `term-suggestion-form.service.ts`
- `loading-interceptor.service.ts`
- `global-error-handler.service.ts`
- `loader.service.ts`
- `notification.service.ts`
- `common-data.service.ts`
- `display.pipe.ts`
