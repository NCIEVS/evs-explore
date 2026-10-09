import { getApiDocumentationOrigin, getFhirSwaggerUrl, getSwaggerUrl } from './api-documentation-url';
import { environment } from '../environments/environment';

describe('API documentation URLs', () => {
  it.each([
    ['localhost', 'http://localhost:8082/swagger-ui/index.html'],
    ['evsexplore-dev.semantics.cancer.gov', 'https://api-evsrest-dev.nci.nih.gov/swagger-ui/index.html'],
    ['evsexplore-qa.semantics.cancer.gov', 'https://api-evsrest-qa.nci.nih.gov/swagger-ui/index.html'],
    ['evsexplore-stage.semantics.cancer.gov', 'https://api-evsrest-stage.nci.nih.gov/swagger-ui/index.html'],
    ['evsexplore.semantics.cancer.gov', 'https://api-evsrest.nci.nih.gov/swagger-ui/index.html'],
  ])('maps %s to its matching API documentation endpoints', (hostname, expectedSwaggerUrl) => {
    const apiOrigin = new URL(expectedSwaggerUrl).origin;

    expect(getApiDocumentationOrigin(hostname)).toBe(apiOrigin);
    expect(getSwaggerUrl(hostname)).toBe(expectedSwaggerUrl);
    expect(getFhirSwaggerUrl('r4', hostname)).toBe(`${apiOrigin}/fhir/r4/swagger-ui/`);
    expect(getFhirSwaggerUrl('r5', hostname)).toBe(`${apiOrigin}/fhir/r5/swagger-ui/`);
  });

  it('uses the configured Swagger origin for unrecognized hosts', () => {
    expect(getApiDocumentationOrigin('evsexplore-preview2.semantics.cancer.gov'))
      .toBe(new URL(environment.swagger).origin);
  });
});