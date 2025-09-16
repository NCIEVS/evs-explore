import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubsetsComponent } from './subsets.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Tests for SubsetsComponent (default test)
describe('SubsetsComponent', () => {
  let component: SubsetsComponent;
  let fixture: ComponentFixture<SubsetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetsComponent ],
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
    fixture = TestBed.createComponent(SubsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
