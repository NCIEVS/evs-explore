import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetsComponent } from './subsets.component';

// Tests for SubsetsComponent (default test)
describe('SubsetsComponent', () => {
  let component: SubsetsComponent;
  let fixture: ComponentFixture<SubsetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
