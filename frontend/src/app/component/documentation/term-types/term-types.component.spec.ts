import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TermTypesComponent } from './term-types.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for TermTypesComponent (default tests)
describe('TermTypesComponent', () => {
  let component: TermTypesComponent;
  let fixture: ComponentFixture<TermTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TermTypesComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
