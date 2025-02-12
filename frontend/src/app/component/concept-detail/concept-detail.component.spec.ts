import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConceptDetailComponent } from './concept-detail.component';

// Tests for ConceptDetailComponent (default tests)
describe('ConceptDetailComponent', () => {
  let component: ConceptDetailComponent;
  let fixture: ComponentFixture<ConceptDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
