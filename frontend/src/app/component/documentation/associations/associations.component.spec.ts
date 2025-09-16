import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationsComponent } from './associations.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Tests for documentation AssociationsComponent (default tests)
describe('AssociationsComponent', () => {
  let component: AssociationsComponent;
  let fixture: ComponentFixture<AssociationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssociationsComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
