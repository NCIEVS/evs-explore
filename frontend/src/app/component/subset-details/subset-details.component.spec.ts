import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetDetailsComponent } from './subset-details.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

import { ButtonModule } from 'primeng/button';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TreeTableModule } from 'primeng/treetable';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('SubsetDetailsComponent', () => {
  let component: SubsetDetailsComponent;
  let fixture: ComponentFixture<SubsetDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetDetailsComponent ],
      imports: [
        AutoCompleteModule,
        BrowserAnimationsModule,
        ButtonModule,
        FormsModule,
        PanelModule,
        TreeTableModule
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
    fixture = TestBed.createComponent(SubsetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
