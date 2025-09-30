import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { EvsFooterComponent } from './evs-footer.component';

import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for EvsFooterComponent (default tests)
describe('EvsFooterComponent', () => {
  let component: EvsFooterComponent;
  let fixture: ComponentFixture<EvsFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvsFooterComponent ],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
