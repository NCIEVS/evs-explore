import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetDetailsComponent } from './subset-details.component';

describe('SubsetDetailsComponent', () => {
  let component: SubsetDetailsComponent;
  let fixture: ComponentFixture<SubsetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetDetailsComponent ]
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
