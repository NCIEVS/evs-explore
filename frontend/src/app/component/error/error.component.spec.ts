import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

import { CommonDataService } from '../../service/common-data.service';

// Testing for error component (default tests)
describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      providers: [
        CommonDataService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
