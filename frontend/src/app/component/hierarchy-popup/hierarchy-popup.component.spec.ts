import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HierarchyPopupComponent } from './hierarchy-popup.component';

import { ConceptDetailService } from '../../service/concept-detail.service';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from '../../service/notification.service';

import { provideHttpClient } from '@angular/common/http';
import { AngularSplitModule } from 'angular-split';
import { TreeTableModule } from 'primeng/treetable';

// Testing for HierarchyPopupComponent (default tests)
describe('HierarchyPopupComponent', () => {
  let component: HierarchyPopupComponent;
  let fixture: ComponentFixture<HierarchyPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchyPopupComponent],
      providers: [
        ConceptDetailService,
        LoaderService,
        NotificationService,
        AngularSplitModule,
        TreeTableModule,
        provideHttpClient()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
