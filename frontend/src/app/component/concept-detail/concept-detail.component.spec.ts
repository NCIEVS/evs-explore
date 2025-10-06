import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConceptDetailComponent } from './concept-detail.component';

import { provideHttpClient } from '@angular/common/http';

import { ConceptDisplayComponent } from '../concept-display/concept-display.component';
import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

// Tests for ConceptDetailComponent (default tests)
describe('ConceptDetailComponent', () => {
  let component: ConceptDetailComponent;
  let fixture: ComponentFixture<ConceptDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptDetailComponent],
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
    fixture = TestBed.createComponent(ConceptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
