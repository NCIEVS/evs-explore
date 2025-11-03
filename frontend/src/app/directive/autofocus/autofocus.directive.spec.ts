import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutofocusDirective } from './autofocus.directive';

import { By } from '@angular/platform-browser';
import { GeneralSearchComponent } from '../../component/general-search/general-search.component';

import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from '../../service/notification.service';
import { SearchTermService } from '../../service/search-term.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';


describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<GeneralSearchComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RadioButtonModule,
        DropdownModule,
        AutoCompleteModule,
        ButtonModule,
        FormsModule
      ],
      declarations: [
        AutofocusDirective,
        GeneralSearchComponent
      ],
      providers: [
        NotificationService,
        SearchTermService,
        provideHttpClient()
      ]
    }).compileComponents()

    // fixture = TestBed.createComponent(GeneralSearchComponent);
    // fixture.detectChanges()
  })

  it('should create an instance', () => {
    // const elems = fixture.debugElement.queryAll(By.directive(AutofocusDirective))
    // const directive = new AutofocusDirective();
    // expect(elems).toBeTruthy();
  });
});
