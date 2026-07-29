import { getApiDocumentationOrigin, getFhirSwaggerUrl, getSwaggerUrl } from './api-documentation-url';
import { environment } from '../environments/environment';

describe('API documentation URLs', () => {
  it.each([
    ['localhost', 'http:', 'http://localhost:8082/swagger-ui/index.html'],
    ['evsexplore-dev.semantics.cancer.gov', 'https:', 'https://api-evsrest-dev.semantics.cancer.gov/swagger-ui/index.html'],
    ['evsexplore-qa.semantics.cancer.gov', 'https:', 'https://api-evsrest-qa.semantics.cancer.gov/swagger-ui/index.html'],
    ['evsexplore-stage.semantics.cancer.gov', 'https:', 'https://api-evsrest-stage.semantics.cancer.gov/swagger-ui/index.html'],
    ['evsexplore.semantics.cancer.gov', 'https:', 'https://api-evsrest.semantics.cancer.gov/swagger-ui/index.html'],
  ])('maps %s to its matching API Swagger host', (hostname, protocol, expectedUrl) => {
    expect(getApiDocumentationOrigin(hostname, protocol)).toBe(new URL(expectedUrl).origin);
    expect(getSwaggerUrl(hostname, protocol)).toBe(expectedUrl);
  });

  it('uses the configured Swagger origin for unrecognized hosts', () => {
    expect(getApiDocumentationOrigin('evsexplore-preview2.semantics.cancer.gov', 'https:'))
      .toBe(new URL(environment.swagger).origin);
  });

  it('builds FHIR links from the resolved API origin', () => {
    expect(getFhirSwaggerUrl('r4')).toBe('http://localhost:8082/fhir/r4/swagger-ui/');
    expect(getFhirSwaggerUrl('r5')).toBe('http://localhost:8082/fhir/r5/swagger-ui/');
  });
});