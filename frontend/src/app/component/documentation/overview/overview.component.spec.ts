import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for documentation OverviewComponent (default tests)
describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
