import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifiersComponent } from './qualifiers.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for QualifiersComponent
describe('QualifiersComponent', () => {
  let component: QualifiersComponent;
  let fixture: ComponentFixture<QualifiersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QualifiersComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
