import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptDisplayComponent } from './concept-display.component';

describe('ConceptDisplayComponent', () => {
  let component: ConceptDisplayComponent;
  let fixture: ComponentFixture<ConceptDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
