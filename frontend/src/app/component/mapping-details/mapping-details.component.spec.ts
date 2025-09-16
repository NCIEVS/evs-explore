import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingDetailsComponent } from './mapping-details.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('MappingDetailsComponent', () => {
  let component: MappingDetailsComponent;
  let fixture: ComponentFixture<MappingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MappingDetailsComponent],
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
