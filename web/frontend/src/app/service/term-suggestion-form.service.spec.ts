import { TestBed } from '@angular/core/testing';

import { TermSuggestionFormService } from './term-suggestion-form.service';

describe('TermSuggestionFormService', () => {
  let service: TermSuggestionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermSuggestionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
