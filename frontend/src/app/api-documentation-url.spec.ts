import { getApiDocumentationOrigin, getFhirSwaggerUrl, getSwaggerUrl } from './api-documentation-url';
import { environment } from '../environments/environment';

describe('API documentation URLs', () => {
  it.each([
    ['localhost', 'http:', 'http://localhost:8082/swagger-ui/index.html'],
    ['evsexplore-dev.semantics.cancer.gov', 'https:', 'https://api-evsrest-dev.semantics.cancer.gov/swagger-ui/index.html'],
    ['evsexplore-qa.semantics.cancer.gov', 'https:', 'https://api-evsrest-qa.semantics.cancer.gov/swagger-ui/index.html'],
    ['evsexplore-stage.semantics.cancer.gov', 'https:', 'https://api-evsrest-stage.semantics.cancer.gov/swagger-ui/index.html'],
    ['evsexplore.semantics.cancer.gov', 'https:', 'https://api-evsrest.semantics.cancer.gov/swagger-ui/index.html'],
  ])('maps %s to its matching API documentation endpoints', (hostname, protocol, expectedSwaggerUrl) => {
    const apiOrigin = new URL(expectedSwaggerUrl).origin;

    expect(getApiDocumentationOrigin(hostname, protocol)).toBe(apiOrigin);
    expect(getSwaggerUrl(hostname, protocol)).toBe(expectedSwaggerUrl);
    expect(getFhirSwaggerUrl('r4', hostname, protocol)).toBe(`${apiOrigin}/fhir/r4/swagger-ui/`);
    expect(getFhirSwaggerUrl('r5', hostname, protocol)).toBe(`${apiOrigin}/fhir/r5/swagger-ui/`);
  });

  it('uses the configured Swagger origin for unrecognized hosts', () => {
    expect(getApiDocumentationOrigin('evsexplore-preview2.semantics.cancer.gov', 'https:'))
      .toBe(new URL(environment.swagger).origin);
  });
});