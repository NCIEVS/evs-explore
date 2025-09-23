import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';

import { NotificationService } from '../../../service/notification.service';

import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterModule } from '@angular/router';

// Testing for documentation OverviewComponent (default tests)
describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent],
      imports: [
        ButtonModule,
        RouterModule,
        FormsModule
      ],
      providers: [
        NotificationService,
        provideHttpClient(),
        provideRouter([])
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
