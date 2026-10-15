import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';

import { AppComponent } from '../../app.component';
import { NotificationService } from '../../service/notification.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterLink } from '@angular/router';
import { ConfigurationService } from '../../service/configuration.service';
import { CookieService } from 'ngx-cookie-service';
import { defer } from 'rxjs';

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
        {
          provide: ConfigurationService,
          useValue: {
            getTerminologyName: () => 'ncit',
            getTerminology: () => ({ version: 'test-version' }),
            getTerminologies: () => [],
            terminologySearchListFilter: () => true,
            getMultiSearch: () => false,
            getWelcomeText: () => defer(() => Promise.resolve('Welcome to EVS Explore'))
          }
        },
        { provide: CookieService, useValue: { check: () => true } },
        AppComponent,
        NotificationService,
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create with terminology information', () => {
    expect(component).toBeTruthy();
    expect(component.getTerminologyInfo()).toBe('Version: test-version');
  });

});
