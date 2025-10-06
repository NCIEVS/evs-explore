import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SynonymTypesComponent } from './synonym-types.component';

import { NotificationService } from '../../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';

// Testing for SynonymTypesComponent (default tests)
describe('SynonymTypesComponent', () => {
  let component: SynonymTypesComponent;
  let fixture: ComponentFixture<SynonymTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SynonymTypesComponent],
      providers: [
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynonymTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
