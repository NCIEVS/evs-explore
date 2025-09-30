import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralSearchComponent } from './general-search.component';

import { NotificationService } from '../../service/notification.service';
import { SearchTermService } from '../../service/search-term.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
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
        RadioButtonModule,
        DropdownModule,
        AutoCompleteModule,
        FormsModule
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
