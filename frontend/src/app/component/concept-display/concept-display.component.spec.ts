import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptDisplayComponent } from './concept-display.component';

import { provideHttpClient } from '@angular/common/http';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

// Tests for ConceptDisplayComponent (default tests)
describe('ConceptDisplayComponent', () => {
  let component: ConceptDisplayComponent;
  let fixture: ComponentFixture<ConceptDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptDisplayComponent],
      providers: [
        ConceptDetailService,
        LoaderService,
        NotificationService,
        provideHttpClient()
      ]
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
