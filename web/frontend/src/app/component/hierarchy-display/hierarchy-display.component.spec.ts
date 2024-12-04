import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyDisplayComponent } from './hierarchy-display.component';

// Testing for HierarchyPopoutComponent (default tests)
describe('HierarchyDisplayComponent', () => {
  let component: HierarchyDisplayComponent;
  let fixture: ComponentFixture<HierarchyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchyDisplayComponent]
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
