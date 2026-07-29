import { environment } from '../environments/environment';

const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

export function getApiDocumentationOrigin(
  hostname = window.location.hostname,
  protocol = window.location.protocol
): string {
  if (localHosts.has(hostname)) {
    return new URL(environment.swagger).origin;
  }

  if (/^evsexplore(?:-(?:dev|qa|stage))?(?:\.|$)/.test(hostname)) {
    const apiHostname = hostname.replace(/^evsexplore/, 'api-evsrest');
    return `${protocol}//${apiHostname}`;
  }

  return new URL(environment.swagger).origin;
}

export function getSwaggerUrl(
  hostname = window.location.hostname,
  protocol = window.location.protocol
): string {
  return `${getApiDocumentationOrigin(hostname, protocol)}/swagger-ui/index.html`;
}

export function getFhirSwaggerUrl(
  version: 'r4' | 'r5',
  hostname = window.location.hostname,
  protocol = window.location.protocol
): string {
  return `${getApiDocumentationOrigin(hostname, protocol)}/fhir/${version}/swagger-ui/`;
}