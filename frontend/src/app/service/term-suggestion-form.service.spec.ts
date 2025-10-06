import { TestBed } from '@angular/core/testing';
import { TermSuggestionFormService } from './term-suggestion-form.service';
import { provideHttpClient } from '@angular/common/http';

describe('TermSuggestionFormService', () => {
  let service: TermSuggestionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });
    service = TestBed.inject(TermSuggestionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
