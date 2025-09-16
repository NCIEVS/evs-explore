import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HierarchyDisplayComponent } from './hierarchy-display.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { provideHttpClient } from '@angular/common/http';

import { NotificationService } from '../../service/notification.service';

// Testing for HierarchyDisplayComponent (default tests)
describe('HierarchyDisplayComponent', () => {
  let component: HierarchyDisplayComponent;
  let fixture: ComponentFixture<HierarchyDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchyDisplayComponent],
      providers: [
        ConceptDetailService,
        LoaderService,
        NotificationService,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
