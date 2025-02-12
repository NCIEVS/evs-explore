import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptHistoryComponent } from './concept-history.component';

// Tests for ConceptHistoryComponent (default tests)
describe('ConceptHistoryComponent', () => {
  let component: ConceptHistoryComponent;
  let fixture: ComponentFixture<ConceptHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptHistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
