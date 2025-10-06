import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { EvsHeaderComponent } from './evs-header.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for EvsHeaderComponent (default tests)
describe('EvsHeaderComponent', () => {
  let component: EvsHeaderComponent;
  let fixture: ComponentFixture<EvsHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvsHeaderComponent],
      providers: [
        ConceptDetailService,
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
