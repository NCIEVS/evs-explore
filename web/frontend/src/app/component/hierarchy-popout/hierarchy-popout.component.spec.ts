import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyPopoutComponent } from './hierarchy-popout.component';

describe('HierarchyPopoutComponent', () => {
  let component: HierarchyPopoutComponent;
  let fixture: ComponentFixture<HierarchyPopoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyPopoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HierarchyPopoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
