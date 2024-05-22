import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermSuggestionFormComponent } from './term-suggestion-form.component';

describe('TermSuggestionFormComponent', () => {
  let component: TermSuggestionFormComponent;
  let fixture: ComponentFixture<TermSuggestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermSuggestionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermSuggestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
