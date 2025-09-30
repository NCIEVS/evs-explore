import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptHistoryComponent } from './concept-history.component';

import { provideHttpClient } from '@angular/common/http';

import { ConceptDetailComponent } from '../concept-detail/concept-detail.component';
import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

// Tests for ConceptHistoryComponent (default tests)
describe('ConceptHistoryComponent', () => {
  let component: ConceptHistoryComponent;
  let fixture: ComponentFixture<ConceptHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptHistoryComponent],
      providers: [
        ConceptDetailComponent,
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
    fixture = TestBed.createComponent(ConceptHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
