import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptRelationshipComponent } from './concept-relationship.component';

import { provideHttpClient } from '@angular/common/http';

import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

// Tests for ConceptRelationshipComponent (default tests)
describe('ConceptRelationshipComponent', () => {
  let component: ConceptRelationshipComponent;
  let fixture: ComponentFixture<ConceptRelationshipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptRelationshipComponent],
      providers: [
        ConceptDisplayComponent,
        ConceptDetailService,
        LoaderService,
        NotificationService,
        provideHttpClient()
      ]
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
