import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingDetailsComponent } from './mapping-details.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterModule } from '@angular/router';

describe('MappingDetailsComponent', () => {
  let component: MappingDetailsComponent;
  let fixture: ComponentFixture<MappingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MappingDetailsComponent],
      imports: [
        AutoCompleteModule,
        BrowserAnimationsModule,
        ButtonModule,
        FormsModule,
        PanelModule,
        RouterModule,
      ],
      providers: [
        ConceptDetailService,
        LoaderService,
        NotificationService,
        provideHttpClient(),
        provideRouter([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
