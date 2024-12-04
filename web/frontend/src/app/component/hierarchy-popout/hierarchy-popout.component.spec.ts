import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyPopoutComponent } from './hierarchy-popout.component';

// Testing for HierarchyPopoutComponent (default tests)
describe('HierarchyDisplayComponent', () => {
  let component: HierarchyPopoutComponent;
  let fixture: ComponentFixture<HierarchyPopoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchyPopoutComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyPopoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
