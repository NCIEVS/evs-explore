import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesComponent } from './roles.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for RolesComponent (default tests)
describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RolesComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
