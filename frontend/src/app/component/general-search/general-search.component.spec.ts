import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralSearchComponent } from './general-search.component';

import { NotificationService } from '../../service/notification.service';
import { SearchTermService } from '../../service/search-term.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('GeneralSearchComponent', () => {
  let component: GeneralSearchComponent;
  let fixture: ComponentFixture<GeneralSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralSearchComponent ],
      imports: [
        AutoCompleteModule,
        FormsModule,
        RadioButtonModule,
        SelectModule
      ],
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
