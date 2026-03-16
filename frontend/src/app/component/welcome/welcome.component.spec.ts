import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';

import { AppComponent } from '../../app.component';
import { NotificationService } from '../../service/notification.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterLink } from '@angular/router';

// Testing for WelcomeComponent
describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      imports: [
        RouterLink
      ],
      providers: [
        AppComponent,
        NotificationService,
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
