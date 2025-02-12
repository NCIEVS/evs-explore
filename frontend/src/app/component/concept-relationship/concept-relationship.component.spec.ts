import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptRelationshipComponent } from './concept-relationship.component';

// Tests for ConceptRelationshipComponent (default tests)
describe('ConceptRelationshipComponent', () => {
  let component: ConceptRelationshipComponent;
  let fixture: ComponentFixture<ConceptRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptRelationshipComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
