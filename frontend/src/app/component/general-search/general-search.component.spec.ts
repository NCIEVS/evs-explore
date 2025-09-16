import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralSearchComponent } from './general-search.component';

import { NotificationService } from '../../service/notification.service';
import { SearchTermService } from '../../service/search-term.service';

import { provideHttpClient } from '@angular/common/http';

describe('GeneralSearchComponent', () => {
  let component: GeneralSearchComponent;
  let fixture: ComponentFixture<GeneralSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralSearchComponent ],
      providers: [
        NotificationService,
        SearchTermService,
        provideHttpClient()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
