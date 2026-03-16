import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notifications.component';

import { MessageService } from 'primeng/api';
import { NotificationService } from '../../service/notification.service';

import { ToastModule } from 'primeng/toast';

// Testing for NotificationComponent (default test)
describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationComponent ],
      imports: [
        ToastModule
      ],
      providers: [
        MessageService,
        NotificationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
