import { environment } from '../environments/environment';

const apiDocumentationOrigins: Record<string, string> = {
  'evsexplore.semantics.cancer.gov': 'https://api-evsrest.nci.nih.gov',
  'evsexplore-dev.semantics.cancer.gov': 'https://api-evsrest-dev.nci.nih.gov',
  'evsexplore-qa.semantics.cancer.gov': 'https://api-evsrest-qa.nci.nih.gov',
  'evsexplore-stage.semantics.cancer.gov': 'https://api-evsrest-stage.nci.nih.gov',
};

export function getApiDocumentationOrigin(hostname = window.location.hostname): string {
  return apiDocumentationOrigins[hostname] ?? new URL(environment.swagger).origin;
}

export function getSwaggerUrl(hostname = window.location.hostname): string {
  return `${getApiDocumentationOrigin(hostname)}/swagger-ui/index.html`;
}

export function getFhirSwaggerUrl(version: 'r4' | 'r5', hostname = window.location.hostname): string {
  return `${getApiDocumentationOrigin(hostname)}/fhir/${version}/swagger-ui/`;
}