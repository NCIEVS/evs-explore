import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetDetailsComponent } from './subset-details.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('SubsetDetailsComponent', () => {
  let component: SubsetDetailsComponent;
  let fixture: ComponentFixture<SubsetDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetDetailsComponent ],
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
